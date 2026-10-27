/* Math 15 · Unit 5 · Lesson 5 — Domain and Range of a Relation, Part 1: Reading From a Graph.
 * Explainers: the floor shadow (domain), the wall shadow (range), dots or unbroken (discrete / continuous),
 * curves that bend (scan the whole graph), the rocket (real situations), and the putting-it-together flowchart.
 * Also the Shadow Shapes warm-up, the Shadow Maker (tap to plot, join the dots), the example figures and the Stand Up Break.
 * Built from Math 10C u5l4 (sweeping light, panels, Stand Up figures), cut down to the Math 15 booklet: no inequalities and
 * no set notation yet (that is Lesson 6). Answers are written "x from a to b" (continuous) or as a list (discrete).
 * Colours: domain (floor shadow) amber, range (wall shadow) purple, everywhere on the page. */
import {
  h, tex, add, box, Graph, Flowchart, mountExplainers, pop, fadeIn, appear, pulse, sleep, tween, linear, pairTex, svgEl, liveCtx, COLORS
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const AMB = COLORS.amber, PUR = COLORS.purple;
const nT = (v) => String(+(+v).toFixed(3));                 // TeX number
const uniq = (a) => [...new Set(a)].sort((p, q) => p - q);
const ptT = (p) => T(pairTex(p[0], p[1]));
const listT = (a) => a.map((v) => nT(v)).join(',\\ ');      // −4, −2, 0 (TeX)
const fromTo = (v, lo, hi) => `${T(v)} from ${T(nT(lo))} to ${T(nT(hi))}`;
const anyFT = (v, lo, hi) => `${T(v)} can be any value from ${T(nT(lo))} to ${T(nT(hi))}`;
const times = (n) => ['', 'once', 'twice', 'three times', 'four times'][n] || n + ' times';
function repeats(vals) {
  const cnt = new Map(); vals.forEach((v) => cnt.set(v, (cnt.get(v) || 0) + 1));
  const r = [...cnt].filter(([, n]) => n > 1).map(([v, n]) => `${T(nT(v))} appears ${times(n)}`);
  return r.length ? r.join(' and ') : '';
}

/** a smooth curve through knots (x increasing) that never overshoots: monotone cubic (Fritsch–Carlson), so every
 *  highest / lowest point is exactly a knot. Returns a dense list of [x, y]. */
function smooth(knots, per = 18) {
  const n = knots.length, xs = knots.map((p) => p[0]), ys = knots.map((p) => p[1]);
  if (n < 3) return knots.map((p) => p.slice());
  const d = []; for (let i = 0; i < n - 1; i++) d.push((ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i]));
  const m = new Array(n); m[0] = d[0]; m[n - 1] = d[n - 2];
  for (let i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) { m[i] = m[i + 1] = 0; continue; }
    const a = m[i] / d[i], b = m[i + 1] / d[i], s = a * a + b * b;
    if (s > 9) { const t = 3 / Math.sqrt(s); m[i] = t * a * d[i]; m[i + 1] = t * b * d[i]; }
  }
  const out = [[xs[0], ys[0]]];
  for (let i = 0; i < n - 1; i++) {
    const hh = xs[i + 1] - xs[i];
    for (let k = 1; k <= per; k++) {
      const t = k / per, t2 = t * t, t3 = t2 * t;
      out.push([xs[i] + hh * t, (2 * t3 - 3 * t2 + 1) * ys[i] + (t3 - 2 * t2 + t) * hh * m[i] + (-2 * t3 + 3 * t2) * ys[i + 1] + (t3 - t2) * hh * m[i + 1]]);
    }
  }
  return out;
}
const sample = (f, a, b, n = 80) => Array.from({ length: n + 1 }, (_, i) => { const x = a + (b - a) * i / n; return [x, f(x)]; });

/* the booklet's graphs */
const S1 = [[-4, -1], [3, 4]];                                             // Section 1: a segment
const S2K = [[-3, -1], [-1.5, 2.5], [0, 4], [1.5, 2.5], [3, -1]];          // Section 2: a hill
const E1 = [[-2, -3], [4, 1]];                                             // Example 1
const E2K = [[-4, 2], [-2, -1.5], [0, -3], [1.5, 0.5], [3, 4]];            // Example 2
const E3A = [[-4, 1], [-2, 3], [0, -1], [1, 4], [3, 0]];                   // Example 3(a): dots
const E3B = [[-3, -2], [4, 3]];                                            // Example 3(b)
const E4K = [[-4, -3], [-2, 0], [0, 2], [2, 1], [4, -2]];                  // Example 4
const ROCKET = (t) => 20 - (20 / 9) * (t - 3) * (t - 3);                   // Example 5: h after t s
const COAST = [[1, 2], [3, 6], [6, 1], [8, 4], [9, 3]];                    // warm-up coaster
const COPY = [[1, 2], [3, 6], [6, 0], [8, 4], [9, 3]];                     // warm-up A: copycat
const RAMP = [[1, 1], [9, 6]];                                             // warm-up B
const BALLOONS = [[1, 2], [3, 6], [5, 3], [7, 1], [9, 4]];                 // warm-up C

/* a write-it-down panel on a stage */
function panel(stage, x, y, w, hh, title) { return add(stage, box(h('div', 'u5l5-panel', title ? `<div class="u5l5-ph">${title}</div>` : ''), w, hh), x, y); }
function pline(P, html, cls = '') { const d = h('div', 'u5l5-pl ' + cls, html); P.appendChild(d); return d; }
/** a row of value tokens; repeats (after the first) are marked .dup so a later step can strike them */
function tokenRow(P, label, vals, cls) {
  const d = pline(P, `<span class="u5l5-tl">${label}</span>`, 'u5l5-toks ' + cls);
  const seen = new Set();
  const els = vals.map((v, i) => { const s = h('span', 'u5l5-tok', T(nT(v)) + (i < vals.length - 1 ? '<i class="u5l5-cm">,</i>' : '')); s.dup = seen.has(v); seen.add(v); s.style.opacity = 0; d.appendChild(s); return s; });
  return { row: d, els };
}
const strike = (c, els) => Promise.all(els.filter((s) => s.dup).map((s) => { s.classList.add('u5l5-dup'); return pulse(c, s, 1.2); }));

