/* Math 15 · Unit 3 · Lesson 7 — Unit Review: Polynomial Operations.
 * A review lesson: each explainer recaps one big picture from the unit, with "Example N check" chips that replay the
 * booklet's own numbers after the class has worked them by hand (never the assignment's questions).
 * Warm-up: the Mind-Reading Machines (pick a number, run Machines A and B; the envelope always says −25).
 * Explainers:
 *   machines (rebuild Machines A, B and C with n: distribute, collect, FOIL, like terms — warm-up bridge),
 *   tiles    (zero pairs: adding and subtracting with algebra tiles — from Math 10C 3.6),
 *   collect  (expand each group, then sort like terms into buckets — Examples 1, 2(b), Challenges 1 and 2),
 *   dist     (a monomial times every term: arrows and partial products — Example 2),
 *   foil     (FOIL on the area model — Examples 3 and 4(a), warm-up Machine B — from Math 10C 3.6),
 *   square   ((a ± b)² as a square: four pieces, not two — Example 4(b) — from Math 10C 3.6),
 *   patterns (which pattern? difference of squares, perfect square, or neither — Example 4),
 *   grid     (binomial × trinomial: six cells, like terms on the diagonals — Example 5 — from Math 10C 3.6),
 *   measure  (the expression IS the area or volume: rectangle and prism — Example 6, Challenge 3),
 *   slips    (find the slip: a missing middle term, a minus that stops early, multiplying before squaring).
 * Algebra tiles and like-term colours as on every Unit 3 page (10C u3l1 legend): x² teal, x amber, 1 slate blue,
 * x³ purple; shaded = positive, unshaded (white, coloured outline) = negative. All algebra is computed by the small
 * polynomial helpers below, so every caption matches the maths. */
import { h, Explainer, fmt } from '../explain.js';
import { tex } from '../tex.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const at = (el, x, y) => { el.style.left = x + 'px'; el.style.top = y + 'px'; return el; };
const add = (stage, el, x, y) => { stage.appendChild(at(el, x, y)); return el; };
const hide = (...els) => els.forEach((e) => (e.style.opacity = 0));
const box = (el, w, hh) => { el.style.width = w + 'px'; el.style.height = hh + 'px'; return el; };
const moveTo = (c, el, x, y, ms = 600, o = {}) => c.anim(el, [{ left: el.style.left, top: el.style.top }, { left: x + 'px', top: y + 'px' }], ms, o);
const NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs = {}) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); return e; };
const flash = (c, el) => c.anim(el, [{ opacity: 0.15 }, { opacity: 1 }], 320);
const show = (c, el, ms = 380, o = {}) => c.anim(el, [{ opacity: 0 }, { opacity: 1 }], ms, o);
const draw = (c, path, ms = 600, o = {}) => { const len = path.getTotalLength ? path.getTotalLength() || 400 : 400; path.style.strokeDasharray = len; return c.anim(path, [{ strokeDashoffset: len, opacity: 1 }, { strokeDashoffset: 0, opacity: 1 }], ms, o); };
const pulse = (c, el, s = 1.15) => c.anim(el, [{ transform: 'scale(1)' }, { transform: `scale(${s})` }, { transform: 'scale(1)' }], 420);
const stampIn = (c, el) => c.anim(el, [{ opacity: 0, transform: 'scale(1.8) rotate(-12deg)' }, { opacity: 1, transform: 'scale(1) rotate(-5deg)' }], 420, { easing: 'cubic-bezier(.2,1.4,.4,1)' });
function spread(els, cx, gap) { const ws = els.map((e) => e.offsetWidth || 40); const tot = ws.reduce((a, b) => a + b, 0) + gap * (els.length - 1); let x = cx - tot / 2; return ws.map((w) => { const m = x + w / 2; x += w + gap; return m; }); }
const NUM = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const cap1 = (s) => s[0].toUpperCase() + s.slice(1);

/* ================= polynomial helpers ================= */
// a term is { c: coefficient, e: { x: 2 } }; a polynomial is an array of terms (kept in written order until collected)
function parse(s) {
  s = String(s).replace(/\s+/g, '').replace(/−/g, '-');
  const out = []; let i = 0;
  while (i < s.length) {
    let sign = 1;
    if (s[i] === '+') i++; else if (s[i] === '-') { sign = -1; i++; }
    let num = ''; while (i < s.length && /[0-9.]/.test(s[i])) num += s[i++];
    const e = {};
    while (i < s.length && /[a-z]/.test(s[i])) {
      const v = s[i++]; let p = 1;
      if (s[i] === '^') {
        i++; let q = '';
        if (s[i] === '{') { i++; while (i < s.length && s[i] !== '}') q += s[i++]; i++; } else { if (s[i] === '-') q += s[i++]; while (i < s.length && /[0-9]/.test(s[i])) q += s[i++]; }
        p = Number(q);
      }
      e[v] = (e[v] || 0) + p;
    }
    out.push({ c: sign * (num === '' ? 1 : Number(num)), e });
  }
  return out;
}
const P = parse;
const ekey = (e) => Object.keys(e).filter((k) => e[k]).sort().map((k) => k + e[k]).join('');
const deg = (t) => Object.values(t.e).reduce((a, b) => a + b, 0);
function collect(p) { const m = new Map(); p.forEach((t) => { const k = ekey(t.e), o = m.get(k); if (o) o.c += t.c; else m.set(k, { c: t.c, e: { ...t.e } }); }); return [...m.values()].filter((t) => t.c !== 0); }
const sortP = (p, asc) => [...p].sort((a, b) => (asc ? deg(a) - deg(b) : deg(b) - deg(a)));
const mulT = (a, b) => { const e = { ...a.e }; for (const k in b.e) e[k] = (e[k] || 0) + b.e[k]; return { c: a.c * b.c, e }; };
const mul = (p, q) => collect(p.flatMap((a) => q.map((b) => mulT(a, b))));
const addP = (...ps) => collect(ps.flat());
const neg = (p) => p.map((t) => ({ c: -t.c, e: t.e }));
const sub = (p, q) => addP(p, neg(q));
const vstr = (e) => Object.keys(e).filter((k) => e[k]).sort().map((k) => k + (e[k] === 1 ? '' : `^{${e[k]}}`)).join('');
function termTex(t, first) { const v = vstr(t.e), a = Math.abs(t.c), co = v && a === 1 ? '' : String(a); return (t.c < 0 ? '-' : first ? '' : '+') + co + v; }
const rawTex = (p) => p.map((t, i) => termTex(t, i === 0)).join('');           // written order, not collected
const ptex = (p, asc) => { const q = sortP(collect(p), asc); return q.length ? rawTex(q) : '0'; };
const fac = (t) => (t.c < 0 ? `(${termTex(t, true)})` : termTex(t, true));       // a factor, bracketed if negative
const kc = (t) => 'u3l7-k' + Math.min(3, Math.max(0, deg(t)));
const plus = (t, first) => (first ? '' : '{}') + termTex(t, first);             // '{}' gives a binary + or − its spacing
const xpow = (t) => t.e.x || t.e.n || 0;
const vname = (t) => Object.keys(t.e).find((k) => t.e[k]) || 'x';

/* ================= algebra tiles ================= */
// shaded = positive, unshaded = negative; x²-tile X by X, x-tile 1 by X, unit 1 by 1
function tileList(p) { const out = []; sortP(collect(p)).forEach((t) => { for (let i = 0; i < Math.abs(t.c); i++) out.push({ k: deg(t), neg: t.c < 0 }); }); return out; }
function mkTile(host, k, ng, x, y, w, hh) { const e = add(host, h('div', `u3l7-tile t${k}${ng ? ' neg' : ''}`), x, y); box(e, w, hh); return e; }

/* ============ Warm-up bridge: rebuild the machines with n ============ */
const MACH = {
  A: {
    n: 7, name: 'Machine A',
    st: [
      { op: 'think of<br>a number', e: 'n', w: 'n', v: (n) => n, cap: (n) => `Call your number ${T('n')}. Follow it through Machine A with <b>algebra</b>, and with a test number (${n}) underneath.` },
      { op: T('+\\,3'), e: 'n+3', w: 'n+3', v: (n) => n + 3, cap: () => `${T('+3')}: the number becomes ${T('n+3')}. Nothing to simplify yet.` },
      { op: T('\\times\\,2'), e: '2n+6', w: '2(n+3)=2n+6', v: (n) => 2 * (n + 3), tag: 'distribute', cap: () => `${T('\\times2')}: the 2 multiplies <b>both</b> terms. ${T('2(n+3)=2n+6')}, not ${T('2n+3')}. (Warm-up Q3.)` },
      { op: T('-\\,4'), e: '2n+2', w: '2n+6-4=2n+2', v: (n) => 2 * n + 2, tag: 'collect', cap: () => `${T('-4')}: collect the numbers, ${T('6-4=2')}. So ${T('2n+6-4=2n+2')}.` },
      { op: T('\\div\\,2'), e: 'n+1', w: '(2n+2)\\div2=n+1', v: (n) => n + 1, cap: () => `${T('\\div2')}: halve <b>each</b> term. ${T('(2n+2)\\div2=n+1')}.` },
      { op: 'subtract<br>your number', e: '1', w: 'n+1-n=1', v: () => 1, tag: 'like terms', cap: () => `Subtract your number: ${T('n+1-n')}. ${T('n')} and ${T('-n')} are like terms, a zero pair. Only ${T('1')} is left.` }
    ],
    end: `The ${T('n')} cancelled, so <b>every</b> number comes out as <b>1</b>. That’s the “mind-reading”. (Warm-up Q1 and Q2.)`
  },
  B: {
    n: 10, name: 'Machine B',
    st: [
      { op: 'think of<br>a number', e: 'n', w: 'n', v: (n) => n, cap: (n) => `Machine B, with ${T('n')} (and the test number ${n} underneath).` },
      { op: `${T('+\\,5')} and ${T('-\\,5')}`, e: 'n+5,\\ n-5', w: 'n+5\\ \\text{ and }\\ n-5', v: (n) => `${n + 5}, ${n - 5}`, cap: () => `It splits: one copy ${T('+5')}, one copy ${T('-5')}. Now we have ${T('n+5')} and ${T('n-5')}.` },
      { op: 'multiply the<br>two answers', e: 'n^2-25', w: '(n+5)(n-5)=n^2-5n+5n-25=n^2-25', v: (n) => (n + 5) * (n - 5), tag: 'FOIL', cap: () => `FOIL: ${T('(n+5)(n-5)=n^2-5n+5n-25')}. The Outer and Inner products cancel: ${T('n^2-25')}. A <b>difference of squares</b>!` },
      { op: 'subtract<br>your number<br>× your number', e: '-25', w: 'n^2-25-n^2=-25', v: () => -25, tag: 'like terms', cap: () => `Subtract ${T('n\\times n=n^2')}: ${T('n^2-25-n^2=-25')}. The ${T('n^2')} terms cancel too.` }
    ],
    end: `Nothing with ${T('n')} is left, so the envelope says <b>−25</b> for <b>every</b> number. <b>The big one: C.</b>`
  },
  C: {
    n: 4, name: 'Machine C (follow-up)',
    st: [
      { op: 'think of<br>a number', e: 'n', w: 'n', v: (n) => n, cap: (n) => `The follow-up, Machine C. Call your number ${T('n')} again (test number ${n}).` },
      { op: T('+\\,1'), e: 'n+1', w: 'n+1', v: (n) => n + 1, cap: () => `Add 1: ${T('n+1')}.` },
      { op: 'square it', e: 'n^2+2n+1', w: '(n+1)^2=n^2+2n+1', v: (n) => (n + 1) ** 2, tag: 'perfect square', cap: () => `Square it: a <b>perfect square</b>, ${T('(n+1)^2=n^2+2n+1')}. Not ${T('n^2+1')}: the middle term is ${T('2ab=2n')}.` },
      { op: 'subtract<br>your number<br>squared', e: '2n+1', w: 'n^2+2n+1-n^2=2n+1', v: (n) => 2 * n + 1, tag: 'like terms', cap: () => `Subtract ${T('n^2')}: the ${T('n^2')} terms cancel, ${T('2n+1')} is left.` },
      { op: 'subtract<br>2 × your<br>number', e: '1', w: '2n+1-2n=1', v: () => 1, tag: 'like terms', cap: () => `Subtract ${T('2n')}: ${T('2n+1-2n=1')}.` }
    ],
    end: `Machine C always gives <b>1</b>. Challenge: build a machine that always gives <b>10</b>!`
  }
};
const machines = {
  title: 'Inside the machines: run them with n',
  height: 372,
  minW: 900, // drawn this wide and scaled to fit beside the sidebar
  value: 'A',
  choices: [{ sep: 'Warm-up check:' }, { v: 'A', label: 'Machine A' }, { v: 'B', label: 'Machine B' }, { sep: 'Follow-up:' }, { v: 'C', label: 'Machine C' }],
  intro: (v) => `${MACH[v].name}: why does it always give the same answer? Call your number ${T('n')} and simplify after every step.`,
  make(stage, v, ex) {
    const W = ex.W, d = MACH[v], n = d.n, st = d.st, k = st.length + 1, gx = 108, gap = 30;
    const bw = Math.min(150, (W - gx - 16 - gap * (k - 1)) / k), bh = 78, by = 22;
    const svg = add(stage, svgEl('svg', { class: 'u3l7-svg' }), 0, 0);
    const cx = (i) => gx + i * (bw + gap) + bw / 2;
    const boxes = [...st, { op: 'OUT' }].map((s, i) => {
      const e = add(stage, h('div', 'u3l7-mbox' + (i === 0 ? ' io' : i === k - 1 ? ' io out' : ''), s.op), gx + i * (bw + gap), by); box(e, bw, bh);
      if (i) { const x1 = gx + i * (bw + gap) - gap + 3, x2 = gx + i * (bw + gap) - 4, y = by + bh / 2; svg.appendChild(svgEl('path', { d: `M ${x1} ${y} H ${x2 - 6}`, class: 'u3l7-marr' })); svg.appendChild(svgEl('path', { d: `M ${x2 - 9} ${y - 6} L ${x2} ${y} L ${x2 - 9} ${y + 6} Z`, class: 'u3l7-marrh' })); }
      return e;
    });
    const tag = add(stage, h('div', 'u3l7-mname', d.name.replace(' (follow-up)', '')), 10, by + bh / 2); tag.style.translate = '0 -50%';
    add(stage, h('div', 'u3l7-mrow', 'algebra'), 10, 156);
    add(stage, h('div', 'u3l7-mrow red', `try ${n}`), 10, 200);
    const tags = st.map((s, i) => { const e = add(stage, h('div', 'u3l7-mtag c', s.tag || ''), cx(i), 118); e.style.opacity = 0; return e; });
    const alg = st.map((s, i) => { const e = add(stage, h('div', 'u3l7-malg c', T(s.e)), cx(i), 156); e.style.opacity = 0; return e; });
    const nums = st.map((s, i) => { const val = s.v(n); const e = add(stage, h('div', 'u3l7-mnum c', typeof val === 'number' ? fmt(val).replace('-', '−') : val.replace(/-/g, '−')), cx(i), 200); e.style.opacity = 0; return e; });
    const outA = add(stage, h('div', 'u3l7-malg c u3l7-fin', T(st[st.length - 1].e)), cx(k - 1), 156), outN = add(stage, h('div', 'u3l7-mnum c', String(st[st.length - 1].v(n)).replace('-', '−')), cx(k - 1), 200); hide(outA, outN);
    const work = add(stage, h('div', 'u3l7-line c'), W / 2 + 40, 262); work.style.opacity = 0;
    const fin = add(stage, h('div', 'u3l7-box ok c'), W / 2 + 40, 328); fin.style.opacity = 0;
    const steps = st.map((s, i) => ({
      cap: s.cap(n),
      run: async (c) => {
        boxes.forEach((b, j) => b.classList.toggle('on', j === i));
        work.innerHTML = T(s.w);
        await Promise.all([c.fadeIn(alg[i], 350), c.fadeIn(nums[i], 350, { delay: 150 }), s.tag ? c.pop(tags[i], 360, { delay: 250 }) : null, c.fadeIn(work, 300)]);
      }
    }));
    steps.push({
      cap: d.end,
      run: async (c) => {
        boxes.forEach((b, j) => b.classList.toggle('on', j === k - 1));
        fin.innerHTML = v === 'B' ? `envelope: ${T('-25')} for every ${T('n')}` : `OUT: ${T('1')} for every ${T('n')}`;
        await Promise.all([c.pop(outA, 380), c.pop(outN, 380, { delay: 120 }), c.pop(fin, 420, { delay: 250 })]);
      }
    });
    return steps;
  }
};

