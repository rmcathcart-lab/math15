/* Math 15 · Unit 2 · Lesson 8 — Scientific Notation.
 * Warm-up (Tiny to Titanic: six pictures, six shuffled size cards, a powers-of-ten ruler they line up on) and the explainers:
 *   places     (place values are powers of ten: a digit slides left ×10, right ×10⁻¹ — the notes' 0.0004 and the hair 0.00007),
 *   isSci      (is it scientific notation? the coefficient must land in 1 ≤ a < 10 on a number line; fix 52 × 10³ and 0.5 × 10⁻²),
 *   toSci      (hop the decimal point: big numbers → positive exponent — notes 47 000, Example 1 checks; from 10C 2.3),
 *   toSciSmall (the same for numbers less than 1 → negative exponent — notes 0.0004, Example 2 checks),
 *   toStd      (back to standard notation, zeros as placeholders — notes 3.4 × 10⁻⁵, Example 3 checks),
 *   real       (Example 4, both directions),
 *   ladder     (powers of ten as shelves: the exponent picks the shelf, the coefficient the spot on it — Example 5).
 * Plus a Math History box (Archimedes' Sand Reckoner: a 1 and 63 zeros squeezed into 10⁶³).
 * Colours: coefficient amber, power of ten teal; hops right blue, hops left amber. */
import { h, tex, add, svgEl, mountExplainers } from '../blocks.js';
import { standup } from '../standup.js';

const at = (el, x, y) => { el.style.left = x + 'px'; el.style.top = y + 'px'; return el; };
const hide = (...els) => els.forEach((e) => { if (e) e.style.opacity = 0; });
const T = (s) => tex(s);
const K = (src, display) => {
  try { return window.katex.renderToString(String(src), { displayMode: !!display, throwOnError: false, strict: 'ignore', trust: true, output: 'html' }); }
  catch (e) { return tex(src, display); }
};
const NB = ' '; // narrow no-break space between groups of three, like the booklet

/* ---------- decimals as strings, so nothing is lost to floating point. A number is { sig, e }: value = sig[0].sig[1…] × 10^e ---------- */
function snParse(str) {
  const [ip, fp = ''] = String(str).split('.'), all = ip + fp;
  let f = 0; while (f < all.length - 1 && all[f] === '0') f++;
  return { sig: all.slice(f).replace(/0+$/, '') || '0', e: ip.length - 1 - f };
}
const snCoef = (sig) => sig[0] + (sig.length > 1 ? '.' + sig.slice(1) : '');
const snGroup = (ip, sep) => (ip.length < 4 ? ip : ip.replace(/\B(?=(\d{3})+(?!\d))/g, sep));
function snStd(sig, e, sep = NB) {
  let ip, fp;
  if (e >= 0) { ip = sig.slice(0, e + 1).padEnd(e + 1, '0'); fp = sig.slice(e + 1); } else { ip = '0'; fp = '0'.repeat(-e - 1) + sig; }
  ip = snGroup(ip, sep); return fp ? ip + '.' + fp : ip;
}
const snStdT = (sig, e) => snStd(sig, e, '\\,');
const snSci = (c, n) => `\\htmlClass{u2l8-co}{${c}}\\times\\htmlClass{u2l8-pw}{10^{${n}}}`;
const snSciP = (c, n) => `${c}\\times10^{${n}}`;
const snPlural = (k, w) => k + ' ' + w + (k === 1 ? '' : 's');
const mn = (e) => String(e).replace('-', '−');

/* =====================================================================
 * Warm-up: Tiny to Titanic
 * ===================================================================== */
