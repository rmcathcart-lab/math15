/* Math 15 · Unit 1 · Lesson 8 — Unit Review: Number Sense. The explainers and widgets on this page.
 * A review lesson, so each explainer is a quick "remember how…" refresher with "Example N check" chips that replay
 * the booklet's own numbers after the class has worked them by hand. The radical board (simplify / mixed → entire)
 * comes from the Lesson 7 page (itself from Math 10C u1l8); the Venn of primes from Math 10C u1l9. Classes are
 * prefixed u1l8-. No calculator anywhere (the Unit 1 test is no-calculator). */
import { h, fmt, Explainer, FactorTree, primeFactors, productHTML, expHTML, decimal } from '../explain.js';
import { tex } from '../tex.js';
import { standup } from '../standup.js';

const at = (el, x, y) => { el.style.left = x + 'px'; el.style.top = y + 'px'; return el; };
const add = (stage, el, x, y) => { stage.appendChild(at(el, x, y)); return el; };
const SVGNS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs = {}) => { const e = document.createElementNS(SVGNS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); return e; };
const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen'];
const word = (k) => WORDS[k] || String(k);
const POWER = { 2: 'square', 3: 'cube', 4: 'fourth power', 5: 'fifth power', 6: 'sixth power' };
const GREEN = '#12805a', INK = '#1c2230';

/* ---------------- LaTeX helpers ---------------- */
const tn = (n) => { const s = String(Math.abs(n)), g = s.length > 3 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, '\\,') : s; return (n < 0 ? '-' : '') + g; };
const rt = (n, inner) => (n === 2 ? `\\sqrt{${inner}}` : `\\sqrt[${n}]{${inner}}`);
const pw = (b, e) => (e === 1 ? String(b) : `${b}^{${e}}`);
const varsTex = (vars) => vars.filter(([, e]) => e > 0).map(([s, e]) => pw(s, e)).join('');
const green = (t) => `\\color{${GREEN}}{${t}}`;
function termTex(c, vars = []) { const v = varsTex(vars); if (!v) return tn(c); if (c === 1) return v; if (c === -1) return '-' + v; return tn(c) + v; }

/* fractions, for coefficients like 3/4 */
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
const Q = (p, q = 1) => { if (q < 0) { p = -p; q = -q; } const g = gcd(p, q); return { p: p / g, q: q / g }; };
const qmul = (a, b) => Q(a.p * b.p, a.q * b.q);
const qpow = (a, n) => Q(a.p ** n, a.q ** n);
const qTex = (a, st = 't') => (a.q === 1 ? tn(a.p) : `${a.p < 0 ? '-' : ''}\\${st}frac{${tn(Math.abs(a.p))}}{${tn(a.q)}}`);
const qTerm = (a, vars, st = 't') => { const v = varsTex(vars); if (!v) return qTex(a, st); if (a.p === a.q) return v; if (a.p === -a.q) return '-' + v; return qTex(a, st) + v; };
const nroot = (v, n) => (v < 0 ? -Math.pow(-v, 1 / n) : Math.pow(v, 1 / n));
const dec4 = (v) => (Math.round(v * 10000) / 10000).toFixed(4).replace('-', '−');

/* ---------------- chips ---------------- */
const PRIME_C = { 2: '#3b78d8', 3: '#e0841a', 5: '#8a58c9', 7: '#d0477a', 11: '#13807a', 13: '#6b7a2a' };
const VAR_C = { x: '#12805a', a: '#12805a', b: '#12805a', t: '#12805a', p: '#12805a', y: '#b0306a', q: '#b0306a', z: '#0e7490', r: '#0e7490' };
const numAtom = (p) => ({ k: 'n' + p, v: p, html: String(p), color: PRIME_C[p] || '#5a6372' });
const varAtom = (s) => ({ k: 'v' + s, s, html: tex(s), color: VAR_C[s] || '#12805a' });
const MINUS = { k: 'neg', html: '−', color: '#c93a33' };
const plainOrTex = (t) => (/^-?\d+$/.test(t) ? t.replace('-', '−') : tex(t));
const bigAtom = (t, color = INK) => ({ k: 'big', html: plainOrTex(t), color });

/* ================= the radical board ================= */
class RadBoard {
  constructor(stage, W, o = {}) {
    this.stage = stage; this.W = W;
    const g = this.g = Object.assign({ top: 74, fh: 214, hx: 330, cs: 52, maxNotes: 4 }, o);
    stage.classList.add('u1l8-rb-stage'); stage.style.setProperty('--cs', g.cs + 'px');
    this.top = add(stage, h('div', 'u1l8-rb-top'), 24, 12);
    this.out = add(stage, h('div', 'u1l8-rz u1l8-rz-out'), 16, g.top);
    this.out.style.width = Math.max(0, g.hx - 32) + 'px'; this.out.style.height = g.fh + 'px';
    if (g.hx < 80) this.out.style.display = 'none';
    const fh = g.fh;
    this.hook = add(stage, svgEl('svg', { class: 'u1l8-rb-hook', width: 80, height: fh, viewBox: `0 0 80 ${fh}` }), g.hx, g.top);
    this.hook.appendChild(svgEl('path', { d: `M4 ${fh * 0.6} L20 ${fh * 0.52} L44 ${fh - 5} L78 3` }));
    this.vinc = add(stage, h('div', 'u1l8-rb-vinc'), g.hx + 76, g.top + 1);
    this.idx = add(stage, h('div', 'u1l8-rb-idx'), g.hx + 18, g.top + fh * 0.5 - 6);
    const inX = g.hx + 90, inW = (g.inRight != null ? g.inRight : W - 22) - inX;
    this.inn = add(stage, h('div', 'u1l8-rz u1l8-rz-in'), inX, g.top + 14); this.inn.style.width = inW + 'px'; this.inn.style.height = (fh - 22) + 'px';
    const nb = g.notes || { x: 24, y: g.top + fh + 16, w: W - 48 };
    this.notes = add(stage, h('div', 'u1l8-rb-notes'), nb.x, nb.y); this.notes.style.width = nb.w + 'px';
  }
  setIdx(n, show = n !== 2) { this.idx.innerHTML = n; this.idx.style.opacity = show ? 1 : 0; this.idx.classList.toggle('faint', n === 2); }
  frame() { const b = this.stage.getBoundingClientRect(); this._k = b.width / (this.stage.offsetWidth || 1) || 1; this._b = { left: b.left + this.stage.clientLeft * this._k, top: b.top + this.stage.clientTop * this._k }; }
  rel(el) { const r = el.getBoundingClientRect(), k = this._k; return { x: (r.left - this._b.left) / k, y: (r.top - this._b.top) / k, w: r.width / k, h: r.height / k }; }
  chip(a, cls = '') { const e = h('div', 'u1l8-rc' + (cls ? ' ' + cls : ''), a.html); e.style.setProperty('--kc', a.color || INK); e._a = a; return e; }
  tray(els, full, color) { const t = h('div', 'u1l8-rtray' + (full ? ' full' : '')); if (color) t.style.setProperty('--kc', color); els.forEach((e) => t.appendChild(e)); return t; }
  items() { return [...this.stage.querySelectorAll('.u1l8-rz .u1l8-rc, .u1l8-rz .u1l8-rtray')]; }
  ghost(e, r) {
    const g = e.classList.contains('u1l8-rtray') ? e.cloneNode(false) : e.cloneNode(true);
    g.classList.add('u1l8-rghost'); g.style.left = r.x + 'px'; g.style.top = r.y + 'px'; g.style.width = r.w + 'px'; g.style.height = r.h + 'px'; g.style.opacity = 1; g.style.transform = 'none';
    this.stage.appendChild(g); return g;
  }
  vincWidth() {
    const kids = [...this.inn.children]; if (!kids.length) return 0;
    let right = 0; kids.forEach((k) => { const r = this.rel(k); right = Math.max(right, r.x + r.w); });
    return Math.max(48, right - (this.g.hx + 76) + 18);
  }
  syncVinc() { this.frame(); const w = this.vincWidth(); this.vinc.style.width = w + 'px'; }
  /* Run a DOM change and animate it. mutate() rearranges chips/trays and may return [[fromEl, toEl], …]:
   * a ghost of fromEl flies to toEl (merges, splits, copies). Kept elements slide; removed ones fade; new ones pop. */
  async morph(c, mutate, o = {}) {
    const ms = o.ms || 650;
    if (c.fast) { mutate(); this.syncVinc(); return; }
    this.frame();
    const before = new Map(); this.items().forEach((e) => before.set(e, this.rel(e)));
    const fly = mutate() || [];
    const after = this.items(), afterSet = new Set(after), ar = new Map();
    after.forEach((e) => ar.set(e, this.rel(e)));
    const vw = this.vincWidth(), vw0 = parseFloat(this.vinc.style.width) || 0;
    const flyTo = new Map(); fly.forEach(([f, t]) => { if (!flyTo.has(f)) flyTo.set(f, []); flyTo.get(f).push(t); });
    const arrive = new Map(), jobs = [];
    const d = new Map();
    after.forEach((e) => { if (before.has(e)) { const a = before.get(e), b = ar.get(e); d.set(e, [a.x - b.x, a.y - b.y]); } });
    d.forEach(([dx, dy], e) => {
      const p = d.get(e.parentElement), x = dx - (p ? p[0] : 0), y = dy - (p ? p[1] : 0);
      if (Math.abs(x) + Math.abs(y) > 0.5) jobs.push(c.anim(e, [{ transform: `translate(${x}px, ${y}px)` }, { transform: 'none' }], ms));
    });
    let fi = 0;
    flyTo.forEach((ts, f) => {
      const r = before.get(f); if (!r) return;
      ts.forEach((t) => {
        const tr = ar.get(t); if (!tr) return;
        const g = this.ghost(f, r), delay = (fi++ % 14) * (o.flyStagger != null ? o.flyStagger : 35);
        const sc = Math.min(1.3, Math.max(0.5, tr.h / (r.h || 1)));
        const dx = tr.x + tr.w / 2 - (r.x + r.w / 2), dy = tr.y + tr.h / 2 - (r.y + r.h / 2);
        arrive.set(t, Math.max(arrive.get(t) || 0, delay + ms));
        jobs.push(c.anim(g, [{ transform: 'none', opacity: 1 }, { transform: `translate(${dx}px, ${dy}px) scale(${sc})`, opacity: 0.85 }], ms, { delay }).then(() => g.remove()));
      });
    });
    before.forEach((r, e) => {
      if (afterSet.has(e) || flyTo.has(e)) return;
      const g = this.ghost(e, r);
      jobs.push(c.anim(g, [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'scale(.55)' }], 380).then(() => g.remove()));
    });
    let pi = 0;
    after.forEach((e) => {
      if (before.has(e)) return;
      if (arrive.has(e)) jobs.push(c.anim(e, [{ opacity: 0 }, { opacity: 1 }], 200, { delay: arrive.get(e) - 130 }));
      else if (e.classList.contains('u1l8-rtray')) jobs.push(c.anim(e, [{ opacity: 0 }, { opacity: 1 }], 420, { delay: 120 }));
      else jobs.push(c.pop(e, 420, { delay: (o.popDelay || 0) + (pi++) * (o.stagger || 0) }));
    });
    if (Math.abs(vw - vw0) > 1) jobs.push(c.anim(this.vinc, [{ width: vw0 + 'px' }, { width: vw + 'px' }], ms));
    await Promise.all(jobs);
  }
  async note(c, latex, cls = '', replaceLast = false) { return this.noteHTML(c, tex(latex), cls, replaceLast); }
  async noteHTML(c, html, cls = '', replaceLast = false) {
    if (replaceLast && this.notes.lastChild) this.notes.lastChild.remove();
    const e = h('div', 'u1l8-rb-note' + (cls ? ' ' + cls : ''), html); this.notes.appendChild(e);
    while (this.notes.children.length > this.g.maxNotes) this.notes.firstChild.remove();
    return c.fadeIn(e, 380, { from: 'translateX(-12px)' });
  }
  async setTop(c, latex) { this.top.innerHTML = tex(latex); return c.fadeIn(this.top, 350); }
  async hideRadical(c) { return Promise.all([this.hook, this.vinc, this.idx].map((e) => c.anim(e, [{ opacity: getComputedStyle(e).opacity }, { opacity: 0 }], 450))); }
  async pulse(c, el) { return c.anim(el, [{ transform: 'scale(1)' }, { transform: 'scale(1.18)' }, { transform: 'scale(1)' }], 520); }
}