/* ============ 1. Zero pairs: adding and subtracting with tiles (from Math 10C 3.6) ============ */
const ZP = {
  a1: { A: '2x^2+3x-4', B: 'x^2-5x+1', op: 1 },
  s1: { A: '3x^2+2x-1', B: 'x^2-x+2', op: -1 },
  s2: { A: 'x^2-4x+3', B: '2x^2-x-2', op: -1 }
};
const ZX = 62, ZU = 20;
const zdim = (k) => (k === 2 ? [ZX, ZX] : k === 1 ? [ZU, ZX] : [ZU, ZU]);
const tiles = {
  title: 'Zero pairs: adding and subtracting with tiles',
  height: 400,
  minW: 860, // drawn this wide and scaled to fit beside the sidebar (the sum box sits at the right edge)
  choices: [{ v: 'a1', label: T('(2x^2+3x-4)+(x^2-5x+1)') }, { v: 's1', label: T('(3x^2+2x-1)-(x^2-x+2)') }, { v: 's2', label: T('(x^2-4x+3)-(2x^2-x-2)') }],
  intro: (v) => { const d = ZP[v]; return `${T(`(${d.A})${d.op > 0 ? '+' : '-'}(${d.B})`)} with tiles. <b>Shaded</b> tiles are positive, <b>unshaded</b> tiles are negative.`; },
  make(stage, v, ex) {
    const W = ex.W, d = ZP[v], A = P(d.A), B = P(d.B), half = W / 2, gw = half - 70, gx = [24, half + 46];
    const res = d.op > 0 ? addP(A, B) : sub(A, B);
    const grps = gx.map((x) => { const e = add(stage, h('div', 'u3l7-grp'), x, 64); box(e, gw, 100); e.style.opacity = 0; return e; });
    const labs = [d.A, d.B].map((s, i) => { const e = add(stage, h('div', 'u3l7-mid c', T(`(${s})`)), gx[i] + gw / 2, 36); e.style.opacity = 0; return e; });
    const op = add(stage, h('div', 'u3l7-op c', d.op > 0 ? '+' : '−'), half + 11, 114); op.style.opacity = 0;
    const lay = (list, x0) => { const ws = list.map((t) => zdim(t.k)[0]); const tot = ws.reduce((a, b) => a + b, 0) + 7 * (list.length - 1); let x = x0 + gw / 2 - tot / 2; return list.map((t) => { const [w, hh] = zdim(t.k); const r = [x, 152 - hh]; x += w + 7; return r; }); };
    const tl = [A, B].map((p, g) => { const L = tileList(p), pos = lay(L, gx[g]); return L.map((t, i) => { t.g = g; t.el = mkTile(stage, t.k, t.neg, pos[i][0], pos[i][1], ...zdim(t.k)); t.el.style.opacity = 0; return t; }); });
    const rowTop = { 2: 192, 1: 272, 0: 356 }, rowC = { 2: 223, 1: 303, 0: 366 };
    const rowLab = [2, 1, 0].map((k) => { const e = add(stage, h('div', 'u3l7-rowlab c', T(k === 2 ? 'x^2' : k === 1 ? 'x' : '1')), 44, rowC[k]); e.style.opacity = 0; return { k, e }; });
    const rowRes = {}; [2, 1, 0].forEach((k) => { rowRes[k] = add(stage, h('div', 'u3l7-rowres'), 470, rowC[k]); rowRes[k].style.opacity = 0; });
    const fin = add(stage, h('div', 'u3l7-box ok'), W - 26, 290); fin.style.translate = '-100% -50%'; fin.style.opacity = 0;
    const slot = (k, i) => 84 + i * (zdim(k)[0] + 8);
    const rows = () => { const r = { 2: [], 1: [], 0: [] }; [...tl[0], ...tl[1]].forEach((t) => r[t.k].push(t)); [2, 1, 0].forEach((k) => r[k].sort((a, b) => a.neg - b.neg)); return r; };
    const steps = [{
      cap: `First bracket: ${T(d.A)}. Shaded tiles are <b>positive</b>, unshaded tiles are <b>negative</b>.`,
      run: (c) => Promise.all([show(c, grps[0]), c.fadeIn(labs[0]), ...tl[0].map((t, i) => c.pop(t.el, 320, { delay: 150 + i * 60 }))])
    }, {
      cap: d.op > 0 ? `<b>Add</b> the second bracket: ${T(d.B)}.` : `<b>Subtract</b> the second bracket: ${T(d.B)}.`,
      run: (c) => Promise.all([show(c, grps[1]), c.fadeIn(labs[1]), c.pop(op), ...tl[1].map((t, i) => c.pop(t.el, 320, { delay: 150 + i * 60 }))])
    }];
    if (d.op < 0) steps.push({
      cap: `Subtracting means <b>adding the opposite</b>: flip <b>every</b> tile in the second bracket, shaded ↔ unshaded. ${T(`-(${d.B})=${rawTex(neg(B))}`)}.`,
      run: async (c) => {
        op.textContent = '+'; labs[1].innerHTML = T(`(${rawTex(neg(B))})`);
        await Promise.all([pulse(c, op), flash(c, labs[1]), ...tl[1].map(async (t, i) => {
          await c.anim(t.el, [{ transform: 'scaleX(1)' }, { transform: 'scaleX(0)' }], 170, { delay: i * 70 });
          t.neg = !t.neg; t.el.classList.toggle('neg', t.neg);
          await c.anim(t.el, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], 170);
        })]);
      }
    });
    steps.push({
      cap: `Gather <b>like tiles</b> into rows: ${T('x^2')}-tiles together, ${T('x')}-tiles together, unit tiles together.`,
      run: async (c) => {
        const r = rows(), jobs = [];
        [2, 1, 0].forEach((k) => r[k].forEach((t, i) => jobs.push(moveTo(c, t.el, slot(k, i), rowTop[k], 750, { delay: i * 40 }))));
        jobs.push(...grps.map((g) => c.anim(g, [{ opacity: 1 }, { opacity: 0 }], 400)), c.anim(op, [{ opacity: 1 }, { opacity: 0 }], 400), ...rowLab.map((o) => show(c, o.e, 400, { delay: 300 })));
        await Promise.all(jobs);
      }
    });
    const zp = (() => { let n = 0; const r = { 2: [0, 0], 1: [0, 0], 0: [0, 0] }; [...tileList(A), ...tileList(d.op > 0 ? B : neg(B))].forEach((t) => r[t.k][t.neg ? 1 : 0]++); [2, 1, 0].forEach((k) => (n += Math.min(...r[k]))); return n; })();
    if (zp) steps.push({
      cap: `One shaded and one unshaded tile of the <b>same kind</b> make a <b>zero pair</b>: together they are worth 0. ${zp > 2 ? `Remove all ${NUM[zp] || zp} zero pairs` : zp === 2 ? 'Remove both zero pairs' : 'Remove the zero pair'}.`,
      run: async (c) => {
        const r = rows(), jobs = [];
        [2, 1, 0].forEach((k) => {
          const ps = r[k].filter((t) => !t.neg), ns = r[k].filter((t) => t.neg), m = Math.min(ps.length, ns.length);
          for (let j = 0; j < m; j++) {
            const a = ps[ps.length - 1 - j], b = ns[j], mx = (parseFloat(a.el.style.left) + parseFloat(b.el.style.left)) / 2;
            [a, b].forEach((t) => { t.dead = true; jobs.push(c.anim(t.el, [{ left: t.el.style.left, opacity: 1, transform: 'scale(1)' }, { left: mx + 'px', opacity: 1, transform: 'scale(1)', offset: 0.55 }, { left: mx + 'px', opacity: 0, transform: 'scale(.5)' }], 900, { delay: j * 160 })); });
          }
        });
        await Promise.all(jobs);
        const r2 = rows(), jobs2 = [];
        [2, 1, 0].forEach((k) => r2[k].filter((t) => !t.dead).forEach((t, i) => jobs2.push(moveTo(c, t.el, slot(k, i), rowTop[k], 450))));
        await Promise.all(jobs2);
      }
    });
    steps.push({
      cap: `Read what’s left, row by row: ${T(`(${d.A})${d.op > 0 ? '+' : '-'}(${d.B})=${ptex(res)}`)}.`,
      run: async (c) => {
        const r = rows(), jobs = [];
        [2, 1, 0].forEach((k) => { const live = r[k].filter((t) => !t.dead), cnt = live.filter((t) => !t.neg).length - live.filter((t) => t.neg).length; rowRes[k].innerHTML = cnt ? T(termTex({ c: cnt, e: k ? { x: k } : {} }, true)) : `${T('0')} <span class="u3l7-sm">all cancelled</span>`; jobs.push(c.fadeIn(rowRes[k], 350, { delay: (2 - k) * 150 })); });
        fin.innerHTML = `<small>${d.op > 0 ? 'sum' : 'difference'}</small>${T(ptex(res))}`; jobs.push(c.pop(fin, 420, { delay: 500 }));
        await Promise.all(jobs);
      }
    });
    return steps;
  }
};