const DRAW = {
  earth: '<circle cx="40" cy="36" r="27" fill="#3f8fd8"/><path d="M24 22c8-8 18-2 14 6s-12 4-12 12c-6-2-9-12-2-18zM46 44c7-2 12 2 9 8s-10 4-10-1z" fill="#3e8f4a"/><circle cx="40" cy="36" r="27" fill="none" stroke="#1c2230" stroke-width="2"/>',
  hair: '<path d="M10 58C24 6 40 66 52 30 58 14 66 16 72 18" fill="none" stroke="#2b2b2b" stroke-width="3.2" stroke-linecap="round"/>',
  person: '<circle cx="40" cy="15" r="7" fill="#ffecb3" stroke="#1c2230" stroke-width="2.2"/><path d="M40 22v22M40 44l-9 18M40 44l9 18M40 29l-12 11M40 29l12 11" stroke="#1c2230" stroke-width="3" stroke-linecap="round" fill="none"/>',
  cell: '<ellipse cx="40" cy="36" rx="28" ry="22" fill="#d9534a"/><ellipse cx="41" cy="35" rx="13" ry="9" fill="#ec938b"/><ellipse cx="40" cy="36" rx="28" ry="22" fill="none" stroke="#8a2a24" stroke-width="1.6"/>',
  mountain: '<path d="M6 64L40 10l34 54z" fill="#8b93a6"/><path d="M44 64l16-28 16 28z" fill="#a9b0bf"/><path d="M31 24L40 10l9 14-5-2-4 4-4-4z" fill="#fff" stroke="#8b93a6"/><path d="M6 64L40 10l34 54" fill="none" stroke="#1c2230" stroke-width="2"/>',
  sand: '<path d="M20 42l7-18 17-6 15 10-2 16-14 8-17-2z" fill="#e8c36a" stroke="#a5781a" stroke-width="2"/><circle cx="34" cy="32" r="2" fill="#c9962e"/><circle cx="46" cy="42" r="1.6" fill="#c9962e"/>'
};
const PICS = [
  { L: 'A', name: 'Earth', d: 'earth', card: 3 }, { L: 'B', name: 'a hair', d: 'hair', card: 6 }, { L: 'C', name: 'a person', d: 'person', card: 4 },
  { L: 'D', name: 'a blood cell', d: 'cell', card: 2 }, { L: 'E', name: 'Mt. Everest', d: 'mountain', card: 1 }, { L: 'F', name: 'sand grain', d: 'sand', card: 5 }
];
const CARDS = { 1: ['8.8', 3], 2: ['7', -6], 3: ['1.27', 7], 4: ['1.7', 0], 5: ['5', -4], 6: ['7', -5] };
function mountTiny() {
  const pics = document.getElementById('u2l8-pics'), cardsEl = document.getElementById('u2l8-cards'), ruler = document.getElementById('u2l8-ruler');
  if (!pics) return;
  const cards = {};
  for (let i = 1; i <= 6; i++) {
    const [c, e] = CARDS[i];
    const el = h('div', 'u2l8-card', `<span class="u2l8-cn">${i}</span>${K(snSciP(c, e))}<span class="u2l8-cl"></span>`);
    cardsEl.appendChild(el); cards[i] = el;
  }
  // the ruler: exponents −7 … 8, each step one factor of 10
  const W = ruler.clientWidth || 470, H = 100, lo = -7, hi = 8, X = (v) => 14 + (v - lo) * (W - 28) / (hi - lo);
  const svg = svgEl('svg', { width: W, height: H, class: 'u2l8-rsvg' }); ruler.appendChild(svg);
  svg.appendChild(svgEl('line', { x1: X(lo), x2: X(hi), y1: 56, y2: 56, class: 'u2l8-rax' }));
  for (let n = lo; n <= hi; n++) {
    svg.appendChild(svgEl('line', { x1: X(n), x2: X(n), y1: 50, y2: 62, class: 'u2l8-rtk' + (n === 0 ? ' z' : '') }));
    const t = svgEl('text', { x: X(n), y: 79, 'text-anchor': 'middle', class: 'u2l8-rtl' + (n === 0 ? ' z' : '') }); t.textContent = mn(n); svg.appendChild(t);
  }
  const lab = svgEl('text', { x: W / 2, y: 97, 'text-anchor': 'middle', class: 'u2l8-rcap' }); lab.textContent = 'exponent of 10 (metres)'; svg.appendChild(lab);
  const marks = {};
  PICS.forEach((p) => {
    const [c, e] = CARDS[p.card], x = X(e + Math.log10(Number(c)));
    const g = svgEl('g', { class: 'u2l8-rmk' });
    g.appendChild(svgEl('line', { x1: x, x2: x, y1: 40, y2: 56, class: 'u2l8-rmkl' }));
    g.appendChild(svgEl('circle', { cx: x, cy: 30, r: 11, class: 'u2l8-rmkc' }));
    const t = svgEl('text', { x, y: 35, 'text-anchor': 'middle', class: 'u2l8-rmkt' }); t.textContent = p.L; g.appendChild(t);
    svg.appendChild(g); marks[p.L] = g;
  });
  const btns = PICS.map((p) => {
    const b = h('button', 'u2l8-pic', `<span class="u2l8-pl">${p.L}</span><svg viewBox="0 0 80 72" aria-hidden="true">${DRAW[p.d]}</svg><span class="u2l8-pn">${p.name}</span><span class="u2l8-pc">card ${p.card}</span>`);
    b.type = 'button'; b.setAttribute('aria-label', p.name + ': show its size card');
    b.addEventListener('click', () => { b.classList.toggle('open'); sync(); });
    pics.appendChild(b); return b;
  });
  function sync() {
    PICS.forEach((p, i) => {
      const on = btns[i].classList.contains('open');
      cards[p.card].classList.toggle('hit', on); cards[p.card].querySelector('.u2l8-cl').textContent = on ? p.L : '';
      marks[p.L].classList.toggle('on', on);
    });
  }
  document.getElementById('u2l8-line').addEventListener('click', () => { btns.forEach((b) => b.classList.add('open')); sync(); });
  document.getElementById('u2l8-wclear').addEventListener('click', () => { btns.forEach((b) => b.classList.remove('open')); sync(); });
}

/* =====================================================================
 * 1. Place values are powers of ten
 * ===================================================================== */
const PL = {
  L: { d: '4', hops: 4, dir: 1, lbl: '4\\ \\text{moves left}' },
  R: { d: '4', hops: 4, dir: -1, lbl: '4\\ \\text{moves right}' },
  H: { d: '7', hops: 5, dir: -1, lbl: '\\text{a hair: }0.00007' }
};
const places = {
  title: 'Every place is a power of ten',
  height: 400,
  choices: ['L', 'R', 'H'].map((k) => ({ v: k, label: T(PL[k].lbl) })),
  intro: (k) => (k === 'H' ? `Where does the 7 in ${T('0.00007')} sit? Slide it there one place at a time.` : `Slide the digit ${PL[k].d} one place at a time, to the <b>${PL[k].dir > 0 ? 'left' : 'right'}</b>. Watch its value.`),
  make(stage, k, ex) {
    const it = PL[k], W = ex.W, cols = 11, cw = (W - 40) / cols, x0 = 20, colX = (p) => x0 + (5 - p) * cw; // column for 10^p, p = 5 … −5
    for (let p = 5; p >= -5; p--) {
      const hd = add(stage, h('div', 'u2l8-pv-h' + (p === 0 ? ' one' : p < 0 ? ' neg' : ''), `${K(`10^{${p}}`)}<small>${p >= 0 ? snGroup('1' + '0'.repeat(p), NB) : '0.' + '0'.repeat(-p - 1) + '1'}</small>`), colX(p), 14);
      hd.style.width = (cw - 4) + 'px';
    }
    const rowY = 116, ch = 86;
    const cells = {};
    for (let p = 5; p >= -5; p--) { const c = add(stage, h('div', 'u2l8-pv-c'), colX(p), rowY); c.style.width = (cw - 4) + 'px'; c.style.height = ch + 'px'; cells[p] = c; }
    const pt = add(stage, h('div', 'u2l8-pv-pt c'), colX(-1) - 2, rowY + ch - 16);
    const ptl = add(stage, h('div', 'u2l8-pv-ptl c', 'decimal point'), colX(-1) - 2, rowY + ch + 18);
    void pt; void ptl;
    const dig = add(stage, h('div', 'u2l8-pv-d c', it.d), colX(0) + (cw - 4) / 2, rowY + ch / 2);
    const zeros = {};
    for (let p = 5; p >= -5; p--) { const z = add(stage, h('div', 'u2l8-pv-z c', '0'), colX(p) + (cw - 4) / 2, rowY + ch / 2); hide(z); zeros[p] = z; }
    const read = add(stage, h('div', 'u2l8-pv-read'), 30, 268), sci = add(stage, h('div', 'u2l8-pv-sci'), W / 2 + 20, 268);
    const hopTag = add(stage, h('div', 'u2l8-pv-tag c'), 0, rowY - 16); hide(hopTag);
    const val = (p) => (p >= 0 ? snStd(it.d, p) : snStd(it.d, p));
    const setRead = (p) => { read.innerHTML = `<span class="u2l8-pv-rl">value</span>${K(snStdT(it.d, p))}`; sci.innerHTML = `<span class="u2l8-pv-rl">as a power of ten</span>${K(`=${snSci(it.d, p)}`)}`; };
    setRead(0);
    const showZeros = (p) => { // placeholders between the digit and the decimal point (and the 0 in front of the point)
      for (let q = 5; q >= -5; q--) {
        const on = p > 0 ? q < p && q >= 0 : p < 0 ? q > p && q <= 0 : false;
        zeros[q].style.opacity = on ? 1 : 0;
      }
    };
    const steps = [{
      cap: `The ${it.d} sits in the <b>ones</b> place, ${T('10^0=1')}. Its value is ${T(`${it.d}=${it.d}\\times10^{0}`)}.`,
      run: (c) => c.pop(dig, 380)
    }];
    for (let i = 1; i <= it.hops; i++) {
      const p = it.dir * i;
      steps.push({
        cap: it.dir > 0 ? `One place <b>left</b> multiplies by 10: ${T(`${snStdT(it.d, p)}=${snSciP(it.d, p)}`)}.` + (i === 1 ? ' A <b>zero</b> fills the empty ones place.' : '')
          : `One place <b>right</b> multiplies by ${T('10^{-1}')} (divides by 10): ${T(`${snStdT(it.d, p)}=${snSciP(it.d, p)}`)}.` + (i === 1 ? ' A <b>0</b> holds the ones place.' : ''),
        run: async (c) => {
          const x = colX(p) + (cw - 4) / 2; at(hopTag, (colX(p - it.dir) + colX(p)) / 2 + (cw - 4) / 2, rowY - 16); hopTag.textContent = it.dir > 0 ? '× 10' : '× 10⁻¹';
          hopTag.classList.toggle('left', it.dir > 0);
          await Promise.all([c.anim(dig, [{ left: dig.style.left, top: rowY + ch / 2 + 'px' }, { left: (parseFloat(dig.style.left) + x) / 2 + 'px', top: rowY + ch / 2 - 40 + 'px' }, { left: x + 'px', top: rowY + ch / 2 + 'px' }], 520, { easing: 'ease-in-out' }), c.fadeIn(hopTag, 250)]);
          at(dig, x, rowY + ch / 2); showZeros(p); setRead(p);
          await Promise.all([c.fadeIn(read, 300), c.fadeIn(sci, 300)]);
        }
      });
    }
    const pE = it.dir * it.hops;
    steps.push({
      cap: (it.dir > 0 ? `${snPlural(it.hops, 'place')} left means ${T('\\times10')} ${it.hops} times, which is ${T(`\\times10^{${pE}}`)}.` : `${snPlural(it.hops, 'place')} right means ${T('\\times10^{-1}')} ${it.hops} times, which is ${T(`\\times10^{${pE}}`)}: a <b>negative</b> exponent for a number less than 1.`)
        + ` So <b>${val(pE)}</b> ${T(`=${snSciP(it.d, pE)}`)}. The exponent counts the places.`,
      run: (c) => { sci.classList.add('done'); return c.anim(sci, [{ transform: 'scale(1)' }, { transform: 'scale(1.08)' }, { transform: 'scale(1)' }], 420); }
    });
    return steps;
  }
};

