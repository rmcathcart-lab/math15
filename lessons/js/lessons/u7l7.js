/* Math 15 · Unit 7 · Lesson 7 — The General Form of a Linear Equation.
 * Warm-up "Same Line, Different Outfit": six name tags for the line y = 2x − 3; tap a tag to test it with both dots.
 * Explainers:
 *   zeroMeter  (y = 2x − 5 and 2x − y − 5 = 0: a point hops along the line and the left side stays 0; off the line it isn't)
 *   costumes   (one line, six outfits: test two points, then the three rules leave exactly one; warm-up tags, y = ½x + 4)
 *   tidyUp     (the tidy-up machine: clear fractions, move every term left, fix the sign; walkthrough + Example 1 checks)
 *   everyTerm  (multiply EVERY term by the denominator: forgetting the constant makes a different line)
 *   tidyFrac   (the same machine with fractions; walkthrough + Example 2 checks)
 *   solveY     (isolate y, divide by B, read m and b, graph it, check a point; walkthrough + Example 3 checks)
 *   solveYFrac (the same when B is not ±1: a fraction for the slope; walkthrough + Example 4 checks)
 *   cover      (intercepts: cover the x-term (x = 0), then the y-term (y = 0), join them; walkthrough, Example 5, warm-up F)
 * Built from Math 10C u7l3 (TileEq tiles, the tidy-up stations, costumes, solveY, cover), cut to the Math 15 booklet:
 * the rules are "one side 0, integers, A positive" (no common-factor rule, no −A/B shortcut, no calculator).
 * Colours: run amber, rise purple, lines blue, y-intercept green, x-intercept magenta, impostors red.
 * Equation tiles: x-terms teal, y-terms blue, constants gray. */
import {
  h, tex, add, box, Graph, stamp, stampIn, mountExplainers, anim, pop, fadeIn, sleep, tween,
  pairTex, texNum, liveCtx, pulse, shake, COLORS
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const RUN = COLORS.amber, RISE = COLORS.purple, LINE = COLORS.blue, YI = COLORS.green, XI = '#b8327a', INK = COLORS.ink, NEG = COLORS.red;
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
const lcm = (a, b) => a / gcd(a, b) * b;
/** reduced [n, d] with d > 0 */
const red = (n, d = 1) => { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d) || 1; return [n / g, d / g]; };
/** TeX of a reduced fraction (sign in front); whole numbers plain */
const fr = (n, d = 1, big = true) => { const [a, b] = red(n, d); if (b === 1) return String(a); return (a < 0 ? '-' : '') + `\\${big ? 'd' : 't'}frac{${Math.abs(a)}}{${b}}`; };
const par = (v) => (v < 0 ? `(${v})` : String(v));
const hide = (el) => { if (el) el.style.opacity = 0; return el; };
const show = (c, el) => fadeIn(c, el, 320);
const fadeOut = (c, el, ms = 260) => (el ? anim(c, el, [{ opacity: 1 }, { opacity: 0 }], ms) : Promise.resolve());
const panel = (stage, x, y, w, hh, title, cls = '') => add(stage, box(h('div', 'u7l7-panel ' + cls, title ? `<div class="u7l7-ph">${title}</div>` : ''), w, hh), x, y);
/** TeX of a sum of terms [[n, d, v]…] (zeros dropped), e.g. 3x-5y+10 */
function polyTex(terms, big = false) {
  let s = '';
  terms.forEach(([a, b, v]) => {
    const [p, q] = red(a, b); if (!p) return;
    const m = Math.abs(p), mag = q === 1 ? (m === 1 && v ? '' : String(m)) : `\\${big ? 'd' : 't'}frac{${m}}{${q}}`;
    s += (s ? (p < 0 ? '-' : '+') : (p < 0 ? '-' : '')) + mag + v;
  });
  return s || '0';
}
/** Ax + By + C = 0 as TeX */
const gf = (A, B, C) => polyTex([[A, 1, 'x'], [B, 1, 'y'], [C, 1, '']]) + '=0';
/** y = mx + b as TeX (m = [n, d]) */
const siTex = (mn, md, b, big = true) => 'y=' + polyTex([[mn, md, 'x'], [b, 1, '']], big);
/** substitution of a value into a coefficient·variable term, e.g. 2(3), -(−5), +4(−1) */
function subTerm(coef, val, first) {
  const sign = coef < 0 ? '-' : (first ? '' : '+'), m = Math.abs(coef);
  return sign + (m === 1 ? (val < 0 ? `(${val})` : String(val)) : `${m}(${val})`);
}
/** "A(x) + B(y) + C" with numbers in, then the value of each term, then the total */
function gfSub(A, B, C, x, y) {
  const s1 = subTerm(A, x, true) + subTerm(B, y, false) + (C ? (C < 0 ? '-' : '+') + Math.abs(C) : '');
  const vals = [A * x, B * y, C].filter((v, i) => i < 2 || v);
  const s2 = vals.map((v, i) => (i === 0 ? String(v) : (v < 0 ? '-' : '+') + Math.abs(v))).join('');
  const tot = A * x + B * y + C;
  return { s1, s2, tot };
}
/** slope triangle from P: run leg (amber) then rise leg (purple); labels outside */
function tri(G, P, run, rise, o = {}) {
  const Q = [P[0] + run, P[1]], R = [Q[0], P[1] + rise];
  const a = G.segment(P, Q, { color: RUN, width: 5 }), b = G.segment(Q, R, { color: RISE, width: 5 });
  const la = G.label((P[0] + Q[0]) / 2, P[1], `<b>run</b> ${T(texNum(run))}`, { pos: o.runPos || (rise > 0 ? 's' : 'n'), cls: 'bk-ptlab u7l7-tl u7l7-trun', gap: 6 });
  const lb = G.label(Q[0], (Q[1] + R[1]) / 2, `<b>rise</b> ${T(texNum(rise))}`, { pos: o.risePos || (run > 0 ? 'e' : 'w'), cls: 'bk-ptlab u7l7-tl u7l7-trise', gap: 6 });
  return {
    els: [a, b, la, lb],
    async draw(c, ms = 420) { hide(la); hide(lb); await G.drawIn(a, ms, c); await fadeIn(c, la, 200); await G.drawIn(b, ms, c); await fadeIn(c, lb, 200); }
  };
}

/* =============================================================================================================
 * Equation tiles (from Math 10C u7l3): each term is a tile that can slide across the = sign (changing sign mid-air),
 * take a ×k badge, be covered by a sticky note, or carry a label underneath. A state is { L: [tile…], R: [tile…] };
 * tile = { id, n, d, v ('x' | 'y' | '') }.
 * ============================================================================================================= */
