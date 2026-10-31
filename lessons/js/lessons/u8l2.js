/* Math 15 · Unit 8 · Lesson 2 — Classifying Systems: One Solution, No Solution, or Infinite Solutions.
 * (The Math 10C twin is u8/l1, sections 5–6; turnSlide, count and classify are adapted from it.)
 * Warm-up "Will the Trains Meet?" (three track maps; Map C's sticky note lifts to draw the plans), the example grids (the
 * answer lines appear on the same grid when the part is shown), and the explainers:
 *   gap       (step along x and watch the vertical gap: different slopes → the gap closes once, then grows (Map A);
 *              same slope → the gap never changes (Map B); mounted twice, starting on Map A and on Map B),
 *   count     (Examples 1–3 check: graph both lines from b and the slope, then count the shared points; mounted three
 *              times, one per example),
 *   zoom      (different slopes that look parallel on the grid: the gap shrinks a little each step, then zoom out to the
 *              crossing),
 *   disguise  (the same line in disguise: Example 3's ×2, Map C's −2y, and a look-alike that is really parallel),
 *   turnSlide (the star: the amber line turns until it is parallel, then slides until it lies on top, with the count,
 *              the slope / intercept comparison and the three cases lighting up live; free play),
 *   classify  (Example 5 check and the warm-up maps with a two-question flowchart).
 * Colours (as in the 10C twin): line / equation 1 blue, line / equation 2 amber, a solution purple; the warm-up keeps the
 * board's red and blue trains. */
