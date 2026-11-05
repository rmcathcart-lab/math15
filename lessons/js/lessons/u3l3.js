/* Math 15 · Unit 3 · Lesson 3 — Multiplying Two Binomials.
 * The explainers, the Calendar Trick warm-up and the Stand Up Break on this page.
 * Adapted from Math 10C 3.2 (same engine): areaGrow, the FOIL/distribute explainer and the polynomial helpers;
 * from Math 10C 3.3: combine. New for Math 15: missing (the skipped O and I), middle (collecting O and I on a number line).
 * Unit 3 colours: area-model cells use the FOIL colours (F teal, O amber, I purple, L blue); the first factor runs
 * DOWN the side (one strip per term, like distributing the first binomial), the second factor ACROSS the top. */
import { h, fmt, Explainer } from '../explain.js';
import { tex } from '../tex.js';
import { NumberLine } from '../blocks.js';
import { standup } from '../standup.js';

/* KaTeX allowing \htmlClass (pieces of an expression that light up one at a time) */
const K = (src, display) => {
  try { return window.katex.renderToString(String(src), { displayMode: !!display, throwOnError: false, strict: 'ignore', trust: true, output: 'html' }); }
  catch (e) { return tex(src, display); }
};
const T = (s) => tex(s); // inline math in captions

/* colours. CELL[row][col]: row = term of the FIRST factor, col = term of the SECOND: F r0c0, O r0c1, I r1c0, L r1c1. */
const TEAL = '#13807a', AMB = '#c27a0e', PUR = '#7b4fc4', BLU = '#2f6fd0', RED = '#c93a33', OK = '#12805a', INK = '#1c2230';
const CELL = [[TEAL, AMB], [PUR, BLU]];
const PCOL = [TEAL, AMB, PUR, BLU];
const LIKE = ['#c2417a', '#2f6fd0', '#c27a0e', '#7b4fc4'];
const tc = (col, s) => `\\textcolor{${col}}{${s}}`;
void PCOL; void INK; void OK;
const at = (el, x, y) => { el.style.left = x + 'px'; el.style.top = y + 'px'; return el; };
const add = (stage, el, x, y) => { stage.appendChild(at(el, x, y)); return el; };
const hide = (...els) => els.forEach((e) => { if (e) e.style.opacity = 0; });
const svgEl = (tag, attrs = {}) => { const e = document.createElementNS('http://www.w3.org/2000/svg', tag); for (const k in attrs) e.setAttribute(k, attrs[k]); return e; };
const box = (el, w, hh) => { el.style.width = w + 'px'; el.style.height = hh + 'px'; return el; };

/* ============ polynomial helpers: a term is { c: coefficient, v: { x: 2, y: 1 } } ============ */
function parseTerm(s) {
  const m = String(s).replace(/\s+/g, '').match(/^([+-]?)(\d*)((?:[a-z](?:\^\d+)?)*)$/);
  if (!m) throw new Error('bad term ' + s);
  const v = {};
  (m[3].match(/[a-z](?:\^\d+)?/g) || []).forEach((p) => { const k = p[0], e = p.length > 1 ? parseInt(p.slice(2), 10) : 1; v[k] = (v[k] || 0) + e; });
  return { c: (m[1] === '-' ? -1 : 1) * (m[2] === '' ? 1 : parseInt(m[2], 10)), v };
}
const parsePoly = (s) => String(s).replace(/\s+/g, '').match(/[+-]?[^+-]+/g).map(parseTerm);
const isConst = (t) => !Object.keys(t.v).length;
const mulT = (a, b) => { const v = { ...a.v }; for (const k in b.v) v[k] = (v[k] || 0) + b.v[k]; return { c: a.c * b.c, v }; };
const keyT = (t) => Object.keys(t.v).sort().map((k) => k + t.v[k]).join('');
const degT = (t) => Object.values(t.v).reduce((s, e) => s + e, 0);
const numT = (n) => fmt(n).replace(/\u202f/g, '\\,'); // 2 173 → 2\,173 (thin space, like the booklet)
function bodyT(t) { // the term without its sign
  const a = Math.abs(t.c), vs = Object.keys(t.v).sort().map((k) => (t.v[k] === 1 ? k : `${k}^{${t.v[k]}}`)).join('');
  return vs ? (a === 1 ? '' : numT(a)) + vs : numT(a);
}
const termT = (t, first) => (t.c < 0 ? '-' : first ? '' : '+') + bodyT(t);
const polyT = (list) => (list.length ? list.map((t, i) => termT(t, i === 0)).join('') : '0');
const ctT = (t, first, col) => (first ? tc(col, termT(t, true)) : (t.c < 0 ? '-' : '+') + tc(col, bodyT(t))); // a coloured term
const fT = (t) => (t.c < 0 ? `(${termT(t, true)})` : termT(t, true)); // a factor written for multiplying: (−3), 2x
function collect(list) { // combine like terms; highest degree first, ties in order of appearance
  const m = new Map();
  list.forEach((t) => { const k = keyT(t); if (m.has(k)) m.get(k).c += t.c; else m.set(k, { c: t.c, v: { ...t.v } }); });
  return [...m.values()].map((t, i) => ({ t, i })).filter((o) => o.t.c !== 0).sort((a, b) => degT(b.t) - degT(a.t) || a.i - b.i).map((o) => o.t);
}
function likeGroups(list) { // indices of terms that share a key, for groups of 2 or more
  const m = new Map(); list.forEach((t, i) => { const k = keyT(t); if (!m.has(k)) m.set(k, []); m.get(k).push(i); });
  return [...m.values()].filter((g) => g.length > 1);
}
const mulP = (P, Q) => P.flatMap((p) => Q.map((q) => mulT(p, q)));
const negP = (P) => P.map((t) => ({ c: -t.c, v: { ...t.v } }));
function expNote(a, b) { // "x^3·x^2 = x^{3+2} = x^5" when two factors share a letter and an exponent is bigger than 1
  const ks = Object.keys(a.v).filter((k) => b.v[k]);
  const big = ks.filter((k) => a.v[k] > 1 || b.v[k] > 1);
  if (!big.length) return '';
  return ' Exponents add: ' + big.map((k) => T(`${k}^{${a.v[k]}}\\cdot ${k}^{${b.v[k]}}=${k}^{${a.v[k]}+${b.v[k]}}=${k}^{${a.v[k] + b.v[k]}}`)).join(', ') + '.';
}
function signNote(a, b) {
  if (a.c < 0 && b.c < 0) return ' Negative × negative is <b>positive</b>.';
  if (a.c < 0 || b.c < 0) return ' Negative × positive is <b>negative</b>.';
  return '';
}
const prodCap = (a, b) => T(`${fT(a)}\\cdot ${fT(b)}=${termT(mulT(a, b), true)}`);

