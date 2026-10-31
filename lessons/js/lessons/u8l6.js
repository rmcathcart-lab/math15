/* Math 15 · Unit 8 · Lesson 6 — Solving Systems by Elimination, Part 2: Multiplying First.
 * Warm-up: Stack the Books (Stack A, 3 copies of A, Stack B; the big one: copies of P and Q), drawn here.
 * Explainers (several adapted from the Math 10C twin, u8l3):
 *   books    the warm-up solved: copy Stack A three times, the thick books line up and cancel (5 thin books = 10 cm);
 *            the big one: 2 of P and 3 of Q make the thin books match, 5 thick books = 25 cm
 *   stuck    add or subtract as written: nothing vanishes (two crosses); multiply one equation first: tick (Example 1, warm-up)
 *   scale    multiplying an equation copies the whole balance (same line on the graph); forgetting the constant tips
 *            it (a different, parallel line) (Example 1, Example 3)
 *   columns  subtracting multiplied equations in columns, every sign flips (Example 1 Think, warm-up, Example 5)
 *   lcm      count up in multiples to the lowest common multiple; the multipliers; same sign -> subtract, opposite -> add
 *            (Examples 2, 4, 5, the warm-up's big one)
 *   route    which variable is easier? one multiplication or two, the smaller LCM (Examples 3, 4, 5, 1)
 *   walk     choose and multiply, eliminate, solve, back-substitute, check, line by line (Examples 1-5)
 * Math History box: the Nine Chapters' counting board (a column multiplied by 3, then another subtracted twice).
 * Colours (as in the 10C twin): Eq. 1 blue, Eq. 2 amber, the combined / one-variable equation green, the solution purple. */
import {
  h, tex, add, box, place, Graph, Flowchart, stamp, stampIn, mountExplainers, pop, fadeIn, appear, sleep, tween, anim,
  pairTex, texNum, svgEl, pulse, COLORS
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(String(s));
const B1 = COLORS.blue, A2 = COLORS.amber, SOL = COLORS.purple, RES = COLORS.green, RED = COLORS.red;
const tc = (col, s) => `\\textcolor{${col}}{${s}}`;
const k1 = (s) => tc(B1, s), k2 = (s) => tc(A2, s), kr = (s) => tc(RES, s), ks = (s) => tc(SOL, s);
const TAG1 = '<span class="u8l6-tg u8l6-t1">Eq. 1</span>', TAG2 = '<span class="u8l6-tg u8l6-t2">Eq. 2</span>';
const tag = (n, txt) => `<span class="u8l6-tg u8l6-t${n}">${txt}</span>`;
const pm = (v) => String(v).replace('-', '−');

/* ---------------- equations ax + by = c ---------------- */
const E = (a, b, c) => ({ a, b, c });
const scaleE = (e, m) => E(e.a * m, e.b * m, e.c * m);
/** TeX of the term k·v (v '' for a constant); first: no leading + */
function term(k, v, first) {
  if (!k) return '';
  const a = Math.abs(k), s = k < 0 ? '-' : first ? '' : '+';
  return s + (v && a === 1 ? '' : texNum(a)) + (v || '');
}
const lhs = (e) => (term(e.a, 'x', true) + term(e.b, 'y', !e.a)) || '0';
const eqT = (e) => lhs(e) + '=' + texNum(e.c);
/** a known value put in for a variable: 2(3), +4(-2), +5, -(3) … */
function known(k, v, first) {
  const vv = v < 0 ? `(${texNum(v)})` : texNum(v);
  if (k === 1) return (first ? '' : '+') + vv;
  if (k === -1) return `-(${texNum(v)})`;
  return (k < 0 ? '-' : first ? '' : '+') + Math.abs(k) + `(${texNum(v)})`;
}
const plusC = (c) => (c < 0 ? `+(${texNum(c)})` : '+' + texNum(c));
const minusC = (c) => (c < 0 ? `-(${texNum(c)})` : '-' + texNum(c));
const solve2 = (e1, e2) => { const det = e1.a * e2.b - e1.b * e2.a; return [(e1.c * e2.b - e1.b * e2.c) / det, (e1.a * e2.c - e1.c * e2.a) / det]; };
/** TeX of e with the v-term highlighted */
function eqHL(e, v, col) {
  const parts = [[e.a, 'x'], [e.b, 'y']].map(([q, vv], i) => {
    if (!q) return '';
    const t = term(q, vv, i === 0 || !e.a), sgn = t[0] === '-' || t[0] === '+' ? t[0] : '', body = sgn ? t.slice(1) : t;
    return vv === v ? `\\colorbox{#ffe08a}{$${tc(col, sgn + body)}$}` : tc(col, t);
  });
  return parts.join('') + tc(col, '=' + texNum(e.c));
}

/* ---------------- geometry + motion helpers ---------------- */
/** an element's box in stage coordinates (works with the page's scaling) */
function rel(stage, el) {
  const s = stage.getBoundingClientRect(), r = el.getBoundingClientRect(), k = (s.width / stage.offsetWidth) || 1;
  return { x: (r.left - s.left) / k, y: (r.top - s.top) / k, w: r.width / k, h: r.height / k };
}
/** FLIP: remember where els() are, mutate the DOM, then glide them from the old places to the new ones */
function flip(c, stage, els, mutate, ms = 420) {
  const before = new Map(els().map((e) => [e, rel(stage, e)]));
  mutate();
  const out = [];
  for (const e of els()) {
    const b = before.get(e); if (!b) continue;
    const a = rel(stage, e), dx = b.x - a.x, dy = b.y - a.y;
    if (Math.abs(dx) + Math.abs(dy) > 0.5) out.push(anim(c, e, [{ transform: `translate(${dx}px,${dy}px)` }, { transform: 'none' }], ms));
  }
  return Promise.all(out);
}
/** els are already in their new places; glide each in from its `from` box */
function flyIn(c, stage, list, ms = 760, stagger = 70) {
  return Promise.all(list.map(({ el, from }, i) => {
    const to = rel(stage, el), dx = from.x - to.x, dy = from.y - to.y;
    return anim(c, el, [{ transform: `translate(${dx}px,${dy}px)` }, { transform: 'none' }], ms, { delay: i * stagger });
  }));
}
/** append new elements to containers, sliding the old ones aside and flying the new ones in from `from` boxes */
async function moveInto(c, stage, list, ms) {
  const conts = [...new Set(list.map((d) => d.cont))], fresh = new Set(list.map((d) => d.el));
  const kids = () => conts.flatMap((ct) => [...ct.children]).filter((e) => !fresh.has(e));
  const p1 = flip(c, stage, kids, () => list.forEach((d) => d.cont.appendChild(d.el)));
  await Promise.all([p1, flyIn(c, stage, list, ms)]);
}
/** two opposite items slide together and vanish into a 0 */
async function cancelPair(c, stage, a, b, zeroHtml = T('0')) {
  const ra = rel(stage, a), rb = rel(stage, b);
  const mx = (ra.x + ra.w / 2 + rb.x + rb.w / 2) / 2, my = (ra.y + ra.h / 2 + rb.y + rb.h / 2) / 2;
  const tr = (r) => `translate(${mx - r.x - r.w / 2}px,${my - r.y - r.h / 2}px)`;
  await Promise.all([anim(c, a, [{ transform: 'none' }, { transform: tr(ra) }], 560), anim(c, b, [{ transform: 'none' }, { transform: tr(rb) }], 560)]);
  const z = place(add(stage, h('div', 'u8l6-zero', zeroHtml)), mx, my, 'c', 0);
  await Promise.all([
    anim(c, a, [{ transform: tr(ra), opacity: 1 }, { transform: tr(ra) + ' scale(.2)', opacity: 0 }], 380),
    anim(c, b, [{ transform: tr(rb), opacity: 1 }, { transform: tr(rb) + ' scale(.2)', opacity: 0 }], 380), pop(c, z, 380)]);
  const conts = [...new Set([a.parentNode, b.parentNode])];
  await sleep(c, 350);
  await flip(c, stage, () => conts.flatMap((ct) => [...ct.children]), () => { a.remove(); b.remove(); });
  await anim(c, z, [{ opacity: 1 }, { opacity: 0 }], 450);
  z.remove();
}
/** slide an absolutely placed element to (x, y) */
async function slide(c, el, x, y, ms = 650, delay = 0) {
  const x0 = parseFloat(el.style.left) || 0, y0 = parseFloat(el.style.top) || 0;
  el.style.left = x + 'px'; el.style.top = y + 'px';
  await anim(c, el, [{ transform: `translate(${x0 - x}px,${y0 - y}px)` }, { transform: 'none' }], ms, { delay });
}
const lineEl = (host, html, cls = '') => { const d = h('div', 'u8l6-ln ' + cls, html); host.appendChild(d); return d; };
const show = (c, el) => fadeIn(c, el, 320);
const panel = (stage, x, y, w, hh, title, cls = '') => add(stage, box(h('div', 'u8l6-panel ' + cls, title ? `<div class="u8l6-ph">${title}</div>` : ''), w, hh), x, y);
const solPill = (x, y) => `<span class="u8l6-sol">${T(ks(pairTex(x, y)))}</span>`;


/* =============================== blocks and balances (from the 10C twin) =============================== */
/** a block: v 'x' | 'y' | '' (a number), k its coefficient, src 1 | 2 | 'r' (Eq. 1, Eq. 2, combined) */
function blk(v, k, src) { const el = h('div', ''); el.v = v; el.k = k; el.src = src; return drawBlk(el); }
function drawBlk(el) {
  const n = Math.min(Math.abs(el.k), 12);
  el.className = `u8l6-blk u8l6-b${el.v || 'c'} u8l6-s${el.src}` + (el.k < 0 ? ' u8l6-neg' : '');
  if (el.v) {
    el.style.width = (24 + 11 * n) + 'px';
    el.innerHTML = `<div class="u8l6-cells">${'<div class="u8l6-cell"></div>'.repeat(n)}</div><div class="u8l6-bl">${T(term(el.k, el.v, true))}</div>`;
  } else { el.style.width = ''; el.innerHTML = `<div class="u8l6-bl">${T(texNum(el.k))}</div>`; }
  return el;
}
const blocksOf = (e, src) => [[e.a ? blk('x', e.a, src) : null, e.b ? blk('y', e.b, src) : null].filter(Boolean), e.c ? [blk('', e.c, src)] : []];

class Balance {
  constructor(stage, o) {
    const w = o.w, H = o.h, top = o.top ?? 40;
    this.stage = stage;
    const el = this.el = add(stage, box(h('div', 'u8l6-bal' + (o.cls ? ' ' + o.cls : '')), w, H), o.x, o.y);
    const svg = svgEl('svg', { width: w, height: H, viewBox: `0 0 ${w} ${H}`, class: 'u8l6-bsvg' }, el);
    const cx = this.cx = w / 2, ty = this.ty = H - 56, py = this.py = ty + 26;
    this.L = Math.round(w * 0.27); this.pw = Math.round(w * 0.45);
    svgEl('path', { d: `M${cx - 54} ${H - 3} H${cx + 54} L${cx + 11} ${py} H${cx - 11} Z`, class: 'u8l6-base' }, svg);
    this.rods = [svgEl('line', { class: 'u8l6-rod' }, svg), svgEl('line', { class: 'u8l6-rod' }, svg)];
    this.beam = svgEl('line', { class: 'u8l6-beam' }, svg);
    svgEl('circle', { cx, cy: py, r: 7, class: 'u8l6-piv' }, svg);
    this.lab = add(el, h('div', 'u8l6-balab', o.label || '')); if (o.labY != null) this.lab.style.top = o.labY + 'px';
    this.pans = [-1, 1].map((s) => {
      const p = add(el, box(h('div', 'u8l6-pan'), this.pw, ty + 10 - top), cx + s * this.L - this.pw / 2, top);
      p.cont = h('div', 'u8l6-cont'); p.append(p.cont, h('div', 'u8l6-tray')); return p;
    });
    this.setTilt(0);
  }
  setTilt(th) {
    this.th = th;
    const { cx, py, L, ty } = this, co = Math.cos(th), si = Math.sin(th);
    const ends = [[cx - L * co, py + L * si], [cx + L * co, py - L * si]];
    this.beam.setAttribute('x1', ends[0][0]); this.beam.setAttribute('y1', ends[0][1]);
    this.beam.setAttribute('x2', ends[1][0]); this.beam.setAttribute('y2', ends[1][1]);
    ends.forEach((e, i) => {
      const dx = e[0] - (cx + (i ? 1 : -1) * L), dy = e[1] - py, r = this.rods[i];
      this.pans[i].style.transform = `translate(${dx.toFixed(2)}px,${dy.toFixed(2)}px)`;
      r.setAttribute('x1', e[0]); r.setAttribute('y1', e[1]); r.setAttribute('x2', e[0]); r.setAttribute('y2', ty + 10 + dy);
    });
  }
  tilt(c, th, ms = 700) { const t0 = this.th; return tween(c, ms, (t) => this.setTilt(t0 + (th - t0) * t)); }
  items(i) { return [...this.pans[i].cont.children]; }
  all() { return [...this.items(0), ...this.items(1)]; }
  fill(e, src) { const [l, r] = blocksOf(e, src); this.pans[0].cont.append(...l); this.pans[1].cont.append(...r); }
  label(html) { this.lab.innerHTML = html; }
  /** a short tag (÷6) over pan i, in stage coordinates */
  badge(i, html) {
    const r = rel(this.stage, this.pans[i]);
    return place(add(this.stage, h('div', 'u8l6-badge', html)), r.x + r.w / 2, r.y - 4, 'n', 0);
  }
}
/** copies of every block in `blocks` fly into the matching pans of balance `to` */
function copyInto(c, stage, pairs) {
  const list = [];
  pairs.forEach(([from, cont]) => from.forEach((b) => list.push({ el: blk(b.v, b.k, b.src), from: rel(stage, b), cont })));
  return moveInto(c, stage, list, 820);
}
/** merge `others` into `keep`, which becomes coefficient k (combined colour) */
async function merge(c, stage, keep, others, k) {
  const rk = rel(stage, keep);
  await Promise.all(others.map((o) => { const r = rel(stage, o); return anim(c, o, [{ transform: 'none', opacity: 1 }, { transform: `translate(${rk.x - r.x}px,${rk.y - r.y}px)`, opacity: 0.25 }], 560); }));
  const cont = keep.parentNode;
  await flip(c, stage, () => [...cont.children], () => { others.forEach((o) => o.remove()); keep.k = k; keep.src = 'r'; drawBlk(keep); });
  await pop(c, keep, 380);
}
/** flip each block to its opposite (a quick card-turn) */
async function negate(c, els) {
  await Promise.all(els.map((e, i) => anim(c, e, [{ transform: 'scaleX(1)' }, { transform: 'scaleX(0)' }], 200, { delay: i * 90 })));
  els.forEach((e) => { e.k = -e.k; drawBlk(e); });
  await Promise.all(els.map((e) => anim(c, e, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], 220)));
}