import {
  h, tex, add, box, place, Graph, Flowchart, stamp, stampIn, mountExplainers, pop, fadeIn, sleep, tween, pulse,
  pairTex, texNum, svgEl, liveCtx, COLORS
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(String(s));
const BLUE = COLORS.blue, AMB = COLORS.amber, PUR = COLORS.purple, RED = COLORS.red, SL = COLORS.slate;
const k1 = (s) => `\\textcolor{${BLUE}}{${s}}`, k2 = (s) => `\\textcolor{${AMB}}{${s}}`, kp = (s) => `\\textcolor{${PUR}}{${s}}`;
const kr = (s) => `\\textcolor{${RED}}{${s}}`;
const kc = (col) => (col === AMB ? k2 : col === RED ? kr : col === PUR ? kp : k1);
const panel = (stage, x, y, w, hh, title, cls = '') => add(stage, box(h('div', 'u8l2-panel ' + cls, title ? `<div class="u8l2-ph">${title}</div>` : ''), w, hh), x, y);
const line = (P, html, cls = '') => { const d = h('div', 'u8l2-line ' + cls, html); P.appendChild(d); return d; };
const show = (c, el) => fadeIn(c, el, 320);
const say = async (c, P, html, cls) => { const d = line(P, html, cls); await show(c, d); return d; };
const pt = (x, y) => pairTex(x, y);
const hideAll = (...els) => els.flat().forEach((e) => { if (e) e.style.opacity = 0; });
const put = (el, html) => { if (el._h !== html) { el._h = html; el.innerHTML = html; } };
const d2 = (v) => texNum(v, 2);
const KIND = {
  one: { n: '1', word: 'one solution', cls: 'u8l2-k-one' },
  none: { n: '0', word: 'no solution', cls: 'u8l2-k-none' },
  inf: { n: T('\\infty'), word: 'infinitely many', cls: 'u8l2-k-inf' }
};
const verdict = (host, kind, extra = '') => {
  const k = KIND[kind], v = h('div', 'u8l2-verdict ' + k.cls, `<span class="u8l2-vn">${k.n}</span><span class="u8l2-vw">${k.word}${extra}</span>`);
  host.appendChild(v); v.style.opacity = 0; return v;
};
/** "y = mx + b" as TeX from whole numbers */
const mbT = (m, b) => 'y=' + (m === 0 ? '' : (m === -1 ? '-' : m === 1 ? '' : texNum(m)) + 'x') + (b ? (b < 0 ? '-' : m === 0 ? '' : '+') + texNum(Math.abs(b)) : m === 0 ? '0' : '');
const stepWords = (m) => `${m < 0 ? 'down' : 'up'} ${Math.abs(m)}, right 1`;

/** plot y = m x + b the way the booklet says it: the y-intercept, then (rise, then run) steps, then the whole line */
async function plotLine(G, c, m, b, color, o = {}) {
  const n = o.steps == null ? 2 : o.steps, run = 1, rise = m, keep = [];
  const P0 = G.point(0, b, { color, r: 7 }); await pop(c, P0, 300); keep.push(P0);
  let x = 0, y = b; const tmp = [];
  for (let i = 0; i < n; i++) {
    const s1 = G.segment([x, y], [x, y + rise], { color, width: 3, dash: true }); await G.drawIn(s1, 240, c);
    const s2 = G.segment([x, y + rise], [x + run, y + rise], { color, width: 3, dash: true }); await G.drawIn(s2, 240, c);
    x += run; y += rise; tmp.push(s1, s2);
    const p = G.point(x, y, { color, r: 6 }); await pop(c, p, 200); keep.push(p);
  }
  const L = G.line({ m, b }, { color, width: o.width || 4, dash: o.dash });
  if (!o.top) G.layers.data.insertBefore(L, G.layers.data.firstChild);
  await G.drawIn(L, 650, c);
  G.remove(...tmp);
  if (o.label) await fadeIn(c, G.label(o.label[0], o.label[1], T(kc(color)(o.label[3])), { cls: 'bk-ptlab u8l2-glab', pos: o.label[2] || 'e' }));
  return { L, pts: keep };
}

/* =============================== warm-up: three track maps =============================== */
function track(G, m, b, color, o = {}) {
  const ties = G.line({ m, b }, { color, width: 13, dash: '3 8', arrows: false }); ties.style.opacity = 0.55;
  return [ties, G.line({ m, b }, { color, width: 4, arrows: false, dash: o.dash })];
}
function train(G, x, y, m, color) {
  const [px, py] = G.toPx(x, y), ang = -Math.atan2(m * G.uy, G.ux) * 180 / Math.PI;
  const t = h('div', 'u8l2-train'); t.style.background = color; t.style.left = px + 'px'; t.style.top = py + 'px'; t.style.transform = `translate(-50%, -50%) rotate(${ang}deg)`;
  G.el.appendChild(t); return t;
}
function mountWarm() {
  const opts = { width: 262, height: 262, xmin: 0, xmax: 8.6, ymin: 0, ymax: 8.6, xlabels: 2, ylabels: 2, origin: true, fontSize: 15 };
  const A = document.getElementById('u8l2-mapA'), B = document.getElementById('u8l2-mapB'), C = document.getElementById('u8l2-mapC');
  if (A) {
    const G = new Graph(A, opts);
    track(G, 2, -2, RED); track(G, -1, 7, BLUE);
    train(G, 1.5, 1, 2, RED); train(G, 6, 1, -1, BLUE);
    G.label(5.6, 3.3, T(kr('y=2x-2')), { cls: 'bk-ptlab u8l2-glab', pos: 'e' });
    G.label(5.2, 6.4, T(k1('y=-x+7')), { cls: 'bk-ptlab u8l2-glab', pos: 'e' });
  }
  if (B) {
    const G = new Graph(B, opts);
    track(G, 1, 3, RED); track(G, 1, -2, BLUE);
    train(G, 1.3, 4.3, 1, RED); train(G, 5.9, 3.9, 1, BLUE);
    G.label(0.6, 7.6, T(kr('y=x+3')), { cls: 'bk-ptlab u8l2-glab', pos: 'e' });
    G.label(3.6, 1.6, T(k1('y=x-2')), { cls: 'bk-ptlab u8l2-glab', pos: 'se' });
  }
  if (C) {
    const G = new Graph(C, opts);
    const [ties, r] = track(G, 2, 1, RED), b = G.line({ m: 2, b: 1 }, { color: BLUE, width: 3.5, dash: '10 8', arrows: false });
    const lab = G.label(3.9, 6.6, `${T(kr('y=2x+1'))}<br>${T(k1('4x-2y=-2'))}`, { cls: 'bk-ptlab u8l2-glab u8l2-twolab', pos: 'e' });
    const drawn = [r, b, lab, ties];
    const note = h('button', 'u8l2-note', `<b>Not drawn yet!</b><i>the plans say:</i>${T(kr('y=2x+1'))}${T(k1('4x-2y=-2'))}`); note.type = 'button'; note.title = 'Draw the plans';
    C.style.position = 'relative'; C.appendChild(note);
    const set = (up) => { C.classList.toggle('u8l2-drawn', up); drawn.forEach((e) => { e.style.opacity = up ? (e === ties ? 0.55 : 1) : 0; }); };
    set(false);
    note.addEventListener('click', () => set(!C.classList.contains('u8l2-drawn')));
  }
}

/* =============================== static figures: the example grids =============================== */
const GRID = { width: 400, height: 460, xmin: -6.6, xmax: 6.6, ymin: -6.6, ymax: 8.6, xlabels: 2, ylabels: 2, fontSize: 16 };
const EXG = {
  ex1: { lines: [{ m: 2, b: -1, col: BLUE, lab: [-2, -5, 'w', 'y=2x-1'] }, { m: -1, b: 5, col: AMB, lab: [-2, 7, 'e', 'y=-x+5'] }], pt: [2, 3] },
  ex2: { lines: [{ m: 3, b: 2, col: BLUE, lab: [-1.5, -2.5, 'w', 'y=3x+2'] }, { m: 3, b: -3, col: AMB, lab: [2.6, 4.8, 'e', 'y=3x-3'] }] },
  ex3: { lines: [{ m: -1, b: 4, col: BLUE, lab: [-4, 8, 'e', 'x+y=4'] }, { m: -1, b: 4, col: AMB, dash: '11 9', lab: [3, 1, 'ne', '2x+2y=8'] }] }
};
function mountStatics() {
  document.querySelectorAll('[data-u8l2-grid]').forEach((host) => {
    const d = EXG[host.dataset.u8l2Grid]; if (!d) return;
    const G = new Graph(host, GRID), ans = [];
    d.lines.forEach((L) => {
      ans.push(G.line({ m: L.m, b: L.b }, { color: L.col, width: L.dash ? 3.5 : 4.5, dash: L.dash }));
      ans.push(G.label(L.lab[0], L.lab[1], T(kc(L.col)(L.lab[3])), { cls: 'bk-ptlab u8l2-glab', pos: L.lab[2] }));
    });
    if (d.pt) { ans.push(G.point(d.pt[0], d.pt[1], { color: PUR, r: 7.5 })); ans.push(G.label(d.pt[0], d.pt[1], T(kp(pt(...d.pt))), { cls: 'bk-ptlab u8l2-glab', pos: 'e', gap: 10 })); }
    const part = host.closest('.part');
    const sync = () => { const on = part.classList.contains('shown'); ans.forEach((e) => { e.style.display = on ? '' : 'none'; }); };
    new MutationObserver(sync).observe(part, { attributes: true, attributeFilter: ['class'] }); sync();
  });
}

/* =============================== gap: step along x and watch the gap =============================== */
const GP = {
  A: { label: 'Warm-up Map A', r: { m: 2, b: -2, t: 'y=2x-2' }, bl: { m: -1, b: 7, t: 'y=-x+7' }, xs: [0, 1, 2, 3, 4, 5], kind: 'one', meet: 3,
    lr: [4.3, 6.3, 'e'], lb: [0.3, 7.6, 'ne'] },
  B: { label: 'Warm-up Map B', r: { m: 1, b: 3, t: 'y=x+3' }, bl: { m: 1, b: -2, t: 'y=x-2' }, xs: [0, 1, 2, 3, 4, 5], kind: 'none',
    lr: [1.6, 4.6, 'nw'], lb: [4.4, 1.6, 'se'] }
};
function gapDef(first) {
  return {
    title: 'Step right and watch the gap between the lines',
    height: 470,
    minW: 900,
    value: first,
    choices: Object.keys(GP).map((k) => ({ v: k, label: GP[k].label })),
    ask: (k) => `${GP[k].label}: will ${T(kr(GP[k].r.t))} and ${T(k1(GP[k].bl.t))} meet? Step right one unit at a time and watch the gap.`,
    make(stage, k, ex) {
      const d = GP[k], fr = (x) => d.r.m * x + d.r.b, fb = (x) => d.bl.m * x + d.bl.b, W = ex.W;
      const G = new Graph(stage, { x: 12, y: 8, width: 372, height: 456, xmin: -0.6, xmax: 6.6, ymin: -2.6, ymax: 9.6, xlabels: 1, ylabels: 1, fontSize: 15 });
      G.line({ m: d.r.m, b: d.r.b }, { color: RED, width: 4 }); G.line({ m: d.bl.m, b: d.bl.b }, { color: BLUE, width: 4 });
      G.label(d.lr[0], d.lr[1], T(kr(d.r.t)), { pos: d.lr[2], cls: 'bk-ptlab u8l2-glab' });
      G.label(d.lb[0], d.lb[1], T(k1(d.bl.t)), { pos: d.lb[2], cls: 'bk-ptlab u8l2-glab' });
      const st = { x: 0 };
      const sw = G.vline(0, { color: SL, width: 2.5 });
      const gap = G.curve(() => { const a = G.toPx(st.x, fr(st.x)), b = G.toPx(st.x, fb(st.x)); return { subs: [[a, b]] }; }, { color: PUR, width: 7, cap: 'butt' }, 'u8l2-gap', G.layers.data);
      const D1 = G.point(0, fr(0), { color: RED, r: 7 }), D2 = G.point(0, fb(0), { color: BLUE, r: 7 });
      const glab = G.label(0, 0, '', { pos: 'e', cls: 'u8l2-gaplab', gap: 10 });
      const set = (x) => {
        st.x = x; sw.set(x); G.moveTo(D1, x, fr(x)); G.moveTo(D2, x, fb(x)); gap._bkDraw();
        const g = Math.abs(fr(x) - fb(x)); glab.gx = x; glab.gy = (fr(x) + fb(x)) / 2; glab._bkDraw(); glab.textContent = g < 1e-9 ? '' : 'gap ' + texNum(g);
      };
      set(0); hideAll(sw, gap, D1, D2, glab);
      // the table: x, red, blue, gap
      const P = panel(stage, 404, 8, W - 416, 456, '', 'u8l2-gp');
      const tb = h('div', 'u8l2-gt', `<div class="u8l2-gth">${T('x')}</div><div class="u8l2-gth">${T(kr('y'))} red</div><div class="u8l2-gth">${T(k1('y'))} blue</div><div class="u8l2-gth">gap</div>`);
      P.appendChild(tb);
      const rowOf = (x) => {
        const a = fr(x), b = fb(x), g = a - b, cls = Math.abs(g) < 1e-9 ? ' u8l2-g0' : '';
        const cells = [T(x), T(kr(texNum(a))), T(k1(texNum(b))), Math.abs(g) < 1e-9 ? '<b>0</b>' : `${texNum(Math.abs(g))} <small>${g > 0 ? 'red above' : 'blue above'}</small>`];
        const els = cells.map((cc, i) => h('div', 'u8l2-gtd' + (i === 3 ? ' u8l2-gtg' : '') + cls, cc));
        els.forEach((e) => { tb.appendChild(e); e.style.opacity = 0; });
        return els;
      };
      const R = d.xs.map(rowOf);
      const V = verdict(P, d.kind, d.kind === 'one' ? `: ${T(kp(pt(d.meet, fr(d.meet))))}` : '');
      const goRow = async (c, i) => { await tween(c, 600, (t) => set(st.x + (d.xs[i] - st.x) * t)); set(d.xs[i]); for (const e of R[i]) await fadeIn(c, e, 120); };
      const first = async (c) => { for (const e of [sw, gap, D1, D2, glab]) await fadeIn(c, e, 160); for (const e of R[0]) await fadeIn(c, e, 120); };
      const g0 = Math.abs(fr(0) - fb(0)), dm = Math.abs(d.r.m - d.bl.m);
      if (k === 'A') {
        let S;
        return [
          { cap: `At ${T('x=0')}: red is at ${T(texNum(fr(0)))}, blue is at ${T(texNum(fb(0)))}. Blue is <b>${g0}</b> above red.`, run: first },
          { cap: `Step right to ${T('x=1')}: red goes <b>up 2</b>, blue goes <b>down 1</b>. The gap shrinks by ${T('2+1=3')}: now <b>${Math.abs(fr(1) - fb(1))}</b>.`, run: (c) => goRow(c, 1) },
          { cap: `${T('x=2')}: the gap shrinks by 3 again: <b>${Math.abs(fr(2) - fb(2))}</b>.`, run: (c) => goRow(c, 2) },
          { cap: `${T('x=3')}: gap <b>0</b>. Both are at ${T('4')}: the tracks cross at ${T(kp('(3,\\ 4)'))}.`, run: async (c) => {
            await goRow(c, 3); S = G.point(3, 4, { color: PUR, r: 9 }); await G.reveal(S, c); await fadeIn(c, G.label(3, 4, T(kp('(3,\\ 4)')), { pos: 'w', cls: 'bk-ptlab u8l2-glab', gap: 12 }));
          } },
          { cap: `Keep going: now <b>red</b> is above, and the gap grows by ${dm} every step. It can never shrink back to 0: they cross <b>once</b>. <b>One solution.</b>`, run: async (c) => {
            await goRow(c, 4); await goRow(c, 5); await pop(c, V, 420);
          } }
        ];
      }
      return [
        { cap: `At ${T('x=0')}: red is at ${T(texNum(fr(0)))}, blue is at ${T(texNum(fb(0)))}. Red is <b>${g0}</b> above blue.`, run: first },
        { cap: `Step right to ${T('x=1')}: <b>both</b> go up 1 (the same slope). The gap is still <b>${g0}</b>.`, run: (c) => goRow(c, 1) },
        { cap: `${T('x=2,\\ 3,\\ 4,\\ 5')}: the gap is <b>${g0}</b> every time. Same slope, same steps.`, run: async (c) => { for (let i = 2; i < d.xs.length; i++) await goRow(c, i); } },
        { cap: `A gap that is always ${g0} is never 0: the tracks never meet. <b>Parallel</b> lines: <b>no solution</b>.`, run: (c) => pop(c, V, 420) }
      ];
    }
  };
}
const gap = gapDef('A'), gapB = gapDef('B');

/* =============================== count: Examples 1–3 check =============================== */
const EC = {
  ex1: { label: 'Example 1 check', ask: `Example 1: graph ${T(k1('y=2x-1'))} and ${T(k2('y=-x+5'))}. How many points are on both lines?`,
    L: [{ m: 2, b: -1, tex: 'y=2x-1', lab: [-2, -5, 'w'] }, { m: -1, b: 5, tex: 'y=-x+5', lab: [-2, 7, 'e'] }], kind: 'one' },
  ex2: { label: 'Example 2 check', ask: `Example 2: graph ${T(k1('y=3x+2'))} and ${T(k2('y=3x-3'))}. How many points are on both lines?`,
    L: [{ m: 3, b: 2, tex: 'y=3x+2', lab: [-1.5, -2.5, 'w'] }, { m: 3, b: -3, tex: 'y=3x-3', lab: [2.6, 4.8, 'e'] }], kind: 'none' },
  ex3: { label: 'Example 3 check', ask: `Example 3: graph ${T(k1('x+y=4'))} and ${T(k2('2x+2y=8'))}. How many points are on both lines?`,
    L: [{ m: -1, b: 4, tex: 'x+y=4', si: 'y=-x+4', lab: [-4, 8, 'e'] }, { m: -1, b: 4, tex: '2x+2y=8', si: 'y=-x+4', lab: [3, 1, 'ne'] }], kind: 'inf' }
};
function countDef(first) {
  return {
    title: 'Graph both lines, then count the shared points',
    height: 476,
    minW: 900,
    value: first,
    choices: Object.keys(EC).map((k) => ({ v: k, label: EC[k].label })),
    ask: (k) => EC[k].ask,
    make(stage, k, ex) {
      const d = EC[k], W = ex.W, [A, B] = d.L;
      const G = new Graph(stage, Object.assign({}, GRID, { x: 8, y: 8, width: 400, height: 460 }));
      const P = panel(stage, 424, 8, W - 432, 460, '', 'u8l2-cp');
      const V = verdict(P, d.kind, d.kind === 'one' ? `: ${T(kp('(2,\\ 3)'))}` : '');
      const t1 = A.si || A.tex;
      const steps = [
        { cap: `${T(k1(A.tex))}${A.si ? ` is ${T(k1(A.si))}` : ''}: start at ${T(pt(0, A.b))}, then ${stepWords(A.m)}.`, run: async (c) => {
          await say(c, P, `${T(k1(A.tex + (A.si ? '\\Rightarrow ' + A.si : '')))}: ${T('m=' + A.m)}, ${T('b=' + A.b)}`);
          await plotLine(G, c, A.m, A.b, BLUE, { label: [...A.lab, A.tex] });
        } }
      ];
      if (k === 'ex3') {
        steps.push({ cap: `Rewrite ${T(k2('2x+2y=8'))}: subtract ${T('2x')}, then <b>divide every term by 2</b>: ${T(k2('y=-x+4'))}. The same as the blue line!`, run: async (c) => {
          await say(c, P, `${T(k2('2x+2y=8\\Rightarrow 2y=-2x+8'))}`); await say(c, P, `${T(k2('\\Rightarrow y=-x+4'))}: ${T('m=-1')}, ${T('b=4')}`);
        } });
        steps.push({ cap: `Same slope ${T('-1')}, same ${T('y')}-intercept ${T('4')}: the amber line lands <b>exactly on top</b> of the blue one.`, run: async (c) => {
          const L = G.line({ m: -1, b: 4 }, { color: AMB, width: 3.5, dash: '11 9' }); await G.drawIn(L, 900, c);
          await fadeIn(c, G.label(B.lab[0], B.lab[1], T(k2(B.tex)), { cls: 'bk-ptlab u8l2-glab', pos: B.lab[2] }));
        } });
        steps.push({ cap: `Every point on the line is on both: ${T(kp('(0,\\ 4)'))}, ${T(kp('(1,\\ 3)'))}, ${T(kp('(2,\\ 2)'))}, ${T(kp('(4,\\ 0)'))}, … <b>Infinitely many solutions.</b>`, run: async (c) => {
          for (const [x, y] of [[0, 4], [1, 3], [2, 2], [4, 0], [-1, 5], [3, 1]]) await pop(c, G.point(x, y, { color: PUR, r: 7 }), 220);
          await say(c, P, `${T('(1,\\ 3)')}: ${T('1+3=4')} ✓ and ${T('2(1)+2(3)=8')} ✓`, 'u8l2-sm'); await pop(c, V, 420);
        } });
        return steps;
      }
      steps.push({ cap: `${T(k2(B.tex))}: start at ${T(pt(0, B.b))}, then ${stepWords(B.m)}.`, run: async (c) => {
        await say(c, P, `${T(k2(B.tex))}: ${T('m=' + B.m)}, ${T('b=' + B.b)}`);
        await plotLine(G, c, B.m, B.b, AMB, { label: [...B.lab, B.tex] });
      } });
      if (k === 'ex1') {
        steps.push({ cap: `Different slopes (${T('2')} and ${T('-1')}): they cross once, at ${T(kp('(2,\\ 3)'))}. Check: ${T('2(2)-1=3')} ✓ and ${T('-(2)+5=3')} ✓`, run: async (c) => {
          const X = G.point(2, 3, { color: PUR, r: 8.5 }); await G.reveal(X, c); await fadeIn(c, G.label(2, 3, T(kp('(2,\\ 3)')), { pos: 'e', cls: 'bk-ptlab u8l2-glab', gap: 12 }));
          await say(c, P, `${T('2(2)-1=3')} ✓ and ${T('-(2)+5=3')} ✓`, 'u8l2-sm');
        } });
        steps.push({ cap: `One crossing point, and it checks in both: <b>one solution</b>, ${T(kp('(2,\\ 3)'))}.`, run: (c) => pop(c, V, 420) });
      } else {
        steps.push({ cap: `Same slope: both go up 3 for every 1 across. Measure the vertical gap anywhere: always <b>5</b>. The lines are <b>parallel</b>.`, run: async (c) => {
          for (const x of [-1.5, 0.5, 1.5]) {
            const s = G.segment([x, 3 * x - 3], [x, 3 * x + 2], { color: SL, width: 3, ends: ['arrow', 'arrow'] }); await G.drawIn(s, 360, c);
            await fadeIn(c, G.label(x, 3 * x - 0.5, T('5'), { cls: 'bk-ptlab u8l2-gaplab2', pos: 'e', gap: 4 }));
          }
          await say(c, P, `gap: ${T('2-(-3)=5')}, at every ${T('x')}`, 'u8l2-sm');
        } });
        steps.push({ cap: `A gap that is always 5 is never 0: no point is on both lines. <b>No solution.</b>`, run: (c) => pop(c, V, 420) });
      }
      void t1;
      return steps;
    }
  };
}
const count1 = countDef('ex1'), count2 = countDef('ex2'), count3 = countDef('ex3');

/* =============================== zoom: different slopes always cross, maybe off the grid =============================== */
const ZM = {
  near: { label: 'Slopes 1 and ' + T('\\tfrac54'), m1: 1, b1: 3, m2: 1.25, b2: 1, t1: 'y=x+3', t2: 'y=\\tfrac54x+1', mt1: '1', mt2: '\\tfrac54', dm: '\\tfrac14', sx: 8, sy: 11,
    win: { xmin: -2, xmax: 14, ymin: -2, ymax: 16, xscl: 1, yscl: 1 }, gaps: ['2', '1\\tfrac34', '1\\tfrac12', '1\\tfrac14', '1'], chk: ['8+3=11', '\\tfrac54(8)+1=10+1=11'],
    l1: [-3, 0, 'nw'], l2: [3.6, 5.5, 'se'] },
  far: { label: 'Slopes ' + T('\\tfrac12') + ' and ' + T('\\tfrac35'), m1: 0.5, b1: 1, m2: 0.6, b2: -1, t1: 'y=\\tfrac12x+1', t2: 'y=\\tfrac35x-1', mt1: '\\tfrac12', mt2: '\\tfrac35', dm: '\\tfrac1{10}', sx: 20, sy: 11,
    win: { xmin: -4, xmax: 26, ymin: -6, ymax: 16, xscl: 2, yscl: 2 }, gaps: ['2', '1.9', '1.8', '1.7', '1.6'], chk: ['\\tfrac12(20)+1=10+1=11', '\\tfrac35(20)-1=12-1=11'],
    l1: [4, 3, 'nw'], l2: [4.5, 1.7, 'se'] }
};
const zoom = {
  title: 'Different slopes always cross, even off the grid',
  height: 470,
  minW: 900,
  choices: Object.keys(ZM).map((k) => ({ v: k, label: ZM[k].label })),
  ask: (k) => `Do ${T(k1(ZM[k].t1))} and ${T(k2(ZM[k].t2))} ever cross? On the grid they look parallel…`,
  make(stage, k, ex) {
    const d = ZM[k], W = ex.W;
    const G = new Graph(stage, { x: 10, y: 8, width: 520, height: 456, xmin: -6.6, xmax: 6.6, ymin: -6.6, ymax: 8.6, fontSize: 15 });
    const L1 = G.line({ m: d.m1, b: d.b1 }, { color: BLUE, width: 4 }), L2 = G.line({ m: d.m2, b: d.b2 }, { color: AMB, width: 4 });
    const la1 = G.label(d.l1[0], d.l1[1], T(k1(d.t1)), { pos: d.l1[2], cls: 'bk-ptlab u8l2-glab' }), la2 = G.label(d.l2[0], d.l2[1], T(k2(d.t2)), { pos: d.l2[2], cls: 'bk-ptlab u8l2-glab' });
    hideAll(L1, L2, la1, la2);
    const P = panel(stage, 546, 8, W - 556, 456, '', 'u8l2-zp');
    let S;
    return [
      { cap: `On the booklet’s grid the two lines look <b>parallel</b>. Do they ever meet?`, run: async (c) => {
        L1.style.opacity = L2.style.opacity = 1; await G.drawIn(L1, 700, c); await fadeIn(c, la1); await G.drawIn(L2, 700, c); await fadeIn(c, la2);
      } },
      { cap: `Compare the <b>slopes</b>: ${T(k1(d.mt1))} and ${T(k2(d.mt2))}. They are <b>different</b>, so the lines <b>must</b> cross somewhere.`, run: async (c) => {
        await say(c, P, `slopes: ${T(k1(d.mt1))} and ${T(k2(d.mt2))}: <b>different</b>`, 'u8l2-big2');
      } },
      { cap: `At ${T('x=0')} the gap is ${T('2')}. Each step right, amber climbs ${T(d.dm)} more than blue, so the gap shrinks a little: ${T(d.gaps.join(',\\ '))}, …`, run: async (c) => {
        await say(c, P, `gap at ${T('x=0,\\,1,\\,2,\\,3,\\,4')}:`); await say(c, P, T(d.gaps.join(',\\ ') + ',\\ \\ldots'), 'u8l2-big2');
        await say(c, P, `It shrinks by ${T(d.dm)} each step, so it reaches 0 after ${T(String(d.sx))} steps.`);
      } },
      { cap: `<b>Zoom out</b> to see past the edge of the grid…`, run: (c) => G.setWindow(d.win, c, 1600) },
      { cap: `There it is: they cross at ${T(kp(pt(d.sx, d.sy)))}. Check: ${T(d.chk[0])} ✓ and ${T(d.chk[1])} ✓. <b>One solution</b>, just off the grid.`, run: async (c) => {
        S = G.point(d.sx, d.sy, { color: PUR, r: 9 }); await G.reveal(S, c); await fadeIn(c, G.label(d.sx, d.sy, T(kp(pt(d.sx, d.sy))), { pos: 'nw', cls: 'bk-ptlab u8l2-glab', gap: 12 }));
        await say(c, P, `${T(d.chk[0])} ✓`, 'u8l2-sm'); await say(c, P, `${T(d.chk[1])} ✓`, 'u8l2-sm');
        const v = verdict(P, 'one', `: ${T(kp(pt(d.sx, d.sy)))}`); await pop(c, v, 420);
      } }
    ];
  }
};

/* =============================== disguise: the same line in disguise =============================== */
const DG = {
  ex3: { label: 'Example 3', ask: `Example 3: are ${T(k1('x+y=4'))} and ${T(k2('2x+2y=8'))} really different lines?`, t1: 'x+y=4', t2: '2x+2y=8', kind: 'inf',
    rows: [
      { m: `\\textcolor{${PUR}}{2}x+\\textcolor{${PUR}}{2}y=\\textcolor{${PUR}}{2}(4)\\ \\Rightarrow\\ 2x+2y=8`, n: `double <b>every</b> term of ${T('x+y=4')}…`, cap: `Double <b>every</b> term of ${T(k1('x+y=4'))}: ${T('2x+2y=8')}. That is the <b>second</b> equation! It is the first one in disguise.` },
      { m: k1('x+y=4\\ \\Rightarrow\\ y=-x+4'), n: `subtract ${T('x')}`, cap: `To compare, rewrite both. Blue: subtract ${T('x')}: ${T(k1('y=-x+4'))}.` },
      { m: k2('2x+2y=8\\ \\Rightarrow\\ 2y=-2x+8'), n: `subtract ${T('2x')}`, cap: `Amber: subtract ${T('2x')} from each side: ${T(k2('2y=-2x+8'))}.` },
      { m: k2('y=-x+4'), n: '<b>divide every term</b> by 2', cap: `${T('2y')} is two ${T('y')}’s: <b>divide every term</b> by 2: ${T(k2('y=-x+4'))}.` }],
    m1: -1, b1: 4, m2: -1, b2: 4, pts: [[0, 4], [1, 3], [2, 2], [4, 0], [-1, 5]], chk: ['1+3=4', '2(1)+2(3)=8'], at: [1, 3],
    win: { xmin: -2.6, xmax: 6.6, ymin: -2.6, ymax: 6.6 } },
  wu: { label: 'Warm-up Map C', ask: `Warm-up Map C: the plans say ${T(k1('y=2x+1'))} and ${T(k2('4x-2y=-2'))}. Do the tracks share any points?`, t1: 'y=2x+1', t2: '4x-2y=-2', kind: 'inf',
    rows: [
      { m: k2('4x-2y=-2\\ \\Rightarrow\\ -2y=-4x-2'), n: `subtract ${T('4x')}`, cap: `Blue is already ${T('y=mx+b')}. Rewrite amber: subtract ${T('4x')} from each side: ${T(k2('-2y=-4x-2'))}.` },
      { m: k2('y=\\dfrac{-4x}{-2}+\\dfrac{-2}{-2}'), n: '<b>divide every term</b> by −2', cap: `<b>Divide every term</b> by ${T('-2')}. A negative divided by a negative is positive…` },
      { m: k2('y=2x+1'), n: 'every sign flips', cap: `…so ${T(k2('y=2x+1'))}. That is ${T(k1('y=2x+1'))}: the red track again!` }],
    m1: 2, b1: 1, m2: 2, b2: 1, pts: [[0, 1], [1, 3], [2, 5], [-1, -1], [3, 7]], chk: ['3=2(1)+1', '4(1)-2(3)=-2'], at: [1, 3],
    win: { xmin: -2.6, xmax: 4.6, ymin: -2.6, ymax: 8.6 } },
  not: { label: 'Careful: ' + T('2x+2y=10'), ask: `Is ${T(k2('2x+2y=10'))} the same line as ${T(k1('x+y=4'))} in disguise?`, t1: 'x+y=4', t2: '2x+2y=10', kind: 'none',
    rows: [
      { m: k1('x+y=4\\ \\Rightarrow\\ y=-x+4'), n: `subtract ${T('x')}`, cap: `Blue: ${T(k1('y=-x+4'))}.` },
      { m: k2('2x+2y=10\\ \\Rightarrow\\ 2y=-2x+10'), n: `subtract ${T('2x')}`, cap: `Amber: subtract ${T('2x')}: ${T(k2('2y=-2x+10'))}.` },
      { m: k2('y=-x+5'), n: '<b>divide every term</b> by 2', cap: `Divide every term by 2: ${T(k2('y=-x+5'))}. Doubling ${T('x+y=4')} would give ${T('2x+2y=8')}, not 10.` }],
    m1: -1, b1: 4, m2: -1, b2: 5, win: { xmin: -2.6, xmax: 6.6, ymin: -2.6, ymax: 6.6 } }
};
const disguise = {
  title: 'The same line in disguise?',
  height: 470,
  minW: 900,
  choices: [{ v: 'ex3', label: DG.ex3.label }, { v: 'wu', label: DG.wu.label }, { sep: 'Watch out' }, { v: 'not', label: DG.not.label }],
  ask: (k) => DG[k].ask,
  make(stage, k, ex) {
    const d = DG[k], W = ex.W, LW = W - 410;
    const G = new Graph(stage, Object.assign({ x: W - 400, y: 8, width: 390, height: 456, xlabels: 1, ylabels: 1, fontSize: 15 }, d.win));
    const col = add(stage, box(h('div', 'u8l2-dcol'), LW, 456), 8, 8);
    const row = (html, note = '') => { const r = h('div', 'u8l2-drow', `<div class="u8l2-dmath">${html}</div><div class="u8l2-dnote">${note}</div>`); col.appendChild(r); r.style.opacity = 0; return r; };
    const head = row(`${T(k1(d.t1))}<span class="u8l2-and">and</span>${T(k2(d.t2))}`, 'they look different'); head.classList.add('u8l2-dhead');
    const rows = d.rows.map((r) => row(T(r.m), r.n));
    const same = d.kind === 'inf';
    const cmp = h('div', 'u8l2-dcmp', `<div>slopes: ${T(k1(texNum(d.m1)))} and ${T(k2(texNum(d.m2)))} <b>${d.m1 === d.m2 ? 'same' : 'different'}</b></div><div>${T('y')}-intercepts: ${T(k1(texNum(d.b1)))} and ${T(k2(texNum(d.b2)))} <b>${d.b1 === d.b2 ? 'same' : 'different'}</b></div>`);
    col.appendChild(cmp); cmp.style.opacity = 0;
    const V = verdict(col, d.kind);
    const steps = [{ cap: `${T(k1(d.t1))} and ${T(k2(d.t2))}: the equations <b>look</b> different.`, run: (c) => show(c, head) }];
    d.rows.forEach((r, i) => steps.push({ cap: r.cap, run: (c) => show(c, rows[i]) }));
    steps.push({ cap: same ? `Same slope ${T(texNum(d.m1))} <b>and</b> same ${T('y')}-intercept ${T(texNum(d.b1))}: one line, written two ways. The amber line lands <b>exactly on top</b>.`
      : `Same slope ${T('-1')}, but <b>different</b> ${T('y')}-intercepts (${T('4')} and ${T('5')}): <b>parallel</b> lines, not the same line.`,
    run: async (c) => {
      await show(c, cmp);
      const A = G.line({ m: d.m1, b: d.b1 }, { color: BLUE, width: same ? 7 : 4 }); if (same) A.style.opacity = 0.55; await G.drawIn(A, 700, c);
      const B = G.line({ m: d.m2, b: d.b2 }, { color: AMB, width: 3.5, dash: same ? '11 9' : null }); await G.drawIn(B, 800, c);
    } });
    if (same) {
      steps.push({ cap: `So <b>every</b> point on it is on both lines. E.g. ${T(pt(...d.at))}: ${T(d.chk[0])} ✓ and ${T(d.chk[1])} ✓. <b>Infinitely many solutions.</b>`, run: async (c) => {
        for (const [x, y] of d.pts) await pop(c, G.point(x, y, { color: PUR, r: 7 }), 200);
        await pop(c, V, 420);
      } });
    } else steps.push({ cap: `Parallel lines never meet: <b>no solution</b>. Look-alikes are not always the same line: <b>rewrite and compare</b>.`, run: (c) => pop(c, V, 420) });
    return steps;
  }
};

/* =============================== turnSlide (star): turn, then slide =============================== */
const M1 = 1, B1 = 1;
const FIRST = `Blue ${T(k1('y=x+1'))} and amber ${T(k2('y=-x+5'))}: <b>different slopes</b>. They cross at exactly one point, ${T(kp('(2,\\ 3)'))}: <b>one solution</b>.`;
const TS = {
  turn: { label: 'Turn, then slide', st: { m: -1, b: 5 }, first: FIRST, moves: [
    { to: { m: 0 }, cap: `<b>Turn</b> the amber line about its ${T('y')}-intercept ${T('(0,\\ 5)')}. The crossing slides along the blue line to ${T(kp('(4,\\ 5)'))}. Still one solution.` },
    { to: { m: 0.8 }, cap: `Turn it closer to the blue slope. The closer the slopes, the <b>farther away</b> the crossing: now ${T(kp('(20,\\ 21)'))}, far off the grid. Still one solution.` },
    { to: { m: 1 }, cap: `<b>Same slopes</b>: the lines are <b>parallel</b>. The crossing has run away for good: <b>no solution</b>.` },
    { to: { b: 3 }, cap: `Now <b>slide</b> the amber line down. Same slope, so it stays parallel: the gap shrinks but never closes. Still <b>no solution</b>.` },
    { to: { b: 1 }, cap: `Same slope <b>and</b> same ${T('y')}-intercept: it lands exactly <b>on top</b>. Every point of one line is on the other: <b>infinitely many solutions</b>.` }] },
  slide: { label: 'Slide a crossing line', st: { m: -1, b: 5 }, first: FIRST, moves: [
    { to: { b: 9 }, cap: `Slide the amber line <b>up</b>. The crossing moves to ${T(kp('(4,\\ 5)'))}, but there is still exactly <b>one</b>.` },
    { to: { b: 1 }, cap: `Slide it down to intercept 1, the <b>same intercept</b> as the blue line. They still cross once, on the ${T('y')}-axis at ${T(kp('(0,\\ 1)'))}.` },
    { to: { b: -3 }, cap: `Keep sliding: ${T(kp('(-2,\\ -1)'))}. Different slopes <b>always</b> cross exactly once, so for one solution the intercepts can be <b>anything</b>.` }] },
  spin: { label: 'Turn all the way round', st: { m: -1, b: 5 }, first: FIRST, moves: [
    { to: { m: 0.8 }, ms: 2600, cap: `Turn the amber line. As its slope gets close to ${T('1')}, the crossing races off to the right: ${T(kp('(20,\\ 21)'))}.` },
    { to: { m: 1 }, cap: `Slopes equal: parallel, <b>no solution</b>. This is the only position with no crossing.` },
    { to: { m: 1.2 }, cap: `Turn a little further and the crossing comes back, from the <b>far left</b>: ${T(kp('(-20,\\ -19)'))}.` },
    { to: { m: 3 }, cap: `…and swings in close: ${T(kp('(-2,\\ -1)'))}. One solution again. Only <b>equal slopes</b> stop two lines from crossing.` }] },
  free: { label: 'Free play', st: { m: -1, b: 5 }, free: true }
};
const miniSvg = (k) => ({
  one: '<line x1="10" y1="40" x2="70" y2="6" class="u8l2-sl1"/><line x1="10" y1="6" x2="70" y2="40" class="u8l2-sl2"/>',
  none: '<line x1="10" y1="42" x2="70" y2="18" class="u8l2-sl1"/><line x1="10" y1="28" x2="70" y2="4" class="u8l2-sl2"/>',
  inf: '<line x1="10" y1="40" x2="70" y2="6" class="u8l2-sl1 u8l2-fat"/><line x1="10" y1="40" x2="70" y2="6" class="u8l2-sl2 u8l2-dash"/>'
}[k]);
/** a whole line y = m x + b read from get() → [m, b] on every redraw, clipped to the window, arrows at the edges */
function mbLine(G, get, o = {}) {
  return G.curve(() => {
    const [m, b] = get(), L = Math.hypot(1, m), d = [1 / L, m / L], a = [0, b];
    const TT = G._clipT(a, d, -Infinity, Infinity); if (!TT) return { subs: [] };
    const p0 = G.toPx(a[0] + d[0] * TT[0], a[1] + d[1] * TT[0]), p1 = G.toPx(a[0] + d[0] * TT[1], a[1] + d[1] * TT[1]);
    const Lp = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]); if (Lp < 2) return { subs: [] };
    const u = [(p1[0] - p0[0]) / Lp, (p1[1] - p0[1]) / Lp];
    if (o.arrows === false) return { subs: [[p0, p1]] };
    return { subs: [[p0, p1]], ends: [{ p: p0, d: [-u[0], -u[1]], s: 'arrow', k: 0, si: 0, last: false }, { p: p1, d: u, s: 'arrow', k: 1, si: 0, last: true }] };
  }, Object.assign({ width: 4 }, o), 'bk-line', G.layers.data);
}
const setDash = (L, on) => { if (on) L.path.setAttribute('stroke-dasharray', '13 10'); else L.path.removeAttribute('stroke-dasharray'); };
function mbLive(m, b) {
  const z = (v) => Math.abs(v) < 0.005;
  const M = z(m) ? '' : (Math.abs(m - 1) < 0.005 ? '' : Math.abs(m + 1) < 0.005 ? '-' : d2(m)) + 'x';
  let s = 'y=' + M;
  if (!z(b)) s += M ? (b > 0 ? '+' : '-') + d2(Math.abs(b)) : d2(b); else if (!M) s += '0';
  return s;
}
const turnSlide = {
  title: 'Turn one line, then slide it: how many solutions?',
  height: 480,
  minW: 960,
  choices: Object.keys(TS).map((k) => ({ v: k, label: TS[k].label })),
  ask: (k) => (TS[k].free ? `Your turn: turn and slide the amber line. Can you make <b>no solution</b>? <b>Infinitely many</b>?`
    : `Blue ${T(k1('y=x+1'))} stays put while the amber line moves. How many solutions now?`),
  make(stage, k, ex) {
    const d = TS[k], st = Object.assign({}, d.st), W = ex.W;
    const G = new Graph(stage, { x: 8, y: 10, width: 460, height: 460, xmin: -7, xmax: 7, ymin: -7, ymax: 7, xlabels: 2, ylabels: 2 });
    const glow = mbLine(G, () => [M1, B1], { color: PUR, width: 16, opacity: 0.22, arrows: false });
    mbLine(G, () => [M1, B1], { color: BLUE });
    const L2 = mbLine(G, () => [st.m, st.b], { color: AMB });
    const PV = G.point(0, st.b, { color: AMB, r: 6, open: true });
    const X = G.point(2, 3, { color: PUR, r: 8 });
    const XL = G.label(2, 3, '', { cls: 'bk-ptlab u8l2-xlab', color: PUR, pos: 'se', gap: 6 });
    const off = h('div', 'u8l2-off'); G.html.appendChild(off);
    const P = add(stage, box(h('div', 'u8l2-tsp' + (d.free ? ' u8l2-free' : '')), W - 488, 460), 480, 10);
    P.innerHTML = `<div class="u8l2-eqs"><div class="u8l2-eq">${T(k1('y=x+1'))}</div><div class="u8l2-eq u8l2-eq2"></div></div>
      <div class="u8l2-mid"><div class="u8l2-cnt"><div class="u8l2-cntk">solutions</div><div class="u8l2-cntv"></div><div class="u8l2-cnts"></div></div>
      <div class="u8l2-cmp"><div class="u8l2-cmpr"><div class="u8l2-cmpk">slopes</div><div class="u8l2-cmpv u8l2-sm1"></div><div class="u8l2-cmpt u8l2-smt"></div></div>
      <div class="u8l2-cmpr"><div class="u8l2-cmpk">${T('y')}-intercepts</div><div class="u8l2-cmpv u8l2-sb"></div><div class="u8l2-cmpt u8l2-sbt"></div></div></div></div>
      <div class="u8l2-mchart">${['one', 'none', 'inf'].map((q) => `<div class="u8l2-mc" data-k="${q}"><div class="u8l2-mch">${{ one: 'One solution', none: 'No solution', inf: 'Infinitely many' }[q]}</div><svg viewBox="0 0 80 46">${miniSvg(q)}</svg><div class="u8l2-mcr">${{ one: 'slopes <b>different</b><br>intercepts <b>any</b>', none: 'slopes <b>same</b><br>intercepts <b>different</b>', inf: 'slopes <b>same</b><br>intercepts <b>same</b>' }[q]}</div></div>`).join('')}</div>`;
    const q = (s) => P.querySelector(s);
    const eq2 = q('.u8l2-eq2'), cnt = q('.u8l2-cnt'), cntV = q('.u8l2-cntv'), cntS = q('.u8l2-cnts');
    const sm = q('.u8l2-sm1'), smt = q('.u8l2-smt'), sb = q('.u8l2-sb'), sbt = q('.u8l2-sbt'), cols = [...P.querySelectorAll('.u8l2-mc')];
    let prev = null;
    const upd = () => {
      L2._bkDraw(); G.moveTo(PV, 0, st.b);
      const em = Math.abs(st.m - M1) < 1e-6, eb = Math.abs(st.b - B1) < 1e-6, kind = em ? (eb ? 'inf' : 'none') : 'one';
      put(eq2, T(k2(mbLive(st.m, st.b))));
      put(cntV, KIND[kind].n); put(cntS, KIND[kind].word);
      Object.values(KIND).forEach((kk) => cnt.classList.toggle(kk.cls, kk === KIND[kind]));
      put(sm, `${T(k1('1'))} <span class="u8l2-and">and</span> ${T(k2(d2(st.m)))}`); put(smt, em ? '<b class="u8l2-eqw">same</b>' : 'different');
      put(sb, `${T(k1('1'))} <span class="u8l2-and">and</span> ${T(k2(d2(st.b)))}`); put(sbt, eb ? '<b class="u8l2-eqw">same</b>' : 'different');
      cols.forEach((cl) => cl.classList.toggle('u8l2-on', cl.dataset.k === kind));
      setDash(L2, kind === 'inf'); glow.style.display = kind === 'inf' ? '' : 'none';
      if (kind === 'one') {
        const x = (st.b - B1) / (M1 - st.m), y = M1 * x + B1, inside = Math.abs(x) <= 7 && Math.abs(y) <= 7;
        const txt = Math.abs(x) > 999 ? 'very far away' : T(kp(`(${texNum(x, 1)},\\ ${texNum(y, 1)})`));
        X.style.visibility = inside ? '' : 'hidden'; XL.style.display = inside ? '' : 'none';
        if (inside) { G.moveTo(X, x, y); XL.gx = x; XL.gy = y; put(XL, T(kp(`(${texNum(x, 1)},\\ ${texNum(y, 1)})`))); XL._bkDraw(); place(XL, ...G.toPx(x, y), (Math.abs(y) < 1.3 ? 'n' : 's') + (x > 3 ? 'w' : 'e'), 6); off.style.display = 'none'; }
        else {
          const sx = x > 0 ? 6.75 : -6.75, [px, py] = G.toPx(sx, Math.max(-6.7, Math.min(6.7, M1 * sx + B1)));
          put(off, x > 0 ? `${txt} <b>→</b>` : `<b>←</b> ${txt}`); place(off, px, py + (x > 0 ? 26 : -26), x > 0 ? 'w' : 'e', 0); off.style.display = '';
        }
      } else { X.style.visibility = 'hidden'; XL.style.display = 'none'; off.style.display = 'none'; }
      if (prev && prev !== kind) cntV.animate([{ transform: 'scale(1.35)' }, { transform: 'scale(1)' }], 420);
      prev = kind;
    };
    upd();
    const move = async (c, to, ms = 2300) => {
      const s0 = Object.assign({}, st), a0 = Math.atan(s0.m), a1 = to.m != null ? Math.atan(to.m) : a0;
      await tween(c, ms, (t) => { if (to.m != null) st.m = Math.tan(a0 + (a1 - a0) * t); if (to.b != null) st.b = s0.b + (to.b - s0.b) * t; upd(); });
      Object.assign(st, to); upd();
    };
    if (d.free) {
      const ctl = h('div', 'u8l2-ctl'); P.appendChild(ctl);
      let busy = 0;
      const B = (html, title, to) => { const b = h('button', 'pill u8l2-tb', html); b.type = 'button'; b.title = title; b.onclick = async () => { const g = ++busy; const tgt = to(); if (g === busy) await move(liveCtx(), tgt, 450); }; ctl.appendChild(b); return b; };
      B('↺ turn', 'Slope up by 1', () => ({ m: Math.round(st.m + 1) })); B('↻ turn', 'Slope down by 1', () => ({ m: Math.round(st.m - 1) }));
      B('↑ slide', 'Slide up 1', () => ({ b: Math.round(st.b + 1) })); B('↓ slide', 'Slide down 1', () => ({ b: Math.round(st.b - 1) }));
      return [{ cap: `Your turn. Make the system have <b>no solution</b>. Then <b>infinitely many</b>. Then one solution again.`, run: async (c) => { await pulse(c, ctl, 1.04); } }];
    }
    return [
      { cap: d.first, run: async (c) => { await pulse(c, X, 1.5); await pulse(c, cnt, 1.06); } },
      ...d.moves.map((mv) => ({ cap: mv.cap, run: (c) => move(c, mv.to, mv.ms) }))
    ];
  }
};