/* ============ drawing helpers ============ */
function stagePos(stage, el) { // an element's box in stage coordinates (the lesson may be scaled to fit the screen)
  const sr = stage.getBoundingClientRect(), k = sr.width / stage.offsetWidth || 1, r = el.getBoundingClientRect();
  return { x: (r.left + r.width / 2 - sr.left) / k, y: (r.top + r.height / 2 - sr.top) / k, l: (r.left - sr.left) / k, t: (r.top - sr.top) / k, r: (r.right - sr.left) / k, b: (r.bottom - sr.top) / k };
}
function arcLayer(stage) { const s = svgEl('svg', { class: 'u3l3-arcs' }); stage.appendChild(s); return s; }
/* an arrow that draws itself from (x1,y1) to (x2,y2), bulging up (lift > 0) or down (lift < 0) */
function arrow(svg, x1, y1, x2, y2, lift, col, label) {
  const cx = (x1 + x2) / 2, cy = (lift > 0 ? Math.min(y1, y2) : Math.max(y1, y2)) - lift;
  const p = svgEl('path', { d: `M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}`, fill: 'none', stroke: col, 'stroke-width': 3.4, 'stroke-linecap': 'round' });
  const ang = Math.atan2(y2 - cy, x2 - cx), L = 13, wd = 0.46;
  const pts = [[x2, y2], [x2 - L * Math.cos(ang - wd), y2 - L * Math.sin(ang - wd)], [x2 - L * Math.cos(ang + wd), y2 - L * Math.sin(ang + wd)]];
  const hd = svgEl('polygon', { points: pts.map((q) => q.join(',')).join(' '), fill: col });
  svg.append(p, hd);
  const len = p.getTotalLength() || 1;
  p.style.strokeDasharray = len; p.style.strokeDashoffset = len; hd.style.opacity = 0;
  let lab = null;
  if (label) {
    const py = (y1 + 2 * cy + y2) / 4;
    lab = svgEl('text', { x: cx, y: lift > 0 ? py - 8 : py + 22, 'text-anchor': 'middle', class: 'u3l3-arclab', fill: col }); lab.textContent = label; lab.style.opacity = 0; svg.appendChild(lab);
  }
  return {
    p, hd, lab,
    async draw(c, ms = 520) { await c.anim(p, [{ strokeDashoffset: len }, { strokeDashoffset: 0 }], ms); await Promise.all([c.anim(hd, [{ opacity: 0 }, { opacity: 1 }], 140), lab ? c.anim(lab, [{ opacity: 0 }, { opacity: 1 }], 200) : null]); },
    dim(c) { return Promise.all([p, hd, lab].filter(Boolean).map((e) => c.anim(e, [{ opacity: e.style.opacity || 1 }, { opacity: 0.22 }], 250))); }
  };
}
const fillOn = (c, el, delay = 0) => c.sleep(delay).then(() => el.classList.add('on'));
const pulse = (c, el, s = 1.12) => c.anim(el, [{ transform: 'scale(1)' }, { transform: `scale(${s})` }, { transform: 'scale(1)' }], 460);
const showSpans = (c, els, ms = 320) => Promise.all(els.map((e) => c.anim(e, [{ opacity: 0 }, { opacity: 1 }], ms)));
const spans = (root, cls) => [...root.querySelectorAll('.' + cls)];
function stampIn(c, el) { return c.anim(el, [{ opacity: 0, transform: 'scale(1.9) rotate(-14deg)' }, { opacity: 1, transform: 'scale(1) rotate(-6deg)' }], 420, { easing: 'cubic-bezier(.2,1.4,.4,1)' }); }

/* a line of written work in a stage */
function wline(stage, src, x, y, cls = '') { const e = add(stage, h('div', 'u3l3-wl ' + cls, K(src)), x, y); return e; }

/* lengths for a (roughly) to-scale area model: letter terms long, number terms short */
function lenOf(t) {
  const a = Math.abs(t.c);
  if (!isConst(t)) return Math.min(280, 200 + 30 * (a - 1));
  return Math.max(70, Math.min(150, 36 + 20 * a));
}
/* where an element sits inside the stage, in stage pixels (the lesson may be scaled to fit the screen) */
function rel(stage, el) {
  const sr = stage.getBoundingClientRect(), k = sr.width / stage.offsetWidth || 1, r = el.getBoundingClientRect();
  return { x: (r.left - sr.left) / k - stage.clientLeft, y: (r.top - sr.top) / k - stage.clientTop, w: r.width / k, h: r.height / k };
}
const fadeOut = (c, el, ms = 300, o = {}) => c.anim(el, [{ opacity: getComputedStyle(el).opacity }, { opacity: 0 }], ms, o);
const moveTo = (c, el, x, y, ms = 650, o = {}) => c.anim(el, [{ left: el.style.left, top: el.style.top }, { left: x + 'px', top: y + 'px' }], ms, o);

