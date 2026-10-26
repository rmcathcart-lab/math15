/* Math 15 · Unit 4 · Lesson 9 — Solving Polynomial Equations by Factoring.
 * The zero product property, solving x² + bx + c = 0 (and x² − n², x² + bx) by factoring, rearranging so one side is 0,
 * checking roots in the ORIGINAL equation, and decomposition when a ≠ 1.
 * Colours: first factor blue, second factor amber, a constant out front grey; checks green / red. */
import { h, Explainer } from '../explain.js';
import { tex } from '../tex.js';
import { standup } from '../standup.js';
import { NumberLine, stamp, stampIn } from '../blocks.js';

const at = (el, x, y) => { el.style.left = x + 'px'; el.style.top = y + 'px'; return el; };
const add = (stage, el, x, y) => { stage.appendChild(at(el, x, y)); return el; };
const hide = (...els) => els.forEach((e) => { if (e) e.style.opacity = 0; });
const box = (el, w, hh) => { if (w != null) el.style.width = w + 'px'; if (hh != null) el.style.height = hh + 'px'; return el; };
/* KaTeX allowing \htmlClass, so parts of a line can be coloured or revealed */
const K = (src, display) => {
  try { return window.katex.renderToString(String(src), { displayMode: !!display, throwOnError: false, strict: 'ignore', trust: true, output: 'html' }); }
  catch (e) { return tex(src, display); }
};
const T = (s) => tex(s);
const spans = (root, cls) => [...root.querySelectorAll('.' + cls)];
const pulse = (c, el, s = 1.12) => c.anim(el, [{ transform: 'scale(1)' }, { transform: `scale(${s})` }, { transform: 'scale(1)' }], 460);
const mn = (n) => String(n).replace('-', '−');                       // a number in a caption, with a real minus
const par = (n) => (n < 0 ? `(${n})` : String(n));                  // a number written inside a product: (−3)
const lin = (n) => (n === 0 ? 'x' : `x${n < 0 ? '-' : '+'}${Math.abs(n)}`); // x + 5, x − 3
const solveLin = (n) => -n;                                          // x + n = 0 → x = −n
const cx = (el) => { el.style.translate = '-50% 0'; return el; };     // centre an element on its left coordinate

/* where an element sits on the stage, in stage px (the stage may be scaled down to fit) */
function stageRect(stage, el) {
  const s = stage.getBoundingClientRect(), r = el.getBoundingClientRect(), k = s.width / (stage.offsetWidth || s.width) || 1;
  return { x: (r.left - s.left) / k, y: (r.top - s.top) / k, w: r.width / k, h: r.height / k };
}

/* ======================================================================================
 * 1. Where can a product be zero? A times table from −4 to 4: every 0 is in the 0 row or the 0 column.
 * ====================================================================================== */
const zeroGrid = {
  title: 'Hunting for zeros in a times table',
  height: 452,
  intro: 'Each cell is <b>row × column</b>. Before we fill it in: <b>where</b> will the zeros be?',
  make(stage, v, ex) {
    const W = ex.W, N = 4, S = 42, n = 2 * N + 1;
    const grid = add(stage, h('div', 'u4l9-zg'), 22, 14);
    grid.style.gridTemplateColumns = `repeat(${n + 1}, ${S}px)`; grid.style.gridAutoRows = S + 'px';
    grid.appendChild(h('div', 'u4l9-zc hd corner', '×'));
    for (let b = -N; b <= N; b++) grid.appendChild(h('div', 'u4l9-zc hd' + (b === 0 ? ' z0' : ''), mn(b)));
    const cells = [], rows = [];
    for (let a = -N; a <= N; a++) {
      grid.appendChild(h('div', 'u4l9-zc hd' + (a === 0 ? ' z0' : ''), mn(a)));
      const row = [];
      for (let b = -N; b <= N; b++) {
        const p = a * b, e = h('div', 'u4l9-zc' + (p === 0 ? ' isz' : p < 0 ? ' neg' : ''), mn(p));
        e.style.opacity = 0; grid.appendChild(e); cells.push(e); row.push(e);
      }
      rows.push(row);
    }
    const gw = (n + 1) * S + 22;
    const px = gw + 40, pw = Math.max(300, W - px - 22);
    const p1 = add(stage, box(h('div', 'u4l9-zp', `<div class="u4l9-zph">What we see</div>Every <b>0</b> is in the <b>row for 0</b> or the <b>column for 0</b>.<div class="u4l9-zps">Two numbers that are <b>not</b> zero never multiply to 0.</div>`), pw), px, 24);
    const p2 = add(stage, box(h('div', 'u4l9-zp rule', `<div class="u4l9-zph">The zero product property</div>${K('\\text{If } A\\cdot B=0,')}<br>${K('\\text{then } A=0 \\text{ or } B=0.')}`), pw), px, 200);
    const p3 = add(stage, box(h('div', 'u4l9-zp eg', `${K('\\htmlClass{u4l9-ca}{(x-3)}\\htmlClass{u4l9-cb}{(x+5)}=0')}<div class="u4l9-zps">${K('\\htmlClass{u4l9-ca}{x-3}=0')} <b>or</b> ${K('\\htmlClass{u4l9-cb}{x+5}=0')}</div>`), pw), px, 334);
    hide(p1, p2, p3);
    const zeros = cells.filter((e) => e.classList.contains('isz')), others = cells.filter((e) => !e.classList.contains('isz'));
    return [{
      cap: 'Fill it in, one row at a time: <b>row × column</b>. Negative × negative is positive; negative × positive is negative.',
      run: (c) => Promise.all(rows.map((r, i) => Promise.all(r.map((e) => c.anim(e, [{ opacity: 0 }, { opacity: 1 }], 260, { delay: i * 140 })))))
    }, {
      cap: 'Now find every <b>0</b>. They all line up: the row where the first number is 0, and the column where the second number is 0.',
      run: async (c) => { grid.classList.add('lit'); await Promise.all(zeros.map((e, i) => pulse(c, e, 1.25))); await c.fadeIn(p1, 380); }
    }, {
      cap: 'Fade out everything else. <b>No</b> zero hides anywhere else: if neither number is 0, the product is <b>never</b> 0.',
      run: async (c) => { await Promise.all(others.map((e) => c.anim(e, [{ opacity: 1 }, { opacity: 0.18 }], 500))); }
    }, {
      cap: 'That is the <b>zero product property</b>: if a product is 0, then <b>at least one</b> of its factors is 0.',
      run: (c) => c.fadeIn(p2, 400)
    }, {
      cap: `It works for brackets too. If ${T('(x-3)(x+5)=0')}, then ${T('x-3')} is 0 <b>or</b> ${T('x+5')} is 0. One hard equation becomes <b>two easy ones</b>.`,
      run: (c) => c.fadeIn(p3, 400)
    }];
  }
};

/* ======================================================================================
 * 2. One equation becomes two: split a factored equation, solve each piece, show the roots, check one.
 * ====================================================================================== */