/* =============================== classify: Example 5 check — the flowchart =============================== */
const CL = {
  a: { label: '(a)', e1: ['y=4x+3'], e2: ['y=4x-1'], m: ['4', '4'], b: ['3', '-1'], kind: 'none' },
  b: { label: '(b)', e1: ['y=5x+2'], e2: ['y=-3x+2'], m: ['5', '-3'], b: ['2', '2'], kind: 'one', note: ` (The ${T('y')}-intercepts are equal, but that doesn’t matter: they cross at ${T('(0,\\ 2)')}.)` },
  c: { label: '(c)', e1: ['y=2x-6'], e2: ['y=2x-6'], m: ['2', '2'], b: ['-6', '-6'], kind: 'inf' },
  d: { label: '(d)', e1: ['y=-x+8'], e2: ['y=x+8'], m: ['-1', '1'], b: ['8', '8'], kind: 'one', note: ` (Equal ${T('y')}-intercepts don’t matter once the slopes differ.)` },
  wB: { label: 'Map B', e1: ['y=x+3'], e2: ['y=x-2'], m: ['1', '1'], b: ['3', '-2'], kind: 'none' },
  wC: { label: 'Map C', e1: ['y=2x+1'], e2: ['4x-2y=-2', '-2y=-4x-2', 'y=2x+1'], m: ['2', '2'], b: ['1', '1'], kind: 'inf' }
};
const classify = {
  title: 'Example 5 check: same slope? same intercept?',
  height: 470,
  minW: 900,
  choices: [{ sep: 'Example 5 check' }, ...['a', 'b', 'c', 'd'].map((k) => ({ v: k, label: CL[k].label })), { sep: 'Warm-up' }, { v: 'wB', label: CL.wB.label }, { v: 'wC', label: CL.wC.label }],
  value: 'a',
  ask: (k) => `${k.length === 1 ? 'Example 5 ' + CL[k].label : 'Warm-up ' + CL[k].label}: ${T(k1(CL[k].e1[0]))} and ${T(k2(CL[k].e2[0]))}. One solution, no solution, or infinitely many?`,
  make(stage, k, ex) {
    const d = CL[k], W = ex.W, FW = W - 470, IX = Math.min(FW / 2 + 158, FW - 96), NX = Math.min(FW / 2 - 36, IX - 180);
    const P = panel(stage, 8, 6, 444, 458, '', 'u8l2-clp');
    const blk = (rows, n) => { const b = h('div', 'u8l2-cblk u8l2-cb' + n); rows.forEach((r, i) => b.appendChild(h('div', 'u8l2-cr' + (i === rows.length - 1 && rows.length > 1 ? ' u8l2-cfin' : ''), T((n === 1 ? k1 : k2)(r))))); P.appendChild(b); return b; };
    const B1k = blk(d.e1, 1), B2k = blk(d.e2, 2);
    const later = [...B1k.children].slice(1).concat([...B2k.children].slice(1)); hideAll(later);
    const cm = line(P, `slopes: ${T(k1(d.m[0]))} <span class="u8l2-and">and</span> ${T(k2(d.m[1]))}`, 'u8l2-cmpl'), cb = line(P, `${T('y')}-intercepts: ${T(k1(d.b[0]))} <span class="u8l2-and">and</span> ${T(k2(d.b[1]))}`, 'u8l2-cmpl');
    hideAll(cm, cb);
    const F = new Flowchart(stage, { x: 462, y: 6, width: FW, height: 458, nodes: {
      start: { x: FW / 2, y: 34, w: Math.min(380, FW - 20), h: 52, html: `<b>Write both as ${T('y=mx+b')}</b>`, cls: 'bk-round' },
      q1: { x: FW / 2, y: 132, w: 210, h: 52, html: '<b>Same slope?</b>', color: 'brand' },
      one: { x: 84, y: 250, w: 150, h: 84, html: '<b>One solution</b>lines cross once', color: 'purple' },
      q2: { x: FW / 2 + 64, y: 250, w: 250, h: 52, html: `<b>Same ${T('y')}-intercept?</b>`, color: 'brand' },
      none: { x: NX, y: 392, w: 170, h: 84, html: '<b>No solution</b>parallel lines', color: 'red' },
      inf: { x: IX, y: 392, w: 180, h: 84, html: '<b>Infinitely many</b>the same line', color: 'green' } },
    edges: [{ from: 'start', to: 'q1' },
      { from: 'q1', to: 'one', label: 'no', pts: [[FW / 2 - 108, 132], [84, 132], [84, 205]] },
      { from: 'q1', to: 'q2', label: 'yes', pts: [[FW / 2, 161], [FW / 2, 221]] },
      { from: 'q2', to: 'none', label: 'no', pts: [[NX, 279], [NX, 347]] },
      { from: 'q2', to: 'inf', label: 'yes', pts: [[IX, 279], [IX, 347]] }] });
    const sameM = d.m[0] === d.m[1], sameB = d.b[0] === d.b[1];
    const stp = verdict(P, d.kind);
    const rewrite = later.length ? ` Rewrite ${T(k2(d.e2[0]))}: ${T(k2(d.e2.slice(1).join('\\Rightarrow ')))}.` : ' Both already are.';
    const steps = [
      { cap: `Write both equations in ${T('y=mx+b')} form.${rewrite}`, run: async (c) => { await F.visit(c, 'start'); for (const r of later) { await show(c, r); await sleep(c, 120); } } },
      { cap: `<b>Same slope?</b> ${T(k1(d.m[0]))} and ${T(k2(d.m[1]))}: ${sameM ? '<b>yes</b>.' : '<b>no</b>.'}`, run: async (c) => { await show(c, cm); await F.go(c, 'start', 'q1'); await F.visit(c, 'q1'); } }
    ];
    if (!sameM) {
      steps.push({ cap: `Different slopes: the lines cross exactly once. <b>One solution.</b>${d.note || ''}`,
        run: async (c) => { await F.go(c, 'q1', 'one'); await F.visit(c, 'one'); await pop(c, stp, 420); } });
    } else {
      steps.push({ cap: `Same slope, so ask: <b>same ${T('y')}-intercept?</b> ${T(k1(d.b[0]))} and ${T(k2(d.b[1]))}: ${sameB ? '<b>yes</b>.' : '<b>no</b>.'}`, run: async (c) => { await show(c, cb); await F.go(c, 'q1', 'q2'); await F.visit(c, 'q2'); } });
      steps.push({ cap: sameB ? `Same slope and same intercept: the same line. <b>Infinitely many solutions.</b>` : `Same slope, different intercepts: parallel lines that never meet. <b>No solution.</b>`,
        run: async (c) => { const to = sameB ? 'inf' : 'none'; await F.go(c, 'q2', to); await F.visit(c, to); await pop(c, stp, 420); } });
    }
    return steps;
  }
};