/* ============ 1–2. Expand each group, then sort like terms into buckets ============ */
const GRP = {
  a: { g: [{ m: '1', p: '5x^2+4x-3' }, { m: '-1', p: '2x^2-x+6' }] },
  e1a: { flat: '8x^2-3x+5-2x^2+9x-11', end: '<b>Example 1(a).</b>' },
  e1b: { g: [{ m: '1', p: '7x^2+2x-6' }, { m: '-1', p: '3x^2-5x+4' }], end: '<b>Example 1(b).</b>' },
  e2b: { g: [{ m: '3x', p: 'x+4' }, { m: '-2x', p: 'x-6' }], end: '<b>Example 2(b).</b>' },
  c1: { g: [{ m: '4x', p: 'x+3' }, { m: '-1', prod: ['x-5', 'x+2'] }], end: '<b>Challenge 1.</b>' },
  c2: { g: [{ m: '1', prod: ['2x-3', '2x-3'], sq: true }, { m: 'x', p: 'x+6' }], end: '<b>Challenge 2.</b>' }
};
const isOne = (m, s) => m.c === s && !Object.keys(m.e).length;
function gTex(g, first) {
  const m = P(g.m)[0], body = g.prod ? (g.sq ? `(${g.prod[0]})^2` : `(${g.prod[0]})(${g.prod[1]})`) : `(${g.p})`;
  if (isOne(m, 1)) return (first ? '' : '+') + body;
  if (isOne(m, -1)) return '-' + body;
  return termTex(m, first) + body;
}
function gTerms(g) { const m = P(g.m)[0]; const inner = g.prod ? sortP(mul(P(g.prod[0]), P(g.prod[1]))) : P(g.p); return inner.map((t) => mulT(m, t)); }
const collectEx = {
  title: 'Expand each group, then collect like terms',
  height: 412,
  minW: 860, // drawn this wide and scaled to fit beside the sidebar
  value: 'a',
  choices: [{ v: 'a', label: T('(5x^2+4x-3)-(2x^2-x+6)') }, { sep: 'Example 1 check:' }, { v: 'e1a', label: '(a)' }, { v: 'e1b', label: '(b)' }, { sep: 'Example 2 check:' }, { v: 'e2b', label: '(b)' }, { sep: 'Challenge check:' }, { v: 'c1', label: '1' }, { v: 'c2', label: '2' }],
  intro: (v) => { const d = GRP[v]; const expr = d.flat || d.g.map((g, i) => gTex(g, i === 0)).join(''); return `Simplify ${T(expr)}. Colours mark <b>like terms</b>: ${T('x^2')} teal, ${T('x')} amber, numbers blue.`; },
  make(stage, v, ex) {
    const W = ex.W, d = GRP[v], G = d.flat ? [{ flat: d.flat }] : d.g, expr = d.flat || G.map((g, i) => gTex(g, i === 0)).join('');
    add(stage, h('div', 'u3l7-line c', T(expr)), W / 2, 32);
    const gy = [96, 150], cx0 = 380;
    const rows = G.map((g, i) => {
      if (g.flat) {
        const terms = P(g.flat), chips = terms.map((t, j) => add(stage, h('div', 'u3l7-chip ' + kc(t), T(termTex(t, j === 0))), 0, gy[0] + 20));
        const xs = spread(chips, W / 2, 16); chips.forEach((e, j) => { at(e, xs[j], gy[0] + 20); e.style.translate = '-50% -50%'; e.style.opacity = 0; });
        return { terms, chips, lab: null, arr: null };
      }
      const lab = add(stage, h('div', 'u3l7-gl', T(gTex(g, i === 0))), 26, gy[i]); lab.style.opacity = 0;
      const arr = add(stage, h('div', 'u3l7-arrow', '→'), cx0 - 34, gy[i]); arr.style.opacity = 0;
      const terms = gTerms(g); let x = cx0;
      const chips = terms.map((t, j) => { const e = add(stage, h('div', 'u3l7-chip ' + kc(t), T(termTex(t, j === 0 && i === 0))), x, gy[i]); x += (e.offsetWidth || 60) + 10; e.style.opacity = 0; return e; });
      return { lab, arr, terms, chips };
    });
    const all = rows.flatMap((r) => r.terms.map((t, j) => ({ t, src: r.chips[j] })));
    const kinds = [...new Set(all.map((o) => deg(o.t)))].sort((a, b) => b - a);
    const bw = (W - 40 - 16 * (kinds.length - 1)) / kinds.length, by = 198;
    const buckets = kinds.map((k, i) => {
      const e = add(stage, h('div', 'u3l7-bucket', `<div class="u3l7-bh">${k === 0 ? 'numbers' : k === 1 ? T('x') + ' terms' : T('x^' + k) + ' terms'}</div>`), 20 + i * (bw + 16), by); box(e, bw, 128); e.style.opacity = 0;
      const items = all.filter((o) => deg(o.t) === k), sumT = items.reduce((s, o) => s + o.t.c, 0), sumTerm = { c: sumT, e: items[0].t.e };
      const sumLine = add(stage, h('div', 'u3l7-bsum c', T(items.length > 1 ? rawTex(items.map((o) => o.t)) + '=' + (sumT ? termTex(sumTerm, true) : '0') : termTex(sumTerm, true))), 20 + i * (bw + 16) + bw / 2, by + 98); sumLine.style.opacity = 0;
      return { k, e, x: 20 + i * (bw + 16), items, sumLine };
    });
    const res = addP(...rows.map((r) => r.terms)), resT = ptex(res);
    const fin = add(stage, h('div', 'u3l7-line c u3l7-fin'), W / 2, 374); fin.style.opacity = 0;
    const steps = rows.map((r, i) => {
      const g = G[i];
      let cap;
      if (g.flat) cap = `No brackets here: every term is already on its own. Each sign stays with the term <b>after</b> it.`;
      else {
        const m = P(g.m)[0];
        if (g.prod && isOne(m, 1)) cap = `${g.sq ? 'A perfect square: expand it first' : 'Expand the product first'}. ${T(`${gTex(g, true)}=${rawTex(r.terms)}`)}${g.sq ? `: the middle term is ${T('2ab')}, don’t lose it` : ''}.`;
        else if (g.prod) cap = `Expand the product <b>first</b>, keeping it in brackets: ${T(`(${g.prod[0]})(${g.prod[1]})=${ptex(mul(P(g.prod[0]), P(g.prod[1])))}`)}. Then the minus flips <b>every</b> sign: ${T(rawTex(r.terms))}.`;
        else if (isOne(m, 1)) cap = `${i ? 'A <b>+</b> in front' : 'Nothing in front'}: the brackets just drop. ${T(rawTex(r.terms))}.`;
        else if (isOne(m, -1)) { const inner = P(g.p), wrong = [r.terms[0], ...inner.slice(1)]; cap = `A <b>minus</b> in front means “add the opposite”: <b>every</b> sign inside flips. ${T(`-(${g.p})=${rawTex(r.terms)}`)}, not ${T(rawTex(wrong))}.`; }
        else cap = `Distribute ${T(termTex(m, true))} to each term inside: ${P(g.p).map((t, j) => T(`${fac(m)}\\cdot ${fac(t)}=${termTex(r.terms[j], true)}`)).join(', ')}.${m.c < 0 && P(g.p).some((t) => t.c < 0) ? ' Negative × negative = positive.' : ''}`;
      }
      return { cap, run: (c) => Promise.all([r.lab ? c.fadeIn(r.lab, 300) : null, r.arr ? show(c, r.arr, 300) : null, ...r.chips.map((e, j) => (g.flat ? show(c, e, 300, { delay: j * 110 }) : c.pop(e, 340, { delay: 200 + j * 120 })))]) };
    });
    steps.push({
      cap: `Now collect <b>like terms</b>: same variable, same exponent, same colour, same bucket. Add each bucket’s coefficients.`,
      run: async (c) => {
        const jobs = [];
        buckets.forEach((b, bi) => {
          jobs.push(show(c, b.e, 300));
          const clones = b.items.map((o, j) => { const e = add(stage, h('div', 'u3l7-chip ' + kc(o.t), T(termTex(o.t, j === 0))), parseFloat(o.src.style.left), parseFloat(o.src.style.top)); if (o.src.style.translate) e.style.translate = o.src.style.translate; return e; });
          const ws = clones.map((e) => e.offsetWidth || 60), tot = ws.reduce((s, w) => s + w, 0) + 8 * (clones.length - 1); let x = b.x + bw / 2 - tot / 2;
          clones.forEach((e, j) => { const tx = e.style.translate ? x + ws[j] / 2 : x; jobs.push(moveTo(c, e, tx, by + 56, 750, { delay: 150 + bi * 120 + j * 90 })); x += ws[j] + 8; });
          jobs.push(c.fadeIn(b.sumLine, 350, { delay: 900 + bi * 120 }));
        });
        rows.forEach((r) => r.chips.forEach((e) => jobs.push(c.anim(e, [{ opacity: 1 }, { opacity: 0.35 }], 400))));
        await Promise.all(jobs);
      }
    });
    const cancel = d.g && d.g.some((g) => g.prod && !g.sq) ? ' Bracket the whole product, then subtract <b>all</b> of it.' : '';
    steps.push({
      cap: `${T(expr + '=' + resT)}.${d.end ? ' ' + d.end : ''}${cancel}`,
      run: (c) => { fin.innerHTML = T('=' + resT); return c.pop(fin, 420); }
    });
    return steps;
  }
};

