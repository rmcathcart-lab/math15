/* Math 15 · Unit 5 · Lesson 11 — Interpreting and Sketching Real-World Graphs:
 * static figures (Who's Who? warm-up, Jae's speed graph, Sam's four graphs, shape vocabulary, sketch axes, Mia's bath)
 * and the explainers. Every "story" explainer plays a scene (a walk to school, a bike ride, a bath, a car trip …) in
 * step with a tracer running along its graph. Colours: increasing green, decreasing red, constant slate.
 * Built from Math 10C u5l8 (bath, rate, pieces, shapes, sketch) and adapted to the Math 15 booklet. */
import { h, tex, add, box, Graph, svgEl, mountExplainers, pop, fadeIn, appear, tween, linear, stamp, stampIn, pulse, anim, COLORS } from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const lerp = (a, b, t) => a + (b - a) * t;
const INK = '#1e2d46', WATER = '#8cc3f0', TRACE = '#2f6fd0', SKETCH = '#c93a33';
const KC = { inc: COLORS.green, dec: COLORS.red, con: '#5d6574' };
const KW = { inc: 'increasing', dec: 'decreasing', con: 'constant' };
const kindOf = (a, b) => (b[1] > a[1] + 1e-9 ? 'inc' : b[1] < a[1] - 1e-9 ? 'dec' : 'con');
const segBadge = (n, cls = '') => `<span class="u5l11-seg ${cls}">${n}</span>`;

/* ---------- polyline helpers (x is always increasing: these are quantities against time) ---------- */
function yAt(pts, x) {
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i];
    if (x <= b[0] + 1e-9) return b[0] === a[0] ? b[1] : a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0]);
  }
  return pts[pts.length - 1][1];
}
function upTo(pts, x) {
  const out = [pts[0]];
  for (let i = 1; i < pts.length; i++) { if (pts[i][0] <= x + 1e-9) out.push(pts[i]); else { out.push([x, yAt(pts, x)]); break; } }
  return out;
}
const sample = (f, a, b, n = 80) => Array.from({ length: n + 1 }, (_, i) => { const x = a + (b - a) * i / n; return [x, f(x)]; });

/* ---------- a real-world graph: no auto numbers, custom tick labels and axis titles ---------- */
function storyGraph(host, o) {
  const G = new Graph(host, Object.assign({ numbers: false, xtitle: '', ytitle: '', pad: [18, 26, o.xticks ? 62 : 40, o.yticks ? 84 : 44] }, o));
  const ax = G.axesHtml, w = G.win;
  (o.xticks || []).forEach(([v, s]) => {
    const [px, py] = G.toPx(v, w.ymin); svgEl('line', { class: 'bk-tick', x1: px, x2: px, y1: py - 4, y2: py + 4 }, G.layers.axes);
    if (s) G.hlabel(px, py, s, { pos: 's', gap: 6, cls: 'u5l11-tk', parent: ax });
  });
  (o.yticks || []).forEach(([v, s]) => {
    const [px, py] = G.toPx(w.xmin, v); svgEl('line', { class: 'bk-tick', x1: px - 4, x2: px + 4, y1: py, y2: py }, G.layers.axes);
    G.hlabel(px, py, s, { pos: 'w', gap: 8, cls: 'u5l11-tk', parent: ax });
  });
  const [x0, y1] = G.toPx(w.xmin, w.ymin), [x1, y0] = G.toPx(w.xmax, w.ymax);
  if (o.xt) G.hlabel((x0 + x1) / 2, G.H - 3, o.xt, { pos: 'n', gap: 0, cls: 'u5l11-axt' + (o.small ? ' sm' : ''), parent: ax });
  if (o.yt) G.hlabel(o.ytx ?? (o.small ? 12 : 15), (y0 + y1) / 2, o.yt, { pos: 'c', cls: 'u5l11-axt u5l11-rot' + (o.small ? ' sm' : ''), parent: ax });
  return G;
}
/** a growing stroke along pts (set(x) shows the part up to time x), and a dot at its tip */
function tracer(G, pts, o = {}) {
  const st = { x: pts[0][0] };
  const el = G.curve(() => ({ subs: [upTo(pts, st.x).map((p) => G.toPx(p[0], p[1]))] }), { color: o.color || TRACE, width: o.width || 5 }, 'u5l11-trace', G.layers.data);
  const dot = o.dot === false ? null : G.point(pts[0][0], pts[0][1], { color: o.dotColor || INK, r: 7.5 });
  el.set = (x) => { st.x = x; el._bkDraw(); if (dot) G.moveTo(dot, x, yAt(pts, x)); };
  el.dot = dot; el.set(st.x);
  return el;
}
/** tween the tracer from x0 to x1, calling onFrame(x, y) */
const run = (c, tr, pts, x0, x1, ms, onFrame) => tween(c, ms, (t) => { const x = lerp(x0, x1, t); tr.set(x); if (onFrame) onFrame(x, yAt(pts, x)); }, linear);
const msFor = (dx, span, lo = 900, hi = 2200) => Math.round(lo + (hi - lo) * Math.min(1, dx / span));

/** run (amber, dashed) and rise (purple arrow) for the piece a → b, with labels; returns the elements */
async function riseRun(G, c, a, b, runTxt, riseTxt, o = {}) {
  const up = b[1] >= a[1], corner = up ? [b[0], a[1]] : [a[0], b[1]];
  const runEl = up ? G.segment(a, corner, { color: 'amber', width: 3.5, dash: true }) : G.segment(corner, b, { color: 'amber', width: 3.5, dash: true });
  const riseEl = up ? G.segment(corner, b, { color: 'purple', width: 3.5, ends: [null, 'arrow'] }) : G.segment(a, corner, { color: 'purple', width: 3.5, ends: [null, 'arrow'] });
  const rl = o.runCorner ? G.label(corner[0], corner[1], runTxt, { pos: 'nw', cls: 'u5l11-run', gap: 6 }) : G.label((a[0] + b[0]) / 2, corner[1], runTxt, { pos: 'n', cls: 'u5l11-run', gap: 6 });
  const ril = G.label(corner[0], (a[1] + b[1]) / 2, riseTxt, { pos: o.risePos || (up ? 'e' : 'w'), cls: 'u5l11-rise', gap: 8 });
  if (up) { await G.drawIn(runEl, 450, c); await fadeIn(c, rl); await G.drawIn(riseEl, 450, c); await fadeIn(c, ril); }
  else { await G.drawIn(riseEl, 450, c); await fadeIn(c, ril); await G.drawIn(runEl, 450, c); await fadeIn(c, rl); }
  return [runEl, riseEl, rl, ril];
}
const panel = (stage, title, w, hh, x, y) => add(stage, box(h('div', 'u5l11-panel', title ? `<div class="u5l11-ph">${title}</div>` : ''), w, hh), x, y);

