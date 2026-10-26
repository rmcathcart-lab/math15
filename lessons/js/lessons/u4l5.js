/* Math 15 · Unit 4 · Lesson 5 — Factoring the Difference of Squares: the explainers, the warm-up posters and the small
 * figures on this page. Several explainers are adapted from Math 10C 4.4 (cut and move, sum of squares, the detector,
 * GCF first), rewritten for Math 15's booklet: brackets in the order (a + b)(a − b), friendlier captions.
 * Tile colours follow Unit 3 (x² teal, 1 slate); a negative tile is white with a coloured outline and a minus sign. */
import { h, Explainer } from '../explain.js';
import { tex } from '../tex.js';
import { standup } from '../standup.js';

const at = (el, x, y) => { el.style.left = x + 'px'; el.style.top = y + 'px'; return el; };
const add = (stage, el, x, y) => { stage.appendChild(at(el, x, y)); return el; };
const box = (el, w, ht) => { el.style.width = w + 'px'; el.style.height = ht + 'px'; return el; };
const hide = (...els) => els.forEach((e) => { if (e) e.style.opacity = 0; });
const K = (s, d) => tex(s, d);
const T = (s) => tex(s); // inline math in captions
const fadeOut = (c, el, ms = 300, o = {}) => c.anim(el, [{ opacity: getComputedStyle(el).opacity }, { opacity: 0 }], ms, o);
const appear = (c, el, ms = 350, o = {}) => c.anim(el, [{ opacity: 0 }, { opacity: 1 }], ms, o); // opacity only: safe on rotated / translated pieces
const moveTo = (c, el, x, y, ms = 650, o = {}) => c.anim(el, [{ left: el.style.left, top: el.style.top }, { left: x + 'px', top: y + 'px' }], ms, o);
const pulse = (c, el, s = 1.08, o = {}) => c.anim(el, [{ scale: '1' }, { scale: String(s) }, { scale: '1' }], 520, o); // `scale` never undoes a transform
const stampIn = (c, el) => c.anim(el, [{ opacity: 0, transform: 'scale(1.9) rotate(-12deg)' }, { opacity: 1, transform: 'scale(1) rotate(-4deg)' }], 420, { easing: 'cubic-bezier(.2,1.4,.4,1)' });
const PLUS = '\\textcolor{#12805a}{+}', MINUS = '\\textcolor{#c93a33}{-}';

/* monomials: [coefficient, { letter: exponent }] (positive coefficients only on this page) */
const VS = (v) => Object.keys(v || {}).sort().filter((k) => v[k]).map((k) => (v[k] === 1 ? k : `${k}^{${v[k]}}`)).join('');
const MT = ([c, v]) => { const s = VS(v); return (c === 1 && s ? '' : String(c)) + s; };
const dbl = (v) => { const o = {}; for (const k in v) o[k] = 2 * v[k]; return o; };
const msq = ([c, v]) => [c * c, dbl(v)];
const mmul = ([a, u], [b, w]) => { const o = { ...u }; for (const k in w) o[k] = (o[k] || 0) + w[k]; return [a * b, o]; };
const isq = (n) => { const r = Math.round(Math.sqrt(n)); return r * r === n ? r : null; };

/* dimension marks: a bar with end ticks and a KaTeX label */
function dimH(stage, x, y, w, label, below) {
  const bar = add(stage, box(h('div', 'u4l5-dbar h'), w, 12), x, y - 6);
  const lab = add(stage, h('div', 'u4l5-dim c', K(label)), x + w / 2, below ? y + 22 : y - 22);
  return [bar, lab];
}
function dimV(stage, x, y, ht, label, right) {
  const bar = add(stage, box(h('div', 'u4l5-dbar v'), 12, ht), x - 6, y);
  const lab = add(stage, h('div', 'u4l5-dim', K(label)), right ? x + 14 : x - 14, y + ht / 2);
  lab.style.translate = right ? '0 -50%' : '-100% -50%';
  return [bar, lab];
}
/* a row of math whose pieces can be animated one at a time ("{}+3x" gets binary spacing) */
function eqRow(pieces, cls = '') {
  const row = h('div', 'u4l5-eq ' + cls);
  row.parts = pieces.map((p, i) => { const s = h('span', 'u4l5-tk', K(p === '=' ? '{}={}' : i && /^[+\-=]/.test(p) ? '{}' + p : p)); row.appendChild(s); return s; });
  return row;
}
const strike = (c, els) => Promise.all(els.map((e) => { e.classList.add('u4l5-x'); return c.anim(e, [{ opacity: 1 }, { opacity: 0.35 }], 400); }));
const tileEl = (stage, kind, sgn, w, ht, x, y) => add(stage, box(h('div', `u4l5-tile ${kind} ${sgn > 0 ? 'pos' : 'neg'}`), w, ht), x, y);