/* ============ 2. A monomial times every term ============ */
const DST = {
  a: [{ m: '2x', p: '3x+5' }],
  b: [{ m: '-2x', p: 'x^2-5x+3' }],
  e2a: [{ m: '-4x', p: '3x^2-2x+5' }],
  e2b: [{ m: '3x', p: 'x+4' }, { m: '-2x', p: 'x-6' }]
};
const dTex = (g, first) => `${termTex(P(g.m)[0], first)}(${g.p})`;
const dist = {
  title: 'A monomial times every term',
  height: 404,
  minW: 860, // drawn this wide and scaled to fit beside the sidebar
  choices: [{ v: 'a', label: T('2x(3x+5)') }, { v: 'b', label: T('-2x(x^2-5x+3)') }, { sep: 'Example 2 check:' }, { v: 'e2a', label: '(a)' }, { v: 'e2b', label: '(b)' }],
  intro: (v) => `Expand ${T(DST[v].map((g, i) => dTex(g, i === 0)).join(''))}: the monomial reaches <b>every</b> term inside the brackets.`,
  make(stage, v, ex) {
    const W = ex.W, G = DST[v], one = G.length === 1, ys = one ? [130] : [84, 234], dy = one ? 84 : 64;
    const svg = add(stage, svgEl('svg', { class: 'u3l7-svg' }), 0, 0);
    const work = add(stage, h('div', 'u3l7-mid c'), W / 2, one ? 330 : 356); work.style.opacity = 0;
    const steps = [], allProds = [];
    const rows = G.map((g, gi) => {
      const M = P(g.m)[0], B = P(g.p), y = ys[gi];
      const mono = add(stage, h('div', 'u3l7-ft c u3l7-mono', T(termTex(M, gi === 0))), 82, y);
      const lp = add(stage, h('div', 'u3l7-par c', '('), 156, y), slots = B.map((t, j) => 236 + j * 150);
      const terms = B.map((t, j) => add(stage, h('div', 'u3l7-ft c', T(plus(t, j === 0))), slots[j], y));
      const rp = add(stage, h('div', 'u3l7-par c', ')'), slots[B.length - 1] + 74, y);
      const prods = B.map((t) => mulT(M, t));
      const pch = prods.map((p, j) => { const e = add(stage, h('div', 'u3l7-chip u3l7-dprod ' + kc(p), T(termTex(p, j === 0 && gi === 0))), slots[j], y + dy); e.style.translate = '-50% -50%'; e.style.opacity = 0; return e; });
      const eqs = add(stage, h('div', 'u3l7-line c u3l7-muted', '='), 156, y + dy); eqs.style.opacity = 0;
      const arcs = B.map((t, j) => { const x1 = 82, x2 = slots[j], yy = y - 26, hh = 24 + j * 18; const p = svgEl('path', { d: `M ${x1} ${yy} Q ${(x1 + x2) / 2} ${yy - hh * 2} ${x2} ${yy}`, class: 'u3l7-arc', stroke: ['#8a58c9', '#c27a0e', '#3b78d8'][j] }); svg.appendChild(p); p.style.opacity = 0; return p; });
      [mono, lp, rp, ...terms].forEach((e) => (e.style.opacity = gi === 0 ? 1 : 0));
      return { M, B, mono, lp, rp, terms, prods, pch, arcs, eqs };
    });
    rows.forEach((r, gi) => {
      if (gi) steps.push({ cap: `The second group: ${T(dTex(G[gi], false))}. Its monomial is ${T(termTex(r.M, true))}: the minus sign belongs to it.`, run: (c) => Promise.all([r.mono, r.lp, r.rp, ...r.terms].map((e) => c.fadeIn(e, 300))) });
      r.B.forEach((t, j) => {
        const p = r.prods[j], e1 = xpow(r.M), e2 = xpow(t), vn = vname(r.M);
        const mid = e2 ? `(${r.M.c})(${t.c})\\,${vn}^{${e1}+${e2}}` : `(${r.M.c})(${t.c})\\,${vstr(r.M.e)}`;
        const line = `${fac(r.M)}\\cdot ${fac(t)}=${mid}=${termTex(p, true)}`;
        const sg = r.M.c < 0 && t.c < 0 ? ' Negative × negative = <b>positive</b>.' : r.M.c < 0 ? ' A negative monomial makes this one <b>negative</b>.' : t.c < 0 ? ' Positive × negative = <b>negative</b>.' : '';
        steps.push({
          cap: `${j ? 'Next' : 'First'} term: ${T(line)}. Coefficients <b>multiply</b>${e2 ? ', exponents <b>add</b>' : ''}.${sg}`,
          run: async (c) => { work.innerHTML = T(line); allProds.push(p); r.terms[j].classList.add('hl'); await Promise.all([draw(c, r.arcs[j], 550), c.pop(r.pch[j], 380, { delay: 300 }), j ? null : c.fadeIn(r.eqs, 300), c.fadeIn(work, 300)]); r.terms[j].classList.remove('hl'); }
        });
      });
    });
    const all = rows.flatMap((r) => r.prods), res = collect(all), expr = G.map((g, i) => dTex(g, i === 0)).join('');
    if (G.length === 1) {
      steps.push({ cap: `No like terms to collect: ${T(`${expr}=${rawTex(all)}`)}.${v === 'e2a' ? ' <b>Example 2(a).</b>' : ''} ${rows[0].M.c < 0 ? 'The negative monomial flipped the sign of every term.' : ''}`, run: (c) => { work.className = 'u3l7-line c u3l7-fin'; work.innerHTML = T(`=${rawTex(all)}`); return flash(c, work); } });
    } else {
      const byK = {}; all.forEach((t) => (byK[deg(t)] = byK[deg(t)] || []).push(t));
      const parts = Object.keys(byK).sort((a, b) => b - a).map((k) => { const ts = byK[k], s = ts.reduce((a, t) => a + t.c, 0); return ts.length > 1 ? `${rawTex(ts)}=${s ? termTex({ c: s, e: ts[0].e }, true) : '0'}` : termTex(ts[0], true); });
      steps.push({ cap: `Now collect like terms: ${parts.map((s) => T(s)).join(' and ')}. ${T(`${expr}=${ptex(res)}`)}. <b>Example 2(b).</b>`, run: (c) => { work.className = 'u3l7-line c u3l7-fin'; work.innerHTML = T(`${rawTex(all)}=${ptex(res)}`); return flash(c, work); } });
    }
    return steps;
  }
};

/* ============ 3. FOIL on the area model (from Math 10C 3.6) ============ */
const FO = { a: ['x+3', 'x+5'], b: ['2x-1', 'x+4'], e3a: ['x+5', 'x-3'], e3b: ['3x-4', '2x+1'], e4a: ['4x+3', '4x-3'], wB: ['n+5', 'n-5'] };
const FOTAG = { e3a: '<b>Example 3(a).</b>', e3b: '<b>Example 3(b).</b>', e4a: '<b>Example 4(a).</b>', wB: 'That’s Machine B’s multiply step.' };
const FCOL = { F: '#8a58c9', O: '#c27a0e', I: '#3b78d8', L: '#13807a' };
const FNAME = { F: 'First', O: 'Outer', I: 'Inner', L: 'Last' };
const foil = {
  title: 'FOIL is the area model in disguise',
  height: 410,
  choices: [{ v: 'a', label: T('(x+3)(x+5)') }, { v: 'b', label: T('(2x-1)(x+4)') }, { sep: 'Example 3 check:' }, { v: 'e3a', label: '(a)' }, { v: 'e3b', label: '(b)' }, { sep: 'Example 4(a) check:' }, { v: 'e4a', label: T('(4x+3)(4x-3)') }, { sep: 'Warm-up check:' }, { v: 'wB', label: 'Machine B' }],
  intro: (v) => `Expand ${T(`(${FO[v][0]})(${FO[v][1]})`)}: every term in the first bracket multiplies every term in the second.`,
  make(stage, v, ex) {
    const W = ex.W, [sa, sb] = FO[v], A = P(sa), B = P(sb), cx = W * 0.25, ey = 150;
    const mk = (cls, html) => add(stage, h('div', cls + ' c', html), 0, ey);
    const parts = [mk('u3l7-par', '('), mk('u3l7-ft', T(plus(A[0], true))), mk('u3l7-ft', T(plus(A[1], false))), mk('u3l7-par', ')'), mk('u3l7-par', '('), mk('u3l7-ft', T(plus(B[0], true))), mk('u3l7-ft', T(plus(B[1], false))), mk('u3l7-par', ')')];
    const xs = spread(parts, cx, 3); parts.forEach((e, i) => at(e, xs[i], ey));
    const tx = { a0: xs[1], a1: xs[2], b0: xs[5], b1: xs[6] };
    const svg = add(stage, svgEl('svg', { class: 'u3l7-svg' }), 0, 0);
    const arc = (x1, x2, up, hh, col, L) => {
      const y = up ? ey - 28 : ey + 28, my = up ? y - hh : y + hh;
      const p = svgEl('path', { d: `M ${x1} ${y} Q ${(x1 + x2) / 2} ${my} ${x2} ${y}`, class: 'u3l7-arc', stroke: col }); svg.appendChild(p); p.style.opacity = 0;
      const dot = add(stage, h('div', 'u3l7-dot c', L), (x1 + x2) / 2, (y + my) / 2); dot.style.background = col; dot.style.opacity = 0;
      return { p, dot };
    };
    const prods = { F: mulT(A[0], B[0]), O: mulT(A[0], B[1]), I: mulT(A[1], B[0]), L: mulT(A[1], B[1]) };
    const pair = { F: [A[0], B[0]], O: [A[0], B[1]], I: [A[1], B[0]], L: [A[1], B[1]] };
    const arcs = { F: arc(tx.a0, tx.b0, true, 50, FCOL.F, 'F'), O: arc(tx.a0, tx.b1, true, 100, FCOL.O, 'O'), I: arc(tx.a1, tx.b0, false, 50, FCOL.I, 'I'), L: arc(tx.a1, tx.b1, false, 100, FCOL.L, 'L') };
    // area model
    const gx = W * 0.57, gy = 96, cw = [150, 124], rh = [92, 76];
    const cell = { F: [0, 0], O: [0, 1], I: [1, 0], L: [1, 1] }, cells = {};
    const ccx = (j) => gx + (j ? cw[0] : 0), ccy = (i) => gy + (i ? rh[0] : 0);
    for (const k in cell) { const [i, j] = cell[k]; const e = add(stage, h('div', 'u3l7-cell'), ccx(j), ccy(i)); box(e, cw[j] + 2, rh[i] + 2); e.style.opacity = 0; cells[k] = e; }
    const glab = [[B[0], gx + cw[0] / 2, gy - 22, true], [B[1], gx + cw[0] + cw[1] / 2, gy - 22, false], [A[0], gx - 34, gy + rh[0] / 2, true], [A[1], gx - 34, gy + rh[0] + rh[1] / 2, false]].map(([t, x, yy, f]) => { const e = add(stage, h('div', 'u3l7-glab c', T(termTex(t, f))), x, yy); e.style.opacity = 0; return e; });
    const head = add(stage, h('div', 'u3l7-head c', 'area model'), gx + (cw[0] + cw[1]) / 2, gy + rh[0] + rh[1] + 26); head.style.opacity = 0;
    const L1 = add(stage, h('div', 'u3l7-line c'), cx, 300), L2 = add(stage, h('div', 'u3l7-line c u3l7-fin'), cx, 356); hide(L1, L2);
    const done = [];
    const steps = [{
      cap: `Two terms × two terms = <b>4 partial products</b>. The area model gives each one its own box: rows ${T(sa)}, columns ${T(sb)}.`,
      run: (c) => Promise.all([...Object.values(cells).map((e, i) => show(c, e, 300, { delay: i * 60 })), ...glab.map((e) => c.fadeIn(e, 350, { delay: 250 })), show(c, head, 300)])
    }];
    ['F', 'O', 'I', 'L'].forEach((k) => {
      const [p, q] = pair[k], r = prods[k], sg = p.c < 0 && q.c < 0 ? ' (− × − = +)' : p.c < 0 ? ' (− × + = −)' : q.c < 0 ? ' (+ × − = −)' : '';
      steps.push({
        cap: `<b>${FNAME[k]}</b>: ${T(fac(p) + '\\cdot ' + fac(q) + '=' + termTex(r, true))}${sg}.`,
        run: async (c) => {
          done.push(r); const e = cells[k]; e.innerHTML = T(termTex(r, true)); e.classList.add('f' + k);
          L1.innerHTML = T('=' + rawTex(done));
          await Promise.all([draw(c, arcs[k].p, 550), c.pop(arcs[k].dot, 360, { delay: 300 }), c.pop(e, 380, { delay: 250 }), show(c, L1, 250)]);
        }
      });
    });
    const s = prods.O.c + prods.I.c, res = mul(A, B), resT = ptex(res);
    const tag = FOTAG[v] ? ' ' + FOTAG[v] : '';
    steps.push({
      cap: s === 0 ? `The Outer and Inner products are <b>opposites</b>, ${T(termTex(prods.O, true) + termTex(prods.I, false) + '=0')}: they cancel! Only ${T(resT)} is left: a <b>difference of squares</b>.${tag}`
        : `<b>O</b> and <b>I</b> are like terms: ${T(termTex(prods.O, true) + termTex(prods.I, false) + '=' + termTex({ c: s, e: prods.O.e }, true))}. So ${T(`(${sa})(${sb})=${resT}`)}.${tag}`,
      run: async (c) => {
        L2.innerHTML = T('=' + resT);
        await Promise.all([pulse(c, cells.O, 1.08), pulse(c, cells.I, 1.08), c.fadeIn(L2, 450, { delay: 200 })]);
        if (s === 0) { cells.O.classList.add('gone'); cells.I.classList.add('gone'); await Promise.all([cells.O, cells.I].map((e) => c.anim(e, [{ opacity: 1 }, { opacity: 0.35 }], 400))); }
      }
    });
    return steps;
  }
};

