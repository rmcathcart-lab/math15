/* Math 15 · Unit 3 · Lesson 6 — Applying Polynomial Products to Area, Volume, and Equations.
 * The Open-Top Box warm-up, the example figures, the explainers and the Stand Up Break on this page.
 * The helpers (Poly, figure, board, …) and the box explainer are adapted from Math 10C 3.5 (same engine).
 * Term colours (every Unit 3 page): x³ purple, x² teal, x amber, 1 slate blue. */
import { h, Explainer } from '../explain.js';
import { tex } from '../tex.js';
import { standup } from '../standup.js';
import { fmt } from '../explain.js';

const at = (el, x, y) => { el.style.left = x + 'px'; el.style.top = y + 'px'; return el; };
const add = (stage, el, x, y) => { stage.appendChild(at(el, x, y)); return el; };
const hide = (...els) => els.forEach((e) => { if (e) e.style.opacity = 0; });
const svgEl = (tag, attrs = {}) => { const e = document.createElementNS('http://www.w3.org/2000/svg', tag); for (const k in attrs) e.setAttribute(k, attrs[k]); return e; };

/* KaTeX allowing \htmlClass (terms that light up and cancel) */
const K = (src, display) => {
  src = String(src).replace(/\u202f/g, '\\,'); // a thin space in 1 681 → 1\,681
  try { return window.katex.renderToString(src, { displayMode: !!display, throwOnError: false, strict: 'ignore', trust: true, output: 'html' }); }
  catch (e) { return tex(src, display); }
};
const T = (s) => tex(String(s).replace(/\u202f/g, '\\,')); // inline math in captions

/* Unit 3 tile colours: x² teal, x amber, 1 slate (x³ purple) */
const C3 = '#7b4fc4', C2 = '#0f7a74', C1 = '#b86e00', C0 = '#2f5fa8';

/* ================= polynomials (any number of letters) ================= */
const dsum = (e) => e.reduce((a, b) => a + b, 0);
const lex = (a, b) => { for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return a[i] - b[i]; return 0; };
const byDeg = (a, b) => dsum(b.e) - dsum(a.e) || lex(b.e, a.e); // x² before x before 1; p² before pq before q²
const keyE = (k) => k.split(',').map(Number);
class Poly {
  constructor(vars, m) { this.vars = vars; this.m = m || new Map(); }
  static parse(s, vars) {
    const p = new Poly(vars);
    String(s).replace(/\s+/g, '').replace(/−/g, '-').replace(/(?!^)([+-])/g, ' $1').split(' ').forEach((t) => {
      if (!t) return;
      const mm = t.match(/^([+-]?)(\d*\.?\d*)(.*)$/), e = vars.map(() => 0);
      mm[3].replace(/([a-z])(?:\^\{?(\d+)\}?)?/g, (_, v, n) => { const i = vars.indexOf(v); if (i < 0) throw new Error('unknown letter ' + v); e[i] += n ? Number(n) : 1; return ''; });
      p.addTerm(e, (mm[1] === '-' ? -1 : 1) * (mm[2] === '' ? 1 : Number(mm[2])));
    });
    return p;
  }
  addTerm(e, c) { const k = e.join(','), v = Math.round(((this.m.get(k) || 0) + c) * 1e9) / 1e9; if (v === 0) this.m.delete(k); else this.m.set(k, v); return this; }
  plus(o) { const r = new Poly(this.vars, new Map(this.m)); o.m.forEach((c, k) => r.addTerm(keyE(k), c)); return r; }
  scale(s) { const r = new Poly(this.vars); this.m.forEach((c, k) => r.addTerm(keyE(k), c * s)); return r; }
  minus(o) { return this.plus(o.scale(-1)); }
  times(o) { const r = new Poly(this.vars); this.m.forEach((a, ka) => o.m.forEach((b, kb) => { const eb = keyE(kb); r.addTerm(keyE(ka).map((n, i) => n + eb[i]), a * b); })); return r; }
  terms() { return [...this.m].map(([k, c]) => ({ e: keyE(k), c })).sort(byDeg); }
  coef(e) { return this.m.get(e.join(',')) || 0; }
  deg() { return this.m.size ? Math.max(...this.terms().map((t) => dsum(t.e))) : -1; }
  at(vals) { let s = 0; this.m.forEach((c, k) => { s += c * keyE(k).reduce((p, n, i) => p * vals[i] ** n, 1); }); return Math.round(s * 1e9) / 1e9; }
  only(d) { const r = new Poly(this.vars); this.m.forEach((c, k) => { if (dsum(keyE(k)) === d) r.addTerm(keyE(k), c); }); return r; }
  tex(o) { return listTex(this.terms(), this.vars, o); }
  isConst() { return this.deg() <= 0; }
}
const partials = (A, B) => { const out = []; A.terms().forEach((a) => B.terms().forEach((b) => out.push({ e: a.e.map((n, i) => n + b.e[i]), c: a.c * b.c }))); return out; };
const numT = (a) => (Number.isInteger(a) ? fmt(a).replace(/ /g, '\\,') : String(+a.toFixed(4)));
const nv = (a) => (Number.isInteger(a) ? fmt(a) : String(+a.toFixed(4))); // a number in a caption
function colOf(e) { const d = dsum(e); if (e.length > 1 && d === 2) return e[0] === 2 ? C2 : e[e.length - 1] === 2 ? C0 : C1; return [C0, C1, C2, C3][d] || '#1c2230'; }
/* terms → LaTeX. o.color: tile colours; o.lead: wrap the terms of this degree in \htmlClass{u3l6-lead} (they cancel later) */
function listTex(ts, vars, o = {}) {
  if (!ts.length) return '0';
  return ts.map((t, i) => {
    const a = Math.abs(t.c), mono = t.e.map((n, j) => (n ? vars[j] + (n > 1 ? `^{${n}}` : '') : '')).join('');
    const body = (mono && a === 1 ? '' : numT(a)) + mono, sign = t.c < 0 ? '-' : i ? '+' : '';
    const s = o.color ? `\\textcolor{${colOf(t.e)}}{${body}}` : body;
    if (o.lead != null && dsum(t.e) === o.lead) return `\\htmlClass{u3l6-lead}{${i ? '{}' : ''}${sign}${s}}`;
    return sign + s;
  }).join('');
}
const one = (c, e, vars) => listTex([{ c, e }], vars);
/* "6x² − x² = 5x², 23x − 3x = 20x, …" for a caption */
function likeCap(A, B, sgn) {
  const keys = [...new Set([...A.m.keys(), ...B.m.keys()])].map((k) => ({ e: keyE(k) })).sort(byDeg), V = A.vars;
  return keys.filter(({ e }) => A.coef(e) && B.coef(e)).map(({ e }) => {
    const a = A.coef(e), b = B.coef(e), r = a + sgn * b, bt = one(b, e, V);
    return T(`${one(a, e, V)}${sgn < 0 ? '-' : '+'}${b < 0 ? `(${bt})` : bt}=${r ? one(r, e, V) : '0'}`);
  }).join(', ');
}
const single = (s) => /^(\d+(\.\d+)?)?[a-z]?(\^\{?\d+\}?)?$/.test(s); // one positive term: 24, 2w, s^2
const isNum = (s) => /^\d+(\.\d+)?$/.test(s);
const br = (s) => (single(s) ? s : `(${s})`);
function prodT(f, g) {
  if (f === g) return `${br(f)}^{2}`;
  if (single(f) && single(g)) return `${f}\\times${g}`;
  if (isNum(g)) return `${g}(${f})`;
  if (isNum(f)) return `${f}(${g})`;
  return `(${f})(${g})`;
}
const brT = (P, o) => (P.m.size === 1 && P.terms()[0].c > 0 ? P.tex(o) : `(${P.tex(o)})`);
/* a polynomial with numbers put in: 5(2)^2+20(2)+18 */
function subT(P, vals) {
  return P.terms().map((t, i) => {
    const a = Math.abs(t.c), hasV = t.e.some((n) => n); let body = hasV && a === 1 ? '' : numT(a);
    t.e.forEach((n, j) => { if (n) body += `(${numT(vals[j])})` + (n > 1 ? `^{${n}}` : ''); });
    return (t.c < 0 ? '-' : i ? '+' : '') + body;
  }).join('');
}
/* "15x + 8x = 23x" for the like partial products */
function collectCap(ts, vars) {
  const groups = new Map(); ts.forEach((t) => { const k = t.e.join(','); if (!groups.has(k)) groups.set(k, []); groups.get(k).push(t); });
  return [...groups.values()].filter((g) => g.length > 1).map((g) => { const r = g.reduce((a, t) => a + t.c, 0); return T(listTex(g, vars) + '=' + (r ? one(r, g[0].e, vars) : '0')); }).join(', ');
}
const subCap = (P, vals) => T(`${subT(P, vals)}=${numT(P.at(vals))}`);