/* points where a polyline meets the line (axis 0: x = v, axis 1: y = v); returns the other coordinates */
function hitsAt(poly, ax, v) {
  const out = [];
  for (let i = 0; i < poly.length - 1; i++) {
    const p = poly[i], q = poly[i + 1], a = p[ax] - v, b = q[ax] - v;
    if (a === 0 && b === 0) { out.push(p[1 - ax], q[1 - ax]); continue; }
    if (a * b <= 0 && p[ax] !== q[ax]) { const t = (v - p[ax]) / (q[ax] - p[ax]); out.push(p[1 - ax] + t * (q[1 - ax] - p[1 - ax])); }
  }
  return out;
}
/* a flashlight pointing down (rotated for the side light); a sun */
const LAMP = '<svg viewBox="0 0 36 40" width="36" height="40"><rect x="12" y="1" width="12" height="16" rx="3" fill="#3a4254"/><path d="M8 17H28L33 28H3Z" fill="#f5c542" stroke="#c27a0e" stroke-width="2" stroke-linejoin="round"/><path d="M6 33L2 38M18 32V39M30 33L34 38" stroke="#e8a01e" stroke-width="2.6" stroke-linecap="round"/></svg>';
const SUN = '<svg viewBox="0 0 44 44" width="44" height="44"><circle cx="22" cy="22" r="10" fill="#ffd54f" stroke="#c88c14" stroke-width="2"/><g stroke="#e8a01e" stroke-width="3" stroke-linecap="round"><path d="M22 3v6M22 35v6M3 22h6M35 22h6M8.6 8.6l4.2 4.2M31.2 31.2l4.2 4.2M8.6 35.4l4.2-4.2M31.2 12.8l4.2-4.2"/></g></svg>';
/** sweep a beam of light across G (axis 'x': top-down beam moving right; 'y': side beam moving down) and grow the shadow */
async function sweep(G, c, axis, polys, color, ms = 2400) {
  const X = axis === 'x', w = G.win, from = X ? w.xmin : w.ymax, to = X ? w.xmax : w.ymin;
  const st = { v: from, lo: null, hi: null }, hits = (v) => polys.flatMap((p) => hitsAt(p, X ? 0 : 1, v));
  const beam = G.curve(() => ({ subs: [X ? [G.toPx(st.v, w.ymax), G.toPx(st.v, w.ymin)] : [G.toPx(w.xmin, st.v), G.toPx(w.xmax, st.v)]] }),
    { color: '#f5c542', width: 18, opacity: 0.42, cap: 'butt' }, 'u5l5-beam', G.layers.data);
  const bar = G.curve(() => { if (st.lo == null) return { subs: [] }; const P = (v) => (X ? G.toPx(v, G.axisY()) : G.toPx(G.axisX(), v)); return { subs: [[P(st.lo), P(st.hi)]] }; },
    { color, width: 9, opacity: 0.6, cap: 'butt' }, 'u5l5-grow', G.layers.data);
  const dots = svgEl('g', { class: 'u5l5-hits' }, G.layers.top);
  const lamp = h('div', 'u5l5-lamp' + (X ? '' : ' side'), LAMP); G.html.appendChild(lamp);
  const paint = () => {
    beam._bkDraw(); bar._bkDraw(); dots.innerHTML = '';
    hits(st.v).forEach((u) => { const [px, py] = X ? G.toPx(st.v, u) : G.toPx(u, st.v); svgEl('circle', { cx: px, cy: py, r: 7, class: 'u5l5-hit' }, dots); });
    const [lx, ly] = X ? G.toPx(st.v, w.ymax) : G.toPx(w.xmax, st.v); lamp.style.left = lx + 'px'; lamp.style.top = ly + 'px';
  };
  try {
    await tween(c, ms, (t) => {
      st.v = from + (to - from) * t;
      if (hits(st.v).length) { st.lo = st.lo == null ? st.v : Math.min(st.lo, st.v); st.hi = st.hi == null ? st.v : Math.max(st.hi, st.v); }
      paint();
    }, linear);
  } finally { G.remove(beam, bar); dots.remove(); lamp.remove(); }
}
const pickPos = (p, other) => (p[1] >= other[1] ? 'n' : 's');

/* ======================= Section 1: the floor shadow (domain) ======================= */
const FL = {
  s1: { name: 'Section 1 graph', seg: S1, mid: 0.5 },
  hill: { name: 'A hill', knots: S2K, mid: -1 },
  e1: { name: 'Example 1', seg: E1, mid: 1, test: 5, ex: true },
  e3b: { name: 'Example 3(b)', seg: E3B, mid: 1.5, ex: true },
  e4: { name: 'Example 4', knots: E4K, mid: 2.5, ex: true }
};
const shape = (d) => (d.seg ? d.seg : smooth(d.knots));
const floor = {
  title: 'The domain is the floor shadow',
  height: 470,
  minW: 940,
  choices: [{ v: 's1', label: 'Section 1 graph' }, { v: 'hill', label: 'A hill' }, { sep: 'Check:' }, { v: 'e1', label: 'Example 1' }, { v: 'e3b', label: 'Example 3(b)' }, { v: 'e4', label: 'Example 4' }],
  intro: (k) => (FL[k].ex ? `${FL[k].name}: check the class’s domain. Press <b>Next</b>.` : 'Which <b>x</b>-values does this graph use? Press <b>Next</b>.'),
  make(stage, k, ex) {
    const d = FL[k], poly = shape(d), a = poly[0], b = poly[poly.length - 1];
    const G = new Graph(stage, { x: 14, y: 14, width: 440, height: 440, xmin: -6, xmax: 6, ymin: -6, ymax: 6 });
    const P = panel(stage, 474, 14, ex.W - 488, 440, 'Write it down');
    const midY = hitsAt(poly, 0, d.mid)[0];
    let sh;
    const steps = [
      { cap: `The graph: an unbroken ${d.seg ? 'line segment' : 'curve'} from ${ptT(a)} to ${ptT(b)}.`,
        run: async (c) => { await G.drawIn(G.polyline(poly, { ends: ['closed', 'closed'] }), 900, c); } },
      { cap: `Find the <b>leftmost</b> point and the <b>rightmost</b> point.`,
        run: async (c) => {
          for (const [p, txt, pos] of [[a, 'leftmost', 'w'], [b, 'rightmost', 'e']]) {
            await G.drawIn(G.segment(p, [p[0], 0], { color: 'amber', width: 2, dash: '5 5' }), 300, c);
            await G.reveal(G.point(p[0], p[1], { color: 'amber', label: `${txt}<br>${T('x=' + nT(p[0]))}`, pos: p[1] >= 0 ? (pos === 'w' ? 'nw' : 'ne') : (pos === 'w' ? 'sw' : 'se') }), c);
          }
        } },
      { cap: `Shine a light <b>straight down</b>, like the sun at noon. Wherever it hits the graph, a shadow lands on the ${T('x')}-axis.`,
        run: (c) => sweep(G, c, 'x', [poly], AMB) },
      { cap: `The <b>floor shadow</b> runs from ${T('x=' + nT(a[0]))} to ${T('x=' + nT(b[0]))}. That shadow is the <b>domain</b>.`,
        run: async (c) => { sh = G.shadeX(a[0], b[0], { band: true }); await G.drawIn(sh, 600, c); await fadeIn(c, pline(P, `<b>Domain</b><br>${anyFT('x', a[0], b[0])}`, 'dom u5l5-ans')); } },
      { cap: `Every ${T('x')} in between is used too. Try ${T('x=' + nT(d.mid))}: go straight up or down from it and you hit the graph.`,
        run: async (c) => {
          const v = G.vline(d.mid, { color: 'amber', width: 2.5 }); await G.drawIn(v, 500, c);
          await G.reveal(G.point(d.mid, midY, { color: 'amber', r: 7.5 }), c);
          await fadeIn(c, pline(P, `${T('x=' + nT(d.mid))} is used ✓`, 'u5l5-note'));
        } }
    ];
    if (d.test != null) steps.push({
      cap: `(b) Is ${T('x=' + d.test)} part of it? Go to ${T('x=' + d.test)}: <b>no point</b> of the graph is there. It stops at ${ptT(b)}, so <b>no</b>.`,
      run: async (c) => {
        const v = G.vline(d.test, { color: 'red', width: 3 }); await G.drawIn(v, 500, c);
        const s = G.label(d.test, 4.5, '✗', { cls: 'u5l5-xmark' }); await pop(c, s, 360);
        await fadeIn(c, pline(P, `${T('x=' + d.test)} is <b>outside</b> the domain ✗`, 'u5l5-note bad'));
      } });
    return steps;
  }
};

