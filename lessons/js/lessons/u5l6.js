/* Math 15 · Unit 5 · Lesson 6 — Domain and Range of a Relation, Part 2.
 * Explainers: from the graph's shadows to ordered pairs (recall), the vending machine as a relation (arrow diagram),
 * reading inputs and outputs from ordered pairs and from a table (each value once), building set notation, when a list is
 * impossible (a ray → an inequality), and a real situation that limits the domain (Example 5).
 * Also the Vending Machine warm-up, the example figures and the Stand Up Break.
 * Built from Math 10C u5l4 (collect: token rows, struck repeats, panels) at the Math 15 level: lists and braces, and an
 * inequality only for a graph that goes on forever. Colours: domain (inputs) amber, range (outputs) purple. */
import {
  h, tex, add, box, Graph, ValueTable, MappingDiagram, mountExplainers, pop, fadeIn, appear, pulse, shake, sleep, tween, pairTex, svgEl, liveCtx, COLORS
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
/* KaTeX that allows \htmlClass, so pieces of one expression can be lit one at a time */
const K = (src) => {
  try {
    const clean = String(src).replace(/\\htmlClass\{[^}]*\}/g, '').replace(/"/g, '&quot;').replace(/</g, '&lt;');
    return window.katex.renderToString(String(src), { throwOnError: false, strict: 'ignore', trust: true, output: 'html' }).replace('<span class="katex"', '<span data-tex="' + clean + '" class="katex"');
  } catch (e) { return tex(src); }
};
const nT = (v) => String(+(+v).toFixed(3));
const uniq = (a) => [...new Set(a)].sort((p, q) => p - q);
const listT = (a) => a.map((v) => (typeof v === 'number' ? nT(v) : v)).join(',\\ ');
const setT = (name, a) => `${name}=\\{${listT(a)}\\}`;
const ptT = (p) => T(pairTex(p[0], p[1]));
const times = (n) => ['', 'once', 'twice', 'three times', 'four times', 'five times'][n] || n + ' times';
function repeats(vals) {
  const cnt = new Map(); vals.forEach((v) => cnt.set(v, (cnt.get(v) || 0) + 1));
  const r = [...cnt].filter(([, n]) => n > 1).map(([v, n]) => `${T(nT(v))} appears ${times(n)}`);
  return r.length ? r.join(' and ') : '';
}

/* a write-it-down panel on a stage */
function panel(stage, x, y, w, hh, title) { return add(stage, box(h('div', 'u5l6-panel', title ? `<div class="u5l6-ph">${title}</div>` : ''), w, hh), x, y); }
function pline(P, html, cls = '') { const d = h('div', 'u5l6-pl ' + cls, html); P.appendChild(d); return d; }
/** a row of value tokens; repeats (after the first) are marked .dup so a later step can strike them */
function tokenRow(P, label, vals, cls) {
  const d = pline(P, `<span class="u5l6-tl">${label}</span>`, 'u5l6-toks ' + cls);
  const seen = new Set();
  const els = vals.map((v, i) => { const s = h('span', 'u5l6-tok', T(nT(v)) + (i < vals.length - 1 ? '<i class="u5l6-cm">,</i>' : '')); s.dup = seen.has(v); seen.add(v); s.style.opacity = 0; d.appendChild(s); return s; });
  return { row: d, els };
}
const strike = (c, els) => Promise.all(els.filter((s) => s.dup).map((s) => { s.classList.add('u5l6-dup'); return pulse(c, s, 1.2); }));

/* the booklet's relations */
const S2 = [[2, 5], [3, 5], [4, 8], [6, 1]];                      // Section 2 demonstration
const E1A = [[1, 4], [2, 6], [3, 4], [5, 9]], E1B = [[7, 2], [7, 5], [7, 8]];
const E2A = [[0, 10], [1, 8], [2, 6], [3, 4], [4, 2]], E2B = [[-3, 5], [-1, 2], [1, 5], [3, 2]];
const E3A = [[2, 5], [4, 5], [6, 9], [8, 3]], E3B = [[-4, 7], [-2, 7], [0, 7], [2, 7]];
const E4A = [[-3, 8], [-1, 8], [1, 2], [3, -4]], E4B = [[1, 3], [2, 6], [3, 9], [4, 12], [5, 15]], E4C = [[-4, -2], [-2, 1], [0, 1], [3, 5]];
const E5 = [[2, 24], [4, 48], [6, 72], [8, 96], [10, 120]];
const BALLOONS = [[1, 2], [3, 6], [5, 3], [7, 1], [9, 4]];       // Lesson 5 warm-up

/* ======================= Section 1: from shadows to ordered pairs ======================= */
const RC = {
  balloons: { name: 'Lesson 5’s balloons', pts: BALLOONS, win: { xmin: 0, xmax: 10, ymin: 0, ymax: 7 }, size: [440, 330] },
  e4c: { name: 'Example 4(c)', pts: E4C, win: { xmin: -6, xmax: 6, ymin: -6, ymax: 6 }, ex: true, pos: ['s', 'nw', 'ne', 'e'] }
};
const recall = {
  title: 'From shadows to ordered pairs',
  height: 470,
  minW: 940,
  choices: [{ v: 'balloons', label: 'Lesson 5’s balloons' }, { sep: 'Check:' }, { v: 'e4c', label: 'Example 4(c)' }],
  intro: (k) => (RC[k].ex ? 'Example 4(c): four dots on a graph. Press <b>Next</b>.' : 'The five balloons from Lesson 5’s warm-up: separate dots. Press <b>Next</b>.'),
  make(stage, k, ex) {
    const d = RC[k], pts = d.pts, [gw, gh] = d.size || [440, 440];
    const G = new Graph(stage, Object.assign({ x: 14, y: 14 + (440 - gh) / 2, width: gw, height: gh }, d.win));
    const P = panel(stage, 474, 14, ex.W - 488, 440, 'Write it down');
    const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
    let pairBox;
    return [
      { cap: 'Last lesson: light from above drops each dot’s <b>floor shadow</b>; light from the side drops its <b>wall shadow</b>.',
        run: async (c) => {
          for (const p of pts) await G.reveal(G.point(p[0], p[1], { color: 'teal', r: 7 }), c, 220);
          for (const p of pts) { G.segment(p, [p[0], G.axisY()], { color: 'amber', width: 1.5, dash: '4 4' }); G.segment(p, [G.axisX(), p[1]], { color: 'purple', width: 1.5, dash: '4 4' }); }
          await Promise.all(pts.flatMap((p) => [pop(c, G.point(p[0], G.axisY(), { color: 'amber', r: 6 }), 300), pop(c, G.point(G.axisX(), p[1], { color: 'purple', r: 6 }), 300)]));
        } },
      { cap: 'Today the relation comes already <b>written down</b>. Write each dot as an ordered pair <b>(x, y)</b>.',
        run: async (c) => {
          pairBox = pline(P, '', 'u5l6-pairs');
          for (const p of pts) {
            const lab = G.label(p[0], p[1], T(pairTex(p[0], p[1])), { pos: d.pos ? d.pos[pts.indexOf(p)] : p[1] >= (d.win.ymax + d.win.ymin) / 2 ? 'se' : 'ne', cls: 'bk-ptlab' }); await appear(c, lab, 200);
            const e = h('span', 'u5l6-pair', K(`(\\htmlClass{u5l6-px}{${nT(p[0])}},\\ \\htmlClass{u5l6-py}{${nT(p[1])}})`)); pairBox.appendChild(e); await pop(c, e, 240);
          }
        } },
      { cap: `The <b>first</b> numbers, the ${T('x')}-coordinates, are exactly the floor shadow: the <b>domain</b>.`,
        run: async (c) => { pairBox.querySelectorAll('.u5l6-px').forEach((e) => e.classList.add('on')); await sleep(c, 300); await fadeIn(c, pline(P, `<b>Domain</b> ${T(listT(uniq(xs)))}`, 'dom u5l6-ans')); } },
      { cap: `The <b>second</b> numbers, the ${T('y')}-coordinates, are the wall shadow: the <b>range</b>.` + (repeats(ys) ? ` ${repeats(ys)}, so write it once.` : ''),
        run: async (c) => { pairBox.querySelectorAll('.u5l6-py').forEach((e) => e.classList.add('on')); await sleep(c, 300); await fadeIn(c, pline(P, `<b>Range</b> ${T(listT(uniq(ys)))}`, 'ran u5l6-ans')); } }
    ];
  }
};

/* ======================= Section 2: the vending machine as a relation ======================= */
const SNACK = { A1: 'Chips', A2: 'Juice', A3: 'Chips', B1: 'Cookies', B3: 'Gum', C1: 'Candy bar', C2: 'Cookies', C3: 'Chips' };
const SNACKS = ['Candy bar', 'Chips', 'Cookies', 'Gum', 'Juice'];
const txt = (s) => `\\text{${s}}`;
const machine = {
  title: 'The vending machine is a relation',
  height: 440,
  minW: 940,
  choices: [{ v: 'now', label: 'The machine' }, { v: 'fixed', label: 'B2 fixed (loaded with Gum)' }],
  intro: (k) => (k === 'fixed' ? 'The owner fixes <b>B2</b> and loads it with Gum. What changes? Press <b>Next</b>.' : 'The warm-up machine. Button in, snack out. Press <b>Next</b>.'),
  make(stage, k, ex) {
    const fixed = k === 'fixed', map = Object.assign({}, SNACK); if (fixed) map.B2 = 'Gum';
    const btns = Object.keys(map).sort(), pairs = btns.map((b) => [b, map[b]]);
    const M = new MappingDiagram(stage, { x: 10, y: 0, width: 470, height: 430, domain: btns, range: ['Chips', 'Juice', 'Candy bar', 'Cookies', 'Gum'], pairs, titles: ['Buttons (inputs)', 'Snacks (outputs)'], tex: false, arrows: false, cls: 'u5l6-mach' });
    const P = panel(stage, 494, 14, ex.W - 508, 410, 'Write it down');
    let broke;
    if (!fixed) { broke = add(stage, h('div', 'u5l6-broke', '<b>B2</b>: no output'), 178, 398); broke.style.opacity = 0; }
    const D = btns.map(txt), R = SNACKS.map(txt);
    return [
      { cap: fixed ? 'Now <b>B2</b> works too. Each button (input) gives one snack (output).' : 'Each <b>working</b> button is an input. Its snack is the output. Draw an arrow for each button.',
        run: (c) => M.drawArrows(c, { ms: 260, stagger: 40 }) },
      { cap: fixed ? 'B2 joins the inputs. Its snack, Gum, was already an output.' : '<b>Chips</b> comes from 3 buttons and <b>Cookies</b> from 2. But each snack is written <b>once</b> in the range.',
        run: async (c) => {
          if (fixed) { const b = M.highlight('d', 'B2', true, 'bk-hot'); await pulse(c, b, 1.25); M.highlight('r', 'Gum', true, 'u5l6-hotr'); return; }
          for (const s of ['Chips', 'Cookies']) { const e = M.highlight('r', s, true, 'u5l6-hotr'); await pulse(c, e, 1.2); }
        } },
      { cap: fixed ? 'So the domain gains one value. The range stays the same 5 snacks.' : '<b>B2</b> is out of order: press it and <b>nothing</b> comes out. No output, so B2 is <b>not</b> in the domain.',
        run: async (c) => { if (broke) { await fadeIn(c, broke); await shake(c, broke); } else await sleep(c, 200); } },
      { cap: `Write the inputs and the outputs inside curly braces: ${btns.length} buttons in the domain, ${SNACKS.length} snacks in the range.`,
        run: async (c) => {
          await fadeIn(c, pline(P, `<b>Domain</b> (${btns.length} buttons)<br>${T('D=\\{' + D.slice(0, 4).join(',\\ ') + ',')} ${T(D.slice(4).join(',\\ ') + '\\}')}`, 'dom u5l6-ans'));
          await fadeIn(c, pline(P, `<b>Range</b> (${SNACKS.length} snacks)<br>${T('R=\\{' + R.slice(0, 3).join(',\\ ') + ',')} ${T(R.slice(3).join(',\\ ') + '\\}')}`, 'ran u5l6-ans'));
        } }
    ];
  }
};

/* ======================= Sections 2 and 3: inputs and outputs from pairs or a table ======================= */
const CL = {
  s2: { form: 'pairs', pts: S2, name: 'Section 2’s pairs' },
  e1a: { form: 'pairs', pts: E1A, name: 'Example 1(a)', ex: true },
  e1b: { form: 'pairs', pts: E1B, name: 'Example 1(b)', ex: true },
  e3a: { form: 'pairs', pts: E3A, name: 'Example 3(a)', ex: true, set: true },
  e4a: { form: 'pairs', pts: E4A, name: 'Example 4(a)', ex: true, set: true },
  s3: { form: 'table', pts: S2, name: 'Section 2’s pairs, as a table' },
  e2a: { form: 'table', pts: E2A, name: 'Example 2(a)', ex: true },
  e2b: { form: 'table', pts: E2B, name: 'Example 2(b)', ex: true },
  e3b: { form: 'table', pts: E3B, name: 'Example 3(b)', ex: true, set: true },
  e4b: { form: 'table', pts: E4B, name: 'Example 4(b)', ex: true, set: true },
  e5: { form: 'table', pts: E5, name: 'Example 5', ex: true, set: true, heads: ['h', 'E'] }
};
function collectDef(title, keys, sep) {
  return {
    title,
    height: 380,
    minW: 940,
    choices: keys.map((k, i) => (i === sep ? [{ sep: 'Check:' }, { v: k, label: CL[k].name }] : [{ v: k, label: CL[k].name }])).flat(),
    intro: (k) => (CL[k].ex ? `${CL[k].name}: check the class’s answer. Press <b>Next</b>.` : (CL[k].form === 'table' ? 'The same four pairs, organized into a table. Press <b>Next</b>.' : 'Four ordered pairs. Press <b>Next</b>.')),
    make(stage, k, ex) {
      const d = CL[k], pts = d.pts, xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]), D = uniq(xs), R = uniq(ys);
      const [hx, hy] = d.heads || ['x', 'y'];
      const LW = 520, P = panel(stage, LW + 20, 14, ex.W - LW - 34, 352, 'Domain and range');
      let hiX, hiY, xTok, yTok;
      if (d.form === 'pairs') {
        const b = add(stage, h('div', 'u5l6-pairs big'), 24, 60); b.style.width = (LW - 30) + 'px';
        const els = pts.map((p, i) => { const e = h('div', 'u5l6-pair', K(`(\\htmlClass{u5l6-px}{${nT(p[0])}},\\ \\htmlClass{u5l6-py}{${nT(p[1])}})`) + (i < pts.length - 1 ? ',' : '')); b.appendChild(e); return e; });
        hiX = (i) => els[i].querySelector('.u5l6-px').classList.add('on');
        hiY = (i) => els[i].querySelector('.u5l6-py').classList.add('on');
        add(stage, h('div', 'u5l6-formtag', 'ordered pairs (x, y)'), 24, 20);
      } else {
        const cw = pts.length > 4 ? 76 : 86;
        const tb = new ValueTable(stage, { x: 24, y: 110, headers: [hx, hy], rows: pts.map((p) => [p[0], p[1]]), layout: 'h', cellW: cw, cellH: 66, cls: 'u5l6-vt' });
        hiX = (i) => { tb.cell(i, 0).classList.add('bk-hl'); tb.heads[0].classList.add('bk-hl'); };
        hiY = (i) => { tb.cell(i, 1).classList.add('u5l6-hlr'); tb.heads[1].classList.add('u5l6-hlr'); };
        add(stage, h('div', 'u5l6-formtag', 'table of values'), 24, 60);
      }
      const where = d.form === 'pairs' ? `the <b>first</b> number in every pair, the ${T(hx)}-coordinate` : `the <b>top row</b>, the ${T(hx)}-row`;
      const whereY = d.form === 'pairs' ? `the <b>second</b> numbers, the ${T(hy)}-coordinates` : `the <b>bottom row</b>, the ${T(hy)}-row`;
      const rx = repeats(xs), ry = repeats(ys);
      const dLine = d.set ? T(setT('D', D)) : T(listT(D)), rLine = d.set ? T(setT('R', R)) : T(listT(R));
      return [
        { cap: `<b>Inputs</b> first: read ${where}.`,
          run: async (c) => { xTok = tokenRow(P, 'inputs', xs, 'dom'); for (let i = 0; i < pts.length; i++) { hiX(i); await pop(c, xTok.els[i], 280); await sleep(c, 110); } } },
        { cap: (rx ? `Write each value <b>once</b>. Here ${rx}, so the domain has ${D.length === 1 ? 'just one value' : D.length + ' values'}.` : 'Write each value <b>once</b>. No value repeats here.') + (d.set ? ' Braces make it a <b>set</b>.' : ''),
          run: async (c) => { await strike(c, xTok.els); await fadeIn(c, pline(P, `<b>Domain</b> ${dLine}`, 'dom u5l6-ans')); } },
        { cap: `<b>Outputs</b>: read ${whereY}.`,
          run: async (c) => { yTok = tokenRow(P, 'outputs', ys, 'ran'); for (let i = 0; i < pts.length; i++) { hiY(i); await pop(c, yTok.els[i], 280); await sleep(c, 110); } } },
        { cap: (ry ? `Once each: ${ry}, so ${ry.includes(' and ') ? 'each is' : 'it is'} written once.` : 'Once each: no value repeats here.') + ` Tidy habit: smallest to largest.`,
          run: async (c) => { await strike(c, yTok.els); await fadeIn(c, pline(P, `<b>Range</b> ${rLine}`, 'ran u5l6-ans')); } }
      ];
    }
  };
}
const pairs = collectDef('Domain and range from ordered pairs', ['s2', 'e1a', 'e1b', 'e3a', 'e4a'], 1);
const table = collectDef('Domain and range from a table', ['s3', 'e2a', 'e2b', 'e3b', 'e4b', 'e5'], 1);

