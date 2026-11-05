/* Math 15 · Unit 2 · Lesson 3 — Power of a Product and Power of a Quotient.
 * Warm-up (Supersize It!: a tile picture blown up 2, 3, 4, 10 times; a 2 × 2 × 2 stack of dice for the big one) and the
 * explainers:
 *   recap     (the three laws from Lessons 1–2 rebuilt by counting factor tiles; Example 1 check),
 *   pprod     (copies of a bracket, then the factors regrouped: each factor gets its own copy; (2×3)², Example 2 check),
 *   supersize (the warm-up's tiles: a square of side 2s, 3s, … has area 4s², 9s², …; half a tile; a 2 × 2 × 2 die),
 *   fence     (where an exponent reaches: 2x² vs (2x)², 5m³ vs (5m)³, Example 2(c) −4y² vs (−4y)²),
 *   pquot     (copies of a fraction: the tops multiply, the bottoms multiply; (4/5)², Example 3 check),
 *   fsq       (the area picture of a squared fraction: p by p small squares out of q by q),
 *   chain     (which law did the work? one law per line, with the five law badges; notes, Examples 4 and 5),
 *   check     (check an answer by substituting 2 for the letter; a classmate's wrong answer fails).
 * Pieces adapted from the Math 10C twin (u2l1 laws/fence, u2l2 chain/check), restyled for Math 15. */
import { h, tex, add, svgEl, mountExplainers, fmt } from '../blocks.js';
import { standup } from '../standup.js';

const at = (el, x, y) => { el.style.left = x + 'px'; el.style.top = y + 'px'; return el; };
const hide = (...els) => els.forEach((e) => { if (e) e.style.opacity = 0; });
const T = (s) => tex(s);
/* KaTeX allowing \htmlClass (parts of an expression we can find, measure and point at) */
const K = (src, display) => {
  try { return window.katex.renderToString(String(src), { displayMode: !!display, throwOnError: false, strict: 'ignore', trust: true, output: 'html' }); }
  catch (e) { return tex(src, display); }
};
const tn = (n) => fmt(n).replace(/ /g, '\\,'); // 1000 → 1\,000

/* where an element sits inside a stage, in stage pixels (the stage may be scaled to fit) */
function rel(stage, el) {
  const sr = stage.getBoundingClientRect(), k = sr.width / stage.offsetWidth || 1, r = el.getBoundingClientRect();
  return { x: (r.left - sr.left) / k - stage.clientLeft, y: (r.top - sr.top) / k - stage.clientTop, w: r.width / k, h: r.height / k };
}
const unionR = (rs) => { const x = Math.min(...rs.map((r) => r.x)), y = Math.min(...rs.map((r) => r.y)); return { x, y, w: Math.max(...rs.map((r) => r.x + r.w)) - x, h: Math.max(...rs.map((r) => r.y + r.h)) - y }; };
function relDeep(stage, el) {
  const rs = [el, ...el.querySelectorAll('*')].filter((e) => !(e instanceof SVGElement) || e.tagName === 'svg').map((e) => rel(stage, e)).filter((r) => r.w > 0.5 && r.h > 0.5);
  return rs.length ? unionR(rs) : rel(stage, el);
}
function frameAt(stage, r, cls, pad = 6) {
  const f = add(stage, h('div', 'u2l3-frame ' + (cls || '')), r.x - pad, r.y - pad);
  f.style.width = (r.w + 2 * pad) + 'px'; f.style.height = (r.h + 2 * pad) + 'px'; return f;
}
const ctr = (r) => ({ x: r.x + r.w / 2, y: r.y + r.h / 2 });
function mkRow(stage, toks, cx, y, fs) {
  const row = add(stage, h('div', 'u2l3-row'), cx, y); row.style.fontSize = fs + 'px'; row.style.translate = '-50% 0';
  const els = toks.map((t) => { const e = h('span', 'u2l3-tok ' + (t.k || 'x') + (t.cp != null ? ' c' + (t.cp % 3) : ''), K(t.t)); row.appendChild(e); return e; });
  return { row, els };
}
function flyIn(c, stage, el, from, ms = 700, delay = 0) {
  if (!from || c.fast) return c.anim(el, [{ opacity: 0 }, { opacity: 1 }], 300, { delay });
  const me = rel(stage, el), dx = from.x - (me.x + me.w / 2), dy = from.y - (me.y + me.h / 2);
  return c.anim(el, [{ opacity: 0, transform: `translate(${dx}px, ${dy}px) scale(1.5)` }, { opacity: 1, transform: `translate(${dx * 0.3}px, ${dy * 0.3 - 16}px) scale(1.2)`, offset: 0.55 }, { opacity: 1, transform: 'none' }], ms, { delay });
}
const mv = (c, el, x, y, ms = 650, delay = 0) => c.anim(el, [{ left: el.style.left, top: el.style.top }, { left: x + 'px', top: y + 'px' }], ms, { delay });
const xsAt = (n, cx, slot) => Array.from({ length: n }, (_, i) => cx + (i - (n - 1) / 2) * slot);
const tile = (stage, label, cls, x, y) => add(stage, h('div', 'u2l3-t ' + (cls || ''), K(label)), x, y);
function line(stage, src, W, y, cls) { const e = add(stage, h('div', 'u2l3-line ' + (cls || ''), src), W / 2, y); e.style.translate = '-50% 0'; hide(e); return e; }
const lawBox = (stage, name, f, W, y) => line(stage, `<b>${name}</b> ${K(f)}`, W, y, 'law');
const pw = (b, e) => (e === 1 ? b : `${b}^{${e}}`);