const ZP = {
  // k: constant out front (1 = none); f: the numbers in (x + f); a lone x is f = 0
  c1: { k: 1, f: [-3, 5] },
  c2: { k: 1, f: [0, -6] },
  a: { k: 1, f: [-4, 7] }, b: { k: 1, f: [2, -9] }, c: { k: 1, f: [6, 1] }, d: { k: 4, f: [-5, 3] }
};
const facT = (n) => (n === 0 ? 'x' : `(${lin(n)})`);
const zpEq = (d) => (d.k !== 1 ? d.k : '') + d.f.map(facT).join('') + '=0';
const zpSplit = {
  title: 'One equation becomes two',
  height: 478,
  minW: 900,
  choices: [{ v: 'c1', label: tex(zpEq(ZP.c1)) }, { v: 'c2', label: tex(zpEq(ZP.c2)) }, { sep: 'Example 1 check:' }, ...['a', 'b', 'c', 'd'].map((k) => ({ v: k, label: '(' + k + ')' }))],
  intro: (k) => `Solve ${T(zpEq(ZP[k]))}. A product equals 0, so <b>one of the factors</b> must be 0.`,
  make(stage, key, ex) {
    const W = ex.W, d = ZP[key], [p, q] = d.f, roots = [solveLin(p), solveLin(q)];
    const cls = ['u4l9-ca', 'u4l9-cb'];
    const eqT = (d.k !== 1 ? `\\htmlClass{u4l9-ck}{${d.k}}` : '') + d.f.map((n, i) => `\\htmlClass{${cls[i]}}{${facT(n)}}`).join('') + '=0';
    const eq = add(stage, cx(h('div', 'u4l9-big', K(eqT))), W / 2, 14);
    /* branches */
    const xs = d.k !== 1 ? [W * 0.17, W * 0.5, W * 0.83] : [W * 0.27, W * 0.73];
    const svg = add(stage, h('div', 'u4l9-lines'), 0, 0); box(svg, W, 140);
    svg.innerHTML = `<svg width="${W}" height="140">${xs.map((x, i) => `<path class="u4l9-br" data-i="${i}" d="M${W / 2} 72 L${x} 118" />`).join('')}</svg>`;
    const brs = [...svg.querySelectorAll('.u4l9-br')]; brs.forEach((b) => (b.style.opacity = 0));
    const bw = d.k !== 1 ? 240 : 270;
    const branch = (x, html, col) => { const e = add(stage, box(h('div', 'u4l9-bx ' + col, html), bw), x - bw / 2, 124); hide(e); return e; };
    const fb = d.f.map((n, i) => {
      const e = branch(xs[d.k !== 1 ? i + 1 : i], '', i ? 'b' : 'a');
      if (n === 0) e.innerHTML = `<div class="l1">${K('x=0')}</div><div class="nt">already solved</div><div class="l2">${K('\\boldsymbol{x=0}')}</div>`;
      else e.innerHTML = `<div class="l1">${K(lin(n) + '=0')}</div><div class="nt">${n > 0 ? 'subtract ' + n : 'add ' + (-n)} on both sides</div><div class="l2">${K(`\\boldsymbol{x=${solveLin(n)}}`)}</div>`;
      return e;
    });
    const fk = d.k !== 1 ? branch(xs[0], `<div class="l1">${K(d.k + '=0\\ ?')}</div><div class="nt">${d.k} is never 0</div><div class="l2 no">no solution here</div>`, 'k') : null;
    const orEl = add(stage, cx(h('div', 'u4l9-or', 'or')), (xs[xs.length - 2] + xs[xs.length - 1]) / 2, 168); hide(orEl);
    const l2s = fb.map((e) => e.querySelector('.l2')).concat(fk ? [fk.querySelector('.l2')] : []); hide(...l2s); fb.forEach((e) => hide(e.querySelector('.nt')));
    /* number line */
    const lo = Math.min(...roots, 0) - 2, hi = Math.max(...roots, 0) + 2;
    const NL = new NumberLine(stage, { x: 30, y: 282, width: W - 60, height: 92, min: lo, max: hi, step: 1, fontSize: 17 });
    const dots = roots.map((r, i) => { const g = NL.point(r, { color: i ? '#c27a0e' : '#2b55a0', label: `<b>${mn(r)}</b>`, r: 10 }); g.style.opacity = 0; if (g.label) g.label.style.opacity = 0; return g; });
    NL.el.style.opacity = 0;
    /* the check: the first root makes its own factor 0 */
    const r0 = roots[0], vals = d.f.map((n) => r0 + n);
    const subT = (d.k !== 1 ? d.k : '') + d.f.map((n, i) => (n === 0 ? `(${r0})` : `(${r0}${n < 0 ? '-' : '+'}${Math.abs(n)})`)).join('');
    const valT = (d.k !== 1 ? `${d.k}` : '') + vals.map((v) => (v === 0 ? `\\htmlClass{u4l9-z}{(0)}` : `(${v})`)).join('');
    const ck = add(stage, cx(h('div', 'u4l9-ckl', `<b>Check</b> ${K(`x=${r0}`)}: &nbsp;${K(`${subT}=${valT}=0`)} <span class="ok">✓</span>`)), W / 2, 398); hide(ck);
    const ansT = `x=${roots[0]}\\ \\text{ or }\\ x=${roots[1]}`;
    return [{
      cap: d.k !== 1 ? `Three factors: ${T(String(d.k))}, ${T(facT(p))} and ${T(facT(q))}. Their product is 0, so <b>one of them</b> must be 0.`
        : `Two factors, ${T(facT(p))} and ${T(facT(q))}, multiply to 0. So <b>one of them</b> must be 0.`,
      run: (c) => pulse(c, eq, 1.06)
    }, {
      cap: `Set <b>each</b> factor equal to 0. Write <b>“or”</b> between them: either one being 0 is enough.${d.k !== 1 ? ` (The ${d.k} gets a branch too, but ${T(`${d.k}=0`)} is impossible.)` : ''}`,
      run: async (c) => {
        await Promise.all(brs.map((b, i) => c.anim(b, [{ opacity: 0 }, { opacity: 1 }], 300, { delay: i * 120 })));
        await Promise.all([...fb, ...(fk ? [fk] : [])].map((e, i) => c.fadeIn(e, 340, { delay: i * 120 })));
        await c.fadeIn(orEl, 260);
      }
    }, {
      cap: `Solve each small equation. ${d.f.map((n) => (n === 0 ? `${T('x=0')} is already solved` : `${T(lin(n) + '=0')} gives ${T(`x=${solveLin(n)}`)}`)).join('; ')}.${d.k !== 1 ? ` The ${d.k} gives <b>no solution</b>: only factors with an ${T('x')} matter.` : ''}`,
      run: async (c) => {
        for (const e of fb) { const nt = e.querySelector('.nt'); await c.fadeIn(nt, 260); await c.pop(e.querySelector('.l2'), 380); }
        if (fk) await c.fadeIn(fk.querySelector('.l2'), 300);
      }
    }, {
      cap: `<b>Two solutions</b> (also called <b>roots</b>): ${T(ansT)}. Here they are on a number line.`,
      run: async (c) => { await c.fadeIn(NL.el, 300); for (const g of dots) await NL.reveal(g, c); }
    }, {
      cap: `Check ${T(`x=${r0}`)}: it makes ${T(facT(p))} equal to <b>0</b>, and 0 times anything is 0 ✓. ${roots[1] === 0 ? '' : `${T(`x=${roots[1]}`)} works the same way with the other factor.`}`,
      run: (c) => c.fadeIn(ck, 380)
    }];
  }
};

