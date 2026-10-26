/* Math 15 · Unit 4 · Lesson 6 — Factoring Perfect Square Trinomials: the explainers, the warm-up kit builder and the
 * Stand Up Break. The tile picture and the three-part checker are adapted from Math 10C 4.6; the rest is new for Math 15.
 * Big idea of the unit: factoring is expanding run backwards, so every factoring explainer ends with a check by expanding.
 * Colours: x² / a² teal, x / ab amber, 1 / b² slate. A negative tile is white with a coloured outline and a minus sign. */
import { h, Explainer } from '../explain.js';
import { tex } from '../tex.js';
import { standup } from '../standup.js';

const at = (el, x, y) => { el.style.left = x + 'px'; el.style.top = y + 'px'; return el; };
const add = (stage, el, x, y) => { stage.appendChild(at(el, x, y)); return el; };
const box = (el, w, ht) => { el.style.width = w + 'px'; el.style.height = ht + 'px'; return el; };
const hide = (...els) => els.forEach((e) => { if (e) e.style.opacity = 0; });
const K = (s, d) => tex(s, d);
const T = (s) => tex(s); // inline math in captions
const KN = (s) => `<span class="u4l6-nw">${K(s)}</span>`;
function stampIn(c, el) { return c.anim(el, [{ opacity: 0, transform: 'scale(1.9) rotate(-14deg)' }, { opacity: 1, transform: 'scale(1) rotate(-6deg)' }], 420, { easing: 'cubic-bezier(.2,1.4,.4,1)' }); }
const pulse = (c, el, s = 1.08, o = {}) => c.anim(el, [{ scale: '1' }, { scale: String(s) }, { scale: '1' }], 520, o); // `scale` never undoes a transform
const fadeOut = (c, el, ms = 300, o = {}) => c.anim(el, [{ opacity: getComputedStyle(el).opacity }, { opacity: 0 }], ms, o);
const showIn = (c, el, ms = 350, o = {}) => c.anim(el, [{ opacity: 0, transform: o.from || 'translateY(8px)' }, { opacity: 1, transform: 'none' }], ms, o);
const appear = (c, el, ms = 350, o = {}) => c.anim(el, [{ opacity: 0 }, { opacity: 1 }], ms, o);
const PLUS = '\\textcolor{#12805a}{+}', MINUS = '\\textcolor{#c93a33}{-}';

/* the factor ⇄ expand arrows, used wherever both forms sit side by side */
const ARR = '<span class="u4l6-arr"><span class="xp">expand ⟶</span><span class="fa">⟵ factor</span></span>';

/* monomials: [coefficient, { letter: exponent }] */
const VS = (v) => Object.keys(v || {}).sort().filter((k) => v[k]).map((k) => (v[k] === 1 ? k : `${k}^{${v[k]}}`)).join('');
const MT = ([c, v]) => { const s = VS(v); return (c === 1 && s ? '' : String(c)) + s; };
const dbl = (v) => { const o = {}; for (const k in v) o[k] = 2 * v[k]; return o; };
const msq = ([c, v]) => [c * c, dbl(v)];
const mmul = ([a, u], [b, w]) => { const o = { ...u }; for (const k in w) o[k] = (o[k] || 0) + w[k]; return [a * b, o]; };
const isq = (n) => { if (n < 0) return null; const r = Math.round(Math.sqrt(n)); return r * r === n ? r : null; };
/* a signed term for building polynomials: coefT(-6, 'x') → '-6x', coefT(1, 'x^2', true) → 'x^2' */
const coefT = (n, v, first) => { const a = Math.abs(n), b = a === 1 && v ? '' : String(a); return (n < 0 ? '-' : first ? '' : '+') + b + v; };

/* dimension marks: a bar with end ticks and a label */
function dimH(stage, x, y, w, label) {
  const bar = add(stage, box(h('div', 'u4l6-dbar h'), w, 12), x, y);
  const lab = add(stage, h('div', 'u4l6-dim c', K(label)), x + w / 2, y - 14);
  return [bar, lab];
}
function dimV(stage, x, y, ht, label) {
  const bar = add(stage, box(h('div', 'u4l6-dbar v'), 12, ht), x, y);
  const lab = add(stage, h('div', 'u4l6-dim', K(label)), x - 8, y + ht / 2);
  lab.style.translate = '-100% -50%';
  return [bar, lab];
}

/* the sum–product search: factor pairs of c (signs arranged toward b), stopping at the pair whose sum is b */
function pairSearch(b, c) {
  const out = [], n = Math.abs(c);
  for (let d = 1; d * d <= n; d++) {
    if (n % d) continue;
    let p = d, q = n / d;
    if (c > 0) { if (b < 0) { p = -p; q = -q; } } else if (b < 0) q = -q; else p = -p;
    out.push([p, q, p + q]);
    if (p + q === b) break;
  }
  return out;
}
const par = (n) => (n < 0 ? `(${n})` : String(n));
const bin = (v, p) => `(${v}${p < 0 ? '-' : '+'}${Math.abs(p)})`;
function spTable(stage, b, c, x, y, w) {
  const rows = pairSearch(b, c);
  const t = add(stage, h('div', 'u4l6-sp'), x, y); t.style.width = w + 'px';
  t.innerHTML = `<div class="u4l6-sph">product ${K(String(c))} · sum ${K(String(b))}</div>`;
  const els = rows.map(([p, q, s]) => {
    const r = h('div', 'u4l6-spr ' + (s === b ? 'hit' : 'miss'), `<span>${K(`${par(p)}\\times${par(q)}`)}</span><span class="ar">→</span><span class="sm">${K(`${s}`)} ${s === b ? '✓' : ''}</span>`);
    t.appendChild(r); r.style.opacity = 0; return r;
  });
  hide(t);
  const win = rows.find((r) => r[2] === b);
  return { t, els, win, run: async (cx) => { await showIn(cx, t, 300); for (const r of els) await cx.anim(r, [{ opacity: 0, transform: 'translateX(-8px)' }, { opacity: 1, transform: 'none' }], 260); if (els.length) await pulse(cx, els[els.length - 1], 1.06); } };
}

/* ======================================================================
   Section 1. Where the 2 comes from: the square picture
   ====================================================================== */
