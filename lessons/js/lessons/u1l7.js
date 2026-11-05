/* Math 15 · Unit 1 · Lesson 7 — Simplifying Higher-Index Radicals. The explainers and widgets on this page.
 * Built from the Math 10C u1l8 page (same engine): most explainers share one picture, the "radical board": a big radical
 * sign with an outside zone (the coefficient) and an inside zone (the radicand), filled with factor chips. Chips are
 * sorted into groups the size of the index, full groups come out as one chip, coefficients go back in as n copies.
 * Every move is animated with FLIP (chips that stay slide) and ghosts (chips that merge or split fly to their new chip).
 * Classes are prefixed u1l7-. No calculator in this lesson (the Unit 1 test is no-calculator): checks are done by hand.
 */
import { h, fmt, Explainer, primeFactors, decimal } from '../explain.js';
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
    stage.classList.add('u1l7-rb-stage'); stage.style.setProperty('--cs', g.cs + 'px');
    this.top = add(stage, h('div', 'u1l7-rb-top'), 24, 12);
    this.out = add(stage, h('div', 'u1l7-rz u1l7-rz-out'), 16, g.top);
    this.out.style.width = Math.max(0, g.hx - 32) + 'px'; this.out.style.height = g.fh + 'px';
    if (g.hx < 80) this.out.style.display = 'none';
    const fh = g.fh;
    this.hook = add(stage, svgEl('svg', { class: 'u1l7-rb-hook', width: 80, height: fh, viewBox: `0 0 80 ${fh}` }), g.hx, g.top);
    this.hook.appendChild(svgEl('path', { d: `M4 ${fh * 0.6} L20 ${fh * 0.52} L44 ${fh - 5} L78 3` }));
    this.vinc = add(stage, h('div', 'u1l7-rb-vinc'), g.hx + 76, g.top + 1);
    this.idx = add(stage, h('div', 'u1l7-rb-idx'), g.hx + 18, g.top + fh * 0.5 - 6);
    const inX = g.hx + 90, inW = (g.inRight != null ? g.inRight : W - 22) - inX;
    this.inn = add(stage, h('div', 'u1l7-rz u1l7-rz-in'), inX, g.top + 14); this.inn.style.width = inW + 'px'; this.inn.style.height = (fh - 22) + 'px';
    const nb = g.notes || { x: 24, y: g.top + fh + 16, w: W - 48 };
    this.notes = add(stage, h('div', 'u1l7-rb-notes'), nb.x, nb.y); this.notes.style.width = nb.w + 'px';
  }
  setIdx(n, show = n !== 2) { this.idx.innerHTML = n; this.idx.style.opacity = show ? 1 : 0; this.idx.classList.toggle('faint', n === 2); }
  frame() { const b = this.stage.getBoundingClientRect(); this._k = b.width / (this.stage.offsetWidth || 1) || 1; this._b = { left: b.left + this.stage.clientLeft * this._k, top: b.top + this.stage.clientTop * this._k }; }
  rel(el) { const r = el.getBoundingClientRect(), k = this._k; return { x: (r.left - this._b.left) / k, y: (r.top - this._b.top) / k, w: r.width / k, h: r.height / k }; }
  chip(a, cls = '') { const e = h('div', 'u1l7-rc' + (cls ? ' ' + cls : ''), a.html); e.style.setProperty('--kc', a.color || INK); e._a = a; return e; }
  tray(els, full, color) { const t = h('div', 'u1l7-rtray' + (full ? ' full' : '')); if (color) t.style.setProperty('--kc', color); els.forEach((e) => t.appendChild(e)); return t; }
  items() { return [...this.stage.querySelectorAll('.u1l7-rz .u1l7-rc, .u1l7-rz .u1l7-rtray')]; }
  ghost(e, r) {
    const g = e.classList.contains('u1l7-rtray') ? e.cloneNode(false) : e.cloneNode(true);
    g.classList.add('u1l7-rghost'); g.style.left = r.x + 'px'; g.style.top = r.y + 'px'; g.style.width = r.w + 'px'; g.style.height = r.h + 'px'; g.style.opacity = 1; g.style.transform = 'none';
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
      else if (e.classList.contains('u1l7-rtray')) jobs.push(c.anim(e, [{ opacity: 0 }, { opacity: 1 }], 420, { delay: 120 }));
      else jobs.push(c.pop(e, 420, { delay: (o.popDelay || 0) + (pi++) * (o.stagger || 0) }));
    });
    if (Math.abs(vw - vw0) > 1) jobs.push(c.anim(this.vinc, [{ width: vw0 + 'px' }, { width: vw + 'px' }], ms));
    await Promise.all(jobs);
  }
  async note(c, latex, cls = '', replaceLast = false) { return this.noteHTML(c, tex(latex), cls, replaceLast); }
  async noteHTML(c, html, cls = '', replaceLast = false) {
    if (replaceLast && this.notes.lastChild) this.notes.lastChild.remove();
    const e = h('div', 'u1l7-rb-note' + (cls ? ' ' + cls : ''), html); this.notes.appendChild(e);
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
  if (R.r.c.p !== R.r.c.q || !R.rv.length) inEls.push(B.chip({ k: 'u1l7-rc', html: plainOrTex(qTex(R.r.c)), color: '#5a6372' }));
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

/* ================= 1. What a mixed radical means: little cubes ================= */
function cubeFaces(g, x, y, s, pal) { // front-bottom-left corner at (x, y), edge s, oblique depth like the booklet
  const dx = s * 0.5, dy = s * 0.32;
  g.appendChild(svgEl('polygon', { points: `${x},${y - s} ${x + dx},${y - s - dy} ${x + s + dx},${y - s - dy} ${x + s},${y - s}`, fill: pal.top, stroke: pal.edge }));
  g.appendChild(svgEl('polygon', { points: `${x + s},${y} ${x + s + dx},${y - dy} ${x + s + dx},${y - s - dy} ${x + s},${y - s}`, fill: pal.side, stroke: pal.edge }));
  g.appendChild(svgEl('rect', { x, y: y - s, width: s, height: s, fill: pal.front, stroke: pal.edge }));
}
const SUGAR = { front: '#fafaf4', top: '#ffecb3', side: '#f2d68c', edge: '#c88c14' };
const BLUE = { front: '#eaf2fd', top: '#cfe0f7', side: '#a9c4ea', edge: '#3b78d8' };
function stackSVG(k, s, pal = SUGAR) { // a k×k×k stack, as an <svg> element
  const dx = s * 0.5, dy = s * 0.32, W = k * (s + dx) + 4, H = k * (s + dy) + 4;
  const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H, class: 'u1l7-stack-svg' });
  for (let j = k - 1; j >= 0; j--) for (let z = 0; z < k; z++) for (let i = 0; i < k; i++) { const g = svgEl('g'); cubeFaces(g, 2 + i * s + j * dx, H - 2 - z * s - j * dy, s, pal); svg.appendChild(g); }
  return svg;
}

