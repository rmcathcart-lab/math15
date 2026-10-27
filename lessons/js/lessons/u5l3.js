/* Math 15 · Unit 5 · Lesson 3 — Describing Relationships Between Two Quantities.
 * A relation is a set of ordered pairs; the same pairs as a list, a table of values, a mapping diagram and a graph.
 * Colour code (as in Math 10C u5l2): inputs / independent amber, outputs / dependent purple, plotted points navy.
 * Explainers: vending (a rule makes ordered pairs), tableRead (columns → pairs), buildMap (table → mapping diagram),
 * untangleEx (crossed arrows, same relation), plotPairs (right by the input, up by the output), orderMatters,
 * threeViews (one relation travels through the pictures), oddOneOut (which picture doesn't match?).
 * Warm-up: Who's Connected? (owners → pets, tap to draw arrows) and Mia's vs Jo's tangled diagram.
 * Built from Math 10C u5l2 (sixViews conveyor, fly(), panels), trimmed to the Math 15 booklet. */
import {
  h, tex, add, box, Graph, ValueTable, MappingDiagram, stamp, stampIn, mountExplainers, pop, fadeIn, pulse,
  sleep, tween, anim, drawIn, svgEl, arrowHead
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const IV = '#c27a0e', DV = '#7b4fc4', PT = '#2b55a0', RED = '#c93a33', OK = '#12805a';
const ivT = (s) => `\\textcolor{${IV}}{${s}}`;
const dvT = (s) => `\\textcolor{${DV}}{${s}}`;
const ivB = (s) => `<b class="u5l3-ivt">${s}</b>`;
const dvB = (s) => `<b class="u5l3-dvt">${s}</b>`;
const pr = (x, y) => `(${x},\\ ${y})`;
const prC = (x, y) => `(${ivT(x)},\\ ${dvT(y)})`;
const setT = (ps) => `\\{${ps.map((p) => pr(p[0], p[1])).join(',\\ ')}\\}`;

/* centre of el in stage coordinates (the page may be scaled, so divide by the stage's scale) */
function rel(stage, el) {
  const s = stage.getBoundingClientRect(), r = el.getBoundingClientRect(), k = s.width / (stage.offsetWidth || s.width) || 1;
  return [(r.left + r.width / 2 - s.left) / k, (r.top + r.height / 2 - s.top) / k];
}
/* a copy of a value flies from one place to another (skipped when replaying fast) */
async function fly(c, stage, html, from, to, ms = 620, cls = '') {
  if (!c || c.fast) return;
  const d = add(stage, h('div', 'u5l3-fly ' + cls, html), from[0], from[1]);
  d.style.translate = '-50% -50%';
  try { await c.anim(d, [{ transform: 'translate(0px, 0px) scale(1)' }, { transform: `translate(${(to[0] - from[0]) / 2}px, ${(to[1] - from[1]) / 2 - 18}px) scale(1.15)`, offset: 0.5 }, { transform: `translate(${to[0] - from[0]}px, ${to[1] - from[1]}px) scale(1)` }], ms, { easing: 'ease-in-out' }); }
  finally { d.remove(); }
}
const fadeOut = async (c, el, ms = 320) => { await anim(c, el, [{ opacity: 1 }, { opacity: 0 }], ms); el.style.visibility = 'hidden'; };
const panel = (stage, x, y, w, hh, title, cls = '') => add(stage, box(h('div', 'u5l3-panel ' + cls, title ? `<div class="u5l3-ph">${title}</div>` : ''), w, hh), x, y);
const line = (p, html, cls = '') => p.appendChild(h('div', 'u5l3-line ' + cls, html));
const showLine = (c, p, html, cls) => { const d = line(p, html, cls); return fadeIn(c, d).then(() => d); };
/* a set of ordered pairs with empty slots: { el, slots: [{ p, sx, sy }], braces } */
function pairSet(host, n, iv, dv, cls = '') {
  const el = host.appendChild(h('div', 'u5l3-pset ' + cls));
  const bl = el.appendChild(h('i', 'u5l3-brace', T('\\{')));
  const slots = [];
  for (let i = 0; i < n; i++) {
    const p = el.appendChild(h('span', 'u5l3-pair', `${T('(')}<i class="u5l3-sx"></i>${T(',\\ ')}<i class="u5l3-sy"></i>${T(')')}${i < n - 1 ? T(',') : ''}`));
    p.style.opacity = 0; slots.push({ p, sx: p.querySelector('.u5l3-sx'), sy: p.querySelector('.u5l3-sy') });
  }
  const br = el.appendChild(h('i', 'u5l3-brace', T('\\}')));
  const fillSlot = (i, x, y) => { slots[i].sx.innerHTML = T(ivT(x)); slots[i].sy.innerHTML = T(dvT(y)); slots[i].p.style.opacity = 1; };
  void iv; void dv;
  return { el, slots, braces: [bl, br], fillSlot };
}

/* ================= little pictures ================= */
const INK = '#1e2d46';
const PETS = {
  dog: `<circle r=".42" fill="#b07846"/><ellipse cx="-.42" cy=".05" rx=".14" ry=".32" transform="rotate(20 -.42 .05)" fill="#7a5640"/><ellipse cx=".42" cy=".05" rx=".14" ry=".32" transform="rotate(-20 .42 .05)" fill="#7a5640"/><circle cx="-.15" cy=".1" r=".05" fill="${INK}" stroke="none"/><circle cx=".15" cy=".1" r=".05" fill="${INK}" stroke="none"/><ellipse cy="-.1" rx=".1" ry=".07" fill="${INK}" stroke="none"/><path d="M-.1 -.24C0 -.3 0 -.3 .1 -.24" fill="none"/>`,
  cat: `<path d="M-.38 .18L-.32 .58L-.08 .36Z" fill="#e9c673"/><path d="M.38 .18L.32 .58L.08 .36Z" fill="#e9c673"/><circle r=".4" fill="#e9c673"/><circle cx="-.14" cy=".08" r=".05" fill="${INK}" stroke="none"/><circle cx=".14" cy=".08" r=".05" fill="${INK}" stroke="none"/><path d="M0 -.06L-.06 0L.06 0Z" fill="#e0716a" stroke="none"/><path d="M-.12 -.1L-.55 -.02M-.12 -.14L-.55 -.2M.12 -.1L.55 -.02M.12 -.14L.55 -.2" stroke-width=".02" fill="none"/>`,
  fish: `<path d="M.25 0L.58 .28L.58 -.28Z" fill="#c88c14"/><ellipse cx="-.1" rx=".45" ry=".28" fill="#deb254"/><circle cx="-.33" cy=".06" r=".05" fill="${INK}" stroke="none"/><path d="M.02 .2C.08 0 .08 0 .02 -.2" fill="none" stroke-width=".02"/>`,
  bird: `<circle r=".38" fill="#508cd2"/><path d="M.02 -.05C.2 .2 .35 .05 .3 -.12C.2 -.2 .2 -.2 .02 -.05Z" fill="#3c669a"/><path d="M-.36 .08L-.6 0L-.36 -.08Z" fill="#c88c14"/><circle cx="-.16" cy=".12" r=".05" fill="${INK}" stroke="none"/><path d="M-.08 -.38L-.1 -.5M.1 -.38L.12 -.5" fill="none"/>`,
  turtle: `<circle cx="-.55" cy="-.08" r=".14" fill="#9cc096"/><rect x="-.3" y="-.3" width=".12" height=".15" fill="#9cc096"/><rect x=".18" y="-.3" width=".12" height=".15" fill="#9cc096"/><path d="M-.45 -.15A.45 .5 0 0 0 .45 -.15Z" fill="#5a9650"/><path d="M-.2 -.15L-.12 .15L.12 .15L.2 -.15M-.12 .15L-.05 .35M.12 .15L.05 .35" fill="none" stroke-width=".02"/><circle cx="-.6" cy="-.04" r=".03" fill="${INK}" stroke="none"/>`
};
const petSvg = (k, s = 40) => `<svg viewBox="-.68 -.68 1.36 1.36" width="${s}" height="${s}" aria-hidden="true"><g transform="scale(1,-1)" stroke="${INK}" stroke-width=".03" stroke-linejoin="round">${PETS[k]}</g></svg>`;
const ITEM = {
  juice: (s = 34) => `<svg viewBox="0 0 34 44" width="${s}" height="${s * 44 / 34}" aria-hidden="true"><path d="M22 7L26 1" stroke="#1e2d46" stroke-width="2.4" stroke-linecap="round"/><rect x="5" y="7" width="24" height="35" rx="3" fill="#f2a33a" stroke="#1e2d46" stroke-width="2.2"/><rect x="5" y="18" width="24" height="12" fill="#fff4dd" stroke="#1e2d46" stroke-width="1.6"/><circle cx="17" cy="24" r="4" fill="#d24a2e"/></svg>`,
  bar: (s = 34) => `<svg viewBox="0 0 34 44" width="${s}" height="${s * 44 / 34}" aria-hidden="true"><rect x="3" y="11" width="28" height="22" rx="4" fill="#9a6a3a" stroke="#1e2d46" stroke-width="2.2"/><path d="M9 15v14M15 15v14M21 15v14M27 15v14" stroke="#d9b27c" stroke-width="2.2"/></svg>`
};

/* =====================================================================================
 * 1. vending — a rule makes ordered pairs: buy 1, 2, 3, 4 and write (n, C) each time. */
const VEND = {
  bars: { label: 'Granola bars, $3 each', item: 'bar', one: 'granola bar', many: 'granola bars', p: 3 },
  juice: { label: 'Example 1', item: 'juice', one: 'juice box', many: 'juice boxes', p: 2 }
};
const vending = {
  title: 'A rule makes ordered pairs',
  height: 440,
  minW: 900,
  choices: [{ v: 'bars', label: VEND.bars.label }, { sep: 'Example check:' }, { v: 'juice', label: VEND.juice.label }],
  intro: (k) => `Buy one ${VEND[k].one} at a time. After each purchase, write down an <b>ordered pair</b>. Press <b>Next</b>.`,
  make(stage, k, ex) {
    const d = VEND[k], W = ex.W, ns = [1, 2, 3, 4];
    // the machine
    const mw = 250, mh = 420, mx = 14, my = 10;
    const mach = add(stage, box(h('div', 'u5l3-mach'), mw, mh), mx, my);
    mach.innerHTML = `<svg viewBox="0 0 ${mw} ${mh}" width="${mw}" height="${mh}" aria-hidden="true">
      <rect x="3" y="3" width="${mw - 6}" height="${mh - 6}" rx="16" fill="#2b55a0" stroke="#1e2d46" stroke-width="3"/>
      <rect x="18" y="20" width="156" height="262" rx="8" fill="#e6f0fb" stroke="#1e2d46" stroke-width="2.5"/>
      ${[100, 180, 260].map((y) => `<path d="M22 ${y}H170" stroke="#9fb6d6" stroke-width="3"/>`).join('')}
      <rect x="186" y="20" width="50" height="34" rx="5" fill="#10213d"/>
      ${[0, 1, 2].map((r) => [0, 1].map((cc) => `<circle cx="${199 + cc * 24}" cy="${82 + r * 24}" r="8" fill="#f4f1ea" stroke="#1e2d46" stroke-width="1.5"/>`).join('')).join('')}
      <rect x="203" y="160" width="16" height="44" rx="4" fill="#10213d"/><path d="M211 168v28" stroke="#c88c14" stroke-width="3"/>
      <rect x="18" y="300" width="218" height="86" rx="8" fill="#10213d" stroke="#1e2d46" stroke-width="2.5"/>
      <rect x="26" y="306" width="202" height="20" rx="4" fill="#1e3a6e"/>
    </svg>`;
    const disp = mach.appendChild(h('div', 'u5l3-mdisp', '$0'));
    // items in the window (3 rows × 3); the bottom-row and one middle-row item will drop
    const slotsXY = []; [0, 1, 2].forEach((r) => [0, 1, 2].forEach((cc) => slotsXY.push([30 + cc * 50, 56 + r * 80])));
    const items = slotsXY.map(([x, y]) => add(mach, h('div', 'u5l3-mitem', ITEM[d.item](34)), x, y));
    const dropOrder = [6, 7, 8, 5], trayXY = [[34, 336], [82, 336], [130, 336], [178, 336]];
    // counters
    const cx0 = mx + mw + 22, cw = W - cx0 - 12;
    const ctr = panel(stage, cx0, 10, cw, 150, '', 'u5l3-ctrs');
    ctr.innerHTML = `<div class="u5l3-ctr u5l3-ctr-i"><div class="u5l3-ctl">input: number bought, ${T(ivT('n'))}</div><div class="u5l3-ctv"></div></div>
      <div class="u5l3-ctr u5l3-ctr-o"><div class="u5l3-ctl">output: total cost, ${T(dvT('C'))} ($)</div><div class="u5l3-ctv"></div></div>
      <div class="u5l3-ceq"></div>`;
    const [vIn, vOut] = [...ctr.querySelectorAll('.u5l3-ctv')], ceq = ctr.querySelector('.u5l3-ceq');
    vIn.innerHTML = T(ivT('0')); vOut.innerHTML = T(dvT('0'));
    // the relation
    const R = panel(stage, cx0, 174, cw, 118, `The relation ${T(prC('n', 'C'))}`, 'u5l3-relp');
    const S = pairSet(R, 4, 'n', 'C');
    // order matters
    const O = panel(stage, cx0, 306, cw, 124, 'Order matters', 'u5l3-ordp'); O.style.opacity = 0;
    const steps = [{
      cap: `Each ${d.one} costs <b>$${d.p}</b>. The ${ivB('input')} is how many you buy, ${T(ivT('n'))}. The ${dvB('output')} is the total cost, ${T(dvT('C'))}, in dollars.`,
      run: async (c) => { await Promise.all([pulse(c, ctr.children[0], 1.06), pulse(c, ctr.children[1], 1.06)]); }
    }];
    ns.forEach((n, i) => {
      const C = n * d.p;
      steps.push({
        cap: `Buy ${n}: ${T(`${n}\\times ${d.p}=${C}`)}, so ${n} ${n === 1 ? d.one + ' costs' : d.many + ' cost'} <b>$${C}</b>. The ordered pair is ${T(prC(n, C))}.`,
        run: async (c) => {
          const it = items[dropOrder[i]], [fx, fy] = slotsXY[dropOrder[i]], [tx, ty] = trayXY[i];
          await anim(c, it, [{ transform: 'translate(0px, 0px) rotate(0deg)' }, { transform: `translate(${tx - fx}px, ${ty - fy}px) rotate(${i % 2 ? -10 : 10}deg)` }], 650, { easing: 'cubic-bezier(.55,0,1,.45)' });
          vIn.innerHTML = T(ivT(n)); disp.textContent = '$' + C;
          await pop(c, vIn);
          ceq.innerHTML = T(`${dvT('C')}=${d.p}\\times ${ivT(n)}=${dvT(C)}`); await fadeIn(c, ceq, 300);
          vOut.innerHTML = T(dvT(C)); await pop(c, vOut);
          await Promise.all([fly(c, stage, T(ivT(n)), rel(stage, vIn), rel(stage, S.slots[i].sx)), fly(c, stage, T(dvT(C)), rel(stage, vOut), rel(stage, S.slots[i].sy))]);
          S.fillSlot(i, n, C); await pop(c, S.slots[i].p, 300);
        }
      });
    });
    steps.push({
      cap: `Put the pairs inside <b>curly brackets</b>: ${T(setT(ns.map((n) => [n, n * d.p])))}. This set of ordered pairs <b>is</b> the relation.`,
      run: async (c) => { S.el.classList.add('on'); await Promise.all(S.braces.map((b) => pulse(c, b, 1.5, 520))); }
    });
    const a = 2, b = 2 * d.p;
    steps.push({
      cap: `Order matters! ${T(pr(a, b))} means ${a} ${d.many} cost $${b}. Swapped, ${T(pr(b, a))} would mean ${b} ${d.many} cost $${a}. <b>Input first, output second.</b>`,
      run: async (c) => {
        await fadeIn(c, O);
        const l1 = await showLine(c, O, `${T(prC(a, b))}: ${a} ${d.many} cost $${b}`); const s1 = stamp(l1, '✓', { ok: true, size: 'sm' }); await stampIn(c, s1);
        const l2 = await showLine(c, O, `${T(pr(b, a))}: ${b} ${d.many} cost $${a}?`); const s2 = stamp(l2, '✗', { ok: false, size: 'sm' }); await stampIn(c, s2);
      }
    });
    return steps;
  }
};

/* =====================================================================================
 * 2. tableRead — a table of values: read straight down each column to get one ordered pair. */
const TR = {
  bikes: { label: 'Bicycles: 2 wheels each', iv: 'b', dv: 'W', ivw: 'bicycles', dvw: 'wheels', xs: [1, 2, 3, 4], f: (x) => 2 * x },
  dogs: { label: 'A standing table', iv: 'd', dv: 'P', ivw: 'dogs walked', dvw: 'pay in dollars', xs: [1, 2, 3], f: (x) => 10 * x, vert: true },
  ex2: { label: 'Example 2', iv: 't', dv: 'W', ivw: 'tricycles', dvw: 'wheels', xs: [1, 2, 3, 4], f: (x) => 3 * x, vars: true }
};
const tableRead = {
  title: 'Reading a table of values',
  height: 400,
  minW: 880,
  choices: [{ v: 'bikes', label: TR.bikes.label }, { v: 'dogs', label: TR.dogs.label }, { sep: 'Example check:' }, { v: 'ex2', label: TR.ex2.label }],
  intro: (k) => (TR[k].vert ? 'This table stands up: inputs in the left column. Press <b>Next</b>.' : 'Inputs on top, outputs underneath. Press <b>Next</b>.'),
  make(stage, k, ex) {
    const d = TR[k], W = ex.W, ys = d.xs.map(d.f), n = d.xs.length, v = !!d.vert;
    const tb = new ValueTable(stage, v
      ? { x: 70, y: 20, headers: [ivT(d.iv), dvT(d.dv)], rows: d.xs.map((x, i) => [x, ys[i]]), cellW: 110, cellH: 64, tap: false, cls: 'u5l3-ctab' }
      : { x: 24, y: 40, headers: [ivT(d.iv), dvT(d.dv)], rows: d.xs.map((x, i) => [x, ys[i]]), layout: 'h', cellW: 100, cellH: 72, headW: 84, tap: false, cls: 'u5l3-ctab u5l3-ctab-l' });
    const tags = add(stage, h('div', 'u5l3-ttags' + (v ? ' v' : ''), v ? `<span class="u5l3-ivt">inputs: ${d.ivw}</span><span class="u5l3-dvt">outputs: ${d.dvw}</span>` : `<span class="u5l3-ivt">← inputs: ${d.ivw}</span><span class="u5l3-dvt">← outputs: ${d.dvw}</span>`), v ? 70 : 24 + 84 + n * 100 + 14, v ? 20 + (n + 1) * 64 + 12 : 40);
    tags.style.opacity = 0;
    const px = v ? 380 : 24, py = v ? 20 : 206, pw = v ? W - 394 : W - 48;
    const P = panel(stage, px, py, pw, v ? 170 : 104, `Ordered pairs ${T(prC(d.iv, d.dv))}`, 'u5l3-prp u5l3-prl');
    const S = pairSet(P, n, d.iv, d.dv);
    const N = panel(stage, px, py + (v ? 186 : 118), pw, v ? 174 : 70, '', 'u5l3-notes'); N.style.opacity = 0;
    const readCol = async (c, i) => {
      tb.highlight(i, true);
      await Promise.all([fly(c, stage, T(ivT(d.xs[i])), rel(stage, tb.cell(i, 0)), rel(stage, S.slots[i].sx)), fly(c, stage, T(dvT(ys[i])), rel(stage, tb.cell(i, 1)), rel(stage, S.slots[i].sy))]);
      S.fillSlot(i, d.xs[i], ys[i]); await pop(c, S.slots[i].p, 300); tb.highlight(i, false);
    };
    const steps = [
      { cap: v ? `This table stands up. The left column holds the ${ivB('inputs')} (${T(ivT(d.iv))}, ${d.ivw}); the right column holds the ${dvB('outputs')} (${T(dvT(d.dv))}, ${d.dvw}).`
        : `The top row holds the ${ivB('inputs')} (${T(ivT(d.iv))}, ${d.ivw}). The bottom row holds the matching ${dvB('outputs')} (${T(dvT(d.dv))}, ${d.dvw}).`,
        run: async (c) => { tb.heads[0].classList.add('u5l3-hi'); tb.heads[1].classList.add('u5l3-ho'); await fadeIn(c, tags); } },
      { cap: v ? `Read straight <b>across</b> the first row: ${T(ivT(d.iv) + '=' + d.xs[0])} and ${T(dvT(d.dv) + '=' + ys[0])} make the pair ${T(prC(d.xs[0], ys[0]))}.`
        : `Read straight <b>down</b> the first column: ${T(ivT(d.iv) + '=' + d.xs[0])} and ${T(dvT(d.dv) + '=' + ys[0])} make the pair ${T(prC(d.xs[0], ys[0]))}.`,
        run: (c) => readCol(c, 0) },
      { cap: `Do the same for every ${v ? 'row' : 'column'}: one ${v ? 'row' : 'column'}, one ordered pair.`,
        run: async (c) => { for (let i = 1; i < n; i++) { await readCol(c, i); await sleep(c, 120); } } },
      { cap: `The whole relation: ${T(setT(d.xs.map((x, i) => [x, ys[i]])))}. ${n} ${v ? 'rows' : 'columns'}, ${n} ordered pairs.`,
        run: async (c) => { S.el.classList.add('on'); await Promise.all(S.braces.map((b) => pulse(c, b, 1.5, 520))); } }
    ];
    if (d.vars) steps.push({
      cap: `Independent: ${T(ivT('t'))}, the number of tricycles (you choose it). Dependent: ${T(dvT('W'))}, the total wheels (it follows, three per tricycle).`,
      run: async (c) => { await fadeIn(c, N); await showLine(c, N, `independent: ${T(ivT('t'))} (tricycles) &nbsp;·&nbsp; dependent: ${T(dvT('W'))} (wheels)`); }
    });
    return steps;
  }
};

/* =====================================================================================
 * 3. buildMap — from a table to a mapping diagram: inputs left, outputs right, arrows input → output. */
const BM = {
  spider: { label: 'Spiders: 8 legs each', iv: 's', dv: 'L', ivw: 'spiders', dvw: 'legs', xs: [1, 2, 3], f: (x) => 8 * x },
  ex3: { label: 'Example 3', iv: 'c', dv: 'L', ivw: 'chairs', dvw: 'legs', xs: [2, 3, 4, 5], f: (x) => 4 * x }
};
const buildMap = {
  title: 'From a table to a mapping diagram',
  height: 440,
  minW: 900,
  choices: [{ v: 'spider', label: BM.spider.label }, { sep: 'Example check:' }, { v: 'ex3', label: BM.ex3.label }],
  intro: 'Start with the table. Build the mapping diagram one piece at a time. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = BM[k], W = ex.W, ys = d.xs.map(d.f), n = d.xs.length;
    const tb = new ValueTable(stage, { x: 20, y: 20, headers: [ivT(d.iv), dvT(d.dv)], rows: d.xs.map((x, i) => [x, ys[i]]), layout: 'h', cellW: 76, cellH: 58, headW: 66, tap: false, cls: 'u5l3-ctab' });
    const mw = 440, mx = W - mw - 12;
    const M = new MappingDiagram(stage, { x: mx, y: 8, width: mw, height: 424, domain: d.xs, range: ys, pairs: d.xs.map((x, i) => [x, ys[i]]), titles: [`Inputs ${T(ivT(d.iv))}`, `Outputs ${T(dvT(d.dv))}`], arrows: false, cls: 'u5l3-map', color: IV });
    M.el.style.opacity = 0; M.ovals.forEach((o) => o.setAttribute('rx', 66));
    M.itemEls[0].forEach((e) => { e.style.color = IV; e.style.opacity = 0; }); M.itemEls[1].forEach((e) => { e.style.color = DV; e.style.opacity = 0; });
    const N = panel(stage, 20, 172, mx - 40, 260, '', 'u5l3-notes');
    const steps = [
      { cap: `Draw two ovals: one for the ${ivB('inputs')} (${d.ivw}) on the left, one for the ${dvB('outputs')} (${d.dvw}) on the right.`,
        run: (c) => fadeIn(c, M.el, 450) },
      { cap: `Copy the inputs from the top row into the <b>left</b> oval.`,
        run: async (c) => { tb.highlightCol(0, true); await Promise.all(d.xs.map(async (x, i) => { await sleep(c, i * 120); await fly(c, stage, T(ivT(x)), rel(stage, tb.cell(i, 0)), rel(stage, M.item('d', x))); M.item('d', x).style.opacity = 1; })); tb.highlightCol(0, false); } },
      { cap: `Copy the outputs from the bottom row into the <b>right</b> oval.`,
        run: async (c) => { tb.highlightCol(1, true); await Promise.all(ys.map(async (y, i) => { await sleep(c, i * 120); await fly(c, stage, T(dvT(y)), rel(stage, tb.cell(i, 1)), rel(stage, M.item('r', y))); M.item('r', y).style.opacity = 1; })); tb.highlightCol(1, false); } },
      { cap: `Now one arrow for each column of the table, pointing <b>from</b> the input <b>to</b> its own output: ${d.xs.map((x, i) => T(`${x}\\to ${ys[i]}`)).join(', ')}.`,
        run: async (c) => { for (let i = 0; i < n; i++) { tb.highlight(i, true); await M.drawArrow(c, i, 460); await showLine(c, N, `${T(`${ivT(d.xs[i])}\\to ${dvT(ys[i])}`)} &nbsp;is the pair&nbsp; ${T(prC(d.xs[i], ys[i]))}`); tb.highlight(i, false); } } },
      { cap: `${n} columns, ${n} arrows, ${n} ordered pairs. Each arrow <b>is</b> one ordered pair.`,
        run: async (c) => { await Promise.all(M.arrowEls.map((a) => pulse(c, a, 1.04))); const s = stamp(N, `${n} arrows = ${n} pairs`, { ok: true, size: 'sm', rotate: -4 }); s.classList.add('u5l3-nst'); await stampIn(c, s); } },
      { cap: `Arrows never point backwards. An arrow from ${T(dvT(ys[0]))} to ${T(ivT(d.xs[0]))} would put the output first. Always <b>input → output</b>.`,
        run: async (c) => {
          const a = M.item('d', d.xs[0]), b = M.item('r', ys[0]), y0 = a.cy + 30;
          const g = svgEl('g', { class: 'bk-curve' }, M.svg); g.style.color = RED;
          const x1 = M.cxs[1] - 26, x2 = M.cxs[0] + 26;
          svgEl('path', { class: 'bk-stroke', d: `M${x1} ${b.cy + 30} L${x2} ${y0}`, fill: 'none', stroke: RED, 'stroke-width': 3, 'stroke-dasharray': '8 6' }, g);
          arrowHead(g, x2, y0, x2 - x1, y0 - b.cy - 30, { width: 3, color: RED, cls: 'bk-end bk-end1' });
          await drawIn(g, 500, c);
          const s = stamp(stage, '✗', { ok: false, x: mx + mw / 2, y: 8 + (y0 + b.cy + 30) / 2 }); await stampIn(c, s);
        } }
    ];
    return steps;
  }
};