/* ============ 1 & 2. Factor it: square root each term, one +, one − (two mounts with different chips) ============ */
const FD = {
  n64: [[1, { x: 1 }], [8, {}]], n9: [[1, { x: 1 }], [3, {}]], n49: [[1, { x: 1 }], [7, {}]],
  e1a: [[1, { q: 1 }], [1, {}]], e1b: [[1, { m: 1 }], [4, {}]], e1c: [[1, { c: 1 }], [10, {}]], e1d: [[1, { x: 1 }], [1, { y: 1 }]],
  c36: [[6, { y: 1 }], [5, {}]], c6: [[1, { x: 3 }], [7, {}]],
  e2a: [[2, { x: 1 }], [3, {}]], e2b: [[3, { a: 1 }], [1, {}]], e2c: [[1, { x: 2 }], [4, {}], [[1, { x: 1 }], [2, {}]]], e2d: [[5, { p: 1 }], [2, { q: 1 }]]
};
const fdExpr = (key) => { const [A, B] = FD[key]; return `${MT(msq(A))}-${MT(msq(B))}`; };
/* how a root was found, in words: "√4 = 2 and √x² = x", "halve the exponent", "64 = 8²" */
function rootHow(R) {
  const [c, v] = R, ks = Object.keys(v), out = [];
  if (!ks.length) return `${K(`${c * c}=${c}^2`)}: on the squares list`;
  if (c === 1 && ks.every((k) => v[k] === 1)) return '';
  if (c !== 1) out.push(K(`\\sqrt{${c * c}}=${c}`));
  ks.forEach((k) => out.push(K(`\\sqrt{${VS({ [k]: 2 * v[k] })}}=${VS({ [k]: v[k] })}`) + (v[k] > 1 ? ' (halve the exponent)' : '')));
  return out.join(' and ');
}
function fdsDef(concept, checkLabel, checks) {
  return {
    title: 'Factor it: square root each term, one +, one −',
    height: 470,
    minW: 860, // drawn this wide and scaled to fit beside the sidebar
    choices: [...concept.map((k) => ({ v: k, label: tex(fdExpr(k)) })), { sep: checkLabel }, ...checks.map(([k, l]) => ({ v: k, label: `(${l})` }))],
    intro: (key) => `Factor ${T(fdExpr(key))}. Take the <b>square root of each term</b>, then write one bracket with <b>+</b> and one with <b>−</b>.`,
    make(stage, key, ex) {
      const W = ex.W, [A, B, A2] = FD[key], a = MT(A), b = MT(B), aa = MT(msq(A)), bb = MT(msq(B)), e = `${aa}-${bb}`, ab = MT(mmul(A, B));
      const x1 = W / 2 - 170, x2 = W / 2 + 170;
      const t1 = add(stage, h('div', 'u4l5-ft c', K(aa)), x1, 52), sg = add(stage, h('div', 'u4l5-ft u4l5-fsg c', '−'), W / 2, 52), t2 = add(stage, h('div', 'u4l5-ft c', K(bb)), x2, 52);
      const tag = add(stage, h('div', 'u4l5-tag c', 'a <b>difference</b>: a minus between two squares'), W / 2, 104); hide(tag);
      const ar1 = add(stage, h('div', 'u4l5-darr', '<i>√</i>'), x1 - 2, 96), ar2 = add(stage, h('div', 'u4l5-darr', '<i>√</i>'), x2 - 2, 96);
      const r1 = add(stage, h('div', 'u4l5-root c', K(`\\sqrt{${aa}}=${a}`)), x1, 172), r2 = add(stage, h('div', 'u4l5-root c', K(`\\sqrt{${bb}}=${b}`)), x2, 172);
      const n1 = add(stage, h('div', 'u4l5-how c', rootHow(A)), x1, 214), n2 = add(stage, h('div', 'u4l5-how c', rootHow(B)), x2, 214);
      hide(ar1, ar2, r1, r2, n1, n2);
      const F = add(stage, h('div', 'u4l5-eq big c u4l5-boxed', K(`${e}=(${a}${PLUS}${b})(${a}${MINUS}${b})`)), W / 2, 278); hide(F);
      // the check: a 2 × 2 multiplication box
      const gx = 34, gy = 330, hw = 76, cw = 128, ch = 44;
      const grid = add(stage, h('div', 'u4l5-grid'), gx, gy); hide(grid);
      grid.style.gridTemplateColumns = `${hw}px ${cw}px ${cw}px`;
      const cell = (html, cls) => { const d = h('div', 'u4l5-gc ' + cls, html); d.style.height = ch + 'px'; grid.appendChild(d); return d; };
      cell('', 'corner'); cell(K(a), 'hd'); cell(K(`+${b}`), 'hd');
      cell(K(a), 'hd'); const c11 = cell(K(aa), 'in'), c12 = cell(K(`+${ab}`), 'in mid');
      cell(K(`-${b}`), 'hd'); const c21 = cell(K(`-${ab}`), 'in mid'), c22 = cell(K(`-${bb}`), 'in');
      const ins = [c11, c12, c21, c22]; ins.forEach((d) => (d.style.opacity = 0));
      const cx0 = gx + hw + 2 * cw + 40;
      const C1 = add(stage, eqRow([`(${a}+${b})(${a}-${b})`, '=', aa, `+${ab}`, `-${ab}`, `-${bb}`]), cx0, gy + 8); hide(C1);
      const C2 = add(stage, h('div', 'u4l5-eq u4l5-ok', K(`=${e}`) + ' ✓'), cx0 + 10, gy + 64); hide(C2);
      const zp = add(stage, h('div', 'u4l5-zp', 'middle terms cancel'), cx0 + 10, gy + 106); hide(zp);
      C1.style.maxWidth = (W - cx0 - 10) + 'px';
      const steps = [{
        cap: `${T(e)}: two terms with a <b>minus</b> between them, and both are perfect squares. That’s a <b>difference of squares</b>.`,
        run: (c) => c.fadeIn(tag, 350)
      }, {
        cap: `Square root of the first term: ${T(`\\sqrt{${aa}}=${a}`)}.`,
        run: (c) => Promise.all([fadeOut(c, tag, 200), c.fadeIn(ar1, 300, { from: 'translateY(-10px)' }), c.pop(r1, 380, { delay: 200 }), c.fadeIn(n1, 300, { delay: 350 })])
      }, {
        cap: `Square root of the second term: ${T(`\\sqrt{${bb}}=${b}`)}.`,
        run: (c) => Promise.all([c.fadeIn(ar2, 300, { from: 'translateY(-10px)' }), c.pop(r2, 380, { delay: 200 }), c.fadeIn(n2, 300, { delay: 350 })])
      }, {
        cap: `Write two brackets with the roots: <b>one plus, one minus</b>. ${T(`${e}=(${a}+${b})(${a}-${b})`)}`,
        run: (c) => c.pop(F, 420)
      }, {
        cap: `Check by expanding: multiply every term by every term. The middle terms ${T(`+${ab}`)} and ${T(`-${ab}`)} <b>cancel</b>, leaving ${T(e)} ✓`,
        run: async (c) => {
          await c.fadeIn(grid, 300);
          for (let i = 0; i < 4; i++) await c.fadeIn(ins[i], 260);
          await c.fadeIn(C1, 350);
          c12.classList.add('lit'); c21.classList.add('lit');
          await strike(c, [C1.parts[3], C1.parts[4]]);
          await Promise.all([c.fadeIn(C2, 350), c.pop(zp, 350, { delay: 150 })]);
        }
      }];
      if (A2) { // x⁴ − 16: look again at the brackets
        const [P, Q] = A2, p = MT(P), q = MT(Q), pp = MT(msq(P)), qq = MT(msq(Q));
        const L1 = add(stage, h('div', 'u4l5-eq c', `Look again: ${K(`${pp}-${qq}=(${p}+${q})(${p}-${q})`)}`), W / 2, 352); hide(L1);
        const L2 = add(stage, h('div', 'u4l5-note c', `${K(`${pp}+${qq}`)} is a <b>sum</b>: it stops there.`), W / 2, 404); hide(L2);
        const L3 = add(stage, h('div', 'u4l5-eq big c u4l5-boxed', K(`${e}=(${pp}+${qq})(${p}+${q})(${p}-${q})`)), W / 2, 278); hide(L3);
        steps.push({
          cap: `<b>Look again!</b> ${T(`${pp}-${qq}`)} is a difference of squares too: ${T(`(${p}+${q})(${p}-${q})`)}. But ${T(`${pp}+${qq}`)} is a <b>sum</b>, so it stops.`,
          run: async (c) => {
            await Promise.all([grid, C1, C2, zp].map((el) => fadeOut(c, el, 300)));
            await c.fadeIn(L1, 400); await c.fadeIn(L2, 350);
          }
        }, {
          cap: `Factored <b>completely</b>: ${T(`${e}=(${pp}+${qq})(${p}+${q})(${p}-${q})`)}.`,
          run: async (c) => { await fadeOut(c, F, 250); await c.pop(L3, 420); }
        });
      }
      return steps;
    }
  };
}
const fds1 = fdsDef(['n64', 'n9', 'n49'], 'Example 1 check:', [['e1a', 'a'], ['e1b', 'b'], ['e1c', 'c'], ['e1d', 'd']]);
const fds2 = fdsDef(['c36', 'c6'], 'Example 2 check:', [['e2a', 'a'], ['e2b', 'b'], ['e2c', 'c'], ['e2d', 'd']]);