/* ======================= Section 4: building set notation ======================= */
const SN = {
  build: { name: 'Build a set' },
  order: { name: 'Order and repeats' },
  e3b: { name: 'Example 3(b)', ex: true }
};
const setNote = {
  title: 'Writing a set: curly braces',
  height: 400,
  minW: 900,
  choices: [{ v: 'build', label: 'Build a set' }, { v: 'order', label: 'Order and repeats' }, { sep: 'Check:' }, { v: 'e3b', label: 'Example 3(b): one value' }],
  intro: (k) => ({ build: 'Section 2’s pairs: the lists become sets. Press <b>Next</b>.', order: 'Does the order matter? Do repeats count? Press <b>Next</b>.', e3b: 'Example 3(b): every output is the same. Press <b>Next</b>.' }[k]),
  make(stage, k, ex) {
    const W = ex.W;
    /* a row of tokens on the stage that can slide between slots */
    const row = (vals, y, cls = '') => {
      const wrap = add(stage, h('div', 'u5l6-srow ' + cls), 0, y); wrap.style.width = W + 'px';
      const n = vals.length, gap = vals.some((v) => v < 0) ? 90 : 74, x0 = W / 2 - (n - 1) * gap / 2;
      const toks = vals.map((v, i) => { const t = add(wrap, h('div', 'u5l6-stok', T(nT(v))), x0 + i * gap, 0); t.v = v; t.slot = i; return t; });
      const comma = vals.slice(1).map((_, i) => add(wrap, h('div', 'u5l6-scm', ','), x0 + i * gap + gap / 2, 0));
      const br = [add(wrap, h('div', 'u5l6-sbr', T('\\{')), x0 - gap / 2 - 8, 0), add(wrap, h('div', 'u5l6-sbr', T('\\}')), x0 + (n - 1) * gap + gap / 2 + 8, 0)];
      const name = add(wrap, h('div', 'u5l6-sname'), x0 - gap / 2 - 96, 0);
      return { wrap, toks, comma, br, name, x0, gap };
    };
    const say = add(stage, h('div', 'u5l6-say'), 0, 300); say.style.width = W + 'px';
    if (k === 'build' || k === 'e3b') {
      const src = k === 'build' ? S2 : E3B, xs = src.map((p) => p[0]), ys = src.map((p) => p[1]);
      const top = add(stage, h('div', 'u5l6-src', src.map((p) => T(pairTex(p[0], p[1]))).join(', ')), 0, 14); top.style.width = W + 'px';
      const A = row(xs, 90), B = row(ys, 190);
      [A, B].forEach((r) => { r.br.concat(r.name).forEach((e) => (e.style.opacity = 0)); r.toks.concat(r.comma).forEach((e) => (e.style.opacity = 0)); });
      const dupB = B.toks.filter((t, i) => ys.indexOf(t.v) !== i);
      const Ru = uniq(ys);
      const lit = async (c, r) => { await Promise.all(r.toks.concat(r.comma).map((e) => appear(c, e, 300))); };
      const close = async (c, r, keep) => { // slide kept tokens together, then bring the braces in
        const vals = keep.map((t) => t.v), n = keep.length, x0 = W / 2 - (n - 1) * r.gap / 2;
        await Promise.all(keep.map((t, i) => tween(c, 600, (u) => { const from = parseFloat(t.dataset.x0 ?? (t.dataset.x0 = t.style.left)); t.style.left = (from + (x0 + i * r.gap - from) * u) + 'px'; })));
        r.comma.forEach((cm, i) => { cm.style.left = (x0 + i * r.gap + r.gap / 2) + 'px'; cm.style.display = i < n - 1 ? '' : 'none'; });
        r.br[0].style.left = (x0 - r.gap / 2 - 8) + 'px'; r.br[1].style.left = (x0 + (n - 1) * r.gap + r.gap / 2 + 8) + 'px'; r.name.style.left = (x0 - r.gap / 2 - 96) + 'px';
        void vals;
      };
      return [
        { cap: `The ${T('x')}-values from ${k === 'build' ? 'Section 2' : 'Example 3(b)'}: ${T(listT(xs))}. No repeats.`,
          run: (c) => lit(c, A) },
        { cap: `Wrap the list in <b>curly braces</b> ${T('\\{\\ \\}')} to show it is a <b>set</b>. Name it ${T('D')} for domain.`,
          run: async (c) => { await close(c, A, A.toks); A.name.innerHTML = T('D='); await Promise.all(A.br.concat(A.name).map((e) => pop(c, e, 380))); } },
        { cap: `The ${T('y')}-values: ${T(listT(ys))}.` + (k === 'e3b' ? ' Every one is 7!' : ` The ${T('5')} repeats.`),
          run: (c) => lit(c, B) },
        { cap: `A set <b>never repeats</b> a value: strike the extras, then wrap in braces.` + (k === 'e3b' ? ` A set with <b>one</b> value is fine: ${T('R=\\{7\\}')}.` : ` ${T('R=' + '\\{' + listT(Ru) + '\\}')}.`),
          run: async (c) => {
            await Promise.all(dupB.map((t) => { t.classList.add('u5l6-dup'); return pulse(c, t, 1.2); }));
            await Promise.all(dupB.map((t) => c.anim(t, [{ opacity: 1 }, { opacity: 0 }], 350)));
            const keep = B.toks.filter((t) => !dupB.includes(t)).sort((p, q) => p.v - q.v);
            await close(c, B, keep); B.name.innerHTML = T('R='); await Promise.all(B.br.concat(B.name).map((e) => pop(c, e, 380)));
          } },
        { cap: 'Read a set out loud: “D is the set containing …”.',
          run: async (c) => { say.innerHTML = k === 'build' ? '“D is the set containing <b>2, 3, 4 and 6</b>.” &nbsp; “R is the set containing <b>1, 5 and 8</b>.”' : '“D is the set containing <b>−4, −2, 0 and 2</b>.” &nbsp; “R is the set containing just <b>7</b>.”'; await fadeIn(c, say); } }
      ];
    }
    // order and repeats
    const A = row([6, 2, 4, 3], 60), B = row([2, 3, 4, 6], 160), C = row([2, 2, 3, 3, 3], 250, 'u5l6-small');
    A.name.innerHTML = T('D='); B.name.innerHTML = T('D=');
    [B.wrap, C.wrap].forEach((e) => (e.style.opacity = 0));
    const eq = add(stage, h('div', 'u5l6-eqmark', 'same set ✓'), W / 2 + 200, 125); eq.style.opacity = 0;
    say.style.top = '330px';
    return [
      { cap: `Here is a set written in a jumbled order: ${T('D=\\{6,\\ 2,\\ 4,\\ 3\\}')}.`,
        run: (c) => pop(c, A.wrap, 400) },
      { cap: `Sort it smallest to largest. It holds exactly the <b>same values</b>, so it is the <b>same set</b>. The order inside braces doesn’t matter.`,
        run: async (c) => {
          await appear(c, B.wrap, 300);
          await fadeIn(c, eq);
        } },
        { cap: `We still sort, because a sorted set is <b>tidy</b> and easy to check. A repeat adds nothing: ${T('\\{2,\\ 2,\\ 3,\\ 3,\\ 3\\}')} is just ${T('\\{2,\\ 3\\}')}.`,
        run: async (c) => {
          await appear(c, C.wrap, 300);
          const dups = C.toks.filter((t, i) => i === 1 || i >= 3);
          await Promise.all(dups.map((t) => { t.classList.add('u5l6-dup'); return pulse(c, t, 1.2); }));
          say.innerHTML = `${T('\\{2,\\ 2,\\ 3,\\ 3,\\ 3\\}=\\{2,\\ 3\\}')}: each value is written <b>once</b>.`; await fadeIn(c, say);
        } }
    ];
  }
};