const CM = { m24: [2, 3], m88: [2, 11], m40: [2, 5], m162: [3, 6], m500: [5, 4] };
const cubeMeaning = {
  title: 'What does a mixed radical mean? Build it from little cubes',
  height: 440,
  choices: [{ v: 'm24', label: tex('\\sqrt[3]{24}') }, { v: 'm88', label: tex('\\sqrt[3]{88}') }, { sep: 'Example 2 check:' }, { v: 'm40', label: tex('\\sqrt[3]{40}') }, { v: 'm162', label: tex('\\sqrt[3]{162}') }, { v: 'm500', label: tex('\\sqrt[3]{500}') }],
  intro: (v) => { const [k, r] = CM[v]; return `A giant cube holds <b>${k ** 3 * r}</b> normal dice. How long is its edge? Build it from little cubes that each hold <b>${r}</b> dice.`; },
  make(stage, v, ex) {
    const [k, r] = CM[v], N = k ** 3 * r, W = ex.W, H = 440;
    const s = Math.min(62, 340 / (1.5 * k), 300 / (1.32 * k)), dx = s * 0.5, dy = s * 0.32;
    const midL = 250, midR = W - 330, bw = k * (s + dx), bh = k * (s + dy);
    const ox = midL + (midR - midL - bw) / 2, oy = 40 + bh + (330 - bh) / 2;
    const svg = add(stage, svgEl('svg', { class: 'u1l7-cm-svg', width: W, height: H, viewBox: `0 0 ${W} ${H}` }), 0, 0);
    // the little cube on the left
    const ls = 70, lx = 70, ly = 200;
    const little = svgEl('g'); cubeFaces(little, lx, ly, ls, BLUE); svg.appendChild(little); little.style.opacity = 0;
    const lt = svgEl('text', { x: lx + ls / 2, y: ly - ls / 2 + 9, class: 'u1l7-cm-in' }); lt.textContent = r; little.appendChild(lt);
    const lab = add(stage, h('div', 'u1l7-cm-lab', `little cube<br><b>volume ${r}</b><br>edge ${tex(`\\sqrt[3]{${r}}\\approx${(r ** (1 / 3)).toFixed(2)}`)}`), lx + ls * 0.75, ly + 22); lab.style.translate = '-50% 0'; lab.style.opacity = 0;
    // the big cube, drawn back to front so nearer cubes cover farther ones
    const cubes = [];
    for (let j = k - 1; j >= 0; j--) for (let z = 0; z < k; z++) for (let i = 0; i < k; i++) {
      const g = svgEl('g', { class: 'u1l7-cm-c' }); cubeFaces(g, ox + i * s + j * dx, oy - z * s - j * dy, s, BLUE); svg.appendChild(g); g.style.opacity = 0; cubes.push({ g, i, j, z });
    }
    // edge brace under the front bottom edge
    const brace = svgEl('g', { class: 'u1l7-cm-brace' }); brace.style.opacity = 0; svg.appendChild(brace);
    const by = oy + 14;
    brace.appendChild(svgEl('path', { d: `M${ox} ${by} v8 H${ox + k * s} v-8` }));
    for (let i = 1; i < k; i++) brace.appendChild(svgEl('path', { d: `M${ox + i * s} ${by} v8`, class: 'tick' }));
    const edgeLab = add(stage, h('div', 'u1l7-cm-edge'), ox + k * s / 2, by + 16); edgeLab.style.translate = '-50% 0'; edgeLab.style.opacity = 0;
    const panel = add(stage, h('div', 'u1l7-cm-panel'), W - 300, 30); panel.style.width = '280px';
    const line = (c, latex, cls = '') => { const e = h('div', 'u1l7-cm-line ' + cls, tex(latex)); panel.appendChild(e); return c.fadeIn(e, 380); };
    const show = (c, list, gap) => Promise.all(list.map((q, t) => c.anim(q.g, [{ opacity: 0, transform: 'translateY(-26px)' }, { opacity: 1, transform: 'none' }], 420, { delay: t * gap })));
    const row = cubes.filter((q) => q.j === 0 && q.z === 0), layer = cubes.filter((q) => q.z === 0 && q.j > 0), rest = cubes.filter((q) => q.z > 0);
    rest.sort((a, b) => a.z - b.z || b.j - a.j || a.i - b.i);
    const L = k ** 2;
    return [
      { cap: `This little cube has <b>volume ${r}</b> (it holds ${r} dice). Its edge is ${tex(`\\sqrt[3]{${r}}\\approx${(r ** (1 / 3)).toFixed(2)}`)}, because ${(r ** (1 / 3)).toFixed(2)} × ${(r ** (1 / 3)).toFixed(2)} × ${(r ** (1 / 3)).toFixed(2)} ≈ ${r}.`,
        run: async (c) => { await Promise.all([c.anim(little, [{ opacity: 0, transform: 'scale(.6)' }, { opacity: 1, transform: 'none' }], 450), c.fadeIn(lab, 400, { delay: 200 }), line(c, `\\text{little cube: }V=${r},\\ e=\\sqrt[3]{${r}}`)]); } },
      { cap: `Line up <b>${k}</b> little cubes in a row.`, run: (c) => show(c, row, 120) },
      { cap: `<b>${k} rows</b> make a layer: ${k} × ${k} = <b>${L}</b> little cubes.`, run: (c) => show(c, layer, 50) },
      { cap: `<b>${k} layers</b> make a big cube: ${k} × ${k} × ${k} = <b>${k ** 3}</b> little cubes. ${k ** 3} is a <b>perfect cube</b>.`,
        run: async (c) => { await show(c, rest, k > 3 ? 12 : 40); await line(c, `${k}\\times${k}\\times${k}=${k ** 3}\\text{ little cubes}`); } },
      { cap: `The big cube’s volume is ${k ** 3} × ${r} = <b>${N}</b>. A cube with volume ${N} has edge <b>${tex(`\\sqrt[3]{${N}}`)}</b>.`,
        run: async (c) => { edgeLab.innerHTML = 'edge = ' + tex(`\\sqrt[3]{${N}}`); await Promise.all([c.fadeIn(brace, 400), c.fadeIn(edgeLab, 400), line(c, `V=${k ** 3}\\times${r}=${N}`), line(c, `e=\\sqrt[3]{${N}}`)]); } },
      { cap: `But the edge is also <b>${k} little edges</b> laid end to end: ${k} × ${tex(`\\sqrt[3]{${r}}`)} = <b>${tex(`${k}\\sqrt[3]{${r}}`)}</b>. Same edge, two names: ${tex(`\\sqrt[3]{${N}}=${k}\\sqrt[3]{${r}}\\approx${(N ** (1 / 3)).toFixed(2)}`)}.`,
        run: async (c) => {
          edgeLab.innerHTML = 'edge = ' + tex(`\\sqrt[3]{${N}}=${green(`${k}\\sqrt[3]{${r}}`)}`);
          const ticks = [...brace.querySelectorAll('.tick')];
          await Promise.all([c.fadeIn(edgeLab, 300), ...ticks.map((t, i) => c.anim(t, [{ strokeWidth: 3 }, { strokeWidth: 7 }, { strokeWidth: 3 }], 500, { delay: i * 120 })), line(c, `\\sqrt[3]{${N}}=\\sqrt[3]{${k ** 3}\\times${r}}=${green(`${k}\\sqrt[3]{${r}}`)}`, 'final')]);
        } }
    ];
  }
};