/* ============ 1. Why it works: cut and move (from Math 10C 4.4) ============ */
const CM = {
  ab: { A: 'a', B: 'b', AmB: 'a-b', ApB: 'a+b', AA: 'a^2', BB: 'b^2', b: 0.4 },
  n64: { A: '6', B: '4', AmB: '2', ApB: '10', AA: '6^2', BB: '4^2', g: [6, 4], nums: '36-16=20', prod2: '10\\times2=20' },
  n103: { A: '10', B: '3', AmB: '7', ApB: '13', AA: '10^2', BB: '3^2', g: [10, 3], nums: '100-9=91', prod2: '13\\times7=91' },
  b: { A: 'm', B: '4', AmB: 'm-4', ApB: 'm+4', AA: 'm^2', BB: '16', b: 0.38 },
  d: { A: 'x', B: 'y', AmB: 'x-y', ApB: 'x+y', AA: 'x^2', BB: 'y^2', b: 0.42 }
};
const cutMove = {
  title: 'Cut the L-shape and move a piece',
  height: 470,
  minW: 940, // drawn this wide and scaled to fit beside the sidebar
  choices: [{ v: 'ab', label: tex('a^2-b^2') }, { v: 'n64', label: tex('6^2-4^2') }, { v: 'n103', label: tex('10^2-3^2') }, { sep: 'Example 1 check:' }, { v: 'b', label: '(b)' }, { v: 'd', label: '(d)' }],
  intro: (key) => { const d = CM[key]; return `Show ${T(`${d.AA}-${d.BB}=(${d.A}+${d.B})(${d.A}-${d.B})`)} with a picture: same pieces, same area.`; },
  make(stage, key, ex) {
    const W = ex.W, d = CM[key], S = 270, X0 = 136, Y0 = 78;
    const u = d.g ? S / d.g[0] : 0, bs = d.g ? u * d.g[1] : Math.round(S * d.b), r = S - bs;
    const grid = (el) => { if (u) { el.classList.add('u4l5-grid2'); el.style.backgroundSize = `${u}px ${u}px, ${u}px ${u}px, auto`; } return el; };
    const hole = add(stage, box(h('div', 'u4l5-hole'), bs, bs), X0, Y0); hide(hole);
    const corner = add(stage, grid(box(h('div', 'u4l5-pc whole'), bs, bs)), X0, Y0);
    const grey = add(stage, grid(box(h('div', 'u4l5-pc whole'), r, bs)), X0 + bs, Y0);
    const striped = add(stage, grid(box(h('div', 'u4l5-pc whole'), S, r)), X0, Y0 + bs);
    const outline = add(stage, box(h('div', 'u4l5-sqo'), S, S), X0, Y0);
    hide(corner, grey, striped, outline);
    const cut = add(stage, box(h('div', 'u4l5-cut'), r, 0), X0 + bs, Y0 + bs); hide(cut);
    const areaL = add(stage, h('div', 'u4l5-alab c', K(d.AA)), X0 + S / 2, Y0 + S / 2); hide(areaL);
    const dL = dimV(stage, X0 - 20, Y0, S, d.A), dB = dimH(stage, X0, Y0 + S + 16, S, d.A, true);
    const dTb = dimH(stage, X0, Y0 - 20, bs, d.B), dTa = dimH(stage, X0 + bs, Y0 - 20, r, d.AmB);
    const dRb = dimV(stage, X0 + S + 20, Y0, bs, d.B, true), dRa = dimV(stage, X0 + S + 20, Y0 + bs, r, d.AmB, true);
    const fT = dimH(stage, X0, Y0 + bs - 20, S + bs, d.ApB), fB = dimH(stage, X0 + S, Y0 + S + 16, bs, d.B, true), fL = dimV(stage, X0 - 20, Y0 + bs, r, d.AmB);
    [dL, dB, dTb, dTa, dRb, dRa, fT, fB, fL].forEach((p) => hide(...p));
    const show = (c, ps) => Promise.all(ps.flat().map((e) => c.fadeIn(e, 320)));
    const gone = (c, ps) => Promise.all(ps.flat().map((e) => fadeOut(c, e, 250)));
    const px = Math.max(X0 + S + bs, X0 + S + 90) + 44, pw = W - px - 16;
    const fac = `(${d.A}+${d.B})(${d.A}-${d.B})`;
    const P1 = add(stage, h('div', 'u4l5-note', `<b>Before:</b> a square with a corner cut out. Area ${K(`${d.AA}-${d.BB}`)}${d.nums ? ` ${K(`=${d.nums}`)}` : ''}.`), px, 120);
    const P2 = add(stage, h('div', 'u4l5-note', `<b>After:</b> one rectangle, ${K(d.ApB)} long and ${K(d.AmB)} tall. Area ${K(fac)}${d.prod2 ? ` ${K(`=${d.prod2}`)}` : ''}.`), px, 214);
    const P3 = add(stage, h('div', 'u4l5-eq u4l5-boxed u4l5-sm', K(`${d.AA}-${d.BB}=${fac}`)), px, 336);
    [P1, P2].forEach((p) => (p.style.width = pw + 'px')); hide(P1, P2, P3);
    const nb = d.g ? ` (that’s ${T(`${d.A}-${d.B}`)})` : '';
    return [{
      cap: `Start with a square, ${T(d.A)} by ${T(d.A)}. Its area is ${T(d.AA)}${d.g ? ` = ${d.g[0] ** 2} squares` : ''}.`,
      run: (c) => Promise.all([c.fadeIn(outline, 300), appear(c, corner, 350), appear(c, grey, 350), appear(c, striped, 350), c.fadeIn(areaL, 350), show(c, [dL, dB])])
    }, {
      cap: `Cut a ${T(d.B)}-by-${T(d.B)} square out of the corner. The L-shape left has area <b>${T(`${d.AA}-${d.BB}`)}</b>${d.nums ? `: ${T(d.nums)} squares` : ''}.`,
      run: async (c) => {
        await c.fadeIn(hole, 200);
        await c.anim(corner, [{ transform: 'none', opacity: 1 }, { transform: 'translate(-34px, -46px) rotate(-8deg)', opacity: 0 }], 650);
        areaL.innerHTML = K(`${d.AA}-${d.BB}`); at(areaL, X0 + S / 2, Y0 + bs + r / 2);
        await Promise.all([fadeOut(c, outline, 250), show(c, [dTb]), pulse(c, areaL, 1.15), c.fadeIn(P1, 400, { delay: 200 })]);
      }
    }, {
      cap: `Cut along the dashed line: a <b>striped</b> piece, ${T(d.A)} by ${T(d.AmB)}${nb}, and a <b>grey</b> piece, ${T(d.AmB)} by ${T(d.B)}.`,
      run: async (c) => {
        await c.anim(cut, [{ width: '0px', opacity: 1 }, { width: r + 'px', opacity: 1 }], 500);
        grey.classList.replace('whole', 'grey'); striped.classList.replace('whole', 'striped');
        await Promise.all([fadeOut(c, areaL, 250), show(c, [dTa, dRb, dRa]), pulse(c, grey, 1.05), pulse(c, striped, 1.03, { delay: 150 })]);
      }
    }, {
      cap: 'Turn the grey piece a quarter turn and slide it onto the end of the striped piece.',
      run: async (c) => {
        await Promise.all([gone(c, [dL, dTb, dTa, dRb, dRa]), fadeOut(c, cut, 200), fadeOut(c, hole, 300)]);
        const fx = X0 + bs + r / 2, fy = Y0 + bs / 2, tx = X0 + S + bs / 2, ty = Y0 + bs + r / 2;
        await c.anim(grey, [{ transform: 'none' }, { transform: `translate(${(tx - fx) * 0.5}px, ${(ty - fy) * 0.15 - 30}px) rotate(45deg)`, offset: 0.5 }, { transform: `translate(${tx - fx}px, ${ty - fy}px) rotate(90deg)` }], 1100);
      }
    }, {
      cap: `Now it’s <b>one rectangle</b>: ${T(d.ApB)} long and ${T(d.AmB)} tall. Its area is ${T(fac)}${d.prod2 ? ` = ${T(d.prod2)}` : ''}.`,
      run: async (c) => {
        areaL.innerHTML = K(fac); at(areaL, X0 + (S + bs) / 2, Y0 + bs + r / 2);
        await Promise.all([show(c, [fT, fB, fL]), c.fadeIn(areaL, 350), c.fadeIn(P2, 400, { delay: 200 })]);
      }
    }, {
      cap: `Same pieces, same area: ${T(`${d.AA}-${d.BB}=${fac}`)}.${d.g ? ` With numbers: ${T(`${d.nums.split('=')[0]}=${d.prod2}`)} ✓` : ' The sum times the difference.'}`,
      run: (c) => Promise.all([c.pop(P3, 450), pulse(c, striped, 1.03), pulse(c, grey, 1.05)])
    }];
  }
};

