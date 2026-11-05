/* Math 15 · Unit 1 · Lesson 4 — Classifying Numbers in the Real Number System: the explainers, "The Number Club"
 * warm-up, the Example 4 check table, the Example 5 number lines, the π history box and the Stand Up Break.
 * Long division, the stripes and the flowchart are adapted from the Math 10C Lesson 1.4 page; the set diagram is drawn
 * as nested rectangles like Ryan's Math 15 booklet. Classes used only here are prefixed u1l4-. */
import { h, fmt, Explainer } from '../explain.js';
import { tex } from '../tex.js';
import { NumberLine } from '../blocks.js';
import { standup } from '../standup.js';

const at = (el, x, y) => { el.style.left = x + 'px'; el.style.top = y + 'px'; return el; };
const add = (stage, el, x, y) => { stage.appendChild(at(el, x, y)); return el; };
const NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs = {}) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); return e; };
const sv = (tag, attrs = {}, parent) => { const e = svgEl(tag, attrs); if (parent) parent.appendChild(e); return e; };
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
const T = (s) => tex(s);
const frac = (a, d) => tex(`\\dfrac{${a}}{${d}}`);
const fc = (a, d) => ({ v: a + '/' + d, label: frac(a, d) });
const tc = (v, t) => ({ v, label: tex(t) });
const hide = (...els) => els.forEach((e) => (e.style.opacity = 0));
const big = (t) => t.replace(/\\tfrac/g, '\\dfrac');
const stampIn = (c, el, rot = -6) => c.anim(el, [{ opacity: 0, transform: 'scale(1.8) rotate(-14deg)' }, { opacity: 1, transform: `scale(1) rotate(${rot}deg)` }], 420, { easing: 'cubic-bezier(.2,1.4,.4,1)' });
const tenth = (x) => (Math.round(x * 10) / 10).toFixed(1).replace('-', '−');

/* ====================== the sets (one colour each, everywhere on the page) ====================== */
const SETS = {
  N: { sym: 'N', name: 'Natural numbers', room: 'Natural', def: 'N=\\{1,\\ 2,\\ 3,\\ \\ldots\\}', is: 'a natural (counting) number' },
  W: { sym: 'W', name: 'Whole numbers', room: 'Whole', def: 'W=\\{0,\\ 1,\\ 2,\\ 3,\\ \\ldots\\}', is: 'a whole number' },
  I: { sym: 'I', name: 'Integers', room: 'Integers', def: 'I=\\{\\ldots,\\ -2,\\ -1,\\ 0,\\ 1,\\ 2,\\ \\ldots\\}', is: 'an integer' },
  Q: { sym: 'Q', name: 'Rational numbers', room: 'Rational', def: 'Q=\\left\\{\\dfrac{a}{b}:\\ a,\\,b \\text{ integers},\\ b\\neq0\\right\\}', is: 'rational' },
  Qb: { sym: '\\overline{Q}', name: 'Irrational numbers', room: 'Irrational', def: null, is: 'irrational' },
  R: { sym: 'R', name: 'Real numbers', room: 'Real', def: null, is: 'real' }
};
const INSIDE = { N: ['N', 'W', 'I', 'Q', 'R'], W: ['W', 'I', 'Q', 'R'], I: ['I', 'Q', 'R'], Q: ['Q', 'R'], Qb: ['Qb', 'R'] }; // home → every set it is in

/* Nested rectangles, like the booklet's diagram: R holds Q (left) and Q̄ (right); Q holds I holds W holds N.
 * Each band has a strip at its top for its label and the numbers that live in that band. */
function nestGeom(x, y, w, hh, o = {}) {
  const top = o.top || 40, strip = o.strip || 50, pad = o.pad || 12, qbw = o.qbw || Math.round(w * 0.22);
  const g = { R: { x, y, w, h: hh }, strip, pad };
  g.Q = { x: x + pad, y: y + top, w: w - 3 * pad - qbw, h: hh - top - pad };
  g.Qb = { x: g.Q.x + g.Q.w + pad, y: g.Q.y, w: qbw, h: g.Q.h };
  const inset = (r) => ({ x: r.x + pad, y: r.y + strip, w: r.w - 2 * pad, h: r.h - strip - pad });
  g.I = inset(g.Q); g.W = inset(g.I); g.N = inset(g.W);
  const lab = o.labW || 150, sp = o.sp || 66;
  /* where the i-th number of a set sits (its centre) */
  g.slot = (k, i, n = 1) => {
    if (k === 'N') { const r = g.N, cols = Math.min(n, 5), row = Math.floor(i / cols), col = i % cols; return [r.x + r.w / 2 + (col - (cols - 1) / 2) * sp, r.y + r.h * (o.nY || 0.6) + row * 46]; }
    if (k === 'Qb') { const r = g.Qb; return [r.x + r.w / 2, r.y + (o.qbTop || 78) + i * (o.qbSp || 54)]; }
    if (k === 'R') { const r = g.R; return [r.x + r.w - 120 - i * sp, r.y + top / 2]; }
    const r = g[k]; return [r.x + lab + sp / 2 + i * sp, r.y + strip / 2 + 1];
  };
  return g;
}
function drawNest(stage, g, o = {}) {
  const svg = sv('svg', { class: 'u1l4-nest-svg' }); stage.appendChild(svg);
  const parts = {};
  ['R', 'Q', 'Qb', 'I', 'W', 'N'].forEach((k) => {
    const r = g[k], rect = sv('rect', { x: r.x, y: r.y, width: r.w, height: r.h, rx: k === 'R' ? 16 : 10, class: 'u1l4-nr k-' + k.toLowerCase() }, svg);
    const words = o.long && o.long[k] ? `<span class="u1l4-nd">${o.long[k]}</span>` : '';
    const name = o.rooms ? SETS[k].room : SETS[k].name.replace(' numbers', '');
    const html = k === 'Qb' ? `<span class="u1l4-nm">${name}</span>${T(SETS[k].sym)}` : `${T(SETS[k].sym)}<span class="u1l4-nm">${name}</span>${words}`;
    const lab = add(stage, h('div', 'u1l4-nl k-' + k.toLowerCase() + (k === 'Qb' ? ' c' : ''), html), k === 'Qb' ? r.x + r.w / 2 : r.x + 10, r.y + (k === 'R' ? 8 : k === 'Qb' ? 30 : 12));
    parts[k] = [rect, lab];
  });
  return { svg, parts };
}
const chipAt = (stage, t, [x, y], cls = '') => add(stage, h('div', 'u1l4-chip c ' + cls, T(t)), x, y);