/* =====================================================================================
 * 4. untangleEx — crossed arrows, same relation: read the pairs, then sort the ovals. */
function miniMap(stage, x, y, w, hh, o) {
  // o: { L, R, links: [[i, j]], titles: [l, r], color }
  const root = add(stage, box(h('div', 'u5l3-mm'), w, hh), x, y);
  const svg = svgEl('svg', { width: w, height: hh, viewBox: `0 0 ${w} ${hh}` }, root);
  const top = 40, ry = (hh - top - 10) / 2, cy = top + ry, xl = w * 0.22, xr = w * 0.78, rx = Math.min(56, w * 0.15);
  svgEl('ellipse', { cx: xl, cy, rx, ry, class: 'bk-oval' }, svg); svgEl('ellipse', { cx: xr, cy, rx, ry, class: 'bk-oval' }, svg);
  o.titles.forEach((t, i) => { const e = add(root, h('div', 'u5l3-mmt', t), i ? xr : xl, 4); e.style.translate = '-50% 0'; });
  const slotY = (k, m) => cy - ry + (k + 1) * (2 * ry) / (m + 1);
  const mk = (vals, side) => vals.map((v, k) => { const e = add(root, h('div', 'u5l3-mmi', T(String(v))), side ? xr : xl, slotY(k, vals.length)); e.style.translate = '-50% -50%'; e.style.color = side ? DV : IV; e.pos = k; return e; });
  const Li = mk(o.L, 0), Ri = mk(o.R, 1);
  const arrows = o.links.map(([i, j]) => { const g = svgEl('g', { class: 'u5l3-mma' }, svg); g.style.color = o.color || IV; g.i = i; g.j = j; g.path = svgEl('path', { fill: 'none', stroke: 'currentColor', 'stroke-width': 3, 'stroke-linecap': 'round' }, g); g.head = svgEl('path', { fill: 'currentColor' }, g); return g; });
  const yOf = (e) => parseFloat(e.style.top);
  const draw = () => arrows.forEach((g) => {
    const y1 = yOf(Li[g.i]), y2 = yOf(Ri[g.j]), x1 = xl + 22, x2 = xr - 24, L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L, bx = x2 - 12 * ux, by = y2 - 12 * uy;
    g.path.setAttribute('d', `M${x1} ${y1}L${bx} ${by}`);
    g.head.setAttribute('d', `M${x2} ${y2}L${bx - 6 * uy} ${by + 6 * ux}L${bx + 6 * uy} ${by - 6 * ux}Z`);
  });
  draw();
  const moveTo = (c, posL, posR, ms = 1100) => {
    const from = [...Li, ...Ri].map(yOf), to = [...Li.map((e, k) => slotY(posL[k], Li.length)), ...Ri.map((e, k) => slotY(posR[k], Ri.length))];
    const all = [...Li, ...Ri];
    return tween(c, ms, (t) => { all.forEach((e, k) => (e.style.top = (from[k] + (to[k] - from[k]) * t) + 'px')); draw(); });
  };
  return { root, Li, Ri, arrows, draw, moveTo };
}
const UN = {
  mj: { label: 'Mia and Jo (warm-up)', names: ['Mia', 'Jo'], iv: '\\text{packs}', dv: '\\text{cards}', f: (x) => 5 * x, jl: [3, 1, 4, 2], jr: [20, 15, 5, 10] },
  other: { label: 'Another tangle', names: ['Sam', 'Lee'], iv: 'x', dv: 'y', f: (x) => 2 * x + 1, jl: [4, 2, 1, 3], jr: [5, 9, 3, 7] }
};
const untangleEx = {
  title: 'Crossed arrows: the same relation?',
  height: 440,
  minW: 900,
  choices: Object.keys(UN).map((k) => ({ v: k, label: UN[k].label })),
  intro: (k) => `${UN[k].names[0]}’s arrows are neat. ${UN[k].names[1]}’s cross. Same relation? Press <b>Next</b>.`,
  make(stage, k, ex) {
    const d = UN[k], W = ex.W, xs = [1, 2, 3, 4], ys = xs.map(d.f);
    const mw = Math.floor((W - 48) / 2) - 40, mh = 262;
    const A = miniMap(stage, 16, 8, mw, mh, { L: xs, R: ys, links: xs.map((x, i) => [i, i]), titles: [`<b>${d.names[0]}</b> ${T(ivT(d.iv))}`, T(dvT(d.dv))] });
    const jlinks = d.jl.map((x, i) => [i, d.jr.indexOf(d.f(x))]);
    const B = miniMap(stage, W - mw - 16, 8, mw, mh, { L: d.jl, R: d.jr, links: jlinks, titles: [`<b>${d.names[1]}</b> ${T(ivT(d.iv))}`, T(dvT(d.dv))] });
    const PA = panel(stage, 16, 280, mw, 96, `${d.names[0]}’s pairs`, 'u5l3-prp'), PB = panel(stage, W - mw - 16, 280, mw, 96, `${d.names[1]}’s pairs`, 'u5l3-prp');
    const SA = pairSet(PA, 4), SB = pairSet(PB, 4);
    const eq = add(stage, h('div', 'u5l3-eqsign', '='), W / 2, 120); eq.style.translate = '-50% -50%'; eq.style.opacity = 0;
    const jPairs = d.jl.map((x) => [x, d.f(x)]);
    const readArrows = async (c, M, S, pairs) => {
      for (let i = 0; i < pairs.length; i++) {
        const g = M.arrows[i]; g.style.color = RED; await pulse(c, g, 1.03, 300);
        S.fillSlot(i, pairs[i][0], pairs[i][1]); await pop(c, S.slots[i].p, 300); g.style.color = IV; await sleep(c, 80);
      }
    };
    return [
      { cap: `${d.names[1]}: read each arrow as an ordered pair. ${jPairs.map((p) => T(`${p[0]}\\to ${p[1]}`)).join(', ')}.`,
        run: (c) => readArrows(c, B, SB, jPairs) },
      { cap: `${d.names[0]}: ${xs.map((x, i) => T(pr(x, ys[i]))).join(', ')}.`,
        run: (c) => readArrows(c, A, SA, xs.map((x, i) => [x, ys[i]])) },
      { cap: `Put ${d.names[1]}’s pairs in order: they are exactly ${d.names[0]}’s four pairs.`,
        run: async (c) => {
          const sorted = jPairs.map((p, i) => [p, i]).sort((a, b) => a[0][0] - b[0][0]);
          await Promise.all(SB.slots.map((s) => anim(c, s.p, [{ opacity: 1 }, { opacity: 0 }], 250)));
          sorted.forEach(([p], i) => SB.fillSlot(i, p[0], p[1]));
          await Promise.all(SB.slots.map((s, i) => pop(c, s.p, 300, { delay: i * 90 })));
          SA.el.classList.add('on'); SB.el.classList.add('on'); await pop(c, eq);
        } },
      { cap: `Untangle ${d.names[1]}’s ovals: write the numbers in order and the arrows straighten out. It is ${d.names[0]}’s diagram.`,
        run: (c) => B.moveTo(c, d.jl.map((x) => xs.indexOf(x)), d.jr.map((y) => ys.indexOf(y))) },
      { cap: `Same ordered pairs, same relation. The order inside an oval never matters: only <b>what connects to what</b>.`,
        run: async (c) => { const s = stamp(stage, 'Same relation', { ok: true, x: W / 2, y: 190, size: 'sm', rotate: -10 }); await stampIn(c, s); } }
    ];
  }
};

