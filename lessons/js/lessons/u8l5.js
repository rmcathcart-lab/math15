/* Math 15 · Unit 8 · Lesson 5 — Solving Systems by Elimination, Part 1: When Coefficients Already Match.
 * Warm-up: The Two Receipts (Burger Barn receipts for Mia and Jay; Sam's taco-truck order and swap slip), drawn here.
 * Explainers (several adapted from the Math 10C twin, u8l3):
 *   receipts  the warm-up solved: Jay − Mia (the burgers cancel, 2 drinks = $4); the big one, Sam's slips added (the
 *             juices cancel, 4 tacos = $12); why subtracting the slips fails
 *   balance   two level balances combined pan to pan; subtracting = flipping every block of Eq. 2, then adding;
 *             opposite blocks cancel; collect, divide, back-substitute (Section 1 idea, Examples 1 and 2)
 *   columns   subtracting in columns: brackets, flip every sign (the constant too), add down; a "watch out" slip
 *             (Examples 1, 3, 5, the warm-up receipts)
 *   either    back-substitute into either original equation: both give the same value (Examples 1, 3, 4)
 *   zero      adding opposites with tiles: +y over −y make zero pairs and vanish; the tiles left share the total
 *             (the idea, Examples 2 and 4)
 *   graph     the graph view: Eq. 1 ± k × Eq. 2 turns about the crossing until it is flat or upright (Examples 1, 2, 4)
 *   decide    add or subtract? a flowchart (same number? same sign?) for Examples 3, 4, 5 and a "nothing matches" look-ahead
 *   walk      decide, eliminate, solve, back-substitute, check, one line at a time (Examples 1–5)
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
const TAG1 = '<span class="u8l5-tg u8l5-t1">Eq. 1</span>', TAG2 = '<span class="u8l5-tg u8l5-t2">Eq. 2</span>';
const tag = (n, txt) => `<span class="u8l5-tg u8l5-t${n}">${txt}</span>`;
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
  const z = place(add(stage, h('div', 'u8l5-zero', zeroHtml)), mx, my, 'c', 0);
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
const lineEl = (host, html, cls = '') => { const d = h('div', 'u8l5-ln ' + cls, html); host.appendChild(d); return d; };
const show = (c, el) => fadeIn(c, el, 320);
const panel = (stage, x, y, w, hh, title, cls = '') => add(stage, box(h('div', 'u8l5-panel ' + cls, title ? `<div class="u8l5-ph">${title}</div>` : ''), w, hh), x, y);
const solPill = (x, y) => `<span class="u8l5-sol">${T(ks(pairTex(x, y)))}</span>`;

/* =============================== warm-up: the receipts =============================== */
const INK = 'stroke="#1e2d46" stroke-width="2"';
const ICON = {
  burger: `<svg viewBox="0 0 60 54" class="u8l5-isvg" aria-hidden="true"><path d="M7 27 C7 9 53 9 53 27 Z" fill="#e0a04a" ${INK}/>
<path d="M6 27 H54 L50 32 L45 28 L40 32 L35 28 L30 32 L25 28 L20 32 L15 28 L10 32 Z" fill="#4caf50"/>
<rect x="5" y="31" width="50" height="8" rx="3.5" fill="#6d3b1c"/><rect x="7" y="39" width="46" height="9" rx="4" fill="#e0a04a" ${INK}/>
<g fill="#fff3c4"><ellipse cx="20" cy="18" rx="2.4" ry="1.4"/><ellipse cx="31" cy="14.5" rx="2.4" ry="1.4"/><ellipse cx="41" cy="19" rx="2.4" ry="1.4"/></g></svg>`,
  drink: `<svg viewBox="0 0 60 54" class="u8l5-isvg" aria-hidden="true"><path d="M32 12 L40 1" stroke="#1e2d46" stroke-width="3" stroke-linecap="round"/>
<path d="M16 13 H44 L40 52 H20 Z" fill="#e2574c" ${INK} stroke-linejoin="round"/><rect x="17.6" y="25" width="24.8" height="8" fill="#fff"/>
<rect x="13" y="10" width="34" height="5" rx="2" fill="#1e2d46"/></svg>`,
  taco: `<svg viewBox="0 0 60 54" class="u8l5-isvg" aria-hidden="true"><path d="M7 44 A23 30 0 0 1 53 44 Z" fill="#4caf50"/>
<circle cx="21" cy="21" r="4" fill="#e2574c"/><circle cx="36" cy="18" r="4" fill="#e2574c"/>
<path d="M3 46 A27 30 0 0 1 57 46 L48 46 A18 21 0 0 0 12 46 Z" fill="#f2c14e" ${INK} stroke-linejoin="round"/></svg>`,
  juice: `<svg viewBox="0 0 60 54" class="u8l5-isvg" aria-hidden="true"><path d="M33 13 V3 L41 1" fill="none" stroke="#1e2d46" stroke-width="2.5" stroke-linecap="round"/>
<rect x="18" y="12" width="24" height="40" rx="2" fill="#f59a23" ${INK}/><circle cx="30" cy="31" r="7" fill="#fde68a"/></svg>`
};
const icons = (kind, n) => `<span class="u8l5-it">${ICON[kind]}</span>`.repeat(n);
function receipt(o) {
  const r = h('div', 'u8l5-rc ' + (o.cls || ''));
  r.innerHTML = `<div class="u8l5-rch">${o.head}</div><div class="u8l5-rcs">${o.sub}</div><div class="u8l5-rcd"></div>` +
    o.lines.map((l) => `<div class="u8l5-rcl">${l}</div>`).join('') +
    `<div class="u8l5-rcd"></div><div class="u8l5-rctot"><b>${o.total[0]}</b><b class="u8l5-rcm">${o.total[1]}</b></div>`;
  return r;
}
function mountWarm() {
  const bb = document.getElementById('u8l5-bb'), tt = document.getElementById('u8l5-tt');
  if (bb) {
    bb.append(
      receipt({ head: 'BURGER BARN', sub: 'Receipt #1 — Mia', total: ['TOTAL', '$14.00'],
        lines: [`<span class="u8l5-rci">${icons('burger', 2)}</span><span>2 burgers</span>`, `<span class="u8l5-rci">${icons('drink', 1)}</span><span>1 drink</span>`] }),
      receipt({ head: 'BURGER BARN', sub: 'Receipt #2 — Jay', total: ['TOTAL', '$18.00'],
        lines: [`<span class="u8l5-rci">${icons('burger', 2)}</span><span>2 burgers</span>`, `<span class="u8l5-rci">${icons('drink', 3)}</span><span>3 drinks</span>`] }));
  }
  if (tt) {
    tt.append(
      receipt({ head: 'TACO TRUCK', sub: 'Sam’s order', total: ['PAID', '$13'], cls: 'u8l5-rcsm',
        lines: [`<span class="u8l5-rci">${icons('taco', 3)}${icons('juice', 2)}</span>`, '<span class="u8l5-rcw">3 tacos, 2 juices</span>'] }),
      receipt({ head: 'TACO TRUCK', sub: 'Sam’s swap, later', total: ['REFUND', '$1'], cls: 'u8l5-rcsm',
        lines: [`<span class="u8l5-rci">${icons('taco', 1)}<span class="u8l5-gap"></span><span class="u8l5-gneg">${icons('juice', 2)}</span></span>`, '<span class="u8l5-rcw">+1 taco, −2 juices</span>'] }));
  }
}