/* ======================= Section 4: a list or an inequality? ======================= */
const RY = {
  left: { name: 'A ray going left', a: [2, -1], b: [0, 2], D: ['x', '\\le', 2], R: ['y', '\\ge', -1],
    c1: `A <b>ray</b>: it starts at the solid point ${T('(2,-1)')} and the <b>arrow</b> says it goes up and to the left <b>forever</b>.`,
    cl: `Try to list the ${T('x')}-values: ${T('2,\\ 1,\\ 0,\\ -1,\\ \\dots')} and also ${T('1.5')}, ${T('-0.25')}, ${T('-1000')} … The list <b>never ends</b>.`,
    cd: `The floor shadow starts at ${T('2')} and runs <b>left forever</b>. Every ${T('x')} is ${T('2')} or <b>less</b>.`,
    cr: `The wall shadow starts at ${T('-1')} and runs <b>up forever</b>. Every ${T('y')} is ${T('-1')} or <b>greater</b>.`,
    tokens: ['2', '1', '0', '-1', '1.5', '-0.25', '-1000'] },
  e3c: { name: 'Example 3(c)', a: [0, 0], b: [2, 3], D: ['x', '\\ge', 0], R: ['y', '\\ge', 0], ex: true,
    c1: `Example 3(c): a ray starts at ${T('(0,0)')} and rises <b>forever</b> up and to the right.`,
    cl: `Try to list the ${T('x')}-values: ${T('0,\\ 1,\\ 2,\\ 3,\\ \\dots')} and also ${T('0.5')}, ${T('2.7')}, ${T('1000')} … The list <b>never ends</b>.`,
    cd: `The floor shadow starts at ${T('0')} and runs <b>right forever</b>. Every ${T('x')} is ${T('0')} or <b>greater</b>.`,
    cr: `The wall shadow starts at ${T('0')} and runs <b>up forever</b>. Every ${T('y')} is ${T('0')} or <b>greater</b>.`,
    tokens: ['0', '1', '2', '3', '0.5', '2.7', '1000'] }
};
const ineqT = (I) => `${I[0]}${I[1]} ${nT(I[2])}`;
const listOrIneq = {
  title: 'When a list is impossible: an inequality',
  height: 470,
  minW: 940,
  choices: [{ v: 'left', label: 'A ray going left' }, { sep: 'Check:' }, { v: 'e3c', label: 'Example 3(c)' }],
  intro: (k) => (RY[k].ex ? 'Example 3(c): a ray with an arrow. Press <b>Next</b>.' : 'A graph with an <b>arrow</b>. Can we list its values? Press <b>Next</b>.'),
  make(stage, k, ex) {
    const d = RY[k], G = new Graph(stage, { x: 14, y: 14, width: 440, height: 440, xmin: -6, xmax: 6, ymin: -6, ymax: 6 });
    const P = panel(stage, 474, 14, ex.W - 488, 440, 'Write it down');
    const dirX = d.b[0] > d.a[0] ? 1 : -1;
    let toks;
    return [
      { cap: d.c1,
        run: async (c) => { await G.drawIn(G.ray(d.a, d.b, { start: 'closed' }), 1000, c); await G.reveal(G.label(d.a[0], d.a[1], T(pairTex(d.a[0], d.a[1])), { pos: dirX > 0 ? 'nw' : 'e', cls: 'bk-ptlab' }), c); } },
      { cap: d.cl,
        run: async (c) => {
          toks = pline(P, '<span class="u5l6-tl">x-values</span>', 'u5l6-toks dom');
          for (const v of d.tokens) { const s = h('span', 'u5l6-tok', T(v) + '<i class="u5l6-cm">,</i>'); toks.appendChild(s); await pop(c, s, 220); }
          const more = h('span', 'u5l6-tok', T('\\dots')); toks.appendChild(more); await pop(c, more, 220);
          await fadeIn(c, pline(P, 'Too many to list ✗', 'u5l6-note bad'));
        } },
      { cap: d.cd + ` So write the domain as an <b>inequality</b>: ${T(ineqT(d.D))}.`,
        run: async (c) => {
          const sh = G.shadeX(dirX > 0 ? d.a[0] : -Infinity, dirX > 0 ? Infinity : d.a[0], { band: true }); await G.drawIn(sh, 800, c);
          await fadeIn(c, pline(P, `<b>Domain</b> ${T('D:\\ ' + ineqT(d.D))}`, 'dom u5l6-ans'));
          await fadeIn(c, pline(P, `${T(d.D[1])} means “${d.D[1] === '\\ge' ? 'greater than' : 'less than'} <b>or equal to</b>”: ${T(nT(d.D[2]))} itself is included (solid dot).`, 'u5l6-small'));
        } },
      { cap: d.cr + ` ${T('R:\\ ' + ineqT(d.R))}.`,
        run: async (c) => { await G.drawIn(G.shadeY(d.a[1], Infinity, { band: true }), 800, c); await fadeIn(c, pline(P, `<b>Range</b> ${T('R:\\ ' + ineqT(d.R))}`, 'ran u5l6-ans')); } }
    ];
  }
};

