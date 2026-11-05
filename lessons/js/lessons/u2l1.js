/* Math 15 · Unit 2 · Lesson 1 — Powers, Exponent Vocabulary & the Product Law.
 * (The Math 10C twin is u2/l1 + u2/l2; anatomy, fence, signs, the counting tiles and "expand, regroup, count" are adapted
 * from it.) Warm-up "Pass It On!" (a tree of people that grows round by round), the 4¹ 4² 4³ figures, and the explainers:
 *   anatomy    (Section 1: base, exponent, written out, the whole power, its value; Example 1)
 *   order      (Section 2: 2⁵ vs 5², swap the base and the exponent and the value changes; 2⁴ = 4² the one coincidence)
 *   brackets   (Section 2: what the exponent reaches, −3² vs (−3)²; Example 2 (c)–(f))
 *   signs      (Section 2: (−a)ⁿ and −aⁿ side by side as n grows: even differ, odd agree)
 *   substitute (Section 3: put the whole value, in brackets, in place of the letter; Example 3)
 *   product    (Section 4: the factors of a^m and a^n in one row, count them; different bases don't combine; Example 4)
 *   coef       (Section 5: expand, regroup, multiply the numbers, count the letters; Example 5; three students' answers)
 * Colours: base / factors navy, exponent amber, power red, coefficients amber tiles. */
import { h, Explainer } from '../explain.js';
import { tex } from '../tex.js';
import { standup } from '../standup.js';