/* ================= drawing helpers ================= */
function stagePos(stage, el) { // element box in stage coordinates (the lesson may be scaled)
  const sr = stage.getBoundingClientRect(), k = sr.width / stage.offsetWidth || 1, r = el.getBoundingClientRect();
  return { x: (r.left + r.width / 2 - sr.left) / k, y: (r.top + r.height / 2 - sr.top) / k, l: (r.left - sr.left) / k, t: (r.top - sr.top) / k, r: (r.right - sr.left) / k, b: (r.bottom - sr.top) / k };
}
const ANCH = { a: ['-50%', '-100%', 0, -6], b: ['-50%', '0', 0, 6], l: ['-100%', '-50%', -10, 0], r: ['0', '-50%', 10, 0], c: ['-50%', '-50%', 0, 0] };
/* A figure in tikz-style units: x to the right, y UP, origin at (ox, oy) px in `host`. */
function figure(host, ox, oy, u) {
  const X = (x) => ox + x * u, Y = (y) => oy - y * u;
  let svg = null;
  const S = () => { if (!svg) { svg = svgEl('svg', { class: 'u3l6-svg' }); host.appendChild(svg); } return svg; };
  const pts = (p) => p.map(([x, y]) => X(x) + ',' + Y(y)).join(' ');
  const F = {
    X, Y, u,
    box: (x1, y1, x2, y2) => ({ l: X(x1), t: Y(y2), w: (x2 - x1) * u, h: (y2 - y1) * u }),
    rect(x1, y1, x2, y2, cls) { const d = h('div', 'u3l6-rect ' + (cls || '')), b = F.box(x1, y1, x2, y2); at(d, b.l, b.t); d.style.width = b.w + 'px'; d.style.height = b.h + 'px'; host.appendChild(d); return d; },
    path(p, cls, closed) { const e = svgEl(closed ? 'polygon' : 'polyline', { points: pts(p), class: cls || '' }); S().appendChild(e); return e; },
    line(x1, y1, x2, y2, cls) { const e = svgEl('line', { x1: X(x1), y1: Y(y1), x2: X(x2), y2: Y(y2), class: cls || '' }); S().appendChild(e); return e; },
    arrow(x1, y1, x2, y2, cls) { // double-headed dimension arrow
      const g = svgEl('g', { class: 'u3l6-arr ' + (cls || '') }), a = [X(x1), Y(y1)], b = [X(x2), Y(y2)], L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L, s = 8, w = 4.5;
      g.appendChild(svgEl('line', { x1: a[0] + ux * 3, y1: a[1] + uy * 3, x2: b[0] - ux * 3, y2: b[1] - uy * 3 }));
      const head = (p, d) => svgEl('polygon', { points: [[p[0], p[1]], [p[0] + d * ux * s - uy * w, p[1] + d * uy * s + ux * w], [p[0] + d * ux * s + uy * w, p[1] + d * uy * s - ux * w]].map((q) => q.join(',')).join(' ') });
      g.append(head(a, 1), head(b, -1)); S().appendChild(g); return g;
    },
    lab(x, y, src, an = 'c', cls = '') {
      const d = h('div', 'u3l6-lab ' + cls, K(src)), A = ANCH[an];
      at(d, X(x) + A[2], Y(y) + A[3]); d.style.translate = A[0] + ' ' + A[1]; host.appendChild(d); return d;
    }
  };
  return F;
}
/* written work: one LaTeX line per row */
function board(stage, o) {
  const rows = [];
  return {
    rows,
    line(src, p = {}) {
      const y = p.y != null ? p.y : o.y + rows.length * o.lh;
      const el = add(stage, h('div', 'u3l6-line' + (p.cls ? ' ' + p.cls : ''), K(src)), (p.x != null ? p.x : o.x) + (p.ind ? o.ind || 56 : 0), y); el.style.fontSize = (p.fs || o.fs) + 'px';
      hide(el); const r = { el, q: (s) => el.querySelector(s), qa: (s) => [...el.querySelectorAll(s)] }; rows.push(r); return r;
    },
    fit(maxR) { // a line that would run past maxR (a narrower stage) is set smaller, just enough to fit
      rows.forEach((r) => { const f = (maxR - r.el.offsetLeft) / (r.el.offsetWidth || 1); if (f < 1) r.el.style.fontSize = Math.floor(parseFloat(r.el.style.fontSize) * f * 10) / 10 + 'px'; });
    }
  };
}
const showRow = (c, row, delay = 0) => c.anim(row.el, [{ opacity: 0, transform: 'translateX(-10px)' }, { opacity: 1, transform: 'none' }], 420, { delay });
const fadeOut = (c, el, ms = 300) => c.anim(el, [{ opacity: getComputedStyle(el).opacity }, { opacity: 0 }], ms);
const glow = (c, el) => c.anim(el, [{ filter: 'drop-shadow(0 0 0 rgba(194,122,14,0))' }, { filter: 'drop-shadow(0 0 10px rgba(194,122,14,.9))', offset: 0.4 }, { filter: 'drop-shadow(0 0 0 rgba(194,122,14,0))' }], 900);
function tween(c, ms, fn) { // drive a redraw from 0 to 1 (eased); instant when replaying
  c.check();
  if (c.fast) { fn(1); return Promise.resolve(); }
  return new Promise((res, rej) => {
    const t0 = performance.now();
    const tick = (now) => { try { c.check(); } catch (e) { rej(e); return; } const t = Math.min(1, (now - t0) / ms); fn(1 - Math.pow(1 - t, 3)); if (t < 1) requestAnimationFrame(tick); else res(); };
    requestAnimationFrame(tick);
  });
}
/* the like terms that cancel: light them up, then strike them out */
async function cancelLeads(c, stage, row) {
  const els = row.qa('.u3l6-lead'); if (!els.length) return;
  els.forEach((e) => e.classList.add('lit'));
  await c.sleep(c.fast ? 0 : 500);
  const ss = els.map((el) => { const p = stagePos(stage, el), s = add(stage, h('div', 'u3l6-strike'), p.l - 3, p.y - 2); s.style.width = (p.r - p.l + 6) + 'px'; return s; });
  await Promise.all(ss.map((s, i) => c.anim(s, [{ transform: 'rotate(-14deg) scaleX(0)' }, { transform: 'rotate(-14deg) scaleX(1)' }], 380, { delay: i * 220 })));
  els.forEach((e) => e.classList.add('gone'));
}
const chkBox = (stage, x, y, w, html) => { const d = add(stage, h('div', 'u3l6-chk', html), x, y); d.style.width = w + 'px'; hide(d); return d; };
const swapLabs = (c, olds, news) => Promise.all([...olds.map((e) => fadeOut(c, e, 250)), ...news.map((e, i) => c.pop(e, 380, { delay: 200 + i * 90 }))]);