/* ======================= Section 2: the wall shadow (range) ======================= */
const WL = {
  hill: { name: 'Section 2 graph', knots: S2K, mid: 1.5 },
  s1: { name: 'Section 1 graph', seg: S1, mid: 2.5 },
  e2: { name: 'Example 2', knots: E2K, mid: 1, test: 5, ex: true },
  e3b: { name: 'Example 3(b)', seg: E3B, mid: -1, ex: true }
};
const wall = {
  title: 'The range is the wall shadow',
  height: 470,
  minW: 940,
  choices: [{ v: 'hill', label: 'Section 2 graph' }, { v: 's1', label: 'Section 1 graph' }, { sep: 'Check:' }, { v: 'e2', label: 'Example 2' }, { v: 'e3b', label: 'Example 3(b)' }],
  intro: (k) => (WL[k].ex ? `${WL[k].name}: check the class’s range. Press <b>Next</b>.` : 'Which <b>y</b>-values does this graph reach? Press <b>Next</b>.'),
  make(stage, k, ex) {
    const d = WL[k], poly = shape(d), ys = poly.map((p) => p[1]), lo = Math.min(...ys), hi = Math.max(...ys);
    const low = poly.find((p) => p[1] === lo), high = poly.find((p) => p[1] === hi);
    const G = new Graph(stage, { x: 14, y: 14, width: 440, height: 440, xmin: -6, xmax: 6, ymin: -6, ymax: 6 });
    const P = panel(stage, 474, 14, ex.W - 488, 440, 'Write it down');
    const isEnd = (p) => p === poly[0] || p === poly[poly.length - 1];
    const where = (p) => (isEnd(p) ? 'an endpoint' : 'the ' + (p === high ? 'peak' : 'bottom of the dip'));
    const midX = hitsAt(poly, 1, d.mid);
    const steps = [
      { cap: `The graph: an unbroken ${d.seg ? 'line segment' : 'curve'} from ${ptT(poly[0])} to ${ptT(poly[poly.length - 1])}.`,
        run: (c) => G.drawIn(G.polyline(poly, { ends: ['closed', 'closed'] }), 900, c) },
      { cap: `Now shine a flashlight <b>straight across</b>, from the side. Its shadow lands on the ${T('y')}-axis.`,
        run: (c) => sweep(G, c, 'y', [poly], PUR) },
      { cap: `The shadow’s bottom is the graph’s <b>lowest</b> point, ${T('y=' + nT(lo))} (${where(low)}). Its top is the <b>highest</b> point, ${T('y=' + nT(hi))} (${where(high)}).`,
        run: async (c) => {
          for (const [p, txt] of [[low, 'lowest'], [high, 'highest']]) {
            await G.drawIn(G.segment(p, [0, p[1]], { color: 'purple', width: 2, dash: '5 5' }), 300, c);
            await G.reveal(G.point(p[0], p[1], { color: 'purple', label: `${txt} ${T('y=' + nT(p[1]))}`, pos: txt === 'lowest' ? 's' : 'n' }), c);
          }
        } },
      { cap: `That <b>wall shadow</b> is the <b>range</b>: every ${T('y')} from the lowest to the highest.`,
        run: async (c) => { await G.drawIn(G.shadeY(lo, hi, { band: true }), 600, c); await fadeIn(c, pline(P, `<b>Range</b><br>${anyFT('y', lo, hi)}`, 'ran u5l5-ans')); } },
      { cap: `Every ${T('y')} in between is reached too. Try ${T('y=' + nT(d.mid))}: the line ${T('y=' + nT(d.mid))} meets the graph.`,
        run: async (c) => {
          const v = G.hline(d.mid, { color: 'purple', width: 2.5 }); await G.drawIn(v, 500, c);
          for (const x of midX) await G.reveal(G.point(x, d.mid, { color: 'purple', r: 7.5 }), c);
          await fadeIn(c, pline(P, `${T('y=' + nT(d.mid))} is reached ✓`, 'u5l5-note'));
        } }
    ];
    if (d.test != null) steps.push({
      cap: `(b) Could ${T('y=' + d.test)} happen? Draw the line ${T('y=' + d.test)}: it <b>never meets</b> the curve. The highest the curve gets is ${T('y=' + nT(hi))}, so <b>no</b>.`,
      run: async (c) => {
        const v = G.hline(d.test, { color: 'red', width: 3 }); await G.drawIn(v, 500, c);
        const s = G.label(-4.5, d.test, '✗', { cls: 'u5l5-xmark' }); await pop(c, s, 360);
        await fadeIn(c, pline(P, `${T('y=' + d.test)} is <b>outside</b> the range ✗`, 'u5l5-note bad'));
      } });
    return steps;
  }
};

/* ======================= Section 3: dots or unbroken ======================= */
const DS = {
  join: { name: 'Join the dots', pts: [[-4, 1], [-2, 3], [0, -1], [2, 4], [4, 1]], join: true },
  e3a: { name: 'Example 3(a)', pts: E3A, ex: true },
  e3b: { name: 'Example 3(b)', seg: E3B, ex: true }
};
const discrete = {
  title: 'Dots or unbroken? Discrete or continuous',
  height: 470,
  minW: 940,
  choices: [{ v: 'join', label: 'Five dots, then join them' }, { sep: 'Check:' }, { v: 'e3a', label: 'Example 3(a)' }, { v: 'e3b', label: 'Example 3(b)' }],
  intro: (k) => (k === 'join' ? 'Five <b>separate</b> dots. What are their shadows? Press <b>Next</b>.' : `${DS[k].name}: check the type, the domain and the range. Press <b>Next</b>.`),
  make(stage, k, ex) {
    const d = DS[k], G = new Graph(stage, { x: 14, y: 14, width: 440, height: 440, xmin: -6, xmax: 6, ymin: -6, ymax: 6 });
    const P = panel(stage, 474, 14, ex.W - 488, 440, 'Write it down');
    if (d.seg) {
      const [a, b] = d.seg;
      return [
        { cap: `An unbroken line segment from ${ptT(a)} to ${ptT(b)}: no gaps, so it is <b>continuous</b>.`,
          run: async (c) => { await G.drawIn(G.segment(a, b, { closedA: true, closedB: true }), 900, c); await fadeIn(c, pline(P, '<b>Type</b> continuous (no gaps)', 'u5l5-type')); } },
        { cap: `Floor shadow: one solid bar, from ${T(nT(a[0]))} to ${T(nT(b[0]))}. Every value in between counts, so give the <b>endpoints</b>.`,
          run: async (c) => { await sweep(G, c, 'x', [d.seg], AMB, 1600); await G.drawIn(G.shadeX(a[0], b[0], { band: true }), 500, c); await fadeIn(c, pline(P, `<b>Domain</b> ${fromTo('x', a[0], b[0])}`, 'dom u5l5-ans')); } },
        { cap: `Wall shadow: from ${T(nT(a[1]))} to ${T(nT(b[1]))}.`,
          run: async (c) => { await sweep(G, c, 'y', [d.seg], PUR, 1600); await G.drawIn(G.shadeY(a[1], b[1], { band: true }), 500, c); await fadeIn(c, pline(P, `<b>Range</b> ${fromTo('y', a[1], b[1])}`, 'ran u5l5-ans')); } }
      ];
    }
    const pts = d.pts, xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
    const dupOf = (a) => a.filter((v, i) => a.indexOf(v) !== i)[0], dy = dupOf(ys);
    const xsS = pts.slice().sort((p, q) => p[0] - q[0]);
    let xT, yT; const shad = [];
    const steps = [
      { cap: `Plot the points. They are <b>separate dots</b>, not joined: a <b>discrete</b> graph. Only these points belong to it.`,
        run: async (c) => { for (const p of pts) { await G.reveal(G.point(p[0], p[1], { coords: true, pos: p[1] >= 0 ? 'ne' : 'se' }), c); await sleep(c, 80); } await fadeIn(c, pline(P, '<b>Type</b> discrete (separate dots)', 'u5l5-type')); } },
      { cap: `Sun from above: each dot drops its <b>own</b> shadow dot on the ${T('x')}-axis. Nothing in between!`,
        run: async (c) => {
          for (const p of pts) { const g = G.segment(p, [p[0], 0], { color: 'amber', width: 2, dash: '5 5' }); shad.push(g); await G.drawIn(g, 220, c); const s = G.point(p[0], 0, { color: 'amber', r: 7.5 }); shad.push(s); await pop(c, s, 220); }
          xT = tokenRow(P, 'x-values', xs, 'dom'); await Promise.all(xT.els.map((e) => appear(c, e, 300)));
        } },
      { cap: `So the domain is a <b>list</b> of those ${T('x')}-values, smallest first.`,
        run: async (c) => { await strike(c, xT.els); await fadeIn(c, pline(P, `<b>Domain</b> ${T(listT(uniq(xs)))}`, 'dom u5l5-ans')); } },
      { cap: `Flashlight from the side: shadow dots on the ${T('y')}-axis.` + (dy != null ? ` Two dots share ${T('y=' + nT(dy))}.` : ''),
        run: async (c) => {
          for (const p of pts) { const g = G.segment(p, [0, p[1]], { color: 'purple', width: 2, dash: '5 5' }); shad.push(g); await G.drawIn(g, 220, c); const s = G.point(0, p[1], { color: 'purple', r: 7.5 }); shad.push(s); await pop(c, s, 220); }
          yT = tokenRow(P, 'y-values', ys, 'ran'); await Promise.all(yT.els.map((e) => appear(c, e, 300)));
        } },
      { cap: `The range is a list too, each value written <b>once</b>.` + (dy != null ? ` ${repeats(ys)}, so it is listed once.` : ''),
        run: async (c) => { await strike(c, yT.els); await fadeIn(c, pline(P, `<b>Range</b> ${T(listT(uniq(ys)))}`, 'ran u5l5-ans')); } }
    ];
    if (d.join) {
      const lo = Math.min(...ys), hi = Math.max(...ys);
      steps.push(
        { cap: `Now <b>join</b> the dots with lines. No gaps: the graph becomes <b>continuous</b>.`,
          run: async (c) => { await Promise.all(shad.map((s) => c.anim(s, [{ opacity: 1 }, { opacity: 0.15 }], 400, { fill: 'forwards' }))); await G.drawIn(G.polyline(xsS, { color: 'teal' }), 1100, c); await fadeIn(c, pline(P, '<b>Joined:</b> continuous', 'u5l5-type u5l5-sep')); } },
        { cap: `The shadows fill in solid: ${fromTo('x', xsS[0][0], xsS[xsS.length - 1][0])} and ${fromTo('y', lo, hi)}. A list is no longer enough.`,
          run: async (c) => {
            await G.drawIn(G.shadeX(xsS[0][0], xsS[xsS.length - 1][0], { band: true }), 600, c);
            await fadeIn(c, pline(P, `<b>Domain</b> ${fromTo('x', xsS[0][0], xsS[xsS.length - 1][0])}`, 'dom u5l5-ans'));
            await G.drawIn(G.shadeY(lo, hi, { band: true }), 600, c);
            await fadeIn(c, pline(P, `<b>Range</b> ${fromTo('y', lo, hi)}`, 'ran u5l5-ans'));
          } });
    }
    return steps;
  }
};