/* ================= 1. Find the largest perfect power ================= */
const FS = { f88: [3, 88], f192: [3, 192], f40: [3, 40], f162: [3, 162], f500: [3, 500], f4_32: [4, 32], f4_112: [4, 112], f5_96: [5, 96], f5_224: [5, 224] };
const finder = {
  title: 'Find the largest perfect cube (or nth power) that divides',
  height: 500,
  choices: [{ v: 'f88', label: tex('\\sqrt[3]{88}') }, { v: 'f192', label: tex('\\sqrt[3]{192}') }, { sep: 'Example 2 check:' }, { v: 'f40', label: tex('\\sqrt[3]{40}') }, { v: 'f162', label: tex('\\sqrt[3]{162}') }, { v: 'f500', label: tex('\\sqrt[3]{500}') }],
  intro: (v) => { const [n, cv] = FS[v]; return `Simplify ${tex(rt(n, tn(cv)))}: test the perfect ${POWER[n]}s ${n === 3 ? '8, 27, 64, …' : n === 4 ? '16, 81, 256, …' : '32, 243, 1 024, …'} in order. Keep the <b>largest</b> one that divides evenly.`; },
  make(stage, v, ex) {
    const [n, cv] = FS[v], N = Math.abs(cv), neg = cv < 0, W = ex.W;
    const pows = []; for (let b = 2; ; b++) { pows.push({ b, p: b ** n }); if (b ** n > N) break; }
    add(stage, h('div', 'u1l7-fd-q', `${tex(rt(n, tn(cv)))} <span>Which perfect ${POWER[n]}s divide <b>${fmt(N)}</b>?</span>`), 24, 14);
    const row = add(stage, h('div', 'u1l7-fd-row'), 24, 82); row.style.width = (W - 48) + 'px';
    const chips = pows.map((q) => { const e = h('div', 'u1l7-fd-chip', `<b>${fmt(q.p)}</b><small>${tex(pw(q.b, n))}</small>`); row.appendChild(e); return e; });
    const lines = add(stage, h('div', 'u1l7-fd-lines'), 24, 186); lines.style.width = (W * 0.56) + 'px';
    const best = add(stage, h('div', 'u1l7-fd-best', '<div class="u1l7-fd-h">Largest so far</div><div class="u1l7-fd-v muted">none yet</div>'), W * 0.62, 186); best.style.width = (W * 0.38 - 24) + 'px';
    const res = add(stage, h('div', 'u1l7-fd-res'), 24, 412); res.style.width = (W - 48) + 'px';
    const steps = [];
    const addLine = (c, html, delay = 0) => { const e = h('div', 'u1l7-fd-line', html); lines.appendChild(e); while (lines.children.length > 6) lines.firstChild.remove(); return c.fadeIn(e, 300, { delay, from: 'translateX(-10px)' }); };
    if (neg) steps.push({
      cap: `The index is <b>odd</b>, so the − can come out first: ${tex(`\\sqrt[3]{-${N}}=-\\sqrt[3]{${N}}`)}. Now look for perfect cubes in <b>${N}</b>.`,
      run: (c) => addLine(c, `${tex(`\\sqrt[3]{-${N}}=-\\sqrt[3]{${N}}`)}`)
    });
    // group the tests: each success is its own step; runs of failures share a step; the first power past N is "stop"
    const tests = pows.filter((q) => q.p <= N), stop = pows[pows.length - 1];
    let groups = [], run = [];
    tests.forEach((q) => { if (N % q.p === 0) { if (run.length) groups.push(run); run = []; groups.push([q]); } else run.push(q); });
    if (run.length) groups.push(run);
    let bestQ = null; const wins = [];
    groups.forEach((g, gi) => {
      const ok = N % g[0].p === 0, last = gi === groups.length - 1;
      if (ok) wins.push(g[0]);
      const capOk = () => `${fmt(N)} ÷ ${fmt(g[0].p)} = <b>${fmt(N / g[0].p)}</b>, a whole number, so <b>${fmt(g[0].p)}</b> divides ${fmt(N)}. ${bestQ && bestQ !== g[0] ? 'It’s bigger than the last one, so it’s our new largest.' : ''}`;
      const capNo = `${g.map((q) => fmt(q.p)).join(g.length > 2 ? ', ' : ' and ')} ${g.length > 1 ? 'don’t' : 'doesn’t'} divide evenly into ${fmt(N)}.`;
      const capStop = last ? ` Next is ${fmt(stop.p)}, which is bigger than ${fmt(N)}: <b>stop</b>.` : '';
      steps.push({
        cap: ok ? () => capOk() + capStop : capNo + capStop,
        run: async (c) => {
          const jobs = [];
          g.forEach((q, t) => {
            const e = chips[pows.indexOf(q)];
            e.classList.add(ok ? 'yes' : 'no');
            jobs.push(c.anim(e, [{ transform: 'scale(1)' }, { transform: 'scale(1.15)' }, { transform: 'scale(1)' }], 380, { delay: t * 160 }));
            jobs.push(addLine(c, `${fmt(N)} ÷ ${fmt(q.p)} = <b class="${ok ? 'ok' : ''}">${ok ? fmt(N / q.p) : decimal(N / q.p)}</b> ${ok ? '<b class="ok">✓</b>' : '<b class="red">✗</b>'}`, t * 160));
          });
          if (ok) {
            chips.forEach((e) => e.classList.remove('best')); chips[pows.indexOf(g[0])].classList.add('best'); bestQ = g[0];
            best.innerHTML = `<div class="u1l7-fd-h">Largest so far</div><div class="u1l7-fd-v">${fmt(g[0].p)} = ${tex(pw(g[0].b, n))}</div><div class="muted">${fmt(N)} = ${fmt(g[0].p)} × ${fmt(N / g[0].p)}</div>`;
            jobs.push(c.fadeIn(best, 350));
          }
          if (last) { const e = chips[chips.length - 1]; e.classList.add('stop'); jobs.push(c.anim(e, [{ opacity: 1 }, { opacity: 0.35 }], 400, { delay: 300 })); }
          await Promise.all(jobs);
        }
      });
    });
    const bq = wins[wins.length - 1], sgn = neg ? '-' : '';
    if (bq) {
      const rest = N / bq.p, mixed = rest === 1 ? `${sgn}${bq.b}` : `${sgn}${bq.b}${rt(n, rest)}`;
      steps.push({
        cap: `The largest is <b>${fmt(bq.p)} = ${tex(pw(bq.b, n))}</b>. Split the root: ${tex(`${rt(n, tn(cv))}=${sgn}${rt(n, tn(bq.p) + '\\times' + rest)}=${sgn}${rt(n, tn(bq.p))}\\times${rt(n, rest)}=${mixed}`)}.`,
        run: async (c) => { res.innerHTML = tex(`${rt(n, tn(cv))}=${sgn}${rt(n, tn(bq.p) + '\\times ' + rest)}=${green(mixed)}`); await c.fadeIn(res, 450); }
      });
      if (wins.length > 1) {
        const w0 = wins[0], r0 = N / w0.p;
        steps.push({
          cap: `Careful: ${fmt(w0.p)} also divides ${fmt(N)}, but ${tex(`${sgn}${w0.b}${rt(n, tn(r0))}`)} is <b>not simplest form</b>: ${fmt(r0)} still has a perfect ${POWER[n]} inside. Always pull out the <b>largest</b>.`,
          run: async (c) => { const e = h('div', 'u1l7-fd-warn', `${tex(`${sgn}${w0.b}${rt(n, tn(r0))}`)} <b class="red">✗ not simplest</b>`); res.appendChild(e); await c.fadeIn(e, 350); }
        });
      }
    } else steps.push({ cap: `No perfect ${POWER[n]} divides ${fmt(N)}, so ${tex(rt(n, tn(cv)))} is already in simplest form.`, run: async (c) => { res.innerHTML = tex(rt(n, tn(cv)) + '\\text{ is in simplest form}'); await c.fadeIn(res, 400); } });
    return steps;
  }
};