const SP = { a: [[1, { x: 1 }], [3, {}]], b: [[1, { x: 1 }], [5, {}]], c: [[1, { t: 1 }], [8, {}]], e5a: [[2, { x: 1 }], [3, {}]] };
const spSq = (k) => { const [A, B] = SP[k]; return `(${MT(A)}+${MT(B)})^2`; };
const squarePic = {
  title: 'Where the 2 comes from: the square picture',
  height: 450,
  minW: 900, // drawn this wide and scaled to fit beside the sidebar
  choices: [{ v: 'a', label: tex(spSq('a')) }, { v: 'b', label: tex(spSq('b')) }, { v: 'c', label: tex(spSq('c')) }, { sep: 'Example 5 check:' }, { v: 'e5a', label: '(a)' }],
  intro: (k) => `Expand ${T(spSq(k))} with a picture, then read it backwards.`,
  make(stage, key, ex) {
    const W = ex.W, [A, B] = SP[key], a = MT(A), b = MT(B), AA = MT(msq(A)), BB = MT(msq(B)), AB = MT(mmul(A, B)), MID = MT(mmul([2, {}], mmul(A, B)));
    const S = 330, pa = Math.round(S * 0.64), pb = S - pa, x0 = 90, y0 = 64;
    const cell = (x, y, w, ht) => add(stage, box(h('div', 'u4l6-cell blank'), w, ht), x, y);
    const TL = cell(x0, y0, pa, pa), TR = cell(x0 + pa, y0, pb, pa), BL = cell(x0, y0 + pa, pa, pb), BR = cell(x0 + pa, y0 + pa, pb, pb);
    const cells = [TL, TR, BL, BR]; hide(...cells);
    const fillCell = (c, e, cls, src) => { e.className = 'u4l6-cell ' + cls; e.innerHTML = K(src); return c.anim(e, [{ transform: 'scale(.9)', opacity: 0.4 }, { transform: 'scale(1)', opacity: 1 }], 420); };
    const dims = [...dimH(stage, x0, y0 - 20, pa, a), ...dimH(stage, x0 + pa, y0 - 20, pb, b), ...dimV(stage, x0 - 20, y0, pa, a), ...dimV(stage, x0 - 20, y0 + pa, pb, b)];
    hide(...dims);
    const side = add(stage, h('div', 'u4l6-tag c', `side ${K(`${a}+${b}`)}`), x0 + S / 2, y0 + S + 30); hide(side); side.style.textTransform = 'none'; side.style.fontSize = '17px';
    const PX = x0 + S + 60;
    const L = (y, src, cls = '') => { const e = add(stage, h('div', 'u4l6-eq ' + cls, K(src)), PX, y); hide(e); return e; };
    const l1 = L(80, `(${a}+${b})^2=(${a}+${b})(${a}+${b})`);
    const l2 = L(146, `=${AA}+${AB}+${AB}+${BB}`);
    const l3 = L(212, `=${AA}+\\textcolor{#8a560a}{${MID}}+${BB}`);
    const back = add(stage, h('div', 'u4l6-chk', `${ARR}${K(`${AA}+${MID}+${BB}=(${a}+${b})^2`)}`), PX, 296); hide(back);
    return [{
      cap: `${T(`(${a}+${b})^2`)} is the area of a <b>square</b> with side ${T(`${a}+${b}`)}.`,
      run: (c) => Promise.all([...cells.map((e) => appear(c, e, 300)), ...dims.map((e) => appear(c, e, 350)), c.pop(side, 380, { delay: 200 }), showIn(c, l1, 350, { delay: 200 })])
    }, {
      cap: `Cut it into four pieces. Two are <b>squares</b>: ${T(`${a}\\times ${a}=${AA}`)} in one corner and ${T(`${b}\\times ${b}=${BB}`)} in the other.`,
      run: (c) => Promise.all([fillCell(c, TL, 'aa', AA), fillCell(c, BR, 'bb', BB)])
    }, {
      cap: `The other two are <b>rectangles</b>, each ${T(a)} by ${T(b)}: ${T(AB)} and ${T(AB)}.`,
      run: (c) => Promise.all([fillCell(c, TR, 'ab', AB), fillCell(c, BL, 'ab', AB), showIn(c, l2, 350, { delay: 200 })])
    }, {
      cap: `Add the pieces. The two rectangles make the middle term: ${T(`${AB}+${AB}=${MID}`)}. That’s <b>2 × ${T(a)} × ${T(b)}</b>, where the <b>2</b> comes from.`,
      run: (c) => Promise.all([pulse(c, TR, 1.06), pulse(c, BL, 1.06), showIn(c, l3, 350, { delay: 150 })])
    }, {
      cap: `Run it backwards to <b>factor</b>: ${T(`${AA}+${MID}+${BB}=(${a}+${b})^2`)}. The corner squares give the roots ${T(a)} and ${T(b)}; the rectangles give the middle.`,
      run: (c) => showIn(c, back, 400)
    }];
  }
};

/* ======================================================================
   Section 1. Can these tiles make a square? (from Math 10C 4.6)
   ====================================================================== */