/* a ÷ d one digit at a time: digits after the point, the remainder before each digit, and where the cycle starts */
function expand(a, d, max = 12) {
  const q0 = Math.floor(a / d); let r = a % d;
  const rems = [r], digits = [], seen = new Map([[r, 0]]); let loopStart = -1;
  while (r !== 0 && digits.length < max) {
    const n = r * 10; digits.push(Math.floor(n / d)); r = n % d; rems.push(r);
    if (r !== 0 && seen.has(r)) { loopStart = seen.get(r); break; }
    seen.set(r, digits.length);
  }
  return { a, d, q0, digits, rems, loopStart, terminates: r === 0, done: r === 0 || loopStart >= 0 };
}
function decTeX(e) {
  if (!e.digits.length) return String(e.q0);
  if (e.terminates) return e.q0 + '.' + e.digits.join('');
  if (e.loopStart < 0) return e.q0 + '.' + e.digits.join('') + '\\ldots';
  return e.q0 + '.' + e.digits.slice(0, e.loopStart).join('') + '\\overline{' + e.digits.slice(e.loopStart).join('') + '}';
}
function parseFrac(s) {
  const m = String(s).match(/^\s*(\d{1,3})\s*\/\s*(\d{1,2})\s*$/); if (!m) return null;
  const a = +m[1], d = +m[2]; if (d < 2 || a < 1 || a % d === 0) return null; return [a, d];
}
/* ============ 2. Long division: watch the remainders ============ */
const longdiv = {
  title: 'Long division, one digit at a time',
  height: 540,
  capH: 104,   // three-line captions
  minW: 940, // drawn this wide and scaled to fit beside the sidebar
  choices: [fc(1, 4), fc(3, 5), fc(1, 3), fc(5, 6), fc(1, 7), fc(5, 11), { sep: 'Example 2 check:' }, fc(3, 8), fc(4, 9)],
  intro: (v) => { const [a, d] = v.split('/'); return `Divide <b>${a} ÷ ${d}</b> one digit at a time. Keep an eye on the <b>remainders</b> — they decide everything.`; },
  make(stage, v, ex) {
    const [a, d] = v.split('/').map(Number), e = expand(a, d, 10), W = ex.W, H = 540;
    const nd = e.digits.length, aS = String(a), k = aS.length, dS = String(d);
    const leftW = Math.round(W * 0.43), cw = nd > 7 ? 23 : 27, dotW = 7, divW = dS.length * cw;
    const total = divW + 24 + (k + nd) * cw + (nd ? dotW : 0);
    const x0 = Math.max(14, (leftW - total) / 2) + divW + 24;
    const colX = (j) => x0 + j * cw + (j >= k ? dotW : 0);
    const quotY = 24, divY = 78, rh = 34, rowY = (r) => divY + r * rh;
    const win = add(stage, h('div', 'u1l4-ld-win'), 0, 0); win.style.width = leftW + 'px'; win.style.height = H + 'px';
    const work = h('div', 'u1l4-ld-work'); win.appendChild(work);
    const put = (el, x, y) => { work.appendChild(at(el, x, y)); return el; };
    const cell = (ch, j, y, cls) => { const el = put(h('div', 'u1l4-ld-d' + (cls ? ' ' + cls : ''), ch), colX(j), y); el.style.width = cw + 'px'; return el; };
    const num = (n, j, y, cls) => String(n).split('').map((ch, i, s) => cell(ch, j - (s.length - 1 - i), y, cls));
    const under = (n, j, y) => { // the "−" and the subtraction line under a product
      const len = String(n).length, xl = colX(j - len + 1);
      const mn = put(h('div', 'u1l4-ld-minus', '−'), xl - 22, y);
      const ln = put(h('div', 'u1l4-ld-line'), xl - 6, y + rh - 2); ln.style.width = (colX(j) + cw - xl + 12) + 'px';
      return [mn, ln];
    };
    const dv = put(h('div', 'u1l4-ld-dv', dS), x0 - 24 - divW, divY); dv.style.width = divW + 'px';
    const svg = svgEl('svg', { class: 'u1l4-ld-svg' }); work.appendChild(svg);
    const endX = Math.max(colX(k + nd - 1) + cw + 8, x0 + 40);
    svg.appendChild(svgEl('path', { d: `M ${x0 - 18} ${divY + rh + 4} Q ${x0 - 4} ${divY + rh / 2} ${x0 - 18} ${divY - 4} L ${endX} ${divY - 4}`, class: 'u1l4-ld-br' }));
    const dvd = []; aS.split('').forEach((ch, j) => { dvd[j] = cell(ch, j, divY, 'dvd'); });
    if (nd) { const pt = put(h('div', 'u1l4-ld-pt', '.'), x0 + k * cw - 4, divY); pt.style.width = dotW + 8 + 'px'; for (let i = 0; i < nd; i++) dvd[k + i] = cell('0', k + i, divY, 'dvd z'); }
    const qcells = [];

    // right side: the running answer, the remainder table, the possible remainders
    const rx = leftW + 20, rw = W - rx - 18;
    const res = add(stage, h('div', 'u1l4-ld-res'), rx, 14);
    add(stage, h('div', 'u1l4-ld-th', 'Each step: divide, write the digit, keep the remainder'), rx, 74).style.width = rw + 'px';
    const rowTop = 104, trh = 33, rows = [];
    const trow = (i, html, r, cls) => {
      const el = add(stage, h('div', 'u1l4-ld-tr' + (cls ? ' ' + cls : ''), `<span class="u1l4-ld-eq">${html}</span><span class="u1l4-ld-rc">${r}</span>`), rx, rowTop + i * trh);
      el.style.width = (rw - 70) + 'px'; rows[i] = el; return el;
    };
    const loopSvg = svgEl('svg', { class: 'u1l4-ld-loop' }); stage.appendChild(loopSvg);
    const slots = [];
    if (d <= 14) {
      const sl = add(stage, h('div', 'u1l4-ld-slots', `<div class="u1l4-ld-sl-h">Possible remainders when you divide by ${d}</div>`), rx, H - 76); sl.style.width = rw + 'px';
      const row = h('div', 'u1l4-ld-sl-row'); sl.appendChild(row);
      for (let r = 0; r < d; r++) { const s = h('span', 'u1l4-ld-slot' + (r === 0 ? ' zero' : ''), r); row.appendChild(s); slots.push(s); }
    }
    const light = (c, r) => { const s = slots[r]; if (!s) return Promise.resolve(); const again = s.classList.contains('used'); s.classList.add(again ? 'again' : 'used'); return c.pop(s, 360); };
    const resText = (n) => `${a} ÷ ${d} = <b>${e.q0}${n ? '.' : ''}${e.digits.slice(0, n).map((g, i) => (i === n - 1 ? `<span class="new">${g}</span>` : g)).join('')}</b>${n ? '<span class="muted">…</span>' : ''}`;
    let scrolled = 0;
    const scrollTo = (c, bottom) => {
      const s = Math.max(0, bottom - (H - 16)); if (s === scrolled) return Promise.resolve();
      const from = scrolled; scrolled = s;
      return c.anim(work, [{ transform: `translateY(${-from}px)` }, { transform: `translateY(${-s}px)` }], 500);
    };

    const steps = [], base = e.q0 > 0 ? 2 : 0;
    steps.push({
      cap: e.q0 > 0 ? `<b>${a} ÷ ${d} = ${e.q0} R ${e.rems[0]}.</b> Write <b>${e.q0}</b> on top, subtract ${e.q0} × ${d} = ${e.q0 * d}, and keep the remainder <b>${e.rems[0]}</b>.`
        : `${d} doesn’t go into ${a}, so the answer starts with <b>0.</b> — and the remainder is <b>${a}</b>.`,
      run: async (c) => {
        const jobs = [];
        num(e.q0, k - 1, quotY, 'q').forEach((el) => jobs.push(c.pop(el, 380)));
        if (nd) { const qp = put(h('div', 'u1l4-ld-pt q', '.'), x0 + k * cw - 4, quotY); qp.style.width = dotW + 8 + 'px'; jobs.push(c.pop(qp, 300, { delay: 150 })); }
        if (e.q0 > 0) {
          num(e.q0 * d, k - 1, rowY(1), 'p').forEach((el) => jobs.push(c.fadeIn(el, 300, { delay: 200 })));
          const [mn, ln] = under(e.q0 * d, k - 1, rowY(1));
          jobs.push(c.fadeIn(mn, 300, { delay: 200 }), c.anim(ln, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], 300, { delay: 400 }));
          num(e.rems[0], k - 1, rowY(2), 'r').forEach((el) => jobs.push(c.pop(el, 380, { delay: 600 })));
        } else dvd.slice(0, k).forEach((el) => el.classList.add('use'));
        res.innerHTML = resText(0);
        jobs.push(c.fadeIn(trow(0, `<span class="muted">start:</span> ${a} ÷ ${d} = <b>${e.q0}</b> R`, e.rems[0]), 300, { delay: 300 }), light(c, e.rems[0]));
        await Promise.all(jobs);
      }
    });
    e.digits.forEach((dig, i) => {
      const r = e.rems[i], n = r * 10, nr = e.rems[i + 1], col = k + i, R = base + 2 * i;
      const stop = nr === 0, again = i === nd - 1 && e.loopStart >= 0, first = i === 0 && e.q0 === 0;
      steps.push({
        cap: (first ? `Use the first 0 after the point: <b>${n} ÷ ${d} = ${dig} R ${nr}</b>. ` : `Bring down a 0 to make ${n}: <b>${n} ÷ ${d} = ${dig} R ${nr}</b>. `)
          + (stop ? 'The remainder is <b>0</b> — nothing is left to divide.' : again ? `Remainder <b class="red">${nr}</b> — we’ve had that remainder before!` : `Write <b>${dig}</b> on top; the new remainder is <b>${nr}</b>.`),
        run: async (c) => {
          dvd[col].classList.remove('z');
          if (first) { dvd[col].classList.add('use'); await c.pop(dvd[col], 300); }
          else {
            const z = cell('0', col, rowY(R), 'r bd');
            await Promise.all([scrollTo(c, rowY(R + 2) + rh), c.anim(z, [{ transform: `translateY(${divY - rowY(R)}px)`, opacity: 0.2 }, { transform: 'none', opacity: 1 }], 560)]);
          }
          const jobs = [];
          const q = cell(String(dig), col, quotY, 'q'); qcells[i] = q; jobs.push(c.pop(q, 380));
          num(dig * d, col, rowY(R + 1), 'p').forEach((el) => jobs.push(c.fadeIn(el, 300, { delay: 250 })));
          const [mn, ln] = under(dig * d, col, rowY(R + 1));
          jobs.push(c.fadeIn(mn, 300, { delay: 250 }), c.anim(ln, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], 300, { delay: 450 }));
          num(nr, col, rowY(R + 2), 'r' + (stop ? ' zero' : again ? ' again' : '')).forEach((el) => jobs.push(c.pop(el, 380, { delay: 650 })));
          res.innerHTML = resText(i + 1);
          jobs.push(c.fadeIn(trow(i + 1, `${n} ÷ ${d} = <b>${dig}</b> R`, nr, stop ? 'zero' : again ? 'again' : ''), 300, { delay: 600 }), light(c, nr), scrollTo(c, rowY(R + 2) + rh));
          await Promise.all(jobs);
        }
      });
    });
    const T = tex(`\\dfrac{${a}}{${d}}=${decTeX(e)}`), Tres = tex(`\\tfrac{${a}}{${d}}=${decTeX(e)}`);
    if (e.terminates) {
      steps.push({
        cap: nd ? `Remainder 0, so the division <b>stops</b>: ${T}. It’s <b>terminating</b> (and non-repeating).` : `${a} ÷ ${d} comes out even: ${T}.`,
        run: async (c) => {
          res.innerHTML = `${Tres} <span class="u1l4-ld-tag ok">terminates</span>`;
          await Promise.all([c.fadeIn(res, 350), ...(rows[nd] ? [c.pop(rows[nd].querySelector('.u1l4-ld-rc'), 400)] : [])]);
        }
      });
    } else {
      const j = e.loopStart, chain = e.rems.slice(j).join(' → '), blk = e.digits.slice(j).join('');
      steps.push({
        cap: `Remainders ${chain}: a remainder came back, so the division repeats from there and the digits <b>${blk}</b> go round forever. ${T} — <b>repeating</b>, <b>non-terminating</b>.`,
        run: async (c) => {
          const jobs = [];
          const chip = (i) => rows[i].querySelector('.u1l4-ld-rc'), cxR = (i) => rows[i].offsetLeft + chip(i).offsetLeft + chip(i).offsetWidth + 4, cy = (i) => rows[i].offsetTop + rows[i].offsetHeight / 2;
          const x1 = cxR(nd), y1 = cy(nd), y2 = cy(j), bulge = Math.min(54, 26 + (nd - j) * 5);
          const p = svgEl('path', { d: `M ${x1} ${y1} C ${x1 + bulge} ${y1}, ${x1 + bulge} ${y2}, ${x1 + 2} ${y2}`, class: 'u1l4-ld-arc' });
          const head = svgEl('path', { d: `M ${x1 + 2} ${y2} l 10 -6 l -1 12 z`, class: 'u1l4-ld-head' });
          loopSvg.append(p, head);
          const len = p.getTotalLength ? p.getTotalLength() || 300 : 300; p.style.strokeDasharray = len; p.style.strokeDashoffset = len; head.style.opacity = 0;
          jobs.push(c.anim(p, [{ strokeDashoffset: len }, { strokeDashoffset: 0 }], 700), c.anim(head, [{ opacity: 0 }, { opacity: 1 }], 200, { delay: 650 }));
          rows[j].classList.add('again');
          for (let i = j + 1; i <= nd; i++) rows[i].classList.add('cyc');
          rows[j].classList.add('cyc');
          for (let i = j; i < nd; i++) qcells[i].classList.add('blk');
          const bar = put(h('div', 'u1l4-ld-bar'), colX(k + j) + 3, quotY - 3); bar.style.width = (colX(k + nd - 1) + cw - colX(k + j) - 6) + 'px';
          jobs.push(c.anim(bar, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], 450, { delay: 500 }));
          res.innerHTML = `${Tres} <span class="u1l4-ld-tag rep">repeats</span>`;
          jobs.push(c.fadeIn(res, 350, { delay: 700 }));
          await Promise.all(jobs);
        }
      });
    }
    steps.push({
      cap: `Why must this happen? Dividing by ${d} leaves only <b>${d} possible remainders</b> (0 to ${d - 1}). Either we hit <b>0</b> and it stops${e.terminates ? ' (like here)' : ''}, or a remainder <b>comes back</b> and it repeats${e.terminates ? '' : ' (like here)'}. So every fraction <b>terminates or repeats</b>.`,
      run: async (c) => {
        if (!slots.length) return;
        slots.forEach((s) => s.classList.add('show'));
        await Promise.all(slots.map((s, i) => c.anim(s, [{ transform: 'scale(1)' }, { transform: 'scale(1.25)' }, { transform: 'scale(1)' }], 360, { delay: i * 60 })));
      }
    });
    return steps;
  }
};