/* ================= 1. Prime factors in groups of three ================= */
const GS = { g24: { n: 3, c: 24 }, g88: { n: 3, c: 88 }, g192: { n: 3, c: 192 }, g40: { n: 3, c: 40 }, g162: { n: 3, c: 162 }, g500: { n: 3, c: 500 } };
const groups = {
  title: 'Groups of three: simplify a cube root with prime factors',
  height: 470,
  choices: [{ v: 'g24', label: tex('\\sqrt[3]{24}') }, { v: 'g88', label: tex('\\sqrt[3]{88}') }, { v: 'g192', label: tex('\\sqrt[3]{192}') }, { sep: 'Example 2 check:' }, { v: 'g40', label: tex('\\sqrt[3]{40}') }, { v: 'g162', label: tex('\\sqrt[3]{162}') }, { v: 'g500', label: tex('\\sqrt[3]{500}') }],
  custom: [2, 9999],
  intro: (v) => { const s = typeof v === 'number' ? { n: 3, c: v } : GS[v]; return `Simplify ${tex(rt(s.n, tn(s.c)))}. The index is <b>${s.n}</b>, so we look for <b>groups of ${word(s.n)}</b> identical prime factors.`; },
  make(stage, v, ex) { return simplifyMake(stage, typeof v === 'number' ? { n: 3, c: v } : GS[v], ex); }
};

/* ================= 1. Same number, different index ================= */
const SN = { s144: { N: 144, idx: [2, 3, 4, 5] }, s512: { N: 512, idx: [2, 3, 4, 5] }, s1296: { N: 1296, idx: [2, 3, 4, 5] } };
const sameNumber = {
  title: 'Same number, different index: the index is the group size',
  height: 360,
  choices: [{ v: 's144', label: '144' }, { v: 's512', label: '512' }, { v: 's1296', label: fmt(1296) }],
  intro: (v) => `Take roots of <b>${fmt(SN[v].N)}</b> with index ${SN[v].idx.join(', ')}. Watch how the <b>group size</b> changes what comes out.`,
  make(stage, v, ex) {
    const { N, idx } = SN[v], W = ex.W, ps = primeFactors(N);
    const B = new RadBoard(stage, W, { hx: 24, cs: 48, top: 66, fh: 190, inRight: W * 0.62, notes: { x: W * 0.645, y: 66, w: W * 0.355 - 20 }, maxNotes: 6 });
    B.notes.classList.add('side');
    B.setIdx(2, false); B.top.innerHTML = tex(`${tn(N)} = ${[...new Set(ps)].map((p) => pw(p, ps.filter((x) => x === p).length)).join('\\times ')}`);
    let start = B.chip(bigAtom(String(N)), 'big'); B.inn.appendChild(start); B.syncVinc();
    let atoms = [];
    const steps = [{
      cap: `Break ${fmt(N)} into prime factors: ${fmt(N)} = ${ps.join(' × ')}.`,
      run: async (c) => { await B.morph(c, () => { start.remove(); atoms = ps.map((p) => B.chip(numAtom(p))); B.inn.append(...atoms); return atoms.map((a) => [start, a]); }, { flyStagger: 30 }); }
    }];
    idx.forEach((n) => {
      const S = analyse({ n, c: N }), outF = outList(S), inF = inList(S);
      const outTxt = outF.length ? (outF.length > 1 ? `${outF.join(' × ')} = <b>${S.outC}</b>` : `<b>${outF[0]}</b>`) + ' comes out' : '<b>nothing</b> comes out';
      const inTxt = inF.length ? (inF.length > 1 ? `${inF.join(' × ')} = <b>${S.inC}</b>` : `<b>${inF[0]}</b>`) + ' stays inside' : '<b>nothing</b> is left inside';
      steps.push({
        cap: `<b>Index ${n}</b>${n === 2 ? ' (a square root: the little 2 is usually not written)' : ''}: groups of <b>${word(n)}</b>. ${S.groups ? `${word(S.groups)[0].toUpperCase() + word(S.groups).slice(1)} full group${S.groups > 1 ? 's' : ''}: ${outTxt}; ${inTxt}.` : 'No full group, so nothing comes out.'} ${tex(rt(n, tn(N)) + '=' + S.result)}`,
        run: async (c) => {
          B.setIdx(n, true);
          const jobs = [c.pop(B.idx, 380)];
          await Promise.all(jobs);
          await B.morph(c, () => {
            const by = {}; atoms.forEach((e) => (by[e._a.k] = by[e._a.k] || []).push(e));
            const trays = [], left = [];
            S.keys.forEach((k) => { const els = by[k], q = Math.floor(els.length / n); for (let i = 0; i < q; i++) trays.push(B.tray(els.slice(i * n, i * n + n), true, S.atom[k].color)); left.push(...els.slice(q * n)); });
            B.inn.replaceChildren(...trays, ...left);
          });
          await B.note(c, `${rt(n, tn(N))} = ${S.result}`, S.hasIn ? '' : 'whole');
        }
      });
    });
    steps.push({ cap: 'A bigger index needs <b>bigger groups</b>, so less comes out. When every factor fits into full groups, the root is a <b>whole number</b> (a perfect power).', run: async (c) => { await Promise.all([...B.notes.querySelectorAll('.whole')].map((e) => c.anim(e, [{ transform: 'scale(1)' }, { transform: 'scale(1.08)' }, { transform: 'scale(1)' }], 500))); } });
    return steps;
  }
};

