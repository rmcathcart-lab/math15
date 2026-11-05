/* Math 15 · Unit 3 · Lesson 4 — Special Products: Difference of Squares & Perfect Squares.
 * The explainers, "The Square That Lost a Corner" warm-up and the Stand Up Break on this page.
 * Adapted from Math 10C 3.3 (same engine): squareSplit, classicError, minusSquare, sumDiff, recognizer, mental; the
 * FOIL explainer and polynomial helpers from Math 15 3.3 (10C 3.2). Unit 3 colours: x² / a² teal, x / ab amber,
 * 1 / b² slate; FOIL cells F teal, O amber, I purple, L blue (first factor down the side). */
import { h, fmt, Explainer } from '../explain.js';
import { tex } from '../tex.js';
import { standup } from '../standup.js';

/* KaTeX allowing \htmlClass (pieces of an expression that light up one at a time) */
const KT = (src, display) => {
  try { return window.katex.renderToString(String(src), { displayMode: !!display, throwOnError: false, strict: 'ignore', trust: true, output: 'html' }); }
  catch (e) { return tex(src, display); }
};
const CELL = [['#13807a', '#c27a0e'], ['#7b4fc4', '#2f6fd0']];
const tc = (col, s) => `\\textcolor{${col}}{${s}}`;
const at = (el, x, y) => { el.style.left = x + 'px'; el.style.top = y + 'px'; return el; };
const add = (stage, el, x, y) => { stage.appendChild(at(el, x, y)); return el; };
const box = (el, w, ht) => { el.style.width = w + 'px'; el.style.height = ht + 'px'; return el; };
const hide = (...els) => els.forEach((e) => { if (e) e.style.opacity = 0; });
const svgEl = (tag, attrs = {}) => { const e = document.createElementNS('http://www.w3.org/2000/svg', tag); for (const k in attrs) e.setAttribute(k, attrs[k]); return e; };
const K = (s, d) => KT(s, d);
const T = (s) => tex(s); // inline math in captions
const tn = (n) => fmt(n).replace(/ /g, '\\,'); // 2 500 → 2\,500 inside KaTeX
const sgn = (n) => (n < 0 ? '-' : '+');

/* the unit's colours: x²/a² teal, x/ab amber, 1/b² slate */
const TEAL = '#0f6f69', AMB = '#a8650a', SLATE = '#3d5f8f';
const cA = (s) => `\\textcolor{${TEAL}}{${s}}`, cB = (s) => `\\textcolor{${AMB}}{${s}}`;

/* where an element sits inside the stage, in stage pixels (the lesson may be scaled to fit the screen) */
function rel(stage, el) {
  const sr = stage.getBoundingClientRect(), k = sr.width / stage.offsetWidth || 1, r = el.getBoundingClientRect();
  return { x: (r.left - sr.left) / k - stage.clientLeft, y: (r.top - sr.top) / k - stage.clientTop, w: r.width / k, h: r.height / k };
}
function stampIn(c, el) { return c.anim(el, [{ opacity: 0, transform: 'scale(1.9) rotate(-14deg)' }, { opacity: 1, transform: 'scale(1) rotate(-6deg)' }], 420, { easing: 'cubic-bezier(.2,1.4,.4,1)' }); }
const pulse = (c, el, s = 1.06, o = {}) => c.anim(el, [{ scale: '1' }, { scale: String(s) }, { scale: '1' }], 520, o); // uses `scale`, so it never undoes a transform
const KN = (s) => `<span class="nw">${K(s)}</span>`;
const fadeOut = (c, el, ms = 300, o = {}) => c.anim(el, [{ opacity: getComputedStyle(el).opacity }, { opacity: 0 }], ms, o);
const moveTo = (c, el, x, y, ms = 650, o = {}) => c.anim(el, [{ left: el.style.left, top: el.style.top }, { left: x + 'px', top: y + 'px' }], ms, o);