/* ============ 2. Square root of a monomial ============ */
const RF = { a: [4, { x: 2 }], b: [16, { x: 4 }], c: [25, { y: 6 }], d: [36, { a: 2, b: 2 }], n20: [20, {}], n8: [8, { x: 2 }], x5: [1, { x: 5 }] };
const rootFinder = {
  title: 'Is it a perfect square? Find its square root',
  height: 460,
  minW: 760, // the squares strip needs this width
  choices: [{ v: 'a', label: tex('4x^2') }, { v: 'b', label: tex('16x^4') }, { v: 'c', label: tex('25y^6') }, { v: 'd', label: tex('36a^2b^2') }, { sep: 'Squares or not?' }, { v: 'n20', label: tex('20') }, { v: 'n8', label: tex('8x^2') }, { v: 'x5', label: tex('x^5') }],
  intro: (key) => `Is ${T(MT(RF[key]))} a perfect square? Check the <b>number</b>, then the <b>exponents</b>.`,
  make(stage, key, ex) {
    const W = ex.W, [c0, v] = RF[key], m = MT([c0, v]), ks = Object.keys(v).sort();
    const rc = isq(c0), showC = c0 !== 1 || !ks.length;
    const varOk = ks.every((k) => v[k] % 2 === 0), ok = rc != null && varOk;
    const root = ok ? MT([rc, Object.fromEntries(ks.map((k) => [k, v[k] / 2]))]) : null;
    const M = add(stage, h('div', 'u4l5-mono c', K(m)), W / 2, 50);
    // pieces: the number (if shown) and each letter power
    const pcs = [...(showC ? [{ kind: 'n', tex: String(c0) }] : []), ...ks.map((k) => ({ kind: 'v', k, e: v[k], tex: VS({ [k]: v[k] }) }))];
    const gap = Math.min(190, (W - 120) / Math.max(1, pcs.length)), x0 = W / 2 - gap * (pcs.length - 1) / 2;
    pcs.forEach((p, i) => {
      const x = x0 + i * gap;
      p.card = add(stage, h('div', 'u4l5-piece c ' + (p.kind === 'n' ? 'num' : 'let'), K(p.tex)), x, 144); hide(p.card);
      const good = p.kind === 'n' ? rc != null : p.e % 2 === 0;
      p.arr = add(stage, h('div', 'u4l5-darr', `<i>${p.kind === 'n' ? '√' : '÷2'}</i>`), x - 2, 172); hide(p.arr);
      p.res = add(stage, h('div', 'u4l5-pres c ' + (good ? 'ok' : 'no'), good ? K(p.kind === 'n' ? String(rc) : VS({ [p.k]: p.e / 2 })) : '✗'), x, 246); hide(p.res);
      let why;
      if (p.kind === 'n') {
        if (good) why = K(`${c0}=${rc}^2`);
        else { const lo = Math.floor(Math.sqrt(c0)); why = `between ${K(String(lo * lo))} and ${K(String((lo + 1) ** 2))}`; }
      } else why = good ? `${K(`${p.e}\\div2=${p.e / 2}`)}` : `${K(String(p.e))} is <b>odd</b>`;
      p.why = add(stage, h('div', 'u4l5-how c', why), x, 290); hide(p.why);
      p.good = good;
    });
    const fin = add(stage, h('div', 'u4l5-eq c ' + (ok ? 'u4l5-boxed' : 'u4l5-bad'), ok ? K(`\\sqrt{${m}}=${root}`) : `${K(m)} is <b>not</b> a perfect square`), W / 2, 344); hide(fin);
    const chk = add(stage, h('div', 'u4l5-note c', ok ? `Check by squaring: ${K(`(${root})^2=${m}`)} ✓` : 'It can’t be a term in a difference of squares.'), W / 2, 390); hide(chk);
    // the squares strip along the bottom
    const sw = Math.min(46, (W - 40) / 15), strip = add(stage, h('div', 'u4l5-strip'), (W - sw * 15) / 2, 418);
    const cells = []; for (let k = 1; k <= 15; k++) { const s = h('div', 'u4l5-sc', String(k * k)); s.style.width = (sw - 4) + 'px'; strip.appendChild(s); cells.push(s); }
    const steps = [{
      cap: `Split ${T(m)} into its <b>number</b> and its <b>letters</b>.${showC ? '' : ' (No number in front: it’s a 1.)'}`,
      run: (c) => Promise.all(pcs.map((p, i) => c.fadeIn(p.card, 350, { delay: i * 150 })))
    }];
    const pn = pcs.find((p) => p.kind === 'n'), pv = pcs.filter((p) => p.kind === 'v');
    if (pn) {
      const lo = Math.floor(Math.sqrt(c0));
      steps.push({
        cap: pn.good ? `The number: ${T(String(c0))} is on the squares list. ${T(`${c0}=${rc}^2`)}, so ${T(`\\sqrt{${c0}}=${rc}`)}.`
          : `The number: ${T(String(c0))} is <b>not</b> on the list. It falls between ${T(String(lo * lo))} and ${T(String((lo + 1) ** 2))}.`,
        run: async (c) => {
          if (pn.good) cells[rc - 1].classList.add('hit'); else { cells[lo - 1].classList.add('near'); cells[lo].classList.add('near'); }
          await c.fadeIn(pn.arr, 300, { from: 'translateY(-10px)' });
          await Promise.all([c.pop(pn.res, 380), c.fadeIn(pn.why, 300, { delay: 150 })]);
        }
      });
    }
    if (pv.length) {
      const bad = pv.filter((p) => !p.good);
      steps.push({
        cap: bad.length ? `The letters: ${T(bad[0].tex)} has exponent ${T(String(bad[0].e))}. That’s <b>odd</b>, so it can’t be split into two equal halves.`
          : `The letters: <b>halve each exponent</b>. ${pv.map((p) => T(`${p.tex}=(${VS({ [p.k]: p.e / 2 })})^2`)).join(' and ')}.`,
        run: (c) => Promise.all(pv.map((p, i) => (async () => { await c.fadeIn(p.arr, 300, { from: 'translateY(-10px)', delay: i * 200 }); await Promise.all([c.pop(p.res, 380), c.fadeIn(p.why, 300, { delay: 150 })]); })()))
      });
    }
    steps.push({
      cap: ok ? `Put the roots together: ${T(`\\sqrt{${m}}=${root}`)}. Check by squaring: ${T(`(${root})^2=${m}`)} ✓`
        : `So ${T(m)} is <b>not</b> a perfect square. Both the number and every exponent have to pass.`,
      run: async (c) => { await c.pop(fin, 420); await c.fadeIn(chk, 350); }
    });
    return steps;
  }
};

