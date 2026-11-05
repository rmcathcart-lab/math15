/* Math 15 · Unit 2 · Lesson 5 — Zero Exponents.
 * Warm-up (The Folding Challenge: paper stacks with tap-to-reveal, the folds/layers table, the Moon poll) and the explainers:
 *   zstairs (count down the exponent: each step divides by the base, so a⁰ = 1 — from the 10C u2l1 "zero" staircase),
 *   zfold   (unfold the paper: 16 → 8 → 4 → 2 → 1 layer, beside a table of folds, layers and powers of 2),
 *   zcancel (aⁿ ÷ aⁿ written out: every factor cancels to 1, the quotient law gives a⁰ — from the 10C u2l3 "cancel"),
 *   zfence  (what is the 0 attached to? a fence around the base; 5x⁰ vs (5x)⁰ — from the 10C u2l1 "fenceZero"),
 *   ztf     (the same fence with a statement to test and a TRUE / FALSE stamp: Example 3),
 *   zsimp   (spot the zero, replace it with 1, then finish with the other laws, naming the law at each step).
 * Colours: the fence amber, a factor that turns into 1 green, the zero highlight and verdicts red. */
import { h, fmt } from '../explain.js';
import { tex, mountExplainers, stamp, stampIn } from '../blocks.js';
import { standup } from '../standup.js';

const at = (el, x, y) => { el.style.left = x + 'px'; el.style.top = y + 'px'; return el; };
const add = (stage, el, x, y) => { stage.appendChild(at(el, x, y)); return el; };
const hide = (...els) => els.forEach((e) => { if (e) e.style.opacity = 0; });
const svgEl = (tag, attrs = {}) => { const e = document.createElementNS('http://www.w3.org/2000/svg', tag); for (const k in attrs) e.setAttribute(k, attrs[k]); return e; };
/* KaTeX, allowing \htmlClass (parts of an expression we can find, measure and point at) */
const K = (src, display) => {
  try { return window.katex.renderToString(String(src), { displayMode: !!display, throwOnError: false, strict: 'ignore', trust: true, output: 'html' }); }
  catch (e) { return tex(src, display); }
};
const WORD = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

/* where an element sits inside a stage, in stage pixels (the lesson may be scaled to fit the screen) */
function rel(stage, el) {
  const sr = stage.getBoundingClientRect(), k = sr.width / stage.offsetWidth || 1, r = el.getBoundingClientRect();
  return { x: (r.left - sr.left) / k - stage.clientLeft, y: (r.top - sr.top) / k - stage.clientTop, w: r.width / k, h: r.height / k };
}
const unionR = (rs) => { const x = Math.min(...rs.map((r) => r.x)), y = Math.min(...rs.map((r) => r.y)); return { x, y, w: Math.max(...rs.map((r) => r.x + r.w)) - x, h: Math.max(...rs.map((r) => r.y + r.h)) - y }; };
/* KaTeX's wrapper spans don't always cover tall pieces (brackets, fractions): measure every visible descendant */
function relDeep(stage, el) {
  const rs = [el, ...el.querySelectorAll('*')].filter((e) => !(e instanceof SVGElement) || e.tagName === 'svg').map((e) => rel(stage, e)).filter((r) => r.w > 0.5 && r.h > 0.5);
  return rs.length ? unionR(rs) : rel(stage, el);
}
function frameAt(stage, r, cls, pad = 6) {
  const f = add(stage, h('div', 'u2l5-frame ' + (cls || '')), r.x - pad, r.y - pad);
  f.style.width = (r.w + 2 * pad) + 'px'; f.style.height = (r.h + 2 * pad) + 'px'; return f;
}
const ctr = (r) => ({ x: r.x + r.w / 2, y: r.y + r.h / 2 });
/* a centred row of LaTeX tokens; each token is its own span so it can fly in on its own */
function mkRow(stage, toks, cx, y, fs) {
  const row = add(stage, h('div', 'u2l5-row'), cx, y); row.style.fontSize = fs + 'px'; row.style.translate = '-50% 0';
  const els = toks.map((t) => { const e = h('span', 'u2l5-tok ' + (t.k || 'x'), K(t.t)); row.appendChild(e); return e; });
  return { row, els };
}
/* a token flies in from a point (stage coords) to its place in a row */
function flyIn(c, stage, el, from, ms = 700, delay = 0) {
  if (!from || c.fast) return c.anim(el, [{ opacity: 0 }, { opacity: 1 }], 300, { delay });
  const me = rel(stage, el), dx = from.x - (me.x + me.w / 2), dy = from.y - (me.y + me.h / 2);
  return c.anim(el, [{ opacity: 0, transform: `translate(${dx}px, ${dy}px) scale(1.5)` }, { opacity: 1, transform: `translate(${dx * 0.3}px, ${dy * 0.3 - 16}px) scale(1.2)`, offset: 0.55 }, { opacity: 1, transform: 'none' }], ms, { delay });
}
const pulse = (c, el, s = 1.15, ms = 420) => c.anim(el, [{ transform: 'scale(1)' }, { transform: `scale(${s})` }, { transform: 'scale(1)' }], ms);

/* =====================================================================
 * Warm-up: the folding challenge
 * ===================================================================== */