const SQT = {
  b: { L: 'x', s: 1, nx: 8, nu: 16 }, kd: { L: 'x', s: 1, nx: 10, nu: 16 },
  e1a: { L: 'x', s: 1, nx: 6, nu: 9 }, e1b: { L: 'x', s: 1, nx: -6, nu: 9 }, e1c: { L: 'x', s: 1, nx: 7, nu: 10 }, e1d: { L: 'x', s: 1, nx: 10, nu: -25 }
};
const sqtQ = (d) => coefT(d.s * d.s, d.L + '^2', true) + coefT(d.nx, d.L) + coefT(d.nu, '');
function tileEl(kind, sign, w, ht, lab) {
  const e = h('div', `u4l6-t u4l6-k${kind} ${sign < 0 ? 'neg' : 'pos'}${lab ? ' u4l6-k2l' : ''}`, lab || '');
  box(e, w, ht); e.style.setProperty('--ms', Math.max(10, Math.min(w, ht) * 0.95) + 'px'); return e;
}
const squareTiles = {
  title: 'Can the tiles make a square?',
  height: 490,
  minW: 900, // drawn this wide and scaled to fit beside the sidebar
  choices: [{ v: 'b', label: tex(sqtQ(SQT.b)) }, { v: 'kd', label: 'Kit D' }, { sep: 'Example 1 check:' }, { v: 'e1a', label: '(a)' }, { v: 'e1b', label: '(b)' }, { v: 'e1c', label: '(c)' }, { v: 'e1d', label: '(d)' }],
  intro: (k) => `Build ${T(sqtQ(SQT[k]))} with algebra tiles. Can they make a <b>square</b>? Use every tile.`,
  make(stage, key, ex) {
    const W = ex.W, d = SQT[key], { s, L } = d, q = sqtQ(d), nX = Math.abs(d.nx), sx = Math.sign(d.nx), nU = Math.abs(d.nu), su = Math.sign(d.nu);
    const X = 150, U = 30, x0 = 74, y0 = 64;
    const split = nX % (2 * s) === 0, k = split ? nX / (2 * s) : 0, kR = split ? k : Math.floor(nX / 2), kB = split ? k : nX - kR;
    const A = s === 1 ? L : s + L, sg = sx < 0 ? '-' : '+';
    const hd = add(stage, h('div', 'u4l6-eq big', K(q)), W - 24, 10); hd.style.translate = '-100% 0';
    // the tray of loose tiles, scaled to fit
    const TX = 474, TY = 118, TW = W - TX - 18, TH = 300;
    const tray = add(stage, box(h('div', 'u4l6-tray'), TW, TH + 30), TX - 10, TY - 30);
    add(tray, h('div', 'u4l6-tray-l', 'the tiles'), 12, 4).style.position = 'absolute';
    let f = 1, lay;
    const layout = (f) => {
      const g = 6 * f + 2, pos = { x2: [], x: [], u: [] }; let y = TY;
      const row = (n, w, ht, arr) => { const per = Math.max(1, Math.floor((TW - 20 + g) / (w + g))); for (let i = 0; i < n; i++) arr.push([TX + (i % per) * (w + g), y + Math.floor(i / per) * (ht + g)]); y += Math.ceil(n / per) * (ht + g) + 10; };
      row(s * s, X * f, X * f, pos.x2); row(nX, U * f, X * f, pos.x); row(nU, U * f, U * f, pos.u);
      return { pos, hgt: y - TY };
    };
    for (; f > 0.3; f -= 0.05) { lay = layout(f); if (lay.hgt <= TH) break; }
    const mk = (kind, sign, w, ht, p, lab) => add(stage, tileEl(kind, sign, w, ht, lab), p[0], p[1]);
    const x2s = lay.pos.x2.map((p) => mk(2, 1, X * f, X * f, p, K(L + '^2')));
    x2s.forEach((e) => (e.style.setProperty('--ls', Math.round(X * f * 0.24) + 'px')));
    const xs = lay.pos.x.map((p) => mk(1, sx, U * f, X * f, p));
    const us = lay.pos.u.map((p) => mk(0, su, U * f, U * f, p));
    const grow = (e, l, t, w, ht, ms = 750, delay = 0) => (c) => c.anim(e, [{ left: e.style.left, top: e.style.top, width: e.style.width, height: e.style.height }, { left: l + 'px', top: t + 'px', width: w + 'px', height: ht + 'px' }], ms, { delay });
    const x2Jobs = x2s.map((e, i) => (c) => { e.style.setProperty('--ls', Math.round(X * 0.24) + 'px'); return grow(e, x0 + (i % s) * X, y0 + Math.floor(i / s) * X, X, X, 750, i * 40)(c); });
    const right = [], bottom = [];
    for (let cI = 0; cI < kR; cI++) for (let r = 0; r < s; r++) right.push([x0 + s * X + cI * U, y0 + r * X, U, X]);
    for (let cI = 0; cI < kB; cI++) for (let r = 0; r < s; r++) bottom.push([x0 + r * X, y0 + s * X + cI * U, X, U]);
    const xDest = [...right, ...bottom];
    const xJobs = xs.map((e, i) => grow(e, ...xDest[i], 800, Math.min(i * 22, 600)));
    const cornerCells = []; for (let r = 0; r < k; r++) for (let cI = 0; cI < k; cI++) cornerCells.push([x0 + s * X + cI * U, y0 + s * X + r * U]);
    const uJobs = us.map((e, i) => (cornerCells[i] ? grow(e, ...cornerCells[i], U, U, 750, Math.min(i * 18, 600)) : null)).filter(Boolean);
    const holes = cornerCells.slice(nU).map(([l, t]) => { const e = add(stage, box(h('div', 'u4l6-hole'), U, U), l, t); hide(e); return e; });
    const side = s * X + k * U;
    const flash = add(stage, box(h('div', 'u4l6-flash'), (split ? k : kR) * U + 8, (split ? k : kB) * U + 8), x0 + s * X - 4, y0 + s * X - 4); hide(flash);
    const dims = split ? [...dimH(stage, x0, y0 - 18, s * X, A), ...dimH(stage, x0 + s * X, y0 - 18, k * U, (sx < 0 ? '-' : '') + k),
      ...dimV(stage, x0 - 18, y0, s * X, A), ...dimV(stage, x0 - 18, y0 + s * X, k * U, (sx < 0 ? '-' : '') + k)] : [];
    hide(...dims);
    const sideT = `${A}${sg}${k}`, res = `${q}=(${sideT})^2`;
    const sideTag = add(stage, h('div', 'u4l6-tag c', `side ${K(sideT)}`), x0 + side / 2, y0 + side + 26); hide(sideTag); sideTag.style.fontSize = '17px'; sideTag.style.textTransform = 'none';
    const PX = 470;
    const eqRes = add(stage, h('div', 'u4l6-eq u4l6-boxed', K(res)), PX, 150); hide(eqRes);
    const eqChk = add(stage, h('div', 'u4l6-chk', `${ARR}${K(`(${sideT})^2=${coefT(s * s, L + '^2', true)}${sg}2(${A})(${k})+${k * k}=${q}`)} <b class="u4l6-okc">✓</b>`), PX, 236); hide(eqChk);
    eqChk.style.width = (W - PX - 18) + 'px'; eqChk.style.whiteSpace = 'normal';
    const stamp = add(stage, h('div', 'u4l6-stamp no', 'NOT A SQUARE'), PX + 40, 200); hide(stamp);
    const xName = `${T(L)}-tile`, x2Name = `${T(L + '^2')}-tile`;
    const rect = () => { const w = pairSearch(d.nx, d.nu).find((r) => r[2] === d.nx); return w ? ` These tiles do make a <b>rectangle</b>, though: ${KN(`${q}=${bin(L, w[0])}${bin(L, w[1])}`)}.` : ''; };
    const steps = [{
      cap: `The tiles for ${T(q)}: one ${x2Name}, ${nX} ${sx < 0 ? '<b>negative</b> ' : ''}${xName}s${sx < 0 ? ' (white, with a minus sign)' : ''} and ${nU} ${su < 0 ? '<b>negative</b> ' : ''}unit tiles${su < 0 ? ' (white, with a minus sign)' : ''}.`,
      run: (c) => Promise.all([...x2s.map((e, i) => pulse(c, e, 1.12, { delay: i * 50 })), ...xs.map((e, i) => pulse(c, e, 1.2, { delay: 350 + i * 18 })), ...us.map((e, i) => pulse(c, e, 1.3, { delay: 700 + i * 10 }))])
    }, {
      cap: `Start the square with the ${x2Name} in the top-left corner. Its sides are ${T(L)} by ${T(L)}.`,
      run: (c) => Promise.all(x2Jobs.map((j) => j(c)))
    }];
    const stop = (cap, keep) => steps.push({ cap, run: (c) => Promise.all([keep ? null : fadeOut(c, tray, 300), stampIn(c, stamp)]) });
    if (!split) {
      steps.push({
        cap: `Share the ${nX} ${xName}s equally between the right side and the bottom? ${nX} is <b>odd</b>: ${kR} on one side, ${kB} on the other. The sides <b>don’t match</b>, so no square.`,
        run: async (c) => { await Promise.all(xJobs.map((j) => j(c))); await showIn(c, flash, 300); }
      });
      stop(`${T(q)} is <b>not</b> a perfect square trinomial.${isq(nU) == null ? ` (The last term fails the test too: ${nU} is not a perfect square.)` : ''}${rect()}`, true);
      return steps;
    }
    steps.push({
      cap: `Share the ${nX} ${xName}s equally: ${k} along the right side and ${k} along the bottom.${sx < 0 ? ` They are <b>negative</b>, so each side is ${T(A)} <b>minus</b> ${k}.` : ''}`,
      run: (c) => Promise.all(xJobs.map((j) => j(c)))
    });
    if (su < 0) {
      steps.push({
        cap: `The corner is a ${k} by ${k} square: ${sx < 0 ? T(`(-${k})(-${k})`) : T(`(${k})(${k})`)} ${T('=+' + k * k)}, so it needs <b>positive</b> tiles. These ${nU} unit tiles are <b>negative</b>. A square’s corner can never be negative.`,
        run: async (c) => { await Promise.all(uJobs.map((j) => j(c))); await showIn(c, flash, 300); }
      });
      stop(`${T(q)} is <b>not</b> a perfect square trinomial: the last term must be a perfect square <b>and positive</b>.`);
      return steps;
    }
    if (nU !== k * k) {
      steps.push({
        cap: `The corner is a ${k} by ${k} square: it needs ${T(`${k}^2=${k * k}`)} unit tiles. There are only ${nU}: <b>${k * k - nU} holes</b>!`,
        run: async (c) => { await Promise.all(uJobs.map((j) => j(c))); await Promise.all(holes.map((e, i) => c.pop(e, 300, { delay: i * 60 }))); }
      });
      stop(`${T(q)} is <b>not</b> a perfect square trinomial: ${nU} isn’t ${k * k}.${rect()}`);
      return steps;
    }
    steps.push({
      cap: `The corner is a ${k} by ${k} square: it needs ${T(`${k}^2=${k * k}`)} unit tiles${sx < 0 ? ` (negative × negative, so they’re <b>positive</b>)` : ''}. There are exactly ${nU}. Every tile is used!`,
      run: (c) => Promise.all([...uJobs.map((j) => j(c)), fadeOut(c, tray, 400, { delay: 500 })])
    }, {
      cap: `The tiles make a square with side ${T(sideT)}. So ${T(res)}: a <b>perfect square trinomial</b>.`,
      run: (c) => Promise.all([...dims.map((e) => appear(c, e, 350)), c.pop(sideTag, 380, { delay: 200 }), c.pop(eqRes, 420, { delay: 300 })])
    }, {
      cap: `Check by expanding: ${T(`(${sideT})^2=${q}`)} ✓. Expanding <b>builds</b> the square; factoring <b>reads its side</b>.`,
      run: (c) => showIn(c, eqChk, 400)
    });
    return steps;
  }
};