/* ============ 1. Two binomials as one rectangle: one strip per term of the first binomial ============ */
const GROW = {
  dm: { f1: 'x+2', f2: 'x+5' },
  wu: { f1: 'n+1', f2: 'n+7', note: ' In the calendar trick, that small corner piece is the <b>7</b>.' },
  a1: { f1: 'x+3', f2: 'x+4' }, b1: { f1: 'x+6', f2: 'x+2' }
};
const areaGrow = {
  title: 'Two binomials, one rectangle',
  height: 470,
  minW: 890, // drawn this wide and scaled to fit beside the sidebar (the four-cell grid sits at W - 312)
  choices: [{ v: 'dm', label: tex('(x+2)(x+5)') }, { v: 'wu', label: 'Warm-up: ' + tex('(n+1)(n+7)') }, { sep: 'Example 1 check:' }, { v: 'a1', label: '(a)' }, { v: 'b1', label: '(b)' }],
  intro: (k) => `Think of ${T(`(${GROW[k].f1})(${GROW[k].f2})`)} as the area of a rectangle: ${T(GROW[k].f1)} tall and ${T(GROW[k].f2)} wide.`,
  make(stage, key, ex) {
    const W = ex.W, d = GROW[key], A = parsePoly(d.f2) /* across the top */, B = parsePoly(d.f1) /* down the side */;
    const prodT = `(${d.f1})(${d.f2})`;
    const cell = (r, cI) => mulT(B[r], A[cI]); // side term × top term, in the booklet's order: x·4 = 4x, 3·x = 3x
    let ws = A.map(lenOf), hs = B.map(lenOf);
    const s = Math.min(1, 440 / (ws[0] + ws[1]), 268 / (hs[0] + hs[1]));
    ws = ws.map((w) => Math.round(w * s)); hs = hs.map((v) => Math.round(v * s));
    const rx = 112, ry = 76, xo = [0, ws[0]], yo = [0, hs[0]];
    const cells = [0, 1].map((r) => [0, 1].map((cI) => {
      const p = cell(r, cI), e = add(stage, box(h('div', 'u3l3-gc' + (p.c < 0 ? ' neg' : '')), ws[cI], hs[r]), rx + xo[cI], ry + yo[r]);
      e.style.setProperty('--pc', CELL[r][cI]); e.innerHTML = `<span class="u3l3-gcl">${K(termT(p, true))}</span>`;
      const l = e.firstChild; if (ws[cI] < 100 || hs[r] < 50) l.style.fontSize = '20px'; hide(e); l.style.opacity = 0; return { e, l, p };
    }));
    const tops = A.map((t, k) => { const e = add(stage, h('div', 'u3l3-lab c', K(termT(t, true))), rx + xo[k] + ws[k] / 2, ry - 34); hide(e); return e; });
    const tdim = A.map((t, k) => { const e = add(stage, box(h('div', 'u3l3-dim'), ws[k] - 6, 0), rx + xo[k] + 3, ry - 12); hide(e); return e; });
    const sides = B.map((t, r) => { const e = add(stage, h('div', 'u3l3-lab c', K(termT(t, true))), rx - 46, ry + yo[r] + hs[r] / 2); hide(e); return e; });
    const sdim = B.map((t, r) => { const e = add(stage, box(h('div', 'u3l3-vdim'), 0, hs[r] - 6), rx - 14, ry + yo[r] + 3); hide(e); return e; });
    // the four-cell grid, on the right
    const gx = W - 312, gy = 70, hw = 70, cw = 116, chh = 76, hhh = 50;
    const gbox = (x, y, w, hh, cls, html) => { const e = add(stage, box(h('div', 'u3l3-gg ' + cls, html), w, hh), x, y); hide(e); return e; };
    const gTitle = add(stage, h('div', 'u3l3-gt c', 'four-cell grid'), gx + (hw + 2 * cw) / 2, gy - 24); hide(gTitle);
    const gHead = [gbox(gx, gy, hw, hhh, 'hd x', K('\\times')), ...A.map((t, k) => gbox(gx + hw + k * cw, gy, cw, hhh, 'hd', K(termT(t, true))))];
    const gSide = B.map((t, r) => gbox(gx, gy + hhh + r * chh, hw, chh, 'hd', K(termT(t, true))));
    const gCell = [0, 1].map((r) => [0, 1].map((cI) => { const p = cells[r][cI].p, e = gbox(gx + hw + cI * cw, gy + hhh + r * chh, cw, chh, 'in' + (p.c < 0 ? ' neg' : ''), `<span>${K(termT(p, true))}</span>`); e.style.setProperty('--pc', CELL[r][cI]); e.firstChild.style.opacity = 0; return e; }));
    // the written line below
    const order = [[0, 0], [0, 1], [1, 0], [1, 1]], terms = order.map(([r, cI]) => cells[r][cI].p);
    const L1 = add(stage, h('div', 'u3l3-wl u3l3-gl', K(`${prodT}\\htmlClass{u3l3-q0}{=}` + order.map(([r, cI], i) => `\\htmlClass{u3l3-q${i}}{${ctT(cells[r][cI].p, i === 0, CELL[r][cI])}}`).join(''))), 40, 368);
    const qs = order.map((o, i) => spans(L1, 'u3l3-q' + i)); hide(...qs.flat());
    const fin = collect(terms), likes = likeGroups(terms);
    const L2 = add(stage, h('div', 'u3l3-wl u3l3-gl u3l3-ans', K(`\\phantom{${prodT}}=${polyT(fin)}`)), 40, 414); hide(L2);
    const fillCell = (c, r, cI, delay = 0) => Promise.all([c.anim(cells[r][cI].l, [{ opacity: 0, transform: 'scale(.5)' }, { opacity: 1, transform: 'scale(1)' }], 380, { delay }), fillOn(c, cells[r][cI].e, delay), c.anim(gCell[r][cI].firstChild, [{ opacity: 0 }, { opacity: 1 }], 380, { delay: delay + 120 }), fillOn(c, gCell[r][cI], delay + 120), showSpans(c, qs[order.findIndex(([a, b]) => a === r && b === cI)], 300)]);
    const s0 = termT(B[0], true), s1 = termT(B[1], true), row0 = [cell(0, 0), cell(0, 1)], row1 = [cell(1, 0), cell(1, 1)];
    const steps = [{
      cap: `Start with <b>one strip</b>: ${T(s0)} tall and ${T(d.f2)} wide. Its area is ${T(`${fT(B[0])}(${d.f2})=${polyT(row0)}`)}, a monomial times a binomial, just like Lesson 2.`,
      run: async (c) => {
        await Promise.all([...cells[0].map((x) => c.fadeIn(x.e, 350)), ...tops.map((e, k) => c.pop(e, 350, { delay: k * 100 })), ...tdim.map((e) => c.fadeIn(e, 300)), c.pop(sides[0], 350, { delay: 150 }), c.fadeIn(sdim[0], 300), c.fadeIn(gTitle, 300), ...gHead.map((e) => c.fadeIn(e, 300)), c.fadeIn(gSide[0], 300), ...gCell[0].map((e) => c.fadeIn(e, 300)), showSpans(c, qs[0])]);
        await Promise.all([fillCell(c, 0, 0), fillCell(c, 0, 1, 250)]);
      }
    }, {
      cap: `Now the side grows by ${T(s1)}. The rectangle gets a whole <b>new strip</b> along the bottom: ${T(`${s1}(${d.f2})`)}, two more pieces to fill.`,
      run: (c) => Promise.all([...cells[1].map((x) => c.anim(x.e, [{ opacity: 1, height: '0px' }, { opacity: 1, height: hs[1] + 'px' }], 550)), c.pop(sides[1], 380, { delay: 300 }), c.fadeIn(sdim[1], 300, { delay: 300 }), c.fadeIn(gSide[1], 350, { delay: 200 }), ...gCell[1].map((e) => c.fadeIn(e, 350, { delay: 250 }))])
    }, {
      cap: `The new strip: ${prodCap(B[1], A[0])} and ${prodCap(B[1], A[1])}. That’s ${T(`${s1}(${d.f2})=${polyT(row1)}`)}.`,
      run: async (c) => { await fillCell(c, 1, 0); await fillCell(c, 1, 1); }
    }];
    const likeTxt = likes.map((g) => T(`${g.map((i, j) => termT(terms[i], j === 0)).join('')}=${termT(collect(g.map((i) => terms[i]))[0] || { c: 0, v: {} }, true)}`)).join(' and ');
    steps.push({
      cap: (likes.length ? `<b>Four pieces.</b> The two middle pieces are <b>like terms</b>: ${likeTxt}. ` : '<b>Four pieces</b>, no like terms. ') + `So ${T(`${prodT}=${polyT(fin)}`)}.` + (d.note || ''),
      run: async (c) => {
        const cl = likes.flat().map((i) => order[i]);
        await Promise.all([...cl.map(([r, cI]) => pulse(c, cells[r][cI].e, 1.06)), ...cl.map(([r, cI]) => pulse(c, gCell[r][cI], 1.1))]);
        cl.forEach(([r, cI]) => { cells[r][cI].e.classList.add('like'); gCell[r][cI].classList.add('like'); });
        if (key === 'wu') cells[1][1].e.classList.add('hot');
        await c.fadeIn(L2, 420);
      }
    });
    return steps;
  }
};

