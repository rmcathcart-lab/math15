/* Math 15 · Unit 8 · Lesson 8 — Unit Review: Systems of Linear Equations.
 * Warm-up: Pick Your Power-Up (tap a power-up on each monster card; show the best ones).
 * Explainers (several adapted from the Math 10C review, u8l6, at Math 15 difficulty):
 *   methods (one system, three roads to (2, 3): graphing from b and m, substitution with the expression lifting into the
 *     other equation, elimination with the opposite terms cancelling),
 *   choose (★ a system travels the which-method flowchart, then is solved and checked: Examples 3–6, Challenge 1, the
 *     warm-up monsters B and C),
 *   howMany (one / none / infinitely many: the graph, the slopes and intercepts, and what the algebra ends with; line 2
 *     turning until parallel, then sliding onto line 1),
 *   graphChk (Example 1 and warm-up monster A: each line drawn from b and the slope, the crossing read and checked),
 *   classify (Example 2 (a)–(d), the warm-up Boss, Challenge 3: a slope / intercept table fills in, then the verdict
 *     and the two lines),
 *   subst (Examples 3, 4, Challenge 1, monster B: isolate if needed, the expression lifts into the other equation,
 *     solve, back-substitute, check both),
 *   elim (Examples 5, 6, monster C and the Boss: the equations in columns, multiply if needed, add or subtract, the
 *     cancelled column struck out),
 *   pipeline (Example 7 and Challenge 2 through the four stages of Lesson 7),
 *   fence (Challenge 2: walk the deck, cut each length into W, W and 6, unroll the fence: 6W + 12 = 60).
 * Colours (whole unit): Eq. 1 / line 1 blue, Eq. 2 / line 2 amber, the solution purple. */
import {
  h, tex, add, box, fit, Graph, Flowchart, stamp, stampIn, checkCard, mountExplainers, pop, fadeIn, appear, sleep, tween,
  svgEl, place, pulse, anim, drawIn, COLORS
} from '../blocks.js';
import { standup } from '../standup.js';

