/* Math 15 · Unit 4 · Lesson 3 — Factoring Trinomials x² + bx + c, Part 1: c Positive.
 * Explainers (tiles → rectangle, expand ⇄ factor, the pair search, the diamond, sign choices, inspection with b < 0,
 * check by expanding, common factor first), the diamond-puzzle warm-up, and the Stand Up Break.
 * Built from Math 10C u4l3 (tiles, expand grid, search panel, inspection, error check), trimmed to c > 0.
 * Tile key: x² teal, x amber, 1 slate blue, drawn to scale (x² is x by x, an x-tile 1 by x, a unit tile 1 by 1). */
import { h, fmt, Explainer } from '../explain.js';
import { tex } from '../tex.js';
import { standup } from '../standup.js';
import { NumberLine } from '../blocks.js';

const at = (el, x, y) => { el.style.left = x + 'px'; el.style.top = y + 'px'; return el; };
const add = (stage, el, x, y) => { stage.appendChild(at(el, x, y)); return el; };
const hide = (...els) => els.forEach((e) => { if (e) e.style.opacity = 0; });
const box = (el, w, hh) => { el.style.width = w + 'px'; el.style.height = hh + 'px'; return el; };
const svgEl = (tag, attrs = {}) => { const e = document.createElementNS('http://www.w3.org/2000/svg', tag); for (const k in attrs) e.setAttribute(k, attrs[k]); return e; };

/* KaTeX allowing \htmlClass, so parts of a line can be revealed one at a time */
const K = (src, display) => {
  try { return window.katex.renderToString(String(src), { displayMode: !!display, throwOnError: false, strict: 'ignore', trust: true, output: 'html' }); }
  catch (e) { return tex(src, display); }
};
const T = (s) => tex(s);
const spans = (root, cls) => [...root.querySelectorAll('.' + cls)];
const showSpans = (c, els, ms = 320, delay = 0) => Promise.all(els.map((e) => c.anim(e, [{ opacity: 0 }, { opacity: 1 }], ms, { delay })));
const pulse = (c, el, s = 1.1) => c.anim(el, [{ transform: 'scale(1)' }, { transform: `scale(${s})` }, { transform: 'scale(1)' }], 460);
function stampIn(c, el) { return c.anim(el, [{ opacity: 0, transform: 'scale(1.9) rotate(-14deg)' }, { opacity: 1, transform: 'scale(1) rotate(-6deg)' }], 420, { easing: 'cubic-bezier(.2,1.4,.4,1)' }); }

const TEAL = '#13807a', AMB = '#c27a0e', PUR = '#7b4fc4', BLU = '#2f6fd0', RED = '#c93a33';
const FOILC = [TEAL, AMB, PUR, BLU];
const tc = (col, s) => `\\textcolor{${col}}{${s}}`;
const mns = (n) => String(n).replace('-', '−'); // a real minus sign in plain text

/* ============ polynomial helpers: a term is { c: coefficient, v: { x: 2, y: 1 } } ============ */
function parseTerm(s) {
  const m = String(s).replace(/\s+/g, '').match(/^([+-]?)(\d*)((?:[a-z](?:\^\d+)?)*)$/);
  if (!m) throw new Error('bad term ' + s);
  const v = {};
  (m[3].match(/[a-z](?:\^\d+)?/g) || []).forEach((p) => { const k = p[0], e = p.length > 1 ? parseInt(p.slice(2), 10) : 1; v[k] = (v[k] || 0) + e; });
  return { c: (m[1] === '-' ? -1 : 1) * (m[2] === '' ? 1 : parseInt(m[2], 10)), v };
}
const parsePoly = (s) => String(s).replace(/\s+/g, '').match(/[+-]?[^+-]+/g).map(parseTerm);
const mulT = (a, b) => { const v = { ...a.v }; for (const k in b.v) v[k] = (v[k] || 0) + b.v[k]; return { c: a.c * b.c, v }; };
const keyT = (t) => Object.keys(t.v).sort().map((k) => k + t.v[k]).join('');
const degT = (t) => Object.values(t.v).reduce((s, e) => s + e, 0);
const numT = (n) => fmt(n).replace(/ /g, '\\,');
function bodyT(t) {
  const a = Math.abs(t.c), vs = Object.keys(t.v).sort().map((k) => (t.v[k] === 1 ? k : `${k}^{${t.v[k]}}`)).join('');
  return vs ? (a === 1 ? '' : numT(a)) + vs : numT(a);
}
const termT = (t, first) => (t.c < 0 ? '-' : first ? '' : '+') + bodyT(t);
const polyT = (list) => (list.length ? list.map((t, i) => termT(t, i === 0)).join('') : '0');
function collect(list) {
  const m = new Map();
  list.forEach((t) => { const k = keyT(t); if (m.has(k)) m.get(k).c += t.c; else m.set(k, { c: t.c, v: { ...t.v } }); });
  return [...m.values()].map((t, i) => ({ t, i })).filter((o) => o.t.c !== 0).sort((a, b) => degT(b.t) - degT(a.t) || a.i - b.i).map((o) => o.t);
}
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
function gcfT(terms) {
  let g = 0; terms.forEach((t) => (g = gcd(g, Math.abs(t.c))));
  const v = {}; Object.keys(terms[0].v).forEach((k) => { if (terms.every((t) => t.v[k])) v[k] = Math.min(...terms.map((t) => t.v[k])); });
  return { c: g, v };
}
function divT(t, g) { const v = { ...t.v }; for (const k in g.v) { v[k] -= g.v[k]; if (!v[k]) delete v[k]; } return { c: t.c / g.c, v }; }
const evalT = (list, val) => list.reduce((s, t) => s + t.c * Math.pow(val, degT(t)), 0);
const par = (n) => (n < 0 ? `(${n})` : String(n)); // a number written for adding or multiplying: (−3)
const sgn = (n) => (n < 0 ? String(n) : '+' + n);
/* x + 5, x − 3 */
const binT = (v, n, w = '') => (n === 0 ? v : `${v}${n < 0 ? '-' : '+'}${Math.abs(n) === 1 && w ? '' : Math.abs(n)}${w}`);
/* x² + bx + c */
const triT = (b, c, v = 'x', w = '') => polyT([{ c: 1, v: { [v]: 2 } }, { c: b, v: w ? { [v]: 1, [w]: 1 } : { [v]: 1 } }, { c, v: w ? { [w]: 2 } : {} }].filter((t) => t.c));
/* the booklet writes the pair smaller-first when c > 0 */
const ordered = (m, n, c) => (c < 0 ? [n, m] : [m, n]);

/* every factor pair of |c|, signed by the signs rule, with its sum. m is the one nearer 0. */
function searchRows(b, c) {
  const A = Math.abs(c), out = [], sb = b < 0 ? -1 : 1;
  for (let s = 1; s * s <= A; s++) if (A % s === 0) {
    const l = A / s, m = c > 0 ? sb * s : -sb * s, n = sb * l;
    out.push({ s, l, m, n, sum: m + n, ok: m + n === b });
  }
  return out;
}
const sumT = (r) => `${r.m}+${par(r.n)}=${r.sum}`;

/* ============ the diamond (warm-up, Example 2 and the explainers) ============ */
/* S × S box; four regions: top (product, paper), bottom (sum, blue), left and right (the two numbers, red) */
function diamondHTML(S, name) {
  const q = S / 4, hS = S / 2, P = (pts) => pts.map((p) => p.join(',')).join(' ');
  return `<svg class="u4l3-dsvg" viewBox="-3 -3 ${S + 6} ${S + 6}" width="${S}" height="${S}" aria-hidden="true">
    <polygon points="${P([[hS, 0], [q, q], [hS, hS], [3 * q, q]])}" fill="#ffecb3"/>
    <polygon points="${P([[hS, S], [q, 3 * q], [hS, hS], [3 * q, 3 * q]])}" fill="#e8f0fc"/>
    <polygon points="${P([[0, hS], [q, q], [hS, hS], [q, 3 * q]])}" fill="#fff"/>
    <polygon points="${P([[S, hS], [3 * q, q], [hS, hS], [3 * q, 3 * q]])}" fill="#fff"/>
    <path d="M${q} ${q}L${3 * q} ${3 * q}M${3 * q} ${q}L${q} ${3 * q}" stroke="#1e2d46" stroke-width="${Math.max(1.4, S / 110)}"/>
    <polygon points="${P([[hS, 0], [S, hS], [hS, S], [0, hS]])}" fill="none" stroke="#1e2d46" stroke-width="${Math.max(2, S / 60)}" stroke-linejoin="round"/>
  </svg>${name ? `<div class="u4l3-dn">${name}</div>` : ''}
  <div class="u4l3-dl u4l3-dtop"></div><div class="u4l3-dl u4l3-dbot"></div><div class="u4l3-dl u4l3-dleft"></div><div class="u4l3-dl u4l3-dright"></div>`;
}
const dval = (v) => (v === '' || v == null ? '' : /^-?\d+$/.test(String(v)) ? K(String(v)) : K(String(v)));
/* build a diamond inside el (a div or button): data in o = { top, bot, l, r, name }; sides show "?" until .open */
function makeDiamond(el, S, o) {
  el.classList.add('u4l3-dia'); el.style.width = S + 'px'; el.style.height = S + 'px'; el.style.setProperty('--ds', S + 'px');
  el.innerHTML = diamondHTML(S, o.name);
  const g = (k) => el.querySelector('.u4l3-d' + k);
  const L = { top: g('top'), bot: g('bot'), left: g('left'), right: g('right') };
  const set = (k, v) => { L[k].innerHTML = dval(v); };
  set('top', o.top); set('bot', o.bot);
  ['left', 'right'].forEach((k) => { const v = k === 'left' ? o.l : o.r; L[k].innerHTML = `<div class="u4l3-dq">?</div><div class="u4l3-dv">${dval(v)}</div>`; });
  if (o.no) { L.left.innerHTML = '<div class="u4l3-dq">?</div><div class="u4l3-dv u4l3-dx">✗</div>'; L.right.innerHTML = '<div class="u4l3-dq">?</div><div class="u4l3-dv u4l3-dx">✗</div>'; }
  return { el, L, set, sides: (l, r) => { L.left.querySelector('.u4l3-dv').innerHTML = dval(l); L.right.querySelector('.u4l3-dv').innerHTML = dval(r); } };
}