/* dimension marks: a bar with end ticks and a label */
function dimH(stage, x, y, w, label, o = {}) {
  const bar = add(stage, box(h('div', 'u3l4-dbar h'), w, 12), x, y);
  const lab = add(stage, h('div', 'u3l4-dim c', K(label)), x + w / 2, y + (o.below ? 28 : -14));
  return [bar, lab];
}
function dimV(stage, x, y, ht, label, o = {}) {
  const bar = add(stage, box(h('div', 'u3l4-dbar v'), 12, ht), x, y);
  const lab = add(stage, h('div', 'u3l4-dim', K(label)), o.right ? x + 22 : x - 10, y + ht / 2);
  lab.style.translate = o.right ? '0 -50%' : '-100% -50%';
  return [bar, lab];
}

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
function arcLayer(stage) { const s = svgEl('svg', { class: 'u3l4-arcs' }); stage.appendChild(s); return s; }
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
    lab = svgEl('text', { x: cx, y: lift > 0 ? py - 8 : py + 22, 'text-anchor': 'middle', class: 'u3l4-arclab', fill: col }); lab.textContent = label; lab.style.opacity = 0; svg.appendChild(lab);
  }
  return {
    p, hd, lab,
    async draw(c, ms = 520) { await c.anim(p, [{ strokeDashoffset: len }, { strokeDashoffset: 0 }], ms); await Promise.all([c.anim(hd, [{ opacity: 0 }, { opacity: 1 }], 140), lab ? c.anim(lab, [{ opacity: 0 }, { opacity: 1 }], 200) : null]); },
    dim(c) { return Promise.all([p, hd, lab].filter(Boolean).map((e) => c.anim(e, [{ opacity: e.style.opacity || 1 }, { opacity: 0.22 }], 250))); }
  };
}
const fillOn = (c, el, delay = 0) => c.sleep(delay).then(() => el.classList.add('on'));
const showSpans = (c, els, ms = 320) => Promise.all(els.map((e) => c.anim(e, [{ opacity: 0 }, { opacity: 1 }], ms)));
const spans = (root, cls) => [...root.querySelectorAll('.' + cls)];
/* a line of written work in a stage */
function wline(stage, src, x, y, cls = '') { const e = add(stage, h('div', 'u3l4-wl ' + cls, K(src)), x, y); return e; }
/* ============ 1–3. Distribute twice, or FOIL: four arrows, four cells ============ */
const FO = {
  e1: { f1: 'x+3', f2: 'x+5', mode: 'foil' },
  p1: { f1: 'x+4', f2: 'x-4', mode: 'foil' },
  p2: { f1: 'x+3', f2: 'x+3', mode: 'foil' }
};
const FOIL = [['F', 'First', 0, 0, 1], ['O', 'Outer', 0, 1, 1], ['I', 'Inner', 1, 0, -1], ['L', 'Last', 1, 1, -1]]; // letter, word, term of f1, term of f2, above/below
const foilCol = (L) => ({ F: CELL[0][0], O: CELL[0][1], I: CELL[1][0], L: CELL[1][1] })[L];
function makeFoil(title, choices, first, signs) {
  return {
    title, height: 420, choices, value: first,
    minW: 860, // drawn this wide and scaled to fit beside the sidebar
    intro: (k) => { const d = FO[k]; return d.mode === 'foil' ? `Use <b>FOIL</b> on ${T(`(${d.f1})(${d.f2})`)}: First, Outside, Inside, Last.` : `Use the <b>distributive property</b> on ${T(`(${d.f1})(${d.f2})`)}: distribute the whole first binomial, then each of its terms.`; },
    make(stage, key, ex) {
      const W = ex.W, d = FO[key], A = parsePoly(d.f1), B = parsePoly(d.f2), foilM = d.mode === 'foil';
      const fac = (P, n) => P.map((t, k) => (k === 0 ? `\\htmlClass{u3l4-f${n}${k}}{${termT(t, true)}}` : `\\mathbin{\\htmlClass{u3l4-s${n}${k}}{${t.c < 0 ? '-' : '+'}}}\\htmlClass{u3l4-f${n}${k}}{${bodyT(t)}}`)).join('');
      const svg = arcLayer(stage);
      const head = add(stage, h('div', 'u3l4-fo0 c', K(`(${fac(A, 'a')})(${fac(B, 'b')})`)), 300, 150);
      const tEl = (n, k) => spans(head, `u3l4-f${n}${k}`)[0];
      // grid: first factor down the side, second across the top (F r0c0, O r0c1, I r1c0, L r1c1)
      const gx = W - 316, gy = 64, hw = 74, cw = 118, chh = 78, hhh = 52;
      const gbox = (x, y, w, hh, cls, html) => add(stage, box(h('div', 'u3l4-gg ' + cls, html), w, hh), x, y);
      gbox(gx, gy, hw, hhh, 'hd x', K('\\times')); B.forEach((t, k) => gbox(gx + hw + k * cw, gy, cw, hhh, 'hd', K(termT(t, true)))); A.forEach((t, r) => gbox(gx, gy + hhh + r * chh, hw, chh, 'hd', K(termT(t, true))));
      const gc = [0, 1].map((r) => [0, 1].map((cI) => { const p = mulT(A[r], B[cI]), e = gbox(gx + hw + cI * cw, gy + hhh + r * chh, cw, chh, 'in' + (p.c < 0 ? ' neg' : ''), `<span>${K(termT(p, true))}</span><i></i>`); e.style.setProperty('--pc', CELL[r][cI]); e.firstChild.style.opacity = 0; return e; }));
      add(stage, h('div', 'u3l4-gt c', 'the area model'), gx + hw + cw, gy - 22);
      // written lines
      const prods = FOIL.map(([L, , i, j]) => mulT(A[i], B[j]));
      let y = 286, Ld = null;
      if (!foilM) { Ld = wline(stage, `=\\htmlClass{u3l4-da}{${fT(A[0])}(${d.f2})}\\htmlClass{u3l4-db}{${A[1].c < 0 ? '-' : '+'}${bodyT(A[1])}(${d.f2})}`, 40, 262); hide(Ld); y = 316; }
      const L1 = wline(stage, '\\htmlClass{u3l4-k0}{=}' + prods.map((p, i) => `\\htmlClass{u3l4-k${i}}{${ctT(p, i === 0, foilCol(FOIL[i][0]))}}`).join(''), 40, y);
      const kEls = prods.map((p, i) => spans(L1, 'u3l4-k' + i)); hide(...kEls.flat());
      const fin = collect(prods), likes = likeGroups(prods);
      const L2 = wline(stage, `=${polyT(fin)}`, 40, y + 50, 'u3l4-ans'); hide(L2);
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
          run: async (c) => { negs.forEach((o) => [tEl(o.n, 1), ...spans(head, `u3l4-s${o.n}1`)].forEach((e) => e.classList.add('u3l4-negt'))); await pulse(c, head, 1.05); }
        });
      }
      if (foilM) {
        FOIL.forEach(([L, word], n) => steps.push({
          cap: `<b>${L}</b>${word.slice(1)}: the ${word.toLowerCase()} terms, ${pc(n)}.` + (n === 1 ? ' Outer = the two ends.' : n === 2 ? ' Inner = the two middle terms.' : '') + sn(n),
          run: (c) => go(c, n)
        }));
      } else {
        steps.push({ cap: `Treat ${T(`(${d.f2})`)} as one thing and distribute the first binomial: ${T(`(${d.f1})(${d.f2})=${fT(A[0])}(${d.f2})${A[1].c < 0 ? '-' : '+'}${bodyT(A[1])}(${d.f2})`)}. <b>Step 1</b> done.`, run: (c) => c.fadeIn(Ld, 400) });
        steps.push({ cap: `<b>Step 2:</b> distribute the ${T(termT(A[0], true))}: ${pc(0)} and ${pc(1)}.`, run: async (c) => { spans(Ld, 'u3l4-da')[0].classList.add('u3l4-hot'); await go(c, 0); await go(c, 1); } });
        steps.push({ cap: `Then distribute the ${T(termT(A[1], true))}: ${pc(2)} and ${pc(3)}.`, run: async (c) => { spans(Ld, 'u3l4-db')[0].classList.add('u3l4-hot'); await go(c, 2); await go(c, 3); } });
      }
      const likeTxt = likes.map((g) => T(`${g.map((i, j) => termT(prods[i], j === 0)).join('')}=${termT(collect(g.map((i) => prods[i]))[0] || { c: 0, v: {} }, true)}`)).join(' and ');
      steps.push({
        cap: (likes.length ? `<b>Combine</b> the like terms (the O and I products): ${likeTxt}. ` : `No like terms: no two products have the same variables. `) + `So ${T(`(${d.f1})(${d.f2})=${polyT(fin)}`)}.` + (prods[1].c + prods[2].c === 0 ? ' The O and I terms are <b>opposites</b>, so they cancel: <b>no middle term</b>!' : prods[1].c === prods[2].c && A[1].c === B[1].c ? ' The O and I terms are <b>the same</b>, so the middle term is <b>double</b> one of them.' : ''),
        run: async (c) => {
          if (likes.length) { const cl = likes.flat().map((n) => [FOIL[n][2], FOIL[n][3]]); await Promise.all(cl.map(([r, cI]) => pulse(c, gc[r][cI], 1.1))); cl.forEach(([r, cI]) => gc[r][cI].classList.add('like')); }
          if (likes.length) await c.fadeIn(L2, 420); else { L1.classList.add('u3l4-ans'); await pulse(c, L1, 1.04); }
        }
      });
      return steps;
    }
  };
}
/* ============ 1. One square, four pieces: (a + b)² ============ */
const SQ = {
  ab: { A: 'a', B: 'b', head: '(a+b)^2', p: ['a^2', 'ab', 'ab', 'b^2'], dbl: '2(a)(b)=2ab', comb: 'a^2+2ab+b^2', fin: '(a+b)^2=a^2+2ab+b^2', ra: 0.62 },
  x3: { A: 'x', B: '3', head: '(x+3)^2', p: ['x^2', '3x', '3x', '9'], dbl: '2(x)(3)=6x', comb: 'x^2+6x+9', fin: '(x+3)^2=x^2+6x+9', ra: 0.66 },
  n21: { A: '20', B: '1', q: '21^2', head: '21^2=(20+1)^2', p: ['400', '20', '20', '1'], dbl: '2(20)(1)=40', comb: '400+40+1=441', fin: '21^2=441', ra: 0.82, num: true,
    numCap: `The pattern: <b>square the first</b> (400), <b>double the product</b> (40), <b>square the last</b> (1). Forget the two strips and you get 401, not 441.` },
  a3: { A: 'x', B: '2', head: '(x+2)^2', p: ['x^2', '2x', '2x', '4'], dbl: '2(x)(2)=4x', comb: 'x^2+4x+4', fin: '(x+2)^2=x^2+4x+4', ra: 0.7 },
  b3: { A: 'x', B: '7', head: '(x+7)^2', p: ['x^2', '7x', '7x', '49'], dbl: '2(x)(7)=14x', comb: 'x^2+14x+49', fin: '(x+7)^2=x^2+14x+49', ra: 0.6 },
  c3: { A: '3x', B: '2', head: '(3x+2)^2', p: ['9x^2', '6x', '6x', '4'], dbl: '2(3x)(2)=12x', comb: '9x^2+12x+4', fin: '(3x+2)^2=9x^2+12x+4', ra: 0.7 },
  d3: { A: '2x', B: '5', head: '(2x+5)^2', p: ['4x^2', '10x', '10x', '25'], dbl: '2(2x)(5)=20x', comb: '4x^2+20x+25', fin: '(2x+5)^2=4x^2+20x+25', ra: 0.62 }
};
const squareSplit = {
  title: 'One square, four pieces',
  height: 430,
  minW: 966, // drawn this wide and scaled to fit beside the sidebar
  choices: [{ v: 'ab', label: tex('(a+b)^2') }, { v: 'x3', label: tex('(x+3)^2') }, { v: 'n21', label: tex('21^2') }, { sep: 'Example 3 check:' }, { v: 'a3', label: '(a)' }, { v: 'b3', label: '(b)' }, { v: 'c3', label: '(c)' }, { v: 'd3', label: '(d)' }],
  intro: (k) => { const d = SQ[k]; return `Here is a square with side ${T(`${d.A}+${d.B}`)}. Its area is ${T(d.num ? d.q : d.head)}. Let’s find that area <b>another way</b>, piece by piece.`; },
  make(stage, key, ex) {
    const W = ex.W, d = SQ[key], { A, B, p } = d, x0 = 106, y0 = 58, S = 304, pa = Math.round(S * d.ra), pb = S - pa;
    add(stage, box(h('div', 'u3l4-sqo'), S, S), x0, y0);
    const rects = [[x0, y0, pa, pa, 'aa'], [x0 + pa, y0, pb, pa, 'ab'], [x0, y0 + pa, pa, pb, 'ab'], [x0 + pa, y0 + pa, pb, pb, 'bb']];
    const pcs = rects.map(([x, y, w, ht, cls], i) => { const e = add(stage, box(h('div', 'u3l4-pc ' + cls, `<span>${K(p[i])}</span>`), w, ht), x, y); hide(e); return e; });
    const cutV = add(stage, box(h('div', 'u3l4-cut'), 3, S), x0 + pa - 1.5, y0), cutH = add(stage, box(h('div', 'u3l4-cut'), S, 3), x0, y0 + pa - 1.5);
    hide(cutV, cutH);
    const fullT = dimH(stage, x0, y0 - 18, S, `${A}+${B}`), fullL = dimV(stage, x0 - 18, y0, S, `${A}+${B}`);
    const splitT = [...dimH(stage, x0, y0 - 18, pa, A), ...dimH(stage, x0 + pa, y0 - 18, pb, B)];
    const splitL = [...dimV(stage, x0 - 18, y0, pa, A), ...dimV(stage, x0 - 18, y0 + pa, pb, B)];
    hide(...splitT, ...splitL);
    const px = x0 + S + 50, pw = W - px - 16;
    add(stage, h('div', 'u3l4-eq big', `${d.num ? '' : 'Area '}${K((d.num ? '' : '=') + d.head)}`), px, 44);
    const row = add(stage, h('div', 'u3l4-eq u3l4-row1'), px, 116);
    const eq1 = h('span', 'u3l4-eqs', K('=')); row.appendChild(eq1); hide(eq1);
    const cls = ['aa', 'ab', 'ab', 'bb'];
    const toks = p.map((t, i) => { const s = h('span', 'u3l4-tok ' + cls[i], K((i ? '+' : '') + t)); row.appendChild(s); hide(s); return s; });
    const comb = add(stage, h('div', 'u3l4-eq u3l4-comb', K('=' + d.comb)), px, 184); hide(comb);
    const rule = add(stage, h('div', 'u3l4-rule3'), px, 268); rule.style.width = pw + 'px';
    rule.innerHTML = [['square the first', p[0], 'aa'], ['double the product', d.dbl, 'ab'], ['square the last', p[3], 'bb']].map(([t, m, c]) => `<div class="u3l4-r3 ${c}"><b>${t}</b>${K(m)}</div>`).join('');
    const r3 = [...rule.children]; hide(...r3);
    const pop = (c, i) => Promise.all([c.anim(pcs[i], [{ opacity: 0, transform: 'scale(.92)' }, { opacity: 1, transform: 'scale(1)' }], 420), c.pop(toks[i], 380, { delay: 200 }), i ? null : c.fadeIn(eq1, 300)]);
    const by = (u, v) => `${T(u)} by ${T(v)}`;
    return [{
      cap: `Cut each side into two parts, ${T(A)} and ${T(B)}. The big square now has <b>four pieces</b>.`,
      run: (c) => Promise.all([c.anim(cutV, [{ opacity: 0, transform: 'scaleY(0)' }, { opacity: 1, transform: 'scaleY(1)' }], 500), c.anim(cutH, [{ opacity: 0, transform: 'scaleX(0)' }, { opacity: 1, transform: 'scaleX(1)' }], 500, { delay: 150 }),
        ...[...fullT, ...fullL].map((e) => fadeOut(c, e, 250)), ...[...splitT, ...splitL].map((e) => c.fadeIn(e, 350, { delay: 250 }))])
    }, {
      cap: `Top left: ${by(A, A)}, a square. Its area is <b>${T(p[0])}</b>.`, run: (c) => pop(c, 0)
    }, {
      cap: `Top right: ${by(A, B)}, a rectangle. Its area is <b>${T(p[1])}</b>.`, run: (c) => pop(c, 1)
    }, {
      cap: `Bottom left: ${by(B, A)}. It’s the <b>same rectangle</b>, turned on its side: another <b>${T(p[2])}</b>.`, run: (c) => pop(c, 2)
    }, {
      cap: `Bottom right: ${by(B, B)}, a small square: <b>${T(p[3])}</b>.`, run: (c) => pop(c, 3)
    }, {
      cap: `Add the four pieces. The two equal rectangles combine: ${T(d.dbl)}. So ${T(d.fin)}.`,
      run: (c) => Promise.all([pulse(c, pcs[1], 1.05), pulse(c, pcs[2], 1.05), pulse(c, toks[1], 1.2), pulse(c, toks[2], 1.2), c.fadeIn(comb, 450, { delay: 300 })])
    }, {
      cap: d.num ? d.numCap
        : `The shortcut: <b>square the first</b>, <b>double the product</b>, <b>square the last</b>. ${T(d.fin)}: three terms, every time.`,
      run: (c) => Promise.all(r3.map((e, i) => c.pop(e, 380, { delay: i * 220 })))
    }];
  }
};