/* =====================================================================================
 * 5. plotPairs — each ordered pair becomes one point: right by the input, up by the output. */
const PP = {
  juice: { label: 'Example 1 as a graph', iv: 'n', dv: 'C', pts: [[1, 2], [2, 4], [3, 6], [4, 8]], win: { xmin: 0, xmax: 6, ymin: 0, ymax: 10, ylabels: 2 }, given: 'table' },
  ex4: { label: 'Example 4', iv: 'x', dv: 'y', pts: [[1, 5], [2, 7], [3, 9], [4, 11]], win: { xmin: 0, xmax: 10, ymin: 0, ymax: 14, xlabels: 2, ylabels: 2 }, given: 'pairs' }
};
async function walk(c, G, x, y, o = {}) {
  const a = G.segment([0, 0], [x, 0], { color: IV, width: 6 }), b = G.segment([x, 0], [x, y], { color: DV, width: 6 });
  a.style.opacity = 0.8; b.style.opacity = 0.8;
  const ta = G.label(x / 2, 0, `right ${x}`, { pos: 'n', cls: 'u5l3-wlab u5l3-wl-i' }), tb = G.label(x, y / 2, `up ${y}`, { pos: 'e', cls: 'u5l3-wlab u5l3-wl-o', dx: 6 });
  ta.style.opacity = 0; tb.style.opacity = 0;
  await G.drawIn(a, o.ms || 600, c); await fadeIn(c, ta, 200);
  await G.drawIn(b, o.ms || 600, c); await fadeIn(c, tb, 200);
  const p = G.point(x, y, { color: o.color || PT, r: 7, label: T(pr(x, y)), pos: o.pos || (x <= 1 ? 'n' : 'nw') });
  await G.reveal(p, c);
  return { trail: [a, b, ta, tb], p };
}
const plotPairs = {
  title: 'Plotting ordered pairs',
  height: 460,
  minW: 900,
  choices: [{ v: 'juice', label: PP.juice.label }, { sep: 'Example check:' }, { v: 'ex4', label: PP.ex4.label }],
  intro: (k) => (k === 'ex4' ? 'Four ordered pairs: fill the table, then plot each pair. Press <b>Next</b>.' : 'The juice-box pairs from Example 1, as points. Press <b>Next</b>.'),
  make(stage, k, ex) {
    const d = PP[k], W = ex.W, n = d.pts.length;
    const G = new Graph(stage, Object.assign({ x: W - 456, y: 6, width: 446, height: 448, xtitle: ivT(d.iv), ytitle: dvT(d.dv) }, d.win));
    const lw = W - 486;
    const top = panel(stage, 14, 10, lw, 92, d.given === 'pairs' ? `The ordered pairs ${T(prC(d.iv, d.dv))}` : 'Example 1: juice boxes, $2 each', 'u5l3-prp');
    const S = pairSet(top, n);
    d.pts.forEach((p, i) => S.fillSlot(i, p[0], p[1])); S.el.classList.add('on');
    const tb = new ValueTable(stage, { x: 14, y: 120, headers: [ivT(d.iv), dvT(d.dv)], rows: d.pts.map((p) => p.slice()), layout: 'h', cellW: 74, cellH: 56, headW: 60, hide: d.given === 'pairs' ? 1 : null, q: '', tap: false, cls: 'u5l3-ctab' });
    const N = panel(stage, 14, 262, lw, 190, '', 'u5l3-notes');
    const dys = d.pts.slice(1).map((p, i) => p[1] - d.pts[i][1]);
    let last = null;
    const plot = async (c, i, ms) => {
      if (last) G.remove(...last.trail);
      tb.highlight(i, true);
      last = await walk(c, G, d.pts[i][0], d.pts[i][1], { ms });
      tb.highlight(i, false);
    };
    const steps = [];
    if (d.given === 'pairs') steps.push({
      cap: `First, the table: each input goes on top and its output right below it. The outputs are ${T(d.pts.map((p) => p[1]).join(',\\ '))}.`,
      run: async (c) => { for (let i = 0; i < n; i++) { tb.highlight(i, true); await fly(c, stage, T(dvT(d.pts[i][1])), rel(stage, S.slots[i].sy), rel(stage, tb.cell(i, 1)), 520); await tb.reveal(i, 1, c); tb.highlight(i, false); } }
    });
    const [x0, y0] = d.pts[0];
    steps.push({ cap: `Plot ${T(prC(x0, y0))}: start at the origin, go <b>right</b> ${x0} (the input), then <b>up</b> ${y0} (the output). Draw a dot.`,
      run: async (c) => { await pulse(c, G.point(0, 0, { color: 'ink', r: 5 }), 1.6); await plot(c, 0, 700); await showLine(c, N, `${T(prC(x0, y0))}: right ${x0}, up ${y0}`); } });
    steps.push({ cap: `${T(prC(d.pts[1][0], d.pts[1][1]))}: right ${d.pts[1][0]}, up ${d.pts[1][1]}.`,
      run: async (c) => { await plot(c, 1, 520); await showLine(c, N, `${T(prC(d.pts[1][0], d.pts[1][1]))}: right ${d.pts[1][0]}, up ${d.pts[1][1]}`); } });
    steps.push({ cap: `${T(prC(d.pts[2][0], d.pts[2][1]))} and ${T(prC(d.pts[3][0], d.pts[3][1]))} the same way. One point for each ordered pair.`,
      run: async (c) => { for (const i of [2, 3]) { await plot(c, i, 420); await showLine(c, N, `${T(prC(d.pts[i][0], d.pts[i][1]))}: right ${d.pts[i][0]}, up ${d.pts[i][1]}`); } if (last) G.remove(...last.trail); last = null; } });
    steps.push({ cap: `${n} pairs, ${n} points. Each step of 1 to the right, the points go up ${dys[0]}: they climb steadily.`,
      run: async (c) => {
        for (let i = 0; i < n - 1; i++) {
          const [xa, ya] = d.pts[i], [xb, yb] = d.pts[i + 1];
          const a = G.segment([xa, ya], [xb, ya], { color: 'gray', width: 3 }), b = G.segment([xb, ya], [xb, yb], { color: DV, width: 4 });
          await G.drawIn(a, 260, c); await G.drawIn(b, 260, c);
          await fadeIn(c, G.label(xb, (ya + yb) / 2, '+' + (yb - ya), { pos: 'e', cls: 'bk-ptlab', color: DV }));
        }
      } });
    return steps;
  }
};

