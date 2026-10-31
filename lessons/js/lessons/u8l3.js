/* Math 15 · Unit 8 · Lesson 3 — Solving Systems by Substitution, Part 1: When a Variable Is Already Isolated.
 * Warm-up "Swap It Out!" (balanced scales: swap a box for the 3 balls it balances; the big one takes two swaps) and the
 * explainers:
 *   swap (the idea: a swap on a balanced scale is a substitution in an equation),
 *   lift (the star: the five steps — find the isolated equation, lift its expression into the OTHER equation in brackets,
 *     solve, back-substitute, the crossing point on the graph),
 *   other (why the OTHER equation: back into itself gives 2x + 1 = 2x + 1, true but useless),
 *   brackets (the number in front multiplies every term in the bracket, minus signs included),
 *   order (x isolated → y comes first; the pair is still (x, y)),
 *   checkBoth (a solution balances BOTH equations; a point on one line only, a sign slip caught by the check),
 *   exact (a graph's estimate vs the exact crossing point).
 * Colours: first (isolated) equation / line blue, second amber, solution purple. */
import {
  h, tex, add, box, place, Graph, stamp, stampIn, mountExplainers, pop, fadeIn, sleep,
  svgEl, liveCtx, pulse, shake, anim, arrowHead, drawIn, COLORS
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(String(s));
const BL = COLORS.blue, AM = COLORS.amber, PU = COLORS.purple, RED = COLORS.red, GRN = COLORS.green;
const EQC = [BL, AM];
const tc = (color, s) => `\\textcolor{${color}}{${s}}`;
const show = (c, el) => fadeIn(c, el, 320);
const panel = (stage, x, y, w, hh, title, cls = '') => add(stage, box(h('div', 'u8l3-panel ' + cls, title ? `<div class="u8l3-ph">${title}</div>` : ''), w, hh), x, y);
const chunk = (s, cls = '') => h('span', 'u8l3-ch' + (cls ? ' ' + cls : ''), T(s));
const bw = (k, s) => `<b style="color:${EQC[k]}">${s}</b>`;
const gone = (el, on = true) => el.classList.toggle('u8l3-gone', on);

/** a row in a work panel: gutter label + math (+ an optional note) */
function wrow(p, gut, t, o = {}) {
  const d = h('div', 'u8l3-row' + (o.cls ? ' ' + o.cls : ''), `<span class="u8l3-gut">${gut || ''}</span>`);
  const m = h('span', 'u8l3-ch' + (o.box ? ' u8l3-resbox' : ''), T(t)); d.appendChild(m);
  if (o.note) d.appendChild(h('span', 'u8l3-why' + (o.ncls ? ' ' + o.ncls : ''), o.note));
  d.m = m; p.appendChild(d); return d;
}
const hidden = (r) => { r.style.opacity = 0; return r; };

/** position of el inside stage (stage px, corrected for any CSS zoom) */
function rel(stage, el) {
  const s = stage.getBoundingClientRect(), r = el.getBoundingClientRect(), k = (s.width / stage.offsetWidth) || 1;
  return { x: (r.left - s.left) / k - stage.clientLeft, y: (r.top - s.top) / k - stage.clientTop, w: r.width / k, h: r.height / k };
}
/** a copy of src lifts out, arcs over and lands on dst (scaled to dst's font size) */
async function fly(c, stage, src, dst, o = {}) {
  const a = rel(stage, src), b = rel(stage, dst);
  const cl = add(stage, h('div', 'u8l3-fly', o.html || src.innerHTML), 0, 0);
  cl.style.fontSize = getComputedStyle(src).fontSize;
  const r0 = rel(stage, cl);
  const sx = a.x + a.w / 2 - (r0.x + r0.w / 2), sy = a.y + a.h / 2 - (r0.y + r0.h / 2);
  const dx = b.x + b.w / 2 - (r0.x + r0.w / 2), dy = b.y + b.h / 2 - (r0.y + r0.h / 2);
  const s = o.scale ?? (parseFloat(getComputedStyle(dst).fontSize) / parseFloat(getComputedStyle(src).fontSize) || 1);
  const mx = (sx + dx) / 2, my = Math.min(sy, dy) - (o.lift ?? 46), sm = ((1 + s) / 2) * 1.12;
  await anim(c, cl, [{ transform: `translate(${sx}px, ${sy}px) scale(1)`, opacity: 0.4 },
    { transform: `translate(${sx}px, ${sy - 14}px) scale(1.12)`, opacity: 1, offset: 0.18 },
    { transform: `translate(${mx}px, ${my}px) scale(${sm})`, opacity: 1, offset: 0.58 },
    { transform: `translate(${dx}px, ${dy}px) scale(${s})`, opacity: 1 }], o.ms || 1200, { easing: 'ease-in-out' });
  cl.remove();
}

/* =============================== balanced scales (warm-up and the "swap" explainer) =============================== */
let SGID = 0;
const ITEM = {
  box: { w: 40, h: 40 }, ball: { w: 24, h: 24 }, w25: { w: 58, h: 46 }, w100: { w: 64, h: 46 },
  nug: { w: 24, h: 14 }, can: { w: 26, h: 34 }, mar: { w: 19, h: 19 }
};
function drawItem(g, type, id) {
  const E = (t, a) => svgEl(t, a, g);
  if (type === 'box') {
    E('rect', { x: -20, y: -34, width: 40, height: 34, rx: 2, fill: '#ffecb3', stroke: '#c88c14', 'stroke-width': 2 });
    E('rect', { x: -3, y: -34, width: 6, height: 34, fill: '#d23c32' });
    E('rect', { x: -20, y: -21, width: 40, height: 6, fill: '#d23c32' });
    E('path', { d: 'M0 -34 C -12 -46 -16 -34 0 -34 C 12 -46 16 -34 0 -34', fill: 'none', stroke: '#d23c32', 'stroke-width': 3 });
  } else if (type === 'ball') {
    E('circle', { cx: 0, cy: -12, r: 12, fill: `url(#${id}b)` });
  } else if (type === 'mar') {
    E('circle', { cx: 0, cy: -9.5, r: 9.5, fill: `url(#${id}m)` });
  } else if (type === 'nug') {
    E('path', { d: 'M-12 0 L11 0 L14 -7 L5 -14 L-8 -13 L-14 -6 Z', fill: '#ebb414', stroke: '#9c6f10', 'stroke-width': 1.2 });
    E('circle', { cx: -3, cy: -9, r: 2.2, fill: '#fff', opacity: 0.75 });
  } else if (type === 'can') {
    E('path', { d: 'M-13 -3 L-13 -31 A13 4 0 0 1 13 -31 L13 -3 A13 4 0 0 1 -13 -3 Z', fill: '#a9afb8', stroke: '#4c566b', 'stroke-width': 1.2 });
    E('ellipse', { cx: 0, cy: -31, rx: 13, ry: 4, fill: '#d5d8de', stroke: '#4c566b', 'stroke-width': 1.2 });
    E('rect', { x: -13, y: -22, width: 26, height: 9, fill: '#d2504a' });
  } else if (type === 'w25' || type === 'w100') {
    const hw = type === 'w100' ? 32 : 29, tw = hw - 7;
    E('path', { d: `M-8 -40 A8 8 0 0 1 8 -40`, fill: 'none', stroke: '#3a4560', 'stroke-width': 4 });
    E('path', { d: `M-${hw} 0 L${hw} 0 L${tw} -38 L-${tw} -38 Z`, fill: '#3a4560', 'stroke-linejoin': 'round' });
    const t = E('text', { x: 0, y: -13, 'text-anchor': 'middle', class: 'u8l3-wt' }); t.textContent = type === 'w100' ? '100 g' : '25 g';
  }
}
/** a balanced scale: two pans with items on them. set(i, items, {fresh}) redraws pan i; returns the item groups. */
function makeScale(host, left, right, o = {}) {
  const id = 'u8l3s' + (SGID++), W = o.w || 300;
  const svg = svgEl('svg', { viewBox: '0 0 300 180', width: W, height: Math.round(W * 0.6), class: 'u8l3-ssvg' });
  const defs = svgEl('defs', {}, svg);
  const grad = (gid, c0, c1) => { const g = svgEl('radialGradient', { id: gid, cx: '35%', cy: '30%', r: '70%' }, defs); svgEl('stop', { offset: '0%', 'stop-color': c0 }, g); svgEl('stop', { offset: '100%', 'stop-color': c1 }, g); };
  grad(id + 'b', '#8fb6f2', '#1f4fa8'); grad(id + 'm', '#8fd6a2', '#16653a');
  svgEl('rect', { x: 102, y: 164, width: 96, height: 12, rx: 4, fill: '#3a4560' }, svg);
  svgEl('path', { d: 'M118 164 L182 164 L150 108 Z', fill: '#c88c14' }, svg);
  svgEl('rect', { x: 12, y: 102, width: 276, height: 10, rx: 4, fill: '#1e2d46' }, svg);
  svgEl('circle', { cx: 150, cy: 107, r: 5, fill: '#d23c32' }, svg);
  [75, 225].forEach((cx) => { svgEl('rect', { x: cx - 3, y: 88, width: 6, height: 14, fill: '#1e2d46' }, svg); svgEl('rect', { x: cx - 68, y: 82, width: 136, height: 7, rx: 3, fill: '#e0b45c', stroke: '#b08020', 'stroke-width': 1 }, svg); });
  const pans = [svgEl('g', {}, svg), svgEl('g', {}, svg)];
  const S = { svg, id, pans, items: [[], []] };
  S.set = (i, list) => {
    const g = pans[i]; while (g.firstChild) g.firstChild.remove();
    const cx = i ? 225 : 75, maxW = 130, gap = 3, rows = [[]]; let rw = 0;
    list.forEach((t) => { const w = ITEM[t].w; if (rw && rw + gap + w > maxW) { rows.push([]); rw = 0; } rw += (rw ? gap : 0) + w; rows[rows.length - 1].push(t); });
    let base = 82; const out = [];
    rows.forEach((row) => {
      const tw = row.reduce((s, t) => s + ITEM[t].w, 0) + gap * (row.length - 1); let x = cx - tw / 2, rh = 0;
      row.forEach((t) => {
        const outer = svgEl('g', { transform: `translate(${x + ITEM[t].w / 2} ${base})` }, g), inner = svgEl('g', {}, outer);
        drawItem(inner, t, id); out.push(inner); x += ITEM[t].w + gap; rh = Math.max(rh, ITEM[t].h);
      });
      base -= rh + 1;
    });
    S.items[i] = out; return out;
  };
  S.set(0, left); S.set(1, right);
  if (host) host.insertBefore(svg, host.firstChild);
  return S;
}
/** swap: the items at idx on pan i lift off, the pan is redrawn with list, and the items at fresh pop in one by one */
async function swapOn(c, S, i, idx, list, fresh) {
  const old = idx.map((k) => S.items[i][k]);
  await Promise.all(old.map((el) => anim(c, el, [{ transform: 'none', opacity: 1 }, { transform: 'translateY(-34px) scale(1.15)', opacity: 0 }], 520)));
  const its = S.set(i, list); fresh.forEach((k) => (its[k].style.opacity = 0));
  for (const k of fresh) { its[k].style.opacity = ''; await pop(c, its[k], 300); }
}

/* =============================== warm-up =============================== */
function mountWarm() {
  const hA = document.getElementById('u8l3-scA'); if (!hA) return;
  const c = liveCtx();
  makeScale(hA, ['box'], ['ball', 'ball', 'ball']);
  const B = makeScale(document.getElementById('u8l3-scB'), ['box', 'ball', 'ball'], ['w25']);
  let bDone = false;
  document.getElementById('u8l3-swapB').addEventListener('click', async () => {
    if (bDone) return; bDone = true;
    await swapOn(c, B, 0, [0], ['ball', 'ball', 'ball', 'ball', 'ball'], [0, 1, 2]);
  });
  document.getElementById('u8l3-resetB').addEventListener('click', () => { bDone = false; B.set(0, ['box', 'ball', 'ball']); });
  makeScale(document.getElementById('u8l3-scC'), ['nug'], ['can', 'can'], { w: 270 });
  makeScale(document.getElementById('u8l3-scD'), ['can'], ['mar', 'mar', 'mar'], { w: 270 });
  const E = makeScale(document.getElementById('u8l3-scE'), ['nug', 'can', 'mar'], ['w100'], { w: 270 });
  let st = 0;
  const b1 = document.getElementById('u8l3-swapE1'), b2 = document.getElementById('u8l3-swapE2');
  b1.addEventListener('click', async () => { if (st !== 0) return; st = 1; await swapOn(c, E, 0, [0], ['can', 'can', 'can', 'mar'], [0, 1]); });
  b2.addEventListener('click', async () => {
    if (st === 0) { pulse(c, b1, 1.08); return; }
    if (st !== 1) return; st = 2;
    await swapOn(c, E, 0, [0, 1, 2], Array(10).fill('mar'), [0, 1, 2, 3, 4, 5, 6, 7, 8]);
  });
  document.getElementById('u8l3-resetE').addEventListener('click', () => { st = 0; E.set(0, ['nug', 'can', 'mar']); });
}

/* =============================== explainer 1: a swap on a scale is a substitution =============================== */
const swap = {
  title: 'Swap in something equal',
  height: 470,
  minW: 860,
  choices: [{ v: 'wu', label: 'Warm-up: box and balls' }, { v: 'big', label: 'The big one: two swaps' }],
  intro: (k) => (k === 'wu' ? `Scales A and B from the warm-up. Let ${T('x')} = the weight of one <b>ball</b> and ${T('y')} = the weight of one <b>box</b>. Press <b>Next</b>.`
    : `The big one: a nugget, cans and marbles. Two swaps turn Scale E into marbles only. Press <b>Next</b>.`),
  make(stage, k, ex) {
    const W = ex.W;
    if (k === 'big') {
      const sw = Math.floor((W - 40) / 3), mk = (i, L, R, name) => {
        const f = add(stage, box(h('div', 'u8l3-sfig'), sw, sw * 0.6 + 30), 14 + i * (sw + 6), 6); const S = makeScale(null, L, R, { w: sw });
        f.appendChild(S.svg); f.appendChild(h('div', 'u8l3-sname', name)); return { f, S };
      };
      const C = mk(0, ['nug'], ['can', 'can'], 'Scale C'), D = mk(1, ['can'], ['mar', 'mar', 'mar'], 'Scale D'), E = mk(2, ['nug', 'can', 'mar'], ['w100'], 'Scale E');
      const top = sw * 0.6 + 50, P = panel(stage, 14, top, W - 28, ex.def.height - top - 10, '');
      const r1 = hidden(wrow(P, 'Rules', '\\text{nugget}=2\\text{ cans}\\qquad\\text{can}=3\\text{ marbles}'));
      const r2 = hidden(wrow(P, 'Swap 1', '2\\text{ cans}+1\\text{ can}+1\\text{ marble}=100\\text{ g}'));
      const r3 = hidden(wrow(P, 'Swap 2', '9\\text{ marbles}+1\\text{ marble}=10\\text{ marbles}=100\\text{ g}'));
      const r4 = hidden(wrow(P, 'Solve', `1\\text{ marble}=100\\div10=${tc(PU, '10\\text{ g}')}`, { box: true }));
      const r5 = hidden(wrow(P, 'Back', `\\text{can}=3(10)=${tc(PU, '30\\text{ g}')}\\qquad\\text{nugget}=2(30)=${tc(PU, '60\\text{ g}')}`, { note: 'check: 60 + 30 + 10 = 100 ✓', ncls: 'u8l3-good' }));
      return [
        { cap: `Scale C: a nugget balances <b>2 cans</b>. Scale D: a can balances <b>3 marbles</b>. Those are the swap rules.`,
          run: async (c) => { await pulse(c, C.f, 1.04); await pulse(c, D.f, 1.04); await show(c, r1); } },
        { cap: `<b>Swap 1:</b> on Scale E, trade the nugget for the 2 cans it balances. Still balanced!`,
          run: async (c) => { await swapOn(c, E.S, 0, [0], ['can', 'can', 'can', 'mar'], [0, 1]); await show(c, r2); } },
        { cap: `<b>Swap 2:</b> trade each of the 3 cans for 3 marbles. Now Scale E holds only marbles: ${T('9+1=10')} of them.`,
          run: async (c) => { await swapOn(c, E.S, 0, [0, 1, 2], Array(10).fill('mar'), [0, 1, 2, 3, 4, 5, 6, 7, 8]); await show(c, r3); } },
        { cap: `One kind of thing, one unknown: ${T('10')} marbles weigh ${T('100')} g, so one marble is <b>10 g</b>.`, run: (c) => show(c, r4) },
        { cap: `Work back through the rules: a can is ${T('3(10)=30')} g, and the tiny nugget is ${T('2(30)=60')} g. The answer is <b>C</b>.`, run: (c) => show(c, r5) }
      ];
    }
    const sw = 300, mk = (y, L, R, name) => {
      const f = add(stage, box(h('div', 'u8l3-sfig'), sw, 210), 14, y); const S = makeScale(null, L, R, { w: sw });
      f.appendChild(S.svg); f.appendChild(h('div', 'u8l3-sname', name)); return { f, S };
    };
    const A = mk(6, ['box'], ['ball', 'ball', 'ball'], 'Scale A'), B = mk(236, ['box', 'ball', 'ball'], ['w25'], 'Scale B');
    const PX = sw + 40, PW = W - PX - 14;
    const cA = add(stage, box(h('div', 'u8l3-card'), PW, 74), PX, 40), cB = add(stage, box(h('div', 'u8l3-card u8l3-c2'), PW, 74), PX, 270);
    cA.appendChild(h('div', 'u8l3-sw')); cB.appendChild(h('div', 'u8l3-sw'));
    const bA = h('div', 'u8l3-big'), bB = h('div', 'u8l3-big'); cA.appendChild(bA); cB.appendChild(bB);
    const exA = chunk(tc(BL, '3x'), 'u8l3-exbox'); bA.append(chunk(tc(BL, 'y=')), exA);
    const slot = chunk(tc(AM, 'y')), lp = chunk(tc(AM, '('), 'u8l3-gone'), ex2 = chunk(tc(BL, '3x'), 'u8l3-gone'), rp = chunk(tc(AM, ')'), 'u8l3-gone');
    bB.append(slot, lp, ex2, rp, chunk(tc(AM, '{}+2x=25')));
    [cA, cB].forEach((e) => (e.style.opacity = 0));
    const tagA = add(stage, h('div', 'u8l3-lab', 'Scale A says'), PX, 10), tagB = add(stage, h('div', 'u8l3-lab', 'Scale B says'), PX, 240);
    [tagA, tagB].forEach((e) => (e.style.opacity = 0));
    const P = panel(stage, PX, 354, PW, ex.def.height - 364, '');
    const s1 = hidden(wrow(P, 'Solve', `3x+2x=25\\ \\Rightarrow\\ 5x=25\\ \\Rightarrow\\ ${tc(PU, 'x=5')}`, { box: false }));
    const s2 = hidden(wrow(P, 'Back', `y=3(5)=${tc(PU, '15')}\\qquad\\text{solution }${tc(PU, '(5,\\ 15)')}`));
    return [
      { cap: `Scale A: one box balances 3 balls, so ${T('y=3x')}. The box and ${T('3x')} are <b>two names for the same weight</b>.`,
        run: async (c) => { await pulse(c, A.f, 1.04); await show(c, tagA); await show(c, cA); await pulse(c, exA, 1.12); } },
        { cap: `Scale B: a box and 2 balls balance 25 g, so ${T('y+2x=25')}. Two unknowns: we can’t solve it yet.`,
          run: async (c) => { await pulse(c, B.f, 1.04); await show(c, tagB); await show(c, cB); } },
      { cap: `<b>Swap!</b> The box weighs the same as 3 balls, so trade it on Scale B. In the equation, ${T('y')} becomes ${T('(3x)')}.`,
        run: async (c) => {
          await swapOn(c, B.S, 0, [0], ['ball', 'ball', 'ball', 'ball', 'ball'], [0, 1, 2]);
          slot.classList.add('u8l3-strike'); await shake(c, slot); await sleep(c, 200);
          gone(slot); [lp, ex2, rp].forEach((e) => gone(e, false)); ex2.classList.add('u8l3-hid');
          await Promise.all([pop(c, lp), pop(c, rp)]); await fly(c, stage, exA, ex2); ex2.classList.remove('u8l3-hid');
        } },
      { cap: `Only balls are left: one unknown. ${T('3x+2x=25')}, so ${T('5x=25')} and ${T('x=5')}: one ball is <b>5 g</b>.`, run: (c) => show(c, s1) },
      { cap: `Back to Scale A: ${T('y=3(5)=15')}, so a box is <b>15 g</b>. The solution is ${T('(5,\\ 15)')}. That swap was <b>substitution</b>!`,
        run: async (c) => { await show(c, s2); const st = stamp(P, 'substitution!', { ok: true, size: 'sm' }); await stampIn(c, st); } }
    ];
  }
};

/* =============================== explainer 2 (the star): the five steps =============================== */
const SUB = {
  wu: { label: 'Warm-up: the scales', eq: ['y=3x', 'y+2x=25'], v: 'y', lhs: 'y=', expr: '3x', pre: '', post: '{}+2x=25', sv: 'x',
    intro: `The warm-up scales: ${bw(0, 'Scale A')} ${T('y=3x')} and ${bw(1, 'Scale B')} ${T('y+2x=25')}. The solution is where the lines cross. Press <b>Next</b>.`,
    solve: ['3x+2x=25', '5x=25', 'x=5'], back: 'y=3(5)=15', sol: [5, 15], solTex: '(5,\\ 15)', solPos: 'e',
    end: `The solution is ${T('(5,\\ 15)')}: a ball is 5 g and a box is 15 g, right where the lines <b>cross</b>.`,
    lines: [{ m: 3, b: 0 }, { m: -2, b: 25 }], labs: [[7.6, 'w'], [10, 'sw']],
    g: { xmin: -1, xmax: 12, ymin: -2, ymax: 28, ystep: 2, xlabels: 2, ylabels: 4 } },
  e1: { label: 'Example 1', eq: ['y=2x+1', '3x+y=16'], v: 'y', lhs: 'y=', expr: '2x+1', pre: '3x+{}', post: '{}=16', sv: 'x',
    solve: ['3x+2x+1=16', '5x+1=16', '5x=15', 'x=3'], back: 'y=2(3)+1=7', sol: [3, 7], solTex: '(3,\\ 7)', solPos: 'e',
    lines: [{ m: 2, b: 1 }, { m: -3, b: 16 }], labs: [[5.4, 'w'], [4.6, 'e']],
    g: { xmin: -2, xmax: 9, ymin: -2, ymax: 14, xlabels: 2, ylabels: 2 } },
  e2: { label: 'Example 2', eq: ['y=x-4', '2x+3y=18'], v: 'y', lhs: 'y=', expr: 'x-4', pre: '2x+3', post: '{}=18', sv: 'x',
    solve: ['2x+3x-12=18', '5x-12=18', '5x=30', 'x=6'], back: 'y=6-4=2', sol: [6, 2], solTex: '(6,\\ 2)', solPos: 'se',
    lines: [{ m: 1, b: -4 }, { m: -2 / 3, b: 6 }], labs: [[1.2, 'e'], [0.5, 'ne']],
    g: { xmin: -2, xmax: 10, ymin: -6, ymax: 8, xlabels: 2, ylabels: 2 } },
  e3: { label: 'Example 3', eq: ['x=3y+1', 'x+2y=16'], v: 'x', lhs: 'x=', expr: '3y+1', pre: '', post: '{}+2y=16', sv: 'y',
    solve: ['3y+1+2y=16', '5y+1=16', '5y=15', 'y=3'], back: 'x=3(3)+1=10', sol: [10, 3], solTex: '(10,\\ 3)', solPos: 'n',
    end: `The solution is ${T('(10,\\ 3)')}. We found ${T('y')} first, but the pair is still written ${T('x')} first.`,
    lines: [{ m: 1 / 3, b: -1 / 3 }, { m: -0.5, b: 8 }], labs: [[2.5, 'n'], [1, 'ne']],
    g: { xmin: -2, xmax: 13, ymin: -3, ymax: 11, xlabels: 2, ylabels: 2 } },
  e4: { label: 'Example 4', eq: ['y=-2x+5', '3x-y=10'], v: 'y', lhs: 'y=', expr: '-2x+5', pre: '3x-{}', post: '{}=10', sv: 'x',
    solve: [{ t: '3x+2x-5=10', note: 'the minus changes both signs' }, '5x-5=10', '5x=15', 'x=3'], back: 'y=-2(3)+5=-1', sol: [3, -1], solTex: '(3,\\ -1)', solPos: 'e',
    lines: [{ m: -2, b: 5 }, { m: 3, b: -10 }], labs: [[-0.6, 'e'], [4.5, 'e']],
    g: { xmin: -3, xmax: 7, ymin: -7, ymax: 7, xlabels: 2, ylabels: 2 } },
  e5: { label: 'Example 5', eq: ['y=3x-7', '5x-2y=11'], v: 'y', lhs: 'y=', expr: '3x-7', pre: '5x-2', post: '{}=11', sv: 'x',
    solve: [{ t: '5x-6x+14=11', note: '(−2)(−7) = +14' }, '-x+14=11', '-x=-3', 'x=3'], back: 'y=3(3)-7=2', sol: [3, 2], solTex: '(3,\\ 2)', solPos: 'w',
    lines: [{ m: 3, b: -7 }, { m: 2.5, b: -5.5 }], labs: [[1.2, 'e'], [1.0, 'w']],
    g: { xmin: -2, xmax: 7, ymin: -7, ymax: 7, xlabels: 2, ylabels: 2 } }
};
const xvOf = (d) => (d.g.xtitle || 'x');

/** a system graph: both lines in their colours, each labelled with its equation */
function sysGraph(stage, d, x, y, w, hh) {
  const G = new Graph(stage, Object.assign({ x, y, width: w, height: hh, fontSize: 15 }, d.g));
  const L = d.lines.map((ln, i) => G.line(ln, { color: EQC[i], width: 4 }));
  (d.labs || []).forEach(([lx, pos], i) => G.label(lx, d.lines[i].m * lx + d.lines[i].b, T(d.eq[i]), { pos, cls: 'bk-ptlab', color: EQC[i] }));
  return { G, L };
}

/** the two equation cards: the top one is already isolated; its expression lifts into the bottom one */
function subCards(stage, d, x, y, w, o = {}) {
  const h1 = o.h1 || 100, h2 = o.h2 || 100;
  const C1 = add(stage, box(h('div', 'u8l3-card'), w, h1), x, y);
  const C2 = add(stage, box(h('div', 'u8l3-card u8l3-c2'), w, h2), x, y + h1 + (o.gap ?? 54));
  C1.appendChild(h('div', 'u8l3-sw')); C2.appendChild(h('div', 'u8l3-sw'));
  const s1 = h('div', 'u8l3-small', '&nbsp;'), b1 = h('div', 'u8l3-big');
  const ex1 = chunk(tc(BL, d.expr), 'u8l3-exbox');
  b1.append(chunk(tc(BL, d.lhs)), ex1); C1.append(s1, b1);
  const s2 = h('div', 'u8l3-small', '&nbsp;'), b2 = h('div', 'u8l3-big');
  const pre = chunk(tc(AM, d.pre)), slot = chunk(tc(AM, d.v)), lp = chunk(tc(AM, '('), 'u8l3-gone');
  const ex2 = chunk(tc(BL, d.expr), 'u8l3-gone'), rp = chunk(tc(AM, ')'), 'u8l3-gone'), post = chunk(tc(AM, d.post));
  if (d.pre) b2.append(pre); b2.append(slot, lp, ex2, rp, post); C2.append(s2, b2);
  const tag = h('div', 'u8l3-tag', o.tag || `only ${T(d.sv)} left!`); tag.style.opacity = 0; C2.appendChild(tag);
  return {
    C1, C2, ex1, ex2, slot, tag, s1, s2,
    async find(c) {
      s1.innerHTML = `already solved for ${T(d.v)} ✓`; await show(c, s1); await pulse(c, ex1, 1.12);
    },
    async substitute(c) {
      s2.innerHTML = `the <b>other</b> equation`; await show(c, s2);
      slot.classList.add('u8l3-strike'); await shake(c, slot); await sleep(c, 250);
      gone(slot); [lp, ex2, rp].forEach((e) => gone(e, false)); ex2.classList.add('u8l3-hid');
      await Promise.all([pop(c, lp), pop(c, rp)]);
      await fly(c, stage, ex1, ex2);
      ex2.classList.remove('u8l3-hid');
      await pop(c, tag, 420);
    }
  };
}

const lift = {
  title: 'The five steps: find, substitute, solve, back-substitute, state',
  height: 540,
  minW: 860,
  choices: [{ v: 'wu', label: SUB.wu.label }, { sep: 'Example checks' }, ...['e1', 'e2', 'e3', 'e4', 'e5'].map((k) => ({ v: k, label: SUB[k].label + ' check' }))],
  intro: (k) => SUB[k].intro || `${SUB[k].label}: ${T(tc(BL, SUB[k].eq[0]))} and ${T(tc(AM, SUB[k].eq[1]))}. On the graph, the solution is where the ${bw(0, 'blue')} and ${bw(1, 'amber')} lines cross. Press <b>Next</b>.`,
  make(stage, k, ex) {
    const d = SUB[k], GW = 400, LW = ex.W - GW - 44, gx = ex.W - GW - 14;
    const { G } = sysGraph(stage, d, gx, 14, GW, 440);
    const K = subCards(stage, d, 14, 14, LW);
    const P = panel(stage, 14, 282, LW, ex.def.height - 296, '', 'u8l3-work');
    const S = add(stage, box(h('div', 'u8l3-soln'), GW, 60), gx, 466);
    const steps = d.solve.map((s) => (typeof s === 'string' ? { t: s } : s)), res = steps[steps.length - 1].t;
    const hor = d.sv === xvOf(d), valTex = res.split('=')[1];
    const solveRows = [];
    return [
      { cap: `<b>Step 1: Find</b> the equation that is already solved for a variable: ${T(d.eq[0])}. It says ${T(d.v)} <b>is</b> ${T(d.expr)}.`, run: (c) => K.find(c) },
      { cap: `<b>Step 2: Substitute.</b> Swap ${T(d.v)} for ${T('(' + d.expr + ')')} in the <b>other</b> equation, in brackets. Now only ${T(d.sv)} is left.`,
        run: (c) => K.substitute(c) },
      { cap: `<b>Step 3: Solve</b> for ${T(d.sv)}: ${T(res)}. On the graph, every point on the dashed line has ${T(d.sv + '=' + valTex)}.`,
        run: async (c) => {
          for (let i = 0; i < steps.length; i++) {
            const last = i === steps.length - 1;
            const r = wrow(P, i ? '' : 'Step 3', last ? tc(PU, steps[i].t) : steps[i].t, { note: steps[i].note, box: last });
            solveRows.push(r); await show(c, r); await sleep(c, 120);
          }
          const gl = hor ? G.vline(d.sol[0], { color: PU, width: 3 }) : G.hline(d.sol[1], { color: PU, width: 3 });
          await G.drawIn(gl, 700, c);
        } },
      { cap: `<b>Step 4: Back-substitute</b> ${T(res)} into ${T(d.lhs + d.expr)}: ${T(d.back)}.`,
        run: async (c) => {
          const src = solveRows[solveRows.length - 1].m;
          await fly(c, stage, src, K.ex1, { html: T(tc(PU, valTex)), scale: 1.1 });
          await pulse(c, K.ex1, 1.12);
          const r = wrow(P, 'Step 4', tc(PU, d.back)); await show(c, r);
        } },
      { cap: `<b>Step 5: State</b> the pair. ${d.end || `The solution is ${T(d.solTex)}: exactly where the two lines <b>cross</b>.`}`,
        run: async (c) => {
          const pt = G.point(d.sol[0], d.sol[1], { color: PU, r: 8, label: T(tc(PU, d.solTex)), pos: d.solPos });
          await G.reveal(pt, c);
          const sp = h('span', 'u8l3-ch', T(tc(PU, d.solTex))); S.appendChild(sp); await show(c, sp);
          const st = stamp(S, 'on both lines', { ok: true }); await stampIn(c, st);
        } }
    ];
  }
};

/* =============================== explainer 3: into the OTHER equation =============================== */
const OT = {
  e1: { label: 'Example 1', iso: 'y=2x+1', v: 'y', expr: '2x+1', sv: 'x',
    same: { pre: '', post: '{}=2x+1', rows: ['2x+1=2x+1', '1=1'] },
    oth: { eq: '3x+y=16', pre: '3x+{}', post: '{}=16', rows: ['5x+1=16', '5x=15', 'x=3'] } },
  wu: { label: 'Warm-up: Scale A', iso: 'y=3x', v: 'y', expr: '3x', sv: 'x',
    same: { pre: '', post: '{}=3x', rows: ['3x=3x', '0=0'] },
    oth: { eq: 'y+2x=25', pre: '', post: '{}+2x=25', rows: ['5x=25', 'x=5'] } },
  e3: { label: 'Example 3', iso: 'x=3y+1', v: 'x', expr: '3y+1', sv: 'y',
    same: { pre: '', post: '{}=3y+1', rows: ['3y+1=3y+1', '1=1'] },
    oth: { eq: 'x+2y=16', pre: '', post: '{}+2y=16', rows: ['5y+1=16', '5y=15', 'y=3'] } }
};
const other = {
  title: 'Into the same equation, or the other one?',
  height: 470,
  minW: 860,
  choices: Object.keys(OT).map((k) => ({ v: k, label: OT[k].label })),
  intro: (k) => `${T(tc(BL, OT[k].iso))} says ${T(OT[k].v)} <b>is</b> ${T(OT[k].expr)}. Where should we put ${T(OT[k].expr)}? Press <b>Next</b>.`,
  make(stage, k, ex) {
    const d = OT[k], W = ex.W, PW = (W - 42) / 2;
    const top = add(stage, box(h('div', 'u8l3-card'), 330, 70), (W - 330) / 2, 10); top.appendChild(h('div', 'u8l3-sw'));
    const tb = h('div', 'u8l3-big'); tb.style.justifyContent = 'center'; top.appendChild(tb);
    const exS = chunk(tc(BL, d.expr), 'u8l3-exbox'); tb.append(chunk(tc(BL, d.v + '=')), exS);
    const mk = (x, title, cls, eqPre, eqPost, colr) => {
      const P = panel(stage, x, 110, PW, ex.def.height - 120, title, cls);
      const line = h('div', 'u8l3-row u8l3-eqline', '<span class="u8l3-gut"></span>');
      const pre = eqPre ? chunk(tc(colr, eqPre)) : null, slot = chunk(tc(colr, d.v)), lp = chunk(tc(colr, '('), 'u8l3-gone'), ex2 = chunk(tc(BL, d.expr), 'u8l3-gone'), rp = chunk(tc(colr, ')'), 'u8l3-gone');
      if (pre) line.appendChild(pre); line.append(slot, lp, ex2, rp, chunk(tc(colr, eqPost))); P.appendChild(line); line.style.opacity = 0;
      return { P, line, slot, lp, ex2, rp };
    };
    const A = mk(14, 'Into the <b>same</b> equation', 'u8l3-bad-p', d.same.pre, d.same.post, BL);
    const B = mk(28 + PW, 'Into the <b>other</b> equation', 'u8l3-good-p', d.oth.pre, d.oth.post, AM);
    const drop = async (c, Q) => {
      await show(c, Q.line); Q.slot.classList.add('u8l3-strike'); await shake(c, Q.slot);
      gone(Q.slot); [Q.lp, Q.ex2, Q.rp].forEach((e) => gone(e, false)); Q.ex2.classList.add('u8l3-hid');
      await Promise.all([pop(c, Q.lp), pop(c, Q.rp)]); await fly(c, stage, exS, Q.ex2); Q.ex2.classList.remove('u8l3-hid');
    };
    const ra = d.same.rows.map((t, i) => hidden(wrow(A.P, '', t, i === d.same.rows.length - 1 ? { note: 'always true', ncls: 'u8l3-bad' } : {})));
    const rb = d.oth.rows.map((t, i, a) => hidden(wrow(B.P, '', i === a.length - 1 ? tc(PU, t) : t, { box: i === a.length - 1 })));
    const sa = d.same.rows[d.same.rows.length - 1], ans = d.oth.rows[d.oth.rows.length - 1];
    return [
      { cap: `Try the equation it <b>came from</b>: swap ${T(d.v)} for ${T('(' + d.expr + ')')} in ${T(d.iso)}.`, run: (c) => drop(c, A) },
      { cap: `${T(d.same.rows[0])}: both sides are the same! Subtract ${T(d.expr.replace(/[+-]\d+$/, ''))} from both sides: ${T(sa)}. True for <b>every</b> ${T(d.sv)}, so it tells us <b>nothing</b>.`,
        run: async (c) => { for (const r of ra) { await show(c, r); await sleep(c, 150); } const st = stamp(A.P, 'useless', { ok: false, size: 'sm' }); await stampIn(c, st); } },
      { cap: `Now the <b>other</b> equation, ${T(tc(AM, d.oth.eq))}: swap ${T(d.v)} for ${T('(' + d.expr + ')')}. Only ${T(d.sv)} is left.`, run: (c) => drop(c, B) },
      { cap: `Solve: ${T(ans)}. One equation, one unknown, <b>one answer</b>. Always substitute into the <b>other</b> equation.`,
        run: async (c) => { for (const r of rb) { await show(c, r); await sleep(c, 150); } const st = stamp(B.P, 'useful', { ok: true, size: 'sm' }); await stampIn(c, st); } }
    ];
  }
};

/* =============================== explainer 4: the bracket carries the whole expression =============================== */
const XP = {
  e2: { label: 'Example 2: 3(x − 4)', parts: ['2x', '+3', '(', 'x', '-4', ')', '=18'], m: 1, t: [3, 4], ops: [1, 4, 6],
    prods: ['(3)(x)=3x', '(3)(-4)=-12'], r2: '2x+3x-12=18', r3: '5x-12=18', r4: '5x=30\\ \\Rightarrow\\ x=6',
    cap1: `Example 2, after Step 2. The ${T('3')} in front multiplies <b>each</b> term in the bracket: ${T('x')} <b>and</b> ${T('-4')}.`,
    cap2: `Expanded: ${T('2x+3x-12=18')}. (Not ${T('2x+3x-4')}: the ${T('3')} must reach the ${T('-4')} too.)` },
  e4: { label: 'Example 4: −(−2x + 5)', parts: ['3x', '-', '(', '-2x', '+5', ')', '=10'], m: 1, t: [3, 4], ops: [1, 4, 6],
    prods: ['(-1)(-2x)=+2x', '(-1)(+5)=-5'], r2: '3x+2x-5=10', r3: '5x-5=10', r4: '5x=15\\ \\Rightarrow\\ x=3',
    cap1: `Example 4, after Step 2. A minus in front of a bracket means ${T('-1')} times <b>each</b> term: both signs change.`,
    cap2: `Expanded: ${T('3x+2x-5=10')}. The ${T('-2x')} became ${T('+2x')} and the ${T('+5')} became ${T('-5')}.` },
  e5: { label: 'Example 5: −2(3x − 7)', parts: ['5x', '-2', '(', '3x', '-7', ')', '=11'], m: 1, t: [3, 4], ops: [1, 4, 6],
    prods: ['(-2)(3x)=-6x', '(-2)(-7)=+14'], r2: '5x-6x+14=11', r3: '-x+14=11', r4: '-x=-3\\ \\Rightarrow\\ x=3',
    cap1: `Example 5, after Step 2. The multiplier is ${T('-2')}, <b>sign included</b>. It multiplies <b>each</b> term in the bracket.`,
    cap2: `Expanded: ${T('5x-6x+14=11')}. A negative times a negative is positive: ${T('(-2)(-7)=+14')}.` }
};
const brackets = {
  title: 'The bracket carries the whole expression',
  height: 440,
  choices: Object.keys(XP).map((k) => ({ v: k, label: XP[k].label })),
  intro: (k) => `${T(XP[k].parts.join(''))}. Expand the bracket first, then solve. Press <b>Next</b>.`,
  make(stage, k, ex) {
    const d = XP[k], W = ex.W;
    const R1 = add(stage, box(h('div', 'u8l3-mrow'), W, 70), 0, 128); R1.style.fontSize = '46px'; R1.style.gap = '0';
    const ps = d.parts.map((p, i) => { const e = h('span', 'u8l3-ch', T(tc(i === d.m ? PU : AM, (d.ops.includes(i) ? '{}' : '') + p))); R1.appendChild(e); return e; });
    const svg = svgEl('svg', { class: 'u8l3-arcs', width: W, height: ex.def.height }); add(stage, svg, 0, 0);
    const mrow = (y, t, note) => { const r = add(stage, box(h('div', 'u8l3-mrow u8l3-xrow', T(t) + (note ? `<span class="u8l3-why">${note}</span>` : '')), W, 54), 0, y); r.style.opacity = 0; return r; };
    const r2 = mrow(214, d.r2, 'expanded'), r3 = mrow(276, d.r3, 'collect like terms'), r4 = mrow(338, tc(PU, d.r4));
    return [
      { cap: d.cap1, run: async (c) => {
        const m = rel(stage, ps[d.m]);
        for (let j = 0; j < 2; j++) {
          const t = rel(stage, ps[d.t[j]]), x1 = m.x + m.w / 2, y1 = m.y + 6, x2 = t.x + t.w / 2, y2 = t.y + 6, bulge = j ? 56 : 30;
          const p = svgEl('path', { class: 'bk-stroke', d: `M${x1} ${y1} Q${(x1 + x2) / 2} ${y1 - bulge * 2} ${x2} ${y2 - 4}`, fill: 'none', stroke: PU, 'stroke-width': 3 }, svg);
          await drawIn(p, 520, c);
          const hd = arrowHead(svg, x2, y2 - 2, x2 - (x1 + x2) / 2, bulge * 2 + y2 - y1, { color: PU, width: 3 }); await pop(c, hd, 200);
          const lab = h('div', 'u8l3-arclab', T(d.prods[j])); add(stage, lab); place(lab, j ? x2 + 6 : (x1 + x2) / 2 - 10, y1 - bulge - (j ? 4 : 0), j ? 'ne' : 'nw', 4); await pop(c, lab, 300);
        }
      } },
      { cap: d.cap2, run: (c) => show(c, r2) },
      { cap: `Collect the like terms: ${T(d.r3)}.`, run: (c) => show(c, r3) },
      { cap: `Solve: ${T(d.r4)}. Brackets first, every term, every sign.`, run: (c) => show(c, r4) }
    ];
  }
};

/* =============================== explainer 5: which value first? the pair is always (x, y) =============================== */
const OR = {
  e3: { label: 'Example 3: x is isolated', sys: SUB.e3, first: 'y', fv: 3, second: 'x', sv2: 10,
    rows: ['(3y+1)+2y=16', '5y+1=16\\ \\Rightarrow\\ 5y=15', 'y=3'], back: 'x=3(3)+1=10', pt: [10, 3], bad: [3, 10] },
  e1: { label: 'Example 1: y is isolated', sys: SUB.e1, first: 'x', fv: 3, second: 'y', sv2: 7,
    rows: ['3x+(2x+1)=16', '5x+1=16\\ \\Rightarrow\\ 5x=15', 'x=3'], back: 'y=2(3)+1=7', pt: [3, 7], bad: [7, 3] }
};
const order = {
  title: 'Which value comes first? The pair is always (x, y)',
  height: 480,
  minW: 860,
  choices: Object.keys(OR).map((k) => ({ v: k, label: OR[k].label })),
  intro: (k) => `${OR[k].sys.label}: ${T(tc(BL, OR[k].sys.eq[0]))} and ${T(tc(AM, OR[k].sys.eq[1]))}. ${T(OR[k].sys.v)} is isolated. Press <b>Next</b>.`,
  make(stage, k, ex) {
    const d = OR[k], s = d.sys, GW = 400, LW = ex.W - GW - 44, gx = ex.W - GW - 14;
    const G = new Graph(stage, { x: gx, y: 14, width: GW, height: 440, fontSize: 15, xmin: -2, xmax: 12, ymin: -2, ymax: 12, xlabels: 2, ylabels: 2 });
    s.lines.forEach((ln, i) => G.line(ln, { color: EQC[i], width: 4 }));
    const P = panel(stage, 14, 14, LW, 250, `Step 3 gives ${T(d.first)} first`);
    const R = d.rows.map((t, i, a) => hidden(wrow(P, i ? '' : 'Solve', i === a.length - 1 ? tc(PU, t) : t, { box: i === a.length - 1 })));
    const rb = hidden(wrow(P, 'Back', tc(PU, d.back)));
    const pr = add(stage, box(h('div', 'u8l3-pair'), LW, 120), 14, 290);
    const mkSlot = (v) => { const sl = h('div', 'u8l3-slot'); sl.innerHTML = `<div class="u8l3-slab">${T(v)}</div><div class="u8l3-sval"></div>`; return sl; };
    const sx = mkSlot('x'), sy = mkSlot('y');
    pr.append(h('span', 'u8l3-pp', '('), sx, h('span', 'u8l3-pp', ','), sy, h('span', 'u8l3-pp', ')'));
    pr.style.opacity = 0;
    const note = add(stage, box(h('div', 'u8l3-onote'), LW, 60), 14, 420); note.style.opacity = 0;
    const xv = s.v === 'x' ? d.sv2 : d.fv, yv = s.v === 'x' ? d.fv : d.sv2;
    return [
      { cap: `${T(s.v)} is isolated, so substituting removes ${T(s.v)}. Only ${T(d.first)} is left, so ${T(d.first)} comes out <b>first</b>: ${T(d.rows[2])}.`,
        run: async (c) => { for (const r of R) { await show(c, r); await sleep(c, 120); } } },
      { cap: `Back-substitute to get ${T(d.second)}: ${T(d.back)}.`, run: (c) => show(c, rb) },
      { cap: `The ordered pair is always ${T('(x,\\ y)')}: ${T('x')} first. So the solution is ${T(`(${xv},\\ ${yv})`)}${s.v === 'x' ? ', even though we found ' + T('y') + ' first' : ''}.`,
        run: async (c) => {
          await show(c, pr);
          const fill = async (sl, v, src) => { const t = sl.querySelector('.u8l3-sval'); t.innerHTML = T(tc(PU, v)); t.style.visibility = 'hidden'; await fly(c, stage, src, t, { html: T(tc(PU, v)), scale: 1.4 }); t.style.visibility = ''; };
          const srcX = s.v === 'x' ? rb.m : R[2].m, srcY = s.v === 'x' ? R[2].m : rb.m;
          await fill(sx, String(xv), srcX); await fill(sy, String(yv), srcY);
        } },
      { cap: `${T(`(${xv},\\ ${yv})`)} is where the lines cross ✓. Swapped, ${T(`(${d.bad[0]},\\ ${d.bad[1]})`)} is not on <b>either</b> line ✗. Order matters!`,
        run: async (c) => {
          await G.reveal(G.point(d.pt[0], d.pt[1], { color: PU, r: 8, label: T(tc(PU, `(${xv},\\ ${yv})`)), pos: s.v === 'x' ? 'n' : 'e' }), c);
          await G.reveal(G.point(d.bad[0], d.bad[1], { color: RED, r: 7, label: T(tc(RED, `(${d.bad[0]},\\ ${d.bad[1]})`)) + ' ✗', pos: 'e' }), c);
          note.innerHTML = `<b>${T('x')} first, then ${T('y')}</b>, just like plotting a point: across, then up.`; await show(c, note);
        } }
    ];
  }
};

/* =============================== explainer 6: check in BOTH equations =============================== */
const CK = {
  one: { label: 'Is (2, −1) a solution?', sys: SUB.e5, at: 'x=2,\\ y=-1', pt: [2, -1], ptTex: '(2,\\ -1)', real: [3, 2], realTex: '(3,\\ 2)',
    intro: `Example 5’s system. Someone claims ${T('(2,\\ -1)')} is the solution. Is it? Press <b>Next</b>.`,
    c: [{ eq: 'y=3x-7', L: '-1', R: '3(2)-7=6-7=-1', v: '-1', rv: '-1', ok: true }, { eq: '5x-2y=11', L: '5(2)-2(-1)=10+2=12', R: '11', v: '12', rv: '11', ok: false }],
    end: `It balances only the blue equation, so it is on the blue line only. <b>Not a solution.</b> The real solution is the crossing point ${T('(3,\\ 2)')}.` },
  slip: { label: 'A sign slip in Example 4', sys: SUB.e4, at: 'x=1,\\ y=3', pt: [1, 3], ptTex: '(1,\\ 3)', real: [3, -1], realTex: '(3,\\ -1)',
    intro: `A student wrote ${T('3x-(-2x+5)')} as ${T('3x+2x+5')} and got ${T('(1,\\ 3)')}. Will the check catch it? Press <b>Next</b>.`,
    c: [{ eq: 'y=-2x+5', L: '3', R: '-2(1)+5=-2+5=3', v: '3', rv: '3', ok: true }, { eq: '3x-y=10', L: '3(1)-3=3-3=0', R: '10', v: '0', rv: '10', ok: false }],
    end: `The check caught the sign slip! ${T('(1,\\ 3)')} is on the blue line only. Redo it: ${T('3x+2x-5=10')}, so ${T('x=3')} and the solution is ${T('(3,\\ -1)')}.` },
  e1: { label: 'Example 1', sys: SUB.e1, at: 'x=3,\\ y=7', pt: [3, 7], ptTex: '(3,\\ 7)',
    c: [{ eq: 'y=2x+1', L: '7', R: '2(3)+1=6+1=7', v: '7', rv: '7', ok: true }, { eq: '3x+y=16', L: '3(3)+7=9+7=16', R: '16', v: '16', rv: '16', ok: true }] },
  e2: { label: 'Example 2', sys: SUB.e2, at: 'x=6,\\ y=2', pt: [6, 2], ptTex: '(6,\\ 2)',
    c: [{ eq: 'y=x-4', L: '2', R: '6-4=2', v: '2', rv: '2', ok: true }, { eq: '2x+3y=18', L: '2(6)+3(2)=12+6=18', R: '18', v: '18', rv: '18', ok: true }] },
  e3: { label: 'Example 3', sys: SUB.e3, at: 'x=10,\\ y=3', pt: [10, 3], ptTex: '(10,\\ 3)',
    c: [{ eq: 'x=3y+1', L: '10', R: '3(3)+1=9+1=10', v: '10', rv: '10', ok: true }, { eq: 'x+2y=16', L: '10+2(3)=10+6=16', R: '16', v: '16', rv: '16', ok: true }] },
  e4: { label: 'Example 4', sys: SUB.e4, at: 'x=3,\\ y=-1', pt: [3, -1], ptTex: '(3,\\ -1)',
    c: [{ eq: 'y=-2x+5', L: '-1', R: '-2(3)+5=-6+5=-1', v: '-1', rv: '-1', ok: true }, { eq: '3x-y=10', L: '3(3)-(-1)=9+1=10', R: '10', v: '10', rv: '10', ok: true }] },
  e5: { label: 'Example 5', sys: SUB.e5, at: 'x=3,\\ y=2', pt: [3, 2], ptTex: '(3,\\ 2)',
    c: [{ eq: 'y=3x-7', L: '2', R: '3(3)-7=9-7=2', v: '2', rv: '2', ok: true }, { eq: '5x-2y=11', L: '5(3)-2(2)=15-4=11', R: '11', v: '11', rv: '11', ok: true }] }
};
/** a check card: left side, right side, then the verdict (rows hidden until played) */
function ckCard(stage, q, i, at, x, y, w, hh) {
  const P = panel(stage, x, y, w, hh, `In ${T(tc(EQC[i], q.eq))} with ${T(at)}`, 'u8l3-ckc u8l3-ck' + (i + 1));
  const rows = [wrow(P, 'Left side', q.L), wrow(P, 'Right side', q.R)];
  const vr = wrow(P, '', `${q.v}${q.ok ? '=' : '\\ne'}${q.rv}`, { note: q.ok ? '✓ balances' : '✗ does not balance', ncls: q.ok ? 'u8l3-good' : 'u8l3-bad' });
  vr.m.classList.add(q.ok ? 'u8l3-okbox' : 'u8l3-nobox');
  rows.push(vr); rows.forEach((r) => (r.style.opacity = 0));
  P.play = async (c) => { for (const r of rows) { await show(c, r); await sleep(c, 140); } };
  return P;
}
const checkBoth = {
  title: 'Check the solution in BOTH equations',
  height: 500,
  minW: 900,
  choices: [{ v: 'one', label: CK.one.label }, { v: 'slip', label: CK.slip.label }, { sep: 'Example checks' }, ...['e1', 'e2', 'e3', 'e4', 'e5'].map((k) => ({ v: k, label: CK[k].label }))],
  intro: (k) => CK[k].intro || `${CK[k].label}: is ${T(CK[k].ptTex)} the solution? It must balance <b>both</b> original equations. Press <b>Next</b>.`,
  make(stage, k, ex) {
    const d = CK[k], s = d.sys, GW = 380, CW = ex.W - GW - 44, CH2 = (ex.def.height - 42) / 2;
    const { G } = sysGraph(stage, s, ex.W - GW - 14, 14, GW, 390);
    const cards = d.c.map((q, i) => ckCard(stage, q, i, d.at, 14, 14 + i * (CH2 + 14), CW, CH2));
    const S = add(stage, box(h('div', 'u8l3-soln'), GW, 76), ex.W - GW - 14, 412);
    const both = d.c.every((q) => q.ok);
    const capC = (i) => { const q = d.c[i]; return `In the ${bw(i, i ? 'amber' : 'blue')} equation ${T(q.eq)}: the left side is ${T(q.v)} and the right side is ${T(q.rv)} ${q.ok ? '✓' : '✗'}.`; };
    return [
      { cap: `Plot ${T(d.ptTex)} on the graph.`, run: async (c) => { await G.reveal(G.point(d.pt[0], d.pt[1], { color: PU, r: 8, label: T(tc(PU, d.ptTex)), pos: d.real ? 'w' : 'e' }), c); } },
      { cap: capC(0), run: (c) => cards[0].play(c) },
      { cap: capC(1), run: (c) => cards[1].play(c) },
      { cap: both ? `It balances <b>both</b> equations, so it lies on <b>both</b> lines: ${T(d.ptTex)} is the solution.` : d.end,
        run: async (c) => {
          if (!both) await G.reveal(G.point(d.real[0], d.real[1], { color: PU, r: 8, open: true, label: T(tc(PU, d.realTex)), pos: 'e' }), c);
          const st = stamp(S, both ? 'solution ✓' : 'not a solution ✗', { ok: both }); await stampIn(c, st);
        } }
    ];
  }
};

/* =============================== explainer 7: a graph's estimate vs the exact crossing =============================== */
const EX = {
  half: { label: 'Between the grid lines', lines: [{ m: 1, b: 1 }, { m: -1, b: 4 }], eq: ['y=x+1', 'y=-x+4'], pt: [1.5, 2.5],
    g: { xmin: -2.5, xmax: 5.5, ymin: -1.5, ymax: 6.5 }, labs: [[3.4, 'e'], [-1.4, 'ne']], guess: [2, 3], gTex: '(2,\\ 3)',
    gChk: [['3=2+1', '✓'], ['-2+4=2\\ne3', '✗']], zoom: { xmin: -0.3, xmax: 3.3, ymin: -0.3, ymax: 3.8, xstep: 0.5, ystep: 0.5 }, zl: 0.5,
    rows: [['Step 2', `${tc(BL, '(x+1)')}=-x+4`], ['Step 3', '2x=3\\ \\Rightarrow\\ x=\\tfrac32=1.5'], ['Step 4', `y=1.5+1=${tc(PU, '2.5')}`], ['', `${tc(PU, '(1.5,\\ 2.5)')}`]],
    cmp: [['Check', '2.5=1.5+1', '✓'], ['', '-1.5+4=2.5', '✓']] },
  e1: { label: 'Example 1: on a grid point', lines: [{ m: 2, b: 1 }, { m: -3, b: 16 }], eq: ['y=2x+1', '3x+y=16'], pt: [3, 7],
    g: { xmin: -1, xmax: 7, ymin: -1, ymax: 15 }, labs: [[5.4, 'w'], [4.6, 'e']], guess: [3, 7], gTex: '(3,\\ 7)',
    gChk: [['7=2(3)+1', '✓'], ['3(3)+7=16', '✓']], zoom: { xmin: -0.5, xmax: 5.5, ymin: -0.5, ymax: 10.5, xstep: 0.5, ystep: 0.5 }, zl: 1,
    rows: [['Step 2', `3x+${tc(BL, '(2x+1)')}=16`], ['Step 3', '5x=15\\ \\Rightarrow\\ x=3'], ['Step 4', `y=2(3)+1=${tc(PU, '7')}`], ['', `${tc(PU, '(3,\\ 7)')}`]],
    cmp: [['Compare', '\\text{graph }(3,\\ 7)', '✓ same'], ['', '\\text{algebra }(3,\\ 7)', '✓ exact']] }
};
const exact = {
  title: 'A graph’s estimate vs the exact answer',
  height: 450,
  minW: 900,
  choices: Object.keys(EX).map((k) => ({ v: k, label: EX[k].label })),
  intro: (k) => `${T(tc(BL, EX[k].eq[0]))} and ${T(tc(AM, EX[k].eq[1]))}, graphed <b>by hand</b>. Where do they cross? Press <b>Next</b>.`,
  make(stage, k, ex) {
    const d = EX[k], GW = 400;
    const G = new Graph(stage, Object.assign({ x: 14, y: 14, width: GW, height: 420, fontSize: 15 }, d.g));
    const L = d.lines.map((ln, i) => G.line(ln, { color: EQC[i], width: 4 })); L.forEach((l) => (l.style.opacity = 0));
    const labs = d.labs.map(([lx, pos], i) => G.label(lx, d.lines[i].m * lx + d.lines[i].b, T(d.eq[i]), { pos, cls: 'bk-ptlab', color: EQC[i] }));
    labs.forEach((l) => (l.style.opacity = 0));
    const P = panel(stage, GW + 34, 14, ex.W - GW - 48, ex.def.height - 28, k === 'half' ? 'Estimate, then exact' : 'Graph, then algebra');
    const est = d.gChk.map(([t, n], i) => { const r = wrow(P, i ? '' : (k === 'half' ? 'Guess' : 'Read'), t, { note: n, ncls: n === '✓' ? 'u8l3-good' : 'u8l3-bad', cls: 'u8l3-est' }); r.style.opacity = 0; return r; });
    const R = d.rows.map(([g, t]) => { const r = wrow(P, g, t); r.style.opacity = 0; r.style.display = 'none'; return r; });
    const C = d.cmp.map(([g, t, n]) => { const r = wrow(P, g, t, { note: n, ncls: n[0] === '✓' ? 'u8l3-good' : 'u8l3-bad' }); r.style.opacity = 0; r.style.display = 'none'; return r; });
    let ring, Q;
    const half = k === 'half';
    return [
      { cap: half ? `Graph both lines by hand. They cross <b>between</b> the grid lines.` : `Graph both lines by hand. This time they cross right <b>on</b> a grid point.`,
        run: async (c) => {
          for (let i = 0; i < 2; i++) { L[i].style.opacity = 1; await G.drawIn(L[i], 600, c); await fadeIn(c, labs[i], 200); }
          const [px, py] = G.toPx(d.pt[0], d.pt[1]); ring = svgEl('circle', { cx: px, cy: py, r: 30, fill: 'none', stroke: PU, 'stroke-width': 3, 'stroke-dasharray': '7 6' }, G.layers.top); await pop(c, ring, 400);
        } },
      { cap: half ? `A guess by eye: ${T(d.gTex)}. It checks in ${T(tc(BL, d.eq[0]))} ✓ but not in ${T(tc(AM, d.eq[1]))} ✗. A graph can only <b>estimate</b>.`
        : `Read it off: ${T(d.gTex)}. It checks in both ✓. A graph works when the crossing lands on a grid point.`,
        run: async (c) => { Q = G.point(d.guess[0], d.guess[1], { color: COLORS.ink, r: 6 }); await G.reveal(Q, c); for (const r of est) { await show(c, r); await sleep(c, 120); } } },
      { cap: half ? `Substitution: ${T('y')} is ${T('x+1')}, so ${T('(x+1)=-x+4')}. Then ${T('2x=3')}, ${T('x=1.5')} and ${T('y=2.5')}.`
        : `Substitution gives the same point: ${T('5x=15')}, so ${T('x=3')} and ${T('y=7')}.`,
        run: async (c) => { est.forEach((r) => (r.style.display = 'none')); for (const r of R) { r.style.display = ''; await show(c, r); await sleep(c, 100); } } },
      { cap: half ? `Zoom in: the lines really cross at ${T('(1.5,\\ 2.5)')}, between the grid lines, and it checks in both ✓. Only the algebra could say so for sure.`
        : `Zoom in: exactly ${T('(3,\\ 7)')}. They agree here, but you only <b>know</b> after you check. Substitution is exact <b>every</b> time.`,
        run: async (c) => {
          ring.remove(); Q.style.opacity = 0; labs.forEach((l) => (l.style.opacity = 0)); G.o.xlabels = d.zl; G.o.ylabels = d.zl; await G.setWindow(d.zoom, c, 1200);
          const p = G.point(d.pt[0], d.pt[1], { color: PU, r: 7 }); await G.reveal(p, c);
          for (const r of C) { r.style.display = ''; await show(c, r); await sleep(c, 150); }
        } }
    ];
  }
};

/* =============================== mount =============================== */
mountWarm();
export const explainers = mountExplainers({ swap, lift, other, brackets, order, checkBoth, exact });
export const _test = { SUB, OT, XP, OR, CK, EX };

/* ============ Stand Up Break! — substitution when a variable is already isolated (lessons/js/standup.js) ============
 * Systems are built from their integer solution; the key is worked from the equations: substitute (in brackets),
 * expand and collect, solve, back-substitute. Isolated equation blue, the other one amber, as on the page. */
{
  const tm = (k, v, first) => (k === 0 ? '' : (k < 0 ? '-' : first ? '' : '+') + (Math.abs(k) === 1 && v ? '' : Math.abs(k)) + v);
  const linE = (p, u, q) => (tm(p, u, true) + tm(q, '', false)) || '0';
  const eqT = (A, B, C) => tm(A, 'x', true) + tm(B, 'y', !A) + '=' + C;
  const half = (s, col) => { const i = s.indexOf('='); return `\\textcolor{${col}}{${s.slice(0, i)}}&\\textcolor{${col}}{${s.slice(i)}}`; };
  const sysT = (s1, s2) => `\\begin{aligned}${half(s1, BL)}\\\\${half(s2, AM)}\\end{aligned}`;
  const par = (n) => (n < 0 ? `(${n})` : String(n));
  /* v = p·u + q is isolated; the other equation is A·x + B·y = C. Returns the worked lines, or null. */
  function solveSub(v, p, q, A, B, C, x0, y0) {
    const u = v === 'y' ? 'x' : 'y', k = v === 'y' ? B : A, ku = v === 'y' ? A : B;
    const K = k * p + ku, rhs = C - k * q;
    if (!K || !ku || rhs % K) return null;
    const u0 = rhs / K, v0 = p * u0 + q;
    if ((v === 'y' ? u0 !== x0 || v0 !== y0 : u0 !== y0 || v0 !== x0)) return null;
    const expr = linE(p, u, q), br = k === 1 ? `(${expr})` : k === -1 ? `-(${expr})` : `${k}(${expr})`;
    const sub = v === 'x' ? br + tm(ku, 'y', false) + '=' + C : tm(ku, 'x', true) + (k > 0 ? '+' : '') + br + '=' + C;
    const exp = (v === 'x' ? tm(k * p, 'y', true) + tm(k * q, '', false) + tm(ku, 'y', false) : tm(ku, 'x', true) + tm(k * p, 'x', false) + tm(k * q, '', false)) + '=' + C;
    const coll = tm(K, u, true) + tm(k * q, '', false) + '=' + C, lin = tm(K, u, true) + '=' + rhs, sol = `${u}=${u0}`;
    const chain = [exp, coll, lin, sol].filter((s, i, a) => s !== a[i - 1]);
    const pu = p === 1 ? par(u0) : p === -1 ? `-${par(u0)}` : `${p}(${u0})`;
    const back = `${v}=${pu}${tm(q, '', false)}=${v0}`;
    return [sub, chain.slice(0, 2).join('\\ \\Rightarrow\\ '), chain.slice(2).join('\\ \\Rightarrow\\ '), `${back}\\qquad(${x0},\\ ${y0})`].filter(Boolean);
  }
  const SOLVE = 'Solve by substitution. Check your answer in both equations.';
  function build(r, o) {
    for (;;) {
      const v = r.chance(o.xIso) ? 'x' : 'y', x0 = r.int(o.lo, o.hi), y0 = r.int(o.lo, o.hi);
      if (x0 === y0 || (o.oneNeg && x0 < 0 && y0 < 0) || (o.needNeg && x0 >= 0 && y0 >= 0)) continue;
      const u0 = v === 'y' ? x0 : y0, v0 = v === 'y' ? y0 : x0, p = r.pick(o.p), q = v0 - p * u0;
      if (!q || Math.abs(q) > 9) continue;
      const k = r.pick(v === 'x' && o.kx ? o.kx : o.k), ku = r.pick(v === 'x' && o.kux ? o.kux : o.ku), A = v === 'y' ? ku : k, B = v === 'y' ? k : ku, C = A * x0 + B * y0;
      const a = solveSub(v, p, q, A, B, C, x0, y0); if (!a) continue;
      return { text: SOLVE, q: sysT(`${v}=${linE(p, v === 'y' ? 'x' : 'y', q)}`, eqT(A, B, C)), a };
    }
  }
  standup('u8l3', {
    intro: 'One equation is already solved for a variable. Substitute it into the other equation (in brackets), solve, back-substitute, then check in both.',
    levels: {
      /* Beginning: the substituted variable has coefficient 1 in the other equation, positive whole-number answers */
      BEG: (r) => build(r, { xIso: 0.3, lo: 1, hi: 8, p: [1, 2, 3], k: [1], ku: [1, 2, 3, 4], oneNeg: true }),
      /* Progressing: a number in front of the bracket (Example 2), x or y isolated, one answer may be negative */
      PRG: (r) => build(r, { xIso: 0.4, lo: -3, hi: 8, p: [1, 2, 3, -1], k: [2, 3, 4], ku: [1, 2, 3, -2], oneNeg: true }),
      /* Mastery: a minus in front of the bracket (Examples 4 and 5; with x isolated, a minus elsewhere), negative answers */
      MAS: (r) => build(r, { xIso: 0.25, lo: -5, hi: 6, p: [2, 3, -1, -2, -3], k: [-1, -2, -3], ku: [2, 3, 4, 5], kx: [2, 3], kux: [-2, -3, -4, -5], needNeg: r.chance(0.6) })
    }
  });
}