/* =====================================================================
 * 2. Is it in scientific notation?
 * ===================================================================== */
const ISS = {
  a: { c: '4.2', n: 5 }, b: { c: '9', n: 0 },
  c: { c: '52', n: 3, fix: { c: '5.2', k: 1 } }, d: { c: '0.5', n: -2, fix: { c: '5', k: -1 } }
};
const isSci = {
  title: 'Is it in scientific notation?',
  height: 400,
  choices: ['a', 'b', 'c', 'd'].map((k) => ({ v: k, label: T(snSciP(ISS[k].c, ISS[k].n)) })),
  intro: (k) => `Is ${T(snSciP(ISS[k].c, ISS[k].n))} written in scientific notation? Check the <b>coefficient</b>: it must be at least 1 and less than 10.`,
  make(stage, k, ex) {
    const it = ISS[k], W = ex.W, cv = Number(it.c), ok = cv >= 1 && cv < 10;
    add(stage, h('div', 'u2l8-is-big', K(snSci(it.c, it.n))), 24, 12);
    const NL = { x0: 50, x1: W - 70, y: 176, lo: 0, hi: 12 }, X = (v) => NL.x0 + (v - NL.lo) * (NL.x1 - NL.x0) / (NL.hi - NL.lo);
    const svg = add(stage, svgEl('svg', { width: W, height: 260, class: 'u2l8-is-svg' }), 0, 0);
    svg.appendChild(svgEl('rect', { x: X(1), y: NL.y - 22, width: X(10) - X(1), height: 44, rx: 8, class: 'u2l8-is-zone' }));
    svg.appendChild(svgEl('line', { x1: NL.x0 - 10, x2: NL.x1 + 30, y1: NL.y, y2: NL.y, class: 'u2l8-is-ax' }));
    svg.appendChild(svgEl('path', { d: `M${NL.x1 + 30} ${NL.y} l-10 -6 v12 z`, class: 'u2l8-is-ah' }));
    for (let v = 0; v <= 12; v++) {
      svg.appendChild(svgEl('line', { x1: X(v), x2: X(v), y1: NL.y - 7, y2: NL.y + 7, class: 'u2l8-is-tk' }));
      const t = svgEl('text', { x: X(v), y: NL.y + 32, 'text-anchor': 'middle', class: 'u2l8-is-tl' + (v === 1 || v === 10 ? ' b' : '') }); t.textContent = v; svg.appendChild(t);
    }
    svg.appendChild(svgEl('circle', { cx: X(1), cy: NL.y, r: 7, class: 'u2l8-is-end closed' }));
    svg.appendChild(svgEl('circle', { cx: X(10), cy: NL.y, r: 7, class: 'u2l8-is-end open' }));
    const zl = add(stage, h('div', 'u2l8-is-zl c', `allowed: ${K('1\\le a\\lt10')}`), (X(1) + X(10)) / 2, NL.y - 46);
    const px = cv > 12 ? W - 26 : X(cv);
    const dot = add(stage, h('div', 'u2l8-is-dot c' + (ok ? ' ok' : ' no')), px, NL.y); hide(dot);
    const dl = add(stage, h('div', 'u2l8-is-dl c' + (ok ? ' ok' : ' no'), cv > 12 ? `${K(it.c)} is way out here →` : `${K('a=' + it.c)}`), cv > 12 ? px - 90 : px, NL.y + 64); hide(dl);
    const st = add(stage, h('div', 'u2l8-stamp ' + (ok ? 'ok' : 'no'), ok ? '✓' : '✗'), W - 80, 18); hide(st);
    const fx1 = add(stage, h('div', 'u2l8-is-fix'), 24, 278), fx2 = add(stage, h('div', 'u2l8-is-fix'), 24, 336); hide(fx1, fx2);
    const st2 = add(stage, h('div', 'u2l8-stamp ok', '✓'), 400, 330); hide(st2);
    const stampIn = (c, el) => c.anim(el, [{ opacity: 0, transform: 'scale(1.9) rotate(-14deg)' }, { opacity: 1, transform: 'scale(1) rotate(-6deg)' }], 420, { easing: 'cubic-bezier(.2,1.4,.4,1)' });
    void zl;
    const steps = [{
      cap: `The coefficient is ${T('a=' + it.c)}. Where does it land on the number line?`,
      run: (c) => Promise.all([c.pop(dot, 380), c.fadeIn(dl, 350, { delay: 200 })])
    }];
    if (ok) {
      steps.push({
        cap: `${T(`1\\le${it.c}\\lt10`)}: exactly one nonzero digit before the point, and the exponent ${mn(it.n)} is an integer. <b>Yes</b>, this is scientific notation.` + (it.n === 0 ? ` (${T('10^0=1')}, so it is just the number ${it.c}.)` : ''),
        run: (c) => stampIn(c, st)
      });
      return steps;
    }
    const f = it.fix, big = cv >= 10, nn = it.n + f.k;
    steps.push({
      cap: big ? `${T(`${it.c}\\ge10`)}: <b>two digits</b> before the point. <b>Not</b> scientific notation.` : `${T(`${it.c}\\lt1`)}: no nonzero digit before the point. <b>Not</b> scientific notation.`,
      run: (c) => stampIn(c, st)
    });
    steps.push({
      cap: `Fix the coefficient first: hop its point ${big ? 'one place <b>left</b>' : 'one place <b>right</b>'}. ${T(`${it.c}=${snSciP(f.c, f.k)}`)}.`,
      run: (c) => { fx1.innerHTML = K(`${snSci(it.c, it.n)}=${snSci(f.c, f.k)}\\times10^{${it.n}}`); return c.fadeIn(fx1, 400); }
    });
    steps.push({
      cap: `Product law: add the exponents, ${T(`${f.k}+${it.n < 0 ? `(${it.n})` : it.n}=${nn}`)}. The coefficient got ${big ? 'smaller' : 'bigger'}, so the exponent goes ${big ? '<b>up</b>' : '<b>down</b>'} by 1: <b>${T(snSciP(f.c, nn))}</b>.`,
      run: async (c) => { fx2.innerHTML = K(`=${snSci(f.c, nn)}`); fx2.classList.add('done'); await c.pop(fx2, 420); at(st2, Math.min(fx2.offsetWidth + 40, W - 70), 330); await stampIn(c, st2); }
    });
    return steps;
  }
};