/* ============ algebra tiles (DOM, for the explainer) ============ */
function mkTile(stage, kind, s, w, hh) {
  const e = add(stage, box(h('div', `u4l3-t u4l3-${kind} ${s > 0 ? 'pos' : 'neg'}`), w, hh), 0, 0);
  if (s < 0) e.innerHTML = '<i></i>';
  return { e, w, h: hh, kind, s, cx: 0, cy: 0, rot: 0 };
}
const poseTf = (t, cx, cy, rot) => `translate(${cx - t.w / 2}px, ${cy - t.h / 2}px) rotate(${rot}deg)`;
function place(t, cx, cy, rot = 0) {
  t.cx = cx; t.cy = cy; t.rot = rot; t.e.style.transform = poseTf(t, cx, cy, rot);
  if (t.e.firstChild) t.e.firstChild.style.transform = `rotate(${-rot}deg)`;
}
function moveTile(c, t, cx, cy, rot = 0, ms = 650, delay = 0) {
  const from = poseTf(t, t.cx, t.cy, t.rot), to = poseTf(t, cx, cy, rot), r0 = t.rot;
  t.cx = cx; t.cy = cy; t.rot = rot;
  const jobs = [c.anim(t.e, [{ transform: from }, { transform: to }], ms, { delay })];
  if (t.e.firstChild) jobs.push(c.anim(t.e.firstChild, [{ transform: `rotate(${-r0}deg)` }, { transform: `rotate(${-rot}deg)` }], ms, { delay }));
  if (c.fast) return Promise.all(jobs);
  t.e.classList.add('lift'); // picked up: carried over the other tiles
  return Promise.all(jobs).then(() => t.e.classList.remove('lift'));
}

/* ============ shared explainer pieces ============ */
/* the factor-pair search: one row per factor pair, lighting up the pair whose sum matches */
function searchPanel(stage, x, y, w, b, c, o) {
  const rows = searchRows(b, c);
  const wrap = add(stage, box(h('div', 'u4l3-sp'), w, 0), x, y); wrap.style.height = 'auto';
  wrap.innerHTML = `<div class="u4l3-sph">${o.title}</div>`;
  const els = rows.map((r) => { const e = h('div', 'u4l3-sr' + (o.cls ? ' ' + o.cls : ''), o.row(r) + `<span class="u4l3-srm">${r.ok ? '✓' : '✗'}</span>`); wrap.appendChild(e); hide(e); return e; });
  hide(wrap);
  return {
    rows, els, wrap, hit: rows.find((r) => r.ok) || null,
    async run(c) {
      if (wrap.style.opacity !== '1') await c.fadeIn(wrap, 260);
      for (let i = 0; i < rows.length; i++) {
        await c.fadeIn(els[i], 280, { from: 'translateX(-12px)' });
        els[i].classList.add(rows[i].ok ? 'hit' : 'miss');
        if (rows[i].ok) await c.pop(els[i].lastChild, 380); else await c.sleep(170);
      }
    }
  };
}
const rowPlain = (r) => `<span class="u4l3-srp">${K(`${r.s}\\times${numT(r.l)}`)}</span><span class="u4l3-sri">${K(`${r.m},\\ ${r.n}`)}</span><span class="u4l3-srs">${K(sumT(r))}</span>`;
const rowPos = (r) => `<span class="u4l3-srp">${K(`${r.s}\\times${numT(r.l)}`)}</span><span class="u4l3-srs">${K(sumT(r))}</span>`;

/* the signs table for c > 0, small, with the cell for this trinomial lighting up */
function signsMini(stage, x, y) {
  const e = add(stage, h('div', 'u4l3-sg'), x, y);
  e.innerHTML = `<div class="u4l3-sgc hd"></div><div class="u4l3-sgc hd">${K('b')} positive</div><div class="u4l3-sgc hd">${K('b')} negative</div>
    <div class="u4l3-sgc hd">${K('c')} positive</div><div class="u4l3-sgc" data-k="pp"><div>both <b>positive</b></div></div><div class="u4l3-sgc" data-k="pn"><div>both <b>negative</b></div></div>`;
  hide(e);
  return {
    el: e,
    async light(c, b) {
      await c.fadeIn(e, 260);
      const cell = e.querySelector(`[data-k=${b >= 0 ? 'pp' : 'pn'}]`);
      cell.classList.add('on'); e.classList.add('lit');
      await pulse(c, cell, 1.08);
    }
  };
}
function signsCap(b, c) {
  if (b > 0) return `${T(`c=${c}`)} is <b>positive</b>, so the two numbers have the <b>same sign</b>. ${T(`b=${b}`)} is positive too, so <b>both are positive</b>.`;
  return `${T(`c=${c}`)} is <b>positive</b>, so the two numbers have the <b>same sign</b>. But ${T(`b=${b}`)} is negative, so <b>both are negative</b>.`;
}
/* where an element sits in stage coordinates (the stage may be scaled down) */
function posIn(stage, el) {
  const sr = stage.getBoundingClientRect(), r = el.getBoundingClientRect(), s = sr.width / (stage.offsetWidth || sr.width) || 1;
  return { x: (r.left - sr.left) / s, y: (r.top - sr.top) / s, w: r.width / s, h: r.height / s };
}
/* a copy of a number flies from one element to another */
async function fly(c, stage, html, from, to, cls = '', ms = 750, delay = 0) {
  const a = posIn(stage, from), b = posIn(stage, to);
  const e = add(stage, h('div', 'u4l3-fly ' + cls, html), 0, 0);
  const w = e.offsetWidth, hh = e.offsetHeight;
  const x0 = a.x + a.w / 2 - w / 2, y0 = a.y + a.h / 2 - hh / 2, x1 = b.x + b.w / 2 - w / 2, y1 = b.y + b.h / 2 - hh / 2;
  await c.anim(e, [{ transform: `translate(${x0}px, ${y0}px) scale(1)`, opacity: 1 }, { transform: `translate(${(x0 + x1) / 2}px, ${Math.min(y0, y1) - 40}px) scale(1.25)`, opacity: 1, offset: 0.5 }, { transform: `translate(${x1}px, ${y1}px) scale(1)`, opacity: 1 }], ms, { delay });
  e.remove();
}