/* ============ 3. Does it repeat? Wrap the digits into rows and look for stripes ============ */
const IRR = {
  sqrt2: '4142135623730950488016887242096980785696718753769480731766797379907324784621070388503875',
  sqrt3: '7320508075688772935274463415058723669428052538103806280558069794519330169088000370811461',
  pi: '1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348',
  sqrt7: '6457513110645905905016157536392604257102591830824501803683344592010688232302836277603928',
  sqrt12: '4641016151377545870548926830117447338856105076207612561116139589038660338176000741622923'
};
const growing = (() => { let s = ''; for (let n = 1; s.length < 90; n++) s += '0'.repeat(n - 1) + '5'; return s; })(); // 0.5 05 005 0005 … (Example 3d)
const STR = {
  sqrt3: { t: '\\sqrt{3}', head: '1.', digits: IRR.sqrt3, kind: 'irr' },
  pi: { t: '\\pi', head: '3.', digits: IRR.pi, kind: 'irr', note: 'Computers have found <b>trillions</b> of digits of π — no repeating block, ever.' },
  sqrt2: { t: '\\sqrt{2}', head: '1.', digits: IRR.sqrt2, kind: 'irr' },
  sqrt12: { t: '\\sqrt{12}', head: '3.', digits: IRR.sqrt12, kind: 'irr' },
  r311: { t: '\\dfrac{3}{11}', head: '0.', digits: '27'.repeat(45), kind: 'rat', block: '27', eq: '\\dfrac{3}{11}=0.\\overline{27}' },
  sqrt7: { t: '\\sqrt{7}', head: '2.', digits: IRR.sqrt7, kind: 'irr' },
  r49: { t: '\\dfrac{4}{9}', head: '0.', digits: '4'.repeat(90), kind: 'rat', block: '4', eq: '\\dfrac{4}{9}=0.\\overline{4}' },
  grow: { t: '0.505\\,005\\,000\\,5\\ldots', head: '0.', digits: growing, kind: 'grow', run: '0s' }
};
const stripes = {
  title: 'Stripes mean a repeating block',
  height: 470,
  choices: [tc('r311', '\\dfrac{3}{11}'), tc('r49', '\\dfrac{4}{9}'), tc('sqrt3', '\\sqrt{3}'), { sep: 'Example 3 check:' }, tc('sqrt2', '\\sqrt{2}'), tc('pi', '\\pi'), tc('grow', '0.505\\,005\\ldots')],
  intro: (v) => `On the left, ${frac(1, 7)} (we know it repeats). On the right, ${tex(STR[v].t)}. Does it ever repeat? Let’s look at the digits after the decimal point.`,
  make(stage, v, ex) {
    const W = ex.W, cs = 34, G = 8, ROWS = 8, R = STR[v];
    const L = { t: '\\dfrac{1}{7}', head: '0.', digits: '142857'.repeat(12), kind: 'rat', block: '142857' };
    const striped = (src, w) => { for (let c0 = 0; c0 < w; c0++) for (let r = 1; r < ROWS; r++) if (src.digits[c0 + r * w] !== src.digits[c0]) return false; return true; };
    const grids = [L, R].map((src, gi) => {
      const cx = gi ? W * 0.75 : W * 0.25, gx0 = cx - (G * cs) / 2, gy0 = 76;
      add(stage, h('div', 'u1l4-sp-lab c', tex(src.t.includes('ldots') ? src.t : `${src.t}=${src.head}${src.digits.slice(0, 6)}\\ldots`)), cx, 38);
      const frame = add(stage, h('div', 'u1l4-sp-frame'), gx0 - 7, gy0 - 7); frame.style.width = G * cs + 14 + 'px'; frame.style.height = ROWS * cs + 14 + 'px';
      const cells = [];
      for (let i = 0; i < G * ROWS; i++) { const dg = src.digits[i]; const el = add(stage, h('div', 'u1l4-sp-c d' + dg, dg), gx0 + (i % G) * cs, gy0 + Math.floor(i / G) * cs); el.style.opacity = 0; cells.push(el); }
      const tags = add(stage, h('div', 'u1l4-sp-tags'), gx0 - 7, gy0 + ROWS * cs + 14); tags.style.width = G * cs + 14 + 'px';
      const tagEls = []; for (let w = 1; w <= G; w++) { const t = h('span', 'u1l4-sp-tag', w); tags.appendChild(t); tagEls.push(t); }
      return { src, cells, frame, tagEls, gx0, gy0, w: G };
    });
    const wl = add(stage, h('div', 'u1l4-sp-w c', 'rows of<b>8</b>'), W / 2, 200);
    const pos = (g, i, w) => [g.gx0 + ((G - w) * cs) / 2 + (i % w) * cs, g.gy0 + Math.floor(i / w) * cs];
    const wrap = (c, w, ms = 420) => {
      wl.innerHTML = `rows of<b>${w}</b>`;
      const jobs = [];
      grids.forEach((g) => {
        g.w = w; const ok = striped(g.src, w);
        g.frame.classList.toggle('ok', ok);
        g.cells.forEach((el, i) => {
          const vis = i < w * ROWS, [x, y] = vis ? pos(g, i, w) : [parseFloat(el.style.left), parseFloat(el.style.top)];
          jobs.push(c.anim(el, [{ left: el.style.left, top: el.style.top, opacity: el.style.opacity }, { left: x + 'px', top: y + 'px', opacity: vis ? '1' : '0' }], ms));
        });
      });
      return Promise.all(jobs);
    };
    const mark = (w) => grids.forEach((g) => { const t = g.tagEls[w - 1]; t.classList.remove('yes', 'no', 'cur'); t.classList.add(striped(g.src, w) ? 'yes' : 'no'); });
    const target = R.kind === 'rat' ? R.block.length : 6;
    const steps = [
      {
        cap: 'Here are the first 64 digits after each decimal point, in rows of 8. Every digit has its <b>own colour</b>.',
        run: async (c) => { await Promise.all(grids.flatMap((g) => g.cells.map((el, i) => c.anim(el, [{ opacity: 0, transform: 'scale(.5)' }, { opacity: 1, transform: 'scale(1)' }], 300, { delay: i * 7 })))); grids.forEach((g) => g.frame.classList.toggle('ok', striped(g.src, G))); }
      },
      {
        cap: 'Now rewrap the digits in rows of 1, 2, 3, … 8. When the row length fits a <b>repeating block</b>, every column becomes one colour: <b>stripes</b>.',
        run: async (c) => {
          for (let w = 1; w <= G; w++) { grids.forEach((g) => g.tagEls[w - 1].classList.add('cur')); await wrap(c, w, 380); mark(w); await c.sleep(w === G ? 200 : 520); }
        }
      },
      {
        cap: R.kind === 'rat' ? `Rows of ${target}: ${tex(R.t)} makes perfect stripes — its block <b>${R.block}</b> repeats${target === 6 ? ', just like 142857 on the left' : ''}.`
          : `Rows of 6: ${frac(1, 7)} makes perfect stripes (its block is <b>142857</b>). ${tex(R.t)} is still confetti${R.kind === 'grow' ? ` — its runs of ${R.run || '1s'} keep getting longer` : ''}.`,
        run: async (c) => { await wrap(c, target, 500); for (let w = 1; w <= G; w++) mark(w); }
      },
      {
        cap: R.kind === 'rat' ? `${tex(R.eq)}: a repeating block means a fraction, so it’s <b>rational</b>.`
          : R.kind === 'grow' ? `${tex(R.t)} has a <b>pattern</b>, but the runs of ${R.run || '1s'} keep growing, so no block ever repeats. Non-terminating, non-repeating: <b>irrational</b>.`
            : `${tex(R.t)} never lines up, at any row length — not 8, not 100, not a million. ${R.note || 'Its digits never settle into a repeating block.'} Non-terminating, non-repeating: <b>irrational</b>.`,
        run: async (c) => {
          const st = add(stage, h('div', 'pd-stamp u1l4-sp-stamp ' + (R.kind === 'rat' ? 'prime' : 'comp'), R.kind === 'rat' ? 'RATIONAL' : 'IRRATIONAL'), W / 2, 424);
          st.style.translate = '-50% -50%';
          await c.anim(st, [{ opacity: 0, transform: 'scale(1.8) rotate(-14deg)' }, { opacity: 1, transform: 'scale(1) rotate(-8deg)' }], 420, { easing: 'cubic-bezier(.2,1.4,.4,1)' });
        }
      }
    ];
    return steps;
  }
};

/* ============ 3. Rational or irrational? A decision flowchart ============ */
const FLOW = {
  pi: { t: '\\pi', kind: 'pi', cat: 'π is a <b>special number</b>: its digits 3.14159… go on forever with no repeating block.', res: '\\pi=3.14159265\\ldots', v: 'π is <b>irrational</b>: it never ends and never repeats. (3.14 and 22/7 are only close guesses.)' },
  r38: { t: '\\dfrac{3}{8}', kind: 'frac', cat: `It’s a <b>fraction of two integers</b>: that’s exactly what rational means.`, res: '\\tfrac{3}{8}=0.375', v: `<b>Rational.</b> (As a decimal it terminates: ${tex('0.375')}.)` },
  r49: { t: '\\dfrac{4}{9}', kind: 'frac', cat: `It’s a <b>fraction of two integers</b>: that’s exactly what rational means.`, res: '\\tfrac{4}{9}=0.\\overline{4}', v: `<b>Rational.</b> (As a decimal it repeats: ${tex('0.\\overline{4}')}.)` },
  m7: { t: '-7', kind: 'frac', cat: `−7 is an <b>integer</b>, and every integer is a fraction: ${tex('-7=\\tfrac{-7}{1}')}.`, res: '-7=\\tfrac{-7}{1}=-7.0', v: '<b>Rational.</b> Every integer is rational.' },
  d06: { t: '0.6', kind: 'dec', cat: 'It’s a <b>decimal</b>. Does it terminate or repeat?', q: '0.6 <b>terminates</b>: it stops after one digit.', yes: true, res: '0.6=\\tfrac{6}{10}=\\tfrac{3}{5}', v: '<b>Rational</b>: every terminating decimal is a fraction, here 6 tenths.' },
  sqrt16: { t: '\\sqrt{16}', kind: 'root', cat: 'It’s a <b>square root</b>. Is the number inside a perfect square?', q: '4 × 4 = 16: <b>yes</b>, 16 is a perfect square.', yes: true, res: '\\sqrt{16}=4=\\tfrac{4}{1}', v: '<b>Rational</b>: it’s exactly 4.' },
  sqrt17: { t: '\\sqrt{17}', kind: 'root', cat: 'It’s a <b>square root</b>. Is the number inside a perfect square?', q: '16 &lt; 17 &lt; 25, so 17 is <b>not</b> a perfect square.', yes: false, res: '\\sqrt{17}=4.1231056\\ldots', v: '<b>Irrational</b>: it never ends and never repeats.' },
  sqrt2: { t: '\\sqrt{2}', kind: 'root', cat: 'It’s a <b>square root</b>. Is the number inside a perfect square?', q: '1 &lt; 2 &lt; 4, so 2 is <b>not</b> a perfect square.', yes: false, res: '\\sqrt{2}=1.41421356\\ldots', v: '<b>Irrational</b>: it never ends and never repeats.' },
  sqrt9: { t: '\\sqrt{9}', kind: 'root', cat: 'It’s a <b>square root</b>. Is the number inside a perfect square?', q: '3 × 3 = 9: <b>yes</b>, 9 is a perfect square.', yes: true, res: '\\sqrt{9}=3=\\tfrac{3}{1}', v: '<b>Rational</b>: it’s exactly 3.' },
  d505: { t: '0.505\\,005\\,000\\,5\\ldots', kind: 'dec', cat: 'It’s a <b>decimal</b>. Does it terminate or repeat?', q: '5, 05, 005, 0005, … the zeros keep <b>growing</b>: it never stops, and no block repeats.', yes: false, res: '0.505\\,005\\,000\\,500\\,005\\ldots', v: '<b>Irrational.</b> A pattern isn’t the same as a repeating block.' }
};
const flow = {
  title: 'Follow the arrows',
  height: 430,
  minW: 940, // drawn this wide and scaled to fit beside the sidebar
  choices: [tc('sqrt16', '\\sqrt{16}'), tc('sqrt17', '\\sqrt{17}'), { sep: 'Example 2 check:' }, tc('r38', '\\dfrac{3}{8}'), tc('r49', '\\dfrac{4}{9}'), tc('m7', '-7'), tc('d06', '0.6'), { sep: 'Example 3 check:' }, tc('sqrt2', '\\sqrt{2}'), tc('sqrt9', '\\sqrt{9}'), tc('pi', '\\pi'), tc('d505', '0.505\\,005\\ldots')],
  intro: (v) => `Is ${tex(FLOW[v].t)} rational or irrational? Start at the top and answer one question at a time.`,
  make(stage, v, ex) {
    const W = ex.W, F = FLOW[v]; stage.classList.remove('u1l4-fl-active');
    const svg = svgEl('svg', { class: 'u1l4-fl-svg' }); stage.appendChild(svg);
    const N = {}, E = {};
    const node = (id, x, y, html, cls) => { N[id] = add(stage, h('div', 'u1l4-fl-n c ' + (cls || ''), html), x, y); N[id]._x = x; N[id]._y = y; return N[id]; };
    node('start', W * 0.5, 42, `What kind of number is <span class="u1l4-fl-t">${tex(F.t.replace('dfrac', 'tfrac'))}</span>?`, 'start');
    node('frac', W * 0.12, 128, 'A fraction or integer', 'cat');
    node('root', W * 0.36, 128, 'A square root', 'cat');
    node('dec', W * 0.645, 128, 'A decimal', 'cat');
    node('pi', W * 0.885, 128, 'π (a special number)', 'cat');
    node('rootQ', W * 0.36, 222, 'Perfect square inside?', 'q');
    node('decQ', W * 0.645, 222, 'Terminates or repeats?', 'q');
    node('fracL', W * 0.12, 318, 'Rational', 'leaf rat');
    node('rootY', W * 0.285, 318, 'Rational', 'leaf rat');
    node('rootN', W * 0.43, 318, 'Irrational', 'leaf irr');
    node('decY', W * 0.575, 318, 'Rational', 'leaf rat');
    node('decN', W * 0.72, 318, 'Irrational', 'leaf irr');
    node('piL', W * 0.885, 318, 'Irrational', 'leaf irr');
    const hh = (id) => N[id].offsetHeight / 2;
    const edge = (a, b, label) => {
      const x1 = N[a]._x, y1 = N[a]._y + hh(a), x2 = N[b]._x, y2 = N[b]._y - hh(b);
      const ln = svgEl('line', { x1, y1, x2, y2, class: 'u1l4-fl-e' }); svg.appendChild(ln); E[a + '-' + b] = ln;
      if (label) { const t = add(stage, h('div', 'u1l4-fl-el c', label), x1 + (x2 - x1) * 0.55, y1 + (y2 - y1) * 0.55); ln._lab = t; }
    };
    ['frac', 'root', 'dec', 'pi'].forEach((id) => edge('start', id));
    edge('frac', 'fracL'); edge('root', 'rootQ'); edge('dec', 'decQ'); edge('pi', 'piL');
    edge('rootQ', 'rootY', 'yes'); edge('rootQ', 'rootN', 'no'); edge('decQ', 'decY', 'yes'); edge('decQ', 'decN', 'neither');
    const resEl = add(stage, h('div', 'u1l4-fl-res c'), W / 2, 392); resEl.style.opacity = 0;
    const on = (c, ids, eds) => {
      stage.classList.add('u1l4-fl-active');
      eds.forEach((k) => { E[k].classList.add('on'); if (E[k]._lab) E[k]._lab.classList.add('on'); });
      return Promise.all(ids.map((id) => { N[id].classList.add('on'); return c.pop(N[id], 380); }));
    };
    const cat = F.kind, leaf = cat === 'frac' ? 'fracL' : cat === 'pi' ? 'piL' : cat === 'root' ? (F.yes ? 'rootY' : 'rootN') : (F.yes ? 'decY' : 'decN');
    const qn = cat === 'root' ? 'rootQ' : cat === 'dec' ? 'decQ' : null;
    const steps = [{ cap: F.cat, run: (c) => on(c, ['start', cat], ['start-' + cat]) }];
    if (qn) steps.push({ cap: F.q, run: (c) => on(c, [qn], [cat + '-' + qn]) });
    steps.push({
      cap: F.v,
      run: async (c) => {
        resEl.innerHTML = tex(F.res);
        await Promise.all([on(c, [leaf], [(qn || cat) + '-' + leaf]), c.fadeIn(resEl, 400, { delay: 200 })]);
      }
    });
    return steps;
  }
};