/* ======================= Section 5: a real situation limits the domain ======================= */
const RL = {
  e5: { name: 'Example 5', pts: E5, rate: 12, max: 10, v: ['h', 'E'], win: { xmin: 0, xmax: 13, ymin: 0, ymax: 160, xstep: 1, ystep: 10, ylabels: 20, xlabels: 1 }, out: [12, 144], ex: true,
    who: 'Deshawn earns $12 per hour and may work <b>at most 10 hours</b> a week.', unit: ['hours', 'dollars'] },
  tix: { name: 'Movie tickets', pts: [[1, 9], [2, 18], [3, 27], [4, 36]], rate: 9, max: 4, v: ['n', 'C'], win: { xmin: 0, xmax: 6, ymin: 0, ymax: 50, xstep: 1, ystep: 5, ylabels: 10 }, out: [5, 45],
    who: 'Movie tickets cost $9 each, with a limit of <b>4 tickets</b> per person.', unit: ['tickets', 'dollars'] }
};
const real = {
  title: 'A real situation limits the domain',
  height: 470,
  minW: 940,
  choices: [{ v: 'tix', label: 'Movie tickets' }, { sep: 'Check:' }, { v: 'e5', label: 'Example 5' }],
  intro: (k) => RL[k].who + ' Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = RL[k], [u, v] = d.v, pts = d.pts, xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
    const tb = new ValueTable(stage, { x: 12, y: 50, headers: [u, v], rows: pts, cellW: 64, cellH: 50 });
    add(stage, h('div', 'u5l6-formtag', 'the table'), 14, 14);
    const G = new Graph(stage, { x: 160, y: 14, width: 420, height: 440, xtitle: u, ytitle: v, ...d.win });
    const P = panel(stage, 594, 14, ex.W - 608, 440, 'Write it down');
    const [ox, oy] = d.out;
    return [
      { cap: `Plot the table’s ordered pairs. Separate dots: the table only lists these ${pts.length} pairs.`,
        run: async (c) => { for (let i = 0; i < pts.length; i++) { tb.highlight(i, true); await G.reveal(G.point(pts[i][0], pts[i][1], { color: 'teal', r: 7 }), c, 240); tb.highlight(i, false); } } },
      { cap: `Domain: the ${T(u)}-values in the table. Range: the ${T(v)}-values.`,
        run: async (c) => { await fadeIn(c, pline(P, `<b>Domain</b> ${T(setT('D', xs))}`, 'dom u5l6-ans u5l6-sm')); await fadeIn(c, pline(P, `<b>Range</b> ${T(setT('R', ys))}`, 'ran u5l6-ans u5l6-sm')); } },
      { cap: `Could ${T(u)} be more than ${T(nT(d.max))}? <b>No</b>: the situation says at most ${d.max} ${d.unit[0]}. That is a real limit on the domain.`,
        run: async (c) => {
          const [x0, y0] = G.toPx(d.max, d.win.ymax), [x1, y1] = G.toPx(d.win.xmax, 0);
          const r = svgEl('rect', { x: x0, y: y0, width: x1 - x0, height: y1 - y0, class: 'u5l6-nogo' }, G.layers.bg); await appear(c, r, 400);
          const vl = G.vline(d.max, { color: 'red', width: 2.5 }); await G.drawIn(vl, 500, c);
          await fadeIn(c, G.label((d.max + d.win.xmax) / 2, d.win.ymax * 0.45, `not<br>allowed`, { cls: 'u5l6-nolab' }));
        } },
      { cap: `What about ${T(pairTex(ox, oy))}? The arithmetic fits, ${T(`${ox}\\times ${d.rate}=${oy}`)}, but ${T(u + '=' + ox)} is <b>outside the domain</b>. So it is <b>not</b> part of this relation.`,
        run: async (c) => {
          const g = G.point(ox, oy, { color: 'red', r: 7, open: true, label: T(pairTex(ox, oy)) + ' ✗', pos: 'nw' }); await G.reveal(g, c);
          await fadeIn(c, pline(P, `${T(pairTex(ox, oy))} is <b>not</b> in the relation ✗<br><span class="u5l6-small">${T(u + '=' + ox)} is not in the domain.</span>`, 'u5l6-note bad'));
        } }
    ];
  }
};