/* ============ 1. The classic mistake: (a + b)² ≠ a² + b² ============ */
const classicError = {
  title: 'Where did the middle go?',
  height: 420,
  minW: 940, // drawn this wide and scaled to fit beside the sidebar
  choices: [{ v: '1,3', label: tex('(1+3)^2') }, { v: '3,4', label: tex('(3+4)^2') }, { v: '2,5', label: tex('(2+5)^2') }],
  intro: (k) => { const [a, b] = k.split(',').map(Number); return `Is ${T(`(${a}+${b})^2`)} the same as ${T(`${a}^2+${b}^2`)}? Count the small squares and see.`; },
  make(stage, key, ex) {
    const W = ex.W, H = 420, [a, b] = key.split(',').map(Number), n = a + b, cell = Math.min(n <= 4 ? 64 : 42, 320 / n), x0 = 78, gy = Math.round((H - n * cell) / 2) + 10;
    const reg = (i, j) => (i < a ? (j < a ? 'aa' : 'ab') : (j < a ? 'ba' : 'bb'));
    const cells = [];
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      const e = add(stage, box(h('div', 'u3l4-cell'), cell - 3, cell - 3), x0 + j * cell, gy + i * cell); e.dataset.r = reg(i, j); cells.push(e);
    }
    const ctr = (r0, c0, rr, cc) => [x0 + (c0 + cc / 2) * cell - 1.5, gy + (r0 + rr / 2) * cell - 1.5];
    const labs = { aa: [ctr(0, 0, a, a), a * a], ab: [ctr(0, a, a, b), a * b], ba: [ctr(a, 0, b, a), a * b], bb: [ctr(a, a, b, b), b * b] };
    const lab = {}; for (const k in labs) { const [[x, y], v] = labs[k]; lab[k] = add(stage, h('div', 'u3l4-clab c ' + k, String(v)), x, y); hide(lab[k]); }
    const dims = [...dimH(stage, x0, gy - 18, a * cell - 3, String(a)), ...dimH(stage, x0 + a * cell, gy - 18, b * cell - 3, String(b)),
      ...dimV(stage, x0 - 18, gy, a * cell - 3, String(a)), ...dimV(stage, x0 - 18, gy + a * cell, b * cell - 3, String(b))];
    const px = x0 + n * cell + 64;
    const L = (y, s, cls = '') => { const e = add(stage, h('div', 'u3l4-eq ' + cls, s), px, y); hide(e); return e; };
    const s2 = a * a + b * b;
    const L1 = L(48, K(`(${a}+${b})^2=${n}^2=${n * n}`) + ' <span class="u3l4-tag">the whole square</span>', 'big');
    const L2 = L(118, K(`${a}^2+${b}^2=${a * a}+${b * b}=${s2}`), 'bad');
    const st = add(stage, h('div', 'u3l4-stamp no', `≠ ${n * n}`), Math.min(px + (rel(stage, L2).w || 330) + 16, ex.W - 120), 112); hide(st);
    const L3 = L(188, K(`2\\times${a}\\times${b}=${2 * a * b}`) + ' <span class="u3l4-tag amb">missing</span>', 'amb');
    const L4 = L(258, K(`${a * a}+${2 * a * b}+${b * b}=${n * n}`) + ' <b class="ok">✓</b>', 'good');
    const L5 = L(330, K('(a+b)^2=a^2+\\boldsymbol{2ab}+b^2'), 'u3l4-boxed');
    const by = (r) => cells.filter((e) => e.dataset.r === r);
    return [{
      cap: `${T(`(${a}+${b})^2=${n}^2`)}: a ${n} by ${n} square holds <b>${n * n}</b> small squares.`,
      run: (c) => Promise.all([...cells.map((e, i) => c.anim(e, [{ transform: 'scale(1)' }, { transform: 'scale(1.25)' }, { transform: 'scale(1)' }], 300, { delay: i * Math.min(10, 600 / cells.length) })), c.fadeIn(L1, 400, { delay: 300 })])
    }, {
      cap: `The tempting shortcut: square each part and add, ${T(`${a}^2+${b}^2=${a * a}+${b * b}=${s2}`)}. That counts only the <b>two corner squares</b>, and ${s2} ≠ ${n * n}!`,
      run: async (c) => {
        by('aa').forEach((e) => e.classList.add('aa')); by('bb').forEach((e) => e.classList.add('bb')); [...by('ab'), ...by('ba')].forEach((e) => e.classList.add('ghost'));
        await Promise.all([c.pop(lab.aa, 380), c.pop(lab.bb, 380, { delay: 150 }), c.fadeIn(L2, 400, { delay: 200 })]);
        await stampIn(c, st);
      }
    }, {
      cap: `What got left out? Two ${a} by ${b} rectangles: ${T(`2\\times${a}\\times${b}=${2 * a * b}`)} small squares. They are the two ${T('ab')} pieces.`,
      run: async (c) => {
        const rs = [...by('ab'), ...by('ba')]; rs.forEach((e) => { e.classList.remove('ghost'); e.classList.add('ab'); });
        await Promise.all([...rs.map((e, i) => c.anim(e, [{ transform: 'scale(1)' }, { transform: 'scale(1.18)' }, { transform: 'scale(1)' }], 380, { delay: i * 10 })), c.pop(lab.ab, 380, { delay: 250 }), c.pop(lab.ba, 380, { delay: 400 }), c.fadeIn(L3, 400, { delay: 300 })]);
      }
    }, {
      cap: `Put them back: ${T(`${a * a}+${2 * a * b}+${b * b}=${n * n}`)} ✓. The <b>middle term</b> ${T('2ab')} is the two rectangles, and it never disappears: ${T('(a+b)^2=a^2+2ab+b^2')}.`,
      run: (c) => Promise.all([c.fadeIn(L4, 400), c.pop(L5, 450, { delay: 350 })])
    }];
  }
};

