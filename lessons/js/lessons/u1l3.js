/* Math 15 · Unit 1 · Lesson 3 — Prime Factorization, GCF, and LCM: the explainers, the "Blink Together" warm-up,
 * the factor tree, the Euclid history box and the Stand Up Break. Most explainers are adapted from the Math 10C
 * Unit 1 Lessons 1 and 2 pages (same engine); classes used only here are prefixed u1l3-. */
import { h, fmt, Explainer, FactorTree, factors, isPrime, primeFactors, primesUpTo, productHTML, expHTML, quickReason } from '../explain.js';
import { tex } from '../tex.js';
import { standup } from '../standup.js';

const at = (el, x, y) => { el.style.left = x + 'px'; el.style.top = y + 'px'; return el; };
const add = (stage, el, x, y) => { stage.appendChild(at(el, x, y)); return el; };
const plural = (k, w) => k + ' ' + w + (k === 1 ? '' : 's');
const parse = (v) => String(v).split(',').map(Number);
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
const lcm = (a, b) => (a / gcd(a, b)) * b;
const listAnd = (arr) => (arr.length < 2 ? arr.join('') : arr.slice(0, -1).join(', ') + ' and ' + arr[arr.length - 1]);
const nameList = (ns) => listAnd(ns.map(fmt));
const WORD = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
const remText = (m, q) => `${fmt(m)} ÷ ${q} = ${fmt(Math.floor(m / q))} R ${m % q}`; // no calculator in Unit 1: remainders, not decimals

/* ============ 1. Factors make rectangles ============ */
const rectangles = {
  title: 'Prime or composite? Make rectangles',
  height: 420,
  minW: 940, // drawn this wide and scaled to fit beside the sidebar
  choices: [12, 7, 20, 13, 16, { sep: 'Example 1 check:' }, 27, 34, 43, 49],
  intro: (n) => `Here are <b>${n}</b> square tiles. Arrange <b>all</b> of them into equal rows to make a rectangle. Each rectangle that works is a <b>factor pair</b> of ${n}.`,
  make(stage, n, ex) {
    const W = ex.W, H = 420, pw = W < 760 ? 190 : 240, ax = 86, ay = 22, aw = W - pw - ax - 32, ah = H - 48; // room on the left for the “7 rows” label
    const panel = add(stage, h('div', 'rt-panel', '<div class="rt-h">Rows tried</div>'), W - pw - 14, 14);
    panel.style.width = pw + 'px'; panel.style.height = (H - 28) + 'px';
    const list = h('div', 'rt-list'); panel.appendChild(list);
    const sum = h('div', 'rt-sum'); panel.appendChild(sum);
    const stamp = add(stage, h('div', 'pd-stamp u1l3-stamp'), W - pw - 30, 16); stamp.style.opacity = 0; stamp.style.translate = '-100% 0';
    const dimL = add(stage, h('div', 'rt-dim'), 0, 0), dimT = add(stage, h('div', 'rt-dim'), 0, 0), lefty = add(stage, h('div', 'rt-dim red'), 0, 0);
    [dimL, dimT, lefty].forEach((d) => (d.style.opacity = 0));
    const tiles = [];
    const cols0 = Math.ceil(Math.sqrt(n)), s0 = Math.min(34, aw / (cols0 + 1)), gx = ax + (aw - cols0 * s0) / 2, gy = ay + (ah - Math.ceil(n / cols0) * s0) / 2;
    for (let i = 0; i < n; i++) {
      const t = h('div', 'tile'), r = Math.round((Math.sin(i * 12.9898) * 43758.5453 % 1) * 24 - 12);
      const x = gx + (i % cols0) * s0 + (i * 7 % 5) - 2, y = gy + Math.floor(i / cols0) * s0 + (i * 3 % 5) - 2;
      t.style.width = t.style.height = s0 * 0.86 + 'px'; t._t = `translate(${x}px, ${y}px) rotate(${r}deg)`; t.style.transform = t._t;
      stage.appendChild(t); tiles.push(t);
    }
    async function arrange(c, d) {
      const q = Math.floor(n / d), r = n - d * q, cols = q + (r ? 1.7 : 0);
      const cell = Math.min(40, aw / cols, (ah - 10) / d), sz = cell * 0.86;
      const x0 = ax + (aw - cols * cell) / 2 + 10, y0 = ay + (ah - d * cell) / 2 + 8;
      const jobs = tiles.map((t, i) => {
        let x, y, left = false;
        if (i < d * q) { x = x0 + (i % q) * cell; y = y0 + Math.floor(i / q) * cell; } else { const j = i - d * q; x = x0 + (q + 0.7) * cell; y = y0 + j * cell; left = true; }
        const to = `translate(${x}px, ${y}px) rotate(0deg)`, from = t._t; t._t = to;
        t.classList.toggle('left', left); t.classList.toggle('good', !r);
        return c.anim(t, [{ transform: from, width: t.style.width, height: t.style.height }, { transform: to, width: sz + 'px', height: sz + 'px' }], 650, { delay: Math.min(i * 8, 260) });
      });
      dimL.innerHTML = plural(d, 'row'); dimT.innerHTML = q + ' in each row';
      at(dimL, x0 - 12, y0 + d * cell / 2); at(dimT, x0 + q * cell / 2, y0 - 16);
      dimL.style.translate = '-100% -50%'; dimT.style.translate = '-50% -50%';
      if (r) { lefty.innerHTML = r + ' left over'; at(lefty, x0 + (q + 0.7) * cell + cell / 2, y0 + r * cell + 14); lefty.style.translate = '-50% 0'; }
      await Promise.all([...jobs, c.anim(dimL, [{ opacity: 0 }, { opacity: 1 }], 300, { delay: 400 }), c.anim(dimT, [{ opacity: 0 }, { opacity: 1 }], 300, { delay: 400 }), c.anim(lefty, [{ opacity: r ? 0 : lefty.style.opacity || 0 }, { opacity: r ? 1 : 0 }], 300, { delay: 450 })]);
    }
    const steps = [], top = Math.floor(Math.sqrt(n));
    for (let d = 1; d <= top; d++) {
      const q = Math.floor(n / d), r = n % d;
      steps.push({
        cap: d === 1 ? `<b>1 row of ${n}.</b> This always works: 1 × ${n} = ${n}. Every whole number has <b>1</b> and <b>itself</b> as factors.`
          : r === 0 ? `<b>${d} rows of ${q}.</b> ${d} × ${q} = ${n}, nothing left over, so <b>${d}</b> and <b>${q}</b> are both factors.`
            : `<b>${d} rows?</b> ${d} rows of ${q} leaves <b class="red">${r} left over</b> (${n} ÷ ${d} = ${q} R${r}). ${d} is <b>not</b> a factor.`,
        run: async (c) => {
          const row = h('div', 'rt-row ' + (r ? 'no' : 'ok'), r ? `${d} rows <span>✗</span>` : `${d} × ${q} <span>✓</span>`);
          list.appendChild(row);
          await Promise.all([arrange(c, d), c.fadeIn(row, 300, { delay: 350 })]);
        }
      });
    }
    const nxt = top + 1;
    const pairs = []; for (let d = 1; d <= top; d++) if (n % d === 0 && d * d !== n) pairs.push([d, n / d]);
    const turn = pairs.length > 1 ? pairs[pairs.length - 1] : null, sq = top * top === n;
    steps.push({
      cap: () => {
        if (factors(n).length === 2) return `Only <b>one</b> rectangle works: a single row. ${n} has exactly two factors, 1 and ${n}, so <b>${n} is prime</b>.`;
        const fs = factors(n);
        return `${nxt} or more rows would just give a rectangle we already have, turned on its side. ${n} has <b>${plural(fs.length, 'factor')}</b>: more than two, so <b>${n} is composite</b>.`;
      },
      run: async (c) => {
        const fs = factors(n);
        sum.innerHTML = `<div class="rt-h">Factors of ${n}</div><div class="rt-fs">${fs.join(', ')}</div><div class="muted">${plural(fs.length, 'factor')}</div>`;
        stamp.className = 'pd-stamp u1l3-stamp ' + (fs.length === 2 ? 'prime' : 'comp'); stamp.innerHTML = fs.length === 2 ? 'PRIME' : 'COMPOSITE';
        await Promise.all([turn ? arrange(c, turn[1]) : arrange(c, sq ? top : 1), c.fadeIn(sum, 400), c.anim(stamp, [{ opacity: 0, transform: 'scale(1.8) rotate(-14deg)' }, { opacity: 1, transform: 'scale(1) rotate(-6deg)' }], 420, { delay: 300, easing: 'cubic-bezier(.2,1.4,.4,1)' })]);
      }
    });
    return steps;
  }
};

/* ============ 2. Sieve of Eratosthenes ============ */
const SIEVE_C = { 2: '#3b78d8', 3: '#e0841a', 5: '#8a58c9', 7: '#d0477a' };
const sieve = {
  title: 'Find every prime below 50 (the Sieve of Eratosthenes)',
  height: 300,
  intro: 'A Greek mathematician, Eratosthenes, found primes like this over 2000 years ago: circle a prime, then cross out its multiples, because they all have that prime as a factor.',
  make(stage, v, ex) {
    const W = ex.W, cell = Math.min(52, (W - 40) / 10), x0 = (W - cell * 10) / 2, y0 = 14, cells = [];
    for (let i = 1; i <= 50; i++) {
      const e = add(stage, h('div', 'sv', '<span>' + i + '</span>'), x0 + ((i - 1) % 10) * cell, y0 + Math.floor((i - 1) / 10) * cell);
      e.style.width = e.style.height = cell - 4 + 'px'; e.style.fontSize = cell * 0.38 + 'px'; cells[i] = e;
    }
    const cross = async (c, p) => {
      const ps = []; for (let m = p * 2; m <= 50; m += p) ps.push(m);
      for (const m of ps) {
        const e = cells[m];
        if (e.classList.contains('x')) { if (!c.fast) e.animate([{ transform: 'scale(1)' }, { transform: 'scale(.9)' }, { transform: 'scale(1)' }], 200); }
        else { e.classList.add('x'); e.style.setProperty('--xc', SIEVE_C[p]); if (!c.fast) e.animate([{ transform: 'scale(1.25)' }, { transform: 'scale(1)' }], 260); }
        await c.sleep(44);
      }
    };
    const circle = (c, p) => { cells[p].classList.add('p'); cells[p].style.setProperty('--pc', SIEVE_C[p]); return c.pop(cells[p], 360); };
    const steps = [{
      cap: '<b>1</b> has only one factor, so it is <b>neither prime nor composite</b>. Cross it out.',
      run: async (c) => { cells[1].classList.add('x', 'one'); await c.pop(cells[1], 300); }
    }];
    [[2, '<b>2</b> is prime (factors 1 and 2). Circle it, then cross out every multiple of 2 — they all have 2 as a factor. That removes <b>every other even number</b>, so 2 is the only even prime.'],
      [3, '<b>3</b> is the next number left, so it’s prime. Cross out the multiples of 3. Some (6, 12, 18 …) are already gone.'],
      [5, '<b>4</b> is gone, so the next prime is <b>5</b>. Cross out its multiples: everything ending in 5 or 0.'],
      [7, 'Next prime: <b>7</b>. 14, 21, 28, 35 and 42 are already gone. Only <b>49</b> (7 × 7) is new.']
    ].forEach(([p, cap]) => steps.push({ cap, run: async (c) => { await circle(c, p); await c.sleep(250); await cross(c, p); } }));
    steps.push({
      cap: 'The next number left is 11, but <b>11 × 11 = 121</b> is way past 50. Every composite number up to 50 is already crossed out. <b>Everything left is prime!</b>',
      run: async (c) => {
        const left = []; for (let i = 11; i <= 50; i++) if (!cells[i].classList.contains('x')) left.push(i);
        for (const i of left) { cells[i].classList.add('p', 'late'); if (!c.fast) cells[i].animate([{ transform: 'scale(1.3)' }, { transform: 'scale(1)' }], 300); await c.sleep(40); }
      }
    });
    steps.push({
      cap: 'There are <b>15 primes</b> below 50: <b>2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47</b>. The booklet’s blanks are 3, 7, 13, 19, 29, 37 and 43.',
      run: async (c) => {
        const ten = [3, 7, 13, 19, 29, 37, 43];
        for (const i of ten) { cells[i].classList.add('ten'); await c.pop(cells[i], 260); }
        stage.classList.add('sv-dim');
      }
    });
    return steps;
  }
};