/* ======================================================================================
 * 3. Try every x: a table of x, both factors and their product. The product is 0 in exactly two columns.
 * ====================================================================================== */
const TT = { a: { f: [-3, 5], lo: -6, hi: 4 }, b: { f: [1, -4], lo: -3, hi: 6 } };
const tryTable = {
  title: 'Try every x: when is the product 0?',
  height: 400,
  minW: 860,
  choices: Object.keys(TT).map((k) => ({ v: k, label: tex(TT[k].f.map(facT).join('')) })),
  intro: (k) => `Put whole numbers into ${T(TT[k].f.map(facT).join(''))} and look for the answer <b>0</b>.`,
  make(stage, key, ex) {
    const W = ex.W, d = TT[key], [p, q] = d.f, xs = []; for (let x = d.lo; x <= d.hi; x++) xs.push(x);
    const lw = 190, cw = Math.min(72, Math.floor((W - 40 - lw) / xs.length));
    const tbl = add(stage, h('div', 'u4l9-tt'), 20, 20);
    tbl.style.gridTemplateColumns = `${lw}px repeat(${xs.length}, ${cw}px)`;
    const heads = ['x', lin(p), lin(q), facT(p) + facT(q)], hcls = ['', 'a', 'b', 'p'];
    const R = heads.map((hd, r) => {
      tbl.appendChild(h('div', 'u4l9-tth ' + hcls[r], K(hd)));
      return xs.map((x) => {
        const v = r === 0 ? x : r === 1 ? x + p : r === 2 ? x + q : (x + p) * (x + q);
        const e = h('div', 'u4l9-ttc ' + hcls[r] + (v === 0 && r ? ' z' : ''), mn(v)); tbl.appendChild(e); if (r) e.style.opacity = 0; return e;
      });
    });
    const zc = xs.map((x, i) => ((x + p) * (x + q) === 0 ? i : -1)).filter((i) => i >= 0);
    const roots = zc.map((i) => xs[i]);
    const tags = zc.map((i) => { const e = add(stage, cx(h('div', 'u4l9-tag', `${K(`x=${xs[i]}`)}`)), 20 + lw + 2 + i * (cw + 2) + cw / 2, 278); hide(e); return e; });
    const note = add(stage, cx(h('div', 'u4l9-note', `Only <b>two</b> values of ${K('x')} make the product 0, and each one makes <b>one factor</b> 0.`)), W / 2, 336); hide(note);
    return [{
      cap: `First factor: ${T(lin(p))} for each ${T('x')}. It is 0 only when ${T(`x=${-p}`)}.`,
      run: (c) => Promise.all(R[1].map((e, i) => c.anim(e, [{ opacity: 0 }, { opacity: 1 }], 220, { delay: i * 50 })))
    }, {
      cap: `Second factor: ${T(lin(q))}. It is 0 only when ${T(`x=${-q}`)}.`,
      run: (c) => Promise.all(R[2].map((e, i) => c.anim(e, [{ opacity: 0 }, { opacity: 1 }], 220, { delay: i * 50 })))
    }, {
      cap: 'Multiply down each column to get the product. Watch for the <b>zeros</b>.',
      run: (c) => Promise.all(R[3].map((e, i) => c.anim(e, [{ opacity: 0 }, { opacity: 1 }], 240, { delay: i * 70 })))
    }, {
      cap: `The product is 0 at ${T(`x=${roots[0]}`)} and ${T(`x=${roots[1]}`)}: exactly where one of the factors is 0. Nowhere else.`,
      run: async (c) => { tbl.classList.add('lit'); await Promise.all(tags.map((e) => c.pop(e, 380))); await c.fadeIn(note, 360); }
    }];
  }
};

/* ======================================================================================
 * 4–5. Solve by factoring: (move everything to one side) → factor → set each factor = 0 → solve.
 * ====================================================================================== */