/* ======================= Section 4: scan the whole graph ======================= */
const SC = {
  coast: { name: 'The warm-up coaster', knots: COAST, win: { xmin: 0, xmax: 10, ymin: 0, ymax: 7 }, size: [440, 318] },
  e4: { name: 'Example 4', knots: E4K, ex: true },
  e2: { name: 'Example 2', knots: E2K, ex: true }
};
const scan = {
  title: 'Scan the whole graph, not just the ends',
  height: 470,
  minW: 940,
  choices: [{ v: 'coast', label: 'The coaster' }, { sep: 'Check:' }, { v: 'e4', label: 'Example 4' }, { v: 'e2', label: 'Example 2' }],
  intro: (k) => (SC[k].ex ? `${SC[k].name}: check the range. Press <b>Next</b>.` : 'The warm-up roller coaster. Where are its lowest and highest points? Press <b>Next</b>.'),
  make(stage, k, ex) {
    const d = SC[k], poly = smooth(d.knots), a = poly[0], b = poly[poly.length - 1];
    const ys = poly.map((p) => p[1]), lo = Math.min(...ys), hi = Math.max(...ys);
    const low = d.knots.find((p) => p[1] === lo), high = d.knots.find((p) => p[1] === hi);
    const win = d.win || { xmin: -6, xmax: 6, ymin: -6, ymax: 6 }, [gw, gh] = d.size || [440, 440];
    const G = new Graph(stage, Object.assign({ x: 14, y: 14 + (440 - gh) / 2, width: gw, height: gh }, win));
    const P = panel(stage, 474, 14, ex.W - 488, 440, 'Write it down');
    const isEnd = (p) => (p[0] === a[0] && p[1] === a[1]) || (p[0] === b[0] && p[1] === b[1]);
    const endLo = Math.min(a[1], b[1]), endHi = Math.max(a[1], b[1]);
    let guess, gq, ceil;
    const endNote = (lo < endLo && hi > endHi) ? `Both ends, ${T(nT(a[1]))} and ${T(nT(b[1]))}, are hidden <b>inside</b> the shadow.`
      : `The end at ${T('y=' + nT(isEnd(high) ? (high[1] === a[1] ? b[1] : a[1]) : (low[1] === a[1] ? b[1] : a[1])))} is hidden inside.`;
    return [
      { cap: `A curve that bends more than once, from ${ptT(a)} to ${ptT(b)}.`,
        run: (c) => G.drawIn(G.polyline(poly, { ends: ['closed', 'closed'] }), 1100, c) },
      { cap: `<b>The trap:</b> look only at the two ends. They sit at ${T('y=' + nT(a[1]))} and ${T('y=' + nT(b[1]))}. Is the range from ${T(nT(endLo))} to ${T(nT(endHi))}?`,
        run: async (c) => {
          for (const p of [a, b]) await G.drawIn(G.segment(p, [win.xmin > 0 ? win.xmin : 0, p[1]], { color: 'gray', width: 2, dash: '5 5' }), 280, c);
          guess = G.shadeY(endLo, endHi, { color: 'gray', offset: -16 }); await G.drawIn(guess, 500, c);
          gq = G.label(win.xmin > 0 ? win.xmin : 0, (endLo + endHi) / 2, '?', { pos: 'w', cls: 'u5l5-q', dx: -26 }); await pop(c, gq, 300);
        } },
      { cap: `Lower a <b>ceiling</b> from the top until it first touches the curve: ${ptT(high)}, the <b>highest</b> point. ` + (isEnd(high) ? 'Here it is an end.' : 'It is <b>not</b> an end!'),
        run: async (c) => {
          ceil = G.hline(win.ymax, { color: 'purple', width: 3, dash: false });
          await tween(c, 1400, (t) => ceil.set(win.ymax + (hi - win.ymax) * t));
          await G.reveal(G.point(high[0], high[1], { color: 'purple', label: `highest ${T('y=' + nT(hi))}`, pos: 'n' }), c);
        } },
      { cap: `Raise a <b>floor</b> from the bottom until it touches: ${ptT(low)}, the <b>lowest</b> point. ` + (isEnd(low) ? 'Here it is an end.' : 'It is <b>not</b> an end!'),
        run: async (c) => {
          const fl = G.hline(win.ymin, { color: 'purple', width: 3, dash: false });
          await tween(c, 1400, (t) => fl.set(win.ymin + (lo - win.ymin) * t));
          await G.reveal(G.point(low[0], low[1], { color: 'purple', label: `lowest ${T('y=' + nT(lo))}`, pos: 's' }), c);
        } },
      { cap: `So the range runs from the lowest to the highest: ${fromTo('y', lo, hi)}. ${endNote}`,
        run: async (c) => {
          await Promise.all([guess, gq].map((e) => c.anim(e, [{ opacity: 1 }, { opacity: 0 }], 300, { fill: 'forwards' })));
          await G.drawIn(G.shadeY(lo, hi, { band: true }), 700, c);
          await fadeIn(c, pline(P, `<b>Range</b> ${fromTo('y', lo, hi)}`, 'ran u5l5-ans'));
          await fadeIn(c, pline(P, `not ${T(nT(endLo))} to ${T(nT(endHi))}: that is only the ends ✗`, 'u5l5-note bad'));
        } },
      { cap: `The domain still comes from the leftmost and rightmost points: ${fromTo('x', a[0], b[0])}.`,
        run: async (c) => { await G.drawIn(G.shadeX(a[0], b[0], { band: true }), 600, c); await fadeIn(c, pline(P, `<b>Domain</b> ${fromTo('x', a[0], b[0])}`, 'dom u5l5-ans')); } }
    ];
  }
};