const BLUE = '#1f5bd6', AMB = '#c27a0e', AMBT = '#b06a07', PUR = '#7b4fc4', TEAL = '#13807a', INK = COLORS.ink, GRAY = '#9aa0ab';
const T = (s) => tex(s);
const cB = (s) => `\\textcolor{${BLUE}}{${s}}`, cA = (s) => `\\textcolor{${AMBT}}{${s}}`, cP = (s) => `\\textcolor{${PUR}}{${s}}`;
/* \B{…} blue (Eq. 1), \A{…} amber (Eq. 2), \P{…} purple (solution) — for the pipeline */
const colz = (s) => String(s).replace(/\\B\{/g, `\\textcolor{${BLUE}}{`).replace(/\\A\{/g, `\\textcolor{${AMB}}{`).replace(/\\P\{/g, `\\textcolor{${PUR}}{`);
const TC = (s) => tex(colz(s));
const tag = (k, txt) => `<span class="u8l8-eqtag e${k}">${txt || 'Eq. ' + k}</span>`;
const panel = (stage, x, y, w, hh, title, cls = '') => add(stage, box(h('div', 'u8l8-panel ' + cls, title ? `<div class="u8l8-ph">${title}</div>` : ''), w, hh), x, y);
const line = (p, html, cls = '') => { const d = h('div', 'u8l8-line ' + cls, html); p.appendChild(d); return d; };
const say = async (c, p, html, cls) => { const d = line(p, html, cls); await fadeIn(c, d, 300); return d; };
const hide = (el) => { if (el) el.style.opacity = 0; return el; };
const show = (c, el, ms = 320) => fadeIn(c, el, ms);
/** the problem being solved, across the top of a stage (Ryan, 2026-10-30: every explainer shows its question) */
const qbar = (stage, x, y, w, hh, html) => add(stage, box(h('div', 'u8l8-qbar', `<div>${html}</div>`), w, hh), x, y);
/** position of el inside the stage (layout coordinates: unaffected by page zoom) */
function posIn(el, stage) { let x = 0, y = 0, e = el; while (e && e !== stage) { x += e.offsetLeft; y += e.offsetTop; e = e.offsetParent; } return [x, y]; }
/** lift a copy of the source expression and drop it onto the target slot */
async function lift(c, stage, src, dst, html) {
  if (c.fast) return;
  const [sx, sy] = posIn(src, stage), [tx, ty] = posIn(dst, stage);
  const fly = add(stage, h('div', 'u8l8-piece lift', html), sx - 6, sy - 3);
  await tween(c, 1100, (t) => { fly.style.left = sx - 6 + (tx - sx - 4) * t + 'px'; fly.style.top = sy - 3 + (ty - sy) * t - 70 * Math.sin(Math.PI * t) + 'px'; });
  fly.remove();
}
/** y = mx + b as TeX (m and b may be fractions given as TeX strings) */
const slopeTex = (m, b) => {
  const mm = m === 1 ? '' : m === -1 ? '-' : String(m);
  const bb = typeof b === 'string' ? (b.startsWith('-') ? b : '+' + b) : b === 0 ? '' : b < 0 ? String(b) : '+' + b;
  return `y=${mm}x${bb}`;
};

/* =============================== warm-up: pick your power-up =============================== */
function mountWarm() {
  const cards = [...document.querySelectorAll('.u8l8-mon')];
  cards.forEach((card) => {
    card.querySelectorAll('.u8l8-pk button').forEach((b) => {
      b.setAttribute('data-tap', '');
      b.onclick = () => { const on = !b.classList.contains('on'); card.querySelectorAll('.u8l8-pk button').forEach((x) => x.classList.remove('on')); b.classList.toggle('on', on); };
    });
  });
  const best = document.getElementById('u8l8-best'), clr = document.getElementById('u8l8-clear');
  if (best) best.onclick = () => {
    const on = !best.classList.contains('on'); best.classList.toggle('on', on);
    cards.forEach((card) => { card.classList.toggle('u8l8-showbest', on); card.querySelectorAll('.u8l8-pk button').forEach((b) => b.classList.toggle('best', on && b.dataset.p === card.dataset.best)); });
  };
  if (clr) clr.onclick = () => cards.forEach((card) => card.querySelectorAll('.u8l8-pk button').forEach((b) => b.classList.remove('on')));
}

/* =============================== explainer: three methods (from 10C) =============================== */
const methods = {
  title: 'One system, three roads to the same point',
  height: 440,
  minW: 800,
  choices: [{ v: 'graph', label: 'Graphing' }, { v: 'sub', label: 'Substitution' }, { v: 'elim', label: 'Elimination' }],
  intro: () => `The system ${T(cB('y=2x-1'))}, ${T(cA('x+y=5'))}. Pick a road. Press <b>Next</b>.`,
  make(stage, v, ex) {
    const GW = 330, gx = ex.W - GW - 8;
    const G = new Graph(stage, { x: gx, y: 10, width: GW, height: 410, xmin: -2, xmax: 6, ymin: -3, ymax: 7, fontSize: 15, xlabels: 2, ylabels: 2 });
    const r1 = add(stage, h('div', 'u8l8-row', `${tag(1)}<span class="u8l8-pc">${T(cB('y='))}</span><span class="u8l8-pc u8l8-src">${T(cB('2x-1'))}</span>`), 14, 14);
    add(stage, h('div', 'u8l8-row', `${tag(2)}<span>${T(cA('x+y=5'))}</span>`), 14, 64);
    const sol = () => G.point(2, 3, { color: PUR, r: 8, label: T(cP('(2,\\ 3)')), pos: 'e', gap: 10 });
    const verify = async (c, y0) => { const d = add(stage, h('div', 'u8l8-row u8l8-verify', `Check: ${T(cB('3=2(2)-1'))} ✓ &nbsp; ${T(cA('2+3=5'))} ✓`), 14, y0); await fadeIn(c, d); };
    const drawLines = (c, ms) => Promise.all([G.drawIn(G.line({ m: 2, b: -1 }, { color: BLUE, width: 3.5 }), ms, c), G.drawIn(G.line({ m: -1, b: 5 }, { color: AMB, width: 3.5 }), ms, c)]);
    if (v === 'graph') {
      return [
        { cap: `Eq. 1 is already ${T('y=mx+b')}: start at ${T('b=-1')}, then <b>up 2, right 1</b>, again and again.`,
          run: async (c) => {
            for (const x of [0, 1, 2, 3]) await G.reveal(G.point(x, 2 * x - 1, { color: BLUE, r: 6 }), c, 220);
            await G.drawIn(G.line({ m: 2, b: -1 }, { color: BLUE, width: 3.5 }), 600, c);
            await fadeIn(c, add(stage, h('div', 'u8l8-row', `${T(cB('b=-1,\\ m=2'))}`), 60, 130));
          } },
        { cap: `Rearrange Eq. 2: ${T(cA('y=-x+5'))}. Start at ${T('b=5')}, then <b>down 1, right 1</b>.`,
          run: async (c) => {
            await fadeIn(c, add(stage, h('div', 'u8l8-row', `${T(cA('x+y=5\\ \\to\\ y=-x+5'))}`), 60, 180));
            for (const x of [0, 1, 2, 3]) await G.reveal(G.point(x, 5 - x, { color: AMB, r: 6 }), c, 220);
            await G.drawIn(G.line({ m: -1, b: 5 }, { color: AMB, width: 3.5 }), 600, c);
          } },
        { cap: `Read the crossing point: ${T(cP('(2,\\ 3)'))}. By hand, graphing is exact only when the lines cross on grid points like this one.`,
          run: async (c) => { await G.reveal(sol(), c); await fadeIn(c, add(stage, h('div', 'u8l8-row', `crossing: ${T(cP('(2,\\ 3)'))}`), 60, 240)); } },
        { cap: `Check in <b>both</b> equations: ${T(cB('3=2(2)-1'))} ✓ and ${T(cA('2+3=5'))} ✓`, run: (c) => verify(c, 300) }
      ];
    }
    if (v === 'sub') {
      let slot, work;
      return [
        { cap: `<b>Isolate.</b> Eq. 1 is already done: ${T('y')} is alone, ${T(cB('y=2x-1'))}.`,
          run: async (c) => { const src = r1.querySelector('.u8l8-src'); await pulse(c, src, 1.15); src.style.background = '#e7efff'; src.style.borderRadius = '8px'; } },
        { cap: `<b>Substitute</b> into the <i>other</i> equation: replace ${T('y')} in Eq. 2 with what it equals. The expression <b>lifts</b> out of Eq. 1 and drops into ${T('y')}’s place.`,
          run: async (c) => {
            work = add(stage, h('div', 'u8l8-row u8l8-tight', `<span>${T(cA('x+{}'))}</span><span class="u8l8-slot">${T(cA('y'))}</span><span>${T(cA('{}=5'))}</span>`), 60, 140);
            slot = work.querySelector('.u8l8-slot');
            await fadeIn(c, work);
            await anim(c, slot, [{ opacity: 1 }, { opacity: 0.15 }], 250);
            await lift(c, stage, r1.querySelector('.u8l8-src'), slot, T(cB('(2x-1)')));
            slot.innerHTML = T(cB('(2x-1)')); slot.style.opacity = 1; await pulse(c, slot, 1.1);
          } },
        { cap: `<b>Solve</b> for the one variable left: ${T('x+2x-1=5')}, so ${T('3x=6')} and ${T('x=2')}.`,
          run: async (c) => { await fadeIn(c, add(stage, h('div', 'u8l8-row', T('3x-1=5')), 60, 190)); await fadeIn(c, add(stage, h('div', 'u8l8-row', T('3x=6\\ \\Rightarrow\\ x=2')), 60, 236)); } },
        { cap: `<b>Back-substitute</b> into Eq. 1: ${T(cB('y=2(2)-1=3'))}. The solution is ${T(cP('(2,\\ 3)'))}, the same crossing point as the graph.`,
          run: async (c) => { await fadeIn(c, add(stage, h('div', 'u8l8-row', `${T(cB('y=2(2)-1=3'))} &nbsp;→&nbsp; ${T(cP('(2,\\ 3)'))}`), 60, 282)); await drawLines(c, 500); await G.reveal(sol(), c); } },
        { cap: `Check in <b>both</b> equations: ${T(cB('3=2(2)-1'))} ✓ and ${T(cA('2+3=5'))} ✓`, run: (c) => verify(c, 340) }
      ];
    }
    const X0 = 70, COLS = [0, 92, 190, 232], cell = (tx, col, y, color) => add(stage, h('div', 'u8l8-piece', T(color ? color(tx) : tx)), X0 + COLS[col], y);
    const rowA = [], rowB = [];
    return [
      { cap: `Line the equations up with ${T('x')} and ${T('y')} on the left. Eq. 1 ${T(cB('y=2x-1'))} becomes ${T(cB('2x-y=1'))}.`,
        run: async (c) => {
          [['2x', 0], ['-\\,y', 1], ['=', 2], ['1', 3]].forEach(([t, k]) => rowA.push(cell(t, k, 140, cB)));
          [['x', 0], ['+\\,y', 1], ['=', 2], ['5', 3]].forEach(([t, k]) => rowB.push(cell(t, k, 190, cA)));
          for (const e of rowA) await fadeIn(c, e, 200);
          for (const e of rowB) await fadeIn(c, e, 200);
        } },
      { cap: `The ${T('y')}-terms are <b>opposites</b> (${T('-y')} and ${T('+y')}): <b>add</b>. Left side plus left side equals right side plus right side.`,
        run: async (c) => {
          const plus = add(stage, h('div', 'u8l8-piece', T('+')), X0 - 40, 190); await pop(c, plus);
          const rule = add(stage, box(h('div', 'u8l8-rule'), 280, null), X0 - 10, 236); await anim(c, rule, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], 400);
        } },
      { cap: `The ${T('y')}’s cancel: ${T('-y+y=0')}. What is left is ${T('3x=6')}, so ${T('x=2')}.`,
        run: async (c) => {
          for (const e of [rowA[1], rowB[1]]) { const s = add(stage, box(h('div', 'u8l8-strike'), 58, null), parseFloat(e.style.left) - 4, parseFloat(e.style.top) + 15); s.style.transform = 'rotate(-14deg)'; await anim(c, s, [{ transform: 'rotate(-14deg) scaleX(0)' }, { transform: 'rotate(-14deg) scaleX(1)' }], 300); }
          const res = [['3x', 0], ['0', 1], ['=', 2], ['6', 3]].map(([t, k], i) => { const d = cell(t, k, 246); if (i === 1) d.style.color = GRAY; return hide(d); });
          for (const d of res) await fadeIn(c, d, 220);
          await fadeIn(c, add(stage, h('div', 'u8l8-row', T('x=2')), X0 + 300, 246));
        } },
      { cap: `Back-substitute into Eq. 2: ${T(cA('2+y=5'))}, so ${T('y=3')}. The solution is ${T(cP('(2,\\ 3)'))} again.`,
        run: async (c) => { await fadeIn(c, add(stage, h('div', 'u8l8-row', `${T(cA('2+y=5'))} → ${T('y=3')} → ${T(cP('(2,\\ 3)'))}`), 60, 300)); await drawLines(c, 500); await G.reveal(sol(), c); } },
      { cap: `Check in <b>both</b> equations: ${T(cB('3=2(2)-1'))} ✓ and ${T(cA('2+3=5'))} ✓. Three methods, one answer.`, run: (c) => verify(c, 354) }
    ];
  }
};

/* =============================== explainer: ★ choosing a method (from 10C) =============================== */
const SYS = {
  e3: { label: 'Example 3', e: ['y=4x-3', '2x+y=15'], path: ['q1', 'q2', 'q3', 'sub'],
    ans: ['<b>No</b>: we want an exact answer.', '<b>No</b>: Eq. 1 is not in ' + T('Ax+By=C') + ' form.', '<b>Yes</b>: ' + T('y') + ' is already alone in Eq. 1.'],
    why: T('y') + ' is already isolated: substitute ' + T('4x-3') + ' into Eq. 2.',
    work: ['2x+(4x-3)=15', '6x=18\\Rightarrow x=3', 'y=4(3)-3=9'], sol: '(3,\\ 9)', check: '2(3)+9=15' },
  e4: { label: 'Example 4', e: ['x+3y=19', '2x-y=3'], path: ['q1', 'q2', 'q3', 'sub'],
    ans: ['<b>No</b>: we want an exact answer.', '<b>No</b>: ' + T('1') + ' and ' + T('2') + ', ' + T('3') + ' and ' + T('-1') + ' don’t match.', '<b>Yes</b>: ' + T('y') + ' has coefficient ' + T('-1') + ' in Eq. 2.'],
    why: 'Isolate ' + T('y') + ' in Eq. 2, ' + T('y=2x-3') + ', and substitute.',
    work: ['x+3(2x-3)=19', '7x=28\\Rightarrow x=4', 'y=2(4)-3=5'], sol: '(4,\\ 5)', check: '4+3(5)=19' },
  e5: { label: 'Example 5', e: ['3x+2y=18', 'x-2y=-2'], path: ['q1', 'q2', 'elim'],
    ans: ['<b>No</b>: we want an exact answer.', '<b>Yes</b>: the ' + T('y') + '-coefficients are opposites (' + T('+2') + ' and ' + T('-2') + ').'],
    why: 'Opposite ' + T('y') + '-terms: <b>add</b> the equations.',
    work: ['4x=16\\Rightarrow x=4', '4-2y=-2\\Rightarrow y=3'], sol: '(4,\\ 3)', check: '3(4)+2(3)=18' },
  e6: { label: 'Example 6', e: ['4x+3y=23', '3x+2y=16'], path: ['q1', 'q2', 'q3', 'scale', 'elim'],
    ans: ['<b>No</b>: we want an exact answer.', '<b>No</b>: ' + T('4') + ' and ' + T('3') + ', ' + T('3') + ' and ' + T('2') + ' don’t match.', '<b>No</b>: no coefficient is ' + T('1') + ' or ' + T('-1') + '.', 'Make both ' + T('y') + '-terms ' + T('6y') + ': Eq. 1 ' + T('\\times2') + ', Eq. 2 ' + T('\\times3') + '.'],
    why: 'Now the ' + T('y') + '-terms match (' + T('6y') + ' and ' + T('6y') + '): <b>subtract</b>.',
    work: ['8x+6y=46,\\ \\ 9x+6y=48', '-x=-2\\Rightarrow x=2', '3(2)+2y=16\\Rightarrow y=5'], sol: '(2,\\ 5)', check: '4(2)+3(5)=23' },
  c1: { label: 'Challenge 1', e: ['5x-3y=19', '2x+y=12'], path: ['q1', 'q2', 'q3', 'sub'],
    ans: ['<b>No</b>: we want an exact answer.', '<b>No</b>: ' + T('5') + ' and ' + T('2') + ', ' + T('-3') + ' and ' + T('1') + ' don’t match.', '<b>Yes</b>: ' + T('y') + ' has coefficient ' + T('1') + ' in Eq. 2.'],
    why: T('y=12-2x') + ' in one step, no fractions: substitute.',
    work: ['5x-3(12-2x)=19', '11x=55\\Rightarrow x=5', 'y=12-2(5)=2'], sol: '(5,\\ 2)', check: '5(5)-3(2)=19' },
  mB: { label: 'Monster B', e: ['y=2x', 'x+y=12'], path: ['q1', 'q2', 'q3', 'sub'],
    ans: ['<b>No</b>: we want an exact answer.', '<b>No</b>: Eq. 1 is not in ' + T('Ax+By=C') + ' form.', '<b>Yes</b>: ' + T('y') + ' is already alone in Eq. 1.'],
    why: 'Swap ' + T('2x') + ' in for ' + T('y') + '.',
    work: ['x+2x=12', '3x=12\\Rightarrow x=4', 'y=2(4)=8'], sol: '(4,\\ 8)', check: '4+8=12' },
  mC: { label: 'Monster C', e: ['x+y=10', 'x-y=4'], path: ['q1', 'q2', 'elim'],
    ans: ['<b>No</b>: we want an exact answer.', '<b>Yes</b>: the ' + T('y') + '-coefficients are opposites (' + T('+1') + ' and ' + T('-1') + ').'],
    why: 'Opposite ' + T('y') + '-terms: <b>add</b>. (Substitution works too, but this is one line.)',
    work: ['2x=14\\Rightarrow x=7', '7+y=10\\Rightarrow y=3'], sol: '(7,\\ 3)', check: '7-3=4' }
};
const NODE_NAME = { gr: 'graphing', sub: 'substitution', elim: 'elimination' };
const choose = {
  title: '★ Which method? A system travels the flowchart',
  height: 510,
  minW: 940,
  choices: [{ v: 'e3', label: SYS.e3.label }, { v: 'e4', label: SYS.e4.label }, { v: 'e5', label: SYS.e5.label }, { v: 'e6', label: SYS.e6.label }, { v: 'c1', label: SYS.c1.label }, { sep: 'Warm-up' }, { v: 'mB', label: SYS.mB.label }, { v: 'mC', label: SYS.mC.label }],
  intro: (v) => `The system ${T(cB(SYS[v].e[0]))}, ${T(cA(SYS[v].e[1]))} answers each question. Press <b>Next</b>.`,
  make(stage, v, ex) {
    const S = SYS[v], FW = 650, PX = FW + 14, PW = ex.W - PX - 8;
    const F = new Flowchart(stage, {
      x: 4, y: 4, width: FW, height: 500,
      nodes: {
        start: { x: 285, y: 30, w: 270, h: 46, html: '<b>Look at the system</b>', cls: 'bk-round' },
        q1: { x: 285, y: 125, w: 284, h: 72, html: '<b>Lines drawn, or just a picture?</b>exact only at grid points', cls: 'bk-diamond' },
        q2: { x: 285, y: 235, w: 284, h: 72, html: `<b>Matching or opposite coefficients?</b>both in ${T('Ax+By=C')} form`, cls: 'bk-diamond' },
        q3: { x: 285, y: 345, w: 284, h: 72, html: `<b>Variable alone?</b>or a coefficient of ${T('1')} or ${T('-1')}`, cls: 'bk-diamond' },
        scale: { x: 285, y: 455, w: 284, h: 56, html: '<b>Multiply one or both</b>every term' },
        gr: { x: 540, y: 125, w: 170, h: 56, html: '<b>Graphing</b>read the crossing', color: TEAL },
        elim: { x: 540, y: 235, w: 170, h: 56, html: '<b>Elimination</b>add or subtract', color: TEAL },
        sub: { x: 540, y: 345, w: 170, h: 56, html: '<b>Substitution</b>swap in and solve', color: TEAL }
      },
      edges: [
        { from: 'start', to: 'q1' }, { from: 'q1', to: 'gr', label: 'yes' }, { from: 'q1', to: 'q2', label: 'no' },
        { from: 'q2', to: 'elim', label: 'yes' }, { from: 'q2', to: 'q3', label: 'no' },
        { from: 'q3', to: 'sub', label: 'yes' }, { from: 'q3', to: 'scale', label: 'no' },
        { from: 'scale', to: 'elim', pts: [[430, 455], [640, 455], [640, 235], [628, 235]] }
      ]
    });
    F.el.classList.add('u8l8-flow');
    const tok = h('div', 'u8l8-token', `${T(cB(S.e[0]))}<br>${T(cA(S.e[1]))}`); F.html.appendChild(tok); tok.style.opacity = 0;
    const METH = ['gr', 'elim', 'sub'];
    const tpos = (id) => { const n = F.node(id).n; return METH.includes(id) ? [n.x, n.y - n.h / 2 - 25] : [n.x - n.w / 2 - 8 - 66, n.y]; };
    let tcur = null;
    const tokTo = async (c, id) => { const [x2, y2] = tpos(id); if (!tcur) { tcur = [x2, y2]; place(tok, x2, y2, 'c'); await pop(c, tok, 300); return; } const [xa, ya] = tcur; await tween(c, 560, (t) => place(tok, xa + (x2 - xa) * t, ya + (y2 - ya) * t, 'c')); tcur = [x2, y2]; };
    const goTo = async (c, a, b) => { await Promise.all([F.go(c, a, b), tokTo(c, b)]); await F.visit(c, b); };
    const Pn = panel(stage, PX, 6, PW, 498, 'The system');
    line(Pn, `${tag(1)}${T(cB(S.e[0]))}`); line(Pn, `${tag(2)}${T(cA(S.e[1]))}`);
    const QTXT = { q1: 'Are the lines already drawn, or is a picture enough?', q2: 'Do one variable’s coefficients match, or are they opposites?', q3: 'Is a variable alone, or does one have coefficient 1 or −1?' };
    const steps = [{ cap: `Start with the system: ${T(cB(S.e[0]))} and ${T(cA(S.e[1]))}.`, run: async (c) => { await tokTo(c, 'start'); await F.visit(c, 'start'); } }];
    const full = ['start', ...S.path];
    S.path.forEach((id, i) => {
      const from = full[i];
      if (id.startsWith('q')) steps.push({ cap: `<b>${QTXT[id]}</b> ${S.ans[i]}`, run: async (c) => { await goTo(c, from, id); } });
      else if (id === 'scale') steps.push({ cap: `<b>Multiply first.</b> ${S.ans[i]}`, run: async (c) => { await goTo(c, from, id); } });
      else steps.push({ cap: `<b>Use ${NODE_NAME[id]}.</b> Reason: ${S.why}`,
        run: async (c) => { await goTo(c, from, id); await say(c, Pn, `<b>Method:</b> ${NODE_NAME[id]}<br><span class="u8l8-small">${S.why}</span>`); } });
    });
    steps.push({ cap: `Solve: ${S.work.map((w) => T(w)).join(', ')}. The solution is ${T(cP(S.sol))}.`,
      run: async (c) => { for (const w of S.work) await say(c, Pn, T(w), 'u8l8-small'); await say(c, Pn, `Solution: ${T(cP(S.sol))}`); } });
    steps.push({ cap: `Check in the other equation too: ${T(S.check)} ✓. Whichever method you choose, check in <b>both</b>.`,
      run: async (c) => { await say(c, Pn, `<span class="u8l8-good">Check: ${T(S.check)} ✓</span>`); const st = stamp(Pn, NODE_NAME[S.path[S.path.length - 1]], { ok: true, size: 'sm' }); st.style.alignSelf = 'center'; await stampIn(c, st); } });
    return steps;
  }
};

/* =============================== explainer: how many solutions (from 10C) =============================== */
const HM = {
  one: { label: 'One solution', m: -1, b: 5 },
  none: { label: 'No solution', m: 2, b: 3 },
  inf: { label: 'Infinitely many', m: 2, b: -1 },
  turn: { label: 'Turn line 2', m: -1, b: 5 }
};
const howMany = {
  title: 'How many solutions? Graph, slopes, algebra',
  height: 450,
  minW: 820,
  choices: Object.keys(HM).map((k) => ({ v: k, label: HM[k].label })),
  intro: (v) => (v === 'turn' ? 'Start with two crossing lines, then turn and slide line 2. Press <b>Next</b>.' : 'Line 1 is always ' + T(cB('y=2x-1')) + '. Compare line 2 three ways. Press <b>Next</b>.'),
  make(stage, v, ex) {
    const G = new Graph(stage, { x: 8, y: 8, width: 430, height: 430, xmin: -6, xmax: 6, ymin: -6, ymax: 6, xlabels: 2, ylabels: 2, fontSize: 15 });
    const Pn = panel(stage, 458, 8, ex.W - 468, 430, v === 'turn' ? 'Line 2' : 'Compare');
    G.line({ m: 2, b: -1 }, { color: BLUE, width: 4 });
    const st = { m: HM[v].m, b: HM[v].b };
    const L2 = G.curve(() => { const w = G.win; return { subs: [[G.toPx(w.xmin, st.m * w.xmin + st.b), G.toPx(w.xmax, st.m * w.xmax + st.b)]] }; }, { color: AMB, width: 4, dash: v === 'inf' ? '12 9' : null }, 'u8l8-l2', G.layers.data);
    hide(L2);
    const eq2 = (m, b) => `y=${m === 1 ? '' : m === -1 ? '-' : m}x${b < 0 ? b : '+' + b}`;
    if (v === 'turn') {
      const sol = G.point(2, 3, { color: PUR, r: 8 });
      const upd = () => { L2._bkDraw(); const den = 2 - st.m; if (Math.abs(den) < 1e-6) { sol.style.display = 'none'; return; } const x = (st.b + 1) / den; G.moveTo(sol, x, 2 * x - 1); };
      hide(sol);
      return [
        { cap: `Line 2 is ${T(cA('y=-x+5'))}. Different slopes (${T('2')} and ${T('-1')}): the lines cross once, at ${T(cP('(2,\\ 3)'))}.`,
          run: async (c) => { await appear(c, L2, 300); await G.drawIn(L2, 500, c); await G.reveal(sol, c); await say(c, Pn, `${T(cA('y=-x+5'))}: slope ${T('-1')}, crosses at ${T(cP('(2,\\ 3)'))}`); } },
        { cap: `Turn line 2 (keep ${T('b=5')}) until its slope is ${T('2')} too. Watch the crossing point: it runs away and leaves the grid. Same slope, different intercepts: <b>parallel</b>, no solution.`,
          run: async (c) => { await tween(c, 2600, (t) => { st.m = -1 + 3 * t; upd(); }); st.m = 2; upd(); await say(c, Pn, `${T(cA('y=2x+5'))}: slope ${T('2')} = slope ${T('2')} → parallel, <b>no</b> crossing`); } },
        { cap: `Now slide it down. At ${T('b=-1')} it lands exactly on line 1: <b>the same line</b>. Every point on it is on both lines: <b>infinitely many</b> solutions.`,
          run: async (c) => { await tween(c, 1800, (t) => { st.b = 5 - 6 * t; upd(); }); st.b = -1; upd(); L2.path.setAttribute('stroke-dasharray', '12 9'); await say(c, Pn, `${T(cA('y=2x-1'))}: same slope, same intercept → <b>infinitely many</b>`); } },
        { cap: `Only the slopes decide <b>one</b> solution. When the slopes are the same, the intercepts decide: different → <b>none</b>, same → <b>infinitely many</b>.`,
          run: async (c) => { await say(c, Pn, `<b>slopes differ</b> → one<br><b>slopes same</b>, ${T('b')} differ → none<br><b>slopes same</b>, ${T('b')} same → infinitely many`, 'u8l8-small'); } }
      ];
    }
    const steps = [
      { cap: `Line 1: ${T(cB('y=2x-1'))}. Line 2: ${T(cA(v === 'inf' ? '4x-2y=2' : eq2(st.m, st.b)))}.` + (v === 'inf' ? ` Rearranged: ${T('-2y=-4x+2')}, so ${T(cA('y=2x-1'))}.` : ''),
        run: async (c) => { await appear(c, L2, 200); await G.drawIn(L2, 600, c); await say(c, Pn, `${tag(1)}${T(cB('y=2x-1'))}<br>${tag(2)}${T(cA(v === 'inf' ? '4x-2y=2\\ \\to\\ y=2x-1' : eq2(st.m, st.b)))}`); } }
    ];
    if (v === 'one') {
      steps.push({ cap: `<b>Slopes</b> ${T('2')} and ${T('-1')}: different. The lines must cross, exactly once.`, run: async (c) => { await say(c, Pn, `Slopes ${T('2')}, ${T('-1')}: <b>different</b>`); } });
      steps.push({ cap: `<b>Algebra:</b> set them equal. ${T('2x-1=-x+5')}, so ${T('3x=6')} and ${T('x=2')}; then ${T('y=2(2)-1=3')}. The algebra ends with ${T('x=')} a number.`,
        run: async (c) => { await say(c, Pn, `${T('2x-1=-x+5')}<br>${T('3x=6\\Rightarrow x=2,\\ y=3')}`); const p = G.point(2, 3, { color: PUR, r: 8, label: T(cP('(2,\\ 3)')), pos: 'e', gap: 10 }); await G.reveal(p, c); } });
      steps.push({ cap: `<b>One solution:</b> ${T(cP('(2,\\ 3)'))}, the only point on both lines.`, run: async (c) => { const s = stamp(Pn, 'one solution', { ok: true, size: 'sm' }); s.style.alignSelf = 'center'; await stampIn(c, s); } });
    } else if (v === 'none') {
      steps.push({ cap: `<b>Slopes</b> ${T('2')} and ${T('2')}: the same. <b>Intercepts</b> ${T('-1')} and ${T('3')}: different. The lines are parallel: always 4 units apart, straight up and down.`,
        run: async (c) => { await say(c, Pn, `Slopes ${T('2')}, ${T('2')}: <b>same</b><br>Intercepts ${T('-1')}, ${T('3')}: <b>different</b>`); for (const x of [-2, 1]) { const s = G.segment([x, 2 * x - 1], [x, 2 * x + 3], { color: GRAY, width: 2.5, dash: '5 4' }); await G.drawIn(s, 300, c); } } });
      steps.push({ cap: `<b>Algebra:</b> write both as ${T('2x-y=\\ldots')}: ${T(cB('2x-y=1'))} and ${T(cA('2x-y=-3'))}. Subtract: ${T('0=4')}. That is <b>false</b>: no pair ${T('(x,\\ y)')} can make it true.`,
        run: async (c) => { await say(c, Pn, `${T(cB('2x-y=1'))}<br>${T(cA('2x-y=-3'))}<br>subtract: ${T('0=4')} <span class="u8l8-bad">✗ false</span>`); } });
      steps.push({ cap: '<b>No solution.</b> Parallel lines never meet.', run: async (c) => { const s = stamp(Pn, 'no solution', { ok: false, size: 'sm' }); s.style.alignSelf = 'center'; await stampIn(c, s); } });
    } else {
      steps.push({ cap: `<b>Slopes</b> ${T('2')} and ${T('2')}: the same. <b>Intercepts</b> ${T('-1')} and ${T('-1')}: the same. Line 2 lies right on top of line 1.`,
        run: async (c) => { await say(c, Pn, `Slopes ${T('2')}, ${T('2')}: <b>same</b><br>Intercepts ${T('-1')}, ${T('-1')}: <b>same</b>`); for (const x of [-1, 1, 3]) await G.reveal(G.point(x, 2 * x - 1, { color: PUR, r: 6 }), c, 200); } });
      steps.push({ cap: `<b>Algebra:</b> ${T(cB('2x-y=1'))} times 2 is ${T('4x-2y=2')}. Subtract ${T(cA('4x-2y=2'))}: ${T('0=0')}. That is <b>always true</b>.`,
        run: async (c) => { await say(c, Pn, `${T('2\\times(' + cB('2x-y=1') + '):\\ 4x-2y=2')}<br>subtract ${T(cA('4x-2y=2'))}: ${T('0=0')} <span class="u8l8-good">✓ true</span>`); } });
      steps.push({ cap: `<b>Infinitely many solutions:</b> every point on the line, like ${T('(-1,\\ -3)')}, ${T('(1,\\ 1)')}, ${T('(3,\\ 5)')}, works in both equations.`, run: async (c) => { const s = stamp(Pn, 'infinitely many', { ok: null, size: 'sm' }); s.style.alignSelf = 'center'; await stampIn(c, s); } });
    }
    return steps;
  }
};

/* =============================== explainer: Example 1 — graph from b and m =============================== */
const GC = {
  ex1: { label: 'Example 1 check', l1: { m: 1, b: 1, dash: null }, l2: { m: -2, b: 7, dash: '9 6' }, pt: [2, 3],
    g: { xmin: -5, xmax: 6, ymin: -4, ymax: 8 }, q: 'Solve by graphing: <b>y = x + 1</b> and <b>y = −2x + 7</b>. Read the crossing point and check it.' },
  mA: { label: 'Warm-up: Monster A', l1: { m: 1, b: 1, dash: null }, l2: { m: -1, b: 5, dash: '9 6' }, pt: [2, 3],
    g: { xmin: -1, xmax: 7, ymin: -1, ymax: 7 }, q: 'Monster A: the lines <b>y = x + 1</b> and <b>y = −x + 5</b> are already drawn. Where do they cross?' }
};
const graphChk = {
  title: 'Draw each line from b and the slope, then read the crossing',
  height: 520,
  minW: 900,
  choices: [{ v: 'ex1', label: GC.ex1.label }, { sep: 'Warm-up' }, { v: 'mA', label: GC.mA.label }],
  intro: (v) => `${GC[v].label}: start each line at its ${T('y')}-intercept ${T('b')}, then step with the slope. Press <b>Next</b>.`,
  make(stage, v, ex) {
    const d = GC[v], GW = 430, nx = d.g.xmax - d.g.xmin, ny = d.g.ymax - d.g.ymin, GH = Math.min(450, GW * ny / nx);
    qbar(stage, 12, 6, ex.W - 24, 46, d.q);
    const G = new Graph(stage, Object.assign({ x: 12, y: 62, width: GW * Math.min(1, 450 / (GW * ny / nx)), height: GH, xlabels: 2, ylabels: 2, fontSize: 15 }, d.g));
    const PX = 12 + GW + 24, Pn = panel(stage, PX, 62, ex.W - PX - 12, 450, 'The two lines', 'u8l8-gpan');
    const eqT = (L) => slopeTex(L.m, L.b);
    const run = (L) => (L.m > 0 ? `up ${L.m}, right 1` : `down ${-L.m}, right 1`);
    const pts = (L) => { const out = []; for (let x = 0; x <= 4; x++) { const y = L.m * x + L.b; if (y >= d.g.ymin && y <= d.g.ymax && x <= d.g.xmax) out.push([x, y]); } return out; };
    const [px, py] = d.pt;
    const ck = (L) => `${L.m === 1 ? '' : L.m === -1 ? '-' : L.m}${L.m === 1 || L.m === -1 ? px : `(${px})`}${L.b < 0 ? L.b : '+' + L.b}=${py}`;
    return [
      { cap: `${tag(1)} ${T(cB(eqT(d.l1)))}: start at ${T(`b=${d.l1.b}`)} on the ${T('y')}-axis, then go <b>${run(d.l1)}</b>, again and again.`,
        run: async (c) => {
          await say(c, Pn, `${tag(1)}${T(cB(eqT(d.l1)))} &nbsp;<span class="u8l8-small">${T(`b=${d.l1.b},\\ m=${d.l1.m}`)}</span>`);
          for (const [x, y] of pts(d.l1)) await G.reveal(G.point(x, y, { color: BLUE, r: 6 }), c, 200);
          await G.drawIn(G.line({ m: d.l1.m, b: d.l1.b }, { color: BLUE, width: 3.5, dash: d.l1.dash }), 600, c);
        } },
      { cap: `${tag(2)} ${T(cA(eqT(d.l2)))}: start at ${T(`b=${d.l2.b}`)}, then go <b>${run(d.l2)}</b>.`,
        run: async (c) => {
          await say(c, Pn, `${tag(2)}${T(cA(eqT(d.l2)))} &nbsp;<span class="u8l8-small">${T(`b=${d.l2.b},\\ m=${d.l2.m}`)}</span>`);
          for (const [x, y] of pts(d.l2)) await G.reveal(G.point(x, y, { color: AMB, r: 6 }), c, 200);
          await G.drawIn(G.line({ m: d.l2.m, b: d.l2.b }, { color: AMB, width: 3.5, dash: d.l2.dash }), 600, c);
        } },
      { cap: `The lines cross at a grid point: <b>${px} right and ${py} up</b>. So ${T(`x=${px}`)} and ${T(`y=${py}`)}: the solution is ${T(cP(`(${px},\\ ${py})`))}.`,
        run: async (c) => { await G.reveal(G.point(px, py, { color: PUR, r: 9, label: T(cP(`(${px},\\ ${py})`)), pos: 'e', gap: 12 }), c); await say(c, Pn, `crossing: ${T(cP(`(${px},\\ ${py})`))}`); } },
      { cap: `Check in <b>both</b> equations: ${T(cB(ck(d.l1)))} ✓ and ${T(cA(ck(d.l2)))} ✓. It works in both, so it is the solution.`,
        run: async (c) => {
          await say(c, Pn, `<span class="u8l8-good">${T(cB(ck(d.l1)))} ✓</span>`); await say(c, Pn, `<span class="u8l8-good">${T(cA(ck(d.l2)))} ✓</span>`);
          const s = stamp(Pn, 'on both lines', { ok: true, size: 'sm' }); s.style.alignSelf = 'center'; await stampIn(c, s);
        } }
    ];
  }
};

/* =============================== explainer: Example 2 — compare m, then b =============================== */
const CL = {
  a: { label: '(a)', e: [[6, -1], [6, 5]], win: 'std' },
  b: { label: '(b)', e: [[2, 7], [-4, 1]], win: 'std', pt: [-1, 5], pos: 'w' },
  c: { label: '(c)', e: [[-3, 6], [-3, 6]], win: 'std' },
  d: { label: '(d)', e: [[1, -9], [-1, -9]], win: 'std', pt: [0, -9] },
  boss: { label: 'The Boss', e: [[-1.5, 3.75], [-1.5, 4.5]], raw: ['6x+4y=15', '3x+2y=9'], tx: [['-\\tfrac32', '\\tfrac{15}{4}'], ['-\\tfrac32', '\\tfrac92']],
    re: ['4y=-6x+15\\ \\to\\ y=-\\tfrac32x+\\tfrac{15}{4}', '2y=-3x+9\\ \\to\\ y=-\\tfrac32x+\\tfrac92'], win: 'boss' },
  shop: { label: 'Challenge 3: two shops', e: [[45, 30], [45, 55]], vars: ['h', 'C'], win: 'shop', names: ['Shop A', 'Shop B'] }
};
const WIN = {
  std: { xmin: -6, xmax: 6, ymin: -12, ymax: 10, xstep: 1, ystep: 1, xlabels: 2, ylabels: 2 },
  boss: { xmin: -3, xmax: 6, ymin: -5, ymax: 9, xlabels: 1, ylabels: 2 },
  shop: { xmin: 0, xmax: 8, ymin: 0, ymax: 450, xstep: 1, ystep: 50, xlabels: 1, ylabels: 100, xtitle: 'h', ytitle: 'C' }
};
const classify = {
  title: 'Without graphing: compare the slopes, then the intercepts',
  height: 500,
  minW: 900,
  choices: [{ sep: 'Example 2' }, { v: 'a', label: '(a)' }, { v: 'b', label: '(b)' }, { v: 'c', label: '(c)' }, { v: 'd', label: '(d)' }, { sep: 'More' }, { v: 'boss', label: 'Warm-up: the Boss' }, { v: 'shop', label: CL.shop.label }],
  intro: (v) => `${v.length === 1 ? 'Example 2' : ''}${CL[v].label}: how many solutions? Press <b>Next</b>.`,
  make(stage, v, ex) {
    const d = CL[v], W = ex.W, [[m1, b1], [m2, b2]] = d.e, vars = d.vars || ['x', 'y'];
    const eTex = (i) => (d.tx ? `y=${d.tx[i][0]}x+${d.tx[i][1]}` : vars[0] === 'h' ? `C=${d.e[i][0]}h+${d.e[i][1]}` : slopeTex(d.e[i][0], d.e[i][1]));
    const mT = (i) => (d.tx ? d.tx[i][0] : String(d.e[i][0])), bT = (i) => (d.tx ? d.tx[i][1] : String(d.e[i][1]));
    qbar(stage, 12, 6, W - 24, 46, d.raw ? `The Boss: <b>${T(d.raw[0])}</b> and <b>${T(d.raw[1])}</b>. How many solutions?` : `${d.names ? `${d.names[0]}: ${T(cB(eTex(0)))} &nbsp; ${d.names[1]}: ${T(cA(eTex(1)))}` : `${T(cB(eTex(0)))} and ${T(cA(eTex(1)))}`}. One solution, no solution, or infinitely many?`);
    const LW = W - 470 - 24, P = panel(stage, 12, 62, LW, 430, 'Compare');
    const G = new Graph(stage, Object.assign({ x: W - 470, y: 62, width: 458, height: 430, fontSize: 15 }, WIN[d.win]));
    const tab = h('div', 'u8l8-ctab2', `<div></div><div class="u8l8-cth">slope ${T('m')}</div><div class="u8l8-cth">intercept ${T('b')}</div>
      <div>${tag(1, d.names ? 'A' : 'Eq. 1')}</div><div class="u8l8-cv" data-k="m1">${T(cB(mT(0)))}</div><div class="u8l8-cv" data-k="b1">${T(cB(bT(0)))}</div>
      <div>${tag(2, d.names ? 'B' : 'Eq. 2')}</div><div class="u8l8-cv" data-k="m2">${T(cA(mT(1)))}</div><div class="u8l8-cv" data-k="b2">${T(cA(bT(1)))}</div>
      <div></div><div class="u8l8-cres" data-k="mr"></div><div class="u8l8-cres" data-k="br"></div>`);
    const cell = (k) => tab.querySelector(`[data-k="${k}"]`);
    ['m1', 'b1', 'm2', 'b2', 'mr', 'br'].forEach((k) => hide(cell(k)));
    const sameM = Math.abs(m1 - m2) < 1e-9, sameB = Math.abs(b1 - b2) < 1e-9;
    const verdict = !sameM ? 'one solution' : sameB ? 'infinitely many' : 'no solution';
    const steps = [];
    if (d.re) {
      steps.push({ cap: `First put each equation in ${T('y=mx+b')} form: solve for ${T('y')}.`,
        run: async (c) => { await say(c, P, `${tag(1)}${T(cB(d.re[0]))}`, 'u8l8-small'); await say(c, P, `${tag(2)}${T(cA(d.re[1]))}`, 'u8l8-small'); } });
    } else {
      steps.push({ cap: `Both equations are already in ${T(`${vars[1]}=m${vars[0]}+b`)} form. Read off each slope and intercept.`,
        run: async (c) => { await say(c, P, `${tag(1, d.names ? 'A' : 'Eq. 1')}${T(cB(eTex(0)))}`, 'u8l8-big'); await say(c, P, `${tag(2, d.names ? 'B' : 'Eq. 2')}${T(cA(eTex(1)))}`, 'u8l8-big'); } });
    }
    steps.push({ cap: `<b>Slopes first:</b> ${T(mT(0))} and ${T(mT(1))}. ${sameM ? 'The <b>same</b>.' : '<b>Different</b>: the lines must cross exactly once.'}`,
      run: async (c) => {
        if (!tab.parentNode) { P.appendChild(tab); await fadeIn(c, tab, 250); }
        await pop(c, cell('m1')); await pop(c, cell('m2'));
        cell('mr').innerHTML = sameM ? '<b class="u8l8-same">same</b>' : '<b class="u8l8-diff">different</b>'; await pop(c, cell('mr'));
      } });
    if (sameM) {
      steps.push({ cap: `Same slope, so look at the <b>intercepts:</b> ${T(bT(0))} and ${T(bT(1))}. ${sameB ? 'The <b>same</b> too: it is one line drawn twice.' : '<b>Different</b>: two parallel lines, one above the other.'}`,
        run: async (c) => {
          await pop(c, cell('b1')); await pop(c, cell('b2'));
          cell('br').innerHTML = sameB ? '<b class="u8l8-same">same</b>' : '<b class="u8l8-diff">different</b>'; await pop(c, cell('br'));
        } });
    }
    const L1 = () => G.line({ m: m1, b: b1 }, { color: BLUE, width: 3.5 }), L2 = () => G.line({ m: m2, b: b2 }, { color: AMB, width: 3.5, dash: sameB && sameM ? '12 9' : null });
    const what = !sameM ? (d.pt ? `They cross at ${T(cP(`(${d.pt[0]},\\ ${d.pt[1]})`))}.` : 'They cross once.') : sameB ? 'Every point on the line works.' : (v === 'shop' ? 'Shop B is always $25 more: the two prices are never equal.' : 'Parallel lines never meet.');
    steps.push({ cap: `<b>${verdict[0].toUpperCase() + verdict.slice(1)}.</b> The graph agrees: ${what}`,
      run: async (c) => {
        await G.drawIn(L1(), 600, c); await G.drawIn(L2(), 600, c);
        if (!sameM && d.pt) await G.reveal(G.point(d.pt[0], d.pt[1], { color: PUR, r: 8, label: T(cP(`(${d.pt[0]},\\ ${d.pt[1]})`)), pos: d.pos || 'e', gap: 10 }), c);
        if (v === 'shop') { const s = G.segment([4, 45 * 4 + 30], [4, 45 * 4 + 55], { color: GRAY, width: 2.5, dash: '5 4' }); await G.drawIn(s, 300, c); await fadeIn(c, G.label(4, 45 * 4 + 42, '$25', { pos: 'e', cls: 'bk-ptlab', dx: 6 })); }
        const s = stamp(P, verdict, { ok: verdict === 'one solution' ? true : verdict === 'no solution' ? false : null, size: 'sm' }); s.style.alignSelf = 'center'; await stampIn(c, s);
      } });
    if (v === 'boss') steps.push({ cap: `The algebra agrees: double ${T('3x+2y=9')} to get ${T('6x+4y=18')}, subtract from ${T('6x+4y=15')}: ${T('0=-3')}, a <b>false</b> statement.`,
      run: async (c) => { await say(c, P, `${T('6x+4y=15')}, ${T('6x+4y=18')}<br>subtract: ${T('0=-3')} <span class="u8l8-bad">✗ false</span>`, 'u8l8-small'); } });
    return steps;
  }
};

/* =============================== explainer: substitution (Examples 3, 4, Challenge 1, Monster B) =============================== */
const SB = {
  e3: { label: 'Example 3 check', e: ['y=4x-3', '2x+y=15'], srcEq: 1, lhs: 'y=', rhs: '4x-3', iso: null,
    sub: ['2x+', '(4x-3)', '=15'], work: ['6x-3=15', '6x=18\\ \\Rightarrow\\ x=3'], back: 'y=4(3)-3=9', pt: [3, 9],
    ck: [{ l: ['y', '9'], r: ['4x-3', '4(3)-3', '9'] }, { l: ['2x+y', '2(3)+9', '15'], r: ['15', null, '15'] }] },
  e4: { label: 'Example 4 check', e: ['x+3y=19', '2x-y=3'], srcEq: 2, lhs: 'y=', rhs: '2x-3', iso: ['-y=-2x+3', 'y=2x-3'], isoCap: `${T('y')} has coefficient ${T('-1')} in Eq. 2. Isolate it: move ${T('2x')} across, then change every sign.`,
    sub: ['x+3', '(2x-3)', '=19'], work: ['x+6x-9=19', '7x=28\\ \\Rightarrow\\ x=4'], back: 'y=2(4)-3=5', pt: [4, 5],
    ck: [{ l: ['x+3y', '4+3(5)', '19'], r: ['19', null, '19'] }, { l: ['2x-y', '2(4)-5', '3'], r: ['3', null, '3'] }] },
  c1: { label: 'Challenge 1 check', e: ['5x-3y=19', '2x+y=12'], srcEq: 2, lhs: 'y=', rhs: '12-2x', iso: ['y=12-2x'], isoCap: `${T('y')} has coefficient ${T('1')} in Eq. 2: subtract ${T('2x')} from both sides, ${T('y=12-2x')}. One step, no fractions.`,
    sub: ['5x-3', '(12-2x)', '=19'], work: ['5x-36+6x=19', '11x=55\\ \\Rightarrow\\ x=5'], back: 'y=12-2(5)=2', pt: [5, 2],
    ck: [{ l: ['5x-3y', '25-6', '19'], r: ['19', null, '19'] }, { l: ['2x+y', '10+2', '12'], r: ['12', null, '12'] }] },
  mB: { label: 'Monster B', e: ['y=2x', 'x+y=12'], srcEq: 1, lhs: 'y=', rhs: '2x', iso: null,
    sub: ['x+', '(2x)', '=12'], work: ['3x=12\\ \\Rightarrow\\ x=4'], back: 'y=2(4)=8', pt: [4, 8],
    ck: [{ l: ['y', '8'], r: ['2x', '2(4)', '8'] }, { l: ['x+y', '4+8', '12'], r: ['12', null, '12'] }] }
};
const subst = {
  title: 'Substitution: isolate, swap in, solve, back-substitute, check',
  height: 520,
  minW: 920,
  choices: [{ v: 'e3', label: SB.e3.label }, { v: 'e4', label: SB.e4.label }, { v: 'c1', label: SB.c1.label }, { sep: 'Warm-up' }, { v: 'mB', label: SB.mB.label }],
  intro: (v) => `${SB[v].label.replace(' check', '')}: solve by substitution. Press <b>Next</b>.`,
  make(stage, v, ex) {
    const d = SB[v], W = ex.W, LW = 500;
    qbar(stage, 12, 6, W - 24, 46, `Solve by substitution: &nbsp;${T(cB(d.e[0]))} &nbsp;and&nbsp; ${T(cA(d.e[1]))}`);
    const P = panel(stage, 12, 62, LW, 450, 'Work', 'u8l8-subpan');
    const srcCol = d.srcEq === 1 ? cB : cA;
    const r1 = line(P, `${tag(1)}${d.srcEq === 1 && !d.iso ? `<span class="u8l8-pc">${T(cB(d.lhs))}</span><span class="u8l8-pc u8l8-src">${T(cB(d.rhs))}</span>` : T(cB(d.e[0]))}`, 'u8l8-big');
    line(P, `${tag(2)}${T(cA(d.e[1]))}`, 'u8l8-big');
    let isoEls = [];
    if (d.iso) isoEls = d.iso.map((s, i) => hide(line(P, i === d.iso.length - 1 ? `<span class="u8l8-ltag">isolate</span><span class="u8l8-pc">${T(srcCol(d.lhs))}</span><span class="u8l8-pc u8l8-src">${T(srcCol(d.rhs))}</span>` : `<span class="u8l8-ltag"></span>${T(s)}`)));
    const srcEl = d.iso ? isoEls[isoEls.length - 1].querySelector('.u8l8-src') : r1.querySelector('.u8l8-src');
    const into = d.srcEq === 1 ? 2 : 1;
    const subL = hide(line(P, `<span class="u8l8-ltag">into Eq. ${into}</span><span class="u8l8-pc">${T(d.sub[0])}</span><span class="u8l8-pc u8l8-dst">${T(srcCol(d.sub[1]))}</span><span class="u8l8-pc">${T(d.sub[2])}</span>`));
    const dst = subL.querySelector('.u8l8-dst');
    const work = d.work.map((s) => hide(line(P, `<span class="u8l8-ltag"></span>${T(s)}`)));
    const back = hide(line(P, `<span class="u8l8-ltag">back</span>${T(d.back)}`));
    const sol = hide(line(P, `<span class="u8l8-ltag">solution</span>${T(cP(`(${d.pt[0]},\\ ${d.pt[1]})`))}`, 'u8l8-big'));
    const CX = 12 + LW + 20, CW = W - CX - 12;
    const k1 = checkCard(stage, { title: 'Check Eq. 1', left: d.ck[0].l, right: d.ck[0].r, ok: true, x: CX, y: 62, width: CW, hidden: true, cls: 'u8l8-ckc u8l8-ckc1' });
    const k2 = checkCard(stage, { title: 'Check Eq. 2', left: d.ck[1].l, right: d.ck[1].r, ok: true, x: CX, y: 290, width: CW, hidden: true, cls: 'u8l8-ckc u8l8-ckc2' });
    hide(k1); hide(k2);
    const steps = [];
    if (d.iso) steps.push({ cap: d.isoCap, run: async (c) => { for (const e of isoEls) await show(c, e); await pulse(c, srcEl, 1.12); } });
    else steps.push({ cap: `<b>Isolate.</b> Eq. 1 is already done: ${T(d.lhs.replace('=', ''))} is alone, ${T(cB(d.lhs + d.rhs))}.`, run: async (c) => { await pulse(c, srcEl, 1.15); srcEl.classList.add('u8l8-srcon'); } });
    steps.push({ cap: `<b>Swap in:</b> replace ${T('y')} in Eq. ${into} with ${T(d.rhs)}. Keep the brackets!`,
      run: async (c) => { subL.style.opacity = 1; dst.style.opacity = 0; await lift(c, stage, srcEl, dst, T(srcCol(d.sub[1]))); dst.style.opacity = 1; await pulse(c, dst, 1.12); } });
    steps.push({ cap: `<b>Solve</b> for ${T('x')}: ${d.work.map((s) => T(s)).join(', ')}.`, run: async (c) => { for (const e of work) await show(c, e); } });
    steps.push({ cap: `<b>Back-substitute</b> into ${T(d.lhs + d.rhs)}: ${T(d.back)}. The solution is ${T(cP(`(${d.pt[0]},\\ ${d.pt[1]})`))}.`, run: async (c) => { await show(c, back); await pop(c, sol); } });
    steps.push({ cap: 'Check in <b>both</b> original equations: both sides come out equal.',
      run: async (c) => { k1.style.opacity = 1; await k1.play(c, 260); k2.style.opacity = 1; await k2.play(c, 260); } });
    return steps;
  }
};

/* =============================== explainer: elimination in columns (Examples 5, 6, Monster C, the Boss) =============================== */
const EL = {
  e5: { label: 'Example 5 check', e: [[3, 2, 18], [1, -2, -2]], mul: [1, 1], op: 'add',
    why: `The ${T('y')}-terms are <b>opposites</b> (${T('+2y')} and ${T('-2y')}): <b>add</b>.`,
    solve: ['4x=16\\ \\Rightarrow\\ x=4'], back: ['\\text{Into Eq. 2: }4-2y=-2', '-2y=-6\\ \\Rightarrow\\ y=3'], pt: [4, 3], checks: ['3(4)+2(3)=12+6=18', '4-2(3)=4-6=-2'] },
  e6: { label: 'Example 6 check', e: [[4, 3, 23], [3, 2, 16]], mul: [2, 3], op: 'sub',
    mulWhy: `Nothing matches yet. Make both ${T('y')}-terms ${T('6y')}: Eq. 1 ${T('\\times2')} and Eq. 2 ${T('\\times3')}. Multiply <b>every</b> term, the constant too.`,
    why: `Now the ${T('y')}-terms <b>match</b> (${T('+6y')} and ${T('+6y')}): same sign, <b>subtract</b>. Every sign in the second row flips.`,
    solve: ['-x=-2\\ \\Rightarrow\\ x=2'], back: ['\\text{Into Eq. 2: }3(2)+2y=16', '2y=10\\ \\Rightarrow\\ y=5'], pt: [2, 5], checks: ['4(2)+3(5)=8+15=23', '3(2)+2(5)=6+10=16'] },
  mC: { label: 'Monster C', e: [[1, 1, 10], [1, -1, 4]], mul: [1, 1], op: 'add',
    why: `The ${T('y')}-terms are <b>opposites</b> (${T('+y')} and ${T('-y')}): <b>add</b>.`,
    solve: ['2x=14\\ \\Rightarrow\\ x=7'], back: ['\\text{Into Eq. 1: }7+y=10', 'y=3'], pt: [7, 3], checks: ['7+3=10', '7-3=4'] },
  boss: { label: 'The Boss', e: [[6, 4, 15], [3, 2, 9]], mul: [1, 2], op: 'sub',
    mulWhy: `Double Eq. 2 so the ${T('x')}-terms match: ${T('3x+2y=9')} becomes ${T('6x+4y=18')}.`,
    why: `Now <b>both</b> columns match: same signs, <b>subtract</b>.`, none: true }
};
const elim = {
  title: 'Elimination: line up the columns, then add or subtract',
  height: 460,
  minW: 920,
  choices: [{ v: 'e5', label: EL.e5.label }, { v: 'e6', label: EL.e6.label }, { sep: 'Warm-up' }, { v: 'mC', label: EL.mC.label }, { v: 'boss', label: EL.boss.label }],
  intro: (v) => `${EL[v].label.replace(' check', '')}: solve by elimination. Press <b>Next</b>.`,
  make(stage, v, ex) {
    const d = EL[v], W = ex.W;
    const t1 = (a, vv) => (a === 0 ? '0' : a === 1 ? vv : a === -1 ? '-' + vv : a + vv);
    const t2 = (a, vv) => (a === 0 ? '0' : (a < 0 ? '-\\,' : '+\\,') + (Math.abs(a) === 1 ? '' : Math.abs(a)) + vv);
    const eqTex = (r) => `${t1(r[0], 'x')}${t2(r[1], 'y').replace('\\,', '')}=${r[2]}`;
    qbar(stage, 12, 6, W - 24, 46, `Solve by elimination: &nbsp;${T(cB(eqTex(d.e[0])))} &nbsp;and&nbsp; ${T(cA(eqTex(d.e[1])))}`);
    const X0 = 116, COLS = [0, 118, 238, 288], Y = [100, 172, 268];
    const cells = (r, y, col) => [t1(r[0], 'x'), t2(r[1], 'y'), '=', String(r[2])].map((t, k) => add(stage, h('div', 'u8l8-piece u8l8-ep', T(col ? col(t) : t)), X0 + COLS[k], y));
    const tagE = (k, y) => add(stage, h('div', 'u8l8-etag', tag(k)), 14, y + 12);
    const A = cells(d.e[0], Y[0], cB), B = cells(d.e[1], Y[1], cA); tagE(1, Y[0]); tagE(2, Y[1]);
    const m1 = d.mul[0], m2 = d.mul[1];
    const E1 = d.e[0].map((x) => x * m1), E2 = d.e[1].map((x) => x * m2);
    const sgn = d.op === 'add' ? 1 : -1, R = [E1[0] + sgn * E2[0], E1[1] + sgn * E2[1], E1[2] + sgn * E2[2]];
    const mulTag = (k, y) => hide(add(stage, h('div', 'u8l8-mul', `×${k}`), X0 + 350, y + 6));
    const mt1 = m1 !== 1 ? mulTag(m1, Y[0]) : null, mt2 = m2 !== 1 ? mulTag(m2, Y[1]) : null;
    const PX = X0 + 420, P = panel(stage, PX, 62, W - PX - 12, 390, 'Steps', 'u8l8-gpan');
    const steps = [{ cap: `Line up the ${T('x')}-terms, the ${T('y')}-terms and the constants in <b>columns</b>.`, run: async (c) => { for (const e of [...A, ...B]) await fadeIn(c, e, 140); } }];
    if (m1 !== 1 || m2 !== 1) steps.push({ cap: d.mulWhy, run: async (c) => {
      if (mt1) { await pop(c, mt1); A.forEach((e, k) => { if (k !== 2) e.innerHTML = T(cB([t1(E1[0], 'x'), t2(E1[1], 'y'), '', String(E1[2])][k])); }); for (const e of A) await pulse(c, e, 1.1, 260); }
      if (mt2) { await pop(c, mt2); B.forEach((e, k) => { if (k !== 2) e.innerHTML = T(cA([t1(E2[0], 'x'), t2(E2[1], 'y'), '', String(E2[2])][k])); }); for (const e of B) await pulse(c, e, 1.1, 260); }
      await say(c, P, `${m1 !== 1 ? `${T(`\\times${m1}`)}: ${T(cB(eqTex(E1)))}<br>` : ''}${m2 !== 1 ? `${T(`\\times${m2}`)}: ${T(cA(eqTex(E2)))}` : ''}`, 'u8l8-small');
    } });
    let rule, opEl;
    steps.push({ cap: d.why, run: async (c) => {
      opEl = add(stage, h('div', 'u8l8-piece u8l8-ep u8l8-op', T(d.op === 'add' ? '+' : '-')), X0 - 48, Y[1]); await pop(c, opEl);
      rule = add(stage, box(h('div', 'u8l8-rule'), 360, null), X0 - 10, Y[2] - 16); await anim(c, rule, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], 400);
      await say(c, P, `<b>${d.op === 'add' ? 'Opposite signs → add' : 'Same signs → subtract'}</b>`);
    } });
    const zeroCols = [0, 1].filter((k) => R[k] === 0);
    const resCells = [R[0] === 0 ? '0' : t1(R[0], 'x'), R[1] === 0 ? '0' : (R[0] === 0 ? t1(R[1], 'y') : t2(R[1], 'y')), '=', String(R[2])];
    steps.push({ cap: d.none ? `Both columns cancel: ${T('0=' + R[2])}. That is <b>false</b>: no pair ${T('(x,\\ y)')} can make it true.`
      : `The ${zeroCols.map((k) => T(k ? 'y' : 'x')).join(' and ')}-terms cancel. What is left: ${T(d.solve[0].split('\\ \\Rightarrow')[0])}.`, run: async (c) => {
      for (const k of zeroCols) for (const e of [A[k], B[k]]) { const s = add(stage, box(h('div', 'u8l8-strike'), 78, null), parseFloat(e.style.left) - 4, parseFloat(e.style.top) + 20); s.style.transform = 'rotate(-14deg)'; await anim(c, s, [{ transform: 'rotate(-14deg) scaleX(0)' }, { transform: 'rotate(-14deg) scaleX(1)' }], 260); }
      const rc = resCells.map((t, k) => { const e = add(stage, h('div', 'u8l8-piece u8l8-ep', T(t)), X0 + COLS[k], Y[2]); if (zeroCols.includes(k)) e.style.color = GRAY; return hide(e); });
      for (const e of rc) await fadeIn(c, e, 200);
      if (d.none) await say(c, P, `${T('0=' + R[2])} <span class="u8l8-bad">✗ false</span>`); else for (const s of d.solve) await say(c, P, T(s));
    } });
    if (d.none) {
      steps.push({ cap: '<b>No solution.</b> The same amount can’t equal two different numbers: the lines are parallel and never meet.', run: async (c) => { const s = stamp(P, 'no solution', { ok: false, size: 'sm' }); s.style.alignSelf = 'center'; await stampIn(c, s); } });
      return steps;
    }
    steps.push({ cap: `<b>Back-substitute</b> to find ${T('y')}: ${d.back.map((s) => T(s)).join(', ')}. The solution is ${T(cP(`(${d.pt[0]},\\ ${d.pt[1]})`))}.`,
      run: async (c) => { for (const s of d.back) await say(c, P, T(s)); await say(c, P, `Solution: ${T(cP(`(${d.pt[0]},\\ ${d.pt[1]})`))}`, 'u8l8-big'); } });
    steps.push({ cap: `Check in <b>both</b> original equations: ${T(cB(d.checks[0]))} ✓ and ${T(cA(d.checks[1]))} ✓.`,
      run: async (c) => { await say(c, P, `<span class="u8l8-good">${T(d.checks[0])} ✓</span>`, 'u8l8-small'); await say(c, P, `<span class="u8l8-good">${T(d.checks[1])} ✓</span>`, 'u8l8-small'); } });
    return steps;
  }
};

/* =============================== explainer: the four stages (from Lesson 7) =============================== */
const parseStory = (s) => s.replace(/\[\[([\w ]+)\|([^\]]+)\]\]/g, (m, k, t) => `<span class="u8l8-phr" data-k="${k}">${t}</span>`);
const spans = (root, k) => [...root.querySelectorAll(`[data-k~="${k}"]`)];
const HL = { q: 'u8l8-hq', u1: 'u8l8-hu', u2: 'u8l8-hu', f1: 'u8l8-h1', f2: 'u8l8-h2' };
const hl = (root, k) => { const l = spans(root, k); l.forEach((e) => e.classList.add(HL[k])); return l; };
const live = (p) => { p.classList.remove('u8l8-idle'); p.classList.add('u8l8-live'); };
function rel(stage, el) {
  const s = stage.getBoundingClientRect(), r = el.getBoundingClientRect(), k = s.width / (stage.offsetWidth || s.width) || 1;
  return { x: (r.left - s.left) / k - stage.clientLeft, y: (r.top - s.top) / k - stage.clientTop, w: r.width / k, h: r.height / k };
}
async function fly(c, stage, froms, to, o = {}) {
  if (c.fast || !to || !froms.length) return;
  const t = rel(stage, to), jobs = [];
  froms.forEach((f, i) => {
    const r = rel(stage, f);
    const g = add(stage, h('div', 'u8l8-ghost', o.html || f.innerHTML), r.x, r.y);
    if (o.color) g.style.setProperty('--gc', o.color);
    const gw = g.offsetWidth, gh = g.offsetHeight;
    const dx = t.x + t.w / 2 - gw / 2 - r.x, dy = t.y + t.h / 2 - gh / 2 - r.y;
    jobs.push(c.anim(g, [{ transform: 'translate(0px,0px)', opacity: 1 }, { transform: `translate(${dx}px,${dy}px)`, opacity: 0.9, offset: 0.8 }, { transform: `translate(${dx}px,${dy}px)`, opacity: 0 }], o.ms || 800, { delay: i * 90 }).then(() => g.remove()));
  });
  await Promise.all(jobs);
}
const ppanel = (stage, x, y, w, hh, title, cls = '') => { const p = add(stage, box(h('div', 'u8l8-ppanel ' + cls), w, hh), x, y); if (title) p.appendChild(h('div', 'u8l8-pph', title)); return p; };
const PIPE = {
  ex7: {
    label: 'Example 7',
    story: 'A youth soccer tournament sold [[f1|150 tickets]], some at [[u1 f2|the student price of $6]] and some at [[u2 f2|the adult price of $10]]. [[f2|Total ticket sales were $1 220.]] [[q|How many of each were sold?]]',
    lets: [['x', 'the number of student tickets'], ['y', 'the number of adult tickets']], letNote: 'Both count tickets.',
    table: { mode: 'sum', cols: ['Student', 'Adult'], rows: [['Count', 'x', 'y', '150'], ['Value ($)', '6x', '10y', '1\\,220']] },
    f1cap: 'First fact: <b>150 tickets</b>. The <b>count</b> row: each ticket counts as 1.',
    f2cap: 'Second fact: <b>$1 220</b>. The <b>value</b> row: x tickets at $6 bring in 6x dollars, y tickets at $10 bring in 10y.',
    eqs: ['x+y=150', '6x+10y=1\\,220'],
    solve: [
      { cap: '<b>Stage 3.</b> Eq. 1 has coefficients of 1, so use <b>substitution</b>: y = 150 − x.', note: 'Substitution: y = 150 − x', lines: ['\\B{y=150-x}', '6x+10(\\B{150-x})=1\\,220'] },
      { cap: 'Expand and collect the x-terms. Watch the negatives: 6x − 10x = −4x.', lines: ['6x+1\\,500-10x=1\\,220', '-4x=-280\\ \\Rightarrow\\ x=70'] },
      { cap: 'Back into y = 150 − x: y = 150 − 70 = 80.', lines: ['y=150-70=80'], sol: 'x=70,\\ y=80' }
    ],
    checks: [{ k: 'f1', w: '150 tickets', t: '70+80=150' }, { k: 'f2', w: '$1 220', t: '6(70)+10(80)=420+800=1\\,220' }],
    sense: 'Counts of tickets are whole, positive numbers',
    answer: '<b>70 student tickets</b> and <b>80 adult tickets</b> were sold.'
  },
  ch2: {
    label: 'Challenge 2',
    story: 'A [[u1 u2|rectangular deck]] has a [[f1|perimeter of 60 m]]. Its [[u1 f2|length]] [[f2|is 6 m more than twice]] [[u2 f2|its width]]. [[q|Find the length and width of the deck.]]',
    lets: [['L', 'the length of the deck, in metres'], ['W', 'the width of the deck, in metres']],
    table: { mode: 'facts', rows: [['Perimeter is 60 m: two lengths and two widths', '2L+2W=60'], ['Length is 6 m more than twice the width', 'L=2W+6']] },
    f1cap: 'First fact: the <b>perimeter</b>, all the way around. Two lengths and two widths make 60 m.',
    f2cap: 'Second fact: “6 m more than twice the width” is 2W + 6. The 6 is added <b>after</b>.',
    eqcap: 'Each row of the table is already an equation.',
    eqs: ['2L+2W=60', 'L=2W+6'],
    solve: [
      { cap: '<b>Stage 3.</b> Eq. 2 already says what L equals: <b>substitute</b> it into Eq. 1.', note: 'Substitution: L is isolated in Eq. 2', lines: ['2(\\A{2W+6})+2W=60', '4W+12+2W=60'] },
      { cap: 'Collect: 6W + 12 = 60, so 6W = 48 and W = 8.', lines: ['6W=48\\ \\Rightarrow\\ W=8'] },
      { cap: 'Back into Eq. 2: L = 2(8) + 6 = 22.', lines: ['L=2(8)+6=22'], sol: 'L=22,\\ W=8' }
    ],
    checks: [{ k: 'f1', w: 'perimeter 60 m', t: '2(22)+2(8)=44+16=60' }, { k: 'f2', w: '6 m more than twice', t: '2(8)+6=22' }],
    sense: 'Both lengths are positive',
    answer: 'The deck is <b>22 m long</b> and <b>8 m wide</b>.'
  }
};
function pipeDef(keys) {
  return {
    title: 'Four stages: words → let → facts → equations → solve → check',
    height: 528,
    minW: 960,
    choices: keys.map((k) => ({ v: k, label: PIPE[k].label })),
    intro: (k) => `${PIPE[k].label}: read the problem first. Press <b>Next</b> to send it through the four stages.`,
    make(stage, k, ex) {
      const d = PIPE[k], W = ex.W, LW = Math.round(W * 0.465), RX = LW + 24, RW = W - RX - 12;
      const sp = ppanel(stage, 12, 8, LW, 192, 'The problem');
      const sb = h('div', 'u8l8-story', parseStory(d.story)); sp.appendChild(sb);
      const letP = ppanel(stage, 12, 208, LW, 86, 'Stage 1 · Define' + (d.letNote ? ` <i class="u8l8-phn">${d.letNote}</i>` : ''), 'u8l8-idle');
      const lets = d.lets.map(([vv, txt]) => { const e = h('div', 'u8l8-let', `Let ${TC(vv)} be ${txt}`); letP.appendChild(e); fit(e, LW - 26); return e; });
      const letNote = letP.querySelector('.u8l8-phn');
      lets.forEach(hide); hide(letNote);
      const ckP = ppanel(stage, 12, 302, LW, 218, 'Stage 4 · Answer and check', 'u8l8-idle');
      const ckRows = d.checks.map((q, i) => { const r = h('div', 'u8l8-ck', `<span class="u8l8-ckm u8l8-c${i + 1}">✓</span><div><div class="u8l8-ckw">${q.w}</div><div class="u8l8-ckt">${TC(q.t)}</div></div>`); ckP.appendChild(r); fit(r.querySelector('.u8l8-ckt'), LW - 60); return hide(r); });
      const senseR = hide(add(ckP, h('div', 'u8l8-ck u8l8-sense', `<span class="u8l8-ckm">✓</span><div>${d.sense}</div>`)));
      const ansR = hide(add(ckP, h('div', 'u8l8-answer', d.answer)));
      const tabP = ppanel(stage, RX, 8, RW, 160, 'Stage 2 · The two facts', 'u8l8-idle');
      const tb = h('div', 'u8l8-tab u8l8-' + d.table.mode); tabP.appendChild(tb);
      let head, rows; const ops = [];
      if (d.table.mode === 'sum') {
        head = h('div', 'u8l8-tr u8l8-thead', `<div class="u8l8-tl"></div><div class="u8l8-tc">${d.table.cols[0]}</div><div class="u8l8-to"></div><div class="u8l8-tc">${d.table.cols[1]}</div><div class="u8l8-to"></div><div class="u8l8-tc">Total</div>`);
        tb.appendChild(head);
        rows = d.table.rows.map((r, i) => { const row = h('div', `u8l8-tr u8l8-r${i + 1}`, `<div class="u8l8-tl">${r[0]}</div><div class="u8l8-tc">${TC(r[1])}</div><div class="u8l8-to">${TC('+')}</div><div class="u8l8-tc">${TC(r[2])}</div><div class="u8l8-to">${TC('=')}</div><div class="u8l8-tc">${TC(r[3])}</div>`); tb.appendChild(row); ops.push(...row.querySelectorAll('.u8l8-to')); return row; });
      } else {
        head = h('div', 'u8l8-tr u8l8-thead', '<div class="u8l8-tw">The words</div><div class="u8l8-ts">In symbols</div>');
        tb.appendChild(head);
        rows = d.table.rows.map((r, i) => { const row = h('div', `u8l8-tr u8l8-r${i + 1}`, `<div class="u8l8-tw">${r[0]}</div><div class="u8l8-ts">${TC(r[1])}</div>`); tb.appendChild(row); return row; });
      }
      hide(head); rows.forEach((r) => [...r.children].forEach(hide)); ops.forEach(hide);
      const eqP = ppanel(stage, RX, 174, RW, 88, 'Stage 2 · Two equations', 'u8l8-idle');
      const eqs = d.eqs.map((e, i) => { const r = h('div', 'u8l8-eq', `<span class="u8l8-tag u8l8-t${i + 1}">Eq. ${i + 1}</span>${TC(`\\${i ? 'A' : 'B'}{${e}}`)}`); eqP.appendChild(r); fit(r, RW - 26); return hide(r); });
      const svP = ppanel(stage, RX, 270, RW, 250, 'Stage 3 · Solve', 'u8l8-idle');
      const groups = d.solve.map((s) => {
        const els = [];
        if (s.note) els.push(h('div', 'u8l8-snote', s.note));
        s.lines.forEach((L) => els.push(h('div', 'u8l8-sl', TC(L))));
        if (s.sol) els.push(h('div', 'u8l8-sol', TC(`\\P{${s.sol}}`)));
        els.forEach((e) => { svP.appendChild(e); fit(e, RW - 26); hide(e); });
        return els;
      });
      const kU = ['u1', 'u2'];
      const steps = [
        { cap: '<b>Stage 1.</b> What does the question ask for? Those are the two <b>unknowns</b>.', run: async (c) => { live(letP); hl(sb, 'q'); kU.forEach((u) => hl(sb, u)); await pulse(c, sb, 1.02); } },
        { cap: `Give each unknown a letter and say exactly what it counts${d.letNote ? '' : ', with units'}.`, run: async (c) => {
          for (let i = 0; i < 2; i++) { await fly(c, stage, spans(sb, kU[i]), lets[i], { color: TEAL }); await show(c, lets[i]); }
          if (letNote) await show(c, letNote);
        } },
        { cap: `<b>Stage 2.</b> ${d.f1cap}`, run: async (c) => {
          live(tabP); await show(c, head, 250);
          const f = hl(sb, 'f1'); await fly(c, stage, f, rows[0], { color: BLUE });
          for (const e of rows[0].children) if (!e.classList.contains('u8l8-to')) await show(c, e, 200);
        } },
        { cap: d.f2cap, run: async (c) => {
          const f = hl(sb, 'f2'); await fly(c, stage, f, rows[1], { color: AMB });
          for (const e of rows[1].children) if (!e.classList.contains('u8l8-to')) await show(c, e, 200);
        } },
        { cap: d.eqcap || 'Each row becomes an equation: <b>part + part = total</b>.', run: async (c) => {
          live(eqP);
          for (const o2 of ops) await pop(c, o2, 200);
          for (let i = 0; i < 2; i++) { await fly(c, stage, [rows[i]], eqs[i], { html: TC(d.table.mode === 'sum' ? d.eqs[i] : d.table.rows[i][1]), color: i ? AMB : BLUE }); await show(c, eqs[i]); }
        } }
      ];
      d.solve.forEach((s, i) => steps.push({ cap: s.cap, run: async (c) => { live(svP); for (const e of groups[i]) await (e.classList.contains('u8l8-sol') ? pop(c, e) : show(c, e, 280)); } }));
      steps.push({ cap: '<b>Stage 4.</b> Check against the <b>story</b>, not just the equations: does each fact come true?', run: async (c) => {
        live(ckP);
        for (let i = 0; i < d.checks.length; i++) {
          const f = spans(sb, d.checks[i].k); f.forEach((e) => e.classList.add('u8l8-flash'));
          await Promise.all(f.map((e) => pulse(c, e, 1.08, 420))); await show(c, ckRows[i]);
        }
      } });
      steps.push({ cap: `Does it make sense? ${d.sense}. Then answer the question <b>in a sentence</b>.`, run: async (c) => { await show(c, senseR); await pop(c, ansR, 420); } });
      return steps;
    }
  };
}