/* ============ 3b. Volume of a box: base × height ============ */
const BX = {
  a: { l: 'x+1', w: 'x+2', h: 'x+6', chk: 2 },
  c: { l: 'x+1', w: 'x+1', h: 'x+1', chk: 2, cube: true },
  ex2: { l: 'x+2', w: 'x+1', h: 'x+3', chk: 2 }
};
const box = {
  title: 'Volume = base area × height',
  height: 430,
  minW: 966, // drawn this wide and scaled to fit beside the sidebar
  value: 'a',
  choices: [{ v: 'a', label: tex('(x+1)(x+2)(x+6)') }, { v: 'c', label: 'a cube, ' + tex('(x+1)^3') }, { sep: 'Example 2 check:' }, { v: 'ex2', label: 'the crate' }],
  intro: (k) => { const S = BX[k]; return S.cube ? `A cube with edges ${T(`(${S.l})`)}: its volume is ${T(`(${S.l})^3=(${S.l})(${S.l})(${S.l})`)}. Three factors, so we multiply <b>twice</b>.` : `A box ${T(`(${S.l})`)} long, ${T(`(${S.w})`)} wide and ${T(`(${S.h})`)} high. Three factors, so we multiply <b>twice</b>.`; },
  make(stage, key) {
    const S = BX[key], V = ['x'], P = (s) => Poly.parse(s, V), Lp = P(S.l), Wp = P(S.w), Hp = P(S.h), xv = S.chk;
    const base = Lp.times(Wp), vol = base.times(Hp), lv = Lp.at([xv]), wv = Wp.at([xv]), hv = Hp.at([xv]);
    const u = Math.min(300 / (lv + 0.55 * wv), 280 / (hv + 0.45 * wv)), Lw = lv * u, dx = 0.55 * wv * u, dy = 0.45 * wv * u, Hh = hv * u;
    const x0 = 64 + (316 - Lw - dx) / 2, y0 = 60 + dy + Hh + (280 - Hh - dy) / 2;
    const svg = add(stage, svgEl('svg', { class: 'u3l6-svg u3l6-box' }), 0, 0);
    const mk = (cls) => { const p = svgEl('polygon', { class: cls }); svg.appendChild(p); return p; };
    const front = mk('f-front'), side = mk('f-side'), top = mk('f-top');
    const hid = svgEl('polyline', { class: 'u3l6-hid' }); svg.appendChild(hid);
    const P2 = (pts) => pts.map((p) => p.join(',')).join(' ');
    const draw = (t) => {
      const hh = Hh * t;
      front.setAttribute('points', P2([[x0, y0], [x0 + Lw, y0], [x0 + Lw, y0 - hh], [x0, y0 - hh]]));
      side.setAttribute('points', P2([[x0 + Lw, y0], [x0 + Lw + dx, y0 - dy], [x0 + Lw + dx, y0 - dy - hh], [x0 + Lw, y0 - hh]]));
      top.setAttribute('points', P2([[x0, y0 - hh], [x0 + Lw, y0 - hh], [x0 + Lw + dx, y0 - dy - hh], [x0 + dx, y0 - dy - hh]]));
      hid.setAttribute('points', P2([[x0, y0], [x0 + dx, y0 - dy], [x0 + Lw + dx, y0 - dy], [x0 + dx, y0 - dy], [x0 + dx, y0 - dy - hh]]));
      hid.style.opacity = t > 0.02 ? 1 : 0; front.style.opacity = side.style.opacity = t > 0.02 ? 1 : 0;
      top.classList.toggle('base', t < 0.02);
    };
    draw(0);
    const lab = (x, y, src, an, cls) => { const d = add(stage, h('div', 'u3l6-lab ' + (cls || ''), K(src)), x + ANCH[an][2], y + ANCH[an][3]); d.style.translate = ANCH[an][0] + ' ' + ANCH[an][1]; return d; };
    const lL = lab(x0 + Lw / 2, y0, S.l, 'b'), lW = lab(x0 + Lw + dx / 2 + 4, y0 - dy / 2 + 14, S.w, 'r'), lH = lab(x0, y0 - Hh / 2, S.h, 'l'); hide(lH);
    const nL = lab(x0 + Lw / 2, y0, nv(lv), 'b', 'num'), nW = lab(x0 + Lw + dx / 2 + 4, y0 - dy / 2 + 14, nv(wv), 'r', 'num'), nH = lab(x0, y0 - Hh / 2, nv(hv), 'l', 'num'); hide(nL, nW, nH);
    const bl = lab(x0 + Lw / 2 + dx / 2, y0 - dy / 2, '\\text{base}', 'c', 'tag'); hide(bl);
    const B = board(stage, { x: 430, y: 18, lh: 54, fs: 25, ind: 30 });
    const pv = partials(base, Hp);
    const r1 = B.line(`\\text{Base}=${prodT(S.l, S.w)}=${base.tex({ color: 1 })}`), r2 = B.line(`V=\\text{base}\\times\\text{height}=(${base.tex({ color: 1 })})(${S.h})`);
    const r3 = B.line(`=${listTex(pv, V, { color: 1 })}`, { ind: 1 }), r4 = B.line(`=${vol.tex({ color: 1 })}`, { ind: 1, cls: 'u3l6-res' });
    const chk = chkBox(stage, 430, 300, 520, `<b>Check at ${T(`x=${xv}`)}:</b> the box is ${T(`${nv(lv)}\\times${nv(wv)}\\times${nv(hv)}=${nv(lv * wv * hv)}`)}<br>${subCap(vol, [xv])} <b class="ok">✓</b>`);
    return [{
      cap: `Start with the <b>base</b>, a rectangle ${T(`(${S.l})`)} by ${T(`(${S.w})`)}: ${T(`${prodT(S.l, S.w)}=${listTex(partials(Lp, Wp), V)}=${base.tex()}`)}.`,
      run: (c) => Promise.all([c.pop(bl, 380), glow(c, top), showRow(c, r1, 150)])
    }, {
      cap: `Stack the base up to a height of ${T(`(${S.h})`)}. Volume = <b>base × height</b>: a trinomial times a binomial.`,
      run: async (c) => { await c.anim(bl, [{ opacity: 1 }, { opacity: 0 }], 200); await Promise.all([tween(c, 1000, draw), c.fadeIn(lH, 300, { delay: 700 }), showRow(c, r2, 300)]); }
    }, {
      cap: `Every term of the trinomial times every term of the binomial: ${base.m.size} × ${Hp.m.size} = <b>${pv.length} partial products</b>.`,
      run: (c) => showRow(c, r3)
    }, {
      cap: `Collect the like terms (same colour): ${collectCap(pv, V)}. ${T(`V=${vol.tex()}`)}${S.cube ? ', the cube of a binomial' : ''}.`,
      run: (c) => c.pop(r4.el, 450)
    }, {
      cap: `<b>Check at ${T(`x=${xv}`)}</b>: the box is ${nv(lv)} by ${nv(wv)} by ${nv(hv)}, so ${T(`V=${nv(lv * wv * hv)}`)}. The polynomial gives ${T(`${subT(vol, [xv])}=${nv(vol.at([xv]))}`)} ✓`,
      run: (c) => Promise.all([swapLabs(c, [lL, lW, lH], [nL, nW, nH]), c.fadeIn(chk, 400, { delay: 300 })])
    }];
  }
};

const NUM = (s) => K(String(s)); // a number label

/* ============ 2. Area of a rectangle: four pieces, collect, then a number ============ */
const AR = {
  n1: { p: 5, q: 3, xv: 2, unit: 'm' },
  ex1: { p: 6, q: 2, xv: 3, unit: 'm' }
};
const area = {
  title: 'Area = length × width, four pieces at a time',
  height: 440,
  minW: 900,
  value: 'n1',
  choices: [{ v: 'n1', label: 'A patio ' + tex('(x+5)(x+3)') }, { sep: 'Example 1 check:' }, { v: 'ex1', label: 'the garden' }],
  intro: (k) => { const S = AR[k]; return `A rectangle is ${T(`(x+${S.p})`)} ${S.unit} long and ${T(`(x+${S.q})`)} ${S.unit} wide. Write its area as a trinomial, then find the area when ${T(`x=${S.xv}`)}.`; },
  make(stage, key, ex) {
    const W = ex.W, S = AR[key], { p, q, xv } = S, V = ['x'], P = (s) => Poly.parse(s, V);
    const Lp = P(`x+${p}`), Wp = P(`x+${q}`), A = Lp.times(Wp), L = xv + p, Wd = xv + q;
    const u = Math.min(380 / L, 250 / Wd), F = figure(stage, 70, 66 + Wd * u, u);
    // y up in figure units: the width runs downward on screen from the top edge, so build the rows from the top
    const rows = [[Wd - xv, Wd, 'x'], [0, Wd - xv, String(q)]], cols = [[0, xv, 'x'], [xv, L, String(p)]];
    const cells = [];
    rows.forEach(([y1, y2, rl], ri) => cols.forEach(([x1, x2, cl], ci) => {
      const t = Poly.parse(rl, V).times(Poly.parse(cl, V)), e = t.terms()[0], deg = dsum(e.e);
      const r = F.rect(x1, y1, x2, y2, 'piece'); r.style.background = ['#e6eefa', '#fff1d6', '#dff2ef'][deg]; r.style.opacity = 0;
      const lb = F.lab((x1 + x2) / 2, (y1 + y2) / 2, `\\textcolor{${colOf(e.e)}}{${t.tex()}}`, 'c', 'cell'); hide(lb);
      cells.push({ r, lb, t, ri, ci });
    }));
    F.rect(0, 0, L, Wd, 'outline');
    const sub = [F.lab(xv / 2, Wd, 'x', 'a', 'sm'), F.lab(xv + p / 2, Wd, String(p), 'a', 'sm'), F.lab(L, Wd - xv / 2, 'x', 'r', 'sm'), F.lab(L, (Wd - xv) / 2, String(q), 'r', 'sm')]; hide(...sub);
    const cuts = [F.line(xv, 0, xv, Wd, 'u3l6-cutl'), F.line(0, Wd - xv, L, Wd - xv, 'u3l6-cutl')]; hide(...cuts);
    const labs = [F.lab(L / 2, 0, `x+${p}`, 'b'), F.lab(0, Wd / 2, `x+${q}`, 'l')];
    const nums = [F.lab(L / 2, 0, nv(L), 'b', 'num'), F.lab(0, Wd / 2, nv(Wd), 'l', 'num')]; hide(...nums);
    const pt = partials(Lp, Wp);
    const B = board(stage, { x: 540, y: 26, lh: 58, fs: 25, ind: 30 });
    const r1 = B.line(`A=(x+${p})(x+${q})`), r2 = B.line(`=${listTex([pt[0], pt[1], pt[2], pt[3]], V, { color: 1 })}`, { ind: 1 });
    const r3 = B.line(`A=${A.tex({ color: 1 })}`, { cls: 'u3l6-res' });
    const vals = A.terms().map((t) => t.c * xv ** dsum(t.e)), tot = A.at([xv]);
    const r4 = B.line(`A=${subT(A, [xv])}`), r5 = B.line(`=${vals.map(numT).join('+')}=\\boldsymbol{${numT(tot)}}`, { ind: 1 });
    B.fit(W - 10);
    const chk = chkBox(stage, 540, 360, W - 556, `<b>Check with the sides:</b> ${T(`${nv(L)}\\times${nv(Wd)}=${nv(L * Wd)}`)} ${S.unit}² <b class="ok">✓</b>`);
    return [{
      cap: `Area = length × width: ${T(`A=(x+${p})(x+${q})`)}. Two binomials, so <b>FOIL</b>.`,
      run: (c) => showRow(c, r1)
    }, {
      cap: `Split each side: ${T('x')} and ${T(String(p))} along the length, ${T('x')} and ${T(String(q))} along the width. That cuts the rectangle into <b>four</b> pieces.`,
      run: (c) => Promise.all([...cuts.map((e) => c.fadeIn(e, 400, { from: 'none' })), ...sub.map((e, i) => c.pop(e, 320, { delay: 200 + i * 100 }))])
    }, {
      cap: `Each piece is one FOIL product: ${pt.map((t) => T(one(t.c, t.e, V))).join(', ')}.`,
      run: (c) => Promise.all([...cells.map((cl, i) => Promise.all([c.anim(cl.r, [{ opacity: 0 }, { opacity: 1 }], 350, { delay: i * 220 }), c.pop(cl.lb, 340, { delay: i * 220 + 120 })])), showRow(c, r2, 600)])
    }, {
      cap: `Collect the like terms: ${collectCap(pt, V)}. The area is ${T(`A=${A.tex()}`)} ${S.unit}².`,
      run: (c) => c.pop(r3.el, 420)
    }, {
      cap: `Now put ${T(`x=${xv}`)} into the trinomial: ${T(`${subT(A, [xv])}=${vals.map(numT).join('+')}=${numT(tot)}`)} ${S.unit}².`,
      run: async (c) => { await showRow(c, r4); await showRow(c, r5); }
    }, {
      cap: `<b>Check</b> with the real sides: ${T(`x+${p}=${L}`)} and ${T(`x+${q}=${Wd}`)}, so ${T(`${L}\\times${Wd}=${L * Wd}`)} ✓. The same number.`,
      run: (c) => Promise.all([swapLabs(c, [...labs, ...sub], nums), c.fadeIn(chk, 400, { delay: 300 })])
    }];
  }
};