const at = (el, x, y) => { el.style.left = x + 'px'; el.style.top = y + 'px'; return el; };
const add = (stage, el, x, y) => { stage.appendChild(at(el, x, y)); return el; };
const hide = (...els) => els.forEach((e) => { if (e) e.style.opacity = 0; });
const svgEl = (tag, attrs = {}, parent) => { const e = document.createElementNS('http://www.w3.org/2000/svg', tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; };

/* KaTeX allowing \htmlClass (parts of an expression we can find, measure and point at) */
const K = (src, display) => {
  try { return window.katex.renderToString(String(src), { displayMode: !!display, throwOnError: false, strict: 'ignore', trust: true, output: 'html' }); }
  catch (e) { return tex(src, display); }
};
const grp = (n, sep) => String(Math.abs(n)).replace(/\B(?=(\d{3})+(?!\d))/g, sep);
const T = (n) => (n < 0 ? '-' : '') + (Math.abs(n) >= 1000 ? grp(n, '\\,') : String(Math.abs(n))); // number → LaTeX
const N = (n) => (n < 0 ? '−' : '') + (Math.abs(n) >= 1000 ? grp(n, ' ') : String(Math.abs(n))); // number → text
const pw = (b, e) => (e === 1 ? String(b) : `${b}^{${e}}`);
const WORD = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

/* where an element sits inside a stage, in stage pixels (the lesson may be scaled to fit the screen) */
function rel(stage, el) {
  const sr = stage.getBoundingClientRect(), k = sr.width / stage.offsetWidth || 1, r = el.getBoundingClientRect();
  return { x: (r.left - sr.left) / k - stage.clientLeft, y: (r.top - sr.top) / k - stage.clientTop, w: r.width / k, h: r.height / k };
}
const unionR = (rs) => { const x = Math.min(...rs.map((r) => r.x)), y = Math.min(...rs.map((r) => r.y)); return { x, y, w: Math.max(...rs.map((r) => r.x + r.w)) - x, h: Math.max(...rs.map((r) => r.y + r.h)) - y }; };
/* KaTeX's wrapper spans don't always cover tall pieces: measure every visible descendant */
function relDeep(stage, el) {
  const rs = [el, ...el.querySelectorAll('*')].filter((e) => !(e instanceof SVGElement) || e.tagName === 'svg').map((e) => rel(stage, e)).filter((r) => r.w > 0.5 && r.h > 0.5);
  return rs.length ? unionR(rs) : rel(stage, el);
}
function frameAt(stage, r, cls, pad = 6) {
  const f = add(stage, h('div', 'u2l1-frame ' + (cls || '')), r.x - pad, r.y - pad);
  f.style.width = (r.w + 2 * pad) + 'px'; f.style.height = (r.h + 2 * pad) + 'px'; return f;
}
const ctr = (r) => ({ x: r.x + r.w / 2, y: r.y + r.h / 2 });
/* a centred row of LaTeX tokens; each token is its own span so it can fly in on its own */
function mkRow(stage, toks, cx, y, fs) {
  const row = add(stage, h('div', 'u2l1-row'), cx, y); row.style.fontSize = fs + 'px'; row.style.translate = '-50% 0';
  const els = toks.map((t) => { const e = h('span', 'u2l1-tok ' + (t.k || 'x') + (t.cp != null ? ' c' + (t.cp % 3) : ''), K(t.t)); row.appendChild(e); return e; });
  return { row, els };
}
/* a token flies in from a point (stage coords) to its place in a row */
function flyIn(c, stage, el, from, ms = 700, delay = 0) {
  if (!from || c.fast) return c.anim(el, [{ opacity: 0 }, { opacity: 1 }], 300, { delay });
  const me = rel(stage, el), dx = from.x - (me.x + me.w / 2), dy = from.y - (me.y + me.h / 2);
  return c.anim(el, [{ opacity: 0, transform: `translate(${dx}px, ${dy}px) scale(1.5)` }, { opacity: 1, transform: `translate(${dx * 0.3}px, ${dy * 0.3 - 16}px) scale(1.2)`, offset: 0.55 }, { opacity: 1, transform: 'none' }], ms, { delay });
}
const mv = (c, el, x, y, ms = 650, delay = 0) => c.anim(el, [{ left: el.style.left, top: el.style.top }, { left: x + 'px', top: y + 'px' }], ms, { delay });
function stampIn(c, el) { return c.anim(el, [{ opacity: 0, transform: 'scale(1.9) rotate(-14deg)' }, { opacity: 1, transform: 'scale(1) rotate(-6deg)' }], 420, { easing: 'cubic-bezier(.2,1.4,.4,1)' }); }

/* ================= 1. Anatomy of a power ================= */
const AN = { 'p^3': ['p', 3], '10^4': ['10', 4], '3^4': ['3', 4], '6^2': ['6', 2], 'x^5': ['x', 5], '8^3': ['8', 3] };
const anLabel = (v) => tex(pw(...AN[v]));
const anatomy = {
  title: 'The parts of a power',
  height: 400,
  minW: 820,
  choices: [{ v: 'p^3', label: anLabel('p^3') }, { v: '10^4', label: anLabel('10^4') }, { sep: 'Example 1 check:' }, ...['3^4', '6^2', 'x^5', '8^3'].map((v) => ({ v, label: anLabel(v) }))],
  intro: (v) => `Every power has the same parts. Let’s name each part of ${anLabel(v)}.`,
  make(stage, v, ex) {
    const [b, n] = AN[v], W = ex.W, num = /^\d+$/.test(b), val = num ? Math.pow(+b, n) : null;
    const e0 = add(stage, h('div', 'u2l1-an-expr', K(`\\htmlClass{u2l1-an-p}{\\htmlClass{u2l1-an-b}{${b}}^{\\htmlClass{u2l1-an-e}{${n}}}}`)), W / 2, 20); e0.style.translate = '-50% 0';
    const q = (sel) => e0.querySelector(sel);
    const toks = [{ t: '=', k: 'x' }];
    for (let i = 0; i < n; i++) { if (i) toks.push({ t: '\\times', k: 'x' }); toks.push({ t: b, k: 'f' }); }
    const R = mkRow(stage, toks, W / 2, 236, 42); hide(...R.els);
    const res = add(stage, h('div', 'u2l1-an-val' + (num ? '' : ' var'), num ? K(`${pw(b, n)}=${T(val)}`) : `${K(pw(b, n))} stays as it is: we can’t multiply it out until we know ${K(b)}`), W / 2, 326);
    res.style.translate = '-50% 0'; hide(res);
    const counts = [];
    const long = `${Array(n).fill(b).join('\\times')}`;
    return [{
      cap: `The <b>base</b> is the factor that gets repeated: ${tex(b)}.`,
      run: (c) => {
        const r = relDeep(stage, q('.u2l1-an-b')), f = frameAt(stage, r, 'teal', 4);
        const lb = add(stage, h('div', 'u2l1-tag teal', 'base'), r.x + r.w / 2, r.y + r.h + 22); lb.style.translate = '-50% 0';
        return Promise.all([c.pop(f, 380), c.fadeIn(lb, 350, { delay: 150 })]);
      }
    }, {
      cap: `The <b>exponent</b>, ${tex(String(n))}, counts how many times the base is used as a factor.`,
      run: (c) => {
        const r = relDeep(stage, q('.u2l1-an-e')), f = frameAt(stage, r, 'amber', 3);
        const lb = add(stage, h('div', 'u2l1-tag amber', '← exponent'), r.x + r.w + 16, r.y + r.h / 2); lb.style.translate = '0 -50%';
        return Promise.all([c.pop(f, 380), c.fadeIn(lb, 350, { delay: 150, from: 'translateX(-8px)' })]);
      }
    }, {
      cap: `Written out as a <b>repeated multiplication</b>: ${WORD[n]} factors of ${tex(b)}.`,
      run: async (c) => {
        const from = ctr(relDeep(stage, q('.u2l1-an-b')));
        let k = 0;
        await Promise.all(R.els.map((el, j) => (toks[j].k === 'f' ? flyIn(c, stage, el, from, 650, 80 + (k++) * 120) : c.anim(el, [{ opacity: 0 }, { opacity: 1 }], 300, { delay: 200 + j * 25 }))));
        R.els.filter((_, j) => toks[j].k === 'f').forEach((el, i) => { const r = rel(stage, el); const t = add(stage, h('div', 'u2l1-an-count', String(i + 1)), r.x + r.w / 2, r.y + r.h + 6); t.style.translate = '-50% 0'; counts.push(t); });
        await Promise.all(counts.map((t, i) => c.fadeIn(t, 260, { delay: i * 40 })));
      }
    }, {
      cap: `The <b>power</b> is the whole thing, ${tex(pw(b, n))}: the base and the exponent together.`,
      run: (c) => {
        const r = relDeep(stage, q('.u2l1-an-p')), f = frameAt(stage, r, 'red', 14);
        const lb = add(stage, h('div', 'u2l1-tag red', 'power'), r.x - 22, r.y + r.h / 2); lb.style.translate = '-100% -50%';
        return Promise.all([c.anim(f, [{ opacity: 0, transform: 'scale(1.15)' }, { opacity: 1, transform: 'none' }], 450), c.fadeIn(lb, 350, { delay: 200 })]);
      }
    }, {
      cap: num ? `Multiply it out: ${tex(`${long}=${T(val)}`)}. So ${tex(pw(b, n))} has the value <b>${N(val)}</b>.`
        : `${tex(b)} is a letter, so ${tex(pw(b, n))} can’t be multiplied out until we know ${tex(b)}. As it is, it’s already as simple as it gets.`,
      run: (c) => c.pop(res, 420)
    }];
  }
};

/* ================= 2. Order matters: bᵉ is not eᵇ ================= */
const ORD = { n1: [2, 3], n2: [3, 4], n3: [2, 4], ex: [2, 5] };
const ordLabel = (k) => { const [a, b] = ORD[k]; return tex(`${a}^{${b}}\\ \\text{vs}\\ ${b}^{${a}}`); };
const order = {
  title: 'Swap the base and the exponent?',
  height: 400,
  minW: 820,
  choices: [{ v: 'n1', label: ordLabel('n1') }, { v: 'n2', label: ordLabel('n2') }, { v: 'n3', label: ordLabel('n3') }, { sep: 'Example 2 check:' }, { v: 'ex', label: ordLabel('ex') }],
  value: 'ex',
  intro: (k) => { const [a, b] = ORD[k]; return `${tex(`${a}^{${b}}`)} and ${tex(`${b}^{${a}}`)} use the same two numbers. Do they have the same value?`; },
  make(stage, key, ex) {
    const W = ex.W, [a, b] = ORD[key], va = Math.pow(a, b), vb = Math.pow(b, a), SL = 94, X0 = 128;
    const row = (base, e, y, cls) => {
      const lab = add(stage, h('div', 'u2l1-od-lab', K(`${base}^{${e}}=`)), 22, y);
      const tiles = [], xs = [], runs = [];
      let p = 1;
      for (let i = 0; i < e; i++) {
        const x = X0 + SL / 2 + i * SL; p *= base;
        tiles.push(add(stage, h('div', 'u2l1-od-t ' + cls, String(base)), x, y));
        if (i) xs.push(add(stage, h('div', 'u2l1-od-x', '×'), x - SL / 2, y));
        runs.push(add(stage, h('div', 'u2l1-od-run', N(p)), x, y + 40));
      }
      const val = add(stage, h('div', 'u2l1-od-val ' + cls, K(`=${T(p)}`)), X0 + Math.max(a, b) * SL + 26, y);
      hide(...tiles, ...xs, ...runs, val);
      return { lab, tiles, xs, runs, val };
    };
    const A = row(a, b, 74, 'a'), B = row(b, a, 214, 'b');
    const same = va === vb;
    const cmp = add(stage, h('div', 'u2l1-od-cmp' + (same ? ' same' : ''), K(`${a}^{${b}}=${T(va)}\\quad${same ? '=' : '\\neq'}\\quad${b}^{${a}}=${T(vb)}`)), W / 2, 340); hide(cmp);
    const runList = (n, base) => Array.from({ length: n }, (_, i) => N(Math.pow(base, i + 1))).join(', ');
    const showTiles = (c, R) => Promise.all([...R.tiles.map((t, i) => c.pop(t, 320, { delay: i * 110 })), ...R.xs.map((x, i) => c.fadeIn(x, 250, { delay: 120 + i * 110 }))]);
    const showRuns = async (c, R) => { for (const r of R.runs) await c.pop(r, 260); await c.pop(R.val, 380); };
    return [
      { cap: `${tex(`${a}^{${b}}`)}: the base ${a} is used as a factor <b>${b} times</b>.`, run: (c) => showTiles(c, A) },
      { cap: `Multiply along the row: ${runList(b, a)}. So ${tex(`${a}^{${b}}=${T(va)}`)}.`, run: (c) => showRuns(c, A) },
      { cap: `Now swap them: ${tex(`${b}^{${a}}`)} uses ${b} as a factor <b>${a} times</b>.`, run: (c) => showTiles(c, B) },
      { cap: `Multiply along: ${runList(a, b)}. So ${tex(`${b}^{${a}}=${T(vb)}`)}.`, run: (c) => showRuns(c, B) },
      {
        cap: same ? `Both are <b>16</b>! ${tex('2^{4}=4^{2}')} is a rare coincidence: it’s the only pair of different whole numbers that does this. Every other swap changes the value.`
          : `${tex(`${T(va)}\\neq${T(vb)}`)}. Swapping the base and the exponent changes the value: <b>order matters</b>. The base is the factor; the exponent counts it.`,
        run: (c) => c.pop(cmp, 450)
      }
    ];
  }
};

/* ================= 2. The brackets decide what the exponent reaches ================= */
const O = (t) => ({ o: t });
const NEG = { neg: true };
const E = (b, e, p = false) => ({ b: [].concat(b), e, p });
function fenceTex(terms, marks) {
  return terms.map((t) => {
    if (t.neg) return marks ? '\\htmlClass{u2l1-fo}{-}' : '-';
    if (t.o) return marks ? `\\htmlClass{u2l1-fo}{${t.o}}` : t.o;
    const inner = (t.p ? '(' : '') + t.b.join('') + (t.p ? ')' : '');
    return marks ? `\\htmlClass{u2l1-fi}{${inner}}^{\\htmlClass{u2l1-fe}{${t.e}}}` : `${inner}^{${t.e}}`;
  }).join(marks ? '\\mkern1.5mu ' : '');
}
const X = { t: '\\times', k: 'x' }, P = (ch) => ({ t: ch, k: 'x' });
function fenceRow(terms) {
  const r = [];
  let neg = false, oi = 0;
  terms.forEach((t) => {
    if (t.neg) { r.push({ t: '-', k: 'o', src: oi }); oi++; neg = true; return; }
    const g = [];
    for (let c = 0; c < t.e; c++) { if (c) g.push(X); g.push({ t: t.p ? `(${t.b.join('')})` : t.b[0], k: 'i', cp: c }); }
    if (neg) r.push(P('('), ...g, P(')')); else r.push(...g);
    neg = false;
  });
  return r;
}
function fenceDef(title, list, sepAt, sepLabel) {
  const map = {}; list.forEach((s) => { map[s.v] = s; });
  const choices = [];
  list.forEach((s, i) => { if (i === sepAt) choices.push({ sep: sepLabel }); choices.push({ v: s.v, label: tex(fenceTex(s.terms, false)) }); });
  return {
    title, height: 380, choices,
    intro: (v) => `What does the exponent reach in ${tex(fenceTex(map[v].terms, false))}? Only what is <b>inside the brackets</b> (or, with no brackets, only the number right under it).`,
    make(stage, v, ex) {
      const s = map[v], W = ex.W, e = s.terms.find((t) => t.b).e;
      const e0 = add(stage, h('div', 'u2l1-fz-expr', K(fenceTex(s.terms, true))), W / 2, 50); e0.style.translate = '-50% 0';
      const toks = [P('='), ...fenceRow(s.terms)];
      const R = mkRow(stage, toks, W / 2, 214, 36); hide(...R.els);
      const res = add(stage, h('div', 'u2l1-fz-res', K(s.res)), W / 2, 294); res.style.translate = '-50% 0'; hide(res);
      const hasOut = s.terms.some((t) => t.o || t.neg);
      let fenceR = null, outR = [];
      const measure = () => { fenceR = relDeep(stage, e0.querySelector('.u2l1-fi')); outR = [...e0.querySelectorAll('.u2l1-fo')].map((el) => relDeep(stage, el)); };
      return [{
        cap: s.fc,
        run: (c) => {
          measure();
          const f = frameAt(stage, fenceR, 'fence', 7), er = relDeep(stage, e0.querySelector('.u2l1-fe')), fe = frameAt(stage, er, 'amber round', 4);
          const lb = add(stage, h('div', 'u2l1-tag amber', `the base · used ${e} times`), fenceR.x + fenceR.w / 2, fenceR.y + fenceR.h + 14); lb.style.translate = '-50% 0';
          const jobs = [c.pop(f, 400), c.pop(fe, 380, { delay: 120 }), c.fadeIn(lb, 350, { delay: 250 })];
          outR.forEach((r, i) => {
            const o = frameAt(stage, r, 'out', 5), t = add(stage, h('div', 'u2l1-tag gray', 'not in the power'), r.x + r.w / 2, r.y - 14); t.style.translate = '-50% -100%';
            jobs.push(c.fadeIn(o, 300, { delay: 350 + i * 120 }), c.fadeIn(t, 300, { delay: 400 + i * 120 }));
          });
          return Promise.all(jobs);
        }
      }, {
        cap: s.c1 || `Write the base <b>${WORD[e]} times</b>.${hasOut ? ' The minus sign waits outside, in front.' : ''}`,
        run: (c) => {
          if (!fenceR) measure();
          const fc = ctr(fenceR);
          let k = 0;
          return Promise.all(R.els.map((el, j) => {
            const t = toks[j];
            if (t.k === 'i') return flyIn(c, stage, el, fc, 700, 120 + (k++) * 150);
            if (t.k === 'o') return flyIn(c, stage, el, ctr(outR[t.src]), 650, 60);
            return c.anim(el, [{ opacity: 0 }, { opacity: 1 }], 300, { delay: 250 + j * 30 });
          }));
        }
      }, { cap: s.rc, run: (c) => c.pop(res, 450) }];
    }
  };
}
const brackets = fenceDef('What does the exponent reach?', [
  { v: 'n1', terms: [NEG, E('2', 4)], fc: 'No brackets: the exponent <b>4</b> reaches only the <b>2</b>. The minus sign is <b>not</b> part of the power.', c1: 'Multiply four 2s. The minus sign waits outside, in front of everything.', res: '=-16', rc: `${tex('-2^{4}=-(2\\times2\\times2\\times2)=-16')}. The answer is negative.` },
  { v: 'n2', terms: [E('-2', 4, true)], fc: 'The brackets put <b>−2</b> inside: the whole −2 is the base.', res: '=16', rc: `Four negative factors pair up into positives: ${tex('(-2)^{4}=16')}.` },
  { v: 'e1', terms: [E('-3', 2, true)], fc: 'The brackets hold <b>−3</b>, so −3 is the base.', res: '=9', rc: `${tex('(-3)(-3)=9')}: two negatives multiply to a <b>positive</b>.` },
  { v: 'e2', terms: [NEG, E('3', 2)], fc: 'No brackets, so the exponent reaches only the <b>3</b>. The minus sign is outside.', c1: 'Square the 3. The minus sign waits outside.', res: '=-9', rc: `${tex('-3^{2}=-(3\\times3)=-9')}. Only the 3 is squared.` },
  { v: 'e3', terms: [E('-2', 3, true)], fc: 'The brackets hold <b>−2</b>: three factors of −2.', res: '=-8', rc: `${tex('(-2)(-2)(-2)=-8')}: three negatives, so the answer is <b>negative</b>.` },
  { v: 'e4', terms: [NEG, E('2', 3)], fc: 'No brackets: the exponent 3 reaches only the <b>2</b>.', c1: 'Cube the 2. The minus sign waits outside.', res: '=-8', rc: `${tex('-2^{3}=-(2\\times2\\times2)=-8')}. Same answer as ${tex('(-2)^{3}')}: with an <b>odd</b> exponent the brackets don’t change the value.` }
], 2, 'Example 2 check:');
brackets.value = 'e1';

/* ================= 2. The sign pattern for negative bases ================= */
const SIGN_N = { 2: 6, 3: 5, 1: 6, 5: 5 };
const signs = {
  title: 'Negative bases: watch the sign flip',
  height: 450,
  minW: 780,
  choices: [{ v: 1, label: tex('-1') }, { v: 5, label: tex('-5') }, { sep: 'Example 2 check:' }, { v: 3, label: tex('-3') }, { v: 2, label: tex('-2') }],
  value: 3,
  intro: (b) => `Compare ${tex(`(-${b})^{n}`)} and ${tex(`-${b}^{n}`)} as the exponent n grows. Each step adds one more factor.`,
  make(stage, b, ex) {
    const W = ex.W, Nn = SIGN_N[b] || 5, CX = 196, VW = 170, VX = W - VW - 20;
    const slot = Math.min(100, (VX - 54 - CX) / Nn), fs = 25;
    const yA = 34, yB = 122, lab = (s, y) => add(stage, h('div', 'u2l1-sg-lab', K(s)), 24, y);
    lab(`(-${b})^{n}`, yA + 2); lab(`-${b}^{n}`, yB + 2);
    const cx = (i) => CX + slot / 2 + i * slot;
    const chipsA = [], chipsB = [], xsA = [], xsB = [];
    for (let i = 0; i < Nn; i++) {
      const a = add(stage, h('div', 'u2l1-sg-chip neg', K(`(-${b})`)), cx(i), yA + 28); a.style.fontSize = fs + 'px';
      const bb = add(stage, h('div', 'u2l1-sg-chip', K(String(b))), cx(i), yB + 28); bb.style.fontSize = fs + 'px';
      chipsA.push(a); chipsB.push(bb); hide(a, bb);
      if (i) { const xa = add(stage, h('div', 'u2l1-sg-x', ''), cx(i) - slot / 2, yA + 28), xb = add(stage, h('div', 'u2l1-sg-x', '×'), cx(i) - slot / 2, yB + 28); xsA.push(xa); xsB.push(xb); hide(xa, xb); }
    }
    const minus = add(stage, h('div', 'u2l1-sg-par', '−('), CX - 4, yB + 28); minus.style.translate = '-100% -50%'; hide(minus);
    const close = add(stage, h('div', 'u2l1-sg-par', ')'), cx(0) + slot / 2 - 2, yB + 28); close.style.translate = '0 -50%'; hide(close);
    const valA = add(stage, h('div', 'u2l1-sg-val'), VX, yA), valB = add(stage, h('div', 'u2l1-sg-val'), VX, yB);
    [valA, valB].forEach((e) => { e.style.width = VW + 'px'; }); hide(valA, valB);
    const ty = 236, tx = 210, cw = (W - tx - 24) / Nn;
    add(stage, h('div', 'u2l1-sg-th n', 'n'), 24, ty); add(stage, h('div', 'u2l1-sg-th', K(`(-${b})^{n}`)), 24, ty + 36); add(stage, h('div', 'u2l1-sg-th', K(`-${b}^{n}`)), 24, ty + 84);
    const rule = add(stage, h('div', 'u2l1-sg-rule'), 20, ty + 36); rule.style.width = (W - 40) + 'px';
    const cols = [];
    for (let i = 0; i < Nn; i++) {
      const n = i + 1, va = Math.pow(-b, n), vb = -Math.pow(b, n), same = va === vb;
      const col = add(stage, h('div', 'u2l1-sg-col', `<div class="u2l1-sg-n">${n}</div><div class="u2l1-sg-v ${va > 0 ? 'pos' : 'neg'}">${N(va)}</div><div class="u2l1-sg-v neg">${N(vb)}</div><div class="u2l1-sg-same ${same ? 'yes' : 'no'}">${same ? 'same' : 'different'}</div>`), tx + i * cw, ty);
      col.style.width = cw + 'px'; hide(col); cols.push(col);
    }
    const sum = add(stage, h('div', 'u2l1-sg-sum'), W / 2, 410); sum.style.translate = '-50% 0'; hide(sum);
    sum.innerHTML = `<b>even n:</b> ${K(`(-${b})^{n}`)} positive, ${K(`-${b}^{n}`)} negative &nbsp;·&nbsp; <b>odd n:</b> both negative`;
    const setVal = (el, v) => { el.innerHTML = `=&nbsp;<b>${N(v)}</b>`; el.classList.toggle('pos', v > 0); el.classList.toggle('neg', v < 0); };
    const steps = [];
    for (let i = 0; i < Nn; i++) {
      const n = i + 1, va = Math.pow(-b, n), vb = -Math.pow(b, n), even = n % 2 === 0;
      let cap;
      if (n === 1) cap = `One factor: ${tex(`(-${b})^{1}=-${b}`)} and ${tex(`-${b}^{1}=-${b}`)}. The same, so far.`;
      else if (n === 2) cap = `${tex(`(-${b})^{2}=(-${b})(-${b})=${T(va)}`)}: two negatives make a <b>positive</b>. But in ${tex(`-${b}^{2}`)} the exponent reaches only the ${b}: ${tex(`-(${b}\\times${b})=${T(vb)}`)}. <b>Different!</b>`;
      else if (n === 3) cap = `A third factor of ${tex(`-${b}`)} flips the sign back: ${tex(`(-${b})^{3}=${T(va)}`)}. And ${tex(`-${b}^{3}=${T(vb)}`)}. Odd exponent: <b>the same</b>.`;
      else cap = `${WORD[n][0].toUpperCase() + WORD[n].slice(1)} negative factors ${even ? 'pair up exactly' : 'leave one without a partner'}: ${tex(`(-${b})^{${n}}=${T(va)}`)} is <b>${even ? 'positive' : 'negative'}</b>. ${tex(`-${b}^{${n}}=${T(vb)}`)} is negative as always: <b>${va === vb ? 'same' : 'different'}</b>.`;
      steps.push({
        cap,
        run: async (c) => {
          const jobs = [c.pop(chipsA[i], 380), c.pop(chipsB[i], 380, { delay: 120 })];
          if (i) jobs.push(c.fadeIn(xsA[i - 1], 250), c.fadeIn(xsB[i - 1], 250));
          if (!i) jobs.push(c.fadeIn(minus, 300), c.fadeIn(close, 300));
          else jobs.push(c.anim(close, [{ left: close.style.left }, { left: (cx(i) + slot / 2 - 2) + 'px' }], 380));
          setVal(valA, va); setVal(valB, vb);
          jobs.push(c.anim(valA, [{ opacity: 0.2, transform: 'scale(.85)' }, { opacity: 1, transform: 'none' }], 380, { delay: 250 }), c.anim(valB, [{ opacity: 0.2, transform: 'scale(.85)' }, { opacity: 1, transform: 'none' }], 380, { delay: 350 }));
          jobs.push(c.fadeIn(cols[i], 400, { delay: 450 }));
          await Promise.all(jobs);
        }
      });
    }
    steps.push({
      cap: b === 1 ? `${tex('(-1)^{n}')} just flips between −1 and 1: <b>even</b> n gives 1, <b>odd</b> n gives −1. But ${tex('-1^{n}')} is <b>always −1</b>: its minus sign is outside the power.`
        : `<b>Even</b> exponent: ${tex(`(-${b})^{n}`)} is positive. <b>Odd</b>: negative. ${tex(`-${b}^{n}`)} is <b>always</b> negative, because its minus sign isn’t in the brackets. They agree only when n is odd.`,
      run: (c) => Promise.all([c.fadeIn(sum, 400), ...cols.map((col, i) => c.anim(col.querySelector('.u2l1-sg-same'), [{ transform: 'scale(1)' }, { transform: 'scale(1.25)' }, { transform: 'scale(1)' }], 350, { delay: i * 90 }))])
    });
    return steps;
  }
};

/* ================= 3. Substitute the whole value, in brackets ================= */
const SUB = {
  n1: { v: 'x', e: 3, val: 4 }, n2: { v: 'x', e: 2, val: -6 },
  a: { v: 'a', e: 3, val: 2 }, b: { v: 'b', e: 2, val: 5 }, c: { v: 'c', e: 4, val: -2 }, d: { v: 'd', e: 3, val: -1 }
};
const subLabel = (k) => { const d = SUB[k]; return tex(`${d.v}^{${d.e}},\\ ${d.v}=${d.val}`); };
const substitute = {
  title: 'Put the value in, brackets and all',
  height: 420,
  choices: [{ v: 'n1', label: subLabel('n1') }, { v: 'n2', label: subLabel('n2') }, { sep: 'Example 3 check:' }, ...['a', 'b', 'c', 'd'].map((k) => ({ v: k, label: subLabel(k) }))],
  intro: (k) => { const d = SUB[k]; return `Evaluate ${tex(`${d.v}^{${d.e}}`)} when ${tex(`${d.v}=${d.val}`)}.`; },
  make(stage, key, ex) {
    const W = ex.W, d = SUB[key], { v, e, val } = d, neg = val < 0, res = Math.pow(val, e), pv = `(${val})`;
    const e0 = add(stage, h('div', 'u2l1-sb-expr', K(`\\htmlClass{u2l1-sbv}{${v}}^{${e}}`)), 46, 8);
    const card = add(stage, h('div', 'u2l1-sb-card', `<span class="u2l1-sb-k">the value</span>${K(`${v}=${val}`)}`), W - 210, 26);
    const L = (src, y, cls = '') => { const el = add(stage, h('div', 'u2l1-sb-line ' + cls, K(src)), 60, y); hide(el); return el; };
    const l1 = L(`=\;\\htmlClass{u2l1-sbin}{${pv}}^{${e}}`, 140);
    const facs = neg ? Array(e).fill(pv).join('') : Array(e).fill(String(val)).join('\\times');
    const l2 = L(`=${facs}`, 206);
    const l3 = L(`=${T(res)}`, 272, 'res');
    const nNeg = neg ? e : 0;
    const note = add(stage, h('div', 'u2l1-sb-note ' + (neg ? (res > 0 ? 'pos' : 'neg') : ''), neg ? `${WORD[e]} negative factors: ${res > 0 ? 'they pair up, so positive' : 'one is left over, so negative'}` : `${WORD[e]} factors of ${val}`), 0, 230); hide(note);
    const wrong = neg ? -Math.pow(-val, e) : null;
    const warn = add(stage, h('div', 'u2l1-sb-warn', neg ? (wrong !== res
      ? `Without brackets: ${K(`-${-val}^{${e}}=-(${Array(e).fill(-val).join('\\times')})=${T(wrong)}`)} &nbsp;<b class="r">✗ wrong sign</b>`
      : `Without brackets: ${K(`-${-val}^{${e}}=${T(wrong)}`)}, the same here (odd exponent), but <b>always write the brackets</b>.`) : ''), 40, 344); hide(warn);
    const steps = [{
      cap: `Replace ${tex(v)} with its value. Put the <b>whole value</b>${neg ? ', sign included,' : ''} in <b>brackets</b>: ${tex(`${v}^{${e}}=${pv}^{${e}}`)}.`,
      run: async (c) => {
        await c.fadeIn(l1, 350);
        if (c.fast) return;
        const inn = l1.querySelector('.u2l1-sbin'), cr = rel(stage, card), ir = rel(stage, inn);
        const g = add(stage, h('div', 'u2l1-sb-fly', K(pv)), cr.x + cr.w / 2, cr.y + cr.h / 2); g.style.translate = '-50% -50%';
        inn.style.opacity = 0;
        try { await c.anim(g, [{ transform: 'translate(0,0) scale(1.1)' }, { transform: `translate(${ir.x + ir.w / 2 - cr.x - cr.w / 2}px, ${ir.y + ir.h / 2 - cr.y - cr.h / 2}px) scale(1)` }], 700); }
        finally { g.remove(); inn.style.opacity = 1; }
      }
    }, {
      cap: `Write it out: ${WORD[e]} factors of ${tex(neg ? pv : String(val))}.`,
      run: (c) => { const r = rel(stage, l2); at(note, r.x + r.w + 22, 206 + r.h / 2); return Promise.all([c.fadeIn(l2, 380), c.fadeIn(note, 350, { delay: 300 })]); }
    }, {
      cap: neg ? `Multiply. ${nNeg % 2 ? 'An <b>odd</b> number of negatives gives a <b>negative</b>' : 'An <b>even</b> number of negatives gives a <b>positive</b>'}: ${tex(`${v}^{${e}}=${T(res)}`)}.`
        : `Multiply: ${tex(`${facs}=${T(res)}`)}. So when ${tex(`${v}=${val}`)}, ${tex(`${v}^{${e}}=${T(res)}`)}.`,
      run: (c) => c.pop(l3, 420)
    }];
    if (neg) steps.push({
      cap: wrong !== res ? `Why the brackets? Without them, ${tex(`-${-val}^{${e}}`)} means ${tex(`-(${Array(e).fill(-val).join('\\times')})`)}: the minus is left out of the power and the sign comes out <b>wrong</b>.`
        : `Here, without brackets, you’d still get ${N(wrong)} because the exponent is odd. Write the brackets anyway: with an even exponent they change the answer.`,
      run: (c) => c.fadeIn(warn, 400)
    });
    return steps;
  }
};

/* ================= 4. The Product Law: put the factors in one row and count ================= */
const PROD = {
  n1: { g: [['2', 3], ['2', 2]], head: '2^{3}\\times2^{2}' },
  n2: { g: [['2', 3], ['5', 2]], head: '2^{3}\\times5^{2}', diff: true },
  a: { g: [['3', 2], ['3', 4]], head: '3^{2}\\times3^{4}' },
  b: { g: [['6', 3], ['6', 1]], head: '6^{3}\\times6^{1}' },
  c: { g: [['m', 2], ['m', 5]], head: 'm^{2}\\times m^{5}' },
  d: { g: [['n', 4], ['n', 1], ['n', 2]], head: 'n^{4}\\times n\\times n^{2}', bare: true }
};
const product = {
  title: 'Count the factors',
  height: 456,
  minW: 820,
  choices: [{ v: 'n1', label: tex(PROD.n1.head) }, { v: 'n2', label: tex(PROD.n2.head) }, { sep: 'Example 4 check:' }, ...['a', 'b', 'c', 'd'].map((k) => ({ v: k, label: tex(PROD[k].head) }))],
  intro: (k) => `Write ${tex(PROD[k].head)} out as repeated multiplication, then count the factors.`,
  make(stage, key, ex) {
    const W = ex.W, d = PROD[key], gs = d.g, tot = gs.reduce((s, [, e]) => s + e, 0), SL = tot >= 7 ? 78 : 84, GAP = 58, y = 190;
    const b0 = gs[0][0], num = /^\d+$/.test(b0), sumE = gs.map(([, e]) => e).join('+');
    const head = add(stage, h('div', 'u2l1-lw-head', K(d.head)), W / 2, 14); head.style.translate = '-50% 0';
    const width = tot * SL + (gs.length - 1) * GAP;
    let x = (W - width) / 2;
    const cls = d.diff ? ['a', 'b'] : ['a', 'b', 'c'];
    const tiles = [], boxes = [], mids = [];
    gs.forEach(([b, e], gi) => {
      const xs = Array.from({ length: e }, (_, i) => x + SL / 2 + i * SL), cl = cls[gi];
      xs.forEach((xx) => tiles.push(add(stage, h('div', 'u2l1-lw-t ' + cl, K(b)), xx, y)));
      const bx = add(stage, h('div', 'u2l1-lw-box ' + cl), x + 4, y - 42); bx.style.width = (e * SL - 8) + 'px'; bx.style.height = '84px';
      const lb = add(stage, h('div', 'u2l1-lw-blab ' + cl, K(e === 1 && !d.bare ? `${b}^{1}` : pw(b, e))), x + e * SL / 2, y - 50); lb.style.translate = '-50% -100%';
      boxes.push(bx, lb);
      x += e * SL;
      if (gi < gs.length - 1) { mids.push(add(stage, h('div', 'u2l1-lw-x big', '×'), x + GAP / 2, y)); x += GAP; }
    });
    hide(...tiles, ...boxes, ...mids);
    const F = Array.from({ length: tot }, (_, i) => W / 2 + (i - (tot - 1) / 2) * SL);
    const xs = F.slice(1).map((fx) => { const e = add(stage, h('div', 'u2l1-lw-x', '×'), fx - SL / 2, y); hide(e); return e; });
    const badges = tiles.map((t, i) => { const bd = add(stage, h('div', 'u2l1-lw-badge', String(i + 1)), F[i] + 22, y - 26); hide(bd); return bd; });
    const line = (src, yy, cls2) => { const e = add(stage, h('div', 'u2l1-lw-line ' + (cls2 || ''), src), W / 2, yy); e.style.translate = '-50% 0'; hide(e); return e; };
    const parts = gs.map(([b, e]) => (e === 1 ? (d.bare ? `${tex(b)} by itself is ${tex(`${b}^{1}`)}: <b>one</b> factor` : `${tex(`${b}^{1}`)} is <b>one</b> factor of ${tex(b)}`) : `${tex(pw(b, e))} is ${WORD[e]} factors of ${tex(b)}`));
    const showGroups = (c) => Promise.all([...boxes.map((e) => c.fadeIn(e, 350)), ...mids.map((e) => c.fadeIn(e, 300)), ...tiles.map((t, i) => c.pop(t, 320, { delay: 150 + i * 80 }))]);
    const toRow = (c) => Promise.all([...[...boxes, ...mids].map((e) => c.anim(e, [{ opacity: 1 }, { opacity: 0 }], 300)), ...tiles.map((t, i) => mv(c, t, F[i], y, 700, 150 + i * 60)), ...xs.map((e, i) => c.fadeIn(e, 300, { delay: 800 + i * 40 }))]);
    if (d.diff) {
      const v1 = Math.pow(2, 3), v2 = Math.pow(5, 2);
      const st = add(stage, h('div', 'u2l1-stamp no', '✗'), W / 2 + (tot * SL) / 2 + 10, y - 60); hide(st);
      const bad = line(`Not one power: ${K('2\\times2\\times2\\times5\\times5')} is not five of the <b>same</b> factor.`, 268, 'bad');
      const res = line(K(`2^{3}\\times5^{2}=8\\times25=200`), 330, 'res');
      const law = line(`<b>Product Law</b> ${K('a^{m}\\times a^{n}=a^{m+n}')} <span class="u2l1-lw-note">same base only</span>`, 396, 'law');
      return [
        { cap: `${tex('2^{3}')} is three factors of 2; ${tex('5^{2}')} is two factors of 5.`, run: showGroups },
        { cap: 'Multiplying puts all the factors in one row…', run: toRow },
        { cap: 'But the factors are <b>not all the same</b>: three 2s and two 5s. There is no single power to write, so we can’t add the exponents.', run: (c) => Promise.all([stampIn(c, st), c.fadeIn(bad, 400, { delay: 200 })]) },
        { cap: `All we can do is evaluate each power, then multiply: ${tex('8\\times25=200')}.`, run: (c) => c.fadeIn(res, 400) },
        { cap: '<b>Bases must be identical</b> for the Product Law. Different bases: work out each power first.', run: (c) => c.pop(law, 450) }
      ];
    }
    const resT = `${d.head}=${b0}^{${sumE}}=${pw(b0, tot)}${num ? `=${T(Math.pow(+b0, tot))}` : ''}`;
    const res = line(K(resT), 268, 'res');
    const law = line(`<b>Product Law</b> ${K('a^{m}\\times a^{n}=a^{m+n}')}`, 340, 'law');
    return [
      { cap: parts.join('; ') + '.', run: showGroups },
      { cap: `Multiplying the powers just puts <b>all</b> the factors in one long row.${d.bare ? ` (${tex(b0)} by itself counts as <b>one</b> factor: ${tex(`${b0}=${b0}^{1}`)}.)` : ''}`, run: toRow },
      {
        cap: `Count them: ${tex(sumE.replace(/\+/g, '+') + '=' + tot)} factors of ${tex(b0)}. So ${tex(`${d.head}=${pw(b0, tot)}`)}${num ? `, and ${tex(`${pw(b0, tot)}=${T(Math.pow(+b0, tot))}`)}` : ''}.`,
        run: async (c) => { for (const bd of badges) await c.pop(bd, 200); await c.fadeIn(res, 400); }
      },
      { cap: `<b>Product Law:</b> multiplying powers with the <b>same base</b>? Keep the base and <b>add</b> the exponents.${num ? '' : ` ${tex(pw(b0, tot))} is as far as it goes: we don’t know ${tex(b0)}.`}`, run: (c) => c.pop(law, 450) }
    ];
  }
};

/* ================= 5. Coefficients: expand, regroup, count ================= */
const EXPAND = {
  n1: { a: 3, m: 2, b: 5, n: 4, v: 'x', students: true },
  a: { a: 4, m: 2, b: 2, n: 3, v: 'x' }, b: { a: 5, m: 3, b: 3, n: 2, v: 'a' },
  c: { a: 2, m: 1, b: 6, n: 4, v: 'y' }, d: { a: 7, m: 2, b: 1, n: 3, v: 'b' }
};
const cf = (k) => (k === 1 ? '' : String(k));
const exHead = (d) => `${cf(d.a)}${pw(d.v, d.m)}\\times ${cf(d.b)}${pw(d.v, d.n)}`;
const coef = {
  title: 'Expand, regroup, count',
  height: 424,
  choices: [{ v: 'n1', label: tex(exHead(EXPAND.n1)) }, { sep: 'Example 5 check:' }, ...['a', 'b', 'c', 'd'].map((k) => ({ v: k, label: tex(exHead(EXPAND[k])) }))],
  intro: (k) => `Simplify ${tex(exHead(EXPAND[k]))} by writing out <b>every factor</b>.${EXPAND[k].students ? ' Then we’ll check three students’ answers.' : ''}`,
  make(stage, key, ex) {
    const W = ex.W, d = EXPAND[key], { a, m, b, n, v } = d, ab = a * b, mn = m + n;
    const TS = 58, G = 10, XG = 52, ty = 118;
    add(stage, h('div', 'u2l1-xp-head', K(exHead(d))), W / 2, 34);
    const mk = (txt, cls) => { const e = add(stage, h('div', 'u2l1-xt ' + cls, K(txt)), 0, ty); hide(e); return e; };
    const ta = mk(String(a), 'co'), tb = mk(String(b), 'co' + (b === 1 ? ' ghost' : ''));
    const va = Array.from({ length: m }, () => mk(v, 'va')), vb = Array.from({ length: n }, () => mk(v, 'va'));
    const w1 = (1 + m) * (TS + G) - G, w2 = (1 + n) * (TS + G) - G, x0 = (W - (w1 + XG + w2)) / 2;
    [ta, ...va].forEach((e, i) => { e.style.left = (x0 + i * (TS + G)) + 'px'; });
    [tb, ...vb].forEach((e, i) => { e.style.left = (x0 + w1 + XG + i * (TS + G)) + 'px'; });
    const times = add(stage, h('div', 'u2l1-xp-times', '×'), x0 + w1 + XG / 2, ty + TS / 2); hide(times);
    const dots = (k) => Array(k).fill(`\\cdot ${v}`).join('');
    const lab1 = add(stage, h('div', 'u2l1-xp-lab', K(`${a}${pw(v, m)}=${a}${dots(m)}`)), x0 + w1 / 2, ty + TS + 24);
    const lab2 = add(stage, h('div', 'u2l1-xp-lab', K(`${cf(b)}${pw(v, n)}=${b}${dots(n)}`)), x0 + w1 + XG + w2 / 2, ty + TS + 24);
    hide(lab1, lab2);
    const wc = 2 * (TS + G) - G, wv = mn * (TS + G) - G, xr = (W - (wc + XG + wv)) / 2;
    const pos2 = new Map([[ta, xr], [tb, xr + TS + G]]);
    [...va, ...vb].forEach((e, i) => pos2.set(e, xr + wc + XG + i * (TS + G)));
    const regroup = add(stage, h('div', 'u2l1-xp-lab', K(`(${a}\\times${b})\\cdot(${Array(mn).fill(v).join('\\cdot ')})`)), W / 2, ty + TS + 24); hide(regroup);
    const brace = add(stage, h('div', 'u2l1-xp-brace'), xr + wc + XG, ty - 15); brace.style.width = wv + 'px'; hide(brace);
    const braceL = add(stage, h('div', 'u2l1-xp-bl', `${mn} factors of ${tex(v)}`), xr + wc + XG + wv / 2, ty - 28); hide(braceL);
    const ans = `${ab}${pw(v, mn)}`;
    const res = add(stage, h('div', 'u2l1-xp-res', K(`${exHead(d)}=\\boldsymbol{${ans}}`)), W / 2, d.students ? 238 : 262); hide(res);
    const law = add(stage, h('div', 'u2l1-xp-law', `<b>Numbers multiply:</b> ${K(`${a}\\times${b}=${ab}`)} &nbsp;·&nbsp; <b>exponents add:</b> ${K(`${m}+${n}=${mn}`)}`), W / 2, 338); hide(law);
    const counts = [...va, ...vb].map((e) => { const k = h('span', 'u2l1-xt-n'); e.appendChild(k); hide(k); return k; });
    const move = (c, ms = 700) => Promise.all([...pos2].map(([e, xx], i) => c.anim(e, [{ left: e.style.left }, { left: xx + 'px' }], ms, { delay: i * 25 })));
    const one = [];
    if (m === 1) one.push(`${tex(`${a}${v}`)} has just <b>one</b> ${tex(v)} (${tex(`${v}=${v}^{1}`)})`);
    if (b === 1) one.push(`${tex(pw(v, n))} has no number in front, so its coefficient is <b>1</b>`);
    const steps = [{
      cap: `<b>Expand</b> each term into its factors.${one.length ? ' ' + one.join('; ') + '.' : ''}`,
      run: (c) => Promise.all([ta, ...va, tb, ...vb].map((e, i) => c.pop(e, 360, { delay: i * 70 })).concat([c.fadeIn(times, 300), c.fadeIn(lab1, 350, { delay: 300 }), c.fadeIn(lab2, 350, { delay: 500 })]))
    }, {
      cap: `It’s all one multiplication, so we can <b>regroup</b>: the numbers together, the ${tex(v)}’s together.`,
      run: (c) => Promise.all([move(c), c.anim(times, [{ opacity: 1 }, { opacity: 0 }], 250), c.anim(lab1, [{ opacity: 1 }, { opacity: 0 }], 250), c.anim(lab2, [{ opacity: 1 }, { opacity: 0 }], 250), c.fadeIn(regroup, 400, { delay: 500 })])
    }, {
      cap: `<b>Multiply the numbers</b>: ${tex(`${a}\\times${b}=${ab}`)}.`,
      run: async (c) => {
        await c.anim(tb, [{ left: tb.style.left }, { left: (xr + TS / 2) + 'px' }], 450);
        tb.style.opacity = 0; ta.innerHTML = K(String(ab)); if (ab >= 10) ta.classList.add('big2');
        await c.pop(ta, 380);
      }
    }, {
      cap: `<b>Count the ${tex(v)}’s:</b> ${tex(`${m}+${n}=${mn}`)}, so ${tex(pw(v, mn))}. The exponents <b>add</b>. Answer: ${tex(`${exHead(d)}=${ans}`)}.`,
      run: async (c) => {
        for (let i = 0; i < counts.length; i++) { counts[i].textContent = i + 1; await c.pop(counts[i], 200); }
        await Promise.all([c.fadeIn(brace, 300), c.fadeIn(braceL, 300), c.fadeIn(res, 450, { delay: 150 }), d.students ? null : c.fadeIn(law, 400, { delay: 350 })]);
      }
    }];
    if (d.students) {
      const cards = [['Devon', `15${v}^{8}`, false, `multiplied the exponents, ${tex('2\\times4')}`], ['Farah', `8${v}^{6}`, false, `added the numbers, ${tex('3+5')}`], ['Priya', `15${v}^{6}`, true, 'correct']].map(([name, an, ok, why], i) => {
        const cw = (W - 80) / 3, el = add(stage, h('div', 'u2l1-xp-stu', `<div class="u2l1-xp-sn">${name}</div><div class="u2l1-xp-sa">${K(an)}</div><div class="u2l1-xp-sw">${why}</div>`), 20 + i * (cw + 20), 306);
        el.style.width = cw + 'px';
        const st = add(stage, h('div', 'u2l1-stamp ' + (ok ? 'ok' : 'no'), ok ? '✓' : '✗'), 20 + i * (cw + 20) + cw - 58, 312); hide(st);
        return { el, st, why: el.querySelector('.u2l1-xp-sw') };
      });
      hide(...cards.map((x) => x.why));
      const mark = (c, k, cls) => { cards[k].el.classList.add(cls); return Promise.all([stampIn(c, cards[k].st), c.fadeIn(cards[k].why, 300)]); };
      steps.push({
        cap: `<b>Devon</b> wrote ${tex('15x^{8}')}: he <b>multiplied</b> the exponents. But count the tiles: there are only <b>6</b> factors of ${tex('x')}.`,
        run: (c) => mark(c, 0, 'no')
      }, {
        cap: `<b>Farah</b> wrote ${tex('8x^{6}')}: she <b>added</b> the numbers. But the 3 and the 5 are <b>multiplied</b>, so they make 15.`,
        run: (c) => mark(c, 1, 'no')
      }, {
        cap: `<b>Priya is correct:</b> ${tex('15x^{6}')}. Numbers <b>multiply</b>, exponents <b>add</b>.`,
        run: (c) => mark(c, 2, 'ok')
      });
    }
    return steps;
  }
};

/* ================= warm-up: Pass It On! (a tree of people, round by round) ================= */
function mountTree() {
  const host = document.getElementById('u2l1-tree'); if (!host) return;
  const RY = [26, 94, 162, 228], X0 = 80, SP = 14.6, LW = 470, HH = 250;
  const svg = svgEl('svg', { viewBox: `0 0 ${LW} ${HH}`, width: LW, height: HH, role: 'img', 'aria-label': 'You tell 3 friends, each tells 3 new friends, and so on: 1, 3, 9 and 27 people in rounds 0 to 3.' });
  const leafX = (k) => X0 + k * SP, r2X = (j) => leafX(3 * j + 1), r1X = (i) => leafX(9 * i + 4), meX = leafX(13);
  const rounds = [0, 1, 2, 3].map(() => svgEl('g', { class: 'u2l1-rnd' }, svg));
  const edge = (g, x1, y1, x2, y2) => svgEl('line', { x1, y1: y1 + 8, x2, y2: y2 - 13, class: 'u2l1-edge' }, g);
  const person = (g, x, y, s, cls) => {
    svgEl('path', { d: `M${x - 7 * s} ${y + 7 * s} C${x - 7 * s} ${y - 1 * s} ${x + 7 * s} ${y - 1 * s} ${x + 7 * s} ${y + 7 * s} Z`, class: cls + ' u2l1-hd' }, g);
    svgEl('circle', { cx: x, cy: y - 4 * s, r: 4 * s, class: cls + ' u2l1-hd' }, g);
  };
  for (let i = 0; i < 3; i++) {
    edge(rounds[1], meX, RY[0], r1X(i), RY[1]);
    for (let j = 0; j < 3; j++) {
      edge(rounds[2], r1X(i), RY[1], r2X(3 * i + j), RY[2]);
      for (let k = 0; k < 3; k++) edge(rounds[3], r2X(3 * i + j), RY[2], leafX(9 * i + 3 * j + k), RY[3]);
    }
  }
  person(rounds[0], meX, RY[0], 1.35, 'u2l1-me');
  for (let i = 0; i < 3; i++) person(rounds[1], r1X(i), RY[1], 1.15, 'u2l1-ppl');
  for (let j = 0; j < 9; j++) person(rounds[2], r2X(j), RY[2], 1.0, 'u2l1-ppl');
  for (let k = 0; k < 27; k++) person(rounds[3], leafX(k), RY[3], 0.74, 'u2l1-ppl');
  ['You', 'Round 1', 'Round 2', 'Round 3'].forEach((t, i) => { const e = svgEl('text', { x: 4, y: RY[i] + 5, class: 'u2l1-tl' }, svg); e.textContent = t; });
  host.appendChild(svg);
  // the counts column (HTML, so the last one can be a tap-to-reveal)
  const col = h('div', 'u2l1-tcol');
  col.innerHTML = ['1 person', '3 people', '9 people', '<span data-reveal="? people"><b class="u2l1-red">27 people</b></span>'].map((t, i) => `<div class="u2l1-tci" style="top:${RY[i] - 12}px">${t}</div>`).join('') +
    [0, 1, 2].map((i) => `<div class="u2l1-tx3" style="top:${(RY[i] + RY[i + 1]) / 2 - 11}px">×3</div>`).join('');
  host.appendChild(col);
  const btn = document.getElementById('u2l1-grow');
  if (btn) btn.addEventListener('click', async () => {
    if (btn.disabled) return; btn.disabled = true;
    rounds.forEach((g) => g.classList.add('off'));
    for (const g of rounds) { await new Promise((r) => setTimeout(r, 450)); g.classList.remove('off'); }
    btn.disabled = false;
  });
}

/* ================= figures: 4¹, 4², 4³ ================= */
function mountFigures() {
  const host = document.getElementById('u2l1-figs'); if (!host) return;
  const s = 28;
  const fig = (svg, capT, say) => { const d = h('div', 'u2l1-fig'); d.appendChild(svg); d.appendChild(h('div', 'u2l1-figcap', `${K(capT)}<em class="u2l1-figsay">${say}</em>`)); host.appendChild(d); };
  const w1 = svgEl('svg', { width: 4 * s + 30, height: 4 * s + 20, viewBox: `-15 -10 ${4 * s + 30} ${4 * s + 20}` });
  for (let i = 0; i < 4; i++) svgEl('rect', { x: i * s, y: 1.5 * s, width: s, height: s, class: 'u2l1-fsq' }, w1);
  fig(w1, '4^{1}=4', 'four to the first');
  const w2 = svgEl('svg', { width: 4 * s + 30, height: 4 * s + 20, viewBox: `-15 -10 ${4 * s + 30} ${4 * s + 20}` });
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) svgEl('rect', { x: i * s, y: j * s, width: s, height: s, class: 'u2l1-fsq' }, w2);
  fig(w2, '4\\times4=4^{2}=16', 'four <b>squared</b>');
  const dx = 0.5 * s, dy = 0.35 * s, CW = 4 * s + 4 * dx, CH = 4 * s + 4 * dy;
  const w3 = svgEl('svg', { width: CW + 30, height: CH + 20, viewBox: `-15 ${-10 - 4 * dy} ${CW + 30} ${CH + 20}` });
  const ln = (x1, y1, x2, y2) => svgEl('line', { x1, y1, x2, y2, class: 'u2l1-fl' }, w3);
  const Y = (yy) => 4 * s - yy;
  svgEl('polygon', { points: `0,${Y(0)} ${4 * s},${Y(0)} ${4 * s},${Y(4 * s)} 0,${Y(4 * s)}`, class: 'u2l1-ff1' }, w3);
  svgEl('polygon', { points: `0,${Y(4 * s)} ${4 * dx},${Y(4 * s + 4 * dy)} ${4 * s + 4 * dx},${Y(4 * s + 4 * dy)} ${4 * s},${Y(4 * s)}`, class: 'u2l1-ff2' }, w3);
  svgEl('polygon', { points: `${4 * s},${Y(0)} ${4 * s + 4 * dx},${Y(4 * dy)} ${4 * s + 4 * dx},${Y(4 * s + 4 * dy)} ${4 * s},${Y(4 * s)}`, class: 'u2l1-ff3' }, w3);
  for (let i = 0; i <= 4; i++) {
    ln(i * s, Y(0), i * s, Y(4 * s)); ln(0, Y(i * s), 4 * s, Y(i * s));
    ln(i * s, Y(4 * s), i * s + 4 * dx, Y(4 * s + 4 * dy)); ln(i * dx, Y(4 * s + i * dy), 4 * s + i * dx, Y(4 * s + i * dy));
    ln(4 * s, Y(i * s), 4 * s + 4 * dx, Y(i * s + 4 * dy)); ln(4 * s + i * dx, Y(i * dy), 4 * s + i * dx, Y(4 * s + i * dy));
  }
  fig(w3, '4\\times4\\times4=4^{3}=64', 'four <b>cubed</b>');
}