/* ============ 4. The square of a binomial (from Math 10C 3.6) ============ */
const SQ = {
  a: { a: 'x', b: '3', aL: 176, bL: 84 },
  b: { a: 'x', b: '-4', aL: 176, bL: 96 },
  e4b: { a: '5x', b: '-2', aL: 196, bL: 88, tag: '<b>Example 4(b).</b>' }
};
const square = {
  title: 'The square of a binomial: four pieces, not two',
  height: 420,
  minW: 900, // drawn this wide and scaled to fit beside the sidebar
  choices: [{ v: 'a', label: T('(x+3)^2') }, { v: 'b', label: T('(x-4)^2') }, { sep: 'Example 4(b) check:' }, { v: 'e4b', label: T('(5x-2)^2') }],
  intro: (v) => `What is ${T(`(${SQ[v].a}${SQ[v].b.startsWith('-') ? '' : '+'}${SQ[v].b})^2`)}? Draw it as a square.`,
  make(stage, v, ex) {
    const d = SQ[v], a = P(d.a)[0], b = P(d.b)[0], aL = d.aL, bL = d.bL, S = aL + bL, sx = 100, sy = 62;
    const bin = d.a + termTex(b, false), sq = `(${bin})^2`;
    const aa = mulT(a, a), ab = mulT(a, b), bb = mulT(b, b), full = mul([a, b], [a, b]);
    const pc = (x, y, w, hh, cls, t) => { const e = add(stage, h('div', 'u3l7-pc ' + cls, T(termTex(t, true))), x, y); box(e, w, hh); e.style.opacity = 0; return e; };
    const P2 = pc(sx, sy, aL, aL, 'p2', aa), Pa = pc(sx + aL, sy, bL, aL, ab.c < 0 ? 'pn' : 'p1', ab), Pb = pc(sx, sy + aL, aL, bL, ab.c < 0 ? 'pn' : 'p1', ab), P0 = pc(sx + aL, sy + aL, bL, bL, 'p0', bb);
    const out = add(stage, h('div', 'u3l7-sqo'), sx - 1, sy - 1); box(out, S + 2, S + 2); out.style.opacity = 0;
    const labs = [[d.a, sx + aL / 2, sy - 22], [termTex(b, false), sx + aL + bL / 2, sy - 22], [d.a, sx - 28, sy + aL / 2], [termTex(b, false), sx - 28, sy + aL + bL / 2]].map(([t, x, y]) => { const e = add(stage, h('div', 'u3l7-lab c', T(t)), x, y); e.style.opacity = 0; return e; });
    const rx = 480, L = [0, 1, 2].map((j) => { const e = add(stage, h('div', 'u3l7-line l' + (j === 2 ? ' u3l7-fin' : '')), rx, 84 + j * 62); e.style.opacity = 0; return e; });
    const trap = add(stage, h('div', 'u3l7-box bad'), rx, 300); trap.style.translate = '0 -50%'; trap.style.opacity = 0;
    const sum = [aa, ab, ab, bb];
    return [{
      cap: `${T(sq)} means ${T(`(${bin})(${bin})`)}: the area of a <b>square</b> with side ${T(bin)}.${b.c < 0 ? ' (With a negative term, read the picture as an area-model grid.)' : ''}`,
      run: (c) => { L[0].innerHTML = T(`${sq}=(${bin})(${bin})`); return Promise.all([show(c, out, 400), ...labs.map((e, i) => c.fadeIn(e, 300, { delay: i * 80 })), c.fadeIn(L[0], 400, { delay: 200 })]); }
    }, {
      cap: `${T(fac(a) + '\\cdot ' + fac(a) + '=' + termTex(aa, true))}: the big square.`,
      run: (c) => { L[1].innerHTML = T('=' + rawTex(sum.slice(0, 1))); return Promise.all([c.pop(P2, 420), c.fadeIn(L[1], 300)]); }
    }, {
      cap: `${T(fac(a) + '\\cdot ' + fac(b) + '=' + termTex(ab, true))}, and there are <b>two</b> of these rectangles, one on each side.${ab.c < 0 ? ' Both are negative.' : ''}`,
      run: (c) => { L[1].innerHTML = T('=' + rawTex(sum.slice(0, 3))); return Promise.all([c.pop(Pa, 420), c.pop(Pb, 420, { delay: 200 }), flash(c, L[1])]); }
    }, {
      cap: `${T(fac(b) + '\\cdot ' + fac(b) + '=' + termTex(bb, true))}${b.c < 0 ? ' (negative × negative = positive)' : ''}: the small square.`,
      run: (c) => { L[1].innerHTML = T('=' + rawTex(sum)); return Promise.all([c.pop(P0, 420), flash(c, L[1])]); }
    }, {
      cap: `Collect the two middle rectangles: ${T(sq + '=' + ptex(full))}. The middle term is <b>2 × first × last</b>.${d.tag ? ' ' + d.tag : ''}`,
      run: (c) => { L[2].innerHTML = T('=' + ptex(full)); return Promise.all([pulse(c, Pa, 1.06), pulse(c, Pb, 1.06), c.fadeIn(L[2], 400)]); }
    }, {
      cap: `<b>The classic error</b> writes ${T(sq + '=' + termTex(aa, true) + termTex(bb, false))}: only the two squares. Both ${T(termTex(ab, true))} rectangles go <b>missing</b>.`,
      run: async (c) => { Pa.classList.add('miss'); Pb.classList.add('miss'); trap.innerHTML = `${T(sq + '\\neq ' + termTex(aa, true) + termTex(bb, false))} ✗`; await Promise.all([c.shake(Pa), c.shake(Pb), c.pop(trap, 400)]); }
    }];
  }
};

/* ============ 4. Which pattern? ============ */
const PAT = {
  d1: { A: 'x+7', B: 'x-7' },
  s1: { A: '2x+5', sq: true },
  n1: { A: 'x+3', B: 'x-5' },
  e4a: { A: '4x+3', B: '4x-3', tag: '<b>Example 4(a).</b>' },
  e4b: { A: '5x-2', sq: true, tag: '<b>Example 4(b).</b>' }
};
const PCARDS = [
  { k: 'dos', n: 'Difference of squares', f: '(a+b)(a-b)=a^2-b^2' },
  { k: 'sum', n: 'Perfect square (sum)', f: '(a+b)^2=a^2+2ab+b^2' },
  { k: 'dif', n: 'Perfect square (difference)', f: '(a-b)^2=a^2-2ab+b^2' },
  { k: 'none', n: 'Neither', f: '\\text{just FOIL}' }
];
const patterns = {
  title: 'Which pattern is it?',
  height: 400,
  minW: 900, // drawn this wide and scaled to fit beside the sidebar
  choices: [{ v: 'd1', label: T('(x+7)(x-7)') }, { v: 's1', label: T('(2x+5)^2') }, { v: 'n1', label: T('(x+3)(x-5)') }, { sep: 'Example 4 check:' }, { v: 'e4a', label: '(a)' }, { v: 'e4b', label: '(b)' }],
  intro: (v) => { const d = PAT[v]; return `${T(d.sq ? `(${d.A})^2` : `(${d.A})(${d.B})`)}: is it a <b>special product</b>? Look before you multiply.`; },
  make(stage, v, ex) {
    const W = ex.W, d = PAT[v], A = P(d.A), B = d.sq ? A : P(d.B), expr = d.sq ? `(${d.A})^2` : `(${d.A})(${d.B})`;
    const a = A[0], b = { c: Math.abs(A[1].c), e: A[1].e }, aT = termTex(a, true), bT = termTex(b, true);
    const kind = d.sq ? (A[1].c > 0 ? 'sum' : 'dif') : (A[0].c === B[0].c && ekey(A[0].e) === ekey(B[0].e) && A[1].c === -B[1].c ? 'dos' : 'none');
    const top = add(stage, h('div', 'u3l7-big c', T(expr)), W / 2, 40);
    const cn = 120, cw = (W - 40 - 3 * 12 - cn) / 3;
    const cards = PCARDS.map((p, i) => { const e = add(stage, h('div', 'u3l7-pcard' + (p.k === 'none' ? ' none' : ''), `<div class="u3l7-pch">${p.n}</div><div class="u3l7-pcf">${T(p.f)}</div>`), 20 + i * (cw + 12), 92); box(e, p.k === 'none' ? cn : cw, 92); return e; });
    const look = add(stage, h('div', 'u3l7-mid c'), W / 2, 222); look.style.opacity = 0;
    const L = [0, 1].map((j) => { const e = add(stage, h('div', 'u3l7-line c' + (j ? ' u3l7-fin' : '')), W / 2, 280 + j * 58); e.style.opacity = 0; return e; });
    const res = mul(A, B), resT = ptex(res), tag = d.tag ? ' ' + d.tag : '';
    const ci = PCARDS.findIndex((p) => p.k === kind);
    const lookTxt = d.sq ? `the same binomial twice: ${T(`(${d.A})(${d.A})`)}` : kind === 'dos' ? `same two terms, ${T(aT)} and ${T(bT)}: one <b>+</b>, one <b>−</b>` : `second terms ${T(termTex(A[1], true))} and ${T(termTex(B[1], true))} are <b>different</b>`;
    const steps = [{
      cap: d.sq ? `A binomial with a little ${T('2')}: it’s multiplied by <b>itself</b>.` : kind === 'dos' ? `Compare the brackets: the <b>same</b> two terms, ${T(aT)} and ${T(bT)}. One bracket adds, the other subtracts.` : `Compare the brackets: the first terms match, but the second terms (${T(termTex(A[1], true))} and ${T(termTex(B[1], true))}) are <b>different</b> numbers.`,
      run: (c) => { look.innerHTML = lookTxt; return c.fadeIn(look, 350); }
    }, {
      cap: kind === 'none' ? `So it’s <b>neither</b> pattern. No shortcut: just FOIL.` : `That’s the <b>${PCARDS[ci].n.toLowerCase()}</b> pattern: ${T(PCARDS[ci].f)}.`,
      run: async (c) => { cards.forEach((e, i) => e.classList.toggle('dim', i !== ci)); cards[ci].classList.add('on'); await pulse(c, cards[ci], 1.05); }
    }];
    if (kind === 'none') {
      const fo = A.flatMap((s) => B.map((t) => mulT(s, t)));
      steps.push({ cap: `FOIL: ${T(`${expr}=${rawTex(fo)}`)}.`, run: (c) => { L[0].innerHTML = T(`${expr}=${rawTex(fo)}`); return c.fadeIn(L[0], 350); } });
      steps.push({ cap: `The middle terms don’t cancel: ${T(`${expr}=${resT}`)}. Three terms, and the last term is ${T(termTex(sortP(res)[2], true))} (not a square).`, run: (c) => { L[1].innerHTML = T('=' + resT); return c.fadeIn(L[1], 350); } });
      return steps;
    }
    const aTag = add(stage, h('div', 'u3l7-tag a', T(`a=${aT}`)), 0, 0), bTag = add(stage, h('div', 'u3l7-tag b', T(`b=${bT}`)), 0, 0); hide(aTag, bTag);
    const tw = top.offsetWidth || 200;
    at(aTag, W / 2 - tw / 2 - 120, 26); at(bTag, W / 2 + tw / 2 + 24, 26);
    steps.push({ cap: `Name the two terms: ${T(`a=${aT}`)} and ${T(`b=${bT}`)}. (${T('a')} is the whole first term, coefficient and all.)`, run: (c) => Promise.all([c.pop(aTag), c.pop(bTag, 380, { delay: 150 })]) });
    const aP = a.c === 1 ? aT : `(${aT})`, sub1 = kind === 'dos' ? `${aP}^2-${bT}^2` : `${aP}^2${kind === 'sum' ? '+' : '-'}2(${aT})(${bT})+${bT}^2`;
    steps.push({ cap: `Put them in the pattern: ${T(sub1)}. ${a.c === 1 ? '' : `Square <b>all</b> of ${T('a')}: ${T(`(${aT})^2=${termTex(mulT(a, a), true)}`)}.`}`, run: (c) => { L[0].innerHTML = T(`${expr}=${sub1}`); return c.fadeIn(L[0], 350); } });
    steps.push({
      cap: kind === 'dos' ? `${T(`${expr}=${resT}`)}. <b>No middle term</b>: just two terms, a difference of two squares.${tag}` : `${T(`${expr}=${resT}`)}. Three terms; the middle one is ${T(`2ab=2(${aT})(${bT})=${termTex(mulT(a, { c: 2 * b.c, e: b.e }), true)}`)}${kind === 'dif' ? ', with the minus' : ''}.${tag}`,
      run: (c) => { L[1].innerHTML = T('=' + resT); return c.fadeIn(L[1], 350); }
    });
    return steps;
  }
};