/* ============ 4. Division ladder ============ */
const ladder = {
  title: 'Method 1: the division ladder',
  height: 380,
  choices: [52, 90, 60, 84, 45, { sep: 'Example 2 check:' }, 76],
  custom: [4, 999],
  intro: (n) => `Divide <b>${fmt(n)}</b> by the <b>smallest prime</b> that goes in evenly. Write the prime on the left and the answer underneath. Repeat until you reach 1.`,
  make(stage, n, ex) {
    const W = ex.W, H = 380, rungs = [];
    let m = n, start = 2;
    while (m > 1) {
      const pr = primesUpTo(Math.floor(Math.sqrt(m))).filter((q) => q >= start);
      const p = pr.find((q) => m % q === 0) || m;
      const tries = pr.filter((q) => q < p);
      rungs.push({ m, p, q: m / p, tries, start }); start = p; m = m / p;
    }
    const R = rungs.length, rh = Math.min(54, (H - 150) / (R + 1)), fs = Math.min(30, rh * 0.62);
    const lx = Math.min(W * 0.26, 210), y0 = 22;
    const nums = [], divs = [];
    const bar = add(stage, h('div', 'ld-bar'), lx + 6, y0 + 2); bar.style.height = '0px';
    const mk = (cls, txt, x, y) => { const e = add(stage, h('div', cls, txt), x, y); e.style.fontSize = fs + 'px'; e.style.height = rh + 'px'; e.style.lineHeight = rh + 'px'; return e; };
    nums.push(mk('ld-num', fmt(n), lx + 22, y0));
    const notes = add(stage, h('div', 'ld-notes'), lx + Math.max(190, W * 0.24), y0); notes.style.width = (W - lx - Math.max(190, W * 0.24) - 20) + 'px';
    const prod = add(stage, h('div', 'ld-prod'), 20, H - 72); prod.style.width = (W - 40) + 'px';
    const steps = [];
    rungs.forEach((r, i) => {
      const fails = r.tries.length > 5 ? r.tries.slice(0, 4) : r.tries, skipped = r.tries.length > 5;
      const reason = (q) => quickReason(r.m, q) || remText(r.m, q);
      const isSelf = r.p === r.m, nextP = primesUpTo(Math.floor(Math.sqrt(r.m)) + 12).find((q) => q * q > r.m);
      steps.push({
        cap: (fails.length ? `Try the smallest primes on <b>${fmt(r.m)}</b>: ${fails.map((q) => `not ${q} (${reason(q)})`).join(', ')}${skipped ? ', …' : ''}. ` : '')
          + (isSelf ? (r.tries.length ? `${nextP} × ${nextP} = ${nextP * nextP} is already bigger than ${fmt(r.m)}, so <b>${fmt(r.m)} is prime</b>: divide it by itself. ` : `<b>${fmt(r.m)}</b> is prime, so divide it by itself: `)
            : `<b>${r.p}</b> works${quickReason(r.m, r.p) ? ' (' + quickReason(r.m, r.p) + ')' : ''}: `)
          + `${fmt(r.m)} ÷ ${fmt(r.p)} = <b>${fmt(r.q)}</b>.`,
        run: async (c) => {
          notes.innerHTML = '';
          const ls = r.start > 2 ? [`<span class="muted">Start with the last prime used: ${r.start}</span>`] : [];
          ls.push(...fails.map((q) => `<span class="muted">${fmt(r.m)} ÷ ${q}?</span> ${reason(q)} <b class="red">✗</b>`));
          if (skipped) ls.push('<span class="muted">… no smaller prime works</span>');
          ls.push(`<span class="muted">${fmt(r.m)} ÷ ${fmt(r.p)}?</span> ${quickReason(r.m, r.p) || (isSelf ? 'it’s prime' : '')} <b class="ok">✓</b>`);
          ls.push(`<b>${fmt(r.m)} ÷ ${fmt(r.p)} = ${fmt(r.q)}</b>`);
          const els = ls.map((t) => { const e = h('div', 'ld-note', t); notes.appendChild(e); e.style.opacity = 0; return e; });
          for (let k = 0; k < els.length; k++) await c.fadeIn(els[k], 260, { from: 'translateX(-10px)' });
          const y = y0 + i * rh, d = mk('ld-div', fmt(r.p), lx - 8, y); d.style.translate = '-100% 0'; divs.push(d);
          const qn = mk('ld-num', fmt(r.q), lx + 22, y + rh); nums.push(qn);
          await Promise.all([c.pop(d, 380), c.anim(bar, [{ height: bar.style.height }, { height: (i + 2) * rh - 4 + 'px' }], 400), c.anim(qn, [{ opacity: 0, transform: 'translateY(-' + rh + 'px)' }, { opacity: 1, transform: 'none' }], 500, { delay: 200 })]);
        }
      });
    });
    const ps = rungs.map((r) => r.p), rep = new Set(ps).size < ps.length;
    steps.push({
      cap: `The bottom number is <b>1</b>, so we’re done. The prime factors are the numbers <b>down the left side</b>: ${fmt(n)} = <b>${productHTML(ps)}</b>.`,
      run: async (c) => {
        notes.innerHTML = '';
        nums[nums.length - 1].classList.add('one');
        await c.pop(nums[nums.length - 1], 300);
        for (const d of divs) { d.classList.add('lit'); await c.anim(d, [{ transform: 'scale(1)' }, { transform: 'scale(1.3)' }, { transform: 'scale(1)' }], 260); }
        prod.innerHTML = `${fmt(n)} = ${ps.map((p) => '<span class="pchip">' + fmt(p) + '</span>').join(' × ')}`;
        await c.fadeIn(prod, 450);
      }
    });
    if (rep) steps.push({
      cap: `Group the repeated primes with exponents: <b>${fmt(n)} = ${expHTML(ps)}</b>.`,
      run: async (c) => { prod.innerHTML = `${fmt(n)} = ${productHTML(ps)} = <b class="ok">${expHTML(ps)}</b>`; await c.fadeIn(prod, 400); }
    });
    return steps;
  }
};

/* every prime gets the same colour everywhere on the page (matches the Lesson 1 sieve) */
const PCOL = { 2: '#3b78d8', 3: '#e0841a', 5: '#8a58c9', 7: '#d0477a', 11: '#2f9e6a', 13: '#0f8a8a', 17: '#b0563a', 19: '#5a6acf', 23: '#9a7b12' };
const pcol = (p) => PCOL[p] || '#5d6b7e';
function chip(p, cls) { const e = h('div', 'u1l3-pc' + (cls ? ' ' + cls : ''), fmt(p)); e.style.setProperty('--pc', pcol(p)); return e; }
function groups(ps) { const g = []; ps.forEach((p) => { const l = g[g.length - 1]; if (l && l.p === p) l.k++; else g.push({ p, k: 1 }); }); return g; }
function counts(n) { const m = new Map(); primeFactors(n).forEach((p) => m.set(p, (m.get(p) || 0) + 1)); return m; }
const pw = (p, k) => fmt(p) + (k > 1 ? '<sup>' + k + '</sup>' : '');          // 2³, 5
const pw1 = (p, k) => fmt(p) + '<sup>' + k + '</sup>';                          // 5¹ (exponent always shown)
function descMulti(ps) { return listAnd(groups(ps).map((g) => (WORD[g.k] || g.k) + ' ' + fmt(g.p) + (g.k > 1 ? 's' : ''))); }

/* move an absolutely-placed element to (x, y), animating from where it was (optionally along an arc) */
function fly(c, el, x, y, ms = 600, o = {}) {
  const ox = parseFloat(el.style.left) || 0, oy = parseFloat(el.style.top) || 0, dx = ox - x, dy = oy - y;
  at(el, x, y);
  const kf = o.arc
    ? [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: `translate(${dx / 2}px, ${dy / 2 - o.arc}px)`, offset: 0.5 }, { transform: 'translate(0px, 0px)' }]
    : [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'translate(0px, 0px)' }];
  return c.anim(el, kf, ms, o);
}
const pulse = (c, el, s = 1.25, ms = 420, o = {}) => c.anim(el, [{ transform: 'scale(1)' }, { transform: `scale(${s})` }, { transform: 'scale(1)' }], ms, o);