/* ================= entire → mixed (simplify) ================= */
function analyse({ n, c = 1, vars = [] }) {
  const neg = c < 0, A = Math.abs(c), keys = [], cnt = {}, atom = {};
  (A > 1 ? primeFactors(A) : []).forEach((p) => { const a = numAtom(p); if (!(a.k in cnt)) { keys.push(a.k); cnt[a.k] = 0; atom[a.k] = a; } cnt[a.k]++; });
  vars.forEach(([s, e]) => { const a = varAtom(s); keys.push(a.k); cnt[a.k] = e; atom[a.k] = a; });
  let outC = 1, inC = 1; const outV = [], inV = [];
  keys.forEach((k) => {
    const a = atom[k], q = Math.floor(cnt[k] / n), r = cnt[k] % n;
    if (a.v) { outC *= a.v ** q; inC *= a.v ** r; } else { outV.push([a.s, q]); inV.push([a.s, r]); }
  });
  const sg = neg ? -1 : 1, total = keys.reduce((s, k) => s + cnt[k], 0), groups = keys.reduce((s, k) => s + Math.floor(cnt[k] / n), 0);
  let coefT = termTex(sg * outC, outV); if (coefT === '1') coefT = ''; if (coefT === '-1') coefT = '-';
  const hasIn = inC > 1 || inV.some(([, e]) => e > 0), inT = termTex(inC, inV), posT = termTex(A, vars);
  const result = hasIn ? coefT + rt(n, inT) : termTex(sg * outC, outV);
  const op = vars.length ? '\\cdot ' : '\\times ';
  const aT = (k) => (atom[k].v ? String(atom[k].v) : atom[k].s);
  return { n, c, vars, neg, sg, A, keys, cnt, atom, outC, inC, outV, inV, coefT, hasIn, inT, posT, result, orig: rt(n, termTex(c, vars)), total, groups, op, aT };
}
function factorLine(S) {
  if (S.total <= 16) return `${S.posT} = ${S.keys.flatMap((k) => Array(S.cnt[k]).fill(S.aT(k))).join(S.op)}`;
  return `${S.posT} = ${S.keys.map((k) => pw(S.aT(k), S.cnt[k])).join(S.op)}`;
}
function groupLine(S) {
  const full = [], left = [];
  S.keys.forEach((k) => { const q = Math.floor(S.cnt[k] / S.n), r = S.cnt[k] % S.n; for (let i = 0; i < q; i++) full.push(pw(S.aT(k), S.n)); if (r) left.push(pw(S.aT(k), r)); });
  return `${S.posT} = ${full.concat(left).join(S.op)}`;
}
const outList = (S) => S.keys.flatMap((k) => Array(Math.floor(S.cnt[k] / S.n)).fill(S.aT(k)));
const inList = (S) => S.keys.flatMap((k) => Array(S.cnt[k] % S.n).fill(S.aT(k)));
function checkLine(S) {
  const n = S.n, K = S.sg * S.outC, base = !S.outV.some(([, e]) => e) && K > 0 ? pw(tn(K), n) : `\\left(${S.coefT === '-' ? '-1' : S.coefT}\\right)^{${n}}`;
  const kn = termTex(K ** n, S.outV.map(([s, e]) => [s, e * n]));
  const tail = S.hasIn ? S.op + S.inT : '';
  return `${base}${tail} = ${kn}${tail} = ${termTex(S.c, S.vars)}\\ \\checkmark`;
}

function simplifyMake(stage, spec, ex) {
  const S = analyse(spec), n = S.n;
  const B = new RadBoard(stage, ex.W, { cs: S.total > 16 ? 38 : S.total > 9 ? 44 : 50, fh: S.total > 16 ? 200 : S.total > 9 ? 186 : 170 });
  B.setIdx(n); B.top.innerHTML = tex(S.orig);
  let start = B.chip(bigAtom(termTex(S.c, S.vars)), 'big');
  B.inn.appendChild(start); B.syncVinc();
  let atomEls = [], trays = [];
  const steps = [];
  const fullDesc = () => {
    const parts = S.keys.filter((k) => S.cnt[k] >= n).map((k) => {
      const q = Math.floor(S.cnt[k] / n), g = n <= 3 ? Array(n).fill(S.aT(k)).join('\\cdot ') : pw(S.aT(k), n);
      return (q > 1 ? `${word(q)} groups of ` : '') + tex(g);
    });
    return parts.length > 1 ? parts.slice(0, -1).join(', ') + ' and ' + parts[parts.length - 1] : parts[0];
  };
  const leftL = inList(S);
  const leftDesc = leftL.length ? `${tex(leftL.join(S.op))} ${leftL.length > 1 ? 'are' : 'is'} left over` : 'nothing is left over';
  if (S.neg) steps.push({
    cap: `The index is <b>odd</b>, so the <b>negative sign can come out</b> in front: ${tex(S.orig + '=-' + rt(n, S.posT))}. An odd root of a negative number is negative.`,
    run: async (c) => {
      await B.morph(c, () => { const old = start; old.remove(); const ni = B.chip(bigAtom(S.posT), 'big'), m = B.chip(MINUS, 'minus'); B.inn.appendChild(ni); B.out.appendChild(m); start = ni; return [[old, ni], [old, m]]; });
      await B.note(c, `${S.orig} = -${rt(n, S.posT)}`);
    }
  });
  const oneVar = S.A === 1 && S.vars.length === 1;
  steps.push({
    cap: oneVar ? `${tex(pw(S.vars[0][0], S.vars[0][1]))} means <b>${word(S.vars[0][1])} ${tex(S.vars[0][0])}’s</b> multiplied together.`
      : !S.vars.length ? (S.total === 1 ? `<b>${fmt(S.A)}</b> is prime: it is its own only prime factor.` : `Break <b>${fmt(S.A)}</b> into <b>prime factors</b>: ${tex(factorLine(S))}.`)
        : `Break the number into <b>prime factors</b> and write each variable out as <b>single factors</b>.`,
    run: async (c) => {
      await B.morph(c, () => {
        const old = start; old.remove();
        atomEls = S.keys.flatMap((k) => Array.from({ length: S.cnt[k] }, () => B.chip(S.atom[k])));
        atomEls.forEach((e) => B.inn.appendChild(e));
        return atomEls.map((e) => [old, e]);
      }, { flyStagger: 22 });
      await B.note(c, factorLine(S));
    }
  });
  steps.push({
    cap: S.groups
      ? (oneVar ? `Index <b>${n}</b>, so make <b>groups of ${word(n)}</b>. ${S.vars[0][1]} ÷ ${n} = <b>${Math.floor(S.vars[0][1] / n)}</b> R <b>${S.vars[0][1] % n}</b>: ${word(Math.floor(S.vars[0][1] / n))} full group${Math.floor(S.vars[0][1] / n) > 1 ? 's' : ''}, and ${leftDesc}.`
        : `Index <b>${n}</b>, so sort the factors into <b>groups of ${word(n)}</b> identical factors: ${fullDesc()}. Then ${leftDesc}.`)
      : `Index <b>${n}</b> needs <b>groups of ${word(n)}</b> identical factors, and there aren’t any. Nothing can come out: ${tex(S.orig)} is already in <b>simplest form</b>.`,
    run: async (c) => {
      await B.morph(c, () => {
        const by = {}; atomEls.forEach((e) => (by[e._a.k] = by[e._a.k] || []).push(e));
        trays = []; const left = [];
        S.keys.forEach((k) => { const els = by[k], q = Math.floor(els.length / n); for (let i = 0; i < q; i++) trays.push(B.tray(els.slice(i * n, i * n + n), true, S.atom[k].color)); left.push(...els.slice(q * n)); });
        B.inn.replaceChildren(...trays, ...left);
      });
      if (S.groups) await B.note(c, groupLine(S), '', true);
      else { await B.note(c, `${S.orig}\\ \\text{is in simplest form}`, 'final'); }
    }
  });
  if (!S.groups) return steps;
  const outF = outList(S), ex0 = S.keys.find((k) => S.cnt[k] >= n);
  steps.push({
    cap: `Each full group of ${word(n)} comes out as <b>one</b> factor: ${tex(rt(n, n <= 3 ? Array(n).fill(S.aT(ex0)).join('\\cdot ') : pw(S.aT(ex0), n)) + '=' + S.aT(ex0))}. ${leftL.length ? 'Leftovers <b>stay inside</b>.' : ''}`,
    run: async (c) => {
      await B.morph(c, () => {
        const fly = [];
        trays.forEach((t) => { const kids = [...t.children], oc = B.chip(kids[0]._a); B.out.appendChild(oc); kids.forEach((k) => fly.push([k, oc])); t.remove(); });
        return fly;
      }, { flyStagger: 0 });
      await B.note(c, `${S.neg ? '-' : ''}${rt(n, S.posT)} = ${S.neg ? '-' : ''}${outF.join('\\cdot ')}${S.hasIn ? '\\cdot ' + rt(n, S.inT) : ''}`);
    }
  });
  const outProd = (S.neg ? '-' : '') + (outF.length > 1 ? outF.join(S.op) + '=' + S.coefT.replace(/^-/, '') : outF[0]);
  const inProd = leftL.length > 1 ? leftL.join(S.op) + '=' + S.inT : S.inT;
  steps.push({
    cap: `Multiply what came out: <b>${tex(S.neg ? outProd.replace(/^-/, '') : outProd)}</b>${S.neg ? ', with the − in front' : ''}. ${S.hasIn ? `Multiply what’s left inside: <b>${tex(inProd)}</b>.` : 'Nothing is left inside, so the radical is gone.'} So ${tex(S.orig + '=' + S.result)}.`,
    run: async (c) => {
      await B.morph(c, () => {
        const fly = [], outs = [...B.out.children], coef = B.chip(bigAtom(S.hasIn ? S.coefT : S.result), 'big coef');
        outs.forEach((e) => { e.remove(); fly.push([e, coef]); }); B.out.appendChild(coef);
        if (S.hasIn) { const ins = [...B.inn.children], r = B.chip(bigAtom(S.inT), 'big'); ins.forEach((e) => { e.remove(); fly.push([e, r]); }); B.inn.appendChild(r); }
        return fly;
      });
      const jobs = [B.setTop(c, S.orig + '=' + green(S.result)), B.note(c, `${S.orig} = ${S.result}`, 'final', true)];
      if (!S.hasIn) jobs.push(B.hideRadical(c));
      await Promise.all(jobs);
    }
  });
  steps.push({
    cap: `<b>Check:</b> put ${tex(S.coefT === '-' ? '-1' : S.coefT || '1')} back in as its <b>${POWER[n] || n + 'th power'}</b>. It should rebuild ${tex(termTex(S.c, S.vars))}. ✓`,
    run: async (c) => { await Promise.all([B.note(c, checkLine(S), 'check'), B.pulse(c, B.out.lastChild)]); }
  });
  return steps;
}