/* ============ 1. Squaring a difference: (a − b)² ============ */
const MS = {
  ab: { A: 'a', B: 'b', AA: 'a^2', AB: 'ab', BB: 'b^2', R: '(a-b)^2', side: 'a-b', comb: 'a^2-2ab+b^2', rb: 0.3 },
  x4: { A: 'x', B: '4', AA: 'x^2', AB: '4x', BB: '16', R: '(x-4)^2', side: 'x-4', comb: 'x^2-8x+16', rb: 0.3 },
  n: { A: '10', B: '3', AA: '100', AB: '30', BB: '9', R: '7^2=49', side: '7', comb: '100-60+9=49', rb: 0.3, num: true },
  b4: { A: 'x', B: '9', AA: 'x^2', AB: '9x', BB: '81', R: '(x-9)^2', side: 'x-9', comb: 'x^2-18x+81', rb: 0.34 },
  c4: { A: '4x', B: '1', AA: '16x^2', AB: '4x', BB: '1', R: '(4x-1)^2', side: '4x-1', comb: '16x^2-8x+1', rb: 0.22 },
  d4: { A: '3x', B: '4', AA: '9x^2', AB: '12x', BB: '16', R: '(3x-4)^2', side: '3x-4', comb: '9x^2-24x+16', rb: 0.32 }
};
const minusSquare = {
  title: 'Cut two strips, put the corner back',
  height: 440,
  minW: 940, // drawn this wide and scaled to fit beside the sidebar
  choices: [{ v: 'x4', label: tex('(x-4)^2') }, { v: 'ab', label: tex('(a-b)^2') }, { v: 'n', label: tex('(10-3)^2') }, { sep: 'Example 4 check:' }, { v: 'b4', label: '(b)' }, { v: 'c4', label: '(c)' }, { v: 'd4', label: '(d)' }],
  intro: (k) => { const d = MS[k]; return `We want ${T(`(${d.A}-${d.B})^2`)}. Start with a bigger square of side ${T(d.A)}: its area is ${T(d.AA)}. Then cut away what we don’t want.`; },
  make(stage, key, ex) {
    const W = ex.W, d = MS[key], x0 = 100, y0 = 82, S = 270, bw = Math.round(S * d.rb), r = S - bw, dx = bw + 26, dy = 48;
    const head = `(${d.A}-${d.B})^2`;
    add(stage, box(h('div', 'u3l4-sqo dash'), S, S), x0, y0);
    const rem = add(stage, box(h('div', 'u3l4-pc aa'), r, r), x0, y0 + bw);
    const s1 = add(stage, box(h('div', 'u3l4-pc aa'), bw, S), x0 + r, y0);
    const s2 = add(stage, box(h('div', 'u3l4-strip'), S, bw), x0, y0);
    const s2m = h('div', 'u3l4-pc aa'); box(s2m, r, bw); s2.appendChild(at(s2m, 0, 0));
    const s2g = h('div', 'u3l4-ghost'); box(s2g, bw, bw); s2.appendChild(at(s2g, r, 0)); hide(s2g);
    const s1lab = add(s1, h('div', 'u3l4-plab c', K(d.AB)), bw / 2, S / 2 + bw / 2); hide(s1lab);
    const s2lab = add(s2, h('div', 'u3l4-plab c', K(d.AB)), r / 2, bw / 2); hide(s2lab);
    const hot1 = add(s1, box(h('div', 'u3l4-hot c', K(d.BB)), bw - 6, bw - 6), bw / 2, bw / 2), hot2 = add(s2, box(h('div', 'u3l4-hot c', K(d.BB)), bw - 6, bw - 6), r + bw / 2, bw / 2);
    hide(hot1, hot2);
    const big = add(stage, h('div', 'u3l4-plab big c', K(d.AA)), x0 + S / 2, y0 + S / 2);
    const dimA = dimV(stage, x0 - 18, y0, S, d.A), botA = dimH(stage, x0, y0 + S + 6, S, d.A, { below: true });
    const botS = [...dimH(stage, x0, y0 + S + 6, r, d.side, { below: true }), ...dimH(stage, x0 + r, y0 + S + 6, bw, d.B, { below: true })]; hide(...botS);
    const leftS = [...dimV(stage, x0 - 18, y0, bw, d.B), ...dimV(stage, x0 - 18, y0 + bw, r, d.side)]; hide(...leftS);
    const px = x0 + S + dx + bw + 34;
    add(stage, h('div', 'u3l4-eq big', K(head)), px, 54);
    const row = add(stage, h('div', 'u3l4-eq u3l4-row1'), px, 124);
    const eq1 = h('span', 'u3l4-eqs', K('=')); row.appendChild(eq1); hide(eq1);
    const tk = [[d.AA, 'aa'], ['-' + d.AB, 'ab'], ['-' + d.AB, 'ab'], ['+' + d.BB, 'bb']].map(([t, c]) => { const s = h('span', 'u3l4-tok ' + c, K(t)); row.appendChild(s); hide(s); return s; });
    const comb = add(stage, h('div', 'u3l4-eq u3l4-comb', K('=' + d.comb)), px, 192); hide(comb);
    const note = add(stage, h('div', 'u3l4-note', `The two strips together took away ${K(d.BB)} <b>twice</b>, so one ${K(d.BB)} goes back.`), px, 272); note.style.width = (W - px - 18) + 'px'; hide(note);
    return [{
      cap: `Cut a strip ${T(d.B)} wide off the <b>right side</b>. It is ${T(d.A)} by ${T(d.B)}, so we take away <b>${T(d.AB)}</b>.`,
      run: async (c) => {
        s1.classList.replace('aa', 'ab');
        await Promise.all([c.fadeIn(eq1, 300), c.pop(tk[0], 300), c.fadeIn(s1lab, 300), moveTo(c, big, x0 + r / 2, y0 + bw + r / 2, 600)]);
        await Promise.all([moveTo(c, s1, x0 + r + dx, y0, 600), c.pop(tk[1], 380, { delay: 250 })]);
      }
    }, {
      cap: `Cut a strip off the <b>top</b>: another ${T(d.A)} by ${T(d.B)}, so take away <b>${T(d.AB)}</b> again. But its right end is already gone!`,
      run: async (c) => {
        s2m.classList.replace('aa', 'ab');
        await Promise.all([c.fadeIn(s2lab, 300), c.fadeIn(s2g, 300)]);
        await Promise.all([moveTo(c, s2, x0, y0 - dy, 600), c.pop(tk[2], 380, { delay: 250 })]);
      }
    }, {
      cap: `Look at the corner: it belongs to <b>both</b> strips. Taking away ${T(d.AB)} twice took that ${T(d.B)}-by-${T(d.B)} corner away <b>twice</b>.`,
      run: (c) => Promise.all([c.pop(hot1, 380), c.pop(hot2, 380, { delay: 200 }), c.fadeIn(note, 400, { delay: 300 })])
    }, {
      cap: `It was only there <b>once</b>, so <b>add it back once</b>: ${T('+' + d.BB)}.`,
      run: async (c) => { s2g.classList.add('back'); hot2.classList.add('back'); await Promise.all([pulse(c, hot2, 1.15), c.pop(tk[3], 380, { delay: 200 })]); }
    }, {
      cap: d.num ? `What’s left is a 7 by 7 square: ${T('100-30-30+9=49=7^2')} ✓. ${T('(a-b)^2=a^2-2ab+b^2')}: the middle term is <b>minus</b>, the last is <b>plus</b>.`
        : `What’s left is a square of side ${T(d.side)}: ${T(`${head}=${d.comb}`)}. Square the first, double the product (<b>subtract</b> it), square the last (<b>add</b> it).`,
      run: async (c) => {
        big.innerHTML = K(d.R); rem.classList.add('lit');
        await Promise.all([c.pop(big, 420), ...[...botA, ...dimA].map((e) => fadeOut(c, e, 250)), ...[...botS, ...leftS].map((e) => c.fadeIn(e, 350, { delay: 200 })), c.fadeIn(comb, 400, { delay: 300 })]);
      }
    }];
  }
};