/* ---------- drawing: a little factor tree ---------- */
function treeSVG(spec) { // "60:4,15|4:2,2|15:3,5"
  const kids = {}; spec.split('|').forEach((s) => { const [p, c] = s.split(':'); kids[p] = c.split(',').map(Number); });
  const root = Number(spec.split(':')[0]);
  const mk = (v) => ({ v, k: kids[v] ? kids[v].map(mk) : null });
  const t = mk(root), leaves = []; const walk = (n, d) => { n.d = d; if (!n.k) leaves.push(n); else n.k.forEach((c) => walk(c, d + 1)); }; walk(t, 0);
  const sx = 46, sy = 50, place = (n) => { if (!n.k) n.x = 24 + leaves.indexOf(n) * sx; else { n.k.forEach(place); n.x = (n.k[0].x + n.k[1].x) / 2; } n.y = 20 + n.d * sy; }; place(t);
  const out = [], all = []; const coll = (n) => { all.push(n); if (n.k) n.k.forEach((c) => { out.push(`<line x1="${n.x}" y1="${n.y + 13}" x2="${c.x}" y2="${c.y - 13}"/>`); coll(c); }); }; coll(t);
  const W = 48 + (leaves.length - 1) * sx, H = 40 + Math.max(...all.map((n) => n.d)) * sy;
  return `<svg class="u1l3-treesvg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${out.join('')}${all.map((n) => (n.k ? '' : `<circle cx="${n.x}" cy="${n.y}" r="15"/>`) + `<text x="${n.x}" y="${n.y + 6}">${n.v}</text>`).join('')}</svg>`;
}

/* ============ 1. GCF by inspection: line the factors up in columns ============ */
const gcfList = {
  title: 'The slow way: list the factors and line them up',
  height: 340,
  choices: [{ v: '20,30', label: '20 & 30' }, { v: '12,18', label: '12 & 18' }, { v: '8,12,20', label: '8, 12, 20' }, { sep: 'Example 3 check:' }, { v: '24,42', label: '24 & 42' }, { v: '45,54', label: '45 & 54' }],
  intro: (v) => `Which numbers divide evenly into <b>every one</b> of ${nameList(parse(v))}? List each number’s factors, line them up, and look for the <b>biggest</b> one they all share.`,
  make(stage, v, ex) {
    const ns = parse(v), W = ex.W, F = ns.map(factors), U = [...new Set(F.flat())].sort((a, b) => a - b);
    const common = U.filter((u) => F.every((f) => f.includes(u))), g = common[common.length - 1], bags = false;
    const lx = 124, cw = Math.min(72, (W - lx - 20) / U.length), x0 = lx + (W - lx - 20 - cw * U.length) / 2 + cw / 2;
    const X = (u) => x0 + U.indexOf(u) * cw, rowH = ns.length > 2 ? 72 : 88, Y = (i) => 78 + i * rowH;
    const bandTop = 42, bandBot = Y(ns.length - 1) + 34;
    const bands = {};
    common.forEach((u) => { const b = add(stage, h('div', 'u1l3-gl-band'), X(u) - cw / 2 + 3, bandTop); b.style.width = cw - 6 + 'px'; b.style.height = bandBot - bandTop + 'px'; b.style.opacity = 0; bands[u] = b; });
    const labs = ns.map((n, i) => { const e = add(stage, h('div', 'u1l3-gl-lab', fmt(n) + '<small>factors</small>'), 20, Y(i)); e.style.translate = '0 -50%'; e.style.opacity = 0; return e; });
    const chips = ns.map((n, i) => F[i].map((f) => { const e = add(stage, h('div', 'u1l3-gl-chip c' + (cw < 58 ? ' sm' : ''), fmt(f)), X(f), Y(i)); e.style.opacity = 0; e._v = f; return e; }));
    const crown = add(stage, h('div', 'u1l3-gl-crown c', 'GCF'), X(g), bandTop); crown.style.opacity = 0;
    const res = add(stage, h('div', 'u1l3-gl-res'), 20, bandBot + 26); res.style.opacity = 0;
    const steps = ns.map((n, i) => ({
      cap: `The factors of <b>${fmt(n)}</b>: ${F[i].map(fmt).join(', ')}.` + (i === 0 ? ' Each factor gets its own <b>column</b>.' : ' The same number goes in the same column.'),
      run: (c) => Promise.all([c.fadeIn(labs[i], 300), ...chips[i].map((e, k) => c.pop(e, 320, { delay: k * 55 }))])
    }));
    steps.push({
      cap: `The columns filled in <b>every</b> row are the <b>common factors</b>: ${common.map(fmt).join(', ')}.` + (bags ? ' Any of these works as a number of take-home bags.' : ''),
      run: async (c) => {
        const jobs = common.map((u, k) => c.anim(bands[u], [{ opacity: 0, transform: 'scaleY(.2)' }, { opacity: 1, transform: 'none' }], 420, { delay: k * 70 }));
        chips.flat().forEach((e) => e.classList.add(common.includes(e._v) ? 'common' : 'dim'));
        res.innerHTML = `Common factors: <b>${common.map(fmt).join(', ')}</b>`;
        jobs.push(c.fadeIn(res, 350, { delay: 300 }));
        await Promise.all(jobs);
      }
    });
    steps.push({
      cap: `The biggest common factor is <b>${g}</b>, so the <b>GCF</b> of ${nameList(ns)} is <b>${g}</b>.` + (bags ? ' The most bags is <b>8</b>: 24 ÷ 8 = 3 hot dogs and 32 ÷ 8 = 4 buns in each.' : g === 1 ? ' Only 1 is shared.' : ''),
      run: async (c) => {
        bands[g].classList.add('max');
        res.innerHTML = `Common factors: ${common.map((u) => (u === g ? '<b class="u1l3-gl-g">' + fmt(u) + '</b>' : fmt(u))).join(', ')} &nbsp;→&nbsp; <b class="u1l3-gl-g">GCF = ${fmt(g)}</b>`;
        await Promise.all([c.pop(crown, 420), ...chips.map((row) => pulse(c, row.find((e) => e._v === g), 1.3, 460)), c.fadeIn(res, 300)]);
      }
    });
    return steps;
  }
};

/* ============ 1 & 2. Venn diagram of prime factors ============ */
function vennDef(mode, title, choices) {
  return {
    title, height: 500, choices,
    intro: (v) => { const [a, b] = parse(v); return `Find the ${mode === 'g' ? 'GCF' : 'LCM'} of <b>${fmt(a)}</b> and <b>${fmt(b)}</b>: write both as products of primes, then sort the primes into a <b>Venn diagram</b>.`; },
    make(stage, v, ex) {
      const [a, b] = parse(v), W = ex.W, pa = primeFactors(a), pb = primeFactors(b);
      const usedB = pb.map(() => false), pairs = [], onlyA = [];
      pa.forEach((p, i) => { const j = pb.findIndex((q, k) => q === p && !usedB[k]); if (j >= 0) { usedB[j] = true; pairs.push([i, j]); } else onlyA.push(i); });
      const onlyB = pb.map((_, k) => k).filter((k) => !usedB[k]);
      const both = pairs.map(([i]) => pa[i]), g = both.reduce((x, y) => x * y, 1), l = (a * b) / g;
      const sp = Math.min(60, 440 / Math.max(pa.length, pb.length));
      const row = (n, ps, y) => {
        const lab = add(stage, h('div', 'u1l3-vn-lab', fmt(n) + ' ='), 20, y); lab.style.translate = '0 -50%';
        const cs = ps.map((p, i) => { const e = add(stage, chip(p, 'c'), 150 + i * sp, y); e.style.opacity = 0; return e; });
        const xs = ps.slice(1).map((_, i) => { const e = add(stage, h('div', 'u1l3-vn-x c', '×'), 150 + (i + 0.5) * sp, y); e.style.opacity = 0; return e; });
        lab.style.opacity = 0; return { lab, cs, xs };
      };
      const A = row(a, pa, 34), B = row(b, pb, 94);
      const r = 168, cx1 = 232, cx2 = 462, cy = 320, mid = (cx1 + cx2) / 2;
      [[cx1, 'a'], [cx2, 'b']].forEach(([cx, k]) => { const e = add(stage, h('div', 'u1l3-vn-circ ' + k), cx - r, cy - r); e.style.width = e.style.height = 2 * r + 'px'; });
      add(stage, h('div', 'u1l3-vn-name a c', fmt(a)), cx1 - 128, cy - 150);
      add(stage, h('div', 'u1l3-vn-name b c', fmt(b)), cx2 + 128, cy - 150);
      add(stage, h('div', 'u1l3-vn-reg c', 'only ' + fmt(a)), cx1 - 66, cy + 112);
      add(stage, h('div', 'u1l3-vn-reg c', 'both'), mid, cy - 154);
      add(stage, h('div', 'u1l3-vn-reg c', 'only ' + fmt(b)), cx2 + 66, cy + 112);
      const slot = (cx, n, cols) => Array.from({ length: n }, (_, k) => { const C = Math.min(cols, n), R = Math.ceil(n / cols), cl = k % cols, rw = Math.floor(k / cols); return [cx + (cl - (C - 1) / 2) * 56, cy + (rw - (R - 1) / 2) * 56]; });
      const sM = slot(mid, both.length, both.length > 3 ? 2 : 1), sA = slot(cx1 - 62, onlyA.length, onlyA.length > 3 ? 2 : 1), sB = slot(cx2 + 62, onlyB.length, onlyB.length > 3 ? 2 : 1);
      const px = cx2 + r + 26, pwid = W - px - 14;
      const boxG = add(stage, h('div', 'u1l3-vn-res g'), px, 150), boxL = add(stage, h('div', 'u1l3-vn-res l'), px, 300);
      [boxG, boxL].forEach((e) => { e.style.width = pwid + 'px'; e.style.opacity = 0; });
      const Ma = counts(a), Mb = counts(b), primesBoth = [...new Set(both)], primesAll = [...new Set([...pa, ...pb])].sort((x, y) => x - y);
      const lowest = primesBoth.map((p) => pw1(p, Math.min(Ma.get(p), Mb.get(p)))).join(' × ');
      const highest = primesAll.map((p) => pw1(p, Math.max(Ma.get(p) || 0, Mb.get(p) || 0))).join(' × ');
      const lcmList = [...pa, ...onlyB.map((k) => pb[k])];
      const midEls = [];
      const steps = [
        {
          cap: `Write each number as a product of primes: <b>${fmt(a)} = ${productHTML(pa)}</b> and <b>${fmt(b)} = ${productHTML(pb)}</b>.`,
          run: (c) => Promise.all([A, B].flatMap((R, ri) => [c.fadeIn(R.lab, 300, { delay: ri * 200 }), ...R.cs.map((e, i) => c.pop(e, 320, { delay: ri * 200 + i * 70 })), ...R.xs.map((e) => c.fadeIn(e, 300, { delay: ri * 200 + 200, from: 'none' }))]))
        },
        {
          cap: both.length ? `Match up the primes they <b>share</b>: ${descMulti(both)}. Each matching pair goes in the <b>middle</b>, where it is counted <b>once</b>.` : `They share <b>no</b> primes, so the middle stays empty.`,
          run: async (c) => {
            [...A.xs, ...B.xs].forEach((e) => c.anim(e, [{ opacity: 1 }, { opacity: 0 }], 250));
            await Promise.all(pairs.map(([i, j], k) => Promise.all([pulse(c, A.cs[i], 1.2, 300, { delay: k * 160 }), pulse(c, B.cs[j], 1.2, 300, { delay: k * 160 })])));
            await Promise.all(pairs.map(([i, j], k) => {
              const [x, y] = sM[k]; midEls.push(A.cs[i]); A.cs[i].classList.add('mid');
              return Promise.all([fly(c, A.cs[i], x, y, 650, { delay: k * 140 }), fly(c, B.cs[j], x, y, 650, { delay: k * 140 }).then(() => c.anim(B.cs[j], [{ opacity: 1 }, { opacity: 0 }], 200))]);
            }));
          }
        },
        {
          cap: `The leftovers go on their own side: ${onlyA.length ? descMulti(onlyA.map((i) => pa[i])) + ' only in ' + fmt(a) : 'nothing extra in ' + fmt(a)}, ${onlyB.length ? descMulti(onlyB.map((k) => pb[k])) + ' only in ' + fmt(b) : 'nothing extra in ' + fmt(b)}. Each <b>circle</b> still multiplies to its number.`,
          run: async (c) => {
            await Promise.all([...onlyA.map((i, k) => fly(c, A.cs[i], sA[k][0], sA[k][1], 600, { delay: k * 120 })), ...onlyB.map((j, k) => fly(c, B.cs[j], sB[k][0], sB[k][1], 600, { delay: k * 120 })),
              c.anim(A.lab, [{ opacity: 1 }, { opacity: 0.3 }], 300), c.anim(B.lab, [{ opacity: 1 }, { opacity: 0.3 }], 300)]);
          }
        },
        {
          cap: both.length ? `The <b>GCF</b> is the product of the <b>middle</b>: ${both.length > 1 ? productHTML(both) + ' = ' : ''}<b>${fmt(g)}</b>. With exponents, that’s each shared prime to its <b>lowest</b> power.` : `Nothing in the middle, so the GCF is <b>1</b>.`,
          run: async (c) => {
            boxG.innerHTML = `<div class="u1l3-vn-rh">GCF <span>the middle</span></div><div class="u1l3-vn-rv">${both.length > 1 ? productHTML(both) + ' = ' : ''}<b>${fmt(g)}</b></div>${both.length ? `<div class="u1l3-vn-rx">lowest powers: ${lowest}</div>` : ''}`;
            midEls.forEach((e) => e.classList.add('lit-g'));
            await Promise.all([...midEls.map((e, k) => pulse(c, e, 1.3, 420, { delay: k * 120 })), c.fadeIn(boxG, 400, { delay: 200 })]);
          }
        }
      ];
      if (mode === 'l') steps.push({
        cap: `The <b>LCM</b> uses <b>everything</b> in the diagram: all of ${fmt(a)}’s circle, plus the extras from ${fmt(b)}’s side. ${productHTML(lcmList)} = <b>${fmt(l)}</b>. With exponents, every prime to its <b>highest</b> power.`,
        run: async (c) => {
          boxL.innerHTML = `<div class="u1l3-vn-rh">LCM <span>everything</span></div><div class="u1l3-vn-rv">${productHTML(lcmList)} = <b>${fmt(l)}</b></div><div class="u1l3-vn-rx">highest powers: ${highest}</div>`;
          const aEls = [...midEls, ...onlyA.map((i) => A.cs[i])], bEls = onlyB.map((j) => B.cs[j]);
          [...aEls, ...bEls].forEach((e) => e.classList.add('lit-l'));
          await Promise.all(aEls.map((e, k) => pulse(c, e, 1.25, 380, { delay: k * 90 })));
          await Promise.all([...bEls.map((e, k) => pulse(c, e, 1.3, 420, { delay: k * 120 })), c.fadeIn(boxL, 400, { delay: 150 })]);
        }
      });
      return steps;
    }
  };
}
const vennG = vennDef('g', 'GCF: sort the primes into a Venn diagram', [{ v: '20,30', label: '20 & 30' }, { v: '12,18', label: '12 & 18' }, { v: '14,21', label: '14 & 21' }, { sep: 'Example 3 check:' }, { v: '24,42', label: '24 & 42' }, { v: '45,54', label: '45 & 54' }]);
vennG.minW = 860; // drawn this wide and scaled to fit beside the sidebar