/* ================= mixed → entire ================= */
function analyseRev({ n, k, r }) {
  const neg = k.c.p < 0, evenNeg = neg && n % 2 === 0, kc = evenNeg ? Q(-k.c.p, k.c.q) : k.c, kv = k.vars || [], rv = r.vars || [];
  const kn = qpow(kc, n), knV = kv.map(([s, e]) => [s, e * n]);
  const fin = qmul(kn, r.c), finV = {};
  [...knV, ...rv].forEach(([s, e]) => (finV[s] = (finV[s] || 0) + e));
  const finVars = Object.keys(finV).sort().map((s) => [s, finV[s]]);
  const coefT = qTerm(k.c, kv), coefD = qTerm(k.c, kv, 'd'), inT = qTerm(r.c, rv), inD = qTerm(r.c, rv, 'd');
  const finT = qTerm(fin, finVars), finD = qTerm(fin, finVars, 'd');
  const kcT = qTerm(kc, kv), knT = qTerm(kn, knV);
  const base = !kv.length && kc.q === 1 && kc.p > 0 ? pw(tn(kc.p), n) : `\\left(${kcT}\\right)^{${n}}`;
  const op = kv.length || rv.length ? '\\cdot ' : '\\times ';
  return { n, k, r, kv, rv, neg, evenNeg, kc, kn, knV, fin, finVars, coefT, inT, finT, kcT, knT, base, op,
    orig: coefD + rt(n, inD), result: (evenNeg ? '-' : '') + rt(n, finD) };
}
function toEntireMake(stage, spec, ex) {
  const R = analyseRev(spec), n = R.n, numeric = !R.kv.length;
  const B = new RadBoard(stage, ex.W, { cs: 50, fh: R.kv.length ? 186 : 170 });
  B.setIdx(n); B.top.innerHTML = tex(R.orig);
  // outside: the coefficient. A number is one chip; a coefficient with variables is one chip per factor (b³ → b, b, b).
  let coefEls = [];
  if (numeric) coefEls = [B.chip(bigAtom(qTex(R.k.c)), 'num')];
  else {
    if (R.k.c.p !== R.k.c.q) coefEls.push(B.chip({ k: 'kc', html: plainOrTex(qTex(R.k.c)), color: '#5a6372' }));
    R.kv.forEach(([s, e]) => { for (let i = 0; i < e; i++) coefEls.push(B.chip(varAtom(s))); });
  }
  coefEls.forEach((e) => B.out.appendChild(e));
  const inEls = [];
  if (R.r.c.p !== R.r.c.q || !R.rv.length) inEls.push(B.chip({ k: 'u1l8-rc', html: plainOrTex(qTex(R.r.c)), color: '#5a6372' }));
  R.rv.forEach(([s, e]) => inEls.push(B.chip({ k: 'r' + s, html: tex(pw(s, e)), color: VAR_C[s] })));
  inEls.forEach((e) => B.inn.appendChild(e)); B.syncVinc();
  const steps = [];
  let goers = coefEls, copies = [];
  if (R.evenNeg) steps.push({
    cap: `The index is <b>even</b>. ${tex(`(${tn(R.k.c.p)})^{${n}}=${tn(R.k.c.p ** n)}`)} is positive, so a negative can’t be made inside. The <b>− stays outside</b>; only ${tex(R.kcT)} goes in.`,
    run: async (c) => {
      await B.morph(c, () => { const old = coefEls[0]; old.remove(); const m = B.chip(MINUS, 'minus'), k2 = B.chip(bigAtom(R.kcT), 'num'); B.out.append(m, k2); goers = [k2]; return [[old, m], [old, k2]]; });
      await B.note(c, `${R.orig} = -\\left(${R.kcT}${rt(n, R.inT)}\\right)`);
    }
  });
  steps.push({
    cap: (R.neg && !R.evenNeg ? `The index is <b>odd</b>, so the − can go inside too. ` : '')
      + `Write the coefficient as a ${n === 2 ? 'square root' : n === 3 ? 'cube root' : 'root with index ' + n}: it goes in <b>${word(n)} times</b>, ${n >= 4 ? '<span style="font-size:.78em">' : '<span>'}${tex(R.kcT + '=' + rt(n, numeric ? Array(n).fill(R.kc.q === 1 && R.kc.p > 0 ? R.kcT : '\\left(' + R.kcT + '\\right)').join('\\cdot ') : R.base))}</span>.`, // smaller for index 4+, so the radical fits the sidebar
    run: async (c) => {
      await B.morph(c, () => {
        const fly = [];
        const ts = numeric ? [B.tray(Array.from({ length: n }, () => B.chip(goers[0]._a, 'num')), true, '#5a6372')]
          : Array.from({ length: n }, () => B.tray(goers.map((g) => B.chip(g._a)), true, '#5a6372'));
        copies = ts;
        if (numeric) [...ts[0].children].forEach((ch) => fly.push([goers[0], ch]));
        else ts.forEach((t) => [...t.children].forEach((ch, j) => fly.push([goers[j], ch])));
        goers.forEach((g) => g.remove());
        B.inn.prepend(...ts);
        return fly;
      }, { flyStagger: 60 });
      await B.note(c, R.evenNeg ? `${R.orig} = -\\left(${rt(n, R.base)}${R.op}${rt(n, R.inT)}\\right)` : `${R.orig} = ${rt(n, R.base)}${R.op}${rt(n, R.inT)}`);
    }
  });
  if (numeric) steps.push({
    cap: `Multiply the copies: ${tex(R.base + '=' + qTex(R.kn))}.${R.neg && !R.evenNeg ? ' An odd power of a negative is <b>negative</b>.' : ''}`,
    run: async (c) => {
      await B.morph(c, () => { const t = copies[0], kids = [...t.children], p = B.chip(bigAtom(qTex(R.kn)), 'num'); t.replaceWith(p); return kids.map((k) => [k, p]); });
      await B.note(c, `= ${R.evenNeg ? '-' : ''}${rt(n, qTex(R.kn) + R.op + R.inT)}`);
    }
  });
  else steps.push({
    cap: `Raise the coefficient to the power ${n}: ${tex(R.base + '=' + R.knT)}. Like factors group together: ${R.k.c.p !== R.k.c.q ? `${tex(Array(n).fill(qTex(R.kc)).join('\\cdot ') + '=' + qTex(R.kn))}, ` : ''}${R.kv.map(([s, e]) => tex(`${pw(s, e)}\\text{ ${word(n)} times}=${pw(s, e * n)}`)).join(', ')}.`,
    run: async (c) => {
      let groups = [];
      await B.morph(c, () => {
        const all = copies.flatMap((t) => [...t.children]), by = {}, order = [];
        all.forEach((e) => { const kk = e._a.k; if (!by[kk]) { by[kk] = []; order.push(kk); } by[kk].push(e); });
        groups = order.map((kk) => B.tray(by[kk], true, by[kk][0]._a.color));
        copies.forEach((t) => t.remove()); B.inn.prepend(...groups);
      });
      await c.sleep(250);
      await B.morph(c, () => {
        const fly = [];
        groups.forEach((t) => {
          const kids = [...t.children], a = kids[0]._a;
          const v = a.v != null ? null : a.s;
          const html = v ? tex(pw(v, kids.length)) : plainOrTex(qTex(R.kn));
          const p = B.chip({ k: a.k, html, color: a.color }); t.replaceWith(p); kids.forEach((k) => fly.push([k, p]));
        });
        return fly;
      });
      await B.note(c, `= ${rt(n, R.knT + R.op + R.inT)}`);
    }
  });
  steps.push({
    cap: `Multiply everything under <b>one root</b>${R.knV.some(([s]) => R.rv.some(([t]) => t === s)) ? ' (add the exponents of matching variables)' : ''}: ${tex(R.knT + R.op + R.inT + '=' + R.finT)}. So ${tex(R.orig + '=' + R.result)}.`,
    run: async (c) => {
      await B.morph(c, () => { const kids = [...B.inn.children], f = B.chip(bigAtom(R.finT), 'big'); kids.forEach((k) => k.remove()); B.inn.appendChild(f); return kids.map((k) => [k, f]); });
      await Promise.all([B.setTop(c, R.orig + '=' + green(R.result)), B.note(c, `${R.orig} = ${R.result}`, 'final', true)]);
    }
  });
  if (numeric && !R.rv.length && R.kn.q === 1 && R.r.c.q === 1) {
    // no calculator in Unit 1: check by dividing the coefficient's power back out
    const F = R.fin.p, K = R.kn.p, M = R.r.c.p, Kp = K < 0 ? `(${tn(K)})` : tn(K);
    steps.push({
      cap: `<b>Check:</b> divide by the ${POWER[n] || n + 'th power'} ${tex(Kp)}: ${tex(`${tn(F)}\\div${Kp}=${tn(M)}`)}, the radicand we started with ✓`,
      run: async (c) => { await B.noteHTML(c, `Check: ${tex(`${tn(F)}\\div${Kp}=${tn(M)}`)} ✓`, 'check'); }
    });
  }
  return steps;
}


/* ================= small helpers ================= */
const T = (s) => tex(s);
const counts = (ps) => ps.reduce((m, p) => { m[p] = (m[p] || 0) + 1; return m; }, {});
const listAnd = (a) => (a.length <= 1 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1]);
const moveTo = (c, el, x, y, ms = 600, o = {}) => c.anim(el, [{ left: el.style.left, top: el.style.top }, { left: x + 'px', top: y + 'px' }], ms, o).then(() => { el.style.left = x + 'px'; el.style.top = y + 'px'; });
const prod = (ps) => ps.reduce((a, b) => a * b, 1);
const uniq = (ps) => [...new Set(ps)];
const lcm = (a, b) => a / gcd(a, b) * b;
const neg = (n) => String(n).replace('-', '−');          // a real minus sign in plain text
const fr = (n, d, st = 'frac') => `\\${st}{${n}}{${d}}`;