/* ============ 1. Sum times difference: the middle cancels, and cut-and-move ============ */
const SD = {
  ab: { head: '(a+b)(a-b)', A: 'a', B: 'b', F: 'a^2', O: '-ab', I: '+ab', L: '-b^2', res: 'a^2-b^2', AA: 'a^2', ds: 'a^2-b^2' },
  x4: { head: '(x+4)(x-4)', A: 'x', B: '4', F: 'x^2', O: '-4x', I: '+4x', L: '-16', res: 'x^2-16', AA: 'x^2', ds: 'x^2-4^2' },
  n: { head: '(7+3)(7-3)', A: '7', B: '3', F: '49', O: '-21', I: '+21', L: '-9', res: '49-9=40', AA: '7^2', ds: '7^2-3^2', num: true, numQ: '10\\times4', numTxt: '10\\times4=40=49-9' },
  a2: { head: '(x+2)(x-2)', A: 'x', B: '2', F: 'x^2', O: '-2x', I: '+2x', L: '-4', res: 'x^2-4', AA: 'x^2', ds: 'x^2-2^2' },
  b2: { head: '(x-6)(x+6)', A: 'x', B: '6', F: 'x^2', O: '+6x', I: '-6x', L: '-36', res: 'x^2-36', AA: 'x^2', ds: 'x^2-6^2', swap: true },
  c2: { head: '(2x+1)(2x-1)', A: '2x', B: '1', F: '4x^2', O: '-2x', I: '+2x', L: '-1', res: '4x^2-1', AA: '(2x)^2', ds: '(2x)^2-1^2' },
  d2: { head: '(7-x)(7+x)', A: '7', B: 'x', F: '49', O: '+7x', I: '-7x', L: '-x^2', res: '49-x^2', AA: '7^2', ds: '7^2-x^2', swap: true }
};
const sumDiff = {
  title: 'Sum times difference: cancel, then cut and move',
  height: 450,
  minW: 820, // drawn this wide and scaled to fit beside the sidebar
  choices: [{ v: 'x4', label: tex('(x+4)(x-4)') }, { v: 'ab', label: tex('(a+b)(a-b)') }, { v: 'n', label: 'Warm-up: ' + tex('10\\times4') }, { sep: 'Example 2 check:' }, { v: 'a2', label: '(a)' }, { v: 'b2', label: '(b)' }, { v: 'c2', label: '(c)' }, { v: 'd2', label: '(d)' }],
  intro: (k) => { const d = SD[k]; return `Expand ${T(d.head)} with FOIL${d.num ? ` (that’s ${T(d.numQ)}, the warm-up rectangle)` : ''}, then look at it as an area.`; },
  make(stage, key, ex) {
    const W = ex.W, d = SD[key], { A, B } = d;
    const hd = add(stage, h('div', 'u3l4-eq big', K(d.head + '=')), 24, 26);
    const hw = rel(stage, hd).w || 220;
    const chipsX = 24 + hw + 14;
    const parts = [[d.F, 'F', 'aa'], [d.O, 'O', 'ab'], [d.I, 'I', 'ab'], [d.L, 'L', 'bb']];
    const chips = []; let cx = chipsX;
    parts.forEach(([t, f, cls]) => {
      const e = add(stage, h('div', 'u3l4-chip ' + cls, K(t) + `<small>${f}</small>`), cx, 22); const w = rel(stage, e).w || 90; e._x = cx; cx += w + 12; chips.push(e); hide(e);
    });
    const zp = add(stage, h('div', 'u3l4-zp c', 'zero pair'), (chips[1]._x + chips[2]._x + rel(stage, chips[2]).w) / 2, 106); hide(zp);
    const resE = add(stage, h('div', 'u3l4-eq u3l4-res', K(d.res)), chipsX, 26); hide(resE);
    // the picture
    const X0 = 112, Y0 = 186, S = 214, bw = Math.round(S * 0.35), r = S - bw;
    const sqo = add(stage, box(h('div', 'u3l4-sqo'), S, S), X0, Y0); hide(sqo);
    const top = add(stage, box(h('div', 'u3l4-pc aa'), S, r), X0, Y0);
    const bot = add(stage, box(h('div', 'u3l4-pc aa'), r, bw), X0, Y0 + r);
    const cor = add(stage, box(h('div', 'u3l4-pc bb'), bw, bw), X0 + r, Y0 + r);
    const lab = add(stage, h('div', 'u3l4-plab big c', K(d.AA)), X0 + S / 2, Y0 + (S - bw) / 2);
    hide(top, bot, cor, lab);
    const cut = add(stage, box(h('div', 'u3l4-cutd'), r, 0), X0, Y0 + r); hide(cut);
    const dT = dimH(stage, X0, Y0 - 18, S, A), dL = dimV(stage, X0 - 18, Y0, S, A);
    const dC = [...dimH(stage, X0 + r, Y0 + S + 6, bw, B, { below: true }), ...dimV(stage, X0 + S + 6, Y0 + r, bw, B, { right: true })];
    hide(...dT, ...dL, ...dC);
    const fT = dimH(stage, X0, Y0 - 18, S + bw, `${A}+${B}`), fL = dimV(stage, X0 - 18, Y0, r, `${A}-${B}`);
    hide(...fT, ...fL);
    const px = Math.min(500, W - 386), pw = W - px - 20; // narrower stages (beside the sidebar): the notes move left and stack by height
    const P1 = add(stage, h('div', 'u3l4-note', `<b>Before:</b> a square with a corner cut out. Area ${KN(d.ds)}.`), px, px < 500 ? 160 : 196); P1.style.width = pw + 'px';
    const P2 = add(stage, h('div', 'u3l4-note', `<b>After:</b> one rectangle, ${KN(`${A}+${B}`)} long and ${KN(`${A}-${B}`)} tall. Area ${KN(d.head)}.`), px, 270); P2.style.width = pw + 'px';
    const P3 = add(stage, h('div', 'u3l4-eq u3l4-boxed', K(`${d.head}=${d.ds}`)), px, 352);
    if (px < 500) {
      P2.style.top = Math.max(270, P1.offsetTop + P1.offsetHeight + 10) + 'px'; P3.style.top = Math.max(352, P2.offsetTop + P2.offsetHeight + 12) + 'px';
      if (P3.offsetWidth > pw) P3.style.fontSize = Math.floor(26 * (pw - 40) / (P3.offsetWidth - 40)) + 'px';
    }
    hide(P1, P2, P3);
    return [{
      cap: `FOIL gives four products: <b>F</b> ${T(d.F)}, <b>O</b> ${T(d.O)}, <b>I</b> ${T(d.I)}, <b>L</b> ${T(d.L)}.`,
      run: (c) => Promise.all(chips.map((e, i) => c.pop(e, 360, { delay: i * 160 })))
    }, {
      cap: `The middle terms ${T(d.O)} and ${T(d.I)} are <b>opposites</b>: a zero pair. They cancel, leaving ${T(d.res)}, a <b>difference of squares</b>.`,
      run: async (c) => {
        const m = (chips[1]._x + chips[2]._x) / 2;
        await Promise.all([c.fadeIn(zp, 300), moveTo(c, chips[1], m - 10, 22, 500), moveTo(c, chips[2], m + 10, 22, 500)]);
        await Promise.all([fadeOut(c, chips[1], 350), fadeOut(c, chips[2], 350), fadeOut(c, zp, 350), fadeOut(c, chips[0], 300, { delay: 200 }), fadeOut(c, chips[3], 300, { delay: 200 })]);
        await c.fadeIn(resE, 400);
      }
    }, {
      cap: `Now picture it. A square of side ${T(A)} has area ${T(d.AA)}. Cut a ${T(B)}-by-${T(B)} square out of the corner: what’s left has area <b>${T(d.ds)}</b>.`,
      run: async (c) => {
        await Promise.all([c.fadeIn(sqo, 200), c.fadeIn(top, 350), c.fadeIn(bot, 350), c.fadeIn(cor, 350), c.fadeIn(lab, 350), ...[...dT, ...dL, ...dC].map((e) => c.fadeIn(e, 350))]);
        cor.classList.add('gone'); lab.innerHTML = K(d.ds);
        await Promise.all([c.anim(cor, [{ opacity: 1 }, { opacity: 0.85 }], 400), pulse(c, lab, 1.12), c.fadeIn(P1, 400)]);
      }
    }, {
      cap: `Cut the L-shape along the dashed line into <b>two rectangles</b>: a long one, ${T(A)} by ${T(`${A}-${B}`)}, and a short one, ${T(`${A}-${B}`)} by ${T(B)}.`,
      run: async (c) => {
        await c.fadeIn(cut, 300);
        await Promise.all([moveTo(c, bot, X0, Y0 + r + 18, 450), fadeOut(c, lab, 250), fadeOut(c, cor, 300), fadeOut(c, sqo, 300), ...[...dT, ...dL, ...dC].map((e) => fadeOut(c, e, 250))]);
      }
    }, {
      cap: `Turn the short piece and slide it onto the right end. Now it’s <b>one rectangle</b>, ${T(`${A}+${B}`)} long and ${T(`${A}-${B}`)} tall.`,
      run: async (c) => {
        const cx0 = X0 + r / 2, cy0 = Y0 + r + 18 + bw / 2, cx1 = X0 + S + bw / 2, cy1 = Y0 + r / 2;
        await c.anim(bot, [{ transform: 'none' }, { transform: `translate(${cx1 - cx0}px, ${cy1 - cy0}px) rotate(90deg)` }], 900);
        await Promise.all([fadeOut(c, cut, 200), ...[...fT, ...fL].map((e) => c.fadeIn(e, 350)), c.fadeIn(P2, 400, { delay: 150 })]);
      }
    }, {
      cap: `Same pieces, same area: ${T(`${d.head}=${d.ds}`)}${d.num ? `. With numbers: ${T(d.numTxt)} ✓` : ''}. The sum times the difference is the <b>difference of the squares</b>.`,
      run: (c) => Promise.all([c.pop(P3, 450), pulse(c, top, 1.03), pulse(c, bot, 1.03)])
    }];
  }
};