/* ============ 5. Binomial × trinomial on a grid (from Math 10C 3.6) ============ */
const GRD = {
  g1: { f: ['x+2', 'x^2+3x+1'] },
  e5a: { f: ['2x+3', 'x^2-4x+5'], end: '<b>Example 5(a).</b>' },
  e5b: { f: ['x-2', '3x^2+x-6'], end: '<b>Example 5(b).</b>' }
};
function buildGrid(stage, rowsP, colsP, gx, gy, cw, rh) {
  const g = { cells: [], labs: [] };
  colsP.forEach((t, j) => { const e = add(stage, h('div', 'u3l7-glab c', T(termTex(t, j === 0))), gx + j * cw + cw / 2, gy - 24); e.style.opacity = 0; g.labs.push(e); });
  rowsP.forEach((t, i) => { const e = add(stage, h('div', 'u3l7-glab c', T(termTex(t, i === 0))), gx - 38, gy + i * rh + rh / 2); e.style.opacity = 0; g.labs.push(e); });
  rowsP.forEach((r, i) => g.cells.push(colsP.map((q, j) => { const e = add(stage, h('div', 'u3l7-cell'), gx + j * cw, gy + i * rh); box(e, cw + 2, rh + 2); e.style.opacity = 0; e._p = mulT(r, q); return e; })));
  g.svg = add(stage, svgEl('svg', { class: 'u3l7-svg' }), 0, 0);
  g.frame = (c) => Promise.all([...g.cells.flat().map((e, k) => show(c, e, 250, { delay: k * 40 })), ...g.labs.map((e) => c.fadeIn(e, 300, { delay: 150 }))]);
  g.fillRow = (c, i, d0 = 0) => Promise.all(g.cells[i].map((e, j) => { e.innerHTML = T(termTex(e._p, true)); e.classList.add(kc(e._p)); return c.pop(e, 360, { delay: d0 + j * 140 }); }));
  g.diag = (c) => {
    const byDeg = {}; g.cells.forEach((row, i) => row.forEach((e, j) => { (byDeg[deg(e._p)] = byDeg[deg(e._p)] || []).push([i, j]); }));
    const jobs = [];
    Object.keys(byDeg).forEach((k) => {
      const pts = byDeg[k]; if (pts.length < 2) return;
      const col = ['#5b7fb9', '#c27a0e', '#13807a', '#8a58c9'][Math.min(3, Number(k))];
      const ln = svgEl('polyline', { points: pts.map(([i, j]) => `${gx + j * cw + cw / 2},${gy + i * rh + rh / 2}`).join(' '), fill: 'none', stroke: col, 'stroke-width': 26, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: 0.18 });
      g.svg.appendChild(ln); jobs.push(c.anim(ln, [{ opacity: 0 }, { opacity: 0.22 }], 500));
    });
    return Promise.all(jobs);
  };
  g.collectLines = () => { const byDeg = {}; g.cells.flat().forEach((e) => (byDeg[deg(e._p)] = byDeg[deg(e._p)] || []).push(e._p)); return Object.keys(byDeg).map(Number).sort((a, b) => b - a).map((k) => { const ts = byDeg[k], s = ts.reduce((a, t) => a + t.c, 0); return ts.length > 1 ? `${rawTex(ts)}=${s ? termTex({ c: s, e: ts[0].e }, true) : '0'}` : termTex(ts[0], true); }); };
  return g;
}
const grid = {
  title: 'Six partial products on a grid',
  height: 440,
  minW: 820, // drawn this wide and scaled to fit beside the sidebar
  value: 'g1',
  choices: [{ v: 'g1', label: T('(x+2)(x^2+3x+1)') }, { sep: 'Example 5 check:' }, { v: 'e5a', label: '(a)' }, { v: 'e5b', label: '(b)' }],
  intro: (v) => `Expand ${T(GRD[v].f.map((s) => `(${s})`).join(''))} on a grid: the binomial down the side, the trinomial across the top.`,
  make(stage, v, ex) {
    const W = ex.W, d = GRD[v], F = d.f.map(P), expr = d.f.map((s) => `(${s})`).join('');
    add(stage, h('div', 'u3l7-line c', T(expr)), W * 0.3, 30);
    const gx = 130, gy = 116, cw = 128, rh = 74, rx = 600;
    const L = [0, 1, 2, 3].map((j) => { const e = add(stage, h('div', 'u3l7-mid l'), rx, 92 + j * 46); e.style.opacity = 0; return e; });
    const fin = add(stage, h('div', 'u3l7-line c u3l7-fin'), W / 2, 400); fin.style.opacity = 0;
    const setLines = (c, ls) => Promise.all(L.map((e, j) => { e.innerHTML = ls[j] ? T(ls[j]) : ''; return ls[j] ? c.fadeIn(e, 300, { delay: j * 150 }) : null; }));
    const g = buildGrid(stage, F[0], F[1], gx, gy, cw, rh);
    const steps = [{ cap: `${F[0].length} terms × ${F[1].length} terms = <b>${F[0].length * F[1].length} partial products</b>: one box each.`, run: (c) => g.frame(c) }];
    F[0].forEach((r, i) => steps.push({
      cap: `Row ${T(termTex(r, true))}: times each column term gives ${g.cells[i].map((e) => T(termTex(e._p, true))).join(', ')}.${r.c < 0 ? ' A negative row flips every sign.' : ''}`,
      run: (c) => g.fillRow(c, i)
    }));
    const res = mul(F[0], F[1]);
    steps.push({ cap: `Like terms sit on the <b>diagonals</b>, same colour. Add along each one.`, run: (c) => Promise.all([g.diag(c), setLines(c, g.collectLines())]) });
    steps.push({ cap: `${T(expr + '=' + ptex(res))}.${d.end ? ' ' + d.end : ''}`, run: (c) => { fin.innerHTML = T(expr + '=' + ptex(res)); return c.pop(fin, 420); } });
    return steps;
  }
};

/* ============ 6. The expression IS the measurement ============ */
const MEA = {
  r: { kind: 'rect', L: 'x+4', Wd: 'x+3', u: 'cm', what: 'a rectangle' },
  e6a: { kind: 'rect', L: 'x+7', Wd: 'x+2', u: 'm', what: 'the garden', tag: '<b>Example 6(a).</b>' },
  e6b: { kind: 'prism', L: 'x', Wd: 'x', H: 'x+4', u: 'cm', what: 'the box', tag: '<b>Example 6(b).</b>' },
  c3: { kind: 'prism', L: 'x+2', Wd: 'x+2', H: 'x-1', u: 'cm', what: 'the prism', tag: '<b>Challenge 3.</b>' }
};
const measure = {
  title: 'The expression IS the area (or the volume)',
  height: 420,
  minW: 900, // drawn this wide and scaled to fit beside the sidebar
  value: 'r',
  choices: [{ v: 'r', label: 'a rectangle' }, { sep: 'Example 6 check:' }, { v: 'e6a', label: '(a) garden' }, { v: 'e6b', label: '(b) box' }, { sep: 'Challenge 3 check:' }, { v: 'c3', label: 'prism' }],
  intro: (v) => { const d = MEA[v]; return d.kind === 'rect' ? `${cap1(d.what)}: length ${T(`(${d.L})`)} ${d.u}, width ${T(`(${d.Wd})`)} ${d.u}. What is its area?` : `${cap1(d.what)}: a square base of side ${T(d.L.length > 1 ? `(${d.L})` : d.L)} ${d.u}, height ${T(`(${d.H})`)} ${d.u}. What is its volume?`; },
  make(stage, v, ex) {
    const W = ex.W, d = MEA[v], u = d.u, rx = 470;
    const L = [0, 1, 2, 3, 4].map((j) => { const e = add(stage, h('div', 'u3l7-mid l' + (j === 4 ? ' u3l7-fin' : '')), rx, 56 + j * 66); e.style.opacity = 0; return e; });
    const put = (c, j, s, d0 = 0) => { L[j].innerHTML = T(s); return c.fadeIn(L[j], 350, { delay: d0 }); };
    if (d.kind === 'rect') {
      const A = P(d.L), B = P(d.Wd), x0 = 90, y0 = 70, cw = [190, 40 + A[1].c * 12], rh = [150, 30 + B[1].c * 10];
      const cells = [];
      B.forEach((r, i) => A.forEach((q, j) => { const p = mulT(r, q), e = add(stage, h('div', 'u3l7-cell ' + kc(p)), x0 + (j ? cw[0] : 0), y0 + (i ? rh[0] : 0)); box(e, cw[j] + 2, rh[i] + 2); e.innerHTML = T(termTex(p, true)); e.style.opacity = 0; cells.push({ e, p }); }));
      const outl = add(stage, h('div', 'u3l7-sqo'), x0 - 1, y0 - 1); box(outl, cw[0] + cw[1] + 4, rh[0] + rh[1] + 4);
      const tl = add(stage, h('div', 'u3l7-blab c b', `length ${T(`(${d.L})`)} ${u}`), x0 + (cw[0] + cw[1]) / 2, y0 - 26);
      const wl = add(stage, h('div', 'u3l7-blab c b', `width ${T(`(${d.Wd})`)} ${u}`), x0 - 30, y0 + (rh[0] + rh[1]) / 2); wl.style.rotate = '-90deg';
      const sub = [[termTex(A[0], true), x0 + cw[0] / 2, y0 + rh[0] + rh[1] + 22], [termTex(A[1], true), x0 + cw[0] + cw[1] / 2, y0 + rh[0] + rh[1] + 22], [termTex(B[0], true), x0 + cw[0] + cw[1] + 22, y0 + rh[0] / 2], [termTex(B[1], true), x0 + cw[0] + cw[1] + 22, y0 + rh[0] + rh[1] / 2]].map(([t, x, y]) => { const e = add(stage, h('div', 'u3l7-glab c', T(t)), x, y); e.style.opacity = 0; return e; });
      const parts = B.flatMap((r) => A.map((q) => mulT(r, q))), res = mul(A, B);
      return [{
        cap: `Area of a rectangle = <b>length × width</b>. Set up the product first: ${T(`A=(${d.L})(${d.Wd})`)}.`,
        run: (c) => Promise.all([put(c, 0, `A=\\text{length}\\times\\text{width}`), put(c, 1, `A=(${d.L})(${d.Wd})`, 250)])
      }, {
        cap: `Split the rectangle like an area model: four pieces, one for each partial product.`,
        run: (c) => Promise.all([...cells.map((o, i) => c.pop(o.e, 360, { delay: i * 160 })), ...sub.map((e) => c.fadeIn(e, 300, { delay: 200 }))])
      }, {
        cap: `Add the four pieces: ${T(rawTex(parts))}.`,
        run: (c) => put(c, 2, `=${rawTex(parts)}`)
      }, {
        cap: `Collect the two ${T('x')} pieces: ${T(`A=${ptex(res)}`)} ${u}². The trinomial <b>is</b> the area. Units are <b>square</b> ${u === 'm' ? 'metres' : 'centimetres'}.${d.tag ? ' ' + d.tag : ''}`,
        run: (c) => { L[3].classList.add('u3l7-fin'); return put(c, 3, `A=${ptex(res)}\\ \\text{${u}}^2`); }
      }];
    }
    // a prism drawn in an oblique view (front, top and side faces), square base
    const svg = add(stage, svgEl('svg', { class: 'u3l7-svg' }), 0, 0);
    const bl = d.L === 'x' ? 150 : 190, bh = d.H.includes('+') ? 210 : 120, dx = bl * 0.5, dy = bl * 0.36, bx = 70, by = 70 + dy + bh;
    const g3 = svgEl('g', { class: 'u3l7-box3' }); svg.appendChild(g3);
    const pth = (pts, cls) => g3.appendChild(svgEl('path', { d: 'M ' + pts.map((p) => p.join(' ')).join(' L ') + ' Z', class: cls }));
    pth([[bx, by - bh], [bx + bl, by - bh], [bx + bl + dx, by - bh - dy], [bx + dx, by - bh - dy]], 'top');
    pth([[bx + bl, by], [bx + bl + dx, by - dy], [bx + bl + dx, by - dy - bh], [bx + bl, by - bh]], 'side');
    pth([[bx, by], [bx + bl, by], [bx + bl, by - bh], [bx, by - bh]], 'front');
    const base = svgEl('path', { d: `M ${bx} ${by} L ${bx + bl} ${by} L ${bx + bl + dx} ${by - dy}`, class: 'u3l7-base' }); svg.appendChild(base); base.style.opacity = 0;
    const lab = (s, x, y, cls) => add(stage, h('div', 'u3l7-blab c ' + cls, T(s)), x, y);
    lab(d.L, bx + bl / 2, by + 20, 'b'); lab(d.Wd, bx + bl + dx / 2 + 26, by - dy / 2 + 12, 'b'); lab(d.H, bx + bl + dx + 10 + (d.H.length > 1 ? 30 : 10), by - dy - bh / 2, 'x');
    const Lp = P(d.L), Hp = P(d.H), baseA = mul(Lp, Lp), V = mul(baseA, Hp);
    const steps = [{
      cap: `Volume of a rectangular prism = <b>length × width × height</b>. The base is a square: length and width are both ${T(d.L)}.`,
      run: (c) => Promise.all([put(c, 0, `V=\\text{length}\\times\\text{width}\\times\\text{height}`), put(c, 1, d.L === 'x' ? `V=x\\cdot x\\cdot(${d.H})` : `V=(${d.L})(${d.L})(${d.H})`, 250)])
    }];
    if (d.L === 'x') {
      steps.push({ cap: `Multiply the base first: ${T('x\\cdot x=x^2')}, the area of the square base.`, run: (c) => Promise.all([show(c, base, 400), put(c, 2, `=x^2(${d.H})`)]) });
      steps.push({ cap: `Distribute ${T('x^2')} to both terms: ${T(`x^2(${d.H})=${ptex(V)}`)}. Exponents add: ${T('x^2\\cdot x=x^3')}.`, run: (c) => put(c, 3, `=${rawTex(Hp.map((t) => mulT({ c: 1, e: { x: 2 } }, t)))}`) });
    } else {
      const bp = Lp.flatMap((s) => Lp.map((t) => mulT(s, t))), six = sortP(baseA).flatMap((s) => Hp.map((t) => mulT(s, t)));
      steps.push({ cap: `Multiply the base first. It’s a <b>perfect square</b>: ${T(`(${d.L})^2=${ptex(baseA)}`)}.`, run: (c) => Promise.all([show(c, base, 400), put(c, 2, `=(${ptex(baseA)})(${d.H})`)]) });
      steps.push({ cap: `Then times ${T(`(${d.H})`)}: a trinomial times a binomial, <b>six</b> products. ${T(rawTex(six))}.`, run: (c) => put(c, 3, `=${rawTex(six)}`) });
      void bp;
    }
    const xs = collect(sortP(baseA).flatMap((s) => Hp.map((t) => mulT(s, t)))), cancel = !xs.some((t) => deg(t) === 1) && !d.L.match(/^x$/);
    steps.push({
      cap: `${T(`V=${ptex(V)}`)} ${u}³.${cancel ? ` The ${T('x')} terms cancel (${T('-4x+4x=0')}).` : ''} Volume units are <b>cubic</b>.${d.tag ? ' ' + d.tag : ''}`,
      run: (c) => put(c, 4, `V=${ptex(V)}\\ \\text{${u}}^3`)
    });
    return steps;
  }
};