/* ================= 2. BEDMAS, one step at a time ================= */
const HL = (x, lab, raw) => `{\\color{#c2410c}\\underbrace{${x}}_{${raw ? lab : '\\text{' + lab + '}'}}}`;
const RUNG = { B: 0, E: 1, DM: 2, AS: 3 };
const BD = {
  sub: { q: '-5-(-8)', rows: [
    { r: 'AS', l: `-5${HL('-(-8)', 'subtract a negative')}`, cap: 'No brackets, exponents, × or ÷. <b>Subtracting is adding the opposite</b>: − (−8) becomes + 8.' },
    { r: 'AS', l: `=${HL('-5+8', 'different signs')}`, cap: 'Different signs: subtract 8 − 5 = 3 and keep the sign of the larger (8 is positive).' },
    { l: '=3', cap: 'So −5 − (−8) = <b>3</b>.', fin: true }] },
  sq: { q: '-4^{2}\\ \\text{vs.}\\ (-4)^{2}', rows: [
    { r: 'E', l: HL('-4^{2}', 'only the 4 is squared'), cap: 'No brackets: the exponent belongs to the <b>4 only</b>. Square it, then put the − in front.' },
    { l: '=-(4\\times4)=-16', cap: '−4² = −(4 × 4) = <b>−16</b>.' },
    { r: 'E', l: HL('(-4)^{2}', '\\text{the whole }{-4}', true), cap: 'Now the brackets hold the −: the <b>whole −4</b> is squared.', gap: true },
    { l: '=(-4)(-4)=16', cap: '(−4)² = (−4)(−4) = <b>16</b>: like signs multiply to +. Brackets matter: −16 ≠ 16.', fin: true }] },
  a: { q: '-15+6\\times(-3)', rows: [
    { r: 'DM', l: `-15+${HL('6\\times(-3)', 'multiply first')}`, cap: 'No brackets to work inside and no exponents. <b>Multiply before you add</b>: 6 × (−3) = −18 (unlike signs → negative).' },
    { r: 'AS', l: `=${HL('-15+(-18)', 'add')}`, cap: 'Now add: −15 + (−18). Same signs: add 15 + 18 = 33 and keep the − sign.' },
    { l: '=-33', cap: 'So −15 + 6 × (−3) = <b>−33</b>.', fin: true }] },
  b: { q: '(4-9)^{2}\\div(-5)+2', rows: [
    { r: 'B', l: `${HL('(4-9)', 'brackets')}^{2}\\div(-5)+2`, cap: '<b>Brackets first</b>: 4 − 9 = −5. Keep it in brackets: the exponent is waiting.' },
    { r: 'E', l: `=${HL('(-5)^{2}', 'exponent')}\\div(-5)+2`, cap: '<b>Exponent</b> next: (−5)² = (−5)(−5) = 25. The brackets hold the −, so it’s positive.' },
    { r: 'DM', l: `=${HL('25\\div(-5)', 'divide')}+2`, cap: '<b>Divide</b>: 25 ÷ (−5) = −5 (unlike signs → negative).' },
    { r: 'AS', l: `=${HL('-5+2', 'add')}`, cap: '<b>Add</b>: −5 + 2. Different signs: 5 − 2 = 3, keep the sign of the larger (−).' },
    { l: '=-3', cap: 'So (4 − 9)² ÷ (−5) + 2 = <b>−3</b>.', fin: true }] },
  c: { q: '-6^{2}+(-6)^{2}', rows: [
    { r: 'E', l: `${HL('-6^{2}', 'only the 6')}+(-6)^{2}`, cap: '<b>Exponents</b> first. No bracket on the first one: only the 6 is squared, −6² = −36.' },
    { r: 'E', l: `=-36+${HL('(-6)^{2}', '\\text{the whole }{-6}', true)}`, cap: 'The second one has brackets: the whole −6 is squared, (−6)² = 36.' },
    { r: 'AS', l: `=${HL('-36+36', 'add')}`, cap: '<b>Add</b>: −36 + 36. Opposites cancel.' },
    { l: '=0', cap: 'So −6² + (−6)² = <b>0</b>. The two terms look alike, but the brackets make them opposites.', fin: true }] }
};
const bedmas = {
  title: 'BEDMAS, one step at a time',
  height: 470,
  choices: [{ v: 'sub', label: T('-5-(-8)') }, { v: 'sq', label: T('-4^{2}') + ' vs. ' + T('(-4)^{2}') }, { sep: 'Example 1 check:' }, { v: 'a', label: '(a)' }, { v: 'b', label: '(b)' }, { v: 'c', label: '(c)' }],
  intro: (v) => `Evaluate ${T(BD[v].q)}. At each step, find the <b>highest rung</b> of the BEDMAS ladder that still has work.`,
  make(stage, v, ex) {
    const W = ex.W, D = BD[v];
    const rungs = [['B', 'Brackets'], ['E', 'Exponents'], ['D M', '× ÷ left to right'], ['A S', '+ − left to right']].map(([k, t], i) => add(stage, h('div', 'u1l8-rung', `<b>${k}</b>${t}`), 22, 24 + i * 78));
    const work = add(stage, h('div', 'u1l8-work'), 300, 16); work.style.width = (W - 320) + 'px';
    const steps = [];
    D.rows.forEach((row) => {
      steps.push({
        cap: row.cap,
        run: async (c) => {
          rungs.forEach((e) => e.classList.remove('on'));
          const jobs = [];
          if (row.r != null) { const e = rungs[RUNG[row.r]]; e.classList.add('on'); jobs.push(c.anim(e, [{ transform: 'scale(1)' }, { transform: 'scale(1.06)' }, { transform: 'scale(1)' }], 380)); }
          const ln = h('div', 'u1l8-wl' + (row.fin ? ' fin' : '') + (row.gap ? ' gap' : ''), T(row.l)); work.appendChild(ln);
          jobs.push(c.fadeIn(ln, 380, { from: 'translateY(-8px)' }));
          await Promise.all(jobs);
        }
      });
    });
    return steps;
  }
};

/* ================= 3. Fraction bars: cut the pieces to the same size ================= */
const BS = {
  kit: { a: [2, 3], op: '+', b: [1, 4] },
  a: { a: [5, 6], op: '-', b: [1, 4] },
  c: { a: [2, 3], op: '+', b: [1, 8], pre: true }
};
function barEl(stage, x, y, w, d, n, cls, hgt = 50) {
  const e = add(stage, h('div', 'u1l8-bar ' + cls), x, y); e.style.width = w + 'px'; e.style.height = hgt + 'px';
  const set = (dd, nn, from = 0) => { e.innerHTML = ''; for (let i = 0; i < dd; i++) e.appendChild(h('span', 'u1l8-bc' + (i >= from && i < from + nn ? ' on' : ''))); };
  set(d, n);
  return { el: e, set };
}
const ORD = { 2: 'halves', 3: 'thirds', 4: 'quarters', 6: 'sixths', 8: 'eighths', 12: 'twelfths', 24: 'twenty-fourths' };
const bars = {
  title: 'Fraction bars: same-size pieces before you add or subtract',
  height: 440,
  choices: [{ v: 'kit', label: T('\\tfrac23+\\tfrac14') }, { sep: 'Example 2 check:' }, { v: 'a', label: '(a) ' + T('\\tfrac56-\\tfrac14') }, { v: 'c', label: '(c) ' + T('\\tfrac23+\\tfrac12\\times\\tfrac14') }],
  intro: (v) => `Evaluate ${v === 'c' ? T('\\dfrac23+\\dfrac12\\times\\dfrac14') : T(`\\dfrac{${BS[v].a[0]}}{${BS[v].a[1]}}${BS[v].op}\\dfrac{${BS[v].b[0]}}{${BS[v].b[1]}}`)} with fraction bars.`,
  make(stage, v, ex) {
    const W = ex.W, S = BS[v], [n1, d1] = S.a, [n2, d2] = S.b, L = lcm(d1, d2), m1 = n1 * L / d1, m2 = n2 * L / d2;
    const res = S.op === '+' ? m1 + m2 : m1 - m2, g = gcd(res, L);
    const bw = S.pre ? 520 : 680, bx = 150;
    const lab = (y, t) => { const e = add(stage, h('div', 'u1l8-blab', T(t)), 24, y); e.style.opacity = 0; return e; };
    const A = barEl(stage, bx, 40, bw, d1, n1, 'a'), B = barEl(stage, bx, 130, bw, d2, n2, 'b'), R = barEl(stage, bx, 250, bw, L, 0, 'r');
    [A, B, R].forEach((q) => (q.el.style.opacity = 0));
    const lA = lab(40, fr(n1, d1, 'dfrac')), lB = lab(130, (S.op === '+' ? '+\\,' : '-\\,') + fr(n2, d2, 'dfrac')), lR = lab(250, '=\\,?');
    const note = add(stage, h('div', 'u1l8-bnote'), 24, 340); note.style.width = (W - 48) + 'px';
    const say = (c, t) => { note.innerHTML = T(t); return c.fadeIn(note, 350); };
    const steps = [];
    if (S.pre) {
      const ax = W - 250, ay = 40, as = 200;
      const box = add(stage, h('div', 'u1l8-area'), ax, ay); box.style.width = box.style.height = as + 'px'; box.style.opacity = 0;
      const cells = []; for (let r = 0; r < 2; r++) for (let q = 0; q < 4; q++) { const cl = add(box, h('span', 'u1l8-ac'), q * as / 4, r * as / 2); cl.style.width = as / 4 + 'px'; cl.style.height = as / 2 + 'px'; cells.push({ cl, r, q }); }
      const alab = add(stage, h('div', 'u1l8-alab'), ax, ay + as + 10); alab.style.width = as + 'px'; alab.style.opacity = 0;
      B.set(8, 1); lB.innerHTML = T('+\\,\\dfrac{1}{8}');
      steps.push({ cap: '<b>Order of operations: multiply before you add.</b> First find ½ × ¼. Start with ¼ of a square.',
        run: async (c) => { cells.filter((z) => z.q === 0).forEach((z) => z.cl.classList.add('q')); alab.innerHTML = T('\\tfrac14\\ \\text{shaded}'); await Promise.all([c.fadeIn(box, 400), c.fadeIn(alab, 400), say(c, '\\dfrac23+\\dfrac12\\times\\dfrac14')]); } });
      steps.push({ cap: '½ of that quarter is <b>one of 8</b> equal pieces: ½ × ¼ = ⅛. Now the question is ⅔ + ⅛.',
        run: async (c) => { const z = cells.find((y) => y.q === 0 && y.r === 0); z.cl.classList.add('h'); alab.innerHTML = T('\\tfrac12\\times\\tfrac14=\\tfrac18'); await Promise.all([c.pop(z.cl, 400), say(c, '\\dfrac23+\\dfrac12\\times\\dfrac14=\\dfrac23+\\dfrac18')]); } });
    }
    steps.push({ cap: `Show both fractions as bars. The pieces are <b>different sizes</b> (${ORD[d1]} and ${ORD[d2]}), so we can’t ${S.op === '+' ? 'add' : 'subtract'} them yet.`,
      run: (c) => Promise.all([c.fadeIn(A.el, 400), c.fadeIn(B.el, 400, { delay: 150 }), c.fadeIn(lA, 400), c.fadeIn(lB, 400, { delay: 150 })]) });
    steps.push({ cap: `Common denominator: the <b>LCD of ${d1} and ${d2} is ${L}</b>. Cut every piece so both bars have ${L} equal pieces: ${T(`\\tfrac{${n1}}{${d1}}=\\tfrac{${m1}}{${L}}`)} and ${T(`\\tfrac{${n2}}{${d2}}=\\tfrac{${m2}}{${L}}`)}.`,
      run: async (c) => { A.set(L, m1); B.set(L, m2); lA.innerHTML = T(fr(m1, L, 'dfrac')); lB.innerHTML = T((S.op === '+' ? '+\\,' : '-\\,') + fr(m2, L, 'dfrac'));
        await Promise.all([c.anim(A.el, [{ opacity: 0.3 }, { opacity: 1 }], 450), c.anim(B.el, [{ opacity: 0.3 }, { opacity: 1 }], 450), say(c, `${fr(n1, d1, 'dfrac')}${S.op}${fr(n2, d2, 'dfrac')}=${fr(m1, L, 'dfrac')}${S.op}${fr(m2, L, 'dfrac')}`)]); } });
    steps.push({ cap: S.op === '+' ? `Now the pieces match: ${m1} ${ORD[L]} + ${m2} ${ORD[L]} = <b>${res} ${ORD[L]}</b>. Add the numerators; keep the denominator.` : `Now the pieces match: ${m1} ${ORD[L]} − ${m2} ${ORD[L]} = <b>${res} ${ORD[L]}</b>. Subtract the numerators; keep the denominator.`,
      run: async (c) => {
        R.set(L, S.op === '+' ? m1 : m1); [...R.el.children].forEach((e, i) => { if (S.op === '+' && i >= m1 && i < m1 + m2) e.classList.add('on2'); if (S.op === '-' && i >= res && i < m1) e.classList.add('gone'); });
        lR.innerHTML = T('=\\,' + fr(res, L, 'dfrac'));
        await Promise.all([c.fadeIn(R.el, 450), c.fadeIn(lR, 450), say(c, `${fr(m1, L, 'dfrac')}${S.op}${fr(m2, L, 'dfrac')}=${fr(res, L, 'dfrac')}`)]);
      } });
    steps.push({ cap: g > 1 ? `Lowest terms: ${res} and ${L} share ${g}, so ${T(`\\tfrac{${res}}{${L}}=\\tfrac{${res / g}}{${L / g}}`)}.` : `Lowest terms? ${res} and ${L} share no common factor, so the answer is <b>${T(`\\tfrac{${res}}{${L}}`)}</b>.`,
      run: async (c) => { note.classList.add('fin'); await say(c, `${S.pre ? '\\dfrac23+\\dfrac12\\times\\dfrac14' : fr(n1, d1, 'dfrac') + S.op + fr(n2, d2, 'dfrac')}=${fr(res / g, L / g, 'dfrac')}`); } });
    return steps;
  }
};