const SV = {
  // tri: x² + bx + c with pair f (booklet order); dos: x² − n²; gcf: x² + bx = x(x + b)
  n2: { eq: 'x^2+4x-12=0', kind: 'tri', b: 4, c: -12, f: [6, -2] },
  a2: { eq: 'x^2-49=0', kind: 'dos', n: 7, f: [-7, 7] },
  b2: { eq: 'x^2+9x=0', kind: 'gcf', f: [0, 9] },
  c2: { eq: 'x^2-5x+6=0', kind: 'tri', b: -5, c: 6, f: [-2, -3] },
  d2: { eq: 'x^2+2x-24=0', kind: 'tri', b: 2, c: -24, f: [6, -4] },
  n3: { eq: 'x^2+5x=\\htmlClass{u4l9-mv0}{14}', zero: 'x^2+5x\\htmlClass{u4l9-mv0}{-14}=0', mv: [['14', '-14']], how: 'Subtract 14 from both sides', kind: 'tri', b: 5, c: -14, f: [7, -2] },
  a3: { eq: 'x^2+3x=\\htmlClass{u4l9-mv0}{10}', zero: 'x^2+3x\\htmlClass{u4l9-mv0}{-10}=0', mv: [['10', '-10']], how: 'Subtract 10 from both sides', kind: 'tri', b: 3, c: -10, f: [5, -2] },
  b3: { eq: 'x^2=\\htmlClass{u4l9-mv0}{8x}\\htmlClass{u4l9-mv1}{-15}', zero: 'x^2\\htmlClass{u4l9-mv0}{-8x}\\htmlClass{u4l9-mv1}{+15}=0', mv: [['8x', '-8x'], ['-15', '+15']], how: 'Subtract 8x and add 15 on both sides', kind: 'tri', b: -8, c: 15, f: [-3, -5] },
  c3: { eq: 'x^2-4x=\\htmlClass{u4l9-mv0}{12}', zero: 'x^2-4x\\htmlClass{u4l9-mv0}{-12}=0', mv: [['12', '-12']], how: 'Subtract 12 from both sides', kind: 'tri', b: -4, c: -12, f: [-6, 2] }
};
const plainEq = (s) => s.replace(/\\htmlClass\{[^}]*\}\{([^}]*)\}/g, '$1');
const KINDS = [['gcf', '<b>Common factor</b>', 'GCF'], ['dos', '<b>Difference of squares</b>', ''], ['tri', '<b>Trinomial</b>', 'product &amp; sum']];
const STEPS4 = ['Make one side <b>0</b>', '<b>Factor</b> the other side', 'Set <b>each factor</b> = 0', '<b>Solve</b> each one'];
function makeSolve(title, choices, introWord) {
  return {
    title, height: 490, minW: 940, choices, capH: 96,
    intro: (k) => `Solve ${T(plainEq(SV[k].eq))} by factoring. ${introWord}`,
    make(stage, key, ex) {
      const W = ex.W, d = SV[key], [p, q] = d.f, roots = [solveLin(p), solveLin(q)];
      const zeroT = d.zero ? plainEq(d.zero) : d.eq, LW = Math.round(W * 0.56), RX = LW + 24, RW = W - RX - 18;
      const facLine = (d.kind === 'gcf' ? 'x' : `(${lin(p)})`) + `(${lin(q)})`;
      const factT = `\\htmlClass{u4l9-ca}{${d.kind === 'gcf' ? 'x' : `(${lin(p)})`}}\\htmlClass{u4l9-cb}{(${lin(q)})}=0`;
      /* right: the four steps, and which factoring */
      const trk = add(stage, box(h('div', 'u4l9-trk'), RW), RX, 12);
      const trows = STEPS4.map((s, i) => { const e = h('div', 'u4l9-trr', `<b class="n">${i + 1}</b><span class="u4l9-trt">${s}</span>`); trk.appendChild(e); return e; });
      const kp = add(stage, box(h('div', 'u4l9-kp', '<div class="u4l9-kph">Which factoring?</div>'), RW), RX, 212);
      const krows = KINDS.map(([k, name, sub]) => { const e = h('div', 'u4l9-kr', `${name}<small>${sub}</small>`); e.dataset.k = k; kp.appendChild(e); return e; });
      hide(kp);
      let why = '';
      if (d.kind === 'tri') why = `Need <b>product</b> ${K(String(d.c))} and <b>sum</b> ${K(String(d.b))}.<br>The pair: <b>${K(`${p}\\text{ and }${q}`)}</b>`;
      if (d.kind === 'dos') why = `${K('x^2')} and ${K(String(d.n * d.n))} are both squares (${K(`${d.n}^2=${d.n * d.n}`)}), with a minus between: ${K(`(x-${d.n})(x+${d.n})`)}`;
      if (d.kind === 'gcf') why = `Both terms have an ${K('x')}. Take it out: ${K(`x(x+${q})`)}. No number is left to pull out.`;
      const kw = add(stage, box(h('div', 'u4l9-kw', why), RW), RX, 382); hide(kw);
      /* left: the work, one line at a time */
      let y = 14;
      const L0 = add(stage, h('div', 'u4l9-wl big', K(d.eq)), 24, y); y += 76;
      let L1 = null, how = null;
      if (d.zero) { L1 = add(stage, h('div', 'u4l9-wl', K(d.zero)), 24, y); how = add(stage, h('div', 'u4l9-how', d.how.replace(/(\d*x)/g, (m) => K(m))), 24, y + 48); hide(L1, how); y += 90; }
      const ok0 = d.zero ? null : add(stage, h('div', 'u4l9-ok0', '✓ already equal to 0'), 24 + L0.offsetWidth + 24, 30);
      if (ok0) hide(ok0);
      const L2 = add(stage, h('div', 'u4l9-wl', K(factT)), 24, y); hide(L2); y += 78;
      const bw = Math.min(250, (LW - 70) / 2);
      const mk = (i) => {
        const n = d.f[i], e = add(stage, box(h('div', 'u4l9-bx sm ' + (i ? 'b' : 'a')), bw), 24 + i * (bw + 46), y);
        e.innerHTML = n === 0 && d.kind === 'gcf' ? `<div class="l1">${K('x=0')}</div><div class="l2">${K('\\boldsymbol{x=0}')}</div>` : `<div class="l1">${K(lin(n) + '=0')}</div><div class="l2">${K(`\\boldsymbol{x=${solveLin(n)}}`)}</div>`;
        hide(e, e.querySelector('.l2')); return e;
      };
      const B = [mk(0), mk(1)];
      const orEl = add(stage, cx(h('div', 'u4l9-or', 'or')), 24 + bw + 23, y + 36); hide(orEl);
      const ans = add(stage, h('div', 'u4l9-ans', K(`x=${roots[0]}\\ \\text{ or }\\ x=${roots[1]}`)), 24, y + 132); hide(ans);
      const light = (i) => trows.forEach((e, j) => { e.classList.toggle('on', j === i); e.classList.toggle('done', j < i); });
      const steps = [];
      if (d.zero) {
        steps.push({
          cap: `<b>Step 1: make one side 0.</b> ${d.how.replace(/(\d*x)/g, (m) => T(m))}. A term that crosses the equals sign <b>changes its sign</b>.`,
          run: async (c) => {
            light(0); await c.fadeIn(L1, 300); hide(...spans(L1, 'u4l9-mv0'), ...spans(L1, 'u4l9-mv1'));
            await Promise.all(d.mv.map(async ([from, to], i) => {
              const a = L0.querySelector('.u4l9-mv' + i), b = L1.querySelector('.u4l9-mv' + i); if (!a || !b) return;
              if (c.fast) { b.style.opacity = 1; return; }
              const ra = stageRect(stage, a), rb = stageRect(stage, b);
              const g = add(stage, h('div', 'u4l9-ghost', K(from)), ra.x, ra.y);
              await c.anim(g, [{ transform: 'translate(0,0)' }, { transform: `translate(${(rb.x - ra.x) / 2}px, ${(rb.y - ra.y) / 2 - 40}px)`, offset: 0.5 }, { transform: `translate(${rb.x - ra.x}px, ${rb.y - ra.y}px)` }], 900);
              g.remove(); await c.pop(b, 360);
            }));
            spans(L1, 'u4l9-mv0').concat(spans(L1, 'u4l9-mv1')).forEach((e) => { e.style.opacity = 1; e.classList.add('u4l9-moved'); });
            await c.fadeIn(how, 260);
          }
        });
      } else {
        steps.push({
          cap: `<b>Step 1: is one side 0?</b> Yes: ${T(d.eq)} is already equal to 0, so we can factor right away.`,
          run: async (c) => { light(0); await c.fadeIn(ok0, 300); }
        });
      }
      steps.push({
        cap: `<b>Step 2: factor.</b> Which kind? ${d.kind === 'tri' ? 'Three terms with ' + T('x^2') + ' alone at the front: a <b>trinomial</b>.' : d.kind === 'dos' ? 'Two squares with a minus between them: a <b>difference of squares</b>.' : 'Every term has an ' + T('x') + ': a <b>common factor</b>.'}`,
        run: async (c) => { light(1); await c.fadeIn(kp, 300); const r = krows.find((e) => e.dataset.k === d.kind); r.classList.add('on'); await pulse(c, r, 1.05); await c.fadeIn(kw, 320); }
      }, {
        cap: `Write the factored equation: ${T(`${facLine}=0`)}. Factoring doesn’t change the right side: it is still <b>0</b>.`,
        run: (c) => c.fadeIn(L2, 380)
      }, {
        cap: `<b>Step 3:</b> a product is 0, so set <b>each factor</b> equal to 0.${d.kind === 'gcf' ? ` The lone ${T('x')} is a factor too: ${T('x=0')}.` : ''}`,
        run: async (c) => { light(2); await Promise.all(B.map((e, i) => c.fadeIn(e, 340, { delay: i * 140 }))); await c.fadeIn(orEl, 240); }
      }, {
        cap: `<b>Step 4: solve each one.</b> ${T(`x=${roots[0]}`)} or ${T(`x=${roots[1]}`)}. Two solutions.${d.kind === 'gcf' ? ` Don’t lose ${T('x=0')}: it is a real answer.` : ''}`,
        run: async (c) => { light(3); for (const e of B) await c.pop(e.querySelector('.l2'), 360); await c.fadeIn(ans, 360); trows[3].classList.add('done'); }
      });
      return steps;
    }
  };
}
const solveA = makeSolve('Solving by factoring: four steps', [{ v: 'n2', label: tex(SV.n2.eq) }, { sep: 'Example 2 check:' }, ...['a2', 'b2', 'c2', 'd2'].map((k) => ({ v: k, label: '(' + k[0] + ')' }))], 'One side is already 0.');
const solveB = makeSolve('Rearrange first, then the same four steps', [{ v: 'n3', label: tex(plainEq(SV.n3.eq)) }, { sep: 'Example 3 check:' }, ...['a3', 'b3', 'c3'].map((k) => ({ v: k, label: '(' + k[0] + ')' }))], 'First make one side 0.');