const FLASH = [{ background: '#ffd9d3', borderColor: '#c93a33' }, { background: '#ffd9d3', borderColor: '#c93a33', offset: 0.5 }, { background: '', borderColor: '' }];
class TileEq {
  constructor(stage, o) {
    this.o = o; this.W = o.width; this.H = o.h || 64;
    this.el = add(stage, box(h('div', 'u7l7-eqrow' + (o.cls ? ' ' + o.cls : '')), this.W, this.H), o.x, o.y);
    this.meas = h('div', 'u7l7-tile u7l7-meas'); this.el.appendChild(this.meas);
    this.tiles = {}; this.extras = [];
  }
  texOf(t, first) {
    const neg = t.n < 0, [p, q] = red(Math.abs(t.n), t.d || 1);
    const mag = q === 1 ? (p === 1 && t.v ? '' : String(p)) : `\\dfrac{${p}}{${q}}`;
    return (first ? (neg ? '-' : '') : (neg ? '-\\,' : '+\\,')) + mag + (t.v || '');
  }
  layout(st) {
    const items = [];
    const side = (arr, s) => { if (!arr.length) items.push({ id: 'z' + s, tex: '0', side: s, kind: 'z' }); else arr.forEach((t, i) => items.push({ id: t.id, tex: this.texOf(t, i === 0), side: s, kind: t.v || 'c' })); };
    side(st.L, 'L'); items.push({ id: 'eq', tex: '=', side: 'M', kind: 'eq' }); side(st.R, 'R');
    let tot = 0;
    items.forEach((it) => { this.meas.className = 'u7l7-tile u7l7-meas u7l7-k' + it.kind; this.meas.innerHTML = T(it.tex); it.w = this.meas.offsetWidth || 60; tot += it.w; });
    const gap = this.o.gap ?? 10; tot += gap * (items.length - 1);
    let x = (this.W - tot) / 2;
    items.forEach((it) => { it.x = x; x += it.w + gap; });
    return items;
  }
  mk(it) {
    const el = h('div', 'u7l7-tile u7l7-k' + it.kind, T(it.tex));
    el.tex = it.tex; el.side = it.side; el.x = it.x; el.w = it.w; el.style.left = it.x + 'px'; el.style.top = '0px';
    this.el.appendChild(el); return el;
  }
  render(st) {
    Object.values(this.tiles).forEach((e) => e.remove()); this.tiles = {}; this.state = st;
    this.layout(st).forEach((it) => { this.tiles[it.id] = this.mk(it); });
  }
  async morph(c, st, o = {}) {
    const items = this.layout(st), old = Object.assign({}, this.tiles), next = {}, moves = [];
    items.forEach((it) => {
      let el = old[it.id];
      if (el) {
        delete old[it.id];
        const crossed = el.side !== it.side && it.side !== 'M';
        if (!crossed && el.tex !== it.tex) { el.innerHTML = T(it.tex); el.tex = it.tex; el.changed = true; }
        moves.push({ el, x0: el.x, x1: it.x, crossed, tex: it.tex });
      } else { el = this.mk(it); hide(el); moves.push({ el, x0: it.x, x1: it.x, fresh: true }); }
      el.side = it.side; el.w = it.w; next[it.id] = el;
    });
    const gone = Object.values(old);
    this.tiles = next; this.state = st;
    await Promise.all(gone.map((el) => fadeOut(c, el, 260)));
    gone.forEach((el) => el.remove());
    const lift = o.lift ?? 58;
    await tween(c, o.ms || 1000, (t) => {
      moves.forEach((m) => {
        if (m.fresh) return;
        m.el.style.left = (m.x0 + (m.x1 - m.x0) * t) + 'px';
        if (m.crossed) {
          m.el.style.top = (t >= 1 ? 0 : -Math.sin(Math.PI * t) * lift) + 'px';
          if (t >= 0.5 && !m.swapped) { m.swapped = true; m.el.innerHTML = T(m.tex); m.el.tex = m.tex; anim(c, m.el, FLASH, 900); }
        }
      });
    });
    moves.forEach((m) => { m.el.x = m.x1; m.el.style.top = '0px'; });
    const fresh = moves.filter((m) => m.fresh).map((m) => m.el), changed = moves.filter((m) => m.el.changed).map((m) => m.el);
    changed.forEach((e) => { e.changed = false; });
    await Promise.all([...fresh.map((e) => pop(c, e, 320)), ...changed.map((e) => pulse(c, e, 1.1, 380))]);
  }
  /** a small badge (×5, ÷(−4) …) above the tiles (all but = ; or only the ids given) */
  async badges(c, texStr, ids = null, cls = '') {
    const bs = Object.entries(this.tiles).filter(([id]) => id !== 'eq' && (!ids || ids.includes(id))).map(([, el]) => {
      const b = h('div', 'u7l7-badge ' + cls, T(texStr)); this.el.appendChild(b);
      b.style.left = (el.x + el.w / 2) + 'px'; b.style.top = '-36px'; hide(b); return b;
    });
    for (const b of bs) await pop(c, b, 240);
    await sleep(c, 250);
    return bs;
  }
  async unbadge(c, bs) { await Promise.all(bs.map((b) => fadeOut(c, b, 220))); bs.forEach((b) => b.remove()); }
  /** labels under tiles: { id: html } */
  async labels(c, map, cls = '') {
    const out = [];
    for (const [id, html] of Object.entries(map)) {
      const el = this.tiles[id]; if (!el) continue;
      const d = h('div', 'u7l7-under ' + cls, html); this.el.appendChild(d);
      d.style.left = (el.x + el.w / 2) + 'px'; d.style.top = (this.H + 6) + 'px'; hide(d); out.push(d);
      await pop(c, d, 260);
    }
    this.extras.push(...out); return out;
  }
  clearLabels() { this.extras.forEach((e) => e.remove()); this.extras = []; }
  /** a sticky note covering a tile */
  coverCard(id, text) {
    const d = h('div', 'u7l7-cover', `<span>${text}</span>`); this.el.appendChild(d);
    this.card = d; this.placeCard(id); return d;
  }
  placeCard(id) { const el = this.tiles[id], d = this.card; d.style.left = (el.x - 8) + 'px'; d.style.width = (el.w + 16) + 'px'; d.style.top = '-8px'; d.style.height = (this.H + 16) + 'px'; d.on = id; }
  async moveCard(c, id, text) {
    const d = this.card, el = this.tiles[id], from = this.tiles[d.on];
    const x0 = parseFloat(d.style.left), w0 = parseFloat(d.style.width), x1 = el.x - 8, w1 = el.w + 16;
    await tween(c, 800, (t) => { d.style.left = (x0 + (x1 - x0) * t) + 'px'; d.style.width = (w0 + (w1 - w0) * t) + 'px'; d.style.top = (-8 - Math.sin(Math.PI * t) * 40) + 'px'; });
    d.style.top = '-8px'; d.on = id; d.querySelector('span').innerHTML = text;
    if (from) from.style.opacity = 1;
  }
}

/* state helpers */
let uidN = 0;
const mkState = (L, R) => ({ L: L.map(([a, b, v]) => ({ id: 't' + (uidN++), n: a, d: b, v })), R: R.map(([a, b, v]) => ({ id: 't' + (uidN++), n: a, d: b, v })) });
const scaleT = (t, p, q) => { const [a, b] = red(t.n * p, t.d * q); return Object.assign({}, t, { n: a, d: b }); };
const scaleS = (st, p, q = 1) => ({ L: st.L.map((t) => scaleT(t, p, q)), R: st.R.map((t) => scaleT(t, p, q)) });
const ORDER = { x: 0, y: 1, '': 2 };
const allLeft = (st) => ({ L: st.L.concat(st.R.map((t) => Object.assign({}, t, { n: -t.n }))).sort((a, b) => ORDER[a.v] - ORDER[b.v]), R: [] });
const coefOf = (st, v) => { const t = st.L.find((u) => u.v === v); return t ? t.n / t.d : 0; };
const tilesOf = (st) => st.L.concat(st.R);
const eqTex = (st, big) => `${polyTex(st.L.map((t) => [t.n, t.d, t.v]), big)}=${polyTex(st.R.map((t) => [t.n, t.d, t.v]), big)}`;
const trailLine = (host, texStr, tag = '', cls = '') => { const d = h('div', 'u7l7-tline ' + cls, `<span class="u7l7-te">${T(texStr)}</span>${tag ? `<span class="u7l7-tt">${tag}</span>` : ''}`); host.appendChild(d); return d; };

