/* Math 15 · Unit 8 · Lesson 4 — Solving Systems by Substitution, Part 2: Isolating a Variable First.
 * Warm-up "Movie Night" (9 tickets, $78: a ticket tray to test guesses; the table; pick the easy variable) and the
 * explainers:
 *   table (the warm-up's guess-and-check table, then the same answer in one line: isolate c = 9 − a, substitute),
 *   choose (which variable to isolate: look for a coefficient of 1 or −1),
 *   isolate (isolate in one step: do the opposite to both sides; with −1 every sign flips),
 *   lift (the star: the five steps — isolate, lift the expression into the OTHER equation in brackets, solve,
 *     back-substitute, the crossing point on the graph; one system solved two ways gives the same point),
 *   fracs (no coefficient is 1 or −1: carry the fraction, multiply every term by the denominator),
 *   checkBoth (check in the ORIGINAL equations; a pair that balances only one is not a solution).
 * Colours: first equation / line blue, second amber, solution purple. */
import {
  h, tex, add, box, Graph, ValueTable, stamp, stampIn, mountExplainers, pop, fadeIn, sleep,
  svgEl, liveCtx, pulse, shake, anim, COLORS
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(String(s));
const BL = COLORS.blue, AM = COLORS.amber, PU = COLORS.purple;
const EQC = [BL, AM];
const tc = (color, s) => `\\textcolor{${color}}{${s}}`;
const show = (c, el) => fadeIn(c, el, 320);
const panel = (stage, x, y, w, hh, title, cls = '') => add(stage, box(h('div', 'u8l4-panel ' + cls, title ? `<div class="u8l4-ph">${title}</div>` : ''), w, hh), x, y);
const chunk = (s, cls = '') => h('span', 'u8l4-ch' + (cls ? ' ' + cls : ''), T(s));
const bw = (k, s) => `<b style="color:${EQC[k]}">${s}</b>`;
const gone = (el, on = true) => el.classList.toggle('u8l4-gone', on);
const hidden = (r) => { r.style.opacity = 0; return r; };

/** a row in a work panel: gutter label + math (+ an optional note) */
function wrow(p, gut, t, o = {}) {
  const d = h('div', 'u8l4-row' + (o.cls ? ' ' + o.cls : ''), `<span class="u8l4-gut">${gut || ''}</span>`);
  const m = h('span', 'u8l4-ch' + (o.box ? ' u8l4-resbox' : ''), T(t)); d.appendChild(m);
  if (o.note) d.appendChild(h('span', 'u8l4-why' + (o.ncls ? ' ' + o.ncls : ''), o.note));
  d.m = m; p.appendChild(d); return d;
}
/** position of el inside stage (stage px, corrected for any CSS zoom) */
function rel(stage, el) {
  const s = stage.getBoundingClientRect(), r = el.getBoundingClientRect(), k = (s.width / stage.offsetWidth) || 1;
  return { x: (r.left - s.left) / k - stage.clientLeft, y: (r.top - s.top) / k - stage.clientTop, w: r.width / k, h: r.height / k };
}
/** a copy of src lifts out, arcs over and lands on dst (scaled to dst's font size) */
async function fly(c, stage, src, dst, o = {}) {
  const a = rel(stage, src), b = rel(stage, dst);
  const cl = add(stage, h('div', 'u8l4-fly', o.html || src.innerHTML), 0, 0);
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

/* =============================== warm-up: the ticket tray =============================== */
function mountWarm() {
  const tray = document.getElementById('u8l4-tray'), read = document.getElementById('u8l4-read'); if (!tray) return;
  const tix = []; let a = 1;
  for (let i = 0; i < 9; i++) { const s = h('span', 'u8l4-mini'); tray.appendChild(s); tix.push(s); }
  const set = (k) => {
    a = Math.max(0, Math.min(9, k));
    tix.forEach((s, i) => { const ad = i < a; s.className = 'u8l4-mini ' + (ad ? 'u8l4-ma' : 'u8l4-mc'); s.innerHTML = ad ? 'ADULT<b>$12</b>' : 'CHILD<b>$7</b>'; });
    const tot = 12 * a + 7 * (9 - a), hit = tot === 78;
    read.innerHTML = `${a} adult${a === 1 ? '' : 's'} + ${9 - a} kid${9 - a === 1 ? '' : 's'}: <span class="${hit ? 'u8l4-hitt' : 'u8l4-tot'}">$${tot}</span>${hit ? ' <span class="u8l4-hitt">✓ matches the box office!</span>' : ''}`;
  };
  set(1);
  const c = liveCtx();
  document.getElementById('u8l4-more').addEventListener('click', () => { if (a >= 9) return; set(a + 1); pop(c, tix[a - 1], 360); });
  document.getElementById('u8l4-less').addEventListener('click', () => { if (a <= 0) return; const i = a - 1; set(a - 1); pop(c, tix[i], 360); });
}

/* =============================== explainer 1: from the table to one line of algebra =============================== */
const table = {
  title: 'From guess-and-check to substitution',
  height: 470,
  minW: 860,
  intro: () => `Movie night: adult tickets ${T('\\$12')}, kid tickets ${T('\\$7')}, ${T('9')} tickets for ${T('\\$78')}. Press <b>Next</b>.`,
  make(stage, k, ex) {
    const W = ex.W, rows = [1, 2, 3, 4, 5].map((n) => [n, 9 - n, 12 * n + 7 * (9 - n)]);
    const tb = new ValueTable(stage, { x: 14, y: 10, headers: ['\\text{Adults}', '\\text{Kids}', '\\text{Cost (\\$)}'], rows, layout: 'h', cellW: 92, headW: 150, cellH: 50, hide: (r, c) => c > 0 && r > 0, tap: false, diffs: true, diffSpace: 64 });
    const P = panel(stage, 14, 250, W - 28, ex.def.height - 260, '');
    const rr = [
      ['Letters', `${tc(BL, 'a+c=9')}\\qquad ${tc(AM, '12a+7c=78')}`, `a = adults, c = kids`],
      ['Isolate', `${tc(BL, 'c=9-a')}`, 'Question 3!'],
      ['Substitute', `12a+7${tc(BL, '(9-a)')}=78`],
      ['Solve', `12a+63-7a=78\\ \\Rightarrow\\ 5a+63=78\\ \\Rightarrow\\ 5a=15\\ \\Rightarrow\\ ${tc(PU, 'a=3')}`],
      ['Back', `c=9-3=${tc(PU, '6')}\\qquad${tc(PU, '(3,\\ 6)')}`, '3 adults, 6 kids ✓']
    ].map(([g, t, n]) => hidden(wrow(P, g, t, { note: n })));
    P.querySelectorAll('.u8l4-gut').forEach((g) => (g.style.width = '112px'));
    return [
      { cap: `Fill the Kids row: kids and adults always add to ${T('9')}, so kids ${T('=9-')} adults.`, run: (c) => tb.fill(c, { col: 1, stagger: 120 }) },
      { cap: `Fill the Cost row: ${T('12')} per adult plus ${T('7')} per kid. ${T('3')} adults and ${T('6')} kids cost ${T('\\$78')}.`,
        run: async (c) => { await tb.fill(c, { col: 2, stagger: 120 }); tb.cell(2, 2).classList.add('bk-hl'); tb.cell(2, 1).classList.add('bk-hl'); } },
      { cap: `Each extra adult swaps a ${T('\\$7')} kid for a ${T('\\$12')} adult: the cost climbs ${T('\\$5')} every time. That took five guesses.`, run: (c) => tb.diffs(c, { col: 2 }) },
      { cap: `With letters, the story is a system. Neither equation starts ${T('c=\\ldots')}, so <b>isolate first</b>: ${T('a+c=9')} gives ${T('c=9-a')}.`,
        run: async (c) => { await show(c, rr[0]); await show(c, rr[1]); } },
      { cap: `Substitute and solve: ${T('5a+63=78')}, so ${T('a=3')} and ${T('c=6')}. The ${T('63')} is “all kids” (${T('9\\times7')}) and ${T('5a')} is “${T('\\$5')} more per adult”: the table in one line!`,
        run: async (c) => { for (const r of rr.slice(2)) { await show(c, r); await sleep(c, 120); } } }
    ];
  }
};

/* =============================== explainer 2: which variable to isolate? =============================== */
const CH = {
  s1: { label: 'Section 1 system', eqs: [[['x', 1], ['+2y', 2], ['=11']], [['3x', 3], ['-y', -1], ['=5']]],
    opts: [[0, 'x', 'x=11-2y', true, 'no fraction'], [0, 'y', 'y=\\dfrac{11-x}{2}', false, 'fraction'], [1, 'x', 'x=\\dfrac{5+y}{3}', false, 'fraction'], [1, 'y', 'y=3x-5', true, 'no fraction']],
    used: { 0: 'Section 2' }, cap2: `${T('x')} in ${T('x+2y=11')} has coefficient ${T('1')} and ${T('y')} in ${T('3x-y=5')} has coefficient ${T('-1')}: two tidy choices.`,
    cap4: `Section 2 isolates ${T('x=11-2y')}. ${T('y=3x-5')} works just as well; both give ${T('(3,\\ 4)')}.` },
  big: { label: 'Warm-up: the big one', eqs: [[['3x', 3], ['+y', 1], ['=22']], [['2x', 2], ['+5y', 5], ['=32']]],
    opts: [[0, 'x', 'x=\\dfrac{22-y}{3}', false, 'fraction'], [0, 'y', 'y=22-3x', true, 'no fraction'], [1, 'x', 'x=\\dfrac{32-5y}{2}', false, 'fraction'], [1, 'y', 'y=\\dfrac{32-2x}{5}', false, 'fraction']],
    used: { 1: 'Answer B' }, cap2: `Only ${T('y')} in the top equation has coefficient ${T('1')}. The ${T('x')} comes first, but its coefficient is ${T('3')}.`,
    cap4: `B: ${T('y=22-3x')}. Then ${T('2x+5(22-3x)=32')} gives ${T('x=6')}, ${T('y=4')}.` },
  e1: { label: 'Example 1', eqs: [[['2x', 2], ['+y', 1], ['=12']], [['x', 1], ['-4y', -4], ['=-3']]],
    opts: [[0, 'x', 'x=\\dfrac{12-y}{2}', false, 'fraction'], [0, 'y', 'y=12-2x', true, 'no fraction'], [1, 'x', 'x=4y-3', true, 'no fraction'], [1, 'y', 'y=\\dfrac{x+3}{4}', false, 'fraction']],
    used: { 1: 'Example 1' }, cap2: `${T('y')} in ${T('2x+y=12')} and ${T('x')} in ${T('x-4y=-3')} both have coefficient ${T('1')}.`,
    cap4: `Example 1 isolates ${T('y=12-2x')}. ${T('x=4y-3')} is just as tidy: either one gives ${T('(5,\\ 2)')}.` },
  e3: { label: 'Example 3 (a) check', eqs: [[['5x', 5], ['+y', 1], ['=21']], [['2x', 2], ['-3y', -3], ['=5']]],
    opts: [[0, 'x', 'x=\\dfrac{21-y}{5}', false, 'fraction'], [0, 'y', 'y=21-5x', true, 'no fraction'], [1, 'x', 'x=\\dfrac{5+3y}{2}', false, 'fraction'], [1, 'y', 'y=\\dfrac{2x-5}{3}', false, 'fraction']],
    used: { 1: 'Example 3 (a)' }, cap2: `Only ${T('y')} in ${T('5x+y=21')} has coefficient ${T('1')}: the one easy choice.`,
    cap4: `Example 3 (a): isolate ${T('y')} in Equation 1, ${T('y=21-5x')}. Every other choice has a denominator of ${T('5')}, ${T('2')} or ${T('3')}.` },
  e4: { label: 'Example 4', eqs: [[['3x', 3], ['-y', -1], ['=8']], [['x', 1], ['+4y', 4], ['=7']]],
    opts: [[0, 'x', 'x=\\dfrac{8+y}{3}', false, 'fraction'], [0, 'y', 'y=3x-8', true, 'no fraction'], [1, 'x', 'x=7-4y', true, 'no fraction'], [1, 'y', 'y=\\dfrac{7-x}{4}', false, 'fraction']],
    used: { 1: 'Example 4' }, cap2: `${T('y')} in ${T('3x-y=8')} has coefficient ${T('-1')}, and ${T('x')} in ${T('x+4y=7')} has coefficient ${T('1')}.`,
    cap4: `Example 4 practises the ${T('-1')}: ${T('y=3x-8')}. ${T('x=7-4y')} would also be tidy.` },
  e5: { label: 'Example 5', eqs: [[['2x', 2], ['+3y', 3], ['=14']], [['5x', 5], ['-4y', -4], ['=12']]],
    opts: [[0, 'x', 'x=\\dfrac{14-3y}{2}', true, 'fraction, but small'], [0, 'y', 'y=\\dfrac{14-2x}{3}', false, 'fraction'], [1, 'x', 'x=\\dfrac{12+4y}{5}', false, 'fraction'], [1, 'y', 'y=\\dfrac{5x-12}{4}', false, 'fraction']],
    used: { 0: 'Example 5' }, cap2: `No coefficient is ${T('1')} or ${T('-1')}: <b>every</b> choice makes a fraction.`,
    cap4: `Example 5 isolates ${T('x=\\dfrac{14-3y}{2}')}: the smallest denominator. Multiplying by ${T('2')} later clears it.` }
};
const choose = {
  title: 'Which variable should I isolate?',
  height: 446,
  choices: [{ v: 's1', label: CH.s1.label }, { v: 'big', label: CH.big.label }, { sep: 'Example checks' }, ...['e1', 'e3', 'e4', 'e5'].map((k) => ({ v: k, label: CH[k].label }))],
  intro: () => `Four possible choices: either variable, from either equation. Which is tidiest? Press <b>Next</b>.`,
  make(stage, k, ex) {
    const d = CH[k];
    const R = add(stage, box(h('div', 'u8l4-eqrow'), ex.W, 60), 0, 18);
    const terms = [], badges = [];
    d.eqs.forEach((eq, i) => {
      const e = h('span', 'u8l4-ch');
      eq.forEach(([t, kf], j) => {
        const s = h('span', 'u8l4-term', T(tc(EQC[i], (j ? '{}' : '') + t))); e.appendChild(s);
        if (kf != null) { const b = h('span', 'u8l4-coef' + (Math.abs(kf) === 1 ? ' u8l4-one' : ''), String(kf).replace('-', '−')); b.style.opacity = 0; s.appendChild(b); terms.push([s, kf]); badges.push(b); }
      });
      R.appendChild(e);
    });
    const O = add(stage, box(h('div', 'u8l4-opts'), ex.W - 28, 300), 14, 132);
    const cards = d.opts.map(([eqi, v, t, ok, note]) => {
      const eqTex = d.eqs[eqi].map((p) => p[0]).join('');
      const cd = h('div', 'u8l4-opt' + (eqi ? ' u8l4-o2' : ''), `<div class="u8l4-oh">solve ${T(tc(EQC[eqi], eqTex))} for ${T(v)}</div><div class="u8l4-ot">${T(tc(EQC[eqi], t))}</div><div class="u8l4-on">${note}</div>`);
      cd.style.opacity = 0; O.appendChild(cd); cd.ok = ok; cd.frac = /frac/.test(t); return cd;
    });
    return [
      { cap: `Look at the <b>coefficient</b> of each variable.`, run: async (c) => { for (const b of badges) await pop(c, b, 260); } },
      { cap: `A coefficient of ${T('1')} or ${T('-1')} means <b>no dividing</b>, so no fractions. ${d.cap2}`,
        run: async (c) => { terms.forEach(([s, kf]) => s.classList.add(Math.abs(kf) === 1 ? 'u8l4-one' : 'u8l4-notone')); await pulse(c, R, 1.03); } },
      { cap: `All four choices, worked out. Each one is correct; some are tidier.`,
        run: async (c) => {
          for (const cd of cards) {
            await show(c, cd);
            const st = stamp(cd, cd.frac ? 'fraction' : '✓ tidy', { ok: cd.frac ? null : true, size: 'sm' }); await stampIn(c, st);
          }
        } },
      { cap: d.cap4, run: async (c) => {
        for (const [i, lab] of Object.entries(d.used)) { const cd = cards[i]; cd.classList.add('u8l4-pick'); const u = h('div', 'u8l4-used', lab); cd.appendChild(u); await pop(c, u, 320); }
      } }
    ];
  }
};

/* =============================== explainer 3: isolate in one step (−1: every sign flips) =============================== */
const IS = {
  s1x: { label: '§1: x + 2y = 11', parts: ['x', '+2y', '=', '11'], vi: 0, mi: 1, op: '-2y', opw: `subtract ${T('2y')}`, r2: ['x', '=', '11', '-2y'], fin: 'x=11-2y' },
  s1y: { label: '§1: 3x − y = 5', parts: ['3x', '-y', '=', '5'], vi: 1, mi: 0, op: '-3x', opw: `subtract ${T('3x')}`, r2: ['-y', '=', '5', '-3x'], r3: ['y', '=', '-5', '+3x'], fin: 'y=3x-5' },
  e1: { label: 'Example 1: 2x + y = 12', parts: ['2x', '+y', '=', '12'], vi: 1, mi: 0, op: '-2x', opw: `subtract ${T('2x')}`, r2: ['y', '=', '12', '-2x'], fin: 'y=12-2x' },
  e2: { label: 'Example 2: x + 5y = 17', parts: ['x', '+5y', '=', '17'], vi: 0, mi: 1, op: '-5y', opw: `subtract ${T('5y')}`, r2: ['x', '=', '17', '-5y'], fin: 'x=17-5y' },
  e4: { label: 'Example 4: 3x − y = 8', parts: ['3x', '-y', '=', '8'], vi: 1, mi: 0, op: '-3x', opw: `subtract ${T('3x')}`, r2: ['-y', '=', '8', '-3x'], r3: ['y', '=', '-8', '+3x'], fin: 'y=3x-8' }
};
const isolate = {
  title: 'Isolate in one step',
  height: 440,
  choices: [{ v: 's1x', label: IS.s1x.label }, { v: 's1y', label: IS.s1y.label + ' (−1)' }, { sep: 'Example checks' }, ...['e1', 'e2', 'e4'].map((k) => ({ v: k, label: IS[k].label }))],
  intro: (k) => `Get ${T(IS[k].fin[0])} alone in ${T(IS[k].parts.join(''))}. Press <b>Next</b>.`,
  make(stage, k, ex) {
    const d = IS[k], W = ex.W, v = d.fin[0], neg = !!d.r3;
    const tiles = (y, parts, fs) => {
      const R = add(stage, box(h('div', 'u8l4-tiles'), W, 76), 0, y); R.style.fontSize = fs + 'px';
      const ts = parts.map((t, i) => { const e = h('span', 'u8l4-tile' + (t === '=' ? ' u8l4-plain' : ''), T((i && parts[i - 1] !== '=' && t !== '=' ? '{}' : '') + t)); R.appendChild(e); return e; });
      R.ts = ts; return R;
    };
    const R1 = tiles(26, d.parts, 40), R2 = tiles(170, d.r2, 38); R2.style.opacity = 0;
    const R3 = neg ? tiles(268, d.r3, 38) : null; if (R3) R3.style.opacity = 0;
    const fin = add(stage, box(h('div', 'u8l4-mrow u8l4-fin'), W, 60), 0, neg ? 360 : 272); fin.innerHTML = T(tc(PU, d.fin)); fin.style.opacity = 0;
    const badge = (tile, txt, cls = '') => { const m = h('span', 'u8l4-mult u8l4-below ' + cls, txt); m.style.opacity = 0; tile.appendChild(m); return m; };
    const b1 = [badge(R1.ts[d.mi], T(d.op)), badge(R1.ts[3], T(d.op))];
    const coef = d.parts[d.vi].startsWith('-') ? '-1' : '1';
    const flips = neg ? [0, 2, 3].map((i) => badge(R2.ts[i], T('\\times(-1)'), 'u8l4-flipb')) : [];
    const steps = [
      { cap: `${T(v)} has coefficient ${T(coef)}: that is the one to get alone.`, run: async (c) => { R1.ts[d.vi].classList.add('u8l4-hot'); await pulse(c, R1.ts[d.vi], 1.12); } },
      { cap: `Move the other term: ${d.opw} from <b>both sides</b>.`, run: async (c) => { for (const b of b1) await pop(c, b, 300); } },
      { cap: neg ? `${T(d.r2.join(''))}. Careful: that is ${T('-y')}, not ${T('y')}. It still has a ${T('-1')} in front.`
        : `The ${T(d.parts[d.mi].replace('+', ''))} cancels on the left: ${T(d.fin)}. One step, no fraction.`,
        run: async (c) => { R1.ts[d.mi].classList.add('u8l4-fade'); await show(c, R2); if (neg) R2.ts[0].classList.add('u8l4-warn'); } }
    ];
    if (neg) {
      steps.push({ cap: `Multiply <b>every term</b> by ${T('-1')}: <b>every sign flips</b>. ${T(d.r2.join(''))} becomes ${T(d.r3.join(''))}.`,
        run: async (c) => { for (const f of flips) await pop(c, f, 260); await show(c, R3); } });
      steps.push({ cap: `Write the ${T('x')}-term first: ${T(d.fin)}. Ready for Step 2.`, run: async (c) => { await show(c, fin); const st = stamp(fin, '✓ isolated', { ok: true, size: 'sm' }); await stampIn(c, st); } });
    } else {
      steps.push({ cap: `${T(d.fin)} is ready for Step 2: substitute it into the <b>other</b> equation.`, run: async (c) => { await show(c, fin); const st = stamp(fin, '✓ isolated', { ok: true, size: 'sm' }); await stampIn(c, st); } });
    }
    return steps;
  }
};

/* =============================== explainer 4 (the star): the five steps =============================== */
const SUB = {
  s1x: { label: '§2: isolate x', eq: ['x+2y=11', '3x-y=5'], iso: 0,
    chain: 'x+2y=11\\ \\Rightarrow', lhs: 'x=', expr: '11-2y', v: 'x', pre: '3', post: '{}-y=5',
    why: `${T('x')} has coefficient ${T('1')} in ${T('x+2y=11')}: subtract ${T('2y')} from both sides.`,
    solve: ['33-6y-y=5', '33-7y=5', '-7y=-28', 'y=4'], sv: 'y', back: 'x=11-2(4)=3', sol: [3, 4], solTex: '(3,\\ 4)', solPos: 'e',
    lines: [{ m: -0.5, b: 5.5 }, { m: 3, b: -5 }], labs: [[7, 'n'], [4.2, 'e']], g: { xmin: -2, xmax: 10, ymin: -3, ymax: 9, xlabels: 2, ylabels: 2 } },
  s1y: { label: '§2: isolate y instead', eq: ['x+2y=11', '3x-y=5'], iso: 1,
    chain: '3x-y=5\\ \\Rightarrow\\ -y=5-3x\\ \\Rightarrow', lhs: 'y=', expr: '3x-5', v: 'y', pre: 'x+2', post: '{}=11',
    why: `${T('y')} has coefficient ${T('-1')} in ${T('3x-y=5')}: ${T('-y=5-3x')}, then every sign flips: ${T('y=3x-5')}.`,
    solve: ['x+6x-10=11', '7x-10=11', '7x=21', 'x=3'], sv: 'x', back: 'y=3(3)-5=4', sol: [3, 4], solTex: '(3,\\ 4)', solPos: 'e',
    end: `The solution is ${T('(3,\\ 4)')} again: the <b>same</b> crossing point. Either choice works.`,
    lines: [{ m: -0.5, b: 5.5 }, { m: 3, b: -5 }], labs: [[7, 'n'], [4.2, 'e']], g: { xmin: -2, xmax: 10, ymin: -3, ymax: 9, xlabels: 2, ylabels: 2 } },
  mv: { label: 'Warm-up: movie night', eq: ['a+c=9', '12a+7c=78'], iso: 0,
    intro: `Movie night: ${T('a')} = adults (across), ${T('c')} = kids (up). ${bw(0, 'Tickets')} ${T('a+c=9')} and ${bw(1, 'cost')} ${T('12a+7c=78')}. Press <b>Next</b>.`,
    chain: 'a+c=9\\ \\Rightarrow', lhs: 'c=', expr: '9-a', v: 'c', pre: '12a+7', post: '{}=78',
    why: `${T('c')} has coefficient ${T('1')} in ${T('a+c=9')}: subtract ${T('a')}. That was warm-up Question 3!`,
    solve: ['12a+63-7a=78', '5a+63=78', '5a=15', 'a=3'], sv: 'a', back: 'c=9-3=6', sol: [3, 6], solTex: '(3,\\ 6)', solPos: 'e',
    end: `${T('(3,\\ 6)')}: 3 adults and 6 kids, where the lines cross.`,
    lines: [{ m: -1, b: 9 }, { m: -12 / 7, b: 78 / 7 }], labs: [[7.4, 'ne'], [1.3, 'ne']], g: { xmin: -1, xmax: 10, ymin: -1, ymax: 13, xlabels: 2, ylabels: 2, xtitle: 'a', ytitle: 'c' } },
  e1: { label: 'Example 1', eq: ['2x+y=12', 'x-4y=-3'], iso: 0,
    chain: '2x+y=12\\ \\Rightarrow', lhs: 'y=', expr: '12-2x', v: 'y', pre: 'x-4', post: '{}=-3',
    why: `${T('y')} has coefficient ${T('1')} in ${T('2x+y=12')}: subtract ${T('2x')} from both sides.`,
    solve: ['x-48+8x=-3', '9x-48=-3', '9x=45', 'x=5'], sv: 'x', back: 'y=12-2(5)=2', sol: [5, 2], solTex: '(5,\\ 2)', solPos: 'se',
    lines: [{ m: -2, b: 12 }, { m: 0.25, b: 0.75 }], labs: [[2.2, 'e'], [-1, 'n']], g: { xmin: -2, xmax: 10, ymin: -3, ymax: 9, xlabels: 2, ylabels: 2 } },
  e2: { label: 'Example 2', eq: ['x+5y=17', '4x-y=5'], iso: 0,
    chain: 'x+5y=17\\ \\Rightarrow', lhs: 'x=', expr: '17-5y', v: 'x', pre: '4', post: '{}-y=5',
    why: `${T('x')} has coefficient ${T('1')} in ${T('x+5y=17')}: subtract ${T('5y')} from both sides.`,
    solve: ['68-20y-y=5', '68-21y=5', '21y=63', 'y=3'], sv: 'y', back: 'x=17-5(3)=2', sol: [2, 3], solTex: '(2,\\ 3)', solPos: 'e',
    lines: [{ m: -0.2, b: 3.4 }, { m: 4, b: -5 }], labs: [[6, 'n'], [3, 'e']], g: { xmin: -2, xmax: 9, ymin: -4, ymax: 7, xlabels: 2, ylabels: 2 } },
  e3: { label: 'Example 3', eq: ['5x+y=21', '2x-3y=5'], iso: 0,
    chain: '5x+y=21\\ \\Rightarrow', lhs: 'y=', expr: '21-5x', v: 'y', pre: '2x-3', post: '{}=5',
    why: `${T('y')} is the only variable with coefficient ${T('1')}: subtract ${T('5x')} from both sides.`,
    solve: ['2x-63+15x=5', '17x-63=5', '17x=68', 'x=4'], sv: 'x', back: 'y=21-5(4)=1', sol: [4, 1], solTex: '(4,\\ 1)', solPos: 'ne',
    lines: [{ m: -5, b: 21 }, { m: 2 / 3, b: -5 / 3 }], labs: [[3, 'e'], [-0.5, 'n']], g: { xmin: -2, xmax: 9, ymin: -4, ymax: 7, xlabels: 2, ylabels: 2 } },
  e4: { label: 'Example 4', eq: ['3x-y=8', 'x+4y=7'], iso: 0,
    chain: '3x-y=8\\ \\Rightarrow\\ -y=8-3x\\ \\Rightarrow', lhs: 'y=', expr: '3x-8', v: 'y', pre: 'x+4', post: '{}=7',
    why: `${T('y')} has coefficient ${T('-1')}: ${T('-y=8-3x')}, then every sign flips: ${T('y=3x-8')}.`,
    solve: ['x+12x-32=7', '13x-32=7', '13x=39', 'x=3'], sv: 'x', back: 'y=3(3)-8=1', sol: [3, 1], solTex: '(3,\\ 1)', solPos: 'nw',
    lines: [{ m: 3, b: -8 }, { m: -0.25, b: 1.75 }], labs: [[4.4, 'e'], [-1, 'n']], g: { xmin: -2, xmax: 8, ymin: -5, ymax: 6, xlabels: 2, ylabels: 2 } },
  e5: { label: 'Example 5', eq: ['2x+3y=14', '5x-4y=12'], iso: 0,
    chain: '2x+3y=14\\ \\Rightarrow\\ 2x=14-3y\\ \\Rightarrow', lhs: 'x=', expr: '\\dfrac{14-3y}{2}', v: 'x', pre: '5', post: '{}-4y=12',
    why: `No coefficient is ${T('1')} or ${T('-1')}. Solve ${T('2x+3y=14')} for ${T('x')}: ${T('2x=14-3y')}, so ${T('x=\\dfrac{14-3y}{2}')}.`,
    solve: [{ t: '5(14-3y)-8y=24', note: 'every term × 2' }, '70-15y-8y=24', '70-23y=24\\ \\Rightarrow\\ 23y=46', 'y=2'], sv: 'y',
    back: 'x=\\dfrac{14-3(2)}{2}=\\dfrac{8}{2}=4', sol: [4, 2], solTex: '(4,\\ 2)', solPos: 'n',
    lines: [{ m: -2 / 3, b: 14 / 3 }, { m: 1.25, b: -3 }], labs: [[-1, 'n'], [6.4, 'e']], g: { xmin: -2, xmax: 9, ymin: -4, ymax: 7, xlabels: 2, ylabels: 2 } }
};
const xvOf = (d) => (d.g.xtitle || 'x');

/** a system graph: both lines in their colours, each labelled with its equation */
function sysGraph(stage, d, x, y, w, hh) {
  const G = new Graph(stage, Object.assign({ x, y, width: w, height: hh, fontSize: 15 }, d.g));
  const L = d.lines.map((ln, i) => G.line(ln, { color: EQC[i], width: 4 }));
  (d.labs || []).forEach(([lx, pos], i) => G.label(lx, d.lines[i].m * lx + d.lines[i].b, T(d.eq[i]), { pos, cls: 'bk-ptlab', color: EQC[i] }));
  return { G, L };
}

/** the two equation cards: the top one gets isolated (Step 1), its expression lifts into the bottom one (Step 2) */
function subCards(stage, d, x, y, w, o = {}) {
  const top = d.iso, bot = 1 - d.iso, cT = EQC[top], cB = EQC[bot], h1 = o.h1 || 100, h2 = o.h2 || 100;
  const C1 = add(stage, box(h('div', 'u8l4-card' + (top ? ' u8l4-c2' : '')), w, h1), x, y);
  const C2 = add(stage, box(h('div', 'u8l4-card' + (bot ? ' u8l4-c2' : '')), w, h2), x, y + h1 + (o.gap ?? 54));
  C1.appendChild(h('div', 'u8l4-sw')); C2.appendChild(h('div', 'u8l4-sw'));
  const s1 = h('div', 'u8l4-small', '&nbsp;'), b1 = h('div', 'u8l4-big');
  const bigA = chunk(tc(cT, d.eq[top])), bigB = h('span', 'u8l4-ch u8l4-gone');
  const ex1 = chunk(tc(cT, d.expr), 'u8l4-exbox' + (top ? ' u8l4-xa' : ''));
  bigB.append(chunk(tc(cT, d.lhs)), ex1);
  b1.append(bigA, bigB); C1.append(s1, b1);
  const s2 = h('div', 'u8l4-small', '&nbsp;'), b2 = h('div', 'u8l4-big');
  const tall = /frac/.test(d.expr) ? `\\vphantom{${d.expr}}` : '';
  const pre = chunk(tc(cB, d.pre)), slot = chunk(tc(cB, d.v)), lp = chunk(tc(cB, `\\left(${tall}\\right.`), 'u8l4-gone');
  const ex2 = chunk(tc(cT, d.expr), 'u8l4-gone'), rp = chunk(tc(cB, `\\left.${tall}\\right)`), 'u8l4-gone'), post = chunk(tc(cB, d.post));
  b2.append(pre, slot, lp, ex2, rp, post); C2.append(s2, b2);
  const tag = h('div', 'u8l4-tag', o.tag || `only ${T(d.sv)} left!`); tag.style.opacity = 0; C2.appendChild(tag);
  return {
    C1, C2, ex1, ex2, slot, tag,
    async isolate(c) {
      if (d.chain) { s1.innerHTML = T(tc(cT, d.chain)); await show(c, s1); }
      gone(bigA); gone(bigB, false); await show(c, bigB); await pulse(c, ex1, 1.1);
    },
    async substitute(c) {
      s2.innerHTML = 'the <b>other</b> equation'; await show(c, s2);
      slot.classList.add('u8l4-strike'); await shake(c, slot); await sleep(c, 250);
      gone(slot); [lp, ex2, rp].forEach((e) => gone(e, false)); ex2.classList.add('u8l4-hid');
      await Promise.all([pop(c, lp), pop(c, rp)]);
      await fly(c, stage, ex1, ex2);
      ex2.classList.remove('u8l4-hid');
      await pop(c, tag, 420);
    }
  };
}

const lift = {
  title: 'The five steps: isolate, substitute, solve, back-substitute, check',
  height: 540,
  minW: 860,
  choices: [{ v: 's1x', label: SUB.s1x.label }, { v: 's1y', label: SUB.s1y.label }, { v: 'mv', label: SUB.mv.label }, { sep: 'Example checks' }, ...['e1', 'e2', 'e3', 'e4', 'e5'].map((k) => ({ v: k, label: SUB[k].label }))],
  intro: (k) => SUB[k].intro || `${T(tc(BL, SUB[k].eq[0]))} and ${T(tc(AM, SUB[k].eq[1]))}. Neither is solved for a variable yet. On the graph, the solution is where the ${bw(0, 'blue')} and ${bw(1, 'amber')} lines cross. Press <b>Next</b>.`,
  make(stage, k, ex) {
    const d = SUB[k], GW = 400, LW = ex.W - GW - 44, gx = ex.W - GW - 14;
    const { G } = sysGraph(stage, d, gx, 14, GW, 440);
    const K = subCards(stage, d, 14, 14, LW);
    const P = panel(stage, 14, 282, LW, ex.def.height - 296, '', 'u8l4-work');
    const S = add(stage, box(h('div', 'u8l4-soln'), GW, 60), gx, 466);
    const steps = d.solve.map((s) => (typeof s === 'string' ? { t: s } : s)), res = steps[steps.length - 1].t;
    const hor = d.sv === xvOf(d), valTex = res.split('=')[1];
    const solveRows = [];
    return [
      { cap: `<b>Step 1: Isolate.</b> ${d.why}`, run: (c) => K.isolate(c) },
      { cap: `<b>Step 2: Substitute.</b> ${T(d.v)} <b>is</b> ${T(d.expr)}, so lift it into the <b>other</b> equation, in brackets. Now only ${T(d.sv)} is left.`,
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
      { cap: `<b>Step 5: Check and state.</b> ${d.end || `The solution is ${T(d.solTex)}: exactly where the two lines <b>cross</b>.`}`,
        run: async (c) => {
          const pt = G.point(d.sol[0], d.sol[1], { color: PU, r: 8, label: T(tc(PU, d.solTex)), pos: d.solPos });
          await G.reveal(pt, c);
          const sp = h('span', 'u8l4-ch', T(tc(PU, d.solTex))); S.appendChild(sp); await show(c, sp);
          const st = stamp(S, 'on both lines', { ok: true }); await stampIn(c, st);
        } }
    ];
  }
};

/* =============================== explainer 5: fractions that clear =============================== */
const FR = {
  e5: { label: 'Example 5: isolate x', tiles: ['5\\left(\\dfrac{14-3y}{2}\\right)', '-4y', '=', '12'], m: 2, tiles2: ['5(14-3y)', '-8y', '=', '24'], warn: 0,
    intro: `Example 5 after Step 2: ${T('5\\left(\\dfrac{14-3y}{2}\\right)-4y=12')}. A fraction! Press <b>Next</b>.`,
    cap2: `${T('5\\left(\\dfrac{14-3y}{2}\\right)\\times2=5(14-3y)')}: the ${T('2')} underneath cancels. Then ${T('-4y\\times2=-8y')} and ${T('12\\times2=24')}.`,
    r3: `${tc(PU, '70-15y')}-8y=24`, n3: '5 times each term in the bracket', r4: `70-23y=24\\ \\Rightarrow\\ 23y=46\\ \\Rightarrow\\ ${tc(PU, 'y=2')}`,
    cap4: `Collect and solve: ${T('23y=46')}, so ${T('y=2')}. Then ${T('x=\\dfrac{14-3(2)}{2}=\\dfrac{8}{2}=4')}: whole numbers after all.` },
  e5y: { label: 'Example 5: isolate y instead', tiles: ['5x', '-4\\left(\\dfrac{14-2x}{3}\\right)', '=', '12'], m: 3, tiles2: ['15x', '-4(14-2x)', '=', '36'], warn: 1,
    intro: `Example 5 again, isolating ${T('y=\\dfrac{14-2x}{3}')} instead: ${T('5x-4\\left(\\dfrac{14-2x}{3}\\right)=12')}. Press <b>Next</b>.`,
    cap2: `${T('5x\\times3=15x')}, the ${T('3')} underneath cancels, and ${T('12\\times3=36')}. Keep the bracket: ${T('-4(14-2x)')}.`,
    r3: `15x${tc(PU, '-56+8x')}=36`, n3: '(−4)(−2x) = +8x', r4: `23x-56=36\\ \\Rightarrow\\ 23x=92\\ \\Rightarrow\\ ${tc(PU, 'x=4')}`,
    cap4: `${T('23x=92')}, so ${T('x=4')}, and ${T('y=\\dfrac{14-2(4)}{3}=\\dfrac{6}{3}=2')}. The same ${T('(4,\\ 2)')} either way.` }
};
const fracs = {
  title: 'Fractions that clear',
  height: 420,
  choices: Object.keys(FR).map((k) => ({ v: k, label: FR[k].label })),
  intro: (k) => FR[k].intro,
  make(stage, k, ex) {
    const d = FR[k], W = ex.W;
    const mrow = (y, t, note) => { const r = add(stage, box(h('div', 'u8l4-mrow', T(t) + (note ? `<span class="u8l4-why">${note}</span>` : '')), W, 52), 0, y); r.style.opacity = 0; return r; };
    const R1 = add(stage, box(h('div', 'u8l4-tiles'), W, 84), 0, 58);
    const tl = d.tiles.map((t, i) => { const e = h('span', 'u8l4-tile' + (i === 2 ? ' u8l4-plain' : ''), T((i === 1 ? '{}' : '') + t)); R1.appendChild(e); return e; });
    const R2 = add(stage, box(h('div', 'u8l4-tiles'), W, 80), 0, 172); R2.style.opacity = 0;
    const t2 = d.tiles2.map((t, i) => { const e = h('span', 'u8l4-tile' + (i === 2 ? ' u8l4-plain' : i === d.warn ? ' u8l4-warn' : ''), T((i === 1 ? '{}' : '') + t)); R2.appendChild(e); return e; });
    const r3 = mrow(272, d.r3, d.n3), r4 = mrow(336, d.r4);
    const ms = [0, 1, 3].map((i) => { const m = h('span', 'u8l4-mult', `× ${d.m}`); m.style.opacity = 0; tl[i].appendChild(m); return m; });
    return [
      { cap: `Multiply <b>every term</b>, on both sides, by the denominator ${T(d.m)}.`, run: async (c) => { for (const m of ms) await pop(c, m, 300); } },
      { cap: d.cap2, run: async (c) => { await show(c, R2); await pulse(c, t2[d.warn], 1.08); } },
      { cap: `Expand the bracket: the number in front multiplies <b>each</b> term inside.`, run: (c) => show(c, r3) },
      { cap: d.cap4, run: (c) => show(c, r4) }
    ];
  }
};

/* =============================== explainer 6: check in the ORIGINAL equations =============================== */
const CK = {
  claim: { label: 'Is (7, 2) a solution?', sys: SUB.e2, at: 'x=7,\\ y=2', pt: [7, 2], ptTex: '(7,\\ 2)', real: [2, 3], realTex: '(2,\\ 3)',
    intro: `Example 2’s system. Someone claims ${T('(7,\\ 2)')} is the solution. Check it in both <b>original</b> equations. Press <b>Next</b>.`,
    c: [{ eq: 'x+5y=17', L: '7+5(2)=7+10=17', R: '17', v: '17', rv: '17', ok: true }, { eq: '4x-y=5', L: '4(7)-2=28-2=26', R: '5', v: '26', rv: '5', ok: false }],
    end: `It balances only the blue equation, so it is on the blue line only. <b>Not a solution.</b> The real solution is the crossing point ${T('(2,\\ 3)')}.` },
  s1: { label: '§2 system', sys: SUB.s1x, at: 'x=3,\\ y=4', pt: [3, 4], ptTex: '(3,\\ 4)',
    c: [{ eq: 'x+2y=11', L: '3+2(4)=3+8=11', R: '11', v: '11', rv: '11', ok: true }, { eq: '3x-y=5', L: '3(3)-4=9-4=5', R: '5', v: '5', rv: '5', ok: true }] },
  e1: { label: 'Example 1', sys: SUB.e1, at: 'x=5,\\ y=2', pt: [5, 2], ptTex: '(5,\\ 2)',
    c: [{ eq: '2x+y=12', L: '2(5)+2=10+2=12', R: '12', v: '12', rv: '12', ok: true }, { eq: 'x-4y=-3', L: '5-4(2)=5-8=-3', R: '-3', v: '-3', rv: '-3', ok: true }] },
  e2: { label: 'Example 2', sys: SUB.e2, at: 'x=2,\\ y=3', pt: [2, 3], ptTex: '(2,\\ 3)',
    c: [{ eq: 'x+5y=17', L: '2+5(3)=2+15=17', R: '17', v: '17', rv: '17', ok: true }, { eq: '4x-y=5', L: '4(2)-3=8-3=5', R: '5', v: '5', rv: '5', ok: true }] },
  e3: { label: 'Example 3', sys: SUB.e3, at: 'x=4,\\ y=1', pt: [4, 1], ptTex: '(4,\\ 1)',
    c: [{ eq: '5x+y=21', L: '5(4)+1=20+1=21', R: '21', v: '21', rv: '21', ok: true }, { eq: '2x-3y=5', L: '2(4)-3(1)=8-3=5', R: '5', v: '5', rv: '5', ok: true }] },
  e4: { label: 'Example 4', sys: SUB.e4, at: 'x=3,\\ y=1', pt: [3, 1], ptTex: '(3,\\ 1)',
    c: [{ eq: '3x-y=8', L: '3(3)-1=9-1=8', R: '8', v: '8', rv: '8', ok: true }, { eq: 'x+4y=7', L: '3+4(1)=3+4=7', R: '7', v: '7', rv: '7', ok: true }] },
  e5: { label: 'Example 5', sys: SUB.e5, at: 'x=4,\\ y=2', pt: [4, 2], ptTex: '(4,\\ 2)',
    c: [{ eq: '2x+3y=14', L: '2(4)+3(2)=8+6=14', R: '14', v: '14', rv: '14', ok: true }, { eq: '5x-4y=12', L: '5(4)-4(2)=20-8=12', R: '12', v: '12', rv: '12', ok: true }] }
};
function ckCard(stage, q, i, at, x, y, w, hh) {
  const P = panel(stage, x, y, w, hh, `In ${T(tc(EQC[i], q.eq))} with ${T(at)}`, 'u8l4-ckc u8l4-ck' + (i + 1));
  const rows = [wrow(P, 'Left side', q.L), wrow(P, 'Right side', q.R)];
  const vr = wrow(P, '', `${q.v}${q.ok ? '=' : '\\ne'}${q.rv}`, { note: q.ok ? '✓ balances' : '✗ does not balance', ncls: q.ok ? 'u8l4-good' : 'u8l4-bad' });
  vr.m.classList.add(q.ok ? 'u8l4-okbox' : 'u8l4-nobox');
  rows.push(vr); rows.forEach((r) => (r.style.opacity = 0));
  P.play = async (c) => { for (const r of rows) { await show(c, r); await sleep(c, 140); } };
  return P;
}
const checkBoth = {
  title: 'Check in BOTH original equations',
  height: 500,
  minW: 900,
  choices: [{ v: 'claim', label: CK.claim.label }, { v: 's1', label: CK.s1.label }, { sep: 'Example checks' }, ...['e1', 'e2', 'e3', 'e4', 'e5'].map((k) => ({ v: k, label: CK[k].label }))],
  intro: (k) => CK[k].intro || `${CK[k].label}: is ${T(CK[k].ptTex)} the solution? It must balance <b>both</b> original equations. Press <b>Next</b>.`,
  make(stage, k, ex) {
    const d = CK[k], s = d.sys, GW = 380, CW = ex.W - GW - 44, CH2 = (ex.def.height - 42) / 2;
    const { G } = sysGraph(stage, s, ex.W - GW - 14, 14, GW, 390);
    const cards = d.c.map((q, i) => ckCard(stage, q, i, d.at, 14, 14 + i * (CH2 + 14), CW, CH2));
    const S = add(stage, box(h('div', 'u8l4-soln'), GW, 76), ex.W - GW - 14, 412);
    const both = d.c.every((q) => q.ok);
    const capC = (i) => { const q = d.c[i]; return `In the ${bw(i, i ? 'amber' : 'blue')} equation ${T(q.eq)}: the left side is ${T(q.v)} and the right side is ${T(q.rv)} ${q.ok ? '✓' : '✗'}.`; };
    return [
      { cap: `Plot ${T(d.ptTex)} on the graph.`, run: async (c) => { await G.reveal(G.point(d.pt[0], d.pt[1], { color: PU, r: 8, label: T(tc(PU, d.ptTex)), pos: d.real ? 'e' : 'ne' }), c); } },
      { cap: capC(0), run: (c) => cards[0].play(c) },
      { cap: capC(1), run: (c) => cards[1].play(c) },
      { cap: both ? `It balances <b>both</b> original equations, so it lies on <b>both</b> lines: ${T(d.ptTex)} is the solution.` : d.end,
        run: async (c) => {
          if (!both) await G.reveal(G.point(d.real[0], d.real[1], { color: PU, r: 8, open: true, label: T(tc(PU, d.realTex)), pos: 'e' }), c);
          const st = stamp(S, both ? 'solution ✓' : 'not a solution ✗', { ok: both }); await stampIn(c, st);
        } }
    ];
  }
};

/* =============================== mount =============================== */
mountWarm();
export const explainers = mountExplainers({ table, choose, isolate, lift, fracs, checkBoth });
export const _test = { CH, IS, SUB, FR, CK };

/* ============ Stand Up Break! — isolate a variable first, then substitute (lessons/js/standup.js) ============
 * Systems are built from their integer solution; the key is worked from the equations: isolate (a coefficient of 1 or −1,
 * or a fraction at Mastery), substitute in brackets, solve, back-substitute. Equation 1 blue, equation 2 amber. */
{
  const tm = (k, v, first) => (k === 0 ? '' : (k < 0 ? '-' : first ? '' : '+') + (Math.abs(k) === 1 && v ? '' : Math.abs(k)) + v);
  /* p·u + q, written constant-first when only the constant is positive (12 − 2x), else u-term first (3x − 8) */
  const cf = (p, q) => p < 0 && q > 0;
  const nat = (p, u, q) => (cf(p, q) ? q + tm(p, u, false) : (tm(p, u, true) + tm(q, '', false))) || '0';
  const eqT = (e) => tm(e.a, 'x', true) + tm(e.b, 'y', !e.a) + '=' + e.c;
  const half = (s, col) => { const i = s.indexOf('='); return `\\textcolor{${col}}{${s.slice(0, i)}}&\\textcolor{${col}}{${s.slice(i)}}`; };
  const sysT = (s1, s2) => `\\begin{aligned}${half(s1, BL)}\\\\${half(s2, AM)}\\end{aligned}`;
  const par = (n) => (n < 0 ? `(${n})` : String(n));
  /* p·(value) as written in a back-substitution, first or after a constant */
  const pv = (p, val, first) => (p < 0 ? '-' : first ? '' : '+') + (Math.abs(p) === 1 ? par(val) : `${Math.abs(p)}(${val})`);
  /** isolate v in e, substitute into f, solve, back-substitute. Returns the answer lines, or null. */
  function work(e, f, v, x0, y0) {
    const u = v === 'x' ? 'y' : 'x';
    const cv = v === 'x' ? e.a : e.b, cu = v === 'x' ? e.b : e.a, fv = v === 'x' ? f.a : f.b, fu = v === 'x' ? f.b : f.a;
    if (!cv || !cu || !fv || !fu) return null;
    const s = Math.sign(cv), d = Math.abs(cv), P = -s * cu, Qc = s * e.c;      // v = (P·u + Qc) / d
    const num = nat(P, u, Qc), expr = d === 1 ? num : `\\dfrac{${num}}{${d}}`;
    const iso = d === 1
      ? (s === 1 ? `${eqT(e)}\\ \\Rightarrow\\ ${v}=${expr}` : `${eqT(e)}\\ \\Rightarrow\\ -${v}=${nat(-cu, u, e.c)}\\ \\Rightarrow\\ ${v}=${expr}`)
      : `${eqT(e)}\\ \\Rightarrow\\ ${tm(cv, v, true)}=${nat(-cu, u, e.c)}\\ \\Rightarrow\\ ${v}=${expr}`;
    const kk = fv === 1 ? '' : fv === -1 ? '-' : String(fv);
    const vPart = d === 1 ? `${kk}(${expr})` : `${kk}\\left(${expr}\\right)`;
    const join = (vp, D) => (v === 'x' ? vp + tm(fu * D, 'y', false) : tm(fu * D, 'x', true) + (vp[0] === '-' ? '' : '+') + vp);
    const sub = `${join(vPart, 1)}=${f.c}`;
    const mult = d === 1 ? null : `${join(`${kk}(${num})`, d)}=${f.c * d}`;
    const D = d, kP = fv * P, kQ = fv * Qc, uD = fu * D, RHS = f.c * D;    // after clearing: kP·u + kQ + uD·u = RHS
    const vTerms = cf(P, Qc) ? tm(kQ, '', true) + tm(kP, u, false) : tm(kP, u, true) + tm(kQ, '', false);
    const exp = (v === 'x' ? vTerms + tm(uD, u, false) : tm(uD, u, true) + (vTerms[0] === '-' ? '' : '+') + vTerms) + '=' + RHS;
    const K = kP + uD; if (!K || (RHS - kQ) % K) return null;
    const u0 = (RHS - kQ) / K, v0 = (P * u0 + Qc) / d;
    if (!Number.isInteger(v0) || (v === 'x' ? v0 !== x0 || u0 !== y0 : v0 !== y0 || u0 !== x0)) return null;
    const coll = (cf(P, Qc) && kQ > 0 ? tm(kQ, '', true) + tm(K, u, false) : tm(K, u, true) + tm(kQ, '', false)) + '=' + RHS;
    const lin = `${tm(K, u, true)}=${RHS - kQ}`, sol = `${u}=${u0}`;
    const chain = [exp, coll, lin, sol].filter((t, i, a) => t !== a[i - 1]);
    const numU = cf(P, Qc) ? `${Qc}${pv(P, u0, false)}` : `${pv(P, u0, true)}${tm(Qc, '', false)}`;
    const back = d === 1 ? `${v}=${numU}=${v0}` : `${v}=\\dfrac{${numU}}{${d}}=\\dfrac{${P * u0 + Qc}}{${d}}=${v0}`;
    return [iso, sub, mult, chain.slice(0, 2).join('\\ \\Rightarrow\\ '), chain.slice(2).join('\\ \\Rightarrow\\ '), `${back}\\qquad(${x0},\\ ${y0})`].filter(Boolean);
  }
  const SOLVE = 'Isolate a variable first, then solve by substitution. Check in both equations.';
  /** o: { lo, hi, oneNeg, needNeg, cv: [coefficients of the isolated variable], cu, fa, fb, yOnly (−1 only works on y) } */
  function build(r, o) {
    for (;;) {
      const x0 = r.int(o.lo, o.hi), y0 = r.int(o.lo, o.hi);
      if (x0 === y0 || (o.oneNeg && x0 < 0 && y0 < 0) || (o.needNeg && x0 >= 0 && y0 >= 0)) continue;
      const cvv = r.pick(o.cv), v = cvv < 0 || o.yOnly || r.chance(0.5) ? 'y' : 'x', cuv = r.pick(o.cu);
      const e = v === 'y' ? { a: cuv, b: cvv } : { a: cvv, b: cuv }; e.c = e.a * x0 + e.b * y0;
      if (e.a < 0) continue;
      const f = { a: r.pick(o.fa), b: r.pick(o.fb) }; f.c = f.a * x0 + f.b * y0;
      if (e.a * f.b === e.b * f.a) continue;
      if (o.noOne && [e.a, e.b, f.a, f.b].some((c) => Math.abs(c) === 1)) continue;
      const a = work(e, f, v, x0, y0); if (!a) continue;
      const first = r.chance(0.65);
      return { text: SOLVE, q: first ? sysT(eqT(e), eqT(f)) : sysT(eqT(f), eqT(e)), a };
    }
  }
  standup('u8l4', {
    intro: 'Neither equation is solved for a variable yet. Find a coefficient of 1 or −1, isolate it, substitute into the other equation, solve, back-substitute, and check.',
    levels: {
      /* Beginning: a variable with coefficient 1 (Examples 1 and 2), positive whole-number answers */
      BEG: (r) => build(r, { lo: 1, hi: 7, oneNeg: true, cv: [1], cu: [2, 3, 4, 5], fa: [2, 3, 4], fb: [2, 3, 5] }),
      /* Progressing: the coefficient may be −1 (Example 4); minus signs in the other equation; one answer may be negative */
      PRG: (r) => build(r, { lo: -3, hi: 7, oneNeg: true, cv: [1, -1, -1], cu: [2, 3, 4, 5], fa: [2, 3, 4, 5], fb: [2, 3, 4, -2, -3, -4] }),
      /* Mastery: no coefficient is 1 or −1, so isolating makes a fraction that clears (Example 5); or −1 with negatives */
      MAS: (r) => (r.chance(0.5)
        ? build(r, { lo: -3, hi: 6, cv: [2, 3], cu: [3, 5, -3, -5], fa: [2, 3, 4, 5], fb: [2, 3, 4, -2, -3, -4], noOne: true })
        : build(r, { lo: -6, hi: 6, needNeg: true, cv: [-1], yOnly: true, cu: [2, 3, 4, 5, 6], fa: [2, 3, 5], fb: [-2, -3, -4, -5, 3, 4] }))
    }
  });
}