/* =============================== explainer: the receipts, solved =============================== */
function grp(kind, n, neg) { const g = h('div', 'u8l5-grp' + (neg ? ' u8l5-gneg' : ''), icons(kind, n)); g.kind = kind; g.n = n; return g; }
const receipts = {
  title: 'The receipts, solved',
  height: 452,
  minW: 940, // drawn this wide and scaled to fit beside the sidebar
  choices: [{ v: 'mj', label: 'Mia and Jay: compare' }, { v: 'big', label: 'The big one: Sam’s slips' }],
  intro: (k) => (k === 'mj' ? 'Jay’s receipt and Mia’s receipt, one above the other. Press <b>Next</b>.'
    : 'Sam’s order and Sam’s swap slip, one above the other. A refund is a <b>minus</b>. Press <b>Next</b>.'),
  make(stage, k, ex) {
    const W = ex.W, big = k === 'big';
    const x0 = 8, C = { s: [x0, 30], n: [x0 + 30, 92], g1: [x0 + 124, 178], o: [x0 + 304, 30], g2: [x0 + 336, 178], e: [x0 + 516, 30], v: [x0 + 548, 96] };
    const cell = (key, y, html, cls = '') => add(stage, box(h('div', 'u8l5-rcell ' + cls, html), C[key][1], 76), C[key][0], y);
    const row = (y, d) => {
      const r = { s: cell('s', y, d.s || '', 'u8l5-rop u8l5-rsg'), n: cell('n', y, d.n, 'u8l5-rname'), g1: cell('g1', y, ''), o: cell('o', y, d.o || '+', 'u8l5-rop'),
        g2: cell('g2', y, ''), e: cell('e', y, '=', 'u8l5-rop'), v: cell('v', y, d.v, 'u8l5-rval' + (d.vcls ? ' ' + d.vcls : '')) };
      if (d.g1) r.g1.appendChild(grp(...d.g1)); if (d.g2) r.g2.appendChild(grp(...d.g2));
      return r;
    };
    const D = big
      ? { r1: { n: 'Order', g1: ['taco', 3], g2: ['juice', 2], v: '$13' }, r2: { s: '+', n: 'Swap', g1: ['taco', 1], o: '−', g2: ['juice', 2, true], v: '−$1' },
        res: { n: 'Together', g1: ['taco', 4], v: '$12', vcls: 'u8l5-rgood' } }
      : { r1: { n: 'Jay', g1: ['burger', 2], g2: ['drink', 3], v: '$18' }, r2: { s: '−', n: 'Mia', g1: ['burger', 2], g2: ['drink', 1], v: '$14' },
        res: { n: 'Jay − Mia', g1: null, g2: ['drink', 2], v: '$4', vcls: 'u8l5-rgood' } };
    const r1 = row(14, D.r1), r2 = row(100, D.r2);
    r2.s.style.opacity = 0;
    const rule = add(stage, box(h('div', 'u8l5-rule'), 636, 4), 8, 186); rule.style.opacity = 0;
    const res = row(198, D.res);
    res.o.innerHTML = '';
    Object.values(res).forEach((e) => (e.style.opacity = 0));
    const fin = add(stage, box(h('div', 'u8l5-rfin'), 636, 150), 8, 292); fin.style.opacity = 0;
    const P = panel(stage, 660, 14, W - 670, 428, 'As equations');
    const showRow = (c, r) => Promise.all(Object.values(r).map((e, i) => anim(c, e, [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], 320, { delay: i * 50 })));
    const cancelG = async (c, a, b) => {
      const pa = a.parentNode, pb = b.parentNode;
      await cancelPair(c, stage, a, b, '<b class="u8l5-z0">0</b>');
      const xa = pa.appendChild(grp(a.kind, a.n)), xb = pb.appendChild(grp(b.kind, b.n));
      [xa, xb].forEach((x) => x.classList.add('u8l5-xed'));
      await Promise.all([xa, xb].map((x) => anim(c, x, [{ opacity: 0 }, { opacity: 0.3 }], 300)));
    };
    const finRow = (html) => { const d = h('div', 'u8l5-rf', html); fin.appendChild(d); fin.style.opacity = 1; return d; };
    if (!big) {
      return [
        { cap: 'Both receipts have <b>2 burgers</b>. Line them up and <b>subtract</b>: Jay’s receipt minus Mia’s, item by item and total by total.',
          run: async (c) => {
            await pop(c, r2.s, 380); await anim(c, rule, [{ opacity: 0, transform: 'scaleX(0)' }, { opacity: 1, transform: 'none' }], 450);
            lineEl(P, `<span class="u8l5-muted">${T('b')} = one burger, ${T('d')} = one drink</span>`, 'u8l5-lnsm');
            await show(c, lineEl(P, `Jay ${T(k1('2b+3d=18'))}`)); await show(c, lineEl(P, `Mia ${T(k2('2b+d=14'))}`));
          } },
        { cap: '2 burgers − 2 burgers <b>= 0</b>. The burgers cancel: they have been <b>eliminated</b>!',
          run: (c) => cancelG(c, r1.g1.firstChild, r2.g1.firstChild) },
        { cap: 'What is left: 3 − 1 = <b>2 drinks</b>, and $18 − $14 = <b>$4</b>. So 2 drinks cost $4.',
          run: async (c) => { await showRow(c, res); await show(c, lineEl(P, `subtract: ${T(kr('2d=4'))}`, 'u8l5-lnb')); } },
        { cap: 'One drink costs $4 ÷ 2 = <b>$2</b>.',
          run: async (c) => { await show(c, finRow(`${icons('drink', 1)}<b>$2</b><span>$4 ÷ 2</span>`)); await show(c, lineEl(P, T(kr('d=2')), 'u8l5-lnb')); } },
        { cap: 'Back to Mia: 2 burgers + $2 = $14, so 2 burgers = $12 and one burger is <b>$6</b>. Check Jay: 12 + 3(2) = 18 ✓',
          run: async (c) => {
            await show(c, finRow(`${icons('burger', 1)}<b>$6</b><span>$12 ÷ 2</span>`));
            await show(c, lineEl(P, `${T('2b+2=14')}<br>${T('2b=12\\ \\Rightarrow\\ b=6')}`));
            await show(c, finRow('<span class="u8l5-rfc">Check Jay: <b>12 + 3(2) = 18</b> ✓</span>'));
          } }
      ];
    }
    return [
      { cap: 'A refund is a <b>minus</b>: the swap slip says +1 taco, −2 juices, −$1. Put everything Sam did together: <b>add</b> the slips.',
        run: async (c) => {
          await pop(c, r2.s, 380); await anim(c, rule, [{ opacity: 0, transform: 'scaleX(0)' }, { opacity: 1, transform: 'none' }], 450);
          lineEl(P, `<span class="u8l5-muted">${T('t')} = one taco, ${T('j')} = one juice</span>`, 'u8l5-lnsm');
          await show(c, lineEl(P, `Order ${T(k1('3t+2j=13'))}`)); await show(c, lineEl(P, `Swap ${T(k2('t-2j=-1'))}`));
        } },
      { cap: '+2 juices and −2 juices: the juices he bought were handed back. Together they make <b>0</b>. The juices are <b>eliminated</b>!',
        run: (c) => cancelG(c, r1.g2.firstChild, r2.g2.firstChild) },
      { cap: 'Tacos: 3 + 1 = <b>4 tacos</b>. Money: $13 + (−$1) = <b>$12</b>. So 4 tacos cost $12.',
        run: async (c) => { await showRow(c, res); await show(c, lineEl(P, `add: ${T(kr('4t=12'))}`, 'u8l5-lnb')); } },
      { cap: 'One taco is $12 ÷ 4 = <b>$3</b>. Then 3 tacos cost $9, so 2 juices cost $4: one juice is <b>$2</b>. Answer <b>B</b>: add them.',
        run: async (c) => {
          await show(c, finRow(`${icons('taco', 1)}<b>$3</b><span>$12 ÷ 4</span>`)); await show(c, finRow(`${icons('juice', 1)}<b>$2</b><span>($13 − $9) ÷ 2</span>`));
          await show(c, lineEl(P, `${T(kr('t=3'))}, then ${T('9+2j=13\\Rightarrow j=2')}`));
        } },
      { cap: `Why not A? Subtracting gives ${T('(3t+2j)-(t-2j)=2t+4j')}: <b>nothing vanished</b>. Opposites cancel when you <b>add</b>.`,
        run: async (c) => {
          const b2 = h('div', 'u8l5-slip', `<div class="u8l5-sliph">Subtract instead?</div><div>${T('(3t+2j)-(t-2j)')}</div><div>${T('=2t+4j=14')}</div>`);
          P.appendChild(b2); await show(c, b2); await stampIn(c, stamp(b2, '✗', { ok: false, size: 'sm' }));
        } }
    ];
  }
};

/* =============================== blocks and balances (from the 10C twin) =============================== */
/** a block: v 'x' | 'y' | '' (a number), k its coefficient, src 1 | 2 | 'r' (Eq. 1, Eq. 2, combined) */
function blk(v, k, src) { const el = h('div', ''); el.v = v; el.k = k; el.src = src; return drawBlk(el); }
function drawBlk(el) {
  const n = Math.min(Math.abs(el.k), 12);
  el.className = `u8l5-blk u8l5-b${el.v || 'c'} u8l5-s${el.src}` + (el.k < 0 ? ' u8l5-neg' : '');
  if (el.v) {
    el.style.width = (24 + 11 * n) + 'px';
    el.innerHTML = `<div class="u8l5-cells">${'<div class="u8l5-cell"></div>'.repeat(n)}</div><div class="u8l5-bl">${T(term(el.k, el.v, true))}</div>`;
  } else { el.style.width = ''; el.innerHTML = `<div class="u8l5-bl">${T(texNum(el.k))}</div>`; }
  return el;
}
const blocksOf = (e, src) => [[e.a ? blk('x', e.a, src) : null, e.b ? blk('y', e.b, src) : null].filter(Boolean), e.c ? [blk('', e.c, src)] : []];