/* =============================== warm-up: the stacks of books =============================== */
const THK = 5, THN = 2;   // made-up sizes (cm), as in the teacher notes
function bookEl(kind, w, hpx, cls = '') {
  const b = h('div', `u8l6-book u8l6-${kind} ${cls}`, '<i></i>'); b.kind = kind; b.style.width = w + 'px'; b.style.height = hpx + 'px'; return b;
}
/** a stack (list of 'thick'/'thin', bottom first) drawn as a flex column in the static warm-up */
function staticStack(books, label, sub, cls = '') {
  const s = h('div', 'u8l6-sst ' + cls), pile = h('div', 'u8l6-spile');
  books.slice().reverse().forEach((k) => pile.appendChild(bookEl(k, 104, (k === 'thick' ? THK : THN) * 9.5)));
  s.append(pile, h('div', 'u8l6-sground'), h('div', 'u8l6-slab', `<b>${label}</b><span>${sub}</span>`));
  return s;
}
function mountWarm() {
  const host = document.getElementById('u8l6-stacks'); if (!host) return;
  const A = ['thick', 'thin', 'thin'], B = ['thick', 'thick', 'thick', 'thin'];
  const pile = ['thick', 'thick', 'thick', 'thin', 'thin', 'thin', 'thin', 'thin', 'thin'];
  host.append(staticStack(A, 'Stack A', '9 cm tall'), staticStack(pile, '3 copies of A', '(sorted)', 'u8l6-sq'), staticStack(B, 'Stack B', '17 cm tall', 'u8l6-sb'));
  const q = h('div', 'u8l6-qcm', '? cm'); host.querySelector('.u8l6-sq .u8l6-spile').prepend(q);
  const x3 = h('div', 'u8l6-x3', '×3'); host.querySelector('.u8l6-sq').appendChild(x3);
}