/* ============ 1. A pile of tiles becomes a rectangle ============ */
const TD = { br: { b: 7, c: 12 }, s1: { b: 7, c: 10 }, n6: { b: 5, c: 6 }, sq: { b: 6, c: 9 } };
const tileRect = {
  title: 'From a pile of tiles to a rectangle', height: 480,
  choices: [{ v: 'br', label: tex('x^2+7x+12') }, { v: 's1', label: tex('x^2+7x+10') }, { v: 'n6', label: tex('x^2+5x+6') }, { v: 'sq', label: tex('x^2+6x+9') }],
  minW: 900, // drawn this wide and scaled to fit (the side panel needs it)
  intro: (k) => { const d = TD[k]; return `These tiles model ${T(triT(d.b, d.c))}. Can <b>all</b> of them fit together into <b>one rectangle</b>, with no gaps and no overlaps?`; },
  make(stage, key, ex) {
    const W = ex.W, d = TD[key], b = d.b, c = d.c, P = triT(b, c);
    const X = 110, U = 28, G = 6, py = 24, A = c, nb = b;
    const rows = searchRows(b, c), hit = rows.find((r) => r.ok);
    const r = hit.m, k = hit.n; // rows down the side (the smaller), columns across the top
    /* the pile */
    let x = 24;
    const big = mkTile(stage, 'k2', 1, X, X); place(big, x + X / 2, py + X / 2); x += X + 22;
    const xs0 = x, xt = [];
    for (let i = 0; i < nb; i++) { const t = mkTile(stage, 'k1', 1, U, X); place(t, x + U / 2, py + X / 2); xt.push(t); x += U + G; }
    const xs1 = x - G;
    x += 14;
    const ux0 = x, ut = [];
    for (let i = 0; i < A; i++) { const t = mkTile(stage, 'k0', 1, U, U); place(t, ux0 + (i % 4) * (U + 6) + U / 2, py + Math.floor(i / 4) * (U + 6) + U / 2); ut.push(t); }
    const ly = py + Math.max(X, Math.ceil(A / 4) * (U + 6) - 6) + 22;
    const pl = [[24 + X / 2, `1 ${T('x^2')}-tile`], [(xs0 + xs1) / 2, `${nb} ${T('x')}-tiles`], [ux0 + (Math.min(A, 4) * (U + 6) - 6) / 2, `${A} unit tiles`]]
      .map(([cx, html]) => { const e = add(stage, h('div', 'u4l3-plab c', html), cx, ly); hide(e); return e; });
    /* the rectangle's place */
    const wid = X + k * U, hei = X + r * U;
    const ox = Math.max(156, Math.round((610 - wid) / 2) + 40), oy = 266;
    const frame = add(stage, box(h('div', 'u4l3-rframe'), wid, hei), ox, oy); hide(frame);
    const dims = [];
    const dimH = (x0, w, lab) => { const l = add(stage, box(h('div', 'u4l3-dim'), w - 6, 0), x0 + 3, oy - 12), t = add(stage, h('div', 'u4l3-dlab c', K(lab)), x0 + w / 2, oy - 30); hide(l, t); dims.push(l, t); };
    const dimV = (y0, hh, lab) => { const l = add(stage, box(h('div', 'u4l3-vdim'), 0, hh - 6), ox - 12, y0 + 3), t = add(stage, h('div', 'u4l3-dlab c', K(lab)), ox - 32, y0 + hh / 2); hide(l, t); dims.push(l, t); };
    dimH(ox, X, 'x'); dimH(ox + X, k * U, String(k)); dimV(oy, X, 'x'); dimV(oy + X, r * U, String(r));
    const topL = add(stage, h('div', 'u4l3-blab c', K(binT('x', k))), ox + wid / 2, oy - 64);
    const sideL = add(stage, h('div', 'u4l3-blab c', K(binT('x', r))), ox - 100, oy + hei / 2); hide(topL, sideL);
    /* the panel on the right */
    const px = 630, pw = W - px - 14;
    const card = add(stage, box(h('div', 'u4l3-tpc'), pw, 0), px, 14); card.style.height = 'auto'; hide(card);
    card.innerHTML = `<div class="u4l3-tph">The tiles</div><div class="u4l3-tpp">${K(P)}</div>`;
    const sp = searchPanel(stage, px, 104, pw, b, c, { title: `Corner block → ${T('x')}-tiles`, cls: 'tl', row: (q) => `<span class="u4l3-srp">${K(`${q.s}\\times${q.l}`)}</span><span class="u4l3-srs">${K(`${q.s}+${q.l}=${q.s + q.l}`)}</span>` });
    const facs = `(${binT('x', r)})(${binT('x', k)})`;
    const prods = [{ c: 1, v: { x: 2 } }, { c: k, v: { x: 1 } }, { c: r, v: { x: 1 } }, { c: r * k, v: {} }];
    const ry = 104 + 40 + rows.length * 42 + 14;
    const res = add(stage, box(h('div', 'u4l3-tres'), pw, 0), px, ry); res.style.height = 'auto'; hide(res);
    res.innerHTML = `<div class="u4l3-tph">Area = length × width</div><div class="u4l3-teq">${K(`${P}`)}</div><div class="u4l3-teq u4l3-good">${K(`=${facs}`)}</div><div class="u4l3-tck"><b>Check:</b> ${K(`${facs}`)}<br>${K(`=${polyT(prods)}`)}<br>${K(`=${P}`)} <span class="ok">✓</span></div>`;
    const sq = r === k ? ` The rectangle is a <b>square</b>!` : '';
    return [{
      cap: `Count the tiles: one ${T('x^2')}-tile, ${nb} ${T('x')}-tiles and ${A} unit tiles. Together they are ${T(P)}.`,
      run: (c2) => Promise.all([...pl.map((e, i) => c2.fadeIn(e, 300, { delay: i * 150 })), c2.fadeIn(card, 350, { delay: 300 })])
    }, {
      cap: `Build the rectangle around the big square: the ${T('x^2')}-tile goes in the <b>top-left corner</b>.`,
      run: (c2) => Promise.all([...pl.map((e) => c2.anim(e, [{ opacity: 1 }, { opacity: 0 }], 250)), moveTile(c2, big, ox + X / 2, oy + X / 2, 0, 700)])
    }, {
      cap: `The ${A} unit tiles fill the <b>bottom-right corner</b>, so they make a block: <b>rows × columns = ${A}</b>. One ${T('x')}-tile sits beside each row and above each column, so we need <b>rows + columns = ${b}</b>.`,
      run: (c2) => sp.run(c2)
    }, {
      cap: `The ${T(`${r}\\times${k}`)} block works: ${T(`${r}+${k}=${b}`)} ✓. Stand ${k} ${T('x')}-tiles along the <b>top</b> and lay ${r} down the <b>side</b>.`,
      run: async (c2) => {
        await Promise.all(xt.slice(0, k).map((t, i) => moveTile(c2, t, ox + X + i * U + U / 2, oy + X / 2, 0, 650, i * 90)));
        await Promise.all(xt.slice(k).map((t, j) => moveTile(c2, t, ox + X / 2, oy + X + j * U + U / 2, 90, 750, j * 120)));
      }
    }, {
      cap: `The ${A} unit tiles fill the ${r} by ${k} corner exactly. No gaps, no overlaps: <b>a rectangle!</b>${sq}`,
      run: async (c2) => {
        await Promise.all(ut.map((t, i) => moveTile(c2, t, ox + X + (i % k) * U + U / 2, oy + X + Math.floor(i / k) * U + U / 2, 0, 650, Math.min(i * 45, 500))));
        await c2.fadeIn(frame, 300, { from: 'scale(1.03)' });
      }
    }, {
      cap: `Read the sides. Across the top: ${T('x')} and ${T(String(k))} more, so ${T(binT('x', k))}. Down the side: ${T(binT('x', r))}.`,
      run: (c2) => Promise.all([...dims.map((e, i) => c2.fadeIn(e, 280, { delay: i * 60 })), c2.pop(topL, 400, { delay: 350 }), c2.pop(sideL, 400, { delay: 500 })])
    }, {
      cap: `Area = length × width, so ${T(`${P}=${facs}`)}. <b>Check by expanding:</b> ${T(`${facs}=${polyT(prods)}=${P}`)} ✓`,
      run: (c2) => c2.fadeIn(res, 420)
    }];
  }
};