/* =============================== mount =============================== */
mountWarm();
mountStatics();
export const explainers = mountExplainers({ gap, gapB, count1, count2, count3, zoom, disguise, turnSlide, classify });
export const _test = { GP, EC, ZM, DG, TS, CL };

/* ============ Stand Up Break! — how many solutions? (lessons/js/standup.js) ============
 * A line is { A, B, C }: Ax + By = C, kept with whole numbers. Beginning: both lines y = mx + b; Progressing: one line
 * written as ax ± y = c (rewrite first); Mastery: one line is a multiple k(ax ± y = c) (divide every term), sometimes a
 * look-alike with a different constant. About 40% one solution, 30% none, 30% infinitely many. The answer shows the
 * rewriting, the slopes and intercepts, the verdict, and a small graph (the same line drawn dashed on top). */
{
  const BL = COLORS.blue, AM = COLORS.amber, PU = COLORS.purple;
  const cT = (c, s) => `\\textcolor{${c}}{${s}}`;
  const tm = (k, v, first) => (k === 0 ? '' : (k < 0 ? '-' : first ? '' : '+') + (Math.abs(k) === 1 && v ? '' : Math.abs(k)) + v);
  const siT = (m, b) => 'y=' + ((tm(m, 'x', true) + (b ? (b < 0 ? '-' : m ? '+' : '') + Math.abs(b) : '')) || '0');
  const gen = (A, B, C) => tm(A, 'x', true) + tm(B, 'y', !A) + '=' + C;
  const half = (e, col) => { const i = e.indexOf('='); return cT(col, e.slice(0, i)) + '&' + cT(col, e.slice(i)); };
  const sysT = (a, b) => `\\begin{aligned}${half(a, BL)}\\\\${half(b, AM)}\\end{aligned}`;
  function graph(L, w) {   // L: [{ m, b, col, dash }]
    const S = 200, pad = 14, sx = S / (w.x1 - w.x0), sy = S / (w.y1 - w.y0);
    const X = (x) => +(pad + (x - w.x0) * sx).toFixed(1), Y = (y) => +(pad + (w.y1 - y) * sy).toFixed(1);
    let g = '';
    for (let x = w.x0; x <= w.x1; x++) g += `<line x1="${X(x)}" y1="${Y(w.y0)}" x2="${X(x)}" y2="${Y(w.y1)}" stroke="${x === 0 ? '#3a4254' : '#d5d9e0'}" stroke-width="${x === 0 ? 1.4 : 0.7}"/>`;
    for (let y = w.y0; y <= w.y1; y++) g += `<line x1="${X(w.x0)}" y1="${Y(y)}" x2="${X(w.x1)}" y2="${Y(y)}" stroke="${y === 0 ? '#3a4254' : '#d5d9e0'}" stroke-width="${y === 0 ? 1.4 : 0.7}"/>`;
    L.forEach(({ m, b, col, dash, wide }) => {
      const pts = [[w.x0, m * w.x0 + b], [w.x1, m * w.x1 + b]];
      if (m) [w.y0, w.y1].forEach((y) => pts.push([(y - b) / m, y]));
      const inn = pts.filter(([x, y]) => x >= w.x0 - 1e-9 && x <= w.x1 + 1e-9 && y >= w.y0 - 1e-9 && y <= w.y1 + 1e-9);
      let best = null, bd = -1;
      inn.forEach((p) => inn.forEach((q) => { const dd = (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2; if (dd > bd) { bd = dd; best = [p, q]; } }));
      if (best) g += `<line x1="${X(best[0][0])}" y1="${Y(best[0][1])}" x2="${X(best[1][0])}" y2="${Y(best[1][1])}" stroke="${col}" stroke-width="${wide ? 6 : 2.6}" stroke-opacity="${wide ? 0.5 : 1}" stroke-linecap="round"${dash ? ' stroke-dasharray="7 5"' : ''}/>`;
    });
    const Wd = S + 2 * pad;
    return `<svg viewBox="0 0 ${Wd} ${Wd}" width="${Wd}" height="${Wd}" style="max-width:100%;height:auto;display:block;margin:4px auto" role="img" aria-label="The two lines">${g}</svg>`;
  }
  const W8 = { x0: -8, x1: 8, y0: -8, y1: 8 };
  const SL2 = [1, 2, 3, 4, -1, -2, -3];
  const word = { one: '\\text{One solution}', none: '\\text{No solution}', inf: '\\text{Infinitely many solutions}' };
  const reason = (m1, m2, b1, b2) => (m1 !== m2 ? `\\text{slopes } {${m1}}\\text{ and } {${m2}}\\text{: different}`
    : b1 !== b2 ? `\\text{same slope } {${m1}}\\text{, intercepts } {${b1}}\\text{ and } {${b2}}\\text{: different}` : `\\text{same slope } {${m1}}\\text{ and same intercept } {${b1}}`);
  /** two lines y = m1 x + b1 and y = m2 x + b2 of the chosen kind */
  function pick(r) {
    const kind = r.chance(0.4) ? 'one' : r.chance(0.5) ? 'none' : 'inf';
    for (;;) {
      const m1 = r.pick(SL2), b1 = r.int(-6, 6);
      let m2 = m1, b2 = b1;
      if (kind === 'one') m2 = r.pick(SL2), b2 = r.int(-6, 6);
      if (kind === 'none') b2 = r.int(-6, 6);
      if (kind === 'one' && m2 === m1) continue;
      if (kind === 'none' && b2 === b1) continue;
      return { kind, m1, b1, m2, b2 };
    }
  }
  const pic = (m1, b1, m2, b2, kind) => graph([{ m: m1, b: b1, col: BL, wide: kind === 'inf' }, { m: m2, b: b2, col: AM, dash: kind === 'inf' }], W8);
  const ask = 'How many solutions does the system have: one, none, or infinitely many? Explain using the slopes and <i>y</i>-intercepts.';
  /* Beginning: both already y = mx + b (an "infinitely many" one is sometimes written b + mx) */
  function beg(r) {
    const { kind, m1, b1, m2, b2 } = pick(r);
    const e1 = siT(m1, b1), e2 = kind === 'inf' && b2 && r.chance(0.5) ? `y=${b2}${tm(m2, 'x', false)}` : siT(m2, b2);
    return { text: ask, q: sysT(e1, e2),
      a: [`${cT(BL, `m=${m1},\\ b=${b1}`)}\\qquad ${cT(AM, `m=${m2},\\ b=${b2}`)}`, reason(m1, m2, b1, b2), cT(PU, word[kind])],
      atext: pic(m1, b1, m2, b2, kind) };
  }
  /* Progressing: the second line is written ax ± y = c (x-term positive): rewrite it first */
  function prg(r) {
    for (;;) {
      const { kind, m1, b1, m2, b2 } = pick(r);
      const s = r.pick([1, -1]);                 // s·(y − m2 x) = s·b2 → (−s m2) x + s y = s b2
      let A = -s * m2, B = s, C = s * b2; if (A < 0) { A = -A; B = -B; C = -C; }
      if (A === 0) continue;
      const e2 = gen(A, B, C), r2 = siT(m2, b2);
      return { text: ask + ' Rewrite in <i>y</i> = <i>mx</i> + <i>b</i> form first.', q: sysT(siT(m1, b1), e2),
        a: [`${cT(AM, `${e2}\\ \\Rightarrow\\ ${r2}`)}`, `${cT(BL, `m=${m1},\\ b=${b1}`)}\\qquad ${cT(AM, `m=${m2},\\ b=${b2}`)}`, reason(m1, m2, b1, b2), cT(PU, word[kind])],
        atext: pic(m1, b1, m2, b2, kind) };
    }
  }
  /* Mastery: the first line is ax ± y = c, the second is k times a line (2, 3 or −2 …): divide every term */
  function mas(r) {
    for (;;) {
      const { kind, m1, b1, m2, b2 } = pick(r);
      const s1 = r.pick([1, -1]); let A1 = -s1 * m1, B1 = s1, C1 = s1 * b1; if (A1 < 0) { A1 = -A1; B1 = -B1; C1 = -C1; }
      const k = r.pick([2, 3, 2, -2, 4]); let A2 = -k * m2, B2 = k, C2 = k * b2; if (A2 < 0) { A2 = -A2; B2 = -B2; C2 = -C2; }
      if (A1 === 0 || A2 === 0) continue;
      const e1 = gen(A1, B1, C1), e2 = gen(A2, B2, C2);
      const mid2 = `${tm(B2, 'y', true)}=${tm(-A2, 'x', true)}${C2 ? (C2 < 0 ? '' : '+') + C2 : ''}`;
      return { text: ask + ' Rewrite both equations first.', q: sysT(e1, e2),
        a: [`${cT(BL, `${e1}\\ \\Rightarrow\\ ${siT(m1, b1)}`)}`, `${cT(AM, `${e2}\\ \\Rightarrow\\ ${mid2}\\ \\Rightarrow\\ ${siT(m2, b2)}`)}\\quad(\\div ${B2 < 0 ? `(${B2})` : B2})`,
          reason(m1, m2, b1, b2), cT(PU, word[kind])],
        atext: pic(m1, b1, m2, b2, kind) };
    }
  }
  standup('u8l2', {
    intro: 'At your whiteboard: one solution, no solution, or infinitely many? Get both equations into y = mx + b, then compare the slopes and the y-intercepts. Sketch the lines to show it.',
    levels: { BEG: beg, PRG: prg, MAS: mas }
  });
}