/* ======================================================================================
 * 4b. Don't divide the x away: dividing by x loses the solution x = 0; factoring keeps it.
 * ====================================================================================== */
const LR = {
  w: { eq: 'x^2=5x', div: ['\\dfrac{x^2}{x}=\\dfrac{5x}{x}', 'x=5'], one: 5, zero: 'x^2-5x=0', fac: 'x(x-5)=0', split: 'x=0\\ \\text{ or }\\ x-5=0', sol: 'x=0\\ \\text{ or }\\ x=5', chk: '0^2=5(0)', chkv: '0=0' },
  b2: { eq: 'x^2+9x=0', div: ['\\dfrac{x^2+9x}{x}=\\dfrac{0}{x}', 'x+9=0', 'x=-9'], one: -9, zero: null, fac: 'x(x+9)=0', split: 'x=0\\ \\text{ or }\\ x+9=0', sol: 'x=0\\ \\text{ or }\\ x=-9', chk: '0^2+9(0)=0', chkv: '0=0' }
};
const lostRoot = {
  title: 'Don’t divide the x away',
  height: 480,
  minW: 900,
  choices: [{ v: 'w', label: tex(LR.w.eq) + ' (warm-up)' }, { sep: 'Example 2 check:' }, { v: 'b2', label: '(b)' }],
  intro: (k) => `Two students solve ${T(LR[k].eq)}. One divides both sides by ${T('x')}; the other factors. Who gets <b>every</b> answer?`,
  make(stage, key, ex) {
    const W = ex.W, d = LR[key], PW = (W - 60) / 2;
    add(stage, cx(h('div', 'u4l9-big', K(d.eq))), W / 2, 10);
    const PL = add(stage, box(h('div', 'u4l9-path bad', '<div class="u4l9-pth">Divide both sides by <span class="u4l9-xx"></span></div>'), PW, 390), 20, 78);
    const PR = add(stage, box(h('div', 'u4l9-path good', '<div class="u4l9-pth">Make it 0 and factor</div>'), PW, 390), 40 + PW, 78);
    PL.querySelector('.u4l9-xx').innerHTML = K('x');
    const line = (P, t, cls = '') => { const e = h('div', 'u4l9-pl ' + cls, K(t)); P.appendChild(e); hide(e); return e; };
    const Ld = d.div.map((t, i) => line(PL, t, i === d.div.length - 1 ? 'res' : ''));
    const Lc = line(PL, `\\text{Check } x=0:\\ ${d.chk}\\ \\checkmark`, 'chk');
    const Lr = [d.zero, d.fac, d.split, d.sol].filter(Boolean).map((t, i, a) => line(PR, t, i === a.length - 1 ? 'res' : ''));
    const s1 = stamp(stage, 'lost a solution', { ok: false, x: 20 + PW / 2, y: 428, rotate: -6 }); hide(s1);
    const s2 = stamp(stage, 'both solutions', { ok: true, x: 40 + PW * 1.5, y: 428, rotate: -4 }); hide(s2);
    return [{
      cap: `Path 1 divides both sides by ${T('x')}. It looks quick and gives ${T(`x=${d.one}`)}.`,
      run: async (c) => { for (const e of Ld) await c.fadeIn(e, 340); }
    }, {
      cap: `But try ${T('x=0')} in the original equation: ${T(d.chk)} is true! So ${T('x=0')} is a solution, and Path 1 <b>lost it</b>.`,
      run: async (c) => { await c.fadeIn(Lc, 340); await stampIn(c, s1); }
    }, {
      cap: `Why? Dividing by ${T('x')} quietly assumes ${T('x')} is <b>not</b> 0. Path 2 makes one side 0 and <b>factors</b> out the ${T('x')} instead.`,
      run: async (c) => { for (const e of Lr.slice(0, -1)) await c.fadeIn(e, 340); }
    }, {
      cap: `Path 2 finds <b>both</b>: ${T(d.sol)}. Never divide both sides by ${T('x')}: <b>factor it out</b>.`,
      run: async (c) => { await c.fadeIn(Lr[Lr.length - 1], 360); await stampIn(c, s2); }
    }];
  }
};

/* ======================================================================================
 * 5b. The product must be 0: x(x + 3) = 10 can't be split. Many pairs multiply to 10; only 0 forces a factor.
 * ====================================================================================== */