/* ============ 4. Build the real number system, one set at a time (the booklet's examples) ============ */
const BUILD = [
  { k: 'N', chips: ['1', '2', '3', '4'], note: 'the <b>counting</b> numbers',
    cap: `<b>Natural numbers</b> ${T('N')}: the <b>counting</b> numbers 1, 2, 3, 4, … They go in the very middle.` },
  { k: 'W', chips: ['0'], note: 'the natural numbers <b>and 0</b>',
    cap: `<b>Whole numbers</b> ${T('W')}: the natural numbers <b>and 0</b>. W wraps around N, so every natural number is also a whole number.` },
  { k: 'I', chips: ['-7', '-1'], note: 'the whole numbers and their <b>opposites</b>',
    cap: `<b>Integers</b> ${T('I')}: the whole numbers and their <b>opposites</b> (−1, −7, …). Every whole number is an integer.` },
  { k: 'Q', chips: ['\\tfrac{2}{3}', '0.75', '0.\\overline{3}'], note: 'fractions, and decimals that <b>terminate</b> or <b>repeat</b>',
    cap: `<b>Rational numbers</b> ${T('Q')}: any number you can write as ${T('\\tfrac{a}{b}')} with integers <i>a</i> and <i>b</i> (b ≠ 0). Every integer is rational too: ${T('-7=\\tfrac{-7}{1}')}.` },
  { k: 'Qb', chips: ['\\pi', '\\sqrt{2}', '\\sqrt{13}'], note: 'decimals that <b>never end</b> and <b>never repeat</b>',
    cap: `<b>Irrational numbers</b> ${T('\\overline{Q}')}: decimals that <b>never end and never repeat</b>. They sit <b>beside</b> ${T('Q')}, not inside it: no number is both.` },
  { k: 'R', chips: [], note: 'every point on the <b>number line</b>',
    cap: `<b>Real numbers</b> ${T('R')}: the rationals and the irrationals <b>together</b>. Every point on the number line lives somewhere in this box.` }
];
const build = {
  title: 'Build the real number system, one set at a time',
  height: 480,
  minW: 960,
  intro: 'Start with the numbers we learned first, the counting numbers, and keep adding new kinds of numbers. Each new set <b>wraps around</b> the one before.',
  make(stage, v, ex) {
    const W = ex.W, H = 480, dw = Math.min(640, W * 0.66), g = nestGeom(16, 16, dw, H - 32, { qbw: 150 }), { parts } = drawNest(stage, g);
    Object.values(parts).forEach((p) => hide(...p));
    const px = g.R.x + g.R.w + 18, pw = W - px - 14;
    const panel = add(stage, h('div', 'u1l4-set-card'), px, g.R.y); panel.style.width = pw + 'px'; panel.style.height = g.R.h + 'px'; hide(panel);
    const fill = (b) => {
      const s = SETS[b.k], def = b.k === 'Qb' ? `${T('\\overline{Q}')}: decimals that never end and never repeat` : b.k === 'R' ? `${T('R')}: ${T('Q')} and ${T('\\overline{Q}')} together` : T(s.def);
      panel.className = 'u1l4-set-card k-' + b.k.toLowerCase();
      panel.innerHTML = `<div class="u1l4-sc-sym">${T(s.sym)}</div><div class="u1l4-sc-name">${s.name}</div><div class="u1l4-sc-def">${def}</div><div class="u1l4-sc-note">${b.note}</div>`;
    };
    const steps = BUILD.map((b) => ({
      cap: b.cap,
      run: async (c) => {
        fill(b);
        const chips = b.chips.map((t, i) => { const e = chipAt(stage, t, g.slot(b.k, i, b.chips.length), b.k.toLowerCase()); e.style.opacity = 0; return e; });
        const [shape, lab] = parts[b.k];
        const jobs = [c.fadeIn(panel, 300), c.anim(shape, [{ opacity: 0, transform: 'scale(.94)' }, { opacity: 1, transform: 'scale(1)' }], 550), c.fadeIn(lab, 400, { delay: 250 })];
        chips.forEach((e, i) => jobs.push(c.pop(e, 380, { delay: 450 + i * 160 })));
        await Promise.all(jobs);
      }
    }));
    steps.push({
      cap: `Each set sits <b>inside</b> the next: ${T('N\\subset W\\subset I\\subset Q\\subset R')}. So 3 belongs to <b>five sets at once</b>. ${T('\\overline{Q}')} sits beside ${T('Q')}, and both are inside ${T('R')}.`,
      run: async (c) => {
        panel.className = 'u1l4-set-card k-all';
        panel.innerHTML = `<div class="u1l4-sc-name">Nested sets</div><div class="u1l4-sc-chain">${['N', 'W', 'I', 'Q', 'R'].map((k) => `<span class="k-${k.toLowerCase()}">${T(k)}</span>`).join('<i>is inside</i>')}</div><div class="u1l4-sc-note">${T('\\overline{Q}')} is beside ${T('Q')}: <b>no overlap</b>.</div>`;
        await c.fadeIn(panel, 300);
        for (const k of ['N', 'W', 'I', 'Q', 'R']) await c.anim(parts[k][0], [{ strokeWidth: 2.5 }, { strokeWidth: 7 }, { strokeWidth: 2.5 }], 380);
      }
    });
    return steps;
  }
};

/* ============ 4. The sorting machine: which sets is it in? ============ */
const SORT = {
  g7: { t: '7', v: 7 },
  g0: { t: '0', v: 0 },
  gm4: { t: '-4', v: -4 },
  g35: { t: '\\tfrac{3}{5}', v: 0.6, why: `${T('\\tfrac{3}{5}')} is already a fraction of two integers (it’s ${T('0.6')}).`, between: 'between 0 and 1' },
  g025: { t: '0.25', v: 0.25, why: `${T('0.25=\\tfrac{25}{100}=\\tfrac{1}{4}')}: a terminating decimal is a fraction.`, between: 'between 0 and 1' },
  gr16: { t: '\\sqrt{16}', v: 4, simp: '=4', simpWhy: `${T('\\sqrt{16}=4')} because 4 × 4 = 16.` },
  gr2: { t: '\\sqrt{2}', irr: `2 is not a perfect square, so ${T('\\sqrt{2}=1.41421356\\ldots')} never ends and never repeats.` },
  e15: { t: '15', v: 15 },
  em6: { t: '-6', v: -6 },
  e78: { t: '\\tfrac{7}{8}', v: 0.875, why: `${T('\\tfrac{7}{8}')} is already a fraction of two integers (it’s ${T('0.875')}).`, between: 'between 0 and 1' },
  er5: { t: '\\sqrt{5}', irr: `5 is not a perfect square (4 &lt; 5 &lt; 9), so ${T('\\sqrt{5}=2.2360679\\ldots')} never ends and never repeats.` },
  e0: { t: '0', v: 0 },
  e24: { t: '2.4', v: 2.4, why: `${T('2.4=\\tfrac{24}{10}=\\tfrac{12}{5}')}: a terminating decimal is a fraction.`, between: 'between 2 and 3' },
  emr16: { t: '-\\sqrt{16}', v: -4, simp: '=-4', simpWhy: `${T('\\sqrt{16}=4')}, so ${T('-\\sqrt{16}=-4')}.` },
  e63: { t: '0.\\overline{63}', v: 7 / 11, why: `${T('0.\\overline{63}')} <b>repeats</b>, so it’s a fraction in disguise (${T('0.\\overline{63}=\\tfrac{7}{11}')}).`, between: 'between 0 and 1' }
};
const sorter = {
  title: 'The sorting machine: which sets is it in?',
  height: 480,
  minW: 960,
  choices: [...['g7', 'g0', 'gm4', 'g35', 'g025', 'gr16', 'gr2'].map((k) => ({ v: k, label: T(big(SORT[k].t)) })), { sep: 'Example 4 check:' }, ...['e15', 'em6', 'e78', 'er5', 'e0', 'e24', 'emr16', 'e63'].map((k) => ({ v: k, label: T(big(SORT[k].t)) }))],
  intro: (k) => `Where does ${T(SORT[k].t)} belong? Test it from the <b>outside in</b>: real, rational, integer, whole, natural. It drops into the <b>deepest</b> set it belongs to, and it is in every set around that one too.`,
  make(stage, k, ex) {
    const W = ex.W, H = 480, s = SORT[k], dw = Math.min(620, W * 0.64), g = nestGeom(16, 16, dw, H - 32, { qbw: 140 }), { parts } = drawNest(stage, g);
    const rat = !s.irr, isInt = rat && Number.isInteger(s.v), whole = isInt && s.v >= 0, nat = whole && s.v > 0;
    const px = g.R.x + g.R.w + 18, pw = W - px - 14;
    const panel = add(stage, h('div', 'u1l4-sort-card'), px, g.R.y); panel.style.width = pw + 'px'; panel.style.height = g.R.h + 'px';
    const hop = h('div', 'u1l4-sort-hop', `<div class="u1l4-sh-n">${T(big(s.t))}</div><div class="u1l4-sh-s">${s.simp ? '&nbsp;' : ''}</div>`); panel.appendChild(hop);
    const ROWS = [['R', 'Real?'], ['Q', 'Rational?'], ['Qb', 'Irrational?'], ['I', 'Integer?'], ['W', 'Whole?'], ['N', 'Natural?']];
    const marks = {};
    ROWS.forEach(([key, q]) => { const r = h('div', 'u1l4-sort-row k-' + key.toLowerCase(), `<span class="u1l4-sr-k">${T(SETS[key].sym)}</span><span class="u1l4-sr-q">${q}</span><span class="u1l4-sr-m"></span>`); panel.appendChild(r); marks[key] = r; });
    const out = h('div', 'u1l4-sort-out'); panel.appendChild(out);
    const chip = add(stage, h('div', 'u1l4-chip big c', T(s.t)), px + pw / 2, g.R.y + 40); hide(chip);
    const posOf = { R: g.slot('R', 0), Q: g.slot('Q', 2), I: g.slot('I', 2), W: g.slot('W', 2), N: g.slot('N', 0), Qb: g.slot('Qb', 2) };
    const move = (c, key) => c.anim(chip, [{ left: chip.style.left, top: chip.style.top }, { left: posOf[key][0] + 'px', top: posOf[key][1] + 'px' }], 650, { easing: 'cubic-bezier(.3,.1,.3,1.25)' });
    const mark = (c, key, ok) => { const r = marks[key], m = r.querySelector('.u1l4-sr-m'); r.classList.add(ok ? 'yes' : 'no'); m.textContent = ok ? '✓' : '✗'; return c.pop(m, 320); };
    const flash = (c, key, ok) => { const el = parts[key][0]; el.classList.add(ok ? 'lit' : 'nope'); return c.anim(el, [{ strokeWidth: 2.5 }, { strokeWidth: 7 }, { strokeWidth: 2.5 }], 480); };
    const list = ['R'].concat(rat ? ['Q'] : ['Qb'], isInt ? ['I'] : [], whole ? ['W'] : [], nat ? ['N'] : []);
    const steps = [];
    if (s.simp) steps.push({
      cap: `<b>Simplify first.</b> ${s.simpWhy} A root sign doesn’t make a number irrational!`,
      run: async (c) => { hop.querySelector('.u1l4-sh-s').innerHTML = T(s.simp); await c.pop(hop.querySelector('.u1l4-sh-s'), 380); }
    });
    steps.push({
      cap: `Every number here has a place on the number line, so ${T(s.t)} is <b>real</b>: it’s somewhere inside ${T('R')}.`,
      run: async (c) => { chip.style.opacity = 1; await Promise.all([move(c, 'R'), mark(c, 'R', true), flash(c, 'R', true)]); }
    });
    const ratCap = s.irr ? `${s.irr} So it’s <b>irrational</b>: into ${T('\\overline{Q}')}. It can’t be in ${T('Q')}, ${T('I')}, ${T('W')} or ${T('N')}: they’re all on the rational side.`
      : s.why ? `${s.why} So it’s <b>rational</b>: into ${T('Q')}.`
        : `${T(String(s.v) + '=\\tfrac{' + s.v + '}{1}')}, a fraction of two integers, so it’s <b>rational</b>: into ${T('Q')}.`;
    steps.push({
      cap: ratCap,
      run: async (c) => {
        if (s.irr) { await Promise.all([move(c, 'Qb'), mark(c, 'Q', false), mark(c, 'Qb', true), flash(c, 'Qb', true)]); await Promise.all(['I', 'W', 'N'].map((q) => mark(c, q, false))); }
        else await Promise.all([move(c, 'Q'), mark(c, 'Q', true), mark(c, 'Qb', false), flash(c, 'Q', true)]);
      }
    });
    if (rat) steps.push({
      cap: isInt ? `No fraction or decimal part left over: ${T(String(s.v))} is an <b>integer</b>. Into ${T('I')}.`
        : `${T(s.t)} is ${s.between}, not a whole step on the number line: <b>not an integer</b>. So it can’t be whole or natural either.`,
      run: async (c) => {
        if (isInt) await Promise.all([move(c, 'I'), mark(c, 'I', true), flash(c, 'I', true)]);
        else await Promise.all([mark(c, 'I', false), c.shake(chip), flash(c, 'I', false), mark(c, 'W', false), mark(c, 'N', false)]);
      }
    });
    if (isInt) steps.push({
      cap: whole ? `It isn’t negative, so it’s a <b>whole number</b>. Into ${T('W')}.` : `${T(String(s.v))} is <b>negative</b>, so it’s <b>not a whole number</b>, and not natural either.`,
      run: async (c) => {
        if (whole) await Promise.all([move(c, 'W'), mark(c, 'W', true), flash(c, 'W', true)]);
        else await Promise.all([mark(c, 'W', false), c.shake(chip), flash(c, 'W', false), mark(c, 'N', false)]);
      }
    });
    if (whole) steps.push({
      cap: nat ? `It isn’t 0, so it’s a counting number: <b>natural</b>. Into ${T('N')}, the very middle.` : `It’s <b>0</b>, and we start counting at 1: <b>not natural</b>. 0 stays in ${T('W')}.`,
      run: async (c) => {
        if (nat) await Promise.all([move(c, 'N'), mark(c, 'N', true), flash(c, 'N', true)]);
        else await Promise.all([mark(c, 'N', false), c.shake(chip), flash(c, 'N', false)]);
      }
    });
    const listTex = list.map((q) => SETS[q].sym).join(',\\ ');
    steps.push({
      cap: `${T(s.t)} belongs to <b>${list.length} sets</b>: <b>${T(listTex)}</b>. In the Example 4 table, it gets a check in each of those columns.`,
      run: async (c) => { out.innerHTML = `<div class="u1l4-so-h">Check these sets</div>${T(listTex)}`; chip.classList.add('done'); await Promise.all([c.fadeIn(out, 400), c.pop(chip, 420)]); }
    });
    return steps;
  }
};