/* ============ 1–3. Distribute twice, or FOIL: four arrows, four cells ============ */
const FO = {
  genD: { f1: 'a+b', f2: 'c+d', mode: 'dist' }, dmD: { f1: 'x+2', f2: 'x+5', mode: 'dist' },
  a1: { f1: 'x+3', f2: 'x+4', mode: 'dist' }, b1: { f1: 'x+6', f2: 'x+2', mode: 'dist' },
  gen: { f1: 'a+b', f2: 'c+d', mode: 'foil' }, dmF: { f1: 'x+2', f2: 'x+5', mode: 'foil' },
  a2: { f1: '2x+1', f2: 'x+5', mode: 'foil' }, b2: { f1: '3x+2', f2: 'x+4', mode: 'foil' }, c2: { f1: '2x+5', f2: '3x+1', mode: 'foil' },
  dmN: { f1: 'x+3', f2: 'x-5', mode: 'foil' },
  a3: { f1: 'x-4', f2: 'x+6', mode: 'foil' }, b3: { f1: 'x-2', f2: 'x-7', mode: 'foil' }, c3: { f1: '2x-3', f2: 'x-5', mode: 'foil' },
  a4: { f1: '3x-2', f2: '2x-5', mode: 'foil' }, b4: { f1: '4x+1', f2: '2x-3', mode: 'foil' }
};
const FOIL = [['F', 'First', 0, 0, 1], ['O', 'Outside', 0, 1, 1], ['I', 'Inside', 1, 0, -1], ['L', 'Last', 1, 1, -1]]; // letter, word, term of f1, term of f2, above/below
const foilCol = (L) => ({ F: CELL[0][0], O: CELL[0][1], I: CELL[1][0], L: CELL[1][1] })[L];
function makeFoil(title, choices, first, signs) {
  return {
    title, height: 420, choices, value: first,
    minW: 860, // drawn this wide and scaled to fit beside the sidebar
    intro: (k) => { const d = FO[k]; return d.mode === 'foil' ? `Use <b>FOIL</b> on ${T(`(${d.f1})(${d.f2})`)}: First, Outside, Inside, Last.` : `Use the <b>distributive property</b> on ${T(`(${d.f1})(${d.f2})`)}: distribute the whole first binomial, then each of its terms.`; },
    make(stage, key, ex) {
      const W = ex.W, d = FO[key], A = parsePoly(d.f1), B = parsePoly(d.f2), foilM = d.mode === 'foil';
      const fac = (P, n) => P.map((t, k) => (k === 0 ? `\\htmlClass{u3l3-f${n}${k}}{${termT(t, true)}}` : `\\mathbin{\\htmlClass{u3l3-s${n}${k}}{${t.c < 0 ? '-' : '+'}}}\\htmlClass{u3l3-f${n}${k}}{${bodyT(t)}}`)).join('');
      const svg = arcLayer(stage);
      const head = add(stage, h('div', 'u3l3-fo0 c', K(`(${fac(A, 'a')})(${fac(B, 'b')})`)), 300, 150);
      const tEl = (n, k) => spans(head, `u3l3-f${n}${k}`)[0];
      // grid: first factor down the side, second across the top (F r0c0, O r0c1, I r1c0, L r1c1)
      const gx = W - 316, gy = 64, hw = 74, cw = 118, chh = 78, hhh = 52;
      const gbox = (x, y, w, hh, cls, html) => add(stage, box(h('div', 'u3l3-gg ' + cls, html), w, hh), x, y);
      gbox(gx, gy, hw, hhh, 'hd x', K('\\times')); B.forEach((t, k) => gbox(gx + hw + k * cw, gy, cw, hhh, 'hd', K(termT(t, true)))); A.forEach((t, r) => gbox(gx, gy + hhh + r * chh, hw, chh, 'hd', K(termT(t, true))));
      const gc = [0, 1].map((r) => [0, 1].map((cI) => { const p = mulT(A[r], B[cI]), e = gbox(gx + hw + cI * cw, gy + hhh + r * chh, cw, chh, 'in' + (p.c < 0 ? ' neg' : ''), `<span>${K(termT(p, true))}</span><i></i>`); e.style.setProperty('--pc', CELL[r][cI]); e.firstChild.style.opacity = 0; return e; }));
      add(stage, h('div', 'u3l3-gt c', 'the area model'), gx + hw + cw, gy - 22);
      // written lines
      const prods = FOIL.map(([L, , i, j]) => mulT(A[i], B[j]));
      let y = 286, Ld = null;
      if (!foilM) { Ld = wline(stage, `=\\htmlClass{u3l3-da}{${fT(A[0])}(${d.f2})}\\htmlClass{u3l3-db}{${A[1].c < 0 ? '-' : '+'}${bodyT(A[1])}(${d.f2})}`, 40, 262); hide(Ld); y = 316; }
      const L1 = wline(stage, '\\htmlClass{u3l3-k0}{=}' + prods.map((p, i) => `\\htmlClass{u3l3-k${i}}{${ctT(p, i === 0, foilCol(FOIL[i][0]))}}`).join(''), 40, y);
      const kEls = prods.map((p, i) => spans(L1, 'u3l3-k' + i)); hide(...kEls.flat());
      const fin = collect(prods), likes = likeGroups(prods);
      const L2 = wline(stage, `=${polyT(fin)}`, 40, y + 50, 'u3l3-ans'); hide(L2);
      const arrs = {};
      const go = async (c, n) => {
        const [L, , i, j, up] = FOIL[n], col = foilCol(L);
        if (!arrs[L]) {
          const a = stagePos(stage, tEl('a', i)), b = stagePos(stage, tEl('b', j)), dx = Math.abs(b.x - a.x);
          arrs[L] = up > 0 ? arrow(svg, a.x, a.t - 2, b.x, b.t - 2, 34 + dx * 0.32, col, foilM ? L : '') : arrow(svg, a.x, a.b + 2, b.x, b.b + 2, -(30 + dx * 0.3), col, foilM ? L : '');
        }
        const r = i, cI = j;
        await arrs[L].draw(c, 460);
        await Promise.all([fillOn(c, gc[r][cI]), c.anim(gc[r][cI].firstChild, [{ opacity: 0, transform: 'scale(.5)' }, { opacity: 1, transform: 'scale(1)' }], 360), showSpans(c, kEls[n]), foilM ? (gc[r][cI].lastChild.textContent = L, c.pop(gc[r][cI].lastChild, 300)) : null]);
      };
      const pc = (n) => { const [, , i, j] = FOIL[n]; return prodCap(A[i], B[j]); };
      const sn = (n) => { const [, , i, j] = FOIL[n], a = A[i].c < 0, b = B[j].c < 0; return !signs ? '' : a && b ? ' Negative × negative is <b>positive</b>.' : a ? ' Negative × positive is <b>negative</b>.' : b ? ' Positive × negative is <b>negative</b>.' : ''; };
      const steps = [];
      const negs = [A, B].map((P, k) => ({ P, f: k ? d.f2 : d.f1, n: k ? 'b' : 'a' })).filter((o) => o.P[1].c < 0);
      if (signs && negs.length) {
        steps.push({
          cap: `A subtracted term is a <b>negative</b> term: ${negs.map((o) => T(`${o.f}=${termT(o.P[0], true)}+(${termT(o.P[1], true)})`)).join(' and ')}. The sign belongs to the number, and it goes into every product.`,
          run: async (c) => { negs.forEach((o) => [tEl(o.n, 1), ...spans(head, `u3l3-s${o.n}1`)].forEach((e) => e.classList.add('u3l3-negt'))); await pulse(c, head, 1.05); }
        });
      }
      if (foilM) {
        FOIL.forEach(([L, word], n) => steps.push({
          cap: `<b>${L}</b>${word.slice(1)}: the ${word.toLowerCase()} terms, ${pc(n)}.` + (n === 1 ? ' Outside = the two ends.' : n === 2 ? ' Inside = the two middle terms.' : '') + sn(n),
          run: (c) => go(c, n)
        }));
      } else {
        steps.push({ cap: `Treat ${T(`(${d.f2})`)} as one thing and distribute the first binomial: ${T(`(${d.f1})(${d.f2})=${fT(A[0])}(${d.f2})${A[1].c < 0 ? '-' : '+'}${bodyT(A[1])}(${d.f2})`)}. <b>Step 1</b> done.`, run: (c) => c.fadeIn(Ld, 400) });
        steps.push({ cap: `<b>Step 2:</b> distribute the ${T(termT(A[0], true))}: ${pc(0)} and ${pc(1)}.`, run: async (c) => { spans(Ld, 'u3l3-da')[0].classList.add('u3l3-hot'); await go(c, 0); await go(c, 1); } });
        steps.push({ cap: `Then distribute the ${T(termT(A[1], true))}: ${pc(2)} and ${pc(3)}.`, run: async (c) => { spans(Ld, 'u3l3-db')[0].classList.add('u3l3-hot'); await go(c, 2); await go(c, 3); } });
      }
      const likeTxt = likes.map((g) => T(`${g.map((i, j) => termT(prods[i], j === 0)).join('')}=${termT(collect(g.map((i) => prods[i]))[0] || { c: 0, v: {} }, true)}`)).join(' and ');
      steps.push({
        cap: (likes.length ? `<b>Collect</b> the like terms (the O and I products, a diagonal of the grid): ${likeTxt}. ` : `No like terms: no two products have the same variables. `) + `So ${T(`(${d.f1})(${d.f2})=${polyT(fin)}`)}.` + (foilM ? '' : ' The same four products FOIL finds.'),
        run: async (c) => {
          if (likes.length) { const cl = likes.flat().map((n) => [FOIL[n][2], FOIL[n][3]]); await Promise.all(cl.map(([r, cI]) => pulse(c, gc[r][cI], 1.1))); cl.forEach(([r, cI]) => gc[r][cI].classList.add('like')); }
          if (likes.length) await c.fadeIn(L2, 420); else { L1.classList.add('u3l3-ans'); await pulse(c, L1, 1.04); }
        }
      });
      return steps;
    }
  };
}
const distTwice = makeFoil('Distribute twice', [{ v: 'dmD', label: tex('(x+2)(x+5)') }, { v: 'genD', label: tex('(a+b)(c+d)') }, { sep: 'Example 1 check:' }, { v: 'a1', label: '(a)' }, { v: 'b1', label: '(b)' }], 'dmD', false);
const foil = makeFoil('FOIL: four arrows, four cells', [{ v: 'gen', label: tex('(a+b)(c+d)') }, { v: 'dmF', label: tex('(x+2)(x+5)') }, { sep: 'Example 2 check:' }, { v: 'a2', label: '(a)' }, { v: 'b2', label: '(b)' }, { v: 'c2', label: '(c)' }], 'gen', false);
const foilNeg = makeFoil('FOIL with negative terms', [{ v: 'dmN', label: tex('(x+3)(x-5)') }, { sep: 'Example 3 check:' }, { v: 'a3', label: '(a)' }, { v: 'b3', label: '(b)' }, { v: 'c3', label: '(c)' }, { sep: 'Example 4 check:' }, { v: 'a4', label: '(a)' }, { v: 'b4', label: '(b)' }], 'dmN', true);