/* =============================== explainer: the books, solved =============================== */
const books = {
  title: 'The books, solved',
  height: 480,
  minW: 940, // drawn this wide and scaled to fit beside the sidebar
  choices: [{ v: 'copy', label: 'Copy Stack A three times' }, { v: 'big', label: 'The big one: P and Q' }],
  intro: (k) => (k === 'copy' ? 'Stack A is 9 cm tall, Stack B is 17 cm tall. Press <b>Next</b>.'
    : 'Stack P is 16 cm tall, Stack Q is 19 cm tall (with the sizes we just found). Press <b>Next</b>.'),
  make(stage, k, ex) {
    const W = ex.W, big = k === 'big', U = big ? 6.8 : 10, BW = big ? 92 : 120, G0 = 424;
    add(stage, box(h('div', 'u8l6-ground'), 590, 4), 10, G0);
    const P = panel(stage, 620, 10, W - 630, 460, 'As equations');
    lineEl(P, `<span class="u8l6-muted">${T('x')} = thick book, ${T('y')} = thin book (cm)</span>`, 'u8l6-lnsm');
    const hh = (kd) => (kd === 'thick' ? THK : THN) * U;
    /** place books (bottom first) at x, returns elements; hidden: start invisible */
    const stackAt = (list, x, hidden) => {
      let y = G0; return list.map((kd) => { const hp = hh(kd); y -= hp; const b = add(stage, bookEl(kd, BW, hp), x, y); if (hidden) b.style.opacity = 0; return b; });
    };
    const lab = (x, html, hidden) => { const l = add(stage, box(h('div', 'u8l6-blab', html), BW + 40, 44), x - 20, G0 + 6); if (hidden) l.style.opacity = 0; return l; };
    /** books fly from the matching books of `from` into a new pile at x (sorted: thick at the bottom) */
    const copyPile = async (c, from, times, x, els) => {
      const kinds = from.map((b) => b.kind), sorted = [...Array(times)].flatMap(() => kinds).sort((a, b) => (a === b ? 0 : a === 'thick' ? -1 : 1));
      const made = els || stackAt(sorted, x, true);
      const srcFor = (kd, i) => { const cand = from.filter((b) => b.kind === kd); return cand[i % cand.length]; };
      const cnt = { thick: 0, thin: 0 };
      await Promise.all(made.map((b, i) => {
        const s = srcFor(b.kind, cnt[b.kind]++), sx = parseFloat(s.style.left), sy = parseFloat(s.style.top), tx = parseFloat(b.style.left), ty = parseFloat(b.style.top);
        return anim(c, b, [{ opacity: 0.4, transform: `translate(${sx - tx}px,${sy - ty}px)` }, { opacity: 1, transform: 'none' }], 700, { delay: i * 90 });
      }));
      return made;
    };
    if (!big) {
      const A = stackAt(['thick', 'thin', 'thin'], 30), B = stackAt(['thick', 'thick', 'thick', 'thin'], 400);
      lab(30, '<b>Stack A</b><span>9 cm</span>'); lab(400, '<b>Stack B</b><span>17 cm</span>');
      const pileKinds = ['thick', 'thick', 'thick', 'thin', 'thin', 'thin', 'thin', 'thin', 'thin'];
      const pile = stackAt(pileKinds, 215, true), pl = lab(215, '<b>3 copies of A</b><span>27 cm</span>', true);
      const line = add(stage, box(h('div', 'u8l6-dash'), 330, 0), 200, G0 - 17 * U); line.style.opacity = 0;
      const fin = add(stage, box(h('div', 'u8l6-bfin'), 330, 56), 200, 8); fin.style.opacity = 0;
      const upTxt = add(stage, box(h('div', 'u8l6-uptag', '5 thin books = 10 cm'), 150, 50), 345, G0 - 27 * U + 10); upTxt.style.opacity = 0;
      return [
        { cap: `Copy Stack A <b>three times</b>. Every book is copied, and so is the height: ${T('3\\times9=27')} cm.`,
          run: async (c) => {
            await copyPile(c, A, 3, 215, pile); await fadeIn(c, pl);
            await show(c, lineEl(P, `${tag(1, 'A')} ${T(k1('x+2y=9'))}`)); await show(c, lineEl(P, `${tag(1, 'A × 3')} ${T(k1('3x+6y=27'))}`, 'u8l6-lnb'));
          } },
        { cap: 'The pile and Stack B both have <b>3 thick</b> books. They line up. Mark the top of Stack B with a dashed line.',
          run: async (c) => {
            await show(c, lineEl(P, `${tag(2, 'B')} ${T(k2('3x+y=17'))}`));
            [...pile.slice(0, 3), ...B.slice(0, 3)].forEach((b) => b.classList.add('u8l6-hot'));
            await Promise.all([...pile.slice(0, 3), ...B.slice(0, 3)].map((b) => pulse(c, b, 1.05)));
            await anim(c, line, [{ opacity: 0, transform: 'scaleX(0)' }, { opacity: 1, transform: 'none' }], 500);
          } },
        { cap: `Subtract: the thick books cancel. What sticks up is <b>5 thin books</b>, worth ${T('27-17=10')} cm.`,
          run: async (c) => {
            [...pile.slice(0, 3), ...B.slice(0, 3)].forEach((b) => { b.classList.remove('u8l6-hot'); b.classList.add('u8l6-dim'); });
            pile.slice(4).forEach((b) => b.classList.add('u8l6-hot')); pile[3].classList.add('u8l6-dim'); B[3].classList.add('u8l6-dim');
            await Promise.all(pile.slice(4).map((b, i) => pulse(c, b, 1.06, 400 + i * 40))); await fadeIn(c, upTxt);
            await show(c, lineEl(P, `subtract: ${T(`${k1('(3x+6y)')}-${k2('(3x+y)')}=27-17`)}`, 'u8l6-lnsm')); await show(c, lineEl(P, T(kr('5y=10')), 'u8l6-lnb'));
          } },
        { cap: 'One thin book: 10 ÷ 5 = <b>2 cm</b>. Back in Stack A: thick + 2 + 2 = 9, so a thick book is <b>5 cm</b>. Check B: 5 + 5 + 5 + 2 = 17 ✓',
          run: async (c) => {
            fin.innerHTML = `<span class="u8l6-bk u8l6-bkn"></span><b>2 cm</b><span class="u8l6-bk u8l6-bkt"></span><b>5 cm</b>`; await pop(c, fin);
            await show(c, lineEl(P, `${T(kr('y=2'))}, then ${T('x+2(2)=9\\Rightarrow x=5')}`));
          } }
      ];
    }
    const Pst = stackAt(['thick', 'thick', 'thin', 'thin', 'thin'], 30), Qst = stackAt(['thick', 'thick', 'thick', 'thin', 'thin'], 140);
    lab(30, '<b>P</b><span>16 cm</span>'); lab(140, '<b>Q</b><span>19 cm</span>');
    const p2k = ['thick', 'thick', 'thick', 'thick', 'thin', 'thin', 'thin', 'thin', 'thin', 'thin'], q3k = [...Array(9).fill('thick'), ...Array(6).fill('thin')];
    const p2 = stackAt(p2k, 268, true), q3 = stackAt(q3k, 410, true);
    const l2 = lab(268, '<b>2 of P</b><span>32 cm</span>', true), l3 = lab(410, '<b>3 of Q</b><span>57 cm</span>', true);
    const tagT = add(stage, box(h('div', 'u8l6-uptag', '5 thick books = 25 cm'), 150, 50), 250, 60); tagT.style.opacity = 0;
    return [
      { cap: 'P has <b>3</b> thin books and Q has <b>2</b>. Copy P <b>2</b> times: 6 thin books (and 32 cm).',
        run: async (c) => {
          await show(c, lineEl(P, `P ${T(k1('2x+3y=16'))}`)); await show(c, lineEl(P, `Q ${T(k2('3x+2y=19'))}`));
          await copyPile(c, Pst, 2, 268, p2); await fadeIn(c, l2); await show(c, lineEl(P, `${tag(1, 'P × 2')} ${T(k1('4x+6y=32'))}`));
        } },
      { cap: 'Copy Q <b>3</b> times: also <b>6</b> thin books (and 57 cm). Each stack is copied by the <b>other</b> stack’s thin count.',
        run: async (c) => { await copyPile(c, Qst, 3, 410, q3); await fadeIn(c, l3); await show(c, lineEl(P, `${tag(2, 'Q × 3')} ${T(k2('9x+6y=57'))}`)); } },
      { cap: 'Both piles have <b>6 thin books</b>: they match! Answer <b>A</b>. (3 of P and 2 of Q would give 9 thin and 4 thin.)',
        run: async (c) => { const th = [...p2.slice(4), ...q3.slice(9)]; th.forEach((b) => b.classList.add('u8l6-hot')); await Promise.all(th.map((b) => pulse(c, b, 1.06))); } },
      { cap: `Subtract the piles: the thin books cancel. ${T('9-4=5')} thick books make ${T('57-32=25')} cm, so a thick book is <b>5 cm</b>.`,
        run: async (c) => {
          [...p2.slice(4), ...q3.slice(9), ...p2.slice(0, 4), ...q3.slice(0, 4)].forEach((b) => { b.classList.remove('u8l6-hot'); b.classList.add('u8l6-dim'); });
          q3.slice(4, 9).forEach((b) => b.classList.add('u8l6-hot')); await Promise.all(q3.slice(4, 9).map((b) => pulse(c, b, 1.05))); await fadeIn(c, tagT);
          await show(c, lineEl(P, `subtract: ${T(kr('5x=25'))}, so ${T(kr('x=5'))}`, 'u8l6-lnb'));
        } }
    ];
  }
};

/* =============================== explainer: stuck as written, unstuck by multiplying =============================== */
const ST = {
  ex1: { label: 'Example 1', e1: E(1, 2, 9), e2: E(3, -1, 13), m: 2, who: 2, el: 'y' },
  warm: { label: 'Warm-up: Stacks A and B', e1: E(1, 2, 9), e2: E(3, 1, 17), m: 3, who: 1, el: 'x' }
};
const arr = (top, bot, op, res, cols) => `\\begin{array}{rrcr} & ${tc(cols[0], lhs(top))} & = & ${tc(cols[0], texNum(top.c))}\\\\ ${op}) & ${tc(cols[1], lhs(bot))} & = & ${tc(cols[1], texNum(bot.c))}\\\\ \\hline & ${tc(RES, lhs(res))} & = & ${tc(RES, texNum(res.c))}\\end{array}`;
const stuck = {
  title: 'Stuck as written? Multiply first',
  height: 330,
  minW: 900, // drawn this wide and scaled to fit beside the sidebar
  choices: Object.keys(ST).map((k) => ({ v: k, label: ST[k].label })),
  intro: (k) => `${TAG1} ${T(k1(eqT(ST[k].e1)))} and ${TAG2} ${T(k2(eqT(ST[k].e2)))}. Press <b>Next</b>.`,
  make(stage, k, ex) {
    const d = ST[k], { e1, e2 } = d, W = ex.W, pw = Math.floor((W - 48) / 3);
    const sum = E(e1.a + e2.a, e1.b + e2.b, e1.c + e2.c), dif = E(e1.a - e2.a, e1.b - e2.b, e1.c - e2.c);
    const s1 = d.who === 1 ? scaleE(e1, d.m) : e1, s2 = d.who === 2 ? scaleE(e2, d.m) : e2;
    const ca = d.el === 'x' ? s1.a : s1.b, cb = d.el === 'x' ? s2.a : s2.b, same = ca === cb;
    const res = same ? E(s1.a - s2.a, s1.b - s2.b, s1.c - s2.c) : E(s1.a + s2.a, s1.b + s2.b, s1.c + s2.c);
    const kv = d.el === 'x' ? 'y' : 'x', K = kv === 'x' ? res.a : res.b, val = res.c / K;
    const pan = (i, title) => { const p = panel(stage, 12 + i * (pw + 12), 10, pw, 310, title, 'u8l6-stp'); return p; };
    const P1 = pan(0, 'Add as written'), P2 = pan(1, 'Subtract as written'), P3 = pan(2, `Multiply Eq. ${d.who} by ${d.m} first`);
    const cA = d.who === 1 ? [B1, A2] : [B1, A2];
    const stmp = (P, ok, txt) => { const s = stamp(P, ok ? '✓' : '✗', { ok, size: 'sm' }); const n = h('div', 'u8l6-stv ' + (ok ? 'u8l6-good' : 'u8l6-bad'), txt); P.appendChild(n); return [s, n]; };
    const vars = (e) => [e.a ? 'x' : '', e.b ? 'y' : ''].filter(Boolean).length;
    return [
      { cap: `Add as written: ${T(`(${lhs(e1)})+(${lhs(e2)})=${e1.c}+${e2.c}`)} gives ${T(eqT(sum))}. Still <b>two</b> variables.`,
        run: async (c) => { const l = lineEl(P1, T(arr(e1, e2, '+', sum, cA)), 'u8l6-arr'); await show(c, l); const [s, n] = stmp(P1, false, vars(sum) === 2 ? 'nothing eliminated' : ''); await stampIn(c, s); await show(c, n); } },
      { cap: `Subtract instead: ${T(eqT(dif))}. Still <b>two</b> variables. Neither pair of coefficients matches or is opposite.`,
        run: async (c) => { const l = lineEl(P2, T(arr(e1, e2, '-', dif, cA)), 'u8l6-arr'); await show(c, l); const [s, n] = stmp(P2, false, 'nothing eliminated'); await stampIn(c, s); await show(c, n); } },
      { cap: `Multiply <b>every</b> term of Eq. ${d.who} by ${d.m}: ${T(d.who === 1 ? k1(eqT(s1)) : k2(eqT(s2)))}. Now ${T(term(ca, d.el, true))} and ${T(term(cb, d.el, true))} ${same ? '<b>match</b>' : 'are <b>opposites</b>'}.`,
        run: async (c) => {
          const e = d.who === 1 ? e1 : e2, s = d.who === 1 ? s1 : s2, col = d.who === 1 ? B1 : A2;
          await show(c, lineEl(P3, `${tag(d.who, 'Eq. ' + d.who + ' × ' + d.m)}<br>${T(tc(col, `${d.m}(${lhs(e)})=${d.m}(${texNum(e.c)})`))}`, 'u8l6-lnsm'));
          await show(c, lineEl(P3, T(tc(col, eqT(s))), 'u8l6-lnb'));
        } },
      { cap: `${same ? 'Subtract' : 'Add'}: ${T(kr(eqT(res)))}, so ${T(kr(`${kv}=${texNum(val)}`))}. ${T(d.el)} is gone!`,
        run: async (c) => {
          const l = lineEl(P3, T(arr(s1, s2, same ? '-' : '+', res, [B1, A2])), 'u8l6-arr'); await show(c, l);
          const [s, n] = stmp(P3, true, `${T(kr(`${kv}=${texNum(val)}`))}`); await stampIn(c, s); await show(c, n);
        } }
    ];
  }
};