/* ======================= warm-up: the Vending Machine ======================= */
const ICON = {
  Chips: '<svg viewBox="0 0 40 40" width="40" height="40"><path d="M9 33L7 8H33L31 33Z" fill="#d23c32" stroke="#8f241e" stroke-width="1.6"/><path d="M7 8l2.5-2 2.5 2 2.5-2 2.5 2 2.5-2 2.5 2 2.5-2 2.5 2 2.5-2 2.5 2M9 33l2.5 2 2.5-2 2.5 2 2.5-2 2.5 2 2.5-2 2.5 2 2.5-2 2.5 2" fill="none" stroke="#8f241e" stroke-width="1.4"/><ellipse cx="20" cy="20" rx="8" ry="5.5" fill="#ffecb3"/><ellipse cx="17" cy="20" rx="3" ry="2" fill="#c88c14"/><ellipse cx="23" cy="19" rx="2.6" ry="1.8" fill="#c88c14"/></svg>',
  Juice: '<svg viewBox="0 0 40 40" width="40" height="40"><rect x="12" y="10" width="16" height="26" fill="#f5a623" stroke="#9a5a0a" stroke-width="1.6"/><path d="M12 10l3-3h10l3 3Z" fill="#9a5a0a"/><path d="M24 7V3l4-2" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/><path d="M24 7V3l4-2" fill="none" stroke="#9aa0ab" stroke-width="1"/><circle cx="20" cy="23" r="5" fill="#3ca05a"/></svg>',
  Cookies: '<svg viewBox="0 0 40 40" width="40" height="40"><circle cx="13" cy="20" r="10" fill="#c98a4b" stroke="#7a4a1f" stroke-width="1.5"/><circle cx="27" cy="20" r="10" fill="#c98a4b" stroke="#7a4a1f" stroke-width="1.5"/><g fill="#4a2a10"><circle cx="10" cy="17" r="1.5"/><circle cx="15" cy="23" r="1.5"/><circle cx="12" cy="25" r="1.2"/><circle cx="25" cy="16" r="1.5"/><circle cx="30" cy="22" r="1.5"/><circle cx="26" cy="25" r="1.2"/></g></svg>',
  Gum: '<svg viewBox="0 0 40 40" width="40" height="40"><rect x="3" y="12" width="34" height="16" rx="2" fill="#3ca05a" stroke="#1e5a30" stroke-width="1.5"/><rect x="10" y="15" width="20" height="10" fill="#fff"/><text x="20" y="23.5" text-anchor="middle" font-size="8" font-weight="800" fill="#1e5a30" font-family="sans-serif">MINT</text></svg>',
  'Candy bar': '<svg viewBox="0 0 40 40" width="40" height="40"><path d="M2 13l4 2v10l-4 2ZM38 13l-4 2v10l4 2Z" fill="#b8bcc6"/><rect x="6" y="14" width="28" height="12" fill="#7b4fc4" stroke="#4a2a80" stroke-width="1.5"/><text x="20" y="23" text-anchor="middle" font-size="8" font-weight="800" fill="#ffecb3" font-family="sans-serif">YUM!</text></svg>'
};
function mountWarm() {
  const host = document.getElementById('u5l6-vm'); if (!host) return;
  const tray = document.getElementById('u5l6-tray'), log = document.getElementById('u5l6-log');
  const order = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3'];
  const pressed = new Set();
  order.forEach((code) => {
    const snack = SNACK[code], b = h('button', 'u5l6-slot' + (snack ? '' : ' broken'));
    b.type = 'button';
    b.innerHTML = snack ? `<span class="u5l6-ic">${ICON[snack]}</span><span class="u5l6-sn">${snack}</span><span class="u5l6-code">${code}</span>`
      : `<span class="u5l6-ooo">OUT OF<br>ORDER</span><span class="u5l6-code">${code}</span>`;
    b.addEventListener('click', () => press(code, b));
    host.appendChild(b);
  });
  function press(code, b) {
    const snack = SNACK[code], c = liveCtx();
    if (!snack) { tray.innerHTML = `<b>${code}</b>: nothing comes out!`; tray.className = 'u5l6-tray bad'; shake(c, b); return; }
    tray.innerHTML = `<b>${code}</b> → <span class="u5l6-tic">${ICON[snack]}</span> ${snack}`; tray.className = 'u5l6-tray'; pop(c, tray, 300);
    if (pressed.has(code)) return; pressed.add(code);
    const e = h('span', 'u5l6-lp', `(${code}, ${snack})`); log.appendChild(e); pop(c, e, 300);
  }
  const all = document.querySelector('[data-u5l6-all]');
  if (all) all.addEventListener('click', () => order.forEach((code) => { if (SNACK[code] && !pressed.has(code)) { pressed.add(code); log.appendChild(h('span', 'u5l6-lp', `(${code}, ${SNACK[code]})`)); } }));
}