/* ============ 7. Find the slip ============ */
const STU = {
  ali: {
    name: 'Ali', lines: ['(x+4)^2', '=x^2+4^2', '=x^2+16'], right: ['(x+4)^2', '=x^2+2(x)(4)+4^2', '=x^2+8x+16'], grid: true,
    c2: `Line 2: Ali squared each term and stopped. ${T('(x+4)^2')} means ${T('(x+4)(x+4)')}: there are <b>four</b> products, and the two middle ones make ${T('2ab=8x')}.`,
    n2: `${T('(a+b)^2\\neq a^2+b^2')}: the two ${T('4x')} rectangles go missing`,
    c3: `So his answer has no ${T('8x')}. Check with ${T('x=1')}: ${T('(1+4)^2=25')}, but ${T('1+16=17')}. The right answer gives ${T('1+8+16=25')} ✓`,
    n3: `Check at ${T('x=1')}: original ${T('25')}, Ali ${T('17')} ✗, correct ${T('25')} ✓`
  },
  bea: {
    name: 'Bea', lines: ['2x(x+5)-(x+1)(x-3)', '=2x^2+10x-x^2-2x-3', '=x^2+8x-3'], right: ['2x(x+5)-(x+1)(x-3)', '=2x^2+10x-(x^2-2x-3)', '=x^2+12x+3'],
    c2: `Line 2: ${T('(x+1)(x-3)=x^2-2x-3')} is right, but Bea’s minus only reached the <b>first</b> term. Subtract <b>all</b> of it: ${T('-(x^2-2x-3)=-x^2+2x+3')}.`,
    n2: `Keep the product in brackets, then the minus flips <b>every</b> sign`,
    c3: `Her ${T('-2x')} should be ${T('+2x')} and her ${T('-3')} should be ${T('+3')}. Correct: ${T('x^2+12x+3')}. Check at ${T('x=1')}: ${T('2(6)-(2)(-2)=16')}, and ${T('1+12+3=16')} ✓`,
    n3: `Check at ${T('x=1')}: original ${T('16')}, Bea ${T('6')} ✗, correct ${T('16')} ✓`
  },
  cole: {
    name: 'Cole', lines: ['3(x-1)^2', '=(3x-3)^2', '=9x^2-18x+9'], right: ['3(x-1)^2', '=3(x^2-2x+1)', '=3x^2-6x+3'],
    c2: `Line 2: Cole multiplied the 3 into the bracket <b>before squaring</b>. The square belongs to ${T('(x-1)')} only: <b>square first</b>, then multiply by 3.`,
    n2: `${T('3(x-1)^2')} is ${T('3\\times(x-1)^2')}, not ${T('(3(x-1))^2')}`,
    c3: `His line 3 is good algebra from a wrong start: ${T('(3x-3)^2=9(x-1)^2')}, so his answer is <b>3 times too big</b>. Check at ${T('x=2')}: ${T('3(1)^2=3')}, Cole gets 9.`,
    n3: `Check at ${T('x=2')}: original ${T('3')}, Cole ${T('9')} ✗, correct ${T('12-12+3=3')} ✓`
  }
};
const slips = {
  title: 'Find the slip: Ali, Bea and Cole',
  height: 430,
  minW: 860, // drawn this wide and scaled to fit beside the sidebar
  value: 'ali',
  choices: [{ v: 'ali', label: 'Ali' }, { v: 'bea', label: 'Bea' }, { v: 'cole', label: 'Cole' }],
  intro: (v) => `${STU[v].name} expanded ${T(STU[v].lines[0])}. Exactly one step is wrong. Which one, and why?`,
  make(stage, v, ex) {
    const W = ex.W, cw = (W - 64) / 2, cx = [20, 44 + cw], ly = [92, 150, 208], d = STU[v];
    const cards = cx.map((x, i) => { const e = add(stage, h('div', 'u3l7-nb' + (i ? '' : ' who'), `<div class="u3l7-nbh">${i ? 'Correct work' : d.name + '’s work'}</div>`), x, 14); box(e, cw, 236); return e; });
    const mkL = (s, x, y) => { const e = add(stage, h('div', 'u3l7-nl'), x, y); e.innerHTML = T(s); return e; };
    const left = d.lines.map((s, i) => mkL(s, cx[0] + 18, ly[i])), right = d.right.map((s, i) => mkL(s, cx[1] + 18, ly[i]));
    cards[1].style.opacity = 0; right.forEach((e) => (e.style.opacity = 0));
    const marks = ly.map((y) => { const e = add(stage, h('div', 'u3l7-nmark'), cx[0] + cw - 40, y); e.style.opacity = 0; return e; });
    const note = add(stage, h('div', 'u3l7-note'), 20, 272); note.style.width = (W - 40) + 'px'; note.style.opacity = 0;
    const mark = (c, i, kind) => { marks[i].className = 'u3l7-nmark ' + (kind === 'ok' ? 'ok' : 'no'); marks[i].textContent = kind === 'ok' ? '✓' : kind === 'arrow' ? '⚠' : '✗'; return c.pop(marks[i], 340); };
    const gEls = [];
    if (d.grid) { // Ali's missing rectangles, drawn as a little area model beside the note
      const gx = W - 280, gy = 262, a = 92, b = 56;
      [[gx, gy, a, a, 'p2', 'x^2'], [gx + a, gy, b + 30, a, 'miss', '4x'], [gx, gy + a, a, b, 'miss', '4x'], [gx + a, gy + a, b + 30, b, 'p0', '16']].forEach(([x, y, w, hh, cls, t]) => {
        const e = add(stage, h('div', 'u3l7-pc ' + cls, T(t)), x, y); box(e, w, hh); e.style.fontSize = '21px'; e.style.opacity = 0; gEls.push(e);
      });
    }
    return [
      { cap: `Put a correct solution beside ${d.name}’s work and compare them <b>line by line</b>. Line 1 is just the question.`, run: (c) => Promise.all([show(c, cards[1]), c.fadeIn(right[0], 300, { delay: 200 }), mark(c, 0, 'ok')]) },
      {
        cap: d.c2,
        run: async (c) => {
          left[1].classList.add('bad'); note.innerHTML = d.n2; if (d.grid) note.style.width = (W - 330) + 'px';
          await c.fadeIn(right[1], 350);
          await Promise.all([mark(c, 1, 'no'), c.shake(left[1]), c.fadeIn(note, 350), ...gEls.map((e, i) => c.pop(e, 340, { delay: 200 + i * 120 }))]);
        }
      },
      {
        cap: d.c3,
        run: async (c) => { note.innerHTML = d.n3; right[2].classList.add('good'); await Promise.all([c.fadeIn(right[2], 350), flash(c, note)]); await mark(c, 2, 'arrow'); }
      }
    ];
  }
};

/* ============ warm-up: the Mind-Reading Machines ============ */
function mountMachines() {
  const root = document.getElementById('u3l7-mach'); if (!root) return;
  let n = 7, outA = false, runB = false, env = false;
  const q = (s) => root.querySelector(s), qa = (s) => [...root.querySelectorAll(s)];
  const f = (v) => fmt(v).replace('-', '−');
  const render = () => {
    q('#u3l7-n').textContent = f(n);
    qa('[data-n]').forEach((e) => (e.textContent = f(n)));
    const a = [n + 3, 2 * (n + 3), 2 * (n + 3) - 4, (2 * (n + 3) - 4) / 2, (2 * (n + 3) - 4) / 2 - n];
    qa('[data-a]').forEach((e) => { const i = +e.dataset.a; e.textContent = i === 4 && !outA ? '?' : f(a[i]); });
    q('#u3l7-aout').textContent = outA ? f(a[4]) : '?';
    root.classList.toggle('aout', outA);
    const b = [n + 5, n - 5, (n + 5) * (n - 5), (n + 5) * (n - 5) - n * n], p = (v) => (v < 0 ? `(${f(v)})` : f(v));
    qa('[data-b]').forEach((e) => { const i = +e.dataset.b; e.textContent = !runB ? '?' : i === 2 ? `${f(b[0])} × ${p(b[1])} = ${f(b[2])}` : i === 3 ? `${f(b[2])} − ${f(n * n)} = ${f(b[3])}` : f(b[i]); });
    q('#u3l7-runb').textContent = runB ? 'Hide B' : 'Run B';
    root.classList.toggle('envopen', env);
    q('#u3l7-env').setAttribute('aria-label', env ? 'The envelope says −25' : 'Sealed envelope: tap to open');
  };
  qa('[data-d]').forEach((b) => b.addEventListener('click', () => { n = Math.max(-99, Math.min(999, n + +b.dataset.d)); render(); }));
  qa('[data-v]').forEach((b) => b.addEventListener('click', () => { n = +b.dataset.v; render(); }));
  q('#u3l7-runa').addEventListener('click', () => { outA = !outA; render(); });
  q('#u3l7-runb').addEventListener('click', () => { runB = !runB; render(); });
  q('#u3l7-env').addEventListener('click', () => { env = !env; render(); });
  render();
}