/* ============ 2b. A piece cut out: whole − piece ============ */
const CO = {
  lawn: { W: 'x+7', H: 'x+5', w: 'x+1', hh: 'x+1', pos: 'corner', xv: 3, n: ['Lawn', 'Flower bed', 'Grass left'], unit: 'm' },
  path: { W: 'x+6', H: 'x+4', w: 'x+4', hh: 'x+2', pos: 'centre', xv: 2, n: ['Garden + path', 'Garden', 'Path'], unit: 'm' }
};
const cutout = {
  title: 'Area left = whole − piece',
  height: 450,
  minW: 900,
  value: 'lawn',
  choices: [{ v: 'lawn', label: 'A lawn with a square bed' }, { v: 'path', label: 'A path around a garden' }],
  intro: (k) => { const S = CO[k]; return k === 'lawn' ? `A lawn is ${T(`(${S.W})`)} m by ${T(`(${S.H})`)} m. A square flower bed ${T(`(${S.w})`)} m on a side is cut out of one corner. How much grass is left?` : `A garden ${T(`(${S.w})`)} m by ${T(`(${S.hh})`)} m has a path around it. With the path, the outside is ${T(`(${S.W})`)} m by ${T(`(${S.H})`)} m. What is the area of the path?`; },
  make(stage, key, ex) {
    const W = ex.W, S = CO[key], V = ['x'], P = (s) => Poly.parse(s, V), xv = [S.xv];
    const Wp = P(S.W), Hp = P(S.H), wp = P(S.w), hp = P(S.hh), whole = Wp.times(Hp), piece = wp.times(hp), left = whole.minus(piece);
    const Wv = Wp.at(xv), Hv = Hp.at(xv), wv = wp.at(xv), hv = hp.at(xv), u = Math.min(370 / Wv, 270 / Hv);
    const F = figure(stage, 84, 60 + Hv * u, u);
    const big = F.rect(0, 0, Wv, Hv, key === 'lawn' ? 'grass' : 'path');
    const [px, py] = S.pos === 'corner' ? [Wv - wv, Hv - hv] : [(Wv - wv) / 2, (Hv - hv) / 2];
    const pc = F.rect(px, py, px + wv, py + hv, key === 'lawn' ? 'bed' : 'garden');
    const labs = [F.lab(Wv / 2, 0, S.W, 'b'), F.lab(0, Hv / 2, S.H, 'l'),
      S.pos === 'corner' ? F.lab(px + wv / 2, py, S.w, 'b', 'sm in') : F.lab(px + wv / 2, py, S.w, 'a', 'sm in'),
      S.pos === 'corner' ? F.lab(px, py + hv / 2, S.hh, 'l', 'sm in') : F.lab(px, py + hv / 2, S.hh, 'r', 'sm in')];
    const nums = [F.lab(Wv / 2, 0, nv(Wv), 'b', 'num'), F.lab(0, Hv / 2, nv(Hv), 'l', 'num'),
      S.pos === 'corner' ? F.lab(px + wv / 2, py, nv(wv), 'b', 'num sm') : F.lab(px + wv / 2, py, nv(wv), 'a', 'num sm'),
      S.pos === 'corner' ? F.lab(px, py + hv / 2, nv(hv), 'l', 'num sm') : F.lab(px, py + hv / 2, nv(hv), 'r', 'num sm')]; hide(...nums);
    const B = board(stage, { x: 500, y: 20, lh: 56, fs: 23, ind: 30 });
    const pW = partials(Wp, Hp), pP = partials(wp, hp), sq = S.w === S.hh;
    const r1 = B.line(`\\text{${S.n[0]}}=${prodT(S.W, S.H)}=${whole.tex({ color: 1 })}`);
    const r2 = B.line(`\\text{${S.n[1]}}=${prodT(S.w, S.hh)}=${piece.tex({ color: 1 })}`);
    const r3 = B.line(`\\text{${S.n[2]}}=(${whole.tex({ color: 1, lead: 2 })})-(${piece.tex({ color: 1, lead: 2 })})`);
    const r4 = B.line(`=${left.tex({ color: 1 })}`, { ind: 1, cls: 'u3l6-res' });
    B.fit(W - 10);
    const lv = left.at(xv);
    const chk = chkBox(stage, 500, 300, W - 516, `<b>Check at ${T(`x=${S.xv}`)}:</b> ${T(`${nv(Wv)}\\times${nv(Hv)}-${nv(wv)}\\times${nv(hv)}=${nv(Wv * Hv)}-${nv(wv * hv)}=${nv(lv)}`)} ${S.unit}²<br>Polynomial: ${subCap(left, xv)} <b class="ok">✓</b>`);
    return [{
      cap: `The whole ${S.n[0].toLowerCase()}: ${T(`${prodT(S.W, S.H)}=${listTex(pW, V)}=${whole.tex()}`)}.`,
      run: (c) => Promise.all([glow(c, big), showRow(c, r1, 150)])
    }, {
      cap: `The ${S.n[1].toLowerCase()}: ${T(`${prodT(S.w, S.hh)}=${listTex(pP, V)}=${piece.tex()}`)}.` + (sq ? ' A square: a perfect square trinomial.' : ''),
      run: (c) => Promise.all([glow(c, pc), showRow(c, r2, 150)])
    }, {
      cap: `${S.n[2]} = whole − piece. Keep the piece in <b>brackets</b>: the minus sign belongs to <b>every</b> term.`,
      run: (c) => Promise.all([key === 'lawn' ? c.anim(pc, [{ opacity: 1, transform: 'none' }, { opacity: 0.25, transform: 'translate(18px,-18px)' }], 700) : c.anim(pc, [{ opacity: 1 }, { opacity: 0.25 }], 700), showRow(c, r3, 250)])
    }, {
      cap: `${T('x^2-x^2=0')}: the ${T('x^2')} terms <b>cancel</b>. Then ${likeCap(whole.minus(whole.only(2)), piece.minus(piece.only(2)), -1)}. ${S.n[2]}: ${T(left.tex())} ${S.unit}².`,
      run: async (c) => { await cancelLeads(c, stage, r3); await c.pop(r4.el, 420); }
    }, {
      cap: `<b>Check at ${T(`x=${S.xv}`)}</b>: the real sizes give ${T(`${nv(Wv * Hv)}-${nv(wv * hv)}=${nv(lv)}`)}, and ${T(subT(left, xv))} gives ${nv(lv)} too ✓.`,
      run: (c) => Promise.all([swapLabs(c, labs, nums), c.fadeIn(chk, 400, { delay: 300 })])
    }];
  }
};