/* =============================== warm-up: six name tags =============================== */
const TAGS = [
  { k: 'A', t: '4x-2y=6', f: (x, y) => 4 * x - 2 * y - 6, how: `${T('\\div2')}: ${T('y=2x-3')}` },
  { k: 'B', t: 'y=2x-3', f: (x, y) => y - (2 * x - 3), how: `the ${T('y=mx+b')} outfit` },
  { k: 'C', t: '2x-y+3=0', f: (x, y) => 2 * x - y + 3, imp: true, how: `${T('y=2x+3')}: <b>parallel</b>` },
  { k: 'D', t: 'y+3=2x', f: (x, y) => y + 3 - 2 * x, how: `${T('-3')}: ${T('y=2x-3')}` },
  { k: 'E', t: '-2x+y+3=0', f: (x, y) => -2 * x + y + 3, how: `same line, but ${T('A<0')}` },
  { k: 'F', t: '2x-y-3=0', f: (x, y) => 2 * x - y - 3, how: '<b>proper general form</b>' }
];
function mountTags() {
  const host = document.getElementById('u7l7-tags'), gh = document.getElementById('u7l7-wgraph'); if (!host || !gh) return;
  const G = new Graph(gh, { width: 280, height: 280, xmin: -4, xmax: 6, ymin: -5, ymax: 5, xlabels: 2, ylabels: 2 });
  G.line([0, -3], [2, 1], { color: LINE, width: 4 });
  G.point(0, -3, { color: '#d23c32', r: 8 }); G.point(2, 1, { color: '#d23c32', r: 8 });
  let imp = null;
  TAGS.forEach((t) => {
    const b = h('button', 'u7l7-tag', `<div class="u7l7-tag-h"><span>HELLO, I am</span><b>${t.k}</b></div><div class="u7l7-tag-e">${T(t.t)}</div><div class="u7l7-tag-v"></div>`);
    b.type = 'button'; host.appendChild(b);
    b.addEventListener('click', () => {
      const v = b.querySelector('.u7l7-tag-v');
      if (b.classList.contains('done')) { b.classList.remove('done', 'ok', 'no'); v.innerHTML = ''; if (t.imp && imp) { G.remove(imp); imp = null; } return; }
      const r1 = Math.abs(t.f(0, -3)) < 1e-9, r2 = Math.abs(t.f(2, 1)) < 1e-9, ok = r1 && r2;
      b.classList.add('done', ok ? 'ok' : 'no');
      v.innerHTML = `<span class="u7l7-tv-k">${T('(0,-3)')} ${r1 ? '✓' : '✗'} &nbsp;${T('(2,1)')} ${r2 ? '✓' : '✗'}</span><span class="u7l7-tv-h">${t.how}</span>`;
      if (t.imp && !imp) { const c = liveCtx(); imp = G.line({ m: 2, b: 3 }, { color: NEG, width: 3, dash: true }); G.drawIn(imp, 700, c); }
    });
  });
}

/* =============================== explainer 1: does the point make it zero? =============================== */
const ZM = {
  s1: { label: T('y=2x-5') + ' and ' + T('2x-y-5=0'), m: 2, b: -5, hops: [0, 1, 2, 3, 4], off: [1, 1], win: { xmin: -3, xmax: 6, ymin: -7, ymax: 5 } },
  wu: { label: 'Warm-up: tags B and F', m: 2, b: -3, hops: [0, 1, 2, 3, 4], off: [3, 1], win: { xmin: -3, xmax: 6, ymin: -5, ymax: 7 } }
};
const zeroMeter = {
  title: 'A point on the line makes it zero',
  height: 440,
  minW: 900,
  choices: Object.keys(ZM).map((k) => ({ v: k, label: ZM[k].label })),
  intro: 'Two outfits for one line. Test points in both and watch what the general-form side comes out to. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = ZM[k], W = ex.W, { m, b } = d, A = m, B = -1, C = b;
    const G = new Graph(stage, Object.assign({ x: 14, y: 14, width: 400, height: 412, xlabels: 1, ylabels: 2 }, d.win));
    const PW = W - 448;
    const si = add(stage, box(h('div', 'u7l7-outfit u7l7-o-si', `<span class="u7l7-ol">slope–intercept outfit</span>${T(siTex(m, 1, b))}`), (PW - 14) / 2, 76), 434, 14);
    const gfo = add(stage, box(h('div', 'u7l7-outfit u7l7-o-gf', `<span class="u7l7-ol">general-form outfit</span>${T(gf(A, B, C))}`), (PW - 14) / 2, 76), 434 + (PW - 14) / 2 + 14, 14);
    hide(si); hide(gfo);
    const tb = add(stage, box(h('div', 'u7l7-test'), PW, 226), 434, 104); hide(tb);
    const meter = add(stage, box(h('div', 'u7l7-meter'), PW, 88), 434, 340); hide(meter);
    const P0 = [d.hops[0], m * d.hops[0] + b];
    let pt = null;
    const setTest = (x, y) => {
      const on = Math.abs(y - (m * x + b)) < 1e-9, g = gfSub(A, B, C, x, y), rhs = m * x + b;
      tb.innerHTML = `<div class="u7l7-th">Test the point ${T(pairTex(x, y))}</div>`
        + `<div class="u7l7-tr"><span class="u7l7-tk">${T('y=' + polyTex([[m, 1, 'x'], [b, 1, '']]))}</span><div>${T(`${y}\\overset{?}{=}${m}(${x})${b < 0 ? '-' : '+'}${Math.abs(b)}=${rhs}`)} <b class="${on ? 'u7l7-yes' : 'u7l7-no'}">${on ? '✓' : '✗'}</b></div></div>`
        + `<div class="u7l7-tr"><span class="u7l7-tk">${T(polyTex([[A, 1, 'x'], [B, 1, 'y'], [C, 1, '']]))}</span><div>${T(`${g.s1}=${g.s2}=${g.tot}`)} <b class="${on ? 'u7l7-yes' : 'u7l7-no'}">${on ? '✓' : '✗'}</b></div></div>`;
      meter.className = 'u7l7-meter ' + (on ? 'zero' : 'off');
      meter.innerHTML = `<span>left side of general form</span><b>${T(String(g.tot))}</b><span class="u7l7-mv">${on ? 'on the line' : 'NOT on the line'}</span>`;
    };
    const hopCaps = d.hops.slice(1).map((x) => T(pairTex(x, m * x + b))).join(', ');
    const offG = gfSub(A, B, C, d.off[0], d.off[1]);
    return [
      { cap: `One line, ${T(siTex(m, 1, b))}. Collect every term on the left and the same line wears a new outfit: ${T(gf(A, B, C))}.`,
        run: async (c) => { await G.drawIn(G.line({ m, b }, { color: LINE }), 700, c); await show(c, si); await show(c, gfo); } },
      { cap: `Test a point on the line, ${T(pairTex(...P0))}. It works in ${T(siTex(m, 1, b))}, and in general form the left side comes out to exactly ${T('0')}.`,
        run: async (c) => { pt = G.point(P0[0], P0[1], { color: INK, r: 8 }); await pop(c, pt); setTest(...P0); await show(c, tb); await show(c, meter); } },
      { cap: `Hop along the line: ${hopCaps}. The left side stays <b>exactly ${T('0')}</b> every time.`,
        run: async (c) => {
          for (const x of d.hops.slice(1)) { const y = m * x + b; await G.move(c, pt, x, y, 450); setTest(x, y); await pulse(c, meter.querySelector('b'), 1.15, 300); await sleep(c, 250); }
        } },
      { cap: `Step <b>off</b> the line to ${T(pairTex(...d.off))}: ${T(`${offG.s1}=${offG.tot}`)}, not ${T('0')}. So ${T(pairTex(...d.off))} is <b>not</b> on the line.`,
        run: async (c) => { await G.move(c, pt, d.off[0], d.off[1], 700); pt.querySelector('circle').setAttribute('fill', NEG); setTest(...d.off); await shake(c, meter); } },
      { cap: `Same points, same line. ${T(siTex(m, 1, b))} and ${T(gf(A, B, C))} are <b>the same line</b> in two outfits.`,
        run: async (c) => {
          await G.move(c, pt, P0[0], P0[1], 600); pt.querySelector('circle').setAttribute('fill', INK); setTest(...P0);
          const s = stamp(stage, 'Same line!', { ok: true, x: 320, y: 362 }); await stampIn(c, s);
        } }
    ];
  }
};