/* ============ 2. What if you skip O and I? Count the squares ============ */
const MISS = { a: { p: 3, q: 2, x: 6 }, b: { p: 4, q: 1, x: 5 } };
const missing = {
  title: 'Skip the O and I? Count the squares',
  height: 420,
  minW: 900, // drawn this wide and scaled to fit beside the sidebar
  choices: [{ v: 'a', label: tex('(x+3)(x+2)') + ', ' + tex('x=6') }, { v: 'b', label: tex('(x+4)(x+1)') + ', ' + tex('x=5') }],
  intro: (k) => { const { p, q } = MISS[k]; return `Sam says ${T(`(x+${p})(x+${q})=x^2+${p * q}`)}: “just multiply the firsts and the lasts.” Let’s test it with a number for ${T('x')}.`; },
  make(stage, key, ex) {
    const W = ex.W, { p, q, x } = MISS[key], R = x + p, C = x + q, cell = Math.min(38, 330 / Math.max(R, C)), x0 = 70, gy = 40;
    const reg = (i, j) => (i < x ? (j < x ? 'F' : 'O') : (j < x ? 'I' : 'L'));
    const cells = [];
    for (let i = 0; i < R; i++) for (let j = 0; j < C; j++) {
      const e = add(stage, box(h('div', 'u3l3-cell'), cell - 3, cell - 3), x0 + j * cell, gy + i * cell); e.dataset.r = reg(i, j); cells.push(e);
    }
    const ctr = (r0, c0, rr, cc) => [x0 + (c0 + cc / 2) * cell - 1.5, gy + (r0 + rr / 2) * cell - 1.5];
    const vals = { F: x * x, O: x * q, I: p * x, L: p * q };
    const labs = { F: ctr(0, 0, x, x), O: ctr(0, x, x, q), I: ctr(x, 0, p, x), L: ctr(x, x, p, q) };
    const lab = {}; for (const k in labs) { lab[k] = add(stage, h('div', 'u3l3-clab c', String(vals[k])), ...labs[k]); lab[k].style.color = foilCol(k); hide(lab[k]); }
    const dl = (x1, y1, w, t) => { const e = add(stage, h('div', 'u3l3-dim2 c', K(t)), x1 + w / 2, y1); return e; };
    dl(x0, gy - 18, x * cell, 'x'); dl(x0 + x * cell, gy - 18, q * cell, String(q));
    const sl = (y1, hh, t) => add(stage, h('div', 'u3l3-dim2 c', K(t)), x0 - 26, y1 + hh / 2);
    sl(gy, x * cell, 'x'); sl(gy + x * cell, p * cell, String(p));
    const px = x0 + C * cell + 54;
    const L = (y, s, cls = '') => { const e = add(stage, h('div', 'u3l3-eq ' + cls, s), px, y); hide(e); return e; };
    const tot = R * C, wrong = x * x + p * q, qx = (q === 1 ? '' : q) + 'x', pxx = (p === 1 ? '' : p) + 'x';
    const L1 = L(30, K(`(${x}+${p})(${x}+${q})=${R}\\times${C}=${tot}`) + ' <span class="u3l3-tag">the whole rectangle</span>');
    const L2 = L(100, K(`x^2+${p * q}=${x}^2+${p * q}=${wrong}`), 'bad');
    const st = add(stage, h('div', 'u3l3-stamp2', `≠ ${tot}`), Math.min(px + 330, W - 120), 94); hide(st);
    const L3 = L(170, K(`\\text{O: }x\\cdot${q}=${tc(foilCol('O'), `${x * q}`)}\\qquad\\text{I: }${p}\\cdot x=${tc(foilCol('I'), `${p * x}`)}`) + ' <span class="u3l3-tag amb">skipped</span>');
    const L4 = L(240, K(`${x * x}+${x * q}+${p * x}+${p * q}=${tot}`) + ' <b class="u3l3-ok">✓</b>', 'good');
    const L5 = L(316, K(`(x+${p})(x+${q})=\\boldsymbol{x^2+${p + q}x+${p * q}}`), 'u3l3-boxed');
    const by = (r) => cells.filter((e) => e.dataset.r === r);
    return [{
      cap: `Try ${T(`x=${x}`)}. Then ${T(`(x+${p})(x+${q})`)} is a ${R} by ${C} rectangle: <b>${tot}</b> small squares.`,
      run: (c) => Promise.all([...cells.map((e, i) => c.anim(e, [{ transform: 'scale(1)' }, { transform: 'scale(1.25)' }, { transform: 'scale(1)' }], 300, { delay: i * Math.min(8, 600 / cells.length) })), c.fadeIn(L1, 400, { delay: 300 })])
    }, {
      cap: `Sam’s answer, ${T(`x^2+${p * q}`)}, counts only the <b>First</b> square and the <b>Last</b> corner: ${T(`${x * x}+${p * q}=${wrong}`)}. But ${wrong} ≠ ${tot}!`,
      run: async (c) => {
        by('F').forEach((e) => e.classList.add('F')); by('L').forEach((e) => e.classList.add('L')); [...by('O'), ...by('I')].forEach((e) => e.classList.add('ghost'));
        await Promise.all([c.pop(lab.F, 380), c.pop(lab.L, 380, { delay: 150 }), c.fadeIn(L2, 400, { delay: 200 })]);
        await stampIn(c, st);
      }
    }, {
      cap: `What got left out? Two strips: the <b>Outside</b> product ${T(`x\\cdot${q}=${qx}`)} (${x * q} squares) and the <b>Inside</b> product ${T(`${p}\\cdot x=${pxx}`)} (${p * x} squares).`,
      run: async (c) => {
        const rs = [...by('O'), ...by('I')]; rs.forEach((e) => { e.classList.remove('ghost'); e.classList.add(e.dataset.r); });
        await Promise.all([...rs.map((e, i) => c.anim(e, [{ transform: 'scale(1)' }, { transform: 'scale(1.18)' }, { transform: 'scale(1)' }], 380, { delay: i * 8 })), c.pop(lab.O, 380, { delay: 250 }), c.pop(lab.I, 380, { delay: 400 }), c.fadeIn(L3, 400, { delay: 300 })]);
      }
    }, {
      cap: `All four pieces: ${T(`${x * x}+${x * q}+${p * x}+${p * q}=${tot}`)} ✓. Every product counts, so ${T(`(x+${p})(x+${q})=x^2+${p + q}x+${p * q}`)}. FOIL makes sure you never skip one.`,
      run: (c) => Promise.all([c.fadeIn(L4, 400), c.pop(L5, 450, { delay: 350 })])
    }];
  }
};