/* ============ 2. Expand (x + p)(x + q), then read it backwards ============ */
const EG = { gen: null, a1: [2, 6], a2: [4, 5], a3: [1, 8], a4: [3, 3] };
const expandGrid = {
  title: 'Expand, then read it backwards', height: 450,
  minW: 966, // drawn this wide and scaled to fit (the sum and product boxes need it)
  choices: [{ v: 'gen', label: tex('(x+p)(x+q)') }, { sep: 'Example 1 check:' }, { v: 'a1', label: '(a)' }, { v: 'a2', label: '(b)' }, { v: 'a3', label: '(c)' }, { v: 'a4', label: '(d)' }],
  intro: (k) => { const d = EG[k]; return d ? `Expand ${T(`(${binT('x', d[0])})(${binT('x', d[1])})`)}, then look at where each number in the answer came from.` : `What happens when we expand ${T('(x+p)(x+q)')} for <b>any</b> two numbers ${T('p')} and ${T('q')}?`; },
  make(stage, key, ex) {
    const W = ex.W, d = EG[key], gen = !d;
    const p = gen ? 'p' : d[0], q = gen ? 'q' : d[1];
    const facP = gen ? 'x+p' : binT('x', p), facQ = gen ? 'x+q' : binT('x', q), prodT = `(${facP})(${facQ})`;
    let O, I, L, L2, fin, sumS, prodS, bS, cS;
    const F = 'x^2';
    if (gen) { O = 'qx'; I = 'px'; L = 'pq'; L2 = '=x^2+(p+q)x+pq'; fin = 'x^2+(p+q)x+pq'; sumS = 'p+q'; prodS = 'pq'; bS = 'p+q'; cS = 'pq'; }
    else {
      const tO = { c: q, v: { x: 1 } }, tI = { c: p, v: { x: 1 } }, tL = { c: p * q, v: {} };
      O = termT(tO, true); I = termT(tI, true); L = termT(tL, true);
      L2 = `=x^2+(${p}+${par(q)})x+${par(p)}\\cdot${par(q)}`;
      fin = polyT(collect([{ c: 1, v: { x: 2 } }, tO, tI, tL])); sumS = `${p}+${par(q)}=${p + q}`; prodS = `${par(p)}\\times${par(q)}=${p * q}`; bS = String(p + q); cS = String(p * q);
    }
    const cells = [[F, O], [I, L]], cols = [[TEAL, AMB], [PUR, BLU]];
    const gx = 30, gy = 64, hw = 76, cw = 150, hh = 54, rh = 96;
    const gb = (x, y, wd, ht, cls, html) => { const e = add(stage, box(h('div', 'u4l3-gg ' + cls, html), wd, ht), x, y); hide(e); return e; };
    const gt = add(stage, h('div', 'u4l3-gt c', 'four-cell grid'), gx + (hw + 2 * cw) / 2, gy - 22); hide(gt);
    const heads = [gb(gx, gy, hw, hh, 'hd x', K('\\times')), gb(gx + hw, gy, cw, hh, 'hd', K('x')), gb(gx + hw + cw, gy, cw, hh, 'hd', K(gen ? '+q' : sgn(q))),
      gb(gx, gy + hh, hw, rh, 'hd', K('x')), gb(gx, gy + hh + rh, hw, rh, 'hd', K(gen ? '+p' : sgn(p)))];
    const cellEls = [0, 1].map((ri) => [0, 1].map((ci) => { const s = cells[ri][ci], e = gb(gx + hw + ci * cw, gy + hh + ri * rh, cw, rh, 'in', `<div class="u4l3-ggv">${K(s)}</div>`); e.style.setProperty('--pc', cols[ri][ci]); e.firstChild.style.opacity = 0; return e; }));
    const tags = ['F', 'O', 'I', 'L'].map((t, i) => { const [ri, ci] = [[0, 0], [0, 1], [1, 0], [1, 1]][i]; const e = add(stage, h('div', 'u4l3-ftag', t), gx + hw + ci * cw + 8, gy + hh + ri * rh + 6); e.style.color = FOILC[i]; hide(e); return e; });
    const lx = 428, sz = 'u4l3-el s';
    const L1 = add(stage, h('div', sz, K(`${prodT}\\htmlClass{u4l3-e0}{=${tc(TEAL, F)}}\\htmlClass{u4l3-e1}{${tc(AMB, '+' + O)}}\\htmlClass{u4l3-e2}{${tc(PUR, '+' + I)}}\\htmlClass{u4l3-e3}{${tc(BLU, '+' + L)}}`)), lx, 70);
    const es = [0, 1, 2, 3].map((i) => spans(L1, 'u4l3-e' + i)); hide(...es.flat());
    const L2e = add(stage, h('div', sz, K(`\\phantom{${prodT}}${L2}`)), lx, 124); hide(L2e);
    const L3e = gen ? null : add(stage, h('div', sz + ' u4l3-good', K(`\\phantom{${prodT}}=${fin}`)), lx, 176); hide(L3e);
    const bx = add(stage, h('div', 'u4l3-sbox sum', `<div class="u4l3-sbh">sum → ${T('b')}</div>${K(sumS)}`), lx, 238), cx = add(stage, h('div', 'u4l3-sbox prod', `<div class="u4l3-sbh">product → ${T('c')}</div>${K(prodS)}`), lx + 250, 238); hide(bx, cx);
    const mid = W / 2, by = 386;
    const bl = add(stage, h('div', 'u4l3-bk r', K(prodT)), mid - 110, by), br2 = add(stage, h('div', 'u4l3-bk l', K(fin)), mid + 110, by); hide(bl, br2);
    const svg = add(stage, svgEl('svg', { class: 'u4l3-arw', width: 220, height: 90, viewBox: '0 0 220 90' }), mid - 110, by - 45); hide(svg);
    svg.innerHTML = `<path d="M20 30 H196" stroke="${TEAL}" stroke-width="3.5" stroke-linecap="round"/><path d="M186 21 L200 30 L186 39" fill="none" stroke="${TEAL}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M200 62 H24" stroke="${AMB}" stroke-width="3.5" stroke-linecap="round"/><path d="M34 53 L20 62 L34 71" fill="none" stroke="${AMB}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="110" y="20" text-anchor="middle" class="u4l3-arwt" fill="${TEAL}">expanding</text><text x="110" y="88" text-anchor="middle" class="u4l3-arwt" fill="${AMB}">factoring</text>`;
    const fillCell = (c, ri, ci, delay = 0) => { const e = cellEls[ri][ci]; return Promise.all([c.sleep(delay).then(() => e.classList.add('on')), c.anim(e.firstChild, [{ opacity: 0, transform: 'scale(.5)' }, { opacity: 1, transform: 'scale(1)' }], 380, { delay }), c.fadeIn(tags[ri * 2 + ci], 260, { delay })]); };
    const qT = gen ? 'q' : String(q), pT = gen ? 'p' : String(p);
    return [{
      cap: gen ? `Expand ${T(prodT)} for <b>any</b> numbers ${T('p')} and ${T('q')}. One bracket goes down the side of a four-cell grid, the other across the top.`
        : `Expand ${T(prodT)} with a four-cell grid: ${T(facP)} down the side, ${T(facQ)} across the top. Each cell is (row) × (column).`,
      run: (c) => Promise.all([c.fadeIn(gt, 300), ...heads.map((e, i) => c.fadeIn(e, 300, { delay: i * 70 })), ...cellEls.flat().map((e) => c.fadeIn(e, 300, { delay: 300 }))])
    }, {
      cap: `<b>F</b>irst: ${T('x\\cdot x=x^2')}.`,
      run: (c) => Promise.all([fillCell(c, 0, 0), showSpans(c, es[0], 320, 150)])
    }, {
      cap: `<b>O</b>utside and <b>I</b>nside: ${T(`x\\cdot ${qT}=${O}`)} and ${T(`${pT}\\cdot x=${I}`)}. Both are ${T('x')}-terms, so they are <b>like terms</b>.`,
      run: (c) => Promise.all([fillCell(c, 0, 1), fillCell(c, 1, 0, 250), showSpans(c, es[1], 320, 150), showSpans(c, es[2], 320, 400)])
    }, {
      cap: `<b>L</b>ast: ${T(`${pT}\\cdot ${qT}=${L}`)}, the only term with no ${T('x')}.`,
      run: (c) => Promise.all([fillCell(c, 1, 1), showSpans(c, es[3], 320, 150)])
    }, {
      cap: gen ? `Collect the two middle terms: ${T('qx+px=(p+q)x')}. So ${T(`${prodT}=x^2+(p+q)x+pq`)}, for every ${T('p')} and ${T('q')}.`
        : `Collect the two middle terms: ${T(`${O}+${I}=${termT({ c: p + q, v: { x: 1 } }, true)}`)}. So ${T(`${prodT}=${fin}`)}.`,
      run: async (c) => {
        await Promise.all([pulse(c, cellEls[0][1], 1.06), pulse(c, cellEls[1][0], 1.06)]);
        cellEls[0][1].classList.add('like'); cellEls[1][0].classList.add('like');
        await c.fadeIn(L2e, 380); if (L3e) await c.fadeIn(L3e, 380, { delay: 150 });
      }
    }, {
      cap: gen ? `Look where the numbers come from. The middle number is the <b>sum</b> ${T('p+q')}; the last number is the <b>product</b> ${T('pq')}.`
        : `Look where the numbers come from. ${T(`b=${bS}`)} is the <b>sum</b> ${T(`${p}+${q}`)}, and ${T(`c=${cS}`)} is the <b>product</b> ${T(`${p}\\times${q}`)}.`,
      run: (c) => Promise.all([c.pop(bx, 420), c.pop(cx, 420, { delay: 200 })])
    }, {
      cap: gen ? `Now run it <b>backwards</b>. To factor ${T('x^2+bx+c')}, find two numbers that <b>multiply to</b> ${T('c')} and <b>add to</b> ${T('b')}. Factoring is expanding run backwards.`
        : `Now run it <b>backwards</b>: to factor ${T(fin)}, find two numbers that multiply to ${T(cS)} and add to ${T(bS)}. They are ${T(String(p))} and ${T(String(q))}, so ${T(`${fin}=${prodT}`)}.`,
      run: (c) => Promise.all([c.fadeIn(bl, 350), c.fadeIn(br2, 350, { delay: 150 }), c.anim(svg, [{ opacity: 0 }, { opacity: 1 }], 400, { delay: 300 })])
    }];
  }
};