/* ================= 2. Mixed → entire ================= */
const revLabel = (s) => tex(qTerm(s.k.c, s.k.vars || []) + rt(s.n, qTerm(s.r.c, s.r.vars || [])));
const TE = {
  e37: { n: 3, k: { c: Q(3) }, r: { c: Q(7) } },
  e211: { n: 3, k: { c: Q(2) }, r: { c: Q(11) } },
  e3a: { n: 3, k: { c: Q(2) }, r: { c: Q(9) } },
  e3b: { n: 3, k: { c: Q(4) }, r: { c: Q(2) } },
  e3c: { n: 3, k: { c: Q(-2) }, r: { c: Q(6) } }
};
const toEntire = {
  title: 'Mixed → entire: the coefficient goes back in',
  height: 470,
  minW: 820, // drawn this wide and scaled to fit
  choices: [{ v: 'e37', label: revLabel(TE.e37) }, { v: 'e211', label: revLabel(TE.e211) }, { sep: 'Example 3 check:' }, { v: 'e3a', label: revLabel(TE.e3a) }, { v: 'e3b', label: revLabel(TE.e3b) }, { v: 'e3c', label: revLabel(TE.e3c) }],
  intro: (v) => `Write ${revLabel(TE[v])} as an <b>entire radical</b>: everything under one root.`,
  make(stage, v, ex) { return toEntireMake(stage, TE[v], ex); }
};

/* ================= 2. Powers of a negative: the sign flip-flop ================= */
const signs = {
  title: 'Powers of a negative number flip-flop',
  height: 410,
  choices: [{ v: -2, label: '−2' }, { v: -3, label: '−3' }, { v: -5, label: '−5' }],
  intro: (b) => `Multiply <b>${String(b).replace('-', '−')}</b> by itself again and again. Where does each answer land: the <b>negative</b> side or the <b>positive</b> side?`,
  make(stage, b, ex) {
    const W = ex.W, bx = W * 0.47, bw = (W - bx - 40) / 2;
    const bins = ['neg', 'pos'].map((s, i) => { const e = add(stage, h('div', 'u1l7-sg-bin ' + s, `<div class="u1l7-sg-h">${s === 'neg' ? 'Negative' : 'Positive'}</div><div class="u1l7-sg-list"></div>`), bx + i * (bw + 16), 20); e.style.width = bw + 'px'; e.style.height = '262px'; return e; });
    const rows = [], base = `(${tn(b)})`;
    for (let e = 1; e <= 5; e++) {
      const v = b ** e, r = add(stage, h('div', 'u1l7-sg-row', `${tex(`${base}^{${e}}`)} <span class="u1l7-sg-eq">${tex('=' + tn(v))}</span> <span class="u1l7-sg-tag ${e % 2 ? 'odd' : 'even'}">${e % 2 ? 'odd' : 'even'}</span>`), 24, 18 + (e - 1) * 52);
      r.style.opacity = 0; rows.push({ r, v, e });
    }
    const concl = add(stage, h('div', 'u1l7-sg-concl'), 24, 296); concl.style.width = (W - 48) + 'px';
    const steps = rows.map(({ r, v, e }) => ({
      cap: e === 1 ? `${tex(`${base}^{1}=${tn(v)}`)}: just the number itself. It’s <b>negative</b>.`
        : `Multiply by ${tn(b).replace('-', '−')} again: ${tex(`${pw(base, e)}=${tn(b ** (e - 1))}\\times(${tn(b)})=${tn(v)}`)}. ${v < 0 ? 'Negative' : 'Positive'} — the sign <b>flips</b> every time.`,
      run: async (c) => {
        await c.fadeIn(r, 350, { from: 'translateX(-14px)' });
        const chip = h('div', 'u1l7-sg-chip ' + (v < 0 ? 'neg' : 'pos'), `${tex(`${base}^{${e}}`)} <b>${fmt(v).replace('-', '−')}</b>`);
        bins[v < 0 ? 0 : 1].querySelector('.u1l7-sg-list').appendChild(chip);
        if (!c.fast) {
          const sb = stage.getBoundingClientRect(), k = sb.width / stage.offsetWidth, a = r.querySelector('.u1l7-sg-eq').getBoundingClientRect(), z = chip.getBoundingClientRect();
          await c.anim(chip, [{ transform: `translate(${(a.left - z.left) / k}px, ${(a.top - z.top) / k}px)`, opacity: 0.3 }, { transform: 'none', opacity: 1 }], 600);
        }
      }
    }));
    const odd = (e) => rows.filter((q) => q.e % 2 === e);
    steps.push({
      cap: `<b>Odd</b> powers of a negative are <b>negative</b>. <b>Even</b> powers are <b>positive</b>.`,
      run: (c) => Promise.all([...odd(1).map((q) => q.r.classList.add('hl-odd')), ...odd(0).map((q) => q.r.classList.add('hl-even'))].concat(rows.map((q, i) => c.anim(q.r, [{ transform: 'scale(1)' }, { transform: 'scale(1.06)' }, { transform: 'scale(1)' }], 400, { delay: i * 90 }))))
    });
    const b3 = b ** 3, b4 = Math.abs(b) ** 4;
    steps.push({
      cap: `So an <b>odd</b> root of a negative works: ${tex(`\\sqrt[3]{${tn(b3)}}=${tn(b)}`)} because ${tex(`(${tn(b)})^3=${tn(b3)}`)}. With an odd index the − can move <b>in and out</b> freely.`,
      run: async (c) => { const e = h('div', 'u1l7-sg-c ok', `${tex(`\\sqrt[3]{${tn(b3)}}=${tn(b)}`)} <span class="u1l7-sg-lbl">✓ real</span>`); concl.appendChild(e); await c.fadeIn(e, 400); }
    });
    steps.push({
      cap: `But an even power is never negative: ${tex(`(${tn(b)})^4=${tn(b4)}`)} and ${tex(`${tn(-b)}^4=${tn(b4)}`)}. So ${tex(`\\sqrt[4]{${tn(-b4)}}`)} is <b>not a real number</b>, and with an even index a negative coefficient must <b>stay outside</b>.`,
      run: async (c) => { const e = h('div', 'u1l7-sg-c no', `${tex(`\\sqrt[4]{${tn(-b4)}}=\\ ?`)} <span class="u1l7-sg-stamp">NOT REAL</span>`); concl.appendChild(e); await c.fadeIn(e, 300); await c.anim(e.querySelector('.u1l7-sg-stamp'), [{ opacity: 0, transform: 'scale(1.8) rotate(-12deg)' }, { opacity: 1, transform: 'rotate(-5deg)' }], 420, { easing: 'cubic-bezier(.2,1.4,.4,1)' }); }
    });
    return steps;
  }
};

