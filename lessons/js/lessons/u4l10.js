/* Math 15 · Unit 4 · Lesson 10 — Unit Review: Factoring.
 * Every factoring type from the unit, one explainer each, then the checklist and solving:
 *   gcfEx    — the greatest common factor (numbers, then the lowest power), including a negative GCF
 *   inspectA/B — x² + bx + c: signs, the factor-pair search, check by expanding (from the 10C 4.3 explainer)
 *   squares  — difference of squares, and why a sum of squares (warm-up card D) never factors
 *   perfect  — perfect square trinomials: two square ends and a middle term of 2AB
 *   decomp   — ax² + bx + c by decomposition (product ac, sum b, split, group)
 *   flow     — choosing a strategy: the booklet's checklist as a flowchart (adapted from the 10C 4.8 one)
 *   solveRev — solving equations by factoring (zero product property)
 *   garden   — Challenge 3: a rectangle's area and one side give the other side
 * plus the Escape the Room warm-up and the toolbox deck. */
import { h, fmt, Explainer } from '../explain.js';
import { tex } from '../tex.js';
import { standup } from '../standup.js';

const at = (el, x, y) => { el.style.left = x + 'px'; el.style.top = y + 'px'; return el; };
const add = (stage, el, x, y) => { stage.appendChild(at(el, x, y)); return el; };
const hide = (...els) => els.forEach((e) => { if (e) e.style.opacity = 0; });
const box = (el, w, hh) => { if (w != null) el.style.width = w + 'px'; if (hh != null) el.style.height = hh + 'px'; return el; };
const K = (src, display) => {
  try { return window.katex.renderToString(String(src), { displayMode: !!display, throwOnError: false, strict: 'ignore', trust: true, output: 'html' }); }
  catch (e) { return tex(src, display); }
};
const T = (s) => tex(s);
const spans = (root, cls) => [...root.querySelectorAll('.' + cls)];
const showSpans = (c, els, ms = 320, delay = 0) => Promise.all(els.map((e) => c.anim(e, [{ opacity: 0 }, { opacity: 1 }], ms, { delay })));
const pulse = (c, el, s = 1.1) => c.anim(el, [{ transform: 'scale(1)' }, { transform: `scale(${s})` }, { transform: 'scale(1)' }], 460);
const cx = (el) => { el.style.translate = '-50% 0'; return el; };
const NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs = {}) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); return e; };
function fit(el, maxW) { const w = el.offsetWidth; if (w > maxW) { const fs = parseFloat(getComputedStyle(el).fontSize); el.style.fontSize = Math.floor(fs * maxW / w) + 'px'; } return el; }
function stampIn(c, el) { return c.anim(el, [{ opacity: 0, transform: 'scale(1.9) rotate(-14deg)' }, { opacity: 1, transform: 'scale(1) rotate(-6deg)' }], 420, { easing: 'cubic-bezier(.2,1.4,.4,1)' }); }