/* ============ 2. The sum–product search (Example 2's table) ============ */
const PT = { d: [11, 18], a: [7, 10], b: [9, 20], c: [10, 24], e: [13, 36] };
const pairTable = {
  title: 'The sum–product search',
  height: 390,
  minW: 820, // drawn this wide and scaled to fit
  choices: [{ v: 'd', label: 'sum 11, product 18' }, { sep: 'Example 2 check (sum, product):' }, ...['a', 'b', 'c', 'e'].map((k) => ({ v: k, label: tex(`${PT[k][0]},\\ ${PT[k][1]}`) }))],
  intro: (k) => `Find two positive integers with <b>sum</b> ${T(String(PT[k][0]))} and <b>product</b> ${T(String(PT[k][1]))}. Guessing works for small numbers; a <b>list</b> never misses.`,
  make(stage, key, ex) {
    const W = ex.W, [s, p] = PT[key];
    const tgt = add(stage, h('div', 'u4l3-tgt'), 24, 18);
    tgt.innerHTML = `<div><small>sum ${T('b')}</small>${K(String(s))}</div><div><small>product ${T('c')}</small>${K(String(p))}</div>`;
    const dhost = add(stage, h('div'), 74, 136), D = makeDiamond(dhost, 220, { top: p, bot: s, l: '', r: '' }); hide(D.L.top, D.L.bot);
    const sp = searchPanel(stage, 356, 18, W - 356 - 18, s, p, { title: `Pairs that multiply to ${p} → add them`, row: rowPos });
    const hit = sp.hit, ry = 18 + 40 + sp.rows.length * 42 + 14;
    const res = add(stage, h('div', 'u4l3-pres'), 356, ry); hide(res);
    res.innerHTML = `<div class="u4l3-pbig">The integers: ${K(`${hit.m}`)} and ${K(`${hit.n}`)}</div><div class="u4l3-pso">So ${K(`${triT(s, p)}=(${binT('x', hit.m)})(${binT('x', hit.n)})`)}</div>`;
    return [{
      cap: `Set it up as a diamond: the product ${T(String(p))} goes on <b>top</b>, the sum ${T(String(s))} on the <b>bottom</b>.`,
      run: (c) => Promise.all([c.pop(D.L.top, 380), c.pop(D.L.bot, 380, { delay: 200 })])
    }, {
      cap: `List the pairs that multiply to ${p}, starting from 1, and add each pair. Stop when the sum is ${T(String(s))}.`,
      run: (c) => sp.run(c)
    }, {
      cap: `The integers are <b>${T(`${hit.m}`)} and ${T(`${hit.n}`)}</b>: ${T(`${hit.m}\\times${hit.n}=${p}`)} and ${T(sumT(hit))}. That pair factors ${T(triT(s, p))}.`,
      run: async (c) => { D.el.classList.add('open'); D.sides(hit.m, hit.n); await Promise.all([c.pop(D.L.left, 380), c.pop(D.L.right, 380, { delay: 150 }), c.fadeIn(res, 400, { delay: 200 })]); }
    }];
  }
};

/* ============ 3. The diamond: c on top, b on the bottom, the sides go into the brackets ============ */
const DM = { d: [11, 18], e: [13, 42], a: [7, 12], b: [9, 18], c: [11, 24] };
const diamond = {
  title: 'Factoring with a diamond', height: 486,
  minW: 900,
  choices: [{ v: 'd', label: tex('x^2+11x+18') }, { v: 'e', label: tex('x^2+13x+42') }, { sep: 'Example 3 check:' }, ...['a', 'b', 'c'].map((k) => ({ v: k, label: '(' + k + ')' }))],
  intro: (k) => `Factor ${T(triT(DM[k][0], DM[k][1]))}. The diamond holds the two clues: <b>multiply to</b> ${T('c')}, <b>add to</b> ${T('b')}.`,
  make(stage, key, ex) {
    const W = ex.W, [b, c] = DM[key], P = triT(b, c);
    const rows = searchRows(b, c), hit = rows.find((r) => r.ok), [p, q] = [hit.m, hit.n];
    add(stage, h('div', 'u4l3-iq', 'Factor'), 24, 12);
    const tri = add(stage, h('div', 'u4l3-ie', K(`x^2+\\htmlClass{u4l3-tb}{${tc(BLU, b)}}x+\\htmlClass{u4l3-tc}{${tc(AMB, c)}}`)), 24, 34);
    const dhost = add(stage, h('div'), 50, 116), D = makeDiamond(dhost, 260, { top: c, bot: b, l: p, r: q }); hide(D.L.top, D.L.bot);
    const tags = [add(stage, h('div', 'u4l3-dtag amb', '× multiply'), 316, 150), add(stage, h('div', 'u4l3-dtag blu', '+ add'), 316, 330)]; hide(...tags);
    const sp = searchPanel(stage, 470, 100, W - 470 - 24, b, c, { title: `Pairs that multiply to ${c} → add them`, row: rowPos, cls: rows.length > 4 ? 'sm' : '' });
    const fy = 384;
    const ans = add(stage, h('div', 'u4l3-ie u4l3-fac', K(`${P}=(x+\\htmlClass{u4l3-bp}{${p}})(x+\\htmlClass{u4l3-bq}{${q}})`)), 24, fy);
    const ansS = [...spans(ans, 'u4l3-bp'), ...spans(ans, 'u4l3-bq')];
    hide(ans);
    const ck = add(stage, h('div', 'u4l3-ck', `<b>Check:</b> ${K(`(x+${p})(x+${q})=x^2+${q}x+${p}x+${c}=${P}`)} <span class="ok">✓</span>`), 24, fy + 52); hide(ck);
    return [{
      cap: `We need two numbers that <b>multiply to</b> ${T(`c=${c}`)} and <b>add to</b> ${T(`b=${b}`)}. Put ${T(String(c))} on <b>top</b> of the diamond and ${T(String(b))} on the <b>bottom</b>.`,
      run: async (cx) => {
        await Promise.all([fly(cx, stage, K(String(c)), spans(tri, 'u4l3-tc')[0], D.L.top, 'amb'), fly(cx, stage, K(String(b)), spans(tri, 'u4l3-tb')[0], D.L.bot, 'blu', 750, 250)]);
        await Promise.all([cx.anim(D.L.top, [{ opacity: 0 }, { opacity: 1 }], 200), cx.anim(D.L.bot, [{ opacity: 0 }, { opacity: 1 }], 200), ...tags.map((t, i) => cx.fadeIn(t, 300, { delay: i * 120 }))]);
      }
    }, {
      cap: `Both clues are positive, so both numbers are <b>positive</b>. List the pairs that multiply to ${c}, starting from 1, and add each pair.`,
      run: (cx) => sp.run(cx)
    }, {
      cap: `${T(`${p}+${q}=${b}`)} ✓. The sides of the diamond are <b>${p}</b> and <b>${q}</b>: ${T(`${p}\\times${q}=${c}`)} and ${T(`${p}+${q}=${b}`)}.`,
      run: async (cx) => { D.el.classList.add('open'); await Promise.all([cx.pop(D.L.left, 400), cx.pop(D.L.right, 400, { delay: 180 })]); }
    }, {
      cap: `The two sides go into the brackets: ${T(`${P}=(x+${p})(x+${q})`)}.`,
      run: async (cx) => {
        hide(...ansS); ans.style.opacity = 1;
        await cx.fadeIn(ans, 300);
        await Promise.all([fly(cx, stage, K(String(p)), D.L.left, ansS[0], 'red'), fly(cx, stage, K(String(q)), D.L.right, ansS[1], 'red', 750, 200)]);
        await showSpans(cx, ansS, 200);
      }
    }, {
      cap: `<b>Check by expanding:</b> ${T(`(x+${p})(x+${q})=x^2+${q}x+${p}x+${c}=${P}`)} ✓ Factoring is FOIL run backwards.`,
      run: (cx) => cx.fadeIn(ck, 380)
    }];
  }
};

