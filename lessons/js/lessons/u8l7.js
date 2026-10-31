/* Math 15 · Unit 8 · Lesson 7 — Solving Word Problems with Systems of Equations.
 * Warm-up: Heads and Legs (Farmer Jo's fence: swap a hen for a cow and watch the legs go up by 2; peek over the fence).
 * Explainers (adapted from the Math 10C twin, u8l4 and u8l5, at Math 15 difficulty):
 *   pipeline (star; also ex1chk, ex2chk, ex34chk): the problem's phrases light up and fly into "let" statements and a
 *     facts table; each row becomes an equation; the system is solved; the answer is checked against the story
 *     (chips: the booklet walkthrough, the warm-up's hens and cows, Examples 1–4),
 *   translate (key words → symbols: word tiles drop into algebra slots; "more than" / "fewer than" lines cross; a trap),
 *   step4 (solved correctly … but does it make sense? whole numbers, positive, the right question),
 *   bars (a bar model for number and age problems: the bigger bar is the smaller bar plus a bit, or several copies;
 *     take away the extra and share; Walkthrough, Examples 1 and 2, "4 times as old"),
 *   swap (count vs value: start with all of the cheaper item and swap one at a time; that is elimination:
 *     price × Eq. 1, subtract; Examples 3 and 4, the warm-up),
 *   mixPour (two hoppers pour into the mix while the Amount × Price = Value organizer fills; Example 5, a candy mix),
 *   mixSolve (Example 5 by substitution: the expression lifts across; the graph; check both; the candy mix).
 * Colours: Eq. 1 blue, Eq. 2 amber, solution purple, unknowns / let statements teal. */
import {
  h, tex, add, box, fit, place, Graph, ValueTable, stamp, stampIn, checkCard, mountExplainers, pop, fadeIn, anim, appear,
  sleep, tween, pulse, svgEl, drawIn, COLORS
} from '../blocks.js';
import { standup } from '../standup.js';