/* ============ 1 & 2. The exponent table: lowest power (GCF), highest power (LCM) ============ */
function tableDef(title, choices) {
  return {
    title, height: 372, choices,
    intro: (v) => { const [m, list] = v.split(':'); return `Find the ${m === 'g' ? 'GCF' : m === 'l' ? 'LCM' : 'GCF and LCM'} of <b>${nameList(parse(list))}</b> using exponents. One <b>column</b> for each prime.`; },
    make(stage, v, ex) {
      const [mode, list] = v.split(':'), ns = parse(list), W = ex.W, M = ns.map(counts);
      const P = [...new Set(ns.flatMap(primeFactors))].sort((x, y) => x - y);
      const lw = 360, cw = Math.min(120, (W - lw - 16) / P.length), X = (j) => lw + (j + 0.5) * cw, Y = (i) => 84 + i * 56;
      const divY = Y(ns.length - 1) + 36, yG = divY + 40, yL = mode === 'b' ? yG + 60 : yG;
      add(stage, h('div', 'u1l3-tb-head', 'prime factorization'), 20, 22);
      const heads = P.map((p, j) => add(stage, chip(p, 'c sm'), X(j), 34));
      const labs = ns.map((n, i) => { const e = add(stage, h('div', 'u1l3-tb-lab', `${fmt(n)} = ${expHTML(primeFactors(n))}`), 20, Y(i)); e.style.translate = '0 -50%'; e.style.opacity = 0; return e; });
      const cells = ns.map((n, i) => P.map((p, j) => { const k = M[i].get(p) || 0; const e = add(stage, h('div', 'u1l3-tb-cell c' + (k ? '' : ' none'), '<span>' + (k ? pw1(p, k) : '—') + '</span>'), X(j), Y(i)); e.style.opacity = 0; e._k = k; return e; }));
      const div = add(stage, h('div', 'u1l3-tb-div'), 20, divY); div.style.width = W - 40 + 'px'; div.style.opacity = 0;
      const steps = [
        { cap: `Write each number with exponents: ${ns.map((n) => fmt(n) + ' = ' + expHTML(primeFactors(n))).join(', &nbsp;')}.`, run: (c) => Promise.all([...heads.map((e, j) => c.pop(e, 300, { delay: j * 60 })), ...labs.map((e, i) => c.fadeIn(e, 320, { delay: i * 160 }))]) },
        { cap: 'Give each prime its own <b>column</b>. A dash means that prime isn’t in the number at all.', run: (c) => Promise.all([...cells.flatMap((row, i) => row.map((e, j) => c.fadeIn(e, 320, { delay: i * 120 + j * 50, from: 'translateX(-30px)' }))), c.fadeIn(div, 300, { delay: 300, from: 'none' })]) }
      ];
      const result = (kind, y) => {
        const isG = kind === 'g', picks = [], keep = [];
        P.forEach((p, j) => {
          const ks = cells.map((row) => row[j]._k), k = isG ? Math.min(...ks) : Math.max(...ks);
          picks.push({ j, k, i: ks.indexOf(k) }); if (k) keep.push(pw(p, k));
        });
        const val = P.reduce((acc, p, j) => acc * Math.pow(p, picks[j].k), 1), missing = P.filter((p, j) => !picks[j].k);
        return {
          cap: isG ? `<b>GCF:</b> in each column take the <b>lowest</b> power.${missing.length ? ` ${listAnd(missing.map(String))} ${missing.length > 1 ? 'are' : 'is'} missing from at least one number, so ${missing.length > 1 ? 'they are' : 'it is'} left out.` : ''} GCF = ${keep.join(' × ')} = <b>${fmt(val)}</b>.`
            : `<b>LCM:</b> in each column take the <b>highest</b> power — every prime is used. LCM = ${keep.join(' × ')} = <b>${fmt(val)}</b>.`,
          run: async (c) => {
            const lab = add(stage, h('div', 'u1l3-tb-res ' + kind, `${isG ? 'GCF' : 'LCM'} = <b>${fmt(val)}</b>`), 20, y); lab.style.translate = '0 -50%';
            const jobs = [];
            picks.forEach(({ j, k, i }, q) => {
              const col = cells.map((row) => row[j]);
              if (isG && !k) col.forEach((e) => e.classList.add('out'));
              else col[i].classList.add('pick-' + kind);
              const e = add(stage, h('div', 'u1l3-tb-cell c res-' + kind + (k ? '' : ' none'), '<span>' + (k ? pw1(P[j], k) : '—') + '</span>'), X(j), y);
              jobs.push(pulse(c, col[i], 1.2, 360, { delay: q * 140 }), c.fadeIn(e, 300, { delay: 200 + q * 140, from: 'translateY(-20px)' }));
            });
            jobs.push(c.fadeIn(lab, 350, { delay: 200 + P.length * 140 }));
            await Promise.all(jobs);
          }
        };
      };
      if (mode !== 'l') steps.push(result('g', yG));
      if (mode !== 'g') {
        const st = result('l', yL);
        if (mode === 'b') { const run0 = st.run; st.run = async (c) => { cells.flat().forEach((e) => e.classList.remove('out', 'pick-g')); await run0(c); }; }
        steps.push(st);
      }
      return steps;
    }
  };
}
const tableG = tableDef('Shared primes, lowest power: the GCF', [{ v: 'g:20,30', label: '20 & 30' }, { v: 'g:12,18', label: '12 & 18' }, { v: 'g:8,12,20', label: '8, 12, 20' }, { sep: 'Example 3 check:' }, { v: 'g:24,42', label: '24 & 42' }, { v: 'g:45,54', label: '45 & 54' }, { v: 'g:32,64,96', label: '32, 64, 96' }]);
const tableL = tableDef('Every prime, highest power: the LCM', [{ v: 'l:14,21', label: '14 & 21' }, { v: 'l:4,6', label: '4 & 6' }, { v: 'b:20,30', label: '20 & 30 (both)' }, { sep: 'Example 4 check:' }, { v: 'l:10,15', label: '10 & 15' }, { v: 'l:12,18', label: '12 & 18' }, { v: 'l:8,15,20', label: '8, 15, 20' }]);