/* ============ 3b. The warm-up box: V = x(12 − 2x)² ============ */
const OB = [1, 2, 3, 4, 5, 6].map((x) => ({ x, v: x * (12 - 2 * x) ** 2 }));
const openbox = {
  title: 'The open-top box as a polynomial',
  height: 470,
  minW: 900,
  intro: `A ${T('12')} cm by ${T('12')} cm sheet, a square of side ${T('x')} cut from each corner. Write the volume of the box as a polynomial.`,
  make(stage, key, ex) {
    const W = ex.W, s = 19, c0 = 2.4, x0 = 40, y0 = 50, L = 12 * s, cs = c0 * s;
    const svg = add(stage, svgEl('svg', { class: 'u3l6-svg', width: 300, height: 330 }), 0, 0);
    const P2 = (pts) => pts.map((p) => p.join(',')).join(' ');
    svg.appendChild(svgEl('polygon', { class: 'u3l6-sheet', points: P2([[x0 + cs, y0], [x0 + L - cs, y0], [x0 + L - cs, y0 + cs], [x0 + L, y0 + cs], [x0 + L, y0 + L - cs], [x0 + L - cs, y0 + L - cs], [x0 + L - cs, y0 + L], [x0 + cs, y0 + L], [x0 + cs, y0 + L - cs], [x0, y0 + L - cs], [x0, y0 + cs], [x0 + cs, y0 + cs]]) }));
    [[0, 0], [L - cs, 0], [0, L - cs], [L - cs, L - cs]].forEach(([a, b]) => svg.appendChild(svgEl('rect', { class: 'u3l6-cutsq', x: x0 + a, y: y0 + b, width: cs, height: cs })));
    svg.appendChild(svgEl('rect', { class: 'u3l6-fold', x: x0 + cs, y: y0 + cs, width: L - 2 * cs, height: L - 2 * cs }));
    const lab = (x, y, src, cls = '') => add(stage, h('div', 'u3l6-lab c ' + cls, K(src)), x, y);
    lab(x0 + L / 2, y0 - 18, '12');
    const cx = [lab(x0 + cs / 2, y0 + cs / 2, 'x', 'sm red'), lab(x0 + L - cs / 2, y0 + cs / 2, 'x', 'sm red'), lab(x0 + cs / 2, y0 + L - cs / 2, 'x', 'sm red'), lab(x0 + L - cs / 2, y0 + L - cs / 2, 'x', 'sm red')];
    const dimL = lab(x0 + L / 2, y0 + L + 22, '12-2x', 'der'), dimH = lab(x0 + L / 2, y0 + L / 2, '\\text{base}', 'in');
    hide(dimL, dimH);
    const B = board(stage, { x: 320, y: 18, lh: 54, fs: 24, ind: 30 });
    const r1 = B.line('\\text{length}=\\text{width}=12-2x,\\quad\\text{height}=x');
    const r2 = B.line('V=x(12-2x)^2');
    const r3 = B.line('(12-2x)^2=144-48x+4x^2');
    const r4 = B.line('V=x(144-48x+4x^2)=144x-48x^2+4x^3');
    const r5 = B.line(`V=\\textcolor{${C3}}{4x^3}-\\textcolor{${C2}}{48x^2}+\\textcolor{${C1}}{144x}`, { cls: 'u3l6-res', ind: 1 });
    B.fit(W - 10);
    // the table as bars
    const bx = 320, by = 440, bw = 70, gap = 26, hmax = 110, vmax = 128;
    const bars = OB.map((o, i) => {
      const x = bx + i * (bw + gap), hh = (o.v / vmax) * hmax;
      const b = add(stage, h('div', 'u3l6-bar' + (o.x === 2 ? ' win' : '')), x, by - hh); b.style.width = bw + 'px'; b.style.height = Math.max(hh, 2) + 'px'; b.style.transformOrigin = 'bottom';
      const v = add(stage, h('div', 'u3l6-barv c', K(String(o.v))), x + bw / 2, by - hh - 16), xl = add(stage, h('div', 'u3l6-barx c', K(`x=${o.x}`)), x + bw / 2, by + 16);
      hide(b, v, xl); return { b, v, xl };
    });
    const tc = add(stage, h('div', 'u3l6-barh', 'Volume (cm³) for each cut'), bx, by - hmax - 50); hide(tc);
    return [{
      cap: `A square is cut from <b>both</b> ends of every side, so each side loses ${T('x')} twice: length ${T('=12-2x')}, width ${T('=12-2x')}. The flaps fold up, so the height is ${T('x')}.`,
      run: (c) => Promise.all([...cx.map((e, i) => c.pop(e, 300, { delay: i * 90 })), c.pop(dimL, 380, { delay: 300 }), c.fadeIn(dimH, 300, { delay: 400 }), showRow(c, r1, 300)])
    }, {
      cap: `Volume = length × width × height: ${T('V=(12-2x)(12-2x)(x)=x(12-2x)^2')}.`,
      run: (c) => showRow(c, r2)
    }, {
      cap: `The <b>perfect square</b> first (Lesson 4): ${T('(12-2x)^2=12^2-2(12)(2x)+(2x)^2=144-48x+4x^2')}.`,
      run: (c) => showRow(c, r3)
    }, {
      cap: `Then the <b>monomial × trinomial</b> (Lesson 2): ${T('x')} times every term. In order from the highest power: ${T('V=4x^3-48x^2+144x')}.`,
      run: async (c) => { await showRow(c, r4); await c.pop(r5.el, 420); }
    }, {
      cap: `Evaluate it for every cut: ${OB.map((o) => T(`${o.x}\\to${o.v}`)).join(', ')}. That’s the warm-up table!`,
      run: (c) => Promise.all([c.fadeIn(tc, 300), ...bars.map((o, i) => Promise.all([c.anim(o.b, [{ opacity: 0, transform: 'scaleY(0)' }, { opacity: 1, transform: 'scaleY(1)' }], 450, { delay: i * 160 }), c.fadeIn(o.xl, 250, { delay: i * 160 }), c.pop(o.v, 300, { delay: i * 160 + 300 })]))])
    }, {
      cap: `Check the winner, ${T('x=2')}: ${T('4(8)-48(4)+144(2)=32-192+288=128')} cm³ ✓. The volume climbs, peaks at a cut of 2 cm, then falls to 0.`,
      run: (c) => glow(c, bars[1].b)
    }];
  }
};

/* ============ 4. Equal areas: the x² terms cancel ============ */
const EQ = {
  n1: { A: [2, 10], B: [4, 7], n: ['Rectangle A', 'Rectangle B'], unit: '' },
  ex3: { A: [2, 9], B: [1, 11], n: ['Plot A', 'Plot B'], unit: 'm' }
};
const equal = {
  title: 'Equal areas: expand, cancel, solve',
  height: 470,
  minW: 900,
  value: 'n1',
  choices: [{ v: 'n1', label: tex('(x+2)(x+10)=(x+4)(x+7)') }, { sep: 'Example 3 check:' }, { v: 'ex3', label: 'Plot A and Plot B' }],
  intro: (k) => { const S = EQ[k]; return `${S.n[0]} is ${T(`(x+${S.A[0]})`)} by ${T(`(x+${S.A[1]})`)}. ${S.n[1]} is ${T(`(x+${S.B[0]})`)} by ${T(`(x+${S.B[1]})`)}. They have the <b>same area</b>. Find ${T('x')}.`; },
  make(stage, key, ex) {
    const W = ex.W, S = EQ[key], V = ['x'], P = (s) => Poly.parse(s, V);
    const [a, b] = S.A, [c1, d1] = S.B, LA = P(`x+${a}`).times(P(`x+${b}`)), LB = P(`x+${c1}`).times(P(`x+${d1}`));
    const s1 = a + b, p1 = a * b, s2 = c1 + d1, p2 = c1 * d1;
    const k = Math.abs(s2 - s1), rhs = s2 > s1 ? p1 - p2 : p2 - p1, sol = rhs / k;
    // the two rectangles, drawn to scale at the answer
    const Av = [sol + a, sol + b], Bv = [sol + c1, sol + d1], u = Math.min(300 / Math.max(Av[1], Bv[1]), 300 / (Av[0] + Bv[0]));
    const FA = figure(stage, 70, 40 + Av[0] * u, u), FB = figure(stage, 70, 40 + Av[0] * u + 58 + Bv[0] * u, u);
    FA.rect(0, 0, Av[1], Av[0], 'plotA'); FB.rect(0, 0, Bv[1], Bv[0], 'plotB');
    const tA = FA.lab(Av[1] / 2, Av[0] / 2, `\\text{${S.n[0]}}`, 'c', 'in'), tB = FB.lab(Bv[1] / 2, Bv[0] / 2, `\\text{${S.n[1]}}`, 'c', 'in'); void tA; void tB;
    const labs = [FA.lab(Av[1] / 2, 0, `x+${b}`, 'b', 'sm'), FA.lab(0, Av[0] / 2, `x+${a}`, 'l', 'sm'), FB.lab(Bv[1] / 2, 0, `x+${d1}`, 'b', 'sm'), FB.lab(0, Bv[0] / 2, `x+${c1}`, 'l', 'sm')];
    const nums = [FA.lab(Av[1] / 2, 0, nv(Av[1]), 'b', 'num sm'), FA.lab(0, Av[0] / 2, nv(Av[0]), 'l', 'num sm'), FB.lab(Bv[1] / 2, 0, nv(Bv[1]), 'b', 'num sm'), FB.lab(0, Bv[0] / 2, nv(Bv[0]), 'l', 'num sm')]; hide(...nums);
    const B = board(stage, { x: 420, y: 18, lh: 56, fs: 25, ind: 0 });
    const r0 = B.line(`(x+${a})(x+${b})=(x+${c1})(x+${d1})`);
    const r1 = B.line(`${listTex(partials(P(`x+${a}`), P(`x+${b}`)), V, { color: 1 })}=${listTex(partials(P(`x+${c1}`), P(`x+${d1}`)), V, { color: 1 })}`);
    const r2 = B.line(`${LA.tex({ color: 1, lead: 2 })}=${LB.tex({ color: 1, lead: 2 })}`);
    const r3 = B.line(`${one(s1, [1], V)}+${p1}=${one(s2, [1], V)}+${p2}`);
    const mv = s2 > s1 ? `${p1}-${p2}=${one(s2, [1], V)}-${one(s1, [1], V)}` : `${one(s1, [1], V)}-${one(s2, [1], V)}=${p2}-${p1}`;
    const r4 = B.line(mv);
    const r5 = k === 1 ? null : B.line(s2 > s1 ? `${rhs}=${k}x` : `${k}x=${rhs}`);
    const r6 = B.line(`x=${nv(sol)}`, { cls: 'u3l6-res' });
    B.fit(W - 10);
    const aA = Av[0] * Av[1], aB = Bv[0] * Bv[1], un = S.unit ? ' ' + S.unit + '²' : ' square units';
    const chk = chkBox(stage, 420, 392, W - 436, `<b>Check:</b> ${S.n[0]} ${T(`${nv(Av[0])}\\times${nv(Av[1])}=${nv(aA)}`)}, ${S.n[1]} ${T(`${nv(Bv[0])}\\times${nv(Bv[1])}=${nv(aB)}`)}${un} <b class="ok">✓</b>`);
    return [{
      cap: `The areas are equal, so write <b>area A = area B</b>: ${T(`(x+${a})(x+${b})=(x+${c1})(x+${d1})`)}.`,
      run: (c) => showRow(c, r0)
    }, {
      cap: `<b>Expand</b> each side with FOIL: four products on each side.`,
      run: (c) => showRow(c, r1)
    }, {
      cap: `Collect each side: ${T(`${LA.tex()}=${LB.tex()}`)}.`,
      run: (c) => showRow(c, r2)
    }, {
      cap: `Both sides have one ${T('x^2')}. Subtract ${T('x^2')} from both sides: the ${T('x^2')} terms <b>cancel</b>. A simple linear equation is left.`,
      run: async (c) => { await cancelLeads(c, stage, r2); await showRow(c, r3); }
    }, {
      cap: `Solve: move the ${T('x')} terms to one side and the numbers to the other. ${T(mv)}, so ${T(`x=${nv(sol)}`)}.`,
      run: async (c) => { await showRow(c, r4); if (r5) await showRow(c, r5); await c.pop(r6.el, 420); }
    }, {
      cap: `<b>Check</b> with real sizes: ${S.n[0]} is ${nv(Av[0])} by ${nv(Av[1])}, ${S.n[1]} is ${nv(Bv[0])} by ${nv(Bv[1])}. Both have area <b>${nv(aA)}</b>${S.unit ? ' ' + S.unit + '²' : ''} ✓.`,
      run: (c) => Promise.all([swapLabs(c, labs, nums), c.fadeIn(chk, 400, { delay: 300 })])
    }];
  }
};