/* =============================== scenes =============================== */
let uidN = 0;
const lab = (x, y, s) => `<text x="${x}" y="${y}" text-anchor="middle" font-size="15" font-weight="800" fill="${INK}" paint-order="stroke" stroke="#fff" stroke-width="4" stroke-linejoin="round">${s}</text>`;
const HOUSE = (fill, roof) => `<rect x="-20" y="-30" width="40" height="30" fill="${fill}" stroke="${INK}" stroke-width="2"/><polygon points="-27,-30 0,-52 27,-30" fill="${roof}" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/><rect x="-5" y="-15" width="10" height="15" fill="${INK}"/>`;
const PLACES = {
  home: (x, gy) => `<g transform="translate(${x} ${gy})">${HOUSE('#ffecb3', '#d23c32')}${lab(0, -58, 'home')}</g>`,
  friend: (x, gy) => `<g transform="translate(${x} ${gy})">${HOUSE('#d9ecff', '#1f5bd6')}${lab(0, -58, 'friend’s house')}</g>`,
  school: (x, gy) => `<g transform="translate(${x} ${gy})"><rect x="-32" y="-44" width="64" height="44" fill="#f2c27b" stroke="${INK}" stroke-width="2"/><polygon points="-38,-44 0,-60 38,-44" fill="#8a4b2a" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>
    <rect x="-7" y="-20" width="14" height="20" fill="${INK}"/><rect x="-25" y="-36" width="11" height="10" fill="#e8f0fc" stroke="${INK}"/><rect x="14" y="-36" width="11" height="10" fill="#e8f0fc" stroke="${INK}"/>
    <line x1="0" y1="-60" x2="0" y2="-76" stroke="${INK}" stroke-width="2"/><path d="M0 -76L14 -72L0 -68Z" fill="#c93a33"/>${lab(-44, -66, 'school')}</g>`,
  bus: (x, gy) => `<g transform="translate(${x} ${gy})"><line x1="0" y1="0" x2="0" y2="-50" stroke="${INK}" stroke-width="3"/><rect x="-15" y="-64" width="30" height="18" rx="3" fill="#1f5bd6" stroke="${INK}" stroke-width="1.5"/>
    <text x="0" y="-50" text-anchor="middle" font-size="12" font-weight="800" fill="#fff">BUS</text>${lab(0, -70, 'bus stop')}</g>`,
  stop: (x, gy) => `<g transform="translate(${x} ${gy})"><line x1="0" y1="0" x2="0" y2="-40" stroke="${INK}" stroke-width="3"/><polygon points="-7,-62 7,-62 17,-52 17,-38 7,-28 -7,-28 -17,-38 -17,-52" fill="#c93a33" stroke="#fff" stroke-width="2"/>
    <text x="0" y="-41" text-anchor="middle" font-size="10" font-weight="800" fill="#fff">STOP</text>${lab(0, -68, 'stop sign')}</g>`,
  library: (x, gy) => `<g transform="translate(${x} ${gy})"><rect x="-34" y="-40" width="68" height="40" fill="#e3e6ec" stroke="${INK}" stroke-width="2"/><polygon points="-40,-40 0,-56 40,-40" fill="#b9c0cc" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>
    ${[-24, -10, 4, 18].map((cx) => `<rect x="${cx}" y="-34" width="6" height="34" fill="#fff" stroke="${INK}" stroke-width="1.2"/>`).join('')}${lab(0, -62, 'library')}</g>`,
  gas: (x, gy) => `<g transform="translate(${x} ${gy})"><rect x="-14" y="-40" width="28" height="40" rx="3" fill="#c93a33" stroke="${INK}" stroke-width="2"/><rect x="-9" y="-34" width="18" height="10" fill="#fff"/>
    <path d="M14 -30Q24 -30 24 -18L24 -8" stroke="${INK}" stroke-width="2.5" fill="none"/>${lab(0, -48, 'gas station')}</g>`,
  cabin: (x, gy) => `<g transform="translate(${x} ${gy})"><rect x="-28" y="-30" width="56" height="30" fill="#a8693c" stroke="${INK}" stroke-width="2"/>
    ${[-22, -14, -6].map((yy) => `<line x1="-28" x2="28" y1="${yy}" y2="${yy}" stroke="#7a4a26" stroke-width="1.5"/>`).join('')}<polygon points="-34,-30 0,-52 34,-30" fill="#5d3a1f" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>
    <rect x="-6" y="-18" width="12" height="18" fill="${INK}"/>${lab(0, -58, 'cabin')}</g>`
};
const MOVERS = {
  walk: (cl) => `<g class="u5l11-mv" data-m="walk"><circle cx="0" cy="-39" r="8" fill="#fbe6b8" stroke="${INK}" stroke-width="2"/><rect x="-7" y="-31" width="14" height="18" rx="5" fill="${cl}" stroke="${INK}" stroke-width="2"/>
    <path d="M-3 -13L-7 0M3 -13L8 0" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/></g>`,
  run: (cl) => `<g class="u5l11-mv" data-m="run"><g transform="rotate(14)"><circle cx="0" cy="-39" r="8" fill="#fbe6b8" stroke="${INK}" stroke-width="2"/><rect x="-7" y="-31" width="14" height="18" rx="5" fill="${cl}" stroke="${INK}" stroke-width="2"/></g>
    <path d="M1 -13L-11 -2M1 -13L12 -4" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/><path d="M-26 -30H-14M-30 -22H-16M-26 -14H-14" stroke="#9aa3b2" stroke-width="2.5" stroke-linecap="round"/></g>`,
  stop: (cl) => `<g class="u5l11-mv" data-m="stop"><circle cx="0" cy="-39" r="8" fill="#fbe6b8" stroke="${INK}" stroke-width="2"/><rect x="-7" y="-31" width="14" height="18" rx="5" fill="${cl}" stroke="${INK}" stroke-width="2"/>
    <path d="M-3 -13L-3 0M3 -13L3 0" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/></g>`,
  bus: () => `<g class="u5l11-mv" data-m="bus"><rect x="-38" y="-36" width="76" height="30" rx="6" fill="#e8a01e" stroke="${INK}" stroke-width="2"/>
    ${[-31, -15, 1, 17].map((x) => `<rect x="${x}" y="-31" width="12" height="10" rx="2" fill="#e8f0fc" stroke="${INK}"/>`).join('')}<circle cx="-22" cy="-5" r="6.5" fill="${INK}"/><circle cx="22" cy="-5" r="6.5" fill="${INK}"/></g>`,
  bike: (cl) => `<g class="u5l11-mv" data-m="bike"><circle cx="-13" cy="-10" r="10" fill="none" stroke="${INK}" stroke-width="2.6"/><circle cx="13" cy="-10" r="10" fill="none" stroke="${INK}" stroke-width="2.6"/>
    <path d="M-13 -10L-2 -24L13 -10M-2 -24L-4 -34M-8 -36H2M-2 -24H10L13 -10" stroke="${INK}" stroke-width="2.5" fill="none" stroke-linejoin="round"/><circle cx="-2" cy="-50" r="7" fill="#fbe6b8" stroke="${INK}" stroke-width="2"/>
    <path d="M-4 -43L-4 -34L6 -30" stroke="${cl}" stroke-width="6" stroke-linecap="round" fill="none"/></g>`,
  car: () => `<g class="u5l11-mv" data-m="car"><rect x="-34" y="-26" width="68" height="20" rx="7" fill="#c93a33" stroke="${INK}" stroke-width="2"/>
    <path d="M-20 -26L-12 -40H12L22 -26Z" fill="#e8f0fc" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/><circle cx="-19" cy="-5" r="8" fill="${INK}"/><circle cx="19" cy="-5" r="8" fill="${INK}"/></g>`
};
/** a road from home (left) to the destination; set(d, mode, facing) moves the traveller to distance d */
function makeRoad(host, o) {
  const W = o.w, H = o.h || 140, gy = H - 34, L = 48, R = o.gauge ? 150 : 56;
  const px = (d) => L + d / o.dmax * (W - L - R);
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="#eaf3fc"/><rect y="${gy}" width="${W}" height="${H - gy}" fill="#9cc96b"/>
    <rect y="${gy + 4}" width="${W}" height="22" fill="#7d8593"/><line x1="0" x2="${W}" y1="${gy + 15}" y2="${gy + 15}" stroke="#fff" stroke-width="2.5" stroke-dasharray="14 12"/>`;
  s += PLACES.home(px(0), gy + 2);
  (o.places || []).forEach((p) => { s += PLACES[p.k](px(p.d), gy + 2); });
  if (o.gauge) s += `<g transform="translate(${W - 66} 70)"><path d="M-46 0A46 46 0 0 1 46 0" fill="#fff" stroke="${INK}" stroke-width="3"/>
    ${[0, 0.25, 0.5, 0.75, 1].map((t) => { const a = Math.PI * (1 - t); return `<line x1="${38 * Math.cos(a)}" y1="${-38 * Math.sin(a)}" x2="${46 * Math.cos(a)}" y2="${-46 * Math.sin(a)}" stroke="${INK}" stroke-width="2"/>`; }).join('')}
    <text x="0" y="-14" text-anchor="middle" font-size="14" font-weight="800" fill="${INK}">${o.gauge.label || 'speed'}</text><text class="u5l11-gv" x="0" y="22" text-anchor="middle" font-size="17" font-weight="800" fill="${COLORS.red}"></text>
    <line class="u5l11-needle" x1="0" y1="0" x2="-36" y2="0" stroke="${COLORS.red}" stroke-width="4" stroke-linecap="round"/><circle r="5" fill="${INK}"/></g>`;
  s += `<g class="u5l11-trav">${Object.keys(MOVERS).map((k) => MOVERS[k](o.color || '#2f6fd0')).join('')}</g></svg>`;
  const el = add(host, box(h('div', 'u5l11-scene'), W, H), o.x, o.y);
  el.innerHTML = s;
  const trav = el.querySelector('.u5l11-trav'), mv = [...el.querySelectorAll('.u5l11-mv')], needle = el.querySelector('.u5l11-needle'), gv = el.querySelector('.u5l11-gv');
  const api = {
    el, trav, px,
    set(d, mode = 'walk', facing = 1) {
      mv.forEach((g) => (g.style.display = g.dataset.m === mode ? '' : 'none'));
      trav.setAttribute('transform', `translate(${px(d)} ${gy + 18}) scale(${facing} 1)`);
    },
    speed(v) { // gauge needle, v from 0 to gauge.max
      if (!needle) return; const a = Math.PI * (1 - Math.max(0, Math.min(1, v / o.gauge.max)));
      needle.setAttribute('x2', 36 * Math.cos(a)); needle.setAttribute('y2', -36 * Math.sin(a));
      if (gv && o.gauge.unit) gv.textContent = `${Math.round(v)} ${o.gauge.unit}`;
    }
  };
  api.set(0, o.mode || 'walk');
  if (o.gauge) api.speed(0);
  return api;
}

/* the bathtub (Math 10C u5l8), without the bather */
const TUB = 'M24 152L376 152C376 220 348 248 296 248L104 248C52 248 24 220 24 152Z';
const lvl = (d) => 248 - d * 3.6; // depth (cm) → svg y; 26 cm is just under the rim
function makeTub(host, o = {}) {
  const id = 'u5l11tub' + (++uidN), W = o.w || 400;
  const el = h('div', 'u5l11-tub'); box(el, W, W * 0.7);
  if (o.x != null) { el.style.position = 'absolute'; el.style.left = o.x + 'px'; el.style.top = o.y + 'px'; }
  let tiles = '';
  for (let x = 40; x <= 400; x += 40) tiles += `<line x1="${x}" y1="0" x2="${x}" y2="188"/>`;
  for (const y of [28, 68, 108, 148]) tiles += `<line x1="0" y1="${y}" x2="400" y2="${y}"/>`;
  el.innerHTML = `<svg viewBox="0 0 400 280" width="100%" height="100%" aria-label="A bathtub with a tap, a rubber duck and a plug on a chain">
  <defs><clipPath id="${id}"><path d="${TUB}"/></clipPath></defs>
  <rect x="0" y="0" width="400" height="268" fill="#e8f0fc"/>
  <g stroke="#fff" stroke-width="2.5">${tiles}</g>
  <rect x="0" y="266" width="400" height="14" fill="#d5d9e2"/>
  <g fill="#aab2be" stroke="${INK}" stroke-width="2">
    <rect x="26" y="86" width="50" height="18" rx="4"/><rect x="66" y="86" width="10" height="26" rx="3"/>
    <rect x="38" y="70" width="10" height="16"/><rect x="30" y="62" width="26" height="8" rx="3"/>
    <polygon points="68,266 84,266 92,244 64,244"/><polygon points="316,266 332,266 336,244 308,244"/>
  </g>
  <path d="${TUB}" fill="#fff" stroke="${INK}" stroke-width="3.2"/>
  <g clip-path="url(#${id})">
    <rect class="u5l11-water" x="0" y="248" width="400" height="40" fill="${WATER}" fill-opacity=".8"/>
    <line class="u5l11-surf" x1="0" x2="400" y1="248" y2="248" stroke="#fff" stroke-width="2.5" stroke-opacity=".8"/>
    <g class="u5l11-swirl" style="display:none"><path d="M330 0m-14 0a14 6 0 1 0 28 0a9 4 0 1 0 -18 0a4 2 0 1 0 8 0" fill="none" stroke="#fff" stroke-width="2.4"/></g>
  </g>
  <line x1="14" y1="152" x2="386" y2="152" stroke="${INK}" stroke-width="3.4" stroke-linecap="round"/>
  <g class="u5l11-duck"><g transform="translate(186 0)">
    <path d="M-22 0C-24 -20 12 -22 18 -8C24 0 16 6 0 5Q-12 5 -22 0Z" fill="#facd28" stroke="${INK}" stroke-width="2"/>
    <circle cx="6" cy="-26" r="12" fill="#facd28" stroke="${INK}" stroke-width="2"/>
    <polygon points="17,-27 29,-24 17,-21" fill="#c88c14" stroke="${INK}" stroke-width="1.5"/>
    <circle cx="9" cy="-29" r="2" fill="${INK}"/></g></g>
  <g class="u5l11-plugin"><path d="M348 154C360 196 348 228 332 242" stroke="#7d8593" stroke-width="2.4" stroke-dasharray="4 3" fill="none"/>
    <rect x="322" y="240" width="20" height="8" rx="2" fill="#3a4254"/></g>
  <g class="u5l11-plugout" style="display:none"><path d="M348 154C362 150 372 160 376 182" stroke="#7d8593" stroke-width="2.4" stroke-dasharray="4 3" fill="none"/>
    <rect x="368" y="182" width="20" height="8" rx="2" fill="#3a4254" transform="rotate(70 378 186)"/></g>
  <line class="u5l11-stream" x1="71" y1="112" x2="71" y2="248" stroke="${WATER}" stroke-width="7" stroke-dasharray="12 6" style="display:none"/>
  <text class="u5l11-soak" x="200" y="40" text-anchor="middle" font-size="24" font-weight="800" fill="#7b4fc4" style="display:none">Mia soaks…</text>
</svg>`;
  host.appendChild(el);
  const q = (s) => el.querySelector(s);
  const water = q('.u5l11-water'), surf = q('.u5l11-surf'), duck = q('.u5l11-duck'), stream = q('.u5l11-stream'), swirl = q('.u5l11-swirl');
  const api = {
    el,
    setDepth(d) {
      const y = lvl(d); water.setAttribute('y', y); water.setAttribute('height', Math.max(0, 262 - y)); surf.setAttribute('y1', y); surf.setAttribute('y2', y);
      duck.setAttribute('transform', `translate(0 ${Math.min(y, 244) - 1})`); stream.setAttribute('y2', y);
      swirl.setAttribute('transform', `translate(0 ${y + 10})`);
      surf.style.display = d > 0.3 ? '' : 'none';
    },
    tap(on) { stream.style.display = on ? '' : 'none'; },
    drain(on) { swirl.style.display = on ? '' : 'none'; },
    soak(on) { q('.u5l11-soak').style.display = on ? '' : 'none'; },
    plug(out) { q('.u5l11-plugin').style.display = out ? 'none' : ''; q('.u5l11-plugout').style.display = out ? '' : 'none'; }
  };
  api.setDepth(o.depth || 0);
  return api;
}

/* =============================== data =============================== */
// warm-up: distance from home (grid squares) against time
const WU = { A: [[0, 0], [3, 1.5], [6, 0], [10, 5]], B: [[0, 0], [2, 1], [5, 1], [7, 5], [10, 5]], C: [[0, 0], [3, 4], [10, 4]], D: [[0, 0], [10, 5]] };
const wuAxes = (o) => Object.assign({ xmin: 0, xmax: 10.7, ymin: 0, ymax: 6.4, xstep: 1, ystep: 1, xt: 'time', yt: 'distance from home' }, o);
const CLOCK = (stage, ex) => add(stage, box(h('div', 'u5l11-clock'), 300, null), 110, 8);
const ELI = [[0, 0], [3, 200], [3, 600], [6, 800], [8, 800]];
const eliAxes = (o) => Object.assign({ xmin: 0, xmax: 8.6, ymin: 0, ymax: 880, xstep: 1, ystep: 100,
  xticks: [0, 1, 2, 3, 4, 5, 6, 7, 8].map((v) => [v, String(v)]), yticks: [200, 400, 600, 800].map((v) => [v, String(v)]), xt: 'time (minutes)', yt: 'distance (m)' }, o);
// Example 1: Jae's speed (km/h) against time (min)
const JAE = [[0, 0], [4, 24], [9, 24], [11, 0], [12, 0], [18, 20]];
const JN = ['A', 'B', 'C', 'D', 'E', 'F'], JPOS = ['nw', 'n', 'n', 'nw', 'n', 'ne'];
const jaeAxes = (o) => Object.assign({ xmin: 0, xmax: 19.4, ymin: 0, ymax: 27.6, xstep: 1, ystep: 3,
  xticks: [0, 4, 9, 11, 12, 18].map((v) => [v, String(v)]), yticks: [6, 12, 18, 24].map((v) => [v, String(v)]), xt: 'time (minutes)', yt: 'speed (km/h)' }, o);
/** Jae's distance from home (km) at time t (min): the area under her speed graph */
function jaeDist(t) {
  if (t <= 4) return t * t / 20;
  if (t <= 9) return 0.8 + 0.4 * (t - 4);
  if (t <= 11) { const u = t - 9; return 2.8 + (24 * u - 6 * u * u) / 60; }
  if (t <= 12) return 3.2;
  const u = t - 12; return 3.2 + u * u / 36;
}
// Example 2: Sam's four graphs (as in the booklet)
const SAM = { A: [[0.2, 0], [1.1, 1.1], [1.7, 1.1], [2.3, 2.6]], B: [[0.2, 0], [0.9, 2.2], [1.5, 2.2], [2.3, 2.6]], C: [[0.2, 0], [1, 1.5], [1.6, 0], [2.3, 2]], D: [[0.2, 0], [0.9, 0], [1.6, 1.7], [2.3, 1.7]] }; // each starts on the time axis (distance 0 at home)
// Example 4: Mia's bath
const MIA = [[0, 0], [6, 24], [16, 24], [24, 0]];
const miaAxes = (o) => Object.assign({ xmin: 0, xmax: 25.6, ymin: 0, ymax: 27.6, xstep: 6, ystep: 6,
  xticks: [0, 6, 12, 18, 24].map((v) => [v, String(v)]), yticks: [6, 12, 18, 24].map((v) => [v, String(v)]), xt: 'time (minutes)', yt: 'water depth (cm)' }, o);
// Example 3 / 5 sketch grids (no scale, like the booklet)
const blankAxes = (o) => Object.assign({ xmin: 0, xmax: 7.3, ymin: 0, ymax: 5.8, xstep: 0.5, ystep: 0.5 }, o);
const COCOA = (x) => 1.2 + 3.8 * Math.exp(-0.85 * (x - 0.2));
const DRIVE5 = [[0, 0], [0.9, 4.5], [3, 4.5], [3.7, 0], [4.5, 0], [5.2, 3.4], [6.1, 3.4], [6.8, 0]];

/* =============================== static figures =============================== */
function letterTag(G, L, cls = '') { const t = h('div', 'u5l11-gl ' + cls, L); G.el.appendChild(t); return t; }
function houseTag(G) { const [px, py] = G.toPx(0, 0); const t = add(G.el, h('div', 'u5l11-house', '<svg viewBox="-28 -54 56 56" width="30" height="30"><rect x="-20" y="-30" width="40" height="30" fill="#ffecb3" stroke="#1e2d46" stroke-width="3"/><polygon points="-27,-30 0,-52 27,-30" fill="#d23c32" stroke="#1e2d46" stroke-width="3"/></svg>'), px - 34, py + 2); return t; }
function mountStatic() {
  const wg = document.getElementById('wu-graphs');
  if (wg) {
    const W = Math.floor(((wg.clientWidth || 560) - 14) / 2);
    ['A', 'B', 'C', 'D'].forEach((L) => {
      const cell = h('div', 'u5l11-wg'); wg.appendChild(cell);
      const G = storyGraph(cell, wuAxes({ width: W, height: 142, pad: [10, 14, 30, 40], small: true, yt: 'distance' }));
      G.polyline(WU[L], { color: SKETCH, width: 4.5 });
      letterTag(G, L); houseTag(G);
    });
  }
  const we = document.getElementById('wu-eli');
  if (we) {
    const W = Math.min(380, we.clientWidth || 380);
    const G = storyGraph(we, eliAxes({ width: W, height: 220, pad: [10, 16, 52, 66], small: true }));
    G.polyline(ELI.slice(0, 2), { color: INK, width: 4.5 }); G.polyline(ELI.slice(2), { color: INK, width: 4.5 });
    G.segment(ELI[1], ELI[2], { color: 'red', width: 6 });
  }
  const e1 = document.getElementById('ex1-graph');
  if (e1) {
    const G = storyGraph(e1, jaeAxes({ width: 760, height: 360 }));
    G.polyline(JAE, { color: INK, width: 4 });
    JAE.forEach((p, i) => G.point(p[0], p[1], { color: INK, r: 5, label: T(JN[i]), pos: JPOS[i] }));
  }
  const e2 = document.getElementById('ex2-graphs');
  if (e2) ['A', 'B', 'C', 'D'].forEach((L) => {
    const cell = h('div', 'u5l11-mini'); e2.appendChild(cell);
    const G = storyGraph(cell, { width: 230, height: 180, xmin: 0, xmax: 2.6, ymin: 0, ymax: 2.9, grid: false, xt: 'time', yt: 'distance', pad: [10, 12, 32, 40], small: true });
    G.polyline(SAM[L], { color: INK, width: 4 }); letterTag(G, L);
  });
  const ax = (id, yt, w = 440, hh = 290) => { const el = document.getElementById(id); return el ? storyGraph(el, blankAxes({ width: w, height: hh, xt: 'time', yt, pad: [12, 20, 34, 44] })) : null; };
  ax('ex3a-ax', 'water height'); ax('ex3b-ax', 'temperature'); ax('ex5-ax', 'speed');
  const a3 = ax('ex3a-ans', 'water height', 330, 220);
  if (a3) { a3.polyline([[0, 0], [3.5, 4.5], [6.8, 4.5]], { color: SKETCH, width: 4 }); a3.label(2.3, 2.4, 'filling steadily', { pos: 'se', cls: 'u5l11-note' }); a3.label(5.2, 4.5, 'tap off: constant', { pos: 'n', cls: 'u5l11-note' }); }
  const b3 = ax('ex3b-ans', 'temperature', 330, 220);
  if (b3) { b3.fn(COCOA, { from: 0.2, to: 6.8, color: SKETCH, width: 4, arrows: false }); b3.hline(1.2, { color: SKETCH, width: 2 }); b3.label(4.6, 1.2, 'room temperature', { pos: 's', cls: 'u5l11-note' }); b3.label(1.1, 3.9, 'cools fast at first', { pos: 'e', cls: 'u5l11-note' }); }
  const a5 = ax('ex5-ans', 'speed', 330, 220);
  if (a5) { a5.polyline(DRIVE5, { color: SKETCH, width: 4 }); a5.label(2, 4.5, 'highway', { pos: 'n', cls: 'u5l11-note' }); a5.label(4.1, 0, 'refuel', { pos: 'n', cls: 'u5l11-note' }); a5.label(5.65, 3.4, 'slower', { pos: 'n', cls: 'u5l11-note' }); }
  const g4 = document.getElementById('ex4-graph');
  if (g4) { const G = storyGraph(g4, miaAxes({ width: 470, height: 360 })); G.polyline(MIA.slice(0, 2), { color: INK, width: 4.5 }); }
  const a4 = document.getElementById('ex4-ans');
  if (a4) {
    const G = storyGraph(a4, miaAxes({ width: 380, height: 270 })); G.polyline(MIA.slice(0, 2), { color: INK, width: 4 }); G.polyline(MIA.slice(1), { color: SKETCH, width: 4 });
    G.label(11, 24, 'soaking (constant)', { pos: 'n', cls: 'u5l11-note' }); G.label(20.6, 11, 'draining', { pos: 'e', cls: 'u5l11-note', gap: 10 });
  }
  const row = document.getElementById('shape-row');
  if (row) Object.keys(SH).forEach((k) => {
    const d = SH[k], cell = h('div', 'u5l11-shape'); row.appendChild(cell);
    const G = new Graph(cell, { width: 172, height: 140, xmin: 0, xmax: 4.4, ymin: 0, ymax: 4.4, grid: false, numbers: false, xtitle: '', ytitle: '', pad: [10, 12, 10, 12] });
    G.fn(d.f, { from: 0.2, to: 4.1, color: INK, width: 4, arrows: false, samples: 120 });
    cell.appendChild(h('div', 'u5l11-shname', `<span data-reveal>${d.short}</span>`));
  });
}

/* =============================== explainer: who's who (the warm-up trips) =============================== */
const ST = {
  ava: { name: 'Ava', g: 'D', pts: WU.D, places: [{ d: 5, k: 'school' }], modes: ['walk'],
    caps: ['<b>Ava</b> walks to school at a steady pace: one straight piece that keeps <b>rising</b>. She moves away from home the whole time.'],
    end: 'One straight line = a <b>steady pace</b>. Ava never stops and never turns back. That’s graph <b>D</b>.' },
  ben: { name: 'Ben', g: 'C', pts: WU.C, places: [{ d: 4, k: 'friend' }], modes: ['run', 'stop'],
    caps: ['<b>Ben runs</b>: a <b>steep</b> rise. He gets far from home fast.', 'Then the graph is <b>flat</b> (constant): Ben is at his friend’s house, not moving.'],
    end: 'A steep rise, then flat. That’s graph <b>C</b>.' },
  cam: { name: 'Cam', g: 'A', pts: WU.A, places: [{ d: 5, k: 'school' }], modes: ['walk', 'walk', 'run'],
    caps: ['Cam walks toward school: a gentle <b>rise</b>.', 'He turns back for his lunch: the graph <b>falls</b> all the way to 0. He is home again.', 'He <b>runs</b> all the way to school: a <b>steeper</b> rise than his walk.'],
    end: 'Up, down to 0, then a steeper climb. That’s graph <b>A</b>, the only one that goes down.' },
  dee: { name: 'Dee', g: 'B', pts: WU.B, places: [{ d: 1, k: 'bus' }, { d: 5, k: 'school' }], modes: ['walk', 'stop', 'bus', 'stop'],
    caps: ['Dee walks to the bus stop: a gentle <b>rise</b>.', 'The graph is <b>flat</b>: she <b>waits</b> at the bus stop.', 'The bus is fast: a <b>very steep</b> rise.', '<b>Flat</b> again: she is at school.'],
    end: 'Gentle rise, flat, very steep rise, flat. That’s graph <b>B</b>.' },
  eli: { name: 'Eli' }
};
const story = {
  title: 'Who’s who? Watch each trip',
  height: 486,
  minW: 900,
  choices: [{ v: 'ava', label: 'Warm-up 1: Ava' }, { v: 'ben', label: 'Warm-up 2: Ben' }, { v: 'cam', label: 'Warm-up 3: Cam' }, { v: 'dee', label: 'Warm-up 4: Dee' }, { v: 'eli', label: 'The big one: Eli' }],
  intro: (k) => (k === 'eli' ? 'Eli’s trip from the big one. Could it really happen? Press <b>Next</b>.' : `${ST[k].name}’s trip: watch the walker and the graph together. Press <b>Next</b>.`),
  make(stage, k, ex) {
    const S = ST[k], PW = 286, SH = 150, GY = SH + 8, GH = 486 - GY - 2, eli = k === 'eli';
    const scene = makeRoad(stage, { x: 4, y: 4, w: ex.W - 8, h: SH, dmax: eli ? 800 : 5.4, places: eli ? [{ d: 800, k: 'school' }] : S.places });
    const clock = CLOCK(stage, ex); clock.innerHTML = `<b>${S.name}</b>’s trip`;
    const G = storyGraph(stage, (eli ? eliAxes : wuAxes)({ x: 4, y: GY, width: ex.W - PW - 18, height: GH, pad: eli ? [12, 22, 58, 74] : [12, 22, 40, 44] }));
    const P = panel(stage, 'what the pieces mean', PW, GH, ex.W - PW - 6, GY);
    const rows = {};
    [['inc', 'rising: moving <b>away</b>'], ['con', 'flat: <b>stopped</b>'], ['dec', 'falling: coming <b>back</b>']].concat(eli ? [['bad', 'vertical: <b>impossible!</b>']] : []).forEach(([kk, txt]) => {
      const r = h('div', 'u5l11-trow ' + kk, `<span class="u5l11-tk-k">${txt}</span><span class="u5l11-tk-b"></span>`); P.appendChild(r); rows[kk] = r.lastChild;
    });
    const tag = (kk, n) => { const t = h('span', '', segBadge(n, kk)); rows[kk].appendChild(t); return t; };
    const badge = (a, b, kk, n) => G.label((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, segBadge(n, kk), { pos: kk === 'con' ? 'n' : kk === 'inc' ? 'nw' : 'ne', gap: kk === 'con' ? 8 : 4 });
    if (!eli) {
      const pts = S.pts, tr = tracer(G, pts);
      const steps = S.caps.map((cap, i) => ({
        cap,
        run: async (c) => {
          const a = pts[i], b = pts[i + 1], kk = kindOf(a, b);
          await run(c, tr, pts, a[0], b[0], msFor(b[0] - a[0], 10, 1100, 2400), (x, y) => scene.set(y, S.modes[i], kk === 'dec' ? -1 : 1));
          const seg = G.segment(a, b, { color: KC[kk], width: 6 });
          await Promise.all([appear(c, seg, 300), pop(c, badge(a, b, kk, i + 1)), pop(c, tag(kk, i + 1))]);
        }
      }));
      steps.push({ cap: S.end, run: async (c) => { tr.dot && (tr.dot.style.opacity = 0); const s = stamp(stage, 'graph ' + S.g, { ok: true, x: ex.W - PW - 200, y: GY + 14 }); await stampIn(c, s); } });
      return steps;
    }
    // Eli: walk, the impossible jump, walk on; then the fix
    const P1 = ELI.slice(0, 2), P2 = ELI.slice(2);
    const t1 = tracer(G, P1), show = (x, d) => { clock.innerHTML = `time <b>${x.toFixed(1)}</b> min &nbsp;·&nbsp; <b>${Math.round(d)}</b> m`; };
    let t2;
    show(0, 0);
    return [
      { cap: 'Eli walks 200 m in 3 minutes: a <b>rising</b> piece. That’s about 67 m per minute, a normal walk.',
        run: async (c) => {
          await run(c, t1, P1, 0, 3, 1800, (x, y) => { scene.set(y, 'walk'); show(x, y); });
          const seg = G.segment(P1[0], P1[1], { color: KC.inc, width: 6 });
          await Promise.all([appear(c, seg, 300), pop(c, badge(P1[0], P1[1], 'inc', 1)), pop(c, tag('inc', 1))]);
        } },
      { cap: 'The red part is <b>vertical</b>. At 3 min the graph says Eli is at 200 m <b>and</b> at 600 m: he jumps 400 m in <b>0 seconds</b>!',
        run: async (c) => {
          t1.dot.style.opacity = 0;
          const v = G.segment(ELI[1], ELI[2], { color: 'red', width: 7 });
          const zap = add(scene.el, h('div', 'u5l11-zap', 'teleport?!'), scene.px(400) - 50, 6); zap.style.opacity = 0;
          await anim(c, scene.trav, [{ opacity: 1 }, { opacity: 0 }], 300);
          await G.drawIn(v, 700, c);
          scene.set(600, 'walk'); show(3, 600);
          await Promise.all([anim(c, scene.trav, [{ opacity: 0 }, { opacity: 1 }], 300), appear(c, zap, 300), pop(c, tag('bad', 2))]);
        } },
      { cap: 'Then he walks on to school (800 m) and stays there: rising, then <b>flat</b>.',
        run: async (c) => {
          t2 = tracer(G, P2);
          await run(c, t2, P2, 3, 8, 2200, (x, y) => { scene.set(y, x > 6 ? 'stop' : 'walk'); show(x, y); });
          const s1 = G.segment(P2[0], P2[1], { color: KC.inc, width: 6 }), s2 = G.segment(P2[1], P2[2], { color: KC.con, width: 6 });
          await Promise.all([appear(c, s1, 300), appear(c, s2, 300), pop(c, tag('inc', 3)), pop(c, tag('con', 4))]);
        } },
      { cap: 'Nobody can be in two places at once: the graph is <b>impossible</b>. A real trip takes time, so the piece must <b>lean right</b>, like (3, 200) to (4, 600): a 1-minute bus ride.',
        run: async (c) => {
          const fix = G.polyline([[3, 200], [4, 600], [7, 800], [8.4, 800]], { color: 'green', width: 4, dash: true });
          const fl = G.label(4, 600, 'takes 1 min', { pos: 'e', cls: 'u5l11-fix', gap: 10 });
          await G.drawIn(fix, 1200, c); await fadeIn(c, fl);
          const s = stamp(stage, 'impossible', { ok: false, x: ex.W - PW - 250, y: GY + GH - 150 }); await stampIn(c, s);
        } }
    ];
  }
};

/* =============================== explainer: steeper means faster =============================== */
const rate = {
  title: 'Steeper means faster',
  height: 470,
  minW: 900,
  choices: [{ v: 'race', label: 'Warm-up 5: Ava or Ben?' }, { v: 'cd', label: 'Example 1(b) check' }, { v: 'all', label: 'Example 1(c) check' }],
  intro: (k) => (k === 'race' ? 'Ava and Ben leave home at the same moment. Who is faster, and how can you <b>see</b> it? Press <b>Next</b>.' : k === 'cd' ? 'The rate of change of Jae’s speed from C to D. Press <b>Next</b>.' : 'Which piece of Jae’s graph is the steepest? Press <b>Next</b>.'),
  make(stage, k, ex) {
    const PW = 320, GW = ex.W - PW - 16;
    if (k === 'race') {
      const G = storyGraph(stage, wuAxes({ x: 4, y: 4, width: GW, height: 460, pad: [14, 22, 40, 46] }));
      const P = panel(stage, 'rate of change', PW, 458, ex.W - PW - 6, 6);
      const A = WU.D, B = WU.C;
      G.polyline(A, { color: '#b9c0cc', width: 3 }); G.polyline(B, { color: '#b9c0cc', width: 3 });
      const la = G.label(10, 5, 'Ava', { pos: 'n', cls: 'u5l11-who a' }), lb = G.label(10, 4, 'Ben', { pos: 'n', cls: 'u5l11-who b' });
      const ta = tracer(G, A, { color: '#1f5bd6', dotColor: '#1f5bd6' }), tb = tracer(G, B, { color: '#c27a0e', dotColor: '#c27a0e' });
      let vl;
      return [
        { cap: 'Both leave home at the same moment. Watch them for <b>3 squares</b> of time.',
          run: (c) => tween(c, 2200, (t) => { ta.set(3 * t); tb.set(3 * t); }, linear) },
        { cap: 'After 3 squares of time, Ben is <b>4</b> squares from home and Ava only <b>1.5</b>. Ben’s piece is <b>steeper</b>.',
          run: async (c) => { vl = G.segment([3, 0], [3, 4], { color: 'gray', width: 2.5, dash: true }); await G.drawIn(vl, 500, c);
            await Promise.all([fadeIn(c, G.label(3, 4, '4', { pos: 'e', cls: 'u5l11-dur' })), fadeIn(c, G.label(3, 1.5, '1.5', { pos: 'se', cls: 'u5l11-dur' }))]); } },
        { cap: `Ben: <b>4 up</b> for <b>3 across</b>. Rate ${T('=\\tfrac{4}{3}\\approx1.3')} squares up per square across.`,
          run: async (c) => { await riseRun(G, c, [0, 0], [3, 4], 'run 3', 'rise 4', { risePos: 'w' }); const l = h('div', 'u5l11-rl', `<div class="u5l11-rh" style="color:#c27a0e">Ben</div>${T('\\dfrac{4}{3}\\approx1.3')}`); P.appendChild(l); await fadeIn(c, l); } },
        { cap: `Ava: <b>1 up</b> for every <b>2 across</b>. Rate ${T('=\\tfrac{1}{2}=0.5')}.`,
          run: async (c) => { await riseRun(G, c, [6, 3], [8, 4], 'run 2', 'rise 1'); const l = h('div', 'u5l11-rl', `<div class="u5l11-rh" style="color:#1f5bd6">Ava</div>${T('\\dfrac{1}{2}=0.5')}`); P.appendChild(l); await fadeIn(c, l); } },
        { cap: 'Steeper = more distance in the same time = <b>faster</b>. Ben is faster.',
          run: async (c) => {
            ta.set(10); tb.set(10);
            const bars = h('div', 'u5l11-bars', '<div class="u5l11-bh">how fast?</div>'); P.appendChild(bars);
            for (const [n, v, top] of [['Ben', 4 / 3, true], ['Ava', 0.5, false]]) { const r = h('div', 'u5l11-bar' + (top ? ' top' : ''), `<span class="u5l11-bn">${n}</span><i style="width:${Math.round(150 * v / (4 / 3))}px"></i><span>${top ? '1.3' : '0.5'}</span>`); bars.appendChild(r); await fadeIn(c, r, 300); }
            await Promise.all([pulse(c, lb), pulse(c, la)]);
          } }
      ];
    }
    const G = storyGraph(stage, jaeAxes({ x: 4, y: 4, width: GW, height: 460 }));
    G.polyline(JAE, { color: '#9aa3b2', width: 3.5 });
    JAE.forEach((p, i) => G.point(p[0], p[1], { color: INK, r: 5, label: T(JN[i]), pos: JPOS[i] }));
    const P = panel(stage, 'rate (km/h per min)', PW, 458, ex.W - PW - 6, 6);
    const segs = k === 'cd' ? [[2, 3]] : [[0, 1], [2, 3], [4, 5]];
    const R = segs.map(([i, j]) => { const a = JAE[i], b = JAE[j]; return { i, j, a, b, r: (b[1] - a[1]) / (b[0] - a[0]) }; });
    const fr = (s) => { const dy = s.b[1] - s.a[1], dx = s.b[0] - s.a[0], whole = Math.abs(s.r - Math.round(s.r)) < 1e-9;
      return `\\dfrac{${s.b[1]}-${s.a[1]}}{${s.b[0]}-${s.a[0]}}=\\dfrac{${dy}}{${dx}}` + (whole ? `=${Math.round(s.r)}` : `\\approx${Math.round(s.r * 10) / 10}`); };
    let prev = null;
    const piece = (s, cap) => ({
      cap,
      run: async (c) => {
        if (prev) { G.remove(prev); prev = null; }
        const kk = kindOf(s.a, s.b), hi = G.segment(s.a, s.b, { color: KC[kk], width: 7 });
        await G.drawIn(hi, 500, c);
        prev = await riseRun(G, c, s.a, s.b, `run ${s.b[0] - s.a[0]} min`, `${s.b[1] > s.a[1] ? 'up' : 'down'} ${Math.abs(s.b[1] - s.a[1])}`, { runCorner: s.b[1] < s.a[1] });
        const l = h('div', 'u5l11-rl', `<div class="u5l11-rh" style="color:${KC[kk]}">${T(JN[s.i] + '\\to ' + JN[s.j])}</div>${T(fr(s))}`); P.appendChild(l); await fadeIn(c, l);
      }
    });
    if (k === 'cd') {
      return [
        piece(R[0], `<b>C</b> is ${T('(9,\\ 24)')} and <b>D</b> is ${T('(11,\\ 0)')}. The speed goes <b>down 24</b> km/h while the time goes <b>across 2</b> min.`),
        { cap: `Rate ${T('=\\dfrac{0-24}{11-9}=\\dfrac{-24}{2}=-12')} km/h per minute. The negative sign means her speed is <b>dropping</b>, 12 km/h every minute.`,
          run: async (c) => { const s = stamp(P, 'decreasing', { ok: false }); s.style.alignSelf = 'center'; s.style.marginTop = '24px'; await stampIn(c, s); } }
      ];
    }
    const steps = [
      piece(R[0], `<b>A to B:</b> up 24 km/h in 4 min. Rate ${T('=\\tfrac{24}{4}=6')} km/h per minute.`),
      piece(R[1], `<b>C to D:</b> down 24 km/h in only 2 min. Rate ${T('=\\tfrac{-24}{2}=-12')}.`),
      piece(R[2], `<b>E to F:</b> up 20 km/h in 6 min. Rate ${T('=\\tfrac{20}{6}\\approx3.3')}. Gentle.`)
    ];
    steps.push({
      cap: 'Compare the <b>sizes</b>: 6, 12 and 3.3. <b>C to D</b> is the steepest: Jae is braking hard, so her speed changes fastest.',
      run: async (c) => {
        if (prev) { G.remove(prev); prev = null; }
        await G.drawIn(G.segment(JAE[2], JAE[3], { color: KC.dec, width: 8 }), 400, c);
        const max = 12, bars = h('div', 'u5l11-bars', '<div class="u5l11-bh">how fast? (size of the rate)</div>'); P.appendChild(bars);
        for (const s of R) {
          const v = Math.round(Math.abs(s.r) * 10) / 10, top = Math.abs(s.r) === max;
          const r = h('div', 'u5l11-bar' + (top ? ' top' : ''), `<span class="u5l11-bn">${T(JN[s.i] + '\\to ' + JN[s.j])}</span><i style="width:${Math.round(150 * Math.abs(s.r) / max)}px"></i><span>${v}</span>`);
          bars.appendChild(r); await fadeIn(c, r, 300);
        }
      }
    });
    return steps;
  }
};

/* =============================== explainer: Jae's ride =============================== */
const JCAPS = [
  '<b>A to B:</b> the speed rises from 0 to 24 km/h in 4 min. Jae <b>starts from rest and speeds up</b>.',
  '<b>B to C:</b> flat at 24 km/h for 5 min. Jae <b>cruises</b> at a steady speed. Flat, but she is still moving!',
  '<b>C to D:</b> the speed falls from 24 km/h to 0 in 2 min. Jae <b>brakes</b> and stops at the stop sign.',
  '<b>D to E:</b> flat <b>at 0</b> for 1 min. Now Jae really is <b>stopped</b>, at the stop sign.',
  '<b>E to F:</b> she speeds up again, from 0 to 20 km/h in 6 min: a bit slower than before.'
];
const BCAPS = [
  '<b>Speeding up:</b> the speed graph rises. The distance graph rises too, and gets steeper as she goes faster.',
  '<b>Cruising:</b> the speed graph is <b>flat</b>, but the distance graph keeps <b>rising</b>. She is still moving!',
  '<b>Braking:</b> the speed falls to 0. The distance graph still rises, but levels off.',
  '<b>Stopped:</b> speed flat <b>at 0</b>, and now the distance graph is <b>flat</b> too.',
  '<b>Speeding up again:</b> both graphs rise again, all the way to the library.'
];
const jae = {
  title: 'Jae’s ride: reading a speed graph',
  height: 486,
  minW: 900,
  choices: [{ v: 'ride', label: 'Example 1(a) check' }, { v: 'both', label: 'Speed or distance?' }],
  intro: (k) => (k === 'ride' ? 'Ride along with Jae. The graph shows her <b>speed</b>. Press <b>Next</b>.' : 'The same ride drawn two ways: <b>speed</b> and <b>distance from home</b>. Press <b>Next</b>.'),
  make(stage, k, ex) {
    const SH = 150, GY = SH + 8, GH = 486 - GY - 2;
    const scene = makeRoad(stage, { x: 4, y: 4, w: ex.W - 8, h: SH, dmax: 4.2, places: [{ d: 3.2, k: 'stop' }, { d: 4.2, k: 'library' }], mode: 'bike', color: '#7b4fc4', gauge: { max: 30, unit: 'km/h' } });
    const clock = CLOCK(stage, ex);
    const show = (t, v) => { clock.innerHTML = `time <b>${t.toFixed(1)}</b> min`; scene.set(jaeDist(t), 'bike'); scene.speed(v); };
    const both = k === 'both', GW = both ? Math.floor((ex.W - 20) / 2) : ex.W - 8;
    const G = storyGraph(stage, jaeAxes({ x: 4, y: GY, width: GW, height: GH, pad: [12, 22, 56, both ? 70 : 78] }));
    JAE.forEach((p, i) => G.point(p[0], p[1], { color: '#9aa3b2', r: 4, label: T(JN[i]), pos: JPOS[i] }));
    const tr = tracer(G, JAE);
    let D = null, dtr = null;
    const DP = sample(jaeDist, 0, 18, 180);
    if (both) {
      D = storyGraph(stage, { x: GW + 14, y: GY, width: GW, height: GH, xmin: 0, xmax: 19.4, ymin: 0, ymax: 4.7, xstep: 1, ystep: 0.5, pad: [12, 22, 56, 70],
        xticks: [0, 4, 9, 11, 12, 18].map((v) => [v, String(v)]), yticks: [1, 2, 3, 4].map((v) => [v, String(v)]), xt: 'time (minutes)', yt: 'distance (km)' });
      dtr = tracer(D, DP, { color: '#7b4fc4' });
    }
    show(0, 0);
    const steps = (both ? BCAPS : JCAPS).map((cap, i) => ({
      cap,
      run: async (c) => {
        const a = JAE[i], b = JAE[i + 1], kk = kindOf(a, b);
        await run(c, tr, JAE, a[0], b[0], msFor(b[0] - a[0], 6, 1100, 2200), (x, y) => { show(x, y); if (dtr) dtr.set(x); });
        const seg = G.segment(a, b, { color: KC[kk], width: 6 });
        const jobs = [appear(c, seg, 300)];
        if (!both || kk === 'con') jobs.push(fadeIn(c, G.label((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, KW[kk], { pos: kk === 'con' ? (a[1] ? 's' : 'n') : kk === 'inc' ? 'se' : 'ne', cls: 'u5l11-ktag ' + kk, gap: 10 })));
        if (D && kk === 'con') {
          const flat = Math.abs(jaeDist(b[0]) - jaeDist(a[0])) < 1e-9, dk = flat ? 'con' : 'inc';
          const ds = D.polyline(DP.filter((p) => p[0] >= a[0] - 1e-9 && p[0] <= b[0] + 1e-9), { color: KC[dk], width: 6 });
          const dt = D.label((a[0] + b[0]) / 2, jaeDist((a[0] + b[0]) / 2), KW[dk], { pos: flat ? 'n' : 'nw', cls: 'u5l11-ktag ' + dk, gap: 10 });
          jobs.push(appear(c, ds, 300), fadeIn(c, dt));
        } else if (D) jobs.push(appear(c, D.polyline(DP.filter((p) => p[0] >= a[0] - 1e-9 && p[0] <= b[0] + 1e-9), { color: KC.inc, width: 6 }), 300));
        await Promise.all(jobs);
      }
    }));
    if (both) steps.push({ cap: 'Same ride, two graphs. Flat on a <b>speed</b> graph = a steady speed. Flat on a <b>distance</b> graph = stopped. Read the axis label first!',
      run: async (c) => { const s = stamp(stage, 'read the axis label!', { ok: null, x: ex.W / 2 - 40, y: 52, size: 'sm' }); await stampIn(c, s); } });
    else steps.push({ cap: 'Example 1(a): (i) A to B, <b>speeding up</b> from rest; (ii) C to D, <b>braking</b> to a stop; (iii) E to F, <b>speeding up again</b> to 20 km/h.',
      run: async (c) => { tr.dot && (tr.dot.style.opacity = 0); await pulse(c, scene.el, 1.02); } });
    return steps;
  }
};

/* =============================== explainer: sorting the pieces =============================== */
const OVEN = [[0, 20], [10, 220], [25, 220], [27, 180], [31, 220], [45, 220], [60, 100]];
const PC = {
  jae: { pts: JAE, axes: jaeAxes, names: JN, pos: JPOS, want: 'con', span: (a, b) => `${a} to ${b} min`,
    total: (sum, parts) => `Constant for ${parts.join(' + ')} = <b>${sum} minutes</b> in total. That’s Example 1(d). (Flat at 0 counts too!)` },
  oven: { pts: OVEN, want: 'con', span: (a, b) => `${a} to ${b} min`,
    axes: (o) => Object.assign({ xmin: 0, xmax: 64, ymin: 0, ymax: 260, xstep: 5, ystep: 20, xticks: [0, 10, 20, 30, 40, 50, 60].map((v) => [v, String(v)]),
      yticks: [50, 100, 150, 200, 250].map((v) => [v, String(v)]), xt: 'time (minutes)', yt: 'oven temp. (°C)' }, o),
    total: (sum, parts) => `Constant for ${parts.join(' + ')} = <b>${sum} minutes</b>: the oven held its temperature. The short drop is the door being opened.` }
};
const pieces = {
  title: 'Rising, falling or flat?',
  height: 470,
  minW: 900,
  choices: [{ v: 'jae', label: 'Example 1(d) check' }, { v: 'oven', label: 'A pizza oven' }],
  intro: (k) => (k === 'jae' ? 'Sort the five pieces of Jae’s speed graph. Press <b>Next</b>.' : 'A pizza oven’s temperature: it heats up, the door is opened once, then it is turned off. Sort the pieces. Press <b>Next</b>.'),
  make(stage, k, ex) {
    const d = PC[k], pts = d.pts, PW = 300;
    const G = storyGraph(stage, d.axes({ x: 4, y: 4, width: ex.W - PW - 16, height: 460 }));
    const P = panel(stage, 'the pieces', PW, 458, ex.W - PW - 6, 6);
    const rows = {};
    ['inc', 'dec', 'con'].forEach((kk) => { const r = h('div', 'u5l11-prow ' + kk, `<b>${KW[kk]}</b><div class="u5l11-pl"></div>`); r.style.opacity = 0; P.appendChild(r); rows[kk] = r; });
    const segs = pts.slice(1).map((b, i) => ({ a: pts[i], b, i, k: kindOf(pts[i], b) }));
    const sweep = (kk) => async (c) => {
      await fadeIn(c, rows[kk]);
      for (const s of segs.filter((q) => q.k === kk)) {
        const el = G.segment(s.a, s.b, { color: KC[kk], width: 7 });
        const line = h('div', 'u5l11-pli', (d.names ? T(`${d.names[s.i]}\\to ${d.names[s.i + 1]}`) + ' ' : '') + `<span class="muted">${d.span(s.a[0], s.b[0])}</span>`);
        rows[kk].lastChild.appendChild(line);
        await Promise.all([G.drawIn(el, 600, c), fadeIn(c, line)]);
      }
    };
    const want = segs.filter((s) => s.k === d.want), durs = want.map((s) => s.b[0] - s.a[0]), sum = durs.reduce((p, q) => p + q, 0);
    return [
      { cap: 'Here is the graph. Read it <b>left to right</b>, the way time moves.',
        run: async (c) => { const base = G.polyline(pts, { color: INK, width: 3.5 }); await G.drawIn(base, 1200, c); if (d.names) await Promise.all(pts.map((p, i) => G.reveal(G.point(p[0], p[1], { color: INK, r: 5, label: T(d.names[i]), pos: d.pos[i] }), c))); } },
      { cap: 'Pieces that <b>rise</b> left to right: <b>increasing</b>.', run: sweep('inc') },
      { cap: 'Pieces that <b>fall</b>: <b>decreasing</b>.', run: sweep('dec') },
      { cap: '<b>Flat</b> pieces: <b>constant</b>. Nothing changes there.', run: sweep('con') },
      { cap: d.total(sum, durs.map((v) => `${v} min`)),
        run: async (c) => {
          for (const s of want) {
            const sh = G.shadeX(s.a[0], s.b[0], { color: 'gray', band: true });
            const lb = G.label((s.a[0] + s.b[0]) / 2, G.win.ymax * 0.04, `${s.b[0] - s.a[0]} min`, { pos: 'n', cls: 'u5l11-dur' });
            await Promise.all([G.drawIn(sh, 600, c), fadeIn(c, lb)]);
          }
          const tot = h('div', 'u5l11-ptot', `constant: <b>${durs.join(' + ')} = ${sum} min</b>`); P.appendChild(tot); await pop(c, tot);
        } }
    ];
  }
};

/* =============================== explainer: matching a story to a graph =============================== */
const PHC = ['#1f5bd6', '#5d6574', '#7b4fc4', '#c27a0e'];
const MT = {
  sam: { lead: 'Sam’s story', graphs: SAM, mini: { xmin: 0, xmax: 2.6, ymin: 0, ymax: 2.9 },
    phases: [['Sam leaves home and walks at a steady pace toward school.', 'gentle rise'], ['Partway there, he stops at a corner to talk to a friend.', 'flat'], ['Then he jogs the rest of the way, faster than he walked.', 'steeper rise']],
    order: [
      { g: 'C', bad: [1], note: [[1, 'goes down', 'ne']], cap: 'Graph <b>C</b>: the middle piece goes <b>down</b>. Sam would be heading back home, not stopping. ✗' },
      { g: 'D', bad: [0, 2], note: [[0, 'flat first', 'n'], [2, 'flat last', 'n']], cap: 'Graph <b>D</b>: flat <b>first</b> and <b>last</b>. Sam would wait before leaving and stop at the end. ✗' },
      { g: 'B', bad: [0, 2], note: [[0, 'steep', 'nw'], [2, 'gentle', 'n']], cap: 'Graph <b>B</b>: the first piece is <b>steeper</b> than the last. Sam would walk faster than he jogs. ✗' },
      { g: 'A', ok: true, cap: 'Graph <b>A</b>: gentle rise → flat → steeper rise. It fits every phase. <b>A</b> matches ✓' }] },
  dee: { lead: 'Dee’s trip (warm-up 4)', graphs: WU, mini: { xmin: 0, xmax: 10.7, ymin: 0, ymax: 6.4 },
    phases: [['Dee walks to the bus stop,', 'gentle rise'], ['waits,', 'flat'], ['then rides the bus', 'very steep rise'], ['to school.', 'flat (at school)']],
    order: [
      { g: 'A', bad: [1], note: [[1, 'goes down', 'ne']], cap: 'Graph <b>A</b> goes <b>down</b>: Dee never heads back home. ✗' },
      { g: 'D', bad: [0], note: [[0, 'never flat', 'nw']], cap: 'Graph <b>D</b> is never flat: Dee never waits. ✗' },
      { g: 'C', bad: [0], note: [[0, 'one rise only', 'se']], cap: 'Graph <b>C</b>: one rise, then flat. No waiting partway, no fast bus ride. ✗' },
      { g: 'B', ok: true, cap: 'Graph <b>B</b>: gentle rise, flat, very steep rise, flat. It fits every phase ✓' }] }
};
const match = {
  title: 'Match the story: rule graphs out',
  height: 476,
  minW: 900,
  choices: [{ v: 'sam', label: 'Example 2 check' }, { v: 'dee', label: 'Warm-up 4: Dee' }],
  intro: (k) => (k === 'sam' ? 'Sam’s walk to school. Split the story into phases, then test each graph. Press <b>Next</b>.' : 'The same method on a warm-up trip. Press <b>Next</b>.'),
  make(stage, k, ex) {
    const d = MT[k], LW = 316, X0 = LW + 14, CW = Math.floor((ex.W - X0 - 14) / 2), CH = 230;
    const desc = add(stage, box(h('div', 'u5l11-desc', `<div class="u5l11-lead">${d.lead}</div>`), LW, 466), 4, 4);
    const spans = d.phases.map(([t]) => { const s = h('div', 'u5l11-phase', t); desc.appendChild(s); return s; });
    const cells = {};
    ['A', 'B', 'C', 'D'].forEach((L, i) => {
      const x = X0 + (i % 2) * (CW + 10), y = 4 + Math.floor(i / 2) * (CH + 8);
      const G = storyGraph(stage, Object.assign({ x, y, width: CW, height: CH, grid: false, xt: 'time', yt: 'distance', pad: [12, 16, 34, 42], small: true }, d.mini));
      const line = G.polyline(d.graphs[L], { color: INK, width: 4.5 });
      cells[L] = { G, line, tag: letterTag(G, L) };
    });
    const steps = [{
      cap: `Split the story into <b>phases</b>, in order: ${d.phases.map((p) => p[1]).join(', ')}.`,
      run: async (c) => {
        for (let i = 0; i < spans.length; i++) {
          spans[i].classList.add('on'); spans[i].style.borderColor = PHC[i];
          const t = h('span', 'u5l11-ptag', d.phases[i][1]); t.style.background = PHC[i]; spans[i].appendChild(t); await pop(c, t);
        }
      }
    }];
    d.order.forEach((o) => steps.push({
      cap: o.cap,
      run: async (c) => {
        const { G, line } = cells[o.g], pts = d.graphs[o.g];
        if (o.ok) {
          const jobs = pts.slice(1).map((b, i) => G.drawIn(G.segment(pts[i], b, { color: PHC[i], width: 7 }), 500, c));
          await Promise.all(jobs);
          const s = stamp(G.el, 'match', { ok: true, size: 'sm' }); s.classList.add('u5l11-st'); await stampIn(c, s);
          return;
        }
        for (const i of o.bad) await G.drawIn(G.segment(pts[i], pts[i + 1], { color: 'red', width: 8 }), 450, c);
        await Promise.all((o.note || []).map(([i, txt, pos]) => fadeIn(c, G.label((pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2, txt, { pos, cls: 'u5l11-bad', gap: 8 }))));
        const s = stamp(G.el, 'no', { ok: false, size: 'sm' }); s.classList.add('u5l11-st'); await stampIn(c, s);
        line.style.opacity = 0.55;
      }
    }));
    return steps;
  }
};

/* =============================== explainer: straight or curved (shape vocabulary) =============================== */
const SH = {
  up: { name: 'steady increase', short: 'steady increase', f: (x) => 0.4 + 0.85 * x, xs: [0.2, 1.0, 1.8, 2.6, 3.4, 4.1],
    cap: 'Every step rises by the <b>same amount</b>: a <b>steady</b> (constant) rate. That makes a <b>straight</b> line.', ex: ['a bottle filling from a tap at a steady rate (Example 3(a))', 'distance walked at a steady pace (Ava)'] },
  down: { name: 'steady decrease', short: 'steady decrease', f: (x) => 3.9 - 0.85 * x, xs: [0.2, 1.0, 1.8, 2.6, 3.4, 4.1],
    cap: 'Every step falls by the <b>same amount</b>: a steady rate of decrease. <b>Straight</b> again.', ex: ['a candle burning down at a steady rate', 'a tub draining at a steady rate (Example 4)'] },
  dslow: { name: 'decreasing, slowing down', short: 'decreasing, slowing down', f: (x) => 0.5 + 3.6 * Math.exp(-0.9 * (x - 0.2)), xs: [0.2, 1.0, 1.8, 2.6, 3.4, 4.1],
    cap: 'Still falling, but each drop is <b>smaller</b> than the one before. The curve gets <b>flatter</b> and levels off.', ex: ['a mug of hot cocoa cooling (Example 3(b))', 'the speed of a ball rolling to a stop on grass'] },
  islow: { name: 'increasing, slowing down', short: 'increasing, slowing down', f: (x) => 0.3 + 3.6 * (1 - Math.exp(-0.9 * (x - 0.2))), xs: [0.2, 1.0, 1.8, 2.6, 3.4, 4.1],
    cap: 'Still rising, but each rise is <b>smaller</b> than the one before. The curve bends toward <b>flat</b>.', ex: ['a cold glass of milk warming up to room temperature', 'a sunflower’s height as it nears its full size'] },
  ifast: { name: 'increasing, speeding up', short: 'increasing, speeding up', f: (x) => 0.3 + 0.24 * (x - 0.2) ** 2, xs: [0.2, 1.0, 1.8, 2.6, 3.4, 4.1],
    cap: 'Each rise is <b>bigger</b> than the one before: increasing and <b>speeding up</b>. The curve gets steeper and steeper.', ex: ['a snowball rolling downhill, growing as it goes', 'the distance a dropped stone has fallen'] }
};
const shapes = {
  title: 'Straight or curved?',
  height: 440,
  minW: 860,
  choices: Object.keys(SH).map((k) => ({ v: k, label: SH[k].name })),
  intro: (k) => `Shape: <b>${SH[k].name}</b>. How does the quantity change as time goes on? Press <b>Next</b>.`,
  make(stage, k, ex) {
    const d = SH[k], PW = 330;
    const G = storyGraph(stage, { x: 4, y: 4, width: ex.W - PW - 16, height: 430, xmin: 0, xmax: 4.5, ymin: 0, ymax: 4.3, xstep: 0.5, ystep: 0.5, xt: 'time', yt: 'quantity', pad: [16, 24, 40, 48] });
    const P = panel(stage, 'sounds like…', PW, 428, ex.W - PW - 6, 6);
    const ys = d.xs.map(d.f);
    return [
      { cap: 'Here is the shape.', run: (c) => G.drawIn(G.fn(d.f, { from: 0.2, to: 4.1, color: INK, width: 4.5, arrows: false, samples: 200 }), 1100, c) },
      { cap: 'Cut time into <b>equal steps</b>. How much does the quantity change in each step?',
        run: async (c) => {
          for (let i = 0; i + 1 < d.xs.length; i++) {
            const a = [d.xs[i], ys[i]], b = [d.xs[i + 1], ys[i + 1]], up = b[1] >= a[1];
            const r = G.segment(a, [b[0], a[1]], { color: 'amber', width: 2.5, dash: true });
            const bar = G.segment([b[0], a[1]], b, { color: up ? 'green' : 'red', width: 6, cap: 'butt' });
            await G.drawIn(r, 220, c); await G.drawIn(bar, 260, c);
          }
        } },
      { cap: d.cap,
        run: async (c) => {
          const nm = h('div', 'u5l11-shn', d.name); P.appendChild(nm); await pop(c, nm);
          for (const e of d.ex) { const li = h('div', 'u5l11-shx', e); P.appendChild(li); await fadeIn(c, li); }
        } }
    ];
  }
};

/* =============================== explainers: sketching from a story (Example 3 and Example 5) =============================== */
const SK = {
  phone: { lead: 'Your phone’s battery charge through the day:', xt: 'time', yt: 'battery charge', scene: 'phone',
    pieces: [{ t: 'it is fully charged when you leave home,', pt: [0.3, 9.2], cap: 'Start: <b>full</b>, so the graph starts high.' },
      { t: 'drains slowly during class,', pts: [[0.3, 9.2], [5, 7.2]], cap: '“Drains slowly”: <b>decreasing</b>, gently. A gradual slope down.' },
      { t: 'then quickly while you play a game at lunch.', pts: [[5, 7.2], [6.5, 2.2]], cap: '“Quickly”: <b>decreasing</b> again, but <b>steep</b>. Faster means steeper.' },
      { t: 'You plug it in and it charges fast,', pts: [[6.5, 2.2], [8.3, 9.2]], cap: '“Charges fast”: a steep <b>increase</b>.' },
      { t: 'then it stays full.', pts: [[8.3, 9.2], [10, 9.2]], cap: '“Stays full”: <b>constant</b>, a flat piece at the top.' }],
    end: 'Check the ends: it starts full, never reaches 0 (the battery never died), and ends full. Shape, not numbers.' },
  a: { lead: 'Height of water in a bottle:', xt: 'time', yt: 'water height', scene: 'bottle',
    pieces: [{ t: 'a tap fills the bottle at a steady rate from empty until it is full,', pts: [[0, 0], [5, 8.6]], cap: '“A steady rate from empty”: start at <b>0</b> and draw a <b>straight</b> rising piece.' },
      { t: 'and then the tap is shut off and the bottle sits full and unchanged.', pts: [[5, 8.6], [10, 8.6]], cap: '“Shut off … unchanged”: <b>constant</b>, a flat piece at the top.' }],
    end: 'Two pieces joined into one graph: a straight rise that turns <b>flat</b> the moment the tap is shut off.' },
  b: { lead: 'Temperature of a mug of hot cocoa left on a table:', xt: 'time', yt: 'temperature', scene: 'mug',
    pieces: [{ t: 'it cools quickly at first,', f: (x) => 2 + 7 * Math.exp(-0.55 * (x - 0.3)), from: 0.3, to: 2.6, cap: '“Cools quickly at first”: <b>decreasing</b> and <b>steep</b>.' },
      { t: 'then cools more and more slowly', f: (x) => 2 + 7 * Math.exp(-0.55 * (x - 0.3)), from: 2.6, to: 10, cap: '“More and more slowly”: still decreasing, but the curve gets <b>flatter and flatter</b>.' },
      { t: 'as it gets close to room temperature (never quite reaching it).', room: 2, cap: 'Room temperature is a level the curve gets closer and closer to, but <b>never touches</b>.' }],
    end: 'A <b>curve</b>: steep at first, then flattening out above room temperature. It never reaches 0 °C either!' },
  ex5: { lead: 'A family drives from home to a mountain cabin. Their speed:', xt: 'time', yt: 'speed', scene: 'car',
    pieces: [{ t: 'They speed up steadily to highway speed,', pts: [[0, 0], [1.3, 8.4]], cap: '“Speed up steadily”: a straight <b>rising</b> piece, starting at 0.' },
      { t: 'cruise for a long stretch,', pts: [[1.3, 8.4], [4.2, 8.4]], cap: '“Cruise … for a long stretch”: <b>flat and high</b>, and long.' },
      { t: 'slow down and stop at a gas station,', pts: [[4.2, 8.4], [5.1, 0]], cap: '“Slow down … stop”: <b>falling</b> all the way to 0.' },
      { t: 'stay stopped to refuel,', pts: [[5.1, 0], [6.3, 0]], cap: '“Stay stopped”: <b>flat along the axis</b>. Speed 0.' },
      { t: 'speed up again,', pts: [[6.3, 0], [7.2, 6.6]], cap: '“Speed up again”: <b>rising</b> from 0.' },
      { t: 'but only to a slightly slower cruising speed,', pts: [[7.2, 6.6], [8.6, 6.6]], cap: '“A slightly slower cruising speed”: <b>flat</b>, a bit <b>lower</b> than the first cruise.' },
      { t: 'then slow down and stop at the cabin.', pts: [[8.6, 6.6], [9.7, 0]], cap: '“Slow down and stop”: <b>falling</b> to 0. They’re at the cabin.' }],
    end: 'Check: it starts and ends at 0, touches 0 at the gas station, and the second cruise is <b>lower</b> than the first.' }
};
const pieceEnd = (p) => (p.pts ? p.pts[1] : p.f ? [p.to, p.f(p.to)] : p.pt || null);
const pieceStart = (p) => (p.pts ? p.pts[0] : p.f ? [p.from, p.f(p.from)] : p.pt || null);
function sketchScene(stage, d, x, y, W, H, G) {
  const sc = add(stage, box(h('div', 'u5l11-scene'), W, H), x, y);
  if (d.scene === 'bottle') {
    sc.innerHTML = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="#eef2f7"/>
      <g transform="translate(${W / 2 - 40} 0)"><rect x="-40" y="8" width="60" height="14" rx="4" fill="#aab2be" stroke="${INK}" stroke-width="2"/><rect x="8" y="8" width="12" height="24" rx="3" fill="#aab2be" stroke="${INK}" stroke-width="2"/>
      <line class="u5l11-bstream" x1="14" y1="32" x2="14" y2="96" stroke="${WATER}" stroke-width="6" stroke-dasharray="10 5"/>
      <defs><clipPath id="u5l11bt"><path d="M2 40H26V48Q42 54 42 66V100H-14V66Q-14 54 2 48Z"/></clipPath></defs>
      <rect class="u5l11-bw" x="-20" y="100" width="70" height="0" fill="${WATER}" clip-path="url(#u5l11bt)"/>
      <path d="M2 40H26V48Q42 54 42 66V100H-14V66Q-14 54 2 48Z" fill="none" stroke="${INK}" stroke-width="2.6"/></g>
      <text class="u5l11-bt" x="${W / 2 + 40}" y="64" font-size="18" font-weight="800" fill="${INK}">tap on</text></svg>`;
    const bw = sc.querySelector('.u5l11-bw'), st = sc.querySelector('.u5l11-bstream'), bt = sc.querySelector('.u5l11-bt');
    return (xx, yy, kk) => { const hh = 52 * Math.max(0, Math.min(1, yy / 8.6)); bw.setAttribute('y', 100 - hh); bw.setAttribute('height', hh); st.style.display = kk === 'inc' ? '' : 'none'; bt.textContent = kk === 'inc' ? 'tap on: filling' : xx > 0.1 ? 'tap off: full' : 'empty'; };
  }
  if (d.scene === 'mug') {
    sc.innerHTML = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="#f3efe6"/><rect y="${H - 14}" width="${W}" height="14" fill="#c9a77c"/>
      <g transform="translate(${W / 2 - 90} 0)"><g class="u5l11-steam" stroke="#9aa3b2" stroke-width="3" fill="none" stroke-linecap="round"><path d="M-10 30Q-16 20 -10 10Q-4 0 -10 -8"/><path d="M8 30Q2 20 8 10Q14 0 8 -8"/></g>
      <path d="M-28 36H28V82Q28 90 20 90H-20Q-28 90 -28 82Z" fill="#fff" stroke="${INK}" stroke-width="2.6"/><rect x="-24" y="40" width="48" height="10" fill="#7a4a26"/><path d="M28 48Q46 48 46 62Q46 76 28 76" fill="none" stroke="${INK}" stroke-width="2.6"/></g>
      <g transform="translate(${W / 2 + 60} 6)"><rect x="-8" y="0" width="16" height="72" rx="8" fill="#fff" stroke="${INK}" stroke-width="2"/><circle cy="80" r="11" fill="${COLORS.red}" stroke="${INK}" stroke-width="2"/>
      <rect class="u5l11-merc" x="-4" y="70" width="8" height="10" fill="${COLORS.red}"/><line x1="-14" x2="14" y1="58" y2="58" stroke="${INK}" stroke-width="2" stroke-dasharray="4 3"/><text x="18" y="63" font-size="14" font-weight="700" fill="${INK}">room</text></g></svg>`;
    const merc = sc.querySelector('.u5l11-merc'), steam = sc.querySelector('.u5l11-steam');
    return (xx, yy) => { const t = Math.max(0, Math.min(1, yy / 9)); const hh = 4 + t * 64; merc.setAttribute('y', 72 - hh); merc.setAttribute('height', hh + 8); steam.style.opacity = Math.max(0, (yy - 2) / 7); };
  }
  if (d.scene === 'car') {
    const pts = d.pieces.flatMap((p, i) => (i ? [p.pts[1]] : p.pts)), S = (t) => { let s = 0; for (let i = 1; i < pts.length; i++) { const a = pts[i - 1], b = pts[i]; if (t <= a[0]) break; const te = Math.min(t, b[0]); s += (te - a[0]) * (a[1] + yAt(pts, te)) / 2; } return s; };
    const tot = S(9.7);
    const road = makeRoad(sc, { x: 0, y: 0, w: W, h: H, dmax: tot, places: [{ d: S(5.1), k: 'gas' }, { d: tot, k: 'cabin' }], mode: 'car', gauge: { max: 10 } });
    sc.style.border = 'none';
    return (xx, yy) => { road.set(S(xx), 'car'); road.speed(yy); };
  }
  sc.innerHTML = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="#eef2f7"/>
    <g transform="translate(${W / 2 - 90} ${H / 2 - 30})"><rect width="170" height="60" rx="10" fill="#fff" stroke="${INK}" stroke-width="3"/><rect x="170" y="18" width="10" height="24" rx="3" fill="${INK}"/>
    <rect class="u5l11-bat" x="6" y="6" width="158" height="48" rx="6"/><path class="u5l11-bolt" d="M92 8L70 34H86L78 54L102 26H86Z" fill="#facd28" stroke="${INK}" stroke-width="2" style="display:none"/></g></svg>`;
  const bat = sc.querySelector('.u5l11-bat'), bolt = sc.querySelector('.u5l11-bolt');
  return (xx, yy, kk) => { const t = Math.max(0, Math.min(1, yy / 9.2)); bat.setAttribute('width', Math.max(2, 158 * t)); bat.setAttribute('fill', t < 0.3 ? COLORS.red : COLORS.green); bolt.style.display = kk === 'inc' ? '' : 'none'; };
}
function sketchDef(keys, title, intro) {
  return {
    title,
    height: 476,
    minW: 900,
    choices: keys.length > 1 ? keys.map((k) => ({ v: k, label: k === 'phone' ? 'A phone battery' : `Example 3(${k}) check` })) : undefined,
    intro,
    make(stage, kArg, ex) {
      const k = keys.length > 1 ? kArg : keys[0], d = SK[k], car = d.scene === 'car';
      const LW = 320, SCH = car ? 132 : 108, GX = LW + 10, GW = ex.W - GX - 4;
      const desc = add(stage, box(h('div', 'u5l11-desc', `<div class="u5l11-lead">${d.lead}</div>`), LW, 466), 4, 4);
      const spans = d.pieces.map((p) => { const s = h('span', 'u5l11-ph-t', p.t + ' '); desc.appendChild(s); return s; });
      const G = storyGraph(stage, { x: GX, y: SCH + 8, width: GW, height: 476 - SCH - 12, xmin: 0, xmax: 10.6, ymin: 0, ymax: 10.4, grid: false, xt: d.xt, yt: d.yt, pad: [12, 22, 38, 50] });
      const set = sketchScene(stage, d, GX, 4, GW, SCH, G);
      const p0 = pieceStart(d.pieces[0]);
      set(p0[0], p0[1], null);
      let last = p0;
      const steps = d.pieces.map((p, i) => ({
        cap: p.cap,
        run: async (c) => {
          spans.forEach((s, j) => s.classList.toggle('on', j === i)); if (i) spans[i - 1].classList.add('done');
          if (p.pt) { await G.reveal(G.point(p.pt[0], p.pt[1], { color: SKETCH, r: 7 }), c); return; }
          if (p.room != null) {
            const rl = G.hline(p.room, { color: 'gray', width: 2.5 }); const lb = G.label(8.4, p.room, 'room temperature', { pos: 'n', cls: 'u5l11-note' });
            await Promise.all([G.drawIn(rl, 700, c), fadeIn(c, lb)]); return;
          }
          const a = pieceStart(p), b = pieceEnd(p), kk = kindOf(a, b);
          const seg = p.f ? G.fn(p.f, { from: p.from, to: p.to, color: SKETCH, width: 5, arrows: false, samples: 120 }) : G.segment(a, b, { color: SKETCH, width: 5 });
          const fy = p.f || ((x) => lerp(a[1], b[1], (x - a[0]) / (b[0] - a[0])));
          const tw = tween(c, 1300, (t) => { const x = lerp(a[0], b[0], t); set(x, fy(x), kk); }, linear);
          await Promise.all([G.drawIn(seg, 1300, c, { easing: 'linear' }), tw]);
          last = b;
          const tag = h('span', 'u5l11-ptag2 ' + kk, KW[kk]); spans[i].appendChild(tag); await pop(c, tag);
        }
      }));
      steps.push({
        cap: d.end,
        run: async (c) => {
          spans.forEach((s) => { s.classList.remove('on'); s.classList.add('done'); });
          const e = d.pieces.map(pieceEnd).filter(Boolean).pop(); set(e[0], e[1], null);
          const s = stamp(desc, 'shape, not numbers', { ok: true, size: 'sm' }); s.style.display = 'table'; s.style.margin = '18px auto 0'; await stampIn(c, s);
        }
      });
      return steps;
    }
  };
}
const sketch = sketchDef(['phone', 'a', 'b'], 'From a story to a sketch', (k) => (k === 'phone' ? 'Turn each phrase of the story into one piece of graph. Press <b>Next</b>.' : `Example 3(${k}): one phrase, one piece. Press <b>Next</b>.`));
const drive = sketchDef(['ex5'], 'The drive to the cabin', 'Example 5: one phrase, one piece. Watch the speedometer. Press <b>Next</b>.');