/* a stack of `n` paper layers, `w` px wide, drawn as HTML strips (bottom up) */
function paperStack(n, w, lh = 7, gap = 2) {
  const s = h('div', 'u2l5-stack'); s.style.width = w + 'px'; s.style.height = (n * (lh + gap)) + 'px';
  for (let i = 0; i < n; i++) { const l = h('i', 'u2l5-layer'); l.style.bottom = (i * (lh + gap)) + 'px'; l.style.height = lh + 'px'; s.appendChild(l); }
  return s;
}
function mountWarm() {
  const host = document.getElementById('u2l5-stacks');
  if (host) {
    [[1, 2, 160], [2, 4, 80], [3, 8, 40], [4, 16, 20]].forEach(([f, n, w]) => {
      const col = h('div', 'u2l5-sc'), pic = h('div', 'u2l5-spic');
      const st = paperStack(n, w); pic.appendChild(st);
      const lab = h('div', 'u2l5-slab', `<b>${f} fold${f > 1 ? 's' : ''}</b>`);
      const lay = h('div', 'u2l5-slay', `${n} layers`);
      if (f === 4) {
        st.classList.add('u2l5-hid');
        const q = h('button', 'u2l5-sq', '?'); q.type = 'button'; pic.appendChild(q);
        lay.innerHTML = '<span class="u2l5-cr">? layers</span>';
        q.addEventListener('click', () => { st.classList.remove('u2l5-hid'); q.remove(); lay.innerHTML = '<b class="u2l5-cr">16 layers</b>'; });
        col.dataset.q = '1';
      }
      col.append(pic, lab, lay); host.appendChild(col);
    });
  }
  const tab = document.getElementById('u2l5-ftab');
  if (tab) {
    const F = [4, 3, 2, 1, 0], L = [16, 8, 4, 2, 1];
    tab.appendChild(h('div', 'u2l5-fth', 'Folds'));
    F.forEach((f) => tab.appendChild(h('div', 'u2l5-ftc', String(f))));
    tab.appendChild(h('div', 'u2l5-fth', 'Layers'));
    L.forEach((l, i) => {
      const cell = h('div', 'u2l5-ftc v');
      if (i === 0 || i === 4) { cell.innerHTML = `<span data-reveal><b class="u2l5-cr">${l}</b></span>`; } else cell.textContent = String(l);
      tab.appendChild(cell);
    });
    tab.appendChild(h('div', 'u2l5-fth'));
    F.forEach((f, i) => tab.appendChild(h('div', 'u2l5-ftd', i < 4 ? '<span>÷ 2</span>' : '')));
  }
}

/* =====================================================================
 * 2. Count down the exponent (the 10C zero staircase)
 * ===================================================================== */
const X = { t: '\\times', k: 'x' };
const zstairs = {
  title: 'Count down the exponent',
  height: 400,
  minW: 780, // drawn this wide and scaled to fit beside the sidebar
  choices: [{ v: 3, label: tex('3^n') }, { v: 2, label: tex('2^n') }, { v: 5, label: tex('5^n') }, { v: 10, label: tex('10^n') }],
  custom: [2, 20],
  intro: (b) => `Start at ${tex(`${b}^{4}`)} and lower the exponent one step at a time. What happens to the value each time?`,
  make(stage, b, ex) {
    const W = ex.W, top = 4, rowH = 62, y0 = 16, fs = b >= 10 ? (W < 900 ? 22 : 26) : 30; // two-digit bases: smaller factors on a narrow stage
    const vRight = W - 250, rows = [];
    for (let e = top; e >= 0; e--) {
      const i = top - e, y = y0 + i * rowH;
      const pw = add(stage, h('div', 'u2l5-zr-pow', K(`${b}^{${e}}`)), 34, y);
      const toks = [];
      if (e) for (let k = 0; k < e; k++) { if (k) toks.push(X); toks.push({ t: String(b), k: 'f' }); }
      const fr = add(stage, h('div', 'u2l5-zr-facs'), 150, y); fr.style.fontSize = fs + 'px';
      fr.innerHTML = `<span class="u2l5-zr-eq">${K('=')}</span>` + (e ? toks.map((t) => `<span class="u2l5-tok ${t.k}">${K(t.t)}</span>`).join('') : `<span class="u2l5-zr-none">no factors of ${b} left</span>`);
      const val = add(stage, h('div', 'u2l5-zr-val', `=&nbsp;<b>${e ? fmt(Math.pow(b, e)) : '?'}</b>`), vRight, y); val.style.translate = '-100% 0';
      const arrow = i ? add(stage, h('div', 'u2l5-zr-arrow', `<svg width="44" height="${rowH}"><path d="M6 6 C 40 12, 40 ${rowH - 12}, 8 ${rowH - 4}"/><path d="M8 ${rowH - 4} l9 -2 M8 ${rowH - 4} l5 -8"/></svg><span>÷ ${b}</span>`), vRight + 14, y - rowH / 2 + 4) : null;
      hide(pw, fr, val, arrow);
      rows.push({ e, pw, fr, val, arrow, y });
    }
    const law = add(stage, h('div', 'u2l5-zr-law', `${K('a^{0}=1')}<em class="u2l5-zr-note">for any base ${K('a\\neq0')}</em>`), W / 2, y0 + 5 * rowH + 18); law.style.translate = '-50% 0'; hide(law);
    const v = (e) => fmt(Math.pow(b, e));
    const showRow = (c, r) => Promise.all([c.fadeIn(r.pw, 350), c.anim(r.fr, [{ opacity: 0, transform: `translateY(-${rowH * 0.6}px)` }, { opacity: 1, transform: 'none' }], 500, { delay: 100 }), r.arrow ? c.fadeIn(r.arrow, 350, { delay: 300 }) : null, c.pop(r.val, 380, { delay: r.arrow ? 500 : 250 })]);
    const link = b === 2 ? ' That’s the folding table: <b>0 folds, 1 layer</b>.' : b === 3 ? ' Just like the booklet’s pattern.' : '';
    return [
      { cap: `Start with ${tex(`${b}^{4}`)}: four factors of ${b} make <b>${v(4)}</b>.`, run: (c) => showRow(c, rows[0]) },
      { cap: `Lower the exponent by 1: one <b>fewer</b> factor of ${b}, so the value is <b>divided by ${b}</b>: ${v(4)} ÷ ${b} = ${v(3)}.`, run: (c) => showRow(c, rows[1]) },
      { cap: `Again: ${tex(`${b}^{2}`)} has two factors. ${v(3)} ÷ ${b} = ${v(2)}.`, run: (c) => showRow(c, rows[2]) },
      { cap: `${tex(`${b}^{1}`)} is a single factor of ${b}: ${v(2)} ÷ ${b} = <b>${b}</b>. Any number to the power 1 is itself.`, run: (c) => showRow(c, rows[3]) },
      { cap: `${tex(`${b}^{0}`)}: <b>no</b> factors of ${b} left at all. What should it equal? Keep the pattern going: divide by ${b} once more.`, run: (c) => showRow(c, rows[4]) },
      {
        cap: `${b} ÷ ${b} = <b>1</b>. So ${tex(`${b}^{0}=1`)}, not 0!${link}`,
        run: async (c) => { const r = rows[4]; await c.anim(r.val, [{ opacity: 1 }, { opacity: 0 }], 200); r.val.innerHTML = '=&nbsp;<b class="ok">1</b>'; await c.pop(r.val, 420); }
      },
      { cap: `Every nonzero base follows the same pattern: <b>${tex('a^{0}=1')}</b>. Not a base of 0, though: we would have to divide by 0, so ${tex('0^{0}')} is undefined.`, run: (c) => c.pop(law, 450) }
    ];
  }
};