/* ============ 2. LCM by listing multiples: hopping frogs ============ */
const FCOL = ['#3e9b4f', '#2f7fd0', '#d9822b'];
const FROG = (col) => `<svg viewBox="0 0 48 40" aria-hidden="true"><ellipse cx="24" cy="27" rx="19" ry="12" fill="${col}"/><circle cx="14" cy="13" r="7.5" fill="${col}"/><circle cx="34" cy="13" r="7.5" fill="${col}"/><circle cx="14" cy="12" r="4" fill="#fff"/><circle cx="34" cy="12" r="4" fill="#fff"/><circle cx="15" cy="12.6" r="2.1" fill="#1c2230"/><circle cx="33" cy="12.6" r="2.1" fill="#1c2230"/><path d="M16 29 q8 5 16 0" stroke="#1c2230" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`;
const frogs = {
  title: 'The slow way: list the multiples (frogs on a number line)',
  height: 430,
  choices: [{ v: '4,6', label: '4 & 6 (warm-up)' }, { v: '14,21', label: '14 & 21' }, { v: '3,5', label: '3 & 5' }, { sep: 'Example 4 check:' }, { v: '10,15', label: '10 & 15' }, { v: '12,18', label: '12 & 18' }, { v: '8,15,20', label: '8, 15, 20' }],
  intro: (v) => `Each frog starts at 0 and always makes the same size hop: ${listAnd(parse(v).map((n) => '<b>' + n + '</b>'))}. Where do they <b>first land on the same number</b>?`,
  make(stage, v, ex) {
    const ns = parse(v), W = ex.W, L = ns.reduce(lcm), N = 2 * L <= 100 ? 2 * L : L;
    const x0 = 100, x1 = W - 34, sc = (x1 - x0) / (N * 1.03), X = (m) => x0 + m * sc;
    const gap = ns.length === 2 ? 130 : 102, laneY = (i) => 104 + i * gap, axisY = laneY(ns.length - 1) + 60;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('class', 'u1l3-fr-svg'); stage.appendChild(svg);
    const bands = [];
    const band = (m, cls) => { const b = add(stage, h('div', 'u1l3-fr-band ' + cls), X(m) - 17, 46); b.style.height = axisY - 46 + 'px'; b.style.opacity = 0; stage.insertBefore(b, svg); bands.push(b); return b; };
    const b1 = band(L, 'first'), b2 = N === 2 * L ? band(2 * L, 'again') : null;
    // axis
    const ax = add(stage, h('div', 'u1l3-fr-axis'), x0, axisY); ax.style.width = x1 - x0 + 'px';
    const T = [1, 2, 5, 10, 20, 25, 50, 100, 200].find((t) => t * sc >= 44) || 200;
    for (let m = 0; m <= N * 1.02; m += T) { add(stage, h('div', 'u1l3-fr-tick'), X(m), axisY - 5); add(stage, h('div', 'u1l3-fr-tl c', fmt(m)), X(m), axisY + 18); }
    const lanes = ns.map((s, i) => {
      const y = laneY(i), col = FCOL[i];
      const line = add(stage, h('div', 'u1l3-fr-lane'), x0, y); line.style.width = x1 - x0 + 'px'; line.style.background = col;
      const lab = add(stage, h('div', 'u1l3-fr-lab', `+${s}<small>each hop</small>`), 18, y); lab.style.translate = '0 -50%'; lab.style.color = col;
      add(stage, h('div', 'u1l3-fr-dot zero c'), X(0), y);
      const frog = add(stage, h('div', 'u1l3-frog c', FROG(col)), X(0), y - 22);
      return { s, y, col, frog, every: Math.ceil((String(N).length * 9 + 12) / (s * sc)), dots: {} };
    });
    const hops = ns.reduce((t, s) => t + Math.floor(N / s), 0);
    const steps = lanes.map((ln, i) => {
      const ms = []; for (let m = ln.s; m <= N; m += ln.s) ms.push(m);
      return {
        cap: `${i === 0 ? 'The first' : i === 1 ? 'The second' : 'The third'} frog hops by <b>${ln.s}</b>. It lands on the <b>multiples of ${ln.s}</b>: ${ms.slice(0, 6).join(', ')}, …`,
        run: async (c) => {
          const per = Math.max(90, Math.min(360, 4200 / ms.length)), arc = Math.min(46, 12 + ln.s * sc * 0.45);
          let prev = 0;
          for (let q = 0; q < ms.length; q++) {
            const m = ms[q], xa = X(prev), xb = X(m);
            const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            p.setAttribute('d', `M ${xa} ${ln.y - 4} Q ${(xa + xb) / 2} ${ln.y - 4 - arc * 1.6} ${xb} ${ln.y - 4}`); p.setAttribute('stroke', ln.col); svg.appendChild(p);
            await fly(c, ln.frog, xb, ln.y - 22, per, { arc, easing: 'ease-in-out' });
            const d = add(stage, h('div', 'u1l3-fr-dot c'), xb, ln.y); d.style.background = ln.col; ln.dots[m] = d;
            const nearKey = [L, 2 * L].some((K) => K !== m && K <= N && Math.abs(X(K) - xb) < String(N).length * 10 + 6);
            if (((q + 1) % ln.every === 0 && !nearKey) || m === L || m === 2 * L) { const t = add(stage, h('div', 'u1l3-fr-num c', fmt(m)), xb, ln.y + 22); t.style.color = ln.col; ln.dots[m]._t = t; if (!c.fast) c.fadeIn(t, 200); }
            if (!c.fast) c.pop(d, 220);
            prev = m;
          }
        }
      };
    });
    const lab1 = add(stage, h('div', 'u1l3-fr-lcm c', `LCM = ${fmt(L)}`), Math.min(X(L), W - 90), 26); lab1.style.opacity = 0;
    steps.push({
      cap: `The first number <b>every</b> frog lands on is <b>${fmt(L)}</b>, so the LCM of ${nameList(ns)} is <b>${fmt(L)}</b>.` + (v === '4,6' ? ' Just like the lighthouses in the warm-up: they flash together at 12 s.' : hops > 40 ? ` That took ${hops} hops! With numbers like these, prime factors are much faster.` : ''),
      run: async (c) => {
        lanes.forEach((ln) => ln.dots[L] && ln.dots[L].classList.add('hit'));
        await Promise.all([c.anim(b1, [{ opacity: 0, transform: 'scaleY(.2)' }, { opacity: 1, transform: 'none' }], 450), c.pop(lab1, 420, { delay: 200 }), ...lanes.map((ln, i) => pulse(c, ln.frog, 1.3, 400, { delay: 250 + i * 100 }))]);
      }
    });
    if (b2) {
      const lab2 = add(stage, h('div', 'u1l3-fr-lcm again c', fmt(2 * L)), X(2 * L), 26); lab2.style.opacity = 0;
      steps.push({
        cap: `They land together again at <b>${2 * L}</b> = 2 × ${L}. Every <b>common multiple</b> is a multiple of the LCM, and the LCM is the <b>lowest</b> one.`,
        run: (c) => Promise.all([c.anim(b2, [{ opacity: 0 }, { opacity: 1 }], 400), c.pop(lab2, 380, { delay: 150 })])
      });
    }
    return steps;
  }
};

