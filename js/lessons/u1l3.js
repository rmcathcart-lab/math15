/* Math 15 · Unit 1 · Lesson 3 — Prime Factorization, GCF, and LCM (AN1)
 * Assignment 3 (u1_L03.tex, Questions 1–14) and the Lesson 3 Extra Practice (u1_EP03.tex, Questions 1–20), plus one
 * Mastery challenge. Built like the Math 10C Unit 1 Lessons 1–2 practice (factor lists, prime/composite with a proof,
 * division ladder and factor tree, GCF/LCM with the 10C diagnoses), at Math 15 pitch: smaller numbers, two or three
 * numbers at most, and the booklet's "by listing factors / multiples" and "by prime factorization" methods kept apart.
 * Every part is a generator (the booklet's numbers are among the possible values). No calculator.
 * Conversions: "explain" and "true or false, justify" → multiple choice whose options are reasons; "state GCF or LCM,
 * then solve" → a GCF/LCM box plus the answers. Levels (Math 15): LIM BEG EMG PRG ADV MAS. */
(function (root) {
  'use strict';
  var HW = root.HW, nt = HW.nt, F = HW.fmt, K = HW.kit, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;

  /* ---------- number helpers ---------- */
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var x = a % b; a = b; b = x; } return a; }
  function lcm(a, b) { return a / gcd(a, b) * b; }
  function gcfA(a) { return a.reduce(gcd); }
  function lcmA(a) { return a.reduce(lcm); }
  function prodOf(a) { return a.reduce(function (m, x) { return m * x; }, 1); }
  function sortN(a) { return a.slice().sort(function (x, y) { return x - y; }); }
  function expOf(n, p) { var e = 0; while (n > 0 && n % p === 0) { n /= p; e++; } return e; }
  function plainFac(n) { return nt.factor(n).map(function (pe) { return pe[1] > 1 ? pe[0] + '^' + pe[1] : String(pe[0]); }).join(' × '); }
  function eqv(n) { var f = K.fac(n); return f === String(n) ? F(n) : f + '=' + F(n); }
  function find(gen, test, fallback) { for (var i = 0; i < 800; i++) { var v = gen(); if (v && test(v)) return v; } return fallback; }
  function noneDivides(a) { for (var i = 0; i < a.length; i++) for (var j = 0; j < a.length; j++) if (i !== j && a[j] % a[i] === 0) return false; return true; }
  function range(a, b) { var o = []; for (var i = a; i <= b; i++) o.push(i); return o; }
  function nlist(nums) { var s = nums.map(function (n) { return t(F(n)); }); return s.length === 1 ? s[0] : s.length === 2 ? s[0] + ' and ' + s[1] : s.slice(0, -1).join(', ') + ', and ' + s[s.length - 1]; }
  function facEq(n) { return nt.isPrime(n) ? t(F(n)) + ' (prime)' : t(F(n) + '=' + K.fac(n)); }
  function facLines(nums) { return nums.map(facEq).join(', '); }
  function normX(s) { return String(s == null ? '' : s).replace(/(\d)\s*[xX]\s*(?=\d)/g, '$1*'); }
  var PR = nt.primesBetween(2, 200);
  function primesIn(a, b) { return PR.filter(function (p) { return p >= a && p <= b; }); }
  function sqrtNote(n) { return '\\sqrt{' + F(n) + '}\\approx ' + (Math.round(Math.sqrt(n) * 10) / 10); }

  /* ---------- solutions ---------- */
  function powList(n) { return nt.factor(n).map(function (pe) { return pe[1] > 1 ? pe[0] + '^{' + pe[1] + '}' : String(pe[0]); }).join(',\\ '); }
  function gcfSol(nums) {
    var g = gcfA(nums);
    return facLines(nums) + '.<br>' + (g === 1 ? 'They share no prime factor, so the GCF is ' + t('1') + '.' : 'Take only the primes in <b>every</b> factorization, each to its <b>lowest</b> power: ' + t(powList(g)) + '.<br>GCF ' + t('=' + eqv(g)) + '.');
  }
  function lcmSol(nums) { var L = lcmA(nums); return facLines(nums) + '.<br>Take <b>every</b> prime that appears, each to its <b>highest</b> power: ' + t(powList(L)) + '.<br>LCM ' + t('=' + eqv(L)) + '.'; }
  function gcfListSol(nums) {
    var g = gcfA(nums), com = nt.divisors(Math.min.apply(null, nums)).filter(function (d) { return nums.every(function (n) { return n % d === 0; }); });
    return nums.map(function (n) { return 'Factors of ' + t(n) + ': ' + t(K.listTex(nt.divisors(n))); }).join('<br>') + '<br>Common factors: ' + t(K.listTex(com)) + '. The greatest is ' + t(g) + '.<br>GCF ' + t('=' + g) + '.';
  }
  function lcmListSol(nums) {
    var L = lcmA(nums);
    return nums.map(function (n) { var m = []; for (var k = 1; k * n <= L; k++) m.push(F(k * n)); return 'Multiples of ' + t(n) + ': ' + t(m.join(',\\ ') + (m.length ? ',\\ \\ldots' : '')); }).join('<br>') + '<br>The first number in every list is ' + t(F(L)) + '.<br>LCM ' + t('=' + F(L)) + '.';
  }

  /* ---------- diagnoses for GCF / LCM answers (from Math 10C) ---------- */
  function gcfHigh(nums) { return nt.factor(gcfA(nums)).reduce(function (m, pe) { return m * Math.pow(pe[0], Math.max.apply(null, nums.map(function (n) { return expOf(n, pe[0]); }))); }, 1); }
  function lcmLow(nums) { return nt.factor(lcmA(nums)).reduce(function (m, pe) { return m * Math.pow(pe[0], Math.min.apply(null, nums.map(function (n) { return expOf(n, pe[0]); }).filter(function (e) { return e > 0; }))); }, 1); }
  function gcfDiag(nums) {
    var g = gcfA(nums), L = lcmA(nums), pr = prodOf(nums), hi = gcfHigh(nums);
    return function (v) {
      if (v === L && L !== g) return { code: 'gcf-lcm', hint: 'That’s the <b>lowest common multiple</b> — every number divides <b>into</b> it. The GCF goes the other way: the largest number that divides into every one of them, so it can’t be bigger than ' + t(F(Math.min.apply(null, nums))) + '.' };
      if (v === pr && pr !== g) return { code: 'gcf-product', hint: 'Multiplying the numbers gives a common <b>multiple</b>, not a common factor. The GCF has to divide into each number.' };
      if (!(v > 0) || v % 1) return null;
      var miss = nums.filter(function (n) { return n % v; });
      if (!miss.length) {
        if (v === 1) return { code: 'gcf-one', hint: 'The numbers do share a factor bigger than ' + t('1') + '. Compare their prime factorizations.' };
        return { code: 'gcf-not-greatest', hint: t(F(v)) + ' divides into every number, but it isn’t the <b>greatest</b> common factor. ' + (nt.isPrime(g / v) ? 'One shared prime factor is missing' : 'Some shared prime factors are missing') + ' — compare the prime factorizations again.' };
      }
      if (v === hi && hi !== g) return { code: 'gcf-high-power', hint: 'Right primes, but the GCF takes each shared prime to its <b>lowest</b> power: ' + t(F(v)) + ' doesn’t divide into ' + t(F(miss[0])) + '.' };
      if (v % g === 0 && nt.isPrime(v / g)) { var q = v / g; return g % q === 0 ? { code: 'gcf-high-power', hint: 'Check the power of ' + t(q) + ': ' + t(F(v)) + ' doesn’t divide into ' + t(F(miss[0])) + '. The GCF takes each shared prime to its <b>lowest</b> power.' } : { code: 'gcf-extra-prime', hint: 'Your answer has a factor of ' + t(q) + ', but ' + t(q) + ' isn’t a factor of ' + t(F(miss[0])) + '. Only use primes that appear in <b>every</b> factorization.' }; }
      return { code: 'gcf-not-common', hint: t(F(v)) + ' doesn’t divide evenly into ' + t(F(miss[0])) + ', so it isn’t a common factor.' };
    };
  }
  function lcmDiag(nums) {
    var g = gcfA(nums), L = lcmA(nums), pr = prodOf(nums), lo = lcmLow(nums), mx = Math.max.apply(null, nums);
    return function (v) {
      if (v === g && g !== L) return { code: 'lcm-gcf', hint: 'That’s the <b>greatest common factor</b>. The LCM is a common <b>multiple</b>: every number must divide into it, so it is at least as big as ' + t(F(mx)) + '.' };
      if (v === pr && pr !== L) return { code: 'lcm-product', hint: 'Multiplying the numbers gives <i>a</i> common multiple, but not the <b>lowest</b> one: shared prime factors got counted more than once. Use each prime only once, at its highest power.' };
      if (!(v > 0) || v % 1) return null;
      var miss = nums.filter(function (n) { return v % n; });
      if (!miss.length) return { code: 'lcm-not-least', hint: t(F(v)) + ' is a common multiple, but not the <b>lowest</b> one. Use each prime only once, at its <b>highest</b> power.' };
      if (v === lo && lo !== L) return { code: 'lcm-low-power', hint: 'Right primes, but the LCM needs each prime to its <b>highest</b> power so every number divides into it: ' + t(F(miss[0])) + ' doesn’t divide into ' + t(F(v)) + '.' };
      if (L % v === 0 && nt.isPrime(L / v)) { var q = L / v; return v % q === 0 ? { code: 'lcm-low-power', hint: 'Check the power of ' + t(q) + ': ' + t(F(miss[0])) + ' doesn’t divide into ' + t(F(v)) + '. The LCM takes each prime to its <b>highest</b> power.' } : { code: 'lcm-missing-prime', hint: 'A prime is missing: ' + t(F(miss[0])) + ' doesn’t divide into ' + t(F(v)) + '. Every prime that appears in <b>any</b> of the numbers belongs in the LCM.' }; }
      return { code: 'lcm-not-multiple', hint: t(F(miss[0])) + ' doesn’t divide evenly into ' + t(F(v)) + ', so it isn’t a common multiple.' };
    };
  }

  /* ---------- small checkers ---------- */
  function prodChk(n, exp) {
    var c = K.product(n, exp || 'either');
    return function (resp) { var s = normX(resp), pn = HW.parse.number(s); if (pn.ok && pn.value === n && !nt.isPrime(n)) return form('not-factored', 'Write ' + t(F(n)) + ' as a product of primes, like ' + t('2^{3}\\times 3') + '.'); return c(s); };
  }
  function toolChk(want) {
    return function (resp) {
      var s = String(resp == null ? '' : resp).toLowerCase();
      if (!s.trim()) return form('empty', 'Write <b>GCF</b> or <b>LCM</b>.');
      var g = /gcf|gcd|hcf|greatest|highest|common factor/.test(s), l = /lcm|least|lowest|common multiple/.test(s);
      if (g === l) return form('tool-unclear', 'Write <b>GCF</b> or <b>LCM</b>.');
      if ((g ? 'gcf' : 'lcm') === want) return ok();
      return wrong('wrong-tool', want === 'gcf' ? 'The groups have to fit <b>into</b> both totals with nothing left over — that’s a common <b>factor</b>, and you want the largest one.' : 'The events line up at times that are <b>multiples</b> of both — a common <b>multiple</b>, and you want the first one.');
    };
  }

  /* ---------- part makers ---------- */
  function plist(n) { return K.listTex(nt.divisors(n)); }
  function factorsPart(n) {
    return { prompt: t(F(n)), input: { type: 'list' }, check: K.factorList(n), key: nt.divisors(n), answer: t(plist(n)), text: 'factors of ' + n,
      solution: 'Work through the factor pairs in order: ' + t(K.pairsTex(n)) + '.<br>So the factors of ' + t(F(n)) + ' are ' + t(plist(n)) + '.',
      hints: ['Start with ' + t('1\\times ' + F(n)) + ', then test ' + t('2') + ', ' + t('3') + ', ' + t('4') + ', … Each factor that works brings its partner with it.', 'Stop when the pairs start repeating.'], bad: [nt.divisors(n).slice(1), nt.divisors(n).slice(0, -2)] };
  }
  function classifyPart(n, strongHint) {
    var prime = nt.isPrime(n), sp = nt.smallestPrimeFactor(n), tests = primesIn(2, Math.floor(Math.sqrt(n)));
    return { prompt: t(F(n)), input: { type: 'classify', n: n }, key: prime ? { choice: 'prime' } : { choice: 'composite', a: String(sp), b: String(n / sp) },
      answer: prime ? 'Prime' : 'Composite: ' + t(F(n) + '=' + sp + '\\times ' + F(n / sp)), text: 'prime or composite: ' + n,
      check: function (resp) {
        if (!resp || !resp.choice) return form('nochoice', 'Choose <b>Prime</b> or <b>Composite</b>.');
        if (resp.choice === 'prime') { if (prime) return ok(); return wrong('said-prime', t(F(n)) + ' has a factor other than ' + t('1') + ' and itself. Test the primes ' + t('2, 3, 5, 7, \\ldots') + ' in order' + (strongHint ? ' — try ' + t(sp) + '.' : '.')); }
        if (prime) return wrong('said-composite', 'Which factor pair did you find? Check it. To be sure, test every prime up to ' + t(sqrtNote(n)) + ': ' + t(tests.join(', ')) + '. If none divides evenly, the number is prime.');
        var a = Number(String(resp.a).replace(/\s/g, '')), b = Number(String(resp.b).replace(/\s/g, ''));
        if (!resp.a || !resp.b || !isFinite(a) || !isFinite(b)) return form('noproof', 'Right — now prove it: fill in a factor pair for ' + t(F(n)) + '.');
        if (a === 1 || b === 1) return form('proof-1', 'Every number has the pair ' + t('1\\times ' + F(n)) + '. To show ' + t(F(n)) + ' is composite, find a pair where neither number is ' + t('1') + '.');
        if (a * b !== n) return wrong('proof-wrong', t(a + '\\times ' + b + '=' + F(a * b)) + ', not ' + t(F(n)) + '. Find two numbers (neither one 1) that multiply to ' + t(F(n)) + '.');
        return ok();
      },
      solution: prime ? 'Test the primes up to ' + t(sqrtNote(n)) + ': ' + t(tests.join(', ')) + '. None divides ' + t(F(n)) + ' evenly, so ' + t(F(n)) + ' is <b>prime</b>.'
        : t(F(n) + '\\div ' + sp + '=' + F(n / sp)) + ', so ' + t(F(n) + '=' + sp + '\\times ' + F(n / sp)) + '. It has more than two factors, so it is <b>composite</b>.',
      hints: ['A prime has exactly two factors. Test the primes ' + t('2, 3, 5, 7, \\ldots') + ' up to ' + t(sqrtNote(n)) + '.', prime ? 'None of ' + t(tests.join(', ')) + ' divides it evenly.' : 'Try dividing by ' + t(sp) + '.'] };
  }
  function productPart(n, exp, how) {
    return { prompt: t(F(n)), input: { type: 'math', before: t(F(n) + '=') }, check: prodChk(n, exp || 'either'), key: K.fac(n),
      answer: t(F(n) + '=' + K.fac(n)), text: (how || 'product of primes') + ': ' + n,
      solution: 'Divide by the smallest prime each time:' + K.ladderSolution(n) + t(F(n) + '=' + K.exp(n) + '=' + K.fac(n)),
      hints: ['Start with the smallest prime that divides ' + t(F(n)) + ' and keep dividing until you reach ' + t('1') + '.', exp === 'required' ? 'Write repeated primes with an exponent: ' + t('2\\times 2\\times 2=2^{3}') + '.' : 'Check: multiply your primes back together — do you get ' + t(F(n)) + '?'],
      bad: [String(n), K.exp(n / nt.smallestPrimeFactor(n))] };
  }
  function ladderPart(n, exp) {
    var p = productPart(n, exp, 'division ladder');
    p.input = { type: 'ladder', n: n, exponent: exp === 'required' };
    p.check = (function (c) { return function (resp) { if (!resp || !resp.done) return form('unfinished', 'Finish the ladder first: keep dividing until the quotient is ' + t('1') + '.'); return c(resp.final); }; })(prodChk(n, exp || 'either'));
    p.key = { done: true, final: K.fac(n) };
    p.hints = ['Divide by the smallest prime that fits, again and again, until the quotient is ' + t('1') + '.', 'Read the primes down the left side of your ladder — those are the prime factors.'];
    p.bad = [{ done: true, final: K.exp(n / nt.smallestPrimeFactor(n)) }];
    return p;
  }
  function treePart(n, exp) {
    var p = ladderPart(n, exp); p.text = 'factor tree: ' + n;
    p.input = { type: 'tree', n: n, exponent: exp === 'required' };
    p.check = (function (c) { return function (resp) { if (!resp || !resp.done) return form('unfinished', 'Finish the tree first: every branch must end in a circled prime.'); return c(resp.final); }; })(prodChk(n, exp || 'either'));
    p.solution = 'One possible tree: split ' + t(F(n)) + ' into any factor pair and keep branching until every branch ends in a prime. The circled primes are ' + t(K.exp(n)) + ', so ' + t(F(n) + '=' + K.fac(n)) + '. (Any starting pair gives the same primes.)';
    p.hints = ['Split ' + t(F(n)) + ' into any two factors you can see, then keep splitting the composite ones.', 'Collect every circled prime from the ends of the branches.'];
    return p;
  }
  function gcfPart(nums, how) {
    var g = gcfA(nums), L = lcmA(nums), pr = prodOf(nums);
    var p = P.number(nlist(nums), g, gcfDiag(nums), how === 'list' ? gcfListSol(nums) : gcfSol(nums),
      how === 'list' ? ['List all the factors of each number.', 'Circle the factors that appear in every list; the GCF is the largest one.'] : ['Write each number as a product of primes first.', 'The GCF uses only the primes in <b>every</b> factorization, each to its <b>lowest</b> power.'],
      'GCF of ' + nums.join(', '), { before: t('\\text{GCF}=') });
    p.bad = [L, pr].filter(function (x) { return x !== g; }).map(String);
    return p;
  }
  function lcmPart(nums, how) {
    var g = gcfA(nums), L = lcmA(nums), pr = prodOf(nums);
    var p = P.number(nlist(nums), L, lcmDiag(nums), how === 'list' ? lcmListSol(nums) : lcmSol(nums),
      how === 'list' ? ['List the multiples of each number (start with the largest).', 'The first number that appears in every list is the LCM.'] : ['Write each number as a product of primes first.', 'The LCM uses <b>every</b> prime that appears, each to its <b>highest</b> power.'],
      'LCM of ' + nums.join(', '), { before: t('\\text{LCM}=') });
    p.bad = [g, pr].filter(function (x) { return x !== L; }).map(String);
    return p;
  }
  /* "Use prime factorization": a box for each factorization, then the GCF / LCM */
  function factFieldsPart(nums, kind) {
    var isG = kind === 'gcf', ans = isG ? gcfA(nums) : lcmA(nums), other = isG ? lcmA(nums) : gcfA(nums), lab = isG ? 'GCF' : 'LCM';
    var fields = nums.map(function (n) { return { name: t(F(n)), before: t(F(n) + '='), mode: 'math', wide: true }; }).concat([{ name: lab, before: t('\\text{' + lab + '}=') }]);
    var checks = nums.map(function (n) { return prodChk(n, 'either'); }).concat([K.number(ans, isG ? gcfDiag(nums) : lcmDiag(nums))]);
    var keys = nums.map(plainFac).concat([String(ans)]);
    var p = P.fields(nlist(nums) + ' — write each number as a product of primes, then give the ' + lab + '.', fields, checks, keys,
      nums.map(function (n) { return t(F(n) + '=' + K.fac(n)); }).join('<br>') + '<br>' + lab + ' ' + t('=' + eqv(ans)), isG ? gcfSol(nums) : lcmSol(nums),
      ['Divide each number by the smallest prime that fits, again and again, until you reach ' + t('1') + '.', isG ? 'The GCF uses only the primes in <b>every</b> factorization, each to its <b>lowest</b> power.' : 'The LCM uses <b>every</b> prime that appears, each to its <b>highest</b> power.'],
      lab + ' by primes: ' + nums.join(', '));
    p.good = [nums.map(function (n) { return nt.primeList(n).join('x'); }).concat([String(ans)])];
    p.bad = [keys.slice(0, -1).concat([String(other)]), keys.slice(0, -1).concat([String(prodOf(nums))])].filter(function (b) { return b[b.length - 1] !== String(ans); });
    return p;
  }
  function bothPart(prompt, nums, text) {
    var g = gcfA(nums), L = lcmA(nums);
    var p = P.fields(prompt, [{ name: 'GCF', before: t('\\text{GCF}=') }, { name: 'LCM', before: t('\\text{LCM}=') }], [K.number(g, gcfDiag(nums)), K.number(L, lcmDiag(nums))], [String(g), String(L)],
      t('\\text{GCF}=' + g + ',\\ \\text{LCM}=' + F(L)), facLines(nums) + '.<br>GCF: shared primes, <b>lowest</b> powers: ' + t('\\text{GCF}=' + eqv(g)) + '.<br>LCM: every prime, <b>highest</b> powers: ' + t('\\text{LCM}=' + eqv(L)) + '.',
      ['Factor both numbers into primes first.', 'GCF: lowest powers of the shared primes. LCM: highest powers of every prime.'], text);
    p.bad = [[String(L), String(g)]];
    return p;
  }
  function pairBy(r, gs, xs, lo, hi, fallback) { // a = g·x, b = g·y with gcd(x, y) = 1
    return find(function () { var g = r.pick(gs), x = r.pick(xs), y = r.pick(xs); return [g * Math.min(x, y), g * Math.max(x, y), g]; }, function (v) { return v[0] !== v[1] && gcd(v[0], v[1]) === v[2] && v[0] >= lo && v[1] <= hi && noneDivides([v[0], v[1]]); }, fallback);
  }
  function tripleBy(r, gs, ms, hi, fallback) { // g·m for three m with no common factor
    return find(function () { var g = r.pick(gs), m = sortN(r.sample(ms, 3)); return m.map(function (x) { return g * x; }); }, function (v) { return v[2] <= hi && noneDivides(v); }, fallback);
  }
  function ruleCount(n, prompt) {
    var c = nt.numDivisors(n), f = nt.factor(n), prodE = f.reduce(function (m, pe) { return m * pe[1]; }, 1);
    var p = P.number(prompt || t(F(n)), c, function (v) {
      if (v === prodE) return { code: 'no-plus1', hint: 'Add ' + t('1') + ' to each exponent before multiplying (a factor can also use a prime zero times).' };
      if (v === f.reduce(function (m, pe) { return m + pe[1] + 1; }, 0)) return { code: 'added', hint: 'Multiply the (exponent + 1) values — don’t add them.' };
      return null;
    }, t(F(n) + '=' + K.fac(n)) + ', so the number of factors is ' + t(f.map(function (pe) { return '(' + pe[1] + '+1)'; }).join('') + '=' + c) + '.', ['Find the prime factorization first.', 'Add 1 to each exponent, then multiply.'], 'factor count ' + n);
    p.bad = [String(prodE), String(f.reduce(function (m, pe) { return m + pe[1] + 1; }, 0))].filter(function (s) { return Number(s) !== c; });
    return p;
  }
  function smallestWith(k) {
    var best = 0; for (var n = 1; n < 100000; n++) if (nt.numDivisors(n) === k) { best = n; break; }
    var p = P.number('What is the smallest whole number that has exactly ' + t(k) + ' factors in total?', best, function (v) {
      if (v > 0 && v % 1 === 0 && nt.numDivisors(v) === k) return { code: 'not-smallest', hint: t(F(v)) + ' does have ' + t(k) + ' factors, but there is a smaller one. Use the factor-count rule backwards and put the biggest exponent on the smallest prime.' };
      return null;
    }, 'Write ' + t(k) + ' as a product of (exponent ' + t('+1') + ') values, build the smallest number for each pattern (largest exponent on ' + t('2') + ', the next on ' + t('3') + ', …) and compare. The smallest is ' + t(F(best) + '=' + K.fac(best)) + ', with factors ' + t(plist(best)) + '.',
    ['Each way of writing ' + t(k) + ' as a product of whole numbers gives a pattern of exponents (each one less than a factor).', 'Put the biggest exponent on ' + t('2') + ', the next on ' + t('3') + ', and so on. Compare the candidates.'], 'smallest with ' + k + ' factors');
    var other = 0; for (var m = best + 1; m < 100000; m++) if (nt.numDivisors(m) === k) { other = m; break; }
    p.bad = [String(other)];
    return p;
  }

  function addMissing(o) { var add = {}; Object.keys(o).forEach(function (k) { if (!HW.CODES || !HW.CODES[k]) add[k] = o[k]; }); HW.addCodes(add); }
  function partialMissing(o) { var PP = HW.PARTIAL || {}, add = {}; Object.keys(o).forEach(function (k) { if (!(PP.small || {})[k] && !(PP.big || {})[k] && !(PP.none || {})[k]) add[k] = o[k]; }); HW.addPartial(add); }
  addMissing({
    'gcf-lcm': 'Gave the LCM instead of the GCF', 'gcf-product': 'Multiplied the numbers (GCF)', 'gcf-one': 'Said the GCF is 1', 'gcf-not-greatest': 'Common factor, but not the greatest',
    'gcf-high-power': 'GCF: used the highest power of a shared prime', 'gcf-extra-prime': 'GCF: included a prime not in every number', 'gcf-not-common': 'Not a common factor',
    'lcm-gcf': 'Gave the GCF instead of the LCM', 'lcm-product': 'Multiplied the numbers (LCM too big)', 'lcm-not-least': 'Common multiple, but not the lowest',
    'lcm-low-power': 'LCM: used a lower power of a prime', 'lcm-missing-prime': 'LCM: left out a prime', 'lcm-not-multiple': 'Not a common multiple',
    'not-factored': 'Didn’t write the prime factorization', 'nonfactor': 'Listed a number that isn’t a factor', 'missing-1n': 'Left out 1 or the number itself', 'missing-partner': 'Left out a factor’s partner',
    missing: 'Something missing', composite: 'Composite number left in a prime factorization', extra: 'Product too big (extra factor)', lead: 'Started with the wrong number', self: 'Gave the number itself as its factorization',
    nothing: 'No primes given', 'said-prime': 'Said prime (it is composite)', 'said-composite': 'Said composite (it is prime)', 'proof-wrong': 'Factor pair doesn’t multiply to the number',
    'no-plus1': 'Factor count: didn’t add 1 to the exponents', added: 'Added instead of multiplied', 'not-smallest': 'Works, but not the smallest', 'wrong-tool': 'Chose GCF/LCM the wrong way round',
    'gave-gcf': 'Used the GCF (should be LCM)', 'gave-lcm': 'Used the LCM (should be GCF)', 'area-by-side': 'Divided area by side length (not tile area)', swapped: 'Swapped the two answers', 'no-divide': 'Forgot to divide in GCF×LCM=ab'
  });
  HW.addCodes({ 'u1l3-hm': 'Time: minutes not turned into hours and minutes', 'u1l3-not-prime-count': 'Number has a different number of prime factors', 'u1l3-pair-gcf': 'Pair has the wrong GCF', 'u1l3-pair-lcm': 'Pair has the wrong LCM', 'u1l3-pair-g': 'Gave the GCF as one of the numbers', 'u1l3-value': 'Wrong value of the factorization' });
  partialMissing({ 'gcf-lcm': 'n', 'gcf-product': 'n', 'gcf-one': 'n', 'gcf-not-greatest': 's', 'gcf-high-power': 's', 'gcf-extra-prime': 's', 'gcf-not-common': 'n', 'lcm-gcf': 'n', 'lcm-product': 's', 'lcm-not-least': 's', 'lcm-low-power': 's', 'lcm-missing-prime': 's', 'lcm-not-multiple': 'n',
    'nonfactor': 'n', 'missing-1n': 's', 'missing-partner': 's', missing: 's', composite: 's', extra: 's', lead: 'n', self: 'n', nothing: 'n', 'said-prime': 'n', 'said-composite': 'n', 'proof-wrong': 's', 'no-plus1': 'b', added: 'b', 'not-smallest': 'b', 'wrong-tool': 'n', 'gave-gcf': 'n', 'gave-lcm': 'n', 'area-by-side': 'b', swapped: 's', 'no-divide': 'b' });
  HW.addPartial({ 'u1l3-hm': 's', 'u1l3-not-prime-count': 'n', 'u1l3-pair-gcf': 'b', 'u1l3-pair-lcm': 'b', 'u1l3-pair-g': 'n', 'u1l3-value': 's' });

  HW.defineLesson({
    id: 'u1l3', unit: 1, num: '3', title: 'Prime Factorization, GCF, and LCM', outcome: 'AN1',
    blurb: 'Breaking numbers into primes, then using those primes to find the GCF and LCM.',
    questions: [
      { num: '1', section: 'Part A — Factors, Primes, and Prime Factorization', stem: 'State all the factors of each number.', parts: [
        { id: '1a', level: 'LIM', make: function (r) { return factorsPart(r.pick([18, 12, 20, 28, 32, 45, 50, 27, 44, 52, 63, 75, 98, 16, 21, 33, 35, 39, 49, 26])); } },
        { id: '1b', level: 'BEG', make: function (r) { return factorsPart(r.pick([40, 36, 48, 42, 54, 56, 60, 64, 66, 70, 72, 78, 80, 84, 88, 90, 96, 30, 24, 100])); } }] },
      { num: '2', stem: 'Classify each number as prime or composite.', parts: [
        { id: '2a', level: 'LIM', make: function (r) { return classifyPart(r.pick(primesIn(11, 89))); } },
        { id: '2b', level: 'LIM', make: function (r) { return classifyPart(2 * r.int(11, 45)); } },
        { id: '2c', level: 'LIM', make: function (r) { return classifyPart(r.pick(primesIn(41, 131))); } },
        { id: '2d', level: 'BEG', make: function (r) { return classifyPart(r.pick([51, 57, 69, 87, 93, 39, 33, 77, 91, 49, 63, 81, 99, 21, 27, 111, 119, 133, 117, 123]), true); } }] },
      { num: '3', stem: 'Use a <b>division ladder</b> to determine the prime factorization.', parts: [
        { id: '3a', level: 'BEG', make: function (r) { return ladderPart(find(function () { return 4 * r.pick([7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]) * r.pick([1, 1, 3, 5]); }, function (n) { return n <= 400; }, 92)); } },
        { id: '3b', level: 'BEG', make: function (r) { return ladderPart(r.chance(0.7) ? 8 * r.pick([3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31]) : 16 * r.pick([3, 5, 7, 9, 11, 13, 15])); } }] },
      { num: '4', stem: 'Use a <b>factor tree</b> to determine the prime factorization.', parts: [
        { id: '4a', level: 'BEG', make: function (r) { return treePart(find(function () { var ps = r.sample([2, 3, 5, 7, 11, 13, 17, 19, 23], 3); return prodOf(ps); }, function (n) { return n >= 42 && n <= 330 && n % 2 === 0; }, 78)); } },
        { id: '4b', level: 'BEG', make: function (r) { return treePart(find(function () { var sq = r.pick([9, 9, 25, 49, 4]), q = r.pick([3, 5, 7, 11, 13, 17, 19, 23]); return sq % q ? sq * q : 0; }, function (n) { return n >= 44 && n <= 250; }, 99)); } }] },
      { num: '5', section: 'Part B — GCF and LCM', stem: 'Determine the greatest common factor by <b>listing factors</b>.', parts: [
        { id: '5a', level: 'BEG', make: function (r) { return gcfPart(find(function () { var g = r.pick([2, 3, 4, 5, 6, 8]), x = r.int(2, 7), y = r.int(2, 8); return [g * Math.min(x, y), g * Math.max(x, y), x, y]; }, function (v) { return v[0] !== v[1] && gcd(v[2], v[3]) === 1 && v[1] <= 48 && noneDivides(v.slice(0, 2)); }, [16, 20]).slice(0, 2), 'list'); } },
        { id: '5b', level: 'EMG', make: function (r) { return gcfPart(tripleBy(r, [2, 3, 4, 6, 5], range(2, 7), 45, [12, 18, 30]), 'list'); } }] },
      { num: '6', stem: 'Use <b>prime factorization</b> to determine the greatest common factor.', parts: [
        { id: '6a', level: 'EMG', make: function (r) { return factFieldsPart(pairBy(r, [21, 15, 14, 35, 18, 12, 9], [2, 3, 4, 5, 7], 30, 140, [63, 105]).slice(0, 2), 'gcf'); } },
        { id: '6b', level: 'EMG', make: function (r) { return factFieldsPart(pairBy(r, [22, 26, 33, 39, 34, 38, 44, 46, 30, 28], [2, 3, 4, 5, 7], 40, 180, [88, 110]).slice(0, 2), 'gcf'); } },
        { id: '6c', level: 'PRG', make: function (r) { return factFieldsPart(tripleBy(r, [17, 13, 11, 19, 7, 23, 14, 10], [2, 3, 4, 5, 7], 120, [34, 51, 85]), 'gcf'); } }] },
      { num: '7', stem: 'Determine the lowest common multiple by <b>listing multiples</b>.', parts: [
        { id: '7a', level: 'BEG', make: function (r) { return lcmPart(find(function () { return sortN(r.sample(range(3, 16), 2)); }, function (v) { var g = gcd(v[0], v[1]); return g > 1 && noneDivides(v) && lcm(v[0], v[1]) <= 72; }, [6, 10]), 'list'); } },
        { id: '7b', level: 'EMG', make: function (r) { return lcmPart(find(function () { return sortN(r.sample(range(2, 10), 3)); }, function (v) { var L = lcmA(v); return L <= 72 && L < prodOf(v) && v.some(function (x, i) { return v.some(function (y, j) { return i !== j && y % x === 0; }); }) && L !== v[2]; }, [4, 5, 8]), 'list'); } }] },
      { num: '8', stem: 'Use <b>prime factorization</b> to determine the lowest common multiple.', parts: [
        { id: '8a', level: 'EMG', make: function (r) { return factFieldsPart(find(function () { return sortN(r.sample(range(8, 30), 2)); }, function (v) { var g = gcd(v[0], v[1]); return g >= 2 && g <= 6 && noneDivides(v) && lcm(v[0], v[1]) <= 120; }, [16, 20]), 'lcm'); } },
        { id: '8b', level: 'EMG', make: function (r) { return factFieldsPart(find(function () { var s = r.pick([7, 5, 3, 11, 13]), pq = r.sample([2, 3, 5, 7, 4].filter(function (x) { return x !== s; }), 2); return sortN([pq[0] * s, pq[1] * s]); }, function (v) { return v[1] <= 70 && gcd(v[0], v[1]) === v[0] / (v[0] / gcd(v[0], v[1])) && noneDivides(v); }, [21, 35]), 'lcm'); } },
        { id: '8c', level: 'PRG', make: function (r) { return factFieldsPart(find(function () { return sortN(r.sample([4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 25, 27, 28, 30, 35, 45, 49, 50], 3)); }, function (v) { var L = lcmA(v); return noneDivides(v) && L <= 300 && L * 4 <= prodOf(v); }, [9, 15, 25]), 'lcm'); } }] },
      { num: '9', stem: '', parts: [
        { id: '9', level: 'PRG', make: function (r) { var v = pairBy(r, [14, 6, 10, 12, 15, 18], [2, 3, 4, 5], 18, 90, [28, 42, 14]); return bothPart('Determine both the greatest common factor <b>and</b> the lowest common multiple of ' + nlist(v.slice(0, 2)) + '.', v.slice(0, 2), 'GCF and LCM ' + v.slice(0, 2).join(',')); } }] },
      { num: '10', section: 'Part C — Applications and Review', stem: function (sh) { return 'A coach has ' + t(sh.a) + ' ' + sh.it[0] + ' and ' + t(sh.b) + ' ' + sh.it[1] + ' to divide evenly among identical team bags, using every item, with the greatest number of bags possible.'; },
        shared: function (r) { var v = pairBy(r, [8, 6, 4, 9, 12, 7], [3, 4, 5, 7], 18, 70, [32, 40, 8]); var sw = r.chance(0.5); return { a: sw ? v[1] : v[0], b: sw ? v[0] : v[1], g: v[2], it: r.pick([['water bottles', 'granola bars'], ['oranges', 'juice boxes'], ['pinnies', 'cones'], ['tennis balls', 'towels']]) }; },
        parts: [
          { id: '10a', level: 'PRG', make: function (r, sh) { var p = P.number('How many team bags can she make?', sh.g, gcfDiag([sh.a, sh.b]), 'Every item must be shared out with nothing left over, and we want the most bags: the <b>GCF</b>.<br>' + gcfSol([sh.a, sh.b]) + '<br><b>' + sh.g + ' bags</b>.', ['The number of bags must divide evenly into both ' + t(sh.a) + ' and ' + t(sh.b) + '. Factor or multiple?', 'Find the GCF.'], 'bags GCF ' + sh.a + ',' + sh.b, { after: 'bags' }); p.bad = [String(lcm(sh.a, sh.b))]; return p; } },
          { id: '10b', level: 'EMG', make: function (r, sh) {
            var p = P.fields('How many ' + sh.it[0] + ' and how many ' + sh.it[1] + ' go in each bag?', [{ name: sh.it[0], label: sh.it[0], after: 'per bag' }, { name: sh.it[1], label: sh.it[1], after: 'per bag' }],
              [K.number(sh.a / sh.g, function (v) { return v === sh.b / sh.g ? { code: 'swapped', hint: 'That’s the number of ' + sh.it[1] + '. Divide the ' + t(sh.a) + ' ' + sh.it[0] + ' among the ' + t(sh.g) + ' bags.' } : null; }), K.number(sh.b / sh.g, function (v) { return v === sh.a / sh.g ? { code: 'swapped', hint: 'That’s the number of ' + sh.it[0] + '.' } : null; })],
              [String(sh.a / sh.g), String(sh.b / sh.g)], t(sh.a / sh.g) + ' ' + sh.it[0] + ' and ' + t(sh.b / sh.g) + ' ' + sh.it[1], t(sh.a + '\\div ' + sh.g + '=' + sh.a / sh.g) + ' ' + sh.it[0] + ' and ' + t(sh.b + '\\div ' + sh.g + '=' + sh.b / sh.g) + ' ' + sh.it[1] + ' in each bag.', ['Divide each total by the number of bags.'], 'bag contents');
            p.bad = [[String(sh.b / sh.g), String(sh.a / sh.g)]];
            return p;
          } }] },
      { num: '11', stem: '', parts: [
        { id: '11', level: 'PRG', make: function (r) {
          var ab = find(function () { return sortN(r.sample([6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 24, 25, 30], 2)); }, function (v) { var g = gcd(v[0], v[1]); return g > 1 && noneDivides(v) && lcm(v[0], v[1]) <= 120; }, [15, 20]), a = ab[0], b = ab[1], L = lcm(a, b);
          var p = P.number('Two rotating spotlights at a school dance sweep past the DJ booth on a regular schedule: Light A every ' + t(a) + ' seconds, Light B every ' + t(b) + ' seconds. If both lights just swept past the booth together, how many seconds will it be until they sweep past together again?', L, lcmDiag([a, b]),
            'They line up again at a common <b>multiple</b> of ' + t(a) + ' and ' + t(b) + ' — the first one is the LCM.<br>' + lcmListSol([a, b]) + '<br><b>' + L + ' seconds</b>.', ['Are the times when they line up multiples or factors of ' + t(a) + ' and ' + t(b) + '?', 'Find the LCM.'], 'spotlights ' + a + ',' + b, { after: 's' });
          p.bad = [String(a * b), String(gcd(a, b))].filter(function (s) { return Number(s) !== L; });
          return p;
        } }] },
      { num: '12', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '12', level: 'EMG', make: function (r) {
          var v = find(function () { var g = r.pick([18, 12, 24, 15, 14, 16, 20, 21]), xs = sortN(r.sample([2, 3, 4, 5, 7], 2)); return [g * xs[0], g * xs[1], g]; }, function (v) { return gcd(v[0], v[1]) === v[2] && v[1] <= 150 && nt.divisors(v[2]).length >= 4; }, [54, 90, 18]);
          var a = v[0], b = v[1], g = v[2], ds = nt.divisors(g).filter(function (d) { return d > 1 && d < g; }), d1 = r.sample(ds, Math.min(2, ds.length)), other = find(function () { return r.pick(nt.divisors(a).concat(nt.divisors(b))); }, function (x) { return x > 1 && (a % x || b % x) && d1.indexOf(x) < 0; }, 2 * g);
          var opts = sortN(d1.concat([g, other]).filter(function (x, i, arr) { return arr.indexOf(x) === i; })).map(function (d) { return { html: t(d), right: d === g, why: d === g ? null : (a % d === 0 && b % d === 0 ? t(d) + ' is a common factor, but not the <b>greatest</b>.' : t(d) + ' doesn’t divide both numbers.') }; });
          if (opts.length < 4) opts.push({ html: t(g * 2), why: t(g * 2) + ' doesn’t divide both numbers.' });
          return P.mc(r, 'The greatest common factor of ' + t(a) + ' and ' + t(b) + ' is', opts, gcfSol([a, b]), ['Factor both numbers. The GCF uses every shared prime, at its lowest power.'], 'MC GCF ' + a + ',' + b, true);
        } }] },
      { num: '13', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '13', level: 'PRG', make: function (r) {
          var nums = find(function () { return sortN(r.sample([4, 6, 8, 9, 10, 12, 15, 16, 18, 20, 24, 30], 3)); }, function (v) { var L = lcmA(v); return L <= 360 && L < prodOf(v) / 2 && noneDivides(v.slice(0, 2)) && L !== v[2]; }, [12, 16, 24]);
          var L = lcmA(nums), p = P.nr('The lowest common multiple of ' + nlist(nums) + ' is ________.', L, lcmDiag(nums), lcmSol(nums), ['Factor each number into primes.', 'Take every prime that appears, at its highest power.'], 'NR LCM ' + nums.join(','));
          p.bad = [String(gcfA(nums)), String(nums[2] * 2 === L ? nums[2] * 3 : nums[2] * 2)];
          return p;
        } }] },
      { num: '14', stem: '', parts: [
        { id: '14', level: 'PRG', make: function (r) {
          var pq = sortN(r.sample(primesIn(5, 31), 2)), a = pq[0], b = pq[1];
          return P.mc(r, '<b>Explain</b> why the greatest common factor of two <i>different</i> prime numbers (for example, ' + t(a) + ' and ' + t(b) + ') must always be ' + t('1') + ', without doing any calculations.', [
            { html: 'A prime’s only factors are ' + t('1') + ' and itself. Two different primes can’t share “itself”, so the only factor they share is ' + t('1') + '.', right: true },
            { html: 'Prime numbers are all odd, and odd numbers never share a factor.', why: t('2') + ' is prime and even — and odd numbers like ' + t('9') + ' and ' + t('15') + ' share the factor ' + t('3') + '.' },
            { html: 'The GCF of any two numbers is always ' + t('1') + '.', why: 'Not true: ' + t('12') + ' and ' + t('18') + ' have GCF ' + t('6') + '. What is special about primes?' },
            { html: 'Their product, ' + t(a * b) + ', is the GCF divided by itself.', why: 'The product of two primes is their <b>LCM</b>, not related to the GCF this way.' }],
            'A prime has exactly two factors: ' + t('1') + ' and itself. ' + t(a) + ' has factors ' + t('1, ' + a) + ' and ' + t(b) + ' has factors ' + t('1, ' + b) + '; the only one in both lists is ' + t('1') + '.', ['List the factors of each prime.'], 'why GCF of primes is 1');
        } }] }
    ],
    extra: [
      { num: '1', section: 'Extra practice A — Bigger numbers, deeper factorizations', stem: 'Write the prime factorization of each number in <b>exponent form</b>.', parts: [
        { id: 'e1a', level: 'EMG', make: function (r) { return productPart(find(function () { return Math.pow(2, r.int(1, 4)) * Math.pow(3, r.int(1, 3)) * Math.pow(5, r.int(1, 2)); }, function (n) { return n <= 1500 && n >= 90 && nt.factor(n).some(function (pe) { return pe[1] > 1; }); }, 360), 'required'); } },
        { id: 'e1b', level: 'EMG', make: function (r) { return productPart(find(function () { return Math.pow(2, r.int(1, 4)) * Math.pow(3, r.int(1, 2)) * r.pick([7, 11, 13, 17, 19]); }, function (n) { return n >= 150 && n <= 999; }, 504), 'required'); } },
        { id: 'e1c', level: 'EMG', make: function (r) { return productPart(r.pick([1000, 500, 2000, 250, 400, 800, 200, 1250, 625, 160, 320, 640, 100, 5000, 2500, 4000, 125, 1600, 3200, 8000]), 'required'); } },
        { id: 'e1d', level: 'PRG', make: function (r) { return productPart(r.pick([1024, 512, 256, 128, 2048, 729, 243, 81, 625, 343, 2187, 4096, 64, 3125, 2401, 1331, 6561, 32, 16807, 15625]), 'required'); } }] },
      { num: '2', stem: 'Use the method indicated. Show every step, then write the answer in exponent form.', parts: [
        { id: 'e2a', level: 'PRG', make: function (r) { return treePart(find(function () { return Math.pow(2, r.int(1, 4)) * r.pick([3, 9, 5, 15, 25, 27]) * Math.pow(r.pick([7, 11]), r.int(1, 2)); }, function (n) { return n >= 300 && n <= 2500; }, 1176), 'required'); } },
        { id: 'e2b', level: 'PRG', make: function (r) { return ladderPart(find(function () { return prodOf(r.sample([2, 3, 5, 7, 11, 13], 4)) * r.pick([1, 1, 5, 3]); }, function (n) { return n >= 500 && n <= 4000; }, 2310), 'required'); } }] },
      { num: '3', stem: 'Each prime factorization below belongs to a whole number. Determine that number.', parts: [
        { id: 'e3a', level: 'EMG', make: function (r) { return valuePart([[2, r.int(2, 5)], [3, r.int(1, 3)], [r.pick([5, 7]), 1]]); } },
        { id: 'e3b', level: 'EMG', make: function (r) { return valuePart([[2, r.int(1, 3)], [5, r.int(1, 2)], [r.pick([7, 11, 13, 17]), 1]]); } },
        { id: 'e3c', level: 'EMG', make: function (r) { var ps = r.sample([2, 3, 5, 7], 2).sort(); return valuePart([[ps[0], r.int(2, 4)], [ps[1], r.int(2, 3)]]); } }] },
      { num: '4', stem: '<b>Counting factors.</b> ' + t('12=2^{2}\\times 3^{1}') + ' has six factors (' + t('1,2,3,4,6,12') + '). Adding ' + t('1') + ' to each exponent and multiplying gives ' + t('(2+1)\\times(1+1)=6') + '. That works for every number. Use the rule to find how many factors each number has.', parts: [
        { id: 'e4a', level: 'PRG', make: function (r) { var e1 = r.int(2, 7), e2 = r.int(1, 3), q = r.pick([3, 3, 5, 7]), n = Math.pow(2, e1) * Math.pow(q, e2); return ruleCount(n, t('2^{' + e1 + '}\\times ' + q + (e2 > 1 ? '^{' + e2 + '}' : '')) + ' (don’t multiply it out)'); } },
        { id: 'e4b', level: 'PRG', make: function (r) { return ruleCount(r.pick([360, 180, 240, 300, 420, 504, 540, 600, 720, 120, 210, 450, 630, 660, 780, 840, 900, 168, 264, 280])); } },
        { id: 'e4c', level: 'PRG', make: function (r) { return ruleCount(r.pick([96, 48, 72, 80, 112, 160, 144, 192, 54, 162, 200, 63, 75, 98, 88, 136, 176, 208, 44, 52])); } }] },
      { num: '5', stem: 'Work backwards from the ideas above.', parts: [
        { id: 'e5a', level: 'ADV', make: function (r) {
          var V = [['exactly <b>three different prime factors</b>', 30], ['exactly <b>two different prime factors</b>', 6], ['exactly <b>four different prime factors</b>', 210], ['exactly three different prime factors, and is <b>odd</b>', 105], ['exactly two different prime factors, and is <b>odd</b>', 15],
            ['exactly three different prime factors, one of which is ' + t('7'), 42], ['exactly three different prime factors, one of which is ' + t('11'), 66], ['exactly two different prime factors, one of which is ' + t('13'), 26], ['exactly three different prime factors, and is greater than ' + t('50'), 60], ['exactly two different prime factors, and is greater than ' + t('20'), 21]];
          var v = r.pick(V), k = /four/.test(v[0]) ? 4 : /three/.test(v[0]) ? 3 : 2;
          var p = P.number('What is the smallest whole number that has ' + v[0] + '?', v[1], function (x) {
            if (x > 0 && x % 1 === 0 && nt.distinctPrimes(x).length !== k) return { code: 'u1l3-not-prime-count', hint: t(F(x) + (nt.isPrime(x) ? '' : '=' + K.fac(x))) + ' has ' + nt.distinctPrimes(x).length + ' different prime factor' + (nt.distinctPrimes(x).length === 1 ? '' : 's') + ', not ' + k + '.' };
            if (x > v[1]) return { code: 'not-smallest', hint: t(F(x)) + ' works, but there is a smaller one. Use the smallest primes you are allowed, each just once.' };
            return null;
          }, 'Use the smallest primes allowed, each only once (a repeat makes the number bigger without adding a new prime): ' + t(F(v[1]) + '=' + K.fac(v[1])) + '.', ['Multiply the smallest primes you are allowed to use.', 'Use each prime only once.'], 'smallest with prime count ' + v[1]);
          p.bad = [String(v[1] * 2)];
          return p;
        } },
        { id: 'e5b', level: 'MAS', make: function (r) { return smallestWith(r.pick([4, 5, 6, 7, 8, 9, 10, 12, 14, 15, 16, 18, 20])); } }] },
      { num: '6', section: 'Extra practice B — GCF and LCM with three numbers', stem: 'Use prime factorization to determine the greatest common factor.', parts: [
        { id: 'e6a', level: 'PRG', make: function (r) { return gcfPart(tripleBy(r, [42, 30, 18, 14, 21, 12], [2, 3, 5, 7], 300, [84, 126, 210])); } },
        { id: 'e6b', level: 'PRG', make: function (r) { return gcfPart(find(function () { var g = r.pick([12, 6, 8, 10, 4, 9, 14, 15]), ps = r.sample([2, 3, 5, 7], 3); return sortN([g * ps[0] * ps[1], g * ps[0] * ps[2], g * ps[1] * ps[2]]); }, function (v) { return v[2] <= 400; }, [72, 120, 180])); } },
        { id: 'e6c', level: 'PRG', make: function (r) { return gcfPart(tripleBy(r, [45, 15, 25, 35, 9], [2, 3, 5, 7], 320, [90, 135, 225])); } }] },
      { num: '7', stem: 'Use prime factorization to determine the lowest common multiple.', parts: [
        { id: 'e7a', level: 'PRG', make: function (r) { return lcmPart(find(function () { return sortN(r.sample(range(6, 36), 3)); }, function (v) { var L = lcmA(v); return noneDivides(v) && L >= 60 && L <= 400 && gcfA(v) > 1; }, [12, 18, 30])); } },
        { id: 'e7b', level: 'PRG', make: function (r) { return lcmPart(find(function () { var ps = r.sample([2, 3, 5, 7], 3); return sortN([Math.pow(2, r.int(1, 3)) * ps[0], 2 * ps[1], ps[0] * ps[2]].map(function (x) { return x; })); }, function (v) { var L = lcmA(v); return noneDivides(v) && L <= 600 && v[0] !== v[1] && v[1] !== v[2]; }, [8, 14, 35])); } },
        { id: 'e7c', level: 'PRG', make: function (r) { return lcmPart(find(function () { return sortN(r.sample(range(8, 45), 3)); }, function (v) { var L = lcmA(v); return noneDivides(v) && L >= 90 && L <= 360 && L * 8 <= prodOf(v); }, [15, 24, 40])); } }] },
      { num: '8', stem: '', parts: [
        { id: 'e8', level: 'PRG', make: function (r) { var v = pairBy(r, [42, 30, 36, 24, 28, 18], [3, 4, 5, 7], 60, 250, [126, 168, 42]); return bothPart('Determine both the greatest common factor <b>and</b> the lowest common multiple of ' + nlist(v.slice(0, 2)) + '.', v.slice(0, 2), 'GCF and LCM ' + v.slice(0, 2).join(',')); } }] },
      { num: '9', stem: 'Write each fraction in lowest terms by dividing the numerator and the denominator by their GCF. State the GCF you used.', parts: ['a', 'b', 'c'].map(function (L, i) {
        return { id: 'e9' + L, level: 'PRG', make: function (r) {
          var v = find(function () { var g = r.pick([[42, 24, 36, 28], [168, 84, 72, 56, 120], [45, 35, 25, 63]][i]), xy = r.pick([[4, 5], [2, 3], [5, 7], [3, 4], [2, 5], [3, 5], [4, 7], [5, 6]]); return [g * xy[0], g * xy[1], g]; }, function (v) { return gcd(v[0], v[1]) === v[2] && v[1] <= 600; }, [[168, 210, 42], [336, 504, 168], [225, 315, 45]][i]);
          var a = v[0], b = v[1], g = v[2], f = [a / g, b / g];
          var p = P.fields(t('\\dfrac{' + a + '}{' + b + '}'), [{ name: 'GCF', before: t('\\text{GCF}=') }, { name: 'Lowest terms', label: 'Lowest terms', mode: 'math', keys: 'fraction', before: t('\\frac{' + a + '}{' + b + '}=') }],
            [K.number(g, gcfDiag([a, b])), K.fraction(f)], [String(g), '\\frac{' + f[0] + '}{' + f[1] + '}'], 'GCF ' + t('=' + g) + '; ' + t('\\frac{' + f[0] + '}{' + f[1] + '}'),
            gcfSol([a, b]) + '<br>' + t('\\frac{' + a + '\\div ' + g + '}{' + b + '\\div ' + g + '}=\\frac{' + f[0] + '}{' + f[1] + '}') + '.', ['Factor the top and bottom into primes to find the GCF.', 'Divide both by the GCF.'], 'lowest terms ' + a + '/' + b);
          p.bad = [[String(g / nt.smallestPrimeFactor(g)), '\\frac{' + f[0] + '}{' + f[1] + '}']];
          return p;
        } };
      }) },
      { num: '10', section: 'Extra practice C — The GCF–LCM relationship', stem: 'For any two whole numbers ' + t('a') + ' and ' + t('b') + ': ' + t('\\text{GCF}(a,b)\\times\\text{LCM}(a,b)=a\\times b') + '. Verify that it holds for each pair by computing all four quantities.', parts: [
        { id: 'e10a', level: 'EMG', make: function (r) { return identityPart(pairBy(r, [6, 4, 3, 2, 8, 5], [2, 3, 4, 5, 7], 10, 48, [18, 24, 6]).slice(0, 2)); } },
        { id: 'e10b', level: 'EMG', make: function (r) { return identityPart(find(function () { var g = r.pick([10, 5, 6, 4, 15]), xy = r.pick([[2, 5], [3, 4], [2, 3], [4, 5], [3, 5]]); return [g * xy[0], g * xy[1]]; }, function (v) { return v[1] <= 75; }, [20, 50])); } }] },
      { num: '11', stem: 'Use the relationship from Question 10 to find the missing number. Check your answer by finding the GCF and LCM of the pair you end up with.', parts: [
        { id: 'e11a', level: 'ADV', make: function (r) { return otherPart(r, [6, 4, 3, 5]); } },
        { id: 'e11b', level: 'ADV', make: function (r) { return otherPart(r, [12, 10, 8, 9, 14]); } }] },
      { num: '12', stem: '', parts: [
        { id: 'e12', level: 'ADV', make: function (r) {
          var v = pairBy(r, [12, 6, 8, 10, 14, 15], [2, 3, 4, 5, 7], 20, 120, [36, 84, 12]), g = v[2], Pd = v[0] * v[1], L = Pd / g;
          var p = P.number('The product of two whole numbers is ' + t(F(Pd)) + ' and their greatest common factor is ' + t(g) + '. Determine their lowest common multiple <b>without</b> finding the two numbers.', L, function (x) {
            if (x === Pd * g) return { code: 'no-divide', hint: 'GCF × LCM = product, so the LCM is the product <b>divided</b> by the GCF.' };
            if (x === Pd / (g * g)) return { code: 'no-divide', hint: 'Divide the product by the GCF only once.' };
            return null;
          }, t(g + '\\times\\text{LCM}=' + F(Pd)) + ', so ' + t('\\text{LCM}=' + F(Pd) + '\\div ' + g + '=' + F(L)) + '.', ['Use ' + t('\\text{GCF}\\times\\text{LCM}=a\\times b') + '.'], 'LCM from product ' + Pd + ', GCF ' + g, { before: t('\\text{LCM}=') });
          p.bad = [String(Pd * g), String(Pd / (g * g))];
          return p;
        } }] },
      { num: '13', section: 'Extra practice D — Reasoning about primes, GCF, and LCM', stem: '', parts: [
        { id: 'e13', level: 'PRG', make: function (r) {
          var a = r.int(3, 9), k = r.int(2, 5), b = a * k, c = r.int(3, 9); while (c === a || gcd(c, a) === c) c = r.int(3, 11);
          return P.mc(r, 'For some pairs of numbers, ' + t('\\text{GCF}(a,b)=a') + '. Exactly when does this happen?', [
            { html: 'When ' + t('a') + ' is a factor of ' + t('b') + ' — for example ' + t('\\text{GCF}(' + a + ',' + b + ')=' + a) + '.', right: true },
            { html: 'When ' + t('a') + ' and ' + t('b') + ' are both even — for example ' + t('\\text{GCF}(' + 2 * c + ',' + 2 * (c + 1) + ')') + '.', why: 'Check: ' + t('\\text{GCF}(' + 2 * c + ',' + 2 * (c + 1) + ')=' + gcd(2 * c, 2 * c + 2)) + ', not ' + t(2 * c) + '.' },
            { html: 'When ' + t('a') + ' is smaller than ' + t('b') + ' — for example ' + t('\\text{GCF}(' + Math.min(a, c) + ',' + (Math.min(a, c) + 1) + ')') + '.', why: t('\\text{GCF}(' + Math.min(a, c) + ',' + (Math.min(a, c) + 1) + ')=1') + '. Being smaller isn’t enough.' },
            { html: 'When ' + t('a') + ' and ' + t('b') + ' are both prime.', why: 'Two different primes have GCF ' + t('1') + ', not ' + t('a') + '.' }],
            t('a') + ' is always a factor of itself. If ' + t('a') + ' also divides ' + t('b') + ', then ' + t('a') + ' is a common factor, and no common factor can be bigger than ' + t('a') + '. Example: ' + t(b + '=' + a + '\\times ' + k) + ', so ' + t('\\text{GCF}(' + a + ',' + b + ')=' + a) + '.', ['Try a pair like ' + t(a) + ' and ' + t(b) + '.'], 'when GCF(a,b)=a');
        } }] },
      { num: '14', stem: '', parts: [
        { id: 'e14', level: 'PRG', make: function (r) {
          var ab = find(function () { return sortN(r.sample(range(4, 15), 2)); }, function (v) { return gcd(v[0], v[1]) === 1; }, [8, 9]), cd = find(function () { return sortN(r.sample(range(4, 15), 2)); }, function (v) { return gcd(v[0], v[1]) > 1 && noneDivides(v); }, [6, 9]);
          return P.mc(r, 'For some pairs of numbers, ' + t('\\text{LCM}(a,b)=a\\times b') + '. Exactly when does this happen?', [
            { html: 'When the two numbers share no prime factor (their GCF is ' + t('1') + ') — for example ' + t('\\text{LCM}(' + ab[0] + ',' + ab[1] + ')=' + ab[0] * ab[1]) + '.', right: true },
            { html: 'Always: the LCM of two numbers is their product.', why: t('\\text{LCM}(' + cd[0] + ',' + cd[1] + ')=' + lcm(cd[0], cd[1])) + ', but ' + t(cd[0] + '\\times ' + cd[1] + '=' + cd[0] * cd[1]) + '.' },
            { html: 'Only when both numbers are prime.', why: t(ab[0]) + ' and ' + t(ab[1]) + ' aren’t both prime, but ' + t('\\text{LCM}(' + ab[0] + ',' + ab[1] + ')=' + ab[0] * ab[1]) + '.' },
            { html: 'When one number is a factor of the other.', why: 'Then the LCM is just the larger number, e.g. ' + t('\\text{LCM}(4,12)=12') + '.' }],
            'Since ' + t('\\text{GCF}\\times\\text{LCM}=a\\times b') + ', the LCM equals ' + t('a\\times b') + ' exactly when the GCF is ' + t('1') + ': the numbers share no prime factor. Example: ' + t('\\text{LCM}(' + ab[0] + ',' + ab[1] + ')=' + ab[0] * ab[1]) + '.', ['Try a pair with a common factor, like ' + t(cd[0]) + ' and ' + t(cd[1]) + '.'], 'when LCM=ab');
        } }] },
      { num: '15', stem: '', parts: [
        { id: 'e15', level: 'PRG', make: function (r) {
          var e = 2 * r.int(2, 30);
          return P.mc(r, '<b>Explain</b> why ' + t('2') + ' is the only even prime number. (For example, why isn’t ' + t(e) + ' prime?)', [
            { html: 'Every even number has ' + t('2') + ' as a factor. An even number bigger than ' + t('2') + ' has at least the factors ' + t('1') + ', ' + t('2') + ' and itself — more than two — so it is composite.', right: true },
            { html: 'Even numbers are too big to be prime.', why: t('2') + ' itself is even and prime, and many big odd numbers are prime. Size isn’t the reason.' },
            { html: t('2') + ' is the only even number with exactly one factor.', why: t('2') + ' has <b>two</b> factors, ' + t('1') + ' and ' + t('2') + ' — that’s why it is prime.' },
            { html: 'Even numbers can always be divided by ' + t('4') + '.', why: t('6') + ' is even but isn’t divisible by ' + t('4') + '.' }],
            t(e + '=2\\times ' + e / 2) + ', so it has the factors ' + t('1, 2, ' + e / 2 + ', ' + e) + ' (at least). Every even number above ' + t('2') + ' has ' + t('2') + ' as a factor besides ' + t('1') + ' and itself, so it is composite. Only ' + t('2') + ' escapes: its factors are just ' + t('1') + ' and ' + t('2') + '.', ['What factor does every even number have?'], 'why 2 only even prime');
        } }] },
      { num: '16', stem: 'Decide whether each statement is <b>true</b> or <b>false</b>, and choose the justification.', parts: ['a', 'b', 'c', 'd'].map(function (L, i) {
        return { id: 'e16' + L, level: 'PRG', make: function (r) { return tfPart(r, i); } };
      }) },
      { num: '17', section: 'Extra practice E — Applications and a stretch', stem: function (sh) { return 'A rectangular hallway floor measures ' + t(sh.a) + ' cm by ' + t(sh.b) + ' cm. It is to be covered exactly by identical square tiles, with no tile cut and no gaps.'; },
        shared: function (r) { var v = pairBy(r, [12, 10, 15, 18, 20, 9, 14], [5, 6, 7, 8, 9, 11, 13, 15], 60, 200, [132, 180, 12]); return { a: v[0], b: v[1], g: v[2] }; },
        parts: [
          { id: 'e17a', level: 'PRG', make: function (r, sh) { var p = P.number('What is the largest possible side length of a tile?', sh.g, gcfDiag([sh.a, sh.b]), 'The side length must divide evenly into both ' + t(sh.a) + ' and ' + t(sh.b) + ', and be as large as possible: the <b>GCF</b>.<br>' + gcfSol([sh.a, sh.b]) + '<br><b>' + sh.g + ' cm</b>.', ['The tile side has to fit evenly into both measurements. Factor or multiple?'], 'tile ' + sh.a + 'x' + sh.b, { after: 'cm' }); p.bad = [String(lcm(sh.a, sh.b))]; return p; } },
          { id: 'e17b', level: 'ADV', make: function (r, sh) {
            var x = sh.a / sh.g, y = sh.b / sh.g, n = x * y;
            var p = P.number('How many tiles of that size are needed?', n, function (v) {
              if (v === sh.a * sh.b / sh.g) return { code: 'area-by-side', hint: 'You divided the floor’s area by the tile’s <b>side length</b>. Count tiles along each side and multiply.' };
              if (v === x + y) return { code: 'added', hint: 'Those are the tiles along each side. The tiles form a grid, so <b>multiply</b>.' };
              return null;
            }, t(sh.a + '\\div ' + sh.g + '=' + x) + ' tiles along one side and ' + t(sh.b + '\\div ' + sh.g + '=' + y) + ' along the other, so ' + t(x + '\\times ' + y + '=' + n) + ' tiles.', ['How many tiles fit along each side?'], 'tile count', { after: 'tiles' });
            p.bad = [String(x + y)];
            return p;
          } }] },
      { num: '18', stem: 'For each situation, first state whether you need the <b>GCF</b> or the <b>LCM</b>, then solve.', parts: [
        { id: 'e18a', level: 'ADV', make: function (r) {
          var ab = find(function () { return sortN(r.sample([15, 18, 20, 24, 25, 30, 35, 36, 40, 42, 45, 48, 50, 54, 56, 60, 72, 75, 80, 90], 2)); }, function (v) { var L = lcm(v[0], v[1]); return gcd(v[0], v[1]) > 1 && noneDivides(v) && L >= 90 && L <= 400 && L % 60 !== 0; }, [36, 48]), a = ab[0], b = ab[1], L = lcm(a, b), h = Math.floor(L / 60), m = L % 60;
          var p = P.fields('Ferry A leaves the dock every ' + t(a) + ' minutes and Ferry B every ' + t(b) + ' minutes. They just left together. How long until they next leave together, in hours and minutes?',
            [{ name: 'Tool', label: 'GCF or LCM?', mode: 'text', placeholder: 'GCF or LCM' }, { name: 'Hours', label: 'Hours', after: 'h' }, { name: 'Minutes', label: 'Minutes', after: 'min' }],
            [toolChk('lcm'), K.number(h, function (v) { if (v === L) return { code: 'u1l3-hm', hint: t(L) + ' is the time in minutes. Change it to hours and minutes: ' + t('60') + ' minutes in an hour.' }; if (v === Math.round(L / 60 * 100) / 100) return { code: 'u1l3-hm', hint: 'Give whole hours here and the leftover minutes in the next box.' }; return null; }), K.number(m, function (v) { return v === L ? { code: 'u1l3-hm', hint: 'Take out the full hours first.' } : null; })],
            ['LCM', String(h), String(m)], 'LCM; ' + t(L + '\\text{ min}=' + h + '\\text{ h }' + m + '\\text{ min}'),
            '<b>LCM</b>: they leave together at common multiples of ' + t(a) + ' and ' + t(b) + ' minutes; we want the first one.<br>' + lcmSol([a, b]) + '<br>' + t(L + '\\text{ min}=' + h + '\\times 60+' + m) + ', so <b>' + h + ' h ' + m + ' min</b>.',
            ['Do the ferries line up at a multiple or a factor of their times?', 'Find the LCM in minutes, then change it to hours and minutes.'], 'ferries ' + a + ',' + b);
          p.bad = [['GCF', String(h), String(m)], ['LCM', String(L), '0']];
          return p;
        } },
        { id: 'e18b', level: 'ADV', make: function (r) {
          var v = pairBy(r, [42, 24, 18, 36, 30, 21, 28], [2, 3, 4, 5], 40, 180, [84, 126, 42]), a = v[0], b = v[1], g = v[2];
          var p = P.fields('A teacher has ' + t(a) + ' pencils and ' + t(b) + ' erasers to sort into identical supply kits, using everything, with as many kits as possible. How many kits, and what goes in each?',
            [{ name: 'Tool', label: 'GCF or LCM?', mode: 'text', placeholder: 'GCF or LCM' }, { name: 'Kits', label: 'Kits', after: 'kits' }, { name: 'Pencils', label: 'Each kit', after: 'pencils' }, { name: 'Erasers', label: 'Each kit', after: 'erasers' }],
            [toolChk('gcf'), K.number(g, gcfDiag([a, b])), K.number(a / g, function (x) { return x === b / g ? { code: 'swapped', hint: 'That’s the number of erasers per kit.' } : null; }), K.number(b / g, function (x) { return x === a / g ? { code: 'swapped', hint: 'That’s the number of pencils per kit.' } : null; })],
            ['GCF', String(g), String(a / g), String(b / g)], 'GCF; ' + t(g) + ' kits, each with ' + t(a / g) + ' pencils and ' + t(b / g) + ' erasers',
            '<b>GCF</b>: the number of kits must divide both totals, and we want the most kits.<br>' + gcfSol([a, b]) + '<br>' + t(a + '\\div ' + g + '=' + a / g) + ' pencils and ' + t(b + '\\div ' + g + '=' + b / g) + ' erasers in each of the <b>' + g + '</b> kits.',
            ['Must the kits divide <b>into</b> the totals, or the totals into something?'], 'kits ' + a + ',' + b);
          p.bad = [['LCM', String(g), String(a / g), String(b / g)], ['GCF', String(lcm(a, b)), String(a / g), String(b / g)]];
          return p;
        } }] },
      { num: '19', stem: function (sh) { return 'Storage boxes come in two heights: ' + t(sh.a) + ' cm and ' + t(sh.b) + ' cm. Ravi builds one stack using only ' + t(sh.a) + ' cm boxes and a second stack using only ' + t(sh.b) + ' cm boxes, and the two stacks end up exactly the same height.'; },
        shared: function (r) { var v = find(function () { return sortN(r.sample([8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 24, 25, 30], 2)); }, function (v) { return gcd(v[0], v[1]) > 1 && noneDivides(v) && lcm(v[0], v[1]) <= 150; }, [15, 18]); return { a: v[0], b: v[1], L: lcm(v[0], v[1]) }; },
        parts: [
          { id: 'e19a', level: 'ADV', make: function (r, sh) { var p = P.number('What is the shortest possible height of the stacks?', sh.L, lcmDiag([sh.a, sh.b]), 'Each stack’s height is a multiple of its box height, so the shared height is a common <b>multiple</b>; the shortest is the LCM.<br>' + lcmSol([sh.a, sh.b]) + '<br><b>' + sh.L + ' cm</b>.', ['Is the stack height a multiple or a factor of ' + t(sh.a) + ' and ' + t(sh.b) + '?'], 'stacks LCM ' + sh.a + ',' + sh.b, { after: 'cm' }); p.bad = [String(sh.a * sh.b)].filter(function (s) { return Number(s) !== sh.L; }); return p; } },
          { id: 'e19b', level: 'ADV', make: function (r, sh) {
            var p = P.fields('How many boxes are in each stack?', [{ name: 'small', label: t(sh.a) + ' cm boxes', after: 'boxes' }, { name: 'big', label: t(sh.b) + ' cm boxes', after: 'boxes' }],
              [K.number(sh.L / sh.a, function (x) { return x === sh.L / sh.b ? { code: 'swapped', hint: 'The shorter boxes need <b>more</b> of them to reach the same height.' } : null; }), K.number(sh.L / sh.b, function (x) { return x === sh.L / sh.a ? { code: 'swapped', hint: 'The taller boxes need <b>fewer</b> of them.' } : null; })],
              [String(sh.L / sh.a), String(sh.L / sh.b)], t(sh.L / sh.a) + ' and ' + t(sh.L / sh.b) + ' boxes', t(sh.L + '\\div ' + sh.a + '=' + sh.L / sh.a) + ' boxes of ' + t(sh.a) + ' cm and ' + t(sh.L + '\\div ' + sh.b + '=' + sh.L / sh.b) + ' boxes of ' + t(sh.b) + ' cm.', ['Divide the stack height by each box height.'], 'box counts');
            p.bad = [[String(sh.L / sh.b), String(sh.L / sh.a)]];
            return p;
          } }] },
      { num: '20', stem: '<i>(Stretch)</i>', parts: [
        { id: 'e20a', level: 'ADV', make: function (r) { return rangeLcmPart(r.pick([5, 6, 7, 8, 4])); } },
        { id: 'e20b', level: 'MAS', make: function (r) { return rangeLcmPart(r.pick([9, 10, 11, 12])); } }] },
      { num: '21', section: 'Mastery challenge', stem: '', parts: [
        { id: 'e21', level: 'MAS', make: function (r) {
          var v = find(function () { var g = r.pick([2, 3, 4, 5, 6, 7, 8]), x = r.pick([2, 3, 4, 5, 7, 8, 9]), y = r.pick([3, 4, 5, 7, 9, 11, 13]); return [g, x, y]; }, function (v) {
            var g = v[0], x = v[1], y = v[2]; if (x >= y || gcd(x, y) !== 1) return false;
            var k = x * y, splits = nt.divisors(k).filter(function (u) { return u > 1 && u * u < k && gcd(u, k / u) === 1; });
            return splits.length === 1 && g * k <= 300;
          }, [6, 4, 5]);
          var g = v[0], x = v[1], y = v[2], A = g * x, B = g * y, L = g * x * y;
          var chk = function (resp) {
            var a = HW.parse.number(resp[0] || ''), b = HW.parse.number(resp[1] || '');
            if (!a.ok || !b.ok) return form('blank', 'Put one number in each box.');
            var p = Math.min(a.value, b.value), q = Math.max(a.value, b.value);
            if (p === g || q === g) return wrong('u1l3-pair-g', 'Both numbers must be <b>greater</b> than the GCF ' + t(g) + '.');
            if (!(p > 0) || p % 1 || q % 1) return wrong('value', null);
            if (gcd(p, q) !== g) return wrong('u1l3-pair-gcf', t('\\text{GCF}(' + p + ',' + q + ')=' + gcd(p, q)) + ', not ' + t(g) + '.');
            if (lcm(p, q) !== L) return wrong('u1l3-pair-lcm', t('\\text{LCM}(' + p + ',' + q + ')=' + F(lcm(p, q))) + ', not ' + t(L) + '.');
            return ok();
          };
          var p = { prompt: 'Two whole numbers, both greater than ' + t(g) + ', have a GCF of ' + t(g) + ' and an LCM of ' + t(L) + '. Find the two numbers.', input: { type: 'fields', fields: [{ name: 'Smaller', label: 'Smaller number' }, { name: 'Larger', label: 'Larger number' }] },
            check: chk, key: [String(A), String(B)], answer: t(A) + ' and ' + t(B), text: 'pair GCF ' + g + ' LCM ' + L,
            solution: 'Both numbers are multiples of the GCF: ' + t(g + 'x') + ' and ' + t(g + 'y') + ', where ' + t('x') + ' and ' + t('y') + ' share no factor. Then ' + t('\\text{GCF}\\times\\text{LCM}=a\\times b') + ' gives ' + t(g + '\\times ' + L + '=' + g + 'x\\times ' + g + 'y') + ', so ' + t('xy=' + x * y) + '.<br>' + t(x * y) + ' splits into two factors that share no factor (and neither is ' + t('1') + ') only as ' + t(x + '\\times ' + y) + '. So the numbers are ' + t(g + '\\times ' + x + '=' + A) + ' and ' + t(g + '\\times ' + y + '=' + B) + '.<br>Check: ' + t('\\text{GCF}(' + A + ',' + B + ')=' + g) + ', ' + t('\\text{LCM}(' + A + ',' + B + ')=' + L) + ' ✓',
            hints: ['Both numbers are multiples of ' + t(g) + '. Use ' + t('\\text{GCF}\\times\\text{LCM}=a\\times b') + ' to find their product.', 'Divide ' + t(L) + ' by ' + t(g) + ' and split the result into two factors with no common factor.'] };
          p.bad = [[String(g), String(L)]];
          p.good = [[String(B), String(A)]];
          return p;
        } }] }
    ]
  });

  /* ---------- part makers that need the helpers above ---------- */
  function valuePart(fs) {
    var n = fs.reduce(function (m, pe) { return m * Math.pow(pe[0], pe[1]); }, 1), tex = HW.texFactors(fs), wrongAdd = fs.reduce(function (m, pe) { return m * pe[0] * pe[1]; }, 1);
    var p = P.number(t(tex), n, function (v) { if (v === wrongAdd && v !== n) return { code: 'u1l3-value', hint: 'An exponent means repeated multiplication: ' + t('2^{4}=2\\times 2\\times 2\\times 2=16') + ', not ' + t('2\\times 4') + '.' }; return null; },
      fs.map(function (pe) { return t(pe[0] + (pe[1] > 1 ? '^{' + pe[1] + '}' : '') + '=' + Math.pow(pe[0], pe[1])); }).join(', ') + '. So ' + t(tex + '=' + fs.map(function (pe) { return Math.pow(pe[0], pe[1]); }).join('\\times ') + '=' + F(n)) + '.', ['Work out each power first.', 'Then multiply them together.'], 'value of ' + tex, { before: t('=') });
    if (wrongAdd !== n) p.bad = [String(wrongAdd)];
    return p;
  }
  function identityPart(ab) {
    var a = ab[0], b = ab[1], g = gcd(a, b), L = lcm(a, b);
    var p = P.fields(t('a=' + a) + ' and ' + t('b=' + b) + ': find the GCF and the LCM, multiply them, and compare with ' + t('a\\times b') + '.',
      [{ name: 'GCF', before: t('\\text{GCF}=') }, { name: 'LCM', before: t('\\text{LCM}=') }, { name: 'GCF × LCM', before: t('\\text{GCF}\\times\\text{LCM}=') }, { name: 'a × b', before: t('a\\times b=') }],
      [K.number(g, gcfDiag(ab)), K.number(L, lcmDiag(ab)), K.number(g * L), K.number(a * b)], [String(g), String(L), String(g * L), String(a * b)],
      t('\\text{GCF}=' + g + ',\\ \\text{LCM}=' + L) + '; both products are ' + t(F(a * b)) + '.',
      facLines(ab) + '.<br>' + t('\\text{GCF}=' + eqv(g)) + ', ' + t('\\text{LCM}=' + eqv(L)) + '.<br>' + t(g + '\\times ' + L + '=' + F(g * L)) + ' and ' + t(a + '\\times ' + b + '=' + F(a * b)) + ': equal ✓', ['Factor both numbers first.'], 'identity ' + a + ',' + b);
    p.bad = [[String(L), String(g), String(g * L), String(a * b)]];
    return p;
  }
  function otherPart(r, gs) {
    var v = find(function () { var g = r.pick(gs), x = r.int(2, 6), y = r.int(2, 7); return [g * x, g * y, g]; }, function (v) { return v[0] !== v[1] && gcd(v[0], v[1]) === v[2] && noneDivides([v[0], v[1]]) && v[1] <= 120; }, [18, 24, 6]);
    var known = v[0], ans = v[1], g = v[2], L = lcm(known, ans);
    if (r.chance(0.5)) { known = v[1]; ans = v[0]; }
    var p = P.number('Two numbers have a GCF of ' + t(g) + ' and an LCM of ' + t(L) + '. One of the numbers is ' + t(known) + '. What is the other number?', ans, function (x) {
      if (x === g * L) return { code: 'no-divide', hint: 'That’s ' + t('\\text{GCF}\\times\\text{LCM}') + ', which equals the <b>product</b> of the two numbers. Divide it by ' + t(known) + '.' };
      if (x === L / g) return { code: 'u1l3-pair-g', hint: 'Use ' + t('\\text{GCF}\\times\\text{LCM}=a\\times b') + ': multiply ' + t(g + '\\times ' + L) + ', then divide by ' + t(known) + '.' };
      return null;
    }, t(g + '\\times ' + L + '=' + known + '\\times\\square') + ', so ' + t('\\square=' + F(g * L) + '\\div ' + known + '=' + ans) + '.<br>Check: ' + t('\\text{GCF}(' + Math.min(known, ans) + ',' + Math.max(known, ans) + ')=' + g) + ' and ' + t('\\text{LCM}=' + L) + ' ✓', ['Multiply the GCF and the LCM: that is the product of the two numbers.', 'Divide by the number you know.'], 'other number GCF ' + g + ' LCM ' + L);
    p.bad = [String(g * L), String(L / g)].filter(function (s) { return Number(s) !== ans; });
    return p;
  }
  function rangeLcmPart(N) {
    var L = lcmA(range(1, N)), f = 1; for (var i = 2; i <= N; i++) f *= i;
    var p = P.number('Determine the smallest whole number greater than ' + t('0') + ' that is divisible by <b>every</b> whole number from ' + t('1') + ' to ' + t(N) + '.', L, function (v) {
      if (v === f) return { code: 'lcm-product', hint: 'Multiplying ' + t('1\\times 2\\times\\cdots\\times ' + N) + ' gives <i>a</i> common multiple, but repeats primes (like the ' + t('2') + ' in ' + t('4') + ' and ' + t('2') + '). Find the LCM.' };
      if (v > 0 && v % 1 === 0 && range(1, N).every(function (k) { return v % k === 0; })) return { code: 'lcm-not-least', hint: t(F(v)) + ' works, but it isn’t the smallest. Use each prime only to its highest power.' };
      if (v > 0 && v % 1 === 0) { var miss = range(1, N).filter(function (k) { return v % k; }); return { code: 'lcm-low-power', hint: t(miss[0]) + ' doesn’t divide ' + t(F(v)) + '. Check the highest power of each prime up to ' + t(N) + '.' }; }
      return null;
    }, 'This is the LCM of ' + t('1, 2, \\ldots, ' + N) + '. Take the highest power of each prime up to ' + t(N) + ': ' + nt.factor(L).map(function (pe) { return t(pe[0] + (pe[1] > 1 ? '^{' + pe[1] + '}=' + Math.pow(pe[0], pe[1]) : '')); }).join(', ') + '.<br>' + t('\\text{LCM}=' + K.fac(L) + '=' + F(L)) + '.',
    ['This is the LCM of all the numbers from ' + t('1') + ' to ' + t(N) + '.', 'Use the highest power of each prime that fits, e.g. ' + t('2^{' + Math.floor(Math.log2(N)) + '}=' + Math.pow(2, Math.floor(Math.log2(N)))) + '.'], 'LCM 1..' + N, { before: '' });
    p.bad = [String(f), String(L * 2)].filter(function (s) { return Number(s) !== L; });
    return p;
  }
  function tfPart(r, i) {
    var S;
    if (i === 0) {
      var a = 2 * r.int(2, 12), b = 2 * r.int(2, 12); while (b === a) b = 2 * r.int(2, 12);
      S = r.chance(0.6) ? { text: 'If two numbers are both even, then their GCF must be even.', truth: true, good: 'True — ' + t('2') + ' is a common factor, so the GCF (which every common factor divides) is a multiple of ' + t('2') + '. E.g. ' + t('\\text{GCF}(' + a + ',' + b + ')=' + gcd(a, b)) + '.',
        bad: ['False — e.g. ' + t('\\text{GCF}(' + a + ',' + b + ')=' + gcd(a, b)) + ' is odd.', 'False — the GCF of two even numbers is always ' + t('2') + '.'] }
        : { text: 'If two numbers are both odd, then their GCF must be odd.', truth: true, good: 'True — an even number can’t divide an odd number, so every common factor (and the GCF) is odd. E.g. ' + t('\\text{GCF}(' + (a + 1) + ',' + (3 * (a + 1)) + ')=' + (a + 1)) + '.', bad: ['False — e.g. ' + t('\\text{GCF}(10,15)=5') + ', and ' + t('10') + ' and ' + t('15') + ' have an odd GCF.', 'False — the GCF of two odd numbers is always ' + t('1') + '.'] };
    } else if (i === 1) {
      var m = r.int(3, 9), k = r.int(2, 5);
      S = r.chance(0.6) ? { text: 'The LCM of two different whole numbers is always greater than both of them.', truth: false, good: 'False — if one is a factor of the other, the LCM is the larger one: ' + t('\\text{LCM}(' + m + ',' + m * k + ')=' + m * k) + '.', bad: ['True — the LCM is a multiple of both, so it is bigger than both.', 'False — the LCM is always smaller than the larger number.'] }
        : { text: 'The GCF of two different whole numbers is always less than both of them.', truth: false, good: 'False — if one is a factor of the other, the GCF is the smaller one: ' + t('\\text{GCF}(' + m + ',' + m * k + ')=' + m) + '.', bad: ['True — a common factor must divide both, so it is smaller than both.', 'False — the GCF is always bigger than the smaller number.'] };
    } else if (i === 2) {
      var g0 = r.pick([2, 3, 4, 5, 6]), x = r.int(2, 5), y = r.int(2, 7); while (gcd(x, y) !== 1 || x === y) { x = r.int(2, 5); y = r.int(2, 7); }
      var A = g0 * x, B = g0 * y;
      S = r.chance(0.6) ? { text: 'The GCF of two numbers is always a factor of their LCM.', truth: true, good: 'True — the GCF divides each number, and each number divides the LCM. E.g. ' + t('\\text{GCF}(' + A + ',' + B + ')=' + g0) + ' divides ' + t('\\text{LCM}=' + lcm(A, B)) + '.', bad: ['False — e.g. ' + t('\\text{GCF}(' + A + ',' + B + ')=' + g0) + ' doesn’t divide ' + t(lcm(A, B)) + '.', 'True — because the GCF is always ' + t('1') + '.'] }
        : { text: 'The LCM of two numbers is always a multiple of their GCF.', truth: true, good: 'True — the GCF divides each number, and each number divides the LCM. E.g. ' + t(lcm(A, B) + '=' + g0 + '\\times ' + lcm(A, B) / g0) + '.', bad: ['False — e.g. ' + t('\\text{LCM}(' + A + ',' + B + ')=' + lcm(A, B)) + ' isn’t a multiple of ' + t(g0) + '.', 'True — because the LCM is always the product of the numbers.'] };
    } else {
      var n = r.pick([91, 77, 143, 119, 133, 85, 95, 121, 169, 187]);
      S = r.chance(0.6) ? { text: 'Every whole number greater than ' + t('1') + ' has at least one prime factor.', truth: true, good: 'True — the number is either prime itself, or it breaks into smaller factors until primes are left. E.g. ' + t(n + '=' + K.fac(n)) + '.', bad: ['False — e.g. ' + t(n) + ' has no prime factors.', 'False — composite numbers have no prime factors.'] }
        : { text: 'A whole number greater than ' + t('1') + ' can have two different prime factorizations.', truth: false, good: 'False — every number breaks into exactly one set of primes, whichever factor tree you draw. E.g. ' + t(n + '=' + K.fac(n)) + ' only.', bad: ['True — different factor trees give different primes.', 'True — e.g. ' + t(n) + ' can be written as ' + t(K.fac(n)) + ' or as ' + t('1\\times ' + n) + '.'] };
    }
    var opts = [{ html: S.good, right: true }].concat(S.bad.map(function (b, j) { return { html: b, why: S.truth ? 'The statement is true. ' + S.good.replace(/^True — /, '') : 'Look for a pair where one number is a factor of the other.', code: 'bad' + j }; }));
    return P.mc(r, S.text, opts, S.good, ['Try a few examples, including a pair where one number is a factor of the other.'], 'T/F ' + S.text.replace(/<[^>]+>|\\\(|\\\)/g, ''));
  }
})(window);