/* ============ 5. The multi-step tank: base, volume, lid, numbers ============ */
const TK = {
  n1: { l: 6, w: 2, h: 1, add: 2, xv: 2, unit: 'cm', what: 'storage bin' },
  ex4: { l: 4, w: 1, h: 2, add: 2, xv: 6, unit: 'cm', what: 'fish tank' }
};
const tank = {
  title: 'Base, volume, lid: one step at a time',
  height: 520,
  minW: 940,
  value: 'n1',
  choices: [{ v: 'n1', label: 'A storage bin' }, { sep: 'Example 4 check:' }, { v: 'ex4', label: 'the fish tank' }],
  intro: (k) => { const S = TK[k]; return `A ${S.what}: base ${T(`(x+${S.l})`)} by ${T(`(x+${S.w})`)}, height ${T(`(x+${S.h})`)}. Its lid is ${S.add} ${S.unit} longer and ${S.add} ${S.unit} wider than the base.`; },
  make(stage, key, ex) {
    const W = ex.W, S = TK[key], V = ['x'], P = (s) => Poly.parse(s, V), xv = S.xv;
    const Lp = P(`x+${S.l}`), Wp = P(`x+${S.w}`), Hp = P(`x+${S.h}`), base = Lp.times(Wp), vol = base.times(Hp);
    const lL = S.l + S.add, lW = S.w + S.add, lid = P(`x+${lL}`).times(P(`x+${lW}`));
    const lv = xv + S.l, wv = xv + S.w, hv = xv + S.h;
    const KX = 0.55, KY = 0.4, u = Math.min(290 / (lv + S.add + (wv + S.add) * KX), 330 / (hv + (wv + S.add) * KY + 2.6));
    const th = (hv + (wv + S.add) * KY + 2.6) * u, ox = 74, oy = 50 + th + (400 - th) / 2;
    const Pt = (a, b, c) => [ox + (a + b * KX) * u, oy - (c + b * KY) * u];
    const pts = (arr) => arr.map((t) => Pt(...t).map((n) => n.toFixed(1)).join(',')).join(' ');
    const svg = add(stage, svgEl('svg', { class: 'u3l6-svg', width: 380, height: 520 }), 0, 0);
    const poly = (cls, arr) => { const p = svgEl('polygon', { class: cls, points: pts(arr) }); svg.appendChild(p); return p; };
    poly('t-front', [[0, 0, 0], [lv, 0, 0], [lv, 0, hv], [0, 0, hv]]); poly('t-side', [[lv, 0, 0], [lv, wv, 0], [lv, wv, hv], [lv, 0, hv]]);
    const top = poly('t-top', [[0, 0, hv], [lv, 0, hv], [lv, wv, hv], [0, wv, hv]]);
    const hid = svgEl('polyline', { class: 'u3l6-hid', points: pts([[0, 0, 0], [0, wv, 0], [lv, wv, 0]]) }); svg.appendChild(hid); svg.appendChild(svgEl('polyline', { class: 'u3l6-hid', points: pts([[0, wv, 0], [0, wv, hv]]) }));
    // the lid: a thin slab, 1 unit above the top, overhanging by add/2 on every side
    const o = S.add / 2, z0 = hv + 1.6, z1 = z0 + 0.5;
    const lidG = svgEl('g', { class: 'u3l6-lid' }); svg.appendChild(lidG);
    [[[-o, -o, z0], [lv + o, -o, z0], [lv + o, -o, z1], [-o, -o, z1]], [[lv + o, -o, z0], [lv + o, wv + o, z0], [lv + o, wv + o, z1], [lv + o, -o, z1]], [[-o, -o, z1], [lv + o, -o, z1], [lv + o, wv + o, z1], [-o, wv + o, z1]]].forEach((arr, i) => lidG.appendChild(svgEl('polygon', { class: ['l-front', 'l-side', 'l-top'][i], points: pts(arr) })));
    lidG.style.opacity = 0;
    const lab = (p, src, an, cls = '') => { const d = add(stage, h('div', 'u3l6-lab ' + cls, K(src)), p[0] + ANCH[an][2], p[1] + ANCH[an][3]); d.style.translate = ANCH[an][0] + ' ' + ANCH[an][1]; return d; };
    const labs = [lab(Pt(lv / 2, 0, 0), `x+${S.l}`, 'b'), lab(Pt(lv, wv / 2, 0), `x+${S.w}`, 'r'), lab(Pt(0, 0, hv / 2), `x+${S.h}`, 'l')];
    const nums = [lab(Pt(lv / 2, 0, 0), nv(lv), 'b', 'num'), lab(Pt(lv, wv / 2, 0), nv(wv), 'r', 'num'), lab(Pt(0, 0, hv / 2), nv(hv), 'l', 'num')]; hide(...nums);
    const lidLab = lab(Pt(lv / 2 + o, wv + o, z1), `\\text{lid: }(x+${lL})\\text{ by }(x+${lW})`, 'a', 'sm der'); hide(lidLab);
    const lidNum = lab(Pt(lv / 2 + o, wv + o, z1), `\\text{lid: }${lv + S.add}\\text{ by }${wv + S.add}`, 'a', 'sm num'); hide(lidNum);
    // the written work
    const panel = add(stage, h('div', 'u3l6-tk-panel'), 400, 12); panel.style.width = (W - 412) + 'px';
    const row = (k, src, cls = '') => { const e = h('div', 'u3l6-tk-row ' + cls, `<span class="u3l6-tk-k">${k}</span>${K(src)}`); panel.appendChild(e); hide(e); return e; };
    const pb = partials(Lp, Wp), pv = partials(base, Hp);
    const R1 = row('(a) base', `(x+${S.l})(x+${S.w})=${listTex(pb, V)}=${base.tex({ color: 1 })}`);
    const R2 = row('(b) volume', `V=(${base.tex()})(x+${S.h})`);
    const R3 = row('six products', `=${listTex(pv, V, { color: 1 })}`);
    const R4 = row('collect', `V=${vol.tex({ color: 1 })}`, 'key');
    const R5 = row('(c) lid', `(x+${S.l}+${S.add})(x+${S.w}+${S.add})=(x+${lL})(x+${lW})=${lid.tex({ color: 1 })}`, 'key');
    const vt = (Pp) => Pp.terms().map((t) => numT(t.c * xv ** dsum(t.e))).join('+');
    const R6 = row('(d) evaluate', `V=${vt(vol)}=\\boldsymbol{${numT(vol.at([xv]))}},\\quad \\text{lid}=${vt(lid)}=\\boldsymbol{${numT(lid.at([xv]))}}`);
    [R1, R2, R3, R4, R5, R6].forEach((r) => shrinkFit(r, W - 412 - 28));
    const chk = chkBox(stage, 400, 452, W - 412, `<b>Check:</b> ${T(`${lv}\\times${wv}\\times${hv}=${lv * wv * hv}`)} ${S.unit}³ and lid ${T(`${lv + S.add}\\times${wv + S.add}=${(lv + S.add) * (wv + S.add)}`)} ${S.unit}² <b class="ok">✓</b>`);
    return [{
      cap: `<b>(a) The base</b> is a rectangle: ${T(`(x+${S.l})(x+${S.w})=${base.tex()}`)} ${S.unit}².`,
      run: async (c) => { top.classList.add('base'); await Promise.all([glow(c, top), c.fadeIn(R1, 380)]); }
    }, {
      cap: `<b>(b) Volume = base area × height.</b> Use part (a): ${T(`V=(${base.tex()})(x+${S.h})`)}, a trinomial times a binomial.`,
      run: async (c) => { top.classList.remove('base'); await c.fadeIn(R2, 380); }
    }, {
      cap: `Every term times every term: <b>six</b> partial products. Collect: ${collectCap(pv, V)}. ${T(`V=${vol.tex()}`)} ${S.unit}³.`,
      run: async (c) => { await c.fadeIn(R3, 380); await c.pop(R4, 400); }
    }, {
      cap: `<b>(c) The lid</b> is ${S.add} ${S.unit} longer and ${S.add} ${S.unit} wider. Change the sides <b>first</b>: ${T(`(x+${S.l}+${S.add})=(x+${lL})`)} and ${T(`(x+${S.w}+${S.add})=(x+${lW})`)}. Then FOIL: ${T(lid.tex())} ${S.unit}².`,
      run: (c) => Promise.all([c.anim(lidG, [{ opacity: 0, transform: 'translateY(-30px)' }, { opacity: 1, transform: 'none' }], 600), c.fadeIn(lidLab, 350, { delay: 300 }), c.pop(R5, 400, { delay: 200 })])
    }, {
      cap: `<b>(d) Let ${T(`x=${xv}`)}.</b> Volume: ${T(`${vt(vol)}=${numT(vol.at([xv]))}`)} ${S.unit}³. Lid: ${T(`${vt(lid)}=${numT(lid.at([xv]))}`)} ${S.unit}².`,
      run: (c) => c.fadeIn(R6, 380)
    }, {
      cap: `<b>Check</b> with the real sizes at ${T(`x=${xv}`)}: the ${S.what} is ${lv} by ${wv} by ${hv}, and the lid is ${lv + S.add} by ${wv + S.add}. Same answers ✓.`,
      run: (c) => Promise.all([swapLabs(c, [...labs, lidLab], [...nums, lidNum]), c.fadeIn(chk, 400, { delay: 300 })])
    }];
  }
};
function shrinkFit(el, max) { const w = el.scrollWidth; if (!max || w <= max) return; el.style.fontSize = Math.floor(parseFloat(getComputedStyle(el).fontSize) * max / w * 10) / 10 + 'px'; }