/* ======================= static figures ======================= */
function mountFigures() {
  const F = {};
  document.querySelectorAll('[data-fig]').forEach((el) => (F[el.dataset.fig] = el));
  const tableFig = (el, rows, o = {}) => new ValueTable(el, Object.assign({ rows, layout: 'h', cellW: 62, cellH: 50, tap: false }, o));
  if (F.e2a) tableFig(F.e2a, E2A);
  if (F.e2b) tableFig(F.e2b, E2B);
  if (F.e3b) tableFig(F.e3b, E3B);
  if (F.e4b) tableFig(F.e4b, E4B);
  if (F.e5) tableFig(F.e5, E5, { headers: ['h\\text{ (hours)}', 'E\\text{ (dollars)}'], headW: 150, cellW: 70 });
  if (F.e3c) {
    const G = new Graph(F.e3c, { width: 250, height: 250, xmin: -2, xmax: 5, ymin: -2, ymax: 5, fontSize: 15, xlabels: 1, ylabels: 1 });
    G.ray([0, 0], [2, 3], { start: 'closed', color: 'ink', width: 3 });
  }
  if (F.e4c) {
    const G = new Graph(F.e4c, { width: 320, height: 320, xmin: -5, xmax: 5, ymin: -4, ymax: 6, fontSize: 15, xlabels: 1, ylabels: 1 });
    E4C.forEach((p) => G.point(p[0], p[1], { color: 'ink', r: 6.5, label: T(pairTex(p[0], p[1])), pos: p[0] === 0 ? 'ne' : p[0] === -2 ? 'nw' : p[1] < 0 ? 's' : 'w', labelCls: 'u5l6-sh' }));
  }
}