/* ======================= Section 5: real situations ======================= */
const ROCKET_SVG = '<svg viewBox="0 0 40 64" width="40" height="64"><path d="M20 2C30 12 31 30 28 44H12C9 30 10 12 20 2Z" fill="#e8edf6" stroke="#3a4254" stroke-width="2.2"/><circle cx="20" cy="22" r="5" fill="#5a96d2" stroke="#3a4254" stroke-width="2"/><path d="M12 34L4 48L12 46ZM28 34L36 48L28 46Z" fill="#c93a33" stroke="#3a4254" stroke-width="2" stroke-linejoin="round"/></svg>';
const FLAME = '<svg viewBox="0 0 20 22" width="20" height="22"><path d="M10 22C3 14 5 6 10 0C15 6 17 14 10 22Z" fill="#f5a623"/><path d="M10 19C7 14 8 9 10 5C12 9 13 14 10 19Z" fill="#ffe27a"/></svg>';
const DIVER_SVG = '<svg viewBox="0 0 30 46" width="30" height="46"><circle cx="15" cy="8" r="6" fill="#f2c9a0" stroke="#3a4254" stroke-width="2"/><path d="M15 14V30M15 30L8 44M15 30L22 44M15 18L5 10M15 18L25 10" stroke="#1f5bd6" stroke-width="4" stroke-linecap="round" fill="none"/></svg>';
const RK = {
  e5: { name: 'Example 5: the toy rocket', f: ROCKET, T: 6, peak: [3, 20], win: { xmin: -3, xmax: 7, ymin: 0, ymax: 22, xstep: 1, ystep: 2, ylabels: 4 }, v: ['t', 'h'], start: 'on the ground', who: 'rocket', ex: true },
  diver: { name: 'A diver', f: (t) => 4 - (t - 1) * (t - 1), T: 3, peak: [1, 4], win: { xmin: -2, xmax: 4, ymin: 0, ymax: 5, xstep: 0.5, ystep: 0.5, xlabels: 1, ylabels: 1 }, v: ['t', 'h'], start: 'on the 3 m board', who: 'diver' }
};
const rocket = {
  title: 'Real situations: only values that make sense',
  height: 470,
  minW: 940,
  choices: [{ v: 'diver', label: 'A diver' }, { sep: 'Check:' }, { v: 'e5', label: 'Example 5' }],
  intro: (k) => (k === 'e5' ? `Example 5: a toy rocket. ${T('h')} is its height in metres, ${T('t')} seconds after launch. Press <b>Next</b>.`
    : `A diver jumps up off a 3&nbsp;m board and drops into the pool. ${T('h')} is the height above the water in metres, after ${T('t')} seconds. Press <b>Next</b>.`),
  make(stage, k, ex) {
    const d = RK[k], f = d.f, [u, v] = d.v, pk = d.peak, h0 = f(0);
    const G = new Graph(stage, Object.assign({ x: 14, y: 14, width: 440, height: 440, xtitle: u + '\\text{ (s)}', ytitle: v + '\\text{ (m)}' }, d.win));
    const SKY = 96, sx = 466;
    const [, gTop] = G.toPx(0, d.win.ymax), [, gBot] = G.toPx(0, 0);
    const sky = add(stage, box(h('div', 'u5l5-sky'), SKY, gBot - gTop + 24), sx, 14 + gTop);
    const gnd = h('div', 'u5l5-ground' + (k === 'diver' ? ' pool' : '')); gnd.style.top = (gBot - gTop) + 'px'; sky.appendChild(gnd);
    const Yp = (hh) => G.toPx(0, hh)[1] - gTop;                    // px from the top of the sky column
    if (k === 'diver') { const bd = h('div', 'u5l5-board'); bd.style.top = Yp(3) + 'px'; sky.appendChild(bd); }
    const actor = h('div', 'u5l5-actor', k === 'e5' ? ROCKET_SVG + `<span class="u5l5-flame">${FLAME}</span>` : DIVER_SVG); sky.appendChild(actor);
    const putActor = (hh) => { actor.style.top = (Yp(hh) - (k === 'e5' ? 64 : 46)) + 'px'; };
    putActor(h0);
    const P = panel(stage, sx + SKY + 14, 14, ex.W - (sx + SKY + 28), 440, 'Write it down');
    const st = { t: 0 };
    const trace = G.curve(() => ({ subs: [sample(f, 0, st.t, Math.max(2, Math.round(st.t * 30))).map((p) => G.toPx(p[0], p[1]))] }), { color: 'teal', width: 3.5 }, 'u5l5-trace', G.layers.data);
    let dot, link;
    return [
      { cap: `At ${T('t=0')} the ${d.who} is ${d.start}: the point ${ptT([0, h0])}.`,
        run: async (c) => { dot = G.point(0, h0, { color: 'teal', r: 7 }); await pop(c, dot, 300); await pulse(c, actor, 1.15); } },
      { cap: k === 'e5' ? `Launch! As time passes, the graph records the rocket’s height. Up to ${T('20')} m at ${T('t=3')}, then back down.`
        : `Jump! Up to ${T('4')} m at ${T('t=1')}, then down into the water at ${T('t=3')}. The graph records the height.`,
        run: async (c) => {
          actor.classList.add('go');
          link = G.curve(() => { const [px, py] = G.toPx(st.t, f(st.t)); return { subs: [[[px, py], [G.toPx(d.win.xmax, 0)[0] + 20, py]]] }; }, { color: 'gray', width: 1.5, dash: '4 4' }, '', G.layers.top);
          await tween(c, 3600, (t) => { st.t = d.T * t; trace._bkDraw(); link._bkDraw(); G.moveTo(dot, st.t, Math.max(0, f(st.t))); putActor(Math.max(0, f(st.t))); }, linear);
          actor.classList.remove('go'); G.remove(link);
          await G.reveal(G.point(d.T, 0, { color: 'teal', r: 7, label: k === 'e5' ? 'lands' : 'splash', pos: 'nw' }), c);
        } },
      { cap: `<b>Domain:</b> the ${k === 'e5' ? 'flight' : 'dive'} lasts from ${T('t=0')} to ${T('t=' + d.T)}. So ${fromTo('t', 0, d.T)} seconds.`,
        run: async (c) => { await G.drawIn(G.shadeX(0, d.T, { band: true }), 600, c); await fadeIn(c, pline(P, `<b>Domain</b> ${fromTo('t', 0, d.T)} s`, 'dom u5l5-ans')); } },
      { cap: k === 'e5' ? `<b>Range:</b> lowest height ${T('0')} m (on the ground, at the start and the end), highest ${T('20')} m (the peak). So ${fromTo('h', 0, 20)} metres.`
        : `<b>Range:</b> lowest ${T('0')} m (the water), highest ${T('4')} m (the top of the jump). The board, ${T('3')} m, is <b>neither</b>! So ${fromTo('h', 0, 4)} metres.`,
        run: async (c) => {
          await G.drawIn(G.segment(pk, [0, pk[1]], { color: 'purple', width: 2, dash: '5 5' }), 300, c);
          await G.reveal(G.point(pk[0], pk[1], { color: 'purple', label: 'highest', pos: 'n' }), c);
          await G.drawIn(G.shadeY(0, pk[1], { band: true }), 600, c); await fadeIn(c, pline(P, `<b>Range</b> ${fromTo('h', 0, pk[1])} m`, 'ran u5l5-ans'));
        } },
      { cap: `What about ${T('t=-1')}? That is one second <b>before</b> the ${k === 'e5' ? 'launch' : 'jump'}: nothing is happening yet, so there is no graph there. Time starts at ${T('0')}: <b>no negative</b> ${T('t')}.`,
        run: async (c) => {
          const [x0, y0] = G.toPx(d.win.xmin, d.win.ymax), [x1, y1] = G.toPx(0, 0);
          const r = svgEl('rect', { x: x0, y: y0, width: x1 - x0, height: y1 - y0, class: 'u5l5-before' }, G.layers.bg);
          await appear(c, r, 400);
          const lb = G.label(d.win.xmin * 0.56, d.win.ymax * 0.55, `before<br>${k === 'e5' ? 'launch' : 'the jump'}<br><b class="u5l5-no">✗</b>`, { cls: 'u5l5-beflab' }); await fadeIn(c, lb);
          await fadeIn(c, pline(P, `${T('t')} can’t be negative: the situation starts at ${T('t=0')}.`, 'u5l5-note'));
        } }
    ];
  }
};