/* ============ wiring ============ */
const explainers = [];
function mountExplainers() {
  const defs = { machines, tiles, collect: collectEx, dist, foil, square, patterns, grid, measure, slips };
  document.querySelectorAll('[data-explainer]').forEach((el) => { const d = defs[el.dataset.explainer]; if (d) explainers.push(new Explainer(el, d)); });
  // KaTeX fonts arrive after the first build; redraw untouched explainers so measured widths are right.
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => explainers.forEach((e) => { if (!e.running && e.k === 0) e.build(0); }));
}
mountExplainers(); mountMachines();

/* ============ Stand Up Break! (lessons/js/standup.js) — a tiny polynomial kit for the whiteboard questions ============
 * A polynomial is { key: coefficient }, the key naming the variables and their exponents ('x2'; '' for a constant).
 * A written expression keeps its terms in a list of one-term polynomials, so the answer can show the partial products. */
const suKey = (e) => Object.keys(e).filter((v) => e[v]).sort().map((v) => v + e[v]).join('');
const suExp = (k) => { const e = {}; k.replace(/([a-z])(\d+)/g, (_, v, n) => { e[v] = +n; }); return e; };
const suM = (c, v, n = 1) => (c ? { [suKey(v ? { [v]: n } : {})]: c } : {}); // c·vⁿ
const suAdd = (...ps) => { const o = {}; ps.forEach((p) => { for (const k in p) { o[k] = (o[k] || 0) + p[k]; if (!o[k]) delete o[k]; } }); return o; };
const suMul = (...ps) => ps.reduce((a, b) => {
  const o = {};
  for (const i in a) for (const j in b) { const e = suExp(i), f = suExp(j); for (const v in f) e[v] = (e[v] || 0) + f[v]; const k = suKey(e); o[k] = (o[k] || 0) + a[i] * b[j]; if (!o[k]) delete o[k]; }
  return o;
}, { '': 1 });
const suDeg = (k) => Object.values(suExp(k)).reduce((s, n) => s + n, 0);
const suKeys = (p) => Object.keys(p).sort((a, b) => suDeg(b) - suDeg(a));
const suMono = (k) => Object.entries(suExp(k)).map(([v, n]) => v + (n > 1 ? '^{' + n + '}' : '')).join('');
const suTerm = (c, k, first) => { const m = suMono(k), a = Math.abs(c); return (c < 0 ? '-' : first ? '' : '+') + (a === 1 && m ? '' : a) + m; };
const suTex = (p) => suKeys(p).map((k, i) => suTerm(p[k], k, i === 0)).join('') || '0';
const suOne = (p) => { const k = Object.keys(p)[0]; return [p[k], k]; };
const suSeq = (list, cont) => list.filter((p) => Object.keys(p).length).map((p, i) => { const [c, k] = suOne(p); return suTerm(c, k, i === 0 && !cont); }).join('') || '0';
const suPar = (list) => '(' + suSeq(list) + ')';
const suP = (list) => suAdd(...list);
const suParts = (A, B) => A.flatMap((a) => B.map((b) => suMul(a, b)));
const suL = (v, a, b) => [suM(a, v), suM(b)]; // a·v + b as a written list
const suNz = (r, lo, hi) => { let w = 0; while (!w) w = r.int(lo, hi); return w; };
const suNeg = (p) => suMul(p, { '': -1 });
const suH = (list) => suSeq(list).replace(/[+-]/g, (m) => (m === '-' ? ' − ' : ' + ')).replace(/[a-z]/g, (c) => '<i>' + c + '</i>'); // a written list as HTML words
const suTri = (r, v, lead) => [suM(lead, v, 2), suM(suNz(r, -9, 9), v), suM(suNz(r, -9, 9))];

standup('u3l7', {
  intro: 'Unit review at your whiteboard station: expand, collect like terms, and check every sign and exponent before you call it done.',
  levels: {
    /* collect like terms; add or subtract two trinomials; a monomial times a binomial or trinomial */
    BEG: (r) => {
      const kind = r.pick(['collect', 'addsub', 'addsub', 'mono']), v = r.pick(['x', 'x', 'x', 'a', 'm']);
      if (kind === 'collect') {
        for (;;) {
          const ts = [suM(r.int(2, 9), v, 2), suM(suNz(r, -9, 9), v), suM(suNz(r, -12, 12)), suM(suNz(r, -6, 6), v, 2), r.chance(0.5) ? suM(suNz(r, -9, 9), v) : suM(suNz(r, -12, 12))];
          const sum = suP(ts); if (Object.keys(sum).length < 2) continue;
          const list = r.shuffle(ts);
          const byK = [v + '2', v + '1', ''].map((k) => list.filter((t) => suOne(t)[1] === k));
          return { text: 'Simplify by collecting like terms.', q: suSeq(list), a: ['=' + byK.map((g) => '(' + suSeq(g) + ')').join('+'), '=' + suTex(sum)] };
        }
      }
      if (kind === 'addsub') {
        for (;;) {
          const A = suTri(r, v, r.int(2, 9)), B = suTri(r, v, r.int(1, 6)), minus = r.chance(0.6), res = minus ? suAdd(suP(A), suNeg(suP(B))) : suAdd(suP(A), suP(B));
          if (Object.keys(res).length < 2) continue;
          return minus
            ? { text: 'Subtract.', q: suPar(A) + '-' + suPar(B), a: ['=' + suSeq(A) + suSeq(B.map(suNeg), true), '=' + suTex(res)] }
            : { text: 'Add.', q: suPar(A) + '+' + suPar(B), a: ['=' + suSeq(A) + suSeq(B, true), '=' + suTex(res)] };
        }
      }
      const k = suNz(r, -6, 6), n = r.int(1, 2), M = suM(Math.abs(k) === 1 ? k * 2 : k, v, n), B = r.chance(0.5) ? [suM(r.int(1, 6), v), suM(suNz(r, -9, 9))] : suTri(r, v, r.int(1, 5));
      const parts = B.map((t) => suMul(M, t));
      return { text: 'Expand.', q: suSeq([M]) + suPar(B), a: ['=' + B.map((t) => '(' + suTex(M) + ')(' + suTex(t) + ')').join('+'), '=' + suSeq(parts)] };
    },
    /* FOIL with negatives and coefficients; difference of squares; perfect squares */
    PRG: (r) => {
      const kind = r.pick(['foil', 'foil', 'dos', 'sq']), v = r.pick(['x', 'x', 'x', 'y', 'n']);
      if (kind === 'dos') {
        const a = r.int(1, 7), b = r.int(1, 9), A = suL(v, a, b), B = suL(v, a, -b), aT = suTerm(a, v + '1', true);
        return { text: 'Use the difference of squares pattern to expand.', q: r.chance(0.5) ? suPar(A) + suPar(B) : suPar(B) + suPar(A), a: [`a=${aT},\\ b=${b}:\\quad (${aT})^2-${b}^2`, '=' + suTex(suP(suParts(A, B)))] };
      }
      if (kind === 'sq') {
        const a = r.int(1, 5), b = r.int(1, 9) * r.sign(), A = suL(v, a, b), aT = suTerm(a, v + '1', true);
        return { text: 'Expand using the perfect square pattern.', q: suPar(A) + '^2', a: [`(${aT})^2${b > 0 ? '+' : '-'}2(${aT})(${Math.abs(b)})+${Math.abs(b)}^2`, '=' + suTex(suP(suParts(A, A)))] };
      }
      for (;;) {
        const a = r.pick([1, 1, 2, 3]), c = r.pick([1, 1, 2, 3, 4]), b = suNz(r, -9, 9), d = suNz(r, -9, 9);
        if (a === c && (b === d || b === -d)) continue; // that's a special product
        const A = suL(v, a, b), B = suL(v, c, d), parts = suParts(A, B), res = suP(parts);
        return { text: 'Expand and simplify.', q: suPar(A) + suPar(B), a: ['=' + suSeq(parts), '=' + suTex(res)] };
      }
    },
    /* binomial × trinomial; two products combined; area or volume */
    MAS: (r) => {
      const kind = r.pick(['bt', 'bt', 'mix', 'sqmix', 'meas']), v = r.pick(['x', 'x', 'x', 'a']);
      if (kind === 'bt') {
        const A = suL(v, r.pick([1, 1, 2, 3]), suNz(r, -5, 5)), B = suTri(r, v, r.int(1, 3)).map((t) => { const [c, k] = suOne(t); return { [k]: k ? Math.max(-6, Math.min(6, c)) || 1 : c }; });
        const parts = suParts(A, B);
        return { text: 'Expand and simplify.', q: suPar(A) + suPar(B), a: ['=' + suSeq(parts), '=' + suTex(suP(parts))] };
      }
      if (kind === 'mix') {
        for (;;) {
          const k = r.int(2, 5), b = suNz(r, -6, 6), c = suNz(r, -6, 6), d = suNz(r, -6, 6), M = [suM(k, v)], A = suL(v, 1, b), B1 = suL(v, 1, c), B2 = suL(v, 1, d);
          const p1 = suP(suParts(M, A)), p2 = suP(suParts(B1, B2)), res = suAdd(p1, suNeg(p2));
          if (Object.keys(res).length < 2) continue;
          return { text: 'Simplify.', q: suSeq(M) + suPar(A) + '-' + suPar(B1) + suPar(B2), a: [suSeq(M) + suPar(A) + '=' + suTex(p1), suPar(B1) + suPar(B2) + '=' + suTex(p2), '(' + suTex(p1) + ')-(' + suTex(p2) + ')=' + suTex(res)] };
        }
      }
      if (kind === 'sqmix') {
        const a = r.int(1, 3), b = suNz(r, -6, 6), A = suL(v, a, b), k = r.int(1, 4), c = suNz(r, -8, 8), M = [suM(k, v)], C = suL(v, 1, c);
        const sq = suP(suParts(A, A)), p = suP(suParts(M, C)), res = suAdd(sq, p);
        return { text: 'Expand and simplify.', q: suPar(A) + '^2+' + suSeq(M) + suPar(C), a: [suPar(A) + '^2=' + suTex(sq), suSeq(M) + suPar(C) + '=' + suTex(p), '=' + suTex(res)] };
      }
      if (r.chance(0.5)) {
        for (;;) {
          const a = r.int(2, 12), b = r.int(1, 12); if (a === b || (a === 9 && b === 5) || (a === 5 && b === 9)) continue; // not the assignment's field
          const A = suL(v, 1, a), B = suL(v, 1, b), parts = suParts(A, B);
          return { text: `A rectangular yard has length (${suH(A)}) m and width (${suH(B)}) m. Write a simplified expression for its area.`, q: 'A=' + suPar(A) + suPar(B), a: ['=' + suSeq(parts), '=' + suTex(suP(parts)) + '\\ \\text{m}^2'] };
        }
      }
      for (;;) {
        const s = r.int(1, 6), hgt = r.pick([0, 1, 2, 3, 4, 5]); if (s === 3 && hgt === 0) continue; // not the assignment's bin
        const S = suL(v, 1, s), H = hgt ? suL(v, 1, hgt) : [suM(1, v)], base = suP(suParts(S, S)), V = suMul(base, suP(H));
        return { text: `A box has a square base of side (${suH(S)}) cm and height ${hgt ? '(' + suH(H) + ')' : '<i>' + v + '</i>'} cm. Write a simplified expression for its volume.`, q: 'V=' + suPar(S) + '^2' + (hgt ? suPar(H) : v), a: [suPar(S) + '^2=' + suTex(base), 'V=' + suTex(V) + '\\ \\text{cm}^3'] };
      }
    }
  }
});
