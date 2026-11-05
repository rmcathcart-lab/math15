/* Math 15 · Unit 2 · Lesson 2 — The Quotient Law & Power of a Power.
 * (The Math 10C twin is u2/l1 + u2/l2; the cancelling tiles, the copies of a power and the law-by-law chains are adapted
 * from it.) Warm-up "Boxes Inside Boxes" (candy packed in 4s: pack, box, case, crate), and the explainers:
 *   cancel   (Section 1: write the quotient as a fraction of factors, cancel in pairs, count what is left; Example 1)
 *   coefDiv  (Section 2: divide the numbers, cancel the letters; Example 2)
 *   copies   (Section 3: (a^m)^n is n copies of a^m, stacked in rows: n × m factors; Examples 3 and 4)
 *   check    (Section 3: inside the brackets first vs. the law vs. the "add" mistake; Examples 3 and 4)
 *   which    (Section 3: add, subtract or multiply? the clue tells you which law)
 *   chain    (Section 4: brackets first (multiply), then the Quotient Law (subtract); Example 5)
 * Colours: Product navy, Quotient amber, Power of a Power purple. */
import { h, Explainer } from '../explain.js';
import { tex } from '../tex.js';
import { standup } from '../standup.js';

const at = (el, x, y) => { el.style.left = x + 'px'; el.style.top = y + 'px'; return el; };
const add = (stage, el, x, y) => { stage.appendChild(at(el, x, y)); return el; };
const hide = (...els) => els.forEach((e) => { if (e) e.style.opacity = 0; });
const svgEl = (tag, attrs = {}, parent) => { const e = document.createElementNS('http://www.w3.org/2000/svg', tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; };
const K = (src, display) => {
  try { return window.katex.renderToString(String(src), { displayMode: !!display, throwOnError: false, strict: 'ignore', trust: true, output: 'html' }); }
  catch (e) { return tex(src, display); }
};
const grp = (n, sep) => String(Math.abs(n)).replace(/\B(?=(\d{3})+(?!\d))/g, sep);
const T = (n) => (n < 0 ? '-' : '') + (Math.abs(n) >= 1000 ? grp(n, '\\,') : String(Math.abs(n)));
const N = (n) => (n < 0 ? '−' : '') + (Math.abs(n) >= 1000 ? grp(n, ' ') : String(Math.abs(n)));
const pw = (b, e) => (e === 1 ? String(b) : `${b}^{${e}}`);
const WORD = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
const bnum = (b) => { const m = String(b).match(/^\(?(-?\d+)\)?$/); return m ? +m[1] : null; }; // '7' → 7, '(-3)' → -3, 'x' → null
function stampIn(c, el) { return c.anim(el, [{ opacity: 0, transform: 'scale(1.9) rotate(-14deg)' }, { opacity: 1, transform: 'scale(1) rotate(-6deg)' }], 420, { easing: 'cubic-bezier(.2,1.4,.4,1)' }); }

/* ================= 1–2. The Quotient Law: cancel the factors in pairs ================= */
function cancelDef(title, map, choices) {
  return {
    title, height: 380, minW: 940, choices,
    intro: (k) => { const d = map[k]; return `Simplify ${tex(d.head)} by writing <b>every factor</b> on the top and on the bottom.`; },
    make(stage, key, ex) {
      const W = ex.W, d = map[key], { b, m, n } = d, hasC = d.a != null, left = m - n, bv = bnum(b), wide = b.length > 2;
      const TH = m >= 9 ? 52 : m >= 6 ? 58 : 72, TW = wide ? 66 : TH, G = 8, x0 = 30, yT = 40, yB = yT + TH + 44, barY = yT + TH + 20;
      const q = hasC ? d.a / d.c : 1;
      const cols = (hasC ? 1 : 0) + m, colX = (i) => x0 + i * (TW + G);
      const mk = (txt, cls, i, y) => { const e = add(stage, h('div', 'u2l2-xt ' + cls, K(txt)), colX(i), y); e.style.width = (hasC && i === 0 && cls === 'co' ? TH : TW) + 'px'; e.style.height = TH + 'px'; hide(e); return e; };
      const off = hasC ? 1 : 0;
      const ca = hasC ? mk(String(d.a), 'co', 0, yT) : null, cb = hasC ? mk(String(d.c), 'co', 0, yB) : null;
      const top = Array.from({ length: m }, (_, i) => mk(b, 'va' + (wide ? ' wide' : ''), off + i, yT));
      const bot = Array.from({ length: n }, (_, i) => mk(b, 'va' + (wide ? ' wide' : ''), off + i, yB));
      const bar = add(stage, h('div', 'u2l2-bar'), x0 - 8, barY); bar.style.width = (cols * (TW + G) + 8) + 'px'; hide(bar);
      const qv = hasC ? add(stage, h('div', 'u2l2-q', K(String(q))), colX(0) + TH / 2, barY + 2) : null; if (qv) hide(qv);
      const ones = bot.map((_, i) => { const e = add(stage, h('div', 'u2l2-one', '1'), colX(off + i) + TW / 2, barY + 2); hide(e); return e; });
      const slashes = [...top.slice(0, n), ...bot].map((t) => { const s = h('i', 'u2l2-slash'); t.appendChild(s); hide(s); return s; });
      const counts = top.slice(n).map((e) => { const k = h('span', 'u2l2-xt-n'); e.appendChild(k); hide(k); return k; });
      const panelX = x0 + cols * (TW + G) + 30, panel = add(stage, h('div', 'u2l2-panel'), panelX, 16); panel.style.width = Math.min(340, W - panelX - 16) + 'px';
      panel.innerHTML = `<div class="u2l2-pexpr">${K(d.frac)}</div>`;
      const row = (html, cls = '') => { const e = h('div', 'u2l2-prow ' + cls, html); panel.appendChild(e); hide(e); return e; };
      const bt = tex(b), res = `${hasC && q !== 1 ? q : ''}${pw(b, left)}`, val = bv != null ? Math.pow(bv, left) : null;
      const r1 = hasC ? row(`<span class="u2l2-pk">numbers</span>${K(`${d.a}\\div${d.c}=${q}`)}`) : null;
      const r2 = row(`<span class="u2l2-pk">${hasC ? `${bt}’s left` : 'left on top'}</span>${K(`${m}-${n}=${left}`)}`);
      const r3 = row(K(`=${res}`), 'res');
      const r4 = val != null ? row(K(`=${T(val)}`), 'val') : null;
      const law = add(stage, h('div', 'u2l2-law', `<b>Quotient Law</b>${K('a^{m}\\div a^{n}=a^{m-n}')}`), x0, yB + TH + 40); hide(law);
      const steps = [{
        cap: hasC ? `<b>Expand:</b> the top has ${tex(String(d.a))} and <b>${m}</b> factors of ${bt}; the bottom has ${tex(String(d.c))} and <b>${n}</b> factors of ${bt}.`
          : `Write it as a fraction: <b>${WORD[m]}</b> factors of ${bt} on top, <b>${WORD[n]}</b> on the bottom.`,
        run: (c) => Promise.all([c.fadeIn(bar, 300), ...[ca, ...top].filter(Boolean).map((e, i) => c.pop(e, 340, { delay: i * 55 })), ...[cb, ...bot].filter(Boolean).map((e, i) => c.pop(e, 340, { delay: 250 + i * 55 }))])
      }];
      if (hasC) steps.push({
        cap: `<b>The numbers</b> divide like ordinary numbers: ${tex(`${d.a}\\div${d.c}=${q}`)}.`,
        run: async (c) => { ca.classList.add('out'); cb.classList.add('out'); await Promise.all([c.pop(qv, 420, { delay: 200 }), c.fadeIn(r1, 350, { delay: 300 })]); }
      });
      steps.push({
        cap: `Each ${bt} on the bottom <b>cancels</b> one ${bt} on top, because ${tex(`\\dfrac{${b}}{${b}}=1`)}. That’s <b>${WORD[n]} pairs</b>.`,
        run: async (c) => {
          for (let i = 0; i < n; i++) {
            const s1 = slashes[i], s2 = slashes[n + i];
            await Promise.all([c.anim(s1, [{ opacity: 0, transform: 'scaleX(0)' }, { opacity: 1, transform: 'scaleX(1)' }], 220), c.anim(s2, [{ opacity: 0, transform: 'scaleX(0)' }, { opacity: 1, transform: 'scaleX(1)' }], 220), c.pop(ones[i], 260, { delay: 100 })]);
            top[i].classList.add('out'); bot[i].classList.add('out');
          }
        }
      }, {
        cap: `<b>${WORD[left][0].toUpperCase() + WORD[left].slice(1)}</b> factors of ${bt} are left on top: ${tex(`${m}-${n}=${left}`)}. So ${tex(`${d.head}=${res}`)}.`,
        run: async (c) => {
          for (let i = 0; i < counts.length; i++) { counts[i].textContent = i + 1; top[n + i].classList.add('lit'); await c.pop(counts[i], 180); }
          await Promise.all([c.fadeIn(r2, 350), c.fadeIn(r3, 400, { delay: 250 })]);
        }
      });
      if (val != null) steps.push({
        cap: bv < 0 ? `Evaluate: ${tex(`${pw(b, left)}=${T(val)}`)}. ${left % 2 ? 'An <b>odd</b> number of negative factors: negative.' : 'An <b>even</b> number of negative factors: positive.'}`
          : `Evaluate: ${tex(`${pw(b, left)}=${Array(left).fill(bv).join('\\times')}=${T(val)}`)}.`,
        run: (c) => c.pop(r4, 400)
      });
      steps.push({
        cap: `<b>Quotient Law:</b> dividing powers with the <b>same base</b>? Keep the base and <b>subtract</b> the exponents.${hasC ? ' Divide the numbers separately.' : ''}`,
        run: (c) => c.pop(law, 420)
      });
      return steps;
    }
  };
}
const CAN = {
  n1: { b: '2', m: 5, n: 2, head: '2^{5}\\div2^{2}', frac: '\\dfrac{2^{5}}{2^{2}}' },
  n2: { b: '4', m: 4, n: 2, head: '4^{4}\\div4^{2}', frac: '\\dfrac{4^{4}}{4^{2}}' },
  a: { b: '7', m: 5, n: 2, head: '7^{5}\\div7^{2}', frac: '\\dfrac{7^{5}}{7^{2}}' },
  b: { b: '(-3)', m: 8, n: 5, head: '\\dfrac{(-3)^{8}}{(-3)^{5}}', frac: '\\dfrac{(-3)^{8}}{(-3)^{5}}' },
  c: { b: 'x', m: 9, n: 4, head: 'x^{9}\\div x^{4}', frac: '\\dfrac{x^{9}}{x^{4}}' },
  d: { b: 'y', m: 10, n: 6, head: '\\dfrac{y^{10}}{y^{6}}', frac: '\\dfrac{y^{10}}{y^{6}}' }
};
const lab = (s) => tex(s.replace(/\\dfrac/g, '\\tfrac'));
const cancel = cancelDef('Cancel the factors in pairs', CAN, [{ v: 'n1', label: lab(CAN.n1.head) }, { v: 'n2', label: lab(CAN.n2.head) }, { sep: 'Example 1 check:' }, ...['a', 'b', 'c', 'd'].map((k) => ({ v: k, label: lab(CAN[k].head) }))]);
const CD = {
  n1: { a: 8, c: 2, b: 'y', m: 6, n: 2, head: '8y^{6}\\div2y^{2}', frac: '\\dfrac{8y^{6}}{2y^{2}}' },
  a: { a: 12, c: 4, b: 'x', m: 5, n: 2, head: '12x^{5}\\div4x^{2}', frac: '\\dfrac{12x^{5}}{4x^{2}}' },
  b: { a: 20, c: 5, b: 'y', m: 8, n: 3, head: '\\dfrac{20y^{8}}{5y^{3}}', frac: '\\dfrac{20y^{8}}{5y^{3}}' },
  c: { a: 18, c: 6, b: 'a', m: 9, n: 4, head: '18a^{9}\\div6a^{4}', frac: '\\dfrac{18a^{9}}{6a^{4}}' }
};
const coefDiv = cancelDef('Numbers divide, letters cancel', CD, [{ v: 'n1', label: lab(CD.n1.head) }, { sep: 'Example 2 check:' }, ...['a', 'b', 'c'].map((k) => ({ v: k, label: lab(CD[k].head) }))]);

/* ================= 3. Power of a Power: n copies of a^m, stacked in rows ================= */
const POW = {
  n1: ['2', 3, 2], n2: ['4', 2, 2],
  e3a: ['3', 2, 3], e3b: ['2', 3, 2], e3c: ['x', 4, 3], e3d: ['y', 2, 5],
  e4a: ['2', 4, 2], e4b: ['6', 2, 2], e4c: ['p', 5, 3], e4d: ['q', 3, 6]
};
const ppT = (k) => { const [b, m, n] = POW[k]; return `\\left(${b}^{${m}}\\right)^{${n}}`; };
const copies = {
  title: 'Copies of a power',
  height: 440,
  minW: 880,
  // (2³)² from the Section 3 note is now Example 3(b), so it is replayed only under “Example 3 check”
  choices: [{ v: 'n2', label: tex(ppT('n2')) }, { sep: 'Example 3 check:' }, ...['e3a', 'e3b', 'e3c', 'e3d'].map((v) => ({ v, label: tex(ppT(v)) })),
    { sep: 'Example 4 check:' }, ...['e4a', 'e4b', 'e4c', 'e4d'].map((v) => ({ v, label: tex(ppT(v)) }))],
  intro: (k) => { const [b, m, n] = POW[k]; return `The outer exponent ${tex(String(n))} says how many <b>copies</b> of ${tex(`${b}^{${m}}`)} to multiply.${k === 'n2' ? ' (The warm-up: a crate is a box of boxes!)' : ''}`; },
  make(stage, key, ex) {
    const W = ex.W, [b, m, n] = POW[key], mn = m * n, bv = bnum(b), val = bv != null ? Math.pow(bv, mn) : null;
    const TS = n >= 5 ? 44 : n === 4 ? 54 : 62, ST = TS + 8, RH = TS + 14, gx = 120, gy = 48 + (6 - Math.max(n, 3)) * 8;
    const rows = [];
    for (let r = 0; r < n; r++) {
      const y = gy + r * RH;
      const box = add(stage, h('div', 'u2l2-rowbox'), gx - 6, y - 5); box.style.width = (m * ST + 4) + 'px'; box.style.height = (TS + 10) + 'px';
      const lb = add(stage, h('div', 'u2l2-rowlab', K(`${b}^{${m}}`)), gx - 14, y + TS / 2);
      const tiles = Array.from({ length: m }, (_, i) => { const t = add(stage, h('div', 'u2l2-xt va', K(b)), gx + i * ST, y); t.style.width = TS + 'px'; t.style.height = TS + 'px'; t.style.fontSize = (TS * 0.5) + 'px'; return t; });
      hide(box, lb, ...tiles); rows.push({ box, lb, tiles });
    }
    const gw = m * ST - 8, gh = n * RH - 14;
    const bh = add(stage, h('div', 'u2l2-braceh'), gx, gy - 12); bh.style.width = gw + 'px';
    const bhl = add(stage, h('div', 'u2l2-blab'), gx + gw / 2, gy - 16); bhl.innerHTML = `${m} factor${m > 1 ? 's' : ''} each`;
    const bvb = add(stage, h('div', 'u2l2-bracev'), gx + gw + 10, gy); bvb.style.height = gh + 'px';
    const bvl = add(stage, h('div', 'u2l2-blab v'), gx + gw + 28, gy + gh / 2); bvl.innerHTML = `${n} copies`;
    hide(bh, bhl, bvb, bvl);
    const px = Math.max(gx + gw + 120, 470), panel = add(stage, h('div', 'u2l2-panel'), px, 24); panel.style.width = (W - px - 16) + 'px';
    panel.innerHTML = `<div class="u2l2-pexpr">${K(ppT(key))}</div>`;
    const row = (html, cls = '') => { const e = h('div', 'u2l2-prow ' + cls, html); panel.appendChild(e); hide(e); return e; };
    const rProd = row(K(`=${Array(n).fill(`${b}^{${m}}`).join('\\times ')}`)); rProd.style.fontSize = n >= 5 ? '19px' : '22px';
    const rCnt = row(`<span class="u2l2-pk">factors</span>${K(`${n}\\times${m}=${mn}`)}`);
    const rRes = row(K(`=${b}^{${mn}}`), 'res');
    const rVal = val != null ? row(K(`=${T(val)}`), 'val') : null;
    const law = add(stage, h('div', 'u2l2-law', `<b>Power of a Power</b>${K('\\left(a^{m}\\right)^{n}=a^{mn}')}`), px, 340); hide(law);
    const steps = [{
      cap: `${tex(ppT(key))} means <b>${WORD[n]} copies</b> of ${tex(`${b}^{${m}}`)} multiplied together. Stack the copies in rows.`,
      run: async (c) => {
        await Promise.all(rows.map((R, r) => Promise.all([c.fadeIn(R.box, 300, { delay: r * 160 }), c.fadeIn(R.lb, 300, { delay: r * 160 }), ...R.tiles.map((t, i) => c.pop(t, 280, { delay: r * 160 + i * 50 }))])));
        await c.fadeIn(rProd, 350);
      }
    }, {
      cap: `Each copy has <b>${m}</b> factor${m > 1 ? 's' : ''} of ${tex(b)}, and there are <b>${n}</b> copies: ${tex(`${n}\\times${m}=${mn}`)} factors in all. It’s a rectangle of factors!`,
      run: (c) => Promise.all([c.fadeIn(bh, 300), c.fadeIn(bhl, 300), c.fadeIn(bvb, 300, { delay: 200 }), c.fadeIn(bvl, 300, { delay: 200 }), c.fadeIn(rCnt, 350, { delay: 400 })])
    }, {
      cap: `So ${tex(`${ppT(key)}=${b}^{${mn}}`)}.${val != null ? ` Evaluate: ${tex(`${b}^{${mn}}=${T(val)}`)}.` : ''}`,
      run: (c) => Promise.all([c.fadeIn(rRes, 400), rVal ? c.fadeIn(rVal, 400, { delay: 300 }) : null, ...rows.flatMap((R) => R.tiles).map((t, i) => { t.classList.add('lit'); return c.anim(t, [{ transform: 'scale(1)' }, { transform: 'scale(1.12)' }, { transform: 'scale(1)' }], 300, { delay: i * 25 }); })])
    }, {
      cap: '<b>Power of a Power:</b> keep the base and <b>multiply</b> the exponents. (The Product Law <b>adds</b> them. Don’t mix them up!)',
      run: (c) => c.pop(law, 420)
    }];
    return steps;
  }
};

/* ================= 3. Check with numbers: brackets first, the law, and the "add" mistake ================= */
const CHK = { n2: ['2', 2, 3], e3a: ['3', 2, 3], e3b: ['2', 3, 2], e4a: ['2', 4, 2] };
const ckT = (k) => { const [b, m, n] = CHK[k]; return `\\left(${b}^{${m}}\\right)^{${n}}`; };
const check = {
  title: 'Check it with numbers',
  height: 330,
  minW: 900,
  choices: [{ v: 'n2', label: tex(ckT('n2')) }, { sep: 'Example 3 check:' }, { v: 'e3a', label: tex(ckT('e3a')) }, { v: 'e3b', label: tex(ckT('e3b')) }, { sep: 'Example 4 check:' }, { v: 'e4a', label: tex(ckT('e4a')) }],
  intro: (k) => `Three ways to work out ${tex(ckT(k))}. Which ones agree?`,
  make(stage, key, ex) {
    const W = ex.W, [b, m, n] = CHK[key], bv = +b, inner = Math.pow(bv, m), v = Math.pow(inner, n), wrong = Math.pow(bv, m + n), cw = (W - 60) / 3, cy = 14;
    const card = (i, head) => {
      const el = add(stage, h('div', 'u2l2-ck', `<div class="u2l2-ckh">${head}</div><div class="u2l2-cke">${K(ckT(key))}</div><div class="u2l2-cks"></div><div class="u2l2-ckv"></div><div class="u2l2-ckn"></div>`), 20 + i * (cw + 10), cy);
      el.style.width = cw + 'px'; return { el, s: el.querySelector('.u2l2-cks'), v: el.querySelector('.u2l2-ckv'), n: el.querySelector('.u2l2-ckn') };
    };
    const A = card(0, 'Brackets first'), B = card(1, 'The law: multiply'), C = card(2, 'Mistake: add');
    A.s.innerHTML = K(`=(${T(inner)})^{${n}}`) + '<br>' + K(`=${Array(n).fill(T(inner)).join('\\times')}`);
    A.v.innerHTML = K(`=\\boldsymbol{${T(v)}}`);
    B.s.innerHTML = K(`=${b}^{${m}\\times${n}}`) + '<br>' + K(`=${b}^{${m * n}}`); B.v.innerHTML = K(`=\\boldsymbol{${T(v)}}`);
    C.s.innerHTML = K(`=${b}^{${m}+${n}}`) + '<br>' + K(`=${b}^{${m + n}}`); C.v.innerHTML = K(`=\\boldsymbol{${T(wrong)}}`);
    C.n.innerHTML = `Adding is the Product Law, for ${K(`${b}^{${m}}\\times${b}^{${n}}`)}.`;
    hide(A.s, A.v, B.s, B.v, C.s, C.v, C.n);
    const st1 = add(stage, h('div', 'u2l2-stamp ok', '✓'), 20 + 2 * cw + 10 - 58, cy + 30), st2 = add(stage, h('div', 'u2l2-stamp no', '✗'), 20 + 3 * cw + 20 - 58, cy + 30); hide(st1, st2);
    return [{
      cap: `Work <b>inside the brackets first</b>: ${tex(`${b}^{${m}}=${T(inner)}`)}. Then ${tex(`${T(inner)}^{${n}}=${T(v)}`)}.`,
      run: (c) => Promise.all([c.fadeIn(A.s, 380), c.pop(A.v, 400, { delay: 300 })])
    }, {
      cap: `Now the <b>Power of a Power Law</b>: ${tex(`${b}^{${m}\\times${n}}=${b}^{${m * n}}=${T(v)}`)}. The <b>same</b> value ✓.`,
      run: async (c) => { await Promise.all([c.fadeIn(B.s, 380), c.pop(B.v, 400, { delay: 300 })]); A.el.classList.add('good'); B.el.classList.add('good'); await stampIn(c, st1); }
    }, {
      cap: `A common mistake is to <b>add</b> the exponents: ${tex(`${b}^{${m + n}}=${T(wrong)}`)}, not ${N(v)}. ✗ Adding is for multiplying two powers, not for a power of a power.`,
      run: async (c) => { await Promise.all([c.fadeIn(C.s, 380), c.pop(C.v, 400, { delay: 300 }), c.fadeIn(C.n, 300, { delay: 400 })]); C.el.classList.add('bad'); await stampIn(c, st2); }
    }];
  }
};

/* ================= 3–4. Which law? and chains of laws ================= */
const LAWS = [['prod', 'Product: add', 'a^{m}\\times a^{n}=a^{m+n}'], ['quot', 'Quotient: subtract', 'a^{m}\\div a^{n}=a^{m-n}'], ['ppow', 'Power of a Power: multiply', '\\left(a^{m}\\right)^{n}=a^{mn}']];
function chainDef(title, map, choices, height) {
  return {
    title, height, minW: 900, choices,
    intro: (k) => map[k].intro || `Simplify ${tex(map[k].t)}, one step at a time. Which law does each step use?`,
    make(stage, key, ex) {
      const W = ex.W, d = map[key], bw = (W - 24 - 16) / 3, badges = {};
      LAWS.forEach(([k, name, f], i) => { const b = add(stage, h('div', 'u2l2-lc ' + k, `<b>${name}</b>${K(f)}`), 12 + i * (bw + 8), 12); b.style.width = bw + 'px'; badges[k] = b; });
      const tall = [d.t, ...d.lines.map((l) => l[0])].some((s) => /dfrac/.test(s)), lh = tall ? 98 : 66, ly = 104, nx = Math.round(W * 0.5), nw = W - nx - 16;
      const all = [[d.t, [], 'the question']].concat(d.lines);
      const rows = all.map(([t, , note], i) => {
        const el = add(stage, h('div', 'u2l2-cl' + (tall ? ' tall' : ''), K(t)), 20, ly + i * lh); el.style.height = (lh - 8) + 'px';
        const nn = add(stage, h('div', 'u2l2-cn', `<div>${note}</div>`), nx, ly + i * lh); nn.style.width = nw + 'px'; nn.style.height = (lh - 8) + 'px';
        if (i) hide(el, nn); else nn.classList.add('start');
        return { el, nn };
      });
      const light = (c, ks) => Promise.all(LAWS.map(([k]) => { const on = ks.includes(k), b = badges[k], was = b.classList.contains('on'); b.classList.toggle('on', on); return on && !was ? c.anim(b, [{ transform: 'scale(1)' }, { transform: 'scale(1.06)' }, { transform: 'scale(1)' }], 380) : null; }));
      return d.lines.map(([, laws, , cap], j) => ({
        cap,
        run: async (c) => {
          const r = rows[j + 1], last = j === d.lines.length - 1;
          rows.forEach((x) => x.el.classList.remove('now'));
          r.el.classList.add('now'); if (last) r.el.classList.add('final');
          await Promise.all([light(c, laws), c.fadeIn(r.el, 420, { from: 'translateY(-10px)' }), c.fadeIn(r.nn, 380, { delay: 200, from: 'translateX(10px)' })]);
        }
      }));
    }
  };
}
const WH = {
  w1: { t: '5^{4}\\times5^{3}', lines: [
    ['=5^{4+3}', ['prod'], 'same base, <b>multiplied</b>: add', `Same base, <b>multiplied</b>: the <b>Product Law</b>. Keep the 5 and add the exponents.`],
    ['=5^{7}', [], '4 + 3 = 7', `${tex('4+3=7')}, so ${tex('5^{4}\\times5^{3}=5^{7}')}.`]] },
  w2: { t: '\\dfrac{k^{12}}{k^{3}}', lines: [
    ['=k^{12-3}', ['quot'], 'same base, <b>divided</b>: subtract', `Same base, <b>divided</b>: the <b>Quotient Law</b>. Top exponent minus bottom exponent.`],
    ['=k^{9}', [], '12 − 3 = 9', `${tex('12-3=9')}, so the answer is ${tex('k^{9}')}.`]] },
  w3: { t: '\\left(m^{4}\\right)^{5}', lines: [
    ['=m^{4\\times5}', ['ppow'], 'a power in brackets, raised to a power: multiply', `A power in brackets, raised to another power: the <b>Power of a Power Law</b>. Multiply the exponents.`],
    ['=m^{20}', [], '5 copies of 4 factors', `Five copies of four factors: ${tex('4\\times5=20')}. So ${tex('m^{20}')}.`]] },
  w4: { t: '\\left(2^{5}\\right)^{2}', lines: [
    ['=2^{5\\times2}', ['ppow'], 'multiply, don’t add', `Power of a power: <b>multiply</b>, ${tex('5\\times2')}. (Adding would give ${tex('2^{7}')}: wrong!)`],
    ['=2^{10}', [], '5 × 2 = 10', `${tex('5\\times2=10')}.`],
    ['=1\\,024', [], '2 × 2 × … ten times', `Evaluate: ten factors of 2 make ${tex('1\\,024')}.`]] },
  w5: { t: 'd^{7}\\times d^{2}\\div d^{4}', lines: [
    ['=d^{7+2-4}', ['prod', 'quot'], 'add for ×, subtract for ÷', `Two laws in one line: <b>add</b> the exponent you multiply by, <b>subtract</b> the one you divide by.`],
    ['=d^{5}', [], '7 + 2 − 4 = 5', `${tex('7+2-4=5')}, so the answer is ${tex('d^{5}')}.`]] }
};
const which = chainDef('Add, subtract or multiply?', WH, Object.keys(WH).map((k) => ({ v: k, label: lab(WH[k].t) })), 404);
const CH = {
  n1: { t: '\\left(k^{4}\\right)^{2}\\div k^{5}', lines: [
    ['=k^{8}\\div k^{5}', ['ppow'], 'brackets first: multiply', `<b>Brackets first.</b> Power of a Power: ${tex('\\left(k^{4}\\right)^{2}=k^{4\\times2}=k^{8}')}.`],
    ['=k^{8-5}', ['quot'], 'then subtract', `Now the <b>Quotient Law</b>: subtract the exponents, ${tex('8-5')}.`],
    ['=k^{3}', [], 'simplest form', `So ${tex('\\left(k^{4}\\right)^{2}\\div k^{5}=k^{3}')}.`]] },
  n2: { t: '\\left(5^{2}\\right)^{2}\\div5^{3}', lines: [
    ['=5^{4}\\div5^{3}', ['ppow'], 'brackets first: multiply', `<b>Brackets first:</b> ${tex('\\left(5^{2}\\right)^{2}=5^{2\\times2}=5^{4}')}.`],
    ['=5^{4-3}=5^{1}', ['quot'], 'then subtract', `<b>Quotient Law:</b> ${tex('4-3=1')}.`],
    ['=5', [], 'any number to the power 1 is itself', `${tex('5^{1}=5')}: one factor of 5.`]] },
  a: { t: '\\dfrac{\\left(x^{3}\\right)^{4}}{x^{5}}', lines: [
    ['=\\dfrac{x^{12}}{x^{5}}', ['ppow'], 'top first: multiply', `<b>Top first.</b> Power of a Power: ${tex('\\left(x^{3}\\right)^{4}=x^{3\\times4}=x^{12}')}.`],
    ['=x^{12-5}', ['quot'], 'then subtract', `Now the <b>Quotient Law</b>: ${tex('12-5')}.`],
    ['=x^{7}', [], 'simplest form', `So the answer is ${tex('x^{7}')}.`]] },
  b: { t: '\\left(2^{2}\\right)^{3}\\div2^{4}', lines: [
    ['=2^{6}\\div2^{4}', ['ppow'], 'brackets first: multiply', `<b>Brackets first:</b> ${tex('\\left(2^{2}\\right)^{3}=2^{2\\times3}=2^{6}')}.`],
    ['=2^{6-4}=2^{2}', ['quot'], 'then subtract', `<b>Quotient Law:</b> ${tex('6-4=2')}.`],
    ['=4', [], 'evaluate', `${tex('2^{2}=2\\times2=4')}.`]] },
  c: { t: '\\dfrac{\\left(a^{2}\\right)^{5}}{\\left(a^{3}\\right)^{2}}', lines: [
    ['=\\dfrac{a^{10}}{a^{6}}', ['ppow'], 'both brackets first: multiply', `<b>Both brackets first.</b> Top: ${tex('a^{2\\times5}=a^{10}')}. Bottom: ${tex('a^{3\\times2}=a^{6}')}.`],
    ['=a^{10-6}', ['quot'], 'then subtract', `Now the <b>Quotient Law</b>: ${tex('10-6')}.`],
    ['=a^{4}', [], 'simplest form', `So the answer is ${tex('a^{4}')}.`]] }
};
const chain = chainDef('Brackets first, then divide', CH, [{ v: 'n1', label: lab(CH.n1.t) }, { v: 'n2', label: lab(CH.n2.t) }, { sep: 'Example 5 check:' }, ...['a', 'b', 'c'].map((k) => ({ v: k, label: '(' + k + ')' }))], 510);

/* ================= warm-up: Boxes Inside Boxes ================= */
function packed(n, cell) {
  const S = n * cell, svg = svgEl('svg', { width: S + 6, height: S + 6, viewBox: `-3 -3 ${S + 6} ${S + 6}` });
  if (n > 2) for (let i = 0; i < n / 4; i++) for (let j = 0; j < n / 4; j++) {
    svgEl('rect', { x: 4 * i * cell, y: 4 * j * cell, width: 4 * cell, height: 4 * cell, class: (i + j) % 2 ? 'u2l2-bxb' : 'u2l2-bxa' }, svg);
    svgEl('rect', { x: 4 * i * cell, y: 4 * j * cell, width: 4 * cell, height: 4 * cell, class: 'u2l2-bxl' }, svg);
  }
  for (let i = 0; i < n / 2; i++) for (let j = 0; j < n / 2; j++) svgEl('rect', { x: (2 * i + 0.1) * cell, y: (2 * j + 0.1) * cell, width: 1.8 * cell, height: 1.8 * cell, rx: cell * 0.2, class: 'u2l2-pk' }, svg);
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) svgEl('circle', { cx: (i + 0.5) * cell, cy: (j + 0.5) * cell, r: cell * 0.3, class: 'u2l2-cd' }, svg);
  if (n > 8) for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) svgEl('rect', { x: 8 * i * cell, y: 8 * j * cell, width: 8 * cell, height: 8 * cell, class: 'u2l2-cs' }, svg);
  if (n > 4) svgEl('rect', { x: 0, y: 0, width: S, height: S, class: n > 8 ? 'u2l2-cr' : 'u2l2-cs' }, svg);
  if (n > 8) { let k = 0; for (let j = 0; j < n / 4; j++) for (let i = 0; i < n / 4; i++) { const t = svgEl('text', { x: (4 * i + 2) * cell, y: (4 * j + 2) * cell + 5, 'text-anchor': 'middle', class: 'u2l2-bn' }, svg); t.textContent = ++k; } }
  return svg;
}
function mountCandy() {
  const host = document.getElementById('u2l2-candy'); if (!host) return;
  const items = [[2, 13, '1 pack', '= 4 candies', '4 candies'], [4, 12, '1 box', '= 4 packs', '16 candies'], [8, 11, '1 case', '= 4 boxes', 64], [16, 10.5, '1 crate', '= 4 cases', 256]];
  const row = h('div', 'u2l2-crow');
  items.forEach(([n, cell, name, sub, cnt], i) => {
    if (i) row.appendChild(h('div', 'u2l2-arr', '×4 →'));
    const it = h('div', 'u2l2-cit' + (n === 16 ? ' crate' : ''));
    it.appendChild(packed(n, cell));
    it.appendChild(h('div', 'u2l2-cname', name)); it.appendChild(h('div', 'u2l2-csub', sub));
    it.appendChild(h('div', 'u2l2-ccnt', typeof cnt === 'number' ? `<span data-reveal="? candies"><b>${cnt} candies</b></span>` : cnt));
    row.appendChild(it);
  });
  host.appendChild(row);
  const btn = document.getElementById('u2l2-nums');
  if (btn) btn.addEventListener('click', () => { const on = host.querySelector('.crate').classList.toggle('nums'); btn.textContent = on ? 'Hide the box numbers' : 'Number the boxes in the crate'; });
}