/* ============ 1. Which pattern is this? ============ */
const RZ = {
  n1: { e: '(y+6)(y-6)', ec: `(${cA('y')}+${cB('6')})(${cA('y')}-${cB('6')})`, t: `First terms ${T('y')} and ${T('y')}; second terms ${T('6')} and ${T('6')}.`, same: true, kind: 'sd', lines: ['=y^2-6^2'], ans: 'y^2-36' },
  n2: { e: '(2y+3)^2', ec: `(${cA('2y')}+${cB('3')})(${cA('2y')}+${cB('3')})`, rw: true, t: `A square is the bracket <b>times itself</b>. First terms ${T('2y')} and ${T('2y')}; second terms ${T('3')} and ${T('3')}.`, same: true, kind: 'sq', lines: ['=(2y)^2+2(2y)(3)+3^2'], ans: '4y^2+12y+9' },
  n3: { e: '(x+2)(x+6)', ec: `(${cA('x')}+${cB('2')})(${cA('x')}+${cB('6')})`, t: `First terms ${T('x')} and ${T('x')}; second terms ${T('2')} and ${T('6')}.`, same: false, diff: `${T('2')} and ${T('6')}`, kind: 'no', lines: ['=x^2+6x+2x+12'], ans: 'x^2+8x+12' },
  n4: { e: '(x-3)(x-3)', ec: `(${cA('x')}-${cB('3')})(${cA('x')}-${cB('3')})`, t: `First terms ${T('x')} and ${T('x')}; second terms ${T('3')} and ${T('3')}. It is the same binomial twice: ${T('(x-3)^2')}.`, same: true, kind: 'sq', lines: ['=x^2-2(x)(3)+3^2'], ans: 'x^2-6x+9' },
  a: { e: '(x+5)(x-5)', ec: `(${cA('x')}+${cB('5')})(${cA('x')}-${cB('5')})`, t: `First terms ${T('x')} and ${T('x')}; second terms ${T('5')} and ${T('5')}.`, same: true, kind: 'sd', lines: ['=x^2-5^2'], ans: 'x^2-25' },
  b: { e: '(x+8)^2', ec: `(${cA('x')}+${cB('8')})(${cA('x')}+${cB('8')})`, rw: true, t: `The bracket times itself. First terms ${T('x')}; second terms ${T('8')}.`, same: true, kind: 'sq', lines: ['=x^2+2(x)(8)+8^2'], ans: 'x^2+16x+64' },
  c: { e: '(x-3)(x+9)', ec: `(${cA('x')}-${cB('3')})(${cA('x')}+${cB('9')})`, t: `First terms ${T('x')} and ${T('x')}; second terms ${T('3')} and ${T('9')}.`, same: false, diff: `${T('3')} and ${T('9')}`, kind: 'no', lines: ['=x^2+9x-3x-27'], ans: 'x^2+6x-27' },
  d: { e: '(x-10)^2', ec: `(${cA('x')}-${cB('10')})(${cA('x')}-${cB('10')})`, rw: true, t: `The bracket times itself. First terms ${T('x')}; second terms ${T('10')}.`, same: true, kind: 'sq', lines: ['=x^2-2(x)(10)+10^2'], ans: 'x^2-20x+100' },
  e: { e: '(3x+2)(3x-2)', ec: `(${cA('3x')}+${cB('2')})(${cA('3x')}-${cB('2')})`, t: `First terms ${T('3x')} and ${T('3x')}; second terms ${T('2')} and ${T('2')}.`, same: true, kind: 'sd', lines: ['=(3x)^2-2^2'], ans: '9x^2-4' },
  f: { e: '(2x-7)^2', ec: `(${cA('2x')}-${cB('7')})(${cA('2x')}-${cB('7')})`, rw: true, t: `The bracket times itself. First terms ${T('2x')}; second terms ${T('7')}.`, same: true, kind: 'sq', lines: ['=(2x)^2-2(2x)(7)+7^2'], ans: '4x^2-28x+49' }
};
const BINS = [['sq', 'Perfect square trinomial', '(a\\pm b)^2=a^2\\pm2ab+b^2'], ['sd', 'Difference of squares', '(a+b)(a-b)=a^2-b^2'], ['no', 'Neither: just FOIL', '\\text{all four products}']];
const recognizer = {
  title: 'Which pattern is this?',
  height: 470,
  minW: 860, // drawn this wide and scaled to fit beside the sidebar
  choices: [{ v: 'n1', label: tex('(y+6)(y-6)') }, { v: 'n2', label: tex('(2y+3)^2') }, { v: 'n3', label: tex('(x+2)(x+6)') }, { v: 'n4', label: tex('(x-3)(x-3)') },
    { sep: 'Example 5 check:' }, ...'abcdef'.split('').map((k) => ({ v: k, label: `(${k})` }))],
  intro: (k) => `Which pattern fits ${T(RZ[k].e)}? Check the <b>terms</b> first, then the <b>signs</b>.`,
  make(stage, key, ex) {
    const W = ex.W, d = RZ[key];
    const ex0 = add(stage, h('div', 'u3l4-rz-e c', K(d.e)), W / 2, 44);
    const q1 = add(stage, h('div', 'u3l4-rz-q', '<span class="u3l4-qn">1</span> Same two terms in both brackets? <b class="u3l4-qa"></b>'), 24, 96);
    const q2 = add(stage, h('div', 'u3l4-rz-q', '<span class="u3l4-qn">2</span> Signs: the same, or opposite? <b class="u3l4-qa"></b>'), 24, 140);
    const bw = (W - 48 - 28) / 3;
    const bins = BINS.map(([k, t, f], i) => { const e = add(stage, box(h('div', 'u3l4-bin ' + k, `<b>${t}</b>${K(f)}`), bw, 78), 24 + i * (bw + 14), 190); e.dataset.k = k; return e; });
    const lines = add(stage, h('div', 'u3l4-rz-lines'), 24, 290); lines.style.width = (W - 48) + 'px';
    const ls = d.lines.map((s) => { const e = h('div', 'u3l4-rz-l', K(s)); lines.appendChild(e); hide(e); return e; });
    const ans = h('div', 'u3l4-rz-ans', K(`${d.e}=\\boldsymbol{${d.ans}}`)); lines.appendChild(ans); hide(ans);
    const a1 = q1.querySelector('.u3l4-qa'), a2 = q2.querySelector('.u3l4-qa');
    const bin = bins.find((b) => b.dataset.k === d.kind);
    const wrt = d.rw ? `${d.e}=${d.pre ? d.pre + '=' : ''}${d.ec}` : d.ec;
    return [{
      cap: d.t,
      run: async (c) => { ex0.innerHTML = K(wrt); await c.fadeIn(ex0, 350); }
    }, {
      cap: d.same ? 'The <b>same two terms</b> appear in both brackets ✓, so one of the patterns might fit.' : `The second terms are <b>different</b> (${d.diff}) ✗. Neither pattern can fit: no shortcut.`,
      run: async (c) => { a1.textContent = d.same ? '✓ yes' : '✗ no'; a1.className = 'u3l4-qa ' + (d.same ? 'ok' : 'red'); await c.pop(a1, 360); }
    }, {
      cap: d.kind === 'sq' ? 'The signs are the <b>same</b>: it’s one binomial times itself. That’s a <b>perfect square trinomial</b>.'
        : d.kind === 'sd' ? 'The signs are <b>opposite</b>, one + and one −. That’s a <b>difference of squares</b>.' : 'Not a pattern, so just <b>FOIL</b> it, then collect like terms.',
      run: async (c) => {
        if (d.kind !== 'no') { a2.textContent = d.kind === 'sq' ? 'the same' : 'opposite'; a2.className = 'u3l4-qa ok'; } else { a2.textContent = '(no need)'; a2.className = 'u3l4-qa muted'; }
        bins.forEach((b) => b.classList.toggle('dim', b !== bin)); bin.classList.add('on');
        await Promise.all([c.pop(a2, 300), pulse(c, bin, 1.06)]);
      }
    }, {
      cap: d.kind === 'sq' ? '<b>Square the first, double the product, square the last.</b> Brackets keep each whole term together.'
        : d.kind === 'sd' ? '<b>First squared minus last squared.</b> There’s no middle term.' : '<b>First, Outer, Inner, Last</b>: all four products.',
      run: (c) => Promise.all(ls.map((e, i) => c.fadeIn(e, 380, { delay: i * 300 })))
    }, {
      cap: `${T(`${d.e}=${d.ans}`)}.${d.kind === 'sq' ? ' Three terms.' : d.kind === 'sd' ? ' Two terms: a difference of squares.' : ' Three terms, but no pattern: the middle term came from FOIL.'}`,
      run: (c) => c.pop(ans, 420)
    }];
  }
};

