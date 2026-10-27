/* Math 15 · Unit 5 · Lesson 9 — Function Notation: Evaluating and Interpreting f(x).
 * The pizza-counter warm-up, the explainers, the Math History box and the Stand Up Break.
 * Adapted from Math 10C u5l6 (function machine, anatomy, substitution, forwards/backwards, expressions as inputs).
 * Colour code for the notation (whole lesson): the function's NAME purple, the INPUT blue, the OUTPUT amber. */
import {
  h, tex, add, box, Graph, stamp, stampIn, checkCard, mountExplainers,
  pop, fadeIn, pulse, sleep, svgEl, arrowHead, liveCtx, drawIn, fit
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
/* KaTeX with \htmlClass allowed (so parts of an expression can be coloured or highlighted) */
const K = (src, display) => {
  const esc = (t) => t.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  try {
    return window.katex.renderToString(String(src), { displayMode: !!display, throwOnError: false, strict: 'ignore', trust: true, output: 'html' })
      .replace('<span class="katex"', '<span data-tex="' + esc(String(src)) + '" class="katex"');
  } catch (e) { return tex(src, display); }
};
const PUR = '#7b4fc4', BLU = '#1f5bd6', AMB = '#c27a0e';
const NM = (s) => `\\htmlClass{u5l9-cn}{${s}}`, IN = (s) => `\\htmlClass{u5l9-ci}{${s}}`, OUT = (s) => `\\htmlClass{u5l9-co}{${s}}`;
const X = '\\htmlClass{u5l9-slot}{x}';            // an x in a rule: a slot for the input
const S = (v) => `\\htmlClass{u5l9-sub}{(${v})}`;  // what went into the slot, in brackets
const KL = (src) => K(src.replace(/=\\htmlClass/g, '=\\;\\htmlClass')); // keep the space after = before a highlighted group

const panel = (stage, x, y, w, hh, title) => add(stage, box(h('div', 'u5l9-panel', title ? `<div class="u5l9-ph">${title}</div>` : ''), w, hh), x, y);
const line = (p, html, cls = '') => { const d = h('div', 'u5l9-pl ' + cls, html); p.appendChild(d); return d; };
const inner = (el) => { const cs = getComputedStyle(el); return el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight); };
const hide = (...els) => els.forEach((e) => { if (e) e.style.opacity = 0; });
const keysHTML = (s) => `<span class="keys">${s.split(' ').map((k) => `<kbd>${k === '=' ? 'ENTER' : k}</kbd>`).join('')}</span>`;
/* an element's box in stage coordinates (the lesson page may be scaled) */
function rel(stage, el) {
  const s = stage.getBoundingClientRect(), r = el.getBoundingClientRect(), k = s.width / (stage.offsetWidth || s.width) || 1;
  return { x: (r.left - s.left) / k - stage.clientLeft, y: (r.top - s.top) / k - stage.clientTop, w: r.width / k, h: r.height / k };
}
/* an arrow drawn in an SVG: a group that drawIn() can animate */
function arrowLine(svg, pts, color, w = 3.5) {
  const g = svgEl('g', { class: 'bk-curve' }, svg); g.style.color = color;
  svgEl('path', { class: 'bk-stroke', d: 'M' + pts.map((p) => p.join(' ')).join('L'), fill: 'none', stroke: color, 'stroke-width': w, 'stroke-linecap': 'round' }, g);
  const a = pts[pts.length - 2], b = pts[pts.length - 1];
  arrowHead(g, b[0], b[1], b[0] - a[0], b[1] - a[1], { width: w, color, cls: 'bk-end bk-end1' });
  return g;
}

/* ======================= explainer 1: the function machine ======================= */
const MC = {
  f: {
    label: T('f(x)=2x+5'), name: 'f', rule: 'f(x)=2x+5', graph: { xmin: -6, xmax: 6, ymin: -6, ymax: 18, ystep: 2, ylabels: 4 }, curve: (x) => 2 * x + 5,
    ins: [
      { a: '3', o: '11', x: 3, y: 11, pos: 'w', win: '<div>' + K('2(3)+5') + '</div><div>' + K('=11') + '</div>', say: `Inside, the ${T('x')} is replaced by ${T('3')}: ${T('2(3)+5=11')}.`, read: '“<b>f of 3 is 11</b>”' },
      { a: '0', o: '5', x: 0, y: 5, pos: 'e', win: '<div>' + K('2(0)+5') + '</div><div>' + K('=5') + '</div>' },
      { a: '-4', o: '-3', x: -4, y: -3, pos: 'e', win: '<div>' + K('2(-4)+5') + '</div><div>' + K('=-3') + '</div>' }
    ],
    end: `Each input with its output is a point ${T('(x,\\ f(x))')}. They all lie on the line ${T('y=2x+5')}: the graph of ${T('f')}.`
  },
  P: {
    label: 'Pizza: ' + T('P(t)=8+2t'), name: 'P', rule: 'P(t)=8+2t', graph: { xmin: 0, xmax: 8, ymin: 0, ymax: 26, ystep: 2, ylabels: 4, xtitle: 't', ytitle: 'P(t)' }, dots: [0, 8],
    ins: [
      { a: '0', o: '8', x: 0, y: 8, pos: 'e', win: '<div>' + K('8+2(0)') + '</div><div>' + K('=8') + '</div>', say: `Inside, the ${T('t')} is replaced by ${T('0')}: ${T('8+2(0)=8')}.`, read: '“<b>P of 0 is 8</b>”' },
      { a: '3', o: '14', x: 3, y: 14, pos: 'w', win: '<div>' + K('8+2(3)') + '</div><div>' + K('=14') + '</div>' },
      { a: '5', o: '18', x: 5, y: 18, pos: 'w', win: '<div>' + K('8+2(5)') + '</div><div>' + K('=18') + '</div>' }
    ],
    end: `The warm-up tickets! Toppings come in <b>whole numbers</b>, so the graph of ${T('P')} is separate <b>dots</b>, not a line.`
  },
  g: {
    label: T('g(x)=x^2+3'), name: 'g', rule: 'g(x)=x^2+3', graph: { xmin: -4, xmax: 4, ymin: -2, ymax: 14, ystep: 2, ylabels: 2 }, curve: (x) => x * x + 3,
    ins: [
      { a: '3', o: '12', x: 3, y: 12, pos: 'w', win: '<div>' + K('(3)^2+3') + '</div><div>' + K('=12') + '</div>', say: `Inside, the ${T('x')} is replaced by ${T('3')}: ${T('(3)^2+3=12')}.`, read: '“<b>g of 3 is 12</b>”' },
      { a: '-1', o: '4', x: -1, y: 4, pos: 'w', win: '<div>' + K('(-1)^2+3') + '</div><div>' + K('=4') + '</div>' },
      { a: '1', o: '4', x: 1, y: 4, pos: 'e', win: '<div>' + K('(1)^2+3') + '</div><div>' + K('=4') + '</div>' }
    ],
    end: `${T('-1')} and ${T('1')} both give ${T('4')}. That is allowed: each input still has exactly <b>one</b> output, so ${T('g')} is a function.`
  }
};
const machine = {
  title: 'The function machine',
  height: 356,
  minW: 940,
  choices: Object.keys(MC).map((k) => ({ v: k, label: MC[k].label })),
  intro: 'An <b>input</b> goes in, the rule acts on it, and exactly <b>one output</b> comes out. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = MC[k], W = ex.W, MX = 186, MW = 280, MY = 18, MH = 222, BY = MY + MH / 2 - 36;
    const mach = add(stage, box(h('div', 'u5l9-mach', `<div class="u5l9-mname">${K(NM(d.name))}</div><div class="u5l9-mrule">${K(d.rule)}</div><div class="u5l9-mwin"></div>`), MW, MH), MX, MY);
    const win = mach.querySelector('.u5l9-mwin');
    add(stage, h('div', 'u5l9-mouth in'), MX - 18, BY + 4); add(stage, h('div', 'u5l9-mouth out'), MX + MW - 4, BY + 4);
    add(stage, box(h('div', 'u5l9-io', 'input'), 100, 24), 20, BY + 84); add(stage, box(h('div', 'u5l9-io', 'output'), 100, 24), MX + MW + 18, BY + 84);
    const note = add(stage, box(h('div', 'u5l9-note', ''), 560, 96), MX + MW / 2 - 280, 256);
    const G = new Graph(stage, Object.assign({ x: W - 324, y: 8, width: 314, height: 338, ytitle: 'y' }, d.graph));
    const notation = (r) => K(`${NM(d.name)}(${IN(r.a)})=${OUT(r.o)}`);
    const drop = async (c, i, q) => {
      stage.querySelectorAll('.u5l9-ball').forEach((b) => b.remove()); win.innerHTML = '';
      const b = add(stage, h('div', 'u5l9-ball in', K(d.ins[i].a)), 24, BY);
      await c.anim(b, [{ opacity: 0, transform: 'translateX(-30px)' }, { opacity: 1, transform: 'translateX(0)' }], q ? 200 : 320);
      await c.anim(b, [{ opacity: 1, transform: 'translateX(0) scale(1)' }, { opacity: 0, transform: 'translateX(150px) scale(.4)' }], q ? 380 : 650);
    };
    const work = async (c, i, q) => { win.innerHTML = d.ins[i].win; await Promise.all([fadeIn(c, win, q ? 220 : 380), pulse(c, mach, 1.03, q ? 300 : 460)]); };
    const out = async (c, i, q) => {
      const r = d.ins[i], b = add(stage, h('div', 'u5l9-ball out', K(r.o)), MX + MW + 22, BY);
      await c.anim(b, [{ opacity: 0, transform: 'translateX(-70px) scale(.4)' }, { opacity: 1, transform: 'translateX(0) scale(1)' }], q ? 360 : 600);
      note.innerHTML = `<div class="u5l9-nbig">${notation(r)}</div>` + (r.read ? `<div class="u5l9-nread">read ${r.read}</div>` : '');
      await pop(c, note.firstChild, 380);
      const p = G.point(r.x, r.y, { color: 'blue', coords: true, pos: r.pos, r: 7 }); await G.reveal(p, c);
    };
    const r0 = d.ins[0];
    return [
      { cap: `This machine is called ${T(d.name)}. Its rule: ${T(d.rule)}.`, run: (c) => pulse(c, mach.firstChild, 1.25) },
      { cap: `Drop in the input ${T(r0.a)}.`, run: (c) => drop(c, 0) },
      { cap: r0.say, run: (c) => work(c, 0) },
      { cap: `Out comes ${T(r0.o)}. We write ${T(`${d.name}(${r0.a})=${r0.o}`)}, read ${r0.read}.`, run: (c) => out(c, 0) },
      { cap: `Two more inputs: ${T(`${d.name}(${d.ins[1].a})=${d.ins[1].o}`)} and ${T(`${d.name}(${d.ins[2].a})=${d.ins[2].o}`)}.`,
        run: async (c) => { for (const i of [1, 2]) { await drop(c, i, true); await work(c, i, true); await out(c, i, true); await sleep(c, 200); } } },
      { cap: d.end,
        run: async (c) => {
          if (d.dots) {
            const used = d.ins.map((r) => r.x), extra = [];
            for (let t = d.dots[0]; t <= d.dots[1]; t++) if (!used.includes(t)) extra.push(G.point(t, 8 + 2 * t, { color: 'gray', r: 5 }));
            hide(...extra); await Promise.all(extra.map((p, i) => pop(c, p, 300, { delay: i * 70 })));
          } else { const L = G.fn(d.curve, { color: 'gray', width: 2.5, dash: true }); await G.drawIn(L, 900, c); }
        } }
    ];
  }
};