/* ======================= 1. Recap: the three laws you know, by counting factors ======================= */
const SLOT = 80;
const RECAP = {
  prod: { kind: 'prod', b: '6', m: 3, n: 2, num: true },
  quot: { kind: 'quot', b: '6', m: 5, n: 2, num: true },
  ppow: { kind: 'ppow', b: '6', m: 3, n: 2, num: true },
  e1a: { kind: 'prod', b: 'x', m: 3, n: 4, ex: '(a)' },
  e1b: { kind: 'quot', b: 'y', m: 7, n: 2, ex: '(b)' },
  e1c: { kind: 'ppow', b: 'm', m: 2, n: 3, ex: '(c)' }
};
const recHead = (d) => (d.kind === 'prod' ? `${d.b}^{${d.m}}\\times ${d.b}^{${d.n}}` : d.kind === 'quot' ? `${d.b}^{${d.m}}\\div ${d.b}^{${d.n}}` : `\\left(${d.b}^{${d.m}}\\right)^{${d.n}}`);
const recap = {
  title: 'Every law is just counting factors',
  height: 500,
  minW: 900,
  choices: [{ v: 'prod', label: 'Product' }, { v: 'quot', label: 'Quotient' }, { v: 'ppow', label: 'Power of a Power' },
    { sep: 'Example 1 check:' }, ...['e1a', 'e1b', 'e1c'].map((v) => ({ v, label: T(recHead(RECAP[v])) }))],
  intro: (v) => `Write ${T(recHead(RECAP[v]))} out as repeated multiplication, then count the factors.`,
  make(stage, v, ex) {
    const W = ex.W, d = RECAP[v], b = d.b;
    const head = add(stage, h('div', 'u2l3-head', K(recHead(d))), W / 2, 10); head.style.translate = '-50% 0';
    const S = (d.kind === 'prod' ? recProduct : d.kind === 'quot' ? recQuotient : recPower)(stage, W, d);
    const vb = 'c', law = { prod: ['Product Law', 'a^{m}\\times a^{n}=a^{m+n}'], quot: ['Quotient Law', 'a^{m}\\div a^{n}=a^{m-n}'], ppow: ['Power of a Power Law', '(a^{m})^{n}=a^{mn}'] }[d.kind];
    const res = line(stage, K(S.res), W, 336, 'res');
    const vr = d.num ? line(stage, K(S.vr(vb)), W, 388) : null;
    const lb = lawBox(stage, law[0], law[1], W, 440);
    const steps = [
      { cap: S.caps[0], run: S.s1 },
      { cap: S.caps[1], run: S.s2 },
      { cap: S.caps[2], run: (c) => Promise.all([S.s3(c), c.fadeIn(res, 400, { delay: 300 })]) }
    ];
    if (d.num) steps.push({ cap: `The base doesn’t matter. With a variable: ${T(S.vr(vb))}.`, run: (c) => c.fadeIn(vr, 400) });
    steps.push({ cap: S.caps[3], run: (c) => c.pop(lb, 450) });
    return steps;
  }
};
function groupBox(stage, xs, y, label, cls) {
  const x0 = xs[0] - SLOT / 2 + 4, w = xs.length * SLOT - 8;
  const bx = add(stage, h('div', 'u2l3-box ' + (cls || '')), x0, y - 40); bx.style.width = w + 'px'; bx.style.height = '80px';
  const l = add(stage, h('div', 'u2l3-blab ' + (cls || ''), K(label)), x0 + w / 2, y - 46); l.style.translate = '-50% -100%';
  hide(bx, l); return [bx, l];
}
const timesSigns = (stage, xs, y) => xs.slice(1).map((x) => { const e = add(stage, h('div', 'u2l3-x', '×'), x - SLOT / 2, y); hide(e); return e; });
function badges(stage, tiles) { return tiles.map((t, i) => { const bd = add(stage, h('div', 'u2l3-badge', String(i + 1)), 0, 0); hide(bd); bd._t = t; return bd; }); }
const placeBadges = (bs) => bs.forEach((bd) => at(bd, parseFloat(bd._t.style.left) + 20, parseFloat(bd._t.style.top) - 24));
async function popBadges(c, bs) { placeBadges(bs); for (const bd of bs) await c.pop(bd, 180); }
function recProduct(stage, W, d) {
  const { b, m, n } = d, y = 190, gap = 70, total = (m + n) * SLOT + gap, x0 = W / 2 - total / 2;
  const A = Array.from({ length: m }, (_, i) => x0 + SLOT / 2 + i * SLOT), B = Array.from({ length: n }, (_, i) => x0 + m * SLOT + gap + SLOT / 2 + i * SLOT);
  const ta = A.map((x) => tile(stage, b, 'a', x, y)), tb = B.map((x) => tile(stage, b, 'b', x, y)), all = [...ta, ...tb]; hide(...all);
  const ba = groupBox(stage, A, y, `${b}^{${m}}`, 'a'), bb = groupBox(stage, B, y, `${b}^{${n}}`, 'b');
  const mid = add(stage, h('div', 'u2l3-x big', '×'), x0 + m * SLOT + gap / 2, y); hide(mid);
  const F = xsAt(m + n, W / 2, SLOT), xs = timesSigns(stage, F, y), bs = badges(stage, all);
  return {
    res: `${b}^{${m}}\\times ${b}^{${n}}=${b}^{${m}+${n}}=${b}^{${m + n}}`,
    vr: (c) => `${c}^{${m}}\\times ${c}^{${n}}=${c}^{${m + n}}`,
    caps: [`${T(`${b}^{${m}}`)} is <b>${m}</b> factors of ${T(b)}; ${T(`${b}^{${n}}`)} is <b>${n}</b> factors of ${T(b)}.`,
      'Multiplying the two powers just puts <b>all</b> the factors in one long row.',
      `Count them: ${m} + ${n} = <b>${m + n}</b> factors of ${T(b)}. So ${T(`${b}^{${m}}\\times ${b}^{${n}}=${b}^{${m + n}}`)}.${d.ex ? ` That’s Example 1${d.ex}.` : ''}`,
      '<b>Product Law:</b> multiplying powers with the <b>same base</b>? Keep the base and <b>add</b> the exponents.'],
    s1: (c) => Promise.all([...ba, ...bb].map((e) => c.fadeIn(e, 350)).concat(all.map((t, i) => c.pop(t, 320, { delay: 150 + i * 80 })), [c.fadeIn(mid, 300)])),
    s2: (c) => Promise.all([...ba, ...bb, mid].map((e) => c.anim(e, [{ opacity: 1 }, { opacity: 0 }], 300)).concat(all.map((t, i) => mv(c, t, F[i], y, 700, 150 + i * 60)), xs.map((e, i) => c.fadeIn(e, 300, { delay: 800 + i * 40 })))),
    s3: (c) => popBadges(c, bs)
  };
}
function recQuotient(stage, W, d) {
  const { b, m, n } = d, yT = 150, yB = 236, top = xsAt(m, W / 2, SLOT), bot = top.slice(m - n);
  const tt = top.map((x) => tile(stage, b, 'a', x, yT)), tb = bot.map((x) => tile(stage, b, 'b', x, yB));
  const bar = add(stage, h('div', 'u2l3-bar'), top[0] - SLOT / 2, (yT + yB) / 2 - 2); bar.style.width = m * SLOT + 'px';
  const lt = add(stage, h('div', 'u2l3-side', K(`${b}^{${m}}`)), top[0] - SLOT / 2 - 18, yT), lb = add(stage, h('div', 'u2l3-side', K(`${b}^{${n}}`)), top[0] - SLOT / 2 - 18, yB);
  [lt, lb].forEach((e) => { e.style.translate = '-100% -50%'; });
  hide(...tt, ...tb, bar, lt, lb);
  return {
    res: `${b}^{${m}}\\div ${b}^{${n}}=${b}^{${m}-${n}}=${b}^{${m - n}}`,
    vr: (c) => `${c}^{${m}}\\div ${c}^{${n}}=${c}^{${m - n}}`,
    caps: [`${T(`${b}^{${m}}\\div ${b}^{${n}}`)} as a fraction: <b>${m}</b> factors of ${T(b)} on top, <b>${n}</b> on the bottom.`,
      `Each ${T(b)} on the bottom cancels one ${T(b)} on top, because ${T(`${b}\\div ${b}=1`)}.`,
      `${m - n} are left: ${m} − ${n} = <b>${m - n}</b>. So ${T(`${b}^{${m}}\\div ${b}^{${n}}=${b}^{${m - n}}`)}.${d.ex ? ` That’s Example 1${d.ex}.` : ''}`,
      '<b>Quotient Law:</b> dividing powers with the <b>same base</b>? Keep the base and <b>subtract</b> the exponents.'],
    s1: (c) => Promise.all([c.fadeIn(bar, 300), c.fadeIn(lt, 300), c.fadeIn(lb, 300), ...tt.map((t, i) => c.pop(t, 300, { delay: i * 70 })), ...tb.map((t, i) => c.pop(t, 300, { delay: 450 + i * 80 }))]),
    s2: async (c) => {
      for (let i = 0; i < n; i++) {
        const a = tt[m - n + i], bb = tb[i]; a.classList.add('gone'); bb.classList.add('gone');
        await Promise.all([c.anim(a, [{ opacity: 1 }, { opacity: 0.3 }], 420), c.anim(bb, [{ opacity: 1 }, { opacity: 0.3 }], 420)]);
      }
    },
    s3: (c) => Promise.all(tt.slice(0, m - n).map((t, i) => { t.classList.add('keep'); return c.anim(t, [{ transform: 'scale(1)' }, { transform: 'scale(1.18)' }, { transform: 'scale(1)' }], 380, { delay: i * 110 }); }))
  };
}
function recPower(stage, W, d) {
  const { b, m, n } = d, y = 190, gap = 34, total = n * m * SLOT + (n - 1) * gap, x0 = W / 2 - total / 2;
  const groups = Array.from({ length: n }, (_, g) => Array.from({ length: m }, (_, i) => x0 + g * (m * SLOT + gap) + SLOT / 2 + i * SLOT));
  const tiles = groups.map((xs, g) => xs.map((x) => tile(stage, b, g % 2 ? 'b' : 'a', x, y))), all = tiles.flat(); hide(...all);
  const boxes = groups.map((xs, g) => groupBox(stage, xs, y, `${b}^{${m}}`, g % 2 ? 'b' : 'a'));
  const G = xsAt(m, W / 2, SLOT), rowY = n === 2 ? [150, 236] : [110, 190, 270];
  const labs = rowY.map((ry, g) => { const e = add(stage, h('div', 'u2l3-side ' + (g % 2 ? 'b' : 'a'), `copy ${g + 1}`), G[0] - SLOT / 2 - 20, ry); e.style.translate = '-100% -50%'; hide(e); return e; });
  const bs = badges(stage, all);
  return {
    res: `\\left(${b}^{${m}}\\right)^{${n}}=${b}^{${m}\\times${n}}=${b}^{${m * n}}`,
    vr: (c) => `\\left(${c}^{${m}}\\right)^{${n}}=${c}^{${m * n}}`,
    caps: [`${T(`\\left(${b}^{${m}}\\right)^{${n}}`)} means <b>${n} copies</b> of ${T(`${b}^{${m}}`)}, multiplied.`,
      `Stack the copies: <b>${n} groups</b> of <b>${m} factors</b> each.`,
      `${n} × ${m} = <b>${m * n}</b> factors of ${T(b)}. So ${T(`\\left(${b}^{${m}}\\right)^{${n}}=${b}^{${m * n}}`)}.${d.ex ? ` That’s Example 1${d.ex}.` : ''}`,
      '<b>Power of a Power Law:</b> <b>multiply</b> the exponents. (The Product Law <b>adds</b> them. Don’t mix them up!)'],
    s1: (c) => Promise.all(boxes.flat().map((e) => c.fadeIn(e, 350)).concat(all.map((t, i) => c.pop(t, 300, { delay: 150 + i * 70 })))),
    s2: (c) => {
      const jobs = boxes.map(([, l]) => c.anim(l, [{ opacity: 1 }, { opacity: 0 }], 250));
      boxes.forEach(([bx], g) => jobs.push(mv(c, bx, G[0] - SLOT / 2 + 4, rowY[g] - 40, 700, 100)));
      tiles.forEach((row, g) => row.forEach((t, i) => jobs.push(mv(c, t, G[i], rowY[g], 700, 100 + g * 60))));
      labs.forEach((e, g) => jobs.push(c.fadeIn(e, 300, { delay: 800 + g * 60 })));
      return Promise.all(jobs);
    },
    s3: (c) => popBadges(c, bs)
  };
}