/* ============ 4. Which signs? The four ways to sign a pair ============ */
const SF = { p7: [3, 4, 1], m8: [3, 5, -1], m11: [5, 6, -1], a: [3, 4, -1], b: [3, 6, -1], c: [3, 8, -1] };
const signFlip = {
  title: 'Same pair, four sign choices', height: 486,
  minW: 940,
  choices: [{ v: 'p7', label: tex('x^2+7x+12') }, { v: 'm8', label: tex('x^2-8x+15') }, { v: 'm11', label: tex('x^2-11x+30') }, { sep: 'Example 4 check:' }, ...['a', 'b', 'c'].map((k) => ({ v: k, label: '(' + k + ')' }))],
  intro: (k) => { const [s, l, sb] = SF[k]; return `Factor ${T(triT(sb * (s + l), s * l))}. The numbers ${s} and ${l} multiply to ${s * l}. But should they be <b>positive</b> or <b>negative</b>?`; },
  make(stage, key, ex) {
    const W = ex.W, [s, l, sb] = SF[key], b = sb * (s + l), c = s * l, P = triT(b, c);
    add(stage, h('div', 'u4l3-iq', 'Factor'), 24, 12);
    add(stage, h('div', 'u4l3-ie', K(P)), 24, 34);
    const need = add(stage, h('div', 'u4l3-need wide', `Need: product ${K(String(c))} &nbsp; sum ${K(String(b))}`), W - 24 - 380, 30); hide(need);
    const opts = [[s, l], [-s, -l], [s, -l], [-s, l]];
    const gap = 16, cw = (W - 48 - 3 * gap) / 4, cy = 108;
    const cards = opts.map(([u, v], i) => {
      const e = add(stage, box(h('div', 'u4l3-sfc'), cw, 172), 24 + i * (cw + gap), cy);
      e.innerHTML = `<div class="u4l3-sfh">${K(`${sgn(u)},\\ ${sgn(v)}`)}</div>
        <div class="u4l3-sfr pr"><div class="u4l3-sfl">product</div><div>${K(`(${sgn(u)})(${sgn(v)})=${sgn(u * v)}`)}</div></div>
        <div class="u4l3-sfr sm"><div class="u4l3-sfl">sum</div><div>${K(`${u}+${par(v)}=${u + v}`)}</div></div><div class="u4l3-sfm"></div>`;
      hide(e, e.querySelector('.pr'), e.querySelector('.sm'));
      return { e, u, v, prod: u * v, sum: u + v };
    });
    const win = cards.find((k) => k.prod === c && k.sum === b), lose = cards.find((k) => k.prod === c && k !== win);
    const NL = new NumberLine(stage, { x: 24, y: 300, width: W - 48, height: 100, min: -12, max: 12 }); NL.el.style.opacity = 0;
    const res = add(stage, h('div', 'u4l3-ie u4l3-fac', K(`${P}=(${binT('x', win.u)})(${binT('x', win.v)})`)), 24, 410); hide(res);
    const rule = add(stage, h('div', 'u4l3-rulep', `${T('c')} positive → <b>same sign</b>, matching ${T('b')}`), W - 24 - 420, 418); hide(rule);
    const mark = (k, ok, txt) => { const m = k.e.querySelector('.u4l3-sfm'); m.textContent = txt; k.e.classList.add(ok ? 'hit' : 'out'); return m; };
    const dir = b < 0 ? 'left' : 'right';
    return [{
      cap: `We need two numbers with <b>product</b> ${T(String(c))} and <b>sum</b> ${T(String(b))}. The pair ${s} and ${l} multiplies to ${c}, but there are <b>four</b> ways to give them signs.`,
      run: (cx) => Promise.all([cx.fadeIn(need, 300), ...cards.map((k, i) => cx.fadeIn(k.e, 320, { delay: 150 + i * 120 }))])
    }, {
      cap: `Multiply each pair. <b>Same signs</b> give ${T(`+${c}`)}. <b>Opposite signs</b> give ${T(`-${c}`)}: wrong product, so cross those two out.`,
      run: async (cx) => {
        await Promise.all(cards.map((k, i) => cx.fadeIn(k.e.querySelector('.pr'), 300, { delay: i * 150 })));
        await Promise.all(cards.filter((k) => k.prod !== c).map((k) => cx.pop(mark(k, false, '✗'), 300)));
      }
    }, {
      cap: `${T('c')} is positive, so the signs are the <b>same</b>. Now add the two pairs that are left: ${T(`${s}+${l}=${s + l}`)} and ${T(`${-s}+(${-l})=${-(s + l)}`)}.`,
      run: (cx) => Promise.all(cards.filter((k) => k.prod === c).map((k, i) => cx.fadeIn(k.e.querySelector('.sm'), 300, { delay: i * 200 })))
    }, {
      cap: `Only ${T(`${win.u}`)} and ${T(`${win.v}`)} add to ${T(String(b))}. On a number line: start at 0, move ${s} ${dir}, then ${l} more ${dir}. You land on ${T(String(b))}.`,
      run: async (cx) => {
        await Promise.all([cx.pop(mark(win, true, '✓'), 360), cx.pop(mark(lose, false, '✗'), 360)]);
        await cx.anim(NL.el, [{ opacity: 0 }, { opacity: 1 }], 300);
        await NL.hop(cx, 0, win.u, { label: mns(sgn(win.u)), color: 'purple', height: 30 });
        await NL.hop(cx, win.u, b, { label: mns(sgn(win.v)), color: 'purple', height: 30 });
        NL.point(b, { color: 'green' });
      }
    }, {
      cap: `So ${T(`${P}=(${binT('x', win.u)})(${binT('x', win.v)})`)}. Rule of thumb: ${T('c')} positive means the <b>same sign</b>, and that sign <b>matches ${T('b')}</b>.`,
      run: (cx) => Promise.all([cx.fadeIn(res, 380), cx.fadeIn(rule, 380, { delay: 200 })])
    }];
  }
};