/* ======================= explainer 2: reading the notation ======================= */
const AN = {
  f: {
    label: T('f(3)=11'), parts: ['f', '(3)', '11'],
    labs: ['the <b>name</b> of the function', 'the <b>input</b>: an <i>x</i>-value', 'the <b>output</b>: a <i>y</i>-value'], not: 'f\\times3',
    caps: [`${T('f')} is the <b>name</b> of the function. Other names you will see: ${T('g,\\ h,\\ C,\\ P')}…`,
      `The brackets hold the <b>input</b>. ${T('f(3)')} does <b>not</b> mean ${T('f')} times 3.`,
      'After the equals sign comes the <b>output</b>: the value of the function.'],
    read: `Say it: “<b>f of 3 is 11</b>”. It means the same as ${T('y=11')} when ${T('x=3')}: the point ${T('(3,\\ 11)')}.`
  },
  P: {
    label: T('P(5)=18'), parts: ['P', '(5)', '18'], not: 'P\\times5',
    labs: ['the <b>name</b>: Luigi’s price rule', 'the <b>input</b>: 5 toppings', 'the <b>output</b>: the price, $18'],
    caps: [`${T('P')} is the name of the pizza price rule from the warm-up.`, 'The brackets hold the <b>input</b>: the number of toppings.', 'The <b>output</b> is the price in dollars.'],
    read: 'Say it: “<b>P of 5 is 18</b>”. A 5-topping pizza costs $18.'
  },
  fx: {
    label: T('f(x)=2x+5'), parts: ['f', '(x)', '2x+5'], not: 'f\\times x',
    labs: ['the <b>name</b>', 'the <b>input variable</b>', 'the <b>rule</b> for the output'],
    caps: [`The function is named ${T('f')}.`, `Its input variable is ${T('x')}. Again, not ${T('f')} times ${T('x')}.`, `Here the right side is the <b>rule</b>: what the machine does to ${T('x')}.`],
    read: `${T('f(x)')} does double duty: it names the <b>rule</b>, and it is a <b>value</b> once a number goes in: ${T('f(3)=2(3)+5=11')}.`
  }
};
const anatomy = {
  title: 'Reading function notation',
  height: 334,
  minW: 820,
  choices: Object.keys(AN).map((k) => ({ v: k, label: AN[k].label })),
  intro: 'Every piece of the notation has a job. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = AN[k], W = ex.W, cls = ['u5l9-pn', 'u5l9-pi', 'u5l9-po'], colors = [PUR, BLU, AMB];
    const big = add(stage, box(h('div', 'u5l9-big', K(`\\htmlClass{${cls[0]}}{${d.parts[0]}}\\htmlClass{${cls[1]}}{${d.parts[1]}}=\\htmlClass{${cls[2]}}{${d.parts[2]}}`)), W, 110), 0, 22);
    const svg = add(stage, svgEl('svg', { width: W, height: 330, class: 'u5l9-ov' }), 0, 0);
    const readEl = add(stage, box(h('div', 'u5l9-read', d.read), W - 60, 60), 30, 262); hide(readEl);
    const show = async (c, i) => {
      const part = big.querySelector('.' + cls[i]); part.classList.add('on');
      const r = rel(stage, part), cx = r.x + r.w / 2, lw = 270, lx = Math.round(W * (i + 0.5) / 3 - lw / 2);
      const html = d.labs[i] + (i === 1 && d.not ? `<div class="u5l9-not">not ${K(d.not)} ✗</div>` : '');
      const lab = add(stage, box(h('div', 'u5l9-alab', html), lw, 0), lx, 176); lab.style.height = 'auto'; lab.style.borderColor = colors[i]; lab.style.color = colors[i];
      const g = arrowLine(svg, [[cx, r.y + r.h + 4], [lx + lw / 2, 170]], colors[i], 3);
      await drawIn(g, 380, c); await fadeIn(c, lab, 320);
    };
    return [
      { cap: d.caps[0], run: (c) => show(c, 0) },
      { cap: d.caps[1], run: (c) => show(c, 1) },
      { cap: d.caps[2], run: (c) => show(c, 2) },
      { cap: d.read, run: (c) => fadeIn(c, readEl, 400) }
    ];
  }
};