/* ============ 3. GCF first, with algebra tiles: share into equal groups ============ */
const TG = { n2: { k: 2, n: 3, v: 'x' }, n3: { k: 3, n: 2, v: 'x' }, n4: { k: 2, n: 4, v: 'x' }, e3b: { k: 3, n: 4, v: 'm' } };
const tgExpr = (d) => `${d.k}${d.v}^2-${d.k * d.n * d.n}`;
const tileGroups = {
  title: 'GCF first: share the tiles into equal groups',
  height: 450,
  minW: 860, // drawn this wide and scaled to fit beside the sidebar
  choices: [{ v: 'n2', label: tex(tgExpr(TG.n2)) }, { v: 'n3', label: tex(tgExpr(TG.n3)) }, { v: 'n4', label: tex(tgExpr(TG.n4)) }, { sep: 'Example 3 check:' }, { v: 'e3b', label: '(b)' }],
  intro: (key) => `${T(tgExpr(TG[key]))} doesn’t look like a difference of squares. Model it with algebra tiles and look for <b>equal groups</b>.`,
  make(stage, key, ex) {
    const W = ex.W, { k, n, v } = TG[key], nn = n * n, N = k * nn, e = tgExpr(TG[key]);
    const X = 84, U = 22, G = 3, gx = 24;
    const rowH = Math.max(X, n * (U + G) - G), rowGap = Math.max(8, Math.min(24, (360 - k * rowH) / Math.max(1, k - 1)));
    const rowY = (i) => 66 + i * (rowH + rowGap);
    // the pile: k x²-tiles in a column, N unit tiles in rows of 12
    const sq = [], un = [];
    for (let i = 0; i < k; i++) sq.push(tileEl(stage, 'u4l5-k2', 1, X, X, gx + i * (X + 8), 70));
    const per = 14, ux0 = gx, uy0 = 70 + X + 26;
    for (let i = 0; i < N; i++) un.push(tileEl(stage, 'u4l5-k0', -1, U, U, ux0 + (i % per) * (U + G), uy0 + Math.floor(i / per) * (U + G)));
    hide(...sq, ...un);
    const lab = add(stage, h('div', 'u4l5-plab', `${K(`${k}${v}^2`)}: ${k} tiles &nbsp; ${K(`-${N}`)}: ${N} negative units`), gx, 24); hide(lab);
    // the groups
    const rows = []; for (let i = 0; i < k; i++) {
      const y = rowY(i), r = add(stage, box(h('div', 'u4l5-grp'), X + 22 + n * (U + G) + 14, rowH + 12), gx - 8, y - 6); hide(r);
      const gl = add(stage, h('div', 'u4l5-glab', K(`${v}^2-${nn}`)), gx + X + 22 + n * (U + G) + 22, y + rowH / 2); gl.style.translate = '0 -50%'; hide(gl);
      rows.push({ r, gl, y });
    }
    const dim = add(stage, h('div', 'u4l5-gdim c', K(String(n))), gx + X + 22 + (n * (U + G) - G) / 2, rowY(0) + (rowH - (n * (U + G) - G)) / 2 - 16); hide(dim);
    // the algebra on the right
    const px = Math.max(gx + X + 22 + n * (U + G) + 22 + 176, 420);
    const L = [e, `=${k}(${v}^2-${nn})`, `=${k}(${v}^2-${n}^2)`, `=${k}(${v}+${n})(${v}-${n})`]
      .map((s, i) => { const el = add(stage, h('div', 'u4l5-eq' + (i === 3 ? ' u4l5-boxed' : ''), K(s)), px + (i ? 16 : 0), 40 + i * 64); hide(el); return el; });
    const no = add(stage, h('div', 'u4l5-note', `${K(String(k))} and ${K(String(N))} are <b>not</b> perfect squares`), px, 102); hide(no);
    const chk = add(stage, h('div', 'u4l5-note', `Check: ${K(`${k}(${v}^2-${nn})=${e}`)} ✓`), px, 312); hide(chk);
    const gPos = (gi, j) => [gx + X + 22 + (j % n) * (U + G), rowY(gi) + (rowH - (n * (U + G) - G)) / 2 + Math.floor(j / n) * (U + G)];
    return [{
      cap: `${T(e)} as tiles: ${k} ${T(`${v}^2`)}-tiles and ${N} negative unit tiles. ${k} and ${N} are <b>not</b> perfect squares, so it doesn’t look like a difference of squares.`,
      run: (c) => Promise.all([c.fadeIn(lab, 300), ...sq.map((t, i) => c.pop(t, 320, { delay: i * 100 })), ...un.map((t, i) => c.pop(t, 220, { delay: 150 + i * 12 })), c.fadeIn(L[0], 350), c.fadeIn(no, 350, { delay: 300 })])
    }, {
      cap: `Share the tiles into <b>${k} equal groups</b>: one ${T(`${v}^2`)}-tile and ${nn} unit ${nn > 1 ? 'tiles' : 'tile'} each. That’s the GCF ${k}: ${T(`${e}=${k}(${v}^2-${nn})`)}.`,
      run: async (c) => {
        await Promise.all([fadeOut(c, lab, 250), fadeOut(c, no, 250),
          ...sq.map((t, i) => moveTo(c, t, gx, rowY(i) + (rowH - X) / 2, 650, { delay: i * 60 })),
          ...un.map((t, i) => { const [x, y] = gPos(Math.floor(i / nn), i % nn); return moveTo(c, t, x, y, 650, { delay: 100 + i * 10 }); })]);
        await Promise.all([...rows.map((r, i) => c.fadeIn(r.r, 300, { delay: i * 80 })), ...rows.map((r, i) => c.fadeIn(r.gl, 300, { delay: 150 + i * 80 })), c.fadeIn(L[1], 400, { delay: 200 })]);
      }
    }, {
      cap: `Look at one group. The ${nn} unit ${nn > 1 ? 'tiles make' : 'tile makes'} a ${n}-by-${n} square: ${T(`${nn}=${n}^2`)}. So ${T(`${v}^2-${nn}`)} <b>is</b> a difference of squares!`,
      run: async (c) => {
        rows[0].r.classList.add('lit');
        await Promise.all([c.fadeIn(dim, 300), pulse(c, rows[0].gl, 1.15), c.fadeIn(L[2], 400, { delay: 150 })]);
      }
    }, {
      cap: `Factor the bracket: ${T(`${v}^2-${nn}=(${v}+${n})(${v}-${n})`)}. So ${T(`${e}=${k}(${v}+${n})(${v}-${n})`)}.`,
      run: async (c) => {
        rows.forEach((r) => { r.gl.innerHTML = K(`(${v}+${n})(${v}-${n})`); });
        await Promise.all([...rows.map((r) => pulse(c, r.gl, 1.08)), c.pop(L[3], 420)]);
      }
    }, {
      cap: `Check by expanding: ${T(`${k}(${v}+${n})(${v}-${n})=${k}(${v}^2-${nn})=${e}`)} ✓ The GCF made the squares appear.`,
      run: (c) => c.fadeIn(chk, 350)
    }];
  }
};

/* ============ 3. GCF first, then the pattern, then check every bracket (from Math 10C 4.4) ============ */
// each step: [caption, line (TeX) or null, note, checklist item to tick (0 GCF, 1 pattern, 2 brackets, 3 check) or -1]
const GF = {
  n7: [['Is it a difference of squares as written? 7 and 28 are <b>not</b> perfect squares, so not yet.', '7x^2-28', '7, 28: not squares', -1],
    ['GCF: 7 divides both 7 and 28. Pull <b>7</b> out front: divide each term by 7.', '=7(x^2-4)', 'GCF = 7', 0],
    [`Now the bracket ${T('x^2-4=x^2-2^2')} <b>is</b> a difference of squares.`, '=7(x^2-2^2)', 'roots x and 2', 1],
    ['Factor the bracket: one +, one −. Neither new bracket factors again.', '=7(x+2)(x-2)', 'nothing left to factor', 2],
    [`Check by expanding: ${T('7(x+2)(x-2)=7(x^2-4)=7x^2-28')} ✓`, null, '', 3]],
  nx: [['Is it a difference of squares as written? The exponent 3 is <b>odd</b>, so no.', 'x^3-25x', 'x³: odd exponent', -1],
    [`GCF: both terms have an ${T('x')}. Pull ${T('x')} out front.`, '=x(x^2-25)', 'GCF = x', 0],
    [`The bracket is a difference of squares: ${T('x^2-5^2')}.`, '=x(x^2-5^2)', 'roots x and 5', 1],
    ['Factor the bracket. Neither new bracket factors again.', '=x(x+5)(x-5)', 'nothing left to factor', 2],
    [`Check by expanding: ${T('x(x+5)(x-5)=x(x^2-25)=x^3-25x')} ✓`, null, '', 3]],
  e3a: [['As written? 2 and 18 are <b>not</b> perfect squares, so not yet.', '2x^2-18', '2, 18: not squares', -1],
    ['GCF = 2. Divide each term by 2.', '=2(x^2-9)', 'GCF = 2', 0],
    [`The bracket is ${T('x^2-3^2')}: a difference of squares.`, '=2(x^2-3^2)', 'roots x and 3', 1],
    ['Factor the bracket. The new brackets don’t factor again.', '=2(x+3)(x-3)', 'nothing left to factor', 2],
    [`Check: ${T('2(x+3)(x-3)=2(x^2-9)=2x^2-18')} ✓`, null, '', 3]],
  e3b: [['As written? 3 and 48 are <b>not</b> perfect squares, so not yet.', '3m^2-48', '3, 48: not squares', -1],
    ['GCF = 3. Divide each term by 3.', '=3(m^2-16)', 'GCF = 3', 0],
    [`The bracket is ${T('m^2-4^2')}: a difference of squares.`, '=3(m^2-4^2)', 'roots m and 4', 1],
    ['Factor the bracket. The new brackets don’t factor again.', '=3(m+4)(m-4)', 'nothing left to factor', 2],
    [`Check: ${T('3(m+4)(m-4)=3(m^2-16)=3m^2-48')} ✓`, null, '', 3]],
  e4a: [['As written? 5 is not a perfect square and the exponent 3 is odd, so not yet.', '5x^3-45x', 'not squares', -1],
    [`GCF = ${T('5x')}: the letter comes out too. Divide each term by ${T('5x')}.`, '=5x(x^2-9)', 'GCF = 5x', 0],
    [`The bracket is ${T('x^2-3^2')}: a difference of squares.`, '=5x(x^2-3^2)', 'roots x and 3', 1],
    ['Factor the bracket.', '=5x(x+3)(x-3)', 'nothing left to factor', 2],
    [`Check: ${T('5x(x+3)(x-3)=5x(x^2-9)=5x^3-45x')} ✓`, null, '', 3]],
  e4b: [['As written? 8 and 32 are <b>not</b> perfect squares, so not yet.', '8a^2b^2-32', '8, 32: not squares', -1],
    ['GCF = 8 (no letter is in both terms). Divide each term by 8.', '=8(a^2b^2-4)', 'GCF = 8', 0],
    [`The bracket is a difference of squares: ${T('\\sqrt{a^2b^2}=ab')} and ${T('\\sqrt4=2')}.`, '=8\\big[(ab)^2-2^2\\big]', 'roots ab and 2', 1],
    ['Factor the bracket.', '=8(ab+2)(ab-2)', 'nothing left to factor', 2],
    [`Check: ${T('8(ab+2)(ab-2)=8(a^2b^2-4)=8a^2b^2-32')} ✓`, null, '', 3]]
};
const GF_ITEMS = ['GCF out front', 'Difference of squares?', 'Every bracket checked', 'Check by expanding'];
const gcfFirst = {
  title: 'GCF first, then the pattern, then check every bracket',
  height: 400,
  minW: 900, // drawn this wide and scaled to fit beside the sidebar
  choices: [{ v: 'n7', label: tex('7x^2-28') }, { v: 'nx', label: tex('x^3-25x') }, { sep: 'Example 3 check:' }, { v: 'e3a', label: '(a)' }, { v: 'e3b', label: '(b)' }, { sep: 'Example 4 check:' }, { v: 'e4a', label: '(a)' }, { v: 'e4b', label: '(b)' }],
  intro: (key) => `Factor ${T(GF[key][0][1])} completely.`,
  make(stage, key, ex) {
    const W = ex.W, S = GF[key], pw = 264, px = W - pw - 16;
    const list = add(stage, h('div', 'u4l5-cl'), px, 24); list.style.width = pw + 'px';
    list.innerHTML = '<div class="u4l5-cl-h">Checklist</div>';
    const items = GF_ITEMS.map((t) => { const e = h('div', 'u4l5-cl-i', `<i></i>${t}`); list.appendChild(e); return e; });
    let y = 26;
    const rows = S.map(([, line, note]) => {
      if (!line) return null;
      const e = add(stage, h('div', 'u4l5-gl', `<span class="u4l5-gl-m">${K(line)}</span><span class="u4l5-gl-n">${note}</span>`), 30, y); hide(e); y += 64; return e;
    });
    const chk = add(stage, h('div', 'u4l5-gchk'), 30, y + 8); chk.style.width = (px - 50) + 'px'; hide(chk);
    const tick = async (c, i) => { if (i < 0) return; items[i].classList.add('on'); await c.pop(items[i].querySelector('i'), 320); };
    return S.map(([cap, line, , ti], i) => ({
      cap,
      run: async (c) => {
        if (i > 0 && rows[i - 1]) rows[i - 1].classList.add('past');
        if (rows[i]) await c.fadeIn(rows[i], 380, { from: 'translateX(-12px)' });
        else { chk.innerHTML = cap.replace(/^Check( by expanding)?:\s*/, 'Check: '); await c.fadeIn(chk, 380); }
        await tick(c, ti);
        if (i === S.length - 1) rows.forEach((r) => r && r.classList.remove('past'));
      }
    }));
  }
};