/* =====================================================================
 * 3–4. Hop the decimal point (from 10C 2.3)
 * ===================================================================== */
function snDigitRow(stage, cells, o) {
  const { x0, y, cw, ch, fs } = o, svg = add(stage, svgEl('svg', { class: 'u2l8-sn-svg' }), 0, 0);
  svg.setAttribute('width', stage.clientWidth || 1000); svg.setAttribute('height', o.H);
  const els = cells.map((d, i) => { const e = add(stage, h('div', 'u2l8-sn-cell', d), x0 + i * cw, y); e.style.width = cw + 'px'; e.style.height = ch + 'px'; e.style.fontSize = fs + 'px'; e.style.lineHeight = ch + 'px'; return e; });
  const sx = (k) => x0 + k * cw, base = y + ch * 0.86;
  return {
    els, sx, base,
    async hop(c, dot, k, dir, label) {
      const x1 = sx(k), x2 = sx(k + dir), top = y - 10, mid = (x1 + x2) / 2;
      const p = svgEl('path', { class: 'u2l8-sn-arc' + (dir < 0 ? ' left' : ''), d: `M ${x1} ${base - 8} C ${x1} ${top}, ${x2} ${top}, ${x2} ${base - 8}` }); svg.appendChild(p);
      const len = p.getTotalLength ? p.getTotalLength() || 120 : 120; p.style.strokeDasharray = len; p.style.strokeDashoffset = len;
      const tag = add(stage, h('div', 'u2l8-sn-tag c' + (dir < 0 ? ' left' : ''), label), mid, top - 6); tag.style.opacity = 0;
      const ah = svgEl('path', { class: 'u2l8-sn-head' + (dir < 0 ? ' left' : ''), d: `M ${x2 - 6} ${base - 20} L ${x2} ${base - 8} L ${x2 + 6} ${base - 20}` }); ah.style.opacity = 0; svg.appendChild(ah);
      await Promise.all([
        c.anim(p, [{ strokeDashoffset: len }, { strokeDashoffset: 0 }], 420),
        c.anim(dot, [{ transform: 'translate(0,0)' }, { transform: `translate(${(x2 - x1) / 2}px, ${top - base + 4}px)`, offset: 0.5 }, { transform: `translate(${x2 - x1}px, 0)` }], 420, { easing: 'ease-in-out' }),
        c.anim(tag, [{ opacity: 0, transform: 'scale(.6)' }, { opacity: 1, transform: 'scale(1)' }], 260, { delay: 180 }),
        c.anim(ah, [{ opacity: 0 }, { opacity: 1 }], 120, { delay: 330 })
      ]);
      dot.style.left = x2 + 'px'; dot.style.transform = 'none';
    }
  };
}
function snHopsDef(title, choices, value) {
  return {
    title, height: 440, minW: 780, choices, value,
    intro: (v) => {
      const [mode, a, b] = v.split(':');
      if (mode === 's') { const q = snParse(a); return `Write <b>${snStd(q.sig, q.e)}</b> in <b>scientific notation</b>. The decimal point hops from ○ to ●, and we count the hops.`; }
      return `Write ${T(snSciP(snCoef(snParse(a).sig), b))} in <b>standard notation</b>. The exponent says how many places the point hops, and which way.`;
    },
    make(stage, v, ex) {
      const W = ex.W, H = 440, [mode, a, b] = v.split(':');
      let sig, e;
      if (mode === 's') ({ sig, e } = snParse(a)); else { sig = snParse(a).sig; e = Number(b); }
      const big = e >= 0, nh = Math.abs(e), dir = big ? 1 : -1, coef = snCoef(sig);
      const cells = big ? sig.padEnd(Math.max(sig.length, e + 1), '0').split('') : ('0'.repeat(-e) + sig).split('');
      const cIdx = big ? 1 : -e + 1, sIdx = big ? e + 1 : 1, L = cells.length;
      const pad = (i) => (big ? i >= sig.length : i < -e);
      const cw = Math.min(66, (W - 200) / (L + 1)), ch = cw * 1.25, fs = Math.min(56, cw * 0.86), x0 = (W - L * cw) / 2, y = 120;
      const row = snDigitRow(stage, cells, { x0, y, cw, ch, fs, H });
      add(stage, h('div', 'u2l8-sn-task', mode === 's' ? `Write <b>${snStd(sig, e)}</b> in scientific notation` : `Write ${K(snSci(coef, e))} in standard notation`), 22, 14);
      add(stage, h('div', 'u2l8-sn-legend', '<span class="u2l8-sn-ring-i"></span> start: the coefficient’s point &nbsp; <span class="u2l8-sn-dot-i"></span> end: the standard number’s point'), 22, 58);
      const ring = add(stage, h('div', 'u2l8-sn-ring c'), row.sx(cIdx), row.base);
      const dot = add(stage, h('div', 'u2l8-sn-dot c'), row.sx(cIdx), row.base);
      const ghost = add(stage, h('div', 'u2l8-sn-dot ghost c'), row.sx(sIdx), row.base);
      hide(dot, ghost); if (mode === 's') hide(ring);
      const lab = (t, yy) => add(stage, h('div', 'u2l8-sn-lab', t), 28, yy);
      const yPF = 262, yOut = 348;
      const lPF = lab('Product form', yPF + 10), pf = add(stage, h('div', 'u2l8-sn-math'), 250, yPF);
      const lOut = lab(mode === 's' ? 'Scientific notation' : 'Standard notation', yOut + 6), out = add(stage, h('div', 'u2l8-sn-math out'), 250, yOut);
      const setPF = (html) => { pf.innerHTML = html; pf.style.fontSize = ''; const room = W - 264; if (pf.offsetWidth > room) pf.style.fontSize = (30 * room / pf.offsetWidth) + 'px'; };
      hide(lPF, lOut);
      const tens = (k) => Array(k).fill('10').join('\\times');
      const pfT = (k) => (k === 0 ? coef : big ? `${coef}\\times${tens(k)}` : `\\dfrac{${coef}}{${tens(k)}}`);
      const steps = [];
      if (mode === 's') {
        const first = cells.findIndex((d) => d !== '0');
        steps.push({
          cap: big ? `In <b>${snStd(sig, e)}</b> the decimal point is hiding at the <b>end</b> (●). For a coefficient between 1 and 10 it must sit right after the <b>first nonzero digit</b> (○): <b>${coef}</b>.`
            : `In <b>${snStd(sig, e)}</b> the decimal point is after the first 0 (●). For a coefficient between 1 and 10 it must sit right after the <b>first nonzero digit</b>, the ${cells[first]} (○): <b>${coef}</b>.`,
          run: async (c) => {
            out.innerHTML = K(`${coef}\\times10^{\\,?}`);
            row.els[first].classList.add('lead');
            await Promise.all([c.anim(ghost, [{ opacity: 0 }, { opacity: 0.45 }], 300), c.pop(ring, 380, { delay: 250 }), c.fadeIn(lOut, 300, { delay: 400 }), c.fadeIn(out, 400, { delay: 400 }), c.anim(row.els[first], [{ transform: 'scale(1)' }, { transform: 'scale(1.18)' }, { transform: 'scale(1)' }], 420)]);
          }
        });
        steps.push({
          cap: big ? 'Now hop from ○ to ●. Each hop to the <b>right</b> multiplies by 10, so write one “× 10” for every hop.'
            : 'Now hop from ○ to ●. Each hop to the <b>left</b> divides by 10, so every hop puts one more 10 on the <b>bottom</b>.',
          run: async (c) => {
            dot.style.opacity = 1;
            await Promise.all([c.fadeIn(lPF, 300), c.fadeIn(pf, 300)]);
            for (let i = 0; i < nh; i++) {
              setPF(K(pfT(i)));
              await row.hop(c, dot, cIdx + i * dir, dir, big ? '×10' : '÷10');
              setPF(K(pfT(i + 1)));
              if (!c.fast) pf.animate([{ opacity: 0.4 }, { opacity: 1 }], 200);
            }
            ghost.style.opacity = 0;
          }
        });
        steps.push({
          cap: big ? `<b>${snPlural(nh, 'hop')}</b>: ${nh === 1 ? 'one 10' : nh + ' tens multiplied together'} is ${T(`10^{${nh}}`)}. So ${snStd(sig, e)} = <b>${T(snSciP(coef, e))}</b>.`
            : `Dividing by ${nh === 1 ? 'one 10' : nh + ' tens'} is the same as multiplying by ${T(`10^{${e}}`)}: a <b>negative exponent</b>, since ${T(`\\tfrac{1}{10^{${nh}}}=10^{${e}}`)}. So ${snStd(sig, e)} = <b>${T(snSciP(coef, e))}</b>.`,
          run: async (c) => {
            setPF(K(`${pfT(nh)}=${snSciP(coef, e)}`)); out.innerHTML = K(`\\mathbf{${snSci(coef, e)}}`);
            out.classList.add('done');
            await Promise.all([c.fadeIn(pf, 300), c.pop(out, 420)]);
          }
        });
        const nPad = cells.filter((_, i) => pad(i)).length;
        steps.push({
          cap: (big ? 'A <b>big</b> number (10 or more) gets a <b>positive</b> exponent.' : 'A number <b>less than 1</b> gets a <b>negative</b> exponent.')
            + (nPad ? ` The ${nPad === 1 ? 'zero was a placeholder' : nPad + ' zeros were only placeholders'}: the coefficient keeps the digits <b>${sig.split('').join(', ')}</b>.` : '')
            + ` Check: hop ${nh} ${big ? 'right' : 'left'} from ${coef}, back to ${snStd(sig, e)} ✓`,
          run: async (c) => {
            const ph = row.els.filter((_, i) => pad(i));
            ph.forEach((el) => el.classList.add('ph'));
            await Promise.all(ph.map((el, i) => c.anim(el, [{ transform: 'scale(1)' }, { transform: 'scale(.86)' }, { transform: 'scale(1)' }], 360, { delay: i * 60 })));
          }
        });
        return steps;
      }
      row.els.forEach((el, i) => { if (pad(i)) { el.textContent = '0'; el.classList.add('ph'); hide(el); } });
      row.els.forEach((el, i) => { if (i === cIdx - 1) el.classList.add('lead'); });
      steps.push({
        cap: big ? `${T(`10^{${e}}`)} means <b>multiply by 10, ${snPlural(nh, 'time')}</b>. In product form: ${[coef, ...Array(nh).fill('10')].map((t) => T(t)).join(' × ')}.`
          : `${T(`10^{${e}}`)} means <b>divide by 10, ${snPlural(nh, 'time')}</b>. In product form: ${T(pfT(nh))}.`,
        run: async (c) => { setPF(K(pfT(nh))); await Promise.all([c.fadeIn(lPF, 300), c.fadeIn(pf, 400)]); }
      });
      const fills = Array.from({ length: nh }, (_, i) => (big ? cIdx + i : cIdx - i - 1)).filter((i) => pad(i)).length;
      steps.push({
        cap: (big ? `Each × 10 moves the point <b>one place right</b>. Hop ${snPlural(nh, 'place')}` : `Each ÷ 10 moves the point <b>one place left</b>. Hop ${snPlural(nh, 'place')}`)
          + (fills ? ', filling each empty place with a <b>zero</b>.' : '.'),
        run: async (c) => {
          dot.style.opacity = 1;
          for (let i = 0; i < nh; i++) {
            const kk = cIdx + i * dir, cross = big ? kk : kk - 1;
            await row.hop(c, dot, kk, dir, big ? '×10' : '÷10');
            if (pad(cross)) await c.pop(row.els[cross], 260);
          }
        }
      });
      steps.push({
        cap: big ? `Read off the number: ${T(snSciP(coef, e))} = <b>${snStd(sig, e)}</b>. A positive exponent gives a <b>big</b> number.`
          : `Put a <b>0</b> in front of the point and read it off: ${T(snSciP(coef, e))} = <b>${snStd(sig, e)}</b>. A negative exponent gives a number <b>less than 1</b>, not a negative number.`,
        run: async (c) => {
          const jobs = [];
          if (!big && row.els[0].style.opacity === '0') jobs.push(c.pop(row.els[0], 300));
          out.innerHTML = K(`\\mathbf{${snStdT(sig, e)}}`); out.classList.add('done');
          jobs.push(c.fadeIn(lOut, 300), c.pop(out, 420, { delay: 200 }));
          await Promise.all(jobs);
        }
      });
      return steps;
    }
  };
}
const toSci = snHopsDef('Hop the decimal point: big numbers', [{ v: 's:47000', label: '47 000' }, { sep: 'Example 1 check:' },
  { v: 's:6000', label: '(a)' }, { v: 's:52000', label: '(b)' }, { v: 's:730000', label: '(c)' }, { v: 's:8400000', label: '(d)' }]);