/* ================= static figures for the example cards (the booklet's own) ================= */
function prismSVG(host, o) { // o: {ox, oy, L, D, H, k} in px units; labels {l, w, h}
  const { ox, oy, L, D, H } = o, KX = 0.55, KY = 0.4;
  const P = (a, b, c) => [ox + a + b * KX, oy - c - b * KY];
  const pts = (arr) => arr.map((t) => P(...t).map((n) => n.toFixed(1)).join(',')).join(' ');
  const svg = svgEl('svg', { class: 'u3l6-svg' }); host.appendChild(svg);
  [['t-front', [[0, 0, 0], [L, 0, 0], [L, 0, H], [0, 0, H]]], ['t-side', [[L, 0, 0], [L, D, 0], [L, D, H], [L, 0, H]]], ['t-top', [[0, 0, H], [L, 0, H], [L, D, H], [0, D, H]]]].forEach(([cls, arr]) => svg.appendChild(svgEl('polygon', { class: cls, points: pts(arr) })));
  svg.appendChild(svgEl('polyline', { class: 'u3l6-hid', points: pts([[0, 0, 0], [0, D, 0], [L, D, 0]]) })); svg.appendChild(svgEl('polyline', { class: 'u3l6-hid', points: pts([[0, D, 0], [0, D, H]]) }));
  const lab = (p, src, an) => { const d = h('div', 'u3l6-lab', K(src)); at(d, p[0] + ANCH[an][2], p[1] + ANCH[an][3]); d.style.translate = ANCH[an][0] + ' ' + ANCH[an][1]; host.appendChild(d); };
  lab(P(L / 2, 0, 0), o.l, 'b'); lab(P(L, D / 2, 0), o.w, 'r'); lab(P(0, 0, H / 2), o.h, 'l');
}
function mountFigures() {
  document.querySelectorAll('.u3l6-fig[data-fig]').forEach((host) => {
    const k = host.dataset.fig;
    if (k === 'ex1') { const F = figure(host, 50, 130, 34); F.rect(0, 0, 6.6, 3.2, 'garden'); F.lab(3.3, 0, 'x+6', 'b'); F.lab(0, 1.6, 'x+2', 'l'); }
    else if (k === 'ex2') prismSVG(host, { ox: 56, oy: 168, L: 130, D: 100, H: 92, l: 'x+2', w: 'x+1', h: 'x+3' });
    else if (k === 'ex4') prismSVG(host, { ox: 56, oy: 176, L: 140, D: 96, H: 96, l: 'x+4', w: 'x+1', h: 'x+2' });
    else if (k === 'ex3') {
      const A = figure(host, 54, 112, 26); A.rect(0, 0, 7.8, 3.6, 'plotA'); A.lab(3.9, 0, 'x+9', 'b'); A.lab(0, 1.8, 'x+2', 'l'); A.lab(3.9, 1.8, '\\text{Plot A}', 'c', 'in');
      const B = figure(host, 54, 262, 26); B.rect(0, 0, 8.8, 3.1, 'plotB'); B.lab(4.4, 0, 'x+11', 'b'); B.lab(0, 1.55, 'x+1', 'l'); B.lab(4.4, 1.55, '\\text{Plot B}', 'c', 'in');
    }
  });
}

/* ================= warm-up: the Open-Top Box ================= */
function mountWarmup() {
  const host = document.getElementById('u3l6-wu'); if (!host) return;
  host.innerHTML = `<div class="u3l6-wpics"><svg class="u3l6-wsvg" viewBox="0 0 520 220" width="520" height="220"></svg></div>
    <div class="u3l6-wctl no-ink"><span class="u3l6-wcl">Cut</span>${[1, 2, 3, 4, 5, 6].map((c) => `<button class="chip" type="button" data-cut="${c}">${c} cm</button>`).join('')}</div>
    <table class="u3l6-wtab"><tr><th>Cut (cm)</th>${[1, 2, 3, 4, 5, 6].map((c) => `<th>${c}</th>`).join('')}</tr>
      <tr><th>Box size</th>${OB.map((o) => { const s = 12 - 2 * o.x, t = `${s}×${s}×${o.x}`; return o.x === 1 ? `<td>${t}</td>` : `<td><span data-reveal>${t}</span></td>`; }).join('')}</tr>
      <tr><th>Volume (cm³)</th>${OB.map((o) => (o.x === 1 ? `<td><b>${o.v}</b></td>` : `<td><span data-reveal><b>${o.v}</b></span></td>`)).join('')}</tr></table>`;
  const svg = host.querySelector('svg'), P2 = (pts) => pts.map((p) => p.map((n) => n.toFixed(1)).join(',')).join(' ');
  const el = (tag, a, txt) => { const e = svgEl(tag, a); if (txt != null) e.textContent = txt; svg.appendChild(e); return e; };
  const draw = (c) => {
    svg.innerHTML = '';
    // flat sheet: 12 cm = 168 px
    const s = 14, x0 = 34, y0 = 26, L = 12 * s, cs = c * s;
    el('polygon', { class: 'u3l6-sheet', points: P2([[x0 + cs, y0], [x0 + L - cs, y0], [x0 + L - cs, y0 + cs], [x0 + L, y0 + cs], [x0 + L, y0 + L - cs], [x0 + L - cs, y0 + L - cs], [x0 + L - cs, y0 + L], [x0 + cs, y0 + L], [x0 + cs, y0 + L - cs], [x0, y0 + L - cs], [x0, y0 + cs], [x0 + cs, y0 + cs]]) });
    [[0, 0], [L - cs, 0], [0, L - cs], [L - cs, L - cs]].forEach(([a, b]) => el('rect', { class: 'u3l6-cutsq', x: x0 + a, y: y0 + b, width: cs, height: cs }));
    if (c < 6) el('rect', { class: 'u3l6-fold', x: x0 + cs, y: y0 + cs, width: L - 2 * cs, height: L - 2 * cs });
    el('text', { class: 'u3l6-wt', x: x0 + L / 2, y: y0 - 8 }, '12 cm');
    el('text', { class: 'u3l6-wt red', x: x0 + cs / 2, y: y0 + cs / 2 + 6 }, c >= 2 ? String(c) : '');
    // arrow
    el('path', { class: 'u3l6-warr', d: `M${x0 + L + 16} 110 H${x0 + L + 56}` }); el('polygon', { class: 'u3l6-warrh', points: `${x0 + L + 64},110 ${x0 + L + 54},104 ${x0 + L + 54},116` });
    el('text', { class: 'u3l6-wt red', x: x0 + L + 40, y: 98 }, 'fold');
    // the box (oblique), 1 cm = 14 px
    const b = 12 - 2 * c, k = 12, KX = 0.6, KY = 0.42, bx = 300, by = 196;
    const Q = (a, d, z) => [bx + (a + d * KX) * k, by - (z + d * KY) * k];
    if (b > 0) {
      el('polygon', { class: 'u3l6-bx-in', points: P2([Q(0, 0, 0), Q(b, 0, 0), Q(b, b, 0), Q(0, b, 0)]) });
      el('polygon', { class: 'u3l6-bx-back', points: P2([Q(0, b, 0), Q(b, b, 0), Q(b, b, c), Q(0, b, c)]) });
      el('polygon', { class: 'u3l6-bx-back2', points: P2([Q(0, 0, 0), Q(0, b, 0), Q(0, b, c), Q(0, 0, c)]) });
      el('polygon', { class: 'u3l6-bx-front', points: P2([Q(0, 0, 0), Q(b, 0, 0), Q(b, 0, c), Q(0, 0, c)]) });
      el('polygon', { class: 'u3l6-bx-side', points: P2([Q(b, 0, 0), Q(b, b, 0), Q(b, b, c), Q(b, 0, c)]) });
      const t = Q(b / 2, 0, 0); el('text', { class: 'u3l6-wt', x: t[0], y: t[1] + 20 }, `${b} cm`);
      const hz = Q(0, 0, c / 2); el('text', { class: 'u3l6-wt red', x: hz[0] - 24, y: hz[1] + 6 }, `${c} cm`);
      const d = Q(b, b / 2, 0); el('text', { class: 'u3l6-wt', x: d[0] + 26, y: d[1] + 10 }, `${b} cm`);
      el('text', { class: 'u3l6-wt big', x: 420, y: 24 }, `V = ${b} × ${b} × ${c} = ${b * b * c} cm`).insertAdjacentHTML('beforeend', '<tspan dy="-7" font-size="11">3</tspan>');
    } else el('text', { class: 'u3l6-wt big', x: 420, y: 120 }, 'nothing left to fold!');
    host.querySelectorAll('[data-cut]').forEach((bt) => bt.classList.toggle('on', +bt.dataset.cut === c));
    host.querySelectorAll('.u3l6-wtab tr').forEach((tr) => [...tr.children].forEach((td, i) => td.classList.toggle('on', i === c)));
  };
  host.querySelectorAll('[data-cut]').forEach((bt) => bt.addEventListener('click', () => draw(+bt.dataset.cut)));
  draw(1);
}