/* =====================================================================================
 * 6. orderMatters — (2, 5) and (5, 2) are different points. */
const orderMatters = {
  title: 'Does the order matter?',
  height: 420,
  minW: 860,
  intro: 'Same two numbers, 2 and 5, in a different order. Same point? Press <b>Next</b>.',
  make(stage, v, ex) {
    const W = ex.W;
    const G = new Graph(stage, { x: W - 420, y: 6, width: 410, height: 408, xmin: 0, xmax: 6, ymin: 0, ymax: 6, xtitle: ivT('x'), ytitle: dvT('y') });
    const N = panel(stage, 14, 14, W - 460, 392, '', 'u5l3-notes u5l3-big');
    let w1, w2;
    return [
      { cap: `Plot ${T(pr(2, 5))}: right 2, up 5.`,
        run: async (c) => { w1 = await walk(c, G, 2, 5, { pos: 'ne' }); await showLine(c, N, `${T(prC(2, 5))}: right 2, up 5`); } },
      { cap: `Now swap the numbers: ${T(pr(5, 2))} means right 5, up 2.`,
        run: async (c) => { G.remove(...w1.trail); w2 = await walk(c, G, 5, 2, { color: RED, pos: 'ne' }); await showLine(c, N, `${T(prC(5, 2))}: right 5, up 2`); } },
      { cap: `Two <b>different</b> points! Swapping the numbers moves the point.`,
        run: async (c) => { G.remove(...w2.trail); await Promise.all([pulse(c, w1.p, 1.4), pulse(c, w2.p, 1.4)]); const l = await showLine(c, N, `${T('(2,\\ 5)\\neq(5,\\ 2)')}`); const s = stamp(l, 'not the same point', { ok: false, size: 'sm', rotate: -4 }); s.style.marginLeft = '12px'; await stampIn(c, s); } },
      { cap: `In a story the meaning changes too: ${T(pr(2, 5))} says 2 boxes cost $5, but ${T(pr(5, 2))} says 5 boxes cost $2. The <b>input always goes first</b>.`,
        run: async (c) => { await showLine(c, N, `${T(pr(2, 5))}: 2 boxes cost $5`); await showLine(c, N, `${T(pr(5, 2))}: 5 boxes cost $2`); await showLine(c, N, '<b>Input first, output second.</b>', 'u5l3-strong'); } }
    ];
  }
};