const toSciSmall = snHopsDef('Hop the decimal point: numbers less than 1', [{ v: 's:0.0004', label: '0.0004' }, { sep: 'Example 2 check:' },
  { v: 's:0.003', label: '(a)' }, { v: 's:0.00052', label: '(b)' }, { v: 's:0.0000081', label: '(c)' }, { v: 's:0.06', label: '(d)' }]);
const toStd = snHopsDef('Hop back to standard notation', [{ v: 'e:3.4:-5', label: T('3.4\\times10^{-5}') }, { sep: 'Example 3 check:' },
  { v: 'e:5:3', label: '(a)' }, { v: 'e:3.4:5', label: '(b)' }, { v: 'e:7:-3', label: '(c)' }, { v: 'e:2.6:-5', label: '(d)' }]);
const real = snHopsDef('Real-world sizes, both ways', [{ sep: 'Example 4 check:' }, { v: 's:150000000', label: '(a) Sun' }, { v: 's:0.000007', label: '(b) blood cell' },
  { v: 'e:3.5:-6', label: '(c) bacterium' }, { v: 'e:2.4:9', label: '(d) assets' }]);

/* =====================================================================
 * 5. Comparing: powers of ten are shelves
 * ===================================================================== */
const LAD = {
  a: { items: [['bacterium', '2', -6], ['human hair', '7', -5], ['grain of sand', '5', -4]], unit: 'm' },
  b: { items: [['City A', '3.2', 6], ['City B', '8', 5]], unit: 'people' },
  s: { items: [['', '4.5', -3], ['', '1.2', -3]], unit: '' },
  w: { items: [['blood cell', '7', -6], ['hair', '7', -5], ['sand', '5', -4], ['person', '1.7', 0], ['Everest', '8.8', 3], ['Earth', '1.27', 7]], unit: 'm' }
};
const ladder = {
  title: 'Exponents pick the shelf',
  height: 420,
  choices: [{ v: 's', label: T('4.5\\times10^{-3}\\ \\text{vs}\\ 1.2\\times10^{-3}') }, { v: 'w', label: 'the warm-up' }, { sep: 'Example 5 check:' }, { v: 'a', label: '(a)' }, { v: 'b', label: '(b)' }],
  intro: (k) => `Order ${LAD[k].items.map(([, c, n]) => T(snSciP(c, n))).join(', ')} from smallest to largest.`,
  make(stage, k, ex) {
    const it = LAD[k], W = ex.W, es = it.items.map((x) => x[2]), lo = Math.min(...es), hi = Math.max(...es) + 1;
    const span = hi - lo, AX = 196, x0 = 60, x1 = W - 70, X = (v) => x0 + (v - lo) * (x1 - x0) / span, sw = (x1 - x0) / span;
    const svg = add(stage, svgEl('svg', { width: W, height: 300, class: 'u2l8-ld-svg' }), 0, 0);
    const shelves = {};
    for (let n = lo; n < hi; n++) {
      const g = svgEl('g', { class: 'u2l8-ld-shelf' + ((n - lo) % 2 ? ' alt' : '') });
      g.appendChild(svgEl('rect', { x: X(n), y: AX - 34, width: sw, height: 34, rx: 4 }));
      svg.appendChild(g); shelves[n] = g;
    }
    svg.appendChild(svgEl('line', { x1: x0, x2: x1, y1: AX, y2: AX, class: 'u2l8-ld-ax' }));
    for (let n = lo; n <= hi; n++) {
      svg.appendChild(svgEl('line', { x1: X(n), x2: X(n), y1: AX - 40, y2: AX + 8, class: 'u2l8-ld-tk' }));
      add(stage, h('div', 'u2l8-ld-tl c', K(`10^{${n}}`)), X(n), AX + 26);
      if (span <= 4) add(stage, h('div', 'u2l8-ld-tv c', snStd('1', n)), X(n), AX + 54);
    }
    const nItems = it.items.length;
    const marks = it.items.map(([name, c, n], i) => {
      const x = X(n + Math.log10(Number(c))), lift = nItems > 3 ? [150, 96, 150, 96, 150, 96][i] : (i % 2 ? 70 : 128);
      const pin = add(stage, h('div', 'u2l8-ld-pin c'), x, AX - 17);
      const stem = add(stage, h('div', 'u2l8-ld-stem'), x - 1, AX - lift + 14); stem.style.height = (lift - 30) + 'px';
      const lab = add(stage, h('div', 'u2l8-ld-lab c' + (nItems > 3 ? ' sm' : ''), (name ? `<b>${name}</b>` : '') + K(snSci(c, n))), x, AX - lift);
      hide(pin, stem, lab); return { pin, stem, lab, n, c, name };
    });
    const sorted = [...marks].sort((p, q) => p.n + Math.log10(Number(p.c)) - (q.n + Math.log10(Number(q.c))));
    const ord = add(stage, h('div', 'u2l8-ld-ord' + (nItems > 3 ? ' sm' : '')), 30, 350); hide(ord);
    ord.innerHTML = K(sorted.map((m) => snSciP(m.c, m.n)).join('\\lt '));
    const steps = [{
      cap: `Each power of ten is a <b>shelf</b>: the ${T('10^{n}')} shelf runs from ${T('10^{n}')} up to the next power, ${T('10^{n+1}')}, which is <b>10 times</b> as big.`,
      run: (c) => Promise.all(Object.values(shelves).map((g, i) => c.anim(g, [{ opacity: 0 }, { opacity: 1 }], 300, { delay: i * 60 })))
    }];
    marks.forEach((m) => steps.push({
      cap: `${m.name ? m.name.charAt(0).toUpperCase() + m.name.slice(1) + ': ' : ''}${T(snSciP(m.c, m.n))}. The <b>exponent</b> ${mn(m.n)} puts it on the ${T(`10^{${m.n}}`)} shelf; the coefficient ${m.c} says how far along.`,
      run: async (c) => { shelves[m.n].classList.add('on'); await Promise.all([c.pop(m.pin, 360), c.fadeIn(m.stem, 300, { delay: 120 }), c.fadeIn(m.lab, 350, { delay: 180 })]); }
    }));
    const same = new Set(es).size === 1;
    if (k === 'b') steps.push({
      cap: `City B’s 8 is a big coefficient, but ${T('8\\times10^{5}=800\\,000')} is still <b>below</b> ${T('10^{6}=1\\,000\\,000')}, where City A’s shelf starts. Both numbers are in scientific notation, so the bigger exponent wins.`,
      run: (c) => Promise.all(marks.map((m) => c.anim(m.lab, [{ transform: 'scale(1)' }, { transform: 'scale(1.1)' }, { transform: 'scale(1)' }], 420)))
    });
    steps.push({
      cap: same ? `<b>Same exponent</b>, same shelf: only now compare the coefficients, ${T(sorted.map((m) => m.c).join('\\lt '))}. Order: <b>${T(sorted.map((m) => snSciP(m.c, m.n)).join('\\lt '))}</b>.`
        : `Compare the <b>exponents first</b>: ${T([...new Set(sorted.map((m) => m.n))].join('\\lt '))}.` + (new Set(es).size < es.length ? ' Two share a shelf, so their coefficients decide.' : '') + ` Smallest to largest: ${sorted.map((m) => (m.name ? `<b>${m.name}</b>` : T(snSciP(m.c, m.n)))).join(', ')}.`,
      run: (c) => c.fadeIn(ord, 400)
    });
    return steps;
  }
};