const BLUE = COLORS.blue, AMB = COLORS.amber, PUR = COLORS.purple, TEAL = '#13807a', RED = COLORS.red, INK = COLORS.ink;
/* \B{…} blue (Eq. 1), \A{…} amber (Eq. 2), \P{…} purple (solution) */
const colz = (s) => String(s).replace(/\\B\{/g, `\\textcolor{${BLUE}}{`).replace(/\\A\{/g, `\\textcolor{${AMB}}{`).replace(/\\P\{/g, `\\textcolor{${PUR}}{`);
const T = (s) => tex(colz(s));
const tc = (color, s) => `\\textcolor{${color}}{${s}}`;
const S = svgEl;
const show = (c, el, ms = 320) => fadeIn(c, el, ms);
const hide = (...els) => els.forEach((e) => { if (e) e.style.opacity = 0; });
const hide0 = (el) => { el.style.opacity = 0; return el; };
function panel(stage, x, y, w, hh, title, cls = '') {
  const p = add(stage, box(h('div', 'u8l7-panel ' + cls), w, hh), x, y);
  if (title) p.appendChild(h('div', 'u8l7-ph', title));
  return p;
}
const live = (p) => { p.classList.remove('u8l7-idle'); p.classList.add('u8l7-live'); };
/** the problem being solved, across the top of a stage (Ryan, 2026-10-30: every explainer shows its question) */
const qbar = (stage, x, y, w, hh, html) => add(stage, box(h('div', 'u8l7-qbar', `<div>${html}</div>`), w, hh), x, y);
function rel(stage, el) {
  const s = stage.getBoundingClientRect(), r = el.getBoundingClientRect(), k = s.width / (stage.offsetWidth || s.width) || 1;
  return { x: (r.left - s.left) / k - stage.clientLeft, y: (r.top - s.top) / k - stage.clientTop, w: r.width / k, h: r.height / k };
}
/** ghosts of the `froms` elements fly to `to` and fade there */
async function fly(c, stage, froms, to, o = {}) {
  if (c.fast || !to || !froms.length) return;
  const t = rel(stage, to), jobs = [];
  froms.forEach((f, i) => {
    const r = rel(stage, f);
    const g = add(stage, h('div', 'u8l7-ghost', o.html || f.innerHTML), r.x, r.y);
    if (o.color) g.style.setProperty('--gc', o.color);
    const gw = g.offsetWidth, gh = g.offsetHeight;
    const dx = t.x + t.w / 2 - gw / 2 - r.x, dy = t.y + t.h / 2 - gh / 2 - r.y;
    jobs.push(c.anim(g, [{ transform: 'translate(0px,0px)', opacity: 1 }, { transform: `translate(${dx}px,${dy}px)`, opacity: 0.9, offset: 0.8 }, { transform: `translate(${dx}px,${dy}px)`, opacity: 0 }], o.ms || 800, { delay: i * 90 }).then(() => g.remove()));
  });
  await Promise.all(jobs);
}
const parseStory = (s) => s.replace(/\[\[([\w ]+)\|([^\]]+)\]\]/g, (m, k, t) => `<span class="u8l7-phr" data-k="${k}">${t}</span>`);
const spans = (root, k) => [...root.querySelectorAll(`[data-k~="${k}"]`)];
const HL = { q: 'u8l7-hq', u1: 'u8l7-hu', u2: 'u8l7-hu', f1: 'u8l7-h1', f2: 'u8l7-h2' };
const hl = (root, k) => { const l = spans(root, k); l.forEach((e) => e.classList.add(HL[k])); return l; };

/* =============================== warm-up: heads and legs =============================== */
function mountWarm() {
  const host = document.getElementById('u8l7-fence'), read = document.getElementById('u8l7-fread');
  if (!host || !read) return;
  const N = 10, W = 640, H = 236, SW = 58, X0 = (W - N * SW) / 2, FT = 64, FB = 168, LB = 212;
  const svg = S('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H, class: 'u8l7-fsvg', role: 'img', 'aria-label': 'Ten sun hats above a wooden fence, with the animals’ legs showing underneath' }, host);
  S('rect', { x: 8, y: LB, width: W - 16, height: 12, rx: 4, fill: '#bfdca9' }, svg);
  const legsG = S('g', {}, svg);
  for (let i = 0; i < 21; i++) {
    const x = 14 + i * 29.8;
    S('path', { d: `M${x} ${FB} V${FT + 6} l13 -9 l13 9 V${FB} Z`, fill: '#b0703c', stroke: '#7a4a24', 'stroke-width': 1.2 }, svg);
  }
  S('rect', { x: 10, y: FT + 28, width: W - 20, height: 10, fill: '#8f5a2e' }, svg);
  S('rect', { x: 10, y: FB - 34, width: W - 20, height: 10, fill: '#8f5a2e' }, svg);
  const hats = [], tags = [];
  for (let i = 0; i < N; i++) {
    const cx = X0 + SW * i + SW / 2, g = S('g', {}, svg);
    S('ellipse', { cx, cy: FT - 2, rx: 25, ry: 6.5, fill: '#ffecb3', stroke: '#c88c14', 'stroke-width': 1.4 }, g);
    S('path', { d: `M${cx - 14} ${FT - 2} L${cx - 11} ${FT - 25} Q${cx} ${FT - 32} ${cx + 11} ${FT - 25} L${cx + 14} ${FT - 2} Z`, fill: '#ffecb3', stroke: '#c88c14', 'stroke-width': 1.4 }, g);
    S('rect', { x: cx - 13.5, y: FT - 11, width: 27, height: 5, fill: '#d23c32' }, g);
    hats.push(g);
    const t = S('text', { x: cx, y: 14, 'text-anchor': 'middle', class: 'u8l7-ftag' }, svg); t.textContent = 'hen'; tags.push(t);
  }
  const legLine = (x, color, wdt) => {
    S('line', { x1: x, y1: FB, x2: x, y2: LB - 4, stroke: color, 'stroke-width': wdt, 'stroke-linecap': 'round' }, legsG);
  };
  let cows = 0;
  const set = (k) => {
    cows = Math.max(0, Math.min(N, k));
    legsG.innerHTML = '';
    for (let i = 0; i < N; i++) {
      const cx = X0 + SW * i + SW / 2, cow = i >= N - cows;
      if (cow) {
        [-19, -9, 9, 19].forEach((dx) => { legLine(cx + dx, '#2a2f3a', 4.2); S('rect', { x: cx + dx - 3.6, y: LB - 8, width: 7.2, height: 6, rx: 1, fill: '#1c2230' }, legsG); });
      } else {
        [-6, 6].forEach((dx) => { legLine(cx + dx, '#d39a22', 2.6); S('path', { d: `M${cx + dx - 6} ${LB - 3} L${cx + dx} ${LB - 6} L${cx + dx + 6} ${LB - 3}`, fill: 'none', stroke: '#d39a22', 'stroke-width': 2, 'stroke-linecap': 'round' }, legsG); });
      }
      tags[i].textContent = cow ? 'cow' : 'hen';
      tags[i].classList.toggle('u8l7-fcow', cow);
    }
    const hens = N - cows, legs = 2 * hens + 4 * cows;
    read.innerHTML = `<div><span>Hens</span><b>${hens}</b></div><div><span>Cows</span><b>${cows}</b></div><div class="u8l7-flegs${legs === 28 ? ' u8l7-fok' : ''}"><span>Legs</span><b>${legs}</b></div>`;
  };
  set(0);
  document.querySelectorAll('[data-u8l7-swap]').forEach((b) => { b.onclick = () => set(cows + Number(b.dataset.u8l7Swap)); });
  const peek = document.getElementById('u8l7-peek');
  if (peek) peek.onclick = () => { const on = host.classList.toggle('u8l7-peeking'); peek.classList.toggle('on', on); };
}

/* =============================== the four-stage pipeline (star) =============================== */
const PIPE = {
  walk: {
    label: 'Walkthrough: two numbers',
    story: '[[u1 u2 f1|Two numbers]] [[f1|have a sum of 22]]; [[u1 f2|the larger]] [[f2|is 6 more than]] [[u2 f2|the smaller]]. [[q|What are the two numbers?]]',
    s1cap: '<b>Stage 1.</b> The problem talks about a <b>larger</b> and a <b>smaller</b> number. Those are the two unknowns.',
    lets: [['L', 'the larger number'], ['S', 'the smaller number']], letNote: 'Pure numbers: no units.',
    table: { mode: 'facts', rows: [['The sum is 22', 'L+S=22'], ['The larger is 6 more than the smaller', 'L=S+6']] },
    f1cap: 'First fact: the <b>sum</b> is 22. “Sum” means <b>add</b>.',
    f2cap: 'Second fact: “6 more than the smaller” is S + 6. The larger <b>is</b> that.',
    eqcap: 'Each row of the table is already an equation.',
    eqs: ['L+S=22', 'L=S+6'],
    solve: [
      { cap: '<b>Stage 3.</b> Eq. 2 already says what L equals, so use <b>substitution</b>.', note: 'Substitution: L is isolated in Eq. 2', lines: ['(\\A{S+6})+S=22', '2S+6=22'] },
      { cap: 'Solve for S.', lines: ['2S=16\\ \\Rightarrow\\ S=8'] },
      { cap: 'Back into Eq. 2: L = 8 + 6 = 14.', lines: ['L=8+6=14'], sol: 'L=14,\\ S=8' }
    ],
    checks: [{ k: 'f1', w: 'sum of 22', t: '14+8=22' }, { k: 'f2', w: '6 more', t: '14=8+6' }],
    sense: '14 really is the larger number',
    answer: 'The two numbers are <b>14</b> and <b>8</b>.'
  },
  hens: {
    label: 'Warm-up: hens and cows',
    story: 'Farmer Jo’s [[u1|hens]] and [[u2|cows]] hide behind a fence. We see [[f1|10 hats]] (one per animal) and [[f2|28 legs]]. A hen has [[f2|2 legs]] and a cow has [[f2|4 legs]]. [[q|How many hens and how many cows?]]',
    lets: [['h', 'the number of hens'], ['c', 'the number of cows']], letNote: 'Both count animals.',
    table: { mode: 'sum', cols: ['Hens', 'Cows'], rows: [['Heads', 'h', 'c', '10'], ['Legs', '2h', '4c', '28']] },
    f1cap: 'First fact: <b>10 hats</b>, one per animal. This row <b>counts</b> animals: hens + cows = 10.',
    f2cap: 'Second fact: <b>28 legs</b>. h hens have 2h legs and c cows have 4c legs.',
    eqs: ['h+c=10', '2h+4c=28'],
    solve: [
      { cap: '<b>Stage 3.</b> Use <b>elimination</b>: multiply Eq. 1 by 2 so the h-terms match.', note: 'Elimination: 2 × Eq. 1', lines: ['2h+2c=20', '2h+4c=28'] },
      { cap: 'Same sign, so <b>subtract</b>: the h-terms cancel. 2c = 8, so c = 4.', lines: ['2c=8\\ \\Rightarrow\\ c=4'] },
      { cap: 'Back into Eq. 1: h + 4 = 10, so h = 6.', lines: ['h+4=10\\ \\Rightarrow\\ h=6'], sol: 'h=6,\\ c=4' }
    ],
    checks: [{ k: 'f1', w: '10 hats', t: '6+4=10' }, { k: 'f2', w: '28 legs', t: '2(6)+4(4)=12+16=28' }],
    sense: 'Counts of animals are whole, positive numbers',
    answer: 'Farmer Jo has <b>6 hens</b> and <b>4 cows</b>.'
  },
  ex1: {
    label: 'Example 1',
    story: 'There are [[f1|30 students]] in Ms. Alvarez’s classroom. There are [[f2|8 more]] [[u2 f2|girls]] [[f2|than]] [[u1 f2|boys]]. [[q|How many boys and how many girls are there?]]',
    lets: [['b', 'the number of boys'], ['g', 'the number of girls']], letNote: 'Both count people.',
    table: { mode: 'facts', rows: [['30 students in all', 'b+g=30'], ['8 more girls than boys', 'g=b+8']] },
    f1cap: 'First fact: <b>30 students</b> is the total: boys + girls = 30.',
    f2cap: 'Second fact: “8 more girls than boys” compares g to b. The girls are the boys plus 8: g = b + 8.',
    eqcap: 'Each row of the table is already an equation.',
    eqs: ['b+g=30', 'g=b+8'],
    solve: [
      { cap: '<b>Stage 3.</b> Eq. 2 is already solved for g: <b>substitute</b> it into Eq. 1.', note: 'Substitution: g is isolated in Eq. 2', lines: ['b+(\\A{b+8})=30', '2b+8=30'] },
      { cap: 'Solve for b.', lines: ['2b=22\\ \\Rightarrow\\ b=11'] },
      { cap: 'Back into Eq. 2: g = 11 + 8 = 19.', lines: ['g=11+8=19'], sol: 'b=11,\\ g=19' }
    ],
    checks: [{ k: 'f1', w: '30 students', t: '11+19=30' }, { k: 'f2', w: '8 more girls', t: '19=11+8' }],
    sense: 'Counts of people are whole, positive numbers',
    answer: 'There are <b>11 boys</b> and <b>19 girls</b>.'
  },
  ex2: {
    label: 'Example 2',
    story: '[[u1 f1|Jordan]] [[f1|is 5 years older than]] his sister [[u2 f1|Ava]]. [[f2|The sum of their ages is 27.]] [[q|How old is each of them?]]',
    lets: [['J', 'Jordan’s age, in years'], ['A', 'Ava’s age, in years']],
    table: { mode: 'facts', rows: [['Jordan is 5 years older than Ava', 'J=A+5'], ['The sum of their ages is 27', 'J+A=27']] },
    f1cap: 'First fact: the <b>comparison</b>. Jordan is Ava’s age plus 5: J = A + 5.',
    f2cap: 'Second fact: the <b>sum</b> of their ages is 27.',
    eqcap: 'Each row of the table is already an equation.',
    eqs: ['J=A+5', 'J+A=27'],
    solve: [
      { cap: '<b>Stage 3.</b> Eq. 1 is already solved for J: replace J in Eq. 2 with A + 5.', note: 'Substitution: J is isolated in Eq. 1', lines: ['(\\B{A+5})+A=27', '2A+5=27'] },
      { cap: 'Solve for A.', lines: ['2A=22\\ \\Rightarrow\\ A=11'] },
      { cap: 'Back into Eq. 1: J = 11 + 5 = 16.', lines: ['J=11+5=16'], sol: 'J=16,\\ A=11' }
    ],
    checks: [{ k: 'f1', w: '5 years older', t: '16=11+5' }, { k: 'f2', w: 'sum of 27', t: '16+11=27' }],
    sense: 'Ages are positive, and Jordan is the older one',
    answer: '<b>Jordan is 16</b> and <b>Ava is 11</b>.'
  },
  ex3: {
    label: 'Example 3',
    story: 'At the school canteen, [[u1 f2|hot dogs cost $3]] and [[u2 f2|juice boxes cost $2]]. On Monday, the canteen sold [[f1|a combined total of 40]] hot dogs and juice boxes, for [[f2|total sales of $97]]. [[q|How many of each were sold?]]',
    lets: [['h', 'the number of hot dogs sold'], ['j', 'the number of juice boxes sold']], letNote: 'Both count items.',
    table: { mode: 'sum', cols: ['Hot dogs', 'Juice'], rows: [['Count', 'h', 'j', '40'], ['Value ($)', '3h', '2j', '97']] },
    f1cap: 'First fact: <b>40 items</b> in all. The <b>count</b> row: each item counts as 1.',
    f2cap: 'Second fact: <b>$97</b>. The <b>value</b> row: h hot dogs at $3 bring in 3h dollars, j juice boxes at $2 bring in 2j.',
    eqs: ['h+j=40', '3h+2j=97'],
    solve: [
      { cap: '<b>Stage 3.</b> <b>Elimination</b>: multiply the count equation by 2 so the j-terms match.', note: 'Elimination: 2 × Eq. 1', lines: ['2h+2j=80', '3h+2j=97'] },
      { cap: 'Same sign, so <b>subtract</b> the first from the second: the j-terms cancel.', lines: ['h=97-80=17'] },
      { cap: 'Back into Eq. 1: 17 + j = 40, so j = 23.', lines: ['17+j=40\\ \\Rightarrow\\ j=23'], sol: 'h=17,\\ j=23' }
    ],
    checks: [{ k: 'f1', w: '40 items', t: '17+23=40' }, { k: 'f2', w: '$97', t: '3(17)+2(23)=51+46=97' }],
    sense: 'Counts of items are whole, positive numbers',
    answer: 'The canteen sold <b>17 hot dogs</b> and <b>23 juice boxes</b>.'
  },
  ex4: {
    label: 'Example 4',
    story: 'At a school concert, [[u1 f2|student tickets cost $5]] and [[u2 f2|adult tickets cost $8]]. [[f1|A total of 50 tickets]] were sold, for [[f2|total ticket revenue of $316]]. [[q|How many of each kind were sold?]]',
    lets: [['s', 'the number of student tickets sold'], ['a', 'the number of adult tickets sold']], letNote: 'Both count tickets.',
    table: { mode: 'sum', cols: ['Student', 'Adult'], rows: [['Count', 's', 'a', '50'], ['Value ($)', '5s', '8a', '316']] },
    f1cap: 'First fact: <b>50 tickets</b> in all. The <b>count</b> row.',
    f2cap: 'Second fact: <b>$316</b>. The <b>value</b> row: s tickets at $5 bring in 5s dollars, a tickets at $8 bring in 8a.',
    eqs: ['s+a=50', '5s+8a=316'],
    solve: [
      { cap: '<b>Stage 3.</b> <b>Elimination</b>: multiply the count equation by 5 so the s-terms match.', note: 'Elimination: 5 × Eq. 1', lines: ['5s+5a=250', '5s+8a=316'] },
      { cap: 'Same sign, so <b>subtract</b>: the s-terms cancel. 3a = 66, so a = 22.', lines: ['3a=66\\ \\Rightarrow\\ a=22'] },
      { cap: 'Back into Eq. 1: s + 22 = 50, so s = 28.', lines: ['s+22=50\\ \\Rightarrow\\ s=28'], sol: 's=28,\\ a=22' }
    ],
    checks: [{ k: 'f1', w: '50 tickets', t: '28+22=50' }, { k: 'f2', w: '$316', t: '5(28)+8(22)=140+176=316' }],
    sense: 'Counts of tickets are whole, positive numbers',
    answer: '<b>28 student tickets</b> and <b>22 adult tickets</b> were sold.'
  }
};

function pipeDef(keys, o = {}) {
  const ch = keys.map((k) => ({ v: k, label: PIPE[k].label }));
  return {
    title: o.title || 'Four stages: words → let → facts → equations → solve → check',
    height: 528,
    minW: o.minW || 960,
    value: keys[0],
    choices: o.sep ? [{ sep: o.sep }, ...ch] : ch,
    intro: (k) => `${PIPE[k].label}: read the problem first. Press <b>Next</b> to send it through the four stages.`,
    make(stage, k, ex) {
      const d = PIPE[k], W = ex.W, LW = Math.round(W * 0.465), RX = LW + 24, RW = W - RX - 12;
      /* left: the problem, the let card, the check */
      const sp = panel(stage, 12, 8, LW, 192, 'The problem', 'u8l7-storyp');
      const sb = h('div', 'u8l7-story', parseStory(d.story)); sp.appendChild(sb);
      const letP = panel(stage, 12, 208, LW, 86, 'Stage 1 · Define' + (d.letNote ? ` <i class="u8l7-phn">${d.letNote}</i>` : ''), 'u8l7-idle');
      const lets = d.lets.map(([v, txt]) => { const e = h('div', 'u8l7-let', `Let ${T(v)} be ${txt}`); letP.appendChild(e); fit(e, LW - 26); return e; });
      const letNote = letP.querySelector('.u8l7-phn');
      hide(...lets, letNote);
      const ckP = panel(stage, 12, 302, LW, 218, 'Stage 4 · Answer and check', 'u8l7-idle');
      const ckRows = d.checks.map((q, i) => {
        const r = h('div', 'u8l7-ck', `<span class="u8l7-ckm u8l7-c${i + 1}">✓</span><div><div class="u8l7-ckw">${q.w}</div><div class="u8l7-ckt">${T(q.t)}</div></div>`);
        ckP.appendChild(r); fit(r.querySelector('.u8l7-ckt'), LW - 60); return r;
      });
      const senseR = h('div', 'u8l7-ck u8l7-sense', `<span class="u8l7-ckm">✓</span><div>${d.sense}</div>`); ckP.appendChild(senseR);
      const ansR = h('div', 'u8l7-answer', d.answer); ckP.appendChild(ansR);
      hide(...ckRows, senseR, ansR);
      /* right: table, equations, solve */
      const tabP = panel(stage, RX, 8, RW, 160, 'Stage 2 · The two facts', 'u8l7-idle');
      const tb = h('div', 'u8l7-tab u8l7-' + d.table.mode); tabP.appendChild(tb);
      let head, rows; const ops = [];
      if (d.table.mode === 'sum') {
        head = h('div', 'u8l7-tr u8l7-thead', `<div class="u8l7-tl"></div><div class="u8l7-tc">${d.table.cols[0]}</div><div class="u8l7-to"></div><div class="u8l7-tc">${d.table.cols[1]}</div><div class="u8l7-to"></div><div class="u8l7-tc">Total</div>`);
        tb.appendChild(head);
        rows = d.table.rows.map((r, i) => {
          const row = h('div', `u8l7-tr u8l7-r${i + 1}`, `<div class="u8l7-tl">${r[0]}</div><div class="u8l7-tc">${T(r[1])}</div><div class="u8l7-to">${T('+')}</div><div class="u8l7-tc">${T(r[2])}</div><div class="u8l7-to">${T('=')}</div><div class="u8l7-tc">${T(r[3])}</div>`);
          tb.appendChild(row); ops.push(...row.querySelectorAll('.u8l7-to')); return row;
        });
      } else {
        head = h('div', 'u8l7-tr u8l7-thead', '<div class="u8l7-tw">The words</div><div class="u8l7-ts">In symbols</div>');
        tb.appendChild(head);
        rows = d.table.rows.map((r, i) => { const row = h('div', `u8l7-tr u8l7-r${i + 1}`, `<div class="u8l7-tw">${r[0]}</div><div class="u8l7-ts">${T(r[1])}</div>`); tb.appendChild(row); return row; });
      }
      hide(head); rows.forEach((r) => hide(...r.children)); hide(...ops);
      const eqP = panel(stage, RX, 174, RW, 88, 'Stage 2 · Two equations', 'u8l7-idle');
      const eqs = d.eqs.map((e, i) => { const r = h('div', 'u8l7-eq', `<span class="u8l7-tag u8l7-t${i + 1}">Eq. ${i + 1}</span>${T(`\\${i ? 'A' : 'B'}{${e}}`)}`); eqP.appendChild(r); fit(r, RW - 26); return r; });
      hide(...eqs);
      const svP = panel(stage, RX, 270, RW, 250, 'Stage 3 · Solve', 'u8l7-idle');
      const groups = d.solve.map((s) => {
        const els = [];
        if (s.note) els.push(h('div', 'u8l7-snote', s.note));
        s.lines.forEach((L) => els.push(h('div', 'u8l7-sl', T(L))));
        if (s.sol) els.push(h('div', 'u8l7-sol', T(`\\P{${s.sol}}`)));
        els.forEach((e) => { svP.appendChild(e); fit(e, RW - 26); });
        hide(...els); return els;
      });
      const kU = ['u1', 'u2'];
      const steps = [
        { cap: d.s1cap || '<b>Stage 1.</b> What does the question ask for? Those are the two <b>unknowns</b>.', run: async (c) => {
          live(letP); hl(sb, 'q'); kU.forEach((u) => hl(sb, u)); await pulse(c, sb, 1.02);
        } },
        { cap: `Give each unknown a letter and say exactly what it counts${d.letNote ? '' : ', with units'}.`, run: async (c) => {
          for (let i = 0; i < 2; i++) { await fly(c, stage, spans(sb, kU[i]), lets[i], { color: TEAL }); await show(c, lets[i]); }
          if (letNote) await show(c, letNote);
        } },
        { cap: `<b>Stage 2.</b> ${d.f1cap}`, run: async (c) => {
          live(tabP); await show(c, head, 250);
          const f = hl(sb, 'f1'); await fly(c, stage, f, rows[0], { color: BLUE });
          for (const e of rows[0].children) if (!e.classList.contains('u8l7-to')) await show(c, e, 200);
        } },
        { cap: d.f2cap, run: async (c) => {
          const f = hl(sb, 'f2'); await fly(c, stage, f, rows[1], { color: AMB });
          for (const e of rows[1].children) if (!e.classList.contains('u8l7-to')) await show(c, e, 200);
        } },
        { cap: d.eqcap || 'Each row becomes an equation: <b>part + part = total</b>.', run: async (c) => {
          live(eqP);
          for (const o2 of ops) await pop(c, o2, 200);
          for (let i = 0; i < 2; i++) { await fly(c, stage, [rows[i]], eqs[i], { html: T(d.table.mode === 'sum' ? d.eqs[i] : d.table.rows[i][1]), color: i ? AMB : BLUE }); await show(c, eqs[i]); }
        } }
      ];
      d.solve.forEach((s, i) => steps.push({ cap: s.cap, run: async (c) => { live(svP); for (const e of groups[i]) await (e.classList.contains('u8l7-sol') ? pop(c, e) : show(c, e, 280)); } }));
      steps.push({ cap: '<b>Stage 4.</b> Check against the <b>story</b>, not just the equations: does each fact come true?', run: async (c) => {
        live(ckP);
        for (let i = 0; i < d.checks.length; i++) {
          const f = spans(sb, d.checks[i].k);
          f.forEach((e) => e.classList.add('u8l7-flash'));
          await Promise.all(f.map((e) => pulse(c, e, 1.08, 420)));
          await show(c, ckRows[i]);
        }
      } });
      steps.push({ cap: `Does it make sense? ${d.sense}. Then answer the question <b>in a sentence</b>.`, run: async (c) => {
        await show(c, senseR); await pop(c, ansR, 420);
      } });
      return steps;
    }
  };
}

/* =============================== key words → symbols =============================== */
const TR = {
  sum: { label: 'Sum, more than', lets: 'Let $L$ be the larger number and $S$ the smaller number.',
    sents: [
      { tiles: ['The sum of', 'two numbers', 'is', '22'], slots: ['L', '+', 'S', '=', '22'], map: [[1], [0, 2], [3], [4]], eq: 1 },
      { tiles: ['The larger', 'is', '6 more than', 'the smaller'], slots: ['L', '=', 'S', '+6'], map: [[0], [1], [3], [2]], eq: 2 }],
    caps: ['“Two numbers” are the unknowns: <b>L</b> and <b>S</b>. “The sum of” puts a <b>+</b> between them, and “is” means <b>=</b>.',
      '“6 more than the smaller” is <b>S + 6</b>: the 6 is said first but added <b>after</b>. The lines cross.'],
    back: { cap: 'Read it back with L = 14 and S = 8: 14 + 8 = 22 ✓ and 14 = 8 + 6 ✓. The words come true.', lines: ['14+8=22\\ ✓', '14=8+6\\ ✓'] } },
  times: { label: 'Three times as many', lets: 'Let $a$ be the number of Ana’s stickers and $b$ the number of Ben’s stickers.',
    sents: [{ tiles: ['Ana', 'has', 'three times as many stickers as', 'Ben'], slots: ['a', '=', '3', 'b'], map: [[0], [1], [2], [3]], eq: 2 }],
    caps: ['“Ana has” gives <b>a =</b>. “Three times as many as Ben” is <b>3b</b>: the 3 goes with <b>Ben’s</b> letter.'],
    trap: { wrong: '3a=b', cap: 'Read it back: if Ben has 5, Ana has 3(5) = <b>15</b> ✓. The trap 3a = b would give Ben 3 times as many as Ana: backwards.', lines: ['b=5:\\ a=3(5)=15\\ ✓'] } },
  fewer: { label: '4 fewer than', lets: 'Let $c$ be the number of cats and $d$ the number of dogs.',
    sents: [{ tiles: ['There are', '4 fewer', 'cats', 'than dogs'], slots: ['c', '=', 'd', '-4'], map: [[1], [3], [0], [2]], eq: 2 }],
    caps: ['“4 fewer cats than dogs”: start with the <b>dogs</b>, then take 4 away. Said first, written last.'],
    trap: { wrong: 'd=c-4', cap: 'Read it back: 10 dogs means 10 − 4 = <b>6 cats</b> ✓, fewer cats. The trap d = c − 4 would make the <b>dogs</b> fewer.', lines: ['d=10:\\ c=10-4=6\\ ✓'] } }
};
const translate = {
  title: 'Key words: from words to symbols',
  height: 440,
  minW: 820,
  choices: Object.keys(TR).map((k) => ({ v: k, label: TR[k].label })),
  intro: (k) => `${TR[k].lets.replace(/\$(\w)\$/g, (m, v) => T(v))} Press <b>Next</b> to translate.`,
  make(stage, k, ex) {
    const d = TR[k], W = ex.W;
    const svg = S('svg', { class: 'u8l7-trsvg', width: W, height: 440, viewBox: `0 0 ${W} 440` }); stage.appendChild(svg);
    add(stage, h('div', 'u8l7-trlet', d.lets.replace(/\$(\w)\$/g, (m, v) => T(v))), 16, 8);
    const blocks = d.sents.map((s, si) => {
      const y0 = 56 + si * 170;
      const trow = add(stage, h('div', 'u8l7-trow'), 0, y0); trow.style.width = W + 'px';
      const tiles = s.tiles.map((t) => { const e = h('div', 'u8l7-tile', t); trow.appendChild(e); return e; });
      const srow = add(stage, h('div', 'u8l7-srow'), 0, y0 + 100); srow.style.width = W + 'px';
      const slots = s.slots.map((t) => { const e = h('div', 'u8l7-slot', T(t)); srow.appendChild(e); return e; });
      const tag = h('span', `u8l7-tag u8l7-t${s.eq}`, 'Eq. ' + s.eq); if (d.sents.length > 1) srow.prepend(tag); else tag.style.display = 'none';
      hide(tag, ...slots);
      return { s, tiles, slots, tag, color: s.eq === 1 ? BLUE : AMB };
    });
    const conn = (b, ti, si) => {
      const a = rel(stage, b.tiles[ti]), z = rel(stage, b.slots[si]);
      const x1 = a.x + a.w / 2, y1 = a.y + a.h + 2, x2 = z.x + z.w / 2, y2 = z.y - 4, my = (y1 + y2) / 2;
      return S('path', { d: `M${x1} ${y1} C${x1} ${my} ${x2} ${my} ${x2} ${y2}`, fill: 'none', stroke: b.color, 'stroke-width': 3, 'stroke-opacity': 0.55, class: 'bk-stroke', 'stroke-linecap': 'round' }, svg);
    };
    const steps = [];
    blocks.forEach((b, bi) => {
      steps.push({ cap: d.caps[bi], run: async (c) => {
        for (let ti = 0; ti < b.s.map.length; ti++) {
          b.tiles[ti].classList.add(b.s.eq === 1 ? 'u8l7-t1on' : 'u8l7-t2on');
          for (const si of b.s.map[ti]) {
            const p = conn(b, ti, si); await drawIn(p, 380, c);
            await fly(c, stage, [b.tiles[ti]], b.slots[si], { color: b.color, ms: 520 });
            b.slots[si].classList.add(b.s.eq === 1 ? 'u8l7-s1' : 'u8l7-s2'); await pop(c, b.slots[si], 260);
          }
        }
        await show(c, b.tag);
      } });
    });
    const extra = d.back || d.trap;
    const bp = panel(stage, 16, d.sents.length > 1 ? 380 : 236, W - 32, d.sents.length > 1 ? 54 : 74, '', 'u8l7-trback');
    if (d.trap) {
      const wr = h('div', 'u8l7-wrong', `<span class="u8l7-wx">✗</span><span class="u8l7-wtex">${T(d.trap.wrong)}</span><span class="u8l7-wtxt">a common trap</span>`); bp.appendChild(wr); hide(wr);
      steps.push({ cap: 'A common trap: writing the words in the order they are <b>said</b>.', run: async (c) => { await show(c, wr); } });
    }
    const lines = extra.lines.map((t) => { const e = h('div', 'u8l7-backl', T(t)); bp.appendChild(e); return e; });
    hide(...lines);
    steps.push({ cap: extra.cap, run: async (c) => { for (const e of lines) await show(c, e); } });
    return steps;
  }
};

/* =============================== Stage 4: does it make sense? =============================== */
const S4 = {
  whole: { label: 'Whole numbers?', story: 'Jo’s cousin counts <b>10 hats</b> and <b>29 legs</b> on the hens (2 legs) and cows (4 legs). How many of each are there?',
    lets: 'Let $h$ = number of hens, $c$ = number of cows', e1: 'h+c=10', e2: '2h+4c=29', solTex: 'h=5.5,\\ c=4.5',
    ck1: { l: ['h+c', '5.5+4.5', '10'], r: ['10', null, '10'] }, ck2: { l: ['2h+4c', '11+18', '29'], r: ['29', null, '29'] },
    words: [['Totals add up', true], ['Counts are whole', false], ['Positive', true], ['Answers the question', true]],
    bad: 'You can’t have <b>4.5 cows</b>: counts of animals must be whole numbers.', verdict: 'Both equations check, but the <b>words</b> fail: the cousin miscounted. (Every animal has an even number of legs.)' },
  pos: { label: 'Positive?', story: 'Sam is <b>12 years older</b> than his cousin Lee. The sum of their ages is <b>8</b>. How old is each of them?',
    lets: 'Let $s$ = Sam’s age, $l$ = Lee’s age, in years', e1: 's+l=8', e2: 's=l+12', solTex: 's=10,\\ l=-2',
    ck1: { l: ['s+l', '10+(-2)', '8'], r: ['8', null, '8'] }, ck2: { l: ['s', null, '10'], r: ['l+12', '-2+12', '10'] },
    words: [['Totals add up', true], ['Whole numbers', true], ['Positive', false], ['Answers the question', true]],
    bad: 'An age of <b>−2 years</b> is impossible: ages must be positive.', verdict: 'The equations check, but <b>no such cousins exist</b>: 12 years older doesn’t fit a total of 8.' },
  q: { label: 'The right question?', story: 'A snack stand sold popcorn at <b>$4</b> and pretzels at <b>$3</b>: <b>20 items</b> for <b>$72</b>. <b>How much money came from popcorn?</b>',
    lets: 'Let $p$ = bags of popcorn, $r$ = pretzels sold', e1: 'p+r=20', e2: '4p+3r=72', solTex: 'p=12,\\ r=8',
    ck1: { l: ['p+r', '12+8', '20'], r: ['20', null, '20'] }, ck2: { l: ['4p+3r', '48+24', '72'], r: ['72', null, '72'] },
    words: [['Totals add up', true], ['Counts are whole', true], ['Positive', true], ['Answers the question', false]],
    bad: 'The question asks for <b>money</b>, not a count: 12 bags × $4 = <b>$48</b>.', verdict: '“12” solves the system but answers the wrong question. The answer is <b>$48 from popcorn</b>.' }
};
const step4 = {
  title: 'Solved correctly … but does it make sense?',
  height: 452,
  minW: 940,
  choices: Object.keys(S4).map((k) => ({ v: k, label: S4[k].label })),
  intro: (k) => `${S4[k].label} Read the problem, then press <b>Next</b>.`,
  make(stage, k, ex) {
    const d = S4[k], W = ex.W, LW = 420, RX = LW + 26, RW = W - RX - 12, CW = (RW - 12) / 2;
    const sp = panel(stage, 12, 8, LW, 126, 'The problem'); sp.appendChild(h('div', 'u8l7-story u8l7-s4story', d.story));
    const eqp = panel(stage, 12, 142, LW, 156, 'Stages 1–3', 'u8l7-idle');
    const lt = h('div', 'u8l7-s4let', d.lets.replace(/\$(\w)\$/g, (m, v) => T(v)));
    const e1 = h('div', 'u8l7-eq', `<span class="u8l7-tag u8l7-t1">Eq. 1</span>${T(`\\B{${d.e1}}`)}`), e2 = h('div', 'u8l7-eq', `<span class="u8l7-tag u8l7-t2">Eq. 2</span>${T(`\\A{${d.e2}}`)}`);
    const so = h('div', 'u8l7-sol', T(`\\P{${d.solTex}}`));
    eqp.append(lt, e1, e2, so); hide(lt, e1, e2, so);
    const k1 = checkCard(stage, { title: 'Check Eq. 1', left: d.ck1.l, right: d.ck1.r, ok: true, x: RX, y: 8, width: CW, hidden: true, cls: 'u8l7-ckc u8l7-ckc1' });
    const k2 = checkCard(stage, { title: 'Check Eq. 2', left: d.ck2.l, right: d.ck2.r, ok: true, x: RX + CW + 12, y: 8, width: CW, hidden: true, cls: 'u8l7-ckc u8l7-ckc2' });
    const wp = panel(stage, 12, 306, W - 24, 140, 'Check against the words', 'u8l7-idle');
    const wrow = h('div', 'u8l7-wrow'); wp.appendChild(wrow);
    const ws = d.words.map(([t, ok]) => { const e = h('div', 'u8l7-wbox', `<b>${t}</b>`); wrow.appendChild(e); e.ok = ok; return e; });
    const bad = h('div', 'u8l7-bad', d.bad); wp.appendChild(bad); hide(bad, ...ws);
    return [
      { cap: `Stages 1–3 give ${T(`\\P{${d.solTex}}`)}.`, run: async (c) => { live(eqp); for (const e of [lt, e1, e2]) await show(c, e, 260); await pop(c, so); } },
      { cap: 'Check in <b>both</b> equations: both sides come out equal.', run: async (c) => { await k1.play(c, 260); await k2.play(c, 260); } },
      { cap: 'Now check against the <b>words</b>: totals, whole counts, positive amounts, and the question that was asked.', run: async (c) => {
        live(wp);
        for (const e of ws) {
          await show(c, e, 240);
          const s = stamp(e, e.ok ? '✓' : '✗', { ok: e.ok, x: e.offsetWidth - 24, y: 22, size: 'sm' }); await stampIn(c, s);
          if (e.ok === false) { e.classList.add('u8l7-fail'); await show(c, bad); }
        }
      } },
      { cap: d.verdict, run: async (c) => { const s = stamp(stage, k === 'q' ? 'wrong question' : 'makes no sense', { ok: false, x: RX + RW / 2, y: 254, rotate: -6 }); await stampIn(c, s); } }
    ];
  }
};

/* =============================== Section 2: bar models (number and age) =============================== */
const BR = {
  walk: { label: 'Walkthrough', text: 'Two numbers have a sum of <b>22</b>; the larger is <b>6 more</b> than the smaller.', kind: 'more', k: 6, total: 22,
    small: 'S', big: 'L', names: ['larger', 'smaller'], unk: 'The smaller number', bigW: 'the larger number', eqT: 'L+S=22', eqC: 'L=S+6', cmp: '6 more than the smaller',
    answer: 'The numbers are <b>14</b> and <b>8</b>.' },
  ex1: { label: 'Example 1 check', text: 'There are <b>30</b> students in Ms. Alvarez’s classroom. There are <b>8 more</b> girls than boys.', kind: 'more', k: 8, total: 30,
    small: 'b', big: 'g', names: ['girls', 'boys'], unk: 'The number of boys', bigW: 'the girls', eqT: 'b+g=30', eqC: 'g=b+8', cmp: '8 more girls than boys',
    answer: '<b>11 boys</b> and <b>19 girls</b>.' },
  ex2: { label: 'Example 2 check', text: 'Jordan is <b>5 years older</b> than his sister Ava. The sum of their ages is <b>27</b>.', kind: 'more', k: 5, total: 27,
    small: 'A', big: 'J', names: ['Jordan', 'Ava'], unk: 'Ava’s age', bigW: 'Jordan', eqT: 'J+A=27', eqC: 'J=A+5', cmp: '5 years older than Ava',
    answer: '<b>Jordan is 16</b> and <b>Ava is 11</b>.' },
  times: { label: '4 times as old', text: 'Kim’s mom is <b>4 times</b> as old as Kim. The sum of their ages is <b>50</b>.', kind: 'times', m: 4, total: 50,
    small: 'K', big: 'M', names: ['Mom', 'Kim'], unk: 'Kim’s age', bigW: 'Mom', eqT: 'K+M=50', eqC: 'M=4K', cmp: '4 times as old as Kim',
    answer: '<b>Kim is 10</b> and her <b>mom is 40</b>.' }
};
const bars = {
  title: 'A bar model: the bigger bar is the smaller bar plus a bit',
  height: 452,
  minW: 900,
  choices: [{ v: 'walk', label: BR.walk.label }, { v: 'ex1', label: BR.ex1.label }, { v: 'ex2', label: BR.ex2.label }, { sep: 'More' }, { v: 'times', label: BR.times.label }],
  intro: (k) => `${BR[k].label}: one bar for each unknown. Press <b>Next</b>.`,
  make(stage, k, ex) {
    const d = BR[k], W = ex.W, more = d.kind === 'more';
    const s = more ? (d.total - d.k) / 2 : d.total / (d.m + 1), b = more ? s + d.k : d.m * s;
    qbar(stage, 12, 8, W - 24, 50, d.text);
    const X0 = 200, maxBar = W - X0 - 250, sc = maxBar / b, BH = 48, Y1 = 78, Y2 = 140;
    const rowLab = (y, name, v) => add(stage, box(h('div', 'u8l7-blab', `${name} ${T(v)}`), 176, BH), 12, y);
    const lab1 = rowLab(Y1, d.names[1], d.small), lab2 = rowLab(Y2, d.names[0], d.big);
    const piece = (x, y, wd, txt, cls) => add(stage, box(h('div', 'u8l7-piece ' + cls, T(txt)), wd, BH), x, y);
    const sBar = piece(X0, Y1, s * sc, d.small, 'u8l7-pS');
    const bPieces = [];
    if (more) { bPieces.push(piece(X0, Y2, s * sc, d.small, 'u8l7-pS')); bPieces.push(piece(X0 + s * sc, Y2, d.k * sc, String(d.k), 'u8l7-pK')); }
    else for (let i = 0; i < d.m; i++) bPieces.push(piece(X0 + i * s * sc, Y2, s * sc, d.small, 'u8l7-pS'));
    hide(lab1, lab2, sBar, ...bPieces);
    /* the brace for the total, right of the longer bar */
    const bx = X0 + b * sc + 14;
    const svg = S('svg', { width: W, height: 452, viewBox: `0 0 ${W} 452`, class: 'u8l7-bsvg' }); stage.insertBefore(svg, stage.firstChild);
    const brace = S('path', { d: `M${bx} ${Y1} q12 0 12 14 V${(Y1 + Y2 + BH) / 2 - 10} q0 10 12 10 q-12 0 -12 10 V${Y2 + BH - 14} q0 14 -12 14`, fill: 'none', stroke: BLUE, 'stroke-width': 3, class: 'bk-stroke' }, svg);
    brace.style.opacity = 0;
    const tot = add(stage, h('div', 'u8l7-btot', T(String(d.total))), bx + 34, (Y1 + Y2 + BH) / 2 - 18); hide(tot);
    /* the algebra, below */
    const P = panel(stage, 12, 214, W - 24, 230, '', 'u8l7-bpan');
    const colL = h('div', 'u8l7-bcol'), colR = h('div', 'u8l7-bcol'); P.append(colL, colR);
    const L = (col, html, cls = '') => { const e = h('div', 'u8l7-bl ' + cls, html); col.appendChild(e); hide(e); return e; };
    const let1 = L(colL, `Let ${T(d.small)} = ${k === 'times' ? 'Kim’s age' : k === 'ex2' ? 'Ava’s age' : k === 'ex1' ? 'the number of boys' : 'the smaller number'}`);
    const let2 = L(colL, `Let ${T(d.big)} = ${k === 'times' ? 'Mom’s age' : k === 'ex2' ? 'Jordan’s age' : k === 'ex1' ? 'the number of girls' : 'the larger number'}`);
    const eC = L(colL, `<span class="u8l7-tag u8l7-t2">compare</span>${T(`\\A{${d.eqC}}`)}`);
    const eT = L(colL, `<span class="u8l7-tag u8l7-t1">total</span>${T(`\\B{${d.eqT}}`)}`);
    const subIn = more ? `(\\A{${d.small}+${d.k}})` : `\\A{${d.m}${d.small}}`;
    const subTex = d.eqT.replace(d.big, subIn);
    const sub = L(colR, T(subTex));
    const simp = more ? L(colR, T(`2${d.small}+${d.k}=${d.total}`)) : L(colR, T(`${d.m + 1}${d.small}=${d.total}`));
    const take = more ? L(colR, T(`2${d.small}=${d.total - d.k}\\ \\Rightarrow\\ ${d.small}=${s}`)) : L(colR, T(`${d.small}=${d.total}\\div${d.m + 1}=${s}`));
    const back = L(colR, T(more ? `${d.big}=${s}+${d.k}=${b}` : `${d.big}=${d.m}(${s})=${b}`));
    const sol = L(colR, T(`\\P{${d.small}=${s},\\ ${d.big}=${b}}`), 'u8l7-sol');
    const relabel = () => { sBar.innerHTML = T(String(s)); bPieces.forEach((p, i) => { if (!(more && i === 1)) p.innerHTML = T(String(s)); }); };
    const steps = [
      { cap: `<b>${d.unk}</b> is the unknown block: call it ${T(d.small)}.`, run: async (c) => {
        await show(c, lab1); sBar.style.opacity = 1; await anim(c, sBar, [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)' }], 600); await show(c, let1);
      } }
    ];
    if (more) steps.push({ cap: `“${d.cmp}”: the bar for ${d.bigW} is one ${T(d.small)} block <b>plus ${d.k} more</b>. ${T(`\\A{${d.eqC}}`)}`, run: async (c) => {
      await show(c, lab2); await show(c, let2); await pop(c, bPieces[0]); await pop(c, bPieces[1]); await show(c, eC);
    } });
    else steps.push({ cap: `“${d.cmp}”: the bar for ${d.bigW} is <b>${d.m}</b> ${T(d.small)} blocks. ${T(`\\A{${d.eqC}}`)}`, run: async (c) => {
      await show(c, lab2); await show(c, let2); for (const p of bPieces) await pop(c, p, 300); await show(c, eC);
    } });
    steps.push({ cap: `Together they make <b>${d.total}</b>: ${T(`\\B{${d.eqT}}`)}. Swap ${T(d.big)} for what it equals: ${T(subTex)}.`, run: async (c) => {
      brace.style.opacity = 1; await drawIn(brace, 500, c); await pop(c, tot); await show(c, eT); await show(c, sub); await show(c, simp);
    } });
    if (more) {
      steps.push({ cap: `Take away the extra ${d.k}: the two ${T(d.small)} blocks make ${T(`${d.total}-${d.k}=${d.total - d.k}`)}, so each block is ${T(`${d.total - d.k}\\div2=${s}`)}.`, run: async (c) => {
        await anim(c, bPieces[1], [{ opacity: 1, transform: 'none' }, { opacity: 0.28, transform: 'translateY(8px)' }], 600);
        bPieces[1].classList.add('u8l7-gone');
        tot.innerHTML = T(`${d.total}-${d.k}=${d.total - d.k}`); await pulse(c, tot, 1.12);
        relabel(); await show(c, take);
      } });
      steps.push({ cap: `So ${T(`${d.small}=${s}`)}, and the bar for ${d.bigW} is ${T(`${s}+${d.k}=${b}`)}.`, run: async (c) => {
        bPieces[1].classList.remove('u8l7-gone'); await anim(c, bPieces[1], [{ opacity: 0.28, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], 400);
        tot.innerHTML = T(String(d.total)); await show(c, back); await pop(c, sol);
      } });
    } else {
      steps.push({ cap: `Count the blocks: <b>${d.m + 1}</b> equal blocks make ${d.total}, so each block is ${T(`${d.total}\\div${d.m + 1}=${s}`)}.`, run: async (c) => {
        relabel(); for (const p of [sBar, ...bPieces]) await pulse(c, p, 1.06, 260); await show(c, take);
      } });
      steps.push({ cap: `So ${T(`${d.small}=${s}`)}, and the bar for ${d.bigW} is ${T(`${d.m}\\times${s}=${b}`)}.`, run: async (c) => { await show(c, back); await pop(c, sol); } });
    }
    steps.push({ cap: `Check: ${T(more ? `${s}+${b}=${d.total}` : `${s}+${b}=${d.total}`)} ✓ and ${T(more ? `${b}=${s}+${d.k}` : `${b}=${d.m}(${s})`)} ✓. ${d.answer}`, run: async (c) => {
      const st = stamp(stage, `✓ ${s} and ${b}`, { ok: true, x: W - 150, y: 330 }); await stampIn(c, st);
    } });
    return steps;
  }
};

/* =============================== Section 3: count vs value (swap → elimination) =============================== */
const SW = {
  ex3: { label: 'Example 3 check', q: 'Hot dogs cost <b>$3</b> and juice boxes cost <b>$2</b>. The canteen sold <b>40</b> items for <b>$97</b>. How many of each?',
    n: 40, lo: 2, hi: 3, total: 97, vl: 'j', vh: 'h', kind: 'item', nameLo: 'juice box', nameHi: 'hot dog', plLo: 'juice boxes', plHi: 'hot dogs', money: true, per: 10,
    e1: 'h+j=40', e2: '3h+2j=97', m: '2h+2j=80', r: 'h=97-80=17', back: 'j=40-17=23' },
  ex4: { label: 'Example 4 check', q: 'Student tickets cost <b>$5</b> and adult tickets cost <b>$8</b>. <b>50</b> tickets were sold for <b>$316</b>. How many of each?',
    n: 50, lo: 5, hi: 8, total: 316, vl: 's', vh: 'a', kind: 'ticket', nameLo: 'student ticket', nameHi: 'adult ticket', plLo: 'student tickets', plHi: 'adult tickets', money: true, per: 10, swapLab: 'student → adult',
    e1: 's+a=50', e2: '5s+8a=316', m: '5s+5a=250', r: '3a=66\\ \\Rightarrow\\ a=22', back: 's=50-22=28' },
  hens: { label: 'Warm-up: hens and cows', q: 'Hens have <b>2</b> legs and cows have <b>4</b>. There are <b>10</b> animals and <b>28</b> legs. How many of each?',
    n: 10, lo: 2, hi: 4, total: 28, vl: 'h', vh: 'c', kind: 'animal', nameLo: 'hen', nameHi: 'cow', plLo: 'hens', plHi: 'cows', money: false, per: 10,
    e1: 'h+c=10', e2: '2h+4c=28', m: '2h+2c=20', r: '2c=8\\ \\Rightarrow\\ c=4', back: 'h=10-4=6' }
};
const swap = {
  title: 'One equation counts, the other totals value',
  height: 520,
  minW: 920,
  choices: [{ v: 'ex3', label: SW.ex3.label }, { v: 'ex4', label: SW.ex4.label }, { sep: 'Compare' }, { v: 'hens', label: SW.hens.label }],
  intro: (k) => `${SW[k].label}: start with a guess and fix it one swap at a time. Press <b>Next</b>.`,
  make(stage, k, ex) {
    const d = SW[k], W = ex.W, all = d.n * d.lo, short = d.total - all, step = d.hi - d.lo, nh = short / step, nl = d.n - nh;
    const big = d.n <= 12, per = d.per, gap = big ? 14 : 8, bw = big ? 70 : Math.min(68, Math.floor((W - 28 - (per - 1) * gap) / per)), bh = big ? 70 : 36;
    const val = (v) => (d.money ? '$' + v : String(v));
    const unitW = d.money ? 'dollars' : 'legs';
    qbar(stage, 12, 8, W - 24, 52, d.q);
    const rowsN = Math.ceil(d.n / per), totW = per * (bw + gap) - gap, x0 = (W - totW) / 2, top = 72;
    const items = [];
    for (let i = 0; i < d.n; i++) {
      const r = Math.floor(i / per), cI = i % per;
      const e = add(stage, box(h('div', 'u8l7-money ' + (big ? 'u8l7-coin' : 'u8l7-bill'), '?'), bw, bh), x0 + cI * (bw + gap), top + r * (bh + 10));
      e.style.opacity = 0; items.push(e);
    }
    const cy = top + rowsN * (bh + 10) + 4;
    const ctr = (x, label, cls) => add(stage, box(h('div', 'u8l7-ctr ' + cls, `<div class="u8l7-ck-l">${label}</div><div class="u8l7-ck-v">–</div>`), 270, 74), x, cy);
    const cx0 = (W - 3 * 270 - 2 * 18) / 2;
    const cCount = ctr(cx0, `Count (Eq. 1): ${d.kind}s`, 'u8l7-cc1'), cVal = ctr(cx0 + 288, `Value (Eq. 2): ${unitW}`, 'u8l7-cc2'), cSw = ctr(cx0 + 576, `Swaps: ${d.swapLab || `${d.nameLo} → ${d.nameHi}`}`, 'u8l7-cc3');
    const setV = (e, v) => { e.querySelector('.u8l7-ck-v').textContent = v; };
    hide(cCount, cVal, cSw);
    const py = cy + 86, ep = panel(stage, 30, py, W - 60, 520 - py - 8, '', 'u8l7-swpan');
    const colL = h('div', 'u8l7-swcol'), colR = h('div', 'u8l7-swcol'); ep.append(colL, colR);
    const L = (col, t, tag) => { const e = h('div', 'u8l7-sl', (tag || '') + T(t)); col.appendChild(e); hide(e); return e; };
    const l1 = L(colL, `\\B{${d.e1}}`, '<span class="u8l7-tag u8l7-t1">Eq. 1</span>'), l2 = L(colL, `\\A{${d.e2}}`, '<span class="u8l7-tag u8l7-t2">Eq. 2</span>');
    const l3 = L(colR, d.m, `<span class="u8l7-tag u8l7-tx">${d.lo} × Eq. 1</span>`);
    const l4 = L(colR, d.r, '<span class="u8l7-tag u8l7-tx">subtract</span>');
    const l5 = L(colR, `${d.back}`, '<span class="u8l7-tag u8l7-tx">back</span>');
    const face = (e, v) => { e.textContent = val(v); e.classList.toggle('u8l7-hi', v === d.hi); e.classList.toggle('u8l7-lo', v === d.lo); };
    return [
      { cap: `<b>Count</b> first: every ${d.kind} counts as <b>1</b>, whatever it is worth. ${d.n} ${d.kind}s: ${T(`\\B{${d.e1}}`)}.`, run: async (c) => {
        await show(c, cCount, 200);
        for (let i = 0; i < d.n; i++) { setV(cCount, i + 1); await pop(c, items[i], c.fast ? 0 : (d.n > 20 ? 70 : 140)); }
        await show(c, l1);
      } },
      { cap: `<b>Value</b> totals ${unitW} instead: ${T(`\\A{${d.e2}}`)}. Guess: all ${d.n} are ${d.plLo}. That is worth ${T(`${d.n}\\times${d.lo}=${all}`)} ${unitW}.`, run: async (c) => {
        await show(c, l2); await show(c, cVal, 200); items.forEach((e) => face(e, d.lo)); setV(cVal, val(all)); await pulse(c, cVal, 1.06);
      } },
      { cap: `We need ${val(d.total)}${d.money ? '' : ' legs'}: short by <b>${short}</b>. Swap one ${d.nameLo} for ${/^[aeiou]/.test(d.nameHi) ? 'an' : 'a'} ${d.nameHi}: still ${d.n} ${d.kind}s, but <b>${step} more</b>.`, run: async (c) => {
        await show(c, cSw, 200); setV(cSw, 0);
        const e = items[d.n - 1]; await c.anim(e, [{ transform: 'rotateY(0deg)' }, { transform: 'rotateY(90deg)' }], 200); face(e, d.hi); await c.anim(e, [{ transform: 'rotateY(90deg)' }, { transform: 'rotateY(0deg)' }], 200);
        setV(cSw, 1); setV(cVal, val(all + step));
      } },
      { cap: `Each swap adds ${step}, so we need ${T(`${short}\\div${step}=${nh}`)} swaps.`, run: async (c) => {
        for (let j = 2; j <= nh; j++) {
          const e = items[d.n - j]; face(e, d.hi); await pop(c, e, c.fast ? 0 : (nh > 10 ? 110 : 200));
          setV(cSw, j); setV(cVal, val(all + j * step));
        }
        await pulse(c, cVal, 1.1);
      } },
      { cap: `That is <b>elimination</b>! “All ${d.plLo}” is ${d.lo} × Eq. 1: ${T(d.m)}. Subtract it from Eq. 2 and only the swaps are left.`, run: async (c) => { await show(c, l3); await show(c, l4); } },
      { cap: `${T(`${d.vh}=${nh}`)} ${d.plHi} and ${T(`${d.vl}=${nl}`)} ${d.plLo}. Check: ${T(`${nl}+${nh}=${d.n}`)} ✓ and ${T(`${d.lo}(${nl})+${d.hi}(${nh})=${d.lo * nl}+${d.hi * nh}=${d.total}`)} ✓.`, run: async (c) => {
        await show(c, l5); const s = stamp(stage, `${d.vh} = ${nh}, ${d.vl} = ${nl}`, { ok: true, x: W - 200, y: Math.min(500, py + 96), size: 'sm' }); await stampIn(c, s);
      } }
    ];
  }
};

/* =============================== Section 4: the mixer and the organizer (from 10C u8l5) =============================== */
let UID = 0; const uid = (p) => `u8l7${p}${++UID}`;
const hexA = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
const toHex = (a) => '#' + a.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('');
const mixHex = (a, b, t) => { const A = hexA(a), B = hexA(b); return toHex(A.map((v, i) => v + (B[i] - v) * t)); };
class Org extends ValueTable {
  _tmpl() { const o = this.o; this.grid.style.gridTemplateColumns = o.colW.map((w) => w + 'px').join(' '); this.grid.style.gridAutoRows = o.cellH + 'px'; }
}
const th = (top, unit) => ({ html: `<div class="u8l7-thw">${top}</div>` + (unit ? `<div class="u8l7-thu">${unit}</div>` : '') });
const OP = (s) => `<b class="u8l7-opx">${s}</b>`;
function clearHl(tb) { ['u8l7-hb', 'u8l7-ha', 'u8l7-hx', 'bk-hl'].forEach((k) => { tb.cells.forEach((r) => r.forEach((e) => e.classList.remove(k))); tb.heads.forEach((e) => e.classList.remove(k)); }); }
const line = (p, html, cls = '') => add(p, h('div', 'u8l7-line ' + cls, html));
function offIn(el, anc) { let x = 0, y = 0; while (el && el !== anc) { x += el.offsetLeft; y += el.offsetTop; el = el.offsetParent; } return [x, y]; }
async function lift(c, stage, fromEl, toEl, html) {
  if (c.fast) return;
  const [x0, y0] = offIn(fromEl, stage), [x1, y1] = offIn(toEl, stage);
  const chip = add(stage, h('div', 'u8l7-fly', html), x0 - 6, y0 - 4);
  await anim(c, chip, [{ transform: 'translate(0px, 0px) scale(1)' }, { transform: `translate(${(x1 - x0) / 2}px, ${(y1 - y0) / 2 - 30}px) scale(1.15)` }, { transform: `translate(${x1 - x0}px, ${y1 - y0}px) scale(1)` }], 900);
  chip.remove();
}

const MX = {
  ex5: { label: 'Example 5 check', unit: 'kg', mixName: 'Party mix', q: 'Cashews (<b>$8/kg</b>) and peanuts (<b>$3/kg</b>) make <b>20 kg</b> of party mix that sells for <b>$110</b>.',
    A: { name: 'Cashews', v: 'c', tag: '$8/kg', rate: '8', val: '8c', col: '#e2b878', amt: 10 },
    B: { name: 'Peanuts', v: 'p', tag: '$3/kg', rate: '3', val: '3p', col: '#a5652d', amt: 10 },
    tot: 20, value: 110, mprice: '5.50', eq1: 'c+p=20', eq2: '8c+3p=110' },
  candy: { label: 'A candy mix', unit: 'kg', mixName: 'Candy mix', q: 'Gummies (<b>$6/kg</b>) and chocolates (<b>$10/kg</b>) make <b>8 kg</b> of candy mix worth <b>$60</b>.',
    A: { name: 'Gummies', v: 'g', tag: '$6/kg', rate: '6', val: '6g', col: '#e2557a', amt: 5 },
    B: { name: 'Chocolates', v: 'c', tag: '$10/kg', rate: '10', val: '10c', col: '#5b3520', amt: 3 },
    tot: 8, value: 60, mprice: '7.50', eq1: 'g+c=8', eq2: '6g+10c=60' }
};
class Mixer {
  constructor(stage, x, y, w, hh, d) {
    const el = this.el = add(stage, box(h('div', 'u8l7-mixer'), w, hh), x, y);
    const svg = this.svg = S('svg', { width: w, height: hh, viewBox: `0 0 ${w} ${hh}` }, el);
    this.ov = add(el, box(h('div', 'u8l7-ov'), w, hh));
    const cM = mixHex(d.A.col, d.B.col, d.B.amt / d.tot);
    const bw = 128, bh = 90, top = 50, tip = top + bh + 44, xa = w * 0.23, xb = w * 0.77, mx = w / 2, mTop = tip + 56, mW = 190, mBot = hh - 12;
    this.A = this.hopper(xa, top, bw, bh, tip, d.A.col); this.B = this.hopper(xb, top, bw, bh, tip, d.B.col);
    this.M = this.tank(mx, mTop, mW, mBot, cM);
    const strm = (x0, x1, color) => {
      const p = S('path', { d: `M${x0} ${tip} C${x0} ${tip + 30} ${x1} ${mTop - 36} ${x1} ${mTop + 14}`, fill: 'none', stroke: color, 'stroke-width': 10, 'stroke-linecap': 'round' }, svg);
      const Ln = p.getTotalLength ? p.getTotalLength() : 200; p.style.strokeDasharray = `${Ln} ${Ln}`; p.style.strokeDashoffset = Ln; p.L = Ln; return p;
    };
    this.sA = strm(xa, mx - 34, d.A.col); this.sB = strm(xb, mx + 34, d.B.col);
    svg.appendChild(this.M.outline);
    const lab = (x, yy, html, pos, cls) => this.ov.appendChild(place(h('div', cls, html), x, yy, pos, 0));
    lab(xa, top - 8, d.A.name, 'n', 'u8l7-mname'); lab(xb, top - 8, d.B.name, 'n', 'u8l7-mname');
    lab(xa, top + 26, d.A.tag, 'c', 'u8l7-mtag'); lab(xb, top + 26, d.B.tag, 'c', 'u8l7-mtag');
    this.aA = hide0(lab(xa, top + 64, `${T(d.A.v)} ${d.unit}`, 'c', 'u8l7-mamt')); this.aB = hide0(lab(xb, top + 64, `${T(d.B.v)} ${d.unit}`, 'c', 'u8l7-mamt'));
    this.mLab = hide0(lab(mx, (mTop + mBot) / 2 + 14, `<b>${d.tot} ${d.unit}</b><br>$${d.value} in all`, 'c', 'u8l7-mtag u8l7-mmix'));
    this.mName = hide0(lab(mx, mTop - 4, d.mixName, 'n', 'u8l7-mname'));
    this.lvA = 0.88; this.lvB = 0.88; this.A.set(0.88); this.B.set(0.88); this.M.set(0);
    this.d = d;
  }
  hopper(xc, top, bw, bh, tip, color) {
    const d = `M${xc - bw / 2} ${top} L${xc + bw / 2} ${top} L${xc + bw / 2} ${top + bh} L${xc + 9} ${tip} L${xc - 9} ${tip} L${xc - bw / 2} ${top + bh} Z`, id = uid('c');
    S('path', { d }, S('clipPath', { id }, this.svg));
    const r = S('rect', { x: xc - bw / 2, width: bw, fill: color, 'clip-path': `url(#${id})` }, this.svg);
    S('path', { d, fill: 'none', stroke: INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, this.svg);
    return { set: (lv) => { const yy = tip - lv * (tip - top); r.setAttribute('y', yy); r.setAttribute('height', Math.max(0, tip - yy)); } };
  }
  tank(xc, top, w, bot, color) {
    const xl = xc - w / 2, xr = xc + w / 2, rr = 18, id = uid('c');
    const d = `M${xl} ${top} L${xl} ${bot - rr} Q${xl} ${bot} ${xl + rr} ${bot} L${xr - rr} ${bot} Q${xr} ${bot} ${xr} ${bot - rr} L${xr} ${top}`;
    S('path', { d: d + ' Z' }, S('clipPath', { id }, this.svg));
    S('path', { d: d + ' Z', fill: '#fff' }, this.svg);
    const r = S('rect', { x: xl, width: w, fill: color, 'clip-path': `url(#${id})` }, this.svg);
    const outline = S('path', { d, fill: 'none', stroke: INK, 'stroke-width': 3.5, 'stroke-linejoin': 'round' });
    return { outline, set: (lv) => { const yy = bot - lv * (bot - top); r.setAttribute('y', yy); r.setAttribute('height', Math.max(0, bot - yy)); } };
  }
  async pour(c) {
    const d = this.d, dA = 0.62 * d.A.amt / d.tot, dB = 0.62 * d.B.amt / d.tot;
    await Promise.all([anim(c, this.sA, [{ strokeDashoffset: this.sA.L }, { strokeDashoffset: 0 }], 450), anim(c, this.sB, [{ strokeDashoffset: this.sB.L }, { strokeDashoffset: 0 }], 450)]);
    await tween(c, 1800, (t) => { this.A.set(this.lvA - dA * t); this.B.set(this.lvB - dB * t); this.M.set(0.8 * t); });
    await Promise.all([anim(c, this.sA, [{ opacity: 1 }, { opacity: 0 }], 300), anim(c, this.sB, [{ opacity: 1 }, { opacity: 0 }], 300)]);
    await show(c, this.mName); await pop(c, this.mLab);
  }
}
const mixPour = {
  title: 'Two ingredients, one mixture: Amount × Price = Value',
  height: 500,
  minW: 940,
  choices: [{ v: 'ex5', label: MX.ex5.label }, { sep: 'More' }, { v: 'candy', label: MX.candy.label }],
  intro: (k) => `${MX[k].A.name} and ${MX[k].B.name.toLowerCase()} are about to be mixed. Watch the organizer fill as they pour. Press <b>Next</b>.`,
  make(stage, k, ex) {
    const d = MX[k], W = ex.W, MW = 390;
    qbar(stage, 12, 6, W - 24, 46, d.q);
    const M = new Mixer(stage, 0, 58, MW, 440, d);
    const OX = MW + 16, avail = W - OX - 12;
    const colW = [142, 112, 124, avail - 142 - 112 - 124 - 6];
    const tb = new Org(stage, { x: OX, y: 66, colW, cellH: 56, tap: false, q: '', cls: 'u8l7-orgx',
      headers: [{ html: '' }, th('Amount', `(${d.unit})`), th(`${OP('×')} Price`, '($/kg)'), th(`${OP('=')} Value`, '($)')],
      rows: [[{ html: d.A.name }, d.A.v, d.A.rate, d.A.val], [{ html: d.B.name }, d.B.v, d.B.rate, d.B.val], [{ html: d.mixName }, d.tot, d.mprice, d.value]],
      hide: (r, c) => c > 0 });
    const P = panel(stage, OX, 312, avail, 180, 'Two equations', 'u8l7-mpan');
    const n1 = line(P, `<span class="u8l7-ltag u8l7-tb">Amount</span> ${T(tc(BLUE, d.eq1))}`, 'u8l7-big'), n2 = line(P, `<span class="u8l7-ltag u8l7-ta">Value</span> ${T(tc(AMB, d.eq2))}`, 'u8l7-big');
    const n3 = line(P, `<span class="u8l7-ltag u8l7-tx">Price</span> ${T(`${d.A.rate}+${d.B.rate}=${+d.A.rate + +d.B.rate}\\ne${d.mprice}`)} <span class="u8l7-muted">never add prices</span>`);
    [n1, n2, n3].forEach(hide0);
    return [
      { cap: `${d.A.name} at <b>${d.A.tag}</b>, ${d.B.name.toLowerCase()} at <b>${d.B.tag}</b>. We don’t know how much of each: call them ${T(d.A.v)} and ${T(d.B.v)} kilograms.`,
        run: async (c) => { await Promise.all([pop(c, M.aA), pop(c, M.aB)]); for (const r of [0, 1]) { await tb.reveal(r, 1, c); await tb.reveal(r, 2, c); } } },
      { cap: `Pour them together: <b>${d.tot} kg</b> of ${d.mixName.toLowerCase()}, worth <b>$${d.value}</b> in all.`,
        run: async (c) => { await M.pour(c); await tb.reveal(2, 1, c); await tb.reveal(2, 3, c); } },
      { cap: '<b>Amount × Price = Value</b> in each ingredient row.',
        run: async (c) => { for (const r of [0, 1]) { tb.highlight(r, true); await tb.reveal(r, 3, c); await sleep(c, 250); tb.highlight(r, false); } } },
      { cap: `<b>Amount column:</b> the two amounts add up to the total. ${T(tc(BLUE, d.eq1))}`,
        run: async (c) => { clearHl(tb); tb.highlightCol(1, true, 'u8l7-hb'); await show(c, n1); } },
      { cap: `<b>Value column:</b> the two values add up to the total value. ${T(tc(AMB, d.eq2))}`,
        run: async (c) => { clearHl(tb); tb.highlightCol(3, true, 'u8l7-ha'); await show(c, n2); } },
      { cap: `<b>Prices are never added.</b> The mix costs ${T(`${d.value}\\div${d.tot}=${d.mprice}`)} dollars per kg: <b>between</b> $${Math.min(+d.A.rate, +d.B.rate)} and $${Math.max(+d.A.rate, +d.B.rate)}, not $${+d.A.rate + +d.B.rate}.`,
        run: async (c) => { clearHl(tb); tb.highlightCol(2, true, 'u8l7-hx'); await tb.reveal(2, 2, c); await show(c, n3); const s = stamp(n3, '✗', { ok: false, size: 'sm' }); s.classList.add('u8l7-inl'); await stampIn(c, s); } }
    ];
  }
};

const MS = {
  ex5: { label: 'Example 5 check', q: 'Cashews <b>$8/kg</b>, peanuts <b>$3/kg</b>: <b>20 kg</b> of party mix for <b>$110</b>. How many kg of each?',
    eq1: 'c+p=20', eq2: '8c+3p=110', tag1: 'weight', tag2: 'value', vs: ['c', 'p'], iv: 'p',
    iso: ['p=', '20-c'], sub: ['8c+3', '(20-c)', '=110'], work: ['8c+60-3c=110', '5c=50'], sol1: 'c=10', back: 'p=20-10=10', pt: [10, 10],
    g: { xmin: 0, xmax: 25, ymin: 0, ymax: 40, xstep: 5, ystep: 5, xlabels: 5, ylabels: 5, xtitle: 'c', ytitle: 'p' },
    f1: (x) => 20 - x, f2: (x) => (110 - 8 * x) / 3, words: '10 kg of cashews and 10 kg of peanuts',
    checks: [{ title: 'Weight', left: ['10+10', '20'], right: ['20', '20'] }, { title: 'Value', left: ['8(10)+3(10)', '80+30', '110'], right: ['110', null, '110'] }] },
  candy: { label: 'A candy mix', q: 'Gummies <b>$6/kg</b>, chocolates <b>$10/kg</b>: <b>8 kg</b> of candy mix worth <b>$60</b>. How many kg of each?',
    eq1: 'g+c=8', eq2: '6g+10c=60', tag1: 'weight', tag2: 'value', vs: ['g', 'c'], iv: 'g',
    iso: ['g=', '8-c'], sub: ['6', '(8-c)', '+10c=60'], work: ['48-6c+10c=60', '4c=12'], sol1: 'c=3', back: 'g=8-3=5', pt: [5, 3],
    g: { xmin: 0, xmax: 11, ymin: 0, ymax: 10, xstep: 1, ystep: 1, xlabels: 2, ylabels: 2, xtitle: 'g', ytitle: 'c' },
    f1: (x) => 8 - x, f2: (x) => (60 - 6 * x) / 10, words: '5 kg of gummies and 3 kg of chocolates',
    checks: [{ title: 'Weight', left: ['5+3', '8'], right: ['8', '8'] }, { title: 'Value', left: ['6(5)+10(3)', '30+30', '60'], right: ['60', null, '60'] }] }
};
const mixSolve = {
  title: 'Substitute, graph, check both',
  height: 548,
  minW: 920,
  choices: [{ v: 'ex5', label: MS.ex5.label }, { sep: 'More' }, { v: 'candy', label: MS.candy.label }],
  intro: (k) => `${k === 'ex5' ? 'The system from Example 5 (a)' : 'The candy mix'}. One variable has coefficient 1, so substitution is quick. Press <b>Next</b>.`,
  make(stage, k, ex) {
    const d = MS[k], GW = 440, [a, b] = d.vs, pt = d.pt;
    qbar(stage, 12, 6, ex.W - 24, 46, d.q);
    const G = new Graph(stage, Object.assign({ x: ex.W - GW - 10, y: 62, width: GW, height: 476, fontSize: 16 }, d.g));
    const P = panel(stage, 12, 62, ex.W - GW - 34, 476, 'Solve by substitution', 'u8l7-mpan');
    const work = add(P, h('div', 'u8l7-work')), checks = add(P, h('div', 'u8l7-checks'));
    const L = (html, cls = '') => hide0(line(work, html, cls));
    const l1 = L(`<span class="u8l7-ltag u8l7-tb">${d.tag1}</span> ${T(tc(BLUE, d.eq1))}`), l2 = L(`<span class="u8l7-ltag u8l7-ta">${d.tag2}</span> ${T(tc(AMB, d.eq2))}`);
    const li = L(`<span class="u8l7-ltag u8l7-tb">isolate</span> ${T(d.iso[0])}<span class="u8l7-pc u8l7-src">${T(tc(BLUE, d.iso[1]))}</span>`);
    const ls = L(`<span class="u8l7-ltag">substitute</span> <span class="u8l7-pc">${T(d.sub[0])}</span><span class="u8l7-pc u8l7-dst">${T(tc(BLUE, d.sub[1]))}</span><span class="u8l7-pc">${T(d.sub[2])}</span>`);
    const dst = ls.querySelector('.u8l7-dst'); dst.style.opacity = 0;
    const lw = d.work.map((s) => L(`<span class="u8l7-ltag"></span> ${T(s)}`)), l5 = L(`<span class="u8l7-ltag"></span> ${T(tc(PUR, d.sol1))}`);
    const l6 = L(`<span class="u8l7-ltag u8l7-tb">back</span> ${T(d.back)}`), l7 = L(`<span class="u8l7-ltag u8l7-tp">solution</span> ${T(tc(PUR, `(${a},\\ ${b})=(${pt[0]},\\ ${pt[1]})`))}`, 'u8l7-big');
    return [
      { cap: `The system: the <b>${d.tag1}</b> equation and the <b>${d.tag2}</b> equation.`, run: async (c) => { await show(c, l1); await show(c, l2); } },
      { cap: `${T(d.iv)} has coefficient 1 in the ${d.tag1} equation, so isolate it: ${T(d.iso[0] + d.iso[1])}.`, run: (c) => show(c, li) },
      { cap: `<b>Replace ${T(d.iv)} with what it equals</b> in the ${d.tag2} equation. Keep the brackets!`,
        run: async (c) => { ls.style.opacity = 1; await lift(c, stage, li.querySelector('.u8l7-src'), dst, T(tc(BLUE, d.sub[1]))); dst.style.opacity = 1; await pulse(c, dst, 1.12); } },
      { cap: `Expand and collect: ${T(d.work[1])}, so ${T(tc(PUR, d.sol1))}.`, run: async (c) => { for (const e of lw) await show(c, e); await show(c, l5); } },
      { cap: `Back into ${T(d.iso[0] + d.iso[1])}: ${T(d.back)}. The solution is ${T(`(${pt[0]},\\ ${pt[1]})`)}.`, run: async (c) => { await show(c, l6); await pop(c, l7); } },
      { cap: `On a graph, the two lines cross at ${T(`(${pt[0]},\\ ${pt[1]})`)}: the only point on <b>both</b> lines.`,
        run: async (c) => {
          await G.drawIn(G.fn(d.f1, { color: BLUE, width: 4 }), 700, c); await G.drawIn(G.fn(d.f2, { color: AMB, width: 4 }), 700, c);
          await G.reveal(G.point(pt[0], pt[1], { color: PUR, r: 8, label: T(`(${pt[0]},\\ ${pt[1]})`), pos: 'ne' }), c);
        } },
      { cap: `<b>Check in BOTH equations.</b> The mix has ${d.words}.`,
        run: async (c) => {
          await anim(c, work, [{ opacity: 1 }, { opacity: 0 }], 300); work.style.display = 'none';
          line(checks, `${T(tc(PUR, `${a}=${pt[0]},\\ ${b}=${pt[1]}`))}`, 'u8l7-big');
          for (const ck of d.checks) { const k2 = checkCard(checks, { title: ck.title, left: ck.left, right: ck.right, ok: true, hidden: true }); await k2.play(c); }
        } }
    ];
  }
};

/* =============================== mount =============================== */
mountWarm();
export const explainers = mountExplainers({
  pipeline: pipeDef(['walk', 'hens']),
  translate, step4, bars, swap, mixPour, mixSolve,
  ex1chk: pipeDef(['ex1'], { sep: 'Example 1 check' }),
  ex2chk: pipeDef(['ex2'], { sep: 'Example 2 check' }),
  ex34chk: pipeDef(['ex3', 'ex4'], { sep: 'Check' })
});
export const _test = { PIPE, TR, S4, BR, SW, MX, MS };
void RED; void appear;

/* ============ Stand Up Break! — word problems with systems (lessons/js/standup.js) ============
 * Beginning: a sum and a "more than" / "older than" / "fewer than" comparison (substitution).
 * Progressing: a sum and a "times as many" comparison, or "k more / less than m times" (substitution).
 * Mastery: a count equation and a value equation (tickets, snacks, legs, wheels), solved by elimination.
 * Each story is built from its answer, so the numbers come out whole. Assignment 7's own numbers are skipped.
 * The key gives the let line, the system (Eq. 1 blue, Eq. 2 amber), the key solving step and the answer in words. */
{
  const half = (s, col) => { const i = s.indexOf('='); return `\\textcolor{${col}}{${s.slice(0, i)}}&\\textcolor{${col}}{${s.slice(i)}}`; };
  const sysT = (s1, s2) => `\\begin{aligned}${half(s1, BLUE)}\\\\${half(s2, AMB)}\\end{aligned}`;
  const W = (s) => `\\text{${s}}`;
  const P = (v) => `\\textcolor{${PUR}}{${v}}`;
  const co = (v) => (v === 1 ? '' : String(v));
  const TIMES = { 2: 'twice', 3: 'three times', 4: 'four times', 5: 'five times' };
  const PEOPLE = [['Maya', 'Leo'], ['Sofie', 'Ben'], ['Aiden', 'Priya'], ['Noah', 'Zara'], ['Ella', 'Tom'], ['Kai', 'Rosa'], ['Liam', 'Ivy'], ['Owen', 'Nina'], ['Hana', 'Dev'], ['Cole', 'Ruby']];
  const SKIP_MORE = ['18,9', '21,10', '13,7', '8,6', '11,8', '11,5'];      // Assignment 7 Q2, Q12, Q4 and the lesson's own examples
  const SKIP_TIMES = ['12,3', '13,3', '10,4'];                              // Assignment 7 Q3, Q5 and the bar-model demo

  /* ---------- Beginning: a sum and a "more than" ---------- */
  function beg(r) {
    for (;;) {
      const kind = r.int(0, 3), s = r.int(4, 30), k = r.int(2, 12), b = s + k, S2 = s + b;
      if (SKIP_MORE.includes(`${s},${k}`)) continue;
      if (kind === 0) {
        return { text: `The sum of two numbers is ${S2}. The larger number is ${k} more than the smaller number. Find the two numbers.`, q: '',
          atext: 'Let <i>L</i> be the larger number and <i>S</i> the smaller number.',
          a: [sysT(`L+S=${S2}`, `L=S+${k}`), `(S+${k})+S=${S2}\\ \\Rightarrow\\ 2S=${S2 - k}\\ \\Rightarrow\\ S=${s}`, `L=${s}+${k}=${b}`, `${W('The numbers are ')}${P(b)}${W(' and ')}${P(s)}.`] };
      }
      if (kind === 1) {
        if (s > 25) continue;
        const [x, y] = r.pick(PEOPLE), X = x[0], Y = y[0];
        return { text: `${x} is ${k} years older than ${y}. The sum of their ages is ${S2}. How old is each of them?`, q: '',
          atext: `Let <i>${X}</i> be ${x}’s age and <i>${Y}</i> be ${y}’s age, in years.`,
          a: [sysT(`${X}+${Y}=${S2}`, `${X}=${Y}+${k}`), `(${Y}+${k})+${Y}=${S2}\\ \\Rightarrow\\ 2${Y}=${S2 - k}\\ \\Rightarrow\\ ${Y}=${s}`, `${X}=${s}+${k}=${b}`,
            `${W(`${x} is `)}${P(b)}${W(` and ${y} is `)}${P(s)}.`] };
      }
      if (kind === 2) {
        return { text: `There are ${S2} students in the drama club. There are ${k} more girls than boys. How many boys and how many girls are in the club?`, q: '',
          atext: 'Let <i>b</i> be the number of boys and <i>g</i> the number of girls.',
          a: [sysT(`b+g=${S2}`, `g=b+${k}`), `b+(b+${k})=${S2}\\ \\Rightarrow\\ 2b=${S2 - k}\\ \\Rightarrow\\ b=${s}`, `g=${s}+${k}=${b}`, `${P(s)}${W(' boys and ')}${P(b)}${W(' girls')}`] };
      }
      return { text: `A shelf holds ${S2} books, fiction and non-fiction. There are ${k} fewer non-fiction books than fiction books. How many of each are there?`, q: '',
        atext: 'Let <i>f</i> be the number of fiction books and <i>n</i> the number of non-fiction books.',
        a: [sysT(`f+n=${S2}`, `n=f-${k}`), `f+(f-${k})=${S2}\\ \\Rightarrow\\ 2f=${S2 + k}\\ \\Rightarrow\\ f=${b}`, `n=${b}-${k}=${s}`, `${P(b)}${W(' fiction and ')}${P(s)}${W(' non-fiction')}`] };
    }
  }

  /* ---------- Progressing: a sum and a "times" comparison ---------- */
  const ELDERS = [['mom', 'her'], ['dad', 'his'], ['grandma', 'her'], ['grandpa', 'his'], ['aunt', 'her'], ['uncle', 'his']];
  function prg(r) {
    for (;;) {
      const kind = r.int(0, 3), m = r.pick([2, 3, 4, 5]), s = r.int(3, 16);
      if (kind === 0) {
        if (SKIP_TIMES.includes(`${s},${m}`)) continue;
        const b = m * s, S2 = s + b;
        return { text: `One number is ${TIMES[m]} another number. Their sum is ${S2}. Find the two numbers.`, q: '',
          atext: 'Let <i>x</i> be the larger number and <i>y</i> the smaller number.',
          a: [sysT(`x+y=${S2}`, `x=${m}y`), `${m}y+y=${S2}\\ \\Rightarrow\\ ${m + 1}y=${S2}\\ \\Rightarrow\\ y=${s}`, `x=${m}(${s})=${b}`, `${W('The numbers are ')}${P(b)}${W(' and ')}${P(s)}.`] };
      }
      if (kind === 1) {
        if (m < 3 || SKIP_TIMES.includes(`${s},${m}`)) continue;
        const [who] = r.pick(PEOPLE), [el] = r.pick(ELDERS), b = m * s, S2 = s + b, E = el[0].toUpperCase(), K = who[0] === E ? 'k' : who[0];
        return { text: `${who}’s ${el} is ${TIMES[m]} as old as ${who}. The sum of their ages is ${S2}. How old is each of them?`, q: '',
          atext: `Let <i>${K}</i> be ${who}’s age and <i>${E}</i> the ${el}’s age, in years.`,
          a: [sysT(`${K}+${E}=${S2}`, `${E}=${m}${K}`), `${K}+${m}${K}=${S2}\\ \\Rightarrow\\ ${m + 1}${K}=${S2}\\ \\Rightarrow\\ ${K}=${s}`, `${E}=${m}(${s})=${b}`,
            `${W(`${who} is `)}${P(s)}${W(` and the ${el} is `)}${P(b)}.`] };
      }
      const k = r.int(1, 9), more = kind === 2, b = more ? m * s + k : m * s - k, S2 = s + b;
      if (m > 3 || b <= s || (!more && `${S2},${m},${k}` === '40,3,4')) continue;   // Assignment 7 Q11: sum 40, 4 less than three times
      return { text: `The sum of two numbers is ${S2}. The larger number is ${k} ${more ? 'more' : 'less'} than ${TIMES[m]} the smaller number. Find the two numbers.`, q: '',
        atext: 'Let <i>x</i> be the larger number and <i>y</i> the smaller number.',
        a: [sysT(`x+y=${S2}`, `x=${m}y${more ? '+' : '-'}${k}`), `(${m}y${more ? '+' : '-'}${k})+y=${S2}\\ \\Rightarrow\\ ${m + 1}y=${more ? S2 - k : S2 + k}\\ \\Rightarrow\\ y=${s}`, `x=${b}`,
          `${W('The numbers are ')}${P(b)}${W(' and ')}${P(s)}.`] };
    }
  }

  /* ---------- Mastery: count and value, by elimination ---------- */
  const SETS = [
    { story: (N, V, lo, hi) => `At the school concert, student tickets cost $${lo} and adult tickets cost $${hi}. A total of ${N} tickets were sold for $${V}. How many of each kind were sold?`, p: 's', q: 'a', pl: ['student tickets', 'adult tickets'], lets: 'Let <i>s</i> be the number of student tickets and <i>a</i> the number of adult tickets.', money: true },
    { story: (N, V, lo, hi) => `A café sold muffins for $${lo} and smoothies for $${hi}. It sold ${N} items in all for $${V}. How many of each did it sell?`, p: 'm', q: 's', pl: ['muffins', 'smoothies'], lets: 'Let <i>m</i> be the number of muffins and <i>s</i> the number of smoothies.', money: true },
    { story: (N, V, lo, hi) => `The school store sold pens for $${lo} and binders for $${hi}. It sold ${N} items for a total of $${V}. How many pens and how many binders were sold?`, p: 'p', q: 'b', pl: ['pens', 'binders'], lets: 'Let <i>p</i> be the number of pens and <i>b</i> the number of binders.', money: true },
    { story: (N, V) => `A bike rack holds bicycles (2 wheels) and tricycles (3 wheels). There are ${N} bikes with ${V} wheels in all. How many of each are there?`, p: 'b', q: 't', pl: ['bicycles', 'tricycles'], lets: 'Let <i>b</i> be the number of bicycles and <i>t</i> the number of tricycles.', fixed: [2, 3] },
    { story: (N, V) => `A farm has chickens (2 legs) and pigs (4 legs). There are ${N} heads and ${V} legs. How many chickens and how many pigs are there?`, p: 'c', q: 'p', pl: ['chickens', 'pigs'], lets: 'Let <i>c</i> be the number of chickens and <i>p</i> the number of pigs.', fixed: [2, 4] }
  ];
  const SKIP_CV = ['7,11,9,79', '2,3,50,126', '30,45,120,4650', '1,2,45,76', '7,12,200,2000', '2,3,40,97', '5,8,50,316', '2,4,10,28'];
  function mas(r) {
    for (;;) {
      const set = r.pick(SETS);
      const lo = set.fixed ? set.fixed[0] : r.int(1, 6), hi = set.fixed ? set.fixed[1] : lo + r.int(1, 5);
      const N = r.int(10, 40), nq = r.int(2, N - 2), np = N - nq, V = lo * np + hi * nq;
      if (SKIP_CV.includes(`${lo},${hi},${N},${V}`)) continue;
      const p = set.p, q = set.q, dq = hi - lo, rhs = V - lo * N;
      const elim = lo === 1
        ? `${W('Subtract Eq. 1 from Eq. 2: ')}${co(dq)}${q}=${rhs}`
        : `${lo}\\times${W('Eq. 1: ')}${lo}${p}+${lo}${q}=${lo * N};\\ \\ ${W('subtract: ')}${co(dq)}${q}=${rhs}`;
      const solve = dq === 1 ? `${p}=${N}-${nq}=${np}` : `${q}=${rhs}\\div${dq}=${nq},\\quad ${p}=${N}-${nq}=${np}`;
      return { text: set.story(N, V, lo, hi), q: '', atext: set.lets,
        a: [sysT(`${p}+${q}=${N}`, `${co(lo)}${p}+${co(hi)}${q}=${V}`), elim, solve, `${P(np)}${W(` ${set.pl[0]} and `)}${P(nq)}${W(` ${set.pl[1]}`)}`] };
    }
  }
  standup('u8l7', {
    intro: 'All four stages on your whiteboard: define the two variables, write two equations, solve, and answer in a sentence.',
    levels: { BEG: beg, PRG: prg, MAS: mas }
  });
}
