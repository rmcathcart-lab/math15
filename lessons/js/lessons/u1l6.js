/* Math 15 · Unit 1 · Lesson 6 — Simplifying Square Roots: Entire and Mixed Radicals.
 * Warm-up (Tilted Squares: a dot grid; tap a square to count it, box it in, or tile it with copies of C), tap-to-fill
 * blanks for the booklet's fill-in lines, the perfect-squares strip, and the explainers:
 *   area    (cut a square of area n into equal smaller squares: its side is s copies of √r — √50 = 5√2, Example 1 check),
 *   finder  (which perfect squares divide n? the largest one comes out — notes √48, Example 1 check),
 *   pairs   (prime factors: each pair of matching primes leaves the root as one number — √108, Example 2, Example 5(b)),
 *   entire  (mixed → entire: the coefficient goes back in as its square — 2√5, Example 3 check),
 *   order   (write them all as entire radicals, then line them up — Example 4),
 *   again   (a smaller square first means going again; the largest square does it in one step — Example 5(a)).
 * Adapted from the Math 10C twin (u1l7: area, finder, pairs, entire, numline), at Math 15 level: whole-number
 * coefficients only, no fractions or negatives in front. */
import { h, fmt, primeFactors } from '../explain.js';
import { tex } from '../tex.js';
import { mountExplainers, svgEl } from '../blocks.js';
import { standup } from '../standup.js';

const at = (el, x, y) => { el.style.left = x + 'px'; el.style.top = y + 'px'; return el; };
const add = (stage, el, x, y) => { stage.appendChild(at(el, x, y)); return el; };
const hide = (...els) => els.forEach((e) => { if (e) e.style.opacity = 0; });

/* KaTeX, allowing \htmlClass / \htmlData (tappable blanks, and tokens that fly from one line to the next) */
const K = (src, display) => {
  try { return window.katex.renderToString(String(src), { displayMode: !!display, throwOnError: false, strict: 'ignore', trust: true, output: 'html' }); }
  catch (e) { return tex(src, display); }
};

/* ---------- number helpers ---------- */
const tn = (n) => fmt(n).replace(/ /g, '\\,');
const R = (n) => `\\sqrt{${tn(n)}}`;
function sqPart(n) { let s = 1; for (let k = 2; k * k <= n; k++) if (n % (k * k) === 0) s = k; return { s, r: n / (s * s) }; }
const mixT = (s, r) => (r === 1 ? tn(s) : s === 1 ? R(r) : `${tn(s)}${R(r)}`);
const isSq = (n) => n >= 0 && Number.isInteger(Math.sqrt(n));
const dec = (x, d = 3) => { if (Math.abs(x - Math.round(x)) < 1e-9) return fmt(Math.round(x)); return x.toFixed(d) + '…'; };

/* ---------- drawing helpers ---------- */
function chain(stage, parts, x, y, o = {}) { // a row of LaTeX pieces that can be revealed one at a time without reflowing
  const row = add(stage, h('div', 'u1l6-chain' + (o.cls ? ' ' + o.cls : '')), x, y);
  if (o.fs) row.style.fontSize = o.fs + 'px';
  const els = parts.map((p) => { const e = h('span', 'u1l6-piece', K(p)); row.appendChild(e); return e; });
  return { row, els };
}
async function fly(c, stage, from, to, src, o = {}) { // a copy of `src` flies from one token to another
  if (!to) return;
  if (c.fast || !from) { to.style.opacity = 1; return; }
  c.check();
  const sr = stage.getBoundingClientRect(), k = sr.width / stage.offsetWidth || 1;
  const a = from.getBoundingClientRect(), b = to.getBoundingClientRect();
  const ax = (a.left + a.width / 2 - sr.left) / k, ay = (a.top + a.height / 2 - sr.top) / k;
  const bx = (b.left + b.width / 2 - sr.left) / k, by = (b.top + b.height / 2 - sr.top) / k;
  const g = add(stage, h('div', 'u1l6-fly c', K(src)), ax, ay); if (o.fs) g.style.fontSize = o.fs + 'px';
  g.style.opacity = 0;
  try {
    await c.anim(g, [{ opacity: 1, transform: 'translate(0,0) scale(1.15)' }, { opacity: 1, transform: `translate(${(bx - ax) / 2}px, ${(by - ay) / 2 - 18}px) scale(1.25)`, offset: 0.5 }, { opacity: 1, transform: `translate(${bx - ax}px, ${by - ay}px) scale(1)` }], o.ms || 800, { delay: o.delay || 0 });
  } finally { g.remove(); }
  to.style.opacity = 1;
}
function board(stage, o) { // written work: one LaTeX line per row, with a short note beside it
  const rows = [];
  return {
    rows,
    line(src, note) {
      const y = o.y + rows.length * o.lh;
      const el = add(stage, h('div', 'u1l6-wk', K(src)), o.x, y); el.style.fontSize = o.fs + 'px'; el.style.height = (o.lh - 6) + 'px';
      let n = null;
      if (note != null) { n = add(stage, h('div', 'u1l6-note', `<div>${note}</div>`), o.nx, y); n.style.width = o.nw + 'px'; n.style.height = (o.lh - 6) + 'px'; }
      hide(el, n); const r = { el, n, q: (s) => el.querySelector(s) }; rows.push(r); return r;
    }
  };
}
async function showRow(c, stage, row, flights = [], fs) {
  flights.forEach((f) => { if (f[1]) f[1].style.opacity = 0; });
  const jobs = [c.anim(row.el, [{ opacity: 0 }, { opacity: 1 }], 380)];
  if (row.n) jobs.push(c.fadeIn(row.n, 380, { delay: 150, from: 'translateX(10px)' }));
  flights.forEach(([a, b, src], i) => jobs.push(fly(c, stage, a, b, src, { fs, delay: 150 + i * 120 })));
  await Promise.all(jobs);
}
function radSign(stage, x, y, w, ht) { // a hand-drawn root sign whose bar spans w px
  const s = add(stage, svgEl('svg', { class: 'u1l6-rad', width: w + 4, height: ht + 4 }), x, y);
  s.appendChild(svgEl('path', { d: `M2 ${ht * 0.6} L11 ${ht * 0.5} L24 ${ht} L40 3 L${w} 3` }));
  return s;
}
const stampEl = (stage, html, x, y) => { const s = add(stage, h('div', 'u1l6-stamp', html), x, y); hide(s); return s; };
const stampIn = (c, el) => c.anim(el, [{ opacity: 0, transform: 'scale(1.7) rotate(-12deg)' }, { opacity: 1, transform: 'scale(1) rotate(-4deg)' }], 420, { easing: 'cubic-bezier(.2,1.4,.4,1)' });