/* ================= 3. Cancel first; divide by flipping; decimal → fraction ================= */
function fracBox(n, d) { const e = h('div', 'u1l8-fb', `<span class="u1l8-fn"><i>${n}</i></span><span class="u1l8-fl"></span><span class="u1l8-fd"><i>${d}</i></span>`); return e; }
async function strike(c, span, nv, below) { span.classList.add('x'); const s = h('span', 'u1l8-new' + (below ? ' dn' : ''), String(nv)); span.appendChild(s); await c.pop(s, 380); }
const cancelDec = {
  title: 'Cancel first, flip to divide, decimals by place value',
  height: 420,
  choices: [{ v: 'div', label: T('\\tfrac34\\div\\tfrac12') }, { sep: 'Example 2 check:' }, { v: 'b', label: '(b) ' + T('\\tfrac{3}{10}\\times\\tfrac49') }, { v: 'd', label: '(d) ' + T('0.35') }],
  intro: (v) => (v === 'd' ? `Convert ${T('0.35')} to a fraction in lowest terms.` : v === 'b' ? `Evaluate ${T('\\dfrac{3}{10}\\times\\dfrac49')}, cancelling common factors first.` : `Evaluate ${T('\\dfrac34\\div\\dfrac12')}.`),
  make(stage, v, ex) { return v === 'd' ? decMake(stage, ex) : mulMake(stage, v, ex); }
};
function mulMake(stage, v, ex) {
  const row = add(stage, h('div', 'u1l8-frow'), 40, 60);
  const F1 = v === 'b' ? fracBox(3, 10) : fracBox(3, 4), op = h('div', 'u1l8-fop', v === 'b' ? '×' : '÷'), F2 = v === 'b' ? fracBox(4, 9) : fracBox(1, 2), eq = h('div', 'u1l8-fop', '='), R = fracBox('', ''); R.style.opacity = 0; eq.style.opacity = 0;
  row.append(F1, op, F2, eq, R);
  const note = add(stage, h('div', 'u1l8-bnote'), 40, 320); note.style.width = (ex.W - 80) + 'px';
  const say = (c, t) => { note.innerHTML = T(t); return c.fadeIn(note, 350); };
  const q = (F, s) => F.querySelector(s === 'n' ? '.u1l8-fn' : '.u1l8-fd');
  const showR = (c, n, d) => { R.querySelector('.u1l8-fn').textContent = n; R.querySelector('.u1l8-fd').textContent = d; return Promise.all([c.fadeIn(eq, 300), c.pop(R, 420)]); };
  if (v === 'b') return [
    { cap: '<b>Multiplying needs no common denominator.</b> Look for a top number and a bottom number that share a factor: <b>3</b> (top) and <b>9</b> (bottom) share 3.',
      run: (c) => Promise.all([strike(c, q(F1, 'n'), 1), strike(c, q(F2, 'd'), 3, true), say(c, '3\\div3=1,\\quad 9\\div3=3')]) },
    { cap: '<b>4</b> (top) and <b>10</b> (bottom) share 2: 4 → 2 and 10 → 5.',
      run: (c) => Promise.all([strike(c, q(F2, 'n'), 2), strike(c, q(F1, 'd'), 5, true), say(c, '4\\div2=2,\\quad 10\\div2=5')]) },
    { cap: 'Multiply what’s left: top 1 × 2 = 2, bottom 5 × 3 = 15. The answer is <b>2/15</b>, already in lowest terms.',
      run: (c) => Promise.all([showR(c, 2, 15), say(c, '\\dfrac{3}{10}\\times\\dfrac49=\\dfrac15\\times\\dfrac23=\\dfrac{2}{15}')]) },
    { cap: 'Check without cancelling: 3 × 4 = 12 and 10 × 9 = 90, and 12/90 ÷ 6 gives 2/15 ✓. Cancelling first keeps the numbers small.',
      run: async (c) => { note.classList.add('fin'); await say(c, '\\dfrac{12}{90}=\\dfrac{2}{15}\\ \\checkmark'); } }
  ];
  return [
    { cap: '<b>Dividing</b> by a fraction means <b>multiplying by its reciprocal</b>: flip ½ to 2/1 and change ÷ to ×.',
      run: async (c) => { await c.anim(F2, [{ transform: 'rotateX(0)' }, { transform: 'rotateX(90deg)' }], 250); q(F2, 'n').innerHTML = '<i>2</i>'; q(F2, 'd').innerHTML = '<i>1</i>'; op.textContent = '×'; await Promise.all([c.anim(F2, [{ transform: 'rotateX(90deg)' }, { transform: 'rotateX(0)' }], 250), say(c, '\\dfrac34\\div\\dfrac12=\\dfrac34\\times\\dfrac21')]); } },
    { cap: 'Cancel: <b>2</b> (top) and <b>4</b> (bottom) share 2: 2 → 1 and 4 → 2.',
      run: (c) => Promise.all([strike(c, q(F2, 'n'), 1), strike(c, q(F1, 'd'), 2, true)]) },
    { cap: 'Multiply: top 3 × 1 = 3, bottom 2 × 1 = 2. So ¾ ÷ ½ = <b>3/2</b>: one and a half halves fit in three quarters.',
      run: async (c) => { await showR(c, 3, 2); note.classList.add('fin'); await say(c, '\\dfrac34\\div\\dfrac12=\\dfrac34\\times\\dfrac21=\\dfrac32=1\\tfrac12'); } }
  ];
}
function decMake(stage, ex) {
  const s = 30, gx = 60, gy = 24, cells = [];
  const grid = add(stage, h('div', 'u1l8-hg'), gx, gy); grid.style.width = grid.style.height = 10 * s + 'px';
  for (let col = 0; col < 10; col++) for (let r = 0; r < 10; r++) { const e = add(grid, h('span', 'u1l8-hc'), col * s, r * s); e.style.width = e.style.height = s + 'px'; cells.push({ e, col, r }); }
  const lit = cells.filter((z) => z.col < 3 || (z.col === 3 && z.r < 5));
  const panel = add(stage, h('div', 'u1l8-dpanel'), 420, 40); panel.style.width = (ex.W - 450) + 'px';
  const line = (c, t, cls = '') => { const e = h('div', 'u1l8-dl ' + cls, T(t)); panel.appendChild(e); return c.fadeIn(e, 350); };
  return [
    { cap: '0.35 means <b>3 tenths and 5 hundredths</b> = 35 hundredths. Shade 35 of the 100 squares (each column is one tenth).',
      run: async (c) => { lit.forEach((z) => z.e.classList.add('on')); await Promise.all([c.anim(grid, [{ opacity: 0.4 }, { opacity: 1 }], 400), line(c, '0.35=\\dfrac{35}{100}')]); } },
    { cap: '35 and 100 are both divisible by <b>5</b>. Group the squares in fives (half a column each): 100 squares make <b>20</b> groups, and the shaded 35 make <b>7</b>.',
      run: async (c) => { for (let col = 0; col < 10; col++) for (let half = 0; half < 2; half++) { const b = add(grid, h('span', 'u1l8-hgrp' + (col < 3 || (col === 3 && half === 0) ? ' on' : '')), col * s, half * 5 * s); b.style.width = s + 'px'; b.style.height = 5 * s + 'px'; } await Promise.all([c.anim(grid, [{ transform: 'scale(1)' }, { transform: 'scale(1.03)' }, { transform: 'scale(1)' }], 450), line(c, '\\dfrac{35\\div5}{100\\div5}=\\dfrac{7}{20}')]); } },
    { cap: '7 and 20 share no common factor, so it’s in lowest terms: <b>0.35 = 7/20</b>.', run: (c) => line(c, '0.35=\\dfrac{7}{20}', 'fin') }
  ];
}