/* ======================= explainer 3: substituting a number (Examples 1 and 2) ======================= */
const F1 = [`f(x)=2${X}+5`], F2 = [`f(x)=5${X}-4`, `g(x)=${X}^2+3`];
const SB = {
  a1: { sep: 'Example 1', label: '(a)', funcs: F1, use: [0], ask: 'f(3)', ans: '11',
    lines: [[`f(3)=2${S('3')}+5`, `Put ${T('3')} into the slot, in brackets. ${T('2(3)')} means 2 times 3.`], ['=6+5', 'Multiply first.'], ['=11', 'Then add.']], keys: '2 × 3 + 5 =' },
  b1: { label: '(b)', funcs: F1, use: [0], ask: 'f(0)', ans: '5',
    lines: [[`f(0)=2${S('0')}+5`, `Put ${T('0')} into the slot.`], ['=0+5', `${T('2(0)=0')}.`], ['=5', 'Add.']], keys: '2 × 0 + 5 =' },
  c1: { label: '(c)', funcs: F1, use: [0], ask: 'f(-4)', ans: '-3',
    lines: [[`f(-4)=2${S('-4')}+5`, `A negative input goes in <b>brackets</b>.`], ['=-8+5', `${T('2(-4)=-8')}: positive times negative is negative.`], ['=-3', 'Add.']], keys: '2 × (−) 4 + 5 =' },
  d1: { label: '(d)', funcs: F1, use: [0], ask: 'f(6)', ans: '17',
    lines: [[`f(6)=2${S('6')}+5`, `Put ${T('6')} into the slot.`], ['=12+5', 'Multiply.'], ['=17', 'Add.']], keys: '2 × 6 + 5 =' },
  a2: { sep: 'Example 2', label: '(a)', funcs: F2, use: [0], ask: 'f(3)', ans: '11',
    lines: [[`f(3)=5${S('3')}-4`, `Put ${T('3')} into the slot of ${T('f')}.`], ['=15-4', 'Multiply.'], ['=11', 'Subtract.']], keys: '5 × 3 − 4 =' },
  b2: { label: '(b)', funcs: F2, use: [1], ask: 'g(3)', ans: '12',
    lines: [[`g(3)=${S('3')}^2+3`, `Same input, but now the rule is ${T('g')}.`], ['=9+3', `Powers first: ${T('3^2=9')}.`], ['=12', 'Add.']], keys: '3 x² + 3 =' },
  c2: { label: '(c)', funcs: F2, use: [0], ask: 'f(-2)', ans: '-14',
    lines: [[`f(-2)=5${S('-2')}-4`, `Put ${T('-2')} into the slot of ${T('f')}, in brackets.`], ['=-10-4', `${T('5(-2)=-10')}.`], ['=-14', `${T('-10-4')} goes further below zero.`]], keys: '5 × (−) 2 − 4 =' },
  d2: { label: '(d)', funcs: F2, use: [1], ask: 'g(-1)', ans: '4',
    lines: [[`g(-1)=${S('-1')}^2+3`, 'The brackets keep the negative <b>inside</b> the square.'], ['=1+3', `${T('(-1)^2=(-1)(-1)=1')}: a negative squared is positive.`], ['=4', 'Add.']], keys: '( (−) 1 ) x² + 3 =' },
  e2: { label: '(e)', funcs: F2, use: [0, 1], ask: 'f(0)+g(0)', ans: '-1',
    lines: [[`f(0)=5${S('0')}-4=-4`, 'Two different functions: find each value <b>first</b>.'], [`g(0)=${S('0')}^2+3=3`, `Now ${T('g(0)')}.`], ['f(0)+g(0)=-4+3', 'Then add the two values.'], ['=-1', '']],
    keys: '5 × 0 − 4 + 0 x² + 3 =' }
};
const SBchoices = []; Object.keys(SB).forEach((k) => { if (SB[k].sep) SBchoices.push({ sep: SB[k].sep }); SBchoices.push({ v: k, label: SB[k].label }); });
const substitute = {
  title: 'Evaluate: every x gets the input, in brackets',
  height: 380,
  choices: SBchoices,
  intro: (k) => `Find ${T(SB[k].ask)}. Press <b>Next</b>.`,
  make(stage, k, ex) {
    const d = SB[k], W = ex.W, LH = 54;
    const fl = d.funcs.map((f, i) => add(stage, h('div', 'u5l9-fx', K(f)), 26, 14 + i * 50));
    const y0 = 14 + d.funcs.length * 50 + 18;
    const ls = d.lines.map((l, i) => { const e = add(stage, h('div', 'u5l9-ln', KL(l[0])), 26 + (l[0][0] === '=' ? 40 : 0), y0 + i * LH); hide(e); return e; });
    const P = panel(stage, W - 300, 10, 288, 360, 'Find');
    line(P, K(d.ask), 'u5l9-ask');
    const kk = h('div', 'u5l9-keys', `<div class="u5l9-ph">TI-30XIIS</div>${keysHTML(d.keys)}`); P.appendChild(kk); hide(kk);
    const slots = d.use.flatMap((i) => [...fl[i].querySelectorAll('.u5l9-slot')]);
    const steps = [{ cap: `Every ${T('x')} in the rule is a <b>slot</b> for the input.`, run: async (c) => { slots.forEach((s) => s.classList.add('on')); await Promise.all(slots.map((s) => pulse(c, s, 1.3))); } }];
    d.lines.forEach((l, i) => {
      const last = i === d.lines.length - 1;
      steps.push({ cap: (l[1] || 'So') + (last ? ` <b>${T(d.ask + '=' + d.ans)}</b>` : ''),
        run: async (c) => {
          await fadeIn(c, ls[i], 380);
          if (i === 0) { const subs = [...ls[0].querySelectorAll('.u5l9-sub')]; await Promise.all(subs.map((s) => pulse(c, s, 1.15))); }
          if (last) { ls[i].classList.add('ansline'); await pop(c, ls[i], 360); await fadeIn(c, kk, 400); }
        } });
    });
    return steps;
  }
};