/* ======================================================================
   Section 1. The three-part test (from Math 10C 4.6)
   ====================================================================== */
const PS = {
  t16: { t: ['t^2', '+16t', '+64'], r: [['\\sqrt{t^2}=t', 1], ['\\sqrt{64}=8', 1], ['2(t)(8)=16t', 1]], ans: '(t+8)^2', chk: '(t+8)^2=t^2+16t+64' },
  x10: { t: ['x^2', '+10x', '+16'], r: [['\\sqrt{x^2}=x', 1], ['\\sqrt{16}=4', 1], ['2(x)(4)=8x\\neq10x', 0]],
    fail: `Twice the product is ${T('2(x)(4)=8x')}, but the middle term is ${T('10x')}. Test 3 <b>fails</b>.`,
    more: ` It still factors, just not as a square: ${T('(x+2)(x+8)')}.` },
  e1a: { t: ['x^2', '+6x', '+9'], r: [['\\sqrt{x^2}=x', 1], ['\\sqrt{9}=3', 1], ['2(x)(3)=6x', 1]], ans: '(x+3)^2', chk: '(x+3)^2=x^2+6x+9' },
  e1b: { t: ['x^2', '-6x', '+9'], r: [['\\sqrt{x^2}=x', 1], ['\\sqrt{9}=3', 1], ['2(x)(3)=6x', 1]], ans: '(x-3)^2', chk: '(x-3)^2=x^2-6x+9' },
  e1c: { t: ['x^2', '+7x', '+10'], r: [['\\sqrt{x^2}=x', 1], ['10\\text{ is not a perfect square}', 0], ['', 0]],
    fail: `${T('10')} is <b>not</b> a perfect square (${T('3^2=9')}, ${T('4^2=16')}). Test 2 fails, so we can stop right here.` },
  e1d: { t: ['x^2', '+10x', '-25'], r: [['\\sqrt{x^2}=x', 1], ['-25\\text{ is negative}', 0], ['', 0]],
    fail: `The last term is ${T('-25')}. A square is never negative: ${T('5^2=25')} and ${T('(-5)^2=25')}. Test 2 fails.` }
};
const psQ = (t) => t.join('');
const psCheck = {
  title: 'The three-part test: is it a perfect square trinomial?',
  height: 400,
  minW: 940, // drawn this wide and scaled to fit beside the sidebar
  choices: [{ v: 't16', label: tex('t^2+16t+64') }, { v: 'x10', label: tex('x^2+10x+16') }, { sep: 'Example 1 check:' }, { v: 'e1a', label: '(a)' }, { v: 'e1b', label: '(b)' }, { v: 'e1c', label: '(c)' }, { v: 'e1d', label: '(d)' }],
  intro: (k) => `Is ${T(psQ(PS[k].t))} a perfect square trinomial? Run the <b>three tests</b>, in order. All three must pass.`,
  make(stage, key, ex) {
    const W = ex.W, d = PS[key], cls = ['aa', 'ab', 'bb'], rcls = ['aa', 'bb', 'ab'], BX = [0, 2, 1]; // rows test first, last, middle
    const row = add(stage, h('div', 'u4l6-terms'), 24, 20);
    const boxes = d.t.map((t, i) => { const b = h('span', 'u4l6-term ' + cls[i], K(t)); row.appendChild(b); return b; });
    const Q = ['Is the <b>first</b> term a perfect square?', 'Is the <b>last</b> term a perfect square (and +)?', 'Is the <b>middle</b> twice the product?'];
    const rows = Q.map((q, i) => add(stage, h('div', 'u4l6-crow ' + rcls[i], `<span class="u4l6-lamp"></span><span class="cq"><b class="n">${i + 1}</b>${q}</span><span class="r"></span>`), 24, 106 + i * 62));
    const q0 = psQ(d.t);
    const failAt = d.r.findIndex((r) => !r[1]);
    const stamp = add(stage, h('div', 'u4l6-stamp ' + (failAt < 0 ? 'yes' : 'no'), failAt < 0 ? `PERFECT SQUARE<small>${K(d.ans)}</small>` : 'NOT A PERFECT<br>SQUARE TRINOMIAL'), W - 30, failAt < 0 ? 116 : 296);
    stamp.style.translate = '-100% 0'; hide(stamp);
    const ans = failAt < 0 ? add(stage, h('div', 'u4l6-eq u4l6-boxed', K(`${q0}=${d.ans}`)), 24, 300) : null;
    const chk = failAt < 0 ? add(stage, h('div', 'u4l6-chk', `${ARR}${K(d.chk)} <b class="u4l6-okc">✓</b>`), 24, 300) : null;
    if (ans) { hide(ans, chk); chk.style.left = 'auto'; chk.style.right = '22px'; chk.style.top = '304px'; }
    const steps = [];
    const light = async (c, i, ok) => {
      const r = rows[i], lamp = r.querySelector('.u4l6-lamp');
      r.querySelector('.r').innerHTML = K(d.r[i][0]);
      boxes.forEach((b, j) => b.classList.toggle('hot', j === BX[i]));
      lamp.classList.add(ok ? 'ok' : 'no'); lamp.textContent = ok ? '✓' : '✗';
      await Promise.all([c.pop(lamp, 380), showIn(c, r.querySelector('.r'), 350, { delay: 100 })]);
      if (!ok) await c.shake(boxes[BX[i]]);
    };
    const t = d.t;
    const caps = [
      () => `<b>Test 1.</b> The first term is ${T(t[0])}: a perfect square, because ${T(d.r[0][0])}.`,
      () => `<b>Test 2.</b> The last term is ${T(t[2].replace(/^\+/, ''))}: a perfect square, because ${T(d.r[1][0])}. And it’s positive.`,
      () => `<b>Test 3.</b> Twice the product of the square roots: ${T(d.r[2][0])}. That matches the middle term${t[1][0] === '-' ? `, and its <b>minus</b> sign goes into the bracket` : ''}.`
    ];
    for (let i = 0; i < 3; i++) {
      if (failAt >= 0 && i > failAt) break;
      const ok = i !== failAt;
      steps.push({ cap: ok ? caps[i]() : d.fail, run: (c) => light(c, i, ok) });
    }
    if (failAt >= 0) {
      steps.push({
        cap: `One failed test is enough: ${T(q0)} is <b>not</b> a perfect square trinomial.${d.more || ''}`,
        run: async (c) => { rows.slice(failAt + 1).forEach((r) => r.classList.add('skip')); boxes.forEach((b) => b.classList.remove('hot')); await stampIn(c, stamp); }
      });
      return steps;
    }
    steps.push({
      cap: `All three tests pass, so it is a perfect square trinomial: ${T(`${q0}=${d.ans}`)}. The bracket holds the two square roots, joined by the middle term’s sign.`,
      run: async (c) => { boxes.forEach((b) => b.classList.remove('hot')); await Promise.all([stampIn(c, stamp), c.pop(ans, 420, { delay: 250 })]); }
    });
    steps.push({ cap: `Check by expanding: ${T(d.chk)} ✓`, run: (c) => showIn(c, chk, 400) });
    return steps;
  }
};