/* ============ wiring ============ */
const DEFS = { anatomy, order, brackets, signs, substitute, product, coef };
mountTree(); mountFigures();
document.querySelectorAll('[data-explainer]').forEach((el) => new Explainer(el, DEFS[el.dataset.explainer]));

/* ============ Stand Up Break! — evaluate powers and use the Product Law at the whiteboards ============ */
standup('u2l1', (() => {
  const times = (f, n) => Array(n).fill(f).join('\\times ');
  const par = (v) => (v < 0 ? `(${v})` : String(v));
  // plain powers, avoiding Assignment 1 #3 (3⁵, 6², 2⁶, 5³, 10³, 4⁴)
  const PLAIN = [[2, 3], [2, 4], [2, 5], [3, 2], [3, 3], [3, 4], [4, 2], [4, 3], [5, 2], [7, 2], [8, 2], [9, 2], [10, 2], [10, 4], [10, 5], [1, 6], [2, 7], [6, 3]];
  // −k^n vs (−k)^n, avoiding Assignment 1 #4 (7², 4³, 2⁴)
  const PAIRS = [[2, 2], [2, 3], [2, 5], [3, 2], [3, 3], [3, 4], [5, 2], [5, 3], [6, 2], [10, 2], [10, 3], [10, 4], [1, 4], [1, 5]];
  // substitution: avoids Assignment 1 #6 (a² at 4, b³ at 3, c² at −4, d⁴ at −1, e³ at −3)
  const SUBS = [[-2, 2], [-2, 3], [-2, 5], [-3, 2], [-3, 4], [-5, 2], [-5, 3], [-1, 5], [-1, 6], [-6, 2], [-10, 3], [-10, 2], [3, 4], [4, 3], [2, 5], [5, 3]];
  const LET = ['a', 'b', 'c', 'd', 'k', 'm', 'n', 'p', 'q', 't', 'w', 'x', 'y', 'z'];
  // Product Law with numbers: bases and exponent sums that keep the value friendly; skips Assignment 1 #8 and the examples
  const SKIP = new Set(['3,2,3', '6,2,1', '5,2,2', '10,3,2', '3,2,4', '6,3,1', '2,3,2', '4,2,3']);
  const PL = { 2: 8, 3: 5, 4: 4, 5: 4, 10: 6 };
  return {
    intro: 'Work it out at your whiteboard station, no calculator. Write the factors out if it helps you count.',
    levels: {
      BEG: (r) => {
        if (r.chance(0.5)) {
          const [k, n] = r.pick(PLAIN), v = Math.pow(k, n);
          return { text: 'Write it as a repeated multiplication, then evaluate.', q: `${k}^{${n}}`, a: [`${k}^{${n}}=${times(k, n)}`, `=${T(v)}`] };
        }
        const [k, n] = r.pick(PAIRS), A = [`-${k}^{${n}}`, `${n > 3 ? '' : `-(${times(k, n)})=`}${T(-Math.pow(k, n))}`], B = [`(-${k})^{${n}}`, `${n > 3 ? '' : `${times(`(-${k})`, n)}=`}${T(Math.pow(-k, n))}`];
        const pr = r.chance(0.5) ? [A, B] : [B, A];
        return { text: 'Evaluate both. Watch the brackets!', q: `\\text{(a) }\\ {${pr[0][0]}}\\qquad\\quad\\text{(b) }\\ {${pr[1][0]}}`,
          a: [`\\text{(a) }\\ {${pr[0][0]}}=${pr[0][1]}`, `\\text{(b) }\\ {${pr[1][0]}}=${pr[1][1]}`],
          atext: n % 2 ? 'Odd exponent: the two agree.' : 'Even exponent: different signs. Only the brackets put the minus sign in the base.' };
      },
      PRG: (r) => {
        if (r.chance(0.5)) {
          const [val, n] = r.pick(SUBS), v = r.pick(LET);
          return { text: `Evaluate when ${tex(`${v}=${val}`)}.`, q: `${v}^{${n}}`, a: [`${v}^{${n}}=${par(val)}^{${n}}`, `=${times(par(val), n)}`, `=${T(Math.pow(val, n))}`] };
        }
        let b, m, n;
        do { b = r.pick([2, 2, 3, 4, 5, 10]); m = r.int(1, 4); n = r.int(1, 4); } while (m + n > PL[b] || m + n < 3 || SKIP.has(`${b},${m},${n}`));
        return { text: 'Simplify with the Product Law, then evaluate.', q: `${b}^{${m}}\\times${b}^{${n}}`, a: [`=${b}^{${m}+${n}}`, `=${b}^{${m + n}}`, `=${T(Math.pow(b, m + n))}`] };
      },
      MAS: (r) => {
        const v = r.pick(LET);
        if (r.chance(0.5)) { // three powers, one of them a bare letter
          let parts, ex; // never n⁶ × n × n² (Assignment 3 #2(d))
          do { const e1 = r.int(2, 7), e3 = r.int(2, 6); parts = r.shuffle([`${v}^{${e1}}`, v, `${v}^{${e3}}`]); ex = parts.map((p) => (p === v ? 1 : +p.match(/\{(\d+)\}/)[1])); } while (ex.join() === '6,1,2');
          return { text: 'Simplify.', q: parts.join('\\times '), a: [`=${v}^{${ex.join('+')}}`, `=${v}^{${ex[0] + ex[1] + ex[2]}}`], atext: `${tex(v)} by itself is ${tex(`${v}^{1}`)}.` };
        }
        const [val, cap] = r.pick([[2, 7], [-2, 6], [-1, 9], [3, 4], [-3, 4], [10, 6], [-10, 5], [1, 12]]);
        let m, n; do { m = r.int(1, 5); n = r.int(1, 5); } while (m + n > cap || m + n < 3);
        const s = m + n;
        return { text: `Simplify, then evaluate when ${tex(`${v}=${val}`)}.`, q: `${pw(v, m)}\\times ${pw(v, n)}`, a: [`=${v}^{${m}+${n}}=${v}^{${s}}`, `=${par(val)}^{${s}}=${T(Math.pow(val, s))}`] };
      }
    }
  };
})());