/* ============ 1. Mental math ============ */
const MM = {
  s21: { q: '21^2', A: 20, B: 1, s: 1 },
  p4951: { q: '49\\times51', m: 50, dd: 1 }, p98: { q: '98\\times102', m: 100, dd: 2 }, p1921: { q: '19\\times21', m: 20, dd: 1 }, p2931: { q: '29\\times31', m: 30, dd: 1 }
};
const mental = {
  title: 'Mental math with the patterns',
  height: 392,
  choices: [{ v: 'p4951', label: 'The big one: ' + tex('49\\times51') }, { v: 'p98', label: 'The race: ' + tex('98\\times102') }, { v: 'p1921', label: tex('19\\times21') }, { v: 'p2931', label: tex('29\\times31') }, { v: 's21', label: tex('21^2') }],
  intro: (k) => `Work out ${T(MM[k].q)} in your head. First find a <b>friendly number</b> close by.`,
  make(stage, key, ex) {
    const W = ex.W, d = MM[key];
    const q = add(stage, h('div', 'u3l4-mm-q', K(d.q + '=\\ ?')), 24, 18);
    if (d.A) {
      const { A, B, s } = d, n = A + s * B, sg = s > 0 ? '+' : '-';
      const split = add(stage, h('div', 'u3l4-eq big', K(`${d.q}=(${A}${sg}${B})^2`)), 24, 104); hide(split);
      const cw = (W - 48 - 28) / 3;
      const cards = [['square the first', `${A}^2=${tn(A * A)}`, 'aa'], ['double the product', `2(${A})(${B})=${tn(2 * A * B)}`, 'ab'], ['square the last', `${B}^2=${B * B}`, 'bb']]
        .map(([t, m, cls], i) => { const e = add(stage, box(h('div', 'u3l4-mm-card ' + cls, `<b>${t}</b>${K(m)}`), cw, 92), 24 + i * (cw + 14), 176); hide(e); return e; });
      const sum = add(stage, h('div', 'u3l4-eq big', K(`${d.q}=${tn(A * A)}${sg}${tn(2 * A * B)}+${B * B}=\\boldsymbol{${tn(n * n)}}`)), 24, 300); hide(sum);
      return [{
        cap: `${n} is ${B} ${s > 0 ? 'more' : 'less'} than ${A}, so ${T(`${d.q}=(${A}${sg}${B})^2`)}: the ${s > 0 ? 'square of a sum' : 'square of a difference'}.`,
        run: (c) => c.fadeIn(split, 400)
      }, {
        cap: `<b>Square the first:</b> ${T(`${A}^2=${tn(A * A)}`)}. Friendly numbers make this easy.`, run: (c) => c.pop(cards[0], 400)
      }, {
        cap: `<b>Double the product:</b> ${T(`2(${A})(${B})=${tn(2 * A * B)}`)}. It gets ${s > 0 ? '<b>added</b>' : '<b>subtracted</b>'}, because the bracket has a ${s > 0 ? '+' : '−'}.`, run: (c) => c.pop(cards[1], 400)
      }, {
        cap: `<b>Square the last:</b> ${T(`${B}^2=${B * B}`)}. It’s always <b>added</b>.`, run: (c) => c.pop(cards[2], 400)
      }, {
        cap: `${T(`${tn(A * A)}${sg}${tn(2 * A * B)}+${B * B}=${tn(n * n)}`)}. So ${T(`${d.q}=${tn(n * n)}`)}.`,
        run: async (c) => { q.innerHTML = K(`${d.q}=\\boldsymbol{${tn(n * n)}}`); await Promise.all([c.fadeIn(sum, 400), c.pop(q, 400, { delay: 200 })]); }
      }];
    }
    const { m, dd } = d, lo = m - dd, hi = m + dd, pad = Math.max(2, dd + 1), from = m - dd - pad, to = m + dd + pad;
    const nlx0 = 60, nlx1 = W - 60, ny = 160, X = (v) => nlx0 + (v - from) / (to - from) * (nlx1 - nlx0);
    const nl = add(stage, box(h('div', 'u3l4-nl'), nlx1 - nlx0, 3), nlx0, ny); hide(nl);
    const ticks = [];
    for (let v = from; v <= to; v++) { const t = add(stage, h('div', 'u3l4-tick c' + (v === m ? ' mid' : v === lo || v === hi ? ' fac' : ''), `<span>${v}</span>`), X(v), ny + 1); ticks.push(t); }
    hide(...ticks);
    const svg = add(stage, svgEl('svg', { class: 'u3l4-arcs' }), 0, 0); box(svg, W, 392);
    const arc = (a, b) => { const p = svgEl('path', { d: `M ${X(a)} ${ny - 8} Q ${(X(a) + X(b)) / 2} ${ny - 70} ${X(b)} ${ny - 8}`, class: 'u3l4-arc' }); svg.appendChild(p); return p; };
    const arcs = [arc(m, lo), arc(m, hi)];
    const al = [add(stage, h('div', 'u3l4-arcl c', '−' + dd), (X(m) + X(lo)) / 2, ny - 54), add(stage, h('div', 'u3l4-arcl c', '+' + dd), (X(m) + X(hi)) / 2, ny - 54)];
    hide(...arcs, ...al);
    const l2 = add(stage, h('div', 'u3l4-eq big', K(`${d.q}=(${m}-${dd})(${m}+${dd})`)), 24, 222);
    const l3 = add(stage, h('div', 'u3l4-eq big', K(`=${m}^2-${dd}^2=${tn(m * m)}-${dd * dd}`)), 24, 280);
    const l4 = add(stage, h('div', 'u3l4-eq big', K(`=\\boldsymbol{${tn(m * m - dd * dd)}}`)), 24, 336);
    hide(l2, l3, l4);
    return [{
      cap: `${lo} and ${hi} are the <b>same distance</b> from ${m}: ${dd} below and ${dd} above. ${m} is right in the middle.`,
      run: async (c) => {
        await Promise.all([c.fadeIn(nl, 300), ...ticks.map((t, i) => c.fadeIn(t, 250, { delay: i * 30 }))]);
        await Promise.all(arcs.map((p, i) => { const L = p.getTotalLength ? p.getTotalLength() || 200 : 200; p.style.strokeDasharray = L; return c.anim(p, [{ opacity: 1, strokeDashoffset: L }, { opacity: 1, strokeDashoffset: 0 }], 600, { delay: i * 200 }); }).concat(al.map((e, i) => c.pop(e, 300, { delay: 400 + i * 200 }))));
      }
    }, {
      cap: `So ${T(`${d.q}=(${m}-${dd})(${m}+${dd})`)}: a <b>sum times a difference</b> of the same two numbers.`, run: (c) => c.fadeIn(l2, 400)
    }, {
      cap: `The middle terms cancel, so it’s the <b>difference of squares</b>: ${T(`${m}^2-${dd}^2=${tn(m * m)}-${dd * dd}`)}.`, run: (c) => c.fadeIn(l3, 400)
    }, {
      cap: `${T(`${d.q}=${tn(m * m - dd * dd)}`)}.${key === 'p4951' ? ' Exactly one less than ' + T('50\\times50') + ': the 1 by 1 corner from the warm-up.' : ' No long multiplication needed.'}`,
      run: async (c) => { q.innerHTML = K(`${d.q}=\\boldsymbol{${tn(m * m - dd * dd)}}`); await Promise.all([c.fadeIn(l4, 400), c.pop(q, 400, { delay: 200 })]); }
    }];
  }
};

const foilRecall = makeFoil('FOIL, one more time', [{ sep: 'Example 1 check:' }, { v: 'e1', label: tex('(x+3)(x+5)') }, { sep: 'Sneak peek:' }, { v: 'p1', label: tex('(x+4)(x-4)') }, { v: 'p2', label: tex('(x+3)(x+3)') }], 'e1', true);