/* =============================== explainer 2: one line, many outfits =============================== */
const CO = {
  wu: { label: 'Warm-up: ' + T('y=2x-3'), m: 2, b: -3, P: [0, -3], Q: [2, 1], imp: { m: 2, b: 3 }, win: { xmin: -4, xmax: 6, ymin: -6, ymax: 7 },
    list: [
      { k: 'A', t: '4x-2y=6', f: (x, y) => 4 * x - 2 * y - 6, fail: 0 },
      { k: 'B', t: 'y=2x-3', f: (x, y) => y - (2 * x - 3), fail: 0 },
      { k: 'C', t: '2x-y+3=0', f: (x, y) => 2 * x - y + 3, imp: true },
      { k: 'D', t: 'y+3=2x', f: (x, y) => y + 3 - 2 * x, fail: 0 },
      { k: 'E', t: '-2x+y+3=0', f: (x, y) => -2 * x + y + 3, fail: 2, why: T('A=-2') },
      { k: 'F', t: '2x-y-3=0', f: (x, y) => 2 * x - y - 3, win: true }
    ] },
  half: { label: 'The line ' + T('y=\\tfrac12x+4'), m: 0.5, b: 4, P: [0, 4], Q: [4, 6], imp: { m: 0.5, b: -4 }, win: { xmin: -8, xmax: 6, ymin: -6, ymax: 9 },
    list: [
      { k: '1', t: 'y=\\tfrac{1}{2}x+4', f: (x, y) => y - (x / 2 + 4), fail: 0 },
      { k: '2', t: '0.5x-y+4=0', f: (x, y) => 0.5 * x - y + 4, fail: 1, why: T('0.5') + ' is not an integer' },
      { k: '3', t: '-x+2y-8=0', f: (x, y) => -x + 2 * y - 8, fail: 2, why: T('A=-1') },
      { k: '4', t: 'x-2y-8=0', f: (x, y) => x - 2 * y - 8, imp: true },
      { k: '5', t: '2y=x+8', f: (x, y) => 2 * y - x - 8, fail: 0 },
      { k: '6', t: 'x-2y+8=0', f: (x, y) => x - 2 * y + 8, win: true }
    ] }
};
const RULE_CAP = [
  `<b>Rule 1: one side is ${T('0')}.</b> Equations with terms on both sides are not in general form yet.`,
  '<b>Rule 2: integers only.</b> A decimal (or a fraction) is out.',
  `<b>Rule 3: ${T('A')} is positive.</b> A negative number in front of ${T('x')} is out.`
];
const costumes = {
  title: 'One line, many outfits',
  height: 440,
  minW: 940,
  choices: Object.keys(CO).map((k) => ({ v: k, label: CO[k].label })),
  intro: 'Six equations. Which ones are the same line, and which one is in proper general form? Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = CO[k], W = ex.W;
    const G = new Graph(stage, Object.assign({ x: 14, y: 14, width: 400, height: 412, xlabels: 2, ylabels: 2 }, d.win));
    const P = panel(stage, 434, 14, W - 448, 412, 'Six outfits');
    const rows = d.list.map((e) => {
      const r = h('div', 'u7l7-cos', `<span class="u7l7-cos-n">${e.k}</span><span class="u7l7-cos-e">${T(e.t)}</span><span class="u7l7-cos-k"></span><span class="u7l7-cos-w"></span>`);
      P.appendChild(r); hide(r); return r;
    });
    const ok = d.list.map((e) => Math.abs(e.f(...d.P)) < 1e-9 && Math.abs(e.f(...d.Q)) < 1e-9);
    d.list.forEach((e, i) => { if (ok[i] === !!e.imp) console.error('u7l7 costumes: point test does not match', k, e.t); });
    const ii = d.list.findIndex((e) => e.imp), mTex = d.m === 0.5 ? '\\tfrac12' : String(d.m);
    const steps = [
      { cap: `One line: ${T(`y=${mTex}x${d.b < 0 ? '' : '+'}${d.b}`)}. Here are <b>six</b> equations someone might write for it.`,
        run: async (c) => { await G.drawIn(G.line({ m: d.m, b: d.b }, { color: LINE }), 700, c); for (const r of rows) await show(c, r); } },
      { cap: `Test two points on the line, ${T(pairTex(...d.P))} and ${T(pairTex(...d.Q))}, in every equation. Five work for both. <b>${d.list[ii].k}</b> fails: it is an <b>impostor</b>, a different (parallel) line.`,
        run: async (c) => {
          for (const p of [d.P, d.Q]) await pop(c, G.point(p[0], p[1], { color: INK, r: 7, coords: true, pos: 'se' }));
          for (let i = 0; i < rows.length; i++) { const kk = rows[i].querySelector('.u7l7-cos-k'); kk.innerHTML = ok[i] ? '✓ ✓' : '✗'; await pop(c, kk, 200); }
          rows[ii].classList.add('out', 'imp'); rows[ii].style.opacity = 0.5; rows[ii].querySelector('.u7l7-cos-w').innerHTML = 'a different line';
          await G.drawIn(G.line(d.imp, { color: NEG, width: 3, dash: true }), 700, c); await shake(c, rows[ii]);
        } }
    ];
    [0, 1, 2].forEach((ri) => {
      if (!d.list.some((e) => e.fail === ri)) return;
      steps.push({ cap: RULE_CAP[ri], run: async (c) => {
        for (let i = 0; i < rows.length; i++) {
          if (d.list[i].fail !== ri) continue;
          rows[i].classList.add('out'); rows[i].style.opacity = 0.45; const w = rows[i].querySelector('.u7l7-cos-w');
          w.innerHTML = d.list[i].why || 'not ' + T('=0') + ' yet'; await shake(c, rows[i]); await fadeIn(c, w);
        }
      } });
    });
    const wi = d.list.findIndex((e) => e.win);
    steps.push({ cap: `Exactly <b>one</b> is left: ${T(d.list[wi].t)}. That is the line in <b>proper general form</b>, so everyone in the class writes the same answer.`,
      run: async (c) => { rows[wi].classList.add('win'); await pulse(c, rows[wi], 1.06); const s = stamp(P, 'General form', { ok: true, size: 'sm' }); s.classList.add('u7l7-cos-st'); await stampIn(c, s); } });
    return steps;
  }
};