/* ============ 4. Why a sum of squares never factors (from Math 10C 4.4) ============ */
const SN = {
  n9: { e: 'x^2+9', A: 'x', B: '3', AA: 'x^2', BB: '9', mid: '6x', c: 9 },
  n25: { e: 'x^2+25', A: 'x', B: '5', AA: 'x^2', BB: '25', mid: '10x', c: 25 },
  f: { e: '4x^2+1', A: '2x', B: '1', AA: '4x^2', BB: '1', mid: '4x' }
};
const sumNever = {
  title: 'Can a sum of squares factor?',
  height: 450,
  minW: 940, // drawn this wide and scaled to fit beside the sidebar
  choices: [{ v: 'n9', label: tex('x^2+9') }, { v: 'n25', label: tex('x^2+25') }, { v: 'f', label: tex('4x^2+1') }],
  intro: (key) => `${T(SN[key].e)} is a <b>sum</b> of two squares. Try every pair of brackets that could fit.`,
  make(stage, key, ex) {
    const W = ex.W, d = SN[key], { A, B } = d;
    const top = add(stage, h('div', 'u4l5-eq big', K(`${d.e}=(${A})^2\\textcolor{#c93a33}{+}(${B})^2`)), 24, 18); hide(top);
    const tries = [
      [`(${A}+${B})(${A}+${B})`, `${d.AA}+${d.mid}+${d.BB}`, 'a middle term'],
      [`(${A}-${B})(${A}-${B})`, `${d.AA}-${d.mid}+${d.BB}`, 'a middle term'],
      [`(${A}+${B})(${A}-${B})`, `${d.AA}-${d.BB}`, 'minus, not plus']
    ].map(([f, x, why], i) => {
      const row = add(stage, h('div', 'u4l5-try', `<span class="u4l5-try-f">${K(`${f}=${x}`)}</span><span class="u4l5-try-v">✗ ${why}</span>`), 24, 96 + i * 66); hide(row); return row;
    });
    const px = Math.max(580, W - 380), pw = W - px - 18;
    const need = add(stage, h('div', 'u4l5-need', d.c ? `Lesson 3 way: no ${K('x')}-term, so we need two numbers with <b>product</b> ${K(`+${d.c}`)} and <b>sum</b> ${K('0')}.` : `With no middle term, the two inside numbers would need a <b>positive</b> product and a sum of <b>0</b>.`), px, 92); need.style.width = pw + 'px'; hide(need);
    const signs = add(stage, h('div', 'u4l5-signs', `<div><span class="u4l5-sg">${K('(+)(+)')}</span>sum is <b>positive</b></div><div><span class="u4l5-sg">${K('(-)(-)')}</span>sum is <b>negative</b></div>`), px, 186);
    signs.style.width = pw + 'px'; hide(signs);
    let pt = null;
    if (d.c) {
      const ps = []; for (let p = 1; p * p <= d.c; p++) if (d.c % p === 0) ps.push([p, d.c / p]);
      pt = add(stage, h('div', 'u4l5-ptab', [...ps, ...ps.map(([p, q]) => [-p, -q])].map(([p, q]) => `<span>${K(`${p},${q}`)}<i>sum ${K(String(p + q))}</i></span>`).join('')), px, 290);
      pt.style.width = pw + 'px'; hide(pt);
    }
    const stamp = add(stage, h('div', 'u4l5-stamp no', 'Does not factor'), 120, 330); hide(stamp);
    const sub = add(stage, h('div', 'u4l5-stamp-sub', 'over the integers'), 142, 392); hide(sub);
    return [{
      cap: `${T(d.e)} is a square <b>plus</b> a square. The pattern ${T('a^2-b^2')} needs a <b>minus</b>. Could some brackets still work?`,
      run: (c) => c.fadeIn(top, 400)
    }, {
      cap: `Try ${T(`(${A}+${B})(${A}+${B})`)}: it expands to ${T(`${d.AA}+${d.mid}+${d.BB}`)}. That has a <b>middle term</b>.`,
      run: (c) => c.fadeIn(tries[0], 400, { from: 'translateX(-12px)' })
    }, {
      cap: `Try ${T(`(${A}-${B})(${A}-${B})`)}: ${T(`${d.AA}-${d.mid}+${d.BB}`)}. A middle term again.`,
      run: (c) => c.fadeIn(tries[1], 400, { from: 'translateX(-12px)' })
    }, {
      cap: `Try ${T(`(${A}+${B})(${A}-${B})`)}: the middle terms cancel, but it gives ${T(`${d.AA}-${d.BB}`)}, with a <b>minus</b>. We need ${T(`+${d.BB}`)}.`,
      run: (c) => c.fadeIn(tries[2], 400, { from: 'translateX(-12px)' })
    }, {
      cap: `Why nothing works: a <b>positive product</b> means both numbers have the <b>same sign</b>, so their sum is never 0.${d.c ? ` Every pair for ${T(String(d.c))} misses.` : ''}`,
      run: (c) => Promise.all([c.fadeIn(need, 350), c.fadeIn(signs, 400, { delay: 200 }), pt ? c.fadeIn(pt, 400, { delay: 450 }) : null])
    }, {
      cap: `So ${T(d.e)} <b>does not factor</b> over the integers. A sum of squares never does.`,
      run: async (c) => { await stampIn(c, stamp); await c.fadeIn(sub, 300); }
    }];
  }
};