/* ================= §5 and Example 4: index 4 and 5, and both directions ================= */
const finderN = Object.assign({}, finder, {
  title: 'Index 4 or 5: hunt through a different list',
  choices: [{ v: 'f4_32', label: tex('\\sqrt[4]{32}') }, { v: 'f5_96', label: tex('\\sqrt[5]{96}') }, { v: 'f4_112', label: tex('\\sqrt[4]{112}') }, { v: 'f5_224', label: tex('\\sqrt[5]{224}') }]
});
const E4 = {
  a: { dir: 'mix', spec: { n: 3, c: 320 } },
  b: { dir: 'ent', spec: { n: 3, k: { c: Q(3) }, r: { c: Q(13) } } },
  c: { dir: 'mix', spec: { n: 4, c: 243 } },
  d: { dir: 'ent', spec: { n: 3, k: { c: Q(-3) }, r: { c: Q(10) } } }
};
const e4Label = (v) => { const e = E4[v]; return e.dir === 'mix' ? tex(rt(e.spec.n, tn(e.spec.c))) : revLabel(e.spec); };
const ex4check = {
  title: 'Example 4 check: read the request, then go that way',
  height: 470,
  minW: 820,
  choices: ['a', 'b', 'c', 'd'].map((v) => ({ v, label: `(${v}) ` + e4Label(v) })),
  intro: (v) => `(${v}) ${e4Label(v)} as a <b>${E4[v].dir === 'mix' ? 'mixed' : 'entire'} radical</b>. ${E4[v].dir === 'mix' ? 'Pull out the largest perfect ' + POWER[E4[v].spec.n] + '.' : 'Send the coefficient back in as its ' + POWER[E4[v].spec.n] + '.'}`,
  make(stage, v, ex) { return E4[v].dir === 'mix' ? simplifyMake(stage, E4[v].spec, ex) : toEntireMake(stage, E4[v].spec, ex); }
};