/* ======================================================================
   Sections 2 and 3. Factor it: roots, test the middle, square the bracket (two mounts)
   ====================================================================== */
const PF = {
  s25: [[1, { x: 1 }], [5, {}], 1], s9: [[1, { x: 1 }], [3, {}], 1],
  e2a: [[1, { x: 1 }], [4, {}], 1], e2b: [[1, { x: 1 }], [7, {}], 1], e2c: [[1, { x: 1 }], [10, {}], 1], e2d: [[1, { x: 1 }], [9, {}], 1],
  d25: [[1, { x: 1 }], [5, {}], -1], d9: [[1, { x: 1 }], [3, {}], -1],
  e3a: [[1, { x: 1 }], [4, {}], -1], e3b: [[1, { x: 1 }], [7, {}], -1], e3c: [[1, { x: 1 }], [10, {}], -1], e3d: [[1, { x: 1 }], [9, {}], -1]
};
const pfParts = (key) => {
  const [A, B, s] = PF[key], a = MT(A), b = MT(B), aa = MT(msq(A)), bb = MT(msq(B)), ab = MT(mmul(A, B)), mid = MT(mmul([2, {}], mmul(A, B))), sg = s < 0 ? '-' : '+';
  return { a, b, aa, bb, ab, mid, sg, s, q: `${aa}${sg}${mid}+${bb}` };
};
function pstDef(concept, checkLabel, checks) {
  return {
    title: 'Factor it: two roots, test the middle, square the bracket',
    height: 470,
    minW: 880, // drawn this wide and scaled to fit beside the sidebar
    choices: [...concept.map((k) => ({ v: k, label: tex(pfParts(k).q) })), { sep: checkLabel }, ...checks.map(([k, l]) => ({ v: k, label: `(${l})` }))],
    intro: (key) => `Factor ${T(pfParts(key).q)}. Square root the first and last terms, test the middle, then write one bracket, squared.`,
    make(stage, key, ex) {
      const W = ex.W, { a, b, aa, bb, ab, mid, sg, s, q } = pfParts(key), SG = s < 0 ? MINUS : PLUS;
      const xs = [W / 2 - 230, W / 2, W / 2 + 230];
      const terms = [[aa, 'aa'], [`${sg}${mid}`, 'ab'], [`+${bb}`, 'bb']].map(([t, cls], i) => add(stage, h('div', 'u4l6-term big c ' + cls, K(t)), xs[i], 50));
      const arrow = (x, lab) => { const e = add(stage, h('div', 'u4l6-darr', `<i>${lab}</i>`), x - 2, 88); hide(e); return e; };
      const ar1 = arrow(xs[0], '√'), ar3 = arrow(xs[2], '√'), ar2 = arrow(xs[1], '?');
      const r1 = add(stage, h('div', 'u4l6-root c', K(`\\sqrt{${aa}}=${a}`)), xs[0], 164), r3 = add(stage, h('div', 'u4l6-root c', K(`\\sqrt{${bb}}=${b}`)), xs[2], 164);
      const r2 = add(stage, h('div', 'u4l6-root mid c', K(`2(${a})(${b})=${mid}`) + ' <b class="u4l6-okc">✓</b>'), xs[1], 164);
      hide(r1, r2, r3);
      const F = add(stage, h('div', 'u4l6-eq big c u4l6-boxed', K(`${q}=(${a}${SG}${b})^2`)), W / 2, 256); hide(F);
      // the check: a 2 × 2 multiplication box
      const gx = 34, gy = 318, hw = 76, cw = 128, ch = 44;
      const grid = add(stage, h('div', 'u4l6-grid'), gx, gy); hide(grid);
      grid.style.gridTemplateColumns = `${hw}px ${cw}px ${cw}px`;
      const cell = (html, cls) => { const e = h('div', 'u4l6-gc ' + cls, html); e.style.height = ch + 'px'; grid.appendChild(e); return e; };
      cell('', 'corner'); cell(K(a), 'hd'); cell(K(`${sg}${b}`), 'hd');
      cell(K(a), 'hd'); const c11 = cell(K(aa), 'in aa'), c12 = cell(K(`${sg}${ab}`), 'in ab');
      cell(K(`${sg}${b}`), 'hd'); const c21 = cell(K(`${sg}${ab}`), 'in ab'), c22 = cell(K(`+${bb}`), 'in bb');
      const ins = [c11, c12, c21, c22]; ins.forEach((e) => (e.style.opacity = 0));
      const cx0 = gx + hw + 2 * cw + 40;
      const C1 = add(stage, h('div', 'u4l6-eq', K(`(${a}${sg}${b})^2=${aa}${sg}${ab}${sg}${ab}+${bb}`)), cx0, gy + 6); hide(C1);
      const C2 = add(stage, h('div', 'u4l6-eq u4l6-good', K(`=${q}`) + ' ✓'), cx0 + 10, gy + 62); hide(C2);
      const note = add(stage, h('div', 'u4l6-pill', `the two middle terms <b>add</b>: ${K(`${sg}${ab}${sg}${ab}=${sg}${mid}`)}`), cx0 + 10, gy + 112); hide(note);
      return [{
        cap: `${T(q)} has three terms. Test the first and last: are they perfect squares? Take their <b>square roots</b>: ${T(`\\sqrt{${aa}}=${a}`)} and ${T(`\\sqrt{${bb}}=${b}`)}.`,
        run: (c) => Promise.all([showIn(c, ar1, 300, { from: 'translateY(-10px)' }), showIn(c, ar3, 300, { from: 'translateY(-10px)' }), c.pop(r1, 380, { delay: 200 }), c.pop(r3, 380, { delay: 300 })])
      }, {
        cap: `Test the middle: twice the product of the roots is ${T(`2(${a})(${b})=${mid}`)}. It matches ✓, so it’s a <b>perfect square trinomial</b>.`,
        run: (c) => Promise.all([showIn(c, ar2, 300, { from: 'translateY(-10px)' }), c.pop(r2, 380, { delay: 200 })])
      }, {
        cap: `Write the roots in <b>one</b> bracket, joined by the middle term’s sign (${s < 0 ? '<b>minus</b>' : '<b>plus</b>'}), and square it: ${T(`${q}=(${a}${sg}${b})^2`)}.`,
        run: (c) => c.pop(F, 420)
      }, {
        cap: `Check by expanding ${T(`(${a}${sg}${b})(${a}${sg}${b})`)}: the two middle terms ${T(`${sg}${ab}`)} are <b>equal</b>, and they add to ${T(`${sg}${mid}`)}. The corner ${T(s < 0 ? `(-${b})(-${b})=+${bb}` : `(${b})(${b})=${bb}`)} is positive. We get back ${T(q)} ✓`,
        run: async (c) => {
          await appear(c, grid, 300);
          for (const e of ins) await appear(c, e, 240);
          c12.classList.add('lit'); c21.classList.add('lit');
          await showIn(c, C1, 350);
          await Promise.all([showIn(c, C2, 350), c.pop(note, 350, { delay: 150 })]);
        }
      }];
    }
  };
}
const pst1 = pstDef(['s25', 's9'], 'Example 2 check:', [['e2a', 'a'], ['e2b', 'b'], ['e2c', 'c'], ['e2d', 'd']]);
const pst2 = pstDef(['d25', 'd9'], 'Example 3 check:', [['e3a', 'a'], ['e3b', 'b'], ['e3c', 'c'], ['e3d', 'd']]);