/* ============ 1. What a mixed radical means: cut the square ============ */
const area = {
  title: 'Cut the square into equal smaller squares',
  height: 420,
  minW: 860,
  choices: [{ sep: 'Notes:' }, { v: 50, label: tex('\\sqrt{50}') }, { sep: 'Warm-up:' }, { v: 8, label: tex('\\sqrt{8}') }, { v: 12, label: tex('\\sqrt{12}') }, { v: 30, label: tex('\\sqrt{30}') },
    { sep: 'Example 1 check:' }, { v: 18, label: tex('\\sqrt{18}') }, { v: 45, label: tex('\\sqrt{45}') }],
  custom: [2, 400],
  intro: (n) => `A square has area <b>${fmt(n)}</b>. Its side is ${tex(R(n))}. What does that side look like as a <b>mixed radical</b>?`,
  make(stage, n, ex) {
    const W = ex.W, L = 300, x0 = 100, y0 = 40, { s, r } = sqPart(n), S = s * s, cell = L / s;
    const sqd = add(stage, h('div', 'u1l6-arsq'), x0, y0); sqd.style.width = sqd.style.height = L + 'px';
    const areaL = add(stage, h('div', 'u1l6-ararea c', `Area = <b>${fmt(n)}</b>`), x0 + L / 2, y0 + L / 2);
    const sideL = add(stage, h('div', 'u1l6-arside', K(R(n))), x0 - 14, y0 + L / 2); sideL.style.translate = '-100% -50%'; hide(sideL);
    const svg = add(stage, svgEl('svg', { class: 'u1l6-argrid', width: L, height: L }), x0, y0);
    const lines = [];
    for (let i = 1; i < s; i++) {
      lines.push(svg.appendChild(svgEl('line', { x1: i * cell, y1: 0, x2: i * cell, y2: L })));
      lines.push(svg.appendChild(svgEl('line', { x1: 0, y1: i * cell, x2: L, y2: i * cell })));
    }
    lines.forEach((l) => (l.style.opacity = 0));
    const nums = [];
    if (s > 1 && cell >= 40) for (let i = 0; i < s; i++) for (let j = 0; j < s; j++) { const e = add(stage, h('div', 'u1l6-arnum c', fmt(r)), x0 + (j + 0.5) * cell, y0 + (i + 0.5) * cell); e.style.fontSize = Math.min(24, cell * 0.36) + 'px'; hide(e); nums.push(e); }
    const hc = add(stage, h('div', 'u1l6-arcell'), x0, y0); hc.style.width = hc.style.height = cell + 'px'; hide(hc);
    const hcl = add(stage, h('div', 'u1l6-arclab', K(r === 1 ? '1' : R(r))), x0 + cell / 2, y0 - 4); hcl.style.translate = '-50% -100%'; hide(hcl);
    const segs = [], segl = [];
    for (let i = 0; i < s; i++) {
      const g = add(stage, h('div', 'u1l6-arseg' + (i % 2 ? ' b' : '')), x0 + i * cell + 1.5, y0 + L + 10); g.style.width = (cell - 3) + 'px'; hide(g); segs.push(g);
      if (cell >= 50 && s > 1) { const t = add(stage, h('div', 'u1l6-arsegl', K(r === 1 ? '1' : R(r))), x0 + (i + 0.5) * cell, y0 + L + 26); t.style.translate = '-50% 0'; hide(t); segl.push(t); }
    }
    const B = board(stage, { x: x0 + L + 70, y: 30, lh: 62, fs: 27 });
    const l1 = B.line(`\\text{side}=${R(n)}${isSq(n) ? '=' : '\\approx'}${dec(Math.sqrt(n)).replace('…', '\\ldots')}`);
    const steps = [{
      cap: `This square has area <b>${fmt(n)}</b>. Its side is the number that squares to ${fmt(n)}: <b>${tex(R(n))}</b> ${isSq(n) ? '=' : '≈'} ${dec(Math.sqrt(n))}.`,
      run: (c) => Promise.all([c.fadeIn(sideL, 400, { from: 'translateX(10px)' }), showRow(c, stage, l1)])
    }];
    if (s === 1) {
      const l2 = B.line(`${n}=${primeFactors(n).join('\\times')}`), l3 = B.line(`\\text{no perfect-square factor}`);
      steps.push({
        cap: `No perfect square bigger than 1 divides ${n} (${n} = ${primeFactors(n).join(' × ')}), so we can’t cut it into equal smaller squares with a whole number along each side. <b>${tex(R(n))} is already in simplest form.</b>`,
        run: async (c) => { await showRow(c, stage, l2); await showRow(c, stage, l3); }
      });
      return steps;
    }
    const l2 = B.line(r === 1 ? `${n}=${s}\\times${s}` : `${n}=${S}\\times${r}`);
    const l3 = B.line(r === 1 ? `\\text{small side}=1` : `\\text{small side}=${R(r)}`);
    const l4 = B.line(r === 1 ? `\\text{side}=${s}\\times1=${s}` : `\\text{side}=${s}\\times${R(r)}=${mixT(s, r)}`);
    const res = add(stage, h('div', 'u1l6-arres', K(r === 1 ? `${R(n)}=${s}` : `${R(n)}=${mixT(s, r)}`)), x0 + L + 70, 300); hide(res);
    steps.push({
      cap: r === 1 ? `${n} = ${s} × ${s}. Cut the square into a ${s} by ${s} grid: <b>${n} small squares</b>, each with area <b>1</b>.`
        : `${fmt(n)} = ${S} × ${r}. Cut the square into a ${s} by ${s} grid: <b>${S} small squares</b>, each with area <b>${r}</b>.`,
      run: async (c) => {
        await Promise.all([c.anim(areaL, [{ opacity: 1 }, { opacity: 0 }], 300), showRow(c, stage, l2), ...lines.map((l, i) => c.anim(l, [{ opacity: 0 }, { opacity: 1 }], 300, { delay: 120 + i * 40 }))]);
        await Promise.all(nums.map((e, i) => c.pop(e, 260, { delay: Math.min(i * 18, 500) })));
      }
    }, {
      cap: r === 1 ? 'Each small square has area 1, so each small side is <b>1</b>.' : `Each small square has area ${r}, so its side is <b>${tex(R(r))}</b> ≈ ${dec(Math.sqrt(r))}.`,
      run: (c) => Promise.all([c.fadeIn(hc, 350), c.pop(hcl, 400, { delay: 200 }), showRow(c, stage, l3)])
    }, {
      cap: r === 1 ? `Along the bottom edge sit <b>${s}</b> small sides, so the side is exactly <b>${s}</b>.`
        : `Along the bottom edge sit <b>${s}</b> small sides, ${tex(R(r))} + ${tex(R(r))} + … So the side is <b>${tex(mixT(s, r))}</b>: “${s} copies of ${tex(R(r))}”.`,
      run: async (c) => {
        await Promise.all(segs.map((g, i) => c.pop(g, 300, { delay: i * Math.min(150, 1400 / s) })).concat(segl.map((t, i) => c.fadeIn(t, 280, { delay: 80 + i * Math.min(150, 1400 / s) }))));
        await showRow(c, stage, l4);
      }
    }, {
      cap: r === 1 ? `${tex(`${R(n)}=${s}`)}: ${n} is a perfect square, so its root is a whole number.`
        : `Same side, two names: <b>${tex(`${R(n)}=${mixT(s, r)}`)}</b>. The <b>entire radical</b> and the <b>mixed radical</b> are the same number: ${s}&nbsp;×&nbsp;${dec(Math.sqrt(r))} ≈ ${dec(Math.sqrt(n))}.`,
      run: (c) => c.pop(res, 480)
    });
    return steps;
  }
};