/* ======================= 2. Power of a Product: every factor gets its own copy ======================= */
const PP = {
  xy: { f: ['x', 'y'], n: 3 },
  n23: { f: ['2', '3'], n: 2, numeric: true },
  e2a: { f: ['3', 'x'], n: 2, ex: '(a)' },
  e2b: { f: ['2', 'm'], n: 4, ex: '(b)' },
  e2c: { f: ['-4', 'y'], n: 2, ex: '(c)' },
  e2d: { f: ['2', 'a', 'b'], n: 3, ex: '(d)' }
};
const isNum = (s) => /^-?\d+$/.test(s);
const ppInside = (d) => (d.numeric ? d.f.join('\\times ') : d.f.join(''));
const ppHead = (d) => `(${ppInside(d)})^{${d.n}}`;
const fp = (s, n) => (s[0] === '-' ? `(${s})^{${n}}` : `${s}^{${n}}`); // one factor to a power, negatives in brackets
const pprod = {
  title: 'Each factor gets its own copy',
  height: 470,
  minW: 900,
  choices: [{ v: 'xy', label: T('(xy)^{3}') }, { v: 'n23', label: T('(2\\times3)^{2}') },
    { sep: 'Example 2 check:' }, ...['e2a', 'e2b', 'e2c', 'e2d'].map((v) => ({ v, label: T(ppHead(PP[v])) }))],
  intro: (v) => `${T(ppHead(PP[v]))}: the exponent ${PP[v].n} sits outside the brackets. Which factors does it reach?`,
  make(stage, v, ex) {
    const W = ex.W, d = PP[v], n = d.n, k = d.f.length, wide = d.f.some((s) => s.length > 1), S = wide ? 90 : 78;
    const head = add(stage, h('div', 'u2l3-head', K(ppHead(d))), W / 2, 10); head.style.translate = '-50% 0';
    const y = 176, gw = k * S + 30, GG = 26, total = n * gw + (n - 1) * GG, x0 = W / 2 - total / 2;
    const cls = ['a', 'b', 'c'];
    const groups = [], pars = [], dots = [], inner = [];
    for (let g = 0; g < n; g++) {
      const gx = x0 + g * (gw + GG);
      const p = add(stage, h('div', 'u2l3-par'), gx, y - 40); p.style.width = gw + 'px'; p.style.height = '80px'; pars.push(p);
      groups.push(d.f.map((s, j) => tile(stage, s, cls[j] + (wide ? ' wide' : ''), gx + 15 + S / 2 + j * S, y)));
      d.f.slice(1).forEach((_, j) => inner.push(add(stage, h('div', 'u2l3-x', '·'), gx + 15 + (j + 1) * S, y)));
      if (g) dots.push(add(stage, h('div', 'u2l3-x', '·'), gx - GG / 2, y));
    }
    hide(...groups.flat(), ...pars, ...dots, ...inner);
    // gathered: one segment per factor
    const SG = 64, tot2 = k * n * S + (k - 1) * SG, g0 = W / 2 - tot2 / 2;
    const segX = d.f.map((_, j) => Array.from({ length: n }, (_, i) => g0 + j * (n * S + SG) + S / 2 + i * S));
    const segSigns = segX.flatMap((xs) => xs.slice(1).map((x) => { const e = add(stage, h('div', 'u2l3-x', '×'), x - S / 2, y); hide(e); return e; }));
    const segDots = segX.slice(1).map((xs) => { const e = add(stage, h('div', 'u2l3-x big', '·'), xs[0] - S / 2 - SG / 2, y); hide(e); return e; });
    const unders = d.f.map((s, j) => { const cx = (segX[j][0] + segX[j][n - 1]) / 2; const e = add(stage, h('div', 'u2l3-under ' + cls[j], K(fp(s, n))), cx, y + 54); e.style.translate = '-50% 0'; hide(e); return e; });
    // the result
    const powsT = d.numeric ? d.f.map((s) => fp(s, n)).join('\\times ') : d.f.map((s) => fp(s, n)).join('');
    const coef = d.f.filter(isNum).reduce((p, s) => p * Math.pow(+s, n), 1), letters = d.f.filter((s) => !isNum(s));
    const finalT = d.numeric ? String(coef) : (d.f.some(isNum) ? tn(coef) : '') + letters.map((s) => `${s}^{${n}}`).join('');
    const hasNum = d.f.some(isNum);
    const resT = `${ppHead(d)}=${powsT}` + (hasNum ? `=${d.numeric ? d.f.map((s) => Math.pow(+s, n)).join('\\times ') + '=' : ''}${finalT}` : '');
    const res = line(stage, K(resT), W, 290, 'res');
    const res2 = d.numeric ? line(stage, K(`(2\\times3)^{2}=6^{2}=36`), W, 340) : null;
    const lb = lawBox(stage, 'Power of a Product Law', '(ab)^{n}=a^{n}b^{n}', W, 392);
    const names = d.f.map((s) => (isNum(s) ? s.replace('-', '−') : T(s)));
    const listT = names.length === 2 ? `${names[0]} and ${names[1]}` : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
    const numF = d.f.find(isNum);
    const steps = [
      { cap: `${T(ppHead(d))} means <b>${n} copies</b> of ${T(`(${ppInside(d)})`)}, multiplied together.`,
        run: (c) => Promise.all([...pars.map((p, i) => c.fadeIn(p, 300, { delay: i * 160 })), ...dots.map((e, i) => c.fadeIn(e, 300, { delay: 200 + i * 160 })), ...inner.map((e) => c.fadeIn(e, 300, { delay: 150 })),
          ...groups.flatMap((g, i) => g.map((t, j) => c.pop(t, 300, { delay: i * 160 + j * 60 })))]) },
      { cap: `Multiplying can be done in <b>any order</b>. Gather the ${listT} into their own groups.`,
        run: (c) => Promise.all([...pars, ...dots, ...inner].map((e) => c.anim(e, [{ opacity: 1 }, { opacity: 0 }], 300))
          .concat(d.f.flatMap((_, j) => groups.map((g, i) => mv(c, g[j], segX[j][i], y, 750, 150 + i * 70 + j * 40))), [...segSigns, ...segDots].map((e) => c.fadeIn(e, 300, { delay: 950 })))) },
      { cap: `${n} copies of each one: ${T(`${ppHead(d)}=${powsT}`)}. The exponent reached <b>every</b> factor inside the brackets.`,
        run: (c) => Promise.all(unders.map((e, i) => c.fadeIn(e, 350, { delay: i * 150 }))) }
    ];
    if (d.numeric) steps.push({ cap: `Work it out: ${T('2^{2}\\times3^{2}=4\\times9=36')}. And the short way, ${T('(2\\times3)^{2}=6^{2}=36')}. <b>Same answer!</b>`, run: (c) => Promise.all([c.fadeIn(res, 400), c.fadeIn(res2, 400, { delay: 400 })]) });
    else if (hasNum) steps.push({ cap: (numF[0] === '-' ? `${T(`(${numF})^{${n}}=(${numF})(${numF})=${Math.pow(+numF, n)}`)}: two negatives make a <b>positive</b>.` : `Work out the number: ${T(`${numF}^{${n}}=${Array(n).fill(numF).join('\\times ')}=${tn(Math.pow(+numF, n))}`)}.`) + ` So ${T(`${ppHead(d)}=${finalT}`)}.${d.ex ? ` (Example 2${d.ex}.)` : ''}`, run: (c) => c.fadeIn(res, 400) });
    else steps[2].run = (c) => Promise.all([...unders.map((e, i) => c.fadeIn(e, 350, { delay: i * 150 })), c.fadeIn(res, 400, { delay: 300 })]);
    steps.push({ cap: '<b>Power of a Product Law:</b> give the outer exponent to <b>each factor</b> inside the brackets, numbers too.', run: (c) => c.pop(lb, 450) });
    return steps;
  }
};