/* ======================= putting it together ======================= */
const WH = {
  e3a: { label: 'Example 3(a)', what: 'Example 3(a): five separate dots.', path: ['q1', 'list'],
    caps: ['Separate dots: <b>discrete</b>.', 'Write a <b>list</b>: each x once, each y once, smallest first.'],
    ans: [`D: ${T(listT([-4, -2, 0, 1, 3]))}`, `R: ${T(listT([-1, 0, 1, 3, 4]))}`] },
  e4: { label: 'Example 4', what: 'Example 4: a curve that bends.', path: ['q1', 'ft', 'dom', 'ran'],
    caps: ['An unbroken curve: <b>continuous</b>.', 'So write “from … to …”.', `Domain: leftmost ${T('-4')} to rightmost ${T('4')}.`, `Range: scan the <b>whole</b> curve. Lowest ${T('-3')}, highest ${T('2')} (the peak, not an end).`],
    ans: [`D: ${fromTo('x', -4, 4)}`, `R: ${fromTo('y', -3, 2)}`] },
  e5: { label: 'Example 5', what: 'Example 5: the toy rocket.', path: ['q1', 'ft', 'dom', 'ran', 'real'],
    caps: ['An unbroken curve: <b>continuous</b>.', 'So write “from … to …”.', `Domain: launch ${T('t=0')} to landing ${T('t=6')}.`, `Range: the ground ${T('0')} up to the peak ${T('20')}.`, 'A real situation: does it make sense? Time starts at 0, heights are never below the ground. ✓'],
    ans: [`D: ${fromTo('t', 0, 6)} s`, `R: ${fromTo('h', 0, 20)} m`] }
};
const which = {
  title: 'Putting it together',
  height: 400,
  minW: 920,
  choices: Object.keys(WH).map((k) => ({ v: k, label: WH[k].label })),
  intro: (k) => WH[k].what + ' Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = WH[k], W = ex.W;
    const F = new Flowchart(stage, { x: 0, y: 0, width: W, height: 400,
      nodes: {
        q1: { x: W / 2, y: 40, w: 420, h: 62, html: '<b>Separate dots, or unbroken?</b>look at the whole graph', cls: 'bk-round' },
        list: { x: 190, y: 150, w: 340, h: 80, html: '<b>Dots (discrete): a list</b>each value once, smallest first', color: 'amber' },
        ft: { x: W - 250, y: 150, w: 400, h: 80, html: '<b>Unbroken (continuous)</b>“from … to …”', color: 'purple' },
        dom: { x: W - 390, y: 262, w: 270, h: 76, html: '<b>Domain</b>leftmost to rightmost', color: 'blue' },
        ran: { x: W - 115, y: 262, w: 220, h: 76, html: '<b>Range</b>lowest to highest:<br>scan it all!', color: 'blue' },
        real: { x: W - 250, y: 362, w: 440, h: 60, html: '<b>Real situation?</b> keep values that make sense', color: 'green' }
      },
      edges: [{ from: 'q1', to: 'list', label: 'dots', route: 'vhv' }, { from: 'q1', to: 'ft', label: 'unbroken', route: 'vhv' }, { from: 'ft', to: 'dom', route: 'vhv' }, { from: 'dom', to: 'ran' }, { from: 'ran', to: 'real', route: 'vhv' }] });
    const card = add(stage, box(h('div', 'u5l5-acard', `<div class="u5l5-ph">${d.label}</div>`), 360, 150), 10, 236);
    const steps = d.path.map((id, i) => ({ cap: d.caps[i], run: (c) => (i ? F.go(c, d.path[i - 1], id).then(() => F.visit(c, id)) : F.visit(c, id)) }));
    steps.push({ cap: 'So the answer is written like this.', run: async (c) => { for (const a of d.ans) await fadeIn(c, pline(card, a, 'u5l5-ans')); } });
    return steps;
  }
};

/* ======================= warm-up: Shadow Shapes ======================= */
function mountWarm() {
  const host = document.getElementById('u5l5-coaster'); if (!host) return;
  const cw = Math.min(440, host.clientWidth || 440);
  const G = new Graph(host, { width: cw, height: Math.round((cw - 60) * 0.7 + 52), xmin: 0, xmax: 10, ymin: 0, ymax: 7, fontSize: 16, origin: true });
  const track = smooth(COAST);
  G.polyline(track, { color: 'teal', width: 4.5, ends: ['closed', 'closed'] });
  const sunEl = h('div', 'u5l5-sunic', SUN); G.html.appendChild(sunEl); { const [px, py] = G.toPx(9.6, 7); sunEl.style.left = px + 'px'; sunEl.style.top = (py - 6) + 'px'; }
  const done = {};
  const act = async (k) => {
    if (done[k]) return; done[k] = true; const c = liveCtx();
    if (k === 'x') { await sweep(G, c, 'x', [track], AMB, 2000); G.shadeX(1, 9, { width: 10 }); }
    if (k === 'y') { await sweep(G, c, 'y', [track], PUR, 2000); G.shadeY(1, 6, { width: 10 }); }
    if (k === 'ext') { await G.reveal(G.point(3, 6, { color: 'purple', label: 'peak (3, 6)', pos: 'n' }), c); await G.reveal(G.point(6, 1, { color: 'purple', label: 'dip (6, 1)', pos: 's' }), c); }
  };
  document.querySelectorAll('[data-u5l5-light]').forEach((b) => b.addEventListener('click', () => act(b.dataset.u5l5Light)));
  document.querySelectorAll('[data-u5l5-wq]').forEach((b) => b.addEventListener('click', () => { const n = b.dataset.u5l5Wq; act(n === '1' ? 'x' : n === '2' ? 'y' : 'ext'); }));

  // the big one: three small graphs (A copycat, B ramp, C balloons)
  const minis = {};
  document.querySelectorAll('[data-u5l5-mini]').forEach((el) => {
    const k = el.dataset.u5l5Mini;
    const M = new Graph(el, { width: 200, height: 146, xmin: 0, xmax: 10, ymin: 0, ymax: 7, numbers: false, xtitle: '', ytitle: '', arrows: false, pad: [6, 6, 8, 8] });
    if (k === 'A') M.polyline(smooth(COPY), { color: 'teal', width: 3, ends: ['closed', 'closed'] });
    if (k === 'B') M.segment(RAMP[0], RAMP[1], { closedA: true, closedB: true, color: 'teal', width: 3 });
    if (k === 'C') BALLOONS.forEach(([x, y]) => {
      const [px, py] = M.toPx(x, y), g = svgEl('g', { class: 'u5l5-balloon' }, M.layers.top);
      svgEl('path', { d: `M${px} ${py + 9} q-3 7 1 14`, fill: 'none', stroke: '#7a7f8a', 'stroke-width': 1.3 }, g);
      svgEl('ellipse', { cx: px, cy: py, rx: 6.5, ry: 8.5, fill: '#d23c32', stroke: '#8f241e', 'stroke-width': 1.2 }, g);
    });
    minis[k] = M;
  });
  let shown = false;
  const btn = document.querySelector('[data-u5l5-shine]');
  if (btn) btn.addEventListener('click', () => {
    if (shown) return; shown = true;
    const A = minis.A, B = minis.B, C = minis.C;
    if (A) { A.shadeX(1, 9, { width: 7 }); A.shadeY(0, 6, { width: 7 }); A.label(0, 6.4, 'wall: 0 to 6 ✗', { pos: 'e', cls: 'u5l5-mlab bad', dx: 10 }); }
    if (B) { B.shadeX(1, 9, { width: 7 }); B.shadeY(1, 6, { width: 7 }); B.label(0, 6.4, 'wall: 1 to 6 ✓', { pos: 'e', cls: 'u5l5-mlab ok', dx: 10 }); }
    if (C) { BALLOONS.forEach(([x, y]) => { C.point(x, 0, { color: 'amber', r: 5 }); C.point(0, y, { color: 'purple', r: 5 }); }); C.label(5, 6.6, 'spots, not bars ✗', { pos: 'c', cls: 'u5l5-mlab bad' }); }
  });
}