/* ======================= explainer 4: which direction? forwards (evaluate) and backwards ======================= */
const FB = {
  f: { label: T('f(3)') + ' vs ' + T('f(x)=11'), rule: 'f(x)=2x+5', ops: ['\\times2', '+5'], undo: ['\\div2', '-5'],
    what: `${T('f(x)=2x+5')} does two things to ${T('x')}, in order: <b>multiply by 2</b>, then <b>add 5</b>.`,
    fq: 'f(3)', fwd: ['3', '6', '11'], bq: 'f(x)=11', bwd: ['11', '6', '3'],
    alg1: ['f(3)=2(3)+5', '=11'], alg2: ['2x+5=11', '2x=6', 'x=3'], back: `So ${T('x=3')}: the same pair as ${T('f(3)=11')}, read the other way.`, check: 'f(3)=2(3)+5=11' },
  p: { label: 'Warm-up Q4', rule: 'P(t)=8+2t', ops: ['\\times2', '+8'], undo: ['\\div2', '-8'],
    what: `${T('P(t)=8+2t')} does two things to ${T('t')}: <b>multiply by 2</b>, then <b>add 8</b>.`,
    fq: 'P(5)', fwd: ['5', '10', '18'], bq: 'P(t)=20', bwd: ['20', '12', '6'],
    alg1: ['P(5)=8+2(5)', '=18'], alg2: ['8+2t=20', '2t=12', 't=6'], back: `So ${T('t=6')}: a $20 pizza has <b>6 toppings</b>.`, check: 'P(6)=8+2(6)=20' },
  big: { label: 'The big one', rule: 'P(t)=8+2t', ops: ['\\times2', '+8'], undo: ['\\div2', '-8'],
    what: `Ticket X says ${T('P(10)')}. Ticket Y says the price is $10, so ${T('P(t)=10')}. Same rule, opposite directions.`,
    fq: 'P(10)', fwd: ['10', '20', '28'], bq: 'P(t)=10', bwd: ['10', '2', '1'],
    alg1: ['P(10)=8+2(10)', '=28'], alg2: ['8+2t=10', '2t=2', 't=1'], back: `So ${T('t=1')}: ticket Y has just <b>1 topping</b>. Ticket X has <b>10</b>.`, check: 'P(1)=8+2(1)=10' }
};
const direction = {
  title: 'Which direction? Input given or output given',
  height: 400,
  minW: 966,
  choices: Object.keys(FB).map((k) => ({ v: k, label: FB[k].label })),
  intro: () => `When the <b>input</b> is given, push it <b>forwards</b> through the rule. When the <b>output</b> is given, run the rule <b>backwards</b>. Press <b>Next</b>.`,
  make(stage, k, ex) {
    const d = FB[k], W = ex.W, R1 = 66, R2 = 262, BH = 74;
    const XS = { in: 18, o1: 176, o2: 376, out: 566 }, SW = 100, OW = 120;
    const svg = add(stage, svgEl('svg', { width: 690, height: 400, class: 'u5l9-ov' }), 0, 0);
    add(stage, h('div', 'u5l9-rowh', `<b>Input given</b>: find ${T(d.fq)}`), 18, R1 - 46);
    const head2 = add(stage, h('div', 'u5l9-rowh back', `<b>Output given</b>: ${T(d.bq)}`), 18, R2 - 46); hide(head2);
    const slot = (x, y, cls) => add(stage, box(h('div', 'u5l9-slotb ' + cls, ''), SW, BH), x, y);
    const op = (x, y, html, cls) => add(stage, box(h('div', 'u5l9-op ' + cls, html), OW, BH), x, y);
    const fIn = slot(XS.in, R1, 'in'), fO1 = op(XS.o1, R1, K(d.ops[0]), ''), fO2 = op(XS.o2, R1, K(d.ops[1]), ''), fOut = slot(XS.out, R1, 'out');
    add(stage, h('div', 'u5l9-mlab', K(d.rule)), XS.o1, R1 + BH + 6);
    const mid1 = add(stage, box(h('div', 'u5l9-mid', K(d.fwd[1])), 80, 34), (XS.o1 + OW + XS.o2) / 2 - 40, R1 - 38); hide(mid1);
    const bIn = slot(XS.in, R2, 'in back'), bO1 = op(XS.o1, R2, K(d.undo[0]), 'back'), bO2 = op(XS.o2, R2, K(d.undo[1]), 'back'), bOut = slot(XS.out, R2, 'out back');
    const mid2 = add(stage, box(h('div', 'u5l9-mid back', K(d.bwd[1])), 80, 34), (XS.o1 + OW + XS.o2) / 2 - 40, R2 - 38); hide(mid2);
    [bIn, bO1, bO2, bOut].forEach((e) => hide(e));
    const P = panel(stage, 706, 8, W - 718, 384, 'The algebra');
    const cy1 = R1 + BH / 2, cy2 = R2 + BH / 2;
    const fArrows = [[XS.in + SW + 4, XS.o1 - 6], [XS.o1 + OW + 4, XS.o2 - 6], [XS.o2 + OW + 4, XS.out - 6]];
    const fwd = async (c) => {
      fIn.innerHTML = K(d.fwd[0]); await pop(c, fIn.firstChild);
      for (let i = 0; i < 3; i++) {
        const a = arrowLine(svg, [[fArrows[i][0], cy1], [fArrows[i][1], cy1]], BLU); await drawIn(a, 300, c);
        if (i === 0) { await pulse(c, fO1, 1.08); await pop(c, mid1); }
        if (i === 1) await pulse(c, fO2, 1.08);
        if (i === 2) { fOut.innerHTML = K(d.fwd[2]); await pop(c, fOut.firstChild, 420); }
      }
      for (const s of d.alg1) { const e = line(P, K(s), 'u5l9-fw'); fit(e, inner(P), 13); await fadeIn(c, e, 260); }
    };
    const bwd = async (c) => {
      bOut.innerHTML = K(d.bwd[0]); await pop(c, bOut.firstChild);
      const segs = [[XS.out - 6, XS.o2 + OW + 4], [XS.o2 - 6, XS.o1 + OW + 4], [XS.o1 - 6, XS.in + SW + 4]];
      for (let i = 0; i < 3; i++) {
        const a = arrowLine(svg, [[segs[i][0], cy2], [segs[i][1], cy2]], AMB); await drawIn(a, 300, c);
        if (i === 0) { await pulse(c, bO2, 1.08); await pop(c, mid2); }
        if (i === 1) await pulse(c, bO1, 1.08);
        if (i === 2) { bIn.innerHTML = K(d.bwd[2]); await pop(c, bIn.firstChild, 420); }
      }
      for (const s of d.alg2) { const e = line(P, K(s), 'u5l9-bw'); fit(e, inner(P), 13); await fadeIn(c, e, 260); }
    };
    return [
      { cap: d.what, run: async (c) => { await pulse(c, fO1, 1.08); await pulse(c, fO2, 1.08); } },
      { cap: `${T(d.fq)} hands you the <b>input</b> ${T(d.fwd[0])}. Go <b>forwards</b>: ${T(d.fwd[0])} → ${T(d.fwd[1])} → ${T(d.fwd[2])}, so ${T(d.fq + '=' + d.fwd[2])}.`, run: fwd },
      { cap: `${T(d.bq)} hands you the <b>output</b> ${T(d.bwd[0])}. Go <b>backwards</b>, undoing each step in <b>reverse</b> order: ${T(d.undo[1])} first, then ${T(d.undo[0])}.`,
        run: async (c) => { await fadeIn(c, head2); await Promise.all([bOut, bO2, bO1, bIn].map((e, i) => fadeIn(c, e, 300, { delay: i * 90 }))); } },
      { cap: `${T(d.bwd[0])} → ${T(d.bwd[1])} → ${T(d.bwd[2])}. ${d.back}`, run: bwd },
      { cap: `Check by going forwards: ${T(d.check)} ✓`, run: async (c) => { const l = line(P, K(d.check) + ' ✓', 'u5l9-ck'); fit(l, inner(P), 13); await fadeIn(c, l); const s = stamp(stage, 'checks out', { ok: true, x: 340, y: 372, size: 'sm' }); await stampIn(c, s); } }
    ];
  }
};

/* ======================= explainer 5: a letter or an expression as the input (Example 3) ======================= */
const LE = {
  a: { label: 'Example 3(a)', ask: 'f(a)', inp: 'a',
    lines: [[`f(a)=3${S('a')}+2`, `Replace ${T('x')} with ${T('a')}.`], ['=3a+2', `Tidy up: ${T('3(a)')} is ${T('3a')}.`]],
    ck: { at: 'a=4', L: ['f(a)', 'f(4)', '3(4)+2', '14'], R: ['3a+2', '3(4)+2', '12+2', '14'], ok: true }, ckCap: `Check with ${T('a=4')}: ${T('f(4)')} and ${T('3a+2')} must agree.` },
  b: { label: 'Example 3(b)', ask: 'f(k)', inp: 'k',
    lines: [[`f(k)=3${S('k')}+2`, `The letter does not matter, only the <b>position</b> does: ${T('k')} goes into the slot.`], ['=3k+2', `${T('3(k)')} is ${T('3k')}.`]],
    ck: { at: 'k=5', L: ['f(k)', 'f(5)', '3(5)+2', '17'], R: ['3k+2', '3(5)+2', '15+2', '17'], ok: true }, ckCap: `Check with ${T('k=5')}: both sides give 17.` },
  c: { label: 'Example 3(c)', ask: 'f(x+1)', inp: 'x+1',
    lines: [[`f(x+1)=3${S('x+1')}+2`, `The <b>whole</b> input ${T('x+1')} goes into the slot, in brackets.`], ['=3x+3+2', 'Distribute: the 3 multiplies <b>both</b> terms.'], ['=3x+5', 'Collect like terms.']],
    ck: { at: 'x=2', L: ['f(x+1)', 'f(3)', '3(3)+2', '11'], R: ['3x+5', '3(2)+5', '6+5', '11'], ok: true }, ckCap: `Check with ${T('x=2')}: then ${T('x+1=3')}, so the left side is ${T('f(3)')}.` },
  oops: { label: 'Missing brackets?', ask: 'f(x+1)', inp: 'x+1', bad: true,
    lines: [['f(x+1)=3x+1+2', `A common slip: no brackets, so the 3 only multiplies the ${T('x')}.`], ['=3x+3', 'Collect like terms…']],
    ck: { at: 'x=2', L: ['f(x+1)', 'f(3)', '3(3)+2', '11'], R: ['3x+3', '3(2)+3', '6+3', '9'], ok: false },
    ckCap: `…and the check with ${T('x=2')} fails: 11 is not 9. With brackets, ${T('3(x+1)+2=3x+5')}.` }
};
const linearExpr = {
  title: 'A letter or an expression as the input',
  height: 330,
  minW: 820,
  choices: Object.keys(LE).map((k) => ({ v: k, label: LE[k].label })),
  intro: (k) => `For ${T('f(x)=3x+2')}, find ${T(LE[k].ask)}. Press <b>Next</b>.`,
  make(stage, k, ex) {
    const d = LE[k], W = ex.W, LH = 58;
    const fx = add(stage, h('div', 'u5l9-fx', K(`f(x)=3${X}+2`)), 26, 16);
    const tag = add(stage, h('div', 'u5l9-intag', 'input: ' + K(d.inp)), 280, 20); hide(tag);
    const ls = d.lines.map((l, i) => { const e = add(stage, h('div', 'u5l9-ln' + (d.bad && i === 0 ? ' u5l9-bad' : ''), KL(l[0])), 26 + (i ? 76 : 0), 86 + i * LH); hide(e); return e; });
    const card = checkCard(stage, { at: d.ck.at, left: d.ck.L, right: d.ck.R, ok: d.ck.ok, x: W - 404, y: 14, width: 392, hidden: true });
    const steps = [{ cap: `The rule has one slot for the input. Here the input is ${T(d.inp)}.`, run: async (c) => { fx.querySelector('.u5l9-slot').classList.add('on'); await pop(c, tag); } }];
    d.lines.forEach((l, i) => steps.push({ cap: l[1], run: async (c) => { await fadeIn(c, ls[i]); if (i === d.lines.length - 1 && !d.bad) ls[i].classList.add('ansline'); } }));
    steps.push({ cap: d.ckCap, run: (c) => card.play(c) });
    return steps;
  }
};