/* ============ 4. Collecting the O and I terms is adding integers ============ */
const MID = {
  n1: { e: '(x-4)(x+6)', F: 'x^2', O: 6, I: -4, L: '-24', a: 1 },
  c3: { e: '(2x-3)(x-5)', F: '2x^2', O: -10, I: -3, L: '+15', a: 2 },
  a4: { e: '(3x-2)(2x-5)', F: '6x^2', O: -15, I: -4, L: '+10', a: 6 },
  b4: { e: '(4x+1)(2x-3)', F: '8x^2', O: -12, I: 2, L: '-3', a: 8 }
};
const cx = (n, first) => (n < 0 ? '-' : first ? '' : '+') + (Math.abs(n) === 1 ? '' : Math.abs(n)) + 'x';
const middle = {
  title: 'Collect the middle terms',
  height: 410,
  minW: 860, // drawn this wide and scaled to fit beside the sidebar
  choices: [{ v: 'n1', label: tex('(x-4)(x+6)') }, { v: 'c3', label: 'Example 3 (c)' }, { sep: 'Example 4 check:' }, { v: 'a4', label: '(a)' }, { v: 'b4', label: '(b)' }],
  intro: (k) => `After FOIL, ${T(MID[k].e)} has four terms. The <b>O</b> and <b>I</b> terms are both ${T('x')}-terms, so they collect into one.`,
  make(stage, key, ex) {
    const W = ex.W, d = MID[key], s = d.O + d.I;
    const chips = [[d.F, 'F'], [cx(d.O, false), 'O'], [cx(d.I, false), 'I'], [d.L, 'L']];
    const row = add(stage, h('div', 'u3l3-mrow'), 24, 12);
    row.innerHTML = `<span class="u3l3-mq">${K(d.e + '=')}</span>` + chips.map(([t, L]) => `<span class="u3l3-mchip" style="--pc:${foilCol(L)}">${K(t)}<small>${L}</small></span>`).join('');
    const mch = [...row.querySelectorAll('.u3l3-mchip')];
    const lo = Math.min(0, d.O, s) - 2, hi = Math.max(0, d.O, s) + 2;
    const N = new NumberLine(stage, { x: 24, y: 104, width: W - 48, height: 150, min: lo, max: hi, step: 1, labelStep: hi - lo > 18 ? 5 : 1, axisY: 72, fontSize: 18 });
    N.el.style.opacity = 0;
    const p0 = N.point(0, { color: 'slate' }); p0.style.opacity = 0;
    const sum = add(stage, h('div', 'u3l3-eq big', K(`${cx(d.O, true)}${cx(d.I, false)}=\\boldsymbol{${cx(s, true)}}`)), 24, 298); hide(sum);
    const fin = add(stage, h('div', 'u3l3-eq u3l3-boxed', K(`${d.e}=${d.F}${cx(s, false)}${d.L}`)), 24, 354); hide(fin);
    const dir = (n) => (n < 0 ? 'left' : 'right');
    return [{
      cap: `${T(cx(d.O, true))} and ${T(cx(d.I, true))} are <b>like terms</b>: the same variable, the same exponent. ${T(d.F)} and ${T(d.L.replace(/^\+/, ''))} have no partners.`,
      run: async (c) => { mch.forEach((e, i) => e.classList.toggle('dim', i === 0 || i === 3)); await Promise.all([pulse(c, mch[1], 1.12), pulse(c, mch[2], 1.12)]); }
    }, {
      cap: `Collecting them is just adding the numbers in front. Start at 0. The <b>O</b> term is ${T(cx(d.O, true))}: move ${Math.abs(d.O)} to the ${dir(d.O)}.`,
      run: async (c) => { await c.fadeIn(N.el, 300); p0.style.opacity = 1; await N.hop(c, 0, d.O, { label: String(d.O).replace('-', '−'), color: foilCol('O') }); }
    }, {
      cap: `The <b>I</b> term is ${T(cx(d.I, true))}: move ${Math.abs(d.I)} more to the ${dir(d.I)}. You land on <b>${String(s).replace('-', '−')}</b>.`,
      run: async (c) => { await N.hop(c, d.O, s, { label: (d.I > 0 ? '+' : '') + String(d.I).replace('-', '−'), color: foilCol('I'), below: true }); const pt = N.point(s, { color: 'green', label: String(s).replace('-', '−') }); await c.pop(pt, 360); }
    }, {
      cap: `So ${T(`${cx(d.O, true)}${cx(d.I, false)}=${cx(s, true)}`)}, and ${T(`${d.e}=${d.F}${cx(s, false)}${d.L}`)}. ${d.O < 0 && d.I < 0 ? 'Two negatives make a bigger negative.' : 'Opposite signs: subtract, and keep the sign of the bigger one.'}`,
      run: (c) => Promise.all([c.fadeIn(sum, 400), c.pop(fin, 420, { delay: 300 })])
    }];
  }
};
/* ============ 3. Expand every product, flip, collect ============ */
// polynomials in x: arrays of coefficients, index = degree
const pmul = (p, q) => { const r = Array(p.length + q.length - 1).fill(0); p.forEach((a, i) => q.forEach((b, j) => { r[i + j] += a * b; })); return r; };
const pscale = (p, k) => p.map((a) => a * k);
let XV = 'x'; // the letter of the chip being drawn
const xp = (dg) => (dg === 0 ? '' : dg === 1 ? XV : `${XV}^{${dg}}`);
const cTermT = (c, dg, first) => { const a = Math.abs(c), co = dg && a === 1 ? '' : String(a); return (c < 0 ? '-' : first ? '' : '+') + co + xp(dg); };
const cPolyT = (p) => { const out = []; for (let dg = p.length - 1; dg >= 0; dg--) if (p[dg]) out.push(cTermT(p[dg], dg, !out.length)); return out.join('') || '0'; };
const CB = {
  w1: { v: 'n', e: '(n+1)(n+7)-n(n+8)', parts: [{ s: 1, k: 1, f: [[1, 1], [7, 1]], t: '(n+1)(n+7)' }, { s: -1, k: 1, f: [[0, 1], [8, 1]], t: 'n(n+8)' }],
    note: ' Everything cancels except <b>Last × Last</b>, ' + T('1\\times7') + '. That’s why every 2 × 2 block gives 7!' },
  w2: { v: 'n', e: '(n+2)(n+14)-n(n+16)', parts: [{ s: 1, k: 1, f: [[2, 1], [14, 1]], t: '(n+2)(n+14)' }, { s: -1, k: 1, f: [[0, 1], [16, 1]], t: 'n(n+16)' }],
    note: ' Again only Last × Last survives: ' + T('2\\times14=28') + '. The big one is 28, every time.' },
  a: { e: '(x+4)(x+2)+(x+1)(x+5)', parts: [{ s: 1, k: 1, f: [[4, 1], [2, 1]], t: '(x+4)(x+2)' }, { s: 1, k: 1, f: [[1, 1], [5, 1]], t: '(x+1)(x+5)' }] },
  b: { e: '(x+7)(x+3)-(x+2)(x+4)', parts: [{ s: 1, k: 1, f: [[7, 1], [3, 1]], t: '(x+7)(x+3)' }, { s: -1, k: 1, f: [[2, 1], [4, 1]], t: '(x+2)(x+4)' }] }
};
const DEGN = (dg) => (dg === 0 ? 'numbers' : `${K(xp(dg))} terms`);
const combine = {
  title: 'Expand every product, flip the signs, then collect',
  height: 478,
  minW: 780, // drawn this wide and scaled to fit beside the sidebar
  choices: [{ v: 'w1', label: 'Warm-up: ' + tex('2\\times2') }, { v: 'w2', label: 'The big one: ' + tex('3\\times3') }, { sep: 'Example 5 check:' }, { v: 'a', label: '(a)' }, { v: 'b', label: '(b)' }],
  intro: (k) => `Simplify ${T(CB[k].e)}. Expand each product <b>completely</b> before collecting anything.`,
  make(stage, key, ex) {
    const W = ex.W, d = CB[key]; XV = d.v || 'x';
    add(stage, h('div', 'u3l3-eq big c', K(d.e)), W / 2, 36);
    const P = d.parts.map((pt) => { const raw = pt.f.reduce(pmul); return { ...pt, raw, P: pscale(raw, pt.k) }; });
    const rowsY = [86, 152], LX = 330;
    const rows = P.map((pt, ri) => {
      const y = rowsY[ri];
      const lab = add(stage, h('div', 'u3l3-cb-lab', K((ri ? (pt.s < 0 ? '-' : '+') : '') + pt.t) + ' ' + K('\\to')), LX, y); lab.style.translate = '-100% 0';
      const terms = []; for (let dg = pt.P.length - 1; dg >= 0; dg--) if (pt.P[dg]) terms.push({ c: pt.P[dg], dg });
      let x = LX + 16;
      const br = [];
      if (pt.s < 0) { const m = add(stage, h('div', 'u3l3-cb-br neg', K('-(')), x, y); br.push(m); x += (rel(stage, m).w || 30) + 4; }
      const chips = terms.map((t, i) => { const e = add(stage, h('div', 'u3l3-tc', K(cTermT(t.c, t.dg, i === 0))), x, y); e.dataset.dg = t.dg; e._c = t.c; e._first = i === 0; x += (rel(stage, e).w || 70) + 8; hide(e); return e; });
      if (pt.s < 0) br.push(add(stage, h('div', 'u3l3-cb-br neg', K(')')), x, y));
      hide(lab, ...br);
      return { pt, lab, chips, br, y };
    });
    // collecting columns
    const degs = [...new Set(P.flatMap((pt) => pt.P.map((c, dg) => (c ? dg : -1)).filter((dg) => dg >= 0)))].sort((a, b) => b - a);
    const cw = Math.min(200, (W - 80) / degs.length), cx0 = W / 2 - (cw * degs.length) / 2;
    const colX = (dg) => cx0 + cw * degs.indexOf(dg) + cw / 2;
    const heads = degs.map((dg) => add(stage, h('div', 'u3l3-cb-h c', DEGN(dg)), colX(dg), 236));
    const line = add(stage, box(h('div', 'u3l3-cb-line'), cw * degs.length - 20, 3), cx0 + 10, 350);
    const total = degs.map(() => 0); P.forEach((pt) => pt.P.forEach((c, dg) => { if (c) total[degs.indexOf(dg)] += pt.s * c; }));
    const sums = degs.map((dg, i) => add(stage, h('div', 'u3l3-cb-sum c' + (total[i] ? '' : ' zero'), total[i] ? K(cTermT(total[i], dg, true)) : K('0')), colX(dg), 380));
    const resP = []; degs.forEach((dg, i) => { resP[dg] = total[i]; }); for (let i = 0; i < resP.length; i++) resP[i] = resP[i] || 0;
    const res = cPolyT(resP);
    const fin = add(stage, h('div', 'u3l3-eq u3l3-boxed c', K(`${d.e}=\\boldsymbol{${res}}`)), W / 2, 440);
    hide(...heads, line, ...sums, fin);
    const expCap = (pt, which) => {
      const what = `${which} product`;
      if (pt.k !== 1) return `Expand the ${what}: ${T(`${pt.pt}=${cPolyT(pt.raw)}`)}, then times ${pt.k}: ${T(cPolyT(pt.P))}.`;
      return `Expand the ${what}: ${T(`${pt.t}=${cPolyT(pt.P)}`)}.`;
    };
    const neg = rows.find((r) => r.pt.s < 0), zeroDs = degs.filter((dg, i) => !total[i]);
    const steps = [{
      cap: expCap(P[0], 'first'), run: (c) => Promise.all([c.fadeIn(rows[0].lab, 300), ...rows[0].chips.map((e, i) => c.pop(e, 340, { delay: 200 + i * 120 }))])
    }, {
      cap: expCap(P[1], 'second') + (P[1].s < 0 ? ' Keep it in brackets: the minus sign in front is still waiting.' : ''),
      run: (c) => Promise.all([c.fadeIn(rows[1].lab, 300), ...rows[1].br.map((e) => c.fadeIn(e, 300)), ...rows[1].chips.map((e, i) => c.pop(e, 340, { delay: 200 + i * 120 }))])
    }, neg ? {
      cap: `The minus sign flips <b>every</b> term of the second product: ${T(`-(${cPolyT(neg.pt.P)})=${cPolyT(pscale(neg.pt.P, -1))}`)}.`,
      run: async (c) => {
        await Promise.all(neg.chips.map((e, i) => c.anim(e, [{ transform: 'rotateX(0)' }, { transform: 'rotateX(90deg)' }], 220, { delay: i * 140 })));
        neg.chips.forEach((e) => { e._c = -e._c; e.innerHTML = K(cTermT(e._c, +e.dataset.dg, false)); e.classList.add('flip'); });
        await Promise.all([...neg.chips.map((e, i) => c.anim(e, [{ transform: 'rotateX(90deg)' }, { transform: 'rotateX(0)' }], 260, { delay: i * 140 })), ...neg.br.map((e) => fadeOut(c, e, 300))]);
      }
    } : {
      cap: 'A <b>plus</b> sign in front changes nothing: every term keeps its sign. Just drop the brackets.',
      run: (c) => Promise.all(rows[1].chips.map((e, i) => pulse(c, e, 1.12, { delay: i * 100 })))
    }, {
      cap: '<b>Collect like terms:</b> sort every term into a column with its like terms.',
      run: async (c) => {
        await Promise.all(heads.map((e) => c.fadeIn(e, 300)));
        const ys = {}; const jobs = [];
        rows.forEach((r) => r.chips.forEach((e) => {
          const dg = +e.dataset.dg, k = ys[dg] = (ys[dg] || 0) + 1;
          if (e._first) { e.innerHTML = K(cTermT(e._c, dg, false)); }
          const w = rel(stage, e).w || 70;
          jobs.push(moveTo(c, e, colX(dg) - w / 2, 262 + (k - 1) * 42, 700, { delay: jobs.length * 60 }));
        }));
        await Promise.all([...jobs, ...rows.map((r) => fadeOut(c, r.lab, 300))]);
      }
    }, {
      cap: `Add down each column.${zeroDs.length ? ` ${zeroDs.map((dg) => (dg ? `The ${T(xp(dg))} terms` : 'The numbers')).join(' and ').replace(' and The', ' and the')} cancel: ${zeroDs.length > 1 ? '<b>zero pairs</b>' : 'a <b>zero pair</b>'}.` : ''} So ${T(`${d.e}=${res}`)}.${d.note || ''}`,
      run: async (c) => {
        await c.fadeIn(line, 250);
        const jobs = [];
        degs.forEach((dg, i) => {
          if (!total[i]) { // a zero pair: the two chips slide together, then both fade
            const zs = rows.flatMap((r) => r.chips.filter((e) => +e.dataset.dg === dg));
            const mid = zs.reduce((t, e) => t + parseFloat(e.style.top), 0) / zs.length;
            zs.forEach((e) => jobs.push(c.anim(e, [{ top: e.style.top, opacity: 1 }, { top: mid + 'px', opacity: 1, offset: 0.6 }, { top: mid + 'px', opacity: 0.12 }], 900)));
          }
          jobs.push(c.pop(sums[i], 380, { delay: 200 + i * 150 }));
        });
        await Promise.all(jobs);
        await c.pop(fin, 420);
      }
    }];
    return steps;
  }
};