/* ======================= Section 3: the Shadow Maker (tap to plot) ======================= */
function mountMaker() {
  const host = document.getElementById('u5l5-maker'); if (!host) return;
  const out = document.getElementById('u5l5-mkout');
  let joined = false, over = [];
  const G = new Graph(host, { width: 440, height: 440, xmin: -6, xmax: 6, ymin: -6, ymax: 6, interactive: { snap: 1, max: 10, coords: true, color: 'teal', onChange: () => render() } });
  const start = [[-4, -2], [-1, 3], [2, -1], [4, 2]];
  const preset = (pts) => { G.userPts.forEach((p) => G.remove(p)); G.userPts = pts.map(([x, y]) => G.point(x, y, { color: 'teal', coords: true, r: 8, cls: 'bk-upt' })); render(); };
  function render() {
    G.remove(...over); over = [];
    const pts = G.points().slice().sort((p, q) => p[0] - q[0] || p[1] - q[1]), xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
    document.querySelectorAll('[data-u5l5-mk]').forEach((b) => b.classList.toggle('on', b.dataset.u5l5Mk === (joined ? 'join' : 'dots')));
    if (!pts.length) { out.innerHTML = '<div class="u5l5-mkempty">Tap the grid to plot a point.</div>'; return; }
    if (joined && pts.length > 1) {
      over.push(G.polyline(pts, { color: 'teal', width: 3.5, layer: 'data' }));
      const lo = Math.min(...ys), hi = Math.max(...ys);
      over.push(G.shadeX(xs[0], xs[xs.length - 1]), G.shadeY(lo, hi));
      out.innerHTML = `<div class="u5l5-pl u5l5-type"><b>Type</b> continuous</div><div class="u5l5-pl dom u5l5-ans"><b>Domain</b> ${fromTo('x', xs[0], xs[xs.length - 1])}</div><div class="u5l5-pl ran u5l5-ans"><b>Range</b> ${fromTo('y', lo, hi)}</div>`;
    } else {
      pts.forEach(([x, y]) => over.push(G.point(x, 0, { color: 'amber', r: 6, layer: 'data' }), G.point(0, y, { color: 'purple', r: 6, layer: 'data' })));
      out.innerHTML = `<div class="u5l5-pl u5l5-type"><b>Type</b> discrete</div><div class="u5l5-pl dom u5l5-ans"><b>Domain</b> ${T(listT(uniq(xs)))}</div><div class="u5l5-pl ran u5l5-ans"><b>Range</b> ${T(listT(uniq(ys)))}</div>`;
    }
  }
  document.querySelectorAll('[data-u5l5-mk]').forEach((b) => b.addEventListener('click', () => {
    const m = b.dataset.u5l5Mk;
    if (m === 'dots') joined = false; else if (m === 'join') joined = true;
    else if (m === 'clear') { preset([]); return; } else if (m === 'reset') { preset(start); return; }
    render();
  }));
  preset(start);
}

/* ======================= static figures ======================= */
/** a small graph for a card: square cells of u px over the window */
function fig(host, win, o = {}) {
  const u = o.u || 30, W = (win[1] - win[0]) * u + 36, H = (win[3] - win[2]) * u + 36;
  return new Graph(host, Object.assign({ width: W, height: H, xmin: win[0], xmax: win[1], ymin: win[2], ymax: win[3], fontSize: 15, xlabels: 1, ylabels: 1 }, o));
}
const SH = (p) => 'u5l5-sh u5l5-sh-' + p;   // answer shadows: shown with part p's answer
function mountFigures() {
  const F = {};
  document.querySelectorAll('[data-fig]').forEach((el) => (F[el.dataset.fig] = el));
  if (F.s1) { const G = fig(F.s1, [-5, 4, -2, 5], { u: 31 }); G.segment(S1[0], S1[1], { closedA: true, closedB: true, color: 'ink', width: 3 }); G.shadeX(-4, 3); }
  if (F.s2) { const G = fig(F.s2, [-4, 4, -2, 5], { u: 31 }); G.polyline(smooth(S2K), { ends: ['closed', 'closed'], color: 'ink', width: 3 }); G.shadeY(-1, 4); }
  if (F.e1) {
    const G = fig(F.e1, [-3, 6, -5, 3], { u: 38 });
    G.segment(E1[0], E1[1], { closedA: true, closedB: true, color: 'ink', width: 3 });
    G.label(-2, -3, T('(-2,-3)'), { pos: 's', cls: 'bk-ptlab ' + SH('a') }); G.label(4, 1, T('(4,1)'), { pos: 'n', cls: 'bk-ptlab ' + SH('a') });
    G.shadeX(-2, 4, { cls: SH('a') });
    G.vline(5, { color: 'red', width: 2.5, cls: SH('b') });
  }
  if (F.e2) {
    const G = fig(F.e2, [-5, 4, -4, 6], { u: 34 });
    G.polyline(smooth(E2K), { ends: ['closed', 'closed'], color: 'ink', width: 3 });
    G.shadeY(-3, 4, { cls: SH('a') });
    G.point(0, -3, { color: 'purple', r: 5.5, cls: SH('a'), label: 'lowest', pos: 'se', labelCls: SH('a') });
    G.point(3, 4, { color: 'purple', r: 5.5, cls: SH('a'), label: 'highest', pos: 'w', labelCls: SH('a') });
    G.hline(5, { color: 'red', width: 2.5, cls: SH('b') });
  }
  if (F.e3a) {
    const G = fig(F.e3a, [-5, 4, -2, 5], { u: 30 });
    E3A.forEach((p) => G.point(p[0], p[1], { color: 'ink', r: 6 }));
    E3A.forEach((p) => { G.point(p[0], 0, { color: 'amber', r: 6, cls: SH('a') }); G.point(0, p[1], { color: 'purple', r: 6, cls: SH('a') }); });
  }
  if (F.e3b) {
    const G = fig(F.e3b, [-4, 5, -3, 4], { u: 30 });
    G.segment(E3B[0], E3B[1], { closedA: true, closedB: true, color: 'ink', width: 3 });
    G.shadeX(-3, 4, { cls: SH('b') }); G.shadeY(-2, 3, { cls: SH('b') });
  }
  if (F.e4) {
    const G = fig(F.e4, [-5, 5, -4, 3], { u: 38 });
    G.polyline(smooth(E4K), { ends: ['closed', 'closed'], color: 'ink', width: 3 });
    G.shadeX(-4, 4, { cls: SH('a') });
    G.shadeY(-3, 2, { cls: SH('b') });
    G.point(0, 2, { color: 'purple', r: 5.5, cls: SH('b'), label: 'highest', pos: 'ne', labelCls: SH('b') });
    G.point(-4, -3, { color: 'purple', r: 5.5, cls: SH('b'), label: 'lowest', pos: 'e', labelCls: SH('b') });
  }
  if (F.e5) {
    const G = new Graph(F.e5, { width: 390, height: 340, xmin: 0, xmax: 7, ymin: 0, ymax: 22, xstep: 1, ystep: 5, ylabels: 5, xtitle: 't\\text{ (s)}', ytitle: 'h\\text{ (m)}', fontSize: 15, origin: true });
    G.polyline(sample(ROCKET, 0, 6, 60), { ends: ['closed', 'closed'], color: 'ink', width: 3 });
    G.shadeX(0, 6, { cls: SH('a') }); G.shadeY(0, 20, { cls: SH('b') });
    G.point(3, 20, { color: 'purple', r: 5.5, cls: SH('b'), label: T('(3,20)'), pos: 'n', labelCls: SH('b') });
  }
}

mountFigures();
mountWarm();
mountMaker();
mountExplainers({ floor, wall, discrete, scan, rocket, which });