/* =============================== explainers 3 + 5: the tidy-up machine =============================== */
const TU = {
  w1: { label: 'Walkthrough ' + T('y=3x-5'), L: [[1, 1, 'y']], R: [[3, 1, 'x'], [-5, 1, '']] },
  a: { label: 'Example 1(a) check', L: [[1, 1, 'y']], R: [[2, 1, 'x'], [5, 1, '']], shortcut: true },
  b: { label: 'Example 1(b) check', L: [[1, 1, 'y']], R: [[-4, 1, 'x'], [1, 1, '']] },
  w2: { label: 'Walkthrough ' + T('y=\\tfrac12x+4'), L: [[1, 1, 'y']], R: [[1, 2, 'x'], [4, 1, '']] },
  fa: { label: 'Example 2(a) check', L: [[1, 1, 'y']], R: [[1, 2, 'x'], [3, 1, '']] },
  fb: { label: 'Example 2(b) check', L: [[1, 1, 'y']], R: [[-3, 4, 'x'], [2, 1, '']] }
};
const STATIONS = [['Clear fractions', '× the denominator, every term'], ['Move all left', 'right side becomes 0'], ['Fix the sign', 'make A positive']];
function stationsBar(stage, x, y, w) {
  const row = add(stage, box(h('div', 'u7l7-stations'), w, 76), x, y);
  const els = STATIONS.map(([t, s], i) => {
    const d = h('div', 'u7l7-st', `<div class="u7l7-st-n">${i + 1}</div><div class="u7l7-st-t"><b>${t}</b><span>${s}</span></div><div class="u7l7-st-v"></div>`);
    row.appendChild(d); return d;
  });
  return { set(i, mode, note = '') { const d = els[i]; d.classList.remove('on', 'done', 'skip'); if (mode) d.classList.add(mode); d.querySelector('.u7l7-st-v').innerHTML = note; } };
}
const RULES = ['One side is ' + T('0'), 'Integers only', T('A') + ' is positive'];
function ruleStatus(st) {
  const all = tilesOf(st), zero = st.R.length === 0, ints = all.every((t) => t.d === 1), A = coefOf(st, 'x');
  return [zero, ints, zero ? A > 0 : null];
}
function rulesPanel(stage, x, y, w, hh) {
  const P = panel(stage, x, y, w, hh, 'General-form rules');
  const rows = RULES.map((r) => { const d = h('div', 'u7l7-rule', `<span class="u7l7-rk"></span><span>${r}</span>`); P.appendChild(d); return d; });
  return {
    set(st) {
      ruleStatus(st).forEach((s, i) => {
        const k = rows[i].querySelector('.u7l7-rk');
        k.textContent = s === true ? '✓' : s === false ? '✗' : '–';
        rows[i].className = 'u7l7-rule ' + (s === true ? 'ok' : s === false ? 'no' : 'na');
      });
    }
  };
}
function tidyDef(keys, title, intro) {
  return {
    title, height: 450, minW: 900, intro,
    choices: keys.map((k) => ({ v: k, label: TU[k].label })),
    make(stage, k, ex) {
      const d = TU[k], W = ex.W;
      const S = stationsBar(stage, 14, 14, W - 28);
      const E = new TileEq(stage, { x: 14, y: 150, width: W - 28, h: 64 });
      const trail = add(stage, box(h('div', 'u7l7-trail'), W - 28 - 384, 168), 14, 268);
      const R = rulesPanel(stage, W - 374, 268, 360, 168);
      let st = mkState(d.L, d.R); E.render(st); R.set(st);
      trailLine(trail, eqTex(st, true), 'start');
      const steps = [], pend = [];
      const skipCap = () => { const s = pend.map((p) => `${p.why}: skip station ${p.i + 1}.`).join(' '); return s ? `<span class="u7l7-skipcap">${s}</span> ` : ''; };
      const doSkips = (list) => list.forEach((p) => S.set(p.i, 'skip', 'not needed'));
      const op = (i, capMain, next, badge, tag) => {
        const cap = skipCap() + capMain, sk = pend.splice(0), to = next;
        steps.push({ cap, run: async (c) => {
          doSkips(sk); S.set(i, 'on');
          let bs = null; if (badge) bs = await E.badges(c, badge);
          await E.morph(c, to);
          if (bs) await E.unbadge(c, bs);
          S.set(i, 'done', tag ? T(tag) : '✓'); R.set(to);
          await show(c, trailLine(trail, eqTex(to, true), tag ? T(tag) : 'move'));
        } });
      };
      // station 1: clear fractions
      const L = tilesOf(st).reduce((a, t) => lcm(a, t.d), 1);
      if (L > 1) {
        const next = scaleS(st, L);
        op(0, `<b>Station 1: clear the fraction.</b> The denominator is ${T(String(L))}. Multiply <b>every</b> term, on <b>both</b> sides, by ${T(String(L))}.`, next, `\\times${L}`, `\\times${L}`);
        st = next;
      } else pend.push({ i: 0, why: 'No fractions' });
      // station 2: move everything left
      const next2 = allLeft(st);
      op(1, `<b>Station 2: move every term to the left.</b> Each term that crosses the ${T('=')} <b>changes sign</b>. The right side is left with ${T('0')}. Put the ${T('x')}-term first.`, next2, null, null);
      st = next2;
      // station 3: fix the sign
      const A3 = coefOf(st, 'x');
      if (A3 < 0) {
        const next = scaleS(st, -1);
        op(2, `<b>Station 3: fix the sign.</b> ${T('A=' + A3)} is negative. Multiply <b>every</b> term by ${T('-1')}: every sign flips.`, next, '\\times(-1)', '\\times(-1)');
        st = next;
      } else pend.push({ i: 2, why: `${T('A=' + A3)} is already positive` });
      const A = coefOf(st, 'x'), B = coefOf(st, 'y'), C = coefOf(st, ''), fin = st, sk = pend.splice(0);
      steps.push({ cap: (sk.length ? `<span class="u7l7-skipcap">${sk.map((p) => `${p.why}: skip station ${p.i + 1}.`).join(' ')}</span> ` : '') +
        `<b>Done!</b> ${T(gf(A, B, C))}, with ${T(`A=${A},\\ B=${B},\\ C=${C}`)}: integers, and ${T('A')} is positive.`,
      run: async (c) => {
        doSkips(sk); R.set(fin);
        const map = {}; fin.L.forEach((t) => { map[t.id] = t.v === 'x' ? T('A=' + t.n) : t.v === 'y' ? T('B=' + t.n) : T('C=' + t.n); });
        await E.labels(c, map);
        const s = stamp(stage, 'General form', { ok: true, x: W - 170, y: 188 }); await stampIn(c, s);
      } });
      if (d.shortcut) {
        const sR = polyTex([[A, 1, 'x'], [B, 1, 'y'], [C, 1, '']]);
        steps.push({ cap: `<b>Shortcut:</b> move the terms to the <b>right</b> instead, so the ${T('x')}-term stays positive: ${T('0=' + sR)}. Read it right to left: the same ${T(gf(A, B, C))}, with no sign fix.`,
          run: async (c) => { await show(c, trailLine(trail, `${eqTex(mkState(d.L, d.R), true)}\\;\\Rightarrow\\;0=${sR}`, 'shortcut', 'u7l7-tnote')); } });
      }
      return steps;
    }
  };
}
const tidyUp = tidyDef(['w1', 'a', 'b'], 'The tidy-up machine', 'Feed in an equation in slope–intercept form. Three stations tidy it into general form, and the checklist shows which rules it meets. Press <b>Next</b>.');
const tidyFrac = tidyDef(['w2', 'fa', 'fb'], 'The tidy-up machine: fractions first', 'This time station 1 has work to do: clear the fraction before anything moves. Press <b>Next</b>.');

