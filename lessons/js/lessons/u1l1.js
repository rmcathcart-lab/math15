/* Math 15 · Unit 1 · Lesson 1 — Review: Integer Operations and Order of Operations (Grade 9 review; no 10C twin).
 * Explainers:
 *   walk     (a number-line walk: start, rewrite a subtraction as adding the opposite, hop right / left, land),
 *   chips    (integer chips: yellow +1, red −1; zero pairs cancel; subtracting takes chips away, adding zero pairs first
 *             when there aren't enough — the same answer as adding the opposite),
 *   signs    (multiply / divide the sizes, then each negative sign flips the arrow across zero; the sign table),
 *   pattern  (why (−)(−) is (+): the ×4 and ×(−4) patterns continued past zero),
 *   bedmas   (a BEDMAS evaluator: the next operation lights up, the ladder letter lights, the new line appears),
 *   comments (the warm-up's four commenters: each wrong answer is one slip),
 *   negsq    ((−3)² vs −3²: how far the exponent reaches),
 *   sub      (up is +, down is −: Example 5(a)'s submarine on a depth line, and a diver demo).
 * Colours: positive yellow/amber, negative red (chips, hops), highlights amber, answers red, BEDMAS ladder navy. */
import {
  h, tex, add, box, NumberLine, ValueTable, stamp, stampIn, mountExplainers, pop, fadeIn, appear, sleep, tween, svgEl,
  pulse, shake, anim, COLORS
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
/* KaTeX allowing \htmlClass (pieces of an expression that light up) */
const K = (src, display) => {
  try { return window.katex.renderToString(String(src), { displayMode: !!display, throwOnError: false, strict: 'ignore', trust: true, output: 'html' }); }
  catch (e) { return tex(src, display); }
};
const AMB = COLORS.amber, RED = COLORS.red, INK = COLORS.ink, BLUE = COLORS.blue, GRN = COLORS.green;
const POS = '#e8a01e';   // yellow chip / positive move
const NEG = '#c93a33';   // red chip / negative move
const hide = (el) => { el.style.opacity = 0; return el; };
const show = (c, el) => fadeIn(c, el, 320);
const lab = (host, x, y, html, cls = '') => { const d = h('div', cls, html); d.style.position = 'absolute'; d.style.left = x + 'px'; d.style.top = y + 'px'; d.style.translate = '-50% -50%'; host.appendChild(d); return d; };
const neg = (v) => (v < 0 ? `(${v})` : String(v));          // a negative in brackets after an operator
const mn = (v) => String(v).replace('-', '−');                // a real minus sign in text
const sgnWord = (v) => (v > 0 ? 'positive' : v < 0 ? 'negative' : 'zero');
/** position of el inside host (both on the stage, which may be scaled) */
function relBox(el, host) {
  const a = el.getBoundingClientRect(), b = host.getBoundingClientRect(), k = b.width / (host.offsetWidth || 1) || 1;
  return { x: (a.left - b.left) / k, y: (a.top - b.top) / k, w: a.width / k, h: a.height / k };
}

/* =====================================================================================================
 * The expression engine: parse a small integer expression, then reduce it one BEDMAS step at a time.
 * Source syntax: - + * / ^ ( ). "(-5)" is a bracketed negative, "-4^2" squares the 4 and then negates.
 * ===================================================================================================== */
const OPS = { '+': '+', '-': '-', '*': '\\times', '/': '\\div' };
export function parse(src) {
  const toks = String(src).replace(/\s+/g, '').match(/\d+|[-+*/^()]/g); let i = 0;
  const peek = () => toks[i], next = () => toks[i++];
  function item() {
    let it;
    if (peek() === '-') { next(); const v = +next(); if (peek() === '^') { next(); return { n: v, pow: +next(), neg: true }; } it = { n: -v }; }
    else if (peek() === '(') {
      next(); const L = expr(); next();
      it = L.length === 1 && L[0].n != null && !L[0].pow && !L[0].neg ? { n: L[0].n, br: true } : { g: L };
    } else it = { n: +next() };
    if (peek() === '^') { next(); it.pow = +next(); }
    return it;
  }
  function expr() { const L = [item()]; while (i < toks.length && /^[-+*/]$/.test(peek())) { L.push(next()); L.push(item()); } return L; }
  return expr();
}
const clone = (L) => JSON.parse(JSON.stringify(L), (k, v) => (k === 'fresh' ? undefined : v));
function itemTex(it, first, hi) {
  let s;
  if (it.g) s = '(' + listTex(it.g, hi) + ')';
  else if (it.neg) s = '-' + it.n;
  else if (it.br || (it.n < 0 && (!first || it.pow))) s = '(' + it.n + ')';
  else s = String(it.n);
  if (it.pow) s += '^{' + it.pow + '}';
  return it.fresh ? `\\htmlClass{u1l1-new}{${s}}` : s;
}
function listTex(L, hi) {
  const parts = L.map((t, k) => (typeof t === 'string' ? OPS[t] : itemTex(t, k === 0, hi)));
  if (hi && hi.list === L) {
    const mid = parts.slice(hi.from, hi.to + 1).join('');
    return parts.slice(0, hi.from).join('') + `\\htmlClass{u1l1-op}{${mid}}` + parts.slice(hi.to + 1).join('');
  }
  return parts.join('');
}
const listAt = (L, path) => path.reduce((l, k) => l[k].g, L);
/** where the next operation is: { path, from, to, letter } (B is a path into a bracket) */
function locate(L, path = []) {
  for (let k = 0; k < L.length; k += 2) if (L[k].g) return locate(L[k].g, path.concat(k));
  for (let k = 0; k < L.length; k += 2) if (L[k].pow) return { path, from: k, to: k, letter: 'E' };
  for (let k = 1; k < L.length; k += 2) if (L[k] === '*' || L[k] === '/') return { path, from: k - 1, to: k + 1, letter: 'DM' };
  for (let k = 1; k < L.length; k += 2) return { path, from: k - 1, to: k + 1, letter: 'AS' };
  return null;
}
function powTex(it) {
  const b = it.n, p = it.pow, base = b < 0 ? `(${b})` : String(b), rep = Array(p).fill(base).join('\\times');
  if (it.neg) return { v: -(b ** p), d: `-${b}^{${p}}=-(${Array(p).fill(b).join('\\times')})=${-(b ** p)}` };
  return { v: b ** p, d: `${base}^{${p}}=${rep}=${b ** p}` };
}
function apply(root, info) {
  const L = listAt(root, info.path); let d, v, op = null;
  if (info.letter === 'E') { const r = powTex(L[info.from]); v = r.v; d = r.d; L[info.from] = { n: v, fresh: true }; }
  else {
    const a = L[info.from].n, b = L[info.to].n; op = L[info.from + 1];
    v = op === '+' ? a + b : op === '-' ? a - b : op === '*' ? a * b : a / b;
    const A = L[info.from].br || (a < 0 && info.from > 0) ? `(${a})` : String(a);
    d = `${A}${OPS[op]}${neg(b)}` + (op === '-' && b < 0 ? `=${a}+${-b}` : '') + `=${v}`;
    L.splice(info.from, 3, { n: v, fresh: true });
  }
  // a bracket that is down to one number: drop to "(n)" (it keeps its exponent)
  let path = info.path.slice();
  while (path.length) {
    const inner = listAt(root, path); if (inner.length !== 1 || inner[0].pow || inner[0].g) break;
    const k = path.pop(), parent = listAt(root, path), g = parent[k];
    parent[k] = { n: inner[0].n, br: true, pow: g.pow, fresh: true };
  }
  return { d, v, op };
}
/** every step of the evaluation: { start, steps: [{ before (highlighted), after (new number marked), d, letter, op, inB }], value } */
export function evalSteps(src) {
  let cur = parse(src); const start = listTex(cur), steps = [];
  for (let guard = 0; guard < 24; guard++) {
    const info = locate(cur); if (!info) break;
    const nxt = clone(cur), r = apply(nxt, info), LL = listAt(cur, info.path);
    const asLeft = LL.some((t) => t === '+' || t === '-'), dmCount = LL.filter((t) => t === '*' || t === '/').length;
    steps.push({ asLeft, dmCount, before: listTex(cur, { list: listAt(cur, info.path), from: info.from, to: info.to }), after: listTex(nxt), plain: listTex(clone(nxt)), d: r.d, v: r.v, letter: info.letter, op: r.op, inB: info.path.length > 0 });
    cur = clone(nxt);
  }
  return { start, steps, value: cur[0].n };
}

/* =============================== explainer: number-line walk =============================== */
const WALK = {
  n1: { label: 'Notes: −4 + 6', a: -4, op: '+', b: 6 },
  n2: { label: '−5 + (−2)', a: -5, op: '+', b: -2 },
  n3: { label: '−9 + 4', a: -9, op: '+', b: 4 },
  n4: { label: '−6 − (−10)', a: -6, op: '-', b: -10 },
  e1a: { label: 'Example 1 check: (a)', a: -6, op: '+', b: 9 },
  e1b: { label: '(b)', a: -7, op: '-', b: 5 },
  e1c: { label: '(c)', a: 8, op: '+', b: -3 },
  e1d: { label: '(d)', a: -10, op: '-', b: -4 }
};
const exprTex = (a, op, b) => `${a}${op === '+' ? '+' : '-'}${neg(b)}`;
/** the same-sign / different-sign rule in words, for a + m */
function ruleText(a, m) {
  const r = a + m;
  if (a === 0 || m === 0) return '';
  if ((a < 0) === (m < 0)) return `Same signs: add ${Math.abs(a)} + ${Math.abs(m)} = ${Math.abs(r)}, keep the ${a < 0 ? '−' : '+'}.`;
  const big = Math.abs(a) > Math.abs(m) ? a : m;
  return `Different signs: ${Math.max(Math.abs(a), Math.abs(m))} − ${Math.min(Math.abs(a), Math.abs(m))} = ${Math.abs(r)}, sign of the ${Math.abs(big)}${r === 0 ? '' : ` (${sgnWord(big)})`}.`;
}
const walk = {
  title: 'Walk it on a number line',
  height: 320,
  minW: 900,
  capH: 96,
  choices: Object.keys(WALK).map((k) => ({ v: k, label: WALK[k].label })),
  intro: (k) => { const d = WALK[k]; return `Evaluate ${T(exprTex(d.a, d.op, d.b))} by walking on the number line. Press <b>Next</b>.`; },
  make(stage, k, ex) {
    const d = WALK[k], m = d.op === '+' ? d.b : -d.b, r = d.a + m, W = ex.W;
    const head = lab(stage, W / 2, 34, K(`${exprTex(d.a, d.op, d.b)}`), 'u1l1-head');
    const re = hide(lab(stage, W / 2, 88, '', 'u1l1-sub'));
    const N = new NumberLine(stage, { x: 10, y: 110, width: W - 20, height: 190, min: -13, max: 13, axisY: 110 });
    const pill = (v, txt, cls) => lab(stage, 10 + N.toPx(v), 110 + 110 + 62, txt, 'u1l1-pill ' + cls);
    const mv = m > 0 ? `+${m}` : `${m}`, dir = m > 0 ? 'right' : 'left', col = m > 0 ? POS : NEG;
    const steps = [
      { cap: `Start at <b>${mn(d.a)}</b>.`,
        run: async (c) => { const p = N.point(d.a, { color: 'ink' }); await pop(c, p); await pop(c, pill(d.a, 'start', 'u1l1-pink')); } }
    ];
    if (d.op === '-') steps.push({
      cap: `Subtracting is <b>adding the opposite</b>: ${T(`${exprTex(d.a, '-', d.b)}=${exprTex(d.a, '+', -d.b)}`)}. ${d.b < 0 ? 'Taking away a negative is the same as adding a positive.' : 'Taking away a positive is the same as adding a negative.'}`,
      run: async (c) => { re.innerHTML = K(`=${exprTex(d.a, '+', -d.b)}`); await show(c, re); }
    });
    steps.push({
      cap: `Adding <b>${m > 0 ? 'a positive' : 'a negative'}</b> moves <b>${dir}</b>: ${Math.abs(m)} steps ${dir}.`,
      run: async (c) => { await N.hop(c, d.a, r, { label: mn(mv), color: col, height: 64, ms: 380 + Math.abs(m) * 70 }); }
    });
    steps.push({
      cap: `Land on <b>${mn(r)}</b>. So ${T(`${exprTex(d.a, d.op, d.b)}=${r}`)}. <span class="muted">${ruleText(d.a, m)}</span>`,
      run: async (c) => {
        const p = N.point(r, { color: 'red' }); await pop(c, p); await pop(c, pill(r, mn(r), 'u1l1-pred'));
        const end = h('span', 'u1l1-ans', K(`=${r}`)); head.appendChild(end); await pop(c, end);
      }
    });
    return steps;
  }
};

/* =============================== explainer: integer chips =============================== */
const CHIPS = {
  n2: { label: 'Notes: −5 + (−2)', a: -5, op: '+', b: -2 },
  n3: { label: '−9 + 4', a: -9, op: '+', b: 4 },
  n4: { label: '−6 − (−10)', a: -6, op: '-', b: -10 },
  e1a: { label: 'Example 1 check: (a)', a: -6, op: '+', b: 9 },
  e1b: { label: '(b)', a: -7, op: '-', b: 5 },
  e1c: { label: '(c)', a: 8, op: '+', b: -3 },
  e1d: { label: '(d)', a: -10, op: '-', b: -4 }
};
const chips = {
  title: 'Integer chips: zero pairs',
  height: 310,
  minW: 920,
  capH: 96,
  choices: Object.keys(CHIPS).map((k) => ({ v: k, label: CHIPS[k].label })),
  intro: (k) => { const d = CHIPS[k]; return `A <b class="u1l1-cy">yellow</b> chip is <b>+1</b>, a <b class="u1l1-cr">red</b> chip is <b>−1</b>. Model ${T(exprTex(d.a, d.op, d.b))}. Press <b>Next</b>.`; },
  make(stage, k, ex) {
    const d = CHIPS[k], W = ex.W, S = 56, R0 = 26, X0 = 80, YY = 90, YR = 200;
    const panelX = W - 210, P = add(stage, box(h('div', 'u1l1-panel'), 200, 290), panelX, 10);
    P.innerHTML = `<div class="u1l1-ph">Working</div>`;
    const pline = (html, cls = '') => { const e = h('div', 'u1l1-line ' + cls, html); P.appendChild(e); return e; };
    add(stage, h('div', 'u1l1-rowlab u1l1-cy', '+1'), 12, YY - 18); add(stage, h('div', 'u1l1-rowlab u1l1-cr', '−1'), 12, YR - 18);
    const tray = svgEl('svg', { class: 'u1l1-tray', width: 760, height: 240 }); add(stage, tray, 0, 40);
    const rows = { Y: [], R: [] };
    const X = (i) => X0 + i * S;
    const mk = (kind, i) => {
      const e = h('div', 'u1l1-chip ' + (kind === 'Y' ? 'u1l1-chy' : 'u1l1-chr'), kind === 'Y' ? '+' : '−');
      add(stage, e, X(i) - R0, (kind === 'Y' ? YY : YR) - R0); e.col = i; return e;
    };
    const place = (e, i) => { e.col = i; e.style.left = (X(i) - R0) + 'px'; };
    const addChips = async (c, kind, n, o = {}) => {
      const out = [];
      for (let j = 0; j < n; j++) { const i = o.at != null ? o.at + j : rows[kind].length; const e = hide(mk(kind, i)); rows[kind].push(e); out.push(e); }
      rows[kind].sort((p, q) => p.col - q.col);
      await Promise.all(out.map((e, j) => pop(c, e, 300, { delay: j * 50 })));
      return out;
    };
    const slide = async (c) => {
      const moves = [];
      for (const kind of ['Y', 'R']) rows[kind].forEach((e, i) => { if (e.col !== i) { const dx = (e.col - i) * S; place(e, i); moves.push(anim(c, e, [{ transform: `translateX(${dx}px)` }, { transform: 'none' }], 420)); } });
      await Promise.all(moves);
    };
    const ka = d.a > 0 ? 'Y' : 'R', na = Math.abs(d.a), kb = d.b > 0 ? 'Y' : 'R', nb = Math.abs(d.b), other = (q) => (q === 'Y' ? 'R' : 'Y');
    const word = (q, n) => `${n} ${q === 'Y' ? '<b class="u1l1-cy">yellow</b>' : '<b class="u1l1-cr">red</b>'}`;
    const steps = [];
    steps.push({ cap: `Start with ${T(String(d.a))}: ${word(ka, na)} chips.`,
      run: async (c) => { await addChips(c, ka, na); await show(c, pline(K(String(d.a)))); } });
    const r = d.op === '+' ? d.a + d.b : d.a - d.b;
    if (d.op === '+') {
      const pairs = ka === kb ? 0 : Math.min(na, nb);
      steps.push({ cap: `Add ${T(neg(d.b))}: put in ${word(kb, nb)} chips.`,
        run: async (c) => { await addChips(c, kb, nb); await show(c, pline(K(exprTex(d.a, '+', d.b)))); } });
      if (pairs) {
        let rings = [];
        steps.push({ cap: `A yellow and a red make a <b>zero pair</b>: ${T('(+1)+(-1)=0')}. Circle the ${pairs} zero pairs.`,
          run: async (c) => {
            rings = []; for (let i = 0; i < pairs; i++) { const g = svgEl('rect', { x: X(i) - R0 - 6, y: YY - 40 - R0 - 6, width: 2 * (R0 + 6), height: YR - YY + 2 * (R0 + 6), rx: R0 + 6, class: 'u1l1-ring' }, tray); hide(g); rings.push(g); }
            await Promise.all(rings.map((g, i) => appear(c, g, 250, { delay: i * 60 })));
          } });
        steps.push({ cap: `Zero pairs are worth <b>0</b>, so take them away.`,
          run: async (c) => {
            const gone = [...rows.Y.slice(0, pairs), ...rows.R.slice(0, pairs)];
            rows.Y = rows.Y.slice(pairs); rows.R = rows.R.slice(pairs);
            await Promise.all([...gone, ...rings].map((e) => anim(c, e, [{ opacity: 1 }, { opacity: 0 }], 380)));
            gone.forEach((e) => e.remove()); rings.forEach((g) => g.remove());
            await slide(c);
          } });
      } else steps.push({ cap: `All the chips are the <b>same colour</b>, so there are no zero pairs. Just count them.`, run: async (c) => { await Promise.all([...rows.Y, ...rows.R].map((e, i) => pulse(c, e, 1.12))); } });
    } else {
      const have = d.a !== 0 && ka === kb ? na : 0, need = Math.max(0, nb - have);
      const takeAway = async (c) => {
        const list = rows[kb], gone = list.slice(list.length - nb); rows[kb] = list.slice(0, list.length - nb);
        await Promise.all(gone.map((e, i) => anim(c, e, [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-60px) scale(.6)' }], 420, { delay: i * 40 })));
        gone.forEach((e) => e.remove()); await slide(c);
      };
      steps.push({ cap: `Subtract ${T(neg(d.b))}: <b>take away</b> ${word(kb, nb)} chips.${need ? (have ? ` But there ${have === 1 ? 'is' : 'are'} only ${have}!` : ` But there are no ${kb === 'Y' ? 'yellow' : 'red'} chips!`) : ''}`,
        run: async (c) => { await show(c, pline(K(exprTex(d.a, '-', d.b)))); if (!need) await takeAway(c); } });
      if (need) steps.push({ cap: `Add <b>${need} zero pairs</b>. They are worth 0, so the value is still ${mn(d.a)}. Now there are enough ${kb === 'Y' ? 'yellow' : 'red'} chips.`,
        run: async (c) => {
          const at = Math.max(rows.Y.length, rows.R.length);
          await Promise.all([addChips(c, 'Y', need, { at }), addChips(c, 'R', need, { at })]);
        } });
      if (need) steps.push({ cap: `Take away the ${word(kb, nb)} chips.`, run: takeAway });
    }
    steps.push({ cap: `What’s left: ${r === 0 ? 'nothing' : word(r > 0 ? 'Y' : 'R', Math.abs(r)) + ' chips'}. So ${T(`${exprTex(d.a, d.op, d.b)}=${r}`)}.`
        + (d.op === '-' ? ` <span class="muted">Same as adding the opposite: ${T(`${exprTex(d.a, '+', -d.b)}=${r}`)}.</span>` : ''),
      run: async (c) => {
        const all = [...rows.Y, ...rows.R]; await Promise.all(all.map((e) => pulse(c, e, 1.15)));
        if (d.op === '-') await show(c, pline(K(`=${exprTex(d.a, '+', -d.b)}`)));
        const L = pline(K(`=\\boldsymbol{${r}}`), 'u1l1-big u1l1-cr2'); await show(c, L);
      } });
    return steps;
  }
};

/* =============================== explainer: the sign rules (flip across zero) =============================== */
const SIGNS = {
  n1: { label: 'Notes: (−4)(3)', a: -4, op: '*', b: 3 },
  n2: { label: '(−4)(−3)', a: -4, op: '*', b: -3 },
  n3: { label: '12 ÷ (−3)', a: 12, op: '/', b: -3 },
  n4: { label: '−12 ÷ (−3)', a: -12, op: '/', b: -3 },
  e2a: { label: 'Example 2 check: (a)', a: -4, op: '*', b: 6 },
  e2b: { label: '(b)', a: -9, op: '*', b: -3 },
  e2c: { label: '(c)', a: 20, op: '/', b: -5 },
  e2d: { label: '(d)', a: -36, op: '/', b: -4, br: true }
};
const sTex = (d) => (d.op === '*' ? `(${d.a})(${d.b})` : `${d.br ? `(${d.a})` : d.a}\\div${neg(d.b)}`);
const signs = {
  title: 'Each negative sign flips the answer',
  height: 330,
  minW: 920,
  capH: 96,
  choices: Object.keys(SIGNS).map((k) => ({ v: k, label: SIGNS[k].label })),
  intro: (k) => `Evaluate ${T(sTex(SIGNS[k]))}: first the size, then the sign. Press <b>Next</b>.`,
  make(stage, k, ex) {
    const d = SIGNS[k], A = Math.abs(d.a), B = Math.abs(d.b), m = d.op === '*' ? A * B : A / B, r = d.op === '*' ? d.a * d.b : d.a / d.b;
    const W = ex.W, LW = 600, R = Math.max(5, Math.ceil((m + 2) / 5) * 5);
    const head = lab(stage, LW / 2 + 10, 34, K(sTex(d)), 'u1l1-head');
    const N = new NumberLine(stage, { x: 10, y: 130, width: LW, height: 120, min: -R, max: R, step: R <= 15 ? 1 : 5, labelStep: 5, axisY: 70 });
    // the arrow from 0, redrawn as it flips: s = +1 (right) … −1 (left)
    const g = svgEl('g', { class: 'u1l1-arrow' }, N.layers.top), ln = svgEl('line', { 'stroke-width': 6, 'stroke-linecap': 'round' }, g), hd = svgEl('path', {}, g);
    const y0 = N.ay - 26, x0 = N.toPx(0), L = N.toPx(m) - x0;
    let s = 1;
    const draw = (sv) => {
      s = sv; const col = sv >= 0 ? BLUE : RED, x1 = x0 + sv * L, dir = sv >= 0 ? 1 : -1, show2 = Math.abs(sv) > 0.08;
      ln.setAttribute('x1', x0); ln.setAttribute('y1', y0); ln.setAttribute('x2', x1 - dir * 6); ln.setAttribute('y2', y0); ln.setAttribute('stroke', col);
      hd.setAttribute('d', show2 ? `M${x1 + dir * 8} ${y0} L${x1 - dir * 10} ${y0 - 11} L${x1 - dir * 10} ${y0 + 11} Z` : ''); hd.setAttribute('fill', col);
    };
    hide(g);
    const val = hide(lab(stage, x0 + 10, 116, '', 'u1l1-val'));
    const setVal = (v) => { val.innerHTML = K(String(v)); val.style.left = (N.toPx(v) + 10) + 'px'; val.style.color = v < 0 ? RED : BLUE; };
    // the sign table
    const TX = LW + 60, cell = 78;
    add(stage, h('div', 'u1l1-stlab', '1st ↓ &nbsp; 2nd number →'), TX - 4, 2);
    const tb = add(stage, h('div', 'u1l1-stab'), TX, 26);
    tb.innerHTML = `<div class="u1l1-sth">${d.op === '*' ? '×' : '÷'}</div><div class="u1l1-sth">+</div><div class="u1l1-sth">−</div>`
      + `<div class="u1l1-sth">+</div><div class="u1l1-stc u1l1-sp" data-c="pp">+</div><div class="u1l1-stc u1l1-sn" data-c="pn">−</div>`
      + `<div class="u1l1-sth">−</div><div class="u1l1-stc u1l1-sn" data-c="np">−</div><div class="u1l1-stc u1l1-sp" data-c="nn">+</div>`;
    tb.style.gridTemplateColumns = `56px ${cell}px ${cell}px`;
    const tnote = add(stage, h('div', 'u1l1-tnote', 'Same signs → <b>+</b><br>Different signs → <b class="u1l1-cr">−</b>'), TX, 250);
    void tnote;
    const key = (d.a < 0 ? 'n' : 'p') + (d.b < 0 ? 'n' : 'p'), cellEl = tb.querySelector(`[data-c="${key}"]`);
    const flips = [d.a < 0, d.b < 0];
    const opW = d.op === '*' ? 'times' : 'divided by';
    const steps = [
      { cap: `Ignore the signs first: ${T(`${A}${d.op === '*' ? '\\times' : '\\div'}${B}=${m}`)}. Draw it as an arrow from 0 to ${m}.`,
        run: async (c) => { draw(1); await appear(c, g, 200); await tween(c, 500, (t) => draw(t)); setVal(m); await pop(c, val); } }
    ];
    let cur = 1;
    flips.forEach((f, i) => {
      const v = i === 0 ? d.a : d.b, from = cur; if (f) cur = -cur; const to = cur;
      steps.push({
        cap: f ? `${i === 0 ? 'The first' : 'The second'} number, ${T(String(v))}, is <b>negative</b>: <b>flip</b> the arrow across zero.${i === 1 && flips[0] ? ' Two flips: back to positive!' : ''}`
          : `${i === 0 ? 'The first' : 'The second'} number, ${T(String(v))}, is positive: no flip.`,
        run: async (c) => {
          if (f) { val.style.opacity = 0; await tween(c, 700, (t) => draw(from + (to - from) * t)); setVal(to * m); await pop(c, val); }
          else await pulse(c, val, 1.1);
        }
      });
    });
    steps.push({
      cap: `${flips[0] === flips[1] ? '<b>Same signs</b>' : '<b>Different signs</b>'}, so the answer is <b>${r > 0 ? 'positive' : 'negative'}</b>: ${T(`${sTex(d)}=${r}`)}.`,
      run: async (c) => {
        cellEl.classList.add('u1l1-on'); await pulse(c, cellEl, 1.15);
        const end = h('span', 'u1l1-ans', K(`=${r}`)); head.appendChild(end); await pop(c, end);
      }
    });
    void opW; void W;
    return steps;
  }
};

/* =============================== explainer: the pattern =============================== */
const pattern = {
  title: 'Keep the pattern going',
  height: 440,
  minW: 900,
  capH: 96,
  intro: 'Two lists of products. Each row multiplies by one less. Watch how the answers change. Press <b>Next</b>.',
  make(stage, v, ex) {
    const as = [3, 2, 1, 0, -1, -2];
    const L = new ValueTable(stage, { x: 30, y: 20, headers: ['\\text{product}', '\\text{answer}'], rows: as.map((a) => [`(${a})(4)`, a * 4]), hide: 1, tap: false, cellW: 140, cellH: 54, diffs: true, diffSpace: 80, cls: 'u1l1-pt' });
    const R = new ValueTable(stage, { x: ex.W / 2 + 20, y: 20, headers: ['\\text{product}', '\\text{answer}'], rows: as.map((a) => [`(${a})(-4)`, -a * 4]), hide: 1, tap: false, cellW: 140, cellH: 54, diffs: true, diffSpace: 80, cls: 'u1l1-pt' });
    hide(R.el);
    const reveal = async (c, Tb, rows) => { for (const r of rows) { await Tb.reveal(r, 1, c); await sleep(c, 120); } };
    return [
      { cap: `Positive times positive: ${T('(3)(4)=12')}, ${T('(2)(4)=8')}, ${T('(1)(4)=4')}, ${T('(0)(4)=0')}.`,
        run: (c) => reveal(c, L, [0, 1, 2, 3]) },
      { cap: `Each row the answer goes <b>down 4</b>. Keep going past zero: ${T('(-1)(4)=-4')} and ${T('(-2)(4)=-8')}. A negative times a positive is <b>negative</b>.`,
        run: async (c) => { await reveal(c, L, [4, 5]); await L.diffs(c, { color: RED }); [4, 5].forEach((r) => L.highlight(r, true, 'u1l1-hlneg')); } },
      { cap: `Now multiply by ${T('-4')}. From the first list we know ${T('(3)(-4)=-12')}, ${T('(2)(-4)=-8')}, ${T('(1)(-4)=-4')}, ${T('(0)(-4)=0')}.`,
        run: async (c) => { await appear(c, R.el, 250); await reveal(c, R, [0, 1, 2, 3]); } },
      { cap: `This time each row the answer goes <b>up 4</b>. Keep going: ${T('(-1)(-4)=4')} and ${T('(-2)(-4)=8')}.`,
        run: async (c) => { await reveal(c, R, [4, 5]); await R.diffs(c, { color: GRN }); } },
      { cap: `So a <b>negative times a negative is positive</b>. The pattern has no other choice!`,
        run: async (c) => { [4, 5].forEach((r) => R.highlight(r, true, 'u1l1-hlpos')); await pulse(c, R.cell(4, 1), 1.2); await pulse(c, R.cell(5, 1), 1.2); } }
    ];
  }
};

/* =============================== explainer: BEDMAS step by step =============================== */
const BED = {
  notes: { label: 'Notes: −4 + 2 × (−5)', src: '-4+2*(-5)' },
  dm: { label: '12 ÷ 2 × 3', src: '12/2*3' },
  warm: { label: 'Warm-up: the viral post', src: '6+4*2-(-3)^2' },
  e3a: { label: 'Example 3 check: (a)', src: '8-2*(-5)' },
  e3b: { label: '(b)', src: '(-3+7)*(-2)-1' },
  e4c: { label: 'Example 4(c)', src: '10-3*(-2)^2' },
  e5b: { label: 'Example 5(b)', src: '-2*(5-8)^2+(-6)/3' }
};
const LETTERS = [['B', 'Brackets'], ['E', 'Exponents'], ['DM', 'Divide / Multiply'], ['AS', 'Add / Subtract']];
const bedmas = {
  title: 'BEDMAS, one step at a time',
  height: 440,
  minW: 920,
  capH: 96,
  choices: Object.keys(BED).map((k) => ({ v: k, label: BED[k].label })),
  intro: (k) => `Evaluate ${T(evalSteps(BED[k].src).start)}. The next operation lights up. Press <b>Next</b>.`,
  make(stage, k, ex) {
    const E = evalSteps(BED[k].src), W = ex.W;
    const lad = add(stage, h('div', 'u1l1-ladder'), 14, 14);
    const rungs = {};
    LETTERS.forEach(([L, w]) => { const r = h('div', 'u1l1-rung', `<b>${L === 'DM' ? 'D&thinsp;M' : L === 'AS' ? 'A&thinsp;S' : L}</b><span>${w}</span>`); lad.appendChild(r); rungs[L] = r; });
    const X = 250, lineH = Math.min(62, Math.floor((ex.def.height - 30) / (E.steps.length + 1)));
    const lines = [], mk = (i, html) => { const e = add(stage, h('div', 'u1l1-bline', html), X, 14 + i * lineH); e.style.height = lineH + 'px'; lines.push(e); return e; };
    mk(0, K(E.start));
    const note = (i, html) => add(stage, h('div', 'u1l1-bnote', html), W - 10, 14 + i * lineH);
    const steps = [];
    const names = { B: 'Brackets first', E: 'Exponent', DM: 'Multiply or divide', AS: 'Add or subtract' };
    E.steps.forEach((s, i) => {
      const letter = s.inB ? 'B' : s.letter;
      const what = s.letter === 'E' ? 'exponent' : s.op === '*' ? 'multiply' : s.op === '/' ? 'divide' : s.op === '+' ? 'add' : 'subtract';
      const dmWhy = s.dmCount > 1 ? 'D and M together, left to right' : s.asLeft ? 'D and M come before A and S' : '';
      const why = s.inB ? `<b>Brackets first</b> (${what} inside):` : s.letter === 'E' ? '<b>Exponents</b> next:' : s.letter === 'DM' ? `<b>${what === 'multiply' ? 'Multiply' : 'Divide'}</b>${dmWhy ? ' (' + dmWhy + ')' : ''}:` : `<b>${what === 'add' ? 'Add' : 'Subtract'}</b>${s.asLeft && i < E.steps.length - 1 ? ', left to right' : ''}:`;
      steps.push({
        cap: `${why} ${T(s.d)}.`,
        run: async (c) => {
          Object.values(rungs).forEach((r) => r.classList.remove('on'));
          rungs[letter].classList.add('on', 'used');
          lines[i].innerHTML = K((i ? '=' : '') + s.before);
          const op = lines[i].querySelector('.u1l1-op'); if (op) await pulse(c, op, 1.08);
          const nt = note(i, `<span class="u1l1-tag">${s.inB ? 'Brackets' : s.letter === 'E' ? 'Exponent' : what[0].toUpperCase() + what.slice(1)}</span>`); nt.style.translate = '-100% 0'; await appear(c, nt, 200);
          const ln = hide(mk(i + 1, K('=' + s.after))); await show(c, ln);
        }
      });
    });
    steps.push({
      cap: `Done: ${T(`${E.start}=${E.value}`)}.`,
      run: async (c) => {
        Object.values(rungs).forEach((r) => r.classList.remove('on'));
        const last = lines[lines.length - 1]; last.classList.add('u1l1-final');
        await pulse(c, last, 1.08);
      }
    });
    return steps;
  }
};

/* =============================== explainer: the warm-up's comment section =============================== */
const COMM = {
  A: { label: 'A: @pizza_lover_22', user: '@pizza_lover_22', said: 11,
    work: [['6+4=10', true, 'Added first: went <b>left to right</b>'], ['10\\times2=20', false], ['(-3)^2=9', false], ['20-9=11', false]] },
  B: { label: 'B: @MathWiz_99', user: '@MathWiz_99', said: 23,
    work: [['4\\times2=8', false], ['(-3)^2=-9', true, '<b>Wrong sign:</b> same signs give a positive'], ['6+8-(-9)', false], ['=6+8+9=23', false]] },
  D: { label: 'D: @grandma_joan', user: '@grandma_joan', said: 29,
    work: [['6+4=10', true, 'Went <b>left to right</b>'], ['10\\times2=20', false], ['(-3)^2=-9', true, '<b>Wrong sign</b> too'], ['20-(-9)=29', false]] },
  C: { label: 'C: @sk8r_sam', user: '@sk8r_sam', said: 5,
    work: [['(-3)^2=9', false], ['4\\times2=8', false], ['6+8=14', false], ['14-9=5', false]] }
};
const comments = {
  title: 'Who slipped, and where?',
  height: 420,
  minW: 920,
  capH: 96,
  choices: Object.keys(COMM).map((k) => ({ v: k, label: COMM[k].label })),
  intro: (k) => `${COMM[k].user} said <b>${COMM[k].said}</b>. Follow the working for ${T('6+4\\times2-(-3)^2')}. Press <b>Next</b>.`,
  make(stage, k, ex) {
    const d = COMM[k], W = ex.W, E = evalSteps('6+4*2-(-3)^2');
    const colW = (W - 50) / 2;
    const L = add(stage, box(h('div', 'u1l1-panel'), colW, 380), 14, 20), R = add(stage, box(h('div', 'u1l1-panel u1l1-pok'), colW, 380), 36 + colW, 20);
    L.innerHTML = `<div class="u1l1-ph">${d.user}’s working</div>`; R.innerHTML = '<div class="u1l1-ph">BEDMAS</div>';
    const right = [K(E.start), ...E.steps.map((s) => K('=' + s.plain))];
    const rEls = right.map((x) => { const e = hide(h('div', 'u1l1-line', x)); R.appendChild(e); return e; });
    L.appendChild(h('div', 'u1l1-line u1l1-gray', K('6+4\\times2-(-3)^2')));
    const yours = d.work.map(([t, bad, why]) => { const e = hide(h('div', 'u1l1-line' + (bad ? ' u1l1-slip' : ''), K(t) + (bad ? `<div class="u1l1-why">${why}</div>` : ''))); L.appendChild(e); return e; });
    const steps = [], bad = d.work.filter((w) => w[1]), ok = !bad.length;
    steps.push({ cap: `Here is how ${d.user} got <b>${d.said}</b>.`,
      run: async (c) => { for (const e of yours) { e.classList.remove('u1l1-mark'); await show(c, e); } } });
    steps.push({ cap: ok ? 'No slips: the exponent first, then multiply, then add and subtract left to right.' : `Find the slip${bad.length > 1 ? 's' : ''}: ${bad.map((w) => w[2].replace(/<[^>]+>/g, '')).join('; ')}.`,
      run: async (c) => { const els = yours.filter((e) => e.classList.contains('u1l1-slip')); els.forEach((e) => e.classList.add('u1l1-mark')); if (els.length) await Promise.all(els.map((e) => shake(c, e))); else await Promise.all(yours.map((e) => pulse(c, e, 1.04))); } });
    steps.push({ cap: `BEDMAS: the exponent first (${T('(-3)^2=9')}), then multiply (${T('4\\times2=8')}), then add and subtract left to right.`,
      run: async (c) => { for (const e of rEls) await show(c, e); } });
    steps.push({ cap: ok ? `The answer is <b>${E.value}</b>, with only 34 likes. <b>Popular ≠ correct.</b>` : `${d.user} said ${d.said}, but the answer is <b>${E.value}</b>. Lots of likes don’t make it right!`,
      run: async (c) => {
        const st = hide(stamp(stage, ok ? `✓ ${E.value}` : `✗ ${d.said}`, { ok, x: 14 + colW / 2, y: 362 }));
        const st2 = hide(stamp(stage, `✓ ${E.value}`, { ok: true, x: 36 + colW * 1.5, y: 362 }));
        await stampIn(c, st); await stampIn(c, st2);
      } });
    return steps;
  }
};

/* =============================== explainer: (−3)² vs −3² =============================== */
const NSQ = { n3: { label: 'Notes: (−3)² vs −3²', b: 3 }, e4: { label: 'Example 4 check: (b) and (a)', b: 4 } };
const negsq = {
  title: 'How far does the exponent reach?',
  height: 400,
  minW: 900,
  capH: 96,
  choices: Object.keys(NSQ).map((k) => ({ v: k, label: NSQ[k].label })),
  intro: (k) => `${T(`(-${NSQ[k].b})^2`)} and ${T(`-${NSQ[k].b}^2`)} look almost the same. Are they? Press <b>Next</b>.`,
  make(stage, k, ex) {
    const b = NSQ[k].b, W = ex.W, cw = (W - 50) / 2;
    const P1 = add(stage, box(h('div', 'u1l1-panel u1l1-nsp'), cw, 370), 14, 14), P2 = add(stage, box(h('div', 'u1l1-panel u1l1-nsp'), cw, 370), 36 + cw, 14);
    P1.innerHTML = '<div class="u1l1-ph">With brackets</div>'; P2.innerHTML = '<div class="u1l1-ph">No brackets</div>';
    const e1 = h('div', 'u1l1-nsx', K(`\\htmlClass{u1l1-reach}{(-${b})}^{2}`)), e2 = h('div', 'u1l1-nsx', K(`\\htmlClass{u1l1-minus}{-}\\htmlClass{u1l1-reach}{${b}}^{2}`));
    P1.appendChild(e1); P2.appendChild(e2);
    const l1 = [K(`=(-${b})\\times(-${b})`), K(`=\\boldsymbol{${b * b}}`)].map((x) => { const e = hide(h('div', 'u1l1-line u1l1-nsl', x)); P1.appendChild(e); return e; });
    const l2 = [K(`=-(${b}\\times${b})`), K(`=\\boldsymbol{-${b * b}}`)].map((x) => { const e = hide(h('div', 'u1l1-line u1l1-nsl', x)); P2.appendChild(e); return e; });
    const hug = (P, ex1, txt) => {
      const r = ex1.querySelector('.u1l1-reach'), bx = relBox(r, P), hb = h('div', 'u1l1-hug');
      add(P, hb, bx.x - 4, bx.y - 16); box(hb, bx.w + 8, 14); hb.style.position = 'absolute';
      const t = h('div', 'u1l1-hugt', txt); add(P, t, bx.x + bx.w / 2, bx.y - 44); t.style.position = 'absolute'; t.style.translate = '-50% 0';
      return [hb, t];
    };
    let H1 = [], H2 = [];
    return [
      { cap: `With brackets, the exponent reaches the <b>whole</b> ${T(`(-${b})`)}: the negative is squared too.`,
        run: async (c) => { H1 = hug(P1, e1, 'squared'); await Promise.all(H1.map((e) => fadeIn(c, e, 350))); } },
      { cap: `Without brackets, the exponent reaches <b>only the ${b}</b>. The negative sign waits outside and is applied last.`,
        run: async (c) => { H2 = hug(P2, e2, 'squared'); e2.querySelector('.u1l1-minus').classList.add('u1l1-wait'); await Promise.all(H2.map((e) => fadeIn(c, e, 350))); } },
      { cap: `Left: ${T(`(-${b})\\times(-${b})`)}, same signs, so positive. Right: ${T(`-(${b}\\times${b})`)}, the negative stays.`,
        run: async (c) => { await show(c, l1[0]); await show(c, l2[0]); } },
      { cap: `${T(`(-${b})^2=${b * b}`)} but ${T(`-${b}^2=-${b * b}`)}. <b>Not the same!</b> The brackets decide whether the negative gets squared.`,
        run: async (c) => {
          await show(c, l1[1]); await show(c, l2[1]);
          const s1 = hide(stamp(P1, String(b * b), { ok: true, x: cw / 2, y: 320 })), s2 = hide(stamp(P2, '−' + b * b, { ok: false, x: cw / 2, y: 320 }));
          await stampIn(c, s1); await stampIn(c, s2);
        } }
    ];
  }
};

/* =============================== explainer: up is +, down is − (the submarine) =============================== */
const SUB = {
  e5a: { label: 'Example 5(a) check: the submarine', start: -45, moves: [20, -12], who: 'submarine', words: ['rises 20 m', 'descends 12 m'] },
  diver: { label: 'Demo: a diver', start: -8, moves: [-15, 6], who: 'diver', words: ['dives 15 m deeper', 'swims up 6 m'] }
};
function subFig(svg, who) {
  const g = svgEl('g', { class: 'u1l1-subfig' }, svg);
  if (who === 'submarine') {
    svgEl('rect', { x: -46, y: -14, width: 92, height: 28, rx: 14, fill: '#f2c14e', stroke: INK, 'stroke-width': 2 }, g);
    svgEl('rect', { x: -10, y: -28, width: 26, height: 16, rx: 4, fill: '#f2c14e', stroke: INK, 'stroke-width': 2 }, g);
    for (const x of [-26, -6, 14]) svgEl('circle', { cx: x, cy: 0, r: 5, fill: '#cfe8f7', stroke: INK, 'stroke-width': 1.5 }, g);
    svgEl('path', { d: 'M46 0 l12 -9 v18 z', fill: INK }, g);
  } else {
    svgEl('circle', { cx: 0, cy: -18, r: 9, fill: '#f5d0b0', stroke: INK, 'stroke-width': 2 }, g);
    svgEl('rect', { x: -5, y: -24, width: 13, height: 7, rx: 3, fill: '#bfe3f5', stroke: INK, 'stroke-width': 1.5 }, g);
    svgEl('path', { d: 'M0 -9 L0 14 M0 0 L-14 -6 M0 0 L14 -6 M0 14 L-9 30 M0 14 L9 30', stroke: INK, 'stroke-width': 4, 'stroke-linecap': 'round', fill: 'none' }, g);
    svgEl('rect', { x: -14, y: -8, width: 8, height: 18, rx: 3, fill: '#888', stroke: INK, 'stroke-width': 1.5 }, g);
  }
  return g;
}
const sub = {
  title: 'Up is +, down is −',
  height: 470,
  minW: 900,
  capH: 96,
  choices: Object.keys(SUB).map((k) => ({ v: k, label: SUB[k].label })),
  intro: (k) => (k === 'e5a' ? 'A submarine at a depth of −45 m rises 20 m, then descends 12 m. Press <b>Next</b>.' : 'A diver at −8 m dives 15 m deeper, then swims up 6 m. Press <b>Next</b>.'),
  make(stage, k, ex) {
    const d = SUB[k], W = ex.W, H = ex.def.height, top = 30, bot = H - 24, vmax = 10, vmin = -60;
    const Y = (v) => top + (vmax - v) / (vmax - vmin) * (bot - top);
    const svg = svgEl('svg', { class: 'u1l1-sea', width: 520, height: H }); add(stage, svg, 0, 0);
    svgEl('rect', { x: 60, y: 0, width: 460, height: Y(0), fill: '#eef6fc' }, svg);
    svgEl('rect', { x: 60, y: Y(0), width: 460, height: H - Y(0), fill: '#cfe6f5' }, svg);
    svgEl('path', { d: `M60 ${Y(0)} q 20 -8 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 20 0`, stroke: '#4f93c7', 'stroke-width': 3, fill: 'none' }, svg);
    svgEl('line', { x1: 60, y1: top - 10, x2: 60, y2: bot + 6, stroke: INK, 'stroke-width': 2.5 }, svg);
    for (let v = vmax; v >= vmin; v -= 5) {
      const y = Y(v), big = v % 10 === 0;
      svgEl('line', { x1: big ? 50 : 54, y1: y, x2: 66, y2: y, stroke: INK, 'stroke-width': big ? 2.2 : 1.4 }, svg);
      if (big) { const t = svgEl('text', { x: 44, y: y + 6, 'text-anchor': 'end', class: 'u1l1-seanum' }, svg); t.textContent = v < 0 ? '−' + -v : String(v); }
    }
    const surf = svgEl('text', { x: 510, y: Y(0) - 8, 'text-anchor': 'end', class: 'u1l1-sealab' }, svg); surf.textContent = 'surface (0 m)';
    const fig = subFig(svg, d.who), FX = 260;
    const put = (v) => fig.setAttribute('transform', `translate(${FX} ${Y(v)})`);
    hide(fig); put(d.start);
    const P = add(stage, box(h('div', 'u1l1-panel'), W - 560, H - 40), 545, 20);
    P.innerHTML = '<div class="u1l1-ph">The expression</div>';
    const pl = (html, cls = '') => { const e = hide(h('div', 'u1l1-line ' + cls, html)); P.appendChild(e); return e; };
    const pos = [d.start]; d.moves.forEach((m) => pos.push(pos[pos.length - 1] + m));
    const fin = pos[pos.length - 1], exprS = d.start + d.moves.map((m) => (m > 0 ? '+' + m : String(m))).join('');
    const parts = [String(d.start)];
    const steps = [
      { cap: `The ${d.who} starts at ${T(String(d.start))} m: ${-d.start} m <b>below</b> the surface.`,
        run: async (c) => {
          await appear(c, fig, 300);
          const dot = svgEl('circle', { cx: 60, cy: Y(d.start), r: 7, fill: INK }, svg); hide(dot); await appear(c, dot, 200);
          await show(c, pl(`Start: ${K(String(d.start))}`));
        } }
    ];
    d.moves.forEach((m, i) => {
      const a = pos[i], b = pos[i + 1], up = m > 0;
      parts.push(m > 0 ? '+' + m : String(m));
      const sofar = parts.join('');
      steps.push({
        cap: `The ${d.who} <b>${d.words[i]}</b>: ${up ? 'up is <b>+</b>' : 'down is <b>−</b>'}, so ${T(up ? '+' + m : String(m))}. ${T(`${a}${up ? '+' + m : m}=${b}`)}.`,
        run: async (c) => {
          const ar = svgEl('line', { x1: 60 + 26 + i * 52, y1: Y(a), x2: 60 + 26 + i * 52, y2: Y(a), stroke: up ? POS : NEG, 'stroke-width': 6, 'stroke-linecap': 'round' }, svg);
          const tl = svgEl('text', { x: 60 + 36 + i * 52, y: (Y(a) + Y(b)) / 2 + 6, class: 'u1l1-seamv' }, svg); tl.textContent = up ? '+' + m : '−' + -m; tl.setAttribute('fill', up ? AMB : RED); hide(tl);
          await tween(c, 300 + Math.abs(m) * 40, (t) => { const v = a + (b - a) * t; ar.setAttribute('y2', Y(v)); put(v); });
          await appear(c, tl, 200);
          const dot = svgEl('circle', { cx: 60, cy: Y(b), r: 7, fill: i === d.moves.length - 1 ? RED : INK }, svg); hide(dot); await appear(c, dot, 200);
          await show(c, pl(K(sofar) + `<span class="muted"> → ${K(String(b))}</span>`));
        }
      });
    });
    steps.push({
      cap: `Final: ${T(`${exprS}=${fin}`)}. The ${d.who} ends at ${T(String(fin))} m, ${-fin} m below the surface.`,
      run: async (c) => {
        await show(c, pl(K(`${exprS}`), 'u1l1-big'));
        await show(c, pl(K(`=${pos[1]}${d.moves[1] > 0 ? '+' + d.moves[1] : d.moves[1]}=\\boldsymbol{${fin}}`), 'u1l1-big u1l1-cr2'));
        const st = hide(stamp(P, `${mn(fin)} m`, { ok: true, cls: 'u1l1-nocase' })); st.style.alignSelf = 'center'; st.style.marginTop = 'auto'; await stampIn(c, st);
      }
    });
    return steps;
  }
};

/* ============ Stand Up Break! (whiteboard stations) ============ */
(() => {
  const r0 = (r, a, b) => { let v = 0; while (v === 0) v = r.int(a, b); return v; };
  const lit = (v, first) => (v < 0 && !first ? `(${v})` : String(v));   // engine source for a number
  const steps = (src) => { const E = evalSteps(src); return { q: E.start, a: E.steps.map((s) => '=' + s.plain), v: E.value }; };
  // Beginning: one operation — add, subtract, multiply or divide (at least one negative)
  function beg(r) {
    for (;;) {
      const kind = r.pick(['+', '-', '-', '*', '/']);
      let a = r0(r, -15, 15), b = r0(r, -12, 12);
      if (kind === '*') { a = r0(r, -9, 9); b = r0(r, -9, 9); }
      if (kind === '/') { b = r0(r, -9, 9); a = b * r0(r, -9, 9); }
      if (a > 0 && b > 0) continue;
      const src = lit(a, true) + kind + lit(b, false), E = evalSteps(src);
      const lines = [];
      if (kind === '-') lines.push(`=${a}+${neg(-b)}`);
      if (kind === '*' || kind === '/') lines.push(`\\text{${(a < 0) === (b < 0) ? 'same signs: positive' : 'different signs: negative'}}`);
      lines.push(`=${E.value}`);
      return { text: 'Evaluate.', q: E.start, a: lines };
    }
  }
  // Progressing: BEDMAS with two or three operations and brackets, no exponents
  function prg(r) {
    for (;;) {
      const t = r.int(0, 4), a = r0(r, -9, 9), b = r0(r, -6, 6), c = r0(r, -6, 6), d = r0(r, -9, 9);
      let src;
      if (t === 0) src = `${lit(a, true)}${r.pick(['+', '-'])}${Math.abs(b)}*${lit(c)}`;
      else if (t === 1) src = `(${lit(a, true)}${r.pick(['+', '-'])}${Math.abs(b)})*${lit(c)}${r.pick(['+', '-'])}${Math.abs(d)}`;
      else if (t === 2) { const q = r0(r, -6, 6); src = `${lit(q * c, true)}/${lit(c)}${r.pick(['+', '-'])}${lit(d)}`; }
      else if (t === 3) src = `${lit(a, true)}-${Math.abs(b)}*(${lit(c, true)}+${Math.abs(d)})`;
      else src = `${lit(a, true)}*${lit(b)}-${lit(c * d, true).replace(/^-/, '')}/${lit(c)}`;
      const s = steps(src);
      if (Math.abs(s.v) > 99 || !Number.isInteger(s.v)) continue;
      return { text: 'Evaluate. Show each step.', q: s.q, a: s.a };
    }
  }
  // Mastery: exponents with negatives, inside a longer BEDMAS expression
  function mas(r) {
    for (;;) {
      const t = r.int(0, 3), a = r0(r, -9, 12), b = r.int(2, 5), c = -r.int(1, 4), d = -r.int(1, 5), e = r.int(1, 6);
      let src;
      if (t === 0) src = `${lit(a, true)}-${b}*(${c})^2`;
      else if (t === 1) src = `-${b}^2+${lit(a)}*${lit(d)}`;
      else if (t === 2) { const p = r.int(1, 9), q = p + r.int(2, 6); src = `${lit(d, true)}*(${p}-${q})^2+${lit(-e * b, false)}/${b}`; }
      else src = `${lit(c * e, true)}/${e}-(${d})^2`;
      const s = steps(src);
      if (Math.abs(s.v) > 150 || !Number.isInteger(s.v)) continue;
      return { text: 'Evaluate. Show every step in order (watch the brackets on the exponents).', q: s.q, a: s.a };
    }
  }
  standup('u1l1', {
    intro: 'At your whiteboard station: watch the signs, and follow BEDMAS one step at a time.',
    levels: { BEG: beg, PRG: prg, MAS: mas }
  });
})();
/* ============ end Stand Up Break! ============ */

export const explainers = mountExplainers({ walk, chips, signs, pattern, bedmas, comments, negsq, sub });
export const _test = { parse, evalSteps };