/* ============ 2. Find the largest perfect square ============ */
const finder = {
  title: 'Find the largest perfect square',
  height: 450,
  minW: 900,
  choices: [{ sep: 'Notes:' }, { v: 48, label: tex('\\sqrt{48}') }, { v: 72, label: tex('\\sqrt{72}') }, { v: 200, label: tex('\\sqrt{200}') }, { v: 70, label: tex('\\sqrt{70}') },
    { sep: 'Example 1 check:' }, { v: 18, label: tex('\\sqrt{18}') }, { v: 50, label: tex('\\sqrt{50}') }, { v: 45, label: tex('\\sqrt{45}') }],
  custom: [4, 999],
  intro: (n) => `Which perfect squares divide <b>${fmt(n)}</b>? The <b>biggest</b> one is the one we want.`,
  make(stage, n, ex) {
    const W = ex.W, { s, r } = sqPart(n), S = s * s;
    const ks = []; for (let k = 2; k * k <= n / 2; k++) ks.push(k);
    if (isSq(n) && n >= 4 && !ks.includes(Math.sqrt(n))) ks.push(Math.sqrt(n));
    add(stage, h('div', 'u1l6-fshead', `${K(R(n))} &nbsp;Which perfect squares divide ${fmt(n)}?`), 24, 12);
    const per = 11, tw = 74, gap = 10, rows = Math.max(1, Math.ceil(ks.length / per));
    const tiles = ks.map((k, i) => {
      const row = Math.floor(i / per), inRow = Math.min(per, ks.length - row * per), x = (W - (inRow * (tw + gap) - gap)) / 2 + (i % per) * (tw + gap), y = 72 + row * 92;
      const t = add(stage, h('div', 'u1l6-fstile', `<b>${fmt(k * k)}</b><small>${k} × ${k}</small>`), x, y); t.style.width = tw + 'px';
      const ok = n % (k * k) === 0, lab = add(stage, h('div', 'u1l6-fsres ' + (ok ? 'ok' : 'red'), ok ? '× ' + fmt(n / (k * k)) : '✗'), x + tw / 2, y + 64); lab.style.translate = '-50% 0';
      hide(t, lab); return { k, sq: k * k, t, lab, ok };
    });
    const works = tiles.filter((t) => t.ok), cy = 72 + rows * 92 + 10;
    const steps = [{
      cap: ks.length ? `List the perfect squares: ${ks.slice(0, 4).map((k) => k * k).join(', ')}, … We can stop at <b>half of ${fmt(n)}</b>: a bigger square can’t divide it${isSq(n) ? `, except ${fmt(n)} itself` : ''}.`
        : `There are no perfect squares (other than 1) small enough to divide ${n}.`,
      run: (c) => Promise.all(tiles.map((t, i) => c.pop(t.t, 320, { delay: i * 60 })))
    }];
    if (!ks.length) return steps;
    steps.push({
      cap: works.length ? `Test each one: does it divide ${fmt(n)} evenly? ${works.map((w) => `<b>${fmt(w.sq)}</b> ✓`).join(', ')}. Under each ✓ is its partner: ${fmt(n)} = ${fmt(works[0].sq)} × ${fmt(n / works[0].sq)}.`
        : `Test each one: <b>none</b> of them divide ${fmt(n)} evenly.`,
      run: async (c) => {
        for (const t of tiles) { t.t.classList.add(t.ok ? 'yes' : 'no'); await Promise.all([c.pop(t.lab, 220), c.anim(t.t, [{ transform: 'scale(1)' }, { transform: 'scale(1.1)' }, { transform: 'scale(1)' }], 220)]); await c.sleep(40); }
      }
    });
    if (!works.length) {
      const stamp = add(stage, h('div', 'u1l6-fsstamp', `ALREADY SIMPLEST<small>${K(R(n))} has no perfect-square factor</small>`), W / 2, cy + 40); stamp.style.translate = '-50% 0'; hide(stamp);
      steps.push({
        cap: `No perfect square divides ${fmt(n)}${n < 1000 ? ` (${fmt(n)} = ${primeFactors(n).join(' × ')})` : ''}, so ${tex(R(n))} is <b>already in simplest form</b>.`,
        run: (c) => c.anim(stamp, [{ opacity: 0, transform: 'scale(1.6) rotate(-10deg)' }, { opacity: 1, transform: 'scale(1) rotate(-3deg)' }], 420, { easing: 'cubic-bezier(.2,1.4,.4,1)' })
      });
      return steps;
    }
    const best = works[works.length - 1];
    steps.push({
      cap: `The <b>largest</b> perfect square that divides ${fmt(n)} is <b>${fmt(S)}</b> = ${s} × ${s}. Use that one.`,
      run: async (c) => { works.forEach((w) => w !== best && w.t.classList.add('meh')); best.t.classList.add('best'); await c.anim(best.t, [{ transform: 'scale(1)' }, { transform: 'scale(1.3)' }, { transform: 'scale(1.12)' }], 500); }
    });
    const parts = r === 1 ? [R(n), '=', `\\mathbf{${s}}`] : [R(n), '=', `\\sqrt{${tn(S)}\\times${tn(r)}}`, '=', `${R(S)}\\times${R(r)}`, '=', `\\mathbf{${mixT(s, r)}}`];
    const ch = chain(stage, parts, 40, cy, { fs: 32 }); ch.els.forEach((e) => hide(e));
    steps.push({
      cap: r === 1 ? `${fmt(n)} is itself a perfect square: ${tex(`${R(n)}=${s}`)} exactly.` : `Split off ${fmt(S)}: ${tex(`${R(n)}=\\sqrt{${tn(S)}\\times${tn(r)}}=${R(S)}\\times${R(r)}`)}, and ${tex(`${R(S)}=${s}`)} comes out in front: <b>${tex(mixT(s, r))}</b>.`,
      run: async (c) => { for (const e of ch.els) await c.fadeIn(e, 300); }
    });
    if (works.length > 1) {
      const w = works[0], k = w.k, m = n / w.sq, s2 = s / k;
      const warn = add(stage, h('div', 'u1l6-fswarn'), 40, cy + 70); warn.style.width = (W - 80) + 'px';
      warn.innerHTML = `<div class="u1l6-fswarn-h">What if you used a smaller square, like ${fmt(w.sq)}?</div>
        <div class="u1l6-fswarn-b"><span>${K(`${R(n)}=${R(w.sq)}\\times${R(m)}=${k}${R(m)}`)}</span><span class="u1l6-red">but ${fmt(m)} = ${fmt(s2 * s2)} × ${r} still has a perfect square inside!</span></div>
        <div class="u1l6-fswarn-b"><span>Go again: ${K(`${k}${R(m)}=${k}\\times${mixT(s2, r)}=${mixT(s, r)}`)}</span><span class="muted">same answer, more work</span></div>`;
      hide(warn);
      steps.push({
        cap: `<b>Watch out:</b> start with a smaller square like ${fmt(w.sq)} and you get ${tex(`${k}${R(m)}`)}, but ${fmt(m)} still contains ${fmt(s2 * s2)}. You must <b>go again</b>. The <b>largest</b> square does it in one step.`,
        run: (c) => c.fadeIn(warn, 450)
      });
    }
    return steps;
  }
};