/* ============ a plain number line drawn on an explainer stage ============ */
const sgn = (v) => String(v).replace('-', '−');
function numLine(stage, svg, { x0, x1, y, lo, hi, every = 1, bold = [] }) {
  const X = (v) => x0 + ((v - lo) / (hi - lo)) * (x1 - x0);
  sv('line', { x1: x0 - 22, x2: x1 + 22, y1: y, y2: y, class: 'u1l4-ax' }, svg);
  sv('path', { d: `M ${x1 + 34} ${y} l -13 -7.5 v 15 z`, class: 'u1l4-axh' }, svg);
  sv('path', { d: `M ${x0 - 34} ${y} l 13 -7.5 v 15 z`, class: 'u1l4-axh' }, svg);
  for (let v = lo; v <= hi; v++) {
    sv('line', { x1: X(v), x2: X(v), y1: y - 8, y2: y + 8, class: 'u1l4-tk' }, svg);
    if (v % every === 0 || bold.includes(v)) add(stage, h('div', 'u1l4-tl c', sgn(v)), X(v), y + 24);
  }
  return X;
}

/* ============ 1. Natural, whole, integers on the number line ============ */
const EX1 = [-11, -3, 0, 5, 14, 20];
const nwi = {
  title: 'Natural, whole, integer: three sets on the number line',
  height: 330,
  choices: [{ v: 'sets', label: 'Build N, W, I' }, { sep: 'Example 1 check:' }, { v: 'ex1', label: T('\\{-3,\\ 0,\\ 5,\\ -11,\\ 14,\\ 20\\}') }],
  intro: (v) => (v === 'ex1' ? `Plot ${T('-3,\\ 0,\\ 5,\\ -11,\\ 14,\\ 20')} on a number line. Which are natural? Whole? Integers?` : 'Three sets of numbers we already use. Watch each one <b>grow</b> out of the one before.'),
  make(stage, v, ex) {
    const W = ex.W, svg = sv('svg', { class: 'u1l4-nest-svg' }); stage.appendChild(svg);
    if (v === 'ex1') {
      const X = numLine(stage, svg, { x0: 70, x1: W - 70, y: 118, lo: -12, hi: 21, every: 5 });
      const dots = EX1.map((n) => { const d = add(stage, h('div', 'u1l4-dot c'), X(n), 118), l = add(stage, h('div', 'u1l4-plab c', sgn(n)), X(n), 84); hide(d, l); d._n = n; l._n = n; return [d, l]; });
      const rows = [['N', '(a) natural', (n) => n > 0], ['W', '(b) whole', (n) => n >= 0], ['I', '(c) integer', () => true]].map(([k, lab, f], i) => {
        const y = 184 + i * 54, L = add(stage, h('div', 'u1l4-rowlab k-' + k.toLowerCase(), `${T(k)} <span class="u1l4-rlw">${lab}</span>`), 40, y); L.style.translate = '0 -50%'; hide(L);
        const ns = EX1.filter(f), chips = ns.map((n, j) => { const e = add(stage, h('div', 'u1l4-chip c ' + k.toLowerCase(), T(String(n))), 300 + j * 76, y); hide(e); return e; });
        return { k, L, ns, chips, f };
      });
      const show = (c, R) => {
        dots.forEach(([d, l]) => { const on = R.f(d._n); d.className = 'u1l4-dot c' + (on ? ' k-' + R.k.toLowerCase() : ' off'); l.classList.toggle('off', !on); });
        return Promise.all([c.fadeIn(R.L, 300), ...R.chips.map((e, j) => c.pop(e, 360, { delay: 200 + j * 110 }))]);
      };
      return [
        { cap: `Plot the six numbers: ${T('-11,\\ -3,\\ 0,\\ 5,\\ 14,\\ 20')}. Two are left of 0, one is 0, three are right of 0.`, run: (c) => Promise.all(dots.flatMap(([d, l], i) => [c.pop(d, 340, { delay: i * 110 }), c.fadeIn(l, 300, { delay: i * 110 })])) },
        { cap: `<b>(a) Natural</b> numbers are the counting numbers 1, 2, 3, …: only <b>5, 14 and 20</b>. (0 and the negatives aren’t counting numbers.)`, run: (c) => show(c, rows[0]) },
        { cap: `<b>(b) Whole</b> numbers are the natural numbers <b>and 0</b>: <b>0, 5, 14, 20</b>.`, run: (c) => show(c, rows[1]) },
        { cap: `<b>(c) Integers</b> include the negatives too, so <b>all six</b> are integers: −11, −3, 0, 5, 14, 20.`, run: (c) => show(c, rows[2]) }
      ];
    }
    const x0 = 230, x1 = W - 90, y = 266, X = numLine(stage, svg, { x0, x1, y, lo: -6, hi: 6 });
    const dot = (n, k) => { const d = add(stage, h('div', 'u1l4-dot c k-' + k), X(n), y); hide(d); return d; };
    const N = [1, 2, 3, 4, 5, 6].map((n) => dot(n, 'n')), Z = dot(0, 'w'), NEG = [-1, -2, -3, -4, -5, -6].map((n) => dot(n, 'i'));
    const bar = (k, from, yy, left) => {
      const b = add(stage, h('div', 'u1l4-bar k-' + k + (left ? ' both' : '')), from, yy); b.style.width = (x1 + 34 - from) + 'px'; hide(b);
      const lab = add(stage, h('div', 'u1l4-rowlab k-' + k, `${T(k.toUpperCase())} <span class="u1l4-rlw">${{ n: 'natural', w: 'whole', i: 'integers' }[k]}</span>`), 24, yy); lab.style.translate = '0 -50%'; hide(lab);
      return [b, lab];
    };
    const bI = bar('i', x0 - 34, 70, true), bW = bar('w', X(0) - 14, 128), bN = bar('n', X(1) - 14, 186);
    const grow = (c, [b, lab]) => Promise.all([c.anim(b, [{ opacity: 0, transform: 'scaleX(0)' }, { opacity: 1, transform: 'scaleX(1)' }], 600), c.fadeIn(lab, 300)]);
    return [
      { cap: `<b>Natural numbers</b> ${T('N=\\{1,\\ 2,\\ 3,\\ \\ldots\\}')}: the <b>counting</b> numbers. They start at 1 and never end (that’s the “…”).`, run: (c) => Promise.all([grow(c, bN), ...N.map((d, i) => c.pop(d, 320, { delay: 200 + i * 90 }))]) },
      { cap: `<b>Whole numbers</b> ${T('W=\\{0,\\ 1,\\ 2,\\ 3,\\ \\ldots\\}')}: the natural numbers, <b>plus 0</b>.`, run: (c) => Promise.all([grow(c, bW), c.pop(Z, 360, { delay: 250 })]) },
      { cap: `<b>Integers</b> ${T('I=\\{\\ldots,\\ -2,\\ -1,\\ 0,\\ 1,\\ 2,\\ \\ldots\\}')}: the whole numbers <b>and their opposites</b>. They go on forever both ways.`, run: (c) => Promise.all([grow(c, bI), ...NEG.map((d, i) => c.pop(d, 320, { delay: 200 + i * 90 }))]) },
      { cap: `Each set is tucked <b>inside</b> the next: every natural number is also whole, and also an integer. So 5 is in <b>all three</b>; 0 is whole and an integer; −3 is only an integer.`,
        run: (c) => Promise.all([bN, bW, bI].map(([b], i) => c.anim(b, [{ transform: 'scaleY(1)' }, { transform: 'scaleY(1.8)' }, { transform: 'scaleY(1)' }], 420, { delay: i * 260 }))) }
    ];
  }
};

