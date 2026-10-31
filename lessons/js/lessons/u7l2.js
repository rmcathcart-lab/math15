/* Math 15 · Unit 7 · Lesson 2 — Slope–Intercept Form: y = mx + b.
 * Warm-up (Pick a Phone Plan: three phones, try a month of GB), and the explainers:
 *   meaning (m = the step in y each time x goes up 1, b = where x = 0; table, graph and the two sentences; Example 1 checks),
 *   phones (the warm-up plans as lines: the fee is b, the cost per GB is m; the big one at 6 GB),
 *   sliders (STAR: an m slider tilts the line, a b slider slides it, live equation; draggable; Example 2 check),
 *   rearrange (get y alone: the x-term moves across and changes sign, then goes to the front with its sign; Example 3),
 *   balance (a balance scale: divide EVERY term; the trap of dividing only some; Example 4 checks),
 *   tableCheck (substitute each x, compare with the table; one failing row is enough; Example 5 checks),
 *   context (Example 6: cost = 35 + 20h, b is the call-out fee, m is $20 per hour, a 4-hour job).
 * Colours: m and lines blue, b / y-intercept green, run amber, rise purple; wrong red.
 * dynLine, the balance and the slope-triangle colours come from the Math 10C u7l1 page. */
import {
  h, tex, add, box, place, Graph, stamp, stampIn, mountExplainers, pop, fadeIn, appear, sleep, tween, anim,
  pairTex, svgEl, liveCtx, pulse, drawIn, COLORS
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(String(s));
const RUN = COLORS.amber, RISE = COLORS.purple, LINE = COLORS.blue, BC = COLORS.green, RED = COLORS.red, INK = COLORS.ink, GRAY = COLORS.gray;
const cM = (s) => `\\textcolor{${LINE}}{${s}}`, cB = (s) => `\\textcolor{${BC}}{${s}}`, cR = (s) => `\\textcolor{${RED}}{${s}}`;
const show = (c, el) => fadeIn(c, el, 320);
const hide = (el) => { if (el) el.style.opacity = 0; return el; };
const panel = (stage, x, y, w, hh, title, cls = '') => add(stage, box(h('div', 'u7l2-panel ' + cls, title ? `<div class="u7l2-ph">${title}</div>` : ''), w, hh), x, y);
const line = (p, html, cls = '') => { const d = h('div', 'u7l2-line ' + cls, html); p.appendChild(d); return d; };
const P2 = (x, y) => pairTex(x, y);
const norm2 = (x, y) => { const L = Math.hypot(x, y) || 1; return [x / L, y / L]; };

/** y = mx + b as TeX (integers), m blue and b green unless o.color === false; o.x / o.y rename the variables */
function eqTex(m, b, o = {}) {
  const col = o.color !== false, C1 = col ? cM : (s) => s, C2 = col ? cB : (s) => s, X = o.x || 'x', Y = o.y || 'y';
  let s = '';
  if (m !== 0) s = (m === 1 ? '' : m === -1 ? C1('-') : C1(String(m))) + X;
  if (b !== 0 || !s) { if (!s) s = C2(String(b)); else s += b < 0 ? `\\mathbin{${C2('-')}}${C2(Math.abs(b))}` : `+${C2(b)}`; }
  return `${Y}=${s}`;
}
/** coefficient in front of a variable: 1 → '', −1 → '-' */
const co = (a) => (a === 1 ? '' : a === -1 ? '-' : String(a));
const sgnT = (v) => (v < 0 ? `-${Math.abs(v)}` : `+${v}`);

/** a whole line y = m x + b read from get() each redraw (so it can tilt and slide), arrows at the window edges (10C u7l1) */
function dynLine(G, get, o = {}) {
  return G.curve(() => {
    const L = get(); if (!L) return { subs: [] };
    const a = [0, L.b], d = [1, L.m];
    const t = G._clipT(a, d, -Infinity, Infinity); if (!t) return { subs: [] };
    const P = (s) => G.toPx(a[0] + d[0] * s, a[1] + d[1] * s), A = P(t[0]), B = P(t[1]);
    return { subs: [[A, B]], ends: [{ p: A, d: norm2(A[0] - B[0], A[1] - B[1]), s: 'arrow', k: 0, si: 0, last: false }, { p: B, d: norm2(B[0] - A[0], B[1] - A[1]), s: 'arrow', k: 1, si: 0, last: true }] };
  }, Object.assign({ color: LINE, width: 4.5 }, o), 'bk-line', G.layers.data);
}
/** one step of a slope: run (amber) from (x, y), then rise (purple); returns the two segments */
async function stepTri(c, G, x, y, run, rise, ms = 260) {
  const a = G.segment([x, y], [x + run, y], { color: RUN, width: 4.5 }), b = G.segment([x + run, y], [x + run, y + rise], { color: RISE, width: 4.5 });
  await G.drawIn(a, ms, c); await G.drawIn(b, ms, c); return [a, b];
}

/** position of el inside stage, in stage px (the stage may be scaled to fit beside the sidebar) */
function relPos(stage, el) {
  const s = stage.getBoundingClientRect(), r = el.getBoundingClientRect(), k = s.width / (stage.offsetWidth || s.width) || 1;
  return [(r.left - s.left) / k, (r.top - s.top) / k, r.width / k, r.height / k];
}
/** a copy of fromEl flies onto toEl (hidden until it lands) */
async function fly(c, stage, html, fromEl, toEl, cls = '') {
  toEl.style.opacity = 0;
  const [fx, fy, fw, fh] = relPos(stage, fromEl), [tx, ty, tw, th] = relPos(stage, toEl);
  const chip = add(stage, h('div', 'u7l2-fly ' + cls, html), 0, 0);
  const cw = chip.offsetWidth, ch = chip.offsetHeight;
  const x0 = fx + fw / 2 - cw / 2, y0 = fy + fh / 2 - ch / 2, x1 = tx + tw / 2 - cw / 2, y1 = ty + th / 2 - ch / 2;
  chip.style.left = x0 + 'px'; chip.style.top = y0 + 'px';
  await anim(c, chip, [{ transform: 'translate(0, 0)' }, { transform: `translate(${x1 - x0}px, ${y1 - y0}px)` }], 700);
  chip.remove(); toEl.style.opacity = 1;
}

/* =============================== warm-up: pick a phone plan =============================== */
const PLANS = [
  { k: 'A', name: 'Spark', fee: 20, per: 5, eq: 'C=5g+20', col: '#1f5bd6' },
  { k: 'B', name: 'Orbit', fee: 35, per: 2, eq: 'C=35+2g', col: '#d9480f' },
  { k: 'C', name: 'Pixel', fee: 0, per: 10, eq: 'C=10g', col: '#7b4fc4' }
];
function mountPhones() {
  const host = document.getElementById('u7l2-phones'), row = document.getElementById('u7l2-gbrow'); if (!host) return;
  const costs = PLANS.map((p) => {
    const w = h('div', 'u7l2-pwrap');
    w.innerHTML = `<div class="u7l2-phone"><div class="u7l2-scr"><div class="u7l2-pt">Plan ${p.k}: ${p.name}</div><div class="u7l2-fee">$${p.fee}</div><div class="u7l2-sm">a month, plus</div><div class="u7l2-per">$${p.per}</div><div class="u7l2-sm">for every GB used</div></div><div class="u7l2-hb"></div></div><div class="u7l2-peq">${T(p.eq)}</div><div class="u7l2-pcost">&nbsp;</div>`;
    host.appendChild(w); return w;
  });
  let cur = null;
  const btns = [];
  for (let g = 0; g <= 8; g++) {
    const b = h('button', 'pill small u7l2-gb', `${g} GB`); b.type = 'button'; row.appendChild(b); btns.push(b);
    b.addEventListener('click', () => {
      cur = cur === g ? null : g; btns.forEach((x, i) => x.classList.toggle('on', i === cur));
      const vals = PLANS.map((p) => p.fee + p.per * g), lo = Math.min(...vals);
      costs.forEach((w, i) => {
        const p = PLANS[i], el = w.querySelector('.u7l2-pcost');
        w.classList.toggle('u7l2-best', cur != null && vals[i] === lo);
        if (cur == null) { el.innerHTML = '&nbsp;'; return; }
        const work = p.k === 'A' ? `5(${g})+20` : p.k === 'B' ? `35+2(${g})` : `10(${g})`;
        el.innerHTML = `${T(`${work}=${vals[i]}`)}: <b>$${vals[i]}</b>`;
      });
    });
  }
}

/* =============================== explainer: what m and b mean =============================== */
const MN = {
  notes: { label: `${T('y=2x+3')} (notes)`, m: 2, b: 3, xs: [0, 1, 2, 3], win: { xmin: -3, xmax: 5, ymin: -2, ymax: 11 } },
  e1a: { label: 'Example 1(a) check', m: 4, b: 7, xs: [-2, -1, 0, 1], win: { xmin: -4, xmax: 3, ymin: -3, ymax: 14, ystep: 1, ylabels: 2 } },
  e1b: { label: 'Example 1(b) check', m: -5, b: 1, xs: [-1, 0, 1, 2], win: { xmin: -3, xmax: 4, ymin: -10, ymax: 8, ystep: 1, ylabels: 2 } }
};
const meaning = {
  title: 'm is the step, b is the start',
  height: 480,
  minW: 900,
  choices: Object.keys(MN).map((k) => ({ v: k, label: MN[k].label })),
  intro: (k) => `What do ${T('m')} and ${T('b')} tell you about ${T(eqTex(MN[k].m, MN[k].b, { color: false }))}?`,
  make(stage, k, ex) {
    const { m, b, xs, win } = MN[k], ys = xs.map((x) => m * x + b), i0 = xs.indexOf(0), up = m > 0 ? 'increases' : 'decreases';
    const eqb = add(stage, box(h('div', 'u7l2-eqbox', T(eqTex(m, b))), 420, 66), 14, 8);
    const tags = add(stage, h('div', 'u7l2-tags', `<span class="u7l2-tag u7l2-tm">${T(cM('m=' + m))}: slope</span><span class="u7l2-tag u7l2-tb">${T(cB('b=' + b))}: y-intercept</span>`), 14, 84); hide(tags);
    const tb = add(stage, h('div', 'u7l2-vtab'), 14, 136);
    tb.innerHTML = `<div class="u7l2-vth">${T('x')}</div><div class="u7l2-vth">${T('y')}</div>` + xs.map((x, i) => `<div class="u7l2-vtd" data-r="${i}">${T(x)}</div><div class="u7l2-vtd u7l2-vy" data-r="${i}">${T(ys[i])}</div>`).join('');
    const ycells = [...tb.querySelectorAll('.u7l2-vy')]; ycells.forEach(hide);
    const rowEls = (i) => [...tb.querySelectorAll(`[data-r="${i}"]`)];
    const diffs = xs.slice(1).map((x, i) => hide(add(stage, h('div', 'u7l2-diff', `${m > 0 ? '+' : '−'}${Math.abs(m)}`), 196, 136 + 44 + 46 * i + 23 - 13)));
    const sent = panel(stage, 14, 376, 420, 94, ''); hide(sent);
    const G = new Graph(stage, Object.assign({ x: 458, y: 8, width: ex.W - 472, height: 464, fontSize: 15 }, win));
    return [
      { cap: `In ${T(eqTex(m, b))}, ${T(cM('m=' + m))} is the number times ${T('x')} and ${T(cB('b=' + b))} is the number on its own.`,
        run: async (c) => { await show(c, tags); } },
      { cap: `Make a table. Each time ${T('x')} goes up by 1, ${T('y')} ${up} by <b>${Math.abs(m)}</b>. That step is ${T(cM('m'))}.`,
        run: async (c) => { for (const y of ycells) await pop(c, y, 200); for (const d of diffs) await pop(c, d, 220); } },
      { cap: `When ${T('x=0')}, ${T('y=' + b)}. So the line crosses the ${T('y')}-axis at ${T(cB(P2(0, b)))}. That is ${T(cB('b'))}.`,
        run: async (c) => { rowEls(i0).forEach((e) => e.classList.add('u7l2-hl0')); await G.reveal(G.point(0, b, { color: BC, r: 8, label: T(P2(0, b)), pos: 'w', labelCls: 'u7l2-bint', gap: 10 }), c); } },
      { cap: `On the graph: from ${T(P2(0, b))}, every step <b>right 1</b> goes <b>${m > 0 ? 'up' : 'down'} ${Math.abs(m)}</b>. The table’s points line up.`,
        run: async (c) => {
          for (let i = 0; i < xs.length - 1; i++) await stepTri(c, G, xs[i], ys[i], 1, m, 200);
          for (let i = 0; i < xs.length; i++) if (i !== i0) await pop(c, G.point(xs[i], ys[i], { color: INK, r: 6 }), 150);
          await G.drawIn(G.line({ m, b }, { color: LINE, width: 4 }), 600, c);
        } },
      { cap: `Every time ${T('x')} increases by 1, ${T('y')} <b>${up} by ${Math.abs(m)}</b>. The line crosses the ${T('y')}-axis at ${T(P2(0, b))}.`,
        run: async (c) => {
          sent.innerHTML = `<div class="u7l2-line">Every time ${T('x')} increases by 1, ${T('y')} <b class="u7l2-cm">${up} by ${Math.abs(m)}</b>.</div><div class="u7l2-line">The line crosses the ${T('y')}-axis at <b class="u7l2-cb">${T(P2(0, b))}</b>.</div>`;
          await show(c, sent);
        } }
    ];
  }
};

/* =============================== explainer: the phone plans are lines =============================== */
const phones = {
  title: 'Each plan is a line: b is the fee, m is the cost per GB',
  height: 480,
  minW: 900,
  intro: 'Cost is <b>y</b>, GB is <b>x</b>. Press <b>Next</b>.',
  make(stage, k, ex) {
    const G = new Graph(stage, { x: 10, y: 8, width: 540, height: 464, xmin: 0, xmax: 8, ymin: 0, ymax: 90, ystep: 10, ylabels: 10, xtitle: '\\text{GB}', ytitle: '\\text{cost (\\$)}', fontSize: 15, origin: true });
    const P = panel(stage, 572, 8, ex.W - 586, 464, 'As y = mx + b');
    const tb = h('div', 'u7l2-ptab'); P.appendChild(tb);
    tb.innerHTML = `<div class="u7l2-pth">Plan</div><div class="u7l2-pth">${T('y=mx+b')}</div><div class="u7l2-pth">${T(cM('m'))}</div><div class="u7l2-pth">${T(cB('b'))}</div>`;
    const cells = PLANS.map((p) => {
      const r = [h('div', 'u7l2-ptd u7l2-pk', `<b style="color:${p.col}">${p.k}</b>`), h('div', 'u7l2-ptd', T(eqTex(p.per, p.fee))), h('div', 'u7l2-ptd', T(cM(p.per))), h('div', 'u7l2-ptd', T(cB(p.fee)))];
      r.forEach((e) => { tb.appendChild(e); hide(e); }); return r;
    });
    const note = h('div', 'u7l2-pnote'); P.appendChild(note); hide(note);
    const ln = (p) => G.fn((x) => p.per * x + p.fee, { color: p.col, width: 4, from: 0 });
    const lab = (p, x, y, pos) => G.label(x, y, `<b>${p.k}</b>`, { pos, cls: 'u7l2-plab', color: p.col });
    const [A, B, C] = PLANS;
    return [
      { cap: `Rename the letters: cost ${T('C')} is ${T('y')}, GB ${T('g')} is ${T('x')}. Plan A, ${T('C=5g+20')}, is ${T(eqTex(5, 20))}.`,
        run: async (c) => { await show(c, cells[0][0]); await show(c, cells[0][1]); } },
      { cap: `At 0 GB, Plan A already costs $20: the line starts at ${T(cB('(0,\\ 20)'))}. That fee is ${T(cB('b=20'))}.`,
        run: async (c) => { await G.reveal(G.point(0, 20, { color: BC, r: 8 }), c); await show(c, cells[0][3]); } },
      { cap: `Every GB adds $5: right 1, up 5. That rate is the slope, ${T(cM('m=5'))}.`,
        run: async (c) => { await stepTri(c, G, 0, 20, 1, 5, 300); await stepTri(c, G, 1, 25, 1, 5, 200); await G.drawIn(ln(A), 600, c); lab(A, 7.6, 58, 'n'); await show(c, cells[0][2]); } },
      { cap: `Plan B, ${T('C=35+2g')}: write the ${T('x')}-term first, ${T(eqTex(2, 35))}. It <b>starts higher</b> (${T(cB('b=35'))}) but <b>climbs slower</b> (${T(cM('m=2'))}).`,
        run: async (c) => { for (const e of cells[1]) await show(c, e); await G.reveal(G.point(0, 35, { color: BC, r: 8 }), c); await G.drawIn(ln(B), 600, c); lab(B, 7.6, 50, 's'); } },
      { cap: `Plan C, ${T('C=10g')}: ${T(eqTex(10, 0))}. No fee, so ${T(cB('b=0'))}: it starts at the origin. ${T(cM('m=10'))}: the <b>steepest</b> line.`,
        run: async (c) => { for (const e of cells[2]) await show(c, e); await G.reveal(G.point(0, 0, { color: BC, r: 8 }), c); await G.drawIn(ln(C), 600, c); lab(C, 8.4, 86, 'w'); } },
      { cap: `The big one: go up from ${T('x=6')}. A is at $50, B at $47, C at $60. The <b>lowest</b> line is the cheapest plan: <b>Orbit</b>.`,
        run: async (c) => {
          await G.drawIn(G.segment([6, 0], [6, 88], { color: GRAY, width: 2.5, dash: true }), 400, c);
          for (const p of [C, A, B]) { const v = p.fee + p.per * 6; await G.reveal(G.point(6, v, { color: p.col, r: 7, label: `$${v}`, pos: p.k === 'B' ? 'se' : 'nw', labelCls: 'u7l2-vlab', labelColor: p.col }), c); }
          note.innerHTML = `At 6 GB: <b style="color:${B.col}">B = $47</b> is the lowest line.`; await show(c, note);
        } }
    ];
  }
};

/* =============================== explainer: m and b sliders (star) =============================== */
/** a horizontal slider: integers min … max; onSet(v) while dragging. Returns { el, set(v) } */
function slider(host, o) {
  const W = o.w, H = 92, pad = 22, x0 = pad, x1 = W - pad, ty = 54, n = o.max - o.min;
  const el = box(h('div', 'u7l2-sl ' + (o.cls || '')), W, H); el.setAttribute('data-tap', ''); host.appendChild(el);
  const sv = svgEl('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}` }, el);
  const hl = h('div', 'bk-html'); el.appendChild(hl);
  const X = (v) => x0 + (v - o.min) / n * (x1 - x0);
  svgEl('line', { x1: x0, x2: x1, y1: ty, y2: ty, stroke: '#cfd5df', 'stroke-width': 8, 'stroke-linecap': 'round' }, sv);
  for (let v = o.min; v <= o.max; v++) {
    const big = v % o.labelStep === 0;
    svgEl('line', { x1: X(v), x2: X(v), y1: ty + 8, y2: ty + (big ? 18 : 13), stroke: INK, 'stroke-width': big ? 2 : 1.2 }, sv);
    if (big) { const t = h('div', 'bk-lab u7l2-sltick', T(v)); hl.appendChild(t); place(t, X(v), ty + 19, 's', 0); }
  }
  const nm = h('div', 'bk-lab u7l2-slname', o.name); nm.style.color = o.color; hl.appendChild(nm); place(nm, 4, 4, 'se', 0);
  const fillL = svgEl('line', { x1: X(0), x2: X(0), y1: ty, y2: ty, stroke: o.color, 'stroke-width': 8, 'stroke-linecap': 'round' }, sv);
  const knob = svgEl('circle', { cx: X(0), cy: ty, r: 14, fill: o.color, stroke: '#fff', 'stroke-width': 3 }, sv);
  const val = h('div', 'bk-lab u7l2-slval'); val.style.color = o.color; hl.appendChild(val);
  const set = (v) => {
    const x = X(Math.max(o.min, Math.min(o.max, v)));
    knob.setAttribute('cx', x); fillL.setAttribute('x2', x); val.innerHTML = T(Math.round(v * 10) / 10 === Math.round(v) ? Math.round(v) : (Math.round(v * 10) / 10)); place(val, x, ty - 16, 'n', 0);
  };
  let drag = false;
  const move = (e) => { const r = sv.getBoundingClientRect(), k = r.width / W, px = (e.clientX - r.left) / k; const v = Math.round(o.min + (px - x0) / (x1 - x0) * n); o.onSet(Math.max(o.min, Math.min(o.max, v))); };
  el.addEventListener('pointerdown', (e) => { e.preventDefault(); e.stopPropagation(); drag = true; try { el.setPointerCapture(e.pointerId); } catch (er) { /* */ } move(e); });
  el.addEventListener('pointermove', (e) => { if (drag) move(e); });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((t) => el.addEventListener(t, () => { drag = false; }));
  return { el, set };
}
const EX2 = [
  { k: '(a)', m: 5, b: 6, say: `the coefficient of ${T('x')} is ${T(cM('m=5'))}, the constant is ${T(cB('b=6'))}` },
  { k: '(b)', m: -3, b: 2, say: `the sign belongs to ${T('m')}: ${T(cM('m=-3'))}, and ${T(cB('b=2'))}` },
  { k: '(c)', m: 1, b: -8, say: `a bare ${T('x')} means ${T(cM('m=1'))}, and ${T('-8')} gives ${T(cB('b=-8'))}` },
  { k: '(d)', m: -1, b: 4, say: `${T('-x')} means ${T(cM('m=-1'))}, and ${T(cB('b=4'))}` },
  { k: '(e)', m: 7, b: 0, say: `${T(cM('m=7'))}; no constant term, so ${T(cB('b=0'))}: through the origin` },
  { k: '(f)', m: 0, b: -9, say: `no ${T('x')}-term, so ${T(cM('m=0'))} (flat), and ${T(cB('b=-9'))}` }
];
const SL = {
  tilt: { label: 'Slide m', m: 1, b: 1 },
  slide: { label: 'Slide b', m: 2, b: 0 },
  ex2: { label: 'Example 2 check', m: 0, b: 0 }
};
const sliders = {
  title: 'Two sliders: m tilts the line, b slides it',
  height: 480,
  minW: 900,
  choices: Object.keys(SL).map((k) => ({ v: k, label: SL[k].label })),
  intro: 'Press <b>Next</b> to move the sliders, or <b>drag either slider</b> yourself at any time.',
  make(stage, k, ex) {
    const d = SL[k];
    const G = new Graph(stage, { x: 10, y: 8, width: 464, height: 464, xmin: -10, xmax: 10, ymin: -10, ymax: 10, xlabels: 2, ylabels: 2, fontSize: 14 });
    const PX = 494, PW = ex.W - PX - 14, P = panel(stage, PX, 8, PW, 464, '');
    const eqb = h('div', 'u7l2-eqbox u7l2-eqbig'); P.appendChild(eqb);
    const st = { m: d.m, b: d.b, mi: d.m };
    let tri = [];
    const Lc = dynLine(G, () => ({ m: st.m, b: st.b }));
    const dot = G.point(0, st.b, { color: BC, r: 8.5 });
    const ro = h('div', 'u7l2-ro');
    const mS = slider(P, { w: PW - 28, min: -7, max: 7, labelStep: 1, color: LINE, name: `${T(cM('m'))} tilts`, onSet: (v) => { st.m = st.mi = v; render(true); } });
    const bS = slider(P, { w: PW - 28, min: -10, max: 10, labelStep: 2, color: BC, name: `${T(cB('b'))} slides`, onSet: (v) => { st.b = v; render(true); } });
    P.appendChild(ro);
    const hint = h('div', 'u7l2-dhint', 'drag a slider: the line follows'); P.appendChild(hint);
    const setTri = () => { G.remove(...tri); tri = []; if (st.mi !== 0 && Math.abs(st.b + st.mi) <= 10) tri = [G.segment([0, st.b], [1, st.b], { color: RUN, width: 4.5 }), G.segment([1, st.b], [1, st.b + st.mi], { color: RISE, width: 4.5 })]; };
    const render = (exact) => {
      Lc._bkDraw(); G.moveTo(dot, 0, st.b); mS.set(st.m); bS.set(st.b);
      if (exact) {
        eqb.innerHTML = T(eqTex(st.mi, st.b)); setTri();
        ro.innerHTML = `<div class="u7l2-ro-r u7l2-ro-m">${T(cM('m=' + st.mi))}<span>${st.mi === 0 ? 'flat: y never changes' : `right 1, ${st.mi > 0 ? 'up' : 'down'} ${Math.abs(st.mi)}`}</span></div><div class="u7l2-ro-r u7l2-ro-b">${T(cB('b=' + st.b))}<span>crosses at ${T(P2(0, st.b))}</span></div>`;
      } else { G.remove(...tri); tri = []; }
    };
    render(true);
    const ghosts = [];
    const ghost = () => { const g = G.line({ m: st.m, b: st.b }, { color: GRAY, width: 2.5, arrows: false }); g.style.opacity = 0.5; ghosts.push(g); };
    const to = async (c, m, b, ms = 1200) => {
      const a0 = Math.atan(st.m), a1 = Math.atan(m), b0 = st.b;
      eqb.innerHTML = T(eqTex(m, b)); st.mi = m;
      await tween(c, ms, (t) => { st.m = Math.tan(a0 + (a1 - a0) * t); st.b = b0 + (b - b0) * t; render(false); });
      st.m = m; st.b = b; render(true); await pulse(c, eqb, 1.05);
    };
    if (k === 'tilt') {
      return [
        { cap: `Start with ${T(eqTex(1, 1))}: slope ${T(cM('1'))}, y-intercept ${T(cB('1'))}.`, run: async (c) => { await G.drawIn(Lc, 600, c); await pop(c, dot); } },
        { cap: `Slide ${T(cM('m'))} up to ${T(cM('3'))}: <b>steeper</b>. Every step right 1 now goes up 3.`, run: async (c) => { ghost(); await to(c, 3, 1); } },
        { cap: `${T(cM('m=0'))}: <b>flat</b>. The equation is just ${T('y=1')}, a horizontal line.`, run: async (c) => { ghost(); await to(c, 0, 1); } },
        { cap: `Below zero, ${T('m')} is <b>negative</b> and the line <b>falls</b>: ${T(cM('m=-2'))}, down 2 for every 1 across.`, run: async (c) => { ghost(); await to(c, -2, 1); } },
        { cap: `Every line turned around ${T(P2(0, 1))}. Changing ${T(cM('m'))} changes the <b>tilt</b>; the ${T('y')}-intercept never moved.`, run: async (c) => { ghost(); await pulse(c, dot, 1.6, 600); } }
      ];
    }
    if (k === 'slide') {
      return [
        { cap: `Start with ${T(eqTex(2, 0))}: here ${T(cB('b=0'))}, so the line goes through the origin.`, run: async (c) => { await G.drawIn(Lc, 600, c); await pop(c, dot); } },
        { cap: `Slide ${T(cB('b'))} to ${T(cB('4'))}: the whole line moves <b>up 4</b>. Same tilt: still ${T(cM('m=2'))}.`, run: async (c) => { ghost(); await to(c, 2, 4); } },
        { cap: `Slide ${T(cB('b'))} to ${T(cB('-5'))}: it moves <b>down</b>. The green dot rides the ${T('y')}-axis: it is always ${T('(0,\\ b)')}.`, run: async (c) => { ghost(); await to(c, 2, -5); } },
        { cap: `Same slope every time, so the copies are <b>parallel</b>. Changing ${T(cB('b'))} only <b>slides</b> the line.`, run: async (c) => { ghost(); await pulse(c, eqb, 1.06); } }
      ];
    }
    return EX2.map((e, i) => ({
      cap: `${e.k} ${T(eqTex(e.m, e.b, { color: false }))}: ${e.say}.`,
      run: async (c) => { if (i === 0) await G.drawIn(Lc, 400, c); else ghost(); await to(c, e.m, e.b, 1100); }
    }));
  }
};

/* =============================== explainer: rearrange (get y alone) =============================== */
const RA = {
  notes: { label: `${T('2x+y=7')} (notes)`, a: 2, c: 7 },
  e3a: { label: 'Example 3(a) check', a: 1, c: 9 },
  e3b: { label: '3(b) check', a: 5, c: 2 },
  e3c: { label: '3(c) check', a: -3, c: 6 }
};
const rearrange = {
  title: 'Get y alone, then put the x-term first',
  height: 470,
  minW: 900,
  choices: Object.keys(RA).map((k) => ({ v: k, label: RA[k].label })),
  intro: (k) => `Write ${T(`${co(RA[k].a)}x+y=${RA[k].c}`)} in the form ${T('y=mx+b')}.`,
  make(stage, k, ex) {
    const { a, c: cc } = RA[k], m = -a, b = cc;
    const xt = `${co(a)}x`, mv = `${co(-a)}x`;                       // the x-term, and the x-term after it moves
    const opW = a > 0 ? `Subtract ${T(`${co(a)}x`)}` : `Add ${T(`${co(-a)}x`)}`, opT = a > 0 ? `-${co(a)}x` : `+${co(-a)}x`;
    const mkRow = (y, parts) => {
      const r = add(stage, h('div', 'u7l2-row'), 30, y);
      const els = parts.map((p) => { const s = h('span', 'u7l2-tm' + (p[1] ? ' ' + p[1] : ''), T(p[0])); r.appendChild(s); return s; });
      return { r, els };
    };
    const r1 = mkRow(20, [[xt, 'u7l2-xt'], ['{}+{}'], ['y'], ['{}={}'], [String(cc)]]);
    const ann = add(stage, h('div', 'u7l2-ann'), 30, 84); hide(ann);
    const r2 = mkRow(150, [['y'], ['{}={}'], [String(cc)], [`{}${mv.startsWith('-') ? '-' : '+'}${mv.replace('-', '')}`, 'u7l2-xt']]); hide(r2.r);
    const r3 = mkRow(260, [['y'], ['{}={}'], [cM(mv), 'u7l2-mt'], [cB(`{}+${cc}`), 'u7l2-bt']]); hide(r3.r);
    const read = add(stage, h('div', 'u7l2-read', `${T(cM('m=' + m))}<span class="u7l2-gap"></span>${T(cB('b=' + b))}`), 30, 360); hide(read);
    const G = new Graph(stage, { x: ex.W - 330, y: 70, width: 316, height: 316, xmin: -10, xmax: 10, ymin: -10, ymax: 10, xlabels: 5, ylabels: 5, fontSize: 13 });
    const gl = add(stage, h('div', 'u7l2-glab', 'Same line, either way'), ex.W - 330, 34); hide(gl);
    return [
      { cap: `${T('y')} is not alone yet: the ${T('x')}-term ${T(xt)} is on its side of the equation.`,
        run: async (c) => { r1.els[0].classList.add('u7l2-flag'); await pulse(c, r1.els[0], 1.2); } },
      { cap: `${opW} from both sides${a > 0 ? '' : ' (it was being subtracted)'}: the ${T('x')}-term crosses to the other side and its <b>sign flips</b>. ${T(`y=${cc}${mv.startsWith('-') ? '' : '+'}${mv}`)}.`,
        run: async (c) => {
          ann.innerHTML = `<span class="u7l2-op">${T(opT)}</span><span class="u7l2-op u7l2-op2">${T(opT)}</span>`; await show(c, ann);
          await show(c, r2.r); await fly(c, stage, T(xt), r1.els[0], r2.els[3], 'u7l2-flyx');
        } },
      { cap: `Write the ${T('x')}-term first. Each term keeps <b>its own sign</b>: ${T(eqTex(m, b, { color: false }))}.`,
        run: async (c) => { await show(c, r3.r); await Promise.all([fly(c, stage, T(r2.els[3].textContent && `${mv}`), r2.els[3], r3.els[2]), fly(c, stage, T(String(cc)), r2.els[2], r3.els[3])]); } },
      { cap: `Now read it off: ${T(cM('m=' + m))} and ${T(cB('b=' + b))}. Both forms are the <b>same line</b>.`,
        run: async (c) => { await pop(c, read); await show(c, gl); await G.drawIn(G.line({ m, b }, { color: LINE, width: 3.5 }), 600, c); await G.reveal(G.point(0, b, { color: BC, r: 7, label: T(P2(0, b)), pos: m < 0 ? 'ne' : 'nw', labelCls: 'u7l2-bint' }), c); } }
    ];
  }
};

/* =============================== explainer: keep the balance (from Math 10C u7l1) =============================== */
class Balance {
  constructor(stage, x, y, w = 560, hh = 252) {
    this.el = add(stage, box(h('div', 'u7l2-bal'), w, hh), x, y);
    const sv = this.svg = svgEl('svg', { width: w, height: hh, viewBox: `0 0 ${w} ${hh}` }, this.el);
    this.cx = w / 2; this.cy = 34; this.R = 158; this.hang = 120; this.th = 0;
    svgEl('path', { d: `M${this.cx - 8} ${this.cy} L${this.cx + 8} ${this.cy} L${this.cx + 10} ${hh - 22} L${this.cx - 10} ${hh - 22} Z`, fill: '#cfc7b5' }, sv);
    svgEl('path', { d: `M${this.cx - 70} ${hh - 4} L${this.cx + 70} ${hh - 4} L${this.cx + 40} ${hh - 24} L${this.cx - 40} ${hh - 24} Z`, fill: '#b9b0a0' }, sv);
    this.parts = [0, 1].map(() => ({
      s1: svgEl('line', { stroke: '#8a8f99', 'stroke-width': 2 }, sv), s2: svgEl('line', { stroke: '#8a8f99', 'stroke-width': 2 }, sv),
      pan: svgEl('path', { fill: '#e9e4d8', stroke: INK, 'stroke-width': 2.5 }, sv),
      txt: add(this.el, h('div', 'u7l2-pan'), 0, 0), div: hide(add(this.el, h('div', 'u7l2-div'), 0, 0))
    }));
    this.beam = svgEl('line', { stroke: INK, 'stroke-width': 9, 'stroke-linecap': 'round' }, sv);
    svgEl('circle', { cx: this.cx, cy: this.cy, r: 9, fill: '#fff', stroke: INK, 'stroke-width': 3 }, sv);
    this.draw();
  }
  draw() {
    const { cx, cy, R, hang } = this, a = this.th * Math.PI / 180, dx = R * Math.cos(a), dy = R * Math.sin(a);
    const ends = [[cx - dx, cy - dy], [cx + dx, cy + dy]];
    this.beam.setAttribute('x1', ends[0][0]); this.beam.setAttribute('y1', ends[0][1]); this.beam.setAttribute('x2', ends[1][0]); this.beam.setAttribute('y2', ends[1][1]);
    this.parts.forEach((p, i) => {
      const [ex, ey] = ends[i], py = ey + hang, hw = 104;
      p.s1.setAttribute('x1', ex); p.s1.setAttribute('y1', ey); p.s1.setAttribute('x2', ex - hw + 6); p.s1.setAttribute('y2', py);
      p.s2.setAttribute('x1', ex); p.s2.setAttribute('y1', ey); p.s2.setAttribute('x2', ex + hw - 6); p.s2.setAttribute('y2', py);
      p.pan.setAttribute('d', `M${ex - hw} ${py} Q${ex} ${py + 30} ${ex + hw} ${py} Z`);
      p.txt.style.left = ex + 'px'; p.txt.style.top = (py + 2) + 'px';
      p.div.style.left = ex + 'px'; p.div.style.top = (py + 22) + 'px';
    });
  }
  async set(c, L, R) { const ps = this.parts; if (L != null) ps[0].txt.innerHTML = T(L); if (R != null) ps[1].txt.innerHTML = T(R); await Promise.all([L != null && pop(c, ps[0].txt, 320), R != null && pop(c, ps[1].txt, 320)]); }
  async divs(c, txt) { for (const p of this.parts) { p.div.innerHTML = txt; await pop(c, p.div, 260); } }
  undiv() { this.parts.forEach((p) => hide(p.div)); }
  tilt(c, deg, ms = 700) { const a = this.th; return tween(c, ms, (t) => { this.th = a + (deg - a) * t; this.draw(); }); }
}
/* A x + K y = C (A = 0 when the x-term is already on the right: K y = M x + C) → y = m x + b */
const BL = {
  notes: { label: `${T('2y=6x+10')} (notes)`, K: 2, M: 6, C: 10 },
  trap: { label: 'Trap: only some terms', K: 2, M: 6, C: 10, trap: true },
  e4a: { label: 'Example 4(a) check', K: 3, M: 9, C: 12 },
  e4b: { label: '4(b) check', A: 4, K: 2, C: 10 },
  e4c: { label: '4(c) check', A: 9, K: 3, C: 21 }
};
const balance = {
  title: 'Divide every term, and keep the balance',
  height: 470,
  minW: 940,
  choices: Object.keys(BL).map((k) => ({ v: k, label: BL[k].label })),
  intro: 'An equation is a balance. Whatever you do to one side, do to the <b>whole</b> other side. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = BL[k], K = d.K, C = d.C, M = d.A ? -d.A : d.M, m = M / K, b = C / K;
    const B = new Balance(stage, 14, 8);
    const alg = panel(stage, 14, 272, 560, 184, '', 'u7l2-alg');
    const GX = 590, GW = ex.W - GX - 14;
    const G = new Graph(stage, { x: GX, y: 60, width: GW, height: GW, xmin: -10, xmax: 10, ymin: -10, ymax: 10, xlabels: 5, ylabels: 5, fontSize: 13 });
    const L = (html) => line(alg, html);
    const rhs = `${co(M)}x+${C}`.replace('+-', '-');
    const fin = eqTex(m, b, { color: false });
    const okDot = () => G.point(0, b, { color: BC, r: 8, label: T(P2(0, b)), pos: m < 0 ? 'ne' : 'nw', labelCls: 'u7l2-bint' });
    const slopeTri = async (c) => { await stepTri(c, G, 0, b, 1, m, 300); };
    const divStep = () => ({
      cap: `${T(`${K}y`)} means <b>${K === 2 ? 'two' : K === 3 ? 'three' : K} ${T('y')}’s</b>. Divide by ${K}, and to keep the balance, divide <b>every term</b>.`,
      run: async (c) => { B.undiv(); await B.divs(c, `÷ ${K}`); await B.set(c, `\\dfrac{${K}y}{${cR(K)}}`, `\\dfrac{${co(M)}x}{${cR(K)}}+\\dfrac{${C}}{${cR(K)}}`); L(T(`\\dfrac{${K}y}{${cR(K)}}=\\dfrac{${co(M)}x}{${cR(K)}}+\\dfrac{${C}}{${cR(K)}}`)); }
    });
    const endStep = () => ({
      cap: `${T(eqTex(m, b))}: still balanced. Now ${T(cM('m=' + m))} and ${T(cB('b=' + b))}: the line crosses at ${T(P2(0, b))}.`,
      run: async (c) => { B.undiv(); await B.set(c, 'y', fin.slice(2)); L(`${T(fin)} ✓`); await G.reveal(okDot(), c); await slopeTri(c); }
    });
    const lineIn = (c) => G.drawIn(G.line({ m, b }, { color: LINE, width: 4 }), 600, c);
    if (d.trap) {
      let wrong = null, no = null;
      return [
        { cap: `${T(`${K}y=${rhs}`)} balances. Its graph is the blue line. Divide by ${K}…`,
          run: async (c) => { await B.set(c, `${K}y`, rhs); L(T(`${K}y=${rhs}`)); await lineIn(c); } },
        { cap: `…but only <b>some</b> of the terms: ${T(`y=${m}x+${C}`)}. The balance <b>tips</b>, and the red line misses the graph.`,
          run: async (c) => { await B.set(c, `\\dfrac{${K}y}{${cR(K)}}`, `\\dfrac{${M}x}{${cR(K)}}+${C}`); await B.tilt(c, 9, 700); L(`${T(`y=${m}x+${C}`)} ✗`); wrong = G.line({ m, b: C }, { color: RED, width: 3.5, dash: true }); await G.drawIn(wrong, 600, c); no = stamp(stage, '✗', { ok: false, x: GX + 60, y: 100 }); await stampIn(c, no); } },
        { cap: `Divide <b>every</b> term by ${K}, the ${C} too. Level again.`,
          run: async (c) => { G.remove(wrong); if (no) no.remove(); await B.set(c, null, `\\dfrac{${M}x}{${cR(K)}}+\\dfrac{${C}}{${cR(K)}}`); await B.tilt(c, 0, 600); L(T(`\\dfrac{${K}y}{${cR(K)}}=\\dfrac{${M}x}{${cR(K)}}+\\dfrac{${C}}{${cR(K)}}`)); } },
        endStep()
      ];
    }
    const S = [];
    if (d.A) {
      S.push({ cap: `${T(`${d.A}x+${K}y=${C}`)}: there is an ${T('x')}-term on ${T('y')}’s side. Move it first: <b>subtract ${T(`${d.A}x`)}</b> from both sides.`,
        run: async (c) => { await B.set(c, `${d.A}x+${K}y`, String(C)); L(T(`${d.A}x+${K}y=${C}`)); await lineIn(c); await B.divs(c, T(`-${d.A}x`)); } });
      S.push({ cap: `${T(`${K}y=${rhs}`)}. The ${T('y')}-term is alone on the left, but ${T('y')} still has a coefficient.`,
        run: async (c) => { B.undiv(); await B.set(c, `${K}y`, rhs); L(`${T(`${K}y=${rhs}`)} <span class="u7l2-soft">(subtract ${T(`${d.A}x`)})</span>`); } });
    } else {
      S.push({ cap: `${T(`${K}y=${rhs}`)}: the two sides balance. Can we read ${T(`m=${M}`)} and ${T(`b=${C}`)} straight off? <b>No</b>: ${T('y')} is not alone.`,
        run: async (c) => { await B.set(c, `${K}y`, rhs); L(T(`${K}y=${rhs}`)); await lineIn(c); } });
    }
    S.push(divStep(), endStep());
    return S;
  }
};

/* =============================== explainer: does the table match? =============================== */
const TC = {
  e5a: { label: 'Example 5(a) check', m: 3, b: 2, rows: [[-1, -1], [0, 2], [1, 5], [2, 8]], win: { xmin: -3, xmax: 4, ymin: -3, ymax: 10 } },
  e5b: { label: 'Example 5(b) check', m: 4, b: -1, rows: [[0, -1], [1, 3], [2, 7], [3, 12]], win: { xmin: -2, xmax: 4, ymin: -3, ymax: 14, ystep: 1, ylabels: 2 } }
};
const tableCheck = {
  title: 'Check every pair: one miss is enough',
  height: 470,
  minW: 900,
  choices: Object.keys(TC).map((k) => ({ v: k, label: TC[k].label })),
  intro: (k) => `Does the table match ${T(eqTex(TC[k].m, TC[k].b, { color: false }))}?`,
  make(stage, k, ex) {
    const { m, b, rows, win } = TC[k], eq = eqTex(m, b, { color: false });
    const tb = add(stage, h('div', 'u7l2-ctab'), 14, 14);
    tb.innerHTML = `<div class="u7l2-cth">${T('x')}</div><div class="u7l2-cth">table’s ${T('y')}</div><div class="u7l2-cth">${T(`${co(m)}x${b < 0 ? '-' : '+'}${Math.abs(b)}`)}</div><div class="u7l2-cth"></div>` +
      rows.map(([x, y], i) => `<div class="u7l2-ctd">${T(x)}</div><div class="u7l2-ctd">${T(y)}</div><div class="u7l2-ctd u7l2-cv" data-i="${i}"></div><div class="u7l2-ctd u7l2-ck" data-i="${i}"></div>`).join('');
    const cv = [...tb.querySelectorAll('.u7l2-cv')], ck = [...tb.querySelectorAll('.u7l2-ck')];
    const verdict = add(stage, box(h('div', 'u7l2-verdict'), 470, 84), 14, 374); hide(verdict);
    const G = new Graph(stage, Object.assign({ x: 510, y: 8, width: ex.W - 524, height: 460, fontSize: 14 }, win));
    const vals = rows.map(([x]) => m * x + b), oks = rows.map(([, y], i) => y === vals[i]), allOk = oks.every(Boolean);
    const bad = oks.indexOf(false);
    const S = [{ cap: `The line ${T(eq)}. Substitute each ${T('x')} from the table and compare with the table’s ${T('y')}.`, run: (c) => G.drawIn(G.line({ m, b }, { color: LINE, width: 4 }), 600, c) }];
    rows.forEach(([x, y], i) => {
      const sub = x === 0 ? `${b}` : `${co(m)}(${x})${b < 0 ? '-' : '+'}${Math.abs(b)}=${vals[i]}`;
      S.push({
        cap: `${T('x=' + x)}: ${T(sub)}. The table says ${T(y)}${oks[i] ? ' ✓' : `: <b>not equal</b> ✗`}`,
        run: async (c) => {
          cv[i].innerHTML = T(vals[i]); await pop(c, cv[i], 260);
          ck[i].innerHTML = oks[i] ? '<b class="u7l2-okc">✓</b>' : '<b class="u7l2-badc">✗</b>'; ck[i].parentNode && cv[i].classList.toggle('u7l2-badrow', !oks[i]); await pop(c, ck[i], 260);
          await G.reveal(G.point(x, y, { color: oks[i] ? BC : RED, r: 7.5, coords: !oks[i], pos: 'nw', labelColor: RED }), c);
          if (!oks[i]) await G.drawIn(G.segment([x, vals[i]], [x, y], { color: RED, width: 3, dash: true }), 400, c);
        }
      });
    });
    S.push({
      cap: allOk ? `Every pair works, so <b>yes</b>: the table matches ${T(eq)}.` : `Three pairs work, but ${T(P2(...rows[bad]))} does not, so <b>no</b>: one failing pair is enough to reject the table.`,
      run: async (c) => { verdict.innerHTML = allOk ? `<b class="u7l2-okc">Yes.</b> Every ordered pair fits ${T(eq)}.` : `<b class="u7l2-badc">No.</b> At ${T('x=' + rows[bad][0])} the line gives ${T(vals[bad])}, not ${T(rows[bad][1])}.`; await pop(c, verdict); }
    });
    return S;
  }
};

/* =============================== explainer: b is the start, m is the rate (Example 6) =============================== */
const context = {
  title: 'b is the starting amount, m is the rate',
  height: 480,
  minW: 900,
  intro: 'Example 6: a landscaping company charges cost = 35 + 20h. Press <b>Next</b>.',
  make(stage, k, ex) {
    const f = (h2) => 35 + 20 * h2;
    const G = new Graph(stage, { x: 10, y: 8, width: 540, height: 464, xmin: 0, xmax: 6, ymin: 0, ymax: 160, ystep: 10, ylabels: 20, xtitle: 'h\\ (\\text{hours})', ytitle: '\\text{cost (\\$)}', fontSize: 15, origin: true });
    const P = panel(stage, 572, 8, ex.W - 586, 464, 'Landscaping');
    const l1 = line(P, T('\\text{cost}=35+20h'), 'u7l2-big');
    const l2 = line(P, T(`\\text{cost}=${cM('20')}h+${cB('35')}`), 'u7l2-big'); hide(l2);
    const l3 = line(P, `${T(cB('b=35'))}: the call-out fee, $35 at ${T('h=0')}`); hide(l3);
    const l4 = line(P, `${T(cM('m=20'))}: $20 for each extra hour`); hide(l4);
    const l5 = line(P, `${T('\\text{cost}=35+20(4)')}<br>${T('=35+80=\\$115')}`, 'u7l2-ansl'); hide(l5);
    void l1;
    return [
      { cap: `Write it in ${T('y=mx+b')} order: ${T(`\\text{cost}=${cM('20')}h+${cB('35')}`)}. So ${T(cM('m=20'))} and ${T(cB('b=35'))}.`,
        run: async (c) => { await show(c, l2); } },
      { cap: `${T(cB('b=35'))}: at ${T('h=0')} hours the cost is already $35. It is the <b>starting amount</b>, the call-out fee charged before any work.`,
        run: async (c) => { await G.reveal(G.point(0, 35, { color: BC, r: 8, label: T(cB('(0,\\ 35)')), pos: 'e', labelCls: 'u7l2-bint', gap: 10 }), c); await show(c, l3); } },
      { cap: `${T(cM('m=20'))}: every extra hour adds $20. Right 1 hour, up $20: that is the <b>rate</b>, $20 per hour.`,
        run: async (c) => { for (let i = 0; i < 3; i++) { await stepTri(c, G, i, f(i), 1, 20, 260); await pop(c, G.point(i + 1, f(i + 1), { color: INK, r: 6 }), 160); } await show(c, l4); } },
      { cap: `Join them: the cost line starts at ${T('(0,\\ 35)')} and climbs $20 per hour. (No negative hours, so it starts at ${T('h=0')}.)`,
        run: (c) => G.drawIn(G.fn(f, { from: 0, color: LINE, width: 4 }), 700, c) },
      { cap: `(c) A 4-hour job: ${T('35+20(4)=35+80=115')}, so <b>$115</b>. On the graph: up from ${T('h=4')} to the line, then across to $115.`,
        run: async (c) => {
          await G.drawIn(G.segment([4, 0], [4, 115], { color: RUN, width: 3, dash: true }), 400, c);
          await G.drawIn(G.segment([4, 115], [0, 115], { color: RISE, width: 3, dash: true }), 400, c);
          await G.reveal(G.point(4, 115, { color: RED, r: 8, label: T('(4,\\ 115)'), pos: 'nw', labelColor: RED }), c); await show(c, l5);
        } }
    ];
  }
};

/* =============================== mount =============================== */
mountPhones();
export const explainers = mountExplainers({ meaning, phones, sliders, rearrange, balance, tableCheck, context });
export const _test = { eqTex };

/* ============ Stand Up Break! (whiteboard stations) ============ */
(() => {
  const nz = (r, a, b) => { let v; do v = r.int(a, b); while (!v); return v; };
  const plain = (m, b) => eqTex(m, b, { color: false });
  // read m and b off y = mx + b, special cases included
  function read(r) {
    const kind = r.pick(['gen', 'gen', 'gen', 'one', 'neg1', 'noB', 'flat']);
    let m, b;
    if (kind === 'gen') { m = nz(r, -9, 9); if (Math.abs(m) === 1) m *= 2; b = nz(r, -9, 9); }
    else if (kind === 'one') { m = 1; b = nz(r, -9, 9); }
    else if (kind === 'neg1') { m = -1; b = nz(r, -9, 9); }
    else if (kind === 'noB') { m = nz(r, -9, 9); b = 0; }
    else { m = 0; b = nz(r, -9, 9); }
    const q = r.chance(0.25) && kind === 'gen' && b > 0 ? `y=${b}${m < 0 ? '-' : '+'}${Math.abs(m)}x` : plain(m, b);
    return { text: 'State the slope <i>m</i> and the <i>y</i>-intercept <i>b</i>.', q, a: [`m=${m},\\quad b=${b}`, ...(q === plain(m, b) ? [] : [plain(m, b)])] };
  }
  // ax + y = c (or y − ax = c): get y alone
  function solve1(r) {
    const a = nz(r, -8, 8), c = nz(r, -9, 9), m = -a, b = c;
    const q = r.chance(0.7) ? `${co(a)}x+y=${c}` : `y${a < 0 ? '+' : '-'}${co(Math.abs(a))}x=${c}`.replace('y-x', 'y-x');
    const mid = `y=${c}${-a < 0 ? '-' : '+'}${co(Math.abs(a))}x`;
    return { text: 'Rearrange into <i>y</i> = <i>mx</i> + <i>b</i>, then state <i>m</i> and <i>b</i>.', q: q.replace('+-', '-'), a: [mid, plain(m, b), `m=${m},\\quad b=${b}`] };
  }
  // Ax + Ky = C or Ky = Mx + C: move the x-term, divide every term
  function solve2(r) {
    const K = r.int(2, 5), m = nz(r, -6, 6), b = nz(r, -6, 6), M = m * K, C = b * K;
    if (r.chance(0.5)) {
      return { text: 'Rearrange into <i>y</i> = <i>mx</i> + <i>b</i>, then state <i>m</i> and <i>b</i>.', q: `${K}y=${co(M)}x${C < 0 ? '-' : '+'}${Math.abs(C)}`,
        a: [`\\dfrac{${K}y}{${K}}=\\dfrac{${co(M)}x}{${K}}${C < 0 ? '-' : '+'}\\dfrac{${Math.abs(C)}}{${K}}`, plain(m, b), `m=${m},\\quad b=${b}`] };
    }
    const A = -M;
    return { text: 'Rearrange into <i>y</i> = <i>mx</i> + <i>b</i>, then state <i>m</i> and <i>b</i>.', q: `${co(A)}x+${K}y=${C}`.replace('+-', '-'),
      a: [`${K}y=${co(M)}x${C < 0 ? '-' : '+'}${Math.abs(C)}`, `\\text{divide every term by } ${K}`, plain(m, b), `m=${m},\\quad b=${b}`] };
  }
  standup('u7l2', {
    intro: 'At your whiteboard station: get y alone first, then read m and b (each keeps its sign).',
    levels: {
      BEG: read,     // read m and b off y = mx + b, with the special cases
      PRG: solve1,   // ax + y = c: move the x-term across
      MAS: solve2    // y has a coefficient: divide every term
    }
  });
})();
/* ============ end Stand Up Break! ============ */