const notZero = {
  title: 'Why the product must equal 0',
  height: 500,
  minW: 940,
  intro: `Can we split ${T('x(x+3)=10')} into ${T('x=10')} or ${T('x+3=10')}? Let’s test it.`,
  make(stage, v, ex) {
    const W = ex.W, PW = Math.floor((W - 80) / 3);
    add(stage, cx(h('div', 'u4l9-big', K('x(x+3)=10'))), W / 2, 8);
    const P1 = add(stage, box(h('div', 'u4l9-path bad u4l9-nz', '<div class="u4l9-pth">Split it anyway?</div>'), PW, 410), 20, 76);
    const P2 = add(stage, box(h('div', 'u4l9-path mid', '<div class="u4l9-pth">What multiplies to 10?</div>'), PW, 410), 40 + PW, 76);
    const P3 = add(stage, box(h('div', 'u4l9-path good u4l9-nz', '<div class="u4l9-pth">Make it 0 first</div>'), PW, 410), 60 + 2 * PW, 76);
    const line = (P, html, cls = '') => { const e = h('div', 'u4l9-pl ' + cls, html); P.appendChild(e); hide(e); return e; };
    const w1 = line(P1, K('x=10\\ \\text{ or }\\ x+3=10')), w2 = line(P1, K('x=10\\ \\text{ or }\\ x=7'));
    const w3 = line(P1, `${K('10(10+3)=130')} <span class="no">✗</span>`, 'chk'), w4 = line(P1, `${K('7(7+3)=70')} <span class="no">✗</span>`, 'chk');
    const prs = h('div', 'u4l9-prs'); P2.appendChild(prs);
    const pairs = ['1\\times10', '2\\times5', '4\\times2.5', '20\\times\\tfrac12', '-1\\times(-10)', '-2\\times(-5)'].map((t) => { const e = h('div', 'u4l9-pl pr', K(t)); prs.appendChild(e); hide(e); return e; });
    const more = line(P2, '…and many more. <b>Neither</b> factor has to be 10.', 'nt');
    const zr = line(P2, `But for <b>0</b>: one factor <b>must</b> be 0.`, 'nt key');
    const r1 = line(P3, K('x^2+3x=10')), r2 = line(P3, K('x^2+3x-10=0')), r3 = line(P3, K('(x+5)(x-2)=0')), r4 = line(P3, K('x=-5\\ \\text{ or }\\ x=2'), 'res');
    const r5 = line(P3, `${K('(-5)(-2)=10')} <span class="ok">✓</span>`, 'chk'), r6 = line(P3, `${K('2(5)=10')} <span class="ok">✓</span>`, 'chk');
    return [{
      cap: `Try splitting it like a zero product: ${T('x=10')} or ${T('x+3=10')}, so ${T('x=10')} or ${T('x=7')}.`,
      run: async (c) => { await c.fadeIn(w1, 320); await c.fadeIn(w2, 320); }
    }, {
      cap: `Check them: ${T('10(13)=130')} and ${T('7(10)=70')}. <b>Neither</b> gives 10. The split does not work.`,
      run: async (c) => { await c.fadeIn(w3, 320); await c.fadeIn(w4, 320); }
    }, {
      cap: `Why not? Lots of pairs multiply to 10, so neither factor has to be 10. Only <b>0</b> is special: a product of 0 <b>forces</b> a factor to be 0.`,
      run: async (c) => { for (const e of pairs) await c.fadeIn(e, 200); await c.fadeIn(more, 280); await c.fadeIn(zr, 300); }
    }, {
      cap: `The fix: expand, then <b>make one side 0</b>. ${T('x^2+3x-10=0')} factors as ${T('(x+5)(x-2)=0')}, so ${T('x=-5')} or ${T('x=2')}.`,
      run: async (c) => { for (const e of [r1, r2, r3, r4]) await c.fadeIn(e, 300); }
    }, {
      cap: `Check both in the original: ${T('(-5)(-2)=10')} ✓ and ${T('2(5)=10')} ✓. These are the real solutions.`,
      run: async (c) => { await c.fadeIn(r5, 320); await c.fadeIn(r6, 320); }
    }];
  }
};

/* ======================================================================================
 * 6. Check by substitution: put each root into the ORIGINAL equation; a sign slip gets caught.
 * ====================================================================================== */
const SC = {
  n: { eq: 'x^2+5x=14', rhs: '14', rows: [
    { r: '-7', l: ['(\\htmlClass{u4l9-rv}{-7})^2+5(\\htmlClass{u4l9-rv}{-7})', '49-35', '14'], ok: true },
    { r: '2', l: ['(\\htmlClass{u4l9-rv}{2})^2+5(\\htmlClass{u4l9-rv}{2})', '4+10', '14'], ok: true },
    { r: '7', l: ['(\\htmlClass{u4l9-rv}{7})^2+5(\\htmlClass{u4l9-rv}{7})', '49+35', '84'], ok: false, who: 'A classmate wrote' }] },
  e4: { eq: 'x^2-x=12', rhs: '12', rows: [
    { r: '4', l: ['(\\htmlClass{u4l9-rv}{4})^2-(\\htmlClass{u4l9-rv}{4})', '16-4', '12'], ok: true },
    { r: '-3', l: ['(\\htmlClass{u4l9-rv}{-3})^2-(\\htmlClass{u4l9-rv}{-3})', '9+3', '12'], ok: true }] },
  e5: { eq: '2x^2+5x=3', rhs: '3', rows: [
    { r: '-3', l: ['2(\\htmlClass{u4l9-rv}{-3})^2+5(\\htmlClass{u4l9-rv}{-3})', '2(9)-15=18-15', '3'], ok: true },
    { r: '\\tfrac12', l: ['2\\left(\\htmlClass{u4l9-rv}{\\tfrac12}\\right)^2+5\\left(\\htmlClass{u4l9-rv}{\\tfrac12}\\right)', '2\\left(\\tfrac14\\right)+\\tfrac52=\\tfrac12+\\tfrac52', '3'], ok: true }] }
};
const subCheck = {
  title: 'Check in the original equation',
  height: 470,
  minW: 940,
  choices: [{ v: 'n', label: tex(SC.n.eq) }, { sep: 'Example 4 check:' }, { v: 'e4', label: tex(SC.e4.eq) }, { sep: 'Example 5 check:' }, { v: 'e5', label: tex(SC.e5.eq) }],
  intro: (k) => `Put each solution back into the <b>original</b> equation ${T(SC[k].eq)}. If the left side comes out to ${T(SC[k].rhs)}, it checks.`,
  make(stage, key, ex) {
    const W = ex.W, d = SC[key], n = d.rows.length, PW = Math.floor((W - 20 * (n + 1)) / n);
    const top = add(stage, cx(h('div', 'u4l9-big', K(d.eq.replace(/x/g, '\\htmlClass{u4l9-xs}{x}')))), W / 2, 8);
    const panels = d.rows.map((r, i) => {
      const P = add(stage, box(h('div', 'u4l9-path ' + (r.ok ? 'good' : 'bad') + ' u4l9-scp'), PW, 370), 20 + i * (PW + 20), 80);
      P.innerHTML = `<div class="u4l9-pth">${r.who ? r.who + ' ' : ''}${K(`x=${r.r}`)}</div>`;
      const ls = r.l.map((t, j) => { const e = h('div', 'u4l9-pl' + (j === 2 ? ' res' : ''), K((j ? '=' : '') + t)); P.appendChild(e); hide(e); return e; });
      const cmp = h('div', 'u4l9-pl cmp', `${K(`${r.l[2]}${r.ok ? '=' : '\\neq'}${d.rhs}`)} <span class="${r.ok ? 'ok' : 'no'}">${r.ok ? '✓' : '✗'}</span>`); P.appendChild(cmp); hide(cmp);
      const st = stamp(P, r.ok ? 'checks' : 'caught!', { ok: r.ok, x: PW / 2, y: 320, rotate: -5 }); hide(st);
      hide(P); return { P, ls, cmp, st, r };
    });
    const steps = [{
      cap: `Use the <b>original</b> equation, ${T(d.eq)}, not the factored one: a mistake in the factoring would hide in the factored form.`,
      run: (c) => pulse(c, top, 1.06)
    }];
    panels.forEach(({ P, ls, cmp, st, r }) => {
      steps.push({
        cap: r.ok ? `Put ${T(`x=${r.r}`)} into every ${T('x')}. Use <b>brackets</b> around the number${r.r.startsWith('-') ? `: ${T(`(${r.r})^2`)} is positive` : ''}.`
          : `${r.who} ${T(`x=${r.r}`)} (a sign slip). Substitute it the same way.`,
        run: async (c) => { await c.fadeIn(P, 300); await c.fadeIn(ls[0], 340); }
      }, {
        cap: r.ok ? `Work it out: ${T(r.l[1] + '=' + r.l[2])}. That matches the right side, ${T(d.rhs)} ✓.`
          : `${T(r.l[1] + '=' + r.l[2])}, but the right side is ${T(d.rhs)}. ${T(`${r.l[2]}\\neq${d.rhs}`)}, so ${T(`x=${r.r}`)} is <b>not</b> a solution. The check caught the mistake.`,
        run: async (c) => { await c.fadeIn(ls[1], 300); await c.fadeIn(ls[2], 300); await c.fadeIn(cmp, 300); await stampIn(c, st); }
      });
    });
    return steps;
  }
};