/* ============ Stand Up Break! — domain and range from a graph (lessons/js/standup.js) ============ */
const SU_INK = '#1c2230', SU_GRID = '#d3d8df', SU_C = '#1f4f9a';
const suF = (v) => +v.toFixed(1);
const suNum = (v) => String(v).replace('-', '−');
function suPlane(o, draw, label) { // o: { x0, x1, y0, y1, lab }; draw(X, Y, u) → SVG
  const u = o.u || Math.max(18, Math.min(30, Math.floor(330 / Math.max(o.x1 - o.x0, o.y1 - o.y0)))), p = 16, lab = o.lab || 1;
  const W = (o.x1 - o.x0) * u + 2 * p, H = (o.y1 - o.y0) * u + 2 * p;
  const X = (x) => suF(p + (x - o.x0) * u), Y = (y) => suF(p + (o.y1 - y) * u);
  const ax = Math.min(Math.max(0, o.y0), o.y1), ay = Math.min(Math.max(0, o.x0), o.x1);
  let s = `<rect x="0" y="0" width="${W}" height="${H}" rx="10" fill="#fff"/>`;
  for (let x = Math.ceil(o.x0); x <= o.x1; x++) s += `<line x1="${X(x)}" y1="${Y(o.y0)}" x2="${X(x)}" y2="${Y(o.y1)}" stroke="${SU_GRID}" stroke-width="1"/>`;
  for (let y = Math.ceil(o.y0); y <= o.y1; y++) s += `<line x1="${X(o.x0)}" y1="${Y(y)}" x2="${X(o.x1)}" y2="${Y(y)}" stroke="${SU_GRID}" stroke-width="1"/>`;
  s += `<g stroke="${SU_INK}" stroke-width="2" fill="${SU_INK}"><line x1="${X(o.x0)}" y1="${Y(ax)}" x2="${X(o.x1)}" y2="${Y(ax)}"/><line x1="${X(ay)}" y1="${Y(o.y0)}" x2="${X(ay)}" y2="${Y(o.y1)}"/>` +
    `<path d="M${X(o.x1)} ${Y(ax)}l-9 -5v10z M${X(ay)} ${Y(o.y1)}l-5 9h10z" stroke="none"/></g>`;
  const halo = 'paint-order="stroke" stroke="#fff" stroke-width="4" stroke-linejoin="round"';
  for (let x = Math.ceil(o.x0 / lab) * lab; x < o.x1; x += lab) if (x !== ay && x > o.x0) s += `<text x="${X(x)}" y="${Y(ax) + 22}" text-anchor="middle" ${halo}>${suNum(x)}</text>`;
  for (let y = Math.ceil(o.y0 / lab) * lab; y < o.y1; y += lab) if (y !== ax && y > o.y0) s += `<text x="${X(ay) - 7}" y="${Y(y) + 7}" text-anchor="end" ${halo}>${suNum(y)}</text>`;
  s += `<text x="${X(o.x1) - 4}" y="${Y(ax) - 9}" text-anchor="end" font-style="italic" font-size="22" ${halo}>x</text>` +
    `<text x="${X(ay) + 9}" y="${Y(o.y1) + 15}" font-style="italic" font-size="22" ${halo}>y</text>`;
  s += draw(X, Y, u);
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="${label || 'graph'}" font-family="KaTeX_Main, 'Times New Roman', serif" font-size="19" fill="${SU_INK}">${s}</svg>`;
}
const suDot = (X, Y, x, y, r = 5.5) => `<circle cx="${X(x)}" cy="${Y(y)}" r="${r}" fill="${SU_C}" stroke="${SU_C}" stroke-width="2.4"/>`;
const suPath = (X, Y, pts) => `<polyline points="${pts.map(([x, y]) => X(x) + ',' + Y(y)).join(' ')}" fill="none" stroke="${SU_C}" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round"/>`;
const suFT = (v, lo, hi) => `\\text{${v === 'x' ? 'Domain' : 'Range'}: }${v}\\text{ from }{${lo}}\\text{ to }{${hi}}`;
const suL = (v, vals) => `\\text{${v === 'x' ? 'Domain' : 'Range'}: }${uniq(vals).map((n) => '{' + n + '}').join(',\\ ')}`;
const SU_WIN = { x0: -6, x1: 6, y0: -6, y1: 6, u: 32 };
/** k straight pieces through integer vertices inside ±5, x increasing; opt.bend: the lowest or highest point is not an end */
function suPoly(r, k, opt = {}) {
  for (;;) {
    const xs = [r.int(-5, -2)];
    for (let i = 0; i < k; i++) xs.push(xs[i] + r.int(opt.dxMin || 1, opt.dxMax || 4));
    if (xs[k] > 5) continue;
    const ys = xs.map(() => r.int(-5, 5));
    let ok = true;
    for (let i = 0; i < k; i++) { const dy = ys[i + 1] - ys[i]; if (dy === 0 || Math.abs(dy) > 3 * (xs[i + 1] - xs[i])) ok = false; }
    for (let i = 1; i < k; i++) if ((ys[i] - ys[i - 1]) * (ys[i + 1] - ys[i]) > 0) ok = false; // every inner vertex is a turn
    if (!ok) continue;
    const mn = Math.min(...ys), mx = Math.max(...ys);
    if (opt.bend) { const inner = ys.slice(1, -1); if (!(inner.includes(mn) && !([ys[0], ys[k]].includes(mn))) && !(inner.includes(mx) && !([ys[0], ys[k]].includes(mx)))) continue; }
    if (mx - mn < 3) continue;
    return xs.map((x, i) => [x, ys[i]]);
  }
}
const suTxt = 'State the domain and range of the graph below.';
const suPt = (p) => `(${suNum(p[0])}, ${suNum(p[1])})`;
const suBEG = (r) => { // one unbroken segment, both ends solid
  const pts = suPoly(r, 1, { dxMin: 3, dxMax: 9 }), [a, b] = pts;
  return { q: '', text: `The graph is a line segment from <b>${suPt(a)}</b> to <b>${suPt(b)}</b>. ` + suTxt, fig: suPlane(SU_WIN, (X, Y) => suPath(X, Y, pts) + suDot(X, Y, a[0], a[1]) + suDot(X, Y, b[0], b[1]), 'a line segment'),
    a: ['\\text{continuous (unbroken)}', suFT('x', a[0], b[0]), suFT('y', Math.min(a[1], b[1]), Math.max(a[1], b[1]))] };
};
standup('u5l5', {
  intro: 'At your whiteboard station: is the graph discrete (dots) or continuous (unbroken)? Then state its domain and range.',
  levels: {
    BEG: suBEG,
    PRG: (r) => { // separate dots (often a repeated y-value), or a segment
      if (r.chance(0.3)) return suBEG(r);
      const xs = r.shuffle([-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5]).slice(0, r.int(4, 6)).sort((p, q) => p - q);
      const ys = xs.map(() => r.int(-5, 5)); if (r.chance(0.6)) { const i = r.int(1, xs.length - 1); ys[i] = ys[r.int(0, i - 1)]; }
      const pts = r.shuffle(xs.map((x, i) => [x, ys[i]]));
      return { q: '', text: 'Discrete or continuous? ' + suTxt, fig: suPlane(SU_WIN, (X, Y) => pts.map((p) => suDot(X, Y, p[0], p[1], 6.5)).join(''), 'separate points'),
        a: ['\\text{discrete (separate dots)}', suL('x', xs), suL('y', ys)] };
    },
    MAS: (r) => { // a graph that bends: the lowest or highest point is in the middle
      const k = r.int(2, 4), pts = suPoly(r, k, { dxMin: 1, dxMax: 4, bend: true }), ys = pts.map((p) => p[1]), a = pts[0], b = pts[k];
      return { q: '', text: suTxt + ' Scan the whole graph!', fig: suPlane(SU_WIN, (X, Y) => suPath(X, Y, pts) + suDot(X, Y, a[0], a[1]) + suDot(X, Y, b[0], b[1]), 'a graph that bends'),
        a: ['\\text{continuous (unbroken)}', suFT('x', a[0], b[0]), suFT('y', Math.min(...ys), Math.max(...ys))] };
    }
  }
});