/* ================= §1 The parts of a radical, and Example 1: entire or mixed? ================= */
const AN = {
  r24: { c: 1, n: 3, r: 24, read: 'the cube root of 24' },
  m23: { c: 2, n: 3, r: 3, read: '2 times the cube root of 3' },
  s7: { c: 1, n: 2, r: 7, read: 'the square root of 7' }
};
const EX1 = [
  { c: 1, r: 20, why: 'One number sits <b>alone</b> under the root sign' },
  { c: 4, r: 3, why: 'The coefficient <b>4</b> multiplies from outside' },
  { c: 1, r: 9, why: 'Nothing outside the root sign' },
  { c: -5, r: 2, why: 'The coefficient <b>−5</b> sits outside (a negative coefficient still counts)' }
];
const radT = (c, n, r) => (c === 1 ? '' : c === -1 ? '-' : tn(c)) + rt(n, tn(r));
const anatomy = {
  title: 'Reading a radical: index, radicand, coefficient',
  height: 380,
  choices: [{ v: 'r24', label: tex('\\sqrt[3]{24}') }, { v: 'm23', label: tex('2\\sqrt[3]{3}') }, { v: 's7', label: tex('\\sqrt{7}') }, { sep: 'Example 1 check:' }, { v: 'ex1', label: 'Sort (a)–(d)' }],
  intro: (v) => (v === 'ex1' ? 'Example 1: is each radical <b>entire</b> or <b>mixed</b>? Look outside the root sign.' : `Name every part of ${tex(radT(AN[v].c, AN[v].n, AN[v].r))}.`),
  make(stage, v, ex) { return v === 'ex1' ? sortMake(stage, ex) : partsMake(stage, AN[v], ex); }
};
function partsMake(stage, A, ex) {
  const W = ex.W, B = new RadBoard(stage, W, { hx: 330, top: 70, fh: 210, cs: 52, notes: { x: 24, y: 330, w: W - 48 }, maxNotes: 1, inRight: 680 });
  B.top.innerHTML = '';
  B.setIdx(A.n, A.n !== 2);
  const big = (t) => B.chip(bigAtom(t), 'big u1l7-an-big');
  const rad = big(String(A.r)); B.inn.appendChild(rad);
  let coef = null; if (A.c !== 1) { coef = big(tn(A.c)); B.out.appendChild(coef); }
  B.syncVinc();
  const T = radT(A.c, A.n, A.r), mixed = A.c !== 1;
  const tag = (txt, cls) => { const e = add(stage, h('div', 'u1l7-an-tag ' + cls, txt), 0, 0); e.style.opacity = 0; return e; };
  const tIdx = tag(A.n === 2 ? 'index 2 (hidden)' : 'index', A.c !== 1 ? 'dn' : 'lf'), tRad = tag('radicand', 'up'), tCo = tag('coefficient', 'up');
  const place = (t, el, below) => { B.frame(); const r = B.rel(el); if (t.classList.contains('lf')) { t.style.left = (r.x - 16) + 'px'; t.style.top = (r.y + r.h / 2) + 'px'; return; } t.style.left = (r.x + r.w / 2) + 'px'; t.style.top = (below ? r.y + r.h + 14 : r.y - 14) + 'px'; };
  const verdict = add(stage, h('div', 'u1l7-an-verdict ' + (mixed ? 'mixed' : 'entire'), mixed ? 'MIXED radical' : 'ENTIRE radical'), W - 290, 140); verdict.style.opacity = 0;
  const powW = A.n === 3 ? 'cubed' : 'squared';
  return [
    { cap: `Read ${tex(T)} out loud: “${A.read}”.`, run: (c) => Promise.all([B.pulse(c, rad), B.noteHTML(c, `${tex(T)} means “${A.read}”`)]) },
    { cap: A.n === 2 ? `No small number in the hook? Then it’s a <b>square root</b>: the index <b>2</b> is hidden. ${tex('\\sqrt{7}')} means ${tex('\\sqrt[2]{7}')}.`
        : `The small number in the hook is the <b>index</b>. Index <b>3</b> means a <b>cube root</b>: what number, ${powW}, gives the radicand?`,
      run: async (c) => { if (A.n === 2) { B.setIdx(2, true); B.idx.classList.add('faint'); await c.pop(B.idx, 380); } place(tIdx, B.idx, false); await c.fadeIn(tIdx, 350); } },
    { cap: `The number under the root sign is the <b>radicand</b>: <b>${A.r}</b>.`, run: (c) => { place(tRad, rad, true); return Promise.all([c.fadeIn(tRad, 350), B.pulse(c, rad)]); } },
    { cap: mixed ? `A number multiplying from <b>outside</b> is the <b>coefficient</b>: <b>${A.c}</b>. A coefficient times a radical is a <b>mixed radical</b>.`
        : `Nothing sits outside: just <b>one number alone</b> under the root sign. That’s an <b>entire radical</b>.`,
      run: async (c) => {
        const jobs = [c.anim(verdict, [{ opacity: 0, transform: 'scale(1.6) rotate(-10deg)' }, { opacity: 1, transform: 'rotate(-4deg)' }], 420)];
        if (coef) { place(tCo, coef, true); jobs.push(c.fadeIn(tCo, 350), B.pulse(c, coef)); }
        await Promise.all(jobs);
      } }
  ];
}
function sortMake(stage, ex) {
  const W = ex.W, cw = 170, ch = 76, gap = (W - 48 - 4 * cw) / 3;
  const bins = [['entire', 'Entire', 'one number alone under the root'], ['mixed', 'Mixed', 'a coefficient outside']].map(([k, t, s], i) => {
    const e = add(stage, h('div', 'u1l7-sb ' + k, `<div class="u1l7-sb-h">${t}</div><div class="u1l7-sb-s">${s}</div>`), i ? W / 2 + 12 : 24, 150);
    e.style.width = (W / 2 - 36) + 'px'; return e;
  });
  const cards = EX1.map((q, i) => { const e = add(stage, h('div', 'u1l7-sc', `<span class="u1l7-sc-l">(${'abcd'[i]})</span> ${tex(radT(q.c, 3, q.r))}`), 24 + i * (cw + gap), 30); e.style.width = cw + 'px'; e.style.height = ch + 'px'; return e; });
  const filled = { entire: 0, mixed: 0 };
  const steps = EX1.map((q, i) => {
    const k = q.c === 1 ? 'entire' : 'mixed', slot = filled[k]++, bx = k === 'entire' ? 24 : W / 2 + 12;
    const x = bx + 24 + slot * (cw + 24), y = 230;
    return {
      cap: `(${'abcd'[i]}) ${tex(radT(q.c, 3, q.r))}: ${q.why}, so it’s <b>${k}</b>.`,
      run: async (c) => { const e = cards[i]; e.classList.add(k); await c.anim(e, [{ left: e.style.left, top: e.style.top }, { left: x + 'px', top: y + 'px' }], 650); e.style.left = x + 'px'; e.style.top = y + 'px'; }
    };
  });
  steps.push({ cap: 'Answers: (a) <b>entire</b>, (b) <b>mixed</b>, (c) <b>entire</b>, (d) <b>mixed</b>. Only the <b>outside</b> matters: the index and the size of the radicand don’t decide it.', run: (c) => Promise.all(bins.map((b) => B0pulse(c, b))) });
  return steps;
}
const B0pulse = (c, el) => c.anim(el, [{ transform: 'scale(1)' }, { transform: 'scale(1.03)' }, { transform: 'scale(1)' }], 500);