/* ============ 4. The three checks: is it a difference of squares? (from Math 10C 4.4) ============ */
function parsePoly(s) { // '16x^2-1' → [{ s: 1, c: 16, v: [['x', 2]] }, { s: -1, c: 1, v: [] }]
  return s.match(/[+-]?[^+-]+/g).map((t) => {
    const m = t.match(/^([+-]?)(\d*)(.*)$/), v = [];
    (m[3].match(/[a-z](?:\^\d+)?/g) || []).forEach((p) => v.push([p[0], p.length > 1 ? parseInt(p.slice(2), 10) : 1]));
    return { s: m[1] === '-' ? -1 : 1, c: m[2] === '' ? 1 : parseInt(m[2], 10), v };
  });
}
const varT = (v) => v.map(([x, e]) => (e === 1 ? x : `${x}^{${e}}`)).join('');
const bodyT = (t) => (t.c === 1 && t.v.length ? '' : String(t.c)) + varT(t.v);
function scanTerm(t) { // the checks the detector shows for one term, and its square root (or null)
  const items = []; let ok = true;
  const showC = t.c !== 1 || !t.v.length, rc = isq(t.c);
  if (showC) {
    if (rc != null) items.push([true, `${K(String(t.c))} = ${K(`${rc}^2`)}`]);
    else { ok = false; const lo = Math.floor(Math.sqrt(t.c)); items.push([false, `${K(String(t.c))}: not a square<br><small class="u4l5-btw">between ${lo * lo} and ${(lo + 1) ** 2}</small>`]); }
  }
  t.v.forEach(([x, e]) => { if (e % 2 === 0) items.push([true, `${K(`${x}^{${e}}`)} = ${K(`(${varT([[x, e / 2]])})^2`)}: even exponent`]); else { ok = false; items.push([false, `${K(e === 1 ? x : `${x}^{${e}}`)}: <b>odd</b> exponent`]); } });
  const root = ok ? ((rc === 1 && t.v.length ? '' : String(rc)) + varT(t.v.map(([x, e]) => [x, e / 2]))) : null;
  return { items, ok, root };
}
const DT = { n20: 'x^2-20', x3: 'x^3-25', g5: '5x^2-20', a: 'x^2+9', b: 'x^2-9', c: '4y^2-15', d: '16x^2-1' };
const detector = {
  title: 'The three checks',
  height: 450,
  minW: 880, // drawn this wide and scaled to fit beside the sidebar
  choices: [{ v: 'n20', label: tex(DT.n20) }, { v: 'x3', label: tex(DT.x3) }, { v: 'g5', label: tex(DT.g5) }, { sep: 'Example 5 check:' }, ...['a', 'b', 'c', 'd'].map((k) => ({ v: k, label: `(${k})` }))],
  intro: (key) => `Is ${T(DT[key])} a difference of squares? Check <b>each term</b>, then the <b>sign</b> between them.`,
  make(stage, key, ex) {
    const W = ex.W, src = DT[key], [t1, t2] = parsePoly(src), s1 = scanTerm(t1), s2 = scanTerm(t2), minus = t2.s < 0;
    const cols = [W * 0.2, W * 0.5, W * 0.8];
    const e1 = add(stage, h('div', 'u4l5-dt-t c', K(bodyT(t1))), 0, 52), e2 = add(stage, h('div', 'u4l5-dt-t c', K(bodyT(t2))), 0, 52), es = add(stage, h('div', 'u4l5-dt-t c u4l5-dt-sg', minus ? '−' : '+'), 0, 52);
    const w1 = e1.offsetWidth, w2 = e2.offsetWidth, ws = 40, tot = w1 + ws + w2, x0 = W / 2 - tot / 2;
    at(e1, x0 + w1 / 2, 52); at(es, x0 + w1 + ws / 2, 52); at(e2, x0 + w1 + ws + w2 / 2, 52);
    const mkCol = (s, cx) => {
      let y = 112;
      const lines = s.items.map(([ok, html]) => { const e = add(stage, h('div', 'u4l5-dt-i ' + (ok ? 'ok' : 'no'), `<b>${ok ? '✓' : '✗'}</b> ${html}`), cx, y); e.style.translate = '-50% 0'; y += e.offsetHeight + 8; hide(e); return e; });
      const r = add(stage, h('div', 'u4l5-dt-r ' + (s.ok ? 'ok' : 'no'), s.ok ? `square root: ${K(s.root)}` : 'not a perfect square'), cx, y + 4); r.style.translate = '-50% 0'; hide(r);
      return { lines, r };
    };
    const c1 = mkCol(s1, cols[0]), c2 = mkCol(s2, cols[2]);
    const sg = add(stage, h('div', 'u4l5-dt-i ' + (minus ? 'ok' : 'no'), minus ? '<b>✓</b> minus: a <b>difference</b>' : '<b>✗</b> plus: a <b>sum</b>'), cols[1], 112); sg.style.translate = '-50% 0'; hide(sg);
    const good = s1.ok && s2.ok && minus;
    const fac = good ? `(${s1.root}+${s2.root})(${s1.root}-${s2.root})` : '';
    const stamp = add(stage, h('div', 'u4l5-stamp c ' + (good ? 'yes' : 'no'), good ? 'Difference of squares' : !minus && s1.ok && s2.ok ? 'Sum of squares' : 'Not a difference of squares'), W / 2, 312); hide(stamp);
    const res = add(stage, h('div', 'u4l5-eq c ' + (good ? 'u4l5-ok' : 'u4l5-bad'), good ? K(`${src}=${fac}`) : !minus && s1.ok && s2.ok ? 'never factors over the integers' : `${[t1, t2].filter((t, i) => !(i ? s2 : s1).ok).map((t) => K(bodyT(t))).join(' and ')} ${!s1.ok && !s2.ok ? 'are' : 'is'} not a perfect square`), W / 2, 376); hide(res);
    const steps = [{
      cap: `Pull the expression apart: the first term ${T(bodyT(t1))}, the sign, and the second term ${T(bodyT(t2))}.`,
      run: (c) => Promise.all([moveTo(c, e1, cols[0], 52, 600), moveTo(c, es, cols[1], 52, 600), moveTo(c, e2, cols[2], 52, 600)])
    }, {
      cap: `Check 1, the first term: a square number in front and <b>even</b> exponents? ${s1.ok ? `${T(bodyT(t1))} passes: it is ${T(`(${s1.root})^2`)}.` : `${T(bodyT(t1))} fails.`}`,
      run: async (c) => { for (const l of c1.lines) await c.fadeIn(l, 300); await c.pop(c1.r, 350); }
    }, {
      cap: `Check 2, the second term. ${s2.ok ? `${T(bodyT(t2))} passes: it is ${T(`(${s2.root})^2`)}.` : `${T(bodyT(t2))} fails.`}`,
      run: async (c) => { for (const l of c2.lines) await c.fadeIn(l, 300); await c.pop(c2.r, 350); }
    }, {
      cap: minus ? 'Check 3, the sign: a <b>minus</b> between them, so it is a <b>difference</b>.' : 'Check 3, the sign: a <b>plus</b>. That makes it a <b>sum</b>, not a difference.',
      run: (c) => c.pop(sg, 350)
    }, {
      cap: good ? `All three checks pass. Roots ${T(s1.root)} and ${T(s2.root)}: ${T(`${src}=${fac}`)}.`
        : !minus && s1.ok && s2.ok ? 'Both terms are squares, but it is a <b>sum</b> of squares: it does <b>not</b> factor over the integers.'
          : `A check fails, so ${T(src)} is <b>not</b> a difference of squares.`,
      run: async (c) => { await stampIn(c, stamp); await c.fadeIn(res, 350); }
    }];
    if (key === 'g5') steps.push({
      cap: `But look for a <b>GCF first</b>! ${T('5x^2-20=5(x^2-4)')}, and ${T('x^2-4')} passes every check: ${T('5x^2-20=5(x+2)(x-2)')}.`,
      run: async (c) => { res.innerHTML = K('5x^2-20=5(x^2-4)=5(x+2)(x-2)'); res.className = 'u4l5-eq c u4l5-ok'; stamp.textContent = 'GCF first, then it is!'; stamp.className = 'u4l5-stamp c yes'; await Promise.all([stampIn(c, stamp), c.fadeIn(res, 400)]); }
    });
    return steps;
  }
};