/* ============ 4. Extension: completing the square with algebra tiles ============ */

/* ============ warm-up: the Calendar Trick (October 2026 starts on a Thursday) ============ */
function mountCalendar() {
  const host = document.getElementById('u3l3-cal'); if (!host) return;
  const lead = 4, days = 31, CW = 50, CH = 40;
  const colOf = (d) => (d + lead - 1) % 7, rowOf = (d) => Math.floor((d + lead - 1) / 7);
  let cellsH = '';
  for (let d = 1; d <= days; d++) cellsH += `<button type="button" class="u3l3-cd" data-d="${d}" style="left:${colOf(d) * CW}px;top:${rowOf(d) * CH}px;width:${CW}px;height:${CH}px">${d}</button>`;
  for (let c = 0; c < lead; c++) cellsH += `<div class="u3l3-cd empty" style="left:${c * CW}px;top:0;width:${CW}px;height:${CH}px"></div>`;
  host.innerHTML = `<div class="u3l3-cal-l">
      <div class="u3l3-cal-m">October 2026</div>
      <div class="u3l3-cal-dn">${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((s) => `<span style="width:${CW}px">${s}</span>`).join('')}</div>
      <div class="u3l3-cal-g" style="width:${7 * CW}px;height:${5 * CH}px">${cellsH}<div class="u3l3-cal-blk"></div></div>
    </div>
    <div class="u3l3-cal-r">
      <div class="u3l3-cal-sz no-ink"><button type="button" class="pill small on" data-sz="2">2 × 2</button><button type="button" class="pill small" data-sz="3">3 × 3</button></div>
      <div class="u3l3-cal-hint">Tap a date: it becomes the <b>top-left</b> of the block.</div>
      <div class="u3l3-cal-out" aria-live="polite"></div>
    </div>`;
  const blk = host.querySelector('.u3l3-cal-blk'), out = host.querySelector('.u3l3-cal-out'), cells = [...host.querySelectorAll('.u3l3-cd[data-d]')];
  const st = { sz: 2, n: 5 };
  const fits = (n, s) => colOf(n) + s - 1 <= 6 && n + 7 * (s - 1) + s - 1 <= days;
  const render = () => {
    const { sz: s, n } = st, tl = n, tr = n + s - 1, bl = n + 7 * (s - 1), br = bl + s - 1;
    blk.style.left = colOf(n) * CW + 'px'; blk.style.top = rowOf(n) * CH + 'px'; blk.style.width = s * CW + 'px'; blk.style.height = s * CH + 'px';
    cells.forEach((e) => { const d = +e.dataset.d; e.classList.toggle('red', d === tr || d === bl); e.classList.toggle('ink', d === tl || d === br); e.classList.toggle('in', colOf(d) >= colOf(n) && colOf(d) < colOf(n) + s && rowOf(d) >= rowOf(n) && rowOf(d) < rowOf(n) + s); });
    out.innerHTML = `<div><b class="u3l3-red">${tr} × ${bl}</b> = ${fmt(tr * bl)}</div><div>${tl} × ${br} = ${fmt(tl * br)}</div><div class="u3l3-cal-res">${fmt(tr * bl)} − ${fmt(tl * br)} = <b>${tr * bl - tl * br}</b></div>`;
    host.querySelectorAll('[data-sz]').forEach((b) => b.classList.toggle('on', +b.dataset.sz === s));
  };
  cells.forEach((e) => e.addEventListener('click', () => {
    const d = +e.dataset.d;
    if (!fits(d, st.sz)) { e.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-5px)' }, { transform: 'translateX(5px)' }, { transform: 'translateX(0)' }], 300); out.querySelector('.u3l3-cal-res').innerHTML = '<span class="muted">That block won’t fit in October.</span>'; return; }
    st.n = d; render(); blk.animate([{ opacity: 0.2 }, { opacity: 1 }], 300);
  }));
  host.querySelectorAll('[data-sz]').forEach((b) => b.addEventListener('click', () => {
    st.sz = +b.dataset.sz; if (!fits(st.n, st.sz)) st.n = st.sz === 3 ? 8 : 5; render();
  }));
  render();
}