/* =============================== explainer: scaling copies the whole balance (from the 10C twin) =============================== */
const SC = {
  ex1: { label: 'Example 1: Eq. 2 × 2', e: E(3, -1, 13), o: E(1, 2, 9), n: 2, m: 2, win: { xmin: 1, xmax: 9, ymin: -2, ymax: 8 } },
  bad: { label: 'Forget the constant', e: E(3, -1, 13), o: E(1, 2, 9), n: 2, m: 2, forget: true, lab: [4, 5.5], win: { xmin: 1, xmax: 9, ymin: -2, ymax: 8 } },
  ex3: { label: 'Example 3: Eq. 1 × 2', e: E(5, -2, 14), o: E(3, 4, 24), n: 1, m: 2, win: { xmin: 0, xmax: 8, ymin: -1, ymax: 9 } }
};
const lineOf = (G, e, o) => (e.b ? G.line({ m: -e.a / e.b, b: e.c / e.b }, o) : G.line({ x: e.c / e.a }, o));
const scale = {
  title: 'Multiplying an equation copies the whole balance',
  height: 470,
  minW: 860, // drawn this wide and scaled to fit beside the sidebar (the graph takes what is left beside the 520 px balance)
  choices: Object.keys(SC).map((k) => ({ v: k, label: SC[k].label })),
  intro: (k) => `${tag(SC[k].n, 'Eq. ' + SC[k].n)} ${T(tc(SC[k].n === 1 ? B1 : A2, eqT(SC[k].e)))} as a level balance. Press <b>Next</b>.`,
  make(stage, k, ex) {
    const d = SC[k], { e, o, m } = d, col = d.n === 1 ? B1 : A2, W = ex.W;
    const sE = scaleE(e, m), bad = E(e.a * m, e.b * m, e.c);
    const e1 = d.n === 1 ? e : o, e2 = d.n === 1 ? o : e;
    const S = solve2(e1, e2);
    const bal = new Balance(stage, { x: 10, y: 6, w: 520, h: 300, top: 104, label: `${tag(d.n, 'Eq. ' + d.n)} ${T(tc(col, eqT(e)))}` });
    bal.fill(e, d.n);
    const GW = Math.min(430, W - 550), G = new Graph(stage, Object.assign({ x: W - GW - 10, y: 6, width: GW, height: 458, xlabels: 2, ylabels: 2, fontSize: 16 }, d.win));
    const V = add(stage, box(h('div', 'u8l6-verd'), 520, 140), 10, 320);
    const steps = [
      { cap: `${tag(d.n, 'Eq. ' + d.n)} ${T(tc(col, eqT(e)))} is a level balance. On the graph it is the ${d.n === 1 ? 'blue' : 'amber'} line through the solution ${T(ks(pairTex(...S)))}.`,
        run: async (c) => {
          await G.drawIn(lineOf(G, o, { color: d.n === 1 ? A2 : B1, width: 3, opacity: 0.45 }), 400, c);
          await G.drawIn(lineOf(G, e, { color: col, width: 4 }), 600, c);
          await pop(c, G.point(S[0], S[1], { color: SOL, r: 8, label: T(pairTex(...S)), pos: 'ne', cls: 'bk-ptlab' }));
        } }
    ];
    const ghosts = [];
    const makeGhosts = async (c, pans) => {
      const list = pans.flatMap((i) => bal.items(i));
      for (const b of list) {
        const r = rel(stage, b), gh = add(stage, drawBlk(Object.assign(h('div', ''), { v: b.v, k: b.k, src: b.src })), r.x, r.y - r.h - 10);
        gh.classList.add('u8l6-ghost'); gh.target = b; ghosts.push(gh);
      }
      await Promise.all(ghosts.map((g, i) => anim(c, g, [{ opacity: 0, transform: 'translateY(-24px)' }, { opacity: 1, transform: 'none' }], 420, { delay: i * 80 })));
    };
    const mergeGhosts = async (c) => {
      await Promise.all(ghosts.map((g) => { const r = rel(stage, g), t = rel(stage, g.target); return anim(c, g, [{ transform: 'none', opacity: 1 }, { transform: `translate(${t.x - r.x}px,${t.y - r.y}px)`, opacity: 0.2 }], 520); }));
      const conts = bal.pans.map((p) => p.cont);
      await flip(c, stage, () => conts.flatMap((ct) => [...ct.children]), () => ghosts.forEach((g) => { g.target.k *= m; drawBlk(g.target); g.remove(); }));
      await Promise.all(ghosts.map((g) => pulse(c, g.target, 1.15)));
    };
    if (!d.forget) {
      steps.push({ cap: `Multiplying by ${m} = a second copy of the <b>whole</b> balance: every block on <b>both</b> pans.`,
        run: async (c) => { const b = bal.badge(0, '×' + m), b2 = bal.badge(1, '×' + m); await Promise.all([pop(c, b), pop(c, b2)]); await makeGhosts(c, [0, 1]); } });
      steps.push({ cap: `Put the copies together: ${T(tc(col, eqT(sE)))}. Equal + equal: still <b>level</b>.`,
        run: async (c) => {
          await mergeGhosts(c); bal.label(`${tag(d.n, `Eq. ${d.n} × ${m}`)} ${T(tc(col, eqT(sE)))}`);
          V.innerHTML = `<div class="u8l6-vline">${T(`${m}(${lhs(e)})=${m}(${texNum(e.c)})`)}</div><div class="u8l6-vline">${T(tc(col, eqT(sE)))}</div>`;
          await show(c, V); await stampIn(c, stamp(V, 'level', { ok: true, size: 'sm' }));
        } });
      steps.push({ cap: `Graph ${T(tc(col, eqT(sE)))}: it lands <b>exactly</b> on the ${d.n === 1 ? 'blue' : 'amber'} line. Same line, same solutions: ${T(ks(pairTex(...S)))} has not moved.`,
        run: async (c) => {
          await G.drawIn(lineOf(G, sE, { color: RES, width: 6, dash: true }), 900, c);
          const lab = G.label(S[0], S[1], T(kr(eqT(sE))), { pos: 'sw', cls: 'bk-pill', color: RES }); await pop(c, lab);
        } });
    } else {
      steps.push({ cap: `What if we copy only the <b>left</b> pan, and forget the ${T(e.c)} on the right?`,
        run: async (c) => { const b = bal.badge(0, '×' + m); await pop(c, b); await makeGhosts(c, [0]); } });
      steps.push({ cap: `Now the left side is ${T(lhs(bad))}, worth ${T(m * e.c)}, but the right pan still holds ${T(e.c)}. The balance <b>tips</b>: not equal any more!`,
        run: async (c) => {
          await mergeGhosts(c); bal.label(`${T(tc(RED, `${lhs(bad)}\\neq${texNum(e.c)}`))}`); await bal.tilt(c, 0.1);
          V.innerHTML = `<div class="u8l6-vline">${T(`${lhs(bad)}=${texNum(e.c)}`)}</div><div class="u8l6-vline u8l6-muted">the ${e.c} was never doubled</div>`;
          await show(c, V); await stampIn(c, stamp(V, 'not level', { ok: false, size: 'sm' }));
        } });
      steps.push({ cap: `On the graph, ${T(tc(RED, eqT(bad)))} is a <b>different</b> line (parallel to the amber one). It misses ${T(ks(pairTex(...S)))}, so the “solution” would come out wrong.`,
        run: async (c) => {
          await G.drawIn(lineOf(G, bad, { color: RED, width: 4, dash: true }), 900, c);
          const lab = G.label(d.lab[0], d.lab[1], T(tc(RED, eqT(bad))), { pos: 'e', cls: 'bk-pill', color: RED }); await pop(c, lab);
        } });
    }
    return steps;
  }
};

/* =============================== explainer: the LCM picks the multipliers (from the 10C twin) =============================== */
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
const LC = {
  ex2: { label: `Example 2: ${T('y')}`, e1: E(2, 3, 17), e2: E(3, -2, 6), v: 'y' },
  ex4: { label: `Example 4: ${T('y')}`, e1: E(3, 4, 29), e2: E(5, -6, -15), v: 'y' },
  ex5: { label: `Example 5: ${T('y')}`, e1: E(3, 5, 19), e2: E(4, 2, 16), v: 'y' },
  warm: { label: 'Warm-up: P and Q', e1: E(2, 3, 16), e2: E(3, 2, 19), v: 'y' }
};
const lcm = {
  title: 'Which multipliers? Count up to the LCM',
  height: 460,
  minW: 900, // drawn this wide and scaled to fit beside the sidebar
  choices: Object.keys(LC).map((k) => ({ v: k, label: LC[k].label })),
  intro: (k) => `${TAG1} ${T(k1(eqT(LC[k].e1)))} and ${TAG2} ${T(k2(eqT(LC[k].e2)))}. To eliminate ${T(LC[k].v)}, its coefficients must become equal or opposite. Press <b>Next</b>.`,
  make(stage, k, ex) {
    const d = LC[k], { e1, e2, v } = d, W = ex.W;
    const a = v === 'x' ? e1.a : e1.b, b = v === 'x' ? e2.a : e2.b, A = Math.abs(a), Bq = Math.abs(b);
    const L = A * Bq / gcd(A, Bq), m1 = L / A, m2 = L / Bq, same = Math.sign(a) === Math.sign(b);
    const s1 = scaleE(e1, m1), s2 = scaleE(e2, m2);
    let res = same ? E(s1.a - s2.a, s1.b - s2.b, s1.c - s2.c) : E(s1.a + s2.a, s1.b + s2.b, s1.c + s2.c);
    let f = s1, g = s2, fc = B1, gc = A2;
    const kv = v === 'x' ? 'y' : 'x';
    if (same && (kv === 'x' ? res.a : res.b) < 0) { res = E(-res.a, -res.b, -res.c); f = s2; g = s1; fc = A2; gc = B1; }   // bigger minus smaller
    const K = kv === 'x' ? res.a : res.b, resT = `${term(K, kv, true)}=${texNum(res.c)}\\ \\Rightarrow\\ ${kv}=${texNum(res.c / K)}`;
    add(stage, box(h('div', 'u8l6-lceq', `${TAG1} ${T(eqHL(e1, v, B1))}`), 440, 50), 14, 10);
    add(stage, box(h('div', 'u8l6-lceq', `${TAG2} ${T(eqHL(e2, v, A2))}`), 440, 50), 14 + 452, 10);
    const lad = (y, n, col, labx) => {
      add(stage, box(h('div', 'u8l6-ladl', labx), 170, 58), 14, y);
      const cells = []; for (let i = 1; i <= L / n; i++) { const ce = add(stage, box(h('div', 'u8l6-lad', `<b>${n * i}</b><span>×${i}</span>`), 70, 58), 190 + (i - 1) * 80, y); ce.style.color = col; ce.style.opacity = 0; ce.val = n * i; cells.push(ce); }
      return cells;
    };
    const c1 = lad(82, A, B1, `multiples of&nbsp;<b>${A}</b>`), c2 = lad(156, Bq, A2, `multiples of&nbsp;<b>${Bq}</b>`);
    const P = panel(stage, 14, 232, W - 28, 220, '');
    const order = [...c1, ...c2].sort((p, q) => p.val - q.val || (c1.includes(p) ? -1 : 1));
    const pl = (x) => (x === 1 ? 'stays as it is' : '× ' + x);
    const oneOK = L === A || L === Bq;
    const cT = (e, col) => tc(col, `(${lhs(e)})`), nT = (e, col) => tc(col, texNum(e.c));
    const combT = same ? `${cT(f, fc)}-${cT(g, gc)}=${nT(f, fc)}-${g.c < 0 ? `(${nT(g, gc)})` : nT(g, gc)}` : `${cT(s1, B1)}+${cT(s2, A2)}=${nT(s1, B1)}+${s2.c < 0 ? `(${nT(s2, A2)})` : nT(s2, A2)}`;
    return [
      { cap: `The ${T(v)}-coefficients are ${T(texNum(a))} and ${T(texNum(b))}; ignore the signs for now: ${A} and ${Bq}. ${oneOK ? `${Math.max(A, Bq)} <b>is</b> a multiple of ${Math.min(A, Bq)}, so multiplying <b>one</b> equation is enough.` : 'Neither is a factor of the other, so <b>both</b> equations need multiplying.'}`,
        run: async (c) => { await Promise.all([...stage.querySelectorAll('.u8l6-lceq')].map((e) => pulse(c, e, 1.05))); } },
      { cap: `Count up in ${A}s and in ${Bq}s until the two lists meet.`,
        run: async (c) => { for (const ce of order) await pop(c, ce, 300); } },
      { cap: `They first meet at <b>${L}</b>, the <b>lowest common multiple</b>. So Eq. 1 ${pl(m1)} and Eq. 2 ${pl(m2)}.`,
        run: async (c) => {
          const t1 = c1[c1.length - 1], t2 = c2[c2.length - 1]; t1.classList.add('u8l6-meet'); t2.classList.add('u8l6-meet');
          await Promise.all([pulse(c, t1, 1.15), pulse(c, t2, 1.15)]);
          await show(c, lineEl(P, `LCM <b>${L}</b>: &nbsp;${tag(1, 'Eq. 1 ' + pl(m1))} &nbsp;${tag(2, 'Eq. 2 ' + pl(m2))}`));
        } },
      { cap: `Multiply <b>every</b> term: ${T(k1(eqT(s1)))} and ${T(k2(eqT(s2)))}.`,
        run: async (c) => { const l = lineEl(P, `${T(eqHL(s1, v, B1))} &nbsp;&nbsp;&nbsp; ${T(eqHL(s2, v, A2))}`, 'u8l6-lnbig'); await show(c, l); } },
      { cap: same ? `Both ${T(v)}-terms have the <b>same</b> sign, so <b>subtract</b>${f === s2 ? ' (bigger minus smaller)' : ''}: ${T(kr(resT))}.` : `The ${T(v)}-terms have <b>opposite</b> signs, so <b>add</b>: ${T(kr(resT))}.`,
        run: async (c) => { await show(c, lineEl(P, `${same ? '<b>Same</b> sign → subtract' : '<b>Opposite</b> signs → add'}: &nbsp;${T(combT)} &nbsp;→&nbsp; ${T(kr(resT))}`)); } }
    ];
  }
};