/* ============ wiring ============ */
const DEFS = { cancel, coefDiv, copies, check, which, chain };
mountCandy();
document.querySelectorAll('[data-explainer]').forEach((el) => new Explainer(el, DEFS[el.dataset.explainer]));

/* ============ Stand Up Break! — the Quotient Law and Power of a Power at the whiteboards ============ */
standup('u2l2', (() => {
  const LET = ['a', 'b', 'c', 'd', 'k', 'm', 'n', 'p', 'q', 'r', 't', 'w', 'x', 'y', 'z'];
  const par = (b) => (b < 0 ? `(${b})` : String(b));
  // Assignment 2 items (and the examples), so the whiteboards don't give them away
  const SKIP = new Set(['5,6,3', '8,5,2', '-4,7,5', '2,9,4', '6,7,4', '9,5,3', '7,5,2', '-3,8,5', 'P4,2,3', 'P2,3,3', 'P3,2,2', 'P2,2,4', 'P5,2,2', 'P7,2,2', 'P3,2,3', 'P2,3,2', 'P2,4,2', 'P6,2,2']);
  const LIM = { 2: 6, 3: 4, 4: 3, 5: 3, 10: 5, '-2': 5, '-3': 4, 6: 2, 7: 2, 8: 2, 9: 2 };
  const fracOrDiv = (r, top, bot) => (r.chance(0.5) ? `\\dfrac{${top}}{${bot}}` : `${top}\\div ${bot}`);
  return {
    intro: 'Simplify at your whiteboard station, no calculator. Same base: subtract to divide; a power of a power: multiply.',
    levels: {
      BEG: (r) => { // the Quotient Law: a number base (then evaluate) or a letter base
        if (r.chance(0.55)) {
          let b, m, n;
          do { b = r.pick([2, 2, 3, 4, 5, 10, -2, -3, 6, 7, 8, 9]); n = r.int(2, 6); m = n + r.int(1, LIM[b]); } while (SKIP.has(`${b},${m},${n}`));
          const k = m - n, B = par(b);
          return { text: 'Simplify with the Quotient Law, then evaluate.', q: fracOrDiv(r, `${B}^{${m}}`, `${B}^{${n}}`), a: [`=${B}^{${m}-${n}}=${pw(B, k)}`, `=${T(Math.pow(b, k))}`] };
        }
        const v = r.pick(LET), n = r.int(2, 7), m = n + r.int(2, 8);
        return { text: 'Simplify.', q: fracOrDiv(r, `${v}^{${m}}`, `${v}^{${n}}`), a: [`=${v}^{${m}-${n}}`, `=${pw(v, m - n)}`] };
      },
      PRG: (r) => {
        if (r.chance(0.5)) { // divide the numbers, subtract the exponents
          let q, c, m, n, v;
          do { q = r.int(2, 6); c = r.int(2, 9); n = r.int(1, 5); m = n + r.int(1, 6); v = r.pick(LET); } while ([[15, 3], [24, 6], [21, 7], [16, 4], [12, 4], [20, 5], [18, 6], [8, 2]].some(([x, y]) => x === q * c && y === c));
          return { text: 'Simplify.', q: fracOrDiv(r, `${q * c}${pw(v, m)}`, `${c}${pw(v, n)}`), a: [`=(${q * c}\\div${c})\\,${v}^{${m}-${n}}`, `=${q}${pw(v, m - n)}`] };
        }
        if (r.chance(0.5)) { // power of a power, letters
          const v = r.pick(LET), m = r.int(2, 7), n = r.int(2, 6);
          return { text: 'Simplify.', q: `\\left(${v}^{${m}}\\right)^{${n}}`, a: [`=${v}^{${m}\\times${n}}`, `=${v}^{${m * n}}`] };
        }
        let b, m, n;
        do { b = r.pick([2, 2, 2, 3, 4, 5]); m = r.int(2, 4); n = r.int(2, 4); } while (Math.pow(b, m * n) > 4096 || SKIP.has(`P${b},${m},${n}`));
        return { text: 'Simplify with the Power of a Power Law, then evaluate.', q: `\\left(${b}^{${m}}\\right)^{${n}}`, a: [`=${b}^{${m}\\times${n}}=${b}^{${m * n}}`, `=${T(Math.pow(b, m * n))}`] };
      },
      MAS: (r) => { // both laws: brackets first, then subtract
        const v = r.pick(LET), kind = r.int(0, 2);
        if (kind === 0) {
          let m, n, p; do { m = r.int(2, 5); n = r.int(2, 4); p = r.int(2, 9); } while (p >= m * n || (m === 3 && n === 4 && p === 5) || (m === 2 && n === 4 && p === 3));
          return { text: 'Simplify.', q: `\\dfrac{\\left(${v}^{${m}}\\right)^{${n}}}{${v}^{${p}}}`, a: [`=\\dfrac{${v}^{${m * n}}}{${v}^{${p}}}`, `=${v}^{${m * n}-${p}}=${pw(v, m * n - p)}`] };
        }
        if (kind === 1) {
          let a, b, c, d; do { a = r.int(2, 5); b = r.int(2, 4); c = r.int(1, 4); d = r.int(2, 3); } while (c * d >= a * b || [[2, 5, 3, 2], [4, 3, 2, 2]].some((x) => x.join() === [a, b, c, d].join()));
          return { text: 'Simplify.', q: `\\dfrac{\\left(${v}^{${a}}\\right)^{${b}}}{${c === 1 ? v : `\\left(${v}^{${c}}\\right)`}^{${d}}}`, a: [`=\\dfrac{${v}^{${a * b}}}{${v}^{${c * d}}}`, `=${v}^{${a * b}-${c * d}}=${pw(v, a * b - c * d)}`] };
        }
        let b, m, n, p; do { b = r.pick([2, 3, 5, 10]); m = r.int(2, 3); n = r.int(2, 3); p = m * n - r.int(1, b === 2 ? 4 : 2); } while (p < 1 || (b === 2 && m === 2 && n === 3 && p === 4) || (b === 3 && m === 3 && n === 2 && p === 4));
        const k = m * n - p;
        return { text: 'Simplify, then evaluate.', q: `\\left(${b}^{${m}}\\right)^{${n}}\\div${pw(b, p)}`, a: [`=${b}^{${m * n}}\\div${pw(b, p)}`, `=${b}^{${m * n}-${p}}=${pw(b, k)}`, `=${T(Math.pow(b, k))}`] };
      }
    }
  };
})());