/* =====================================================================================
 * 7. threeViews — one relation travels from picture to picture (a conveyor, as in Math 10C u5l2's sixViews). */
const TV = {
  cups: { label: 'Stacking cups', iv: 'n', dv: 'h', words: `A stack of paper cups: ${ivB(T('n') + ' cups')} stand ${dvB(T('h') + ' cm')} tall. One cup is 10 cm; each extra cup adds 2 cm.`,
    xs: [1, 2, 3, 4], f: (x) => 8 + 2 * x, order: ['table', 'map', 'pairs', 'graph'], win: { xmin: 0, xmax: 5, ymin: 0, ymax: 18, ylabels: 2 } },
  ex5: { label: 'Example 5', iv: 'A', dv: 'B', words: `The mapping diagram shows a relation between two sets of numbers, ${T(ivT('A'))} and ${T(dvT('B'))}.`,
    xs: [2, 4, 6, 8], f: (x) => 2 * x + 1, order: ['map', 'pairs', 'table', 'graph'], win: { xmin: 0, xmax: 9, ymin: 0, ymax: 18, xlabels: 2, ylabels: 2 } }
};
const VNAME = { map: 'Mapping diagram', pairs: 'Ordered pairs', table: 'Table of values', graph: 'Graph' };
const threeViews = {
  title: 'One relation, every picture',
  height: 470,
  minW: 860,
  choices: [{ v: 'cups', label: TV.cups.label }, { sep: 'Example check:' }, { v: 'ex5', label: TV.ex5.label }],
  intro: (k) => `Watch the <b>same four pairs</b> travel from picture to picture. Press <b>Next</b>.`,
  make(stage, k, ex) {
    const d = TV[k], W = ex.W, H = 470, n = d.xs.length, ys = d.xs.map(d.f);
    const tw = Math.floor((W - 32 - 3 * 10) / 4);
    const tabs = d.order.map((t, i) => add(stage, box(h('div', 'u5l3-tab4', `<b>${i + 1}</b>${VNAME[t]}`), tw, 38), 16 + i * (tw + 10), 8));
    const setTab = (i) => tabs.forEach((t, j) => { t.classList.toggle('on', j === i); t.classList.toggle('done', j < i || i > 3); });
    const words = add(stage, box(h('div', 'u5l3-words', `<div>${d.words}</div>`), W - 32, 52), 16, 54);
    const y0 = 116, wv = Math.floor((W - 48) / 2), hv = H - y0 - 8, xL = 16, xR = 32 + wv, dx = xR - xL;
    const mk = (x, t) => { const el = add(stage, box(h('div', 'u5l3-view', `<div class="u5l3-vt">${VNAME[t]}</div>`), wv, hv), x, y0); el.style.opacity = 0; return { el, body: el.appendChild(h('div', 'u5l3-vb')) }; };
    const V = {};
    d.order.forEach((t, i) => (V[t] = mk(i === 0 ? xL : xR, t)));
    // views: x / y element for pair i
    const tb = new ValueTable(V.table.body, { headers: [ivT(d.iv), dvT(d.dv)], rows: d.xs.map((x, i) => [x, ys[i]]), layout: 'h', cellW: Math.min(78, Math.floor((wv - 90) / n)), cellH: 60, headW: 56, hide: () => d.order[0] !== 'table', tap: false, q: '', cls: 'u5l3-ctab' });
    const M = new MappingDiagram(V.map.body, { width: wv - 30, height: hv - 50, domain: d.xs, range: ys, pairs: d.xs.map((x, i) => [x, ys[i]]), titles: [T(ivT(d.iv)), T(dvT(d.dv))], arrows: d.order[0] === 'map', cls: 'u5l3-map', color: IV });
    M.itemEls[0].forEach((e) => { e.style.color = IV; if (d.order[0] !== 'map') e.style.opacity = 0; }); M.itemEls[1].forEach((e) => { e.style.color = DV; if (d.order[0] !== 'map') e.style.opacity = 0; });
    const S = pairSet(V.pairs.body, n, d.iv, d.dv, 'u5l3-pset-big');
    const G = new Graph(V.graph.body, Object.assign({ width: wv - 16, height: hv - 40, xtitle: ivT(d.iv), ytitle: dvT(d.dv), fontSize: 16 }, d.win));
    const pts = d.xs.map((x, i) => { const p = G.point(x, ys[i], { color: PT, r: 6 }); p.style.opacity = 0; return p; });
    const src = {
      map: (i) => [M.item('d', d.xs[i]), M.item('r', ys[i])],
      pairs: (i) => [S.slots[i].sx, S.slots[i].sy],
      table: (i) => [tb.cell(i, 0), tb.cell(i, 1)]
    };
    const fill = {
      map: async (c, i) => { M.item('d', d.xs[i]).style.opacity = 1; M.item('r', ys[i]).style.opacity = 1; },
      pairs: async (c, i) => { S.fillSlot(i, d.xs[i], ys[i]); await pop(c, S.slots[i].p, 260); },
      table: async (c, i) => { await tb.reveal(i, 0, c); await tb.reveal(i, 1, c); }
    };
    const into = async (c, from, to) => {
      for (let i = 0; i < n; i++) {
        const [a, b] = src[from](i);
        if (to === 'graph') {
          a.classList.add('u5l3-glow'); b.classList.add('u5l3-glow');
          await fly(c, stage, '<b class="u5l3-dot"></b>', rel(stage, b), rel(stage, pts[i].querySelector('circle')), 480);
          await G.reveal(pts[i], c, 240); a.classList.remove('u5l3-glow'); b.classList.remove('u5l3-glow');
          continue;
        }
        const [ta, tb2] = to === 'map' ? [M.item('d', d.xs[i]), M.item('r', ys[i])] : to === 'pairs' ? [S.slots[i].sx, S.slots[i].sy] : [tb.cell(i, 0), tb.cell(i, 1)];
        await Promise.all([fly(c, stage, T(ivT(d.xs[i])), rel(stage, a), rel(stage, ta), 520), fly(c, stage, T(dvT(ys[i])), rel(stage, b), rel(stage, tb2), 520)]);
        await fill[to](c, i);
      }
      if (to === 'map') await M.drawArrows(c, { stagger: 60, ms: 360 });
      if (to === 'pairs') S.el.classList.add('on');
    };
    const slide = (c, v) => anim(c, v.el, [{ transform: 'translateX(0px)' }, { transform: `translateX(${-dx}px)` }], 650);
    const CAP = {
      map: (f) => `<b>Mapping diagram</b> from the ${f === 'table' ? 'table' : 'pairs'}: inputs in the left oval, outputs in the right, one arrow per pair.`,
      pairs: (f) => (f === 'map' ? `<b>Ordered pairs:</b> follow each arrow. Input first, output second.` : `<b>Ordered pairs:</b> each arrow becomes one pair ${T(prC(d.iv, d.dv))}.`),
      table: (f) => `<b>Table of values:</b> each pair becomes one column. Inputs on top, outputs below.`,
      graph: (f) => `<b>Graph:</b> each ${f === 'table' ? 'column' : 'pair'} becomes one point. Right by ${T(ivT(d.iv))}, up by ${T(dvT(d.dv))}.`
    };
    const first = d.order[0];
    const steps = [{
      cap: first === 'map' ? `Start with the <b>mapping diagram</b>: ${d.xs.map((x, i) => T(`${x}\\to ${ys[i]}`)).join(', ')}.` : `Start with a <b>table of values</b>: cups on top, height below.`,
      run: async (c) => { setTab(0); await fadeIn(c, V[first].el); }
    }];
    for (let s = 1; s < 4; s++) {
      const from = d.order[s - 1], to = d.order[s];
      steps.push({ cap: CAP[to](from), run: async (c) => {
        setTab(s);
        if (s > 1) await Promise.all([fadeOut(c, V[d.order[s - 2]].el), slide(c, V[from])]);
        await fadeIn(c, V[to].el); await into(c, from, to);
      } });
    }
    steps.push({ cap: `Arrows, pairs, columns, points: the <b>same four ordered pairs</b> every time. So every picture shows the same relation.`,
      run: async (c) => { setTab(4); const s = stamp(V.graph.el, 'Same relation', { ok: true, x: wv - 120, y: hv - 96 }); await stampIn(c, s); } });
    return steps;
  }
};