/* =============================== explainer: which variable is easier? =============================== */
const RT = {
  ex3: { label: 'Example 3', e1: E(5, -2, 14), e2: E(3, 4, 24) },
  ex4: { label: 'Example 4', e1: E(3, 4, 29), e2: E(5, -6, -15) },
  ex5: { label: 'Example 5', e1: E(3, 5, 19), e2: E(4, 2, 16) },
  ex1: { label: 'Example 1', e1: E(1, 2, 9), e2: E(3, -1, 13) }
};
function plan(e1, e2, v) {
  const a = v === 'x' ? e1.a : e1.b, b = v === 'x' ? e2.a : e2.b, A = Math.abs(a), B = Math.abs(b), L = A * B / gcd(A, B);
  const m1 = L / A, m2 = L / B, same = Math.sign(a) === Math.sign(b), n = (m1 > 1) + (m2 > 1);
  return { v, a, b, A, B, L, m1, m2, same, n, s1: scaleE(e1, m1), s2: scaleE(e2, m2) };
}
const route = {
  title: 'Which variable is easier?',
  height: 460,
  minW: 900, // drawn this wide and scaled to fit beside the sidebar
  choices: [{ sep: 'Check' }, ...Object.keys(RT).map((k) => ({ v: k, label: RT[k].label }))],
  value: 'ex3',
  intro: (k) => `${TAG1} ${T(k1(eqT(RT[k].e1)))} and ${TAG2} ${T(k2(eqT(RT[k].e2)))}. Scan <b>both</b> variables first. Press <b>Next</b>.`,
  make(stage, k, ex) {
    const d = RT[k], { e1, e2 } = d, W = ex.W, cw = Math.floor((W - 40) / 2);
    const px = plan(e1, e2, 'x'), py = plan(e1, e2, 'y');
    const win = [px, py].sort((p, q) => p.n - q.n || p.L - q.L || (p.same - q.same))[0], lose = win === px ? py : px;
    const card = (p, i) => {
      const cd = add(stage, box(h('div', 'u8l6-rcard'), cw, 300), 14 + i * (cw + 12), 10);
      cd.innerHTML = `<div class="u8l6-rch">Eliminate ${T(p.v)}</div><div class="u8l6-rce">${T(eqHL(e1, p.v, B1))}<br>${T(eqHL(e2, p.v, A2))}</div>`;
      return cd;
    };
    const cx = card(px, 0), cy = card(py, 1);
    const P = panel(stage, 14, 322, W - 28, 130, '');
    const desc = (p) => {
      const how = p.n === 1 ? `${Math.min(p.A, p.B)} is a factor of ${Math.max(p.A, p.B)}: multiply <b>one</b> equation (${p.m1 > 1 ? 'Eq. 1 × ' + p.m1 : 'Eq. 2 × ' + p.m2})`
        : p.n === 0 ? 'they already match' : `neither is a factor of the other: multiply <b>both</b> (Eq. 1 × ${p.m1}, Eq. 2 × ${p.m2})`;
      const tgt = `${T(term(p.same ? p.L : p.L, p.v, true))} and ${T((p.same ? '' : '-') + term(p.L, p.v, true))}`;
      return `<div class="u8l6-rcl">${T(String(p.A))} and ${T(String(p.B))}: ${how}</div><div class="u8l6-rcl">→ ${tgt}, ${p.same ? 'same sign: <b>subtract</b>' : 'opposite signs: <b>add</b>'}</div>`;
    };
    const capOf = (p) => `${T(p.v)}: coefficients ${T(texNum(p.a))} and ${T(texNum(p.b))}. ${p.n === 1 ? `Multiply <b>one</b> equation by ${Math.max(p.m1, p.m2)}` : `Multiply <b>both</b> (LCM ${p.L}): × ${p.m1} and × ${p.m2}`}, then <b>${p.same ? 'subtract' : 'add'}</b>.`;
    let res = win.same ? E(win.s1.a - win.s2.a, win.s1.b - win.s2.b, win.s1.c - win.s2.c) : E(win.s1.a + win.s2.a, win.s1.b + win.s2.b, win.s1.c + win.s2.c);
    const kv = win.v === 'x' ? 'y' : 'x';
    if ((kv === 'x' ? res.a : res.b) < 0) res = E(-res.a, -res.b, -res.c);
    const K = kv === 'x' ? res.a : res.b, sol = solve2(e1, e2);
    const why = win.n < lose.n ? 'one multiplication instead of two' : win.L < lose.L ? `smaller numbers (LCM ${win.L}, not ${lose.L})` : 'and adding avoids sign slips';
    const scaled = [win.m1 > 1 ? `${tag(1, 'Eq. 1 × ' + win.m1)} ${T(k1(eqT(win.s1)))}` : '', win.m2 > 1 ? `${tag(2, 'Eq. 2 × ' + win.m2)} ${T(k2(eqT(win.s2)))}` : ''].filter(Boolean).join(' &nbsp; ');
    return [
      { cap: capOf(px), run: async (c) => { const x = h('div', 'u8l6-rcb', desc(px)); cx.appendChild(x); await show(c, x); } },
      { cap: capOf(py), run: async (c) => { const x = h('div', 'u8l6-rcb', desc(py)); cy.appendChild(x); await show(c, x); } },
      { cap: `${T(win.v)} is easier: ${why}.`,
        run: async (c) => {
          (win === px ? cx : cy).classList.add('u8l6-win'); (win === px ? cy : cx).classList.add('u8l6-lose');
          await pulse(c, win === px ? cx : cy, 1.03); await stampIn(c, stamp(win === px ? cx : cy, 'easier', { ok: true, size: 'sm' }));
        } },
      { cap: `Eliminate ${T(win.v)}: ${T(kr(`${term(K, kv, true)}=${texNum(res.c)}`))}, so ${T(kr(`${kv}=${texNum(res.c / K)}`))}. Then back-substitute: ${T(ks(pairTex(...sol)))}.`,
        run: async (c) => { await show(c, lineEl(P, scaled)); await show(c, lineEl(P, `${win.same ? 'Subtract' : 'Add'}: ${T(kr(`${term(K, kv, true)}=${texNum(res.c)}\\ \\Rightarrow\\ ${kv}=${texNum(res.c / K)}`))} &nbsp; Solution ${solPill(...sol)}`, 'u8l6-lnb')); } }
    ];
  }
};