/* =============================== explainer: Mia's bath (Example 4) =============================== */
const bath = {
  title: 'Mia’s bath: read it, then finish it',
  height: 470,
  minW: 900,
  intro: 'Example 4: the filling part is already drawn. Find its rate, then finish the graph. Press <b>Next</b>.',
  make(stage, v, ex) {
    const LW = 360;
    const clock = add(stage, box(h('div', 'u5l11-clock wide'), LW - 8, null), 4, 4);
    const tub = makeTub(stage, { x: 4, y: 46, w: LW - 8 });
    const P = panel(stage, 'rate of change (cm per min)', LW - 8, 160, 4, 306);
    const G = storyGraph(stage, miaAxes({ x: LW + 4, y: 4, width: ex.W - LW - 8, height: 460 }));
    G.polyline(MIA.slice(0, 2), { color: INK, width: 4.5 });
    const M1 = MIA.slice(0, 2), M2 = MIA.slice(1);
    const tr = tracer(G, M1, { color: INK }), tr2 = tracer(G, M2, { color: SKETCH });
    tr2.dot.style.opacity = 0;
    const show = (x, d) => { clock.innerHTML = `time <b>${x.toFixed(1)}</b> min &nbsp;·&nbsp; depth <b>${Math.round(d * 10) / 10}</b> cm`; tub.setDepth(d); };
    show(0, 0);
    let rr = null;
    const line = async (c, who, f, col) => { const l = h('div', 'u5l11-rl', `<div class="u5l11-rh" style="color:${col}">${who}</div>${T(f)}`); P.appendChild(l); await fadeIn(c, l); };
    return [
      { cap: '<b>(a)</b> The tap fills the tub: the depth rises from 0 to 24 cm in 6 minutes. (This piece is already drawn.)',
        run: async (c) => { tub.tap(true); await run(c, tr, M1, 0, 6, 1800, show); tub.tap(false); } },
      { cap: `Rate ${T('=\\dfrac{24-0}{6-0}=\\dfrac{24}{6}=4')} cm per minute. Positive: the tub is <b>filling</b>.`,
        run: async (c) => { rr = await riseRun(G, c, [0, 0], [6, 24], 'run 6', 'up 24'); await line(c, 'fill', '\\dfrac{24}{6}=4', KC.inc); } },
      { cap: '<b>(b)</b> Mia soaks for 10 minutes: the depth stays at 24 cm. A <b>flat</b> piece from 6 to 16 minutes.',
        run: async (c) => { G.remove(rr); tr.dot.style.opacity = 0; tr2.dot.style.opacity = 1; tub.soak(true); await run(c, tr2, M2, 6, 16, 1800, show); tub.soak(false); await fadeIn(c, G.label(11, 24, 'soaking (constant)', { pos: 'n', cls: 'u5l11-note' })); } },
      { cap: 'She pulls the plug: the depth falls from 24 cm to 0 in 8 minutes, from (16, 24) to (24, 0).',
        run: async (c) => { tub.plug(true); tub.drain(true); await run(c, tr2, M2, 16, 24, 1900, show); tub.drain(false); } },
      { cap: `Drain rate ${T('=\\dfrac{0-24}{24-16}=\\dfrac{-24}{8}=-3')} cm per minute. 3 is smaller than 4, so draining is a little <b>less steep</b> than filling.`,
        run: async (c) => {
          tr2.dot.style.opacity = 0;
          rr = await riseRun(G, c, [16, 24], [24, 0], 'run 8', 'down 24'); await line(c, 'drain', '\\dfrac{-24}{8}=-3', KC.dec);
        } }
    ];
  }
};