/* ============ 3. GCF in a word problem: share everything into identical bags ============ */
const bags = {
  title: 'Identical groups, nothing left over: that’s a GCF',
  height: 400,
  choices: [{ v: '12,18,yellow bulbs,red bulbs,boxes', label: '12 & 18 bulbs' }, { v: '30,45,pencils,erasers,packs', label: '30 & 45' },
    { sep: 'Example 5 check:' }, { v: '36,48,blue beads,red beads,bracelets', label: '36 blue & 48 red beads' }],
  intro: (v) => { const [a, b, na, nb, grp] = v.split(','); return `<b>${a} ${na}</b> and <b>${b} ${nb}</b> are shared into identical ${grp}, with <b>nothing left over</b>. What is the greatest number of ${grp}?`; },
  make(stage, v, ex) {
    const [as, bs, na, nb, grp] = v.split(','), a = +as, b = +bs, W = ex.W, g = gcd(a, b);
    const COL = { 'yellow bulbs': '#e8b21c', 'red bulbs': '#d0473a', 'red beads': '#d0477a', 'blue beads': '#3b78d8', pencils: '#e0a21a', erasers: '#3b9ad8' };
    const ca = COL[na] || '#d0477a', cb = COL[nb] || '#3b78d8';
    const only = (n) => { for (let t = n - 1; t > 1; t--) if ((a % t === 0) !== (b % t === 0)) return t; return null; };
    const t1 = only(g), t2 = (() => { for (let t = g + 1; t <= 18; t++) if ((a % t === 0) !== (b % t === 0)) return t; return null; })();
    // the two piles
    const pitch = 15, perRow = Math.max(12, Math.min(30, Math.floor((W - 210) / pitch)));
    const pile = (n, col, y, name) => {
      const lab = add(stage, h('div', 'u1l3-bg-lab', `${n} <small>${name}</small>`), 20, y + 8); lab.style.translate = '0 -50%';
      const dots = []; for (let i = 0; i < n; i++) { const d = add(stage, h('div', 'u1l3-bg-dot'), 190 + (i % perRow) * pitch, y + Math.floor(i / perRow) * pitch); d.style.background = col; d.style.opacity = 0; dots.push(d); }
      return { lab, dots };
    };
    const rowsA = Math.ceil(a / perRow), yB = 22 + Math.max(rowsA * pitch, 30), A = pile(a, ca, 12, na), B = pile(b, cb, yB, nb);
    const topEnd = yB + Math.max(Math.ceil(b / perRow) * pitch, 24) + 8;
    const bagY = topEnd + 14, bagH = Math.min(118, 400 - bagY - 92);
    const tried = add(stage, h('div', 'u1l3-bg-tried'), 20, 400 - 40); tried.style.opacity = 0;
    const triedList = [];
    let layer = null;
    async function drawBags(c, n, best) {
      if (layer) { const old = layer; c.anim(old, [{ opacity: 1 }, { opacity: 0 }], 200).then(() => old.remove()); }
      layer = add(stage, h('div', 'u1l3-bg-layer'), 0, 0);
      const qa = Math.floor(a / n), qb = Math.floor(b / n), ra = a % n, rb = b % n, gap = 8, bw = Math.min(92, (W - 40 - gap * (n - 1)) / n);
      const x0 = 20 + (W - 40 - n * bw - gap * (n - 1)) / 2, jobs = [], cols = bw >= 46 ? 3 : 2, dp = Math.min(14, (bw - 8) / cols);
      for (let i = 0; i < n; i++) {
        const bag = add(layer, h('div', 'u1l3-bg-bag' + (best ? ' best' : '')), x0 + i * (bw + gap), bagY); bag.style.width = bw + 'px'; bag.style.height = bagH + 'px';
        const put = (q, col, row0) => { for (let k = 0; k < q; k++) { const d = add(bag, h('div', 'u1l3-bg-dot sm'), 4 + (k % cols) * dp + (bw - 8 - cols * dp) / 2, row0 + Math.floor(k / cols) * dp); d.style.background = col; d.style.width = d.style.height = dp - 3 + 'px'; } return row0 + Math.ceil(q / cols) * dp + 6; };
        put(qb, cb, put(qa, ca, 8));
        jobs.push(c.fadeIn(bag, 260, { delay: i * Math.min(60, 600 / n), from: 'translateY(-14px)' }));
      }
      const info = add(layer, h('div', 'u1l3-bg-info c', ra || rb ? `<span class="red">left over: ${[ra ? ra + ' ' + na : '', rb ? rb + ' ' + nb : ''].filter(Boolean).join(' and ')}</span>` : `each: <b>${qa} ${na}</b> and <b>${qb} ${nb}</b>, nothing left over`), W / 2, bagY + bagH + 20);
      if (ra || rb) {
        const xs = W / 2 + 10 + info.textContent.length * 4.6;
        for (let k = 0; k < Math.min(ra + rb, 12); k++) { const d = add(layer, h('div', 'u1l3-bg-dot lone'), xs + k * 16, bagY + bagH + 13); d.style.background = k < ra ? ca : cb; jobs.push(c.pop(d, 300, { delay: 500 + k * 40 })); }
      }
      jobs.push(c.fadeIn(info, 300, { delay: 400 }));
      const tag = `<span class="${ra || rb ? 'no' : 'ok'}">${n} ${ra || rb ? '✗' : '✓'}</span>`;
      if (!triedList.includes(tag)) triedList.push(tag);
      tried.innerHTML = `<b>Tried:</b> ${triedList.join(' ')}`;
      jobs.push(c.fadeIn(tried, 250));
      await Promise.all(jobs);
    }
    const rem = (x, n) => (x % n ? `${x} ÷ ${n} = ${Math.floor(x / n)}, with <b class="red">${x % n} left over</b>` : `${x} ÷ ${n} = ${x / n}`);
    const steps = [{
      cap: `<b>${a} ${na}</b> and <b>${b} ${nb}</b>. Every one of the ${grp} must get the same, and nothing can be left over.`,
      run: (c) => Promise.all([c.fadeIn(A.lab, 250), c.fadeIn(B.lab, 250, { delay: 150 }), ...A.dots.map((d, i) => c.pop(d, 260, { delay: i * 12 })), ...B.dots.map((d, i) => c.pop(d, 260, { delay: 150 + i * 12 }))])
    }];
    const dim = (c) => Promise.all([...A.dots, ...B.dots].map((d) => c.anim(d, [{ opacity: 1 }, { opacity: 0.25 }], 300)));
    if (t1) steps.push({ cap: `Try <b>${t1} ${grp}</b>: ${rem(a, t1)}; ${rem(b, t1)}. ✗ ${t1} doesn’t divide into <b>both</b> numbers.`, run: (c) => Promise.all([dim(c), drawBags(c, t1)]) });
    steps.push({ cap: `Try <b>${g} ${grp}</b>: ${a} ÷ ${g} = ${a / g} ${na} and ${b} ÷ ${g} = ${b / g} ${nb} in each. Nothing left over ✓`, run: (c) => Promise.all([dim(c), drawBags(c, g, !t2)]) });
    if (t2) steps.push({ cap: `More ${grp}? <b>${t2}</b>: ${rem(a, t2)}; ${rem(b, t2)}. ✗ Any number of ${grp} that works must divide into both: a <b>common factor</b>.`, run: (c) => drawBags(c, t2) });
    const fa = expHTML(primeFactors(a)), fb = expHTML(primeFactors(b)), fg = expHTML(primeFactors(g));
    steps.push({
      cap: `The greatest number of ${grp} is the <b>greatest common factor</b>: ${a} = ${fa}, ${b} = ${fb}, so GCF = ${fg} = <b>${g}</b>.`,
      run: async (c) => {
        await drawBags(c, g, true);
        const res = add(stage, h('div', 'u1l3-bg-res'), W - 20, 400 - 40); res.style.translate = '-100% 0';
        res.innerHTML = `GCF(${a}, ${b}) = <b>${g}</b> ${grp}`;
        await c.pop(res, 380);
      }
    });
    return steps;
  }
};

/* ============ 3. LCM in a word problem: two beacons flashing on different cycles ============ */
const beacons = {
  title: 'Two lights: when are they together again?',
  height: 380,
  choices: [{ v: '4,6', label: '4 s & 6 s (warm-up)' }, { v: '6,10', label: '6 s & 10 s' }, { v: '8,12', label: '8 s & 12 s' }, { sep: 'Example 6 check:' }, { v: '18,24', label: '18 s & 24 s' }],
  intro: (v) => { const [a, b] = parse(v); return `Two lights start together at 0 s. One comes back every <b>${a} seconds</b>, the other every <b>${b} seconds</b>. When are they back <b>together</b>?`; },
  make(stage, v, ex) {
    const [a, b] = parse(v), W = ex.W, L = lcm(a, b), N = 2 * L, g = gcd(a, b);
    const x0 = 150, x1 = W - 40, X = (t) => x0 + (t / N) * (x1 - x0), rowY = [96, 196], axisY = 268;
    const cols = ['#0f8a8a', '#c06b0c'];
    const lamps = [a, b].map((p, i) => {
      add(stage, h('div', 'u1l3-bc-tower c'), 62, rowY[i] + 30).style.borderColor = cols[i];
      const lamp = add(stage, h('div', 'u1l3-bc-lamp c'), 62, rowY[i] - 6); lamp.style.setProperty('--bc', cols[i]);
      const lab = add(stage, h('div', 'u1l3-bc-lab c', `every <b>${p} s</b>`), 62, rowY[i] + 62); lab.style.color = cols[i];
      return lamp;
    });
    rowY.forEach((y, i) => { const ln = add(stage, h('div', 'u1l3-bc-track'), x0, y); ln.style.width = x1 - x0 + 'px'; ln.style.background = cols[i]; });
    const ax = add(stage, h('div', 'u1l3-bc-axis'), x0, axisY); ax.style.width = x1 - x0 + 'px';
    const T = [1, 2, 4, 5, 10, 20, 30, 60].find((t) => (t / N) * (x1 - x0) >= 46) || 60;
    for (let t = 0; t <= N; t += T) { add(stage, h('div', 'u1l3-bc-tick'), X(t), axisY - 5); add(stage, h('div', 'u1l3-bc-tl c', t + ''), X(t), axisY + 18); }
    add(stage, h('div', 'u1l3-bc-unit'), x1 + 6, axisY + 18).textContent = 's';
    const marks = [a, b].map((p, i) => { const ms = []; for (let t = p; t <= N; t += p) { const m = add(stage, h('div', 'u1l3-bc-mark c', ''), X(t), rowY[i]); m.style.setProperty('--bc', cols[i]); m.style.opacity = 0; m._t = t; ms.push(m); } return ms; });
    const nums = [a, b].map((p, i) => marks[i].map((m) => { const e = add(stage, h('div', 'u1l3-bc-num c', m._t + ''), m._t === L || m._t === N ? X(m._t) : X(m._t), rowY[i] - 30); e.style.color = cols[i]; e.style.opacity = 0; return e; }));
    const band = (t, cls) => { const e = add(stage, h('div', 'u1l3-bc-band ' + cls), X(t) - 18, rowY[0] - 50); e.style.height = axisY - rowY[0] + 50 + 'px'; e.style.opacity = 0; stage.insertBefore(e, stage.firstChild); return e; };
    const b1 = band(L, 'first'), b2 = band(N, 'again');
    const cursor = add(stage, h('div', 'u1l3-bc-cursor'), X(0), rowY[0] - 44); cursor.style.height = axisY - rowY[0] + 44 + 'px'; cursor.style.opacity = 0;
    const clock = add(stage, h('div', 'u1l3-bc-clock'), W - 20, 8); clock.style.translate = '-100% 0'; clock.innerHTML = 't = 0 s';
    const res = add(stage, h('div', 'u1l3-bc-res'), x0, axisY + 52); res.style.opacity = 0;
    const show = (i) => (c) => Promise.all([...marks[i].map((m, k) => c.pop(m, 280, { delay: k * 90 })), ...nums[i].map((e, k) => c.fadeIn(e, 250, { delay: k * 90 }))]);
    const listOf = (p) => { const o = []; for (let t = p; t <= Math.min(N, 5 * p); t += p) o.push(t); return o.join(', '); };
    return [
      { cap: `The first light comes back every <b>${a} s</b>: at ${listOf(a)}, … These are the <b>multiples of ${a}</b>.`, run: show(0) },
      { cap: `The second comes back every <b>${b} s</b>: at ${listOf(b)}, … These are the multiples of ${b}.`, run: show(1) },
      {
        cap: `Run the clock from 0 s… The first time <b>both</b> are back at once is <b>${L} s</b>: the first common multiple, the <b>LCM</b>.`,
        run: async (c) => {
          const dur = 3200, jobs = [c.fadeIn(cursor, 150), c.anim(cursor, [{ transform: 'translateX(0px)' }, { transform: `translateX(${X(L) - X(0)}px)` }], dur, { easing: 'linear' })];
          [a, b].forEach((p, i) => { for (let t = p; t <= L; t += p) jobs.push(c.anim(lamps[i], [{ background: 'var(--bc)', boxShadow: '0 0 0 0 rgba(255,200,40,0)' }, { background: '#ffd84a', boxShadow: '0 0 26px 12px rgba(255,200,40,.85)' }, { background: 'var(--bc)', boxShadow: '0 0 0 0 rgba(255,200,40,0)' }], 420, { delay: (t / L) * dur - 120 })); });
          if (!c.fast) { const t0 = performance.now(); const tick = () => { const s = Math.min(L, Math.round(((performance.now() - t0) / dur) * L)); clock.innerHTML = `t = ${s} s`; if (s < L && cursor.isConnected) requestAnimationFrame(tick); }; requestAnimationFrame(tick); }
          await Promise.all(jobs);
          clock.innerHTML = `t = <b>${L} s</b>`;
          marks.forEach((ms) => ms.forEach((m) => m._t === L && m.classList.add('hit')));
          await Promise.all([c.anim(b1, [{ opacity: 0 }, { opacity: 1 }], 350), ...lamps.map((l) => c.anim(l, [{ background: '#ffd84a', boxShadow: '0 0 26px 12px rgba(255,200,40,.85)' }, { background: '#ffd84a', boxShadow: '0 0 26px 12px rgba(255,200,40,.85)' }], 300))]);
        }
      },
      {
        cap: `Together again at <b>${N} s</b> = 2 × ${L}, and every ${L} s after that. With primes: ${a} = ${expHTML(primeFactors(a))}, ${b} = ${expHTML(primeFactors(b))}, LCM = ${expHTML(primeFactors(L))} = <b>${L}</b>` + (g > 1 ? ` — not ${a} × ${b} = ${a * b}.` : '.'),
        run: async (c) => {
          marks.forEach((ms) => ms.forEach((m) => m._t === N && m.classList.add('hit')));
          res.innerHTML = `LCM(${a}, ${b}) = ${expHTML(primeFactors(L))} = <b>${L} s</b>` + (L >= 60 ? ` <span class="muted">(${Math.floor(L / 60)} min${L % 60 ? ' ' + (L % 60) + ' s' : ''})</span>` : '');
          await Promise.all([c.anim(b2, [{ opacity: 0 }, { opacity: 1 }], 350), c.fadeIn(res, 350, { delay: 150 })]);
        }
      }
    ];
  }
};