/* ================= wiring ================= */
const DIE = { front: '#ffffff', top: '#fff1c9', side: '#ffe08a', edge: '#1e2d46' };
function dieSVG(k, s) {
  const svg = stackSVG(k, s, DIE);
  if (k === 1) { // five pips on the front face, like the booklet's die
    const H = +svg.getAttribute('height'), x0 = 2, y0 = H - 2 - s;
    [[0.25, 0.25], [0.75, 0.25], [0.5, 0.5], [0.25, 0.75], [0.75, 0.75]].forEach(([a, b]) => svg.appendChild(svgEl('circle', { cx: x0 + a * s, cy: y0 + b * s, r: s * 0.085, fill: '#1e2d46' })));
  }
  return svg;
}
function mountWarmup() {
  document.querySelectorAll('.u1l7-die[data-k]').forEach((b) => {
    const k = Number(b.dataset.k), pic = b.querySelector('.u1l7-die-pic'), n = b.querySelector('.u1l7-die-n');
    const size = { 1: 46, 2: 36, 3: 26, 4: 20 }[k];
    if (k === 4) { // the mystery die: a dashed "?" until tapped
      const q = h('div', 'u1l7-die-q', '?'); pic.appendChild(q);
      b.addEventListener('click', () => {
        const on = b.classList.toggle('shown'); pic.innerHTML = ''; pic.appendChild(on ? dieSVG(4, size) : q);
        b.querySelector('.u1l7-die-t').innerHTML = on ? '<b>4×</b> as tall' : '<b>?×</b> as tall';
      });
      return;
    }
    pic.appendChild(dieSVG(k, size));
    if (k === 1) return;
    b.addEventListener('click', () => { const on = b.classList.toggle('shown'); n.innerHTML = on ? `holds <b>${k ** 3}</b> dice` : 'holds <b>?</b> dice'; });
  });
}
function mountTable() {
  const host = document.getElementById('u1l7-ptable'); if (!host) return;
  const ns = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const rows = [['n', 1, 10, 'head'], ['n^3', 3, 10, 'Perfect cubes'], ['n^4', 4, 5, 'Fourth powers'], ['n^5', 5, 4, 'Fifth powers']];
  rows.forEach(([l, e, upto, name], i) => {
    const r = h(i ? 'button' : 'div', 'u1l7-pt-row' + (i ? '' : ' head') + (e === 3 ? ' on' : '')); if (i) { r.type = 'button'; r.title = name; }
    r.appendChild(h('span', 'u1l7-pt-l', tex(l)));
    ns.forEach((n) => r.appendChild(h('span', 'u1l7-pt-c', n <= upto ? fmt(n ** e) : '')));
    if (i) r.addEventListener('click', () => r.classList.toggle('on'));
    host.appendChild(r);
  });
}
function mountAll() {
  const defs = { anatomy, cubeMeaning, finder, groups, toEntire, signs, sameNumber, finderN, ex4check };
  document.querySelectorAll('[data-explainer]').forEach((el) => { if (defs[el.dataset.explainer]) new Explainer(el, defs[el.dataset.explainer]); });
}
mountAll(); mountWarmup(); mountTable();

/* ============ Stand Up Break! — entire ↔ mixed radicals with index 3 (then 4 and 5), at the whiteboards (lessons/js/standup.js) ============ */
const suRt = (n, x) => (n === 2 ? `\\sqrt{${x}}` : `\\sqrt[${n}]{${x}}`);
const suLab = (i) => '\\text{(' + 'abcdef'[i] + ')}\\ ';
const suGrid = (items) => '\\def\\arraystretch{1.8}\\begin{array}{ll}' + items.map((x, j) => (j ? '\\hspace{2.5em}' : '') + suLab(j) + '{' + x + '}').join(' & ') + '\\end{array}';
const suFree = (m, n) => { const f = {}; primeFactors(m).forEach((p) => (f[p] = (f[p] || 0) + 1)); return Object.values(f).every((e) => e < n); }; // no perfect n-th power factor
/* entire radicands already used by the booklet (Lesson 7 notes, examples, assignment; Lesson 8 radicals): never asked here */
const SU_USED = {
  3: [16, 24, 32, 35, 40, 48, 324, 351, 192, -24, 54, 56, 72, 81, 88, 104, 108, 128, 135, 152, 162, 189, 250, 256, 270, 272, 297, 248, 320, 384, 405, 432, 448, 500, 625, 686, 750, 1280, -16, -40, -48, -72, -81, -189, -270, -576, -686],
  4: [32, 48, 64, 80, 96, 162, 243],
  5: [64, 96, 128, 160, 486]
};
const suOk = (n, X) => !SU_USED[n].includes(X);
/* entire → mixed: index n, radicand s·kⁿ·m */
function suToMixed(r, n, ks, ms, neg) {
  for (;;) {
    const k = r.pick(ks), m = r.pick(ms), s = neg ? -1 : 1, X = s * k ** n * m;
    if (!suFree(m, n) || !suOk(n, X)) continue;
    const t = suRt(n, tn(X));
    return { t, w: `${t}=${suRt(n, tn(s * k ** n) + '\\times' + m)}=${s < 0 ? '-' : ''}${k}${suRt(n, m)}` };
  }
}
/* mixed → entire: c·ⁿ√m (odd n when c < 0) */
function suToEntire(r, n, cs, ms) {
  for (;;) {
    const c = r.pick(cs), m = r.pick(ms), X = c ** n * m;
    if (!suOk(n, X) || (c < 0 && n % 2 === 0)) continue;
    const t = tn(c) + suRt(n, m), base = c < 0 ? `(${c})` : String(c);
    return { t, w: `${t}=${suRt(n, base + '^{' + n + '}\\times' + m)}=${suRt(n, tn(c ** n) + '\\times' + m)}=${suRt(n, tn(X))}` };
  }
}
const suTwo = (A, B, text) => ({ text, q: suGrid([A.t, B.t]), a: [A, B].map((x, i) => suLab(i) + x.w) });
const SU_M3 = [2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15];
standup('u1l7', {
  intro: 'Pull out the largest perfect cube (or fourth or fifth power), or send the coefficient back in as that power. Check the index before you touch a negative!',
  levels: {
    BEG: (r) => { let A, B; do { A = suToMixed(r, 3, [2, 3], SU_M3); B = suToMixed(r, 3, [2, 3, 4, 5], [2, 3, 4, 5, 6, 7]); } while (A.t === B.t); // Example 2
      return suTwo(A, B, 'Convert each radical to a <b>mixed radical</b> in simplest form.'); },
    PRG: (r) => { // Example 2 and Example 3 (a negative coefficient goes in when the index is odd)
      const A = suToMixed(r, 3, [2, 3, 4, 5], [2, 3, 4, 5, 6, 7, 9, 10]);
      const B = suToEntire(r, 3, [2, 3, 4, 5, -2, -3, -4], [2, 3, 4, 5, 6, 7, 9, 10, 11]);
      return suTwo(A, B, '<b>(a)</b> Convert to a mixed radical in simplest form. <b>(b)</b> Convert to an entire radical.');
    },
    MAS: (r) => { // Example 4 and Section 4: index 4 and 5, and a negative radicand under an odd index
      const A = r.pick([() => suToMixed(r, 4, [2, 3], [2, 3, 5, 6, 7]), () => suToMixed(r, 5, [2], [2, 3, 5, 6, 7, 9]), () => suToMixed(r, 3, [2, 3, 4], [2, 3, 5, 6, 7], true)])();
      const B = r.pick([() => suToEntire(r, 4, [2, 3], [2, 3, 5, 6, 7]), () => suToEntire(r, 5, [2], [2, 3, 5, 7, 9, 10, 11]), () => suToEntire(r, 3, [-2, -3, -4, -5], [2, 3, 5, 6, 7])])();
      return suTwo(A, B, '<b>(a)</b> Convert to a mixed radical in simplest form. <b>(b)</b> Convert to an entire radical.');
    }
  }
});