/* ============ warm-up: the square that lost a corner ============ */
function mountCorner() {
  const host = document.getElementById('u3l4-corner'); if (!host) return;
  const SIZES = [[7, 3], [10, 2], [6, 1]];
  host.innerHTML = `<div class="u3l4-cn-top no-ink">${SIZES.map(([n, k], i) => `<button type="button" class="chip${i ? '' : ' on'}" data-sz="${i}" title="${n} by ${n} square, ${k} by ${k} corner">${n} &amp; ${k}</button>`).join('')}<span class="u3l4-cn-gap"></span><button type="button" class="pill" data-go="1">✂ Cut the corner</button><button type="button" class="pill" data-go="2">↻ Slide &amp; turn</button>
      <button class="exb" type="button" data-go="0" title="Start over" aria-label="Start over"><svg viewBox="0 0 24 24"><path d="M4 12a8 8 0 1 0 2.4-5.7"/><path d="M4 4v4h4"/></svg></button></div>
    <div class="u3l4-cn-pic"></div>
    <div class="u3l4-cn-say" aria-live="polite"></div>`;
  const pic = host.querySelector('.u3l4-cn-pic'), say = host.querySelector('.u3l4-cn-say');
  const st = { i: 0, s: 0 };
  const draw = () => {
    const [N, k] = SIZES[st.i], u = Math.min(24, 290 / (N + k)), P = 34, W = P * 2 + (N + k) * u, H = P + 26 + N * u;
    const grid = (x0, y0, w, hh, cls) => {
      let g = `<rect class="u3l4-cn-p ${cls}" x="${x0 * u}" y="${y0 * u}" width="${w * u}" height="${hh * u}"/>`;
      for (let i = 1; i < w; i++) g += `<path class="u3l4-cn-gl ${cls}" d="M${(x0 + i) * u} ${y0 * u}v${hh * u}"/>`;
      for (let j = 1; j < hh; j++) g += `<path class="u3l4-cn-gl ${cls}" d="M${x0 * u} ${(y0 + j) * u}h${w * u}"/>`;
      return g + `<rect class="u3l4-cn-o ${cls}" x="${x0 * u}" y="${y0 * u}" width="${w * u}" height="${hh * u}"/>`;
    };
    const t = (x, y, s, cls = '') => `<text class="u3l4-cn-t ${cls}" x="${x}" y="${y}">${s}</text>`;
    pic.innerHTML = `<svg viewBox="${-P} ${-P + 4} ${W} ${H}" width="${W}" height="${H}" class="u3l4-cn-svg s${st.s}">
      <g class="u3l4-cn-y">${grid(0, k, N, N - k, 'y')}</g>
      <g class="u3l4-cn-cut">${grid(N - k, 0, k, k, 'r')}</g>
      <rect class="u3l4-cn-hole" x="${(N - k) * u}" y="0" width="${k * u}" height="${k * u}"/>
      <g class="u3l4-cn-b" style="--dx:${(N / 2 + k) * u}px;--dy:${(N / 2) * u}px">${grid(0, 0, N - k, k, 'b')}</g>
      <g class="u3l4-cn-l0">${t(N * u / 2, N * u + 24, N)}${t(-12, N * u / 2 + 7, N, 'e')}</g>
      <g class="u3l4-cn-l1">${t((N - k / 2) * u, -8, k, 'red')}${t(N * u + 10, k * u / 2 + 7, k, 'red s')}</g>
      <g class="u3l4-cn-l2">${t((N + k) * u / 2, N * u + 24, `${N} + ${k} = ${N + k}`, 'red')}${t(-12, (N + k) * u / 2 + 7, `${N - k}`, 'red e')}</g>
    </svg>`;
    const txt = [`A ${N} by ${N} square: <b>${N * N}</b> small squares.`,
      `Cut out the ${k} by ${k} corner: ${N * N} − ${k * k} = <b>${N * N - k * k}</b> squares left.`,
      `Now it is a <b>${N + k} by ${N - k}</b> rectangle: ${N + k} × ${N - k} = <b>${(N + k) * (N - k)}</b>. The same squares, just moved!`];
    say.innerHTML = txt[st.s];
    host.querySelectorAll('[data-sz]').forEach((b) => b.classList.toggle('on', +b.dataset.sz === st.i));
  };
  host.querySelectorAll('[data-sz]').forEach((b) => b.addEventListener('click', () => { st.i = +b.dataset.sz; st.s = 0; draw(); }));
  host.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => {
    const g = +b.dataset.go; st.s = g === 2 ? 2 : g === 1 ? (st.s === 2 ? 2 : 1) : 0;
    const svg = pic.querySelector('svg'); svg.classList.remove('s0', 's1', 's2'); svg.classList.add('s' + st.s);
    const [N, k] = SIZES[st.i];
    say.innerHTML = [`A ${N} by ${N} square: <b>${N * N}</b> small squares.`, `Cut out the ${k} by ${k} corner: ${N * N} − ${k * k} = <b>${N * N - k * k}</b> squares left.`, `Now it is a <b>${N + k} by ${N - k}</b> rectangle: ${N + k} × ${N - k} = <b>${(N + k) * (N - k)}</b>. The same squares, just moved!`][st.s];
  }));
  draw();
}

/* ============ wiring ============ */
function mountExplainers() {
  const defs = { foilRecall, sumDiff, mental, squareSplit, classicError, minusSquare, recognizer };
  const all = [...document.querySelectorAll('[data-explainer]')].map((el) => new Explainer(el, defs[el.dataset.explainer]));
  // chips are laid out by measuring KaTeX widths: once the math fonts arrive, redraw any explainer still at its start
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => all.forEach((x) => { if (x.steps && x.k === 0 && !x.running) x.build(0); }));
}

mountCorner(); mountExplainers();

/* ============ Stand Up Break! (lessons/js/standup.js) ============
 * Name the pattern, then expand. A binomial is m·v + b (m > 0, b ≠ 0), written as LaTeX by bn(). */
const coef = (m, v) => (m === 1 ? v : m + v);
const bn = (m, v, b) => `${coef(m, v)}${b < 0 ? '-' : '+'}${Math.abs(b)}`;
const sq = (m, v) => (m === 1 ? `${v}^2` : `(${m}${v})^2`);
const polyS = (A, B, C, v) => [[A, `${v}^{2}`], [B, v], [C, '']].filter(([c]) => c).map(([c, s], i) => (c < 0 ? '-' : i ? '+' : '') + (Math.abs(c) === 1 && s ? '' : Math.abs(c)) + s).join('');
function suSq(m, v, b) { // (mv ± b)²
  const sg = b < 0 ? '-' : '+', a = Math.abs(b);
  return { q: `(${bn(m, v, b)})^2`, atext: '<b>Perfect square trinomial</b>: square the first, double the product, square the last.',
    a: [`=${sq(m, v)}${sg}2(${coef(m, v)})(${a})+${a}^2`, '=' + polyS(m * m, 2 * m * b, b * b, v)] };
}
function suSd(m, v, a, flip, rev) { // (mv + a)(mv − a), either order; rev: (a − mv)(a + mv)
  if (rev) return { q: `(${a}-${coef(m, v)})(${a}+${coef(m, v)})`, atext: '<b>Difference of squares</b>: first squared minus last squared, no middle term.', a: [`=${a}^2-${sq(m, v)}`, `=${a * a}-${m === 1 ? '' : m * m}${v}^{2}`] };
  const p = `(${bn(m, v, a)})`, n = `(${bn(m, v, -a)})`;
  return { q: flip ? n + p : p + n, atext: '<b>Difference of squares</b>: first squared minus last squared, no middle term.', a: [`=${sq(m, v)}-${a}^2`, '=' + polyS(m * m, 0, -a * a, v)] };
}
function suNo(m, v, b, p, d) { // (mv + b)(pv + d), not a pattern
  return { q: `(${bn(m, v, b)})(${bn(p, v, d)})`, atext: '<b>Neither</b>: just FOIL, then collect.',
    a: [`=${polyS(m * p, 0, 0, v)}${polyS(0, m * d, 0, v).replace(/^(?=[^-])/, '+')}${polyS(0, b * p, 0, v).replace(/^(?=[^-])/, '+')}${polyS(0, 0, b * d, v).replace(/^(?=[^-])/, '+')}`, '=' + polyS(m * p, m * d + b * p, b * d, v)] };
}
standup('u3l4', {
  intro: 'At your whiteboard station: first name the pattern (difference of squares, perfect square trinomial, or neither), then expand.',
  levels: {
    /* x only: (x + a)(x − a), (x ± a)² */
    BEG: (r) => {
      const v = r.pick(['x', 'x', 'x', 'y', 'n', 'a']), a = r.int(1, 12), k = r.pick(['sd', 'sq', 'sq']);
      return k === 'sd' ? suSd(1, v, a, r.chance(0.5)) : suSq(1, v, a * r.sign());
    },
    /* a coefficient on the variable, or the number first */
    PRG: (r) => {
      const v = r.pick(['x', 'x', 'y', 'm']), m = r.int(2, 5), a = r.int(1, 9), k = r.pick(['sd', 'sq', 'sq', 'rev']);
      if (k === 'rev') return suSd(1, v, r.int(2, 12), false, true);
      return k === 'sd' ? suSd(m, v, a, r.chance(0.5)) : suSq(m, v, a * r.sign());
    },
    /* mixed: decide first; some are neither pattern */
    MAS: (r) => {
      const v = r.pick(['x', 'x', 'a', 'y']), k = r.pick(['sd', 'sq', 'no', 'no', 'sq']);
      if (k === 'no') { // a near miss: looks like a pattern, but the numbers differ
        for (;;) {
          const m = r.int(1, 4), b = r.int(2, 9) * r.sign(), d = -Math.sign(b) * (Math.abs(b) + r.pick([-1, 1, 2, 3]));
          if (!d || Math.abs(d) === Math.abs(b)) continue;
          return suNo(m, v, b, m, d);
        }
      }
      const m = r.int(2, 6), a = r.int(1, 9);
      return k === 'sd' ? suSd(m, v, a, r.chance(0.5)) : suSq(m, v, a * r.sign());
    }
  }
});