/* =====================================================================
 * 2. Unfold the paper
 * ===================================================================== */
const zfold = {
  title: 'Unfold the paper, one fold at a time',
  height: 400,
  minW: 780,
  intro: () => `Start folded <b>4</b> times. Each time we unfold, what happens to the number of layers?`,
  make(stage, v, ex) {
    const W = ex.W, PX = 40, PW = 340, BASE = 300, TX = W - 400, F = [4, 3, 2, 1, 0];
    // the table: folds | layers | power of 2
    const head = add(stage, h('div', 'u2l5-fd-row head', '<span>Folds</span><span>Layers</span><span>Power of 2</span>'), TX, 14);
    const rows = F.map((f, i) => { const r = add(stage, h('div', 'u2l5-fd-row', `<span>${f}</span><span>${2 ** f}</span><span>${K(`2^{${f}}`)}</span>`), TX, 62 + i * 56); hide(r); return r; });
    const divs = F.slice(1).map((f, i) => { const d = add(stage, h('div', 'u2l5-fd-div', '÷ 2'), TX + 372, 62 + (i + 1) * 56 - 14); hide(d); return d; });
    add(stage, h('div', 'u2l5-qhead', `How many layers after <b>0</b> folds? ${K('2^{0}=\\ ?')}`), 24, 10);
    const floor = add(stage, h('div', 'u2l5-fd-floor'), PX - 10, BASE + 2); floor.style.width = (PW + 20) + 'px';
    const tag = add(stage, h('div', 'u2l5-fd-tag'), PX + PW / 2, BASE + 16); tag.style.translate = '-50% 0';
    // one stack per state (16, 8, 4, 2, 1 layers), centred on the paper area
    const stacks = F.map((f) => {
      const n = 2 ** f, w = PW / n * 1.0, lh = 12, gap = 3, s = paperStack(n, Math.max(w, 18), lh, gap);
      add(stage, s, PX + PW / 2 - Math.max(w, 18) / 2, BASE - n * (lh + gap)); s.style.position = 'absolute'; s.classList.add('big'); hide(s); return s;
    });
    const law = add(stage, h('div', 'u2l5-fd-law', `${K('2^{0}=1')}<em>0 folds still leaves the sheet: <b>1 layer</b></em>`), PX - 10, 344); hide(law);
    const setTag = (f) => { tag.innerHTML = `<b>${f}</b> fold${f === 1 ? '' : 's'} · <b>${2 ** f}</b> layer${f ? 's' : ''}`; };
    const go = (i) => async (c) => {
      const jobs = [];
      if (i) { jobs.push(c.anim(stacks[i - 1], [{ opacity: 1 }, { opacity: 0 }], 260)); jobs.push(c.fadeIn(divs[i - 1], 300, { delay: 200 })); }
      stacks[i].style.transformOrigin = 'left bottom';
      jobs.push(c.anim(stacks[i], [{ opacity: 0, transform: 'scaleX(.5)' }, { opacity: 1, transform: 'none' }], 600, { delay: i ? 180 : 0 }));
      jobs.push(c.fadeIn(rows[i], 380, { delay: 350, from: 'translateX(-10px)' }));
      setTag(F[i]); jobs.push(c.anim(tag, [{ opacity: 0.2 }, { opacity: 1 }], 300));
      await Promise.all(jobs);
    };
    return [
      { cap: `Folded <b>4</b> times: <b>16</b> layers. Each fold doubled the layers, so that’s ${tex('2^{4}=16')}.`, run: go(0) },
      { cap: `Unfold once: 3 folds. The layers are cut in <b>half</b>: 16 ÷ 2 = 8 = ${tex('2^{3}')}.`, run: go(1) },
      { cap: `Unfold again: 2 folds, 8 ÷ 2 = <b>4</b> layers = ${tex('2^{2}')}.`, run: go(2) },
      { cap: `1 fold: 4 ÷ 2 = <b>2</b> layers = ${tex('2^{1}')}.`, run: go(3) },
      { cap: `Unfold the last fold: <b>0 folds</b>. The sheet lies flat: 2 ÷ 2 = <b>1</b> layer. The table says that’s ${tex('2^{0}')}.`, run: go(4) },
      { cap: `The exponent counts the folds. No folds still leaves <b>one</b> sheet, so ${tex('2^{0}=1')}. Zero folds is not zero paper!`, run: (c) => Promise.all([c.pop(law, 450), pulse(c, rows[4], 1.06)]) }
    ];
  }
};

/* =====================================================================
 * 3. Expand, cancel, and compare with the quotient law (aⁿ ÷ aⁿ)
 * ===================================================================== */