/* ======================================================================================
 * 7. a ≠ 1: decomposition, then the zero product property.
 * ====================================================================================== */
const DC = {
  n: { orig: null, zero: '2x^2+x-3=0', ac: '2(-3)=-6', b: 1, rows: [[1, -6], [-1, 6], [2, -3], [-2, 3]], hit: 3,
    split: '2x^2+3x-2x-3=0', grp: '\\htmlClass{u4l9-ca}{x}(2x+3)\\htmlClass{u4l9-cb}{-1}(2x+3)=0', fac: '(2x+3)(x-1)=0',
    br: [['2x+3=0', '2x=-3', 'x=-\\tfrac32'], ['x-1=0', 'x=1']], sol: 'x=-\\tfrac32\\ \\text{ or }\\ x=1' },
  e5: { orig: '2x^2+5x=3', zero: '2x^2+5x-3=0', ac: '2(-3)=-6', b: 5, rows: [[1, -6], [-1, 6], [2, -3], [-2, 3]], hit: 1,
    split: '2x^2+6x-x-3=0', grp: '\\htmlClass{u4l9-ca}{2x}(x+3)\\htmlClass{u4l9-cb}{-1}(x+3)=0', fac: '(x+3)(2x-1)=0',
    br: [['x+3=0', 'x=-3'], ['2x-1=0', '2x=1', 'x=\\tfrac12']], sol: 'x=-3\\ \\text{ or }\\ x=\\tfrac12' }
};
const decompSolve = {
  title: 'When a ≠ 1: decompose, then split',
  height: 520,
  minW: 940,
  capH: 96,
  choices: [{ v: 'n', label: tex(DC.n.zero) }, { sep: 'Example 5 check:' }, { v: 'e5', label: tex(DC.e5.orig) }],
  intro: (k) => `Solve ${T(DC[k].orig || DC[k].zero)}. Same plan as always; only the factoring step is longer.`,
  make(stage, key, ex) {
    const W = ex.W, d = DC[key], LW = Math.round(W * 0.6), RX = LW + 20, RW = W - RX - 18;
    let y = 12;
    const L = (t, cls = '') => { const e = add(stage, h('div', 'u4l9-wl dl ' + cls, K(t)), 24, y); hide(e); y += 64; return e; };
    const L0 = d.orig ? L(d.orig) : null, L1 = L(d.zero), L2 = L(d.split), L3 = L(d.grp), L4 = L(d.fac);
    y += 6;
    const bw = (LW - 60) / 2;
    const B = d.br.map((ls, i) => { const e = add(stage, box(h('div', 'u4l9-bx sm ' + (i ? 'b' : 'a'), ls.map((t, j) => `<div class="${j === ls.length - 1 ? 'l2' : 'l1'}">${K(j === ls.length - 1 ? `\\boldsymbol{${t}}` : t)}</div>`).join('')), bw), 24 + i * (bw + 36), y); hide(e); return e; });
    const orEl = add(stage, cx(h('div', 'u4l9-or', 'or')), 24 + bw + 18, y + 36); hide(orEl);
    /* right: a·c and the pair search */
    const sp = add(stage, box(h('div', 'u4l9-sp'), RW), RX, 12);
    sp.innerHTML = `<div class="u4l9-sph">${K(`a\\cdot c=${d.ac}`)}</div><div class="u4l9-spn">Need: product ${K('-6')}, sum ${K(String(d.b))}</div>`;
    const rows = d.rows.map(([m, n], i) => { const e = h('div', 'u4l9-sr' + (i === d.hit ? ' hit' : ''), `<span>${K(`${m},\\ ${n}`)}</span><span>${K(`${m}+${par(n)}=${m + n}`)}</span><span class="mk">${i === d.hit ? '✓' : '✗'}</span>`); sp.appendChild(e); hide(e); return e; });
    hide(sp);
    const [m, n] = d.rows[d.hit];
    const steps = [];
    if (d.orig) steps.push({ cap: `<b>Make one side 0</b> first: subtract 3 from both sides. ${T(d.zero)}.`, run: async (c) => { await c.fadeIn(L0, 300); await c.fadeIn(L1, 340); } });
    else steps.push({ cap: `${T(d.zero)} is already equal to 0. The leading coefficient is 2, not 1, so we factor by <b>decomposition</b>.`, run: (c) => c.fadeIn(L1, 340) });
    steps.push({
      cap: `Multiply ${T('a\\cdot c')}: ${T(d.ac)}. We need two integers with <b>product</b> ${T('-6')} and <b>sum</b> ${T(String(d.b))}.`,
      run: (c) => c.fadeIn(sp, 340)
    }, {
      cap: `List the pairs that multiply to ${T('-6')} and add them. ${T(`${m}`)} and ${T(`${n}`)} add to ${T(String(d.b))} ✓.`,
      run: async (c) => { for (const e of rows) { await c.fadeIn(e, 260, { from: 'translateX(-10px)' }); await c.sleep(120); } rows[d.hit].classList.add('on'); await pulse(c, rows[d.hit], 1.05); }
    }, {
      cap: `<b>Split the middle term</b> with that pair: ${T(d.split)}. Still the same polynomial, just written with four terms.`,
      run: (c) => c.fadeIn(L2, 340)
    }, {
      cap: `<b>Group</b> in twos and take out a common factor from each pair. Both groups leave the <b>same bracket</b>.`,
      run: (c) => c.fadeIn(L3, 340)
    }, {
      cap: `Take out the shared bracket: ${T(d.fac)}. Now the zero product property works exactly as before.`,
      run: (c) => c.fadeIn(L4, 340)
    }, {
      cap: `Set each factor equal to 0 and solve. The ${T('2x')} needs one more step: divide by 2. A <b>fraction</b> answer is perfectly normal. ${T(d.sol)}.`,
      run: async (c) => { await Promise.all(B.map((e, i) => c.fadeIn(e, 340, { delay: i * 160 }))); await c.fadeIn(orEl, 240); }
    });
    return steps;
  }
};