/* ======================================================================
   Section 3. Only the middle sign changes: (x + k)² beside (x − k)²
   ====================================================================== */
const signCase = {
  title: 'Sum case beside difference case',
  height: 470,
  minW: 900, // drawn this wide and scaled to fit beside the sidebar
  choices: [{ v: 5, label: tex('(x\\pm5)^2') }, { v: 3, label: tex('(x\\pm3)^2') }, { v: 7, label: tex('(x\\pm7)^2') }],
  intro: (k) => `Expand ${T(`(x+${k})^2`)} and ${T(`(x-${k})^2`)} side by side. What changes?`,
  make(stage, k, ex) {
    const W = ex.W, kk = k * k, hw = 66, cw = 116, ch = 46, gy = 74;
    const build = (s, gx) => {
      const sg = s < 0 ? '-' : '+';
      const title = add(stage, h('div', 'u4l6-eq c', K(`(x${sg}${k})^2=(x${sg}${k})(x${sg}${k})`)), gx + (hw + 2 * cw) / 2, 34);
      const g = add(stage, h('div', 'u4l6-grid'), gx, gy); g.style.gridTemplateColumns = `${hw}px ${cw}px ${cw}px`;
      const cell = (html, cls) => { const e = h('div', 'u4l6-gc ' + cls, html); e.style.height = ch + 'px'; g.appendChild(e); return e; };
      cell('', 'corner'); cell(K('x'), 'hd'); cell(K(`${sg}${k}`), 'hd');
      cell(K('x'), 'hd'); const a1 = cell(K('x^2'), 'in aa'), a2 = cell(K(`${sg}${k}x`), 'in ab');
      cell(K(`${sg}${k}`), 'hd'); const a3 = cell(K(`${sg}${k}x`), 'in ab'), a4 = cell(K(`+${kk}`), 'in bb');
      const ins = [a1, a2, a3, a4]; ins.forEach((e) => (e.style.opacity = 0));
      const L1 = add(stage, h('div', 'u4l6-eq c', K(`=x^2${sg}${k}x${sg}${k}x+${kk}`)), gx + (hw + 2 * cw) / 2, gy + 3 * ch + 40);
      const L2 = add(stage, h('div', 'u4l6-eq c u4l6-boxed', K(`=x^2\\textcolor{${s < 0 ? '#c93a33' : '#12805a'}}{${sg}}${2 * k}x\\textcolor{#34507a}{+${kk}}`)), gx + (hw + 2 * cw) / 2, gy + 3 * ch + 96);
      hide(title, g, L1, L2);
      return { title, g, ins, L1, L2, a4 };
    };
    const gw = hw + 2 * cw + 6, gap = Math.max(60, W - 2 * gw - 80);
    const P = build(1, 40), M = build(-1, 40 + gw + gap);
    const note = add(stage, h('div', 'u4l6-note c', `Only the <b>middle sign</b> changes. The last term is <b>+</b> both times: ${K(`(-${k})(-${k})=+${kk}`)}.`), W / 2, 384); hide(note);
    const vs = add(stage, h('div', 'u4l6-vs c', `Not the same as Lesson 5: ${K(`(x+${k})(x-${k})=x^2-${kk}`)}, no middle term.`), W / 2, 436); hide(vs);
    return [{
      cap: `Set up both: ${T(`(x+${k})^2`)} on the left, ${T(`(x-${k})^2`)} on the right. Each one is a binomial times <b>itself</b>.`,
      run: (c) => Promise.all([showIn(c, P.title, 350), showIn(c, M.title, 350, { delay: 100 }), appear(c, P.g, 300), appear(c, M.g, 300, { delay: 100 })])
    }, {
      cap: `${T(`(x+${k})^2`)}: ${T('x^2')}, two rectangles of ${T(`+${k}x`)}, and ${T(`(+${k})(+${k})=+${kk}`)}.`,
      run: async (c) => { for (const e of P.ins) await appear(c, e, 240); }
    }, {
      cap: `${T(`(x-${k})^2`)}: the rectangles are ${T(`-${k}x`)} each. The corner is ${T(`(-${k})(-${k})`)}: negative × negative = <b>positive</b>, ${T(`+${kk}`)}!`,
      run: async (c) => { for (const e of M.ins) await appear(c, e, 240); M.a4.classList.add('lit'); await pulse(c, M.a4, 1.12); }
    }, {
      cap: `Collect: ${T(`(x+${k})^2=x^2+${2 * k}x+${kk}`)} and ${T(`(x-${k})^2=x^2-${2 * k}x+${kk}`)}.`,
      run: (c) => Promise.all([showIn(c, P.L1, 300), showIn(c, M.L1, 300), c.pop(P.L2, 380, { delay: 300 }), c.pop(M.L2, 380, { delay: 400 })])
    }, {
      cap: `Compare: same first term, same last term, same size middle. Only the <b>middle sign</b> changes. So ${T(`x^2-${2 * k}x+${kk}=(x-${k})^2`)}: the middle sign goes in the bracket.`,
      run: (c) => showIn(c, note, 350)
    }, {
      cap: `Don’t mix it up with the difference of squares from Lesson 5: ${T(`(x+${k})(x-${k})=x^2-${kk}`)} has <b>no</b> middle term, and its last term is negative.`,
      run: (c) => showIn(c, vs, 350)
    }];
  }
};

/* ======================================================================
   Section 4. Perfect square or ordinary? Test first, then the shortcut or sum–product
   ====================================================================== */