const CANCEL = { a: ['5', 4], b: ['2', 3], c: ['10', 2], d: ['x', 5], e: ['a', 6] };
const cLabel = (k) => tex(`${CANCEL[k][0]}^{${CANCEL[k][1]}}\\div ${CANCEL[k][0]}^{${CANCEL[k][1]}}`);
const zcancel = {
  title: 'Expand, cancel, and compare with the quotient law',
  height: 310,
  minW: 860,
  choices: [...['a', 'b', 'c', 'd'].map((k) => ({ v: k, label: cLabel(k) })), { sep: 'Example 4(b) check:' }, { v: 'e', label: tex('\\tfrac{a^{6}}{a^{6}}') }],
  intro: (k) => { const [b, m] = CANCEL[k]; return `Two ways to work out ${tex(`${b}^{${m}}\\div ${b}^{${m}}`)}: write out every factor and cancel, or use the quotient law. They must give the <b>same answer</b>.`; },
  make(stage, k, ex) {
    const W = ex.W, [b, m] = CANCEL[k], cx = W * 0.29, TY = 132, BAR = 172, BY = 212;
    const letter = /[a-z]/.test(b), plural = letter ? `<i>${b}</i>’s` : `${b}’s`, one = letter ? `<i>${b}</i>` : b;
    add(stage, h('div', 'u2l5-cn-head', K(`${b}^{${m}}\\div ${b}^{${m}}`)), 24, 14);
    const row = (count, y) => {
      const els = [];
      for (let i = 0; i < count; i++) { if (i) els.push(h('div', 'u2l5-cn-x', '×')); const f = h('div', 'u2l5-cn-f', K(b)); f._f = true; els.push(f); }
      els.forEach((e) => stage.appendChild(e));
      const ws = els.map((e) => e.offsetWidth), gap = 6, tot = ws.reduce((a, w) => a + w, 0) + gap * (els.length - 1);
      let x = cx - tot / 2; els.forEach((e, i) => { at(e, x, y - e.offsetHeight / 2); x += ws[i] + gap; });
      return { els, facs: els.filter((e) => e._f), tot };
    };
    const top = row(m, TY), bot = row(m, BY);
    const bar = add(stage, h('div', 'u2l5-cn-bar'), cx, BAR); bar.style.width = (Math.max(top.tot, bot.tot) + 30) + 'px';
    const left = [...top.els, ...bot.els, bar]; hide(...left);
    const slashes = []; for (let i = 0; i < m; i++) [top.facs[i], bot.facs[i]].forEach((f) => { const s = add(stage, h('div', 'u2l5-cn-slash'), 0, 0); s._f = f; hide(s); slashes.push(s); });
    const one1 = add(stage, h('div', 'u2l5-cn-one', '1'), cx, TY - 50), one2 = add(stage, h('div', 'u2l5-cn-one', '1'), cx, BY + 52); hide(one1, one2);
    const RX = W * 0.6, RW = W - RX - 20;
    const box = (y, lab, src, cls) => { const e = add(stage, h('div', 'u2l5-cn-r ' + (cls || ''), `<div class="u2l5-cn-rl">${lab}</div>${K(src)}`), RX, y); e.style.width = RW + 'px'; hide(e); return e; };
    const lA = box(26, 'Cancelling gives', '\\dfrac{1}{1}=1');
    const lB = box(120, 'The quotient law gives', `${b}^{${m}-${m}}=${b}^{0}`);
    const lC = box(214, 'Same expression, so', `${b}^{0}=1`, 'big');
    const pos = (s) => { const f = s._f; at(s, parseFloat(f.style.left) + f.offsetWidth / 2, parseFloat(f.style.top) + f.offsetHeight / 2); };
    return [{
      cap: `Write out every factor. ${tex(`${b}^{${m}}`)} is ${WORD[m]} ${plural} multiplied, on the top <b>and</b> on the bottom.`,
      run: (c) => Promise.all(left.map((e, i) => c.fadeIn(e, 350, { delay: Math.min(i * 40, 500) })))
    }, {
      cap: `Each ${one} on top <b>cancels</b> with a ${one} on the bottom, because ${tex(`${b}\\div ${b}=1`)}. All ${WORD[m]} pairs cancel.`,
      run: async (c) => {
        const jobs = [];
        slashes.forEach((s, i) => { pos(s); s._f.classList.add('gone'); jobs.push(c.anim(s, [{ opacity: 0, transform: 'rotate(-58deg) scaleX(0)' }, { opacity: 1, transform: 'rotate(-58deg) scaleX(1)' }], 320, { delay: Math.floor(i / 2) * 220 })); });
        await Promise.all(jobs);
      }
    }, {
      cap: `Nothing is left but 1 on top and 1 on the bottom: ${tex('\\dfrac{1}{1}=1')}. A number divided by <b>itself</b> is always 1.`,
      run: (c) => Promise.all([c.pop(one1, 380), c.pop(one2, 380, { delay: 120 }), c.fadeIn(lA, 400, { delay: 250 })])
    }, {
      cap: `Now the <b>quotient law</b> instead: same base, so subtract the exponents. ${tex(`${m}-${m}=0`)}, giving ${tex(`${b}^{0}`)}.`,
      run: (c) => c.fadeIn(lB, 400)
    }, {
      cap: `It’s the <b>same expression</b>, so the two answers are equal: <b>${tex(`${b}^{0}=1`)}</b>. The pattern said so too!`,
      run: (c) => c.pop(lC, 480)
    }];
  }
};

/* =====================================================================
 * 4. The fence: what is the 0 attached to?
 * ===================================================================== */