/* =============================== explainer: the whole solution, line by line =============================== */
const WK = {
  ex1: { label: 'Example 1', sol: [5, 2], checks: [['Eq. 1', '5+2(2)=5+4=9'], ['Eq. 2', '3(5)-2=15-2=13']], steps: [
    { s: 0, cap: `Choose ${T('y')}: ${T('2y')} and ${T('-y')}. Multiply <b>every</b> term of Eq. 2 by 2.`, lines: [[TAG1, k1('x+2y=9')], [tag(2, 'Eq. 2 × 2'), k2('6x-2y=26')]] },
    { s: 1, cap: `${T('+2y')} and ${T('-2y')} are opposites, so <b>add</b>.`, lines: [`${k1('(x+2y)')}+${k2('(6x-2y)')}=${k1('9')}+${k2('26')}`, kr('7x=35')] },
    { s: 2, cap: 'Solve: divide both sides by 7.', lines: [kr('x=5')] },
    { s: 3, cap: `Back-substitute ${T('x=5')} into the <b>original</b> Eq. 1.`, lines: ['5+2y=9\\ \\Rightarrow\\ 2y=4\\ \\Rightarrow\\ y=2'] }] },
  ex2: { label: 'Example 2', sol: [4, 3], checks: [['Eq. 1', '2(4)+3(3)=8+9=17'], ['Eq. 2', '3(4)-2(3)=12-6=6']], steps: [
    { s: 0, cap: `Choose ${T('y')}: ${T('3')} and ${T('-2')}, LCM 6. Eq. 1 × 2 and Eq. 2 × 3.`, lines: [[tag(1, 'Eq. 1 × 2'), k1('4x+6y=34')], [tag(2, 'Eq. 2 × 3'), k2('9x-6y=18')]] },
    { s: 1, cap: `${T('+6y')} and ${T('-6y')} are opposites, so <b>add</b>.`, lines: [`${k1('(4x+6y)')}+${k2('(9x-6y)')}=${k1('34')}+${k2('18')}`, kr('13x=52')] },
    { s: 2, cap: 'Solve: divide both sides by 13.', lines: [kr('x=4')] },
    { s: 3, cap: `Back-substitute ${T('x=4')} into the original Eq. 1.`, lines: ['2(4)+3y=17\\ \\Rightarrow\\ 3y=9\\ \\Rightarrow\\ y=3'] }] },
  ex3: { label: 'Example 3', sol: [4, 3], checks: [['Eq. 1', '5(4)-2(3)=20-6=14'], ['Eq. 2', '3(4)+4(3)=12+12=24']], steps: [
    { s: 0, cap: `Choose ${T('y')} (one multiplication): Eq. 1 × 2 turns ${T('-2y')} into ${T('-4y')}.`, lines: [[tag(1, 'Eq. 1 × 2'), k1('10x-4y=28')], [TAG2, k2('3x+4y=24')]] },
    { s: 1, cap: `${T('-4y')} and ${T('+4y')} are opposites, so <b>add</b>.`, lines: [`${k1('(10x-4y)')}+${k2('(3x+4y)')}=${k1('28')}+${k2('24')}`, kr('13x=52')] },
    { s: 2, cap: 'Solve: divide both sides by 13.', lines: [kr('x=4')] },
    { s: 3, cap: `Back-substitute ${T('x=4')} into the original Eq. 2.`, lines: ['3(4)+4y=24\\ \\Rightarrow\\ 4y=12\\ \\Rightarrow\\ y=3'] }] },
  ex4: { label: 'Example 4', sol: [3, 5], checks: [['Eq. 1', '3(3)+4(5)=9+20=29'], ['Eq. 2', '5(3)-6(5)=15-30=-15']], steps: [
    { s: 0, cap: `Choose ${T('y')}: ${T('4')} and ${T('-6')}, LCM 12. Eq. 1 × 3 and Eq. 2 × 2.`, lines: [[tag(1, 'Eq. 1 × 3'), k1('9x+12y=87')], [tag(2, 'Eq. 2 × 2'), k2('10x-12y=-30')]] },
    { s: 1, cap: `${T('+12y')} and ${T('-12y')} are opposites, so <b>add</b>: ${T('87+(-30)=57')}.`, lines: [`${k1('(9x+12y)')}+${k2('(10x-12y)')}=${k1('87')}+${k2('(-30)')}`, kr('19x=57')] },
    { s: 2, cap: 'Solve: divide both sides by 19.', lines: [kr('x=3')] },
    { s: 3, cap: `Back-substitute ${T('x=3')} into the original Eq. 1.`, lines: ['3(3)+4y=29\\ \\Rightarrow\\ 4y=20\\ \\Rightarrow\\ y=5'] }] },
  ex5: { label: 'Example 5', sol: [3, 2], checks: [['Eq. 1', '3(3)+5(2)=9+10=19'], ['Eq. 2', '4(3)+2(2)=12+4=16']], steps: [
    { s: 0, cap: `Choose ${T('y')}: ${T('5')} and ${T('2')}, LCM 10. Eq. 1 × 2 and Eq. 2 × 5.`, lines: [[tag(1, 'Eq. 1 × 2'), k1('6x+10y=38')], [tag(2, 'Eq. 2 × 5'), k2('20x+10y=80')]] },
    { s: 1, cap: `${T('10y')} and ${T('10y')} match, so <b>subtract</b>. Bigger minus smaller keeps it positive (the other order gives ${T('-14x=-42')}).`, lines: [`${k2('(20x+10y)')}-${k1('(6x+10y)')}=${k2('80')}-${k1('38')}`, kr('14x=42')] },
    { s: 2, cap: 'Solve: divide both sides by 14. A cookie costs $3.', lines: [kr('x=3')] },
    { s: 3, cap: `Back-substitute ${T('x=3')} into Saturday’s equation. A cupcake costs $2.`, lines: ['4(3)+2y=16\\ \\Rightarrow\\ 2y=4\\ \\Rightarrow\\ y=2'] }] }
};
const STEPN = ['Choose and multiply', 'Add or subtract', 'Solve', 'Back-substitute', 'Check in both'];
const walk = {
  title: 'Choose, multiply, eliminate, solve, back-substitute, check',
  height: 520,
  minW: 900, // drawn this wide and scaled to fit beside the sidebar
  choices: [{ sep: 'Check' }, ...Object.keys(WK).map((k) => ({ v: k, label: WK[k].label }))],
  value: 'ex1',
  intro: (k) => `${WK[k].label}, one step at a time. Press <b>Next</b>.`,
  make(stage, k, ex) {
    const d = WK[k], W = ex.W;
    const trk = add(stage, box(h('div', 'u8l6-trk'), 214, 380), 12, 12);
    const tb = STEPN.map((s) => { const b = h('div', 'u8l6-trs', s); trk.appendChild(b); return b; });
    const solBox = add(stage, box(h('div', 'u8l6-solbox', `<div class="u8l6-ph">Solution</div>${solPill(...d.sol)}`), 214, 100), 12, 408); solBox.style.opacity = 0;
    const lines = add(stage, box(h('div', 'u8l6-wl'), W - 252, 360), 240, 12);
    const chk = add(stage, box(h('div', 'u8l6-chks'), W - 252, 122), 240, 386);
    const cks = d.checks.map(([lab, t], i) => { const q = h('div', 'u8l6-chk', `<div class="u8l6-chkh">${tag(i + 1, 'Check in ' + lab)}</div><div>${T(t + '\\ ' + kr('\\checkmark'))}</div>`); q.style.opacity = 0; chk.appendChild(q); return q; });
    const on = (i) => tb.forEach((b, j) => { b.classList.toggle('on', j === i); if (j < i) b.classList.add('done'); });
    const steps = d.steps.map((st) => ({ cap: st.cap,
      run: async (c) => {
        on(st.s);
        for (const L of st.lines) {
          const html = Array.isArray(L) ? `<span class="u8l6-wlab">${L[0]}</span>${T(L[1])}` : T(L);
          const l = h('div', 'u8l6-wline u8l6-ws' + st.s, html); lines.appendChild(l); await show(c, l);
        }
      } }));
    steps.push({ cap: `Check in <b>both original</b> equations. The solution is ${T(ks(pairTex(...d.sol)))}.`,
      run: async (c) => { on(4); for (const q of cks) await show(c, q); await pop(c, solBox); } });
    return steps;
  }
};

/* =============================== explainer: subtracting multiplied equations in columns =============================== */
const SG = {
  think: { label: 'Example 1, Think: eliminate x', vars: ['x', 'y'], r1: [3, 6, 27], r2: [3, -1, 13], n1: 'Eq. 1 × 3', n2: 'Eq. 2' },
  warm: { label: 'Warm-up: 3 copies of A − B', vars: ['x', 'y'], r1: [3, 6, 27], r2: [3, 1, 17], n1: 'A × 3', n2: 'B', w1: '3 copies of Stack A', w2: 'Stack B' },
  ex5: { label: 'Example 5: bigger minus smaller', vars: ['x', 'y'], r1: [20, 10, 80], r2: [6, 10, 38], n1: 'Eq. 2 × 5', n2: 'Eq. 1 × 2', swap: true }
};
const columns = {
  title: 'Subtract in columns: every sign flips',
  height: 430,
  minW: 966, // drawn this wide and scaled to fit beside the sidebar
  choices: [{ sep: 'Check' }, ...Object.keys(SG).map((k) => ({ v: k, label: SG[k].label }))],
  value: 'think',
  intro: (k) => `${SG[k].w1 || SG[k].n1} minus ${SG[k].w2 || SG[k].n2}. Line the equations up in columns. Press <b>Next</b>.`,
  make(stage, k, ex) {
    const d = SG[k], vs = d.vars, n = vs.length, W = ex.W;
    const C1 = d.swap ? A2 : B1, C2 = d.swap ? B1 : A2, t1 = d.swap ? 2 : 1, t2 = d.swap ? 1 : 2;
    const r1 = d.r1, r2 = d.r2, rn = r2.map((v) => -v), rs = r1.map((v, i) => v + rn[i]);
    const elimI = vs.findIndex((_, i) => r1[i] && r2[i] && rs[i] === 0);
    const leftK = vs.map((v, i) => [rs[i], v]).filter(([q], i) => q && i !== elimI);
    const resT = (leftK.map(([q, v], i) => term(q, v, i === 0)).join('') || '0') + '=' + texNum(rs[n]);
    const colW = 118, x0 = 168, xs = vs.map((_, i) => x0 + 34 + i * colW), xe = x0 + 34 + n * colW, xc = xe + 40;
    const cell = (x, y, w, html, cls = '') => add(stage, box(h('div', 'u8l6-sc ' + cls, html), w, 52), x, y);
    const rowT = (r, i, col, first) => (r[i] ? T(tc(col, term(r[i], vs[i], first))) : '');
    const firstI = (r) => r.findIndex((v) => v);
    const name = (y, html) => add(stage, box(h('div', 'u8l6-sname', html), 156, 52), 6, y);
    const Y = [20, 86, 170, 262];
    name(Y[0], tag(t1, d.n1)); name(Y[1], tag(t2, d.n2));
    vs.forEach((_, i) => cell(xs[i], Y[0], colW, rowT(r1, i, C1, i === firstI(r1))));
    cell(xe, Y[0], 40, T('=')); cell(xc, Y[0], 110, T(tc(C1, texNum(r1[n]))));
    const minus = cell(x0, Y[1], 34, T('-('), 'u8l6-sbr'), close = cell(xc + 110, Y[1], 30, T(')'), 'u8l6-sbr');
    minus.style.opacity = 0; close.style.opacity = 0;
    const r2c = vs.map((_, i) => cell(xs[i], Y[1], colW, rowT(r2, i, C2, i === firstI(r2))));
    cell(xe, Y[1], 40, T('=')); const r2k = cell(xc, Y[1], 110, T(tc(C2, texNum(r2[n]))));
    const fl = name(Y[2], `<span class="u8l6-flipt">flip every sign</span>`); fl.style.opacity = 0;
    const flc = vs.map((_, i) => cell(xs[i], Y[2], colW, r2[i] ? T(tc(C2, (rn[i] > 0 ? '+' : '') + term(rn[i], vs[i], true))) : '', 'u8l6-flipc'));
    const fle = cell(xe, Y[2], 40, T('=')), flk = cell(xc, Y[2], 110, T(tc(C2, texNum(rn[n]))), 'u8l6-flipc');
    [...flc, fle, flk].forEach((e) => (e.style.opacity = 0));
    const rule = add(stage, box(h('div', 'u8l6-rule'), xc + 110 - x0, 4), x0, Y[3] - 12); rule.style.opacity = 0;
    const sumc = vs.map((_, i) => cell(xs[i], Y[3], colW, (r1[i] || r2[i]) ? T(i === elimI ? '0' : kr(term(rs[i], vs[i], i === firstI(rs)))) : '', i === elimI ? 'u8l6-sz' : ''));
    const sume = cell(xe, Y[3], 40, T('=')), sumk = cell(xc, Y[3], 110, T(kr(texNum(rs[n]))));
    [...sumc, sume, sumk].forEach((e) => (e.style.opacity = 0));
    const P = panel(stage, W - 304, 14, 292, 400, 'Result');
    const val = leftK.length === 1 ? rs[n] / leftK[0][0] : null;
    const steps = [
      { cap: `Write the whole of ${d.w2 || d.n2} in brackets with a minus sign in front: ${T('(\\;\\cdots)-(\\;\\cdots)')}. The minus belongs to <b>every</b> term inside.`,
        run: async (c) => { await Promise.all([pop(c, minus), pop(c, close)]); } },
      { cap: 'Taking away is the same as adding the <b>opposite</b>. Flip the sign of <b>every</b> term in the bracket, the constant too.',
        run: async (c) => {
          await fadeIn(c, fl);
          for (let i = 0; i < n; i++) { if (!r2[i]) continue; r2c[i].classList.add('u8l6-hl'); await pop(c, flc[i], 360); r2c[i].classList.remove('u8l6-hl'); }
          await appear(c, fle); r2k.classList.add('u8l6-hl'); await pop(c, flk, 360); r2k.classList.remove('u8l6-hl');
        } },
      { cap: `Now <b>add</b> down each column. ${elimI >= 0 ? `${T(term(r1[elimI], vs[elimI], true) + term(rn[elimI], vs[elimI], false) + '=0')}: ${T(vs[elimI])} is eliminated.` : ''}`,
        run: async (c) => {
          await anim(c, rule, [{ opacity: 0, transform: 'scaleX(0)' }, { opacity: 1, transform: 'none' }], 400);
          for (let i = 0; i < n; i++) { if (!(r1[i] || r2[i])) continue; await pop(c, sumc[i], 380); }
          await appear(c, sume); await pop(c, sumk, 380);
          if (elimI >= 0) { sumc[elimI].classList.add('u8l6-gone'); }
          await show(c, lineEl(P, T(kr(resT)), 'u8l6-lnb'));
        } }
    ];
    if (val != null) {
      const v = leftK[0][1];
      steps.push({ cap: `One variable left: ${T(kr(resT))}, so ${T(kr(`${v}=${texNum(val)}`))}.${k === 'warm' ? ' A thin book is 2 cm, with no thick books in sight.' : ''}`,
        run: (c) => show(c, lineEl(P, T(kr(`${v}=${texNum(val)}`)), 'u8l6-lnb')) });
    }
    if (d.slip) {
      steps.push({ cap: d.slip.cap,
        run: async (c) => {
          const box2 = h('div', 'u8l6-slip', `<div class="u8l6-sliph">Watch out</div><div>${T(d.slip.l1)}</div><div class="u8l6-bad">${T(d.slip.l2)}</div>`);
          P.appendChild(box2); await show(c, box2); const s = stamp(box2, '✗', { ok: false, size: 'sm' }); await stampIn(c, s);
        } });
    }
    return steps;
  }
};