/* =============================== mount =============================== */
mountStatic();
export const explainers = mountExplainers({ story, rate, jae, pieces, match, shapes, sketch, drive, bath });

/* ============ Stand Up Break! — reading a real-world graph: intervals, rate of change, the fastest change (lessons/js/standup.js) ============ */
const SU_RW = [ // quantity, its unit, rate unit, time unit, time step, quantity step, words while increasing / decreasing
  { q: 'Water in the tank', qu: 'L', ru: 'L per min', tu: 'min', ts: 2, qs: 20, up: 'the tank is filling', down: 'the tank is draining', thing: 'amount of water in a tank' },
  { q: 'Cars in the lot', qu: 'cars', ru: 'cars per h', tu: 'h', ts: 1, qs: 20, up: 'cars are arriving', down: 'cars are leaving', thing: 'number of cars in a parking lot' },
  { q: 'Distance from home', qu: 'm', ru: 'm per min', tu: 'min', ts: 5, qs: 200, up: 'she is walking away from home', down: 'she is walking back toward home', thing: 'distance from home on a walk' },
  { q: 'Oven temperature', qu: '°C', ru: '°C per min', tu: 'min', ts: 5, qs: 25, min: 1, up: 'the oven is heating up', down: 'the oven is cooling down', thing: 'temperature of an oven' },
  { q: 'People in the store', qu: 'people', ru: 'people per h', tu: 'h', ts: 1, qs: 15, up: 'shoppers are arriving', down: 'shoppers are leaving', thing: 'number of people in a store' },
  { q: 'Battery charge', qu: '%', ru: '% per h', tu: 'h', ts: 1, qs: 10, up: 'the phone is charging', down: 'the battery is draining', thing: 'charge of a phone battery' },
  { q: 'Depth of water', qu: 'cm', ru: 'cm per min', tu: 'min', ts: 2, qs: 4, up: 'the pool is filling', down: 'the pool is draining', thing: 'depth of water in a wading pool' }
];
const SU_LET = 'ABCDEFGH';
function suStory(r, kmin, kmax, lo = 0) { // vertices in grid units (time 0, 1, …; quantity 0–8): at least one flat piece, one rise and one fall
  for (;;) {
    const k = r.int(kmin, kmax), pts = [[0, r.pick([lo, r.int(lo, 4), r.int(lo, 6)])]];
    let flat = 0, ok = true;
    for (let i = 0; i < k; i++) {
      const [t, y] = pts[i], prev = i ? Math.sign(y - pts[i - 1][1]) : 9;
      let dy, tries = 0; do { dy = r.int(-5, 5); tries++; } while (tries < 50 && (y + dy < lo || y + dy > 8 || Math.sign(dy) === prev || (dy === 0 && flat >= 2)));
      if (tries >= 50) { ok = false; break; }
      if (dy === 0) flat++;
      pts.push([t + r.int(1, 3), y + dy]);
    }
    if (ok && flat >= 1 && flat < k && pts[k][0] <= 12 && pts.some((p, i) => i && p[1] > pts[i - 1][1]) && pts.some((p, i) => i && p[1] < pts[i - 1][1])) return pts;
  }
}
function suStoryFig(C, pts) {
  const T_ = Math.max(8, pts[pts.length - 1][0]), ux = Math.floor(340 / T_), uy = 30, L = 74, top = 32, Wd = L + T_ * ux + 26, Hd = top + 8 * uy + 62;
  const X = (t) => L + t * ux, Y = (q) => top + (8 - q) * uy, ink = '#1c2230', c = '#1f5aa8';
  const halo = 'paint-order="stroke" stroke="#fff" stroke-width="4" stroke-linejoin="round"';
  let s = `<rect x="0" y="0" width="${Wd}" height="${Hd}" rx="10" fill="#fff"/>`;
  for (let t = 0; t <= T_; t++) s += `<line x1="${X(t)}" y1="${Y(0)}" x2="${X(t)}" y2="${Y(8)}" stroke="#d3d8df"/>` + `<text x="${X(t)}" y="${Y(0) + 22}" text-anchor="middle">${t * C.ts}</text>`;
  for (let q = 0; q <= 8; q++) s += `<line x1="${X(0)}" y1="${Y(q)}" x2="${X(T_)}" y2="${Y(q)}" stroke="#d3d8df"/>` + (q % 2 === 0 ? `<text x="${X(0) - 7}" y="${Y(q) + 6}" text-anchor="end">${q * C.qs}</text>` : '');
  s += `<g stroke="${ink}" stroke-width="2"><line x1="${X(0)}" y1="${Y(0)}" x2="${X(T_)}" y2="${Y(0)}"/><line x1="${X(0)}" y1="${Y(0)}" x2="${X(0)}" y2="${Y(8)}"/></g>`;
  s += `<text x="${(X(0) + X(T_)) / 2}" y="${Hd - 8}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="17">Time (${C.tu})</text>`;
  s += `<text transform="translate(18 ${(Y(0) + Y(8)) / 2}) rotate(-90)" text-anchor="middle" font-family="system-ui, sans-serif" font-size="17">${C.q} (${C.qu})</text>`;
  s += `<polyline points="${pts.map(([t, q]) => X(t) + ',' + Y(q)).join(' ')}" fill="none" stroke="${c}" stroke-width="3.4" stroke-linejoin="round"/>`;
  pts.forEach(([t, q], i) => {
    const lo = i > 0 && i < pts.length - 1 && pts[i - 1][1] > q && pts[i + 1][1] > q, dy = lo && q > 0 ? 26 : -11;
    s += `<circle cx="${X(t)}" cy="${Y(q)}" r="5" fill="${c}"/><text x="${X(t)}" y="${Y(q) + dy}" text-anchor="middle" font-weight="700" font-family="system-ui, sans-serif" font-size="19" ${halo}>${SU_LET[i]}</text>`;
  });
  return `<svg viewBox="0 0 ${Wd} ${Hd}" width="${Wd}" role="img" aria-label="${C.q} against time" font-family="KaTeX_Main, 'Times New Roman', serif" font-size="18" fill="${ink}">${s}</svg>`;
}
const suSeg = (i) => `${SU_LET[i]}\\text{ to }${SU_LET[i + 1]}`;
const suRateV = (C, pts, i) => ((pts[i + 1][1] - pts[i][1]) * C.qs) / ((pts[i + 1][0] - pts[i][0]) * C.ts);
const suRT = (v) => String(Math.round(v * 10) / 10); // a rate, to the nearest tenth
const suRE = (v) => (Math.abs(v * 10 - Math.round(v * 10)) < 1e-9 ? '=' : '\\approx ') + suRT(v);
const suU = (C) => `\\text{ ${C.ru.replace('%', '\\%')}}`;
standup('u5l11', {
  intro: 'Read the graph’s story at your whiteboard station: left to right, one piece at a time. Rate of change = change in the quantity ÷ change in time.',
  levels: {
    BEG: (r) => { // which intervals are increasing, decreasing, constant
      const C = r.pick(SU_RW), pts = suStory(r, 3, 4, C.min), n = pts.length - 1, kind = (i) => Math.sign(pts[i + 1][1] - pts[i][1]);
      const list = (s) => [...Array(n).keys()].filter((i) => kind(i) === s).map(suSeg).join(',\\ ') || '\\text{none}';
      return { q: '', text: `The graph shows the ${C.thing}. During which intervals is it increasing? decreasing? constant?`, fig: suStoryFig(C, pts),
        a: [`\\text{increasing: } ${list(1)}`, `\\text{decreasing: } ${list(-1)}`, `\\text{constant: } ${list(0)}`] };
    },
    PRG: (r) => { // a rate of change (a whole number), and the total time it was constant
      for (;;) {
        const C = r.pick(SU_RW), pts = suStory(r, 3, 5, C.min), n = pts.length - 1, segs = [...Array(n).keys()];
        const ok = segs.filter((j) => pts[j + 1][1] !== pts[j][1] && Number.isInteger(suRateV(C, pts, j)));
        if (!ok.length) continue;
        const i = r.pick(ok), dq = (pts[i + 1][1] - pts[i][1]) * C.qs, dt = (pts[i + 1][0] - pts[i][0]) * C.ts;
        const fl = segs.filter((j) => pts[j + 1][1] === pts[j][1]), tot = fl.reduce((s, j) => s + (pts[j + 1][0] - pts[j][0]) * C.ts, 0);
        return { q: '', text: `The graph shows the ${C.thing}. (a) Determine the rate of change from ${SU_LET[i]} to ${SU_LET[i + 1]}, with units. (b) For how long, in total, was it constant?`, fig: suStoryFig(C, pts),
          a: [`\\text{(a) } \\dfrac{${pts[i + 1][1] * C.qs}-${pts[i][1] * C.qs}}{${pts[i + 1][0] * C.ts}-${pts[i][0] * C.ts}}=\\dfrac{${dq}}{${dt}}=${dq / dt}${suU(C)}`,
            `\\text{(b) } ${fl.length > 1 ? fl.map((j) => (pts[j + 1][0] - pts[j][0]) * C.ts).join('+') + '=' : ''}${tot}\\text{ ${C.tu}}\\quad(${fl.map(suSeg).join(',\\ ')})`] };
      }
    },
    MAS: (r) => { // the fastest change (biggest size of rate, rising or falling) and what it means
      const C = r.pick(SU_RW);
      for (;;) {
        const pts = suStory(r, 4, 5, C.min), n = pts.length - 1, rates = [...Array(n).keys()].map((i) => suRateV(C, pts, i)), mags = rates.map(Math.abs), top = Math.max(...mags);
        if (mags.filter((m) => Math.abs(m - top) < 1e-9).length > 1 || mags.filter((m) => m > 0).length < 3) continue;
        const i = mags.indexOf(top), others = [...Array(n).keys()].filter((j) => j !== i && mags[j] > 0);
        return { q: '', text: `The graph shows the ${C.thing}. Which piece shows the fastest rate of change? Determine that rate, with units, and describe what is happening during it.`, fig: suStoryFig(C, pts),
          a: [`${others.map((j) => `${SU_LET[j]}${SU_LET[j + 1]}:\\ ${suRT(rates[j])}`).join(',\\ ')}`, `\\textbf{${SU_LET[i]} to ${SU_LET[i + 1]}}:\\ \\dfrac{${(pts[i + 1][1] - pts[i][1]) * C.qs}}{${(pts[i + 1][0] - pts[i][0]) * C.ts}}${suRE(rates[i])}${suU(C)}`],
          atext: `Fastest: ${SU_LET[i]} to ${SU_LET[i + 1]}, where ${rates[i] > 0 ? C.up : C.down} (compare sizes, ignore the sign).` };
      }
    }
  }
});