/* ================= 4. GCF and LCM from a prime-factor Venn diagram (from Math 10C u1l9) ================= */
const VENN_X = {
  '40,60': ['<b>Example 3(b):</b> the GCF of 40 and 60 is <b>20</b>.', 'Example 3(b): GCF = <b>20</b>'],
  '9,15': ['<b>Example 3(c):</b> the LCM of 9 and 15 is <b>45</b>.', 'Example 3(c): LCM = <b>45</b>'],
  '75,90': ['<b>Challenge 2(a):</b> the GCF is <b>15</b>, so the biggest square section is 15 m by 15 m.', 'Challenge 2(a): GCF = <b>15</b>']
};
const venn = {
  title: 'GCF and LCM from a prime-factor Venn diagram',
  height: 440,
  minW: 860,
  choices: [{ v: '12,18', label: '12 &amp; 18' }, { sep: 'Example 3 check:' }, { v: '40,60', label: '(b) 40 &amp; 60' }, { v: '9,15', label: '(c) 9 &amp; 15' }, { sep: 'Challenge 2:' }, { v: '75,90', label: '75 &amp; 90' }],
  intro: (v) => `Find the GCF and the LCM of <b>${String(v).replace(',', '</b> and <b>')}</b>. Shared primes go in the overlap.`,
  make(stage, v, ex) {
    const W = ex.W, [A, B] = String(v).split(',').map(Number);
    const pa = primeFactors(A), pb = primeFactors(B), ca = counts(pa), cb = counts(pb);
    const shared = []; uniq(pa).forEach((p) => { for (let i = 0; i < Math.min(ca[p], cb[p] || 0); i++) shared.push(p); });
    const g = prod(shared), L = A * B / g;
    const sc = counts(shared), onlyB = []; const t = {}; pb.forEach((p) => { t[p] = (t[p] || 0) + 1; if (t[p] > (sc[p] || 0)) onlyB.push(p); });
    const all = [...pa, ...onlyB].sort((x, y) => x - y);
    const R = 140, cy = 232, cx1 = 175, cx2 = 345, xm = (cx1 + cx2) / 2, xa = cx1 - 58, xb = cx2 + 58;
    const s = svgEl('svg', { class: 'u1l8-vn-svg' }); stage.appendChild(s);
    s.append(svgEl('circle', { cx: cx1, cy, r: R, class: 'u1l8-vn-c a' }), svgEl('circle', { cx: cx2, cy, r: R, class: 'u1l8-vn-c b' }));
    add(stage, h('div', 'u1l8-vn-name a', fmt(A)), cx1 - 40, 46); add(stage, h('div', 'u1l8-vn-name b', fmt(B)), cx2 + 40, 46);
    const colY = (i, k) => cy + (i - (k - 1) / 2) * 46;
    const chipsA = pa.map((p, i) => { const e = add(stage, h('div', 'u1l8-vchip a', fmt(p)), xa, colY(i, pa.length)); e.style.opacity = 0; e._p = p; return e; });
    const chipsB = pb.map((p, i) => { const e = add(stage, h('div', 'u1l8-vchip b', fmt(p)), xb, colY(i, pb.length)); e.style.opacity = 0; e._p = p; return e; });
    const usedA = new Set(), usedB = new Set(), pairs = [];
    shared.forEach((p) => { const ia = chipsA.findIndex((e, i) => e._p === p && !usedA.has(i)), ib = chipsB.findIndex((e, i) => e._p === p && !usedB.has(i)); usedA.add(ia); usedB.add(ib); pairs.push([chipsA[ia], chipsB[ib]]); });
    const restA = chipsA.filter((_, i) => !usedA.has(i)), restB = chipsB.filter((_, i) => !usedB.has(i));
    const panel = add(stage, h('div', 'u1l8-vn-panel'), 540, 30); panel.style.width = (W - 560) + 'px';
    const line = (cls, html) => { const e = h('div', 'u1l8-vn-line ' + cls, html); panel.appendChild(e); e.style.opacity = 0; return e; };
    const lA = line('', `${fmt(A)} = ${productHTML(pa)}`), lB = line('', `${fmt(B)} = ${productHTML(pb)}`);
    const lG = line('g', shared.length ? `<b>GCF</b> = ${productHTML(shared)} = <b>${fmt(g)}</b>` : '<b>GCF</b> = <b>1</b> <span class="muted">(nothing shared)</span>');
    const lL = line('l', `<b>LCM</b> = ${productHTML(all)} = <b>${fmt(L)}</b>`);
    const X = VENN_X[v], lX = X ? line('x', X[1]) : null;
    const steps = [
      { cap: `Factor both: <b>${fmt(A)} = ${productHTML(pa)}</b> and <b>${fmt(B)} = ${productHTML(pb)}</b>. Each prime goes into its own number’s circle.`,
        run: (c) => Promise.all([c.fadeIn(lA, 300), c.fadeIn(lB, 300, { delay: 150 }), ...chipsA.map((e, i) => c.pop(e, 320, { delay: i * 80 })), ...chipsB.map((e, i) => c.pop(e, 320, { delay: 200 + i * 80 }))]) },
      { cap: shared.length ? `Primes in <b>both</b> lists move to the overlap, one chip for each matching pair: <b>${listAnd(shared.map(fmt))}</b>.` : `${fmt(A)} and ${fmt(B)} have <b>no prime in common</b>, so the overlap stays <b>empty</b>.`,
        run: async (c) => {
          const jobs = [];
          pairs.forEach(([ea, eb], i) => { const y = colY(i, pairs.length); ea.classList.add('both'); jobs.push(moveTo(c, ea, xm, y, 650, { delay: i * 120 }), moveTo(c, eb, xm, y, 650, { delay: i * 120 }).then(() => { eb.style.opacity = 0; })); });
          restA.forEach((e, i) => jobs.push(moveTo(c, e, xa, colY(i, restA.length), 600, { delay: 300 })));
          restB.forEach((e, i) => jobs.push(moveTo(c, e, xb, colY(i, restB.length), 600, { delay: 300 })));
          await Promise.all(jobs);
        } },
      { cap: shared.length ? `<b>GCF = multiply the overlap</b>: ${productHTML(shared)} = <b>${fmt(g)}</b>. (The shared primes, each to the <b>lowest</b> power: ${expHTML(shared)}.)` : 'Nothing is shared, so the only common factor is 1: <b>GCF = 1</b>.',
        run: async (c) => { pairs.forEach(([ea]) => ea.classList.add('lit')); await Promise.all([c.fadeIn(lG, 350), ...pairs.map(([ea], i) => c.anim(ea, [{ transform: 'scale(1)' }, { transform: 'scale(1.25)' }, { transform: 'scale(1)' }], 360, { delay: i * 90 }))]); } },
      { cap: `<b>LCM = multiply everything in the picture</b>: ${productHTML(all)} = <b>${fmt(L)}</b>. (Every prime, each to the <b>highest</b> power: ${expHTML(all)}.)`,
        run: async (c) => { pairs.forEach(([ea]) => ea.classList.remove('lit')); const every = [...pairs.map((p) => p[0]), ...restA, ...restB]; every.forEach((e) => e.classList.add('lit')); await Promise.all([c.fadeIn(lL, 350), ...every.map((e, i) => c.anim(e, [{ transform: 'scale(1)' }, { transform: 'scale(1.25)' }, { transform: 'scale(1)' }], 340, { delay: i * 80 }))]); } }
    ];
    if (X) steps.push({ cap: X[0], run: (c) => c.fadeIn(lX, 400) });
    return steps;
  }
};

/* ================= 5. The nested number sets: drop it in the smallest set ================= */
// rings: [key, label, x0, y0, x1, y1]; the smallest set a number sits in decides every set it belongs to
const RINGS = { R: ['R', 'Real numbers', 14, 8, 986, 412], Q: ['Q', 'Rational', 30, 58, 640, 400], I: ['I', 'Integers', 46, 108, 492, 388], W: ['W', 'Whole', 62, 158, 352, 376], N: ['N', 'Natural', 78, 208, 222, 364], QB: ['\\overline{Q}', 'Irrational', 664, 58, 970, 400] };
const CHAIN = { N: ['N', 'W', 'I', 'Q', 'R'], W: ['W', 'I', 'Q', 'R'], I: ['I', 'Q', 'R'], Q: ['Q', 'R'], QB: ['QB', 'R'] };
const SLOT = { N: [150, 296], W: [287, 290], I: [422, 280], Q: [566, 240], QB: [817, 230] };
const SETNUM = {
  kit: [['7', 'N', '7 is a counting number: <b>natural</b>.'], ['-\\sqrt{25}', 'I', '−√25 = −5: a negative integer, so not whole. Smallest set: <b>integers</b>.'], ['\\sqrt{30}', 'QB', '√30 = 5.477…: 30 is not a perfect square, so the decimal never ends or repeats: <b>irrational</b>.']],
  ex4: [['-10', 'I', '−10 is an integer, but negative, so not whole or natural.'], ['36', 'N', '36 is a counting number: <b>natural</b>.'], ['\\dfrac{5}{9}', 'Q', '5/9 is a fraction of integers (0.555…, repeating): <b>rational</b>, not an integer.'], ['-\\sqrt{81}', 'I', '−√81 = −9 exactly: an <b>integer</b> (negative, so not whole).'], ['\\sqrt{20}', 'QB', '√20 ≈ 4.472…: never ends, never repeats: <b>irrational</b>.'], ['0.\\overline{27}', 'Q', '0.272727… repeats, so it’s <b>rational</b> (it equals 27/99 = 3/11).']]
};
const SETNAME = { N: 'N', W: 'W', I: 'I', Q: 'Q', QB: '\\overline{Q}', R: 'R' };
const sets = {
  title: 'Drop each number into its smallest set',
  height: 420,
  minW: 1000,
  choices: [{ v: 'kit', label: T('7,\\ -\\sqrt{25},\\ \\sqrt{30}') }, { sep: 'Example 4 check:' }, { v: 'ex4', label: 'all six numbers' }],
  intro: (v) => `Classify ${SETNUM[v].map(([t]) => T(t)).join(', ')}: the <b>smallest</b> set first, then every set around it.`,
  make(stage, v, ex) {
    const rings = {};
    Object.entries(RINGS).forEach(([k, [sym, name, x0, y0, x1, y1]]) => {
      const e = add(stage, h('div', 'u1l8-ring r-' + k, `<span class="u1l8-rl">${T(sym)} <small>${name}</small></span>`), x0, y0); e.style.width = (x1 - x0) + 'px'; e.style.height = (y1 - y0) + 'px'; rings[k] = e;
    });
    const used = {};
    return SETNUM[v].map(([t, k, why]) => {
      const i = used[k] = (used[k] || 0) + 1, [sx, sy] = SLOT[k];
      const y = sy + (i - 1) * 66;
      const chip = add(stage, h('div', 'u1l8-nchip', T(t)), sx, 34); chip.style.opacity = 0;
      const chain = CHAIN[k];
      return {
        cap: `${why} So ${T(t)} is in ${T(chain.map((z) => SETNAME[z]).join(',\\ '))}.`,
        run: async (c) => {
          Object.values(rings).forEach((r) => r.classList.remove('lit'));
          await c.fadeIn(chip, 250);
          await moveTo(c, chip, sx, y, 650);
          chain.forEach((z) => rings[z].classList.add('lit'));
          await Promise.all(chain.map((z, j) => c.anim(rings[z].querySelector('.u1l8-rl'), [{ transform: 'scale(1)' }, { transform: 'scale(1.15)' }, { transform: 'scale(1)' }], 320, { delay: j * 110 })));
        }
      };
    });
  }
};