mountWarm();
export const explainers = mountExplainers({ books, stuck, scale, columns, lcm, route, walk });

/* ============ Stand Up Break! — elimination, multiplying first (lessons/js/standup.js) ============
 * Systems are built from an integer solution; the key is worked from the equations: multiply (to the LCM of one
 * variable's coefficients), add (opposite signs) or subtract (same sign, bigger minus smaller), solve, back-substitute.
 *   BEG  multiply one equation (one coefficient is a factor of the other)
 *   PRG  multiply both equations (lowest common multiple)
 *   MAS  choose the easier variable: one variable needs one equation multiplied, the other needs both */
{
  const BL = COLORS.blue, AM = COLORS.amber;
  const tm = (k, v, first) => (k === 0 ? '' : (k < 0 ? '-' : first ? '' : '+') + (Math.abs(k) === 1 && v ? '' : Math.abs(k)) + v);
  const N = (a, b, c) => (a < 0 || (a === 0 && b < 0) ? { a: -a, b: -b, c: -c + 0 } : { a, b, c: c + 0 });
  const lhsS = (e) => tm(e.a, 'x', true) + tm(e.b, 'y', !e.a);
  const eqS = (e) => lhsS(e) + '=' + e.c;
  const half = (s, col) => { const i = s.indexOf('='), l = s.slice(0, i).replace(/^-/, '{-}'); return `\\textcolor{${col}}{${l}}&\\textcolor{${col}}{${s.slice(i)}}`; };
  const sysE = (s1, s2) => `\\begin{aligned}{\\small\\text{Eq. 1}}\\quad ${half(s1, BL)}\\\\{\\small\\text{Eq. 2}}\\quad ${half(s2, AM)}\\end{aligned}`;
  const par = (v) => (v < 0 ? `(${v})` : String(v));
  const kn = (k, v, first) => (k === 1 ? (first ? '' : '+') + par(v) : k === -1 ? `-${par(v)}` : (k < 0 ? '-' : first ? '' : '+') + Math.abs(k) + `(${v})`);
  const lcmN = (a, b) => Math.abs(a * b) / gcd(a, b);
  const nz = (r, lo, hi) => r.int(lo, hi) * r.sign();
  const mk = (a1, b1, a2, b2, x0, y0) => [N(a1, b1, a1 * x0 + b1 * y0), N(a2, b2, a2 * x0 + b2 * y0)];
  const ok = (e1, e2) => e1.a * e2.b !== e1.b * e2.a && gcd(gcd(e1.a, e1.b), e1.c) === 1 && gcd(gcd(e2.a, e2.b), e2.c) === 1;
  const co = (e, v) => (v === 'x' ? e.a : e.b);
  function work(e1, e2, v, x0, y0, lead) {
    const c1 = co(e1, v), c2 = co(e2, v), u = v === 'x' ? 'y' : 'x', L = lcmN(c1, c2), m1 = L / Math.abs(c1), m2 = L / Math.abs(c2);
    const s1 = { a: e1.a * m1, b: e1.b * m1, c: e1.c * m1 }, s2 = { a: e2.a * m2, b: e2.b * m2, c: e2.c * m2 };
    const same = Math.sign(c1) === Math.sign(c2), sg = same ? -1 : 1;
    let r = { a: s1.a + sg * s2.a, b: s1.b + sg * s2.b, c: s1.c + sg * s2.c }, f = s1, g = s2;
    if (same && co(r, u) < 0) { r = { a: -r.a, b: -r.b, c: -r.c }; f = s2; g = s1; }
    const K = co(r, u), u0 = r.c / K;
    const scaled = [m1 > 1 ? `\\text{Eq. 1}\\times${m1}:\\ ${eqS(s1)}` : '', m2 > 1 ? `\\text{Eq. 2}\\times${m2}:\\ ${eqS(s2)}` : ''];
    const comb = `\\text{${same ? 'Subtract' : 'Add'}: }(${lhsS(f)})${same ? '-' : '+'}(${lhsS(g)})=${f.c}${same ? '-' : '+'}${par(g.c)}`;
    const one = `${tm(K, u, true)}=${r.c}` + (K === 1 ? '' : `\\ \\Rightarrow\\ ${u}=${u0}`);
    const size = (e) => Math.abs(e.a) + Math.abs(e.b) + Math.abs(e.c) / 10;
    const e = size(e1) <= size(e2) ? e1 : e2, cu = co(e, u), cv = co(e, v), rest = e.c - cu * u0, v0 = rest / cv;
    const into = u === 'x' ? kn(cu, u0, true) + tm(cv, v, false) : tm(cv, v, true) + kn(cu, u0, false);
    const back = `${into}=${e.c}\\ \\Rightarrow\\ ${tm(cv, v, true)}=${rest}` + (cv === 1 ? '' : `\\ \\Rightarrow\\ ${v}=${v0}`);
    return [lead, ...scaled, comb, one, back, `\\text{Solution: } (${x0},\\ ${y0})`].filter(Boolean);
  }
  const pick = (r) => { for (;;) { const x0 = r.int(-5, 6), y0 = r.int(-5, 6); if (x0 && y0 && x0 !== y0) return [x0, y0]; } };
  const build = (v, p1, p2, q1, q2, x0, y0) => (v === 'x' ? mk(p1, q1, p2, q2, x0, y0) : mk(q1, p1, q2, p2, x0, y0));
  const noDiv = (a, b) => a % b !== 0 && b % a !== 0;
  function beg(r) {   // one coefficient is ±1 or a factor: multiply one equation
    for (;;) {
      const [x0, y0] = pick(r), v = r.pick(['x', 'y']), p = r.pick([1, 1, 2]), k = r.int(2, 4), q1 = nz(r, 1, 5), q2 = nz(r, 1, 5);
      if (Math.abs(q1) === Math.abs(q2) || p * k > 8) continue;
      let [e1, e2] = build(v, p * r.sign(), p * k * r.sign(), q1, q2, x0, y0);
      if (r.chance(0.5)) [e1, e2] = [e2, e1];
      if (!ok(e1, e2)) continue;
      const c1 = Math.abs(co(e1, v)), c2 = Math.abs(co(e2, v)), u = v === 'x' ? 'y' : 'x', cu1 = Math.abs(co(e1, u)), cu2 = Math.abs(co(e2, u));
      if (cu1 === cu2) continue;
      return { text: `Multiply <b>one</b> equation so the ${v}-terms match, then solve. Check in both equations.`, q: sysE(eqS(e1), eqS(e2)), a: work(e1, e2, v, x0, y0) };
    }
  }
  function prg(r) {   // neither divides the other: multiply both to the LCM
    for (;;) {
      const [x0, y0] = pick(r), v = r.pick(['x', 'y']), p1 = r.int(2, 5), p2 = r.int(2, 5), q1 = nz(r, 1, 6), q2 = nz(r, 1, 6);
      if (!noDiv(p1, p2) || Math.abs(q1) === Math.abs(q2)) continue;
      const [e1, e2] = build(v, p1, p2 * r.sign(), q1, q2, x0, y0);
      if (!ok(e1, e2)) continue;
      const u = v === 'x' ? 'y' : 'x', a = Math.abs(co(e1, u)), b = Math.abs(co(e2, u));
      if (a === b || a % b === 0 || b % a === 0) continue;   // the other variable needs both too: no shortcut
      if (lcmN(a, b) < lcmN(p1, p2)) continue;              // the asked variable is the sensible one
      return { text: `Multiply <b>both</b> equations so the ${v}-terms match (use the LCM), then solve. Check in both equations.`, q: sysE(eqS(e1), eqS(e2)), a: work(e1, e2, v, x0, y0, `\\text{LCM}(${p1},\\ ${p2})=${lcmN(p1, p2)}`) };
    }
  }
  function mas(r) {   // choose: one variable needs one multiplication, the other needs both
    for (;;) {
      const [x0, y0] = pick(r), v = r.pick(['x', 'y']), p = r.int(1, 3), k = r.int(2, 3), q1 = r.int(2, 7), q2 = r.int(2, 7);
      if (!noDiv(q1, q2) || p * k > 8) continue;
      let [e1, e2] = build(v, p * r.sign(), p * k * r.sign(), q1 * r.sign(), q2 * r.sign(), x0, y0);
      if (r.chance(0.5)) [e1, e2] = [e2, e1];
      if (!ok(e1, e2)) continue;
      const u = v === 'x' ? 'y' : 'x';
      return { text: '<b>Choose the easier variable</b>, then solve the system by elimination. Check in both equations.', q: sysE(eqS(e1), eqS(e2)),
        a: work(e1, e2, v, x0, y0, `\\text{Easier: eliminate } ${v}\\ \\text{(multiply one equation; } ${u} \\text{ needs both)}`) };
    }
  }
  standup('u8l6', {
    intro: 'Make a pair of coefficients match: multiply one equation, or both (use the LCM). Then add or subtract, solve, and check in both equations.',
    levels: { BEG: beg, PRG: prg, MAS: mas }
  });
}