/* ============ wiring ============ */
function mountExplainers() {
  const defs = { areaGrow, distTwice, foil, missing, foilNeg, middle, combine };
  const all = [...document.querySelectorAll('[data-explainer]')].map((el) => new Explainer(el, defs[el.dataset.explainer]));
  // chips are laid out by measuring KaTeX widths: once the math fonts arrive, redraw any explainer still at its start
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => all.forEach((x) => { if (x.steps && x.k === 0 && !x.running) x.build(0); }));
}

mountCalendar(); mountExplainers();

/* ============ Stand Up Break! (lessons/js/standup.js) — a tiny polynomial kit for the whiteboard questions ============
 * A polynomial is { key: coefficient }, the key naming the variables and their exponents ('x2y1'; '' for a constant).
 * A written expression keeps its terms in a list of one-term polynomials, so the answer can show the four products. */
const suKey = (e) => Object.keys(e).filter((v) => e[v]).sort().map((v) => v + e[v]).join('');
const suExp = (k) => { const e = {}; k.replace(/([a-z])(\d+)/g, (_, v, n) => { e[v] = +n; }); return e; };
const suM = (c, v, n = 1) => (c ? { [suKey(typeof v === 'object' ? v : v ? { [v]: n } : {})]: c } : {}); // c·vⁿ
const suAdd = (...ps) => { const o = {}; ps.forEach((p) => { for (const k in p) { o[k] = (o[k] || 0) + p[k]; if (!o[k]) delete o[k]; } }); return o; };
const suMul = (...ps) => ps.reduce((a, b) => {
  const o = {};
  for (const i in a) for (const j in b) { const e = suExp(i), f = suExp(j); for (const v in f) e[v] = (e[v] || 0) + f[v]; const k = suKey(e); o[k] = (o[k] || 0) + a[i] * b[j]; if (!o[k]) delete o[k]; }
  return o;
}, { '': 1 });
const suDeg = (k) => Object.values(suExp(k)).reduce((s, n) => s + n, 0);
const suOrd = (a, b) => suDeg(b) - suDeg(a);
const suKeys = (p) => Object.keys(p).sort(suOrd);
const suMono = (k) => Object.entries(suExp(k)).map(([v, n]) => v + (n > 1 ? '^{' + n + '}' : '')).join('');
const suTerm = (c, k, first) => { const m = suMono(k), a = Math.abs(c); return (c < 0 ? '-' : first ? '' : '+') + (a === 1 && m ? '' : a) + m; };
const suTex = (p) => suKeys(p).map((k, i) => suTerm(p[k], k, i === 0)).join('') || '0';
const suOne = (p) => { const k = Object.keys(p)[0]; return [p[k], k]; };
const suSeq = (list) => list.filter((p) => Object.keys(p).length).map((p, i) => { const [c, k] = suOne(p); return suTerm(c, k, i === 0); }).join('') || '0';
const suPar = (list) => '(' + suSeq(list) + ')';
const suP = (list) => suAdd(...list);
const suParts = (A, B) => A.flatMap((a) => B.map((b) => suMul(a, b)));
const suL = (v, a, b) => [suM(a, v), suM(b)]; // a·v + b as a written list
const suNz = (r, lo, hi) => { let v = 0; while (!v) v = r.int(lo, hi); return v; };
/* (A)(B) → the four FOIL products, then collected */
function suTwo(A, B) {
  const parts = suParts(A, B), res = suP(parts);
  return { q: suPar(A) + suPar(B), a: [suPar(A) + suPar(B) + '=' + suSeq(parts), '=' + suTex(res)] };
}
/* a binomial pair whose O and I terms don't cancel */
function suPair(r, v, mR, bR, needNeg) {
  for (;;) {
    const m = r.int(...mR), p = r.int(...mR), b = suNz(r, ...bR), d = suNz(r, ...bR);
    if (m * d + b * p === 0 || (needNeg && b > 0 && d > 0)) continue;
    return [suL(v, m, b), suL(v, p, d)];
  }
}

standup('u3l3', {
  intro: 'Expand and simplify at your whiteboard station. Write all four products (FOIL), then collect the like terms.',
  levels: {
    /* (x + a)(x + b), all positive */
    BEG: (r) => { const v = r.pick(['x', 'x', 'x', 'a', 'n', 'y']); return suTwo(suL(v, 1, r.int(1, 9)), suL(v, 1, r.int(1, 9))); },
    /* a negative term, or a coefficient on x */
    PRG: (r) => {
      const v = r.pick(['x', 'x', 'x', 'a', 'm', 'y']);
      if (r.chance(0.55)) return suTwo(...suPair(r, v, [1, 1], [-9, 9], true));
      return suTwo(suL(v, r.int(2, 5), r.int(1, 6)), suL(v, 1, r.int(1, 6)));
    },
    /* coefficients and negatives together, or two products added or subtracted (like Example 5) */
    MAS: (r) => {
      const v = r.pick(['x', 'x', 'x', 'a', 'y']);
      if (r.chance(0.55)) {
        for (;;) {
          const [A, B] = suPair(r, v, [1, 5], [-7, 7], true);
          if (suOne(A[0])[0] === 1 && suOne(B[0])[0] === 1) continue;
          return suTwo(A, B);
        }
      }
      for (;;) {
        const A = suL(v, 1, r.int(1, 8)), B = suL(v, 1, r.int(1, 8)), C = suL(v, 1, suNz(r, -6, 6)), D = suL(v, 1, r.int(1, 6)), s = r.sign();
        const p1 = suP(suParts(A, B)), p2 = suP(suParts(C, D)), res = suAdd(p1, s > 0 ? p2 : suMul(suM(-1), p2));
        if (Object.keys(res).length < 2) continue;
        const op = s > 0 ? '+' : '-';
        return {
          q: suPar(A) + suPar(B) + op + suPar(C) + suPar(D),
          a: [suPar(A) + suPar(B) + '=' + suTex(p1), suPar(C) + suPar(D) + '=' + suTex(p2), '(' + suTex(p1) + ')' + op + '(' + suTex(p2) + ')', '=' + suTex(res)]
        };
      }
    }
  }
});