/* =====================================================================================
 * 8. oddOneOut — three pictures should match the pairs; one has a mistake. */
const OO = {
  p1: { label: 'Puzzle 1', pts: [[2, 3], [4, 6], [6, 9], [8, 12]], bad: 'map', win: { xmin: 0, xmax: 9, ymin: 0, ymax: 13, ylabels: 3, xlabels: 2 } },
  p2: { label: 'Puzzle 2', pts: [[1, 10], [2, 8], [3, 6], [4, 4]], bad: 'graph', win: { xmin: 0, xmax: 7, ymin: 0, ymax: 11, ylabels: 2 } }
};
const oddOneOut = {
  title: 'Which picture doesn’t match?',
  height: 470,
  minW: 900,
  choices: Object.keys(OO).map((k) => ({ v: k, label: OO[k].label })),
  intro: 'Guess first: which picture doesn’t match the ordered pairs? Then press <b>Next</b> to check.',
  make(stage, k, ex) {
    const d = OO[k], W = ex.W, n = d.pts.length, xs = d.pts.map((p) => p[0]), ys = d.pts.map((p) => p[1]);
    const top = panel(stage, 14, 8, W - 28, 66, '', 'u5l3-ref');
    top.innerHTML = `<div class="u5l3-refh">The relation</div><div class="u5l3-refv">${T(`\\{${d.pts.map((p) => prC(p[0], p[1])).join(',\\ ')}\\}`)}</div>`;
    const pw = Math.floor((W - 28 - 20) / 3), ph = 376, py = 86, X = (i) => 14 + i * (pw + 10);
    const P = ['Table', 'Mapping diagram', 'Graph'].map((t, i) => panel(stage, X(i), py, pw, ph, t, 'u5l3-op'));
    const tb = new ValueTable(P[0], { headers: ['x', 'y'], rows: d.pts.map((p) => p.slice()), cellW: 80, cellH: 54, tap: false });
    tb.el.style.alignSelf = 'center'; tb.el.style.marginTop = '14px';
    const bad = d.bad === 'map' ? [[6, 12], [8, 9]] : null;
    const mpairs = d.pts.map((p) => (bad && p[0] === 6 ? [6, 12] : bad && p[0] === 8 ? [8, 9] : p));
    const M = new MappingDiagram(P[1], { width: pw - 24, height: 300, domain: xs, range: ys, pairs: mpairs, titles: [T('x'), T('y')], cls: 'u5l3-map u5l3-map-sm', color: 'ink' });
    const G = new Graph(P[2], Object.assign({ width: pw - 20, height: 316, fontSize: 15 }, d.win));
    const gp = d.pts.map((p) => (d.bad === 'graph' && p[0] === 3 ? [6, 3] : p));
    const dots = gp.map((p) => G.point(p[0], p[1], { color: 'ink', r: 6 }));
    const verdict = async (c, i, ok) => { const s = stamp(P[i], ok ? '✓' : '✗', { ok, x: pw - 40, y: 26 }); await stampIn(c, s); };
    const steps = [
      { cap: `The ordered pairs are the truth. Check each picture against them, one pair at a time.`,
        run: async (c) => { await pulse(c, top, 1.03); } },
      { cap: `<b>Table:</b> read across each row: ${d.pts.map((p) => T(pr(p[0], p[1]))).join(', ')}. All four match. ✓`,
        run: async (c) => { for (let i = 0; i < n; i++) { tb.highlight(i, true); await sleep(c, 260); tb.highlight(i, false); } await verdict(c, 0, true); } }
    ];
    if (d.bad === 'map') steps.push({
      cap: `<b>Mapping diagram:</b> ${T('2\\to3')} ✓, ${T('4\\to6')} ✓, but ${T('6\\to12')} and ${T('8\\to9')}? The pairs say ${T(pr(6, 9))} and ${T(pr(8, 12))}. ✗`,
      run: async (c) => { for (let i = 0; i < n; i++) { const a = M.arrow(i); const wrong = i >= 2; a.style.color = wrong ? RED : OK; await pulse(c, a, 1.04, 300); } await verdict(c, 1, false); } });
    else steps.push({
      cap: `<b>Mapping diagram:</b> ${d.pts.map((p) => T(`${p[0]}\\to ${p[1]}`)).join(', ')}. All four match. ✓`,
      run: async (c) => { for (let i = 0; i < n; i++) { const a = M.arrow(i); a.style.color = OK; await pulse(c, a, 1.04, 300); } await verdict(c, 1, true); } });
    if (d.bad === 'graph') steps.push({
      cap: `<b>Graph:</b> ${T(pr(1, 10))}, ${T(pr(2, 8))}, ${T(pr(4, 4))} are there, but where is ${T(pr(3, 6))}? There is a point at ${T(pr(6, 3))} instead: the numbers were swapped. ✗`,
      run: async (c) => { for (let i = 0; i < n; i++) { const wrong = i === 2; dots[i].style.color = wrong ? RED : OK; dots[i].querySelectorAll('circle').forEach((e) => (e.style.fill = wrong ? RED : OK)); await pulse(c, dots[i], 1.5, 300); } await verdict(c, 2, false); } });
    else steps.push({
      cap: `<b>Graph:</b> ${d.pts.map((p) => T(pr(p[0], p[1]))).join(', ')} are all there. All four points match. ✓`,
      run: async (c) => { for (let i = 0; i < n; i++) { dots[i].querySelectorAll('circle').forEach((e) => (e.style.fill = OK)); await pulse(c, dots[i], 1.5, 300); } await verdict(c, 2, true); } });
    steps.push(d.bad === 'map'
      ? { cap: `Fix the mapping diagram: arrows ${T('6\\to9')} and ${T('8\\to12')}. Now all three pictures show the same relation.`,
        run: async (c) => { [2, 3].forEach((i) => (M.arrow(i).style.display = 'none')); for (const p of [[6, 9], [8, 12]]) { const g = M._arrow(p, 9); g.style.color = OK; await drawIn(g, 450, c); } } }
      : { cap: `Fix the graph: move the point to ${T(pr(3, 6))}, right 3 and up 6. Now all three pictures show the same relation.`,
        run: async (c) => { const p = dots[2]; await G.move(c, p, 3, 6, 700); p.querySelectorAll('circle').forEach((e) => (e.style.fill = OK)); } });
    return steps;
  }
};

/* =====================================================================================
 * static figures on the cards */
function mountFigures() {
  const td = document.getElementById('tdemo');
  if (td) new ValueTable(td, { headers: [ivT('x'), dvT('y')], rows: [[1, 5], [2, 10], [3, 15]], layout: 'h', cellW: 72, cellH: 52, headW: 60, tap: false, cls: 'u5l3-ctab' });
  const t2 = document.getElementById('ex2-tab');
  if (t2) new ValueTable(t2, { headers: ['t', 'W'], rows: [[1, 3], [2, 6], [3, 9], [4, 12]], layout: 'h', cellW: 70, cellH: 50, headW: 60, tap: false });
  const t3 = document.getElementById('ex3-tab');
  if (t3) new ValueTable(t3, { headers: ['c', 'L'], rows: [[2, 8], [3, 12], [4, 16], [5, 20]], layout: 'h', cellW: 70, cellH: 50, headW: 60, tap: false });
  const tag = (el, id) => { el.setAttribute('data-show', id); return el; };
  const m3 = document.getElementById('ex3-map');
  if (m3) {
    const M = new MappingDiagram(m3, { width: 400, height: 340, domain: [2, 3, 4, 5], range: [8, 12, 16, 20], pairs: [[2, 8], [3, 12], [4, 16], [5, 20]], titles: ['Inputs', 'Outputs'], color: 'red' });
    M.itemEls.flat().forEach((e) => { e.style.color = RED; tag(e, 'ex3b'); }); M.arrowEls.forEach((a) => tag(a, 'ex3b'));
  }
  const red = (v, id) => ({ html: `<span class="u5l3-red" data-show="${id}">${T(String(v))}</span>` });
  const t4 = document.getElementById('ex4-tab');
  if (t4) new ValueTable(t4, { headers: ['x', 'y'], rows: [[1, red(5, 'ex4')], [2, red(7, 'ex4')], [3, red(9, 'ex4')], [4, red(11, 'ex4')]], layout: 'h', cellW: 76, cellH: 60, headW: 56, tap: false });
  const g4 = document.getElementById('ex4-grid');
  if (g4) {
    const G = new Graph(g4, { width: 420, height: 470, xmin: 0, xmax: 10, ymin: 0, ymax: 14, xlabels: 2, ylabels: 2 });
    [[1, 5], [2, 7], [3, 9], [4, 11]].forEach(([x, y]) => tag(G.point(x, y, { color: 'red', r: 6 }), 'ex4'));
  }
  const m5 = document.getElementById('ex5-map');
  if (m5) new MappingDiagram(m5, { width: 250, height: 280, domain: [2, 4, 6, 8], range: [5, 9, 13, 17], pairs: [[2, 5], [4, 9], [6, 13], [8, 17]], titles: [T('A'), T('B')], color: 'ink', cls: 'u5l3-map' });
  const t5 = document.getElementById('ex5-tab');
  if (t5) new ValueTable(t5, { headers: ['A', 'B'], rows: [[2, 5], [4, 9], [6, 13], [8, 17]].map(([a, b]) => [red(a, 'ex5b'), red(b, 'ex5b')]), layout: 'h', cellW: 76, cellH: 58, headW: 56, tap: false });
  const g5 = document.getElementById('ex5-grid');
  if (g5) {
    const G = new Graph(g5, { width: 400, height: 470, xmin: 0, xmax: 9, ymin: 0, ymax: 18, xlabels: 2, ylabels: 2, xtitle: 'A', ytitle: 'B' });
    [[2, 5], [4, 9], [6, 13], [8, 17]].forEach(([x, y]) => tag(G.point(x, y, { color: 'red', r: 6 }), 'ex5c'));
  }
  // answers that belong to one part but live in a figure
  const sync = (p) => { const on = p.classList.contains('shown'); document.querySelectorAll(`[data-show="${p.dataset.part}"]`).forEach((e) => e.classList.toggle('u5l3-on', on)); };
  document.querySelectorAll('.part[data-part]').forEach((p) => { new MutationObserver(() => sync(p)).observe(p, { attributes: true, attributeFilter: ['class'] }); sync(p); });
}