/* ================= 6. Estimating a square root: trap it, then judge the gaps ================= */
const ESTN = { 40: 'L5', 70: 'Ex5', 75: 'Ch2' };
const estimate = {
  title: 'Trap the square root between two whole numbers',
  height: 420,
  choices: [{ v: 40, label: T('\\sqrt{40}') }, { sep: 'Example 5 check:' }, { v: 70, label: '(b) ' + T('\\sqrt{70}') }, { sep: 'Challenge 2 check:' }, { v: 75, label: '(b) ' + T('\\sqrt{75}') }],
  intro: (n) => `Estimate ${T(`\\sqrt{${n}}`)} to one decimal place, without a calculator.`,
  make(stage, n, ex) {
    const W = ex.W, a = Math.floor(Math.sqrt(n)), b = a + 1, A = a * a, B = b * b, lo = n - A, hi = B - n;
    const fx = (v) => 120 + (v - A) / (B - A) * (W - 240), rx = (v) => 120 + (v - a) * (W - 240);
    const est = a + lo / (B - A), t1 = Math.floor(est * 10) / 10, t2 = Math.round((t1 + 0.1) * 10) / 10;
    const s1 = Math.round(t1 * t1 * 100) / 100, s2 = Math.round(t2 * t2 * 100) / 100, best = Math.abs(n - s1) <= Math.abs(s2 - n) ? t1 : t2;
    const svg = add(stage, svgEl('svg', { class: 'u1l8-es-svg', width: W, height: 420, viewBox: `0 0 ${W} 420` }), 0, 0);
    const g1 = svgEl('g'), g2 = svgEl('g'), gc = svgEl('g', { class: 'u1l8-es-con' }); [g1, g2, gc].forEach((g) => { g.style.opacity = 0; svg.appendChild(g); });
    g1.appendChild(svgEl('line', { x1: fx(A) - 30, y1: 90, x2: fx(B) + 30, y2: 90, class: 'u1l8-es-ax' }));
    g2.appendChild(svgEl('line', { x1: rx(a) - 30, y1: 270, x2: rx(b) + 30, y2: 270, class: 'u1l8-es-ax' }));
    for (let k = 0; k <= 10; k++) g2.appendChild(svgEl('line', { x1: rx(a + k / 10), y1: k % 10 ? 262 : 254, x2: rx(a + k / 10), y2: k % 10 ? 278 : 286, class: 'u1l8-es-tk' }));
    [A, B].forEach((v) => g1.appendChild(svgEl('line', { x1: fx(v), y1: 80, x2: fx(v), y2: 100, class: 'u1l8-es-tk' })));
    gc.appendChild(svgEl('line', { x1: fx(A), y1: 100, x2: rx(a), y2: 252 })); gc.appendChild(svgEl('line', { x1: fx(B), y1: 100, x2: rx(b), y2: 252 }));
    const L = (x, y, html, cls = '') => { const e = add(stage, h('div', 'u1l8-es-l ' + cls, html), x, y); e.style.opacity = 0; return e; };
    const lA = L(fx(A), 104, T(`${A}=${a}^2`)), lB = L(fx(B), 104, T(`${B}=${b}^2`)), ln = L(fx(n), 34, `<b>${n}</b>`, 'pt');
    const la = L(rx(a), 292, `<b>${a}</b>`, 'big'), lb = L(rx(b), 292, `<b>${b}</b>`, 'big');
    const gap1 = L((fx(A) + fx(n)) / 2, 140, `${lo} past`, 'gap'), gap2 = L((fx(n) + fx(B)) / 2, 140, `${hi} short`, 'gap');
    const dot1 = add(stage, h('div', 'u1l8-es-dot'), fx(n), 90); dot1.style.opacity = 0;
    const dot2 = add(stage, h('div', 'u1l8-es-dot g'), rx(best), 270); dot2.style.opacity = 0;
    const lest = L(rx(best), 206, T(`\\sqrt{${n}}\\approx${best}`), 'est');
    const chk = L(W / 2, 352, T(`${t1}^2=${s1}\\qquad ${t2}^2=${s2}`), 'chk');
    const irr = n === 75 ? ' 75 is not a perfect square, so √75 is <b>irrational</b>: we can only estimate it.' : '';
    return [
      { cap: `Trap ${n} between the perfect squares just below and just above it: <b>${A} &lt; ${n} &lt; ${B}</b>.${irr}`,
        run: (c) => Promise.all([c.fadeIn(g1, 350), c.fadeIn(lA, 350), c.fadeIn(lB, 350), c.fadeIn(ln, 350, { delay: 200 }), c.pop(dot1, 380)]) },
      { cap: `Take the square roots: <b>${a} &lt; ${T(`\\sqrt{${n}}`)} &lt; ${b}</b>. The root is somewhere between ${a} and ${b}.`,
        run: (c) => Promise.all([c.fadeIn(gc, 400), c.fadeIn(g2, 400), c.fadeIn(la, 400), c.fadeIn(lb, 400)]) },
      { cap: `${n} is <b>${lo}</b> past ${A} but <b>${hi}</b> short of ${B}, so ${T(`\\sqrt{${n}}`)} is <b>closer to ${lo < hi ? a : b}</b>.`,
        run: (c) => Promise.all([c.fadeIn(gap1, 350), c.fadeIn(gap2, 350, { delay: 150 })]) },
      { cap: `About ${lo} out of ${B - A} of the way from ${a} to ${b}: try the tenths near there and square them. ${T(`${t1}^2=${s1}`)} and ${T(`${t2}^2=${s2}`)}.`,
        run: (c) => c.fadeIn(chk, 400) },
      { cap: `${n} is nearer to ${best === t1 ? s1 : s2}, so ${T(`\\sqrt{${n}}\\approx${best}`)}.`,
        run: (c) => Promise.all([c.pop(dot2, 400), c.fadeIn(lest, 400)]) }
    ];
  }
};

/* ================= 7. Radicals: both directions on the radical board ================= */
const RD = {
  a6: { dir: 'mix', spec: { n: 2, c: 80 }, l: '(a)' }, b6: { dir: 'mix', spec: { n: 2, c: 147 }, l: '(b)' }, c6: { dir: 'ent', spec: { n: 2, k: { c: Q(6) }, r: { c: Q(5) } }, l: '(c)' },
  a7: { dir: 'mix', spec: { n: 3, c: 135 }, l: '(a)' }, b7: { dir: 'ent', spec: { n: 3, k: { c: Q(4) }, r: { c: Q(3) } }, l: '(b)' }, c7: { dir: 'mix', spec: { n: 4, c: 162 }, l: '(c)' },
  ch1: { dir: 'mix', spec: { n: 2, c: 242 }, l: '' }
};
const rdLabel = (v) => { const e = RD[v]; return e.dir === 'mix' ? T(rt(e.spec.n, tn(e.spec.c))) : T(qTerm(e.spec.k.c, []) + rt(e.spec.n, qTerm(e.spec.r.c, []))); };
const radicals = {
  title: 'Radicals: groups the size of the index',
  height: 470,
  minW: 820,
  choices: [{ sep: 'Example 6 check:' }, 'a6', 'b6', 'c6', { sep: 'Example 7:' }, 'a7', 'b7', 'c7', { sep: 'Challenge 1:' }, 'ch1'].map((v) => (typeof v === 'string' ? { v, label: (RD[v].l ? RD[v].l + ' ' : '') + rdLabel(v) } : v)),
  intro: (v) => `${rdLabel(v)} as ${RD[v].dir === 'mix' ? 'a <b>mixed radical</b>' : 'an <b>entire radical</b>'}.${v === 'ch1' ? ' Then: rational or irrational?' : ''}`,
  make(stage, v, ex) {
    const e = RD[v], steps = e.dir === 'mix' ? simplifyMake(stage, e.spec, ex) : toEntireMake(stage, e.spec, ex);
    if (v === 'ch1') steps.push({ cap: '<b>Rational or irrational?</b> √2 is left over and 2 is not a perfect square, so √2 = 1.414… never ends or repeats. 11 × that is still <b>irrational</b>.', run: (c) => Promise.resolve() });
    return steps;
  }
};

/* ================= Challenge 2: the biggest square tile ================= */
const FIELD = { kit: [18, 12], ch2: [90, 75] };
const field = {
  title: 'The largest square that tiles the field: the GCF',
  height: 440,
  choices: [{ v: 'kit', label: '18 m × 12 m' }, { sep: 'Challenge 2(a) check:' }, { v: 'ch2', label: '90 m × 75 m' }],
  intro: (v) => `A ${FIELD[v][0]} m by ${FIELD[v][1]} m field is tiled with the <b>largest</b> identical squares, no strip left over. How big is each square?`,
  make(stage, v, ex) {
    const W = ex.W, [a, b] = FIELD[v], g = gcd(a, b), s = Math.min(540 / a, 360 / b), x0 = 96, y0 = 40;
    const rect = add(stage, h('div', 'u1l8-fld'), x0, y0); rect.style.width = a * s + 'px'; rect.style.height = b * s + 'px';
    const la = add(stage, h('div', 'u1l8-fl-l'), x0 + a * s / 2, y0 + b * s + 8); la.textContent = a + ' m';
    const lb = add(stage, h('div', 'u1l8-fl-l v'), x0 - 8, y0 + b * s / 2); lb.textContent = b + ' m';
    const panel = add(stage, h('div', 'u1l8-vn-panel'), 660, 40); panel.style.width = (W - 680) + 'px';
    const line = (cls, html) => { const e = h('div', 'u1l8-vn-line ' + cls, html); panel.appendChild(e); e.style.opacity = 0; return e; };
    const pa = primeFactors(a), pb = primeFactors(b);
    const ca = counts(pa), cb = counts(pb), sh = []; uniq(pa).forEach((p) => { for (let i = 0; i < Math.min(ca[p], cb[p] || 0); i++) sh.push(p); });
    const l1 = line('', `${b} = ${productHTML(pb)}`), l2 = line('', `${a} = ${productHTML(pa)}`), l3 = line('g', `<b>GCF</b> = ${productHTML(sh)} = <b>${g}</b>`);
    const l4 = line('', `${a} ÷ ${g} = <b>${a / g}</b> across<br>${b} ÷ ${g} = <b>${b / g}</b> down`), l5 = line('l', `<b>${(a / g) * (b / g)}</b> squares, ${g} m by ${g} m`);
    let big = g + 1; while (a % big && b % big) big++;            // the next size that fits one side
    const fits = a % big ? b : a, fails = a % big ? a : b;
    const l6 = line('x', `${big} m? ${fails} ÷ ${big} = ${decimal(fails / big)} ✗ leaves a strip`);
    const tiles = [];
    for (let j = 0; j < b / g; j++) for (let i = 0; i < a / g; i++) { const t = add(rect, h('span', 'u1l8-tile'), i * g * s, j * g * s); t.style.width = t.style.height = g * s + 'px'; t.style.opacity = 0; tiles.push(t); }
    return [
      { cap: `The field is ${a} m by ${b} m. A square tile must fit <b>exactly</b> along both sides, so its side must divide <b>both</b> ${a} and ${b}.`, run: (c) => c.pop(rect, 400) },
      { cap: `Factor both: ${b} = ${productHTML(pb)} and ${a} = ${productHTML(pa)}.`, run: (c) => Promise.all([c.fadeIn(l1, 300), c.fadeIn(l2, 300, { delay: 150 })]) },
      { cap: `The <b>largest</b> number that divides both is the GCF: the shared primes ${productHTML(sh)} = <b>${g}</b>.`, run: (c) => c.fadeIn(l3, 350) },
      { cap: `Tile with ${g} m squares: ${a / g} across and ${b / g} down, <b>${(a / g) * (b / g)}</b> squares and no strip left over ✓`,
        run: async (c) => { await Promise.all(tiles.map((t, i) => c.pop(t, 260, { delay: i * (c.fast ? 0 : 25) }))); await Promise.all([c.fadeIn(l4, 300), c.fadeIn(l5, 300)]); } },
      { cap: `A bigger square won’t work: ${big} m fits along ${fits} m, but ${fails} ÷ ${big} = ${decimal(fails / big)}, which leaves a strip. So <b>${g} m</b> is the largest.`, run: (c) => c.fadeIn(l6, 350) }
    ];
  }
};