/* ============ 3. Pair up the primes ============ */
const PAIRC = ['#e0574b', '#3b78d8', '#2f9e6a', '#8a58c9', '#e8932a', '#d0477a'];
const pairs = {
  title: 'Prime factors: each pair comes out as one number',
  height: 430,
  minW: 860,
  choices: [{ sep: 'Notes:' }, { v: 108, label: tex('\\sqrt{108}') }, { v: 72, label: tex('\\sqrt{72}') }, { v: 200, label: tex('\\sqrt{200}') },
    { sep: 'Example 2 check:' }, { v: 126, label: tex('\\sqrt{126}') }, { v: 150, label: tex('\\sqrt{150}') }, { v: 192, label: tex('\\sqrt{192}') },
    { sep: 'Example 5(b):' }, { v: 168, label: tex('\\sqrt{168}') }],
  custom: [4, 9999],
  intro: (n) => `Write <b>${fmt(n)}</b> as a product of primes. Every <b>pair</b> of matching primes is a perfect square, so it can leave the root.`,
  make(stage, n, ex) {
    const W = ex.W, ps = primeFactors(n), pr = [], left = [];
    for (let i = 0; i < ps.length;) { if (ps[i] === ps[i + 1]) { pr.push([i, i + 1]); i += 2; } else { left.push(i); i++; } }
    const cw = (p) => Math.max(50, 22 + String(p).length * 15), sepW = 30, ch = 50;
    const { s, r } = sqPart(n);
    const y1 = 46, lab1 = add(stage, h('div', 'u1l6-pplab', K(`${R(n)}=`)), 0, y1 + 4);
    const innerW = ps.reduce((a, p) => a + cw(p), 0) + (ps.length - 1) * sepW;
    const tot = lab1.offsetWidth + 10 + 48 + innerW + 14, x1 = (W - tot) / 2; at(lab1, x1, y1 + 4);
    const rx1 = x1 + lab1.offsetWidth + 10; radSign(stage, rx1, y1 - 12, 48 + innerW + 14, ch + 18);
    let cx = rx1 + 48;
    const seps1 = [];
    const chips = ps.map((p, i) => {
      const e = add(stage, h('div', 'u1l6-ppchip', fmt(p)), cx, y1); e.style.width = cw(p) + 'px'; e._x = cx; cx += cw(p);
      if (i < ps.length - 1) { seps1.push(add(stage, h('div', 'u1l6-ppx', '×'), cx, y1)); cx += sepW; }
      hide(e); return e;
    });
    hide(...seps1);
    const brs = pr.map(([i, j], k) => {
      const b = add(stage, h('div', 'u1l6-ppbr'), chips[i]._x + 4, y1 + ch + 4); b.style.width = (chips[j]._x + cw(ps[j]) - chips[i]._x - 8) + 'px'; b.style.borderColor = PAIRC[k % PAIRC.length];
      const t = add(stage, h('div', 'u1l6-ppbrl', K(`${ps[i]}\\times${ps[i]}=${ps[i] * ps[i]}`)), chips[i]._x + (chips[j]._x + cw(ps[j]) - chips[i]._x) / 2, y1 + ch + 22); t.style.translate = '-50% 0'; t.style.color = PAIRC[k % PAIRC.length];
      hide(b, t); return { b, t };
    });
    const y2 = 210, outs = pr.map(([i]) => ps[i]), lefts = left.map((i) => ps[i]);
    const outW = outs.reduce((a, p) => a + cw(p), 0) + Math.max(0, outs.length - 1) * sepW;
    const inW = lefts.reduce((a, p) => a + cw(p), 0) + Math.max(0, lefts.length - 1) * sepW;
    const eq2 = add(stage, h('div', 'u1l6-pplab', K('=')), 0, y2 + 4);
    const tot2 = 36 + outW + (lefts.length ? 12 + 48 + inW + 14 : 0); let x2 = (W - tot2) / 2; at(eq2, x2, y2 + 4); x2 += 36;
    const outEls = outs.map((p, k) => {
      const e = add(stage, h('div', 'u1l6-ppchip out', fmt(p)), x2, y2); e.style.width = cw(p) + 'px'; e.style.borderColor = e.style.color = PAIRC[k % PAIRC.length]; x2 += cw(p);
      let xs = null; if (k < outs.length - 1) { xs = add(stage, h('div', 'u1l6-ppx', '×'), x2, y2); x2 += sepW; }
      hide(e, xs); return { e, xs };
    });
    let rad2 = null; const leftEls = [];
    if (lefts.length) {
      x2 += 12; rad2 = radSign(stage, x2, y2 - 12, 48 + inW + 14, ch + 18); hide(rad2); x2 += 48;
      lefts.forEach((p, k) => { const e = add(stage, h('div', 'u1l6-ppchip', fmt(p)), x2, y2); e.style.width = cw(p) + 'px'; x2 += cw(p); let xs = null; if (k < lefts.length - 1) { xs = add(stage, h('div', 'u1l6-ppx', '×'), x2, y2); x2 += sepW; } hide(e, xs); leftEls.push({ e, xs }); });
    }
    hide(eq2);
    const res = add(stage, h('div', 'u1l6-ppres', K(`${R(n)}=${r === 1 ? s : mixT(s, r)}`)), W / 2, 318); res.style.translate = '-50% 0'; hide(res);
    const chk = add(stage, h('div', 'u1l6-ppchk', `Check: ${K(`${s}^2\\times${r}=${s * s}\\times${r}=${tn(n)}`)} ✓`), W / 2, 386); chk.style.translate = '-50% 0'; hide(chk);
    const pT = ps.join(' × ');
    const steps = [{
      cap: `Write ${fmt(n)} as a product of primes (a division ladder or a factor tree, like Lesson 3): ${fmt(n)} = ${pT}.`,
      run: async (c) => { await Promise.all([...chips.map((e, i) => c.pop(e, 320, { delay: i * 90 })), ...seps1.map((e, i) => c.fadeIn(e, 200, { delay: 60 + i * 90 }))]); }
    }];
    if (!pr.length) {
      steps.push({ cap: `No prime appears <b>twice</b>, so there are no pairs and nothing can come out. ${tex(R(n))} is <b>already in simplest form</b>.`, run: (c) => Promise.all(chips.map((e) => c.shake(e))) });
      return steps;
    }
    steps.push({
      cap: `<b>Pair up</b> matching primes. Each pair is a perfect square: ${pr.map(([i]) => `${ps[i]} × ${ps[i]} = ${ps[i] * ps[i]}`).join(', ')}.${lefts.length ? ` ${lefts.join(' × ')} ${lefts.length > 1 ? 'have' : 'has'} no partner.` : ''}`,
      run: async (c) => {
        pr.forEach(([i, j], k) => { [chips[i], chips[j]].forEach((e) => { e.style.borderColor = PAIRC[k % PAIRC.length]; e.style.background = PAIRC[k % PAIRC.length] + '1f'; }); });
        left.forEach((i) => chips[i].classList.add('lone'));
        await Promise.all(brs.flatMap(({ b, t }, k) => [c.fadeIn(b, 300, { delay: k * 220 }), c.fadeIn(t, 300, { delay: 100 + k * 220 })]));
      }
    }, {
      cap: `Each pair leaves the root as <b>one</b> number, because ${tex(`\\sqrt{${ps[pr[0][0]]}\\times${ps[pr[0][0]]}}=${ps[pr[0][0]]}`)}. ${lefts.length ? 'Primes without a partner stay inside.' : 'Nothing is left inside.'}`,
      run: async (c) => {
        const jobs = [c.fadeIn(eq2, 300)];
        pr.forEach(([i, j], k) => {
          const to = outEls[k].e, from = chips[i], dx = parseFloat(from.style.left) - parseFloat(to.style.left), dy = y1 - y2;
          jobs.push(c.anim(to, [{ opacity: 1, transform: `translate(${dx}px, ${dy}px)` }, { opacity: 1, transform: 'none' }], 750, { delay: k * 250 }));
          jobs.push(c.anim(chips[j], [{ opacity: 1 }, { opacity: 0.25 }], 400, { delay: k * 250 }), c.anim(from, [{ opacity: 1 }, { opacity: 0.25 }], 400, { delay: k * 250 }));
          if (outEls[k].xs) jobs.push(c.fadeIn(outEls[k].xs, 300, { delay: 600 + k * 250 }));
        });
        if (rad2) jobs.push(c.fadeIn(rad2, 400, { delay: 300 }));
        left.forEach((i, k) => {
          const to = leftEls[k].e, from = chips[i], dx = parseFloat(from.style.left) - parseFloat(to.style.left), dy = y1 - y2;
          jobs.push(c.anim(to, [{ opacity: 1, transform: `translate(${dx}px, ${dy}px)` }, { opacity: 1, transform: 'none' }], 750, { delay: 400 + k * 150 }));
          jobs.push(c.anim(from, [{ opacity: 1 }, { opacity: 0.25 }], 400, { delay: 400 }));
          if (leftEls[k].xs) jobs.push(c.fadeIn(leftEls[k].xs, 300, { delay: 900 }));
        });
        brs.forEach(({ b, t }) => jobs.push(c.anim(b, [{ opacity: 1 }, { opacity: 0.25 }], 400), c.anim(t, [{ opacity: 1 }, { opacity: 0.35 }], 400)));
        await Promise.all(jobs);
      }
    }, {
      cap: `Multiply what’s outside${lefts.length ? ', and multiply what’s left inside' : ''}: ${outs.length > 1 ? `${outs.join(' × ')} = ${s}` : s} outside${lefts.length ? `, ${lefts.length > 1 ? `${lefts.join(' × ')} = ${r}` : r} inside` : ''}. So <b>${tex(`${R(n)}=${r === 1 ? s : mixT(s, r)}`)}</b>.`,
      run: (c) => c.pop(res, 480)
    });
    if (r > 1) steps.push({
      cap: `Check by going backwards: ${s}<sup>2</sup> × ${r} = ${s * s} × ${r} = ${fmt(n)} ✓. ${r} has no pair left inside, so it is finished.`,
      run: (c) => c.fadeIn(chk, 400)
    });
    return steps;
  }
};