/* =============================== explainer 4: multiply EVERY term =============================== */
const ET = {
  t: { label: T('y=\\tfrac13x+2'), n: 1, d: 3, b: 2, P: [3, 3], win: { xmin: -7, xmax: 5, ymin: -4, ymax: 9 } },
  s: { label: T('y=\\tfrac23x-1'), n: 2, d: 3, b: -1, P: [3, 1], win: { xmin: -5, xmax: 7, ymin: -6, ymax: 7 } }
};
const everyTerm = {
  title: 'Multiply every term',
  height: 430,
  minW: 900,
  choices: Object.keys(ET).map((k) => ({ v: k, label: ET[k].label })),
  intro: 'Clearing a fraction only works if <b>every</b> term gets multiplied. Watch what happens if one is skipped. Press <b>Next</b>.',
  make(stage, k, ex) {
    const { n, d, b, P, win } = ET[k], W = ex.W, LW = W - 28 - 400;
    const G = new Graph(stage, Object.assign({ x: W - 394, y: 10, width: 380, height: 410, xlabels: 2, ylabels: 2 }, win));
    const E = new TileEq(stage, { x: 14, y: 54, width: LW, h: 64 });
    const s0 = mkState([[1, 1, 'y']], [[n, d, 'x'], [b, 1, '']]), [ty] = s0.L, [tx, tc] = s0.R;
    E.render(s0);
    const wrong = add(stage, box(h('div', 'u7l7-wbox u7l7-bad'), LW, 98), 14, 152); hide(wrong);
    const right = add(stage, box(h('div', 'u7l7-wbox u7l7-good'), LW, 98), 14, 262); hide(right);
    const s1 = { L: [scaleT(ty, d, 1)], R: [scaleT(tx, d, 1), tc] };       // the mistake: the constant skipped
    const s2 = { L: [scaleT(ty, d, 1)], R: [scaleT(tx, d, 1), scaleT(tc, d, 1)] };
    const [px, py] = P, wl = d * py, wr = n * px + b, rr = n * px + d * b;
    const gA = -n, gB = d, gC = -d * b, sg = gA < 0 ? -1 : 1, fin = gf(sg * gA, sg * gB, sg * gC);
    const sTex = (v) => (v < 0 ? `-${Math.abs(v)}` : `+${v}`);
    let line = null, wline = null, pt = null;
    return [
      { cap: `${T(siTex(n, d, b))} has a fraction. To clear it, multiply by the denominator, ${T(String(d))}.`,
        run: async (c) => { line = G.line({ m: n / d, b }, { color: LINE }); await G.drawIn(line, 700, c); } },
      { cap: `<b>Mistake:</b> multiply only the ${T('y')} and ${T('x')} terms: ${T(`${d}y=${polyTex([[n, 1, 'x']])}${sTex(b)}`)}. The constant ${T(String(b))} was skipped.`,
        run: async (c) => {
          const bs = await E.badges(c, `\\times${d}`, [ty.id, tx.id]); await E.morph(c, s1); await E.unbadge(c, bs);
          await anim(c, E.tiles[tc.id], FLASH, 900);
          wrong.innerHTML = `<div class="u7l7-wh">skipped the constant</div>${T(`${d}y=${polyTex([[n, 1, 'x']])}${sTex(b)}`)}`; await show(c, wrong);
        } },
      { cap: `Test the point ${T(pairTex(px, py))}, which is on the line: ${T(`${d}(${py})=${wl}`)} but ${T(`${n === 1 ? '' : n}(${px})${sTex(b)}=${wr}`)}. ${T(`${wl}\\ne${wr}`)} ✗. That equation is a <b>different line</b>!`,
        run: async (c) => {
          pt = G.point(px, py, { color: INK, r: 7, coords: true, pos: 'nw' }); await pop(c, pt);
          wline = G.line({ m: n / d, b: b / d }, { color: NEG, width: 3, dash: true }); await G.drawIn(wline, 700, c);
          wrong.insertAdjacentHTML('beforeend', `<div class="u7l7-wchk">${T(`${d}(${py})=${wl}\\ne${wr}`)} <b class="u7l7-no">✗</b></div>`);
        } },
      { cap: `<b>Right:</b> multiply <b>every</b> term, the constant too: ${T(`${d}y=${polyTex([[n, 1, 'x'], [d * b, 1, '']])}`)}. Now ${T(`${d}(${py})=${wl}`)} and ${T(`${n === 1 ? '' : n}(${px})${sTex(d * b)}=${rr}`)} ✓.`,
        run: async (c) => {
          const bs = await E.badges(c, `\\times${d}`, [tc.id]); await E.morph(c, s2); await E.unbadge(c, bs);
          right.innerHTML = `<div class="u7l7-wh">every term ${T('\\times' + d)}</div>${T(`${d}y=${polyTex([[n, 1, 'x'], [d * b, 1, '']])}`)}<div class="u7l7-wchk">${T(`${d}(${py})=${wl}=${rr}`)} <b class="u7l7-yes">✓</b></div>`;
          await show(c, right); G.remove(wline); await pulse(c, line, 1.02);
        } },
      { cap: `No fractions left. Now move every term to the left${sg < 0 ? ' and make ' + T('A') + ' positive' : ''}: ${T(fin)}.`,
        run: async (c) => {
          await E.morph(c, allLeft(s2)); if (sg < 0) await E.morph(c, scaleS(allLeft(s2), -1));
          const s = stamp(stage, 'General form', { ok: true, x: 200, y: 396, size: 'sm' }); await stampIn(c, s);
        } }
    ];
  }
};