/* =====================================================================
 * Math History box: The Sand Reckoner — a 1 followed by 63 zeros squeezes into 10^63
 * ===================================================================== */
(function sandReckoner() {
  const svg = document.getElementById('u2l8-hist'); if (!svg) return;
  const NS = 'http://www.w3.org/2000/svg';
  const mk = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); Object.keys(attrs || {}).forEach((k) => e.setAttribute(k, attrs[k])); (parent || svg).appendChild(e); return e; };
  const txt = (s, attrs, parent) => { const e = mk('text', attrs, parent); e.textContent = s; return e; };
  const ease = (u) => (u <= 0 ? 0 : u >= 1 ? 1 : u * u * (3 - 2 * u));
  txt('The Sand Reckoner', { x: 24, y: 34, class: 'u2l8h-cap' });
  const note = txt('', { x: 576, y: 34, 'text-anchor': 'end', class: 'u2l8h-note' });
  // the digits: "1" then 63 zeros, 22 to a row in groups of three
  const digs = [], PER = 22, DX = 23.4, X0 = 36, Y0 = 92, DY = 50;
  const wrap = mk('g', {});
  for (let i = 0; i <= 63; i++) {
    const r = Math.floor(i / PER), cIdx = i % PER;
    const x = X0 + cIdx * DX + Math.floor(cIdx / 3) * 4, y = Y0 + r * DY;
    digs.push(txt(i === 0 ? '1' : '0', { x, y, class: 'u2l8h-dig' + (i === 0 ? ' one' : '') }, wrap));
  }
  const count = txt('', { x: 300, y: 252, 'text-anchor': 'middle', class: 'u2l8h-count' });
  const fin = mk('g', { class: 'u2l8h-fin' });
  const t1 = txt('1 × 10', { x: 268, y: 172, 'text-anchor': 'middle', class: 'u2l8h-big' }, fin);
  txt('63', { x: 340, y: 136, class: 'u2l8h-exp' }, fin);
  void t1;
  const sub = txt('fewer grains than this fill his universe', { x: 300, y: 214, 'text-anchor': 'middle', class: 'u2l8h-sub' }, fin);
  void sub;
  const END = 10500, TYPE0 = 600, TYPE1 = 5600;
  function draw(t) {
    const shown = t < TYPE0 ? 0 : Math.min(64, Math.floor((t - TYPE0) / ((TYPE1 - TYPE0) / 64)) + 1);
    digs.forEach((d, i) => { d.style.opacity = i < shown ? 1 : 0; });
    const zeros = Math.max(0, shown - 1);
    const sq = ease((t - 6800) / 1600);
    wrap.style.opacity = 1 - sq; wrap.style.transformOrigin = '300px 140px'; wrap.style.transform = `scale(${1 - 0.7 * sq})`;
    fin.style.opacity = ease((t - 7800) / 900);
    count.textContent = t < TYPE0 ? '' : t < 6800 ? `zeros: ${zeros}` : '';
    count.classList.toggle('gold', zeros === 63);
    note.textContent = t < TYPE0 ? '' : t < 6800 ? 'Archimedes’ answer, written out' : 'in scientific notation';
  }
  let st = 0, raf = 0;
  function frame(now) { if (!st) st = now; const t = Math.min(END, now - st); draw(t); if (t < END) raf = requestAnimationFrame(frame); }
  function play() {
    cancelAnimationFrame(raf); st = 0;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { draw(END); return; }
    raf = requestAnimationFrame(frame);
  }
  draw(END);
  svg.addEventListener('click', play);
  const btn = svg.closest('.hist-anim') && svg.closest('.hist-anim').querySelector('.hist-play'); if (btn) btn.addEventListener('click', play);
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { io.disconnect(); play(); } }, { threshold: 0.5 });
    io.observe(svg);
  }
})();