/* ======================= 2. Back to the warm-up: supersize a tile ======================= */
const SS = { k2: { k: 2 }, k3: { k: 3 }, k4: { k: 4 }, k10: { k: 10 }, half: { half: true }, cube: { cube: true } };
const ssLabel = (v) => (v === 'half' ? T('\\left(\\tfrac{s}{2}\\right)^{2}') : v === 'cube' ? T('(2s)^{3}') : T(`(${SS[v].k}s)^{2}`));
const PAPER = '#ffecb3', EDGE = '#c88c14', INKC = '#1e2d46';
function smiley(g, x, y, s, o = {}) {
  const r = svgEl('rect', { x, y, width: s, height: s, fill: o.fill || PAPER, stroke: EDGE, 'stroke-width': Math.max(0.8, s / 40) }, g);
  if (s >= 22) {
    svgEl('circle', { cx: x + 0.36 * s, cy: y + 0.38 * s, r: 0.07 * s, fill: INKC }, g);
    svgEl('circle', { cx: x + 0.64 * s, cy: y + 0.38 * s, r: 0.07 * s, fill: INKC }, g);
    const rr = 0.235 * s, cx = x + 0.5 * s, cy = y + 0.52 * s;
    svgEl('path', { d: `M ${cx - rr * Math.cos(Math.PI / 9)} ${cy + rr * Math.sin(Math.PI / 9)} A ${rr} ${rr} 0 0 0 ${cx + rr * Math.cos(Math.PI / 9)} ${cy + rr * Math.sin(Math.PI / 9)}`, fill: 'none', stroke: INKC, 'stroke-width': Math.max(1, s / 30), 'stroke-linecap': 'round' }, g);
  }
  return r;
}
function die(g, X, Y, s) { // a unit die in oblique view; (X, Y) = bottom-left of the front face (SVG coords)
  const dx = s * 0.4, dy = s * 0.3, el = svgEl('g', {}, g);
  svgEl('path', { d: `M ${X + s} ${Y} l ${dx} ${-dy} l 0 ${-s} l ${-dx} ${dy} z`, fill: '#efc77a', stroke: EDGE, 'stroke-width': 1.4 }, el);
  svgEl('path', { d: `M ${X} ${Y - s} l ${dx} ${-dy} l ${s} 0 l ${-dx} ${dy} z`, fill: '#fff2cf', stroke: EDGE, 'stroke-width': 1.4 }, el);
  svgEl('rect', { x: X, y: Y - s, width: s, height: s, fill: PAPER, stroke: EDGE, 'stroke-width': 1.4 }, el);
  svgEl('circle', { cx: X + s / 2, cy: Y - s / 2, r: s * 0.09, fill: INKC }, el);
  return el;
}
export function diceStack(g, n, s, X0, Y0) { // n × n × n dice, back layers first; returns them in drawing order
  const out = [];
  for (let z = n - 1; z >= 0; z--) for (let yy = 0; yy < n; yy++) for (let x = 0; x < n; x++) {
    const d = die(g, X0 + x * s + z * s * 0.4, Y0 - yy * s - z * s * 0.3, s); d.dataset.layer = yy; out.push(d);
  }
  return out;
}
const supersize = {
  title: 'Supersize a tile',
  height: 440,
  minW: 900,
  choices: [{ v: 'k2', label: ssLabel('k2') }, { v: 'k3', label: ssLabel('k3') }, { v: 'k4', label: ssLabel('k4') }, { v: 'k10', label: ssLabel('k10') },
    { sep: 'Shrink it:' }, { v: 'half', label: ssLabel('half') }, { sep: 'The dice:' }, { v: 'cube', label: ssLabel('cube') }],
  intro: (v) => (v === 'half' ? `Shrink the tile to <b>half</b> as wide and half as tall. What is its area?` : v === 'cube' ? `Stack dice 2 long, 2 wide and 2 tall. What is the volume?` : `Blow the tile up ${SS[v].k} times as wide and ${SS[v].k} times as tall. What is its area?`),
  make(stage, v, ex) {
    const W = ex.W, d = SS[v], P = 340, X0 = 60, Y0 = 40, TX = 470;
    const svg = add(stage, svgEl('svg', { width: P + 80, height: P + 70, viewBox: `-40 -10 ${P + 80} ${P + 70}`, class: 'u2l3-ssvg' }), X0 - 40, Y0 - 10);
    const g = svgEl('g', {}, svg);
    const lines = (arr, gap = 70) => arr.map((src, i) => { const e = add(stage, h('div', 'u2l3-ssl', K(src)), TX, 40 + i * gap); hide(e); return e; });
    const lb = add(stage, h('div', 'u2l3-line law', '<b>Power of a ' + (d.half ? 'Quotient' : 'Product') + ' Law</b> ' + K(d.half ? '\\left(\\dfrac{a}{b}\\right)^{n}=\\dfrac{a^{n}}{b^{n}}' : '(ab)^{n}=a^{n}b^{n}')), TX, d.half ? 340 : d.cube ? 336 : 384); hide(lb);
    if (d.cube) {
      const s = 110, bx = 60, by = 300, one = die(g, bx, by, s); hide(one);
      const lab1 = add(stage, h('div', 'u2l3-sstag', 'one die: volume ' + K('s^{3}')), X0 + 20, Y0 + 300); hide(lab1);
      const g2 = svgEl('g', {}, g), dice = diceStack(g2, 2, s / 1.0 * 0.95, bx, by); hide(...dice);
      const L = lines(['(2s)^{3}=(2s)(2s)(2s)', '=2^{3}s^{3}', '=8s^{3}', '(10s)^{3}=10^{3}s^{3}=1\\,000s^{3}']);
      return [
        { cap: `One normal die has side ${T('s')}. Its volume is ${T('s\\times s\\times s=s^{3}')}.`, run: (c) => Promise.all([c.pop(one, 400), c.fadeIn(lab1, 300)]) },
        { cap: `Make it <b>2 times</b> as long, as wide <b>and</b> as tall: side ${T('2s')}. Fill it with normal dice, one layer at a time.`,
          run: async (c) => { await c.anim(one, [{ opacity: 1 }, { opacity: 0 }], 250); lab1.style.opacity = 0; await Promise.all(dice.map((e, i) => c.pop(e, 300, { delay: (+e.dataset.layer) * 500 + (i % 4) * 90 }))); } },
        { cap: `Two layers of ${T('2\\times2')}: <b>8 dice</b>. In symbols, the cube goes to the 2 <b>and</b> to the ${T('s')}: ${T('(2s)^{3}=2^{3}s^{3}=8s^{3}')}.`, run: (c) => Promise.all(L.slice(0, 3).map((e, i) => c.fadeIn(e, 350, { delay: i * 250 }))) },
        { cap: `The warm-up’s giant die: ${T('(10s)^{3}=10^{3}s^{3}=1\\,000s^{3}')}. That’s why <b>1 000</b> normal dice fit inside!`, run: (c) => c.fadeIn(L[3], 400) },
        { cap: '<b>Power of a Product Law:</b> the outer exponent goes to <b>every</b> factor inside the brackets.', run: (c) => c.pop(lb, 450) }
      ];
    }
    if (d.half) {
      const big = smiley(g, 0, 0, P), bl = add(stage, h('div', 'u2l3-sstag', 'one tile: area ' + K('s^{2}')), X0 + P / 2, Y0 + P + 12); bl.style.translate = '-50% 0';
      const sh = svgEl('rect', { x: 0, y: P / 2, width: P / 2, height: P / 2, class: 'u2l3-ssh' }, g);
      const gl = svgEl('path', { d: `M ${P / 2} 0 V ${P} M 0 ${P / 2} H ${P}`, class: 'u2l3-ssgl' }, g);
      const side = add(stage, h('div', 'u2l3-sstag red', 'side ' + K('\\tfrac{s}{2}')), X0 + P / 4, Y0 + P / 2 + 8); side.style.translate = '-50% 0';
      hide(big, bl, sh, gl, side);
      const L = lines(['\\left(\\dfrac{s}{2}\\right)^{2}=\\dfrac{s}{2}\\cdot\\dfrac{s}{2}', '=\\dfrac{s\\cdot s}{2\\cdot2}=\\dfrac{s^{2}}{2^{2}}', '=\\dfrac{s^{2}}{4}'], 96);
      return [
        { cap: `Start with one tile: side ${T('s')}, area ${T('s^{2}')}.`, run: (c) => Promise.all([c.pop(big, 400), c.fadeIn(bl, 300)]) },
        { cap: `Shrink it to <b>half</b> as wide and <b>half</b> as tall: side ${T('\\tfrac{s}{2}')}.`, run: (c) => Promise.all([c.fadeIn(gl, 300), c.pop(sh, 450, { delay: 200 }), c.fadeIn(side, 300, { delay: 400 })]) },
        { cap: `The small square covers <b>1</b> of the <b>4</b> quarters: its area is ${T('\\tfrac{s^{2}}{4}')}, a quarter tile. The square went to the top <b>and</b> the bottom: ${T('\\left(\\tfrac{s}{2}\\right)^{2}=\\tfrac{s^{2}}{2^{2}}')}.`, run: (c) => Promise.all(L.map((e, i) => c.fadeIn(e, 350, { delay: i * 250 }))) },
        { cap: '<b>Power of a Quotient Law</b> (Section 3): raise the top and the bottom to the power.', run: (c) => c.pop(lb, 450) }
      ];
    }
    const k = d.k, t = P / k, tiles = [];
    const one = smiley(g, 0, P - t, t); hide(one);
    for (let r = 0; r < k; r++) for (let q = 0; q < k; q++) { if (!r && !q) continue; const e = smiley(g, q * t, P - (r + 1) * t, t); e.dataset.r = r; hide(e); tiles.push(e); }
    const faces = [...g.querySelectorAll('circle, path')]; faces.forEach((e) => { e.style.opacity = 0; }); // the smiles follow their tile
    const lab1 = add(stage, h('div', 'u2l3-sstag', 'side ' + K('s')), X0 + t / 2, Y0 + P + 8); lab1.style.translate = '-50% 0'; hide(lab1);
    const outline = svgEl('rect', { x: 0, y: 0, width: P, height: P, class: 'u2l3-ssout' }, g); hide(outline);
    const sb = add(stage, h('div', 'u2l3-sstag blue', 'side ' + K(`${k}s`)), X0 + P / 2, Y0 + P + 8); sb.style.translate = '-50% 0';
    const sl = add(stage, h('div', 'u2l3-sstag blue', K(`${k}s`)), X0 - 12, Y0 + P / 2); sl.style.translate = '-100% -50%';
    hide(sb, sl);
    const row = svgEl('rect', { x: -3, y: P - t - 3, width: P + 6, height: t + 6, class: 'u2l3-ssrow' }, g); hide(row);
    const sam = add(stage, h('div', 'u2l3-sstag red', K(`${k}s^{2}`) + ` is only ${k} tiles`), X0 + P + 16, Y0 + P - t / 2); sam.style.translate = '0 -50%'; hide(sam);
    const L = lines([`(${k}s)^{2}=(${k}s)(${k}s)`, `=${k}\\cdot${k}\\cdot s\\cdot s`, `=${k}^{2}s^{2}=${tn(k * k)}s^{2}`]);
    const facesOf = (el) => { const out = []; let n = el.nextElementSibling; while (n && n.tagName !== 'rect') { out.push(n); n = n.nextElementSibling; } return out; };
    const showTile = (c, el, delay) => Promise.all([c.pop(el, 300, { delay }), ...facesOf(el).map((f) => c.anim(f, [{ opacity: 0 }, { opacity: 1 }], 200, { delay: delay + 120 }))]);
    return [
      { cap: `One tile has side ${T('s')}, so its area is ${T('s^{2}')}.`, run: (c) => Promise.all([showTile(c, one, 0), c.fadeIn(lab1, 300)]) },
      { cap: `Supersize it: <b>${k} times</b> as wide <b>and</b> ${k} times as tall. The new side is ${T(`${k}s`)}. Fill it with tiles.`,
        run: (c) => { lab1.style.opacity = 0; return Promise.all([c.fadeIn(outline, 300), c.fadeIn(sb, 300), c.fadeIn(sl, 300), ...tiles.map((e) => showTile(c, e, (+e.dataset.r) * (k > 4 ? 120 : 350) + 200))]); } },
      { cap: `${k} rows of ${k}: <b>${k * k} tiles</b>. In symbols, the square goes to the ${k} <b>and</b> to the ${T('s')}: ${T(`(${k}s)^{2}=${k}^{2}s^{2}=${tn(k * k)}s^{2}`)}.`, run: (c) => Promise.all(L.map((e, i) => c.fadeIn(e, 350, { delay: i * 250 }))) },
      { cap: `Sam’s mistake from the warm-up: ${T(`${k}s^{2}`)} squares only the ${T('s')}. That’s just <b>${k} tiles</b>, one row. The ${k} needs squaring too.`, run: (c) => Promise.all([c.fadeIn(row, 300), c.fadeIn(sam, 350, { delay: 150 })]) },
      { cap: '<b>Power of a Product Law:</b> the outer exponent goes to <b>every</b> factor inside the brackets.', run: (c) => c.pop(lb, 450) }
    ];
  }
};