/* ============ warm-up: the wanted posters ============ */
const SUS = [
  { id: 'A', n: '15', al: '16-1', cr: [K('(4-1)(4+1)'), K('=3\\times5')], fake: true },
  { id: 'B', n: '35', al: '36-1', cr: [K('(6-1)(6+1)'), K('=5\\times7')], fake: true },
  { id: 'C', n: '91', al: '100-9', cr: [K('(10-3)(10+3)'), K('=7\\times13')], fake: true },
  { id: 'D', n: '899', al: '900-1', hidden: true, cr: [K('(30-1)(30+1)'), K('=29\\times31')], fake: true },
  { id: 'E', n: '101', al: '100+1', cr: ['a <b>sum</b>: no split', 'really prime!'], fake: false }
];
function mountPosters() {
  const host = document.getElementById('wu-posters'); if (!host) return;
  const ps = SUS.map((s) => {
    const b = h('button', 'u4l5-poster' + (s.fake ? '' : ' innocent'));
    b.type = 'button';
    b.innerHTML = `<span class="u4l5-pw">WANTED</span><span class="u4l5-ps">Suspect ${s.id}</span><span class="u4l5-pn">${s.n}</span>`
      + `<span class="u4l5-pa">alias</span><span class="u4l5-pal">${K(s.hidden ? '{?}-{?}' : s.al)}</span>`
      + `<span class="u4l5-pcr">${s.cr[0]}<br>${s.cr[1]}</span><span class="u4l5-pstamp">${s.fake ? 'FAKE!' : 'INNOCENT'}</span>`;
    const al = b.querySelector('.u4l5-pal');
    if (s.hidden) al.classList.add('hid');
    const set = (on) => { b.classList.toggle('cracked', on); if (s.hidden) { al.innerHTML = K(on ? s.al : '{?}-{?}'); al.classList.toggle('hid', !on); } };
    b.addEventListener('click', () => set(!b.classList.contains('cracked')));
    host.appendChild(b); return { b, set };
  });
  const all = document.getElementById('wu-crack-all'), rs = document.getElementById('wu-crack-reset');
  if (all) all.addEventListener('click', () => ps.forEach((p, i) => setTimeout(() => p.set(true), i * 160)));
  if (rs) rs.addEventListener('click', () => ps.forEach((p) => p.set(false)));
}

/* ============ small static pieces ============ */
function mountSquares() {
  const r = document.getElementById('sq-ref'); if (!r) return;
  for (let k = 1; k <= 15; k++) {
    const b = h('button', 'u4l5-sqc', `<b>${k * k}</b><small>${K(`${k}^2`)}</small>`); b.type = 'button';
    b.addEventListener('click', () => b.classList.toggle('shown')); r.appendChild(b);
  }
  const all = h('button', 'pill small', 'Show roots'); all.type = 'button';
  all.addEventListener('click', () => { const on = !r.querySelector('.u4l5-sqc:not(.shown)'); r.querySelectorAll('.u4l5-sqc').forEach((b) => b.classList.toggle('shown', !on)); });
  r.appendChild(all);
}

/* ============ wiring ============ */
function mountExplainers() {
  const defs = { fds1, fds2, cutMove, rootFinder, tileGroups, gcfFirst, sumNever, detector };
  document.querySelectorAll('[data-explainer]').forEach((el) => new Explainer(el, defs[el.dataset.explainer]));
}
mountExplainers(); mountPosters(); mountSquares();

/* ============ Stand Up Break! — difference of squares at the whiteboards ============ */
{
  const P2 = (A, Bm) => `${MT(msq(A))}-${MT(msq(Bm))}`;
  const dos = (A, Bm) => `(${MT(A)}+${MT(Bm)})(${MT(A)}-${MT(Bm)})`;
  const roots = (A, Bm) => `\\sqrt{${MT(msq(A))}}=${MT(A)},\\ \\ \\sqrt{${MT(msq(Bm))}}=${MT(Bm)}`;
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  const LET = ['x', 'a', 'm', 'p', 't', 'w', 'y', 'n', 'k'];
  standup('u4l5', {
    intro: 'Factor completely. Common factor first, then look for a difference of squares, and check by expanding.',
    levels: {
      BEG: (r) => { // x² − 49 = (x + 7)(x − 7); sometimes two letters
        const v = r.pick(LET);
        const A = [1, { [v]: 1 }], Bm = r.chance(0.15) ? [1, { [v === 'y' ? 'x' : 'y']: 1 }] : [r.int(1, 12), {}];
        const Q = P2(A, Bm);
        return { q: Q, a: [roots(A, Bm), `${Q}=${dos(A, Bm)}`] };
      },
      PRG: (r) => { // 9x² − 25, 16a² − 9b², x²y² − 49
        const kind = r.int(0, 2);
        let A, Bm;
        if (kind === 0) { let a, b; do { a = r.int(2, 9); b = r.int(1, 11); } while (gcd(a, b) !== 1); A = [a, { [r.pick(LET)]: 1 }]; Bm = [b, {}]; }
        else if (kind === 1) { const L = r.pick([['x', 'y'], ['p', 'q'], ['a', 'b'], ['m', 'n']]); let a, b; do { a = r.int(1, 9); b = r.int(1, 9); } while (a === b || gcd(a, b) !== 1); A = [a, { [L[0]]: 1 }]; Bm = [b, { [L[1]]: 1 }]; }
        else { const L = r.pick([['x', 'y'], ['a', 'b'], ['m', 'n']]); A = [r.int(1, 4), { [L[0]]: 1, [L[1]]: 1 }]; Bm = [r.int(1, 10), {}]; if (gcd(A[0], Bm[0]) !== 1) Bm = [1, {}]; }
        const Q = P2(A, Bm);
        return { q: Q, a: [roots(A, Bm), `${Q}=${dos(A, Bm)}`] };
      },
      MAS: (r) => {
        const kind = r.int(0, 2), v = r.pick(['x', 'a', 'm', 't', 'y']);
        if (kind === 2) { // x⁴ − 16 = (x² + 4)(x + 2)(x − 2)
          const b = r.int(1, 3), A2 = [1, { [v]: 2 }], B2 = [b * b, {}], A = [1, { [v]: 1 }], Bm = [b, {}];
          const Q = P2(A2, B2);
          return { q: Q, a: [`${Q}=${dos(A2, B2)}`, `\\text{look again: }${P2(A, Bm)}=${dos(A, Bm)}`, `${Q}=(${MT(msq(A))}+${MT(msq(Bm))})${dos(A, Bm)}`] };
        }
        // a common factor first: 3m² − 48 = 3(m + 4)(m − 4); 5x³ − 45x = 5x(x + 3)(x − 3)
        const k = r.int(2, 7), withV = kind === 1, b = r.int(1, withV ? 6 : 8);
        const A = [1, { [v]: 1 }], Bm = [b, {}], G = [k, withV ? { [v]: 1 } : {}];
        const t1 = mmul(G, msq(A)), t2 = mmul(G, msq(Bm)), Q = `${MT(t1)}-${MT(t2)}`, g = MT(G);
        return { q: Q, a: [`\\text{GCF } ${g}:\\quad ${Q}=${g}(${P2(A, Bm)})`, `${Q}=${g}${dos(A, Bm)}`] };
      }
    }
  });
}