mountFigures();
mountWarm();
mountExplainers({ recall, machine, pairs, table, setNote, listOrIneq, real });

/* ============ Stand Up Break! — domain and range in set notation (lessons/js/standup.js) ============ */
const SU_INK = '#1c2230', SU_GRID = '#d3d8df', SU_C = '#1f4f9a';
const suF = (v) => +v.toFixed(1);
const suNum = (v) => String(v).replace('-', '−');
function suPlane(o, draw, label) {
  const u = o.u || 30, p = 16, lab = o.lab || 1;
  const W = (o.x1 - o.x0) * u + 2 * p, H = (o.y1 - o.y0) * u + 2 * p;
  const X = (x) => suF(p + (x - o.x0) * u), Y = (y) => suF(p + (o.y1 - y) * u);
  const ax = Math.min(Math.max(0, o.y0), o.y1), ay = Math.min(Math.max(0, o.x0), o.x1);
  let s = `<rect x="0" y="0" width="${W}" height="${H}" rx="10" fill="#fff"/>`;
  for (let x = Math.ceil(o.x0); x <= o.x1; x++) s += `<line x1="${X(x)}" y1="${Y(o.y0)}" x2="${X(x)}" y2="${Y(o.y1)}" stroke="${SU_GRID}" stroke-width="1"/>`;
  for (let y = Math.ceil(o.y0); y <= o.y1; y++) s += `<line x1="${X(o.x0)}" y1="${Y(y)}" x2="${X(o.x1)}" y2="${Y(y)}" stroke="${SU_GRID}" stroke-width="1"/>`;
  s += `<g stroke="${SU_INK}" stroke-width="2" fill="${SU_INK}"><line x1="${X(o.x0)}" y1="${Y(ax)}" x2="${X(o.x1)}" y2="${Y(ax)}"/><line x1="${X(ay)}" y1="${Y(o.y0)}" x2="${X(ay)}" y2="${Y(o.y1)}"/>` +
    `<path d="M${X(o.x1)} ${Y(ax)}l-9 -5v10z M${X(ay)} ${Y(o.y1)}l-5 9h10z" stroke="none"/></g>`;
  const halo = 'paint-order="stroke" stroke="#fff" stroke-width="4" stroke-linejoin="round"';
  for (let x = Math.ceil(o.x0 / lab) * lab; x < o.x1; x += lab) if (x !== ay && x > o.x0) s += `<text x="${X(x)}" y="${Y(ax) + 22}" text-anchor="middle" ${halo}>${suNum(x)}</text>`;
  for (let y = Math.ceil(o.y0 / lab) * lab; y < o.y1; y += lab) if (y !== ax && y > o.y0) s += `<text x="${X(ay) - 7}" y="${Y(y) + 7}" text-anchor="end" ${halo}>${suNum(y)}</text>`;
  s += `<text x="${X(o.x1) - 4}" y="${Y(ax) - 9}" text-anchor="end" font-style="italic" font-size="22" ${halo}>x</text>` +
    `<text x="${X(ay) + 9}" y="${Y(o.y1) + 15}" font-style="italic" font-size="22" ${halo}>y</text>`;
  s += draw(X, Y, u);
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="${label || 'graph'}" font-family="KaTeX_Main, 'Times New Roman', serif" font-size="19" fill="${SU_INK}">${s}</svg>`;
}
const suDot = (X, Y, x, y) => `<circle cx="${X(x)}" cy="${Y(y)}" r="6.5" fill="${SU_C}"/>`;
function suArrowRay(X, Y, a, b) { // a ray from the solid point a through b, with an arrowhead where it leaves the window (±6)
  const dx = b[0] - a[0], dy = b[1] - a[1]; let t = Infinity;
  if (dx) t = Math.min(t, ((dx > 0 ? 5.6 : -5.6) - a[0]) / dx); if (dy) t = Math.min(t, ((dy > 0 ? 5.6 : -5.6) - a[1]) / dy);
  const e = [a[0] + dx * t, a[1] + dy * t], px = (e[0] - a[0]) * (X(1) - X(0)), py = (e[1] - a[1]) * (Y(1) - Y(0)), L = Math.hypot(px, py), ux = px / L, uy = py / L;
  const tx = X(e[0]), ty = Y(e[1]), bx = tx - 15 * ux, by = ty - 15 * uy;
  return `<line x1="${X(a[0])}" y1="${Y(a[1])}" x2="${suF(bx)}" y2="${suF(by)}" stroke="${SU_C}" stroke-width="3.2" stroke-linecap="round"/>` +
    `<path d="M${tx} ${ty}L${suF(bx - 7 * uy)} ${suF(by + 7 * ux)}L${suF(bx + 7 * uy)} ${suF(by - 7 * ux)}Z" fill="${SU_C}"/>` + suDot(X, Y, a[0], a[1]);
}
const suSet = (n, vals) => `${n}=\\{${uniq(vals).map((v) => '{' + v + '}').join(',\\ ')}\\}`;
const suPairsT = (pts) => { // three pairs to a line
  const ps = pts.map((p) => `(${p[0]},\\ ${p[1]})`), lines = [];
  for (let i = 0; i < ps.length; i += 3) lines.push(ps.slice(i, i + 3).join(',\\ '));
  return lines.length > 1 ? `\\begin{gathered}${lines.join(',\\\\ ')}\\end{gathered}` : lines[0];
};
const suTable = (pts) => `<table class="u5l6-sutab"><tr><th><i>x</i></th>${pts.map((p) => `<td>${suNum(p[0])}</td>`).join('')}</tr><tr><th><i>y</i></th>${pts.map((p) => `<td>${suNum(p[1])}</td>`).join('')}</tr></table>`;
/** n ordered pairs with different x-values (from xs) and y-values from ys, with at least one repeated y when rep */
function suPts(r, n, xr, yr, rep) {
  const xs = r.shuffle(Array.from({ length: xr[1] - xr[0] + 1 }, (_, i) => xr[0] + i)).slice(0, n);
  const ys = xs.map(() => r.int(yr[0], yr[1]));
  if (rep) { const i = r.int(1, n - 1); ys[i] = ys[r.int(0, i - 1)]; }
  return xs.map((x, i) => [x, ys[i]]);
}
standup('u5l6', {
  intro: 'At your whiteboard station: write the domain and range in set notation. Each value once, smallest first.',
  levels: {
    BEG: (r) => { // ordered pairs, sometimes a repeated y-value
      const pts = suPts(r, r.int(3, 5), [-6, 9], [-5, 12], r.chance(0.7));
      return { q: suPairsT(pts), text: 'State the domain and range of these ordered pairs.', a: [suSet('D', pts.map((p) => p[0])), suSet('R', pts.map((p) => p[1]))] };
    },
    PRG: (r) => { // a table of values: x not in order, repeated y-values
      const pts = suPts(r, r.int(4, 6), [-5, 8], [-4, 9], true);
      if (r.chance(0.3)) { const i = r.int(0, pts.length - 1); pts.forEach((p, j) => { if (j !== i && r.chance(0.5)) p[1] = pts[i][1]; }); }
      return { q: '', text: 'State the domain and range of the relation in the table, in set notation.', fig: suTable(pts), a: [suSet('D', pts.map((p) => p[0])), suSet('R', pts.map((p) => p[1]))] };
    },
    MAS: (r) => {
      if (r.chance(0.35)) { // a ray: a list is impossible
        const a = [r.int(-3, 3), r.int(-3, 3)], dx = r.pick([-1, 1]) * r.int(1, 2), dy = r.pick([-1, 1]) * r.int(1, 3), b = [a[0] + dx, a[1] + dy];
        const D = dx > 0 ? `x\\ge {${a[0]}}` : `x\\le {${a[0]}}`, R = dy > 0 ? `y\\ge {${a[1]}}` : `y\\le {${a[1]}}`;
        return { q: '', text: `The ray starts at the solid point <b>(${suNum(a[0])}, ${suNum(a[1])})</b> and goes on forever in the direction of the arrow. Write the domain and range.`,
          fig: suPlane({ x0: -6, x1: 6, y0: -6, y1: 6 }, (X, Y) => suArrowRay(X, Y, a, b), 'a ray'), a: [`D:\\ ${D}`, `R:\\ ${R}`] };
      }
      const pts = suPts(r, r.int(4, 6), [-5, 5], [-5, 5], r.chance(0.8));
      return { q: '', text: 'Read the dots. Write the domain and range in set notation.', fig: suPlane({ x0: -6, x1: 6, y0: -6, y1: 6 }, (X, Y) => pts.map((p) => suDot(X, Y, p[0], p[1])).join(''), 'separate points'),
        a: [suSet('D', pts.map((p) => p[0])), suSet('R', pts.map((p) => p[1]))] };
    }
  }
});