/* =============================== explainer: Challenge 2 — unroll the fence =============================== */
const fence = {
  title: 'Perimeter: walk around the deck, then count the W-blocks',
  height: 510,
  minW: 900,
  intro: 'A rectangular deck: perimeter 60 m, length 6 m more than twice the width. Press <b>Next</b>.',
  make(stage, _v, ex) {
    const W = ex.W, Wm = 8, Lm = 22, P = 60;
    qbar(stage, 12, 6, W - 24, 46, 'A rectangular deck has a perimeter of <b>60 m</b>. Its length is <b>6 m more than twice</b> its width. Find the length and width.');
    const svg = svgEl('svg', { width: W, height: 510, viewBox: `0 0 ${W} 510`, class: 'u8l8-fsvg' }); stage.insertBefore(svg, stage.firstChild);
    const s = 15, X0 = 50, Y0 = 96, RW = Lm * s, RH = Wm * s;
    const C = [[X0, Y0], [X0 + RW, Y0], [X0 + RW, Y0 + RH], [X0, Y0 + RH]];
    svgEl('rect', { x: X0, y: Y0, width: RW, height: RH, fill: '#f3e6d2', stroke: 'none' }, svg);
    for (let i = 1; i < 8; i++) svgEl('line', { x1: X0, y1: Y0 + i * RH / 8, x2: X0 + RW, y2: Y0 + i * RH / 8, stroke: '#dcc6a3', 'stroke-width': 1.5 }, svg);
    const sides = [0, 1, 2, 3].map((i) => { const p = svgEl('path', { d: `M${C[i][0]} ${C[i][1]} L${C[(i + 1) % 4][0]} ${C[(i + 1) % 4][1]}`, stroke: '#6b4a2a', 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round', class: 'bk-stroke' }, svg); p.style.opacity = 0; return p; });
    const lab = (x, y, t) => { const e = add(stage, h('div', 'u8l8-rlab', T(t)), x, y); e.style.translate = '-50% -50%'; return hide(e); };
    const labs = [lab(X0 + RW / 2, Y0 - 16, 'L'), lab(X0 + RW + 22, Y0 + RH / 2, 'W'), lab(X0 + RW / 2, Y0 + RH + 18, 'L'), lab(X0 - 22, Y0 + RH / 2, 'W')];
    const walker = svgEl('circle', { cx: X0, cy: Y0, r: 9, fill: BLUE, opacity: 0 }, svg);
    const per = 2 * (RW + RH);
    const walkTo = (t) => { let dd = t * per; const L = [RW, RH, RW, RH]; for (let i = 0; i < 4; i++) { if (dd <= L[i] || i === 3) { const a = C[i], b = C[(i + 1) % 4], u = Math.min(1, dd / L[i]); walker.setAttribute('cx', a[0] + (b[0] - a[0]) * u); walker.setAttribute('cy', a[1] + (b[1] - a[1]) * u); return; } dd -= L[i]; } };
    /* the length cut into W, W, 6 (inside the top edge) */
    const pg = svgEl('g', { opacity: 0 }, svg), pieceLabs = [];
    [[0, Wm, 'W'], [Wm, Wm, 'W'], [2 * Wm, 6, '6']].forEach(([x, wd, t]) => {
      svgEl('rect', { x: X0 + x * s + 1, y: Y0 + 4, width: wd * s - 2, height: 28, rx: 5, fill: t === 'W' ? '#e3f3f1' : '#fff4dd', stroke: t === 'W' ? TEAL : AMB, 'stroke-width': 2 }, pg);
      const e = add(stage, h('div', 'u8l8-plab', T(t)), X0 + (x + wd / 2) * s, Y0 + 18); e.style.translate = '-50% -50%'; e.dataset.t = t; pieceLabs.push(hide(e));
    });
    /* equations on the right */
    const EX = X0 + RW + 60, ep = panel(stage, EX, 62, W - EX - 12, 296, 'Equations');
    const L_ = (t) => hide(line(ep, T(t), 'u8l8-big'));
    const eWalk = L_('L+W+L+W=60'), e1 = L_(cB('2L+2W=60')), e2 = L_(cA('L=2W+6')), eSub = L_('2(2W+6)+2W=60'), eSimp = L_('6W+12=60'), eW = L_('6W=48\\ \\Rightarrow\\ W=8'), eL = L_('L=2(8)+6=22');
    /* the whole fence unrolled into one strip: L (W W 6), W, L (W W 6), W */
    const SY = 404, S2 = (W - 100) / P, SX = 50, segs = [];
    let sx = SX;
    [['W', 'L'], ['W', 'L'], ['6', 'L'], ['W', 'W'], ['W', 'L'], ['W', 'L'], ['6', 'L'], ['W', 'W']].forEach(([t, side]) => {
      const wd = (t === 'W' ? Wm : 6) * S2;
      const r = svgEl('rect', { x: sx + 1, y: SY, width: wd - 2, height: 46, rx: 7, fill: t === 'W' ? '#e3f3f1' : '#fff4dd', stroke: t === 'W' ? TEAL : AMB, 'stroke-width': 2.5, opacity: 0 }, svg);
      const e = add(stage, h('div', 'u8l8-slab', T(t)), sx + wd / 2, SY + 23); e.style.translate = '-50% -50%'; hide(e);
      segs.push({ r, e, t, side, x: sx, wd }); sx += wd;
    });
    const groupLab = []; let gx = SX;
    [['L', 22], ['W', 8], ['L', 22], ['W', 8]].forEach(([t, m], i) => {
      const wd = m * S2, col = t === 'L' ? AMB : TEAL;
      const g = svgEl('path', { d: `M${gx + 3} ${SY - 8} v-8 H${gx + wd - 3} v8`, fill: 'none', stroke: col, 'stroke-width': 2.5, opacity: 0 }, svg);
      const e = add(stage, h('div', 'u8l8-glab', T(t)), gx + wd / 2, SY - 30); e.style.translate = '-50% -50%'; hide(e);
      groupLab.push({ g, e }); gx += wd; void i;
    });
    const tot = add(stage, h('div', 'u8l8-ftot', ''), W / 2, SY + 78); tot.style.translate = '-50% -50%'; hide(tot);
    return [
      { cap: 'A rectangle has <b>two lengths</b> and <b>two widths</b>. Walk all the way around: that is the perimeter.', run: async (c) => {
        for (const p of sides) { p.style.opacity = 1; await drawIn(p, 240, c); } for (const e of labs) await pop(c, e, 200);
        walker.setAttribute('opacity', 1); await tween(c, 1800, (t) => walkTo(t), (t) => t); walker.setAttribute('opacity', 0);
        await show(c, eWalk);
      } },
      { cap: `${T('L+W+L+W=60')}, or ${T(cB('2L+2W=60'))} (Eq. 1). Not ${T('L+W=60')}: that is only half way round.`, run: async (c) => { await show(c, e1); } },
      { cap: `“6 m more than twice the width”: cut the length into <b>two W-blocks and a 6</b>. ${T(cA('L=2W+6'))} (Eq. 2).`, run: async (c) => {
        await appear(c, pg, 300); for (const e of pieceLabs) await pop(c, e, 200); await show(c, e2);
      } },
      { cap: `Substitute: unroll the whole fence into one strip. Each ${T('L')} is ${T('W')}, ${T('W')}, ${T('6')}: ${T('2(2W+6)+2W=60')}.`, run: async (c) => {
        for (const sg of segs) { sg.r.setAttribute('opacity', 1); await pop(c, sg.e, 160); }
        for (const g of groupLab) { g.g.setAttribute('opacity', 1); await show(c, g.e, 160); }
        await show(c, eSub);
      } },
      { cap: `Count: <b>6 W-blocks</b> and two 6’s, ${T('6W+12=60')}. Take away the 12: ${T('6W=48')}, so each block is ${T('W=8')}.`, run: async (c) => {
        await show(c, eSimp);
        for (const sg of segs) if (sg.t === '6') { await anim(c, sg.r, [{ opacity: 1 }, { opacity: 0.3 }], 300); sg.e.style.opacity = 0.35; }
        tot.innerHTML = `${T('60-12=48')} for 6 blocks: ${T('48\\div6=8')}`; await show(c, tot);
        for (const sg of segs) if (sg.t === 'W') sg.e.innerHTML = T('8');
        pieceLabs.forEach((e) => { if (e.dataset.t === 'W') e.innerHTML = T('8'); });
        await show(c, eW);
      } },
      { cap: `${T('L=2(8)+6=22')}. Check: ${T('2(22)+2(8)=44+16=60')} ✓ and ${T('22=2(8)+6')} ✓. The deck is <b>22 m by 8 m</b>.`, run: async (c) => {
        await show(c, eL);
        labs[0].innerHTML = labs[2].innerHTML = T('22\\text{ m}'); labs[1].innerHTML = labs[3].innerHTML = T('8\\text{ m}');
        for (const e of labs) await pulse(c, e, 1.15, 260);
        const st = stamp(stage, '✓ 22 m by 8 m', { ok: true, x: X0 + RW / 2, y: Y0 + RH / 2 + 14 }); await stampIn(c, st);
      } }
    ];
  }
};

/* =============================== mount =============================== */
mountWarm();
export const explainers = mountExplainers({ methods, choose, howMany, graphChk, classify, subst, elim, pipeline: pipeDef(['ex7', 'ch2']), fence });
export const _test = { SYS, HM, GC, CL, SB, EL, PIPE };

/* ============ Stand Up Break! — Unit 8 review (lessons/js/standup.js) ============
 * Beginning: classify a system by its slopes and intercepts, or substitute when y is already alone.
 * Progressing: elimination when one variable's coefficients match or are opposites, or substitution after isolating a
 *   variable with coefficient 1 or −1.
 * Mastery: multiply one equation first, then eliminate; or a count-and-value word problem.
 * Every system is built from its integer solution. The key shows the method, the key steps and the solution. */
{
  const Pp = (x, y) => `\\textcolor{${PUR}}{(${x},\\ ${y})}`;
  const W = (s) => `\\text{${s}}`;
  const sysT = (s1, s2) => { const sp = (s, col) => { const i = s.indexOf('='); return `\\textcolor{${col}}{${s.slice(0, i)}}&\\textcolor{${col}}{${s.slice(i)}}`; }; return `\\begin{aligned}${sp(s1, BLUE)}\\\\${sp(s2, AMBT)}\\end{aligned}`; };
  const t1 = (a, v) => (a === 1 ? v : a === -1 ? '-' + v : a + v);
  const t2 = (a, v) => (a < 0 ? '-' : '+') + (Math.abs(a) === 1 ? '' : Math.abs(a)) + v;
  const std = (a, b, c) => `${t1(a, 'x')}${t2(b, 'y')}=${c}`;
  const yform = (m, b) => slopeTex(m, b);
  const par = (v) => (v < 0 ? `(${v})` : String(v));
  const coefX = (a, v) => (a === 1 ? par(v) : a === -1 ? '-' + par(v) : `${a}(${v})`);
  const nz = (r, a, b) => { let v; do v = r.int(a, b); while (v === 0); return v; };

  function beg(r) {
    if (r.chance(0.4)) {
      const kind = r.pick(['one', 'none', 'inf']), m = nz(r, -5, 5), b = r.int(-9, 9);
      let m2 = m, b2 = b;
      if (kind === 'one') do m2 = nz(r, -5, 5); while (m2 === m);
      if (kind === 'none') do b2 = r.int(-9, 9); while (b2 === b);
      if (kind === 'one') b2 = r.int(-9, 9);
      const why = kind === 'one' ? `${W('slopes ')}${m}${W(' and ')}${m2}${W(' differ: one solution')}` : kind === 'none' ? `${W('same slope ')}${m}${W(', intercepts ')}${b}${W(' and ')}${b2}${W(': no solution (parallel)')}` : `${W('same slope ')}${m}${W(' and same intercept ')}${b}${W(': infinitely many')}`;
      return { text: 'Without graphing: one solution, no solution, or infinitely many?', q: `\\begin{aligned}${yform(m, b)}\\\\${yform(m2, b2)}\\end{aligned}`, a: [why] };
    }
    for (;;) {
      const x = r.int(-4, 6), y = r.int(-4, 9), m = nz(r, -4, 4), b = y - m * x, a = r.int(1, 4), bb = r.pick([1, 2, 3]);
      if (a + bb * m === 0 || Math.abs(b) > 12) continue;
      const c = a * x + bb * y;
      const sub = `${t1(a, 'x')}${bb === 1 ? '+' : '+' + bb}(${yform(m, b).slice(2)})=${c}`;
      const k = a + bb * m, kc = bb * b;
      return { text: 'Solve by substitution.', q: sysT(yform(m, b), std(a, bb, c)),
        a: [sub, `${t1(k, 'x')}${kc === 0 ? '' : kc < 0 ? kc : '+' + kc}=${c}\\ \\Rightarrow\\ x=${x}`, `y=${coefX(m, x)}${b === 0 ? '' : b < 0 ? b : '+' + b}=${y}`, `${W('Solution: ')}${Pp(x, y)}`] };
    }
  }

  function prg(r) {
    for (;;) {
      const x = r.int(-5, 7), y = r.int(-5, 7);
      if (r.chance(0.6)) { // matching or opposite coefficients
        const a1 = nz(r, -5, 6), b1 = r.int(2, 6), opp = r.chance(0.5), a2 = nz(r, -5, 6), b2 = opp ? -b1 : b1;
        if (a1 === a2 || (opp ? a1 + a2 : a1 - a2) === 0) continue;
        const c1 = a1 * x + b1 * y, c2 = a2 * x + b2 * y, k = opp ? a1 + a2 : a1 - a2, kc = opp ? c1 + c2 : c1 - c2;
        return { text: 'Solve by elimination.', q: sysT(std(a1, b1, c1), std(a2, b2, c2)),
          a: [`${W(opp ? 'Opposite y-terms: add. ' : 'Matching y-terms: subtract. ')}${t1(k, 'x')}=${kc}\\ \\Rightarrow\\ x=${x}`, `${coefX(a1, x)}${t2(b1, 'y')}=${c1}\\ \\Rightarrow\\ y=${y}`, `${W('Solution: ')}${Pp(x, y)}`] };
      }
      // isolate a variable with coefficient 1 or -1, then substitute
      const a1 = nz(r, -4, 5), s = r.pick([1, -1]), a2 = r.int(1, 4), b2 = nz(r, -4, 4);
      const c1 = a1 * x + s * y, c2 = a2 * x + b2 * y;
      const isoB = s * c1, isoM = -s * a1; // a1 x + s y = c1  →  y = isoM x + isoB
      if (a2 + b2 * isoM === 0) continue;
      return { text: 'Solve by substitution: isolate a variable first.', q: sysT(std(a1, s, c1), std(a2, b2, c2)),
        a: [`${W('Isolate: ')}${yform(isoM, isoB)}`, `${t1(a2, 'x')}${b2 < 0 ? '-' : '+'}${Math.abs(b2) === 1 ? '' : Math.abs(b2)}(${yform(isoM, isoB).slice(2)})=${c2}\\ \\Rightarrow\\ x=${x}`, `y=${y}`, `${W('Solution: ')}${Pp(x, y)}`] };
    }
  }

  const TICK = [['concert', 'student', 'adult', 's', 'a'], ['hockey game', 'child', 'adult', 'c', 'a'], ['school play', 'student', 'general', 's', 'g'], ['fun fair', 'kid', 'adult', 'k', 'a']];
  function mas(r) {
    for (;;) {
      if (r.chance(0.4)) { // word problem: count and value
        const [ev, w1, w2, p, q] = r.pick(TICK), lo = r.int(2, 6), hi = lo + r.int(1, 5), np = r.int(5, 40), nq = r.int(5, 40), N = np + nq, V = lo * np + hi * nq;
        if (np === nq) continue;
        return { text: `The ${ev} sold ${N} tickets: ${w1} tickets at $${lo} and ${w2} tickets at $${hi}. Ticket sales were $${V}. How many of each kind were sold?`, q: '',
          atext: `Let <i>${p}</i> be the number of ${w1} tickets and <i>${q}</i> the number of ${w2} tickets.`,
          a: [sysT(`${p}+${q}=${N}`, `${lo}${p}+${hi}${q}=${V}`), `${lo}\\times${W('Eq. 1, subtract: ')}${hi - lo === 1 ? '' : hi - lo}${q}=${V - lo * N}\\ \\Rightarrow\\ ${q}=${nq}`, `${p}=${N}-${nq}=${np}`, `\\textcolor{${PUR}}{${np}}${W(` ${w1} and `)}\\textcolor{${PUR}}{${nq}}${W(` ${w2} tickets`)}`] };
      }
      const x = r.int(-4, 6), y = r.int(-4, 6);
      // multiply one equation: b2 = k * b1 (match after multiplying Eq. 1 by k), signs may be opposite
      const b1 = nz(r, -3, 3), kk = r.pick([2, 3, 4]), sg = r.pick([1, -1]), b2 = sg * kk * b1, a1 = nz(r, -4, 5), a2 = nz(r, -5, 6);
      const A1 = a1 * kk, k = sg > 0 ? a2 - A1 : a2 + A1;
      if (k === 0 || Math.abs(b1) === 1 && Math.abs(a1) === 1) continue;
      const c1 = a1 * x + b1 * y, c2 = a2 * x + b2 * y, C1 = c1 * kk, kc = sg > 0 ? c2 - C1 : c2 + C1;
      return { text: 'Solve by elimination: multiply one equation first.', q: sysT(std(a1, b1, c1), std(a2, b2, c2)),
        a: [`${kk}\\times${W('Eq. 1: ')}${std(A1, b1 * kk, C1)}`, `${W(sg > 0 ? 'Subtract: ' : 'Add: ')}${t1(k, 'x')}=${kc}\\ \\Rightarrow\\ x=${x}`, `y=${y}`, `${W('Solution: ')}${Pp(x, y)}`] };
    }
  }
  standup('u8l8', {
    intro: 'Pick your power-up at your whiteboard: graph, swap in, or wipe out. Check your answer in both equations.',
    levels: { BEG: beg, PRG: prg, MAS: mas }
  });
}