/* ============ 4. Mixed → entire: the coefficient goes back in as its square ============ */
const mixLabel = (v) => { const [a, m] = v.split('|'); return tex(`${a}\\sqrt{${m}}`); };
const ENT = ['sep:Notes:', '2|5', '3|2', '6|5', '2|11', 'sep:Example 3 check:', '4|3', '7|2', '5|5', '9|2'];
const entire = {
  title: 'Mixed → entire: the number outside goes in as its square',
  height: 380,
  minW: 860,
  choices: ENT.map((v) => (v.startsWith('sep:') ? { sep: v.slice(4) } : { v, label: mixLabel(v) })),
  intro: (v) => `Run Section 2 backwards. Push the coefficient of ${mixLabel(v)} back <b>under</b> the root sign.`,
  make(stage, v, ex) {
    const W = ex.W, [as, ns] = v.split('|'), a = +as, n = +ns, a2 = a * a, N = a2 * n, fs = 32;
    const B = board(stage, { x: 40, y: 22, lh: 88, fs, nx: W * 0.56, nw: W * 0.44 - 30 });
    const r0 = B.line(`\\htmlClass{tk-c}{${a}}${R(n)}`); r0.el.style.opacity = 1;
    const r1 = B.line(`=\\sqrt{\\htmlClass{tk-c}{${a}^2}}\\times${R(n)}=\\sqrt{\\htmlClass{tk-a}{${a2}}}\\times${R(n)}`, `Any whole number is the square root of its square: ${tex(`${a}=\\sqrt{${a}^2}=\\sqrt{${a2}}`)}.`);
    const r2 = B.line(`=\\sqrt{\\htmlClass{tk-a}{${a2}}\\times${n}}`, 'Two square roots multiplied join into one.');
    const r3 = B.line(`=\\htmlClass{tk-R}{${R(N)}}`, `Multiply: ${tex(`${a2}\\times${n}=${tn(N)}`)}.`);
    const chk = add(stage, h('div', 'u1l6-wkchk'), W * 0.56, 22); chk.style.width = (W * 0.44 - 30) + 'px'; hide(chk);
    const val = a * Math.sqrt(n);
    return [{
      cap: `Every whole number is the square root of its square: ${tex(`${a}=\\sqrt{${a}^2}=\\sqrt{${a2}}`)}. So the ${a} can go under a root sign as <b>${a2}</b>.`,
      run: (c) => showRow(c, stage, r1, [[r0.q('.tk-c'), r1.q('.tk-c'), String(a)]], fs)
    }, {
      cap: `Join the two roots into one: ${tex(`\\sqrt{${a2}}\\times${R(n)}=\\sqrt{${a2}\\times${n}}`)}.`,
      run: (c) => showRow(c, stage, r2, [[r1.q('.tk-a'), r2.q('.tk-a'), String(a2)]], fs)
    }, {
      cap: `Multiply: ${tex(`${a2}\\times${n}=${tn(N)}`)}. So <b>${tex(`${a}${R(n)}=${R(N)}`)}</b>.`,
      run: (c) => showRow(c, stage, r3, [[r2.q('.tk-a'), r3.q('.tk-R'), R(N)]], fs)
    }, {
      cap: `Check with a calculator: both give ${dec(val)}.`,
      run: (c) => { chk.innerHTML = `<div class="u1l6-boxh">Calculator check</div>${K(`${a}${R(n)}`)} ≈ ${dec(val)}<br>${K(R(N))} ≈ ${dec(val)} <b class="u1l6-ok">✓</b>`; return c.fadeIn(chk, 400); }
    }];
  }
};