/* ======================= explainer 6: an expression into a squared function (Example 4) ======================= */
const NL = {
  a: { label: 'Example 4(a)', inp: 'a',
    lines: [[`f(a)=${S('a')}^2+4`, `Replace ${T('x')} with ${T('a')}, in brackets.`], ['=a^2+4', 'Nothing to expand: just tidy up.']],
    ck: { at: 'a=5', L: ['f(a)', 'f(5)', '5^2+4', '29'], R: ['a^2+4', '5^2+4', '25+4', '29'] } },
  b: { label: 'Example 4(b)', inp: '2a',
    lines: [[`f(2a)=${S('2a')}^2+4`, `Replace ${T('x')} with ${T('(2a)')}: the <b>whole</b> input, in brackets.`], ['=(2a)(2a)+4', 'Squaring means multiplying the bracket by itself.'],
      ['=4a^2+4', `${T('2\\times2=4')} and ${T('a\\times a=a^2')}: the 2 is squared too.`]],
    ck: { at: 'a=3', L: ['f(2a)', 'f(6)', '6^2+4', '40'], R: ['4a^2+4', '4(3)^2+4', '36+4', '40'] }, warn: `Without brackets you get ${T('2a^2+4')}: at ${T('a=3')} that is ${T('2(9)+4=22')}, not 40.` },
  c: { label: 'Example 4(c)', inp: 'x+3', grid: true,
    lines: [[`f(x+3)=${S('x+3')}^2+4`, `Replace ${T('x')} with the <b>whole</b> expression ${T('(x+3)')}.`], ['=(x+3)(x+3)+4', 'Squaring means multiplying the bracket by itself.'],
      ['=x^2+3x+3x+9+4', 'Expand: every term times every term. The box shows the four pieces.'], ['=x^2+6x+13', `Collect like terms: ${T('3x+3x=6x')} and ${T('9+4=13')}.`]],
    ck: { at: 'x=1', L: ['f(x+3)', 'f(4)', '4^2+4', '20'], R: ['x^2+6x+13', '1^2+6(1)+13', '1+6+13', '20'] }, warn: `Not ${T('x^2+9+4')}: at ${T('x=1')} that gives 14, not 20. The middle ${T('6x')} must be there.` }
};
const squareSub = {
  title: 'An expression into a squared function',
  height: 400,
  minW: 860,
  choices: Object.keys(NL).map((k) => ({ v: k, label: NL[k].label })),
  intro: (k) => `For ${T('f(x)=x^2+4')}, find ${T('f(' + NL[k].inp + ')')}. Press <b>Next</b>.`,
  make(stage, k, ex) {
    const d = NL[k], W = ex.W, LH = 56;
    const fx = add(stage, h('div', 'u5l9-fx', K(`f(x)=${X}^2+4`)), 22, 14);
    const ls = d.lines.map((l, i) => { const e = add(stage, h('div', 'u5l9-ln sm', KL(l[0])), 22 + (i ? 70 : 0), 84 + i * LH); hide(e); return e; });
    const card = checkCard(stage, { at: d.ck.at, left: d.ck.L, right: d.ck.R, ok: true, x: W - 392, y: 14, width: 380, hidden: true });
    const warn = d.warn ? add(stage, box(h('div', 'u5l9-warn', '✗ ' + d.warn), 380, 0), W - 392, 300) : null;
    if (warn) { warn.style.height = 'auto'; hide(warn); }
    let grid = null, cells = [];
    if (d.grid) { // the area box for (x+3)(x+3)
      grid = add(stage, box(h('div', 'u5l9-agrid', ''), 330, 250), W - 360, 20);
      const hd = ['', K('x'), K('3')], rows = [[K('x'), K('x^2'), K('3x')], [K('3'), K('3x'), K('9')]];
      grid.innerHTML = hd.map((s) => `<div class="hd">${s}</div>`).join('') + rows.map((r) => r.map((s, i) => `<div class="${i ? 'cell' : 'hd'}">${s}</div>`).join('')).join('');
      cells = [...grid.querySelectorAll('.cell')]; hide(grid, ...cells, card);
    }
    const steps = [{ cap: `Every ${T('x')} is a slot. The input this time is ${T(d.inp)}.`, run: async (c) => { const s = [...fx.querySelectorAll('.u5l9-slot')]; s.forEach((e) => e.classList.add('on')); await Promise.all(s.map((e) => pulse(c, e, 1.3))); } }];
    d.lines.forEach((l, i) => steps.push({ cap: l[1], run: async (c) => {
      if (grid && i === 1) await fadeIn(c, grid, 300);
      if (grid && i === 2) for (const e of cells) await pop(c, e, 260);
      await fadeIn(c, ls[i]); if (i === d.lines.length - 1) ls[i].classList.add('ansline');
    } }));
    steps.push({ cap: `Check with ${T(d.ck.at)}: both sides must give the same number.` + (d.warn ? ' ' + d.warn : ''),
      run: async (c) => { if (grid) { await c.anim(grid, [{ opacity: 1 }, { opacity: 0 }], 250); grid.style.opacity = 0; await fadeIn(c, card, 200); } await card.play(c); if (warn) await fadeIn(c, warn); } });
    return steps;
  }
};