const O = (t) => ({ o: t });
const NEG = { neg: true };
const E = (b, e, p = false) => ({ b: [].concat(b), e, p });
function fenceTex(terms, marks) {
  return terms.map((t) => {
    if (t.neg) return marks ? '\\htmlClass{f-o}{-}' : '-';
    if (t.o) return marks ? `\\htmlClass{f-o}{${t.o}}` : t.o;
    const inner = (t.p ? '(' : '') + t.b.join('') + (t.p ? ')' : '');
    return marks ? `\\htmlClass{f-i}{${inner}}^{\\htmlClass{f-e}{${t.e}}}` : `${inner}^{${t.e}}`;
  }).join(marks ? '\\mkern1.5mu ' : '');
}
const P = (ch) => ({ t: ch, k: 'x' });
function fenceRow(terms) { // the expression written out: the fenced part becomes 1, everything outside is written once
  const r = []; let neg = false, oi = 0;
  terms.forEach((t) => {
    if (t.neg) { r.push({ t: '-', k: 'o', src: oi++ }); neg = true; return; }
    const g = t.o ? [{ t: t.o, k: 'o', src: oi++ }] : [{ t: '1', k: 'i one' }];
    if (r.length && !neg) r.push(X);
    if (neg) r.push(P('('), ...g, P(')')); else r.push(...g);
    neg = false;
  });
  return r;
}
function fenceDef(title, list, groups, o = {}) {
  const map = {}; list.forEach((s) => { map[s.v] = s; });
  const choices = [];
  list.forEach((s) => { if (groups[s.v]) choices.push({ sep: groups[s.v] }); choices.push({ v: s.v, label: tex(fenceTex(s.terms, false) + (s.claim != null ? '=' + s.claim : '')) }); });
  return {
    title, height: o.height || 380, choices, minW: o.minW,
    intro: (v) => (map[v].claim != null ? `True or false: ${tex(fenceTex(map[v].terms, false) + '=' + map[v].claim)}? Work out the <b>left side</b>, then compare.`
      : `What is the 0 attached to in ${tex(fenceTex(map[v].terms, false))}? Put a fence around it.`),
    make(stage, v, ex) {
      const s = map[v], W = ex.W, claim = s.claim != null, cx = claim ? W * 0.33 : W / 2;
      const e0 = add(stage, h('div', 'u2l5-fz-expr', K(fenceTex(s.terms, true))), cx, 44); e0.style.translate = '-50% 0';
      const toks = [P('='), ...fenceRow(s.terms)];
      const R = mkRow(stage, toks, cx, 214, 36); hide(...R.els);
      const res = add(stage, h('div', 'u2l5-fz-res', K(s.res)), cx, 290); res.style.translate = '-50% 0'; hide(res);
      const hasOut = s.terms.some((t) => t.o || t.neg);
      let fenceR = null, outR = [];
      const measure = () => { fenceR = relDeep(stage, e0.querySelector('.f-i')); outR = [...e0.querySelectorAll('.f-o')].map((el) => relDeep(stage, el)); };
      let card = null, stp = null;
      if (claim) {
        const RX = W * 0.62, RW = W - RX - 24;
        card = add(stage, h('div', 'u2l5-fz-claim', `<div class="u2l5-fz-cl">Statement</div>${K(fenceTex(s.terms, false) + '=' + s.claim)}`), RX, 40); card.style.width = RW + 'px';
        stp = stamp(stage, s.ok ? 'TRUE' : 'FALSE', { ok: !!s.ok, x: RX + RW / 2, y: 250, size: 'lg', cls: 'u2l5-stamp' }); hide(stp);
      }
      const steps = [{
        cap: s.fc,
        run: (c) => {
          measure();
          const f = frameAt(stage, fenceR, 'fence', 7), er = relDeep(stage, e0.querySelector('.f-e')), fe = frameAt(stage, er, 'amber round', 4);
          const lb = add(stage, h('div', 'u2l5-tag amber', 'inside the fence · power 0'), fenceR.x + fenceR.w / 2, fenceR.y + fenceR.h + 14); lb.style.translate = '-50% 0';
          const jobs = [c.pop(f, 400), c.pop(fe, 380, { delay: 120 }), c.fadeIn(lb, 350, { delay: 250 })];
          outR.forEach((r, i) => {
            const oF = frameAt(stage, r, 'out', 5), t = add(stage, h('div', 'u2l5-tag gray', 'outside'), r.x + r.w / 2, r.y - 14); t.style.translate = '-50% -100%';
            jobs.push(c.fadeIn(oF, 300, { delay: 350 + i * 120 }), c.fadeIn(t, 300, { delay: 400 + i * 120 }));
          });
          return Promise.all(jobs);
        }
      }, {
        cap: s.c1 || `Everything <b>inside</b> the fence becomes <b>1</b>.${hasOut ? ' Whatever is outside stays as it is.' : ''}`,
        run: (c) => {
          if (!fenceR) measure();
          const fc = ctr(fenceR);
          return Promise.all(R.els.map((el, j) => {
            const t = toks[j];
            if (t.k.startsWith('i')) return flyIn(c, stage, el, fc, 700, 120);
            if (t.k === 'o') return flyIn(c, stage, el, ctr(outR[t.src]), 650, 60);
            return c.anim(el, [{ opacity: 0 }, { opacity: 1 }], 300, { delay: 250 + j * 30 });
          }));
        }
      }, { cap: s.rc, run: (c) => c.pop(res, 450) }];
      if (claim) steps.push({ cap: s.vc, run: (c) => stampIn(c, stp) });
      return steps;
    }
  };
}
const zfence = fenceDef('What is the 0 attached to?', [
  { v: 'd1', terms: [O('2'), E('x', 0)], fc: 'No brackets: the exponent <b>0</b> reaches only the <b>x</b>. The 2 is outside the fence.', res: '=2', rc: `${tex('x^{0}=1')}, so ${tex('2x^{0}=2\\times1=2')} (for ${tex('x\\neq0')}). The 2 stays.` },
  { v: 'd2', terms: [E(['2', 'x'], 0, true)], fc: 'The brackets put <b>2x</b> inside the fence: the exponent 0 reaches all of it.', res: '=1', rc: `Any nonzero base to the power 0 is 1, even a whole bracket: ${tex('(2x)^{0}=1')}.` },
  { v: 'd3', terms: [E('-6', 0, true)], fc: 'The brackets put <b>−6</b> inside the fence: the base is −6.', res: '=1', rc: `${tex('(-6)^{0}=1')}: the base −6 is not 0, so the answer is 1. (That’s Example 1(c).)` },
  { v: 'd4', terms: [NEG, E('6', 0)], fc: 'No brackets: the exponent 0 reaches only the <b>6</b>. The minus sign is outside the fence.', c1: 'The 6 inside the fence becomes <b>1</b>. The minus sign waits outside.', res: '=-1', rc: `${tex('-6^{0}=-(6^{0})=-(1)=-1')}. Compare ${tex('(-6)^{0}=1')}.` },
  { v: 'a', terms: [E('x', 0)], fc: 'The base is <b>x</b> and the exponent is 0. Nothing else is there.', res: '=1', rc: `${tex('x^{0}=1')} (as long as ${tex('x\\neq0')}).` },
  { v: 'b', terms: [O('5'), E('x', 0)], fc: 'No brackets: the 0 is attached to the <b>x</b> only. The 5 is outside.', res: '=5', rc: `${tex('5x^{0}=5\\times1=5')}.` },
  { v: 'c', terms: [E(['5', 'x'], 0, true)], fc: 'The brackets make <b>5x</b> the base, so the 0 reaches the 5 <b>and</b> the x.', res: '=1', rc: `${tex('(5x)^{0}=1')}. Same numbers as (b), different answer!` },
  { v: 'd', terms: [O('-2'), E('m', 0)], fc: 'No brackets: the 0 reaches only the <b>m</b>. The −2 is outside the fence.', res: '=-2', rc: `${tex('-2m^{0}=-2\\times1=-2')}.` },
  { v: 'e', terms: [E(['-2', 'm'], 0, true)], fc: 'The brackets put <b>−2m</b> inside the fence: all of it is the base.', res: '=1', rc: `${tex('(-2m)^{0}=1')}: the whole bracket to the power 0.` }
], { a: 'Example 2 check:' }, { height: 360 });
const ztf = fenceDef('True or false? Test the statement', [
  { v: 't1', terms: [E('6', 0)], claim: '0', ok: false, fc: 'The left side is just <b>6</b> to the power 0.', res: '=1', rc: `${tex('6^{0}=1')}.`, vc: `We got 1, but the statement says 0. <b>False.</b> The exponent 0 gives 1, not 0.` },
  { v: 't2', terms: [NEG, E('3', 0)], claim: '1', ok: false, fc: 'No brackets: the 0 reaches only the <b>3</b>. The minus sign is outside the fence.', c1: 'The 3 becomes <b>1</b>. The minus sign waits outside.', res: '=-1', rc: `${tex('-3^{0}=-(3^{0})=-1')}.`, vc: `We got −1, not 1. <b>False.</b> It would be true for ${tex('(-3)^{0}')}.` },
  { v: 'a', terms: [O('7'), E('y', 0)], claim: '1', ok: false, fc: 'No brackets: the 0 is attached to the <b>y</b> only. The 7 is outside.', res: '=7', rc: `${tex('7y^{0}=7\\times1=7')}.`, vc: `The left side is 7, not 1. <b>False.</b>` },
  { v: 'b', terms: [E(['7', 'y'], 0, true)], claim: '1', ok: true, fc: 'The brackets make <b>7y</b> the base: the 0 reaches all of it.', res: '=1', rc: `${tex('(7y)^{0}=1')}.`, vc: `The left side is 1, just like the statement says. <b>True!</b>` },
  { v: 'c', terms: [E('x', 0)], claim: '0', ok: false, fc: 'The base is <b>x</b>, to the power 0.', res: '=1', rc: `${tex('x^{0}=1')} for any ${tex('x\\neq0')}.`, vc: `1 is not 0. <b>False.</b>` },
  { v: 'd', terms: [NEG, E('4', 0)], claim: '-1', ok: true, fc: 'No brackets: the 0 reaches only the <b>4</b>. The minus sign is outside the fence.', c1: 'The 4 becomes <b>1</b>. The minus sign waits outside.', res: '=-1', rc: `${tex('-4^{0}=-(4^{0})=-1')}.`, vc: `The left side is −1, just like the statement. <b>True!</b>` }
], { a: 'Example 3 check:' }, { height: 360 });