/* =====================================================================================
 * warm-up: Who's Connected? — tap a friend, then a pet, to draw an arrow */
const FRIENDS = [['Ava', 'A', '#e79a8f'], ['Ben', 'B', '#9cbfe8'], ['Cy', 'C', '#a8cf9f'], ['Dev', 'D', '#e5c07a']];
const PETNAMES = ['dog', 'fish', 'bird', 'cat', 'turtle'];
const GIVEN = [['Ava', 'cat'], ['Ben', 'dog']], SOLN = [['Ava', 'fish'], ['Cy', 'turtle'], ['Dev', 'bird']];
function mountWarm() {
  const host = document.getElementById('petmap'); if (!host) return;
  const W = 540, H = 340, xl = 120, xr = 410, cy = 186;
  host.innerHTML = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" aria-hidden="true">
    <ellipse cx="${xl}" cy="${cy}" rx="96" ry="148" fill="#e8f0fc" stroke="#1e2d46" stroke-width="2.5"/>
    <ellipse cx="${xr}" cy="${cy}" rx="110" ry="148" fill="#fff6dc" stroke="#c88c14" stroke-width="2.5"/>
    <text x="${xl}" y="26" text-anchor="middle" class="u5l3-ovt">Friends</text><text x="${xr}" y="26" text-anchor="middle" class="u5l3-ovt">Pets</text>
    <g class="u5l3-arrows"></g></svg>`;
  const gA = host.querySelector('.u5l3-arrows');
  const fy = (i) => 96 + i * 62, py = (i) => 76 + i * 55;
  const fBtn = FRIENDS.map(([n, l, colr], i) => { const b = add(host, h('button', 'u5l3-fr', `<i style="background:${colr}">${l}</i>${n}`), xl - 62, fy(i) - 22); b.type = 'button'; b.dataset.n = n; return b; });
  const pBtn = PETNAMES.map((p, i) => { const b = add(host, h('button', 'u5l3-pet', `${petSvg(p, 38)}<span>${p}</span>`), xr - 70, py(i) - 22); b.type = 'button'; b.dataset.p = p; return b; });
  let arrows = GIVEN.map((a) => a.slice()), sel = null;
  const count = document.getElementById('petcount');
  const draw = () => {
    gA.innerHTML = '';
    arrows.forEach(([f, p]) => {
      const i = FRIENDS.findIndex((x) => x[0] === f), j = PETNAMES.indexOf(p);
      const x1 = xl + 58, y1 = fy(i), x2 = xr - 76, y2 = py(j), L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L, bx = x2 - 14 * ux, by = y2 - 14 * uy;
      const given = GIVEN.some((a) => a[0] === f && a[1] === p), colr = given ? RED : PT;
      const g = svgEl('g', { class: 'u5l3-pa' + (given ? ' given' : ''), 'data-f': f }, gA); g.style.color = colr;
      svgEl('path', { d: `M${x1} ${y1}L${bx} ${by}`, stroke: 'currentColor', 'stroke-width': 4, 'stroke-linecap': 'round', fill: 'none' }, g);
      svgEl('path', { d: `M${x2} ${y2}L${bx - 8 * uy} ${by + 8 * ux}L${bx + 8 * uy} ${by - 8 * ux}Z`, fill: 'currentColor' }, g);
    });
    if (count) count.textContent = arrows.length + ' arrows';
  };
  const setSel = (n) => { sel = n; fBtn.forEach((b) => b.classList.toggle('on', b.dataset.n === n)); };
  fBtn.forEach((b) => b.addEventListener('click', () => setSel(sel === b.dataset.n ? null : b.dataset.n)));
  pBtn.forEach((b) => b.addEventListener('click', () => {
    if (!sel) { pulse(null, b); return; }
    const p = b.dataset.p, k = arrows.findIndex((a) => a[0] === sel && a[1] === p);
    if (k >= 0) { if (!GIVEN.some((a) => a[0] === sel && a[1] === p)) arrows.splice(k, 1); } else arrows.push([sel, p]);
    setSel(null); draw();
  }));
  const reset = document.getElementById('petreset');
  if (reset) reset.addEventListener('click', () => { arrows = GIVEN.map((a) => a.slice()); setSel(null); draw(); host.classList.remove('ava', 'ben'); });
  draw();
  const watch = (id, fn) => { const el = document.getElementById(id); if (!el) return; new MutationObserver(() => fn(el.classList.contains('shown'))).observe(el, { attributes: true, attributeFilter: ['class'] }); };
  watch('wq1', (on) => host.classList.toggle('ben', on));
  watch('wq2', (on) => { if (on) { SOLN.forEach((s) => { if (!arrows.some((a) => a[0] === s[0] && a[1] === s[1])) arrows.push(s.slice()); }); arrows = arrows.filter((a) => GIVEN.concat(SOLN).some((s) => s[0] === a[0] && s[1] === a[1])); draw(); } });
  watch('wq3', (on) => host.classList.toggle('ava', on));

  /* the big one: Mia's and Jo's packs → cards */
  const mj = document.getElementById('mj'); if (!mj) return;
  const MW = 390, MH = 186, top = 34, ry = 66, mcy = top + ry + 6;
  mj.innerHTML = `<svg viewBox="0 0 ${MW} ${MH}" width="${MW}" height="${MH}" aria-hidden="true">${[0, 1].map((s) => {
    const x0 = s * 200; return `<ellipse cx="${x0 + 34}" cy="${mcy}" rx="26" ry="${ry + 8}" fill="#fff" stroke="#1e2d46" stroke-width="2"/><ellipse cx="${x0 + 152}" cy="${mcy}" rx="30" ry="${ry + 8}" fill="#fff" stroke="#1e2d46" stroke-width="2"/><text x="${x0 + 93}" y="20" text-anchor="middle" class="u5l3-ovt">${s ? 'Jo' : 'Mia'}</text>`;
  }).join('')}<g class="mj-a"></g><g class="mj-t"></g></svg>`;
  const gT = mj.querySelector('.mj-t'), gM = mj.querySelector('.mj-a');
  const yk = (k) => mcy - 1.5 * 34 + k * 34;
  const mia = { L: [1, 2, 3, 4], R: [5, 10, 15, 20] }, jo = { L: [3, 1, 4, 2], R: [20, 15, 5, 10] };
    const txt = (x, y, s) => `<text x="${x}" y="${y + 7}" text-anchor="middle" class="u5l3-mjn">${s}</text>`;
  const render = (posL, posR) => {
    let t = '', a = '';
    mia.L.forEach((v, k) => { t += txt(34, yk(k), v); }); mia.R.forEach((v, k) => { t += txt(152, yk(k), v); });
    jo.L.forEach((v, k) => { t += txt(234, posL[k], v); }); jo.R.forEach((v, k) => { t += txt(352, posR[k], v); });
    const arr = (x1, y1, x2, y2, colr) => { const L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L, bx = x2 - 9 * ux, by = y2 - 9 * uy; return `<path d="M${x1} ${y1}L${bx} ${by}" stroke="${colr}" stroke-width="2.6" fill="none"/><path d="M${x2} ${y2}L${bx - 5 * uy} ${by + 5 * ux}L${bx + 5 * uy} ${by - 5 * ux}Z" fill="${colr}"/>`; };
    mia.L.forEach((v, k) => { a += arr(48, yk(k), 132, yk(k), '#1e2d46'); });
    jo.L.forEach((v, k) => { const j = jo.R.indexOf(5 * v); a += arr(248, posL[k], 332, posR[j], RED); });
    gT.innerHTML = t; gM.innerHTML = a;
  };
  const yNow = { L: jo.L.map((v, k) => yk(k)), R: jo.R.map((v, k) => yk(k)) };
  render(yNow.L, yNow.R);
  const ub = document.getElementById('untangle');
  let tidy = false;
  if (ub) ub.addEventListener('click', () => {
    tidy = !tidy;
    const toL = jo.L.map((v, k) => yk(tidy ? v - 1 : k)), toR = jo.R.map((v, k) => yk(tidy ? v / 5 - 1 : k));
    const fromL = yNow.L.slice(), fromR = yNow.R.slice(), t0 = performance.now(), ms = 1100;
    ub.textContent = tidy ? 'Tangle it again' : 'Untangle Jo’s';
    const tick = (now) => {
      const u = Math.min(1, (now - t0) / ms), e = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
      yNow.L = fromL.map((y, k) => y + (toL[k] - y) * e); yNow.R = fromR.map((y, k) => y + (toR[k] - y) * e);
      render(yNow.L, yNow.R); if (u < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

mountFigures();
mountWarm();
export const explainers = mountExplainers({ vending, tableRead, buildMap, untangleEx, plotPairs, orderMatters, threeViews, oddOneOut });

/* ============ Stand Up Break! — one relation, four pictures (lessons/js/standup.js) ============ */
const SU_VARS = [['n', 'C'], ['t', 'd'], ['x', 'y'], ['h', 'P'], ['p', 'q'], ['m', 'L'], ['a', 'b'], ['s', 'W'], ['k', 'T'], ['r', 'A']];
const SU_CTX = [ // { s: the rule in words, X/xw: input, Y/yw: output, k: output per one input }
  { s: 'Pencils cost $2 each.', X: 'n', xw: 'the number of pencils', Y: 'C', yw: 'the total cost, in dollars', k: 2 },
  { s: 'Bags of chips cost $3 each.', X: 'b', xw: 'the number of bags', Y: 'C', yw: 'the total cost, in dollars', k: 3 },
  { s: 'A part-time job pays $15 per hour.', X: 'h', xw: 'the hours worked', Y: 'P', yw: 'the pay, in dollars', k: 15 },
  { s: 'Each car in a parking lot has 4 wheels.', X: 'c', xw: 'the number of cars', Y: 'W', yw: 'the total wheels', k: 4 },
  { s: 'Each spider has 8 legs.', X: 's', xw: 'the number of spiders', Y: 'L', yw: 'the total legs', k: 8 },
  { s: 'Each week has 7 days.', X: 'w', xw: 'the number of weeks', Y: 'D', yw: 'the number of days', k: 7 },
  { s: 'A carton holds 12 eggs.', X: 'c', xw: 'the number of cartons', Y: 'E', yw: 'the total eggs', k: 12 },
  { s: 'Stickers come in packs of 5.', X: 'p', xw: 'the number of packs', Y: 'S', yw: 'the total stickers', k: 5 },
  { s: 'A dog walker earns $10 per dog.', X: 'd', xw: 'the number of dogs walked', Y: 'P', yw: 'the pay, in dollars', k: 10 },
  { s: 'Each hexagon has 6 sides.', X: 'h', xw: 'the number of hexagons', Y: 'S', yw: 'the total sides', k: 6 },
  { s: 'Each tricycle has 3 wheels.', X: 't', xw: 'the number of tricycles', Y: 'W', yw: 'the total wheels', k: 3 },
  { s: 'Each minute has 60 seconds.', X: 'm', xw: 'the number of minutes', Y: 'S', yw: 'the number of seconds', k: 60 }
];
const suTab = (X, Y, xs, ys) => `\\begin{array}{|c|${xs.map(() => 'c').join('|')}|}\\hline ${X} & ${xs.join(' & ')}\\\\ \\hline ${Y} & ${ys.join(' & ')}\\\\ \\hline\\end{array}`;
const suSet = (xs, ys) => `\\{${xs.map((x, i) => pr(x, ys[i])).join(',\\ ')}\\}`;
function suMapFig(L, R, links, nl, nr) { // a small mapping diagram (SVG)
  const n = Math.max(L.length, R.length), gap = 46, H = 70 + gap * n, cy = 46 + gap * n / 2, xl = 95, xr = 315, ink = '#1c2230', cc = '#1f5aa8';
  const yAt = (k, m) => cy + (k - (m - 1) / 2) * gap;
  let s = `<rect x="0" y="0" width="410" height="${H}" rx="10" fill="#fff"/>`;
  [[xl, L, nl], [xr, R, nr]].forEach(([x, vals, nm]) => {
    s += `<ellipse cx="${x}" cy="${cy}" rx="58" ry="${gap * n / 2 + 16}" fill="#f3efe7" stroke="${ink}" stroke-width="2"/>`;
    s += `<text x="${x}" y="24" text-anchor="middle" font-style="italic" font-size="24">${nm}</text>`;
    vals.forEach((v, k) => { s += `<text x="${x}" y="${yAt(k, vals.length) + 8}" text-anchor="middle" font-size="23">${v}</text>`; });
  });
  links.forEach(([i, j]) => {
    const x1 = xl + 30, y1 = yAt(i, L.length), x2 = xr - 30, y2 = yAt(j, R.length);
    const L2 = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L2, uy = (y2 - y1) / L2, bx = x2 - 13 * ux, by = y2 - 13 * uy;
    s += `<line x1="${x1}" y1="${y1}" x2="${bx}" y2="${by}" stroke="${cc}" stroke-width="2.6"/><path d="M${x2} ${y2}L${(bx - 6 * uy).toFixed(1)} ${(by + 6 * ux).toFixed(1)}L${(bx + 6 * uy).toFixed(1)} ${(by - 6 * ux).toFixed(1)}Z" fill="${cc}"/>`;
  });
  return `<svg viewBox="0 0 410 ${H}" width="410" role="img" aria-label="mapping diagram" font-family="KaTeX_Main, 'Times New Roman', serif" fill="${ink}">${s}</svg>`;
}
function suGraphFig(pts, xmax, ymax, ystep, X, Y) { // a small first-quadrant grid with points (SVG)
  const w = 380, hh = 330, l = 46, b = 40, t = 18, r = 24, ux = (w - l - r) / xmax, uy = (hh - t - b) / ymax, ink = '#1c2230';
  const px = (x) => l + x * ux, py = (y) => hh - b - y * uy;
  let s = `<rect x="0" y="0" width="${w}" height="${hh}" rx="10" fill="#fff"/>`;
  for (let x = 1; x <= xmax; x++) s += `<path d="M${px(x)} ${py(0)}V${py(ymax)}" stroke="#e2ddd1" stroke-width="1.2"/>`;
  for (let y = ystep; y <= ymax; y += ystep) s += `<path d="M${px(0)} ${py(y)}H${px(xmax)}" stroke="#e2ddd1" stroke-width="1.2"/>`;
  s += `<path d="M${px(0)} ${py(0)}H${px(xmax) + 12}M${px(0)} ${py(0)}V${py(ymax) - 10}" stroke="${ink}" stroke-width="2.4"/>`;
  for (let x = 1; x <= xmax; x++) s += `<text x="${px(x)}" y="${py(0) + 24}" text-anchor="middle" font-size="17">${x}</text>`;
  for (let y = ystep * 2; y <= ymax; y += ystep * 2) s += `<text x="${px(0) - 8}" y="${py(y) + 6}" text-anchor="end" font-size="17">${y}</text>`;
  s += `<text x="${px(xmax) + 14}" y="${py(0) + 6}" font-style="italic" font-size="20">${X}</text><text x="${px(0) + 8}" y="${py(ymax) - 2}" font-style="italic" font-size="20">${Y}</text>`;
  pts.forEach(([x, y]) => { s += `<circle cx="${px(x)}" cy="${py(y)}" r="6.5" fill="#1f5aa8"/>`; });
  return `<svg viewBox="0 0 ${w} ${hh}" width="${w}" role="img" aria-label="graph" font-family="KaTeX_Main, 'Times New Roman', serif" fill="${ink}">${s}</svg>`;
}
const suRule = (r) => { const m = r.int(2, 6), b = r.int(0, 6); return { f: (x) => m * x + b }; };
standup('u5l3', {
  intro: 'At your whiteboard station: the same relation, a different picture. Input first, output second.',
  levels: {
    BEG: (r) => { // words or a table → ordered pairs
      if (r.chance(0.5)) {
        const c = r.pick(SU_CTX), s = r.int(1, 3), xs = [s, s + 1, s + 2, s + 3], ys = xs.map((x) => c.k * x);
        return { q: '', text: `${c.s} Let <i>${c.X}</i> be ${c.xw} and <i>${c.Y}</i> ${c.yw}.<br>Write the relation as a set of ordered pairs (<i>${c.X}</i>, <i>${c.Y}</i>) for <i>${c.X}</i> = ${xs.join(', ')}.`,
          a: [xs.map((x) => `${x}\\times ${c.k}=${c.k * x}`).join(',\\quad '), suSet(xs, ys)] };
      }
      const [X, Y] = r.pick(SU_VARS), f = suRule(r).f, s = r.int(0, 3), st = r.pick([1, 1, 2]), xs = [0, 1, 2, 3].map((i) => s + i * st), ys = xs.map(f);
      return { text: 'Write this relation as a set of ordered pairs. Read straight down each column.', q: suTab(X, Y, xs, ys), a: [`\\text{ordered pairs } (${X},\\ ${Y}):`, suSet(xs, ys)] };
    },
    PRG: (r) => { // a mapping diagram → ordered pairs and a table; or pairs → a mapping diagram
      const [X, Y] = r.pick(SU_VARS), f = suRule(r).f, s = r.int(1, 4), st = r.pick([1, 2, 3]), xs = [0, 1, 2, 3].map((i) => s + i * st).slice(0, r.int(3, 4)), ys = xs.map(f);
      if (r.chance(0.6)) {
        const order = r.chance(0.4) ? r.shuffle(xs.map((_, i) => i)) : xs.map((_, i) => i), R = order.map((i) => ys[i]);
        return { q: '', text: `The mapping diagram shows a relation. (a) Write it as a set of ordered pairs (<i>${X}</i>, <i>${Y}</i>). (b) Complete a table of values.`,
          fig: suMapFig(xs, R, xs.map((_, i) => [i, order.indexOf(i)]), X, Y),
          a: [`\\text{(a) } ${suSet(xs, ys)}`, `\\text{(b) } ${suTab(X, Y, xs, ys)}`] };
      }
      return { text: `Draw a mapping diagram for this relation: inputs in the left oval, outputs in the right oval, then the arrows. Then complete a table of values.`, q: suSet(xs, ys),
        a: [`\\text{left oval: } ${xs.join(',\\ ')}\\qquad \\text{right oval: } ${ys.join(',\\ ')}`, `\\text{arrows: } ${xs.map((x, i) => `${x}\\to ${ys[i]}`).join(',\\ ')}`, suTab(X, Y, xs, ys)] };
    },
    MAS: (r) => { // a graph → pairs, table, mapping diagram; or a table → a graph (with the points as the answer)
      const [X, Y] = r.pick([['x', 'y'], ['n', 'C'], ['t', 'd'], ['A', 'B']]), m = r.int(1, 3), b = r.int(0, 4), f = (x) => m * x + b, s = r.int(0, 2), xs = [0, 1, 2, 3].map((i) => s + i);
      const ys = xs.map(f), ymax = Math.ceil((Math.max(...ys) + 1) / 2) * 2, xmax = Math.max(...xs) + 1;
      if (r.chance(0.5)) return { q: '', text: `The graph shows a relation. Write it as (a) a set of ordered pairs, (b) a table of values and (c) a mapping diagram.`,
        fig: suGraphFig(xs.map((x, i) => [x, ys[i]]), xmax, ymax, 1, X, Y),
        a: [`\\text{(a) } ${suSet(xs, ys)}`, `\\text{(b) } ${suTab(X, Y, xs, ys)}`, `\\text{(c) arrows } ${xs.map((x, i) => `${x}\\to ${ys[i]}`).join(',\\ ')}`] };
      return { text: `Sketch a grid and graph this relation. Then explain why your graph and the table show the same relation.`, q: suTab(X, Y, xs, ys),
        a: [`\\text{points: } ${xs.map((x, i) => pr(x, ys[i])).join(',\\ ')}`, `\\text{each step right 1, up ${m}}`, `\\text{same ordered pairs} \\Rightarrow \\text{same relation}`] };
    }
  }
});