/* ======================= explainer 7: function notation in context (Example 5) ======================= */
const TACO = '<svg viewBox="0 0 48 34" aria-hidden="true"><path d="M3 30 A21 21 0 0 1 45 30 Z" fill="#f2c14e" stroke="#b07a12" stroke-width="2.5"/><path d="M9 27 A15 15 0 0 1 39 27" fill="none" stroke="#3f9a3a" stroke-width="5" stroke-linecap="round"/><circle cx="17" cy="20" r="2.6" fill="#c93a33"/><circle cx="27" cy="16" r="2.6" fill="#c93a33"/><circle cx="33" cy="22" r="2.4" fill="#c93a33"/></svg>';
const TOP = '<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="16" fill="#c93a33" stroke="#8d2420" stroke-width="2.5"/><circle cx="14" cy="15" r="2.4" fill="#8d2420"/><circle cx="24" cy="24" r="2.4" fill="#8d2420"/><circle cx="25" cy="13" r="2" fill="#8d2420"/></svg>';
const CX = {
  a: { label: 'Example 5(a)', mode: 'eval', n: 4 },
  b: { label: 'Example 5(b)', mode: 'read', n: 10 },
  c: { label: 'Example 5(c)', mode: 'write', n: 12, quote: '“The cost of ordering <b class="u5l9-ci">12 tacos</b> is <b class="u5l9-co">$42</b>.”' },
  p: { label: 'Warm-up: ' + T('P(7)=22'), mode: 'read', n: 7, pizza: true }
};
const context = {
  title: 'Notation ⇄ words',
  height: 400,
  minW: 900,
  choices: Object.keys(CX).map((k) => ({ v: k, label: CX[k].label })),
  intro: (k) => (CX[k].pizza ? `Luigi’s pizza: ${T('P(t)=8+2t')}.` : `The taco truck: ${T('C(n)=3n+6')}.`) + ' Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = CX[k], W = ex.W, pz = !!d.pizza, n = d.n;
    const nm = pz ? 'P' : 'C', v = pz ? 't' : 'n', fee = pz ? 8 : 6, rate = pz ? 2 : 3, val = fee + rate * n;
    const thing = pz ? 'toppings' : 'tacos', rule = pz ? 'P(t)=8+2t' : 'C(n)=3n+6';
    const sub = pz ? `8+2(${n})` : `3(${n})+6`, mid = pz ? `8+${2 * n}` : `${3 * n}+6`;
    // sentence strip
    const sent = add(stage, box(h('div', 'u5l9-sent', d.mode === 'write' ? d.quote : ''), W - 24, 58), 12, 6);
    // the shop panel
    const shop = panel(stage, 12, 80, 420, 312, pz ? 'Luigi’s: $8 + $2 per topping' : 'Taco truck: $6 setup + $3 per taco');
    const tray = h('div', 'u5l9-tray'); shop.appendChild(tray);
    const icons = []; for (let i = 0; i < 12; i++) { const e = h('div', 'u5l9-ic' + (i < n ? '' : ' empty'), i < n ? (pz ? TOP : TACO) : ''); tray.appendChild(e); if (i < n) icons.push(e); }
    hide(...icons);
    const bill = h('div', 'u5l9-bill'); shop.appendChild(bill);
    const b1 = h('div', '', `${pz ? 'base price' : 'setup fee'} <span>$${fee}</span>`), b2 = h('div', '', `${n} × $${rate} <span>$${rate * n}</span>`), b3 = h('div', 'tot', `total <span>$${val}</span>`);
    bill.append(b1, b2, b3); hide(b1, b2, b3);
    // notation side
    const RX = 450, RW = W - RX - 12;
    const big = add(stage, box(h('div', 'u5l9-cbig', K(`${NM(nm)}(${IN(v)})=${pz ? '8+2t' : '3n+6'}`)), RW, 76), RX, 92);
    const svg = add(stage, svgEl('svg', { width: W, height: 400, class: 'u5l9-ov' }), 0, 0);
    const bw = 210, inX = RX + RW / 2 - bw - 12, outX = RX + RW / 2 + 12;
    const inBox = add(stage, box(h('div', 'u5l9-role in', `<b>input</b> ${T(v)}<div>number of ${thing}</div>`), bw, 84), inX, 212);
    const outBox = add(stage, box(h('div', 'u5l9-role out', `<b>output</b> ${T(nm + '(' + v + ')')}<div>${pz ? 'price' : 'cost'} in dollars</div>`), bw, 84), outX, 212);
    hide(inBox, outBox);
    const work = add(stage, box(h('div', 'u5l9-cwork', ''), RW, 56), RX, 326);
    const setBig = (a, o) => { big.innerHTML = K(`${NM(nm)}(${IN(a)})=${OUT(o)}`); };
    const arrows = async (c) => {
      const pi = big.querySelector('.u5l9-ci'), po = big.querySelector('.u5l9-co');
      const ri = rel(stage, pi), ro = rel(stage, po);
      const gi = arrowLine(svg, [[ri.x + ri.w / 2, ri.y + ri.h + 4], [inX + bw / 2, 206]], BLU, 3), go = arrowLine(svg, [[ro.x + ro.w / 2, ro.y + ro.h + 4], [outX + bw / 2, 206]], AMB, 3);
      await Promise.all([drawIn(gi, 360, c), drawIn(go, 360, c)]);
    };
    const roles = { cap: `${T(rule)}: the input ${T(v)} is the <b>number of ${thing}</b>. The output ${T(nm + '(' + v + ')')} is the <b>${pz ? 'price' : 'cost'} in dollars</b>.`,
      run: async (c) => { await Promise.all([fadeIn(c, inBox, 320), fadeIn(c, outBox, 320, { delay: 120 })]); } };
    const tacosIn = (c) => Promise.all(icons.map((e, i) => pop(c, e, 260, { delay: i * 60 })));
    const setIn = () => { inBox.querySelector('div').innerHTML = `<b class="u5l9-big2">${n}</b> ${thing}`; };
    const setOut = () => { outBox.querySelector('div').innerHTML = `<b class="u5l9-big2">$${val}</b>`; };
    const billIn = (c) => Promise.all([b1, b2, b3].map((e, i) => fadeIn(c, e, 260, { delay: i * 160 })));
    const say = `${pz ? `A pizza with <b class="u5l9-ci">${n} toppings</b>` : `Ordering <b class="u5l9-ci">${n} tacos</b>`} costs <b class="u5l9-co">$${val}</b>.`;
    if (d.mode === 'eval') return [
      roles,
      { cap: `${T(`${nm}(${n})`)}: the input is ${T(String(n))}, so <b>${n} ${thing}</b>.`, run: async (c) => { setBig(String(n), '\\,?'); await pop(c, big.firstChild, 300); setIn(); await tacosIn(c); await arrows(c); } },
      { cap: `${T(`${nm}(${n})=${sub}=${mid}=${val}`)}.`, run: async (c) => { work.innerHTML = K(`${nm}(${n})=${sub}=${mid}=${val}`); await fadeIn(c, work); await billIn(c); setBig(String(n), String(val)); setOut(); await pop(c, outBox, 300); } },
      { cap: `In words: <b>ordering ${n} tacos costs $${val}</b> (the $${fee} setup fee plus $${rate * n} of tacos).`, run: async (c) => { sent.innerHTML = say; await fadeIn(c, sent, 400); } }
    ];
    if (d.mode === 'read') return [
      roles,
      { cap: `In ${T(`${nm}(${n})=${val}`)}, the number <b>inside the brackets</b> is the input: <b>${n} ${thing}</b>.`, run: async (c) => { setBig(String(n), String(val)); big.querySelector('.u5l9-ci').classList.add('hl'); await pop(c, big.firstChild, 300); setIn(); await tacosIn(c); await arrows(c); } },
      { cap: `The number <b>after the equals sign</b> is the output: ${pz ? 'a price' : 'a cost'} of <b>$${val}</b>.`, run: async (c) => { big.querySelector('.u5l9-co').classList.add('hl'); setOut(); await pop(c, outBox, 300); } },
      { cap: `So: <b>${pz ? `a ${n}-topping pizza costs $${val}` : `ordering ${n} tacos costs $${val}`}</b>. Check: ${T(`${sub}=${val}`)} ✓`,
        run: async (c) => { sent.innerHTML = say; await fadeIn(c, sent, 400); await billIn(c); work.innerHTML = K(`${sub}=${mid}=${val}`) + ' ✓'; await fadeIn(c, work); } }
    ];
    return [ // write: words → notation
      { cap: 'Start from the sentence. Which number is the <b>input</b>? Which is the <b>output</b>?', run: async (c) => { await Promise.all([fadeIn(c, inBox, 320), fadeIn(c, outBox, 320, { delay: 120 })]); } },
      { cap: `<b>${n} tacos</b> is how many you order: the <b>input</b>. It goes inside the brackets: ${T(`${nm}(${n})`)}.`,
        run: async (c) => { sent.querySelector('.u5l9-ci').classList.add('hl'); setBig(String(n), '\\,?'); await pop(c, big.firstChild, 300); setIn(); await tacosIn(c); await arrows(c); } },
      { cap: `<b>$${val}</b> is the cost: the <b>output</b>. It goes after the equals sign: ${T(`${nm}(${n})=${val}`)}.`,
        run: async (c) => { sent.querySelector('.u5l9-co').classList.add('hl'); setBig(String(n), String(val)); setOut(); await pop(c, big.firstChild, 300); } },
      { cap: `Check: ${T(`${nm}(${n})=${sub}=${mid}=${val}`)} ✓ The statement is <b>correct</b>.`,
        run: async (c) => { work.innerHTML = K(`${nm}(${n})=${sub}=${mid}=${val}`) + ' ✓'; await fadeIn(c, work); await billIn(c); const s = stamp(stage, 'correct', { ok: true, x: W - 150, y: 150, size: 'sm' }); await stampIn(c, s); } }
    ];
  }
};

/* ======================= warm-up: the pizza counter ======================= */
function pizzaSVG(svg, t) {
  const NS = 'http://www.w3.org/2000/svg', mk = (tag, a) => { const e = document.createElementNS(NS, tag); Object.keys(a).forEach((k) => e.setAttribute(k, a[k])); svg.appendChild(e); return e; };
  svg.innerHTML = '';
  mk('circle', { cx: 60, cy: 60, r: 56, fill: '#d99a3a', stroke: '#7a4a1a', 'stroke-width': 2.5 });
  mk('circle', { cx: 60, cy: 60, r: 47, fill: '#f7d774' });
  for (let a = 0; a < 360; a += 60) { const r = a * Math.PI / 180; mk('line', { x1: 60, y1: 60, x2: 60 + 47 * Math.cos(r), y2: 60 + 47 * Math.sin(r), stroke: '#c9a24a', 'stroke-width': 1.5 }); }
  const spots = [[42, 40], [74, 38], [60, 62], [38, 72], [80, 70], [56, 88], [26, 54], [92, 52], [66, 22], [50, 18]];
  const cols = ['#c93a33', '#3f9a3a', '#8a6a4a', '#e8a01e', '#c93a33', '#3f9a3a', '#8a6a4a', '#e8a01e', '#c93a33', '#3f9a3a'];
  for (let i = 0; i < Math.min(t, spots.length); i++) mk('circle', { cx: spots[i][0], cy: spots[i][1], r: 8, fill: cols[i], stroke: 'rgba(0,0,0,.25)', 'stroke-width': 1.2 });
}
function mountWarm() {
  const host = document.getElementById('wu'); if (!host) return;
  const svg = host.querySelector('#u5l9-pz'), out = host.querySelector('#u5l9-bout');
  let t = 0;
  const set = (v) => { t = Math.max(0, Math.min(10, v)); pizzaSVG(svg, t); out.innerHTML = K(`P(${IN(t)})=8+2(${t})=${OUT('\\$' + (8 + 2 * t))}`); };
  host.querySelectorAll('[data-tp]').forEach((b) => b.addEventListener('click', () => set(t + Number(b.dataset.tp))));
  host.querySelectorAll('.u5l9-tk').forEach((b) => b.addEventListener('click', async () => {
    const v = Number(b.dataset.t), on = !b.classList.contains('on');
    b.classList.toggle('on', on); b.querySelector('.u5l9-tkv').textContent = on ? `$${8 + 2 * v}` : '$ ___';
    if (on) { set(v); await pulse(liveCtx(), b, 1.06); }
  }));
  set(0);
}