/* ============ warm-up: Blink Together — lighthouse A flashes every 4 s, B every 6 s (a timeline from 0 to 24 s) ============
 * Tap a tick on a row to mark (or unmark) a flash there. "A's flashes" / "B's flashes" fill in the right ones (and drop
 * wrong marks), "Together?" rings the times both flash, the reset button goes back to the board (0 and 4, 0 and 6). */
function mountBlink() {
  const svg = document.getElementById('u1l3-blink'); if (!svg) return;
  const NS = 'http://www.w3.org/2000/svg', status = document.getElementById('u1l3-blink-st');
  const mk = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); (parent || svg).appendChild(e); return e; };
  const X = (t) => 128 + t * 21, ROW = { A: 58, B: 168 }, PER = { A: 4, B: 6 }, T = 24;
  // the two lighthouses
  const house = (cx, base, letter) => {
    const g = mk('g', { class: 'u1l3-bl-house' });
    [-24, 0, 24, 156, 180, 204].forEach((a) => { const r = 30, t1 = (a + 9) * Math.PI / 180, t2 = (a - 9) * Math.PI / 180, ly = base - 52; mk('path', { d: `M ${cx} ${ly} L ${cx + r * Math.cos(t1)} ${ly - r * Math.sin(t1)} L ${cx + r * Math.cos(t2)} ${ly - r * Math.sin(t2)} Z`, class: 'u1l3-bl-ray' }, g); });
    mk('path', { d: `M ${cx - 11} ${base} L ${cx + 11} ${base} L ${cx + 7} ${base - 42} L ${cx - 7} ${base - 42} Z`, class: 'u1l3-bl-tower' }, g);
    mk('path', { d: `M ${cx - 10} ${base - 9} L ${cx + 10} ${base - 9} L ${cx + 9.1} ${base - 18} L ${cx - 9.1} ${base - 18} Z`, class: 'u1l3-bl-stripe' }, g);
    mk('path', { d: `M ${cx - 8.2} ${base - 27} L ${cx + 8.2} ${base - 27} L ${cx + 7.4} ${base - 35} L ${cx - 7.4} ${base - 35} Z`, class: 'u1l3-bl-stripe' }, g);
    mk('rect', { x: cx - 10, y: base - 45, width: 20, height: 3, class: 'u1l3-bl-gal' }, g);
    mk('rect', { x: cx - 6, y: base - 57, width: 12, height: 12, class: 'u1l3-bl-lamp' }, g);
    mk('path', { d: `M ${cx - 8} ${base - 57} L ${cx + 8} ${base - 57} L ${cx} ${base - 65} Z`, class: 'u1l3-bl-roof' }, g);
    mk('ellipse', { cx, cy: base, rx: 20, ry: 4.5, class: 'u1l3-bl-rock' }, g);
    const t = mk('text', { x: cx - 34, y: base - 20, class: 'u1l3-bl-letter' }, g); t.textContent = letter;
  };
  house(70, ROW.A + 26, 'A'); house(70, ROW.B + 26, 'B');
  const starPath = (x, y, R = 13, r = 6.5) => { let d = ''; for (let i = 0; i < 16; i++) { const a = (i * Math.PI) / 8 - Math.PI / 2, rr = i % 2 ? r : R; d += (i ? 'L' : 'M') + (x + rr * Math.cos(a)).toFixed(1) + ' ' + (y + rr * Math.sin(a)).toFixed(1) + ' '; } return d + 'Z'; };
  const boxes = mk('g', {}), axes = mk('g', {}), stars = mk('g', {}), hits = mk('g', {});
  const marks = { A: {}, B: {} };
  const together = {};
  [0, 12, 24].forEach((t) => {
    const g = mk('g', { class: 'u1l3-bl-tog' + (t ? '' : ' on') }, boxes);
    mk('rect', { x: X(t) - 15, y: ROW.A - 26, width: 30, height: ROW.B - ROW.A + 50, rx: 7 }, g);
    const lab = mk('text', { x: X(t), y: ROW.A - 33, class: 'u1l3-bl-togt' }, g); lab.textContent = 'together!';
    together[t] = g;
  });
  ['A', 'B'].forEach((k) => {
    const y = ROW[k];
    mk('line', { x1: X(0) - 8, x2: X(T) + 14, y1: y, y2: y, class: 'u1l3-bl-ax' }, axes);
    for (let t = 0; t <= T; t++) {
      mk('line', { x1: X(t), x2: X(t), y1: y - 6, y2: y + 6, class: 'u1l3-bl-tk' }, axes);
      const hit = mk('rect', { x: X(t) - 10.5, y: y - 20, width: 21, height: 40, class: 'u1l3-bl-hit', 'data-tap': '' }, hits);
      hit.addEventListener('click', () => { set(k, t, !marks[k][t]); report(); });
    }
  });
  for (let t = 0; t <= T; t += 2) { const e = mk('text', { x: X(t), y: (ROW.A + ROW.B) / 2 + 7, class: 'u1l3-bl-num' }, axes); e.textContent = t; }
  const sEl = mk('text', { x: X(T) + 22, y: (ROW.A + ROW.B) / 2 + 7, class: 'u1l3-bl-num' }, axes); sEl.textContent = 's';
  function set(k, t, on, cls) {
    if (marks[k][t]) { marks[k][t].remove(); marks[k][t] = null; }
    if (on) marks[k][t] = mk('path', { d: starPath(X(t), ROW[k]), class: 'u1l3-bl-star ' + (cls || 'mine') }, stars);
  }
  const fill = (k) => { for (let t = 0; t <= T; t++) set(k, t, t % PER[k] === 0, 'right'); };
  const list = (k) => { const o = []; for (let t = 0; t <= T; t += PER[k]) o.push(t); return o.join(', '); };
  let shownTog = false;
  function report(extra) {
    const okA = [...Array(T + 1).keys()].every((t) => !!marks.A[t] === (t % 4 === 0)), okB = [...Array(T + 1).keys()].every((t) => !!marks.B[t] === (t % 6 === 0));
    let s = '';
    if (okA) s += `<b class="u1l3-ca">A:</b> ${list('A')} s. `;
    if (okB) s += `<b class="u1l3-cb">B:</b> ${list('B')} s. `;
    if (shownTog) s += '<b>Together at 0, 12 and 24 s</b>: on <b>both</b> lists.';
    status.innerHTML = extra || s || '<span class="muted">Tap a tick to mark a flash.</span>';
  }
  function reset() {
    ['A', 'B'].forEach((k) => { for (let t = 0; t <= T; t++) set(k, t, false); });
    set('A', 0, true, 'right'); set('A', 4, true, 'right'); set('B', 0, true, 'right'); set('B', 6, true, 'right');
    shownTog = false; [12, 24].forEach((t) => together[t].classList.remove('on'));
    report();
  }
  document.querySelectorAll('[data-u1l3-bl]').forEach((b) => b.addEventListener('click', () => {
    const a = b.dataset.u1l3Bl;
    if (a === 'A' || a === 'B') fill(a);
    else if (a === 'tog') { fill('A'); fill('B'); shownTog = true; [12, 24].forEach((t) => together[t].classList.add('on')); }
    else reset();
    report();
  }));
  reset();
}

/* ============ the interactive factor tree (Section 2) ============ */
function mountTree() {
  const host = document.getElementById('u1l3-tree'); if (!host) return;
  const tree = new FactorTree(host.querySelector('.ft-host'), { n: 52, style: 'plain', maxSlot: 96 });
  const chips = host.querySelectorAll('[data-n]');
  chips.forEach((b) => b.addEventListener('click', () => { chips.forEach((x) => x.classList.toggle('on', x === b)); tree.setN(Number(b.dataset.n)); }));
  const f = host.querySelector('form');
  f.addEventListener('submit', (e) => { e.preventDefault(); const inp = f.querySelector('input'), v = parseInt(inp.value.replace(/\D/g, ''), 10); if (v >= 4 && v <= 999) { chips.forEach((x) => x.classList.remove('on')); inp.blur(); tree.setN(v); } else { inp.value = ''; inp.placeholder = '4–999'; } });
}

/* ============ the primes below 50: tap a blank to fill it (Section 1) ============ */
function mountPrimeList() {
  document.querySelectorAll('.u1l3 .blank[data-a]').forEach((b) => b.addEventListener('click', () => { b.classList.toggle('filled'); b.textContent = b.classList.contains('filled') ? b.dataset.a : ''; }));
  const all = document.querySelector('.u1l3 [data-fillall]');
  if (all) all.addEventListener('click', () => { document.querySelectorAll('.u1l3 .blank[data-a]').forEach((b, i) => setTimeout(() => { b.classList.add('filled'); b.textContent = b.dataset.a; b.animate([{ transform: 'scale(1.4)' }, { transform: 'scale(1)' }], 300); }, i * 180)); });
}

/* ============ static figures: little factor trees drawn from a spec ============ */
function mountFigures() { document.querySelectorAll('[data-u1l3-tree]').forEach((el) => { el.innerHTML = treeSVG(el.dataset.u1l3Tree); }); }

function mountExplainers() {
  const defs = { rectangles, sieve, ladder, gcfList, vennG, tableG, frogs, tableL, bags, beacons };
  document.querySelectorAll('[data-explainer]').forEach((el) => { if (defs[el.dataset.explainer]) new Explainer(el, defs[el.dataset.explainer]); });
}

mountFigures(); mountExplainers(); mountTree(); mountPrimeList(); mountBlink();