/* ============ 4 & 5. Factoring by inspection: (common factor,) signs, pair, check ============ */
const IN = {
  m8: 'x^2-8x+15', a4: 'x^2-7x+12', b4: 'x^2-9x+18', c4: 'x^2-11x+24',
  g2: '2x^2+14x+20', b5: 'x^2+13x+36', c5: '3x^2+27x+60'
};
function analyse(e) {
  const terms = parsePoly(e), g = gcfT(terms), hasG = g.c !== 1 || Object.keys(g.v).length > 0, q = terms.map((t) => divT(t, g));
  const v = Object.keys(q[0].v).find((k) => q[0].v[k] === 2);
  return { terms, g, hasG, q, v, b: q[1].c, c: q[2].c, gT: hasG ? bodyT(g) : '' };
}
function makeInspect(title, choices, o = {}) {
  const askG = o.gcf !== false, dy = askG ? 0 : -84;
  return {
    title, height: 520 + dy, choices, minW: 940,
    intro: (k) => askG ? `Factor ${T(IN[k])} completely: common factor first, then the pair, then check.` : `Factor ${T(IN[k])}: find the pair, write the brackets, then check.`,
    make(stage, key, ex) {
      const W = ex.W, A = analyse(IN[key]), { terms, hasG, q, v, b, c, gT } = A;
      const rows = searchRows(b, c), hit = rows.find((r) => r.ok);
      const inner = polyT(q), full = polyT(terms);
      const fac = (n) => `(${binT(v, n)})`;
      const [f1, f2] = ordered(hit.m, hit.n, c);
      const ansT = gT + fac(f1) + fac(f2);
      const one = { c: 1, v: { [v]: 1 } }, k1 = { c: f1, v: {} }, k2 = { c: f2, v: {} };
      const prods = [mulT(one, one), mulT(one, k2), mulT(k1, one), mulT(k1, k2)];
      add(stage, h('div', 'u4l3-iq', askG ? 'Factor completely' : 'Factor'), 24, 12);
      const qa = add(stage, h('div', 'u4l3-ie', K(`${full}\\htmlClass{u4l3-ia}{{}=${ansT}}`)), 24, 36);
      const qaS = spans(qa, 'u4l3-ia'); hide(...qaS);
      const gEls = [];
      let gLine = null, gNote = null;
      if (askG && hasG) {
        terms.forEach((t, i) => { const e = add(stage, h('div', 'u4l3-gc', `<div>${K(termT(t, true))}</div><div class="dv">${K(`\\div ${gT}`)}</div><div class="qt">${K(termT(q[i], true))}</div>`), 24 + i * 150, 96); hide(e); gEls.push(e); });
        gLine = add(stage, h('div', 'u4l3-gl', K(`=${gT}(${inner})`)), 490, 118); hide(gLine);
      } else if (askG) {
        gNote = add(stage, h('div', 'u4l3-gn', `Common factor? ${terms.map((t) => T(termT(t, true))).join(', ')} share no factor except 1, so there is <b>nothing to take out</b>.`), 24, 110); hide(gNote);
      }
      const tgt = add(stage, h('div', 'u4l3-need', `Need: product ${K(String(c))} &nbsp; sum ${K(String(b))}`), 24, 192 + dy); hide(tgt);
      const sg = signsMini(stage, 24, 252 + dy);
      const sp = searchPanel(stage, 352, 192 + dy, W - 352 - 18, b, c, { title: `Pairs that multiply to ${fmt(Math.abs(c))} → signed → add`, row: rowPlain, cls: rows.length > 4 ? 'xs' : 'sm' });
      const ck1 = add(stage, h('div', 'u4l3-ck', `<b>Check:</b> ${K(`${fac(f1)}${fac(f2)}=${polyT(prods)}=${polyT(collect(prods))}`)}${hasG ? '' : ' <span class="ok">✓</span>'}`), 24, 440 + dy);
      const ck2 = hasG ? add(stage, h('div', 'u4l3-ck', `${K(`${gT}(${polyT(collect(prods))})=${full}`)} <span class="ok">✓</span>`), 106, 478 + dy) : null;
      hide(ck1, ck2);
      const tri = triT(b, c, v);
      const steps = [];
      if (askG) steps.push({
        cap: hasG ? `<b>Common factor first.</b> Every term can be divided by ${T(gT)}: divide each one and write ${T(gT)} out front. ${T(`${full}=${gT}(${inner})`)}.`
          : `<b>Common factor first?</b> ${terms.map((t) => T(termT(t, true))).join(', ')} have no common factor except 1, so go straight to the pair.`,
        run: (c2) => hasG ? Promise.all([...gEls.map((e, i) => c2.fadeIn(e, 320, { delay: i * 160 })), c2.fadeIn(gLine, 380, { delay: 600 })]) : c2.fadeIn(gNote, 350)
      });
      steps.push({
        cap: `${hasG ? `Inside the bracket: ${T(tri)}. ` : ''}We need two numbers with <b>product</b> ${T(String(c))} and <b>sum</b> ${T(String(b))}. ` + signsCap(b, c),
        run: (c2) => Promise.all([c2.fadeIn(tgt, 300), sg.light(c2, b)])
      }, {
        cap: `List the pairs that multiply to ${fmt(Math.abs(c))}, give them the sign, and add: ${T(sumT(hit))} ✓.`,
        run: (c2) => sp.run(c2)
      }, {
        cap: `${T(`${hit.m}`)} and ${T(`${hit.n}`)} go into the brackets: ${T(`${tri}=${fac(f1)}${fac(f2)}`)}.${hasG ? ` Keep the common factor in front: ${T(`${full}=${ansT}`)}.` : ''}`,
        run: (c2) => showSpans(c2, qaS, 420)
      }, {
        cap: `<b>Check by expanding.</b> ${T(`${fac(f1)}${fac(f2)}=${polyT(collect(prods))}`)}${hasG ? `, and ${T(`${gT}(${polyT(collect(prods))})=${full}`)}` : ''} ✓`,
        run: (c2) => Promise.all([c2.fadeIn(ck1, 380), ck2 ? c2.fadeIn(ck2, 380, { delay: 250 }) : null])
      });
      return steps;
    }
  };
}
const inspectB = makeInspect('Factoring with both numbers negative', [{ v: 'm8', label: tex(IN.m8) }, { sep: 'Example 4 check:' }, ...['a4', 'b4', 'c4'].map((k) => ({ v: k, label: '(' + k[0] + ')' }))], { gcf: false });
const inspectC = makeInspect('Common factor first, then the pair', [{ v: 'g2', label: tex(IN.g2) }, { sep: 'Example 5 check:' }, ...['b5', 'c5'].map((k) => ({ v: k, label: '(' + k[0] + ')' }))]);

/* ============ 5. Check by expanding: catch the error ============ */
const EC = {
  ok: { o: 'x^2+13x+30', f: [3, 10], why: `Every term matches, and both sides give the same number at ${T('x=2')}. The claim is <b>correct</b>.` },
  e1: { o: 'x^2-7x+12', f: [3, 4], fix: '(x-3)(x-4)', why: `<b>Right numbers, wrong signs:</b> ${T('3+4=+7')}, not ${T('-7')}. A negative ${T('b')} needs <b>both negative</b>. Fix: ${T('(x-3)(x-4)')}.` },
  e2: { o: 'x^2+11x+24', f: [24, 1], fix: '(x+3)(x+8)', why: `<b>Right product, wrong sum:</b> ${T('24\\times1=24')} ✓, but ${T('24+1=25')}, not 11. Keep listing pairs of 24: ${T('3+8=11')}. Fix: ${T('(x+3)(x+8)')}.` },
  e3: { o: '3x^2+15x+18', f: [2, 3], fix: '3(x+2)(x+3)', why: `<b>The common factor was dropped.</b> ${T('(x+2)(x+3)')} is only ${T('x^2+5x+6')}, a third of the trinomial. Take out the 3 first. Fix: ${T('3(x+2)(x+3)')}.` }
};
const errorCheck = {
  title: 'Check by expanding: catch the error',
  height: 456,
  minW: 940,
  choices: [{ sep: 'Example 5 check:' }, { v: 'ok', label: '(a)' }, { sep: 'Find the error:' }, { v: 'e1', label: tex('(x+3)(x+4)') }, { v: 'e2', label: tex('(x+24)(x+1)') }, { v: 'e3', label: tex('(x+2)(x+3)') }],
  intro: (k) => { const d = EC[k]; return `Someone wrote ${T(`${d.o}=${'(' + binT('x', d.f[0]) + ')(' + binT('x', d.f[1]) + ')'}`)}. Is it right? Don’t trust it: <b>expand it and compare</b>.`; },
  make(stage, key) {
    const d = EC[key], O = parsePoly(d.o), [m, n] = d.f, claim = `(${binT('x', m)})(${binT('x', n)})`;
    const one = { c: 1, v: { x: 1 } }, km = { c: m, v: {} }, kn = { c: n, v: {} };
    const prods = [mulT(one, one), mulT(one, kn), mulT(km, one), mulT(km, kn)], col = collect(prods);
    add(stage, h('div', 'u4l3-iq', 'Claim'), 24, 12);
    add(stage, h('div', 'u4l3-ie', K(`${d.o}\\overset{?}{=}${claim}`)), 24, 34);
    const l1 = add(stage, h('div', 'u4l3-el', K(`${claim}=` + prods.map((t, i) => `\\htmlClass{u4l3-c${i}}{${tc(FOILC[i], termT(t, i === 0))}}`).join(''))), 24, 100);
    const cs = [0, 1, 2, 3].map((i) => spans(l1, 'u4l3-c' + i)); hide(...cs.flat());
    const l2 = add(stage, h('div', 'u4l3-el', K(`\\phantom{${claim}}=${polyT(col)}`)), 24, 150); hide(l2);
    const cmp = add(stage, h('div', 'u4l3-cmp'), 24, 212); hide(cmp);
    const byDeg = (list, dd) => list.find((t) => degT(t) === dd);
    const marks = [];
    cmp.innerHTML = `<div class="u4l3-cmh">original</div>${[2, 1, 0].map((dd) => `<div class="u4l3-cmt">${K(byDeg(O, dd) ? termT(byDeg(O, dd), dd === 2) : '0')}</div>`).join('')}
      <div class="u4l3-cmh">expanded</div>${[2, 1, 0].map((dd) => `<div class="u4l3-cmt">${K(byDeg(col, dd) ? termT(byDeg(col, dd), dd === 2) : '0')}</div>`).join('')}
      <div></div>${[2, 1, 0].map((dd) => { const a = byDeg(O, dd), b2 = byDeg(col, dd), ok = (a ? a.c : 0) === (b2 ? b2.c : 0); return `<div class="u4l3-cmm ${ok ? 'ok' : 'no'}">${ok ? '✓' : '✗'}</div>`; }).join('')}`;
    cmp.querySelectorAll('.u4l3-cmm').forEach((e) => { hide(e); marks.push(e); });
    const same = marks.every((e) => e.classList.contains('ok'));
    const stamp = add(stage, h('div', 'u4l3-vst ' + (same ? 'ok' : 'no'), same ? 'equal ✓' : 'not equal ✗'), 600, 236); hide(stamp);
    const v1 = evalT(O, 2), v2 = (2 + m) * (2 + n);
    const sub = add(stage, h('div', 'u4l3-sub', `<b>At ${T('x=2')}:</b> ${K(`${d.o.replace(/x/g, '(2)')}=${v1}`)} &nbsp;&nbsp; ${K(`(2${sgn(m)})(2${sgn(n)})=${v2}`)} <span class="${v1 === v2 ? 'ok' : 'red'}">${v1 === v2 ? '✓ same' : '✗ different'}</span>`), 24, 342); hide(sub);
    const why = add(stage, h('div', 'u4l3-why ' + (same ? 'ok' : ''), d.fix ? `Fix: ${K(`${d.o}=${d.fix}`)}` : `${K(`${d.o}=${claim}`)} ✓`), 24, 392); hide(why);
    return [{
      cap: `Expand the right side with FOIL: ${T('x\\cdot x')}, ${T(`x\\cdot${par(n)}`)}, ${T(`${par(m)}\\cdot x`)}, ${T(`${par(m)}\\cdot${par(n)}`)}.`,
      run: (c) => Promise.all(cs.map((s, i) => showSpans(c, s, 300, i * 260)))
    }, {
      cap: `Collect the like terms: ${T(`${claim}=${polyT(col)}`)}.`,
      run: (c) => c.fadeIn(l2, 380)
    }, {
      cap: same ? `Compare term by term with ${T(d.o)}: every term matches. The two sides are <b>equal</b>.` : `Compare term by term with ${T(d.o)}. They don’t all match, so the factoring is <b>wrong</b>.`,
      run: async (c) => { await c.fadeIn(cmp, 300); for (const e of marks) await c.pop(e, 300); await stampIn(c, stamp); }
    }, {
      cap: `A quick second check: put ${T('x=2')} into both sides. ${v1 === v2 ? `Both give ${v1}.` : `${v1} and ${v2} are different numbers, so the two sides can’t be equal.`}`,
      run: (c) => c.fadeIn(sub, 380)
    }, {
      cap: d.why,
      run: (c) => c.fadeIn(why, 380)
    }];
  }
};