mountWarm();
export const explainers = mountExplainers({ machine, anatomy, substitute, direction, linearExpr, squareSub, context });
export const _test = { MC, SB, FB, LE, NL, CX };

/* ---------- Math History box: Leibniz's word (1673) → Euler's f(x) (1734) → today's f(3) = 11 ----------
 * A function machine, three passes: words only, then Euler's f( x/a + c ), then the lesson's f(x) = 2x + 5.
 * Adapted from Math 10C u5l6. */
(function eulerMachine() {
  const svg = document.getElementById('u5l9-hist'); if (!svg) return;
  const NS = 'http://www.w3.org/2000/svg';
  const mk = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); Object.keys(attrs || {}).forEach((k) => e.setAttribute(k, attrs[k])); (parent || svg).appendChild(e); return e; };
  const txt = (s, attrs, parent) => { const e = mk('text', attrs, parent); e.textContent = s; return e; };
  const NOW = new Date().getFullYear();
  const IN_X = 100, MID = 300, OUT_X = 488, Y = 124;
  const STAGES = [
    { at: 0, len: 3400, y0: 1673, y1: 1673, inT: 'x', outT: '“a function of x”', outC: 'u5l9h-tokw', inAt: 300, move: [700, 1700], out: [1900, 2900],
      note: 'Leibniz: just a word', cap: [['A ', ''], ['“function”', 'b'], [' has a name in words, but no symbol yet.', '']] },
    { at: 3400, len: 4300, y0: 1673, y1: 1734, inT: 'x/a + c', outT: 'f(x/a + c)', outC: '', inAt: 1300, move: [1700, 2700], out: [2900, 3900],
      note: 'Euler: a symbol', cap: [['f', 'n'], [' = the name of the function   ', ''], ['( )', 'i'], [' = the input goes inside', '']] },
    { at: 7700, len: 4100, y0: 1734, y1: NOW, inT: '3', outT: 'f(3) = 11', outC: '', inAt: 1200, move: [1500, 2500], out: [2700, 3700],
      note: 'Today: the same f(x)', cap: [['f(3) = 11', 'o'], [': input ', ''], ['3', 'i'], [', output ', ''], ['11', 'o'], [', for f(x) = 2x + 5', '']] }
  ];
  const END = 11800;
  const ease = (u) => (u <= 0 ? 0 : u >= 1 ? 1 : u * u * (3 - 2 * u));
  txt('Year', { x: 40, y: 34, class: 'u5l9h-cap' });
  const yearT = txt('1673', { x: 84, y: 38, class: 'u5l9h-year' });
  const note = txt('', { x: 562, y: 36, 'text-anchor': 'end', class: 'u5l9h-note' });
  mk('line', { x1: 40, x2: 560, y1: Y + 24, y2: Y + 24, class: 'u5l9h-belt' });
  const token = (cls) => { const g = mk('g', { class: 'u5l9h-tok ' + cls }); const r = mk('rect', { x: -40, y: -20, width: 80, height: 40, rx: 10 }, g); const t = txt('', { x: 0, y: 7, 'text-anchor': 'middle' }, g); return { g, r, t, w: 80 }; };
  const tin = token('u5l9h-tin'), tout = token('u5l9h-tout');
  function setTok(tk, s, extra) {
    tk.t.textContent = s; tk.g.setAttribute('class', 'u5l9h-tok ' + (tk === tin ? 'u5l9h-tin' : 'u5l9h-tout') + (extra ? ' ' + extra : ''));
    let w = 0; try { w = tk.t.getComputedTextLength(); } catch (e) { /* not rendered yet */ }
    tk.w = Math.max(44, (w || s.length * 10.5) + 26); tk.r.setAttribute('x', -tk.w / 2); tk.r.setAttribute('width', tk.w);
  }
  const body = mk('g', { class: 'u5l9h-mach' });
  mk('path', { d: 'M262 76 L250 54 H350 L338 76 Z', class: 'u5l9h-hop' }, body);
  mk('rect', { x: 224, y: 76, width: 152, height: 100, rx: 16, class: 'u5l9h-box' }, body);
  mk('rect', { x: 212, y: Y - 2, width: 14, height: 30, rx: 3, class: 'u5l9h-port' }, body);
  mk('rect', { x: 374, y: Y - 2, width: 14, height: 30, rx: 3, class: 'u5l9h-port' }, body);
  const lblWord = txt('function', { x: MID, y: 134, 'text-anchor': 'middle', class: 'u5l9h-lword' }, body);
  const lblF = txt('f', { x: MID, y: 144, 'text-anchor': 'middle', class: 'u5l9h-lf' }, body);
  const rule = txt('2x + 5', { x: MID, y: 166, 'text-anchor': 'middle', class: 'u5l9h-rule' }, body);
  const cap = txt('', { x: MID, y: 210, 'text-anchor': 'middle', class: 'u5l9h-capl' });
  mk('line', { x1: 40, x2: 560, y1: 230, y2: 230, class: 'u5l9h-rule0' });
  const recs = STAGES.map((St, i) => {
    const g = mk('g', { class: 'u5l9h-rec' }), x = 110 + i * 190;
    txt(i === 2 ? 'today' : String(St.y1), { x, y: 254, 'text-anchor': 'middle', class: 'u5l9h-ry' }, g);
    txt(St.outT, { x, y: 282, 'text-anchor': 'middle', class: 'u5l9h-rt' + (i === 0 ? ' u5l9h-rtw' : '') }, g);
    if (i < 2) txt('→', { x: x + 95, y: 280, 'text-anchor': 'middle', class: 'u5l9h-rarr' }, g);
    return g;
  });
  const CAPC = { b: 'u5l9h-cb', n: 'u5l9h-cn', i: 'u5l9h-ci', o: 'u5l9h-co', '': '' };
  let shown = -1, tokSet = '';
  function stageAt(t) { let k = 0; STAGES.forEach((s, i) => { if (t >= s.at) k = i; }); return k; }
  function draw(t) {
    const k = stageAt(t), St = STAGES[k], u = t - St.at;
    yearT.textContent = String(Math.round(St.y0 + (St.y1 - St.y0) * ease(u / (k === 2 ? 800 : 1000))));
    if (shown !== k) {
      shown = k; note.textContent = St.note; cap.textContent = '';
      St.cap.forEach(([s, c]) => { const ts = mk('tspan', { class: CAPC[c] }, cap); ts.textContent = s; });
    }
    if (tokSet !== String(k)) { tokSet = String(k); setTok(tin, St.inT); setTok(tout, St.outT, St.outC); }
    lblWord.style.opacity = k === 0 ? 1 : 0;
    lblF.style.opacity = k === 0 ? 0 : 1;
    rule.style.opacity = k === 2 && u > 900 ? 1 : 0;
    const mi = ease((u - St.move[0]) / (St.move[1] - St.move[0]));
    tin.g.setAttribute('transform', `translate(${(IN_X + (MID - IN_X) * mi).toFixed(1)} ${Y})`);
    tin.g.style.opacity = u >= St.inAt ? 1 : 0;
    const mo = ease((u - St.out[0]) / (St.out[1] - St.out[0]));
    tout.g.setAttribute('transform', `translate(${(MID + (OUT_X - MID) * mo).toFixed(1)} ${Y})`);
    tout.g.style.opacity = u >= St.out[0] ? 1 : 0;
    note.style.opacity = u > 400 || k === 0 ? 1 : 0;
    recs.forEach((g, i) => g.classList.toggle('on', i < k || (i === k && u >= St.out[1] + 200)));
  }
  let t0 = 0, raf = 0;
  function frame(now) { if (!t0) t0 = now; const t = Math.min(END, now - t0); draw(t); if (t < END) raf = requestAnimationFrame(frame); }
  function play() {
    cancelAnimationFrame(raf); t0 = 0;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { draw(END); return; }
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

/* ============ Stand Up Break! — evaluate f(a) for numbers, letters and expressions; read f(a) = b in context ============ */
function suT(terms) { // [[coef, 'x^2'], [coef, 'x'], [const, '']] → LaTeX with signs; zero terms dropped
  let s = '';
  terms.forEach(([k, v]) => {
    if (k === 0) return;
    const a = Math.abs(k), body = (a === 1 && v ? '' : a) + v;
    s += (k < 0 ? '-' : s ? '+' : '') + body;
  });
  return s || '0';
}
function suSub(terms, v) { // a rule [[coef, power]] with the input v substituted, in brackets: 5(−2)-4, (3)^2+3
  let s = '';
  terms.forEach(([k, p]) => {
    if (k === 0) return;
    const a = Math.abs(k), body = p === 0 ? String(a) : (a === 1 ? '' : a) + '(' + v + ')' + (p > 1 ? '^' + p : '');
    s += (k < 0 ? '-' : s ? '+' : '') + body;
  });
  return s;
}
const suEval = (terms, x) => terms.reduce((s, [k, p]) => s + k * x ** p, 0);
const suRule = (terms, v) => suT(terms.map(([k, p]) => [k, p === 0 ? '' : p === 1 ? v : v + '^' + p]));
const suH = (F, v) => `<i>${F}</i>(${String(v).replace('-', '−')})`; // f(−2) as HTML words
const SU_CTX = [ // fee + rate × input
  { F: 'C', v: 'h', setup: (f, r) => `A bike rental costs a $${f} fee plus $${r} per hour. The cost, in dollars, of renting for <i>h</i> hours is`, fee: [5, 12], rate: [3, 9], said: (n, V) => `Renting a bike for ${n} hours costs $${V}.`, ask: (n, V) => `“Renting a bike for ${n} hours costs $${V}.”` },
  { F: 'T', v: 'n', setup: (f, r) => `Concert tickets cost $${r} each, plus a $${f} booking fee. The total cost, in dollars, of <i>n</i> tickets is`, fee: [4, 10], rate: [15, 30], said: (n, V) => `Buying ${n} tickets costs $${V} in total.`, ask: (n, V) => `“The total cost of ${n} tickets is $${V}.”` },
  { F: 'H', v: 'w', setup: (f, r) => `A plant is ${f} cm tall and grows ${r} cm each week. Its height, in centimetres, after <i>w</i> weeks is`, fee: [3, 15], rate: [2, 5], said: (n, V) => `After ${n} weeks the plant is ${V} cm tall.`, ask: (n, V) => `“After ${n} weeks the plant is ${V} cm tall.”` },
  { F: 'S', v: 'm', setup: (f, r) => `Kai has $${f} saved and adds $${r} every month. His savings, in dollars, after <i>m</i> months are`, fee: [20, 80], rate: [10, 25], said: (n, V) => `After ${n} months Kai has $${V} saved.`, ask: (n, V) => `“After ${n} months Kai has saved $${V}.”` }
];
standup('u5l9', {
  intro: 'Work it out at your whiteboard station. Put the input in brackets in every slot, then use the order of operations.',
  levels: {
    BEG: (r) => { // a linear function at two inputs (one zero or negative)
      const F = r.pick(['f', 'g', 'h']), m = r.int(2, 6) * r.pick([1, 1, -1]), b = r.int(-9, 9) || 4, terms = [[m, 1], [b, 0]];
      const a = r.int(1, 6), c = r.chance(0.25) ? 0 : -r.int(1, 5);
      return { text: `Evaluate ${suH(F, a)} and ${suH(F, c)}.`, q: `${F}(x)=${suRule(terms, 'x')}`,
        a: [a, c].map((v) => `${F}(${v})=${suSub(terms, v)}=${suEval(terms, v)}`) };
    },
    PRG: (r) => { // a linear f and a squared g, like Example 2
      const lin = [[r.int(2, 6) * r.pick([1, -1]), 1], [r.int(-8, 8) || 3, 0]], sq = [[1, 2], [r.int(-6, 6) || 2, 0]];
      const p = -r.int(1, 4), q = r.int(0, 4), form = r.int(0, 2);
      const fp = suEval(lin, p), gp = suEval(sq, p), fq = suEval(lin, q), gq = suEval(sq, q);
      const head = `\\begin{array}{l}f(x)=${suRule(lin, 'x')}\\\\ g(x)=${suRule(sq, 'x')}\\end{array}`;
      if (form === 0) return { text: `Evaluate ${suH('f', p)} and ${suH('g', p)}.`, q: head, a: [`f(${p})=${suSub(lin, p)}=${fp}`, `g(${p})=${suSub(sq, p)}=${gp}`] };
      if (form === 1) return { text: `Evaluate ${suH('f', q)} + ${suH('g', q)}.`, q: head, a: [`f(${q})=${suSub(lin, q)}=${fq}`, `g(${q})=${suSub(sq, q)}=${gq}`, `f(${q})+g(${q})=${fq}${gq < 0 ? '' : '+'}${gq}=${fq + gq}`] };
      return { text: `Evaluate ${suH('g', p)} − ${suH('f', q)}.`, q: head, a: [`g(${p})=${suSub(sq, p)}=${gp}`, `f(${q})=${suSub(lin, q)}=${fq}`, `g(${p})-f(${q})=${gp}-${fq < 0 ? `(${fq})` : fq}=${gp - fq}`] };
    },
    MAS: (r) => {
      const kind = r.pick(['lin', 'lin', 'sq', 'ctx', 'ctx']);
      if (kind === 'lin') { // a letter or an expression into a linear function
        const m = r.int(2, 7) * r.pick([1, 1, -1]), b = r.int(-9, 9) || 5, rule = suRule([[m, 1], [b, 0]], 'x');
        const L = r.pick(['a', 'k', 't']), c0 = r.int(1, 5) * r.pick([1, -1]), c1 = r.pick([1, 1, 2, 3]);
        const inn = suT([[c1, 'x'], [c0, '']]);
        return { text: `Determine <i>f</i>(<i>${L}</i>) and <i>f</i>(<i>${inn.replace('-', '−')}</i>) in simplest form.`, q: `f(x)=${rule}`,
          a: [`f(${L})=${suSub([[m, 1], [b, 0]], L)}=${suRule([[m, 1], [b, 0]], L)}`, `f(${inn})=${m}(${inn})${b < 0 ? '' : '+'}${b}=${suT([[m * c1, 'x'], [m * c0 + b, '']])}`] };
      }
      if (kind === 'sq') { // f(ka) and f(x + d) for f(x) = x² + c
        const c = r.int(-6, 9) || 1, k = r.int(2, 5), dd = r.int(1, 5) * r.pick([1, 1, -1]), L = r.pick(['a', 'k', 'm']);
        const inn = suT([[1, 'x'], [dd, '']]), sq = suT([[1, 'x^2'], [2 * dd, 'x'], [dd * dd, '']]);
        return { text: `Determine <i>f</i>(${k}<i>${L}</i>) and <i>f</i>(<i>${inn.replace('-', '−')}</i>) in simplest form.`, q: `f(x)=${suT([[1, 'x^2'], [c, '']])}`,
          a: [`f(${k}${L})=(${k}${L})^2${c < 0 ? '' : '+'}${c}=${k * k}${L}^2${c < 0 ? '' : '+'}${c}`, `f(${inn})=(${inn})^2${c < 0 ? '' : '+'}${c}=${sq}${c < 0 ? '' : '+'}${c}=${suT([[1, 'x^2'], [2 * dd, 'x'], [dd * dd + c, '']])}`] };
      }
      const s = r.pick(SU_CTX), f = r.int(s.fee[0], s.fee[1]), rt = r.int(s.rate[0], s.rate[1]), terms = [[rt, 1], [f, 0]], n = r.int(2, 9), V = rt * n + f;
      const rule = `${s.F}(${s.v})=${suRule(terms, s.v)}`;
      if (r.chance(0.5)) return { text: `${s.setup(f, rt)} ${T(rule)}. Evaluate ${suH(s.F, n)} and explain what it means.`, q: '',
        atext: `<b>${s.said(n, V)}</b>`, a: [`${s.F}(${n})=${suSub(terms, n)}=${V}`] };
      return { text: `${s.setup(f, rt)} ${T(rule)}. Write ${s.ask(n, V)} in function notation, and check it.`, q: '',
        atext: `Input ${n}, output ${V}.`, a: [`${s.F}(${n})=${V}`, `\\text{Check: }${s.F}(${n})=${suSub(terms, n)}=${V}\\ \\checkmark`] };
    }
  }
});