/* ======================= 2. Where does the exponent reach? (the fence) ======================= */
const O = (t) => ({ o: t });
const E = (b, e, p = false, show) => ({ b: [].concat(b), e, p, show });
function fenceTex(terms, marks) {
  return terms.map((t) => {
    if (t.o) return marks ? `\\htmlClass{f-o}{${t.o}}` : t.o;
    const inner = (t.p ? '(' : '') + t.b.join('') + (t.p ? ')' : '');
    return marks ? `\\htmlClass{f-i}{${inner}}^{\\htmlClass{f-e}{${t.e}}}` : `${inner}^{${t.e}}`;
  }).join(marks ? '\\mkern1.5mu ' : '');
}
const X = { t: '\\times', k: 'x' }, Pt = (ch) => ({ t: ch, k: 'x' });
function fenceRows(terms) {
  const r1 = [], r2 = [], multi = terms.some((t) => t.p && t.b.length > 1);
  let oi = 0;
  terms.forEach((t) => {
    const g1 = [], g2 = [];
    if (t.o) { g1.push({ t: t.o, k: 'o', src: oi }); g2.push({ t: t.o, k: 'o', src: oi }); oi++; }
    else for (let c = 0; c < t.e; c++) {
      if (c) { g1.push(X); g2.push(X); }
      const whole = t.p ? `(${t.b.join('')})` : t.b[0];
      g1.push({ t: whole, k: 'i', cp: c });
      if (t.p && t.b.length > 1) (t.show || t.b).forEach((a, j) => { if (j) g2.push(X); g2.push({ t: a, k: 'i', cp: c }); });
      else g2.push({ t: whole, k: 'i', cp: c });
    }
    if (r1.length) { r1.push(X); r2.push(X); }
    r1.push(...g1); r2.push(...g2);
  });
  return multi ? [r1, r2] : [r1];
}
const FENCE = [
  { v: 'a1', terms: [O('2'), E('x', 2)], fc: `No brackets, so the exponent <b>2</b> reaches only the ${T('x')}. The 2 in front sits outside the fence: it is a coefficient.`, res: '=2x^{2}', rc: `Only the ${T('x')} is repeated. The 2 appears <b>once</b>: ${T('2x^{2}=2\\times x\\times x')}.` },
  { v: 'a2', terms: [E(['2', 'x'], 2, true)], fc: `The brackets put ${T('2x')} inside the fence, so the exponent 2 reaches the 2 <b>and</b> the ${T('x')}.`, res: '=(2\\times2)(x\\times x)=4x^{2}', rc: `Group the like factors: two 2s make 4 and two ${T('x')}’s make ${T('x^{2}')}. So ${T('(2x)^{2}=4x^{2}')}, not ${T('2x^{2}')}!` },
  { v: 'a3', terms: [O('5'), E('m', 3)], fc: `No brackets: the exponent <b>3</b> reaches only the ${T('m')}. The 5 is outside the fence.`, res: '=5m^{3}', rc: `${T('5m^{3}=5\\times m\\times m\\times m')}: one 5, three ${T('m')}’s.` },
  { v: 'a4', terms: [E(['5', 'm'], 3, true)], fc: `The brackets put ${T('5m')} inside the fence: the 5 and the ${T('m')} both get cubed.`, res: '=(5\\times5\\times5)(m\\times m\\times m)=125m^{3}', rc: `Three 5s make 125: ${T('(5m)^{3}=125m^{3}')}. Compare ${T('5m^{3}')}: the brackets make all the difference.` },
  { v: 'c1', terms: [O('-4'), E('y', 2)], fc: `No brackets: the exponent <b>2</b> reaches only the ${T('y')}. The −4 sits outside the fence.`, res: '=-4y^{2}', rc: `${T('-4y^{2}=-4\\times y\\times y')}. The −4 is used once, so the answer stays negative.` },
  { v: 'c2', terms: [E(['-4', 'y'], 2, true, ['(-4)', 'y'])], fc: `The brackets put ${T('-4y')} inside the fence: the −4 <b>and</b> the ${T('y')} get squared.`, res: '=(-4)(-4)(y\\times y)=16y^{2}', rc: `Two negatives make a positive: ${T('(-4)^{2}=16')}. So ${T('(-4y)^{2}=16y^{2}')}. That’s Example 2(c).` }
];
const fence = {
  title: 'Where does the exponent reach?',
  height: 400,
  choices: FENCE.flatMap((s) => (s.v === 'c1' ? [{ sep: 'Example 2(c):' }] : []).concat([{ v: s.v, label: T(fenceTex(s.terms, false)) }])),
  intro: (v) => `Where is the fence in ${T(fenceTex(FENCE.find((s) => s.v === v).terms, false))}? The exponent repeats only what is <b>inside</b> it.`,
  make(stage, v, ex) {
    const s = FENCE.find((q) => q.v === v), W = ex.W, ins = s.terms.find((t) => t.b), e = ins.e;
    const e0 = add(stage, h('div', 'u2l3-fz', K(fenceTex(s.terms, true))), W / 2, 40); e0.style.translate = '-50% 0';
    const rows = fenceRows(s.terms).map((toks, i) => { const r = mkRow(stage, [Pt('='), ...toks], W / 2, 196 + i * 66, 34); r.toks = [Pt('='), ...toks]; hide(...r.els); return r; });
    const res = add(stage, h('div', 'u2l3-fzres', K(s.res)), W / 2, 196 + rows.length * 66 + 6); res.style.translate = '-50% 0'; hide(res);
    const hasOut = s.terms.some((t) => t.o);
    let fenceR = null, outR = [];
    const measure = () => { fenceR = relDeep(stage, e0.querySelector('.f-i')); outR = [...e0.querySelectorAll('.f-o')].map((el) => relDeep(stage, el)); };
    const steps = [{
      cap: s.fc,
      run: (c) => {
        measure();
        const f = frameAt(stage, fenceR, 'fence', 7), er = relDeep(stage, e0.querySelector('.f-e')), fe = frameAt(stage, er, 'amber round', 4);
        const lb = add(stage, h('div', 'u2l3-tag amber', `inside · used ${e} times`), fenceR.x + fenceR.w / 2, fenceR.y + fenceR.h + 14); lb.style.translate = '-50% 0';
        const jobs = [c.pop(f, 400), c.pop(fe, 380, { delay: 120 }), c.fadeIn(lb, 350, { delay: 250 })];
        outR.forEach((r, i) => {
          const o = frameAt(stage, r, 'out', 5), t = add(stage, h('div', 'u2l3-tag gray', 'once'), r.x + r.w / 2, r.y - 14); t.style.translate = '-50% -100%';
          jobs.push(c.fadeIn(o, 300, { delay: 350 + i * 120 }), c.fadeIn(t, 300, { delay: 400 + i * 120 }));
        });
        return Promise.all(jobs);
      }
    }, {
      cap: `Write what’s inside the fence <b>${e} times</b>.${hasOut ? ' Anything outside is written <b>once</b>.' : ''}`,
      run: (c) => {
        if (!fenceR) measure();
        const R1 = rows[0], fc = ctr(fenceR); let k = 0;
        return Promise.all(R1.els.map((el, j) => {
          const t = R1.toks[j];
          if (t.k === 'i') return flyIn(c, stage, el, fc, 700, 120 + (k++) * 150);
          if (t.k === 'o') return flyIn(c, stage, el, ctr(outR[t.src]), 650, 60);
          return c.anim(el, [{ opacity: 0 }, { opacity: 1 }], 300, { delay: 250 + j * 30 });
        }));
      }
    }];
    if (rows[1]) steps.push({ cap: 'Drop the brackets: the same factors, one at a time.', run: (c) => Promise.all(rows[1].els.map((el, j) => c.anim(el, [{ opacity: 0, transform: 'translateY(-30px)' }, { opacity: 1, transform: 'none' }], 450, { delay: j * 35 }))) });
    steps.push({ cap: s.rc, run: (c) => c.pop(res, 450) });
    return steps;
  }
};

/* ======================= 3. Power of a Quotient: top and bottom ======================= */
const PQ = {
  ab: { t: 'a', b: 'b', n: 3 },
  n45: { t: '4', b: '5', n: 2 },
  e3a: { t: '3', b: '4', n: 2, ex: '(a)' },
  e3b: { t: 'x', b: '2', n: 3, ex: '(b)' },
  e3c: { t: '5', b: 'y', n: 2, ex: '(c)' },
  e3d: { t: 'm', b: 'n', n: 4, ex: '(d)' }
};
const pqHead = (d, f = 'dfrac') => `\\left(\\${f}{${d.t}}{${d.b}}\\right)^{${d.n}}`;
const evalT = (s, n) => (isNum(s) ? tn(Math.pow(+s, n)) : `${s}^{${n}}`);
const pquot = {
  title: 'The top and the bottom both get the exponent',
  height: 470,
  minW: 860,
  choices: [{ v: 'ab', label: T(pqHead(PQ.ab, 'tfrac')) }, { v: 'n45', label: T(pqHead(PQ.n45, 'tfrac')) },
    { sep: 'Example 3 check:' }, ...['e3a', 'e3b', 'e3c', 'e3d'].map((v) => ({ v, label: T(pqHead(PQ[v], 'tfrac')) }))],
  intro: (v) => `${T(pqHead(PQ[v]))}: write out the copies, then multiply the fractions.`,
  make(stage, v, ex) {
    const W = ex.W, d = PQ[v], n = d.n;
    const head = add(stage, h('div', 'u2l3-head', K(pqHead(d))), W / 2, 14); head.style.translate = '-50% 0';
    const yT = 164, yB = 248, yM = (yT + yB) / 2, sp = 132, gx = xsAt(n, W / 2, sp);
    const tops = [], bots = [], bars = [], dots = [];
    gx.forEach((x, k) => {
      tops.push(tile(stage, d.t, 'a', x, yT)); bots.push(tile(stage, d.b, 'b', x, yB));
      const bb = add(stage, h('div', 'u2l3-bar'), x - 34, yM - 2); bb.style.width = '68px'; bars.push(bb);
      if (k) dots.push(add(stage, h('div', 'u2l3-x', '·'), x - sp / 2, yM));
    });
    hide(...tops, ...bots, ...bars, ...dots);
    const F = xsAt(n, W / 2, SLOT), xT = timesSigns(stage, F, yT), xB = timesSigns(stage, F, yB);
    const big = add(stage, h('div', 'u2l3-bar'), F[0] - SLOT / 2, yM - 2); big.style.width = n * SLOT + 'px'; hide(big);
    const lT = add(stage, h('div', 'u2l3-side a', K(`${d.t}^{${n}}`)), F[n - 1] + SLOT / 2 + 22, yT), lB = add(stage, h('div', 'u2l3-side b', K(`${d.b}^{${n}}`)), F[n - 1] + SLOT / 2 + 22, yB);
    [lT, lB].forEach((e) => { e.style.translate = '0 -50%'; }); hide(lT, lB);
    const anyNum = isNum(d.t) || isNum(d.b), finT = `\\dfrac{${evalT(d.t, n)}}{${evalT(d.b, n)}}`;
    const resT = `${pqHead(d)}=\\dfrac{${d.t}^{${n}}}{${d.b}^{${n}}}` + (anyNum ? `=${finT}` : '');
    const res = line(stage, K(resT), W, 300, 'res');
    const lb = lawBox(stage, 'Power of a Quotient Law', '\\left(\\dfrac{a}{b}\\right)^{n}=\\dfrac{a^{n}}{b^{n}},\\ b\\neq0', W, 386);
    const numBits = [d.t, d.b].filter(isNum).map((s) => `${s}^{${n}}=${tn(Math.pow(+s, n))}`);
    const steps = [
      { cap: `${T(pqHead(d, 'tfrac'))} means <b>${n} copies</b> of ${T(`\\tfrac{${d.t}}{${d.b}}`)}, multiplied together.`,
        run: (c) => Promise.all([...bars.map((e, i) => c.fadeIn(e, 300, { delay: i * 160 })), ...dots.map((e, i) => c.fadeIn(e, 300, { delay: 200 + i * 160 })), ...tops.map((t, i) => c.pop(t, 300, { delay: i * 160 })), ...bots.map((t, i) => c.pop(t, 300, { delay: 80 + i * 160 }))]) },
      { cap: 'To multiply fractions, multiply the <b>tops</b> together and the <b>bottoms</b> together.',
        run: (c) => Promise.all([...bars, ...dots].map((e) => c.anim(e, [{ opacity: 1 }, { opacity: 0 }], 300)).concat(tops.map((t, i) => mv(c, t, F[i], yT, 700, 150 + i * 70)), bots.map((t, i) => mv(c, t, F[i], yB, 700, 200 + i * 70)), [c.anim(big, [{ opacity: 0, transform: 'scaleX(.2)' }, { opacity: 1, transform: 'none' }], 400, { delay: 800 })], [...xT, ...xB].map((e) => c.fadeIn(e, 300, { delay: 900 })))) },
      { cap: `${n} on top, ${n} on the bottom: ${T(`${pqHead(d, 'tfrac')}=\\tfrac{${d.t}^{${n}}}{${d.b}^{${n}}}`)}.${!anyNum && d.ex ? ` (Example 3${d.ex}.)` : ''}`,
        run: (c) => Promise.all([c.fadeIn(lT, 350, { from: 'translateX(-8px)' }), c.fadeIn(lB, 350, { delay: 150, from: 'translateX(-8px)' }), anyNum ? null : c.fadeIn(res, 400, { delay: 300 })]) },
      anyNum ? { cap: `Work out the number${numBits.length > 1 ? 's' : ''}: ${numBits.map(T).join(' and ')}. So ${T(`${pqHead(d, 'tfrac')}=${finT.replace('dfrac', 'tfrac')}`)}.${d.ex ? ` (Example 3${d.ex}.)` : ''}`,
        run: (c) => c.fadeIn(res, 400) } : null,
      { cap: '<b>Power of a Quotient Law:</b> the exponent goes to the top <b>and</b> to the bottom. (The bottom can’t be 0.)', run: (c) => c.pop(lb, 450) }
    ].filter(Boolean);
    return steps;
  }
};