/* =============================== explainers 6 + 7: general form → y = mx + b =============================== */
const SY = {
  w: { label: 'Walkthrough ' + T('4x-y-1=0'), A: 4, B: -1, C: -1, xc: 2, win: { xmin: -3, xmax: 6, ymin: -2, ymax: 8 } },
  a: { label: 'Example 3(a) check', A: 2, B: -1, C: -7, xc: 2, win: { xmin: -3, xmax: 6, ymin: -9, ymax: 1 } },
  b: { label: 'Example 3(b) check', A: 3, B: 1, C: -9, xc: 2, win: { xmin: -3, xmax: 7, ymin: -1, ymax: 10 } },
  w2: { label: 'Walkthrough ' + T('3x-4y+8=0'), A: 3, B: -4, C: 8, xc: 4, win: { xmin: -5, xmax: 6, ymin: -3, ymax: 9 } },
  fa: { label: 'Example 4(a) check', A: 5, B: -2, C: -6, xc: 2, win: { xmin: -4, xmax: 5, ymin: -5, ymax: 5 } },
  fb: { label: 'Example 4(b) check', A: 4, B: 3, C: -12, xc: 3, win: { xmin: -3, xmax: 6, ymin: -2, ymax: 8 } }
};
function solveDef(keys, title, intro) {
  return {
    title, height: 440, minW: 900, intro,
    choices: keys.map((k) => ({ v: k, label: SY[k].label })),
    make(stage, k, ex) {
      const d = SY[k], W = ex.W, { A, B, C, xc } = d, LW = W - 28 - 400;
      const G = new Graph(stage, Object.assign({ x: W - 394, y: 10, width: 380, height: 420, xlabels: 2, ylabels: 2 }, d.win));
      const E = new TileEq(stage, { x: 14, y: 50, width: LW, h: 66 });
      const trail = add(stage, box(h('div', 'u7l7-trail u7l7-trail2'), LW, 150), 14, 162);
      const fbox = add(stage, box(h('div', 'u7l7-fbox'), LW, 104), 14, 324); hide(fbox);
      const s0 = mkState([[A, 1, 'x'], [B, 1, 'y'], [C, 1, '']], []);
      const [tx, ty, tc] = s0.L;
      const s1 = { L: [ty], R: [Object.assign({}, tx, { n: -A }), Object.assign({}, tc, { n: -C })] };
      const s2 = scaleS(s1, 1, B);
      const m = red(-A, B), b = -C / B, yc = (m[0] * xc) / m[1] + b, g = gfSub(A, B, C, xc, yc);
      if (!Number.isInteger(b) || !Number.isInteger(yc) || g.tot !== 0) console.error('u7l7 solveY: bad numbers', k);
      E.render(s0); trailLine(trail, gf(A, B, C), 'start');
      const yTerm = polyTex([[B, 1, 'y']]);
      const steps = [
        { cap: `${T(gf(A, B, C))}. <b>Goal: get ${T('y')} alone.</b> Find the ${T('y')}-term: ${T(yTerm)}. Everything else has to move away from it.`,
          run: async (c) => { await E.labels(c, { [ty.id]: 'the y-term' }); await pulse(c, E.tiles[ty.id], 1.12); } },
        { cap: `<b>Move</b> ${T(polyTex([[A, 1, 'x']]))} and ${T(String(C))} to the right side: each one <b>changes sign</b>. Now ${T(eqTex(s1))}.`,
          run: async (c) => { E.clearLabels(); await E.morph(c, s1); await show(c, trailLine(trail, eqTex(s1), 'move')); } }
      ];
      if (B !== 1) {
        steps.push({ cap: `<b>Divide every term by ${T(par(B))}</b>, the number in front of ${T('y')}.${B < 0 ? ' Dividing by a negative flips every sign.' : ''}${m[1] > 1 ? ' The slope is a fraction: simplify it fully.' : ''}`,
          run: async (c) => { const bs = await E.badges(c, `\\div${par(B)}`); await E.morph(c, s2); await E.unbadge(c, bs); await show(c, trailLine(trail, eqTex(s2, true), T(`\\div${par(B)}`))); } });
      } else {
        steps.push({ cap: `The number in front of ${T('y')} is ${T('1')}, so ${T('y')} is <b>already alone</b>. No dividing needed.`,
          run: async (c) => { await pulse(c, E.tiles[ty.id], 1.12); } });
      }
      const fin = siTex(m[0], m[1], b, true);
      steps.push({ cap: `Slope–intercept form: ${T(fin)}. Slope ${T(fr(m[0], m[1]))}, y-intercept ${T(texNum(b))}. Plot ${T(pairTex(0, b))}, then run ${T(String(m[1]))}, rise ${T(String(m[0]))}.`,
        run: async (c) => {
          const yi = G.point(0, b, { color: YI, r: 8, label: T(pairTex(0, b)), pos: 'w', labelColor: YI }); await pop(c, yi);
          await tri(G, [0, b], m[1], m[0]).draw(c);
          await G.drawIn(G.line({ m: m[0] / m[1], b }, { color: LINE }), 800, c);
        } });
      steps.push({ cap: `<b>Check:</b> on the line, ${T(`x=${xc}`)} gives ${T(`y=${yc}`)}. Put ${T(pairTex(xc, yc))} into the general form: ${T(`${g.s1}=${g.s2}=0`)} ✓.`,
        run: async (c) => {
          await pop(c, G.point(xc, yc, { color: INK, r: 7, coords: true, pos: m[0] > 0 ? 'se' : 'ne' }));
          fbox.innerHTML = `<div class="u7l7-fh">Check with ${T(pairTex(xc, yc))}</div><div>${T(`${g.s1}=${g.s2}=0`)} <b class="u7l7-yes">✓</b></div>`; await show(c, fbox);
        } });
      return steps;
    }
  };
}
const solveY = solveDef(['w', 'a', 'b'], 'Back to y = mx + b: get y alone', 'General form hides the slope and the y-intercept. Get <b>y</b> alone and they appear. Press <b>Next</b>.');
const solveYFrac = solveDef(['w2', 'fa', 'fb'], 'Divide every term by B', 'When the number in front of y is not 1 or −1, the last move is to divide <b>every</b> term by it. Press <b>Next</b>.');

/* =============================== explainer 8: cover x, cover y =============================== */
const CV = {
  w: { label: 'Walkthrough ' + T('2x+y-8=0'), A: 2, B: 1, C: -8, win: { xmin: -3, xmax: 7, ymin: -2, ymax: 10 } },
  a: { label: 'Example 5(a) check', A: 3, B: 2, C: -12, win: { xmin: -3, xmax: 7, ymin: -2, ymax: 8 } },
  b: { label: 'Example 5(b) check', A: 4, B: -1, C: -8, win: { xmin: -4, xmax: 6, ymin: -10, ymax: 3 } },
  wu: { label: 'Warm-up tag F: ' + T('2x-y-3=0'), A: 2, B: -1, C: -3, win: { xmin: -4, xmax: 5, ymin: -5, ymax: 6 } }
};
const cover = {
  title: 'Intercepts: cover x, then cover y',
  height: 440,
  minW: 860,
  choices: Object.keys(CV).map((k) => ({ v: k, label: CV[k].label })),
  intro: 'Every point on the <b>y</b>-axis has x = 0, and every point on the <b>x</b>-axis has y = 0. A sticky note does the substituting. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = CV[k], W = ex.W, { A, B, C } = d, LW = W - 28 - 420;
    const G = new Graph(stage, Object.assign({ x: W - 414, y: 10, width: 400, height: 420, xlabels: 2, ylabels: 2 }, d.win));
    const E = new TileEq(stage, { x: 14, y: 50, width: LW, h: 64 });
    const s0 = mkState([[A, 1, 'x'], [B, 1, 'y'], [C, 1, '']], []), [tx, ty] = s0.L;
    E.render(s0);
    const cw = (LW - 16) / 2;
    const colY = add(stage, box(h('div', 'u7l7-col u7l7-coly', `<div class="u7l7-colh">y-intercept: ${T('x=0')}</div>`), cw, 210), 14, 150);
    const colX = add(stage, box(h('div', 'u7l7-col u7l7-colx', `<div class="u7l7-colh">x-intercept: ${T('y=0')}</div>`), cw, 210), 14 + cw + 16, 150);
    hide(colY); hide(colX);
    const yv = -C / B, xv = -C / A;
    const yLines = [polyTex([[B, 1, 'y'], [C, 1, '']]) + '=0', ...(B !== 1 ? [polyTex([[B, 1, 'y']]) + '=' + (-C)] : []), 'y=' + fr(-C, B)];
    const xLines = [polyTex([[A, 1, 'x'], [C, 1, '']]) + '=0', ...(A !== 1 ? [polyTex([[A, 1, 'x']]) + '=' + (-C)] : []), 'x=' + fr(-C, A)];
    const ptY = `(0,\\ ${fr(-C, B, false)})`, ptX = `(${fr(-C, A, false)},\\ 0)`;
    const yTerm = polyTex([[B, 1, 'y']]);
    const xSub = subTerm(A, 0, true);
    let card = null;
    const steps = [
      { cap: `On the <b>y-axis</b>, ${T('x=0')}. Then the x-term is ${T(`${xSub}=0`)}, worth nothing, so <b>cover the x-term</b>.`,
        run: async (c) => { card = E.coverCard(tx.id, T('x=0')); await anim(c, card, [{ opacity: 0, transform: 'translateY(-50px)' }, { opacity: 1, transform: 'none' }], 500); E.tiles[tx.id].style.opacity = 0.15; await show(c, colY); } },
      { cap: `What’s left: ${T(yLines[0])}, so ${T(yLines[yLines.length - 1])}. The <b>y-intercept</b> is ${T(ptY)}.`,
        run: async (c) => {
          for (const L of yLines) await show(c, trailLine(colY, L));
          const p = G.point(0, yv, { color: YI, r: 8, label: T(ptY), pos: xv > 0 ? 'w' : 'e', labelColor: YI }); await pop(c, p);
        } },
      { cap: `On the <b>x-axis</b>, ${T('y=0')}. Then the y-term ${T(yTerm)} is worth ${T('0')}: slide the note onto the <b>y-term</b>.`,
        run: async (c) => { await E.moveCard(c, ty.id, T('y=0')); E.tiles[ty.id].style.opacity = 0.15; await show(c, colX); } },
      { cap: `What’s left: ${T(xLines[0])}, so ${T(xLines[xLines.length - 1])}. The <b>x-intercept</b> is ${T(ptX)}.`,
        run: async (c) => {
          for (const L of xLines) await show(c, trailLine(colX, L));
          const p = G.point(xv, 0, { color: XI, r: 8, label: T(ptX), pos: yv > 0 ? 'ne' : 'se', labelColor: XI }); await pop(c, p);
        } },
      { cap: 'Two points fix a line: <b>join the intercepts</b> and the line is graphed.',
        run: async (c) => {
          await fadeOut(c, card, 300); E.tiles[ty.id].style.opacity = 1; E.tiles[tx.id].style.opacity = 1;
          await G.drawIn(G.line([xv, 0], [0, yv], { color: LINE }), 900, c);
        } }
    ];
    if (Number.isInteger(xv)) {
      const m = red(-yv, xv);
      steps.push({ cap: `Bonus: the slope. From ${T(ptY)} to ${T(ptX)}: run ${T(texNum(xv))}, rise ${T(texNum(-yv))}, so the slope is ${T(`\\dfrac{${-yv}}{${xv}}=${fr(m[0], m[1])}`)}.`,
        run: async (c) => { await tri(G, [0, yv], xv, -yv, { runPos: yv > 0 ? 'n' : 's', risePos: 'e' }).draw(c); } });
    } else {
      steps.push({ cap: `An intercept can be a fraction: ${T(`x=${fr(-C, A)}=${texNum(xv)}`)}, halfway between ${T(String(Math.floor(xv)))} and ${T(String(Math.ceil(xv)))}. The grid agrees.`,
        run: async (c) => { await pulse(c, colX, 1.04); } });
    }
    return steps;
  }
};