/* ---------- Math History box: the Nine Chapters' counting board (Chapter 8, Problem 1), from the 10C twin ----------
 * Three columns of rod numerals, right to left. The middle column is multiplied by 3, then the right column is
 * subtracted from it twice: (2, 3, 1, 34) -> (6, 9, 3, 102) -> (3, 7, 2, 63) -> (0, 5, 1, 24). The top grade is gone. */
(function fangchengBoard() {
  const svg = document.getElementById('u8l6-hist'); if (!svg) return;
  const NS = 'http://www.w3.org/2000/svg';
  const mk = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); Object.keys(attrs || {}).forEach((k) => e.setAttribute(k, attrs[k])); (parent || svg).appendChild(e); return e; };
  const txt = (s, attrs, parent) => { const e = mk('text', attrs, parent); e.textContent = s; return e; };
  const ease = (u) => (u <= 0 ? 0 : u >= 1 ? 1 : u * u * (3 - 2 * u));
  // rod numerals: units and hundreds upright, tens lying down; 6–9 use a crossing "five" rod; 0 is an empty space
  function rodDigit(g, d, cx, cy, upright) {
    const L = (x1, y1, x2, y2) => mk('line', { x1: cx + x1, y1: cy + y1, x2: cx + x2, y2: cy + y2 }, g);
    const n = d > 5 ? d - 5 : d, s = 6, off = (i) => (i - (n - 1) / 2) * s;
    if (upright) {
      if (d > 5) { L(-10, -11, 10, -11); for (let i = 0; i < n; i++) L(off(i), -6, off(i), 11); }
      else for (let i = 0; i < n; i++) L(off(i), -11, off(i), 11);
    } else if (d > 5) { L(0, -11, 0, 11 - n * s); for (let i = 0; i < n; i++) L(-10, 11 - i * s, 10, 11 - i * s); }
    else for (let i = 0; i < n; i++) L(-10, off(i), 10, off(i));
  }
  function rods(g, v, cx, cy) {
    while (g.firstChild) g.removeChild(g.firstChild);
    const ds = String(v).split('').map(Number), W = 22, G = 5, tot = ds.length * W + (ds.length - 1) * G;
    if (v === 0) return;
    ds.forEach((d, i) => { const place = ds.length - 1 - i; if (d) rodDigit(g, d, cx - tot / 2 + W / 2 + i * (W + G), cy, place % 2 === 0); });
  }
  const ROWS = ['top', 'medium', 'low', 'dou'], RY = [106, 160, 214, 268], CX = [356, 264, 172], CW = 86;
  const COLS = [[3, 2, 1, 39], [2, 3, 1, 34], [1, 2, 3, 26]];
  const MID = [[2, 3, 1, 34], [6, 9, 3, 102], [3, 7, 2, 63], [0, 5, 1, 24]];
  txt('A counting board', { x: 40, y: 32, class: 'u8l6h-cap' });
  const note = txt('', { x: 562, y: 32, 'text-anchor': 'end', class: 'u8l6h-note' });
  ROWS.forEach((r, i) => txt(r, { x: 118, y: RY[i] + 5, 'text-anchor': 'end', class: 'u8l6h-row' }));
  mk('rect', { x: 126, y: 74, width: 276, height: 220, rx: 8, class: 'u8l6h-board' });
  const cols = CX.map((cx, c) => {
    const g = mk('g', { class: 'u8l6h-col' });
    const frame = mk('rect', { x: cx - CW / 2 + 2, y: 78, width: CW - 4, height: 212, rx: 6, class: 'u8l6h-frame' + (c === 0 ? ' u8l6h-f1' : c === 1 ? ' u8l6h-f2' : '') }, g);
    txt('Eq. ' + (c + 1), { x: cx, y: 64, 'text-anchor': 'middle', class: 'u8l6h-eqn' + (c === 0 ? ' u8l6h-c1' : c === 1 ? ' u8l6h-c2' : '') }, g);
    const cells = RY.map((y) => ({ r: mk('g', { class: 'u8l6h-rods' }, g), n: txt('', { x: cx + CW / 2 - 9, y: y + 22, 'text-anchor': 'end', class: 'u8l6h-num' }, g), y }));
    return { g, frame, cells, cx, v: null };
  });
  for (let i = 1; i < 4; i++) mk('line', { x1: 130, x2: 398, y1: RY[i] - 27, y2: RY[i] - 27, class: 'u8l6h-sep' });
  const glow = mk('rect', { x: CX[1] - CW / 2 + 6, y: RY[0] - 23, width: CW - 12, height: 36, rx: 8, class: 'u8l6h-glow' });
  // the ghost copy of Eq. 1 that slides onto the middle column to be subtracted
  const ghost = mk('g', { class: 'u8l6h-ghost' }), ghostCells = RY.map(() => mk('g', {}, ghost));
  ghostCells.forEach((g, i) => rods(g, COLS[0][i], 0, RY[i]));
  const badge = txt('', { x: CX[1], y: 44, 'text-anchor': 'middle', class: 'u8l6h-badge' });
  function setCol(c, vals) {
    const C = cols[c], key = vals.join(); if (C.v === key) return; C.v = key;
    C.cells.forEach((cell, i) => { rods(cell.r, vals[i], C.cx, cell.y - 4); cell.n.textContent = String(vals[i]); });
  }
  // the same steps in today's symbols
  txt('Eq. 1', { x: 418, y: 96, class: 'u8l6h-pl u8l6h-c1' });
  txt('3x + 2y + z = 39', { x: 418, y: 118, class: 'u8l6h-pe u8l6h-c1' });
  const pLab = txt('Eq. 2', { x: 418, y: 158, class: 'u8l6h-pl u8l6h-c2' });
  const pEq = txt('', { x: 418, y: 180, class: 'u8l6h-pe u8l6h-c2' });
  const fin = txt('', { x: 418, y: 236, class: 'u8l6h-fin' }), fin2 = txt('', { x: 418, y: 258, class: 'u8l6h-fin2' });
  const EQ = ['2x + 3y + z = 34', '6x + 9y + 3z = 102', '3x + 7y + 2z = 63', '0x + 5y + z = 24'];
  const LAB = ['Eq. 2', 'Eq. 2 × 3', '− Eq. 1', '− Eq. 1 again'];
  const T = { in: [200, 600, 1000], x3: 3000, g1: [4000, 4800], s1: 4900, g2: [5800, 6600], s2: 6700, end: 9600 };
  function draw(t) {
    cols.forEach((C, c) => { C.g.style.opacity = t >= T.in[c] ? 1 : 0; });
    setCol(0, COLS[0]); setCol(2, COLS[2]);
    const k = t < T.x3 ? 0 : t < T.s1 ? 1 : t < T.s2 ? 2 : 3;
    setCol(1, MID[k]);
    pEq.textContent = EQ[k]; pLab.textContent = LAB[k];
    pLab.style.opacity = pEq.style.opacity = t >= T.in[1] ? 1 : 0;
    cols[0].frame.classList.toggle('on', t >= 2000); cols[1].frame.classList.toggle('on', t >= 2000);
    cols[1].frame.classList.toggle('u8l6h-done', k === 3);
    // ghost slides from the right column onto the middle one
    let gx = null;
    [T.g1, T.g2].forEach(([a, b]) => { if (t >= a && t < b + 100) gx = CX[0] + (CX[1] - CX[0]) * ease((t - a) / (b - a)); });
    ghost.style.opacity = gx === null ? 0 : 0.7; ghost.setAttribute('transform', `translate(${gx === null ? CX[0] : gx} -4)`);
    badge.textContent = t >= 2300 && t < T.g1[0] ? '× 3' : (t >= T.g1[0] && t < T.s1 + 300) || (t >= T.g2[0] && t < T.s2 + 300) ? '− Eq. 1' : '';
    glow.classList.toggle('on', k === 3);
    note.textContent = t < 2000 ? 'one equation per column, right to left' : t < T.g1[0] ? 'multiply the middle column by 3' : t < T.s2 ? 'subtract the right column' : 'the top grade is eliminated';
    fin.textContent = t >= T.s2 + 600 ? '5y + z = 24' : ''; fin2.textContent = t >= T.s2 + 1300 ? 'one fewer variable' : '';
  }
  let st = 0, raf = 0;
  function frame(now) { if (!st) st = now; const t = Math.min(T.end, now - st); draw(t); if (t < T.end) raf = requestAnimationFrame(frame); }
  function play() {
    cancelAnimationFrame(raf); st = 0;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { draw(T.end); return; }
    raf = requestAnimationFrame(frame);
  }
  draw(0);
  svg.addEventListener('click', play);
  const btn = svg.closest('.hist-anim') && svg.closest('.hist-anim').querySelector('.hist-play'); if (btn) btn.addEventListener('click', play);
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { io.disconnect(); play(); } }, { threshold: 0.5 });
    io.observe(svg);
  } else play();
})();