/* ============ 2. Integers and terminating decimals are fractions too ============ */
const ASF = { '9': 9, '0.7': 0.7, '0.25': 0.25, '-3': -3, '-7': -7, '0.6': 0.6 };
const PLACE = ['tenths', 'hundredths', 'thousandths'];
const asFrac = {
  title: 'Integers and terminating decimals are fractions in disguise',
  height: 330,
  choices: [{ v: '9', label: '9' }, { v: '0.7', label: '0.7' }, { v: '0.25', label: '0.25' }, { v: '-3', label: '−3' }, { sep: 'Example 2 check:' }, { v: '-7', label: '−7' }, { v: '0.6', label: '0.6' }],
  intro: (v) => `Is ${T(v)} rational? We need to write it as ${T('\\tfrac{a}{b}')} with <b>integers</b> on the top and bottom.`,
  make(stage, v, ex) {
    const W = ex.W, num = add(stage, h('div', 'u1l4-af-num c', T(v)), 150, 70);
    const lx = 330, line = (i) => { const e = add(stage, h('div', 'u1l4-af-line'), lx, 24 + i * 92); hide(e); return e; };
    const L = [line(0), line(1), line(2)];
    const stamp = add(stage, h('div', 'pd-stamp prime u1l4-stamp'), W - 30, 240); stamp.style.translate = '-100% 0'; stamp.innerHTML = 'RATIONAL'; hide(stamp);
    const isInt = !/\./.test(v);
    if (isInt) {
      const n = Number(v);
      L[0].innerHTML = T(`${v}=\\dfrac{${v}}{1}`); L[1].innerHTML = T(`${v}=${v}.0`) + ' <span class="u1l4-tag end">terminates</span>';
      return [
        { cap: `${T(v)} is an <b>integer</b>. Write it over 1: ${T(`${v}=\\tfrac{${v}}{1}`)}. That’s a fraction with an integer on top and on the bottom.`, run: (c) => c.fadeIn(L[0], 400) },
        { cap: `As a decimal, ${T(`${v}=${v}.0`)}: it stops right away, so it <b>terminates</b>.`, run: (c) => c.fadeIn(L[1], 400) },
        { cap: `${T(v)} can be written as a fraction of two integers, so it’s <b>rational</b>. <b>Every integer is rational.</b>` + (n < 0 ? '' : ''), run: (c) => stampIn(c, stamp) }
      ];
    }
    const dg = v.split('.')[1], k = dg.length, top = Number(dg), den = 10 ** k, g = gcd(top, den);
    const tbl = add(stage, h('div', 'u1l4-pv'), 40, 150);
    const cols = ['ones', ...PLACE.slice(0, k)], digits = [v.split('.')[0], ...dg.split('')];
    tbl.innerHTML = cols.map((cname, i) => `<span class="u1l4-pvh">${cname}</span>${i === 0 ? '<span class="u1l4-pvh"></span>' : ''}`).join('') + digits.map((d, i) => `<b class="${i === k ? 'last' : ''}">${d}</b>${i === 0 ? '<b class="pt">.</b>' : ''}`).join('');
    tbl.style.gridTemplateColumns = `repeat(${k + 2}, auto)`; hide(tbl);
    L[0].innerHTML = T(`${v}=\\dfrac{${top}}{${den}}`);
    L[1].innerHTML = g > 1 ? T(`\\dfrac{${top}}{${den}}=\\dfrac{${top}\\div${g}}{${den}\\div${g}}=\\dfrac{${top / g}}{${den / g}}`) : '';
    L[2].innerHTML = `${T(v)} <span class="u1l4-tag end">terminates</span>`;
    const steps = [
      { cap: `Read the <b>place value</b>: the last digit of ${T(v)} is in the <b>${PLACE[k - 1]}</b> place.`, run: (c) => c.fadeIn(tbl, 400) },
      { cap: `So ${T(v)} is <b>${top} ${PLACE[k - 1]}</b>: ${T(`${v}=\\tfrac{${top}}{${den}}`)}.`, run: (c) => c.fadeIn(L[0], 400) }
    ];
    if (g > 1) steps.push({ cap: `Simplify: divide the top and bottom by ${g}. ${T(`\\tfrac{${top}}{${den}}=\\tfrac{${top / g}}{${den / g}}`)}.`, run: (c) => c.fadeIn(L[1], 400) });
    steps.push({ cap: `${T(v)} <b>terminates</b>, and it is a fraction of two integers, so it’s <b>rational</b>. Every terminating decimal works this way.`, run: (c) => Promise.all([c.fadeIn(L[2], 300), stampIn(c, stamp)]) });
    return steps;
  }
};

/* ============ 3. A square root is rational exactly when the number inside is a perfect square ============ */
const truncD = (x, d) => (Math.floor(x * 10 ** d) / 10 ** d).toFixed(d);
const perfectSq = {
  title: 'Perfect square or not? Build a square out of tiles',
  height: 380,
  choices: [16, 17, 25, 10, { sep: 'Example 3 check:' }, { v: 2, label: T('\\sqrt{2}') }, { v: 9, label: T('\\sqrt{9}') }],
  intro: (n) => `${T(`\\sqrt{${n}}`)} is the side of a square made of <b>${n}</b> tiles. Can ${n} tiles make a perfect square, with none left over?`,
  make(stage, n, ex) {
    const W = ex.W, a = Math.floor(Math.sqrt(n)), perfect = a * a === n, A = perfect ? a : a + 1, e = n - a * a;
    const ts = Math.min(60, 290 / A), ox = 70, oy = 50, sz = ts * 0.86, tiles = [];
    const cols0 = Math.ceil(Math.sqrt(n)), s0 = Math.min(30, 250 / cols0);
    for (let i = 0; i < n; i++) {
      const t = h('div', 'tile'), r = Math.round((Math.sin(i * 12.9898) * 43758.5453 % 1) * 24 - 12);
      const x = ox + (i % cols0) * s0 * 1.15 + (i * 7 % 5) - 2, y = oy + Math.floor(i / cols0) * s0 * 1.15 + (i * 3 % 5) - 2;
      t.style.width = t.style.height = s0 * 0.86 + 'px'; t._t = `translate(${x}px, ${y}px) rotate(${r}deg)`; t.style.transform = t._t;
      stage.appendChild(t); tiles.push(t);
    }
    const target = (i) => { if (i < a * a) return [i % a, Math.floor(i / a)]; const j = i - a * a; return j < a ? [a, j] : [j - a, a]; };
    const out = add(stage, h('div', 'u1l4-tl-out'), ox - 3, oy - 3); out.style.width = out.style.height = A * ts + 3 + 'px'; hide(out);
    const dimT = add(stage, h('div', 'u1l4-tl-dim c', a), ox + (a * ts) / 2, oy - 18), dimL = add(stage, h('div', 'u1l4-tl-dim c', a), ox - 20, oy + (a * ts) / 2); hide(dimT, dimL);
    const info = add(stage, h('div', 'u1l4-tl-info'), 440, 40); info.style.width = (W - 470) + 'px';
    const line = (t, cls = '') => { const el = h('div', 'u1l4-tl-line ' + cls, t); info.appendChild(el); return el; };
    const stamp = add(stage, h('div', 'pd-stamp u1l4-stamp ' + (perfect ? 'prime' : 'comp')), W - 30, 290); stamp.style.translate = '-100% 0'; stamp.innerHTML = perfect ? 'RATIONAL' : 'IRRATIONAL'; hide(stamp);
    const arrange = (c) => Promise.all(tiles.map((t, i) => {
      const [cx, cy] = target(i), x = ox + cx * ts, y = oy + cy * ts, to = `translate(${x}px, ${y}px) rotate(0deg)`, from = t._t; t._t = to;
      t.classList.add(i >= a * a ? 'u1l4-xtra' : 'good');
      return c.anim(t, [{ transform: from, width: t.style.width, height: t.style.height }, { transform: to, width: sz + 'px', height: sz + 'px' }], 700, { delay: Math.min(i * 6, 300) });
    }));
    const root = Math.sqrt(n);
    if (perfect) return [
      { cap: `<b>${n}</b> tiles make a perfect <b>${a} × ${a}</b> square, with none left over. ${n} is a <b>perfect square</b>.`, run: async (c) => { const l = line(T(`${a}\\times${a}=${n}`)); await Promise.all([arrange(c), c.fadeIn(dimT, 300, { delay: 600 }), c.fadeIn(dimL, 300, { delay: 600 }), c.fadeIn(l, 300, { delay: 500 })]); } },
      { cap: `So ${T(`\\sqrt{${n}}=${a}`)} exactly, and ${T(`${a}=\\tfrac{${a}}{1}`)}. The square root of a perfect square is <b>rational</b>.`, run: async (c) => { const l = line(T(`\\sqrt{${n}}=${a}=\\tfrac{${a}}{1}`), 'ok'); await Promise.all([c.fadeIn(l, 300), stampIn(c, stamp)]); } }
    ];
    return [
      { cap: `The biggest square uses <b>${a} × ${a} = ${a * a}</b> tiles, with <b>${e}</b> left over. ${n} is <b>not</b> a perfect square.`, run: async (c) => { const l = line(T(`${a}\\times${a}=${a * a}`) + ` <span class="u1l4-muted">(${e} left over)</span>`); await Promise.all([arrange(c), c.fadeIn(dimT, 300, { delay: 600 }), c.fadeIn(dimL, 300, { delay: 600 }), c.fadeIn(l, 300, { delay: 500 })]); } },
      { cap: `One size bigger, <b>${A} × ${A}</b>, needs ${A * A} tiles: ${A * A - n} too many. So ${T(`\\sqrt{${n}}`)} is <b>between ${a} and ${A}</b>, not a whole number.`, run: async (c) => { const l = line(T(`${a}\\lt\\sqrt{${n}}\\lt${A}`), 'amber'); await Promise.all([c.fadeIn(out, 400), c.fadeIn(l, 300)]); } },
      { cap: `Its decimal is ${T(`\\sqrt{${n}}=${truncD(root, 8)}\\ldots`)}: it <b>never ends and never repeats</b>. So ${T(`\\sqrt{${n}}`)} is <b>irrational</b>.`, run: async (c) => { const l = line(T(`\\sqrt{${n}}=${truncD(root, 8)}\\ldots`), 'red'); await Promise.all([c.fadeIn(l, 300), stampIn(c, stamp)]); } }
    ];
  }
};

/* ============ 5. Ordering real numbers on a number line ============ */
const ORD = {
  guests: { lo: -5, hi: 8, items: [
    { t: '7', v: 7, how: 'a whole number' }, { t: '0', v: 0, how: 'zero' }, { t: '-4', v: -4, how: 'four to the left of 0' },
    { t: '\\tfrac{3}{5}', v: 0.6, how: `${T('3\\div5=0.6')}` }, { t: '0.25', v: 0.25, how: 'a quarter of the way from 0 to 1' },
    { t: '\\sqrt{16}', v: 4, how: `${T('\\sqrt{16}=4')} (16 is a perfect square)` }, { t: '\\sqrt{2}', v: Math.SQRT2, how: `1 &lt; 2 &lt; 4, so ${T('\\sqrt{2}')} is between ${T('\\sqrt1=1')} and ${T('\\sqrt4=2')}: about <b>1.4</b>` }] },
  mix: { lo: -3, hi: 3, items: [
    { t: '\\tfrac{1}{2}', v: 0.5, how: `${T('1\\div2=0.5')}` }, { t: '-\\sqrt{4}', v: -2, how: `${T('\\sqrt4=2')}, so ${T('-\\sqrt4=-2')}` },
    { t: '\\sqrt{3}', v: Math.sqrt(3), how: `1 &lt; 3 &lt; 4, so ${T('\\sqrt3')} is between 1 and 2, closer to 2: about <b>1.7</b>` }, { t: '-0.8', v: -0.8, how: 'just to the right of −1' }, { t: '1.2', v: 1.2, how: 'a little past 1' }] },
  ex5: { lo: -2, hi: 3, items: [
    { t: '\\tfrac{3}{4}', v: 0.75, how: `${T('3\\div4=0.75')}` }, { t: '\\sqrt{2}', v: Math.SQRT2, how: `1 &lt; 2 &lt; 4, so ${T('\\sqrt{2}')} is between ${T('\\sqrt1=1')} and ${T('\\sqrt4=2')}: about <b>1.4</b>` },
    { t: '-1.5', v: -1.5, how: 'halfway between −2 and −1' }, { t: '2', v: 2, how: 'a whole number' },
    { t: '-\\sqrt{1}', v: -1, how: `${T('\\sqrt1=1')} (1 is a perfect square), so ${T('-\\sqrt1=-1')}` }, { t: '0.9', v: 0.9, how: 'just below 1' }] }
};
const order = {
  title: 'Estimate, place, read left to right',
  height: 360,
  choices: [{ v: 'guests', label: 'the 7 club guests' }, { v: 'mix', label: T('\\tfrac12,\\ -\\sqrt4,\\ \\sqrt3,\\ \\ldots') }, { sep: 'Example 5 check:' }, { v: 'ex5', label: T('\\tfrac34,\\ \\sqrt2,\\ -1.5,\\ 2,\\ -\\sqrt1,\\ 0.9') }],
  intro: (v) => `Put ${ORD[v].items.map((o) => T(o.t)).join(', ')} in order. For each one: turn it into a <b>decimal</b> (or estimate it), then <b>place</b> it on the line.`,
  make(stage, v, ex) {
    const W = ex.W, S = ORD[v], svg = sv('svg', { class: 'u1l4-nest-svg' }); stage.appendChild(svg);
    const y = 214, X = numLine(stage, svg, { x0: 70, x1: W - 70, y, lo: S.lo, hi: S.hi });
    const est = add(stage, h('div', 'u1l4-ord-est'), 22, 14); est.style.width = (W - 44) + 'px';
    const placed = [], steps = [], LV = new Map();
    S.items.slice().sort((a, b) => a.v - b.v).forEach((o) => { let lvl = 0; while (placed.some((p) => p.lvl === lvl && Math.abs(X(p.v) - X(o.v)) < 62)) lvl++; placed.push({ v: o.v, lvl }); LV.set(o, lvl); });
    S.items.forEach((o) => {
      const val = o.v, approx = Number.isInteger(val) ? String(val) : Math.abs(val * 100 - Math.round(val * 100)) < 1e-9 ? String(val) : '≈ ' + tenth(val);
      const lvl = LV.get(o);
      steps.push({
        cap: `${T(o.t)}: ${o.how}.`,
        run: async (c) => {
          est.innerHTML = `${T(o.t)} &nbsp;→&nbsp; <b>${approx.replace('-', '−')}</b>`;
          const d = add(stage, h('div', 'u1l4-dot c k-r'), X(val), y), ly = y - 34 - lvl * 36, lab = add(stage, h('div', 'u1l4-olab c', T(o.t)), X(val), ly);
          const jobs = [c.fadeIn(est, 300), c.pop(d, 380, { delay: 150 }), c.pop(lab, 360, { delay: 250 })];
          if (lvl) { const st = add(stage, h('div', 'u1l4-stem'), X(val) - 1, ly + 16); st.style.height = (y - ly - 24) + 'px'; jobs.push(c.fadeIn(st, 300, { delay: 250, from: 'none' })); }
          await Promise.all(jobs);
        }
      });
    });
    const srt = S.items.slice().sort((a, b) => a.v - b.v);
    steps.push({
      cap: `Read the number line from <b>left to right</b>: that’s least to greatest. ${T(srt.map((o) => o.t).join(',\\ \\ '))}.`,
      run: async (c) => {
        est.innerHTML = '<b>Least to greatest</b>';
        const ol = add(stage, h('div', 'u1l4-order c', srt.map((o) => `<span>${T(o.t)}</span>`).join('<i>&lt;</i>')), W / 2, 300);
        await Promise.all([c.fadeIn(est, 300), c.fadeIn(ol, 450, { delay: 150 })]);
      }
    });
    return steps;
  }
};