/* =====================================================================
 * 5. Spot the zero, replace it with 1, then finish with the other laws
 * ===================================================================== */
const Z = (s) => `\\htmlClass{u2l5-zf}{${s}}`; // a factor raised to the power 0, to be framed
const SIMP = {
  d1: { label: '2^{3}\\times2^{0}', expr: '2^{3}\\times2^{0}', lines: [
    { t: '=2^{3+0}', law: 'Product law', cap: `Same base, multiplying: the <b>product law</b> adds the exponents. ${tex('3+0')}.` },
    { t: '=2^{3}=8', law: 'Evaluate', cap: `${tex('3+0=3')}, so the answer is ${tex('2^{3}=8')}.` },
    { t: '8\\times1=8\\ \\checkmark', law: 'Check: 2⁰ = 1', cap: `Now the zero exponent law instead: ${tex('2^{0}=1')}, so it’s ${tex('8\\times1=8')}. <b>Same answer.</b> Multiplying by ${tex('a^{0}')} changes nothing, just like multiplying by 1.` }] },
  a: { label: 'x^{5}\\times x^{0}', expr: 'x^{5}\\times x^{0}', lines: [
    { t: '=x^{5+0}', law: 'Product law', cap: `Same base, multiplying: <b>add</b> the exponents, ${tex('5+0')}.` },
    { t: '=x^{5}', law: '', cap: `${tex('5+0=5')}, so the answer is ${tex('x^{5}')}. (Or: ${tex('x^{0}=1')}, and ${tex('x^{5}\\times1=x^{5}')}.)` }] },
  b: { label: '\\dfrac{a^{6}}{a^{6}}', chip: '\\tfrac{a^{6}}{a^{6}}', expr: '\\dfrac{a^{6}}{a^{6}}', lines: [
    { t: '=a^{6-6}', law: 'Quotient law', cap: `Same base, dividing: <b>subtract</b> the exponents, ${tex('6-6')}.` },
    { t: '=a^{0}', law: '', cap: `${tex('6-6=0')}, so we get ${tex('a^{0}')}.` },
    { t: '=1', law: 'Zero exponent', cap: `${tex('a^{0}=1')}. It makes sense: anything divided by itself is 1.` }] },
  c: { label: '3b^{0}\\times4b^{2}', expr: `3${Z('b^{0}')}\\times4b^{2}`, zcap: `Spot the zero exponent: ${tex('b^{0}')}. The 0 is on the <b>b</b> only, so the 3 stays.`, lines: [
    { t: '=3\\times1\\times4b^{2}', law: 'Zero exponent', cap: `Replace ${tex('b^{0}')} with 1.` },
    { t: '=12b^{2}', law: 'Multiply the numbers', cap: `Multiply the numbers: ${tex('3\\times1\\times4=12')}. The ${tex('b^{2}')} stays: ${tex('12b^{2}')}.` }] },
  d: { label: '(2c^{3})^{0}\\times5c^{4}', expr: `${Z('(2c^{3})^{0}')}\\times5c^{4}`, zcap: `Spot the zero exponent: it’s on the <b>whole bracket</b> ${tex('(2c^{3})')}.`, lines: [
    { t: '=1\\times5c^{4}', law: 'Zero exponent', cap: `The whole bracket to the power 0 is 1. No need to work out what’s inside!` },
    { t: '=5c^{4}', law: '', cap: `${tex('1\\times5c^{4}=5c^{4}')}.` }] },
  e5a: { label: '(2x^{3}y^{0})^{2}\\times3x', expr: `(2x^{3}${Z('y^{0}')})^{2}\\times3x`, zcap: `Spot the zero exponent: ${tex('y^{0}')}, inside the bracket.`, lines: [
    { t: '=(2x^{3})^{2}\\times3x', law: 'Zero exponent', cap: `${tex('y^{0}=1')}, so the ${tex('y')} drops out of the bracket.` },
    { t: '=4x^{6}\\times3x', law: 'Power of a product', cap: `The 2 goes to <b>every</b> factor in the bracket: ${tex('2^{2}=4')} and ${tex('(x^{3})^{2}=x^{6}')}.` },
    { t: '=(4\\times3)x^{6+1}', law: 'Product law', cap: `Numbers with numbers, and the x’s: <b>add</b> the exponents (${tex('x')} is ${tex('x^{1}')}).` },
    { t: '=12x^{7}', law: '', cap: `${tex('4\\times3=12')} and ${tex('6+1=7')}: <b>${tex('12x^{7}')}</b>.` }] },
  e5b: { label: '\\dfrac{(4a^{2}b^{0})^{2}}{2a^{3}}', chip: '\\tfrac{(4a^{2}b^{0})^{2}}{2a^{3}}', expr: `\\dfrac{(4a^{2}${Z('b^{0}')})^{2}}{2a^{3}}`, zcap: `Spot the zero exponent: ${tex('b^{0}')}, inside the bracket on top.`, lines: [
    { t: '=\\dfrac{(4a^{2})^{2}}{2a^{3}}', law: 'Zero exponent', cap: `${tex('b^{0}=1')}, so the ${tex('b')} drops out.` },
    { t: '=\\dfrac{16a^{4}}{2a^{3}}', law: 'Power of a product', cap: `Square every factor in the bracket: ${tex('4^{2}=16')} and ${tex('(a^{2})^{2}=a^{4}')}.` },
    { t: '=8a^{4-3}', law: 'Quotient law', cap: `Numbers: ${tex('16\\div2=8')}. Same base a, dividing: <b>subtract</b> the exponents.` },
    { t: '=8a', law: '', cap: `${tex('a^{4-3}=a^{1}=a')}, so the answer is <b>${tex('8a')}</b>.` }] }
};
const zsimp = {
  title: 'Spot the zero, replace it with 1, finish the job',
  height: 460,
  choices: [{ v: 'd1', label: tex(SIMP.d1.label) }, { sep: 'Example 4 check:' }, ...['a', 'b', 'c', 'd'].map((k) => ({ v: k, label: `(${k})` })),
    { sep: 'Example 5 check:' }, { v: 'e5a', label: '(a)' }, { v: 'e5b', label: '(b)' }],
  intro: (k) => `Simplify ${tex(SIMP[k].chip || SIMP[k].label)}. ${SIMP[k].zcap ? 'Look for a power of 0 first.' : 'Which law fits?'}`,
  make(stage, k, ex) {
    const s = SIMP[k], W = ex.W, LX = 40, TW = 250, TX = Math.min(W - TW - 24, 560);
    const frac = (t) => /dfrac/.test(t);
    const e0 = add(stage, h('div', 'u2l5-sp-expr', K(s.expr)), LX, 40);
    let y = 40 + e0.offsetHeight + 18;
    const rows = s.lines.map((L) => {
      const lh = frac(L.t) ? 80 : 56;
      const r = add(stage, h('div', 'u2l5-sp-line', K(L.t)), LX, y); hide(r);
      let tag = null;
      if (L.law) { tag = add(stage, h('div', 'u2l5-sp-law' + (/Check/.test(L.law) ? ' chk' : /Zero/.test(L.law) ? ' z' : ''), L.law), TX, y + lh / 2 - 22); tag.style.width = TW + 'px'; hide(tag); }
      const out = { r, tag, y, lh }; y += lh; return out;
    });
    const last = rows[rows.length - 1];
    const steps = [];
    if (s.zcap) {
      steps.push({
        cap: s.zcap,
        run: (c) => {
          const zs = [...e0.querySelectorAll('.u2l5-zf')];
          return Promise.all(zs.map((z) => { const r = relDeep(stage, z), f = frameAt(stage, r, 'zero', 5), t = add(stage, h('div', 'u2l5-tag red', '= 1'), r.x + r.w / 2, r.y - 10); t.style.translate = '-50% -100%'; return Promise.all([c.pop(f, 400), c.fadeIn(t, 350, { delay: 200 })]); }));
        }
      });
    }
    s.lines.forEach((L, i) => {
      const R = rows[i];
      steps.push({
        cap: L.cap,
        run: async (c) => {
          await Promise.all([c.fadeIn(R.r, 400, { from: 'translateX(-12px)' }), R.tag ? c.fadeIn(R.tag, 350, { delay: 200, from: 'translateX(12px)' }) : null]);
          if (R === last && !/checkmark/.test(L.t)) { R.r.classList.add('fin'); await pulse(c, R.r, 1.06); }
        }
      });
    });
    return steps;
  }
};