/* =============================== mount =============================== */
mountTiny();
export const explainers = mountExplainers({ places, isSci, toSci, toSciSmall, toStd, real, ladder });
export const _test = { snParse, snStd, PL, ISS, LAD, CARDS };

/* ============ Stand Up Break! — scientific notation, both ways, and comparing ============ */
standup('u2l8', (() => {
  const mkSig = (r) => { const n = r.pick([1, 2, 2, 2, 3]); let s = String(r.int(1, 9)); for (let i = 1; i < n; i++) s += String(i === n - 1 ? r.int(1, 9) : r.int(0, 9)); return s; };
  const hopsLine = (e) => (e >= 0 ? `\\text{${Math.abs(e)} place${Math.abs(e) === 1 ? '' : 's'} left}` : `\\text{${-e} place${e === -1 ? '' : 's'} right}`);
  const hopsBack = (e) => (e >= 0 ? `\\text{${e} place${e === 1 ? '' : 's'} right}` : `\\text{${-e} place${e === -1 ? '' : 's'} left}`);
  const sci = (sig, e) => snSciP(snCoef(sig), e);
  const ITEMS = [['A bee is about', 'm long', [-2]], ['A grain of pollen is about', 'm wide', [-5, -4]], ['A virus is about', 'm across', [-7]], ['The distance to Mars is about', 'km', [7, 8]],
    ['A city has about', 'people', [5, 6]], ['A raindrop has a mass of about', 'g', [-2]], ['A country’s budget is about', 'dollars', [9, 10]], ['A dust speck is about', 'm wide', [-5]], ['A mountain is about', 'm tall', [3]]];
  return {
    intro: 'Convert at your whiteboard station. Count the hops of the decimal point, and say which way: left for big numbers, right for small ones.',
    levels: {
      BEG: (r) => { // Examples 1–2: standard → scientific
        const sig = mkSig(r), e = r.chance(0.5) ? r.int(2, 8) : -r.int(1, 7);
        return { text: 'Write in scientific notation.', q: snStdT(sig, e), a: [hopsLine(e), '=' + sci(sig, e)] };
      },
      PRG: (r) => { // Example 3: scientific → standard, and "which way, how many places?"
        const sig = mkSig(r), e = r.chance(0.5) ? r.int(1, 8) : -r.int(1, 7);
        if (r.chance(0.25)) return { text: 'Which way, and how many places, does the decimal point move to write this in scientific notation?', q: snStdT(sig, e), a: [hopsLine(e), '=' + sci(sig, e)] };
        return { text: 'Write in standard notation.', q: sci(sig, e), a: [hopsBack(e), '=' + snStdT(sig, e)] };
      },
      MAS: (r) => {
        const t = r.pick(['fix', 'fix', 'ord', 'ord', 'cmp', 'real']);
        if (t === 'fix') { // 47 × 10^3 or 0.8 × 10^-2: not scientific notation
          const sig = mkSig(r), n = r.int(-6, 7), big = r.chance(0.55), k = big ? r.pick([1, 1, 2]) : -r.pick([1, 1, 2]);
          const shown = k > 0 ? snStd(sig, k, '\\,') : snStd(sig, k, '\\,'); // the coefficient written with k extra places
          const rn = n + k;
          return { text: 'Is this in scientific notation? If not, rewrite it correctly.', q: shown + '\\times10^{' + n + '}',
            atext: big ? `Not scientific notation: ${T(shown + '\\ge10')}.` : `Not scientific notation: ${T(shown + '\\lt1')}.`,
            a: [shown + '=' + sci(sig, k), '=' + sci(sig, k) + '\\times10^{' + n + '}=' + sci(sig, rn)] };
        }
        if (t === 'ord') { // order three
          for (;;) {
            const base = r.int(-7, 6), es = r.shuffle([base, base + r.int(1, 2), base + r.int(1, 3)]), sigs = es.map(() => mkSig(r));
            const vals = es.map((e, i) => e + Math.log10(Number(snCoef(sigs[i]))));
            if (new Set(vals).size < 3) continue;
            const idx = [0, 1, 2].sort((a, b) => vals[a] - vals[b]);
            return { text: 'Order from smallest to largest.', q: es.map((e, i) => sci(sigs[i], e)).join(',\\quad '), a: [idx.map((i) => sci(sigs[i], es[i])).join('\\lt ')] };
          }
        }
        if (t === 'cmp') { // a big coefficient with a smaller exponent
          const n = r.int(-6, 7), A = mkSig(r), B = String(r.int(6, 9)) + (r.chance(0.5) ? String(r.int(1, 9)) : '');
          const [x, y] = r.shuffle([[A, n], [B, n - 1]]);
          return { text: 'Which number is larger? Justify with the exponents.', q: sci(x[0], x[1]) + '\\quad\\text{or}\\quad ' + sci(y[0], y[1]),
            a: [sci(A, n) + '\\ \\text{is larger: exponent }{' + n + '}\\gt{' + (n - 1) + '}', sci(A, n) + '=' + snStdT(A, n) + ',\\quad ' + sci(B, n - 1) + '=' + snStdT(B, n - 1)] };
        }
        const [pre, unit, opts] = r.pick(ITEMS), e = r.pick(opts), sig = mkSig(r), toStd = r.chance(0.5);
        const u = '\\ \\text{' + unit.replace('’', "'") + '}';
        return toStd ? { text: `${pre} ${T(sci(sig, e))} ${unit}. Write this in standard notation.`, q: '', a: [hopsBack(e), '=' + snStdT(sig, e) + u] }
          : { text: `${pre} ${T(snStdT(sig, e))} ${unit}. Write this in scientific notation.`, q: '', a: [hopsLine(e), '=' + sci(sig, e) + u] };
      }
    }
  };
})());