/* ============ warm-up: The Number Club — tap a guest, then tap the deepest room they are allowed into ============
 * The rooms are the nested sets (Real building; Rational, Integers, Whole, Natural rooms; the Irrational lounge).
 * A guest sent to the right room sits down there. A room they're allowed into but not the deepest: "go deeper!".
 * A room they're not allowed into: the bouncer says why. "Seat everyone" seats them all; the arrow starts over. */
const GUESTS = [
  { t: '7', home: 'N', why: '7 is a counting number' }, { t: '0', home: 'W', why: '0 is whole, but we start counting at 1' },
  { t: '-4', home: 'I', why: 'negatives stop at the integers' }, { t: '\\tfrac{3}{5}', home: 'Q', why: 'already a fraction (0.6)' },
  { t: '0.25', home: 'Q', why: '0.25 = 1/4, a terminating decimal' }, { t: '\\sqrt{16}', home: 'N', why: '√16 = 4, a counting number' },
  { t: '\\sqrt{2}', home: 'Qb', why: '√2 = 1.41421356… never ends, never repeats' }
];
function mountClub() {
  const host = document.getElementById('u1l4-club'); if (!host) return;
  const st = document.getElementById('u1l4-club-st'), W = 640, H = 318;
  host.style.width = W + 'px'; host.style.height = H + 'px';
  const g = nestGeom(118, 4, W - 122, H - 8, { qbw: 112, strip: 44, top: 38, labW: 128, sp: 58, nY: 0.62, qbTop: 96, qbSp: 50 });
  const { parts } = drawNest(host, g, { rooms: true });
  // a tap on a room: the topmost room box under the finger is the deepest room at that point
  const rooms = {};
  ['R', 'Q', 'Qb', 'I', 'W', 'N'].forEach((k) => {
    const r = g[k], b = add(host, h('div', 'u1l4-room'), r.x, r.y); b.style.width = r.w + 'px'; b.style.height = r.h + 'px'; b.dataset.k = k; b.setAttribute('data-tap', '');
    b.addEventListener('click', () => sendTo(k)); rooms[k] = b;
  });
  Object.values(parts).forEach(([, lab]) => host.appendChild(lab)); // labels above the tap boxes (they don't take taps)
  const seated = { N: 0, W: 0, I: 0, Q: 0, Qb: 0, R: 0 };
  let sel = null;
  const queue = GUESTS.map((gst, i) => {
    const b = h('button', 'u1l4-guest c', T(gst.t)); b.type = 'button'; gst.qx = 52; gst.qy = 26 + i * 44; add(host, b, gst.qx, gst.qy);
    b.addEventListener('click', (e) => { e.stopPropagation(); if (gst.seat) return; sel = sel === gst ? null : gst; queue.forEach((q) => q.classList.toggle('sel', sel && q === gst.b)); say(sel ? `Where does ${T(gst.t)} go? Tap a room.` : ''); });
    gst.b = b; return b;
  });
  const say = (html, cls = '') => { st.className = 'u1l4-club-st ' + cls; st.innerHTML = '<span>' + (html || '<span class="muted">Tap a guest, then tap the <b>deepest</b> room they’re allowed into.</span>') + '</span>'; };
  function seat(gst, anim) {
    const k = gst.home, [x, y] = g.slot(k, seated[k]++, 2); gst.seat = true; gst.b.classList.remove('sel'); gst.b.classList.add('in', 'k-' + k.toLowerCase());
    const ox = parseFloat(gst.b.style.left), oy = parseFloat(gst.b.style.top); at(gst.b, x, y);
    if (anim && gst.b.animate) gst.b.animate([{ transform: `translate(${ox - x}px, ${oy - y}px)` }, { transform: 'none' }], { duration: 520, easing: 'cubic-bezier(.3,.1,.3,1.2)' });
  }
  function sendTo(k) {
    if (!sel) { say(); return; }
    const gst = sel, ok = INSIDE[gst.home].includes(k);
    if (k === gst.home) { sel = null; seat(gst, true); say(`<b>Yes!</b> ${T(gst.t)} → <b>${SETS[k].room}</b>: ${gst.why}.`, 'ok'); }
    else if (ok) say(`${T(gst.t)} is allowed in <b>${SETS[k].room}</b>, but there’s a <b>deeper</b> room for it. Try again!`, 'deeper');
    else { say(`The bouncer says <b>no</b>: ${T(gst.t)} is not ${SETS[k].is}.`, 'no'); if (gst.b.animate) gst.b.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-7px)' }, { transform: 'translateX(7px)' }, { transform: 'translateX(0)' }], 360); }
  }
  function reset() { sel = null; Object.keys(seated).forEach((k) => (seated[k] = 0)); GUESTS.forEach((gst) => { gst.seat = false; gst.b.className = 'u1l4-guest c'; at(gst.b, gst.qx, gst.qy); }); say(); }
  document.querySelector('[data-u1l4-club="all"]').addEventListener('click', () => { GUESTS.forEach((gst) => { if (!gst.seat) seat(gst, true); }); sel = null; say('Everyone is seated. Notice: √16 and √2 look like twins, but they go to <b>different</b> rooms.', 'ok'); });
  document.querySelector('[data-u1l4-club="reset"]').addEventListener('click', reset);
  say();
}

/* ============ Example 4: tap a cell to put a check mark in it (the answers show in red with the part's Answer) ============ */
function mountTable() {
  document.querySelectorAll('.u1l4-ck').forEach((b) => b.addEventListener('click', () => b.classList.toggle('on')));
}

/* ============ Example 5 (b): the booklet's number line, and the answer with the six points ============ */
function mountEx5() {
  const q = document.getElementById('u1l4-ex5q'), a = document.getElementById('u1l4-ex5a');
  const opts = { width: 640, height: 150, min: -2, max: 3, step: 1, pad: 50, fontSize: 21 };
  if (q) new NumberLine(q, opts);
  if (a) {
    const L = new NumberLine(a, opts);
    [['-1.5', -1.5, 0], ['-\\sqrt{1}', -1, 0], ['\\tfrac{3}{4}', 0.75, 0], ['0.9', 0.9, 40], ['\\sqrt{2}', Math.SQRT2, 0], ['2', 2, 0]].forEach(([t, v, lift]) => {
      L.point(v, { color: 'red' });
      L.mark(v, t, { tex: true, lift: 10 + lift, color: 'red' });
    });
  }
}


/* =============================== mount =============================== */
function mountExplainers() {
  const defs = { nwi, asFrac, longdiv, perfectSq, stripes, flow, build, sorter, order };
  document.querySelectorAll('[data-explainer]').forEach((el) => { if (defs[el.dataset.explainer]) new Explainer(el, defs[el.dataset.explainer]); });
}
/* the booklet's Section 4 diagram, drawn on the card (same picture as the explainers, with the booklet's examples) */
function mountNestFig() {
  const host = document.getElementById('u1l4-nestfig'); if (!host) return;
  const W = 960, H = 380; host.style.width = W + 'px'; host.style.height = H + 'px';
  const g = nestGeom(4, 4, W - 8, H - 8, { qbw: 170, strip: 50, top: 40, labW: 470, sp: 70, nY: 0.64, qbTop: 96, qbSp: 60 });
  drawNest(host, g, { long: { R: '— every point on the number line', Q: `— any ${T('\\tfrac{a}{b}')} with <i>a</i>, <i>b</i> integers, ${T('b\\neq0')}`, I: '— the whole numbers and their opposites', W: '— the natural numbers together with zero', N: '— the counting numbers' } });
  const put = (k, ts) => ts.forEach((t, i) => chipAt(host, t, g.slot(k, i, ts.length), k.toLowerCase()));
  put('Q', ['\\tfrac{2}{3}', '0.75', '0.\\overline{3}']); put('I', ['-7', '-1']); put('W', ['0']); put('N', ['1', '2', '3', '4', '\\ldots']); put('Qb', ['\\pi', '\\sqrt{2}', '\\sqrt{13}']);
  add(host, h('div', 'u1l4-nfnote c', 'never ends,<br>never repeats'), g.Qb.x + g.Qb.w / 2, g.Qb.y + g.Qb.h - 36);
}
mountExplainers(); mountClub(); mountTable(); mountEx5(); mountNestFig();

/* ============ Stand Up Break! — classify numbers, rational or irrational, and ordering (lessons/js/standup.js) ============
 * BEG: every set a number belongs to (Example 4) · PRG: rational or irrational, with a reason (Examples 2–3)
 * · MAS: a set of six numbers: list the natural, whole, integer, rational and irrational members (Example 1, every set).
 * (Ordering comes after the break, in Section 5, so it isn't asked here.) */