/* ============ Stand Up Break! — prime factorization, GCF and LCM at the whiteboards (lessons/js/standup.js) ============
 * BEG: a prime factorization (ladder or tree) · PRG: the GCF and the LCM of two numbers · MAS: a GCF or LCM word problem.
 * Numbers from the lesson's examples and from Assignment 3 are never used. */
function suPF(n) { const f = []; for (let p = 2; p * p <= n; p++) { let e = 0; while (n % p === 0) { n /= p; e++; } if (e) f.push([p, e]); } if (n > 1) f.push([n, 1]); return f; }
const suMul = (f) => f.map(([p, e]) => Array(e).fill(p).join('\\times ')).join('\\times ');
const suPow = (f) => f.map(([p, e]) => (e > 1 ? p + '^{' + e + '}' : String(p))).join('\\times ');
const suFac = (n) => { const f = suPF(n), a = suMul(f), b = suPow(f); return n + '=' + a + (a === b ? '' : '=' + b); };
const suShared = (a, b, hi) => { const A = new Map(suPF(a)), B = new Map(suPF(b)), ps = [...new Set([...A.keys(), ...B.keys()])].sort((x, y) => x - y), out = [];
  ps.forEach((p) => { const e = hi ? Math.max(A.get(p) || 0, B.get(p) || 0) : Math.min(A.get(p) || 0, B.get(p) || 0); if (e) out.push(e > 1 ? p + '^{' + e + '}' : String(p)); }); return out.join('\\times '); };
const SU_AVOID_N = new Set([52, 76, 54, 27, 34, 43, 49, 92, 88, 78, 99, 18, 40, 31, 42, 53, 57]);
const SU_AVOID_PAIR = new Set(['20,30', '14,21', '24,42', '45,54', '10,15', '12,18', '16,20', '63,105', '88,110', '6,10', '21,35', '28,42', '54,90', '36,48', '18,24', '32,40', '15,20', '4,6', '13,17']);
const suPairOk = (a, b) => !SU_AVOID_PAIR.has(Math.min(a, b) + ',' + Math.max(a, b));
const SU_GCF = [['red marbles', 'blue marbles', 'prize bags'], ['apples', 'oranges', 'fruit baskets'], ['stickers', 'pencils', 'party bags'], ['chocolate cookies', 'oatmeal cookies', 'plates'], ['white roses', 'pink roses', 'bouquets'], ['hockey cards', 'baseball cards', 'piles']];
standup('u1l3', {
  intro: 'Work it out together at your whiteboard. Show your ladder or tree, then the primes you used.',
  levels: {
    BEG: (r) => { // Example 2: a prime factorization
      let n, f; do { n = r.int(20, 160); f = suPF(n); } while (SU_AVOID_N.has(n) || f.reduce((s, x) => s + x[1], 0) < 3 || f.some(([p]) => p > 19));
      const how = r.pick(['division ladder', 'factor tree']);
      return { text: `Use a <b>${how}</b> to find the prime factorization. Write it with exponents.`, q: String(n), a: suFac(n) };
    },
    PRG: (r) => { // Examples 3 and 4: GCF and LCM from the prime factorizations
      let a, b;
      do { a = r.int(8, 60); b = r.int(8, 60); } while (a >= b || gcd(a, b) < 2 || a === gcd(a, b) || lcm(a, b) > 360 || !suPairOk(a, b) || suPF(a).length + suPF(b).length < 3);
      const g = gcd(a, b), l = lcm(a, b);
      return { text: 'Use prime factorization to find the <b>GCF</b> and the <b>LCM</b>.', q: a + '\\text{ and }' + b,
        a: [suFac(a), suFac(b), '\\text{GCF}=' + suShared(a, b, false) + (String(g) === suShared(a, b, false) ? '' : '=' + g), '\\text{LCM}=' + suShared(a, b, true) + '=' + l] };
    },
    MAS: (r) => { // Examples 5 and 6: decide GCF or LCM, then solve
      if (r.chance(0.5)) {
        const [A, B, G] = r.pick(SU_GCF); let g, m1, m2;
        do { g = r.int(4, 12); m1 = r.int(2, 7); m2 = r.int(2, 7); } while (m1 === m2 || gcd(m1, m2) > 1 || g * Math.max(m1, m2) > 96 || !suPairOk(g * m1, g * m2));
        const a = g * m1, b = g * m2;
        return { text: `There are <b>${a} ${A}</b> and <b>${b} ${B}</b>. They are shared into identical ${G}, using all of them, with the <b>greatest</b> number of ${G} possible. <b>GCF or LCM?</b> How many ${G}, and what goes in each?`, q: '',
          a: [suFac(a), suFac(b), '\\text{GCF}=' + g], atext: `<b>GCF</b> (largest equal groups): <b>${g} ${G}</b>, each with ${m1} ${A} and ${m2} ${B}.` };
      }
      const S = r.pick([['Two buses leave the station together. One leaves every', 'minutes', 'the other every', 'After how many minutes do they next leave together?'],
        ['Two lights blink together. One blinks every', 'seconds', 'the other every', 'After how many seconds do they next blink together?'],
        ['Two runners start a lap together. One finishes a lap every', 'seconds', 'the other every', 'After how many seconds are they at the start line together again?']]);
      let a, b; do { a = r.int(4, 30); b = r.int(4, 30); } while (a >= b || gcd(a, b) < 2 || b % a === 0 || lcm(a, b) > 180 || !suPairOk(a, b));
      const l = lcm(a, b), u = S[1];
      return { text: `${S[0]} <b>${a} ${u}</b>, ${S[2]} <b>${b} ${u}</b>. ${S[3]} <b>GCF or LCM?</b>`, q: '',
        a: [suFac(a), suFac(b), '\\text{LCM}=' + suShared(a, b, true) + '=' + l], atext: `<b>LCM</b> (lining up again): <b>${l} ${u}</b>` + (u === 'seconds' && l >= 60 ? ` (${Math.floor(l / 60)} min${l % 60 ? ' ' + (l % 60) + ' s' : ''})` : u === 'minutes' && l >= 60 ? ` (${Math.floor(l / 60)} h${l % 60 ? ' ' + (l % 60) + ' min' : ''})` : '') + '.' };
    }
  }
});


/* ---------- Math History (the brown box): Euclid, Elements IX.20 — multiply the primes on a list and add 1 ----------
 * Row by row: 2×3+1 = 7, 2×3×5+1 = 31, 2×3×5×7+1 = 211, 2×3×5×7×11+1 = 2311 (each a new prime), then
 * 2×3×5×7×11×13+1 = 30 031: not prime, but 30 031 = 59 × 509, and both of those are new primes. Plays once when the box is
 * half in view; a tap or Replay plays it again; reduced motion shows the finished picture. */
(function euclidPrimes() {
  const svg = document.getElementById('u1l3-hist'); if (!svg) return;
  const NS = 'http://www.w3.org/2000/svg';
  const mk = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); Object.keys(attrs || {}).forEach((k) => e.setAttribute(k, attrs[k])); (parent || svg).appendChild(e); return e; };
  const txt = (s, attrs, parent, tag) => { const e = mk(tag || 'text', attrs, parent); e.textContent = s; return e; };
  const tsp = (s, attrs, parent) => txt(s, attrs, parent, 'tspan');
  const PCOL = { 2: '#3b78d8', 3: '#e0841a', 5: '#8a58c9', 7: '#d0477a', 11: '#2f9e6a', 13: '#0f8a8a' };
  const ROWS = [[2, 3], [2, 3, 5], [2, 3, 5, 7], [2, 3, 5, 7, 11], [2, 3, 5, 7, 11, 13]];
  const fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const steps = []; // { el, t }: el gets class "on" once the clock passes t (ms)
  const at = (el, t) => { steps.push({ el, t }); return el; };
  txt('Multiply the primes on the list, then add 1:', { x: 24, y: 30, class: 'u1l3h-hd' });
  const XE = 318, Y0 = 72, DY = 41;
  let t = 400;
  ROWS.forEach((ps, k) => {
    const y = Y0 + k * DY, last = k === ROWS.length - 1, n = ps.reduce((a, b) => a * b, 1) + 1;
    if (k) mk('line', { x1: 24, x2: 576, y1: y - 27, y2: y - 27, class: 'u1l3h-rule' });
    const ex = txt('', { x: XE, y, 'text-anchor': 'end', class: 'u1l3h-ex' });
    const gap = last ? 170 : 130;
    ps.forEach((p, i) => {
      if (i) at(tsp(' × ', { class: 'u1l3h-tok u1l3h-op' }, ex), t + i * gap);
      at(tsp(String(p), { class: 'u1l3h-tok', fill: PCOL[p] }, ex), t + i * gap);
    });
    const tPlus = t + ps.length * gap + 100;
    at(tsp(' + ', { class: 'u1l3h-tok u1l3h-op' }, ex), tPlus); at(tsp('1', { class: 'u1l3h-tok' }, ex), tPlus);
    const tEq = tPlus + (last ? 650 : 450);
    const res = txt('', { x: XE + 12, y, class: 'u1l3h-res' });
    const eq = at(tsp('= ', { class: 'u1l3h-tok u1l3h-op' }, res), tEq), num = at(tsp(fmt(n), { class: 'u1l3h-tok' }, res), tEq);
    const g = at(mk('g', { class: 'u1l3h-g' + (last ? ' u1l3h-no' : '') }), tEq + (last ? 700 : 380));
    mk('rect', { x: 452, y: y - 20, width: 112, height: 27, rx: 13.5, class: 'u1l3h-pill' }, g);
    txt(last ? 'not prime!' : 'new prime ✓', { x: 508, y: y - 1.5, 'text-anchor': 'middle', class: 'u1l3h-pt' }, g);
    if (last) {
      const tKey = tEq + 1700;
      let rx = XE + 34, rw = 66; // ring the number itself (measured when the page can lay it out)
      try { const ew = eq.getComputedTextLength(), nw = num.getComputedTextLength(); if (nw > 0) { rx = XE + 12 + ew; rw = nw; } } catch (e) { /* keep the estimate */ }
      at(mk('rect', { x: rx - 6, y: y - 24, width: rw + 12, height: 34, rx: 9, class: 'u1l3h-ring u1l3h-g' }), tKey);
      const f = txt('', { x: 300, y: y + 46, 'text-anchor': 'middle', class: 'u1l3h-final' });
      at(tsp('30 031 = 59 × 509', { class: 'u1l3h-tok' }, f), tKey);
      at(tsp('  → 59 and 509 are new primes!', { class: 'u1l3h-tok' }, f), tKey + 1100);
      t = tKey + 1100;
    } else t = tEq + 800;
  });
  const END = t + 400;
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
})();