/* ======================= 3. The area picture of a squared fraction ======================= */
const FSQ = { h: [1, 2], t: [2, 3], f: [4, 5], e: [3, 4] };
const fsq = {
  title: 'Squaring a fraction: the area picture',
  height: 420,
  minW: 880,
  choices: [{ v: 'h', label: T('\\left(\\tfrac{1}{2}\\right)^{2}') }, { v: 't', label: T('\\left(\\tfrac{2}{3}\\right)^{2}') }, { v: 'f', label: T('\\left(\\tfrac{4}{5}\\right)^{2}') },
    { sep: 'Example 3(a) check:' }, { v: 'e', label: T('\\left(\\tfrac{3}{4}\\right)^{2}') }],
  intro: (v) => { const [p, q] = FSQ[v]; return `How much of a 1 by 1 square does a ${T(`\\tfrac{${p}}{${q}}`)} by ${T(`\\tfrac{${p}}{${q}}`)} square cover?`; },
  make(stage, v, ex) {
    const [p, q] = FSQ[v], S = 330, X0 = 70, Y0 = 30, u = S / q, TX = 500;
    const svg = add(stage, svgEl('svg', { width: S + 20, height: S + 20, viewBox: `-10 -10 ${S + 20} ${S + 20}` }), X0 - 10, Y0 - 10);
    const cols = svgEl('rect', { x: 0, y: 0, width: p * u, height: S, class: 'u2l3-fqc' }, svg);
    const rows = svgEl('rect', { x: 0, y: S - p * u, width: S, height: p * u, class: 'u2l3-fqr' }, svg);
    const grid = svgEl('g', { class: 'u2l3-fqg' }, svg);
    for (let i = 1; i < q; i++) { svgEl('line', { x1: i * u, y1: 0, x2: i * u, y2: S }, grid); svgEl('line', { x1: 0, y1: i * u, x2: S, y2: i * u }, grid); }
    svgEl('rect', { x: 0, y: 0, width: S, height: S, class: 'u2l3-fqo' }, svg);
    const ov = svgEl('rect', { x: 0, y: S - p * u, width: p * u, height: p * u, class: 'u2l3-fqov' }, svg);
    const one = add(stage, h('div', 'u2l3-sstag', 'side 1'), X0 + S / 2, Y0 - 6); one.style.translate = '-50% -100%';
    const wl = add(stage, h('div', 'u2l3-sstag blue big', K(`\\frac{${p}}{${q}}`)), X0 + p * u / 2, Y0 + S + 10); wl.style.translate = '-50% 0';
    const hl = add(stage, h('div', 'u2l3-sstag amber big', K(`\\frac{${p}}{${q}}`)), X0 - 14, Y0 + S - p * u / 2); hl.style.translate = '-100% -50%';
    hide(cols, rows, grid, ov, wl, hl);
    const L = [`\\text{overlap: } ${p}\\times${p}=${p * p}`, `\\text{all: } ${q}\\times${q}=${q * q}`, `\\left(\\dfrac{${p}}{${q}}\\right)^{2}=\\dfrac{${p}^{2}}{${q}^{2}}=\\dfrac{${p * p}}{${q * q}}`]
      .map((src, i) => { const e = add(stage, h('div', 'u2l3-ssl' + (i === 2 ? ' big' : ''), K(src)), TX, 50 + i * 80); hide(e); return e; });
    return [
      { cap: `A square with side 1 has area 1. Cut each side into <b>${q}</b> equal parts: ${q} × ${q} = <b>${q * q}</b> small squares.`, run: (c) => c.fadeIn(grid, 400) },
      { cap: `Go ${T(`\\tfrac{${p}}{${q}}`)} of the way <b>across</b>…`, run: (c) => Promise.all([c.anim(cols, [{ opacity: 0 }, { opacity: 1 }], 400), c.fadeIn(wl, 300)]) },
      { cap: `…and ${T(`\\tfrac{${p}}{${q}}`)} of the way <b>up</b>. Where the two overlap is the ${T(`\\tfrac{${p}}{${q}}`)} by ${T(`\\tfrac{${p}}{${q}}`)} square.`, run: (c) => Promise.all([c.anim(rows, [{ opacity: 0 }, { opacity: 1 }], 400), c.fadeIn(hl, 300)]) },
      { cap: `Count: the overlap holds ${p} × ${p} = <b>${p * p}</b> small square${p * p > 1 ? 's' : ''}, out of ${q} × ${q} = <b>${q * q}</b>.`, run: (c) => Promise.all([c.pop(ov, 450), c.fadeIn(L[0], 350, { delay: 200 }), c.fadeIn(L[1], 350, { delay: 450 })]) },
      { cap: `So ${T(`\\left(\\tfrac{${p}}{${q}}\\right)^{2}=\\tfrac{${p * p}}{${q * q}}`)}. The top was squared <b>and</b> the bottom was squared: the Power of a Quotient Law.${v === 'e' ? ' (Example 3(a).)' : ''}`, run: (c) => c.fadeIn(L[2], 400) }
    ];
  }
};