/* =============================== mount =============================== */
mountWarm();
export const explainers = mountExplainers({ zstairs, zfold, zcancel, zfence, ztf, zsimp });

/* ============ Stand Up Break! — zero exponents at the whiteboards ============ */
standup('u2l5', (() => {
  const LET = ['x', 'y', 'a', 'b', 'm', 'n', 'p', 'k', 'r', 't'];
  const vt = (v, e) => (e === 1 ? v : `${v}^{${e}}`);
  // Assignment 5 must not come up at the whiteboards. Compared by shape, so the same question with other letters
  // counts too: (3x²y⁰)² × 2x³ and (3m²n⁰)² × 2m³ are the same question.
  const shape = (q) => { const m = {}; let i = 0; return String(q).replace(/\\left|\\right/g, '').replace(/\\tfrac/g, '\\dfrac').replace(/\\[a-zA-Z]+|[a-zA-Z]/g, (t) => (t.length > 1 ? t : (m[t] = m[t] || 'ABCDEFGH'[i++]))).replace(/\s+/g, ''); };
  const ASG = new Set(['6^{0}', '12^{0}', '(-9)^{0}', '(-12)^{0}', '1^{0}',
    '3^{2}\\times3^{0}', '5^{0}\\times5^{3}', '10^{0}\\times10^{0}', '\\dfrac{7^{3}}{7^{3}}', '(2^{4})^{0}',
    '-7^{0}', '(-7)^{0}', '-3\\times4^{0}', '(-3\\times4)^{0}',
    'p^{0}', '8q^{0}', '(8q)^{0}', '\\dfrac{3}{r^{0}}', '(4s^{2})^{0}',
    'x^{4}\\times x^{0}', '\\dfrac{y^{5}}{y^{5}}', '6a^{0}\\times3a^{2}', '\\dfrac{12b^{3}}{b^{3}}',
    '(3x^{2})^{0}\\times5x^{3}', '2c^{4}\\times(5c^{2})^{0}', '(7e^{0})^{2}',
    '(3x^{2}y^{0})^{2}\\times2x^{3}', '\\dfrac{(2a^{4}b^{0})^{3}}{4a^{5}}'].map(shape));
  const avoid = (gen) => (r) => { let x, i = 0; do { x = gen(r); } while (ASG.has(shape(x.q)) && ++i < 60); return x; };
  const lv = {
      BEG: (r) => { // Example 1 and 3: numbers to the power 0, inside or outside the fence
        const a = r.int(2, 15), b = r.int(2, 9), k = r.pick([2, 3, 4, 5, 6, 7, 8, 9, -2, -3, -5]);
        const t = r.pick(['neg', 'out', 'coef', 'sum', 'prod', 'quot', 'pp']);
        if (t === 'neg') return { q: `(-${a})^{0}`, a: ['=1\\quad\\text{(the base }-' + a + '\\text{ is not 0)}'] };
        if (t === 'out') return { q: `-${a}^{0}`, a: [`=-(${a}^{0})`, '=-1'] };
        if (t === 'coef') return { q: `${k}\\times${a}^{0}`, a: [`=${k}\\times1`, `=${k}`] };
        if (t === 'sum') return { q: `${a}^{0}+${b}^{0}`, a: ['=1+1', '=2'] };
        if (t === 'prod') { const c = r.int(2, 5), m = r.int(2, 3); return { q: `${c}^{${m}}\\times${c}^{0}`, a: [`=${c}^{${m}+0}=${c}^{${m}}`, `=${c ** m}`] }; }
        if (t === 'quot') { const m = r.int(2, 9); return { q: `\\dfrac{${a}^{${m}}}{${a}^{${m}}}`, a: [`=${a}^{${m}-${m}}=${a}^{0}`, '=1'] }; }
        const m = r.int(2, 5); return { q: `(${a}^{${m}})^{0}`, a: [`=${a}^{${m}\\times0}=${a}^{0}`, '=1'] };
      },
      PRG: (r) => { // Examples 2 and 4: variables, and one more law
        const v = r.pick(LET), p = r.int(2, 9), q = r.int(2, 9), m = r.int(2, 8), n = r.int(2, 8);
        const t = r.pick(['coef', 'brk', 'neg', 'prod', 'mul', 'brk2', 'quot']);
        if (t === 'coef') return { q: `${p}${v}^{0}`, a: [`=${p}\\times1`, `=${p}`] };
        if (t === 'brk') return { q: `(${p}${v})^{0}`, a: ['=1\\quad\\text{(the whole bracket is the base)}'] };
        if (t === 'neg') return { q: `-${p}${v}^{0}`, a: [`=-${p}\\times1`, `=-${p}`] };
        if (t === 'prod') return { q: `${v}^{${m}}\\times${v}^{0}`, a: [`=${v}^{${m}+0}`, `=${v}^{${m}}`] };
        if (t === 'mul') return { q: `${p}${v}^{0}\\times${q}${v}^{${m}}`, a: [`=${p}\\times1\\times${q}${v}^{${m}}`, `=${p * q}${v}^{${m}}`] };
        if (t === 'brk2') return { q: `(${p}${v}^{${m}})^{0}\\times${q}${v}^{${n}}`, a: [`=1\\times${q}${v}^{${n}}`, `=${q}${v}^{${n}}`] };
        return { q: `\\dfrac{${p}${v}^{${m}}}{${v}^{${m}}}`, a: [`=${p}${v}^{${m}-${m}}=${p}${v}^{0}`, `=${p}\\times1=${p}`] };
      },
      MAS: (r) => { // Example 5: a zero inside a bracket, then power of a product and the product or quotient law
        const [x, y] = r.pick([['x', 'y'], ['a', 'b'], ['m', 'n'], ['p', 'q'], ['c', 'd']]);
        for (;;) {
          const p = r.int(2, 5), k = r.pick([2, 2, 3]), m = r.int(1, 4), P = p ** k, km = k * m;
          if (P > 125) continue;
          if (r.chance(0.5)) { // (p x^m y^0)^k × q x^n
            const q = r.int(2, 6), n = r.int(1, 4), e = km + n;
            return { q: `(${p}${vt(x, m)}${y}^{0})^{${k}}\\times${q}${vt(x, n)}`,
              a: [`${y}^{0}=1:\\quad(${p}${vt(x, m)})^{${k}}\\times${q}${vt(x, n)}`, `=${P}${vt(x, km)}\\times${q}${vt(x, n)}`, `=(${P}\\times${q})${x}^{${km}+${n}}`, `=${P * q}${vt(x, e)}`] };
          }
          // (p x^m y^0)^k ÷ q x^n, with q a factor of p^k and n < km
          const qs = [2, 3, 4, 5, 6, 8].filter((d) => P % d === 0 && d < P); if (!qs.length) continue;
          const q = r.pick(qs), n = r.int(1, km - 1), e = km - n;
          return { q: `\\dfrac{(${p}${vt(x, m)}${y}^{0})^{${k}}}{${q}${vt(x, n)}}`,
            a: [`${y}^{0}=1:\\quad\\dfrac{(${p}${vt(x, m)})^{${k}}}{${q}${vt(x, n)}}`, `=\\dfrac{${P}${vt(x, km)}}{${q}${vt(x, n)}}`, `=${P / q}${x}^{${km}-${n}}`, `=${P / q === 1 ? '' : P / q}${vt(x, e)}`] };
        }
      }
  };
  return {
    intro: 'Simplify at your whiteboard station. Find every power of 0 first: what is the 0 attached to?',
    levels: { BEG: avoid(lv.BEG), PRG: avoid(lv.PRG), MAS: avoid(lv.MAS) }
  };
})());
/* ============ end Stand Up Break! ============ */