const CH = { n24: [1, 10, 24], n16: [1, 10, 16], e5a: [4, 12, 9], e5b: [1, 9, 18], e5c: [9, -30, 25], e5d: [1, -5, -14] };
const chQ = ([a, b, c]) => coefT(a, 'x^2', true) + coefT(b, 'x') + coefT(c, '');
const chooser = {
  title: 'Perfect square, or ordinary? Test first, then choose the method',
  height: 470,
  minW: 920, // drawn this wide and scaled to fit beside the sidebar
  choices: [{ v: 'n24', label: tex(chQ(CH.n24)) }, { v: 'n16', label: tex(chQ(CH.n16)) }, { sep: 'Example 5 check:' }, ...['a', 'b', 'c', 'd'].map((l) => ({ v: 'e5' + l, label: `(${l})` }))],
  intro: (k) => `Factor ${T(chQ(CH[k]))}. Run the three-part test first: it decides the method.`,
  make(stage, key, ex) {
    const W = ex.W, [a, b, c] = CH[key], q = chQ(CH[key]), ra = isq(a), rc = isq(c);
    const A = ra === 1 ? 'x' : `${ra}x`, AA = coefT(a, 'x^2', true);
    const t2 = rc != null && c > 0, t3 = t2 && 2 * ra * rc === Math.abs(b), pst = t2 && t3;
    const failAt = !t2 ? 1 : !t3 ? 2 : -1;
    const top = add(stage, h('div', 'u4l6-eq big', K(q)), 24, 14);
    const Q = ['first term a square?', 'last term a square (and +)?', 'middle = twice the product?'];
    const R = [
      [true, `\\sqrt{${AA}}=${A}`],
      [t2, c < 0 ? `${c}\\text{ is negative}` : rc == null ? `${c}\\text{ is not a square}` : `\\sqrt{${c}}=${rc}`],
      [t3, rc == null ? '' : `2(${A})(${rc})=${2 * ra * rc}x${t3 ? '' : `\\neq${Math.abs(b)}x`}`]
    ];
    const rows = Q.map((qq, i) => {
      const r = add(stage, h('div', 'u4l6-crow sm', `<span class="u4l6-lamp"></span><span class="cq"><b class="n">${i + 1}</b>${qq}</span><span class="r"></span>`), 24, 92 + i * 54);
      return r;
    });
    const px = Math.round(W * 0.6), pw = W - px - 20;
    let card, res, chkS;
    if (pst) {
      const sg = b < 0 ? '-' : '+';
      res = `${q}=(${A}${sg}${rc})^2`;
      card = add(stage, h('div', 'u4l6-way yes', `<div class="u4l6-way-h">Perfect square: use the shortcut</div>${K(`\\sqrt{${AA}}=${A},\\ \\ \\sqrt{${c}}=${rc}`)}<br>bracket sign: the middle sign, <b>${sg === '-' ? 'minus' : 'plus'}</b>`), px, 92);
      card.style.width = pw + 'px'; hide(card);
      chkS = `(${A}${sg}${rc})^2=${AA}${sg}${ra * rc}x${sg}${ra * rc}x+${c}=${q}`;
    } else {
      card = spTable(stage, b, c, px, 92, pw);
      const [p, qq] = card.win;
      res = `${q}=${bin('x', p)}${bin('x', qq)}`;
      chkS = `${bin('x', p)}${bin('x', qq)}=x^2${coefT(qq, 'x')}${coefT(p, 'x')}${coefT(p * qq, '')}=${q}`;
    }
    const fin = add(stage, h('div', 'u4l6-eq u4l6-boxed', K(res)), 24, 300); hide(fin);
    const chk = add(stage, h('div', 'u4l6-chk', `${ARR}${K(chkS)} <b class="u4l6-okc">✓</b>`), 24, 376); hide(chk);
    const light = async (cx, i) => {
      const r = rows[i], lamp = r.querySelector('.u4l6-lamp'), ok = R[i][0];
      r.querySelector('.r').innerHTML = K(R[i][1]);
      lamp.classList.add(ok ? 'ok' : 'no'); lamp.textContent = ok ? '✓' : '✗';
      await Promise.all([cx.pop(lamp, 380), showIn(cx, r.querySelector('.r'), 350, { delay: 100 })]);
    };
    const steps = [{
      cap: `Test 1: the first term ${T(AA)} is a perfect square, ${T(R[0][1])}.`,
      run: (cx) => light(cx, 0)
    }, {
      cap: t2 ? `Test 2: the last term is a perfect square, ${T(R[1][1])}.` : c < 0 ? `Test 2: the last term is ${T(String(c))}. A square is never negative, so it <b>fails</b>.` : `Test 2: ${T(String(c))} is <b>not</b> a perfect square, so it <b>fails</b>.`,
      run: (cx) => light(cx, 1)
    }];
    if (failAt !== 1) steps.push({
      cap: t3 ? `Test 3: ${T(R[2][1])} matches the middle term ✓` : `Test 3: ${T(`2(${A})(${rc})=${2 * ra * rc}x`)}, but the middle is ${T(`${Math.abs(b)}x`)}. It <b>fails</b>: right squares, wrong middle.`,
      run: (cx) => light(cx, 2)
    });
    if (pst) steps.push({
      cap: 'All three pass: a <b>perfect square trinomial</b>. Use the shortcut: the two roots in one bracket, with the middle term’s sign.',
      run: (cx) => showIn(cx, card, 350)
    });
    else steps.push({
      cap: `A test failed, so it is <b>not</b> a perfect square trinomial.${failAt === 1 ? ' (No need to run test 3.)' : ''} Fall back on <b>sum–product</b>: two numbers that multiply to ${T(String(c))} and add to ${T(String(b))}.`,
      run: async (cx) => { rows.slice(failAt + 1).forEach((r) => r.classList.add('skip')); await card.run(cx); }
    });
    steps.push({
      cap: `So ${T(res)}.`,
      run: (cx) => cx.pop(fin, 420)
    }, {
      cap: `Check by expanding: ${T(chkS)} ✓`,
      run: (cx) => showIn(cx, chk, 400)
    });
    return steps;
  }
};

/* ======================================================================
   Warm-up: can you build a square? (kits of tiles, CSS transitions)
   ====================================================================== */