/* ============ polynomial helpers (from the 10C 4.3 page): a term is { c: coefficient, v: { x: 2 } } ============ */
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
const par = (n) => (n < 0 ? `(${n})` : String(n));
const binT = (v, n, w = '') => (n === 0 ? v : `${v}${n < 0 ? '-' : '+'}${Math.abs(n) === 1 && w ? '' : Math.abs(n)}${w}`);
const triT = (b, c, v = 'x', w = '') => polyT([{ c: 1, v: { [v]: 2 } }, { c: b, v: w ? { [v]: 1, [w]: 1 } : { [v]: 1 } }, { c, v: w ? { [w]: 2 } : {} }].filter((t) => t.c));
const ordered = (m, n, c) => (c < 0 ? [n, m] : [m, n]);
/* a·x² + b·x + c as LaTeX */
function trin(a, b, c, v = 'x') {
  const t = (k, s, first) => (k === 0 ? '' : (k < 0 ? '-' : first ? '' : '+') + (Math.abs(k) === 1 && s ? '' : Math.abs(k)) + s);
  return (t(a, v + '^2', true) + t(b, v) + t(c, '')) || '0';
}
const linT = (k, n, v = 'x') => `${k === 1 ? '' : k === -1 ? '-' : k}${v}${n === 0 ? '' : (n < 0 ? '-' : '+') + Math.abs(n)}`; // kx + n

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
function searchPanel(stage, x, y, w, b, c, o) {
  const rows = searchRows(b, c);
  const wrap = add(stage, box(h('div', 'u4l10-sp'), w), x, y);
  wrap.innerHTML = `<div class="u4l10-sph">${o.title}</div>`;
  const els = rows.map((r) => { const e = h('div', 'u4l10-sr' + (o.cls ? ' ' + o.cls : ''), o.row(r) + `<span class="u4l10-srm">${r.ok ? '✓' : '✗'}</span>`); wrap.appendChild(e); hide(e); return e; });
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
const rowPlain = (r) => `<span class="u4l10-srp">${K(`${r.s}\\times${numT(r.l)}`)}</span><span class="u4l10-sri">${K(`${r.m},\\ ${r.n}`)}</span><span class="u4l10-srs">${K(sumT(r))}</span>`;
function signsMini(stage, x, y) {
  const e = add(stage, h('div', 'u4l10-sg'), x, y);
  e.innerHTML = `<div class="u4l10-sgc hd"></div><div class="u4l10-sgc hd">${K('b>0')}</div><div class="u4l10-sgc hd">${K('b<0')}</div>
    <div class="u4l10-sgc hd">${K('c>0')}</div><div class="u4l10-sgc" data-k="pp">both <b>+</b></div><div class="u4l10-sgc" data-k="pn">both <b>−</b></div>
    <div class="u4l10-sgc hd">${K('c<0')}</div><div class="u4l10-sgc" data-k="np">one of each;<br>bigger one <b>+</b></div><div class="u4l10-sgc" data-k="nn">one of each;<br>bigger one <b>−</b></div>`;
  hide(e);
  return {
    el: e,
    async light(c, b, cc) {
      await c.fadeIn(e, 260);
      const cell = e.querySelector(`[data-k=${(cc > 0 ? 'p' : 'n') + (b >= 0 ? 'p' : 'n')}]`);
      cell.classList.add('on'); e.classList.add('lit');
      await pulse(c, cell, 1.08);
    }
  };
}
function signsCap(b, c) {
  if (c > 0 && b > 0) return `The product ${T(String(c))} is <b>positive</b>, so the two integers have the <b>same sign</b>. The sum ${T(String(b))} is positive, so <b>both are positive</b>.`;
  if (c > 0) return `The product ${T(String(c))} is <b>positive</b>, so the two integers have the <b>same sign</b>. The sum ${T(String(b))} is negative, so <b>both are negative</b>.`;
  return `The product ${T(String(c))} is <b>negative</b>, so it’s <b>one positive and one negative</b>. The sum is ${b > 0 ? 'positive' : 'negative'}, so the bigger one is <b>${b > 0 ? 'positive' : 'negative'}</b>.`;
}

/* ======================================================================================
 * 1. The greatest common factor
 * ====================================================================================== */
const GF = {
  n: { s: '10x^3-15x^2', v: 'x' },
  a1: { s: '16x^2-24x', v: 'x' },
  b1: { s: '-18a^3+27a^2-9a', v: 'a', more: '-9a(2a-1)(a-1)' }
};
const divisors = (n) => { const out = []; for (let d = 1; d <= n; d++) if (n % d === 0) out.push(d); return out; };
const gcfEx = {
  title: 'Taking out the greatest common factor',
  height: 470,
  minW: 920,
  capH: 96,
  choices: [{ v: 'n', label: tex(GF.n.s) }, { sep: 'Example 1 check:' }, { v: 'a1', label: '(a)' }, { v: 'b1', label: '(b)' }],
  intro: (k) => `Factor ${T(GF[k].s)}: find the <b>biggest</b> factor that goes into every term, and take it out.`,
  make(stage, key, ex) {
    const W = ex.W, d = GF[key], terms = parsePoly(d.s), v = d.v;
    const nums = terms.map((t) => Math.abs(t.c)), g = nums.reduce((a, b) => gcd(a, b)), pw = Math.min(...terms.map((t) => t.v[v] || 0));
    const neg = terms[0].c < 0, G = { c: neg ? -g : g, v: pw ? { [v]: pw } : {} }, q = terms.map((t) => divT(t, G));
    const gT = (neg ? '-' : '') + bodyT({ c: g, v: G.v }), ans = `${gT}(${polyT(q)})`;
    add(stage, h('div', 'u4l10-big', K(d.s)), 24, 10);
    /* numbers: the factor lists */
    const NL = add(stage, box(h('div', 'u4l10-gl'), W * 0.56), 24, 78);
    NL.innerHTML = `<div class="u4l10-glh">Numbers: factors of each coefficient</div>`;
    const rows = nums.map((n) => {
      const r = h('div', 'u4l10-glr', `<span class="u4l10-gln">${n}:</span>` + divisors(n).map((dv) => `<span class="u4l10-gd${nums.every((m) => m % dv === 0) ? ' com' : ''}${dv === g ? ' big' : ''}">${dv}</span>`).join(''));
      NL.appendChild(r); hide(r); return r;
    });
    hide(NL);
    /* letters */
    const VL = add(stage, box(h('div', 'u4l10-gl'), W * 0.56), 24, 92 + 52 + nums.length * 46);
    VL.innerHTML = `<div class="u4l10-glh">Letters: the lowest power</div><div class="u4l10-glr">${terms.map((t) => K(t.v[v] > 1 ? `${v}^{${t.v[v]}}` : v)).join('<span class="u4l10-sep">,</span>')} <span class="u4l10-arw">→</span> ${K(pw > 1 ? `${v}^{${pw}}` : v)}</div>`;
    hide(VL);
    /* right: the GCF and the division */
    const RX = W * 0.56 + 48, RW = W - RX - 18;
    const GB = add(stage, box(h('div', 'u4l10-gb', `<div class="u4l10-glh">GCF</div><div class="u4l10-gbv">${K(bodyT({ c: g, v: G.v }))}</div>${neg ? `<div class="u4l10-gbn">leading term is negative: use ${K(gT)}</div>` : ''}`), RW), RX, 78);
    hide(GB); const gbn = GB.querySelector('.u4l10-gbn'); if (gbn) hide(gbn);
    const DV = add(stage, box(h('div', 'u4l10-gdv'), RW), RX, 214);
    const dls = terms.map((t, i) => { const e = h('div', 'u4l10-gdl', K(`${termT(t, true)}\\div ${neg ? `(${gT})` : gT}=${termT(q[i], true)}`)); DV.appendChild(e); hide(e); return e; });
    const res = add(stage, h('div', 'u4l10-res', K(`=${ans}`)), 24, 396); hide(res);
    const chk = add(stage, h('div', 'u4l10-ok', `Check: ${K(`${gT}(${polyT(q)})=${polyT(q.map((t) => mulT(G, t)))}`)} ✓`), 24 + res.offsetWidth + 30, 400); fit(chk, W - 24 - res.offsetWidth - 30 - 18); hide(chk);
    const steps = [{
      cap: `<b>Numbers first.</b> List the factors of ${nums.map((n) => T(String(n))).join(', ')}. The ones they share are shaded; the <b>biggest</b> is ${T(String(g))}.`,
      run: async (c) => { await c.fadeIn(NL, 260); for (const r of rows) await c.fadeIn(r, 280); NL.classList.add('lit'); }
    }, {
      cap: `<b>Letters next.</b> Every term has ${T(v)}. Take the <b>lowest</b> power: ${T(pw > 1 ? `${v}^${pw}` : v)}. So the GCF is ${T(bodyT({ c: g, v: G.v }))}.`,
      run: async (c) => { await c.fadeIn(VL, 320); await c.fadeIn(GB, 320); }
    }];
    if (neg) steps.push({ cap: `The <b>leading term is negative</b>, so take out a <b>negative</b> GCF: ${T(gT)}. Every sign inside the bracket flips.`, run: (c) => c.pop(gbn, 380) });
    steps.push({
      cap: `<b>Divide every term</b> by ${T(gT)}: ${q.map((t) => T(termT(t, true))).join(', ')}.`,
      run: async (c) => { await c.fadeIn(DV, 200); for (const e of dls) await c.fadeIn(e, 300); }
    }, {
      cap: `Write GCF × (what is left): ${T(`${d.s}=${ans}`)}. <b>Check by expanding</b> ✓.${d.more ? ` The bracket still factors (${T('ac=2')}, sum ${T('-3')}): ${T('=' + d.more)}.` : ''}`,
      run: async (c) => { await c.fadeIn(res, 360); await c.fadeIn(chk, 360); }
    });
    return steps;
  }
};

/* ======================================================================================
 * 2–3. x² + bx + c by inspection (from the 10C 4.3 explainer): signs, the search, check by expanding
 * ====================================================================================== */
const IN = { n2: 'x^2+11x+24', a2: 'x^2+15x+44', b2: 'x^2-12x+35', n3: 'x^2-2x-15', a3: 'x^2+2x-35', b3: 'x^2-x-56' };
function makeInspect(title, choices) {
  return {
    title, height: 470, choices, minW: 940, capH: 96,
    intro: (k) => `Factor ${T(IN[k])}: two integers with <b>product</b> ${T('c')} and <b>sum</b> ${T('b')}, then check.`,
    make(stage, key, ex) {
      const W = ex.W, terms = parsePoly(IN[key]), b = terms[1].c, c = terms[2].c;
      const rows = searchRows(b, c), hit = rows.find((r) => r.ok);
      const [f1, f2] = ordered(hit.m, hit.n, c);
      const fac = (n) => `(${binT('x', n)})`, ansT = fac(f1) + fac(f2);
      const one = { c: 1, v: { x: 1 } }, prods = [mulT(one, one), mulT(one, { c: f2, v: {} }), mulT({ c: f1, v: {} }, one), { c: f1 * f2, v: {} }];
      add(stage, h('div', 'u4l10-iq', 'Factor'), 24, 12);
      const qa = add(stage, h('div', 'u4l10-ie', K(`${IN[key]}\\htmlClass{u4l10-ia}{{}=${ansT}}`)), 24, 36);
      const qaS = spans(qa, 'u4l10-ia'); hide(...qaS);
      const tgt = add(stage, h('div', 'u4l10-need', `Need: product ${K(String(c))} &nbsp; sum ${K(String(b))}`), 24, 112); hide(tgt);
      const sg = signsMini(stage, 24, 178);
      const sp = searchPanel(stage, 370, 112, W - 370 - 18, b, c, { title: `Factor pairs of ${fmt(Math.abs(c))} → signed → sum`, row: rowPlain, cls: rows.length > 3 ? 'sm' : '' });
      const ck = add(stage, h('div', 'u4l10-ck', `<b>Check:</b> ${K(`${ansT}=${polyT(prods)}=${polyT(collect(prods))}`)} <span class="ok">✓</span>`), 24, 400); hide(ck);
      return [{
        cap: `We need two integers with <b>product</b> ${T(String(c))} and <b>sum</b> ${T(String(b))}. ` + signsCap(b, c),
        run: (c2) => Promise.all([c2.fadeIn(tgt, 300), sg.light(c2, b, c)])
      }, {
        cap: `List the factor pairs of ${fmt(Math.abs(c))}, give them the right signs, and add: ${T(sumT(hit))} ✓.`,
        run: (c2) => sp.run(c2)
      }, {
        cap: `${T(String(hit.m))} and ${T(String(hit.n))} go into the brackets: ${T(`${IN[key]}=${ansT}`)}.`,
        run: (c2) => showSpans(c2, qaS, 420)
      }, {
        cap: `<b>Check by expanding.</b> ${T(`${ansT}=${polyT(collect(prods))}`)} ✓ Factoring is expanding run backwards.`,
        run: (c2) => c2.fadeIn(ck, 380)
      }];
    }
  };
}
const inspectA = makeInspect('Trinomials with c positive', [{ v: 'n2', label: tex(IN.n2) }, { sep: 'Example 2 check:' }, { v: 'a2', label: '(a)' }, { v: 'b2', label: '(b)' }]);
const inspectB = makeInspect('Trinomials with c negative', [{ v: 'n3', label: tex(IN.n3) }, { sep: 'Example 3 check:' }, { v: 'a3', label: '(a)' }, { v: 'b3', label: '(b)' }]);

/* ======================================================================================
 * 4. Difference of squares, and the sum-of-squares trap (warm-up card D)
 * ====================================================================================== */
const SQ = {
  d: { s: 'x^2+36', A: 'x', B: '6', a2: 'x^2', b2: '36', trap: true },
  a4: { s: 'x^2-121', A: 'x', B: '11', a2: 'x^2', b2: '121' },
  b4: { s: '49x^2-25', A: '7x', B: '5', a2: '49x^2', b2: '25' }
};
const squares = {
  title: 'Squares: a difference factors, a sum does not',
  height: 440,
  minW: 900,
  choices: [{ v: 'd', label: tex(SQ.d.s) + ' (card D)' }, { sep: 'Example 4 check:' }, { v: 'a4', label: '(a)' }, { v: 'b4', label: '(b)' }],
  intro: (k) => SQ[k].trap ? `Warm-up card D: ${T('x^2+36=(x+6)(x+\\square)')}. Can <b>any</b> number go in the box?` : `Factor ${T(SQ[k].s)}. Is it two squares with a <b>minus</b> between them?`,
  make(stage, key, ex) {
    const W = ex.W, d = SQ[key], A = d.A, B = d.B;
    add(stage, cx(h('div', 'u4l10-big', K(d.s))), W / 2, 10);
    const roots = add(stage, cx(h('div', 'u4l10-roots', `${K(`${d.a2}=(${A})^2`)}<span class="u4l10-gap"></span>${K(`${d.b2}=${B}^2`)}`)), W / 2, 78); hide(roots);
    const tries = d.trap ? [
      { f: `(${A}+${B})(${A}+${B})`, e: `${d.a2}+${2 * +B}x+${d.b2}`, why: `extra ${T(`${2 * +B}x`)}` },
      { f: `(${A}-${B})(${A}-${B})`, e: `${d.a2}-${2 * +B}x+${d.b2}`, why: `extra ${T(`-${2 * +B}x`)}` },
      { f: `(${A}+${B})(${A}-${B})`, e: `${d.a2}-${d.b2}`, why: 'wrong sign' }
    ] : [];
    const tryEls = tries.map((t, i) => { const e = add(stage, h('div', 'u4l10-try', `${K(`${t.f}=${t.e}`)} <span class="no">✗</span> <span class="u4l10-why">${t.why}</span>`), 60, 150 + i * 60); hide(e); return e; });
    const st = d.trap ? add(stage, cx(h('div', 'u4l10-stamp', 'cannot be factored<small>a sum of squares</small>')), W / 2, 326) : null; if (st) hide(st);
    const steps = [{
      cap: `Both terms are <b>perfect squares</b>: ${T(`${d.a2}=(${A})^2`)} and ${T(`${d.b2}=${B}^2`)}.${d.trap ? ' But there is a <b>plus</b> between them.' : ' And there is a <b>minus</b> between them: a <b>difference of squares</b>.'}`,
      run: (c) => c.fadeIn(roots, 360)
    }];
    if (d.trap) {
      steps.push({
        cap: `Try ${T(`(x+6)(x+6)`)}: expanding gives an <b>extra</b> ${T('12x')} in the middle. Not ${T(d.s)}.`,
        run: (c) => c.fadeIn(tryEls[0], 360)
      }, {
        cap: `Try ${T('(x-6)(x-6)')}: an extra ${T('-12x')}. Still wrong.`,
        run: (c) => c.fadeIn(tryEls[1], 360)
      }, {
        cap: `Try ${T('(x+6)(x-6)')}: the middle terms cancel, but the end is ${T('-36')}, not ${T('+36')}. Wrong sign.`,
        run: (c) => c.fadeIn(tryEls[2], 360)
      }, {
        cap: `Nothing works. ${T(d.s)} is a <b>sum of squares</b>: it <b>cannot be factored</b>. Card D is the trap!`,
        run: (c) => stampIn(c, st)
      });
      return steps;
    }
    const fac = `(${A}-${B})(${A}+${B})`;
    const L1 = add(stage, h('div', 'u4l10-line', K(`${d.s}=${fac}`)), 60, 160); hide(L1);
    const mid = `${+B * (A === 'x' ? 1 : parseInt(A, 10))}x`;
    const L2 = add(stage, h('div', 'u4l10-line sm', `<b>Check:</b> ${K(`${fac}=${d.a2}\\htmlClass{u4l10-cx}{{}+${mid}-${mid}}-${d.b2}`)}`), 60, 240); hide(L2);
    const L3 = add(stage, h('div', 'u4l10-line sm', `${K(`=${d.s}`)} <span class="ok">✓</span> <span class="u4l10-why">the middle terms cancel</span>`), 152, 300); hide(L3);
    steps.push({
      cap: `Write ${T(`(A-B)(A+B)`)} with ${T(`A=${A}`)} and ${T(`B=${B}`)}: ${T(`${d.s}=${fac}`)}.`,
      run: (c) => c.fadeIn(L1, 380)
    }, {
      cap: `<b>Check by expanding.</b> The two middle terms are opposites, so they <b>cancel</b>, leaving ${T(d.s)} ✓.`,
      run: async (c) => { await c.fadeIn(L2, 360); L2.classList.add('lit'); await c.fadeIn(L3, 360); }
    });
    return steps;
  }
};

/* ======================================================================================
 * 5. Perfect square trinomials
 * ====================================================================================== */
const PS = {
  e: { s: 'x^2-10x+25', t: ['x^2', '-10x', '25'], A: 'x', B: '5', mid: '2(x)(5)=10x', sign: '-' },
  a5: { s: 'x^2+28x+196', t: ['x^2', '+28x', '196'], A: 'x', B: '14', mid: '2(x)(14)=28x', sign: '+' },
  b5: { s: '4x^2-20x+25', t: ['4x^2', '-20x', '25'], A: '2x', B: '5', mid: '2(2x)(5)=20x', sign: '-' }
};
const perfect = {
  title: 'Is it a perfect square trinomial?',
  height: 450,
  minW: 900,
  choices: [{ v: 'e', label: tex(PS.e.s) + ' (card E)' }, { sep: 'Example 5 check:' }, { v: 'a5', label: '(a)' }, { v: 'b5', label: '(b)' }],
  intro: (k) => `${T(PS[k].s)}: are the first and last terms squares, and is the middle term ${T('2AB')}?`,
  make(stage, key, ex) {
    const W = ex.W, d = PS[key], ans = `(${d.A}${d.sign}${d.B})^2`;
    const tw = 240, gap = 40, x0 = (W - 3 * tw - 2 * gap) / 2;
    const tb = d.t.map((t, i) => add(stage, box(h('div', 'u4l10-tb ' + ['f', 'm', 'l'][i], K(t)), tw), x0 + i * (tw + gap), 16));
    const rA = add(stage, box(h('div', 'u4l10-tr f', `${K(`${d.t[0]}=(${d.A})^2`)}<div class="u4l10-trl">${K(`A=${d.A}`)}</div>`), tw), x0, 100); hide(rA);
    const rB = add(stage, box(h('div', 'u4l10-tr l', `${K(`${d.t[2]}=${d.B}^2`)}<div class="u4l10-trl">${K(`B=${d.B}`)}</div>`), tw), x0 + 2 * (tw + gap), 100); hide(rB);
    const rM = add(stage, box(h('div', 'u4l10-tr m', `${K('2AB')}<div class="u4l10-trl">${K(d.mid)} <span class="ok">✓</span></div>`), tw), x0 + tw + gap, 100); hide(rM);
    const res = add(stage, cx(h('div', 'u4l10-res', K(`${d.s}=${ans}`))), W / 2, 236); hide(res);
    const sgn = add(stage, cx(h('div', 'u4l10-why', `the middle sign is <b>${d.sign === '-' ? 'minus' : 'plus'}</b>, so ${K(`(A${d.sign}B)^2`)}`)), W / 2, 296); hide(sgn);
    const exp = `(${d.A}${d.sign}${d.B})(${d.A}${d.sign}${d.B})`;
    const ck = add(stage, cx(h('div', 'u4l10-ok', `Check: ${K(`${exp}=${d.t[0]}${d.sign}${d.mid.split('=')[1]}+${d.t[2]}`)} ✓`)), W / 2, 350); hide(ck);
    return [{
      cap: `The <b>first term</b> is a square: ${T(`${d.t[0]}=(${d.A})^2`)}, so ${T(`A=${d.A}`)}.`,
      run: (c) => c.fadeIn(rA, 340)
    }, {
      cap: `The <b>last term</b> is a square: ${T(`${d.t[2]}=${d.B}^2`)}, so ${T(`B=${d.B}`)}.`,
      run: (c) => c.fadeIn(rB, 340)
    }, {
      cap: `The <b>middle term</b> must be twice ${T('A')} times ${T('B')}: ${T(d.mid)}. It matches ✓, so this is a <b>perfect square trinomial</b>.`,
      run: async (c) => { await c.fadeIn(rM, 340); await pulse(c, tb[1], 1.08); }
    }, {
      cap: `So ${T(`${d.s}=${ans}`)}. The sign in the bracket is the sign of the <b>middle</b> term.`,
      run: async (c) => { await c.fadeIn(res, 380); await c.fadeIn(sgn, 300); }
    }, {
      cap: `<b>Check by expanding:</b> ${T(`${exp}`)} gives back ${T(d.s)} ✓.`,
      run: (c) => c.fadeIn(ck, 360)
    }];
  }
};

/* ======================================================================================
 * 6. ax² + bx + c by decomposition (worked out from a, b, c)
 * ====================================================================================== */
function decompose(a, b, c) {
  const ac = a * c, A = Math.abs(ac), sb = b < 0 ? -1 : 1, rows = [];
  for (let s = 1; s * s <= A; s++) if (A % s === 0) {
    const l = A / s, m = ac > 0 ? sb * s : -sb * s, n = sb * l;
    rows.push({ m, n, sum: m + n, ok: m + n === b });
  }
  const hit = rows.find((r) => r.ok); if (!hit) return { rows, hit: null };
  const [m1, m2] = Math.abs(hit.n) >= Math.abs(hit.m) ? [hit.n, hit.m] : [hit.m, hit.n]; // the booklet writes the bigger one first
  const g1 = gcd(a, m1), g2 = gcd(m2, c) * (m2 < 0 ? -1 : 1);
  const br = linT(a / g1, m1 / g1), br2 = linT(m2 / g2, c / g2);
  const split = `${trin(a, 0, 0)}${m1 < 0 ? '-' : '+'}${Math.abs(m1) === 1 ? '' : Math.abs(m1)}x${m2 < 0 ? '-' : '+'}${Math.abs(m2) === 1 ? '' : Math.abs(m2)}x${c < 0 ? '-' : '+'}${Math.abs(c)}`;
  const grp = `${g1 === 1 ? '' : g1}x(${br})${g2 < 0 ? '-' : '+'}${Math.abs(g2)}(${br2})`;
  const fac = `(${br})(${linT(g1, g2)})`;
  return { ac, rows, hit, m1, m2, split, grp, fac, same: br === br2 };
}
const monoX = (k) => (k === 1 ? 'x' : k === -1 ? '-x' : k + 'x');
const DE = { n: [3, 10, 8], a6: [2, 13, 6], b6: [3, -1, -10] };
const decomp = {
  title: 'Decomposition: product ac, sum b, split, group',
  height: 470,
  minW: 940,
  capH: 96,
  choices: [{ v: 'n', label: tex(trin(...DE.n)) }, { sep: 'Example 6 check:' }, { v: 'a6', label: '(a)' }, { v: 'b6', label: '(b)' }],
  intro: (k) => `Factor ${T(trin(...DE[k]))}. The leading coefficient is not 1, so use <b>decomposition</b>.`,
  make(stage, key, ex) {
    const W = ex.W, [a, b, c] = DE[key], D = decompose(a, b, c), s = trin(a, b, c), LW = Math.round(W * 0.58), RX = LW + 20, RW = W - RX - 18;
    let y = 14;
    const L = (t, cls = '') => { const e = add(stage, h('div', 'u4l10-wl ' + cls, K(t)), 24, y); y += 70; return e; };
    L(s, 'big');
    const L1 = L('=' + D.split), L2 = L('=' + D.grp), L3 = L('=' + D.fac); hide(L1, L2, L3);
    const ck = add(stage, h('div', 'u4l10-ok', `Check: ${K(`${D.fac}=${s}`)} ✓`), 24, y + 8); hide(ck);
    const sp = add(stage, box(h('div', 'u4l10-sp'), RW), RX, 14);
    sp.innerHTML = `<div class="u4l10-dh">${K(`a\\cdot c=${a}(${c})=${D.ac}`)}</div><div class="u4l10-dn">Need: product ${K(String(D.ac))}, sum ${K(String(b))}</div>`;
    const rows = D.rows.map((r) => { const e = h('div', 'u4l10-sr dr', `<span class="u4l10-sri">${K(`${r.m},\\ ${r.n}`)}</span><span class="u4l10-srs">${K(`${r.m}+${par(r.n)}=${r.sum}`)}</span><span class="u4l10-srm">${r.ok ? '✓' : '✗'}</span>`); sp.appendChild(e); hide(e); return e; });
    hide(sp);
    return [{
      cap: `Multiply ${T('a\\cdot c')}: ${T(`${a}(${c})=${D.ac}`)}. We need two integers with <b>product</b> ${T(String(D.ac))} and <b>sum</b> ${T(String(b))}.`,
      run: (c2) => c2.fadeIn(sp, 340)
    }, {
      cap: `List the pairs and add them. ${T(String(D.hit.m))} and ${T(String(D.hit.n))} add to ${T(String(b))} ✓.`,
      run: async (c2) => { for (let i = 0; i < rows.length; i++) { await c2.fadeIn(rows[i], 260, { from: 'translateX(-10px)' }); rows[i].classList.add(D.rows[i].ok ? 'hit' : 'miss'); await c2.sleep(120); } }
    }, {
      cap: `<b>Split the middle term</b> with that pair: ${T(`${monoX(b)}=${monoX(D.m1)}${D.m2 < 0 ? '' : '+'}${monoX(D.m2)}`)}. Same polynomial, four terms.`,
      run: (c2) => c2.fadeIn(L1, 360)
    }, {
      cap: `<b>Group</b> in twos and take out a common factor from each. Both groups leave the <b>same bracket</b>.`,
      run: (c2) => c2.fadeIn(L2, 360)
    }, {
      cap: `Take the shared bracket out: ${T(`${s}=${D.fac}`)}. <b>Check by expanding</b> ✓.`,
      run: async (c2) => { await c2.fadeIn(L3, 360); await c2.fadeIn(ck, 320); }
    }];
  }
};

/* ======================================================================================
 * 7. Choosing a strategy: the checklist as a flowchart (adapted from the 10C 4.8 one)
 * ====================================================================================== */
const FN = {
  gcf: { x: 320, y: 40, w: 420, h: 58, html: `<b>Step 1 · Common factor?</b><small>Take it out first. Negative lead? Take out a negative.</small>` },
  bin: { x: 104, y: 150, w: 188, h: 78, html: `<b>2 terms</b>${T('A^2-B^2')}<small>a sum of squares: stop</small>` },
  tri: { x: 420, y: 150, w: 230, h: 78, html: `<b>3 terms</b>${T('ax^2+bx+c')}` },
  ps: { x: 420, y: 250, w: 280, h: 56, html: `<b>Perfect square?</b><small>square ends, middle ${T('2AB')}</small>` },
  insp: { x: 312, y: 340, w: 200, h: 60, html: `<b>${T('a=1')}: sum–product</b><small>product ${T('c')}, sum ${T('b')}</small>` },
  dec: { x: 538, y: 340, w: 216, h: 60, html: `<b>${T('a\\neq1')}: decomposition</b><small>product ${T('ac')}, sum ${T('b')}</small>` },
  again: { x: 320, y: 420, w: 560, h: 40, html: `<b>Step 3 · Can any factor be factored again?</b>`, dash: true },
  exp: { x: 320, y: 476, w: 280, h: 38, html: `<b>Check by expanding ✓</b>` }
};
const FLOW = {
  d: { s: 'x^2+36', steps: [
    { n: 'gcf', b: 'none', bc: 'none', cap: `No common factor: ${T('36')} has no ${T('x')}, and ${T('\\gcd(1,36)=1')}.` },
    { n: 'bin', b: 'sum!', bc: 'none', l: '\\text{cannot be factored}', lc: 'sub', cap: `<b>Two terms</b>, both squares, but a <b>plus</b> between them: a <b>sum of squares</b>. Stop: it cannot be factored.` }
  ] },
  a7: { s: '5x^2-80', steps: [
    { n: 'gcf', b: T('5'), l: '=5(x^2-16)', cap: `<b>Step 1: common factor.</b> ${T('5')} goes into both terms: ${T('5(x^2-16)')}.` },
    { n: 'bin', l: '=5(x-4)(x+4)', cap: `<b>Two terms</b> left: ${T('x^2')} and ${T('16=4^2')} with a minus between: a <b>difference of squares</b>.` },
    { n: 'again', b: 'no', bc: 'ok', cap: `Can ${T('x-4')} or ${T('x+4')} factor again? No: <b>complete</b>. Keep the ${T('5')} in front!` },
    { n: 'exp', chk: ['(x-4)(x+4)=x^2-16', '5(x^2-16)=5x^2-80'], cap: `<b>Check by expanding</b>: ${T('5(x^2-16)=5x^2-80')} ✓` }
  ] },
  b7: { s: '2x^2+16x+32', steps: [
    { n: 'gcf', b: T('2'), l: '=2(x^2+8x+16)', cap: `<b>Step 1: common factor.</b> Every term is even: ${T('2(x^2+8x+16)')}.` },
    { n: 'tri', cap: `<b>Three terms</b> left in the bracket.` },
    { n: 'ps', b: 'yes!', bc: 'ok', l: '=2(x+4)^2', cap: `${T('x^2=(x)^2')} and ${T('16=4^2')}, and the middle term is ${T('2(x)(4)=8x')} ✓: a <b>perfect square trinomial</b>.` },
    { n: 'again', b: 'no', bc: 'ok', cap: `${T('x+4')} won’t factor again: <b>complete</b>.` },
    { n: 'exp', chk: ['(x+4)^2=x^2+8x+16', '2(x^2+8x+16)=2x^2+16x+32'], cap: `<b>Check by expanding</b> ✓` }
  ] },
  c7: { s: '4x^3-4x^2-24x', steps: [
    { n: 'gcf', b: T('4x'), l: '=4x(x^2-x-6)', cap: `<b>Step 1: common factor.</b> ${T('\\gcd(4,4,24)=4')} and every term has an ${T('x')}: take out ${T('4x')}.` },
    { n: 'tri', cap: `<b>Three terms</b> left: ${T('x^2-x-6')}.` },
    { n: 'ps', b: 'no', bc: 'none', cap: `Perfect square? No: ${T('-6')} is not a square.` },
    { n: 'insp', b: T('-3,\\ 2'), l: '=4x(x-3)(x+2)', cap: `${T('a=1')}: <b>sum–product.</b> Product ${T('-6')}, sum ${T('-1')}: ${T('-3')} and ${T('2')}.` },
    { n: 'again', b: 'no', bc: 'ok', cap: `Nothing factors again: <b>complete</b>. Keep the ${T('4x')}!` },
    { n: 'exp', chk: ['(x-3)(x+2)=x^2-x-6', '4x(x^2-x-6)', '=4x^3-4x^2-24x'], cap: `<b>Check by expanding</b> ✓` }
  ] },
  ch1: { s: '6x^3+3x^2-45x', steps: [
    { n: 'gcf', b: T('3x'), l: '=3x(2x^2+x-15)', cap: `<b>Step 1: common factor.</b> ${T('\\gcd(6,3,45)=3')} and every term has an ${T('x')}: take out ${T('3x')}.` },
    { n: 'tri', cap: `<b>Three terms</b> left: ${T('2x^2+x-15')}.` },
    { n: 'ps', b: 'no', bc: 'none', cap: `Perfect square? No: ${T('2x^2')} and ${T('-15')} are not squares.` },
    { n: 'dec', b: T('6,\\ -5'), l: '=3x(2x^2+6x-5x-15)', cap: `${T('a=2\\neq1')}: <b>decomposition.</b> ${T('ac=-30')}, sum ${T('1')}: ${T('6')} and ${T('-5')}. Split the middle term.` },
    { n: 'dec', l: '=3x[2x(x+3)-5(x+3)]', cap: `Group in pairs: ${T('2x(x+3)')} and ${T('-5(x+3)')}…` },
    { n: 'dec', l: '=3x(x+3)(2x-5)', cap: `…and take out the shared bracket ${T('(x+3)')}.` },
    { n: 'again', b: 'no', bc: 'ok', cap: `Nothing factors again: <b>complete</b>.` },
    { n: 'exp', chk: ['(x+3)(2x-5)=2x^2+x-15', '3x(2x^2+x-15)', '=6x^3+3x^2-45x'], cap: `<b>Check by expanding</b> ✓` }
  ] }
};
const flow = {
  title: 'Choosing a strategy, one expression at a time',
  height: 504,
  minW: 980,
  capH: 96,
  choices: [{ v: 'd', label: T('x^2+36') + ' (card D)' }, { sep: 'Example 7 check:' }, { v: 'a7', label: '(a)' }, { v: 'b7', label: '(b)' }, { v: 'c7', label: '(c)' }, { sep: 'Challenge 1 check:' }, { v: 'ch1', label: T('6x^3+3x^2-45x') }],
  intro: (v) => `Factor ${T(FLOW[v].s)} completely. Start at the top of the checklist and follow the path.`,
  make(stage, v, ex) {
    const W = ex.W, d = FLOW[v], OX = 30, WX = OX + 668, WW = W - WX - 12, H = 504;
    const svg = add(stage, svgEl('svg', { class: 'u4l10-svg', width: W, height: H }), 0, 0);
    const defs = svgEl('defs');
    [['u4l10ah-g', '#c9cfdb'], ['u4l10ah-a', '#c88c14']].forEach(([id, col]) => { const m = svgEl('marker', { id, viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 13, markerHeight: 13, markerUnits: 'userSpaceOnUse', orient: 'auto-start-reverse' }); m.appendChild(svgEl('path', { d: 'M0,0 L10,5 L0,10 z', fill: col })); defs.appendChild(m); });
    svg.appendChild(defs);
    const N = {};
    for (const k in FN) { const f = FN[k]; const e = add(stage, h('div', 'u4l10-fn' + (f.dash ? ' dash' : ''), f.html), OX + f.x - f.w / 2, f.y - f.h / 2); box(e, f.w, f.h); N[k] = { ...f, x: OX + f.x, el: e, top: f.y - f.h / 2, bot: f.y + f.h / 2, left: OX + f.x - f.w / 2, right: OX + f.x + f.w / 2 }; }
    const E = {};
    const edge = (key, dd, cls = '') => { const p = svgEl('path', { d: dd, class: 'u4l10-fe ' + cls, 'marker-end': 'url(#u4l10ah-g)' }); svg.appendChild(p); E[key] = p; };
    const down = (a, b) => edge(a + '-' + b, `M${N[a].x},${N[a].bot} L${N[b].x},${N[b].top - 2}`);
    down('gcf', 'bin'); down('gcf', 'tri'); down('tri', 'ps'); down('ps', 'insp'); down('ps', 'dec');
    edge('bin-again', `M${N.bin.x},${N.bin.bot} L${N.bin.x},${N.again.top - 2}`);
    edge('insp-again', `M${N.insp.x},${N.insp.bot} L${N.insp.x},${N.again.top - 2}`);
    edge('dec-again', `M${N.dec.x},${N.dec.bot} L${N.dec.x},${N.again.top - 2}`);
    edge('ps-again', `M${N.ps.right},${N.ps.y} L${OX + 656},${N.ps.y} L${OX + 656},${N.again.y} L${N.again.right + 2},${N.again.y}`);
    down('again', 'exp');
    edge('loop', `M${N.again.left},${N.again.y} L12,${N.again.y} L12,${N.gcf.y} L${N.gcf.left - 2},${N.gcf.y}`, 'loop');
    const yes = add(stage, h('div', 'u4l10-flab', 'yes'), OX + 610, N.ps.y - 24); const no = add(stage, h('div', 'u4l10-flab', 'no'), N.ps.x + 6, N.ps.bot + 2);
    const loopLab = add(stage, h('div', 'u4l10-floop', 'factor again'), 12, (N.again.y + N.gcf.y) / 2 + 6);
    void yes; void no; void loopLab;
    box(add(stage, h('div', 'u4l10-wb'), WX, 10), WW, H - 20);
    add(stage, h('div', 'u4l10-head', 'The work'), WX + 14, 20);
    const LY = (i) => 74 + i * 50;
    const first = add(stage, h('div', 'u4l10-fwl', T(d.s)), WX + 14, LY(0)); fit(first, WW - 28);
    const badges = {}; let cur = null, li = 1;
    const light = (key) => { const e = E[key]; if (e) { e.classList.add('lit'); e.setAttribute('marker-end', 'url(#u4l10ah-a)'); } };
    return d.steps.map((s) => {
      let lineEl = null, chkEl = null, bEl = null;
      if (s.l) { lineEl = add(stage, h('div', 'u4l10-fwl' + (s.lc ? ' ' + s.lc : ''), T(s.l)), WX + 14, LY(li++)); fit(lineEl, WW - 28); lineEl.style.opacity = 0; }
      if (s.chk) {
        chkEl = add(stage, h('div', 'u4l10-ok', s.chk.map((t) => T(t)).join('<br>') + ' ✓'), WX + 10, 0); chkEl.style.lineHeight = '1.42'; chkEl.style.fontSize = '20px';
        fit(chkEl, WW - 20); at(chkEl, WX + 10, H - 16 - chkEl.offsetHeight); chkEl.style.opacity = 0;
      }
      if (s.b) {
        const nd = N[s.n]; bEl = add(stage, h('div', 'u4l10-fbadge' + (s.bc ? ' ' + s.bc : ''), s.b), nd.right + 4, nd.top); bEl.style.opacity = 0;
        if (s.n === 'gcf') { at(bEl, nd.right + 10, nd.y); bEl.style.translate = '0 -50%'; }
      }
      return {
        cap: s.cap,
        run: async (c) => {
          const ps = [];
          if (s.n !== cur) {
            if (cur) { N[cur].el.classList.remove('on'); N[cur].el.classList.add('done'); }
            if (cur === 'again' && s.n !== 'exp') { light('loop'); light('gcf-' + s.n); } else if (cur) light(cur + '-' + s.n);
            N[s.n].el.classList.add('on'); N[s.n].el.classList.remove('done');
            ps.push(pulse(c, N[s.n].el, 1.05));
            cur = s.n;
          }
          if (bEl) { const old = badges[s.n]; if (old && old !== bEl) old.remove(); badges[s.n] = bEl; ps.push(c.pop(bEl, 340, { delay: 150 })); }
          if (lineEl) ps.push(c.fadeIn(lineEl, 380, { delay: 250, from: 'translate(-10px, 0)' }));
          if (chkEl) ps.push(c.fadeIn(chkEl, 420, { delay: 250 }));
          await Promise.all(ps);
        }
      };
    });
  }
};

/* ======================================================================================
 * 8. Solving equations by factoring
 * ====================================================================================== */
const SV = {
  a8: { eq: 'x^2+x-42=0', pre: [], how: `Product ${T('-42')}, sum ${T('1')}: ${T('7')} and ${T('-6')}`, mid: [], fac: '(x+7)(x-6)=0', br: [['x+7=0', 'x=-7'], ['x-6=0', 'x=6']], sol: 'x=-7\\ \\text{ or }\\ x=6' },
  b8: { eq: '3x^2+5x-2=0', pre: [], how: `${T('ac=-6')}, sum ${T('5')}: ${T('6')} and ${T('-1')}`, mid: ['3x^2+6x-x-2=0', '3x(x+2)-1(x+2)=0'], fac: '(x+2)(3x-1)=0', br: [['x+2=0', 'x=-2'], ['3x-1=0', '3x=1', 'x=\\tfrac13']], sol: 'x=-2\\ \\text{ or }\\ x=\\tfrac13' },
  c2: { eq: '3x^2=12x', pre: ['3x^2-12x=0'], how: `Common factor ${T('3x')}. Don’t divide by ${T('x')}!`, mid: [], fac: '3x(x-4)=0', br: [['3x=0', 'x=0'], ['x-4=0', 'x=4']], sol: 'x=0\\ \\text{ or }\\ x=4' }
};
const solveRev = {
  title: 'Solving: make it 0, factor, split',
  height: 500,
  minW: 900,
  capH: 96,
  choices: [{ sep: 'Example 8 check:' }, { v: 'a8', label: '(a)' }, { v: 'b8', label: '(b)' }, { sep: 'Challenge 2 check:' }, { v: 'c2', label: tex(SV.c2.eq) }],
  intro: (k) => `Solve ${T(SV[k].eq)}: one side 0, factor, set each factor equal to 0, solve.`,
  make(stage, key, ex) {
    const W = ex.W, d = SV[key];
    let y = 12;
    const L = (t, cls = '') => { const e = add(stage, h('div', 'u4l10-wl ' + cls, K(t)), 24, y); y += 58; return e; };
    L(d.eq, 'big');
    const pre = d.pre.map((t) => L(t)); hide(...pre);
    const how = add(stage, h('div', 'u4l10-how', d.how), W * 0.55, 22); hide(how);
    const mid = d.mid.map((t) => L(t)); hide(...mid);
    const fac = L(d.fac); hide(fac);
    y += 4;
    const bw = 250;
    const B = d.br.map((ls, i) => { const e = add(stage, box(h('div', 'u4l10-bx ' + (i ? 'b' : 'a'), ls.map((t, j) => `<div class="${j === ls.length - 1 ? 'l2' : 'l1'}">${K(j === ls.length - 1 ? `\\boldsymbol{${t}}` : t)}</div>`).join('')), bw), 24 + i * (bw + 50), y); hide(e); return e; });
    const orEl = add(stage, cx(h('div', 'u4l10-or', 'or')), 24 + bw + 25, y + 30); hide(orEl);
    const ans = add(stage, h('div', 'u4l10-ans', K(d.sol)), 24, y + Math.max(...B.map((e) => e.offsetHeight)) + 20); hide(ans);
    const steps = [];
    if (d.pre.length) steps.push({ cap: `<b>Make one side 0:</b> subtract ${T('12x')} from both sides. Never divide both sides by ${T('x')}: you would lose ${T('x=0')}.`, run: (c) => c.fadeIn(pre[0], 340) });
    else steps.push({ cap: `One side is already 0, so factor the other side. ${d.how}.`, run: (c) => c.fadeIn(how, 340) });
    if (d.pre.length) steps.push({ cap: `<b>Factor.</b> ${d.how}`, run: (c) => c.fadeIn(how, 340) });
    if (d.mid.length) steps.push({ cap: `Split the middle term and group: ${T(d.mid[1])}.`, run: async (c) => { for (const e of mid) await c.fadeIn(e, 320); } });
    steps.push({
      cap: `The factored equation: ${T(d.fac)}. A product equals 0…`,
      run: (c) => c.fadeIn(fac, 360)
    }, {
      cap: `…so set <b>each factor</b> equal to 0 and solve each one.${d.br[1].length > 2 ? ` The ${T('3x')} needs one more step: divide by 3.` : ''}`,
      run: async (c) => { await Promise.all(B.map((e, i) => c.fadeIn(e, 340, { delay: i * 150 }))); await c.fadeIn(orEl, 240); }
    }, {
      cap: `The solutions: ${T(d.sol)}. Check them in the original equation.`,
      run: (c) => c.pop(ans, 400)
    });
    return steps;
  }
};

/* ======================================================================================
 * 9. Challenge 3: the garden. Area x² + 3x − 54, one side x + 9.
 * ====================================================================================== */
const garden = {
  title: 'The garden: area and one side give the other side',
  height: 460,
  minW: 900,
  capH: 96,
  intro: `A rectangular garden has area ${T('(x^2+3x-54)')} m² and one side ${T('(x+9)')} m. What is the other side?`,
  make(stage, v, ex) {
    const W = ex.W, RX = 60, RY = 70;
    /* the rectangle: drawn generic first, then at x = 8 (17 m by 2 m) */
    const rect = add(stage, h('div', 'u4l10-gr', `<div class="u4l10-gra">${K('x^2+3x-54')}<small>area (m²)</small></div>`), RX, RY); box(rect, 380, 210);
    const top = add(stage, cx(h('div', 'u4l10-grl a', K('x+9'))), RX + 190, RY - 40);
    const side = add(stage, h('div', 'u4l10-grl b', K('?')), RX + 392, RY + 88);
    const PX = RX + 470, RW = W - PX - 18;
    const f1 = add(stage, box(h('div', 'u4l10-gp', `Product ${K('-54')}, sum ${K('3')}:<br><b>${K('9')} and ${K('-6')}</b>`), RW), PX, 70); hide(f1);
    const f2 = add(stage, box(h('div', 'u4l10-gp', K('x^2+3x-54=(x+9)(x-6)')), RW), PX, 170); hide(f2);
    const f3 = add(stage, box(h('div', 'u4l10-gp ok', `Other side: ${K('(x-6)')} m`), RW), PX, 236); hide(f3);
    const g1 = add(stage, box(h('div', 'u4l10-gp', `${K('x=8')}: ${K('8+9=17')} m and ${K('8-6=2')} m`), RW), PX, 316); hide(g1);
    const g2 = add(stage, box(h('div', 'u4l10-gp ok', `Check: ${K('17\\times2=34')} and ${K('64+24-54=34')} ✓`), RW), PX, 382); hide(g2);
    return [{
      cap: `Area = length × width. So the area ${T('x^2+3x-54')} must <b>factor</b>, with ${T('(x+9)')} as one factor.`,
      run: (c) => pulse(c, rect, 1.03)
    }, {
      cap: `Factor it: product ${T('-54')}, sum ${T('3')}. The pair is ${T('9')} and ${T('-6')}.`,
      run: (c) => c.fadeIn(f1, 340)
    }, {
      cap: `${T('x^2+3x-54=(x+9)(x-6)')}. One side is ${T('(x+9)')}, so the other side is ${T('(x-6)')} m.`,
      run: async (c) => { await c.fadeIn(f2, 340); side.innerHTML = K('x-6'); await c.pop(side, 380); await c.fadeIn(f3, 300); }
    }, {
      cap: `Now let ${T('x=8')}: the sides are ${T('8+9=17')} m and ${T('8-6=2')} m. A long, thin garden!`,
      run: async (c) => {
        await c.fadeIn(g1, 320);
        const s = 20; // px per metre
        await Promise.all([c.anim(rect, [{ width: '380px', height: '210px' }, { width: 17 * s + 'px', height: 2 * s + 'px' }], 900),
          c.anim(side, [{ left: RX + 392 + 'px', top: RY + 88 + 'px' }, { left: RX + 17 * s + 12 + 'px', top: RY + 'px' }], 900),
          c.anim(top, [{ left: RX + 190 + 'px' }, { left: RX + 17 * s / 2 + 'px' }], 900)]);
        top.innerHTML = K('x+9=17'); side.innerHTML = K('x-6=2'); rect.classList.add('thin');
      }
    }, {
      cap: `<b>Check:</b> ${T('17\\times2=34')}, and the area expression at ${T('x=8')} is ${T('64+24-54=34')} ✓.`,
      run: (c) => c.fadeIn(g2, 340)
    }];
  }
};

/* ======================================================================================
 * warm-up: Escape the Room — crack each card, the lock fills in; card D is the trap
 * ====================================================================================== */
const WHEEL = { A: 0, B: 1, C: 2, E: 3, F: 4 };
function mountWarm() {
  const host = document.getElementById('wu'); if (!host) return;
  const wheels = [...host.querySelectorAll('.u4l10-wh')];
  const cards = [...host.querySelectorAll('.u4l10-cd')];
  const open = (b, on = true) => {
    b.classList.toggle('open', on);
    const k = b.dataset.k, i = WHEEL[k];
    if (i != null && wheels[i]) { wheels[i].textContent = on ? b.dataset.d : '?'; wheels[i].classList.toggle('set', on); }
    const done = Object.keys(WHEEL).every((kk) => host.querySelector(`.u4l10-cd[data-k="${kk}"]`).classList.contains('open'));
    host.classList.toggle('escaped', done);
  };
  cards.forEach((b) => b.addEventListener('click', () => open(b, !b.classList.contains('open'))));
  const types = host.querySelector('[data-wu="types"]'), all = host.querySelector('[data-wu="all"]');
  if (types) types.addEventListener('click', () => host.classList.toggle('types'));
  if (all) all.addEventListener('click', () => { const on = !cards.every((b) => b.classList.contains('open')); cards.forEach((b, i) => setTimeout(() => open(b, on), on ? i * 160 : 0)); });
  /* the answers to Q1–Q3 also crack their cards */
  host.querySelectorAll('[data-crack]').forEach((w) => {
    const b = w.querySelector('[data-bk-toggle]'); if (!b) return;
    b.addEventListener('click', () => setTimeout(() => { if (w.classList.contains('shown')) w.dataset.crack.split('').forEach((k) => { const cd = host.querySelector(`.u4l10-cd[data-k="${k}"]`); if (cd) open(cd, true); }); }, 0));
  });
}
function mountDeck() {
  const deck = document.querySelector('.u4l10-deck'); if (!deck) return;
  const cards = [...deck.querySelectorAll('.u4l10-tool')];
  cards.forEach((b) => b.addEventListener('click', () => b.classList.toggle('on')));
  const all = document.querySelector('[data-deckall]');
  if (all) all.addEventListener('click', () => { const on = !cards.every((b) => b.classList.contains('on')); cards.forEach((b, i) => setTimeout(() => b.classList.toggle('on', on), on ? i * 80 : 0)); all.textContent = on ? 'Show all rules' : 'Show all examples'; });
}

/* ======================================================================================
 * Stand Up Break! — mixed review at the whiteboards (halfway: Sections 1–5)
 * ====================================================================================== */
const lin = (v, p) => '(' + v + (p < 0 ? '-' : '+') + Math.abs(p) + ')';
function pairQ(r, lo, hi, mixed) {
  for (;;) {
    const p = r.int(lo, hi) * (mixed ? r.sign() : 1), q = r.int(lo, hi) * (mixed ? r.sign() : 1);
    if (p + q === 0 || p === q) continue;
    if (mixed && p > 0 && q > 0) continue;
    return [p, q].sort((x, y) => y - x);
  }
}
const sumProd = (b, c, p, q) => `\\text{product } ${c},\\ \\text{sum } ${b}:\\quad ${p} \\text{ and } ${q}`;
standup('u4l10', {
  intro: 'Factor completely at your whiteboard station. Name the type first, then factor, then check by expanding.',
  levels: {
    BEG: (r) => { // a GCF, or x² + bx + c
      if (r.chance(0.35)) {
        const g = r.pick([2, 3, 4, 5, 6, 7, 8]), p = r.pick([1, 2]), a = r.int(2, 5); let b; do { b = r.int(1, 9) * r.sign(); } while (gcd(a, b) !== 1);
        const Q = p === 1 ? trin(g * a, g * b, 0) : `${g * a}x^3${g * b < 0 ? '-' : '+'}${Math.abs(g * b)}x^2`;
        const G = p === 1 ? `${g}x` : `${g}x^2`;
        return { q: Q, a: [`\\text{GCF } ${G}`, `${Q}=${G}(${linT(a, b)})`] };
      }
      const [p, q] = pairQ(r, 1, 9, r.chance(0.5)), b = p + q, c = p * q, Q = trin(1, b, c);
      return { q: Q, a: [sumProd(b, c, p, q), `${Q}=${lin('x', p)}${lin('x', q)}`] };
    },
    PRG: (r) => { // difference of squares, perfect square, or a ≠ 1
      const kind = r.pick(['dos', 'ps', 'dec', 'dec']);
      if (kind === 'dos') { let k, n; do { k = r.pick([1, 1, 2, 3, 4, 5]); n = r.int(1, 9); } while (gcd(k, n) !== 1); const A = k === 1 ? 'x' : k + 'x'; return { q: `${k === 1 ? '' : k * k}x^2-${n * n}`, a: [`=(${A})^2-${n}^2`, `=(${A}-${n})(${A}+${n})`] }; }
      if (kind === 'ps') { let k, n; do { k = r.pick([1, 1, 2, 3]); n = r.int(1, 9); } while (gcd(k, n) !== 1); const s = r.sign(), A = k === 1 ? 'x' : k + 'x'; return { q: trin(k * k, 2 * s * k * n, n * n), a: [`2(${A})(${n})=${2 * k * n}x`, `=(${A}${s < 0 ? '-' : '+'}${n})^2`] }; }
      // (a x + m)(x + n), a = 2 or 3, no common factor
      const a = r.pick([2, 3]); let m, n; do { m = r.int(1, 7) * r.sign(); n = r.int(1, 6) * r.sign(); } while (gcd(a, m) !== 1 || a * n + m === 0);
      const Q = trin(a, a * n + m, m * n), D = decompose(a, a * n + m, m * n);
      return { q: Q, a: [`ac=${a * m * n},\\ \\text{sum } ${a * n + m}`, `=${D.split}`, `=${D.grp}`, `=${D.fac}`] };
    },
    MAS: (r) => { // a GCF and then another type
      const g = r.pick([2, 3, 4, 5]), kind = r.pick(['tri', 'tri', 'dos', 'ps']), wx = r.chance(0.35);
      const G = wx ? `${g}x` : String(g);
      if (kind === 'dos') { const n = r.int(2, 9); const Q = wx ? `${g}x^3-${g * n * n}x` : `${g}x^2-${g * n * n}`; return { q: Q, a: [`=${G}(x^2-${n * n})`, `=${G}(x-${n})(x+${n})`] }; }
      if (kind === 'ps') { const n = r.int(1, 7), s = r.sign(); const inner = trin(1, 2 * s * n, n * n); const Q = wx ? `${g}x^3${2 * s * n * g < 0 ? '-' : '+'}${Math.abs(2 * n * g)}x^2+${g * n * n}x` : trin(g, 2 * s * n * g, g * n * n); return { q: Q, a: [`=${G}(${inner})`, `=${G}(x${s < 0 ? '-' : '+'}${n})^2`] }; }
      const [p, q] = pairQ(r, 1, 8, true), b = p + q, c = p * q, inner = trin(1, b, c);
      const Q = wx ? `${g}x^3${g * b < 0 ? '-' : '+'}${Math.abs(g * b) === 1 ? '' : Math.abs(g * b)}x^2${g * c < 0 ? '-' : '+'}${Math.abs(g * c)}x` : trin(g, g * b, g * c);
      return { q: Q, a: [`=${G}(${inner})`, `=${G}${lin('x', p)}${lin('x', q)}`] };
    }
  }
});

/* ============ wiring ============ */
function mountExplainers() {
  const defs = { gcfEx, inspectA, inspectB, squares, perfect, decomp, flow, solveRev, garden };
  document.querySelectorAll('[data-explainer]').forEach((el) => new Explainer(el, defs[el.dataset.explainer]));
}
mountWarm(); mountDeck(); mountExplainers();