/* ================= wiring ================= */
function mountAll() {
  const defs = { area, cutout, box, openbox, equal, tank };
  document.querySelectorAll('[data-explainer]').forEach((el) => new Explainer(el, defs[el.dataset.explainer]));
}
mountWarmup(); mountFigures(); mountAll();

/* ============ Stand Up Break! (lessons/js/standup.js) ============
 * Questions are word problems with a small figure drawn from the generated numbers (not to scale). */
const suLab = (x, y, s, anchor = 'middle', size = 21) => `<text x="${x}" y="${y}" text-anchor="${anchor}" font-size="${size}" font-family="KaTeX_Main, 'Times New Roman', serif" fill="#1c2230">${String(s).replace(/[+-]/g, (m) => (m === '-' ? ' − ' : ' + ')).replace(/[a-z]/g, (c) => `<tspan font-style="italic">${c}</tspan>`)}</text>`;
const SU_SH = 'fill="#dff2ef" stroke="#0f7a74" stroke-width="2.2"';
function suRect(w, hh, lw, lh, name = '') {
  return `<svg viewBox="0 0 420 210" width="420" height="210" role="img" aria-label="A rectangle ${lw} by ${lh}">
    <rect x="110" y="20" width="${w}" height="${hh}" ${SU_SH}/>${name ? suLab(110 + w / 2, 20 + hh / 2 + 7, name, 'middle', 18) : ''}
    ${suLab(110 + w / 2, 20 + hh + 30, lw)}${suLab(98, 20 + hh / 2 + 7, lh, 'end')}</svg>`;
}
function suBox(L, W, H) {
  const x0 = 70, y0 = 80, w = 220, h = 130, dx = 70, dy = 46;
  return `<svg viewBox="0 0 420 270" width="420" height="270" role="img" aria-label="A rectangular prism with edges ${L}, ${W} and ${H}">
    <path d="M${x0} ${y0} L${x0 + dx} ${y0 - dy} L${x0 + w + dx} ${y0 - dy} L${x0 + w} ${y0} Z" fill="#e8f5f2" stroke="#0f7a74" stroke-width="2"/>
    <path d="M${x0 + w} ${y0} L${x0 + w + dx} ${y0 - dy} L${x0 + w + dx} ${y0 + h - dy} L${x0 + w} ${y0 + h} Z" fill="#b3dcd4" stroke="#0f7a74" stroke-width="2"/>
    <rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="#dff2ef" stroke="#0f7a74" stroke-width="2"/>
    ${suLab(x0 + w / 2, y0 + h + 28, L)}${suLab(x0 - 10, y0 + h / 2 + 7, H, 'end')}${suLab(x0 + w + dx / 2 + 12, y0 + h - dy / 2 + 18, W, 'start')}</svg>`;
}
const suP = (arr) => { const t = arr.reduce((acc, f) => { const o = []; acc.forEach((a, i) => f.forEach((b, j) => { o[i + j] = (o[i + j] || 0) + a * b; })); return o; }, [1]); return t; }; // coefficient lists, lowest power first
const suT = (c, v = 'x') => { const out = []; for (let e = c.length - 1; e >= 0; e--) { const a = c[e]; if (!a) continue; const ab = Math.abs(a); out.push((a < 0 ? '-' : out.length ? '+' : '') + (e === 0 ? ab : (ab === 1 ? '' : ab) + v + (e > 1 ? `^{${e}}` : ''))); } return out.join('') || '0'; };
const suEval = (c, x) => c.reduce((s, a, e) => s + a * x ** e, 0);
const suC = (n, v) => (n === 1 ? v : n + v);
const suFoil = (a, b, v) => `${v}^{2}+${suC(b, v)}+${suC(a, v)}+${a * b}`;
standup('u3l6', {
  intro: 'Work it out at your whiteboard station. Write the expression, expand and simplify, then check with the real sizes.',
  levels: {
    /* area of a rectangle, then a number */
    BEG: (r) => {
      const a = r.int(1, 9), b = r.int(1, 9), x = r.int(2, 6), u = r.pick(['m', 'cm', 'ft']), what = r.pick(['patio', 'garden', 'poster', 'rug', 'window']);
      const A = suP([[a, 1], [b, 1]]), L = x + a, W = x + b;
      return {
        text: `A rectangular ${what} is (<i>x</i> + ${a}) ${u} long and (<i>x</i> + ${b}) ${u} wide. Write its area as a trinomial, then find the area when <i>x</i> = ${x}.`,
        q: '', fig: suRect(200, 110, `x+${a}`, `x+${b}`),
        a: [`A=(x+${a})(x+${b})`, `=${suFoil(a, b, 'x')}`, `=${suT(A)}`, `x=${x}:\\ A=${x * x}+${a + b}(${x})+${a * b}=${suEval(A, x)}\\text{ ${u}}^2`, `\\text{check: }${L}\\times${W}=${L * W}\\ \\checkmark`]
      };
    },
    /* volume of a box with three binomial edges */
    PRG: (r) => {
      for (;;) {
        const a = r.int(1, 6), b = r.int(1, 6), c = r.int(1, 6), x = r.int(1, 4);
        if (a === b && b === c) continue;
        const base = suP([[a, 1], [b, 1]]), V = suP([[a, 1], [b, 1], [c, 1]]);
        return {
          text: `A box has the edges shown, in centimetres. Write its volume as a simplified polynomial. Then find the volume when <i>x</i> = ${x}.`,
          q: `V=(x+${a})(x+${b})(x+${c})`, fig: suBox(`x+${a}`, `x+${b}`, `x+${c}`),
          a: [`\\text{base: }(x+${a})(x+${b})=${suT(base)}`, `V=(${suT(base)})(x+${c})`, `=${suT(V)}`, `x=${x}:\\ V=${x + a}\\times${x + b}\\times${x + c}=${suEval(V, x)}\\text{ cm}^3`]
        };
      }
    },
    /* two rectangles with equal areas: the x² terms cancel */
    MAS: (r) => {
      for (;;) {
        const x = r.int(1, 9), a = r.int(1, 9), b = r.int(a, 12), c = r.int(1, 12);
        const A = (x + a) * (x + b); if (A % (x + c)) continue;
        const d = A / (x + c) - x; if (d < 1 || d > 15 || c > d || c === a || a + b === c + d) continue;
        const s1 = a + b, p1 = a * b, s2 = c + d, p2 = c * d, k = s2 - s1;
        const one = (n) => (n === 1 ? 'x' : n + 'x');
        const mv = (k > 0 ? `${p1}-${p2}=${one(s2)}-${one(s1)}` : `${one(s1)}-${one(s2)}=${p2}-${p1}`) + (Math.abs(k) > 1 ? `\\ \\Rightarrow\\ ${Math.abs(k)}x=${Math.abs(p1 - p2)}` : '');
        return {
          text: `Rectangle A is (<i>x</i> + ${a}) by (<i>x</i> + ${b}). Rectangle B is (<i>x</i> + ${c}) by (<i>x</i> + ${d}). They have the same area. Find <i>x</i> and the area.`,
          q: `(x+${a})(x+${b})=(x+${c})(x+${d})`,
          a: [`x^{2}+${one(s1)}+${p1}=x^{2}+${one(s2)}+${p2}`, `${one(s1)}+${p1}=${one(s2)}+${p2}`, `${mv}\\ \\Rightarrow\\ x=${x}`, `\\text{A: }${x + a}\\times${x + b}=${A},\\quad \\text{B: }${x + c}\\times${x + d}=${A}`]
        };
      }
    }
  }
});