/* ======================= 4–5. Which law did the work? (one law per line) ======================= */
const LAWS = [
  ['prod', 'Product', 'a^{m}\\times a^{n}=a^{m+n}'],
  ['quot', 'Quotient', 'a^{m}\\div a^{n}=a^{m-n}'],
  ['ppow', 'Power of a Power', '(a^{m})^{n}=a^{mn}'],
  ['pprod', 'Power of a Product', '(ab)^{n}=a^{n}b^{n}'],
  ['pquot', 'Power of a Quotient', '\\left(\\tfrac{a}{b}\\right)^{n}=\\tfrac{a^{n}}{b^{n}}']
];
const CHAINS = {
  nt: { t: '(3x)^{2}\\times x^{3}', lines: [
    ['=3^{2}x^{2}\\times x^{3}', ['pprod'], 'first: distribute the 2', `<b>Power of a Product:</b> the 3 <b>and</b> the ${T('x')} are inside the brackets, so both get squared.`],
    ['=9x^{2}\\times x^{3}', [], `${T('3^{2}=9')}`, `Work out the number: ${T('3^{2}=9')}.`],
    ['=9x^{2+3}', ['prod'], 'then: same base, add', `<b>Product Law:</b> ${T('x^{2}\\times x^{3}')}, same base multiplied, so add the exponents.`],
    ['=9x^{5}', [], 'simplest form', `So ${T('(3x)^{2}\\times x^{3}=9x^{5}')}.`]] },
  a: { t: '(2x)^{3}\\times x^{2}', lines: [
    ['=2^{3}x^{3}\\times x^{2}', ['pprod'], 'first: distribute the 3', `<b>Power of a Product:</b> the 2 and the ${T('x')} each get cubed.`],
    ['=8x^{3+2}', ['prod'], `${T('2^{3}=8')}; same base, add`, `${T('2^{3}=8')}. <b>Product Law</b> on the ${T('x')}’s: add the exponents.`],
    ['=8x^{5}', [], 'simplest form', `So ${T('(2x)^{3}\\times x^{2}=8x^{5}')}.`]] },
  b: { t: '(5m^{2})^{2}', lines: [
    ['=5^{2}\\left(m^{2}\\right)^{2}', ['pprod'], 'first: the 5 <b>and</b> the ' + T('m^{2}'), `<b>Power of a Product:</b> two factors are inside, ${T('5')} and ${T('m^{2}')}. <b>Each one</b> gets squared.`],
    ['=25m^{2\\times2}', ['ppow'], `${T('5^{2}=25')}; multiply the exponents`, `${T('5^{2}=25')}. <b>Power of a Power:</b> ${T('\\left(m^{2}\\right)^{2}=m^{2\\times2}')}.`],
    ['=25m^{4}', [], 'simplest form', `So ${T('(5m^{2})^{2}=25m^{4}')}.`]] },
  c: { t: '(y^{3})^{2}\\div y^{4}', lines: [
    ['=y^{3\\times2}\\div y^{4}', ['ppow'], 'first: multiply the exponents', `<b>Power of a Power:</b> ${T('(y^{3})^{2}=y^{3\\times2}=y^{6}')}.`],
    ['=y^{6}\\div y^{4}', [], `${T('3\\times2=6')}`, `${T('3\\times2=6')}.`],
    ['=y^{6-4}', ['quot'], 'then: same base, subtract', `<b>Quotient Law:</b> same base divided, so subtract the exponents.`],
    ['=y^{2}', [], 'simplest form', `So ${T('(y^{3})^{2}\\div y^{4}=y^{2}')}.`]] },
  d: { t: '\\left(\\dfrac{a}{3}\\right)^{2}\\times a^{3}', lines: [
    ['=\\dfrac{a^{2}}{3^{2}}\\times a^{3}', ['pquot'], 'first: top and bottom get the 2', `<b>Power of a Quotient:</b> the top <b>and</b> the bottom are each squared.`],
    ['=\\dfrac{a^{2}}{9}\\times a^{3}', [], `${T('3^{2}=9')}`, `${T('3^{2}=9')}.`],
    ['=\\dfrac{a^{2+3}}{9}', ['prod'], 'then: same base, add', `<b>Product Law:</b> ${T('a^{2}\\times a^{3}')}, so add the exponents. The 9 stays on the bottom.`],
    ['=\\dfrac{a^{5}}{9}', [], 'simplest form', `So ${T('\\left(\\tfrac{a}{3}\\right)^{2}\\times a^{3}=\\tfrac{a^{5}}{9}')}.`]] },
  e5a: { t: '(2x)^{2}(x^{3})^{2}', lines: [
    ['=2^{2}x^{2}\\times x^{3\\times2}', ['pprod', 'ppow'], 'each bracket to its power', `Two brackets. <b>Power of a Product</b> on the first: the 2 and the ${T('x')} get squared. <b>Power of a Power</b> on the second: multiply.`],
    ['=4x^{2}\\times x^{6}', [], `${T('2^{2}=4')}, ${T('3\\times2=6')}`, `${T('2^{2}=4')} and ${T('3\\times2=6')}.`],
    ['=4x^{2+6}', ['prod'], 'then: same base, add', `<b>Product Law:</b> add the exponents of ${T('x')}.`],
    ['=4x^{8}', [], 'simplest form', `So ${T('(2x)^{2}(x^{3})^{2}=4x^{8}')}.`]] },
  e5b: { t: '\\dfrac{(3m^{2})^{2}}{m^{3}}', lines: [
    ['=\\dfrac{3^{2}\\left(m^{2}\\right)^{2}}{m^{3}}', ['pprod'], 'first: the 3 <b>and</b> the ' + T('m^{2}'), `<b>Power of a Product:</b> both factors in the bracket get squared, the 3 too.`],
    ['=\\dfrac{9m^{4}}{m^{3}}', ['ppow'], `${T('3^{2}=9')}; ${T('2\\times2=4')}`, `${T('3^{2}=9')}, and <b>Power of a Power:</b> ${T('\\left(m^{2}\\right)^{2}=m^{4}')}.`],
    ['=9m^{4-3}', ['quot'], 'then: same base, subtract', `<b>Quotient Law:</b> subtract the bottom exponent from the top one.`],
    ['=9m', [], `${T('m^{1}')} is just ${T('m')}`, `${T('m^{1}=m')}. So the answer is ${T('9m')}.`]] },
  e5c: { t: '\\left(\\dfrac{2a^{2}}{b}\\right)^{3}', lines: [
    ['=\\dfrac{(2a^{2})^{3}}{b^{3}}', ['pquot'], 'first: top and bottom get the 3', `<b>Power of a Quotient:</b> the whole top and the bottom are each cubed.`],
    ['=\\dfrac{2^{3}\\left(a^{2}\\right)^{3}}{b^{3}}', ['pprod'], 'every factor on top', `<b>Power of a Product</b> on the top: the 2 <b>and</b> the ${T('a^{2}')} get cubed.`],
    ['=\\dfrac{8a^{6}}{b^{3}}', ['ppow'], `${T('2^{3}=8')}; ${T('2\\times3=6')}`, `${T('2^{3}=8')}, and <b>Power of a Power:</b> ${T('\\left(a^{2}\\right)^{3}=a^{6}')}. Three laws in all.`]] }
};
const chain = {
  title: 'Which law did the work?',
  height: 560,
  minW: 900,
  choices: [{ v: 'nt', label: T(CHAINS.nt.t) }, { sep: 'Example 4 check:' }, ...'abcd'.split('').map((k) => ({ v: k, label: '(' + k + ')' })),
    { sep: 'Example 5 check:' }, { v: 'e5a', label: '(a)' }, { v: 'e5b', label: '(b)' }, { v: 'e5c', label: '(c)' }],
  intro: (k) => `Simplify ${T(CHAINS[k].t)}, one law at a time. Press <b>Next</b> for each line.`,
  make(stage, key, ex) {
    const W = ex.W, d = CHAINS[key], bw = (W - 24 - 4 * 8) / 5, bdg = {};
    LAWS.forEach(([k, name, f], i) => { const b = add(stage, h('div', 'u2l3-law u2l3-l' + k, `<b>${name}</b><span>${K(f)}</span>`), 12 + i * (bw + 8), 10); b.style.width = bw + 'px'; bdg[k] = b; });
    const frac = /dfrac/.test(d.t) || d.lines.some((l) => /dfrac/.test(l[0]));
    const lx = 26, ly = 98, lh = frac ? 90 : 78, nx = Math.round(W * 0.55), nw = W - nx - 16;
    const all = [[d.t, [], 'the question', '']].concat(d.lines);
    const rows = all.map(([t, , note], i) => {
      const el = add(stage, h('div', 'u2l3-cl', K(t)), lx, ly + i * lh); el.style.height = (lh - 8) + 'px';
      const nn = add(stage, h('div', 'u2l3-cn', `<div>${note}</div>`), nx, ly + i * lh); nn.style.width = nw + 'px'; nn.style.height = (lh - 14) + 'px';
      if (i) hide(el, nn); else nn.classList.add('start');
      return { el, nn };
    });
    const light = (c, ks) => Promise.all(LAWS.map(([k]) => { const on = ks.includes(k), b = bdg[k], was = b.classList.contains('on'); b.classList.toggle('on', on); return on && !was ? c.anim(b, [{ transform: 'scale(1)' }, { transform: 'scale(1.08)' }, { transform: 'scale(1)' }], 380) : null; }));
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

/* ======================= 5. Check it with a number ======================= */
const CHECKS = {
  nt: { x: 'x', o: '(3x)^{2}\\times x^{3}', oS: '(3\\times2)^{2}\\times2^{3}', oM: '6^{2}\\times8=36\\times8', V0: 288,
    a: '9x^{5}', aS: '9\\times2^{5}', aM: '9\\times32', V1: 288, who: 'Kai', why: 'he forgot to square the 3', w: '3x^{5}', wS: '3\\times2^{5}', wM: '3\\times32', V2: 96 },
  e4b: { x: 'm', o: '(5m^{2})^{2}', oS: '(5\\times2^{2})^{2}', oM: '(5\\times4)^{2}=20^{2}', V0: 400,
    a: '25m^{4}', aS: '25\\times2^{4}', aM: '25\\times16', V1: 400, who: 'Mia', why: 'she did 5 × 2 instead of 5 × 5', w: '10m^{4}', wS: '10\\times2^{4}', wM: '10\\times16', V2: 160 },
  e4c: { x: 'y', o: '(y^{3})^{2}\\div y^{4}', oS: '(2^{3})^{2}\\div2^{4}', oM: '8^{2}\\div16=64\\div16', V0: 4,
    a: 'y^{2}', aS: '2^{2}', aM: '2\\times2', V1: 4, who: 'Leo', why: 'he added 3 + 2 inside the brackets instead of multiplying', w: 'y', wS: '2', wM: '', V2: 2,
    one: `<b>Test with ${K('y=1')}:</b> &nbsp;original ${K('=(1^{3})^{2}\\div1^{4}=1')} &nbsp;&nbsp; Leo ${K('=1')} &nbsp;<b class="u2l3-red">fooled!</b>`,
    oneCap: `Why not test with ${T('y=1')}? Every power of 1 is 1, so the original gives 1 and Leo’s ${T('y')} gives 1 too. <b>Fooled!</b> Use 2 instead.` }
};
const check = {
  title: 'Check it with a number',
  height: 430,
  minW: 900,
  choices: [{ sep: 'Notes:' }, { v: 'nt', label: T('(3x)^{2}\\times x^{3}') }, { sep: 'Example 4:' }, { v: 'e4b', label: '(b)' }, { v: 'e4c', label: '(c)' }],
  intro: (k) => { const d = CHECKS[k]; return `We simplified ${T(d.o)} to ${T(d.a)}. ${d.who} got ${T(d.w)}. Put in a number to see which one is really <b>equal</b> to the question.`; },
  make(stage, key, ex) {
    const W = ex.W, d = CHECKS[key], cw = (W - 60) / 3, cy = 66;
    const pick = add(stage, h('div', 'u2l3-ckpick', `Test value: ${K(d.x + '=2')}`), 20, 12); hide(pick);
    const card = (i, head, e) => {
      const el = add(stage, h('div', 'u2l3-ck', `<div class="u2l3-ckh">${head}</div><div class="u2l3-cke">${K(e)}</div><div class="u2l3-cks"></div><div class="u2l3-ckv"></div>`), 20 + i * (cw + 10), cy);
      el.style.width = cw + 'px'; return { el, s: el.querySelector('.u2l3-cks'), v: el.querySelector('.u2l3-ckv') };
    };
    const C0 = card(0, 'The question', d.o), C1 = card(1, 'Our answer', d.a), C2 = card(2, d.who + '’s answer', d.w);
    const fill = (C, S, M, V) => { C.s.innerHTML = K(`=${S}`) + (M ? '<br>' + K(`=${M}`) : ''); C.v.innerHTML = K(`=\\boldsymbol{${tn(V)}}`); hide(C.s, C.v); };
    fill(C0, d.oS, d.oM, d.V0); fill(C1, d.aS, d.aM, d.V1); fill(C2, d.wS, d.wM, d.V2);
    const st1 = add(stage, h('div', 'u2l3-stamp ok', '✓'), 20 + 2 * cw + 10 - 60, cy + 36), st2 = add(stage, h('div', 'u2l3-stamp no', '✗'), 20 + 3 * cw + 20 - 60, cy + 36); hide(st1, st2);
    const strip = add(stage, h('div', 'u2l3-ckstrip'), 20, 370); strip.style.width = (W - 40) + 'px'; hide(strip);
    const steps = [
      { cap: `Pick a test value: ${T(d.x + '=2')}. Small and easy, but <b>not 0 or 1</b>.`, run: (c) => c.pop(pick, 380) },
      { cap: `Put it into the <b>question</b>. Brackets first, then powers: ${T(d.o)} becomes <b>${fmt(d.V0)}</b>.`, run: (c) => Promise.all([c.fadeIn(C0.s, 380), c.pop(C0.v, 400, { delay: 300 })]) },
      { cap: `Now our answer: ${T(d.a)} also gives <b>${fmt(d.V1)}</b>. They <b>match</b> ✓, so our answer checks out.`, run: async (c) => { await Promise.all([c.fadeIn(C1.s, 380), c.pop(C1.v, 400, { delay: 300 })]); C0.el.classList.add('good'); C1.el.classList.add('good'); await stampIn(c, st1); } },
      { cap: `${d.who}’s answer gives <b>${fmt(d.V2)}</b>, not ${fmt(d.V0)}. Equal expressions give the same number every time, so ${T(d.w)} is <b>wrong</b>: ${d.why}.`, run: async (c) => { await Promise.all([c.fadeIn(C2.s, 380), c.pop(C2.v, 400, { delay: 300 })]); C2.el.classList.add('bad'); await stampIn(c, st2); } }
    ];
    if (d.one) steps.push({ cap: d.oneCap, run: (c) => { strip.innerHTML = d.one; return c.fadeIn(strip, 400); } });
    return steps;
  }
};
function stampIn(c, el) { return c.anim(el, [{ opacity: 0, transform: 'scale(1.9) rotate(-14deg)' }, { opacity: 1, transform: 'scale(1) rotate(-6deg)' }], 420, { easing: 'cubic-bezier(.2,1.4,.4,1)' }); }

/* ======================= warm-up: Supersize It! ======================= */
function mountZoom() {
  const pic = document.getElementById('u2l3-zpic'), say = document.getElementById('u2l3-zsay'); if (!pic) return;
  const btns = [...document.querySelectorAll('[data-u2l3-z]')];
  const show = (n) => {
    btns.forEach((b) => b.classList.toggle('on', +b.dataset.u2l3Z === n));
    const t = n <= 4 ? 52 : 20.8, P = n * t, svg = svgEl('svg', { width: 216, height: 216, viewBox: `0 0 216 216` });
    const g = svgEl('g', { transform: `translate(${(216 - P) / 2} ${216 - P})` }, svg);
    for (let r = 0; r < n; r++) for (let q = 0; q < n; q++) {
      const cell = svgEl('g', { class: 'u2l3-zt' }, g); smiley(cell, q * t, P - (r + 1) * t, t);
      cell.style.animationDelay = (n > 4 ? r * 60 : r * 160 + q * 50) + 'ms';
    }
    pic.innerHTML = ''; pic.appendChild(svg);
    say.innerHTML = n === 1 ? '<b>Original:</b> 1 tile' : `<b>${n} times</b> as wide and as tall: ${n} rows of ${n} = <b>${n * n} tiles</b>`;
  };
  btns.forEach((b) => b.addEventListener('click', () => show(+b.dataset.u2l3Z)));
  show(1);
  const dice = document.getElementById('u2l3-dice');
  if (dice) { const svg = svgEl('svg', { width: 96, height: 92, viewBox: '0 -4 96 92' }); diceStack(svgEl('g', {}, svg), 2, 30, 2, 84); dice.appendChild(svg); }
}

/* ======================= Stand Up Break! ======================= */
standup('u2l3', (() => {
  const L = ['x', 'y', 'a', 'm', 'n', 'p', 'k', 'w'];
  const coefPow = (r, n) => r.pick({ 2: [2, 3, 4, 5, 10, -2, -3], 3: [2, 3, 4, 5, -2, -3], 4: [2, 3], 5: [2] }[n]);
  const P = (b, e) => (e === 1 ? b : `${b}^{${e}}`);
  const neg = (k) => (k < 0 ? `(${k})` : String(k));
  return {
    intro: 'Simplify at your whiteboard station, no calculator. Give the outer exponent to every factor inside the brackets, numbers too.',
    levels: {
      BEG: (r) => { // one new law: a power of a product or of a quotient
        const v = r.pick(L), kind = r.pick(['prod', 'prod', 'prod2', 'quotL', 'quotR', 'quotN']);
        if (kind === 'prod') { const n = r.pick([2, 2, 3, 3, 4]), k = coefPow(r, n); return { q: `(${k}${v})^{${n}}`, a: [`=${neg(k)}^{${n}}${v}^{${n}}`, `=${Math.pow(k, n)}${v}^{${n}}`] }; }
        if (kind === 'prod2') { const n = r.pick([2, 3]), k = r.pick([2, 3, 4, 5].slice(0, n === 3 ? 3 : 4)), [a, b] = r.shuffle(['a', 'b', 'x', 'y', 'm', 'n']).slice(0, 2); return { q: `(${k}${a}${b})^{${n}}`, a: [`=${k}^{${n}}${a}^{${n}}${b}^{${n}}`, `=${Math.pow(k, n)}${a}^{${n}}${b}^{${n}}`] }; }
        if (kind === 'quotL') { const n = r.pick([2, 3]), k = r.pick(n === 2 ? [2, 3, 4, 5, 6, 7, 10] : [2, 3, 4, 5]); return { q: `\\left(\\dfrac{${v}}{${k}}\\right)^{${n}}`, a: [`=\\dfrac{${v}^{${n}}}{${k}^{${n}}}`, `=\\dfrac{${v}^{${n}}}{${Math.pow(k, n)}}`] }; }
        if (kind === 'quotR') { const n = r.pick([2, 3]), k = r.pick(n === 2 ? [2, 3, 4, 5, 6, 7, 9] : [2, 3, 4, 5]); return { q: `\\left(\\dfrac{${k}}{${v}}\\right)^{${n}}`, a: [`=\\dfrac{${k}^{${n}}}{${v}^{${n}}}`, `=\\dfrac{${Math.pow(k, n)}}{${v}^{${n}}}`] }; }
        const [p, q] = r.pick([[1, 2], [1, 3], [2, 3], [3, 5], [2, 5], [5, 6], [1, 4], [3, 7], [2, 7], [4, 9]]), n = q <= 5 && p <= 3 && r.chance(0.4) ? 3 : 2;
        return { q: `\\left(\\dfrac{${p}}{${q}}\\right)^{${n}}`, a: [`=\\dfrac{${p}^{${n}}}{${q}^{${n}}}`, `=\\dfrac{${Math.pow(p, n)}}{${Math.pow(q, n)}}`] };
      },
      PRG: (r) => { // two laws
        const v = r.pick(L), kind = r.pick(['pp', 'pm', 'pd', 'qm']);
        if (kind === 'pp') { const n = r.pick([2, 2, 3]), m = r.int(2, 5), k = r.pick(n === 2 ? [2, 3, 4, 5, 10] : [2, 3, 4]); return { q: `(${k}${v}^{${m}})^{${n}}`, a: [`=${k}^{${n}}\\left(${v}^{${m}}\\right)^{${n}}`, `=${Math.pow(k, n)}${v}^{${m * n}}`] }; }
        if (kind === 'pm') { const n = r.pick([2, 3]), k = r.pick(n === 2 ? [2, 3, 4, 5] : [2, 3]), p = r.int(2, 6); return { q: `(${k}${v})^{${n}}\\times ${v}^{${p}}`, a: [`=${k}^{${n}}${v}^{${n}}\\times ${v}^{${p}}`, `=${Math.pow(k, n)}${v}^{${n}+${p}}`, `=${Math.pow(k, n)}${v}^{${n + p}}`] }; }
        if (kind === 'pd') { const m = r.int(2, 4), n = r.int(2, 3), p = r.int(1, m * n - 2); return { q: `\\left(${v}^{${m}}\\right)^{${n}}\\div ${P(v, p)}`, a: [`=${v}^{${m * n}}\\div ${P(v, p)}`, `=${v}^{${m * n}-${p}}`, `=${P(v, m * n - p)}`] }; }
        const k = r.pick([2, 3, 4, 5]), p = r.int(2, 6); return { q: `\\left(\\dfrac{${v}}{${k}}\\right)^{2}\\times ${v}^{${p}}`, a: [`=\\dfrac{${v}^{2}}{${k * k}}\\times ${v}^{${p}}`, `=\\dfrac{${v}^{2+${p}}}{${k * k}}`, `=\\dfrac{${v}^{${p + 2}}}{${k * k}}`] };
      },
      MAS: (r) => { // three or more laws
        const v = r.pick(L), kind = r.pick(['two', 'frac', 'quot', 'quot2']);
        if (kind === 'two') { const n = r.pick([2, 3]), k = r.pick(n === 2 ? [2, 3, 4, 5] : [2, 3]), m = r.int(2, 4), p = r.int(2, 3); return { q: `(${k}${v})^{${n}}\\left(${v}^{${m}}\\right)^{${p}}`, a: [`=${Math.pow(k, n)}${v}^{${n}}\\times ${v}^{${m * p}}`, `=${Math.pow(k, n)}${v}^{${n}+${m * p}}`, `=${Math.pow(k, n)}${v}^{${n + m * p}}`] }; }
        if (kind === 'frac') { const k = r.pick([2, 3, 4, 5]), m = r.int(2, 4), p = r.int(1, 2 * m - 1); return { q: `\\dfrac{(${k}${v}^{${m}})^{2}}{${P(v, p)}}`, a: [`=\\dfrac{${k * k}${v}^{${2 * m}}}{${P(v, p)}}`, `=${k * k}${v}^{${2 * m}-${p}}`, `=${k * k}${P(v, 2 * m - p)}`] }; }
        const [a, b] = r.shuffle(['a', 'b', 'x', 'y', 'm', 'n']).slice(0, 2);
        if (kind === 'quot') { const n = r.pick([2, 3]), k = r.pick(n === 2 ? [2, 3, 4, 5] : [2, 3]), m = r.int(2, 4); return { q: `\\left(\\dfrac{${k}${a}^{${m}}}{${b}}\\right)^{${n}}`, a: [`=\\dfrac{${k}^{${n}}\\left(${a}^{${m}}\\right)^{${n}}}{${b}^{${n}}}`, `=\\dfrac{${Math.pow(k, n)}${a}^{${m * n}}}{${b}^{${n}}}`] }; }
        const n = r.pick([2, 3]), k = r.pick(n === 2 ? [2, 3, 4, 5] : [2, 3]), m = r.int(2, 4);
        return { q: `\\left(\\dfrac{${a}^{${m}}}{${k}${b}}\\right)^{${n}}`, a: [`=\\dfrac{\\left(${a}^{${m}}\\right)^{${n}}}{${k}^{${n}}${b}^{${n}}}`, `=\\dfrac{${a}^{${m * n}}}{${Math.pow(k, n)}${b}^{${n}}}`] };
      }
    }
  };
})());

mountZoom();
export const explainers = mountExplainers({ recap, pprod, supersize, fence, pquot, fsq, chain, check });