/* ============ 5. Ordering: convert to entire radicals, then line them up ============ */
const SETS = { notes: [[3, 2], [2, 5], [1, 15], [2, 3]], ex4: [[6, 2], [3, 5], [1, 70], [2, 14]] };
const order = {
  title: 'Convert to entire radicals, then line them up',
  height: 470,
  minW: 860,
  choices: [{ v: 'notes', label: 'Try it' }, { sep: 'Example 4 check:' }, { v: 'ex4', label: 'Example 4' }],
  intro: (v) => `Order ${SETS[v].map(([a, r]) => tex(mixT(a, r))).join(', ')} from <b>least to greatest</b>, without a calculator.`,
  make(stage, v, ex) {
    const W = ex.W, items = SETS[v].map(([a, r], i) => ({ a, r, R: a * a * r, val: Math.sqrt(a * a * r), i })), m = items.length;
    const cw = (W - 40 - (m - 1) * 14) / m;
    items.forEach((it, i) => {
      const x = 20 + i * (cw + 14), card = add(stage, h('div', 'u1l6-olcard'), x, 14); card.style.width = cw + 'px';
      card.innerHTML = `<div class="u1l6-olm">${K(mixT(it.a, it.r))}</div><div class="u1l6-ols">${it.a === 1 ? '<span class="muted">already entire</span>' : K(`=\\sqrt{${it.a * it.a}\\times${it.r}}`)}</div><div class="u1l6-ole">${K('=' + R(it.R))}</div><div class="u1l6-olrank"></div>`;
      it.card = card; it.s = card.querySelector('.u1l6-ols'); it.e = card.querySelector('.u1l6-ole'); it.rk = card.querySelector('.u1l6-olrank'); hide(it.s, it.e, it.rk);
    });
    const lo = Math.floor(Math.min(...items.map((t) => t.val))), hi = Math.ceil(Math.max(...items.map((t) => t.val))), xL = 70, xR = W - 70, ly = 320;
    const X = (u) => xL + ((u - lo) / (hi - lo)) * (xR - xL);
    const axis = add(stage, h('div', 'u1l6-olaxis'), xL - 20, ly); axis.style.width = (xR - xL + 40) + 'px';
    for (let k = lo; k <= hi; k++) {
      add(stage, h('div', 'u1l6-oltick'), X(k) - 1.5, ly - 9);
      const t = add(stage, h('div', 'u1l6-oltl', `<b>${k}</b>${K(`\\sqrt{${k * k}}`)}`), X(k), ly + 14); t.style.translate = '-50% 0';
    }
    const sorted = [...items].sort((p, q) => p.val - q.val);
    sorted.forEach((it, i) => {
      const dot = add(stage, h('div', 'u1l6-oldot c'), X(it.val), ly + 1.5);
      const up = i % 2 ? 92 : 46, mk = add(stage, h('div', 'u1l6-olmk', K(R(it.R))), X(it.val), ly - up - 18); mk.style.translate = '-50% -50%';
      const st = add(stage, h('div', 'u1l6-olstem'), X(it.val) - 1, ly - up); st.style.height = (up - 8) + 'px';
      it.dot = dot; it.mk = mk; it.st = st; hide(dot, mk, st);
    });
    const ord = add(stage, h('div', 'u1l6-olord', K(sorted.map((t) => mixT(t.a, t.r)).join('\\;<\\;'))), W / 2, 412); ord.style.translate = '-50% 0'; hide(ord);
    const first = items.find((t) => t.a > 1), second = items.find((t) => t.a > 1 && t !== first);
    return [{
      cap: `Hard to compare as they are: is ${tex(mixT(first.a, first.r))} bigger than ${tex(mixT(second.a, second.r))}? Turn every one into an <b>entire radical</b>: the coefficient goes in as its <b>square</b>.`,
      run: async (c) => { for (const it of items) { await c.fadeIn(it.s, 260); await c.fadeIn(it.e, 260); } }
    }, {
      cap: `Now compare the numbers under the roots: <b>bigger radicand, bigger root</b>. ${sorted.map((t) => t.R).join(' &lt; ')}. They all sit between ${tex(`\\sqrt{${lo * lo}}=${lo}`)} and ${tex(`\\sqrt{${hi * hi}}=${hi}`)}.`,
      run: (c) => Promise.all(sorted.flatMap((it, i) => [c.anim(it.dot, [{ opacity: 0, transform: 'translateY(-40px)' }, { opacity: 1, transform: 'none' }], 450, { delay: i * 220 }), c.fadeIn(it.st, 300, { delay: 200 + i * 220 }), c.pop(it.mk, 380, { delay: 250 + i * 220 })]))
    }, {
      cap: `Read the number line from <b>left to right</b> for least to greatest, and write them in their <b>original</b> form: <b>${sorted.map((t) => tex(mixT(t.a, t.r))).join(' &lt; ')}</b>.`,
      run: async (c) => { sorted.forEach((t, i) => { t.rk.textContent = i + 1; }); await Promise.all([c.fadeIn(ord, 450), ...sorted.map((t, i) => c.pop(t.rk, 320, { delay: i * 120 }))]); }
    }];
  }
};

/* ============ 6. Not finished? Go again — or use the largest square ============ */
function againPlan(n) {
  const { s, r } = sqPart(n);
  let k = 0; for (let j = 2; j < s; j++) if (n % (j * j) === 0 && sqPart(n / (j * j)).s > 1) { k = j; break; }
  if (!k) return null;
  const m = n / (k * k), p = sqPart(m);
  return { s, r, k, m, s2: p.s, S2: p.s * p.s };
}
const again = {
  title: 'Not finished? Go again — or use the largest square',
  height: 350,
  minW: 900,
  choices: [{ sep: 'Example 5(a) check:' }, { v: 96, label: tex('\\sqrt{96}') }, { sep: 'More:' }, { v: 72, label: tex('\\sqrt{72}') }, { v: 200, label: tex('\\sqrt{200}') }, { v: 162, label: tex('\\sqrt{162}') }],
  intro: (n) => { const P = againPlan(n); return `Simplify ${tex(R(n))}. What if you start with the perfect square <b>${P.k * P.k}</b> instead of the largest one?`; },
  make(stage, n, ex) {
    const W = ex.W, P = againPlan(n), { s, r, k, m, s2, S2 } = P, half = W / 2, fs = 30, lh = 64;
    const hL = add(stage, h('div', 'u1l6-agh', `Start with <b>${k * k}</b>`), 30, 14), hR = add(stage, h('div', 'u1l6-agh best', `Start with the largest, <b>${s * s}</b>`), half + 20, 14);
    hide(hR);
    const BL = board(stage, { x: 30, y: 62, lh, fs }), BR = board(stage, { x: half + 20, y: 62, lh, fs });
    const L1 = BL.line(`${R(n)}=\\sqrt{${k * k}\\times${m}}=${k}${R(m)}`);
    const L2 = BL.line(`${k}${R(m)}=${k}\\sqrt{${S2}\\times${r}}`);
    const L3 = BL.line(`=${k}\\times${s2}${R(r)}=\\mathbf{${mixT(s, r)}}`);
    const Rr1 = BR.line(`${R(n)}=\\sqrt{${s * s}\\times${r}}`);
    const Rr2 = BR.line(`=${R(s * s)}\\times${R(r)}=\\mathbf{${mixT(s, r)}}`);
    const st = stampEl(stage, `NOT FINISHED<small>${m} = ${S2} × ${r}</small>`, 60, 262);
    const ok = add(stage, h('div', 'u1l6-agok'), half + 20, 210); ok.style.width = (half - 50) + 'px'; hide(ok);
    ok.innerHTML = `<b class="u1l6-ok">Same answer ✓</b> in one step. ${r} has no perfect-square factor, so ${K(mixT(s, r))} is finished.`;
    const sepl = add(stage, h('div', 'u1l6-agsep'), half, 14); sepl.style.height = '320px'; hide(sepl);
    return [{
      cap: `Pull out ${k * k} first: ${tex(`${R(n)}=\\sqrt{${k * k}\\times${m}}=${k}${R(m)}`)}. That is <b>true</b>…`,
      run: (c) => showRow(c, stage, L1)
    }, {
      cap: `…but is it finished? Look <b>inside</b>: ${m} = ${S2} × ${r} still has the perfect-square factor <b>${S2}</b>. Not finished!`,
      run: (c) => stampIn(c, st)
    }, {
      cap: `Go again: ${tex(`${k}${R(m)}=${k}\\sqrt{${S2}\\times${r}}=${k}\\times${s2}${R(r)}=${mixT(s, r)}`)}.`,
      run: async (c) => { await c.anim(st, [{ opacity: 1 }, { opacity: 0.35 }], 300); await showRow(c, stage, L2); await showRow(c, stage, L3); }
    }, {
      cap: `Now start with the <b>largest</b> perfect square that divides ${n}, which is <b>${s * s}</b>: ${tex(`${R(n)}=\\sqrt{${s * s}\\times${r}}=${mixT(s, r)}`)}.`,
      run: async (c) => { await Promise.all([c.fadeIn(sepl, 300), c.fadeIn(hR, 300)]); await showRow(c, stage, Rr1); await showRow(c, stage, Rr2); }
    }, {
      cap: `Same answer, ${tex(mixT(s, r))}, but in <b>one</b> step. Either way, check that the number left inside, ${r}, has no perfect-square factor.`,
      run: (c) => c.fadeIn(ok, 400)
    }];
  }
};