/* ============ Stand Up Break! (whiteboard stations) ============ */
(() => {
  const SU_GF = 'Write the equation in general form, <i>Ax</i> + <i>By</i> + <i>C</i> = 0.';
  const SU_SI = 'Write the equation in slope–intercept form, <i>y</i> = <i>mx</i> + <i>b</i>.';
  const nz = (r, a, b) => { for (;;) { const v = r.int(a, b) * r.sign(); if (v) return v; } };
  const FR = [[1, 2], [3, 2], [5, 2], [1, 3], [2, 3], [4, 3], [5, 3], [1, 4], [3, 4], [5, 4], [1, 5], [2, 5], [3, 5], [4, 5]];
  /** answer lines for y = (p/q)x + (r/s) → general form, the way the booklet does it */
  function toGF(p, q, rr, s) {
    const L = lcm(q, s), out = [];
    const M = p * L / q, K = rr * L / s;               // Ly = Mx + K
    if (L > 1) out.push(`\\times${L}:\\quad ${L}y=${polyTex([[M, 1, 'x'], [K, 1, '']])}`);
    const left = gf(-M, L, -K);
    out.push(`\\text{move every term left: }\\ {${left}}`);
    if (M > 0) out.push(`\\times(-1):\\quad ${gf(M, -L, K)}`);
    return out;
  }
  function siToGF(r, lvl) {
    if (lvl === 1) { const m = nz(r, 1, 6), b = nz(r, 1, 9); return { text: SU_GF, q: siTex(m, 1, b), a: toGF(m, 1, b, 1) }; }
    if (lvl === 2) { const [p, q] = r.pick(FR), sg = r.sign(), b = nz(r, 1, 9); return { text: SU_GF + ' Clear the fraction first.', q: siTex(sg * p, q, b), a: toGF(sg * p, q, b, 1) }; }
    for (;;) { // two fractions, like y = 3/2 x − 1/4
      const [p, q] = r.pick(FR), [rr, s] = r.pick(FR.filter(([, d]) => d !== 5)), sg = r.sign(), sb = r.sign();
      if (lcm(q, s) > 12 || (q === s && r.chance(0.5))) continue;
      return { text: SU_GF + ' Clear the fractions first.', q: 'y=' + polyTex([[sg * p, q, 'x'], [sb * rr, s, '']], true), a: toGF(sg * p, q, sb * rr, s) };
    }
  }
  function gfToSI(r, lvl) {
    for (;;) {
      let p, q;
      if (lvl === 1) { p = nz(r, 1, 6); q = 1; } else { [p, q] = r.pick(FR); p *= r.sign(); }
      const b = nz(r, 1, 8);
      // q y = p x + q b  →  −p x + q y − q b = 0, then A positive
      let A = -p, B = q, C = -q * b; if (A < 0) { A = -A; B = -B; C = -C; }
      const out = [`${polyTex([[B, 1, 'y']])}=${polyTex([[-A, 1, 'x'], [-C, 1, '']])}`];
      if (B !== 1) out.push(`\\div${par(B)}:\\quad ${siTex(p, q, b, true)}`);
      else out[0] = siTex(p, q, b, true);
      out.push(`\\text{slope } {${fr(p, q)}},\\quad y\\text{-intercept } {${b}}`);
      return { text: SU_SI + ' State the slope and the <i>y</i>-intercept.', q: gf(A, B, C), a: out };
    }
  }
  function intercepts(r) {
    for (;;) {
      const a = nz(r, 1, 8), c = nz(r, 1, 9), g = gcd(a, c);
      // through (a, 0) and (0, c):  c x + a y − a c = 0, divided by gcd, A positive
      let A = c / g, B = a / g, C = -a * c / g; if (A < 0) { A = -A; B = -B; C = -C; }
      if (Math.abs(B) === 1 && r.chance(0.4)) continue;
      const xs = A === 1 ? [] : [`${polyTex([[A, 1, 'x']])}=${-C}`], ys = B === 1 ? [] : [`${polyTex([[B, 1, 'y']])}=${-C}`];
      return { text: 'Find the <i>x</i>-intercept and the <i>y</i>-intercept, without converting to slope–intercept form.', q: gf(A, B, C),
        a: [`y=0:\\quad ${polyTex([[A, 1, 'x'], [C, 1, '']])}=0\\ \\Rightarrow\\ ${xs.length ? xs[0] + '\\ \\Rightarrow\\ ' : ''}x=${a}`,
          `x=0:\\quad ${polyTex([[B, 1, 'y'], [C, 1, '']])}=0\\ \\Rightarrow\\ ${ys.length ? ys[0] + '\\ \\Rightarrow\\ ' : ''}y=${c}`,
          `x\\text{-intercept }(${a},\\ 0),\\qquad y\\text{-intercept }(0,\\ ${c})`] };
    }
  }
  standup('u7l7', {
    intro: 'Work it out at your whiteboard. General form: every term on one side, 0 on the other, integers only, A positive.',
    levels: {
      BEG: (r) => (r.chance(0.5) ? siToGF(r, 1) : gfToSI(r, 1)),            // y = 3x − 5 ↔ 3x − y − 5 = 0
      PRG: (r) => (r.chance(0.5) ? siToGF(r, 2) : gfToSI(r, 2)),            // one fraction: clear it, or divide by B
      MAS: (r) => (r.chance(0.6) ? intercepts(r) : siToGF(r, 3))            // both intercepts, or two fractions to clear
    }
  });
})();
/* ============ end Stand Up Break! ============ */

/* =============================== mount =============================== */
mountTags();
export const explainers = mountExplainers({ zeroMeter, costumes, tidyUp, everyTerm, tidyFrac, solveY, solveYFrac, cover });
export const _test = { gfSub, polyTex, gf, TU, SY, CV };