const KITS = { A: { s: 4, u: 4 }, B: { s: 6, u: 9 }, C: { s: 6, u: 8 }, D: { s: 10, u: 16 } };
function mountKits() {
  const st = document.getElementById('wu-kit'), tabs = document.getElementById('wu-kit-tabs'); if (!st || !tabs) return;
  const X = 104, U = 21, ox = 40, oy = 34;
  let cur = 'A', built = false;
  const tabEls = Object.keys(KITS).map((n) => {
    const b = h('button', 'chip', `Kit ${n}`); b.type = 'button';
    b.addEventListener('click', () => { cur = n; render(false); });
    tabs.appendChild(b); return [n, b];
  });
  const place = (e, x, y, w, ht) => { at(e, x, y); box(e, w, ht); };
  function render(build) {
    tabEls.forEach(([n, b]) => b.classList.toggle('on', n === cur));
    const { s, u } = KITS[cur], k = s / 2, need = k * k;
    st.innerHTML = '';
    const big = h('div', 'u4l6-t u4l6-k2 pos u4l6-k2l u4l6-wt', K('x^2')); big.style.setProperty('--ls', '24px');
    const strips = [], smalls = [];
    for (let i = 0; i < s; i++) strips.push(h('div', 'u4l6-t u4l6-k1 pos u4l6-wt'));
    for (let i = 0; i < u; i++) smalls.push(h('div', 'u4l6-t u4l6-k0 pos u4l6-wt'));
    // loose positions
    const lx = 14, sx0 = lx + X + 24;
    place(big, lx, 26, X, X);
    strips.forEach((e, i) => place(e, sx0 + i * (U + 7), 26, U, X));
    smalls.forEach((e, i) => place(e, sx0 + (i % 10) * (U + 6), 26 + X + 18 + Math.floor(i / 10) * (U + 6), U, U));
    [big, ...strips, ...smalls].forEach((e) => st.appendChild(e));
    const msg = h('div', 'u4l6-kmsg'); st.appendChild(msg);
    const holes = [], dims = [];
    for (let i = u; i < need; i++) { const r = Math.floor(i / k), c = i % k, e = h('div', 'u4l6-hole u4l6-wt-h'); place(e, ox + X + c * U, oy + X + r * U, U, U); st.appendChild(e); holes.push(e); }
    const dT = h('div', 'u4l6-kdim', K(`x+${k}`)); at(dT, ox + (X + k * U) / 2, oy - 26); st.appendChild(dT); dims.push(dT);
    const dL = h('div', 'u4l6-kdim v', K(`x+${k}`)); at(dL, ox - 30, oy + (X + k * U) / 2); st.appendChild(dL); dims.push(dL);
    built = false;
    if (!build) { msg.innerHTML = `<b>Kit ${cur}:</b> 1 big, ${s} strips, ${u} small`; return; }
    const go = () => {
      built = true; st.classList.add('built');
      place(big, ox, oy, X, X);
      strips.forEach((e, i) => { e.style.transitionDelay = (i * 40) + 'ms'; if (i < k) place(e, ox + X + i * U, oy, U, X); else place(e, ox, oy + X + (i - k) * U, X, U); });
      smalls.forEach((e, i) => { e.style.transitionDelay = (200 + i * 30) + 'ms'; const r = Math.floor(i / k), c = i % k; if (i < need) place(e, ox + X + c * U, oy + X + r * U, U, U); });
      const ok = u === need;
      msg.className = 'u4l6-kmsg ' + (ok ? 'ok' : 'no');
      msg.innerHTML = ok ? `<b>✓ A square!</b><br>Side ${K(`x+${k}`)}` : `<b>✗ Not a square.</b><br>${k} strips on each side need a ${K(`${k}\\times${k}`)} corner: <b>${need}</b> small squares. Kit ${cur} has only ${u}.`;
      st.classList.toggle('ok', ok); st.classList.toggle('no', !ok);
    };
    st.classList.remove('built', 'ok', 'no');
    if (build === 'now') go(); else requestAnimationFrame(() => requestAnimationFrame(go));
  }
  document.getElementById('wu-kit-build').addEventListener('click', () => (built ? render(false) : render(true)));
  document.getElementById('wu-kit-reset').addEventListener('click', () => render(false));
  render('now'); // Kit A is already built on the board
}

/* ============ wiring ============ */
function mountExplainers() {
  const defs = { squarePic, squareTiles, psCheck, pst1, pst2, signCase, chooser };
  document.querySelectorAll('[data-explainer]').forEach((el) => new Explainer(el, defs[el.dataset.explainer]));
}
mountExplainers(); mountKits();

/* ============ Stand Up Break! — perfect square trinomials at the whiteboards ============ */
{
  const gcd = (x, y) => (y ? gcd(y, x % y) : Math.abs(x));
  const LET = ['x', 'a', 'm', 'p', 't', 'w', 'y', 'n', 'k'];
  const pstQ = (m, v, k, s) => coefT(m * m, `${v}^2`, true) + coefT(s * 2 * m * k, v) + coefT(k * k, ''); // (mv ± k)²
  const root = (m, v) => (m === 1 ? v : `${m}${v}`);
  const testLine = (m, v, k) => `\\sqrt{${m * m === 1 ? '' : m * m}${v}^2}=${root(m, v)},\\ \\ \\sqrt{${k * k}}=${k},\\ \\ 2(${root(m, v)})(${k})=${2 * m * k}${v}\\ \\checkmark`;
  standup('u4l6', {
    intro: 'Run the three-part test. Perfect square? Use the shortcut. If not, use sum–product. Check by expanding.',
    levels: {
      BEG: (r) => { // x² + 10x + 25 = (x + 5)²
        const v = r.pick(LET), k = r.int(1, 12), q = pstQ(1, v, k, 1);
        return { q, a: [testLine(1, v, k), `${q}=(${v}+${k})^2`] };
      },
      PRG: (r) => { // x² − 14x + 49 = (x − 7)²; 9x² + 12x + 4 = (3x + 2)²
        const v = r.pick(LET), s = r.chance(0.65) ? -1 : 1;
        let m = 1, k = r.int(1, 12);
        if (r.chance(0.4)) { do { m = r.int(2, 5); k = r.int(1, 7); } while (gcd(m, k) !== 1); }
        const q = pstQ(m, v, k, s);
        return { q, a: [testLine(m, v, k), `${q}=(${root(m, v)}${s < 0 ? '-' : '+'}${k})^2`] };
      },
      MAS: (r) => {
        const kind = r.int(0, 2), v = r.pick(['x', 'a', 'm', 't', 'y']);
        if (kind === 0) { // GCF first: 2x² + 20x + 50 = 2(x + 5)²
          const g = r.int(2, 5), k = r.int(1, 8), s = r.sign(), inner = pstQ(1, v, k, s);
          const q = coefT(g, `${v}^2`, true) + coefT(g * s * 2 * k, v) + coefT(g * k * k, '');
          return { q, a: [`\\text{GCF } ${g}:\\quad ${q}=${g}(${inner})`, `${q}=${g}(${v}${s < 0 ? '-' : '+'}${k})^2`] };
        }
        // an impostor (right squares or nearly, wrong middle) or a true one: decide, then factor
        if (kind === 1 || r.chance(0.3)) {
          const k = r.int(2, 9), s = r.sign(), q = pstQ(1, v, k, s);
          return { q, a: [`\\text{PST: }${testLine(1, v, k)}`, `${q}=(${v}${s < 0 ? '-' : '+'}${k})^2`] };
        }
        let p, qq; do { p = r.int(1, 10); qq = r.int(1, 12); } while (p === qq);
        const s = r.sign(); p *= s; qq *= s;
        const b = p + qq, c = p * qq, q = coefT(1, `${v}^2`, true) + coefT(b, v) + coefT(c, '');
        const rc = isq(c), why = rc == null ? `${c}\\text{ is not a square}` : `2(${v})(${rc})=${2 * rc}${v}\\neq${Math.abs(b)}${v}`;
        return { q, a: [`\\text{not a PST: }${why}`, `\\text{product } ${c},\\ \\text{sum } ${b}:\\ \\ ${p},\\ ${qq}`, `${q}=${bin(v, p)}${bin(v, qq)}`] };
      }
    }
  });
}