const suLab = (i) => '\\text{(' + 'abcdef'[i] + ')}\\ ';
const suGrid = (items, cols) => { const rows = []; for (let i = 0; i < items.length; i += cols) rows.push(items.slice(i, i + cols).map((x, j) => (j ? '\\hspace{2.5em}' : '') + suLab(i + j) + '{' + x + '}').join(' & ')); return '\\def\\arraystretch{1.7}\\begin{array}{' + 'l'.repeat(cols) + '}' + rows.join('\\\\') + '\\end{array}'; };
const suSq = (n) => Math.round(Math.sqrt(n)) ** 2 === n;
function suDec(a, b) { // a/b (a, b > 0) as a decimal, with a bar over the repeating block
  const ip = Math.floor(a / b), digs = [], seen = {}; let rem = a % b;
  while (rem && !(rem in seen)) { seen[rem] = digs.length; rem *= 10; digs.push(Math.floor(rem / b)); rem %= b; }
  if (!rem) return ip + (digs.length ? '.' + digs.join('') : '');
  return ip + '.' + digs.slice(0, seen[rem]).join('') + '\\overline{' + digs.slice(seen[rem]).join('') + '}';
}
const SU_SETS = { N: 'N,\\ W,\\ I,\\ Q,\\ R', W: 'W,\\ I,\\ Q,\\ R', I: 'I,\\ Q,\\ R', Q: 'Q,\\ R', Qb: '\\overline{Q},\\ R' };
const suSETKIND = {
  pos: (r) => ({ t: String(r.int(2, 60)), home: 'N' }),
  zero: () => ({ t: '0', home: 'W' }),
  neg: (r) => ({ t: String(-r.int(1, 40)), home: 'I' }),
  frac: (r) => { const b = r.pick([2, 3, 4, 5, 6, 8, 9]); let a; do a = r.int(1, 3 * b); while (gcd(a, b) !== 1 || a % b === 0); return { t: (r.chance(0.3) ? '-' : '') + `\\tfrac{${a}}{${b}}`, home: 'Q' }; },
  dec: (r) => { let x; do x = r.int(11, 99); while (x % 10 === 0); return { t: (r.chance(0.3) ? '-' : '') + String(x / 10), home: 'Q' }; },
  rep: (r) => { const d = r.pick(['3', '6', '1', '8', '27', '45', '12']); return { t: `${r.int(0, 3)}.\\overline{${d}}`, home: 'Q' }; },
  sqP: (r) => { const k = r.int(2, 10); return r.chance(0.5) ? { t: `\\sqrt{${k * k}}`, val: '=' + k, home: 'N' } : { t: `-\\sqrt{${k * k}}`, val: '=-' + k, home: 'I' }; },
  sqN: (r) => { let n; do n = r.int(2, 80); while (suSq(n)); return { t: `${r.chance(0.25) ? '-' : ''}\\sqrt{${n}}`, home: 'Qb' }; },
  pi: (r) => ({ t: r.pick(['\\pi', '2\\pi', '-\\pi']), home: 'Qb' })
};
function suSets(r) {
  for (;;) {
    const ks = r.shuffle(['pos', r.pick(['zero', 'neg']), r.pick(['frac', 'dec', 'rep']), r.pick(['sqP', 'sqP', 'neg']), r.pick(['sqN', 'pi', 'sqN'])]).slice(0, 4), xs = ks.map((k) => suSETKIND[k](r));
    if (new Set(xs.map((x) => x.t)).size < 4 || !xs.some((x) => x.home === 'Qb')) continue;
    return { text: 'List <b>every</b> set each number belongs to: ' + 'N, W, I, Q, ' + T('\\overline{Q}') + ', R.', q: suGrid(xs.map((x) => x.t), 2),
      a: xs.map((x, i) => suLab(i) + '{' + x.t + '}' + (x.val || '') + ':\\ \\ ' + SU_SETS[x.home]) };
  }
}
const suKINDS = { // one number of each kind: { t: LaTeX, val: '=…' (its value, if useful), why: a short reason, rat }
  term: (r) => { const b = r.pick([4, 8, 5, 20, 25, 2]); let a; do a = r.int(1, 3 * b); while (gcd(a, b) !== 1 || a % b === 0); return { t: `\\dfrac{${a}}{${b}}`, val: '=' + suDec(a, b), why: 'terminates', rat: true }; },
  rep: (r) => { const b = r.pick([3, 6, 9, 11, 12]); let a; do a = r.int(1, 2 * b); while (gcd(a, b) !== 1 || a % b === 0); return { t: `\\dfrac{${a}}{${b}}`, val: '=' + suDec(a, b), why: 'repeats', rat: true }; },
  sqP: (r) => { const k = r.int(2, 12), s = r.chance(0.35) ? '-' : ''; return { t: `${s}\\sqrt{${k * k}}`, val: '=' + s + k, why: k * k + '\\text{ is a perfect square}', rat: true }; },
  sqN: (r) => { let n; do n = r.int(2, 99); while (suSq(n)); return { t: `\\sqrt{${n}}`, val: '', why: n + '\\text{ is not a perfect square}', rat: false }; },
  repD: (r) => { const I = r.int(0, 5); let blk; do blk = Array.from({ length: r.int(1, 2) }, () => r.int(0, 9)).join(''); while (/^(\d)\1+$/.test(blk) || /^[09]+$/.test(blk));
    return { t: `${I}.` + (blk.length > 1 ? Array(3).fill(blk).join('') : blk.repeat(6)) + '\\ldots', val: '', why: '\\text{the block } ' + blk + '\\text{ repeats}', rat: true }; },
  pat: (r) => { const I = r.int(0, 7), c = r.int(1, 9); let d; do d = r.int(0, 9); while (d === c); let s = ''; for (let k = 1; s.length < 8; k++) s += String(d).repeat(k) + c;
    return { t: `${I}.${s}\\ldots`, val: '', why: '\\text{the run of } ' + d + '\\text{s grows: no block repeats}', rat: false }; },
  pi: (r) => (r.chance(0.6) ? { t: '\\pi', val: '', why: '\\text{never ends, never repeats}', rat: false } : { t: '\\dfrac{22}{7}', val: '=' + suDec(22, 7), why: '\\text{a fraction (close to } \\pi)', rat: true }),
  int: (r) => { const n = (r.chance(0.5) ? -1 : 1) * r.int(2, 30); return { t: String(n), val: '=\\tfrac{' + n + '}{1}', why: '\\text{an integer}', rat: true }; },
  dec: (r) => { let m; do m = r.int(11, 99); while (m % 10 === 0); const x = (r.chance(0.3) ? -1 : 1) * m / r.pick([10, 100]); return { t: String(x), val: '', why: 'terminates', rat: true }; }
};
function suClassify(r) {
  for (;;) {
    const ks = r.shuffle(Object.keys(suKINDS)).slice(0, 4), xs = ks.map((k) => suKINDS[k](r));
    if (!xs.some((x) => x.rat) || xs.every((x) => x.rat)) continue;
    return { text: 'Classify each number as <b>rational</b> or <b>irrational</b>. Give a short reason.', q: suGrid(xs.map((x) => x.t), 2),
      a: xs.map((x, i) => suLab(i) + '{' + x.t + '}' + x.val + ':\\ \\textbf{' + (x.rat ? 'rational' : 'irrational') + '}\\quad(' + (/^[a-z]+$/.test(x.why) ? '\\text{' + x.why + '}' : x.why) + ')') };
  }
}
/* MAS: a set of six mixed numbers: list the members of each set (Example 1, now with every kind of number) */
function suList(r) {
  for (;;) {
    const ks = ['pos', r.pick(['neg', 'neg', 'zero']), r.pick(['frac', 'dec']), r.pick(['rep', 'frac', 'dec']), r.pick(['sqP', 'neg', 'pos']), r.pick(['sqN', 'pi'])];
    const xs = ks.map((k) => suSETKIND[k](r));
    if (new Set(xs.map((x) => x.t)).size < 6) continue;
    const of = (home) => xs.filter((x) => INSIDE[x.home].includes(home)), show = (arr) => (arr.length ? arr.map((x) => x.t).join(',\\ ') : '\\text{none}');
    return { text: 'For this set of numbers, list every member that is <b>(a)</b> natural <b>(b)</b> whole <b>(c)</b> an integer <b>(d)</b> rational <b>(e)</b> irrational.',
      q: '\\left\\{' + r.shuffle(xs).map((x) => x.t).join(',\\ ') + '\\right\\}',
      a: [['N', '(a)'], ['W', '(b)'], ['I', '(c)'], ['Q', '(d)'], ['Qb', '(e)']].map(([k, l]) => '\\text{' + l + ' }' + show(of(k))).concat(xs.filter((x) => x.val).map((x) => x.t + x.val)) };
  }
}
standup('u1l4', {
  intro: 'Talk it through as a group: which sets is it in? Does its decimal end, repeat, or neither?',
  levels: {
    BEG: (r) => suSets(r),      // Example 4
    PRG: (r) => suClassify(r),  // Examples 2 and 3
    MAS: (r) => suList(r)       // Example 1, with every set
  }
});


/* ---------- Math History (the brown box): Archimedes' 22/7 and Zu Chongzhi's 355/113 race π digit by digit ----------
 * The decimals appear one place at a time; a fraction's digits stay gold while they still match π. It pauses where 22/7
 * (2 places) and 355/113 (6 places) stop matching, then bars mark 22/7's repeating block 142857. Plays once when the box is
 * half in view; a tap or Replay plays it again; reduced motion shows the finished picture. */
(function piRace() {
  const svg = document.getElementById('u1l4-hist'); if (!svg) return;
  const SVGNS = 'http://www.w3.org/2000/svg';
  const mk = (tag, attrs, parent) => { const e = document.createElementNS(SVGNS, tag); Object.keys(attrs || {}).forEach((k) => e.setAttribute(k, attrs[k])); (parent || svg).appendChild(e); return e; };
  const txt = (s, attrs, parent) => { const e = mk('text', attrs, parent); e.textContent = s; return e; };
  const N = 20; // decimal places shown
  const decs = (n, d) => { let r = n % d, s = ''; for (let i = 0; i < N; i++) { r *= 10; s += Math.floor(r / d); r %= d; } return s; };
  const PI = '14159265358979323846';
  const ROWS = [
    { y: 84, digits: PI, ref: true, sub: 'never ends, never repeats: π is irrational' },
    { y: 162, digits: decs(355, 113), n: 355, d: 113, sub: 'Zu Chongzhi · repeats too, but only after a block of 112 digits' },
    { y: 240, digits: decs(22, 7), n: 22, d: 7, sub: 'Archimedes · the block 142857 repeats forever' },
  ];
  // when each decimal place appears: slow at first, a pause after place 3 (22/7 misses) and place 7 (355/113 misses)
  const T = []; let t = 600;
  for (let i = 0; i < N; i++) { T.push(t); t += i < 7 ? 420 : 210; if (i === 2) t += 500; if (i === 6) t += 900; }
  const steps = [], at = (el, ms) => { steps.push({ el, t: ms }); return el; };
  const tDone = T[N - 1] + 600;
  txt('Decimal by decimal', { x: 24, y: 30, class: 'u1l4h-hd' });
  const count = txt('', { x: 576, y: 30, 'text-anchor': 'end', class: 'u1l4h-count' });
  const X0 = 146, DX = 13.6, XD = 183; // "3" at X0, decimals from XD
  ROWS.forEach((r, k) => {
    if (r.ref) txt('π', { x: 70, y: r.y + 5, 'text-anchor': 'middle', class: 'u1l4h-pi' });
    else {
      txt(String(r.n), { x: 70, y: r.y - 8, 'text-anchor': 'middle', class: 'u1l4h-fr' });
      mk('line', { x1: 50, x2: 90, y1: r.y - 2, y2: r.y - 2, class: 'u1l4h-bar' });
      txt(String(r.d), { x: 70, y: r.y + 16, 'text-anchor': 'middle', class: 'u1l4h-fr' });
    }
    txt('=', { x: 108, y: r.y + 5, 'text-anchor': 'middle', class: 'u1l4h-fr' });
    at(txt('3.', { x: X0, y: r.y + 6, class: 'u1l4h-d ref' }), 300);
    let match = 0, still = true;
    for (let i = 0; i < N; i++) {
      const ok = r.ref || (still && r.digits[i] === PI[i]); if (!ok) still = false; else match = i + 1;
      at(txt(r.digits[i], { x: XD + i * DX, y: r.y + 6, 'text-anchor': 'middle', class: 'u1l4h-d ' + (r.ref ? 'ref' : ok ? 'hit' : 'miss') }), T[i]);
    }
    // how many places match π
    const g = at(mk('g', { class: 'u1l4h-g' }), r.ref ? tDone : T[match] + 150);
    mk('rect', { x: 470, y: r.y - 13, width: 112, height: 26, rx: 13, class: 'u1l4h-pill' + (r.ref ? ' pi' : '') }, g);
    txt(r.ref ? 'the real π' : match + ' places ✓', { x: 526, y: r.y + 5, 'text-anchor': 'middle', class: 'u1l4h-pt' }, g);
    // what its decimal does
    const sub = at(mk('g', { class: 'u1l4h-g' }), tDone + 500 + (2 - k) * 1100);
    txt(r.sub, { x: X0, y: r.y + 32, class: 'u1l4h-sub' }, sub);
    if (r.d === 7) for (let b = 0; b + 6 <= N; b += 6) mk('line', { x1: XD + b * DX - 4, x2: XD + (b + 5) * DX + 4, y1: r.y - 15, y2: r.y - 15, class: 'u1l4h-ob' + (b ? ' u1l4h-ob2' : '') }, sub);
  });
  const END = tDone + 500 + 2 * 1100 + 600;
  let t0 = 0, raf = 0;
  function draw(ms) {
    steps.forEach((s) => s.el.classList.toggle('on', s.t <= ms));
    const shown = T.filter((x) => x <= ms).length;
    count.textContent = shown ? `decimal places: ${shown}` : '';
  }
  function frame(now) { if (!t0) t0 = now; const ms = now - t0; draw(ms); if (ms < END) raf = requestAnimationFrame(frame); }
  function play() {
    cancelAnimationFrame(raf); t0 = 0;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { draw(END); return; }
    draw(-1); raf = requestAnimationFrame(frame);
  }
  draw(-1);
  svg.addEventListener('click', play);
  const btn = svg.closest('.hist-anim') && svg.closest('.hist-anim').querySelector('.hist-play'); if (btn) btn.addEventListener('click', play);
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { io.disconnect(); play(); } }, { threshold: 0.5 });
    io.observe(svg);
  } else play();
})();