/* ================= wiring ================= */
function mountAll() {
  const defs = { bedmas, bars, cancelDec, venn, sets, estimate, radicals, field };
  document.querySelectorAll('[data-explainer]').forEach((el) => { if (defs[el.dataset.explainer]) new Explainer(el, defs[el.dataset.explainer]); });
}
function mountWarmup() {
  document.querySelectorAll('.u1l8-card').forEach((b) => b.addEventListener('click', () => b.classList.toggle('out')));
}
function mountTable() {
  const host = document.getElementById('u1l8-ptable'); if (!host) return;
  const ns = Array.from({ length: 15 }, (_, i) => i + 1);
  [['n', 1, 15], ['n^2', 2, 15], ['n^3', 3, 10]].forEach(([l, e, upto], i) => {
    const r = h(i ? 'button' : 'div', 'u1l8-pt-row' + (i ? '' : ' head')); if (i) r.type = 'button';
    r.appendChild(h('span', 'u1l8-pt-l', tex(l)));
    ns.forEach((n) => r.appendChild(h('span', 'u1l8-pt-c', n <= upto ? fmt(n ** e) : '')));
    if (i) r.addEventListener('click', () => r.classList.toggle('on'));
    host.appendChild(r);
  });
}
function mountTree() {
  const host = document.getElementById('u1l8-tree'); if (!host) return;
  const ft = new FactorTree(host, { n: 90, style: 'plain' });
  document.querySelectorAll('[data-u1l8-tree]').forEach((b) => b.addEventListener('click', () => {
    document.querySelectorAll('[data-u1l8-tree]').forEach((x) => x.classList.toggle('on', x === b));
    ft.setN(Number(b.dataset.u1l8Tree));
  }));
}
function mountClassify() {
  document.querySelectorAll('tr[data-u1l8-row]').forEach((tr) => {
    tr.dataset.u1l8Row.split(' ').forEach((cell, j) => {
      const [t, bits] = cell.split('|');
      const th = h('td', 'u1l8-cn' + (j ? ' gap' : ''), tex(t)); tr.appendChild(th);
      [...bits].forEach((bit) => { const td = h('td'), b = h('button', 'u1l8-ck'); b.type = 'button'; if (bit === '1') b.dataset.ok = '1'; b.setAttribute('aria-label', 'tick'); b.addEventListener('click', () => b.classList.toggle('on')); td.appendChild(b); tr.appendChild(td); });
    });
  });
}
mountAll(); mountWarmup(); mountTable(); mountTree(); mountClassify();

/* ============ Stand Up Break! — unit review at the whiteboards (lessons/js/standup.js) ============
 * Beginning: integers and BEDMAS · Progressing: fractions, and GCF / LCM by primes · Mastery: radicals and estimating roots.
 * Numbers the booklet already uses (Lesson 8 examples and assignment) are left out. */
const suP = (n) => (n < 0 ? `(${n})` : String(n));
const suPM = (n) => (n < 0 ? `-${-n}` : `+${n}`);                 // "+ 3" or "- 3" after a term
const suLab8 = (i) => '\\text{(' + 'ab'[i] + ')}\\ ';
const suGrid8 = (items) => '\\def\\arraystretch{1.8}\\begin{array}{ll}' + items.map((x, j) => (j ? '\\hspace{2.5em}' : '') + suLab8(j) + '{' + x + '}').join(' & ') + '\\end{array}';
const suTwo8 = (A, B, text) => ({ text, q: suGrid8([A.t, B.t]), a: [A, B].flatMap((x, i) => x.w.map((l, j) => (j ? '\\phantom{\\text{(a)}\\ }' : suLab8(i)) + l)) });
const suNZ = (r, a, b) => { for (;;) { const v = r.int(a, b); if (v) return v; } };
const suFacTex = (n) => { const c = counts(primeFactors(n)); return Object.keys(c).map(Number).sort((x, y) => x - y).map((p) => (c[p] > 1 ? `${p}^{${c[p]}}` : String(p))).join('\\times '); };
/* integers and BEDMAS */
function suMulAdd(r) {
  const a = suNZ(r, -20, 20), b = r.int(2, 9), c = r.pick([-9, -8, -7, -6, -5, -4, -3, -2, 3, 4, 5, 6, 7]), sub = r.chance(0.4), bc = b * c, ans = sub ? a - bc : a + bc;
  return { t: `${a}${sub ? '-' : '+'}${b}\\times${suP(c)}`, w: [`=${a}${sub ? '-' : '+'}${suP(bc)}`, `=${ans}`] };
}
function suBracket(r) {
  for (;;) {
    const k = r.pick([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6]), x = r.int(1, 9), y = x - k, ds = [2, 3, 4, 5, 6, 8, 9].filter((d) => (k * k) % d === 0);
    if (!ds.length || y === 0) continue;
    const d = r.pick(ds) * r.sign(), e = suNZ(r, -9, 9), q1 = (k * k) / d;
    return { t: `(${x}-${suP(y)})^{2}\\div${suP(d)}${suPM(e)}`, w: [`=${suP(k)}^{2}\\div${suP(d)}${suPM(e)}`, `=${k * k}\\div${suP(d)}${suPM(e)}`, `=${q1}${suPM(e)}`, `=${q1 + e}`] };
  }
}
function suSquares(r) {
  const n = r.int(2, 9), m = r.int(2, 9), plus = r.chance(0.5);
  return { t: `-${n}^{2}${plus ? '+' : '-'}(-${m})^{2}`, w: [`=-${n * n}${plus ? '+' : '-'}${m * m}`, `=${plus ? -n * n + m * m : -n * n - m * m}`] };
}
/* fractions */
function suFrac(r) {
  const kind = r.pick(['add', 'sub', 'mul', 'div']);
  for (;;) {
    const q = r.int(2, 10), s = r.int(2, 10), p = r.int(1, q - 1), u = r.int(1, s - 1);
    if (gcd(p, q) > 1 || gcd(u, s) > 1) continue;
    if (kind === 'add' || kind === 'sub') {
      if (q === s || (kind === 'sub' && p * s <= u * q)) continue;
      const L = lcm(q, s), a1 = p * L / q, a2 = u * L / s, n = kind === 'add' ? a1 + a2 : a1 - a2, g = gcd(n, L);
      if ((p === 5 && q === 6 && u === 1 && s === 4) || (p === 2 && q === 3 && u === 1 && s === 4)) continue; // booklet's own
      const op = kind === 'add' ? '+' : '-';
      const w = [`=\\frac{${a1}}{${L}}${op}\\frac{${a2}}{${L}}`, `=\\frac{${n}}{${L}}`]; if (g > 1) w.push(`=\\frac{${n / g}}{${L / g}}`);
      return { t: `\\frac{${p}}{${q}}${op}\\frac{${u}}{${s}}`, w };
    }
    const [P, Qd] = kind === 'mul' ? [u, s] : [s, u];       // dividing: multiply by the reciprocal
    const N = p * P, D = q * Qd, g = gcd(N, D);
    if (g === 1 || (kind === 'mul' && p === 3 && q === 10)) continue;   // want something to cancel
    const w = kind === 'div' ? [`=\\frac{${p}}{${q}}\\times\\frac{${s}}{${u}}`] : [];
    w.push(`=\\frac{${N}}{${D}}`, `=\\frac{${N / g}}{${D / g}}`);
    return { t: `\\frac{${p}}{${q}}${kind === 'mul' ? '\\times' : '\\div'}\\frac{${u}}{${s}}`, w };
  }
}
const SU_NUMS = [12, 18, 20, 24, 28, 30, 36, 42, 45, 48, 50, 56, 63, 70, 80, 96, 100, 108, 120];
const SU_PAIRS_USED = ['40,60', '9,15', '75,90', '54,72', '6,16', '84,126', '12,18', '15,40'];
function suGcfLcm(r) {
  for (;;) {
    const a = r.pick(SU_NUMS), b = r.pick(SU_NUMS), g = gcd(a, b);
    if (a >= b || g < 4 || SU_PAIRS_USED.includes(a + ',' + b)) continue;
    const gcfQ = r.chance(0.5);
    if (!gcfQ && lcm(a, b) > 720) continue;
    return { t: `\\text{${gcfQ ? 'GCF' : 'LCM'} of }${a}\\text{ and }${b}`, w: [`${a}=${suFacTex(a)}`, `${b}=${suFacTex(b)}`, gcfQ ? `\\text{GCF}=${suFacTex(g)}${suFacTex(g) === String(g) ? '' : '=' + g}` : `\\text{LCM}=${suFacTex(lcm(a, b))}=${lcm(a, b)}`] };
  }
}
/* radicals and estimating */
const SU_RAD_USED = { 2: [80, 147, 242, 98, 180, 288, 75, 12, 20, 45, 150, 252, 30, 44, 27], 3: [135, 250, 54, 108, 56, 16, 24, 128, 192] };
function suSimplify(r) {
  for (;;) {
    const n = r.chance(0.6) ? 2 : 3, k = n === 2 ? r.int(2, 9) : r.int(2, 4), m = r.pick(n === 2 ? [2, 3, 5, 6, 7, 10, 11] : [2, 3, 4, 5, 6, 7, 9, 10]), N = k ** n * m;
    if (SU_RAD_USED[n].includes(N) || N > 500) continue;
    const R = (x) => (n === 2 ? `\\sqrt{${x}}` : `\\sqrt[3]{${x}}`);
    return { t: R(N) + '\\text{ (mixed)}', w: [`${R(N)}=${R(`${k ** n}\\times${m}`)}`, `=${k}${R(m)}`] };
  }
}
function suEntire(r) {
  for (;;) {
    const n = r.chance(0.5) ? 2 : 3, c = n === 2 ? r.int(2, 9) : r.int(2, 4), m = r.pick([2, 3, 5, 6, 7]), N = c ** n * m;
    if (SU_RAD_USED[n].includes(N)) continue;
    const R = (x) => (n === 2 ? `\\sqrt{${x}}` : `\\sqrt[3]{${x}}`);
    return { t: `${c}${R(m)}\\text{ (entire)}`, w: [`${c}${R(m)}=${R(`${c}^{${n}}\\times${m}`)}`, `=${R(`${c ** n}\\times${m}`)}=${R(N)}`] };
  }
}
function suEstimate(r) {
  for (;;) {
    const n = r.int(10, 150), a = Math.floor(Math.sqrt(n)), b = a + 1;
    if (a * a === n || [70, 75, 55, 130, 40, 12].includes(n)) continue;
    const A = a * a, B = b * b, best = Math.round(Math.sqrt(n) * 10) / 10, sq = Math.round(best * best * 100) / 100;
    if (best === b || best === a) continue;                                      // keep the estimate strictly between a and b
    return { t: `\\text{Estimate }\\sqrt{${n}}`, w: [`${A}<${n}<${B},\\ \\text{so }${a}<\\sqrt{${n}}<${b}`, `\\text{closer to }${n - A < B - n ? a : b}`, `\\sqrt{${n}}\\approx${best}`, `\\text{check: }${best}^{2}=${sq}`] };
  }
}
standup('u1l8', {
  intro: 'Unit 1 review at your whiteboard station. Show every step: the order of operations, the primes, the perfect squares and cubes.',
  levels: {
    BEG: (r) => { const [f, g] = r.shuffle([suMulAdd, suBracket, suSquares]); return suTwo8(f(r), g(r), 'Evaluate each expression. Show every step in order.'); },
    PRG: (r) => suTwo8(suFrac(r), suGcfLcm(r), '<b>(a)</b> Evaluate; give the answer in lowest terms. <b>(b)</b> Use prime factorization.'),
    MAS: (r) => suTwo8(suSimplify(r), r.chance(0.5) ? suEntire(r) : suEstimate(r), 'Write each in the form asked for, in simplest form. Estimates to one decimal place, no calculator.')
  }
});