/* ============ warm-up: tilted squares on a dot grid ============ */
function mountDots() {
  const host = document.getElementById('u1l6-dots'); if (!host) return;
  const read = document.getElementById('u1l6-dread');
  const u = 34, xmin = -0.7, xmax = 15.7, ymax = 4.4, Wd = (xmax - xmin) * u, Hd = 4.4 * u + 54;
  const X = (x) => (x - xmin) * u, Y = (y) => (ymax - y) * u;
  const svg = svgEl('svg', { width: Wd, height: Hd, viewBox: `0 0 ${Wd} ${Hd}`, class: 'u1l6-dsvg' }, host);
  const P = (pts) => pts.map(([x, y]) => `${X(x)},${Y(y)}`).join(' ');
  const base = svgEl('g', {}, svg), over = svgEl('g', {}, svg), dots = svgEl('g', {}, svg), labs = svgEl('g', {}, svg);
  const SQ = { A: [[0, 0], [2, 0], [2, 2], [0, 2]], B: [[3, 0], [6, 0], [6, 3], [3, 3]], C: [[8, 0], [9, 1], [8, 2], [7, 1]], D: [[12, 0], [14, 2], [12, 4], [10, 2]] };
  Object.values(SQ).forEach((pts) => svgEl('polygon', { points: P(pts), class: 'u1l6-dsq' }, base));
  for (let x = -0; x <= 15; x++) for (let y = 0; y <= 4; y++) svgEl('circle', { cx: X(x), cy: Y(y), r: 2.6, class: 'u1l6-ddot' }, dots);
  [['A', 1], ['B', 4.5], ['C', 8], ['D', 12]].forEach(([t, x]) => { const e = svgEl('text', { x: X(x), y: Y(0) + 38, 'text-anchor': 'middle', class: 'u1l6-dlab' }, labs); e.textContent = t; });
  const box = svgEl('rect', { x: X(7), y: Y(2), width: 2 * u, height: 2 * u, class: 'u1l6-dbox' }, base);
  const boxL = svgEl('text', { x: X(8), y: Y(2) - 8, 'text-anchor': 'middle', class: 'u1l6-dboxl' }, labs); boxL.textContent = 'box it in';
  const cell = (x, y) => svgEl('rect', { x: X(x), y: Y(y + 1), width: u, height: u, class: 'u1l6-dcell' }, over);
  const tri = (pts) => svgEl('polygon', { points: P(pts), class: 'u1l6-dtri' }, over);
  const SHOW = {
    A: () => { for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) cell(i, j); return `<b>A:</b> ${tex('2\\times2=4')} unit squares, so area 4 and side ${tex('\\sqrt{4}=2')}.`; },
    B: () => { for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) cell(3 + i, j); return `<b>B:</b> ${tex('3\\times3=9')} unit squares, so area 9 and side ${tex('\\sqrt{9}=3')}.`; },
    C: () => { tri([[7, 0], [8, 0], [7, 1]]); tri([[9, 0], [9, 1], [8, 0]]); tri([[9, 2], [8, 2], [9, 1]]); tri([[7, 2], [7, 1], [8, 2]]); svgEl('rect', { x: X(7), y: Y(2), width: 2 * u, height: 2 * u, class: 'u1l6-dbox on' }, over);
      return `<b>C:</b> box ${tex('2\\times2=4')}, minus 4 corners of ${tex('\\tfrac12')}: area ${tex('4-2=2')}. Side ${tex('\\sqrt{2}\\approx1.41')}.`; },
    D: () => { svgEl('polyline', { points: P([[11, 1], [13, 3]]), class: 'u1l6-dcut' }, over); svgEl('polyline', { points: P([[13, 1], [11, 3]]), class: 'u1l6-dcut' }, over);
      [[12, 1], [13, 2], [12, 3], [11, 2]].forEach(([x, y]) => svgEl('polygon', { points: P([[x, y - 1], [x + 1, y], [x, y + 1], [x - 1, y]]), class: 'u1l6-dcopy' }, over));
      return `<b>D:</b> 4 copies of C, so area ${tex('4\\times2=8')}. Each side is <b>2</b> C-sides: ${tex('\\sqrt{8}=2\\sqrt{2}')}.`; }
  };
  document.querySelectorAll('[data-u1l6-d]').forEach((b) => b.addEventListener('click', () => {
    over.innerHTML = ''; const k = b.dataset.u1l6D;
    read.innerHTML = k ? SHOW[k]() : '<span class="muted">Tap a letter.</span>';
    over.animate([{ opacity: 0 }, { opacity: 1 }], 300);
  }));
  void box;
}