class Balance {
  constructor(stage, o) {
    const w = o.w, H = o.h, top = o.top ?? 40;
    this.stage = stage;
    const el = this.el = add(stage, box(h('div', 'u8l5-bal' + (o.cls ? ' ' + o.cls : '')), w, H), o.x, o.y);
    const svg = svgEl('svg', { width: w, height: H, viewBox: `0 0 ${w} ${H}`, class: 'u8l5-bsvg' }, el);
    const cx = this.cx = w / 2, ty = this.ty = H - 56, py = this.py = ty + 26;
    this.L = Math.round(w * 0.27); this.pw = Math.round(w * 0.45);
    svgEl('path', { d: `M${cx - 54} ${H - 3} H${cx + 54} L${cx + 11} ${py} H${cx - 11} Z`, class: 'u8l5-base' }, svg);
    this.rods = [svgEl('line', { class: 'u8l5-rod' }, svg), svgEl('line', { class: 'u8l5-rod' }, svg)];
    this.beam = svgEl('line', { class: 'u8l5-beam' }, svg);
    svgEl('circle', { cx, cy: py, r: 7, class: 'u8l5-piv' }, svg);
    this.lab = add(el, h('div', 'u8l5-balab', o.label || '')); if (o.labY != null) this.lab.style.top = o.labY + 'px';
    this.pans = [-1, 1].map((s) => {
      const p = add(el, box(h('div', 'u8l5-pan'), this.pw, ty + 10 - top), cx + s * this.L - this.pw / 2, top);
      p.cont = h('div', 'u8l5-cont'); p.append(p.cont, h('div', 'u8l5-tray')); return p;
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
    return place(add(this.stage, h('div', 'u8l5-badge', html)), r.x + r.w / 2, r.y - 4, 'n', 0);
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

/* =============================== explainer: two balances, combined =============================== */
const BAL = {
  idea: { e1: E(5, 2, 16), e2: E(5, -3, 1), op: 'sub', el: 'x', stop: true },
  ex1: { e1: E(3, 4, 23), e2: E(3, -2, 11), op: 'sub', el: 'x', back: 1 },
  ex2: { e1: E(2, 5, 23), e2: E(6, -5, 9), op: 'add', el: 'y', back: 1 }
};
const balance = {
  title: 'Two balances, combined pan to pan',
  height: 508,
  minW: 940, // drawn this wide and scaled to fit beside the sidebar
  choices: [{ v: 'idea', label: 'The idea (subtract)' }, { sep: 'Check' }, { v: 'ex1', label: 'Example 1 (subtract)' }, { v: 'ex2', label: 'Example 2 (add)' }],
  intro: (k) => `${TAG1} ${T(k1(eqT(BAL[k].e1)))} and ${TAG2} ${T(k2(eqT(BAL[k].e2)))}, each a level balance. Press <b>Next</b>.`,
  make(stage, k, ex) {
    const d = BAL[k], W = ex.W, { e1, e2 } = d;
    const e2u = d.op === 'sub' ? scaleE(e2, -1) : e2;
    const sum = E(e1.a + e2u.a, e1.b + e2u.b, e1.c + e2u.c), kv = d.el === 'y' ? 'x' : 'y', K = kv === 'x' ? sum.a : sum.b, val = sum.c / K;
    const eb = d.back === 2 ? e2 : e1, oth = kv === 'x' ? (eb.c - eb.a * val) / eb.b : (eb.c - eb.b * val) / eb.a;
    const sol = kv === 'x' ? [val, oth] : [oth, val];
    const subT = kv === 'x' ? `${known(eb.a, val, true)}${term(eb.b, 'y', false)}=${texNum(eb.c)}\\ \\Rightarrow\\ y=${texNum(oth)}`
      : `${term(eb.a, 'x', true)}${known(eb.b, val, false)}=${texNum(eb.c)}\\ \\Rightarrow\\ x=${texNum(oth)}`;
    const sumT = `${k1(`(${lhs(e1)})`)}+${k2(`(${lhs(e2u)})`)}=${k1(texNum(e1.c))}${k2(plusC(e2u.c))}`;
    const oneT = `${term(K, kv, true)}=${texNum(sum.c)}`;
    const bw = Math.floor((W - 36) / 2);
    const b1 = new Balance(stage, { x: 12, y: 6, w: bw, h: 222, label: `${TAG1} ${T(k1(eqT(e1)))}` });
    const b2 = new Balance(stage, { x: W - 12 - bw, y: 6, w: bw, h: 222, label: `${TAG2} ${T(k2(eqT(e2)))}` });
    b1.fill(e1, 1); b2.fill(e2, 2);
    const bb = new Balance(stage, { x: 12, y: 238, w: 560, h: 252, top: 96, labY: 50, label: '<span class="u8l5-muted">one big balance</span>', cls: 'u8l5-big' });
    const P = panel(stage, 586, 242, W - 598, 260, 'On the board', 'u8l5-board');
    const steps = [];
    if (d.op === 'sub') {
      steps.push({ cap: `Subtracting Eq. 2 is the same as adding its <b>opposite</b>. Flip <b>every</b> block of Eq. 2, on both pans, the ${T(e2.c)} too. Still level.`,
        run: async (c) => {
          await negate(c, b2.all()); b2.label(`${tag(2, '−Eq. 2')} ${T(k2(eqT(e2u)))}`);
          await show(c, lineEl(P, `${tag(2, '−Eq. 2')} ${T(k2(eqT(e2u)))}`));
        } });
    }
    steps.push({ cap: `Put both balances on one big balance: <b>left pan to left pan, right pan to right pan</b>. Equal + equal: still level.`,
      run: async (c) => {
        await copyInto(c, stage, [[b1.items(0), bb.pans[0].cont], [b1.items(1), bb.pans[1].cont], [b2.items(0), bb.pans[0].cont], [b2.items(1), bb.pans[1].cont]]);
        bb.label(T(sumT)); await show(c, lineEl(P, T(sumT)));
      } });
    const ka = d.el === 'x' ? e1.a : e1.b, kb = d.el === 'x' ? e2u.a : e2u.b;
    steps.push({ cap: `${T(term(ka, d.el, true))} and ${T(term(kb, d.el, true))} are <b>opposites</b>: together they make ${T('0')}. ${T(d.el)} is <b>eliminated</b>!`,
      run: async (c) => { const pr = bb.items(0).filter((e) => e.v === d.el); await cancelPair(c, stage, pr[0], pr[1]); } });
    steps.push({ cap: `Collect what is left: ${T(`${term(kv === 'x' ? e1.a : e1.b, kv, true)}${term(kv === 'x' ? e2u.a : e2u.b, kv, false)}=${term(K, kv, true)}`)} and ${T(`${texNum(e1.c)}${plusC(e2u.c)}=${texNum(sum.c)}`)}. One equation, <b>one variable</b>: ${T(kr(oneT))}.`,
      run: async (c) => {
        const vs = bb.items(0).filter((e) => e.v === kv), ns = bb.items(1);
        await Promise.all([merge(c, stage, vs[0], vs.slice(1), K), merge(c, stage, ns[0], ns.slice(1), sum.c)]);
        bb.label(T(kr(oneT))); await show(c, lineEl(P, T(kr(oneT))));
      } });
    steps.push({ cap: `Divide <b>both</b> pans by ${T(K)}: ${T(kr(`${kv}=${texNum(val)}`))}.${d.stop ? ` The ${T(d.el)}-terms cancelled because ${T(`${term(e1.a, 'x', true)}-${term(e2.a, 'x', true)}=0`)}.` : ''}`,
      run: async (c) => {
        const bs = [bb.badge(0, '÷' + pm(K)), bb.badge(1, '÷' + pm(K))]; await Promise.all(bs.map((b) => pop(c, b)));
        const [L1] = bb.items(0), [R1] = bb.items(1);
        await flip(c, stage, () => bb.all(), () => { L1.k = 1; drawBlk(L1); R1.k = val; drawBlk(R1); });
        await Promise.all([pulse(c, L1, 1.2), pulse(c, R1, 1.2)]); bs.forEach((b) => b.remove());
        bb.label(T(kr(`${kv}=${texNum(val)}`))); await show(c, lineEl(P, T(kr(`${kv}=${texNum(val)}`)), 'u8l5-lnb'));
      } });
    if (!d.stop) {
      steps.push({ cap: `Put ${T(`${kv}=${texNum(val)}`)} back into Eq. ${d.back}: ${T(subT)}. The solution is ${T(ks(pairTex(...sol)))}.`,
        run: async (c) => { await show(c, lineEl(P, `${tag(d.back, 'Eq. ' + d.back)} ${T(subT)}`)); const s = lineEl(P, `Solution ${solPill(...sol)}`, 'u8l5-lnsol'); await pop(c, s); } });
    }
    return steps;
  }
};

/* =============================== explainer: subtracting in columns =============================== */
const SG = {
  ex1: { label: 'Example 1', vars: ['x', 'y'], r1: [3, 4, 23], r2: [3, -2, 11], n1: 'Eq. 1', n2: 'Eq. 2',
    slip: { cap: `Watch out: subtract the constants too, ${T('23-11=12')}. Adding them gives ${T('6y=34')}, and ${T('y')} is not even a whole number.`, l1: '23-11=12', l2: '\\text{not } 23+11=34' } },
  ex3: { label: 'Example 3: Eq. 2 − Eq. 1', vars: ['x', 'y'], r1: [7, 3, 36], r2: [4, 3, 18], n1: 'Eq. 2', n2: 'Eq. 1', swap: true },
  ex5: { label: 'Example 5: negatives', vars: ['x', 'y'], r1: [-2, 5, -34], r2: [-2, -3, -2], n1: 'Eq. 1', n2: 'Eq. 2',
    slip: { cap: `Watch out: subtracting ${T('-2')} <b>adds</b> 2. ${T('-34-(-2)=-32')}, not ${T('-36')}; with ${T('-36')}, ${T('y')} is not a whole number.`, l1: '-34-(-2)=-32', l2: '\\text{not } -34-2=-36' } },
  warm: { label: 'Warm-up: Jay − Mia', vars: ['b', 'd'], r1: [2, 3, 18], r2: [2, 1, 14], n1: 'Jay', n2: 'Mia', w1: 'Jay’s receipt', w2: 'Mia’s receipt' }
};
const columns = {
  title: 'Subtract in columns: every sign flips',
  height: 430,
  minW: 966, // drawn this wide and scaled to fit beside the sidebar
  choices: [{ sep: 'Check' }, ...Object.keys(SG).map((k) => ({ v: k, label: SG[k].label }))],
  value: 'ex1',
  intro: (k) => `${SG[k].w1 || SG[k].n1} minus ${SG[k].w2 || SG[k].n2}. Line the equations up in columns. Press <b>Next</b>.`,
  make(stage, k, ex) {
    const d = SG[k], vs = d.vars, n = vs.length, W = ex.W;
    const C1 = d.swap ? A2 : B1, C2 = d.swap ? B1 : A2, t1 = d.swap ? 2 : 1, t2 = d.swap ? 1 : 2;
    const r1 = d.r1, r2 = d.r2, rn = r2.map((v) => -v), rs = r1.map((v, i) => v + rn[i]);
    const elimI = vs.findIndex((_, i) => r1[i] && r2[i] && rs[i] === 0);
    const leftK = vs.map((v, i) => [rs[i], v]).filter(([q], i) => q && i !== elimI);
    const resT = (leftK.map(([q, v], i) => term(q, v, i === 0)).join('') || '0') + '=' + texNum(rs[n]);
    const colW = 118, x0 = 168, xs = vs.map((_, i) => x0 + 34 + i * colW), xe = x0 + 34 + n * colW, xc = xe + 40;
    const cell = (x, y, w, html, cls = '') => add(stage, box(h('div', 'u8l5-sc ' + cls, html), w, 52), x, y);
    const rowT = (r, i, col, first) => (r[i] ? T(tc(col, term(r[i], vs[i], first))) : '');
    const firstI = (r) => r.findIndex((v) => v);
    const name = (y, html) => add(stage, box(h('div', 'u8l5-sname', html), 156, 52), 6, y);
    const Y = [20, 86, 170, 262];
    name(Y[0], tag(t1, d.n1)); name(Y[1], tag(t2, d.n2));
    vs.forEach((_, i) => cell(xs[i], Y[0], colW, rowT(r1, i, C1, i === firstI(r1))));
    cell(xe, Y[0], 40, T('=')); cell(xc, Y[0], 110, T(tc(C1, texNum(r1[n]))));
    const minus = cell(x0, Y[1], 34, T('-('), 'u8l5-sbr'), close = cell(xc + 110, Y[1], 30, T(')'), 'u8l5-sbr');
    minus.style.opacity = 0; close.style.opacity = 0;
    const r2c = vs.map((_, i) => cell(xs[i], Y[1], colW, rowT(r2, i, C2, i === firstI(r2))));
    cell(xe, Y[1], 40, T('=')); const r2k = cell(xc, Y[1], 110, T(tc(C2, texNum(r2[n]))));
    const fl = name(Y[2], `<span class="u8l5-flipt">flip every sign</span>`); fl.style.opacity = 0;
    const flc = vs.map((_, i) => cell(xs[i], Y[2], colW, r2[i] ? T(tc(C2, (rn[i] > 0 ? '+' : '') + term(rn[i], vs[i], true))) : '', 'u8l5-flipc'));
    const fle = cell(xe, Y[2], 40, T('=')), flk = cell(xc, Y[2], 110, T(tc(C2, texNum(rn[n]))), 'u8l5-flipc');
    [...flc, fle, flk].forEach((e) => (e.style.opacity = 0));
    const rule = add(stage, box(h('div', 'u8l5-rule'), xc + 110 - x0, 4), x0, Y[3] - 12); rule.style.opacity = 0;
    const sumc = vs.map((_, i) => cell(xs[i], Y[3], colW, (r1[i] || r2[i]) ? T(i === elimI ? '0' : kr(term(rs[i], vs[i], i === firstI(rs)))) : '', i === elimI ? 'u8l5-sz' : ''));
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
          for (let i = 0; i < n; i++) { if (!r2[i]) continue; r2c[i].classList.add('u8l5-hl'); await pop(c, flc[i], 360); r2c[i].classList.remove('u8l5-hl'); }
          await appear(c, fle); r2k.classList.add('u8l5-hl'); await pop(c, flk, 360); r2k.classList.remove('u8l5-hl');
        } },
      { cap: `Now <b>add</b> down each column. ${elimI >= 0 ? `${T(term(r1[elimI], vs[elimI], true) + term(rn[elimI], vs[elimI], false) + '=0')}: ${T(vs[elimI])} is eliminated.` : ''}`,
        run: async (c) => {
          await anim(c, rule, [{ opacity: 0, transform: 'scaleX(0)' }, { opacity: 1, transform: 'none' }], 400);
          for (let i = 0; i < n; i++) { if (!(r1[i] || r2[i])) continue; await pop(c, sumc[i], 380); }
          await appear(c, sume); await pop(c, sumk, 380);
          if (elimI >= 0) { sumc[elimI].classList.add('u8l5-gone'); }
          await show(c, lineEl(P, T(kr(resT)), 'u8l5-lnb'));
        } }
    ];
    if (val != null) {
      const v = leftK[0][1];
      steps.push({ cap: `One variable left: ${T(kr(resT))}, so ${T(kr(`${v}=${texNum(val)}`))}.${k === 'warm' ? ' One drink costs $2, with no burgers in sight.' : ''}`,
        run: (c) => show(c, lineEl(P, T(kr(`${v}=${texNum(val)}`)), 'u8l5-lnb')) });
    }
    if (d.slip) {
      steps.push({ cap: d.slip.cap,
        run: async (c) => {
          const box2 = h('div', 'u8l5-slip', `<div class="u8l5-sliph">Watch out</div><div>${T(d.slip.l1)}</div><div class="u8l5-bad">${T(d.slip.l2)}</div>`);
          P.appendChild(box2); await show(c, box2); const s = stamp(box2, '✗', { ok: false, size: 'sm' }); await stampIn(c, s);
        } });
    }
    return steps;
  }
};

/* =============================== explainer: back-substitute into either equation =============================== */
function backLines(e, kv, val) {
  const uv = kv === 'x' ? 'y' : 'x', cu = kv === 'x' ? e.b : e.a, ck = kv === 'x' ? e.a : e.b, kval = ck * val, rest = e.c - kval, sol = rest / cu;
  const sub = kv === 'x' ? `${known(ck, val, true)}${term(cu, 'y', false)}=${texNum(e.c)}` : `${term(cu, 'x', true)}${known(ck, val, false)}=${texNum(e.c)}`;
  const kT = (first) => (kval === 0 ? '' : (kval < 0 ? '-' : first ? '' : '+') + Math.abs(kval));
  const simp = kv === 'x' ? `${kT(true)}${term(cu, 'y', !kval)}=${texNum(e.c)}` : `${term(cu, 'x', true)}${kT(false)}=${texNum(e.c)}`;
  const iso = `${term(cu, uv, true)}=${texNum(rest)}`, fin = `${uv}=${texNum(sol)}`;
  return { uv, sub, simp, iso, fin, sol, lines: [...new Set([sub, simp, iso, fin])] };
}
const EI = {
  ex1: { label: `Example 1: ${T('y=2')}`, e1: E(3, 4, 23), e2: E(3, -2, 11), kv: 'y', val: 2 },
  ex3: { label: `Example 3: ${T('x=6')}`, e1: E(4, 3, 18), e2: E(7, 3, 36), kv: 'x', val: 6 },
  ex4: { label: `Example 4: ${T('y=5')}`, e1: E(4, 1, -7), e2: E(-4, 3, 27), kv: 'y', val: 5 }
};
const either = {
  title: 'Back-substitute into either equation',
  height: 440,
  minW: 860, // drawn this wide and scaled to fit beside the sidebar
  choices: [{ sep: 'Check' }, ...Object.keys(EI).map((k) => ({ v: k, label: EI[k].label }))],
  value: 'ex1',
  intro: (k) => `Elimination gave ${T(kr(`${EI[k].kv}=${EI[k].val}`))}. Now find the other variable. Press <b>Next</b>.`,
  make(stage, k, ex) {
    const d = EI[k], W = ex.W, L1 = backLines(d.e1, d.kv, d.val), L2 = backLines(d.e2, d.kv, d.val), uv = L1.uv;
    const sol = d.kv === 'x' ? [d.val, L1.sol] : [L1.sol, d.val];
    const top = add(stage, box(h('div', 'u8l5-know', `We know &nbsp;${T(kr(`${d.kv}=${d.val}`))}`), 300, 50), (W - 300) / 2, 6);
    const pw = Math.floor((W - 44) / 2);
    const P1 = panel(stage, 14, 68, pw, 300, '', 'u8l5-epan'), P2 = panel(stage, 30 + pw, 68, pw, 300, '', 'u8l5-epan');
    const h1 = lineEl(P1, `${TAG1} ${T(k1(eqT(d.e1)))}`, 'u8l5-lnbig'), h2 = lineEl(P2, `${TAG2} ${T(k2(eqT(d.e2)))}`, 'u8l5-lnbig');
    const solBox = add(stage, box(h('div', 'u8l5-esol', `Solution ${solPill(...sol)}`), 420, 60), (W - 420) / 2, 376); solBox.style.opacity = 0;
    const nIso = (L) => L.lines.indexOf(L.iso) + 1;
    return [
      { cap: `We know ${T(`${d.kv}=${d.val}`)}. You can put it into <b>either</b> original equation. Let’s try <b>both</b>.`,
        run: async (c) => {
          h1.innerHTML = `${TAG1} ${T(eqHL(d.e1, d.kv, B1))}`; h2.innerHTML = `${TAG2} ${T(eqHL(d.e2, d.kv, A2))}`;
          await Promise.all([pulse(c, h1, 1.06), pulse(c, h2, 1.06), pulse(c, top, 1.08)]);
        } },
      { cap: `Replace ${T(d.kv)} with ${T(`(${d.val})`)}: ${T(L1.sub)} and ${T(L2.sub)}.`,
        run: async (c) => { const a = lineEl(P1, T(L1.sub)), b = lineEl(P2, T(L2.sub)); await Promise.all([show(c, a), show(c, b)]); } },
      { cap: `Simplify and get the ${T(uv)}-term alone: ${T(L1.iso)} and ${T(L2.iso)}.`,
        run: async (c) => {
          const a = L1.lines.slice(1, nIso(L1)).map((t) => lineEl(P1, T(t))), b = L2.lines.slice(1, nIso(L2)).map((t) => lineEl(P2, T(t)));
          await Promise.all([...a, ...b].map((l) => show(c, l)));
        } },
      { cap: `Both give ${T(kr(L1.fin))}! Either equation works, so pick the one with the <b>friendlier</b> numbers.`,
        run: async (c) => {
          const a = L1.lines.slice(nIso(L1)).map((t) => lineEl(P1, T(kr(t)), 'u8l5-lnb')), b = L2.lines.slice(nIso(L2)).map((t) => lineEl(P2, T(kr(t)), 'u8l5-lnb'));
          await Promise.all([...a, ...b].map((l) => show(c, l)));
          await Promise.all([P1, P2].map((P) => stampIn(c, stamp(P, '✓', { ok: true, size: 'sm' }))));
        } },
      { cap: `The solution is ${T(ks(pairTex(...sol)))}. In your own work, use <b>one</b> equation to find it, then <b>check</b> the pair in <b>both</b>.`,
        run: (c) => pop(c, solBox) }
    ];
  }
};

/* =============================== explainer: zero pairs (adding opposites) =============================== */
const ZR = {
  idea: { label: `The idea: ${T('5y+(-5y)')}`, e1: E(0, 5, null), e2: E(0, -5, null), el: 'y', idea: true },
  ex2: { label: 'Example 2', e1: E(2, 5, 23), e2: E(6, -5, 9), el: 'y' },
  ex4: { label: 'Example 4', e1: E(4, 1, -7), e2: E(-4, 3, 27), el: 'x' }
};
const zero = {
  title: 'Adding opposites: zero pairs',
  height: 470,
  minW: 880, // drawn this wide and scaled to fit beside the sidebar
  choices: [{ v: 'idea', label: ZR.idea.label }, { sep: 'Check' }, { v: 'ex2', label: 'Example 2' }, { v: 'ex4', label: 'Example 4' }],
  intro: (k) => (k === 'idea' ? `${T('+5y')} on top, ${T('-5y')} underneath. Press <b>Next</b>.`
    : `${TAG1} ${T(k1(eqT(ZR[k].e1)))} and ${TAG2} ${T(k2(eqT(ZR[k].e2)))} as tiles. Press <b>Next</b>.`),
  make(stage, k, ex) {
    const d = ZR[k], { e1, e2 } = d, W = ex.W, TW = 34, TH = 60, ST = 42;
    const kv = d.el === 'x' ? 'y' : 'x';
    const co = (e, v) => (v === 'x' ? e.a : e.b);
    const mx = Math.max(Math.abs(e1.a), Math.abs(e2.a)), my = Math.max(Math.abs(e1.b), Math.abs(e2.b));
    const X0 = 140, Xx = X0, Xy = X0 + mx * ST + (mx ? 28 : 0), eqX = Xy + my * ST + 8, cX = eqX + 40;
    const Y1 = 26, Y2 = 116, Y3 = 216;
    add(stage, box(h('div', 'u8l5-zlab', d.idea ? '' : TAG1), 100, TH), 14, Y1);
    add(stage, box(h('div', 'u8l5-zlab', d.idea ? '' : TAG2), 100, TH), 14, Y2);
    const plus = add(stage, box(h('div', 'u8l5-zplus', '+'), 26, TH), 112, Y2); plus.style.opacity = 0;
    const tile = (v, k, x, y, src) => {
      const t = add(stage, box(h('div', `u8l5-tile u8l5-t${v} u8l5-ts${src}` + (k < 0 ? ' u8l5-tneg' : ''), T(k < 0 ? '-' + v : v)), TW, TH), x, y);
      t.v = v; t.sgn = Math.sign(k); return t;
    };
    const rowTiles = (e, y, src) => {
      const out = { x: [], y: [] };
      for (let i = 0; i < Math.abs(e.a); i++) out.x.push(tile('x', e.a, Xx + i * ST, y, src));
      for (let i = 0; i < Math.abs(e.b); i++) out.y.push(tile('y', e.b, Xy + i * ST, y, src));
      return out;
    };
    const t1 = rowTiles(e1, Y1, 1), t2 = rowTiles(e2, Y2, 2);
    if (!d.idea) {
      add(stage, box(h('div', 'u8l5-zc', T('=')), 36, TH), eqX, Y1); add(stage, box(h('div', 'u8l5-zc', T(k1(texNum(e1.c)))), 70, TH), cX, Y1);
      add(stage, box(h('div', 'u8l5-zc', T('=')), 36, TH), eqX, Y2); add(stage, box(h('div', 'u8l5-zc', T(k2(texNum(e2.c)))), 70, TH), cX, Y2);
    }
    const rw = (d.idea ? Xy + my * ST : cX + 80) - 104;
    const rule = add(stage, box(h('div', 'u8l5-rule'), rw, 4), 104, Y2 + TH + 18); rule.style.opacity = 0;
    const P = panel(stage, 14, 306, W - 28, 154, 'On the board', 'u8l5-zboard');
    // the pairs that cancel and the tiles that stay
    const pa = t1[d.el], pb = t2[d.el], np = Math.min(pa.length, pb.length);
    const keep = [...t1[kv], ...t2[kv]], K = co(e1, kv) + co(e2, kv), sumC = d.idea ? 0 : e1.c + e2.c, val = d.idea ? 0 : sumC / K;
    const resEq = add(stage, box(h('div', 'u8l5-zc', T('=')), 36, TH), X0 + Math.max(keep.length, 1) * ST + 8, Y3);
    const resC = add(stage, box(h('div', 'u8l5-zc', T(kr(texNum(sumC)))), 80, TH), X0 + Math.max(keep.length, 1) * ST + 48, Y3);
    resEq.style.opacity = resC.style.opacity = 0;
    const sumT = d.idea ? '5y+(-5y)=0' : `${k1(`(${lhs(e1)})`)}+${k2(`(${lhs(e2)})`)}=${k1(texNum(e1.c))}${k2(plusC(e2.c))}`;
    const oneT = `${term(K, kv, true)}=${texNum(sumC)}`;
    const loops = [], zeros = [];
    let oneL = null;
    const steps = [
      { cap: d.idea ? `Each tile is one ${T('y')}; a dashed red tile is a <b>negative</b> ${T('y')}. <b>Add</b> them: line up each ${T('+y')} above a ${T('-y')}.`
        : `Each tile is one ${T('x')} or one ${T('y')}; dashed red tiles are <b>negative</b>. <b>Add</b> the equations: each ${T('+' + d.el)} lines up above a ${T('-' + d.el)}.`,
        run: async (c) => {
          await pop(c, plus); await anim(c, rule, [{ opacity: 0, transform: 'scaleX(0)' }, { opacity: 1, transform: 'none' }], 450);
          await Promise.all([...pa.slice(0, np), ...pb.slice(0, np)].map((t) => pulse(c, t, 1.12)));
          if (!d.idea) await show(c, lineEl(P, T(sumT)));
        } },
      { cap: `${T(`${d.el}+(-${d.el})=0`)}: each pair is a <b>zero pair</b>. All ${np} pairs vanish, so ${T(d.el)} is <b>eliminated</b>!`,
        run: async (c) => {
          for (let i = 0; i < np; i++) {
            const lp = add(stage, box(h('div', 'u8l5-loop'), TW + 12, Y2 + TH - Y1 + 12), parseFloat(pa[i].style.left) - 6, Y1 - 6); loops.push(lp);
          }
          await Promise.all(loops.map((l, i) => pop(c, l, 300, { delay: i * 70 })));
          await Promise.all([...pa.slice(0, np), ...pb.slice(0, np), ...loops].map((t) => anim(c, t, [{ opacity: 1 }, { opacity: 0, transform: 'scale(.6)' }], 420)));
          for (let i = 0; i < np; i++) zeros.push(place(add(stage, h('div', 'u8l5-zz', T('0'))), parseFloat(pa[i].style.left) + TW / 2, (Y1 + Y2 + TH) / 2, 'c', 0));
          await Promise.all(zeros.map((z) => pop(c, z, 340)));
          if (d.idea) await show(c, lineEl(P, T(kr(sumT)), 'u8l5-lnb'));
        } }
    ];
    if (d.idea) {
      steps.push({ cap: `Subtracting would give ${T('5y-(-5y)=10y')}: nothing vanishes. Opposites cancel when you <b>add</b>.`,
        run: async (c) => {
          const b2 = h('div', 'u8l5-slip u8l5-slipw', `<div class="u8l5-sliph">Subtract instead?</div><div>${T('5y-(-5y)=5y+5y=10y')}</div>`);
          P.appendChild(b2); await show(c, b2); await stampIn(c, stamp(b2, '✗', { ok: false, size: 'sm' }));
        } });
      return steps;
    }
    const kc1 = co(e1, kv), kc2 = co(e2, kv);
    steps.push({ cap: `What is left: ${T(`${term(kc1, kv, true)}${term(kc2, kv, false)}=${term(K, kv, true)}`)}, worth ${T(`${texNum(e1.c)}${plusC(e2.c)}=${texNum(sumC)}`)}. So ${T(kr(oneT))}.`,
      run: async (c) => {
        await Promise.all(zeros.map((z) => anim(c, z, [{ opacity: 1 }, { opacity: 0.25 }], 300)));
        keep.forEach((t) => { const g = t.cloneNode(true); g.classList.add('u8l5-tghost'); stage.insertBefore(g, t); });
        await Promise.all(keep.map((t, i) => slide(c, t, X0 + i * ST, Y3, 650, i * 40)));
        await appear(c, resEq); await pop(c, resC);
        oneL = lineEl(P, T(kr(oneT)), 'u8l5-lnb'); await show(c, oneL);
      } });
    steps.push({ cap: `Share ${texNum(sumC)} equally among the ${K} tiles: ${texNum(sumC)} ÷ ${K} = ${texNum(val)}. Each ${T(kv)} is worth ${texNum(val)}, so ${T(kr(`${kv}=${texNum(val)}`))}.`,
      run: async (c) => {
        keep.forEach((t) => { t.innerHTML = T(texNum(val)); t.classList.add('u8l5-tval'); });
        await Promise.all(keep.map((t, i) => pulse(c, t, 1.15, 420 + i * 30)));
        oneL.innerHTML = T(kr(`${oneT}\\ \\Rightarrow\\ ${kv}=${texNum(val)}`)); await pulse(c, oneL, 1.04);
      } });
    const B = backLines(e1, kv, val), sol = kv === 'x' ? [val, B.sol] : [B.sol, val];
    steps.push({ cap: `Back-substitute into Eq. 1: ${T(B.sub)}, so ${T(B.fin)}. The solution is ${T(ks(pairTex(...sol)))}.`,
      run: async (c) => { await show(c, lineEl(P, `${TAG1} ${T(B.lines.join('\\ \\Rightarrow\\ '))} &nbsp; ${solPill(...sol)}`)); } });
    return steps;
  }
};

/* =============================== explainer: the graph view (from the 10C twin) =============================== */
const PC = {
  ex1: { label: 'Example 1: subtract', e1: E(3, 4, 23), e2: E(3, -2, 11), q: -1, win: { xmin: -1, xmax: 9, ymin: -3, ymax: 7 } },
  ex2: { label: 'Example 2: add', e1: E(2, 5, 23), e2: E(6, -5, 9), q: 1, win: { xmin: -1, xmax: 9, ymin: -2, ymax: 8 } },
  ex4: { label: 'Example 4: add', e1: E(4, 1, -7), e2: E(-4, 3, 27), q: 1, win: { xmin: -8, xmax: 2, ymin: -1, ymax: 9 } }
};
const lineOf = (G, e, o) => (e.b ? G.line({ m: -e.a / e.b, b: e.c / e.b }, o) : G.line({ x: e.c / e.a }, o));
const plain = (v) => pm((Math.round(v * 10) / 10).toFixed(1));
const graph = {
  title: 'Elimination on the graph',
  height: 476,
  minW: 820, // the side panel needs ~250 px for "Eq. 1 + k × Eq. 2"
  choices: [{ sep: 'Check' }, ...Object.keys(PC).map((k) => ({ v: k, label: PC[k].label }))],
  value: 'ex1',
  intro: (k) => `${TAG1} ${T(k1(eqT(PC[k].e1)))} and ${TAG2} ${T(k2(eqT(PC[k].e2)))}. Press <b>Next</b>.`,
  make(stage, k, ex) {
    const d = PC[k], { e1, e2, q } = d, W = ex.W;
    const S = solve2(e1, e2);
    const fin = E(e1.a + q * e2.a, e1.b + q * e2.b, e1.c + q * e2.c);
    const vert = Math.abs(fin.b) < 1e-9, finT = vert ? `${texNum(fin.a)}x=${texNum(fin.c)}` : `${texNum(fin.b)}y=${texNum(fin.c)}`;
    const resT = vert ? `x=${texNum(S[0])}` : `y=${texNum(S[1])}`;
    const G = new Graph(stage, Object.assign({ x: 10, y: 6, width: 464, height: 464, xlabels: 2, ylabels: 2, fontSize: 16 }, d.win));
    const P = panel(stage, 492, 10, W - 504, 456, '');
    lineEl(P, `${TAG1} ${T(k1(eqT(e1)))}`); lineEl(P, `${TAG2} ${T(k2(eqT(e2)))}`);
    const sgn = q > 0 ? '+' : '−', word = q > 0 ? 'add' : 'subtract';
    const ro = lineEl(P, '', 'u8l5-kro'); ro.style.opacity = 0;
    ro.innerHTML = `<div class="u8l5-rok">Eq. 1 ${sgn} <b class="u8l5-kv">k</b> × Eq. 2</div><div class="u8l5-rokv">k = <b class="u8l5-kval">0</b></div><div class="u8l5-roeq"></div>`;
    const kn = ro.querySelector('.u8l5-kval'), req = ro.querySelector('.u8l5-roeq');
    const st = { t: 0, on: false };
    const coef = () => E(e1.a + st.t * q * e2.a, e1.b + st.t * q * e2.b, e1.c + st.t * q * e2.c);
    const comb = G.curve(() => {
      if (!st.on) return { subs: [] };
      const cc = coef(), dv = [cc.b, -cc.a], L = Math.hypot(dv[0], dv[1]) || 1, u = [dv[0] / L, dv[1] / L];
      const TT = G._clipT(S, u, -Infinity, Infinity); if (!TT) return { subs: [] };
      return { subs: [[G.toPx(S[0] + u[0] * TT[0], S[1] + u[1] * TT[0]), G.toPx(S[0] + u[0] * TT[1], S[1] + u[1] * TT[1])]] };
    }, { color: RES, width: 5 }, 'bk-line', G.layers.data);
    const upd = () => {
      const cc = coef(); comb._bkDraw(); kn.textContent = (Math.round(st.t * 100) / 100).toFixed(2);
      req.textContent = `${plain(cc.a)}x ${cc.b < 0 ? '−' : '+'} ${plain(Math.abs(cc.b))}y = ${plain(cc.c)}`;
    };
    return [
      { cap: `Eq. 1 (blue) and Eq. 2 (amber) cross at ${T(ks(pairTex(...S)))}: the only point on <b>both</b> lines. That is the solution.`,
        run: async (c) => {
          await G.drawIn(lineOf(G, e1, { color: B1, width: 4 }), 600, c); await G.drawIn(lineOf(G, e2, { color: A2, width: 4 }), 600, c);
          await pop(c, G.point(S[0], S[1], { color: SOL, r: 8, label: T(pairTex(...S)), pos: 'ne', cls: 'bk-ptlab' }));
        } },
      { cap: `Mix the equations: Eq. 1 ${sgn} ${T('k')} × Eq. 2, with ${T('k')} growing from 0 to 1. The green line always passes through the crossing. Watch it <b>turn</b>.`,
        run: async (c) => {
          st.on = true; st.t = 0; await show(c, ro); upd();
          await tween(c, 2600, (t) => { st.t = t; upd(); });
        } },
      { cap: `At ${T('k=1')} we ${word} the equations: the ${T(vert ? 'y' : 'x')}-terms cancel, ${T(kr(finT))}. A <b>${vert ? 'straight up and down' : 'flat'}</b> line through the crossing.`,
        run: async (c) => {
          st.t = 1; upd(); req.innerHTML = T(kr(eqT(fin)));
          const lab = vert ? G.label(S[0], d.win.ymax - 0.6, T(kr(resT)), { pos: 'e', cls: 'bk-pill', color: RES }) : G.label(d.win.xmin + 1.4, S[1], T(kr(resT)), { pos: 'n', cls: 'bk-pill', color: RES });
          await pop(c, lab);
        } },
      { cap: `So ${T(kr(resT))} comes straight from the crossing. The other coordinate comes from either original line: ${T(ks(pairTex(...S)))}.`,
        run: async (c) => {
          await G.drawIn(G.segment(S, vert ? [S[0], 0] : [0, S[1]], { color: SOL, width: 2.5, dash: true }), 500, c);
          const s = lineEl(P, `Solution ${solPill(...S)}`, 'u8l5-lnsol'); await pop(c, s);
        } }
    ];
  }
};

/* =============================== explainer: add or subtract? =============================== */
const DC = {
  ex3: { label: 'Example 3', e1: E(4, 3, 18), e2: E(7, 3, 36), v: 'y', rev: true },
  ex4: { label: 'Example 4', e1: E(4, 1, -7), e2: E(-4, 3, 27), v: 'x' },
  ex5: { label: 'Example 5', e1: E(-2, 5, -34), e2: E(-2, -3, -2), v: 'x' },
  none: { label: 'Nothing matches?', e1: E(1, 3, 10), e2: E(2, 1, 5), v: null }
};
const decide = {
  title: 'Add or subtract?',
  height: 470,
  minW: 940, // drawn this wide and scaled to fit beside the sidebar
  choices: [{ sep: 'Check' }, ...Object.keys(DC).map((k) => ({ v: k, label: DC[k].label }))],
  value: 'ex3',
  intro: (k) => `${TAG1} ${T(k1(eqT(DC[k].e1)))} and ${TAG2} ${T(k2(eqT(DC[k].e2)))}. Ask the questions from the top. Press <b>Next</b>.`,
  make(stage, k, ex) {
    const d = DC[k], W = ex.W, { e1, e2 } = d;
    const F = new Flowchart(stage, { x: 6, y: 4, width: 560, height: 462,
      nodes: {
        start: { x: 270, y: 38, w: 400, h: 62, html: '<b>Pick a variable.</b>Look at its two coefficients.', cls: 'bk-round' },
        q1: { x: 200, y: 156, w: 320, h: 66, html: '<b>Same number?</b>(ignore the signs for now)' },
        no: { x: 470, y: 278, w: 172, h: 84, html: '<b>Not yet</b>multiply first (Lesson 6)', cls: 'bk-dashed', color: 'gray' },
        q2: { x: 200, y: 278, w: 260, h: 62, html: '<b>Same sign?</b>' },
        sub: { x: 96, y: 412, w: 180, h: 62, html: '<b>SUBTRACT</b>', color: 'blue' },
        add: { x: 316, y: 412, w: 180, h: 62, html: '<b>ADD</b>', color: 'green' }
      },
      edges: [{ from: 'start', to: 'q1' }, { from: 'q1', to: 'q2', label: 'yes' }, { from: 'q1', to: 'no', label: 'no', route: 'hv' },
        { from: 'q2', to: 'sub', label: 'yes', route: 'vhv' }, { from: 'q2', to: 'add', label: 'no', route: 'vhv' }] });
    const P = panel(stage, 584, 8, W - 594, 456, '');
    const l1 = lineEl(P, `${TAG1} ${T(k1(eqT(e1)))}`, 'u8l5-lnbig'), l2 = lineEl(P, `${TAG2} ${T(k2(eqT(e2)))}`, 'u8l5-lnbig');
    if (!d.v) {
      return [
        { cap: `Look at the ${T('x')}-terms: ${T('x')} and ${T('2x')}. Then the ${T('y')}-terms: ${T('3y')} and ${T('y')}.`,
          run: async (c) => { await F.visit(c, 'start'); l1.innerHTML = `${TAG1} ${T(eqHL(e1, 'x', B1))}`; l2.innerHTML = `${TAG2} ${T(eqHL(e2, 'x', A2))}`; await Promise.all([pulse(c, l1, 1.05), pulse(c, l2, 1.05)]); } },
        { cap: `Same number? ${T('1')} and ${T('2')}: no. ${T('3')} and ${T('1')}: no. Adding or subtracting now leaves <b>both</b> variables.`,
          run: async (c) => { await F.go(c, 'start', 'q1'); await F.visit(c, 'q1'); await F.go(c, 'q1', 'no'); await F.visit(c, 'no'); await show(c, lineEl(P, `add: ${T('3x+4y=15')}<br>subtract: ${T('-x+2y=5')}`, 'u8l5-lnsm')); } },
        { cap: `Nothing matches <b>yet</b>. Next lesson: multiply a whole equation first to make a pair match. (Doubling Eq. 1 gives ${T('2x')}.)`,
          run: (c) => show(c, lineEl(P, `<span class="u8l5-muted">Lesson 6:</span> ${TAG1} × 2: ${T(k1('2x+6y=20'))}`)) }
      ];
    }
    const v = d.v, a = v === 'x' ? e1.a : e1.b, b = v === 'x' ? e2.a : e2.b, same = Math.sign(a) === Math.sign(b);
    const [f, s] = d.rev ? [e2, e1] : [e1, e2];
    const res = same ? E(f.a - s.a, f.b - s.b, f.c - s.c) : E(f.a + s.a, f.b + s.b, f.c + s.c);
    const kv = v === 'x' ? 'y' : 'x', K = kv === 'x' ? res.a : res.b, resT = `${term(K, kv, true)}=${texNum(res.c)}`;
    const fT = (e) => tc(e === e1 ? B1 : A2, `(${lhs(e)})`), cT = (e) => tc(e === e1 ? B1 : A2, texNum(e.c));
    const combT = same ? `${fT(f)}-${fT(s)}=${cT(f)}-${s.c < 0 ? `(${cT(s)})` : cT(s)}` : `${fT(f)}+${fT(s)}=${cT(f)}+${s.c < 0 ? `(${cT(s)})` : cT(s)}`;
    const sg = (q) => (q < 0 ? '−' : '+'), signs = `${sg(a)} and ${sg(b)}`;
    const neg2 = a < 0 && b < 0;
    return [
      { cap: `Look at the ${T(v)}-terms: ${T(term(a, v, true).replace(/^(?=\d)/, '+'))} and ${T(term(b, v, true).replace(/^(?=\d)/, '+'))}.`,
        run: async (c) => {
          await F.visit(c, 'start'); l1.innerHTML = `${TAG1} ${T(eqHL(e1, v, B1))}`; l2.innerHTML = `${TAG2} ${T(eqHL(e2, v, A2))}`;
          await Promise.all([pulse(c, l1, 1.05), pulse(c, l2, 1.05)]);
        } },
      { cap: `Same number? ${T(Math.abs(a))} and ${T(Math.abs(b))}: <b>yes</b>.`,
        run: async (c) => { await F.go(c, 'start', 'q1'); await F.visit(c, 'q1'); await F.go(c, 'q1', 'q2'); await F.visit(c, 'q2'); } },
      { cap: same ? `Same sign? ${signs}: <b>yes</b>${neg2 ? ' (two negatives are the <b>same</b> sign)' : ''}. Same sign → <b>subtract</b>.`
        : `Same sign? ${signs}: <b>no</b>, they are opposites. Opposite signs → <b>add</b>.`,
        run: async (c) => {
          await F.go(c, 'q2', same ? 'sub' : 'add'); await F.visit(c, same ? 'sub' : 'add');
          await show(c, lineEl(P, `<b>${same ? 'Subtract' : 'Add'}</b>${d.rev ? ' (Eq. 2 − Eq. 1 keeps it positive)' : ''}`, 'u8l5-lnsm'));
        } },
      { cap: `${same ? 'Subtract' : 'Add'}: ${T(combT)}, so ${T(kr(resT))}. The ${T(v)}-terms are gone!`,
        run: async (c) => { await show(c, lineEl(P, T(combT), 'u8l5-lnsm')); await show(c, lineEl(P, T(kr(resT)), 'u8l5-lnb')); } }
    ];
  }
};

/* =============================== explainer: the whole solution, line by line =============================== */
const WK = {
  ex1: { label: 'Example 1', sol: [5, 2], checks: [['Eq. 1', '3(5)+4(2)=15+8=23'], ['Eq. 2', '3(5)-2(2)=15-4=11']], steps: [
    { s: 0, cap: `Decide: the ${T('x')}-coefficients are ${T('3')} and ${T('3')}, same sign. <b>Subtract</b>.`, lines: [[TAG1, k1('3x+4y=23')], [TAG2, k2('3x-2y=11')]] },
    { s: 1, cap: `Subtract: the ${T('-2y')} becomes ${T('+2y')}, and ${T('23-11=12')}.`, lines: [`${k1('(3x+4y)')}-${k2('(3x-2y)')}=${k1('23')}-${k2('11')}`, kr('6y=12')] },
    { s: 2, cap: 'Solve: divide both sides by 6.', lines: [kr('y=2')] },
    { s: 3, cap: `Back-substitute ${T('y=2')} into Eq. 1.`, lines: ['3x+4(2)=23\\ \\Rightarrow\\ 3x=15\\ \\Rightarrow\\ x=5'] }] },
  ex2: { label: 'Example 2', sol: [4, 3], checks: [['Eq. 1', '2(4)+5(3)=8+15=23'], ['Eq. 2', '6(4)-5(3)=24-15=9']], steps: [
    { s: 0, cap: `Decide: ${T('+5y')} and ${T('-5y')} are opposites. <b>Add</b>.`, lines: [[TAG1, k1('2x+5y=23')], [TAG2, k2('6x-5y=9')]] },
    { s: 1, cap: 'Add: left sides together, right sides together.', lines: [`${k1('(2x+5y)')}+${k2('(6x-5y)')}=${k1('23')}+${k2('9')}`, kr('8x=32')] },
    { s: 2, cap: 'Solve: divide both sides by 8.', lines: [kr('x=4')] },
    { s: 3, cap: `Back-substitute ${T('x=4')} into Eq. 1.`, lines: ['2(4)+5y=23\\ \\Rightarrow\\ 5y=15\\ \\Rightarrow\\ y=3'] }] },
  ex3: { label: 'Example 3', sol: [6, -2], checks: [['Eq. 1', '4(6)+3(-2)=24-6=18'], ['Eq. 2', '7(6)+3(-2)=42-6=36']], steps: [
    { s: 0, cap: `Decide: ${T('+3y')} and ${T('+3y')} match. <b>Subtract</b> (Eq. 2 − Eq. 1 keeps it positive).`, lines: [[TAG1, k1('4x+3y=18')], [TAG2, k2('7x+3y=36')]] },
    { s: 1, cap: `Subtract: ${T('7x-4x=3x')} and ${T('36-18=18')}.`, lines: [`${k2('(7x+3y)')}-${k1('(4x+3y)')}=${k2('36')}-${k1('18')}`, kr('3x=18')] },
    { s: 2, cap: 'Solve: divide both sides by 3.', lines: [kr('x=6')] },
    { s: 3, cap: `Back-substitute ${T('x=6')} into Eq. 1.`, lines: ['4(6)+3y=18\\ \\Rightarrow\\ 3y=-6\\ \\Rightarrow\\ y=-2'] }] },
  ex4: { label: 'Example 4', sol: [-3, 5], checks: [['Eq. 1', '4(-3)+5=-12+5=-7'], ['Eq. 2', '-4(-3)+3(5)=12+15=27']], steps: [
    { s: 0, cap: `Decide: ${T('+4x')} and ${T('-4x')} are opposites. <b>Add</b>.`, lines: [[TAG1, k1('4x+y=-7')], [TAG2, k2('-4x+3y=27')]] },
    { s: 1, cap: `Add: ${T('y+3y=4y')} and ${T('-7+27=20')}.`, lines: [`${k1('(4x+y)')}+${k2('(-4x+3y)')}=${k1('-7')}+${k2('27')}`, kr('4y=20')] },
    { s: 2, cap: 'Solve: divide both sides by 4.', lines: [kr('y=5')] },
    { s: 3, cap: `Back-substitute ${T('y=5')} into Eq. 1.`, lines: ['4x+5=-7\\ \\Rightarrow\\ 4x=-12\\ \\Rightarrow\\ x=-3'] }] },
  ex5: { label: 'Example 5', sol: [7, -4], checks: [['Eq. 1', '-2(7)+5(-4)=-14-20=-34'], ['Eq. 2', '-2(7)-3(-4)=-14+12=-2']], steps: [
    { s: 0, cap: `Decide: ${T('-2x')} and ${T('-2x')}, both negative: the <b>same</b> sign. <b>Subtract</b>.`, lines: [[TAG1, k1('-2x+5y=-34')], [TAG2, k2('-2x-3y=-2')]] },
    { s: 1, cap: `Subtract: every sign of Eq. 2 flips, so ${T('5y+3y=8y')} and ${T('-34+2=-32')}.`, lines: [`${k1('(-2x+5y)')}-${k2('(-2x-3y)')}=${k1('-34')}-${k2('(-2)')}`, kr('8y=-32')] },
    { s: 2, cap: 'Solve: divide both sides by 8.', lines: [kr('y=-4')] },
    { s: 3, cap: `Back-substitute ${T('y=-4')} into Eq. 1.`, lines: ['-2x+5(-4)=-34\\ \\Rightarrow\\ -2x=-14\\ \\Rightarrow\\ x=7'] }] }
};
const STEPN = ['Decide: add or subtract?', 'Eliminate', 'Solve', 'Back-substitute', 'Check in both'];
const walk = {
  title: 'Decide, eliminate, solve, back-substitute, check',
  height: 520,
  minW: 900, // drawn this wide and scaled to fit beside the sidebar
  choices: [{ sep: 'Check' }, ...Object.keys(WK).map((k) => ({ v: k, label: WK[k].label }))],
  value: 'ex1',
  intro: (k) => `${WK[k].label}, one step at a time. Press <b>Next</b>.`,
  make(stage, k, ex) {
    const d = WK[k], W = ex.W;
    const trk = add(stage, box(h('div', 'u8l5-trk'), 214, 380), 12, 12);
    const tb = STEPN.map((s) => { const b = h('div', 'u8l5-trs', s); trk.appendChild(b); return b; });
    const solBox = add(stage, box(h('div', 'u8l5-solbox', `<div class="u8l5-ph">Solution</div>${solPill(...d.sol)}`), 214, 100), 12, 408); solBox.style.opacity = 0;
    const lines = add(stage, box(h('div', 'u8l5-wl'), W - 252, 360), 240, 12);
    const chk = add(stage, box(h('div', 'u8l5-chks'), W - 252, 122), 240, 386);
    const cks = d.checks.map(([lab, t], i) => { const q = h('div', 'u8l5-chk', `<div class="u8l5-chkh">${tag(i + 1, 'Check in ' + lab)}</div><div>${T(t + '\\ ' + kr('\\checkmark'))}</div>`); q.style.opacity = 0; chk.appendChild(q); return q; });
    const on = (i) => tb.forEach((b, j) => { b.classList.toggle('on', j === i); if (j < i) b.classList.add('done'); });
    const steps = d.steps.map((st) => ({ cap: st.cap,
      run: async (c) => {
        on(st.s);
        for (const L of st.lines) {
          const html = Array.isArray(L) ? `<span class="u8l5-wlab">${L[0]}</span>${T(L[1])}` : T(L);
          const l = h('div', 'u8l5-wline u8l5-ws' + st.s, html); lines.appendChild(l); await show(c, l);
        }
      } }));
    steps.push({ cap: `Check in <b>both</b> original equations. The solution is ${T(ks(pairTex(...d.sol)))}.`,
      run: async (c) => { on(4); for (const q of cks) await show(c, q); await pop(c, solBox); } });
    return steps;
  }
};

mountWarm();
export const explainers = mountExplainers({ receipts, balance, columns, either, zero, graph, decide, walk });

/* ============ Stand Up Break! — elimination when the coefficients already match (lessons/js/standup.js) ============
 * Systems are built from an integer solution; the key is worked from the equations: decide (same sign → subtract,
 * opposite → add), eliminate, solve, back-substitute into the simpler original equation.
 *   BEG  subtract: a variable has the same positive coefficient in both equations
 *   PRG  add: a variable has opposite coefficients
 *   MAS  decide: either kind, with negative coefficients and constants (like Example 5) */
{
  const BL = COLORS.blue, AM = COLORS.amber;
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  const tm = (k, v, first) => (k === 0 ? '' : (k < 0 ? '-' : first ? '' : '+') + (Math.abs(k) === 1 && v ? '' : Math.abs(k)) + v);
  const lhsS = (e) => tm(e.a, 'x', true) + tm(e.b, 'y', !e.a);
  const eqS = (e) => lhsS(e) + '=' + e.c;
  const half = (s, col) => { const i = s.indexOf('='), l = s.slice(0, i).replace(/^-/, '{-}'); return `\\textcolor{${col}}{${l}}&\\textcolor{${col}}{${s.slice(i)}}`; };
  const sysE = (s1, s2) => `\\begin{aligned}{\\small\\text{Eq. 1}}\\quad ${half(s1, BL)}\\\\{\\small\\text{Eq. 2}}\\quad ${half(s2, AM)}\\end{aligned}`;
  const par = (v) => (v < 0 ? `(${v})` : String(v));
  const kn = (k, v, first) => (k === 1 ? (first ? '' : '+') + par(v) : k === -1 ? `-${par(v)}` : (k < 0 ? '-' : first ? '' : '+') + Math.abs(k) + `(${v})`);
  const mk = (a1, b1, a2, b2, x0, y0) => [{ a: a1, b: b1, c: a1 * x0 + b1 * y0 }, { a: a2, b: b2, c: a2 * x0 + b2 * y0 }];
  const ok = (e1, e2) => e1.a * e2.b !== e1.b * e2.a && gcd(gcd(e1.a, e1.b), e1.c) === 1 && gcd(gcd(e2.a, e2.b), e2.c) === 1;
  /** e1, e2 with variable v matching or opposite: the worked answer */
  function work(e1, e2, v, x0, y0) {
    const c1 = v === 'x' ? e1.a : e1.b, c2 = v === 'x' ? e2.a : e2.b, u = v === 'x' ? 'y' : 'x', same = c1 === c2;
    const sg = same ? -1 : 1;
    let r = { a: e1.a + sg * e2.a, b: e1.b + sg * e2.b, c: e1.c + sg * e2.c };
    let f = e1, g = e2;
    if (same && (u === 'x' ? r.a : r.b) < 0) { r = { a: -r.a, b: -r.b, c: -r.c }; f = e2; g = e1; }   // bigger minus smaller keeps it positive
    const K = u === 'x' ? r.a : r.b, u0 = r.c / K;
    const dec = `${tm(c1, v, true)},\\ ${tm(c2, v, true)}:\\ \\text{${same ? 'same sign} \\Rightarrow \\text{subtract' : 'opposite signs} \\Rightarrow \\text{add'}}`;
    const comb = `(${lhsS(f)})${same ? '-' : '+'}(${lhsS(g)})=${f.c}${same ? '-' : '+'}${par(g.c)}`;
    const one = `${tm(K, u, true)}=${r.c}` + (K === 1 ? '' : `\\ \\Rightarrow\\ ${u}=${u0}`);
    const size = (e) => Math.abs(e.a) + Math.abs(e.b) + Math.abs(e.c) / 10;
    const e = size(e1) <= size(e2) ? e1 : e2, cu = u === 'x' ? e.a : e.b, cv = v === 'x' ? e.a : e.b, rest = e.c - cu * u0, v0 = rest / cv;
    const into = u === 'x' ? kn(cu, u0, true) + tm(cv, v, false) : tm(cv, v, true) + kn(cu, u0, false);
    const back = `${into}=${e.c}\\ \\Rightarrow\\ ${tm(cv, v, true)}=${rest}` + (cv === 1 ? '' : `\\ \\Rightarrow\\ ${v}=${v0}`);
    return [dec, comb, one, back, `\\text{Solution: } (${x0},\\ ${y0})`];
  }
  const nz = (r, lo, hi) => r.int(lo, hi) * r.sign();
  function gen(r, kind) {
    for (;;) {
      const x0 = r.int(-5, 8), y0 = r.int(-5, 8), v = r.pick(['x', 'y']);
      if (!x0 || !y0 || x0 === y0) continue;
      const p = r.int(kind === 'BEG' ? 1 : 2, 6);
      let q1, q2, p1, p2;
      if (kind === 'BEG') { q1 = r.int(1, 7) * (r.chance(0.3) ? -1 : 1); q2 = nz(r, 1, 7); p1 = p; p2 = p; }
      else if (kind === 'PRG') { q1 = r.int(1, 7); q2 = r.int(1, 7) * (r.chance(0.3) ? -1 : 1); p1 = p; p2 = -p; if (r.chance(0.5)) [p1, p2] = [p2, p1]; }
      else { q1 = nz(r, 1, 7); q2 = nz(r, 1, 7); const s1 = r.sign(), s2 = r.chance(0.5) ? s1 : -s1; p1 = s1 * p; p2 = s2 * p; if (!(p1 < 0 || p2 < 0)) continue; }
      if (q1 === q2 || q1 === -q2) continue;
      const [e1, e2] = v === 'x' ? mk(p1, q1, p2, q2, x0, y0) : mk(q1, p1, q2, p2, x0, y0);
      if (!ok(e1, e2)) continue;
      if (kind === 'BEG' && (e1.c < 0 || e2.c < 0)) continue;
      if (kind !== 'MAS' && (x0 < 0 && y0 < 0)) continue;
      const text = kind === 'BEG' ? 'The coefficients match. <b>Subtract</b> to solve the system, then check in both equations.'
        : kind === 'PRG' ? 'The coefficients are opposites. <b>Add</b> to solve the system, then check in both equations.'
          : '<b>Add or subtract?</b> Decide, then solve the system and check in both equations.';
      return { text, q: sysE(eqS(e1), eqS(e2)), a: work(e1, e2, v, x0, y0) };
    }
  }
  standup('u8l5', {
    intro: 'Same sign → subtract. Opposite signs → add. Then solve, back-substitute, and check in both equations.',
    levels: { BEG: (r) => gen(r, 'BEG'), PRG: (r) => gen(r, 'PRG'), MAS: (r) => gen(r, 'MAS') }
  });
}