/* ============ static figures: the tile key ============ */
const TC = { k2: ['#3a9a90', '#0f5f5a'], k1: ['#e0a33a', '#a8650a'], k0: ['#6f8fc4', '#34507d'] };
function svgTile(x, y, w, hh, kind) {
  const [f, o] = TC[kind];
  return `<rect x="${x}" y="${y}" width="${w}" height="${hh}" rx="2" fill="${f}" stroke="${o}" stroke-width="1.5"/>`;
}
function mountFigures() {
  document.querySelectorAll('.u4l3-key').forEach((el) => {
    const t = (kind, w, hh) => `<svg width="${w + 4}" height="${hh + 4}" viewBox="0 0 ${w + 4} ${hh + 4}">${svgTile(2, 2, w, hh, kind)}</svg>`;
    const item = (kind, w, hh, lab) => `<div class="u4l3-ki">${t(kind, w, hh)}<div class="u4l3-kl">${K(lab)}</div></div>`;
    el.innerHTML = `<div class="u4l3-kh">Tile key</div><div class="u4l3-krow">
      ${item('k2', 64, 64, 'x^2')}${item('k1', 16, 64, 'x')}${item('k0', 16, 16, '1')}
      <div class="u4l3-kdim">${K('x^2')}-tile: ${K('x')} by ${K('x')} &nbsp;·&nbsp; ${K('x')}-tile: 1 by ${K('x')} &nbsp;·&nbsp; unit tile: 1 by 1</div></div>`;
  });
  document.querySelectorAll('.u4l3-dia').forEach((el) => {
    if (el.closest('.ex-stage')) return;
    const S = el.classList.contains('sm') ? 96 : el.classList.contains('md') ? 150 : el.classList.contains('lg') ? 150 : 132;
    const d = el.dataset;
    makeDiamond(el, S, { top: d.top, bot: d.bot, l: d.l, r: d.r, name: d.name, no: d.no });
    if (d.open) el.classList.add('open');
  });
}

/* ============ warm-up: diamond puzzles ============ */
function mountWarm() {
  const host = document.getElementById('wu');
  if (!host) return;
  const dias = [...host.querySelectorAll('.u4l3-dgrid .u4l3-dia')];
  dias.forEach((b) => b.addEventListener('click', () => b.classList.toggle('open')));
  /* an answer shown (its button, or ••• Show all answers) opens its diamonds; the poll's reveal opens the big one's */
  const watch = (el, cls, fn) => { fn(el.classList.contains(cls)); new MutationObserver(() => fn(el.classList.contains(cls))).observe(el, { attributes: true, attributeFilter: ['class'] }); };
  host.querySelectorAll('[data-wqd]').forEach((btn) => watch(btn.closest('.bk-wq'), 'shown', (on) => {
    if (on) btn.dataset.wqd.split('').forEach((n) => { const d = dias.find((e) => e.dataset.name === n); if (d) d.classList.add('open'); });
  }));
  const poll = host.querySelector('#wpoll');
  if (poll) watch(poll, 'revealed', (on) => poll.querySelectorAll('.u4l3-dia').forEach((d) => d.classList.toggle('open', on)));
  /* pairs that multiply to 24 */
  const cards = [...host.querySelectorAll('.u4l3-pc')];
  const setPc = (b, st) => { b.dataset.st = Math.max(Number(b.dataset.st || 0), st); };
  cards.forEach((b) => b.addEventListener('click', () => setPc(b, Math.min(2, Number(b.dataset.st || 0) + 1))));
  host.querySelectorAll('[data-pc]').forEach((b) => b.addEventListener('click', () => cards.forEach((e) => setPc(e, b.dataset.pc === 'all' ? 1 : 2))));
  /* make your own diamond */
  const mk = host.querySelector('#mkdia');
  if (mk) {
    const v = { l: 3, r: 6 };
    const D = makeDiamond(mk, 150, { top: 18, bot: 9, l: 3, r: 6 }); mk.classList.add('open');
    const draw = () => { D.set('top', v.l * v.r); D.set('bot', v.l + v.r); D.sides(v.l, v.r); host.querySelector('[data-mkv=l]').textContent = mns(v.l); host.querySelector('[data-mkv=r]').textContent = mns(v.r); };
    host.querySelectorAll('[data-mk]').forEach((b) => b.addEventListener('click', () => { const k = b.dataset.mk[0], d = b.dataset.mk[1] === '+' ? 1 : -1; v[k] = Math.max(-12, Math.min(12, v[k] + d)); draw(); }));
    draw();
  }
}

/* ============ wiring ============ */
function mountExplainers() {
  const defs = { tileRect, expandGrid, pairTable, diamond, signFlip, inspectB, errorCheck, inspectC };
  document.querySelectorAll('[data-explainer]').forEach((el) => new Explainer(el, defs[el.dataset.explainer]));
}

/* ============ Stand Up Break! — factor x² + bx + c (c > 0) at the whiteboards ============ */
function trin(a, b, c, v) { // a·v² + b·v + c as LaTeX
  const t = (k, s, first) => (k === 0 ? '' : (k < 0 ? '-' : first ? '' : '+') + (Math.abs(k) === 1 && s ? '' : Math.abs(k)) + s);
  return (t(a, v + '^2', true) + t(b, v) + t(c, '')) || '0';
}
const lin = (v, p) => '(' + v + (p < 0 ? '-' : '+') + Math.abs(p) + ')';
const sumProd = (b, c, p, q) => '\\text{product } {' + c + '},\\ \\text{sum } {' + b + '}:\\quad {' + p + '} \\text{ and } {' + q + '}';
function samePair(r, lo, hi, neg) { // two numbers with the same sign, smaller first by size
  const p = r.int(lo, hi), q = r.int(lo, hi), s = neg ? -1 : 1;
  return [Math.min(p, q) * s, Math.max(p, q) * s];
}
function plain(r, v, lo, hi, neg) { // v² + bv + c = (v + p)(v + q), c > 0
  const [p, q] = samePair(r, lo, hi, neg), b = p + q, c = p * q, Q = trin(1, b, c, v);
  return { q: Q, a: [sumProd(b, c, p, q), Q + '=' + lin(v, p) + lin(v, q)] };
}
standup('u4l3', {
  intro: 'Factor the trinomial at your whiteboard station. Check by expanding before you call it done.',
  levels: {
    BEG: (r) => plain(r, 'x', 1, 9, false),                                   // b and c both positive
    PRG: (r) => plain(r, r.pick(['x', 'x', 'x', 'a', 'n']), 1, 10, r.chance(0.6)), // b positive or negative, c positive
    MAS: (r) => {
      const v = r.pick(['x', 'x', 'y', 'm']);
      if (r.chance(0.3)) return plain(r, v, 4, 15, r.chance(0.5));           // bigger numbers: more pairs to search
      const k = r.pick([2, 3, 4, 5]), [p, q] = samePair(r, 1, 8, r.chance(0.5)), b = p + q, c = p * q; // a common factor first
      const Q = trin(k, k * b, k * c, v);
      return { q: Q, a: ['\\text{GCF } ' + k + ':\\quad ' + k + '(' + trin(1, b, c, v) + ')', sumProd(b, c, p, q), Q + '=' + k + lin(v, p) + lin(v, q)] };
    }
  }
});

mountFigures(); mountWarm(); mountExplainers();