/* ============ tap-to-fill blanks ============ */
function replaceBlanks(src, fn) { // \blank{...} with nested braces → fn(content)
  let out = '', i = 0;
  while (i < src.length) {
    const j = src.indexOf('\\blank{', i); if (j < 0) { out += src.slice(i); break; }
    out += src.slice(i, j); let d = 1, k = j + 7;
    for (; k < src.length && d; k++) { if (src[k] === '{') d++; else if (src[k] === '}') d--; }
    out += fn(src.slice(j + 7, k - 1)); i = k;
  }
  return out;
}
function mountBlanks() {
  document.querySelectorAll('[data-u1l6-tfill]').forEach((el) => {
    const src = el.dataset.u1l6Tfill, n = (src.match(/\\blank\{/g) || []).length, state = Array(n).fill(false);
    const render = () => {
      let i = 0;
      el.innerHTML = K(replaceBlanks(src, (a) => { const k = i++; return `\\htmlData{tap=1,b=${k}}{\\underline{\\;${state[k] ? `\\textcolor{#c93a33}{\\mathbf{${a}}}` : `\\phantom{\\mathbf{${a}}}`}\\;}}`; }), true);
      el.querySelectorAll('[data-b]').forEach((b) => { b.setAttribute('role', 'button'); b.classList.toggle('filled', state[+b.dataset.b]); });
    };
    el.addEventListener('click', (e) => { const b = e.target.closest('[data-b]'); if (!b) return; state[+b.dataset.b] = !state[+b.dataset.b]; render(); });
    el._fill = () => { state.fill(true); render(); };
    render();
  });
  const grid = document.getElementById('u1l6-sqg');
  if (grid) for (let k = 1; k <= 14; k++) grid.insertAdjacentHTML('beforeend', `<div class="u1l6-sqc"><div class="u1l6-sqk">${tex(k + '^2')}</div><button class="blank u1l6-sqb" data-a="${k * k}"></button></div>`);
  document.querySelectorAll('.u1l6 .blank[data-a]').forEach((b) => b.addEventListener('click', () => { b.classList.toggle('filled'); b.textContent = b.classList.contains('filled') ? b.dataset.a : ''; }));
  document.querySelectorAll('[data-u1l6-fillall]').forEach((btn) => btn.addEventListener('click', () => {
    const scope = btn.closest('[data-u1l6-scope]') || btn.closest('.card');
    scope.querySelectorAll('[data-u1l6-tfill]').forEach((t) => t._fill && t._fill());
    scope.querySelectorAll('.blank[data-a]').forEach((b, i) => setTimeout(() => { b.classList.add('filled'); b.textContent = b.dataset.a; b.animate([{ transform: 'scale(1.3)' }, { transform: 'scale(1)' }], 300); }, i * 70));
  }));
}

mountDots();
mountBlanks();
export const explainers = mountExplainers({ area, finder, pairs, entire, order, again });

/* ============ Stand Up Break! — entire ↔ mixed at the whiteboards (lessons/js/standup.js) ============ */
const suLab = (i) => '\\text{(' + 'abc'[i] + ')}\\ ';
const SKIPE = new Set([18, 50, 45, 48, 108, 126, 150, 192, 96, 168, 80, 54, 12, 28, 99, 147, 175, 132, 156, 196, 176, 75, 51, 98, 72, 200, 162]); // notes, examples, Assignment 6
const SKIPM = new Set(['3|6', '4|7', '6|3', '8|2', '5|5', '4|6', '4|3', '2|10', '7|2', '9|2', '2|5', '3|2', '6|5', '2|11']);
function suEM(r, ks, ms, lo, hi) { for (;;) { const k = r.pick(ks), m = r.pick(ms), n = k * k * m; if (n >= lo && n <= hi && !SKIPE.has(n)) return [k, m, n]; } }
const suToMixed = ([k, m, n]) => `\\sqrt{${tn(n)}}=\\sqrt{${k * k}\\times${m}}=\\sqrt{${k * k}}\\times\\sqrt{${m}}=${k}\\sqrt{${m}}`;
const suPrimes = (n) => primeFactors(n).join('\\times');
function suOrder(r) {
  for (;;) {
    const its = []; const used = new Set();
    while (its.length < 3) { const a = r.int(2, 6), m = r.pick([2, 3, 5, 6, 7, 10, 11]), N = a * a * m; if (N > 160 || used.has(N) || SKIPM.has(a + '|' + m)) continue; used.add(N); its.push({ a, m, N }); }
    if (r.chance(0.6)) { const N = r.int(10, 150); if (!used.has(N) && sqPart(N).s === 1) { used.add(N); its.push({ a: 1, m: N, N }); } }
    const vals = its.map((t) => t.N), lo = Math.min(...vals), hi = Math.max(...vals);
    if (hi - lo < 8) continue;
    const s = [...its].sort((p, q) => p.N - q.N), T = (t) => (t.a === 1 ? `\\sqrt{${t.m}}` : `${t.a}\\sqrt{${t.m}}`);
    return { text: 'Without a calculator, arrange these from <b>least to greatest</b>.', q: its.map(T).join(',\\quad '),
      a: [its.filter((t) => t.a > 1).map((t) => `${T(t)}=\\sqrt{${t.a * t.a}\\times${t.m}}=\\sqrt{${t.N}}`).join(',\\quad '), s.map((t) => t.N).join('<'), s.map(T).join('<')] };
  }
}
standup('u1l6', {
  intro: 'Find the largest perfect square hiding under the root (or square the coefficient to push it back in). Check that nothing inside still has a perfect-square factor.',
  levels: {
    BEG: (r) => { // Example 1: entire → mixed, small radicands
      let A, B; do { A = suEM(r, [2, 3, 4, 5, 6], [2, 3, 5, 6, 7, 10], 8, 200); B = suEM(r, [2, 3, 4, 5, 6, 7], [2, 3, 5, 7], 8, 250); } while (A[2] === B[2]);
      return { text: 'Convert each entire radical to a mixed radical in simplest form.', q: `${suLab(0)}\\sqrt{${A[2]}}\\qquad\\qquad${suLab(1)}\\sqrt{${B[2]}}`, a: [suLab(0) + suToMixed(A), suLab(1) + suToMixed(B)] };
    },
    PRG: (r) => { // Example 3 (mixed → entire) and Example 2 (prime factorization)
      if (r.chance(0.5)) {
        let A, B; const one = () => { for (;;) { const k = r.int(2, 9), m = r.pick([2, 3, 5, 6, 7, 10, 11]); if (!SKIPM.has(k + '|' + m) && k * k * m <= 600) return [k, m]; } };
        do { A = one(); B = one(); } while (A.join() === B.join());
        const w = ([k, m]) => `${k}\\sqrt{${m}}=\\sqrt{${k}^2\\times${m}}=\\sqrt{${k * k}\\times${m}}=\\sqrt{${k * k * m}}`;
        return { text: 'Convert each mixed radical to an entire radical.', q: `${suLab(0)}${A[0]}\\sqrt{${A[1]}}\\qquad\\qquad${suLab(1)}${B[0]}\\sqrt{${B[1]}}`, a: [suLab(0) + w(A), suLab(1) + w(B)] };
      }
      const [k, m, n] = suEM(r, [3, 4, 5, 6, 7, 8], [6, 10, 14, 15, 21, 22], 120, 600);
      return { text: 'Use <b>prime factorization</b> to convert this entire radical to a mixed radical in simplest form.', q: `\\sqrt{${n}}`,
        a: [`${n}=${suPrimes(n)}`, `\\sqrt{${n}}=${k}\\sqrt{${m}}`, `\\text{check: }${k}^2\\times${m}=${n}`] };
    },
    MAS: (r) => { // Examples 4–5: ordering, or a big radicand where the largest square is hard to spot
      if (r.chance(0.5)) return suOrder(r);
      const [k, m, n] = suEM(r, [6, 8, 9, 10, 12, 14, 15], [2, 3, 5, 6, 7, 10], 200, 1600);
      const small = [2, 3].find((j) => n % (j * j) === 0 && j < k);
      return { text: `A classmate wrote ${tex(`\\sqrt{${tn(n)}}=${small}\\sqrt{${tn(n / (small * small))}}`)}. Is it fully simplified? If not, finish it.`, q: `\\sqrt{${tn(n)}}`,
        a: [`\\text{No: }${tn(n / (small * small))}\\text{ still has a perfect-square factor.}`, `${tn(n)}=${suPrimes(n)}`, `\\sqrt{${tn(n)}}=\\sqrt{${tn(k * k)}\\times${m}}=${k}\\sqrt{${m}}`] };
    }
  }
});