/* ======================================================================================
 * warm-up: the zero riddles (gift boxes, the cheat sheet)
 * ====================================================================================== */
const WAYS = [[0, 5], [3, 0], [0, 0], [-7, 0], [0, 12]];
function mountWarm() {
  const host = document.getElementById('wu'); if (!host) return;
  const q1 = host.querySelector('[data-gift="s1"]');
  if (q1) q1.addEventListener('click', () => { q1.classList.add('open'); q1.querySelector('.u4l9-gnum').textContent = '0'; });
  const s2 = [...host.querySelectorAll('[data-gift="s2"]')], res = host.querySelector('.u4l9-s2res');
  let wi = -1;
  const show = (a, b, note) => {
    s2.forEach((g, i) => { const v = i ? b : a; g.classList.add('open'); g.classList.toggle('zero', v === 0); g.querySelector('.u4l9-gnum').textContent = mn(v); });
    if (res) res.innerHTML = note;
  };
  const way = host.querySelector('[data-s2="way"]'), nz = host.querySelector('[data-s2="nz"]');
  if (way) way.addEventListener('click', () => { wi = (wi + 1) % WAYS.length; const [a, b] = WAYS[wi]; show(a, b, `Way ${wi + 1}: ${mn(a)} × ${mn(b)} = 0 ✓`); });
  const NZ = [[4, 6], [-2, 9], [-5, -3], [7, 1]]; let ni = -1;
  if (nz) nz.addEventListener('click', () => { ni = (ni + 1) % NZ.length; const [a, b] = NZ[ni]; show(a, b, `<span class="no">${mn(a)} × ${mn(b)} = ${mn(a * b)}, not 0 ✗</span>`); });
  /* the cheat sheet: tap a column to circle it; the answers circle their own columns */
  const cols = [...host.querySelectorAll('.u4l9-cs [data-v]')];
  cols.forEach((e) => e.addEventListener('click', () => e.classList.toggle('hl')));
  const mark = (vs, on) => cols.forEach((e) => { if (vs.includes(e.dataset.v)) e.classList.toggle('hl', on); });
  host.querySelectorAll('[data-hl]').forEach((w) => {
    const b = w.querySelector('[data-bk-toggle], [data-poll-reveal]'); if (!b) return;
    b.addEventListener('click', () => setTimeout(() => mark(w.dataset.hl.split(','), w.classList.contains('shown') || w.classList.contains('revealed')), 0));
  });
}

/* ======================================================================================
 * Stand Up Break! — solve by factoring at the whiteboards
 * ====================================================================================== */
const linS = (v, p) => '(' + v + (p < 0 ? '-' : '+') + Math.abs(p) + ')';
function trin(a, b, c, v = 'x') { // a·v² + b·v + c as LaTeX
  const t = (k, s, first) => (k === 0 ? '' : (k < 0 ? '-' : first ? '' : '+') + (Math.abs(k) === 1 && s ? '' : Math.abs(k)) + s);
  return (t(a, v + '^2', true) + t(b, v) + t(c, '')) || '0';
}
const orT = (a, b) => `x=${a}\\ \\text{ or }\\ x=${b}`;
function two(r, lo, hi) { // two different nonzero integers, not opposites
  for (;;) { const p = r.int(lo, hi) * r.sign(), q = r.int(lo, hi) * r.sign(); if (p !== q && p + q !== 0) return [p, q]; }
}
const fracT = (num, den) => { const g = (a, b) => (b ? g(b, a % b) : Math.abs(a)), k = g(num, den), n = num / k, dd = den / k; return dd === 1 ? String(n) : (n < 0 ? '-' : '') + `\\tfrac{${Math.abs(n)}}{${dd}}`; };
standup('u4l9', {
  intro: 'Solve at your whiteboard station: make one side 0, factor, set each factor equal to 0. Check one answer in the original equation.',
  levels: {
    BEG: (r) => { // already factored
      const kind = r.pick(['two', 'two', 'two', 'k', 'x']);
      if (kind === 'x') { const p = r.int(2, 12) * r.sign(); return { q: `x${linS('x', p)}=0`, a: [`x=0\\ \\text{ or }\\ ${linS('x', p).slice(1, -1)}=0`, orT(0, -p)] }; }
      const [p, q] = two(r, 1, 9), k = kind === 'k' ? r.int(2, 6) : 1;
      return { q: (k > 1 ? k : '') + linS('x', p) + linS('x', q) + '=0', a: [(k > 1 ? `${k}\\neq0;\\quad ` : '') + `${linS('x', p).slice(1, -1)}=0\\ \\text{ or }\\ ${linS('x', q).slice(1, -1)}=0`, orT(-p, -q)] };
    },
    PRG: (r) => { // one side already 0: trinomial, difference of squares, or common factor x
      const kind = r.pick(['tri', 'tri', 'tri', 'dos', 'gcf']);
      if (kind === 'dos') { const n = r.int(2, 11); return { q: `x^2-${n * n}=0`, a: [`(x-${n})(x+${n})=0`, orT(n, -n)] }; }
      if (kind === 'gcf') { const b = r.int(2, 14) * r.sign(); return { q: trin(1, b, 0) + '=0', a: [`x${linS('x', b)}=0`, orT(0, -b)] }; }
      const [p, q] = two(r, 1, 8);
      return { q: trin(1, p + q, p * q) + '=0', a: [`\\text{product } ${p * q},\\ \\text{sum } ${p + q}:\\ ${p} \\text{ and } ${q}`, linS('x', p) + linS('x', q) + '=0', orT(-p, -q)] };
    },
    MAS: (r) => { // rearrange first, or a ≠ 1
      if (r.chance(0.3)) { // (ax + m)(x + n) = 0 with a = 2 or 3
        const a = r.pick([2, 3]); let m, n; do { m = r.int(1, 7) * r.sign(); n = r.int(1, 6) * r.sign(); } while (m % a === 0);
        return { q: trin(a, a * n + m, m * n) + '=0', a: [`a\\cdot c=${a * m * n}`, `(${a}x${m < 0 ? '-' : '+'}${Math.abs(m)})${linS('x', n)}=0`, `x=${fracT(-m, a)}\\ \\text{ or }\\ x=${-n}`] };
      }
      const [p, q] = two(r, 1, 9), b = p + q, c = p * q, form = r.pick(['bx', 'bx', 'rhs']);
      const Q = form === 'bx' ? `${trin(1, b, 0)}=${-c}` : `x^2=${trin(0, -b, -c).replace(/^\+/, '')}`;
      return { q: Q, a: [trin(1, b, c) + '=0', linS('x', p) + linS('x', q) + '=0', orT(-p, -q)] };
    }
  }
});

/* ============ wiring ============ */
function mountExplainers() {
  const defs = { zeroGrid, zpSplit, tryTable, solveA, solveB, lostRoot, notZero, subCheck, decompSolve };
  document.querySelectorAll('[data-explainer]').forEach((el) => new Explainer(el, defs[el.dataset.explainer]));
}
mountWarm(); mountExplainers();
