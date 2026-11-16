/* ============================================================================
   GENERATOR — NUMBER SERIES
   ----------------------------------------------------------------------------
   Makes the questions for a Flow-Traders-style sequences paper: a run of terms,
   four choices for the next one.

   There are 27 rule families below — constant differences, changing ratios,
   recurrences, two rules interleaved, digit tricks, primes and powers — and a
   paper takes each at most twice, with fresh numbers every time. So a sitting
   tests whether you can FIND a rule, not whether you remember one.

   Three things are guaranteed for every question, and re-checked by
   validate.js and tests.html with code that shares nothing with this file:

     1. The terms shown and the answer both come from the same rule.
     2. Exactly one option is right.
     3. No simpler reading of the shown terms gives a different answer. Before
        a series is used, a set of standard rival rules (constant differences
        to the third level, constant ratio, "times m plus c", the sum or
        product of earlier terms, two interleaved series, two steps taking
        turns) is fitted to the terms shown. If any rival fits them all and predicts a different next
        term, the series is thrown away.

   Every value is an exact rational { n, d } on integers. Nothing here touches
   the DOM, so node can run it.
   ========================================================================== */

QGenerators.add((function () {

  /* ---- Exact rationals ----------------------------------------------------- */

  function gcd(a, b) {
    a = Math.abs(a); b = Math.abs(b);
    while (b) { const t = a % b; a = b; b = t; }
    return a || 1;
  }

  function R(n, d) {
    if (d === undefined) d = 1;
    if (d < 0) { n = -n; d = -d; }
    const g = gcd(n, d);
    return { n: n / g, d: d / g };
  }

  const I = n => R(n, 1);
  const add = (x, y) => R(x.n * y.d + y.n * x.d, x.d * y.d);
  const sub = (x, y) => R(x.n * y.d - y.n * x.d, x.d * y.d);
  const mul = (x, y) => R(x.n * y.n, x.d * y.d);
  const div = (x, y) => R(x.n * y.d, x.d * y.n);
  const eq = (x, y) => x.n === y.n && x.d === y.d;
  const lt = (x, y) => x.n * y.d < y.n * x.d;
  const neg = x => R(-x.n, x.d);
  const abs = x => R(Math.abs(x.n), x.d);
  const isInt = x => x.d === 1;

  const PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41];
  const WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];

  /* ---- Formatting ------------------------------------------------------------
     style: "int" (long numbers get thin spaces), "raw" (a digit string: never
     grouped), "frac", "dec". text() is the plain form the re-marker reads. */

  const MINUS = "−";
  const THIN = " ";

  function places(x) {
    let pow = 1;
    for (let k = 0; k <= 6; k++) { if (pow % x.d === 0) return k; pow *= 10; }
    return -1;
  }

  function decText(x) {
    const k = places(x);
    const units = Math.abs(x.n) * (Math.pow(10, k) / x.d);
    let digits = String(units);
    if (k > 0) {
      while (digits.length <= k) digits = "0" + digits;
      digits = digits.slice(0, digits.length - k) + "." + digits.slice(digits.length - k);
    }
    return (x.n < 0 ? "-" : "") + digits;
  }

  function text(x, style) {
    if (style === "dec") return decText(x);
    return isInt(x) ? String(x.n) : x.n + "/" + x.d;
  }

  function html(x, style) {
    if (style === "dec") return decText(x).replace(/^-/, MINUS);
    const sign = x.n < 0 ? MINUS : "";
    if (!isInt(x))
      return sign + '<span class="frac"><span>' + Math.abs(x.n) + "</span><span>" + x.d + "</span></span>";
    let digits = String(Math.abs(x.n));
    if (style !== "raw" && digits.length >= 5) digits = digits.replace(/\B(?=(\d{3})+$)/g, THIN);
    return sign + digits;
  }

  function fits(x, style) {
    if (style === "int") return isInt(x);
    if (style === "raw") return isInt(x) && x.n > 0;
    if (style === "dec") { const k = places(x); return k !== -1 && k <= 4; }
    return true;
  }

  const frac = x => text(x, "frac");          // how a parameter is written in the check record

  /* ---- Rival rules ------------------------------------------------------------
     Every next term that some standard, simple rule would predict from the
     terms shown. A series is only used if all of these agree with its answer. */

  function differences(t) {
    const out = [];
    for (let i = 1; i < t.length; i++) out.push(sub(t[i], t[i - 1]));
    return out;
  }

  const allSame = t => t.every(x => eq(x, t[0]));

  function steadyNext(t) {                     // arithmetic or geometric continuation, else null
    if (t.length < 3) return null;
    const d = differences(t);
    if (allSame(d)) return add(t[t.length - 1], d[0]);
    if (t.every(x => x.n !== 0)) {
      const r = [];
      for (let i = 1; i < t.length; i++) r.push(div(t[i], t[i - 1]));
      if (allSame(r)) return mul(t[t.length - 1], r[0]);
    }
    return null;
  }

  const SIMPLE_MULTIPLIERS = [I(1), I(2), I(3), I(4), I(5), I(-1), I(-2), R(1, 2), R(1, 3)];

  function rivals(t) {
    const out = [];
    const n = t.length;
    if (t.some(x => Math.abs(x.n) > 1e7 || x.d > 1e4)) return out;   // too big to fit safely
    const last = t[n - 1], prev = t[n - 2];

    // Constant differences at the first, second or third level.
    const rows = [t];
    for (let k = 1; k <= 3; k++) {
      const row = differences(rows[k - 1]);
      rows.push(row);
      if (row.length >= 2 && allSame(row)) {
        let next = I(0);
        for (let j = 0; j <= k; j++) next = add(next, rows[j][rows[j].length - 1]);
        out.push(next);
        break;
      }
    }

    // Constant ratio.
    const steady = steadyNext(t);
    if (steady) out.push(steady);

    // t[i] = m * t[i-1] + c, with a simple multiplier.
    if (n >= 4 && !eq(t[1], t[0])) {
      const m = div(sub(t[2], t[1]), sub(t[1], t[0]));
      const c = sub(t[1], mul(m, t[0]));
      if (Math.abs(m.n) <= 12 && m.d <= 4) {
        let ok = true;
        for (let i = 1; i < n && ok; i++) ok = eq(t[i], add(mul(m, t[i - 1]), c));
        if (ok) out.push(add(mul(m, last), c));
      }
    }

    // t[i] = t[i-1] + t[i-2] + c.
    if (n >= 4) {
      const c = sub(t[2], add(t[1], t[0]));
      let ok = true;
      for (let i = 2; i < n && ok; i++) ok = eq(t[i], add(add(t[i - 1], t[i - 2]), c));
      if (ok) out.push(add(add(last, prev), c));
    }

    // t[i] = p * t[i-1] + q * t[i-2], small whole p and q.
    if (n >= 5) {
      for (let p = -4; p <= 4; p++) for (let q = -4; q <= 4; q++) {
        if (q === 0) continue;
        let ok = true;
        for (let i = 2; i < n && ok; i++)
          ok = eq(t[i], add(mul(I(p), t[i - 1]), mul(I(q), t[i - 2])));
        if (ok) out.push(add(mul(I(p), last), mul(I(q), prev)));
      }
    }

    // Sum of the three before; product of the two before.
    if (n >= 5) {
      let ok = true;
      for (let i = 3; i < n && ok; i++) ok = eq(t[i], add(add(t[i - 1], t[i - 2]), t[i - 3]));
      if (ok) out.push(add(add(last, prev), t[n - 3]));
      ok = true;
      for (let i = 2; i < n && ok; i++) ok = eq(t[i], mul(t[i - 1], t[i - 2]));
      if (ok) out.push(mul(last, prev));
    }

    // Two steady series interleaved.
    if (n >= 6) {
      const even = t.filter((x, i) => i % 2 === 0), odd = t.filter((x, i) => i % 2 === 1);
      const e = steadyNext(even), o = steadyNext(odd);
      if (e && o) out.push(n % 2 === 0 ? e : o);
    }

    // Two simple steps taking turns: "times m, plus c" on the 1st, 3rd, 5th...
    // moves and another on the 2nd, 4th... A step only counts as a rival if it
    // has been seen three times, or twice with a small constant.
    if (n >= 6) {
      const fitsAt = parity => {
        const found = [];
        const moves = [];
        for (let i = 1; i < n; i++) if ((i - 1) % 2 === parity) moves.push(i);
        for (const m of SIMPLE_MULTIPLIERS) {
          const c = sub(t[moves[0]], mul(m, t[moves[0] - 1]));
          if (!isInt(c) || Math.abs(c.n) > 30) continue;
          if (moves.every(i => eq(t[i], add(mul(m, t[i - 1]), c)))) found.push({ m, c, seen: moves.length });
        }
        return found;
      };
      const a = fitsAt(0), b = fitsAt(1);
      if (a.length && b.length)
        for (const step of ((n - 1) % 2 === 0 ? a : b))
          if (step.seen >= 3 || Math.abs(step.c.n) <= 12) out.push(add(mul(step.m, last), step.c));
    }

    return out;
  }

  /* ---- Rule families -----------------------------------------------------------
     Each returns null (try again) or
       { family, params, terms, n, style, tier, group, why, wrong }
     terms   n shown terms followed by the answer, all from one rule
     params  what the independent re-marker needs to rebuild the terms
     tier    1 easy, 2 medium, 3 hard        group   heading in the results
     why     the explanation shown afterwards
     wrong   tempting wrong answers, most tempting first                        */

  function families(rand) {

    const int = (lo, hi) => lo + Math.floor(rand() * (hi - lo + 1));
    const pick = arr => arr[Math.floor(rand() * arr.length)];
    const chance = p => rand() < p;
    const nonzero = (lo, hi) => { let v; do { v = int(lo, hi); } while (v === 0); return v; };
    const run = (count, seed, step) => {
      const t = seed.slice();
      while (t.length < count) t.push(step(t, t.length));
      return t.slice(0, count);
    };

    // Small helpers for writing explanations.
    const h = (x, style) => html(typeof x === "number" ? I(x) : x, style || "int");
    const list = (xs, style) => xs.map(x => h(x, style)).join(", ");
    const signed = x => (x.n < 0 ? MINUS : "+") + html(abs(x), isInt(x) ? "int" : "frac");
    const paren = x => x.n < 0 ? "(" + h(x) + ")" : h(x);
    const plusMinus = (x, steps) => {
      const out = [];
      for (const s of steps) { out.push(add(x, I(s))); out.push(sub(x, I(s))); }
      return out;
    };
    const tail = t => ({ ans: t[t.length - 1], last: t[t.length - 2], prev: t[t.length - 3] });
    const carryOn = t => add(t[t.length - 2], sub(t[t.length - 2], t[t.length - 3]));   // repeat the last gap

    const F = {};

    /* -- differences -- */

    F.arithmetic = () => {
      const n = 5;
      let a, d, style = "int", unit = I(1);
      if (chance(0.25)) {
        const s = pick([10, 4, 20]);
        a = R(int(4, 200), s); d = R(nonzero(-45, 45), s); style = "dec"; unit = R(1, s);
        if (isInt(d)) return null;
      } else {
        a = I(int(-30, 120)); d = I(nonzero(-19, 19));
        if (Math.abs(d.n) < 3) return null;
      }
      const t = run(n + 1, [a], x => add(x[x.length - 1], d));
      const { ans, last } = tail(t);
      return { family: "arithmetic", params: { a: frac(a), d: frac(d) }, terms: t, n, style, tier: 1,
        group: "differences",
        why: `Each term is ${h(abs(d), style)} ${d.n > 0 ? "more" : "less"} than the one before: ` +
          `${h(last, style)} ${d.n > 0 ? "+" : MINUS} ${h(abs(d), style)} = ${h(ans, style)}.`,
        wrong: [add(ans, d), add(ans, unit), sub(ans, unit), add(ans, add(unit, unit)), sub(ans, add(unit, unit)),
          add(ans, add(d, d))] };
    };

    F.quadratic = () => {
      const n = 5;
      const a = int(-10, 30), d1 = nonzero(-8, 12), c = nonzero(-6, 6);
      if (d1 * (d1 + n * c) <= 0) return null;                 // gaps must keep one sign
      const t = run(n + 1, [I(a)], (x, i) => add(x[i - 1], I(d1 + (i - 1) * c)));
      const gaps = differences(t.slice(0, n));
      const { ans, last } = tail(t);
      const next = d1 + (n - 1) * c;
      return { family: "quadratic", params: { a: String(a), d: String(d1), c: String(c) }, terms: t, n,
        style: "int", tier: 1, group: "differences",
        why: `The differences are ${gaps.map(signed).join(", ")}. They change by ${signed(I(c))} each time, ` +
          `so the next difference is ${signed(I(next))}: ${h(last)} ${next > 0 ? "+" : MINUS} ${Math.abs(next)} = ${h(ans)}.`,
        wrong: [carryOn(t), add(ans, I(c)), add(ans, I(2 * c)), sub(ans, I(2 * c)), ...plusMinus(ans, [1, 2])] };
    };

    F.primeGaps = () => {
      const n = 6;
      const a = int(0, 25), j = int(0, 2), s = chance(0.25) ? -1 : 1;
      const t = run(n + 1, [I(a)], (x, i) => add(x[i - 1], I(s * PRIMES[j + i - 1])));
      const { ans, last } = tail(t);
      const p = PRIMES[j + n - 1], before = PRIMES[j + n - 2], after = PRIMES[j + n];
      return { family: "primeGaps", params: { a: String(a), j: j, s: s }, terms: t, n, style: "int", tier: 2,
        group: "differences",
        why: `The terms ${s > 0 ? "rise" : "fall"} by ${PRIMES.slice(j, j + n - 1).join(", ")}: the primes in order. ` +
          `The next prime is ${p}, so ${h(last)} ${s > 0 ? "+" : MINUS} ${p} = ${h(ans)}.`,
        wrong: [add(last, I(s * before)), add(last, I(s * (before + 2))), add(last, I(s * after)),
          add(last, I(s * (p + 1))), add(last, I(s * (p - 1))), ...plusMinus(ans, [3, 5])] };
    };

    F.squareGaps = () => {
      const n = 5;
      const a = int(0, 25), j = int(1, 2), s = chance(0.2) ? -1 : 1;
      const t = run(n + 1, [I(a)], (x, i) => add(x[i - 1], I(s * (j + i - 1) * (j + i - 1))));
      const { ans, last } = tail(t);
      const k = j + n - 1;
      const gaps = []; for (let i = j; i < k; i++) gaps.push(i * i);
      return { family: "squareGaps", params: { a: String(a), j: j, s: s }, terms: t, n, style: "int", tier: 2,
        group: "differences",
        why: `The terms ${s > 0 ? "rise" : "fall"} by ${gaps.join(", ")}: the squares in order. ` +
          `The next square is ${k * k}, so ${h(last)} ${s > 0 ? "+" : MINUS} ${k * k} = ${h(ans)}.`,
        wrong: [carryOn(t), add(last, I(s * (k + 1) * (k + 1))), add(last, I(s * (k * k - 2))),
          add(last, I(s * (k * k + 2))), ...plusMinus(ans, [1, 4])] };
    };

    /* -- multipliers -- */

    const RATIO_WORDS = { "1/2": "half", "1/3": "a third of", "2/3": "two thirds of",
      "3/2": "one and a half times", "5/2": "two and a half times" };

    F.geometric = () => {
      const r = pick([I(2), I(3), I(4), I(5), I(-2), I(-3), R(1, 2), R(3, 2), R(1, 3), R(2, 3), R(5, 2)]);
      const n = Math.abs(r.n) >= 4 ? 4 : pick([4, 5]);
      const m = chance(0.2) ? -int(1, 5) : int(1, 7);
      const a = I(m * Math.pow(r.d, n));
      const t = run(n + 1, [a], x => mul(x[x.length - 1], r));
      if (t.some(x => !isInt(x) || Math.abs(x.n) > 200000)) return null;
      const { ans, last } = tail(t);
      const how = isInt(r)
        ? (r.n > 0 ? `Each term is ${r.n} times the one before`
                   : `Multiply by ${MINUS}${-r.n} each time, so the signs alternate`)
        : `Each term is ${RATIO_WORDS[frac(r)]} the one before`;
      return { family: "geometric", params: { a: frac(a), r: frac(r) }, terms: t, n, style: "int", tier: 1,
        group: "multipliers",
        why: `The gaps are not constant, so look at the ratio. ${how}: ` +
          `${paren(last)} &times; ${isInt(r) ? paren(r) : h(r, "frac")} = ${h(ans)}.`,
        wrong: [carryOn(t), neg(ans), mul(last, add(r, I(1))), mul(last, sub(r, I(1))), add(ans, last),
          ...plusMinus(ans, [1, 2])] };
    };

    F.affine = () => {
      const n = 5;
      const m = pick([2, 2, 3, -2, 4]), c = nonzero(-7, 7), a = int(1, 9);
      if (a * (m - 1) + c === 0) return null;
      const t = run(n + 1, [I(a)], x => I(m * x[x.length - 1].n + c));
      if (t.some(x => Math.abs(x.n) > 60000)) return null;
      const { ans, last } = tail(t);
      return { family: "affine", params: { a: String(a), m: String(m), c: String(c) }, terms: t, n,
        style: "int", tier: 1, group: "multipliers",
        why: `Multiply by ${m < 0 ? MINUS + (-m) : m} and ${c > 0 ? "add" : "subtract"} ${Math.abs(c)} each time: ` +
          `${m < 0 ? "(" + MINUS + (-m) + ")" : m} &times; ${paren(last)} ${c > 0 ? "+" : MINUS} ${Math.abs(c)} = ${h(ans)}.`,
        wrong: [I(m * last.n), I(m * last.n - c), carryOn(t), add(ans, I(c)), ...plusMinus(ans, [1, 2])] };
    };

    F.growingMul = () => {
      const n = 5;
      const k = int(1, 2);
      const dividing = chance(0.35);
      let a;
      if (dividing) {
        a = int(1, 6);
        for (let i = 0; i < n; i++) a *= k + i;
      } else {
        a = int(1, 5);
      }
      const t = run(n + 1, [I(a)], (x, i) => dividing ? div(x[i - 1], I(k + i - 1)) : mul(x[i - 1], I(k + i - 1)));
      if (t.some(x => !isInt(x))) return null;
      const { ans, last } = tail(t);
      const by = k + n - 1;
      const steps = []; for (let i = 0; i < n - 1; i++) steps.push(k + i);
      return { family: "growingMul", params: { a: String(a), k: k, dir: dividing ? "div" : "mul" }, terms: t, n,
        style: "int", tier: 2, group: "multipliers",
        why: dividing
          ? `Each term is the one before divided by ${steps.join(", then ")}: the divisor grows by one each step. ` +
            `Divide by ${by} next: ${h(last)} &divide; ${by} = ${h(ans)}.`
          : `Divide each term by the one before: the multipliers are ${steps.join(", ")}. ` +
            `Multiply by ${by} next: ${h(last)} &times; ${by} = ${h(ans)}.`,
        wrong: dividing
          ? [div(last, I(by - 1)), carryOn(t), div(last, I(by + 1)), ...plusMinus(ans, [1, 2, 3])]
          : [mul(last, I(by - 1)), mul(last, I(by + 1)), carryOn(t), add(ans, last), ...plusMinus(ans, [by, 2 * by])] };
    };

    F.doublePlusIndex = () => {
      const m = pick([2, 2, 3]), c = pick([1, -1, 2]), a = int(1, 5);
      const n = m === 3 ? 5 : pick([5, 6]);
      const t = run(n + 1, [I(a)], (x, i) => I(m * x[i - 1].n + c * i));
      for (let i = 1; i < t.length; i++) if (t[i].n <= t[i - 1].n) return null;
      const { ans, last } = tail(t);
      const left = []; for (let i = 1; i < n; i++) left.push(I(c * i));
      const mult = m === 2 ? "double" : "three times";
      return { family: "doublePlusIndex", params: { a: String(a), m: String(m), c: String(c) }, terms: t, n,
        style: "int", tier: 3, group: "multipliers",
        why: `Compare each term with ${mult} the one before. What is left over is ${left.map(signed).join(", ")}: ` +
          `it changes by ${signed(I(c))} each step. Next: ${m} &times; ${h(last)} ${c > 0 ? "+" : MINUS} ${Math.abs(c * n)} = ${h(ans)}.`,
        wrong: [I(m * last.n + c * (n - 1)), I(m * last.n), I(m * last.n + c * (n + 1)), carryOn(t),
          ...plusMinus(ans, [2, 3])] };
    };

    /* -- recurrences -- */

    const sumOf = (x, y) => y.n < 0 ? `${h(x)} ${MINUS} ${h(abs(y))}` : `${h(x)} + ${h(y)}`;

    F.sumTwo = () => {
      const n = 6;
      const a = int(-4, 9), b = int(1, 12);
      const t = run(n + 1, [I(a), I(b)], (x, i) => add(x[i - 1], x[i - 2]));
      const { ans, last, prev } = tail(t);
      return { family: "sumTwo", params: { a: String(a), b: String(b) }, terms: t, n, style: "int", tier: 1,
        group: "recurrences",
        why: `Each term is the sum of the two before it: ${sumOf(prev, last)} = ${h(ans)}.`,
        wrong: [add(last, last), add(last, t[n - 3]), carryOn(t), add(ans, prev), ...plusMinus(ans, [1, 2])] };
    };

    F.sumThree = () => {
      const n = 7;
      const a = int(0, 5), b = int(0, 5), c = int(1, 6);
      if (a === b && b === c) return null;
      const t = run(n + 1, [I(a), I(b), I(c)], (x, i) => add(add(x[i - 1], x[i - 2]), x[i - 3]));
      const { ans, last, prev } = tail(t);
      return { family: "sumThree", params: { a: String(a), b: String(b), c: String(c) }, terms: t, n,
        style: "int", tier: 2, group: "recurrences",
        why: `Adding pairs does not work, but adding threes does. Each term is the sum of the three before it: ` +
          `${h(t[n - 3])} + ${h(prev)} + ${h(last)} = ${h(ans)}.`,
        wrong: [add(last, prev), add(last, last), carryOn(t), add(ans, t[n - 4]), ...plusMinus(ans, [1, 2])] };
    };

    F.productTwo = () => {
      const n = 6;
      const [a, b] = pick([[1, 2], [2, 2], [1, 3], [2, 3], [1, -2], [-1, 2], [2, -1], [1, 4], [3, 2], [-1, 3]]);
      const t = run(n + 1, [I(a), I(b)], (x, i) => mul(x[i - 1], x[i - 2]));
      if (t.some(x => Math.abs(x.n) > 1e7)) return null;
      const { ans, last, prev } = tail(t);
      return { family: "productTwo", params: { a: String(a), b: String(b) }, terms: t, n, style: "int", tier: 2,
        group: "recurrences",
        why: `The jumps are too uneven for a fixed multiplier. Each term is the product of the two before it: ` +
          `${paren(prev)} &times; ${paren(last)} = ${h(ans)}.`,
        wrong: [mul(last, I(2)), mul(last, last), neg(ans), mul(ans, I(2)), div(ans, I(2)), add(last, prev),
          mul(last, I(4))] };
    };

    F.sumAll = () => {
      const n = 6;
      const a = int(1, 4), b = int(1, 6);
      const t = run(n + 1, [I(a), I(b)], x => x.reduce(add, I(0)));
      const { ans, last, prev } = tail(t);
      return { family: "sumAll", params: { a: String(a), b: String(b) }, terms: t, n, style: "int", tier: 2,
        group: "recurrences",
        why: `Each term is the sum of every term before it: ${t.slice(0, n).map(x => h(x)).join(" + ")} = ${h(ans)}. ` +
          `From the fourth term on, that is the same as doubling.`,
        wrong: [add(last, prev), carryOn(t), mul(last, I(3)), add(ans, I(a)), sub(ans, I(a)), add(ans, I(b)),
          sub(ans, I(b)), ...plusMinus(ans, [1, 2])] };
    };

    F.secondOrder = () => {
      const n = 6;
      const [p, q] = pick([[1, 2], [2, 1], [3, 1], [1, 3], [2, 3], [3, -1]]);
      const a = int(1, 4), b = int(1, 4);
      const t = run(n + 1, [I(a), I(b)], (x, i) => I(p * x[i - 1].n + q * x[i - 2].n));
      for (let i = 2; i < t.length; i++) if (t[i].n <= t[i - 1].n) return null;
      if (t[n].n > 1e6) return null;
      const { ans, last, prev } = tail(t);
      const one = p === 1 ? "the one before" : `${p} times the one before`;
      const two = Math.abs(q) === 1 ? "the one before that" : `${Math.abs(q)} times the one before that`;
      return { family: "secondOrder", params: { a: String(a), b: String(b), p: String(p), q: String(q) },
        terms: t, n, style: "int", tier: 3, group: "recurrences",
        why: `Each term is built from the two before it: ${one} ${q > 0 ? "plus" : "minus"} ${two}. ` +
          `${p === 1 ? "" : p + " &times; "}${h(last)} ${q > 0 ? "+" : MINUS} ` +
          `${Math.abs(q) === 1 ? "" : Math.abs(q) + " &times; "}${h(prev)} = ${h(ans)}.`,
        wrong: [add(last, prev), I(p * last.n), I(q * last.n + p * prev.n), mul(last, I(2)), carryOn(t),
          ...plusMinus(ans, [1, 2])] };
    };

    F.squareRecurrence = () => {
      const [a, c, n] = pick([[2, -1, 4], [3, -2, 4], [1, 1, 4], [0, 1, 5], [1, 2, 4], [2, 1, 4], [1, 3, 4], [2, 2, 4]]);
      const t = run(n + 1, [I(a)], x => I(x[x.length - 1].n * x[x.length - 1].n + c));
      const { ans, last, prev } = tail(t);
      const sq = last.n * last.n;
      return { family: "squareRecurrence", params: { a: String(a), c: String(c) }, terms: t, n, style: "int",
        tier: 3, group: "recurrences",
        why: `The jumps are far too big for adding or for a fixed multiplier. Square each term and ` +
          `${c > 0 ? "add" : "subtract"} ${Math.abs(c)}: ${h(last)}<sup>2</sup> ${c > 0 ? "+" : MINUS} ${Math.abs(c)} = ` +
          `${h(sq)} ${c > 0 ? "+" : MINUS} ${Math.abs(c)} = ${h(ans)}.`,
        wrong: [I(sq), I(sq - c), mul(last, prev), I(sq + 2 * c), I(last.n * (last.n + 1)), I(2 * last.n),
          ...plusMinus(ans, [2, 10])] };
    };

    /* -- two rules at once -- */

    F.interleaved = () => {
      const n = pick([7, 8]);
      const x = { kind: "add", a: int(1, 40), step: nonzero(-9, 9) };
      const y = chance(0.3)
        ? { kind: "mul", a: int(1, 5), step: pick([2, 3]) }
        : { kind: "add", a: int(1, 60), step: nonzero(-9, 9) };
      if (y.kind === "add" && y.step === x.step) return null;
      const at = (trk, j) => trk.kind === "add" ? I(trk.a + j * trk.step) : I(trk.a * Math.pow(trk.step, j));
      const t = [];
      for (let i = 0; i <= n; i++) t.push(at(i % 2 === 0 ? x : y, Math.floor(i / 2)));
      const xs = t.slice(0, n).filter((v, i) => i % 2 === 0), ys = t.slice(0, n).filter((v, i) => i % 2 === 1);
      const { ans, last } = tail(t);
      const mine = n % 2 === 0 ? x : y, other = n % 2 === 0 ? y : x;
      const says = trk => trk.kind === "mul" ? `multiplied by ${trk.step} each time`
        : `${trk.step > 0 ? "up" : "down"} ${Math.abs(trk.step)} each time`;
      const otherNext = at(other, Math.floor((n + 1) / 2));
      return { family: "interleaved",
        params: { x: { kind: x.kind, a: String(x.a), step: String(x.step) },
                  y: { kind: y.kind, a: String(y.a), step: String(y.step) } },
        terms: t, n, style: "int", tier: 2, group: "two rules at once",
        why: `Two series are shuffled together. The 1st, 3rd, 5th&hellip; terms are ${list(xs)} (${says(x)}); ` +
          `the 2nd, 4th, 6th&hellip; are ${list(ys)} (${says(y)}). The next term belongs to the ` +
          `${n % 2 === 0 ? "first" : "second"} series: ${h(ans)}.`,
        wrong: [otherNext, carryOn(t), add(last, I(mine.kind === "add" ? mine.step : 1)),
          add(ans, I(other.kind === "add" ? other.step : 2)), ...plusMinus(ans, [1, 2, 3])] };
    };

    const stepSays = ([m, c]) => m === 1 ? (c > 0 ? `add ${c}` : `subtract ${-c}`)
      : c === 0 ? (m === 2 ? "double" : `multiply by ${m}`)
      : `${m === 2 ? "double" : "multiply by " + m} and ${c > 0 ? "add " + c : "subtract " + (-c)}`;
    const stepCalc = ([m, c], v) => (m === 1 ? h(v) : `${m} &times; ${h(v)}`) +
      (c === 0 ? "" : ` ${c > 0 ? "+" : MINUS} ${Math.abs(c)}`);

    F.alternating = () => {
      const n = pick([6, 7]);
      const c = int(1, 7), s = int(1, 3);
      const ops = pick([[[2, 0], [1, -c]], [[1, c], [2, 0]], [[3, 0], [1, -c]], [[2, s], [2, -s]],
        [[2, 0], [1, c]], [[1, -c], [3, 0]]]);
      const a = int(2, 9);
      const t = run(n + 1, [I(a)], (x, i) => I(ops[(i - 1) % 2][0] * x[i - 1].n + ops[(i - 1) % 2][1]));
      if (t.some(v => v.n <= 0 || v.n > 100000) || new Set(t.map(v => v.n)).size !== t.length) return null;
      const { ans, last } = tail(t);
      const now = ops[(n - 1) % 2], before = ops[n % 2];
      return { family: "alternating", params: { a: String(a), ops: ops }, terms: t, n, style: "int", tier: 2,
        group: "two rules at once",
        why: `Two steps take turns: ${stepSays(ops[0])}, then ${stepSays(ops[1])}. The last step was ` +
          `&ldquo;${stepSays(before)}&rdquo;, so now ${stepSays(now)}: ${stepCalc(now, last)} = ${h(ans)}.`,
        wrong: [I(before[0] * last.n + before[1]), carryOn(t), I(now[0] * last.n - now[1]),
          ...plusMinus(ans, [1, 2, c])] };
    };

    F.addMulGrowing = () => {
      const n = 6;
      const addFirst = chance(0.5);
      const k0 = addFirst ? 1 : 2, a = int(1, 5);
      const adds = j => (j % 2 === 0) === addFirst;
      const t = run(n + 1, [I(a)], (x, i) => adds(i - 1) ? I(x[i - 1].n + k0 + i - 1) : I(x[i - 1].n * (k0 + i - 1)));
      const { ans, last } = tail(t);
      const k = k0 + n - 1;
      const steps = []; for (let j = 0; j < n - 1; j++) steps.push((adds(j) ? "+" : "&times;") + (k0 + j));
      const isAdd = adds(n - 1);
      return { family: "addMulGrowing", params: { a: String(a), first: addFirst ? "add" : "mul", k0: k0 }, terms: t,
        n, style: "int", tier: 3, group: "two rules at once",
        why: `Adding and multiplying take turns, and the number used grows by one each step: ${steps.join(", ")}. ` +
          `Next is ${isAdd ? "+" : "&times;"}${k}: ${h(last)} ${isAdd ? "+" : "&times;"} ${k} = ${h(ans)}.`,
        wrong: [isAdd ? I(last.n * k) : I(last.n + k), isAdd ? I(last.n + k + 1) : I(last.n * (k + 1)),
          isAdd ? I(last.n + k - 1) : I(last.n * (k - 1)), carryOn(t), ...plusMinus(ans, [1, 2])] };
    };

    F.fractionTracks = () => {
      const n = pick([4, 5]);
      const a1 = int(1, 5), d1 = int(1, 4);
      const geo = chance(0.5);
      const a2 = geo ? pick([2, 3, 4]) : int(2, 9), s2 = geo ? pick([2, 3]) : int(1, 6);
      if (!geo && a1 === a2 && d1 === s2) return null;
      const num = i => a1 + i * d1;
      const den = i => geo ? a2 * Math.pow(s2, i) : a2 + i * s2;
      const t = [];
      for (let i = 0; i <= n; i++) {
        if (gcd(num(i), den(i)) !== 1 || den(i) === 1) return null;     // every term already in lowest terms
        t.push(R(num(i), den(i)));
      }
      const nums = [], dens = [];
      for (let i = 0; i < n; i++) { nums.push(num(i)); dens.push(den(i)); }
      const { ans } = tail(t);
      return { family: "fractionTracks",
        params: { num: { a: String(a1), d: String(d1) }, den: { kind: geo ? "mul" : "add", a: String(a2), step: String(s2) } },
        terms: t, n, style: "frac", tier: 2, group: "two rules at once",
        why: `Treat the tops and the bottoms as two separate series. Tops: ${nums.join(", ")} (up ${d1} each time). ` +
          `Bottoms: ${dens.join(", ")} (${geo ? "multiplied by " + s2 : "up " + s2} each time). ` +
          `Next: ${h(ans, "frac")}.`,
        // Wrong options keep the look of the right one: a fraction that would
        // cancel down (12/38 shown as 6/19) stands out as not belonging.
        wrong: [[num(n), den(n - 1)], [num(n - 1), den(n)], [num(n) + d1, den(n)], [num(n + 1), den(n + 1)],
          [num(n), geo ? den(n - 1) + (den(n - 1) - den(n - 2)) : den(n) + s2], [num(n) + 1, den(n)],
          [num(n) - 1, den(n)], [num(n), den(n) + 1], [num(n), den(n) - 1], [num(n) + 2, den(n)],
          [num(n) - 2, den(n)], [num(n), den(n) + 2], [num(n), den(n) - 2]]
          .filter(([a, b]) => a > 0 && b > 1 && gcd(a, b) === 1).map(([a, b]) => R(a, b)) };
    };

    F.conditional = () => {
      const [m, c] = pick([[3, 1], [3, -1], [5, 1]]);
      const n = pick([6, 7]);
      const a = 2 * int(1, 14) + 1;
      const t = run(n + 1, [I(a)], x => { const v = x[x.length - 1].n; return I(v % 2 === 0 ? v / 2 : m * v + c); });
      if (t.some(v => v.n <= 1) || new Set(t.map(v => v.n)).size !== t.length) return null;
      let odd = 0, even = 0;
      for (let i = 0; i < n - 1; i++) (t[i].n % 2 === 0 ? even++ : odd++);
      if (odd < 2 || even < 2) return null;                    // both rules must be on show twice
      // If odd and even terms simply took turns, "times ${m}, then halve,
      // alternately" would fit just as well and can predict a different next
      // term. Two halvings in a row, both on show, rule that reading out.
      let twoHalvings = false;
      for (let i = 0; i + 2 < n; i++) if (t[i].n % 2 === 0 && t[i + 1].n % 2 === 0) twoHalvings = true;
      if (!twoHalvings) return null;
      const { ans, last } = tail(t);
      const isEven = last.n % 2 === 0;
      return { family: "conditional", params: { a: String(a), m: String(m), c: String(c) }, terms: t, n,
        style: "int", tier: 3, group: "two rules at once",
        why: `There are two rules, and the term itself decides which applies. An odd term is multiplied by ${m}, ` +
          `then ${c > 0 ? "1 is added" : "1 is taken off"}; an even term is halved. ${h(last)} is ` +
          `${isEven ? "even" : "odd"}, so ${isEven ? h(last) + " &divide; 2" : m + " &times; " + h(last) + (c > 0 ? " + 1" : " " + MINUS + " 1")} = ${h(ans)}.`,
        wrong: isEven
          ? [I(m * last.n + c), I(last.n / 2 + 1), I(last.n / 2 - 1), I(2 * last.n), carryOn(t), ...plusMinus(ans, [2, 3])]
          : [I((last.n + 1) / 2), I((last.n - 1) / 2), I(m * last.n), I(m * last.n - c), I(2 * last.n),
             ...plusMinus(ans, [2, 3])] };
    };

    /* -- powers and primes -- */

    F.power = () => {
      const n = 5;
      const form = pick(["cubes", "cubes", "signedSquares", "signedCubes"]);
      const k = form === "signedSquares" ? 2 : 3;
      const alt = form !== "cubes";
      const s = form === "signedCubes" ? 0 : int(0, form === "cubes" ? 1 : 2);
      const c = alt ? 0 : int(-4, 6);
      const sign = alt && chance(0.5) ? -1 : 1;
      const base = i => Math.pow(i + s, k);
      const sg = i => alt ? sign * (i % 2 === 1 ? 1 : -1) : 1;
      const t = [];
      for (let i = 1; i <= n + 1; i++) t.push(I(sg(i) * base(i) + c));
      const { ans } = tail(t);
      const bases = []; for (let i = 1; i <= n; i++) bases.push(base(i));
      const name = k === 2 ? "squares" : "cubes";
      const why = alt
        ? `Ignore the signs: ${bases.join(", ")} are the ${name} of ${1 + s}, ${2 + s}, ${3 + s}&hellip; ` +
          `The signs alternate, so the next term is ${ans.n > 0 ? "positive" : "negative"}: ` +
          `${n + 1 + s}<sup>${k}</sup> gives ${h(ans)}.`
        : `These are the cubes ${bases.join(", ")}${c === 0 ? "" : c > 0 ? ", each plus " + c : ", each minus " + (-c)}. ` +
          `Next: ${n + 1 + s}<sup>3</sup>${c === 0 ? "" : (c > 0 ? " + " : " " + MINUS + " ") + Math.abs(c)} = ${h(ans)}.`;
      return { family: "power", params: { k: k, s: s, c: String(c), alt: alt ? 1 : 0, sign: sign }, terms: t, n,
        style: "int", tier: 1, group: "powers and primes", why,
        wrong: alt
          ? [neg(ans), I(sg(n + 1) * base(n + 2)), I(sg(n + 1) * (base(n + 1) + 1)), I(sg(n + 1) * (base(n + 1) - 1)),
             I(-sg(n + 1) * base(n + 2)), I(sg(n + 1) * Math.pow(n + 1 + s, k === 2 ? 3 : 2))]
          : [carryOn(t), I(base(n + 1) - c), I(base(n + 1)), I(base(n + 2) + c), I(Math.pow(n + 1 + s, 2) * (n + s) + c),
             ...plusMinus(ans, [1, n + 1 + s])] };
    };

    F.primeForm = () => {
      const form = pick(["square", "timesIndex", "double"]);
      const j = form === "timesIndex" ? 0 : int(0, 1);
      const n = form === "double" ? 6 : 5;
      const f = (i, p) => form === "square" ? p * p : form === "timesIndex" ? (i + 1) * p : 2 * p;
      const t = [];
      for (let i = 0; i <= n; i++) t.push(I(f(i, PRIMES[j + i])));
      const { ans } = tail(t);
      const p = PRIMES[j + n], before = PRIMES[j + n - 1], after = PRIMES[j + n + 1];
      const ps = PRIMES.slice(j, j + n);
      const odd = before + 2 === p ? p + 2 : before + 2;         // the "next odd number" slip
      const why = form === "square"
        ? `They are all squares &mdash; of ${ps.join(", ")}, the primes. The next prime is ${p}, and ${p}<sup>2</sup> = ${h(ans)}.`
        : form === "timesIndex"
          ? `Factorise each term: ${ps.map((q, i) => (i + 1) + " &times; " + q).join(", ")}. ` +
            `The <i>n</i>th term is <i>n</i> times the <i>n</i>th prime, so next is ${n + 1} &times; ${p} = ${h(ans)}.`
          : `Halve every term: ${ps.join(", ")} are the primes. The next prime is ${p}, and 2 &times; ${p} = ${h(ans)}.`;
      return { family: "primeForm", params: { form: form, j: j }, terms: t, n, style: "int", tier: 2,
        group: "powers and primes", why,
        wrong: [I(f(n, odd)), I(f(n, after)), I(f(n + 1, p)), I(f(n, p + 1)), I(f(n, p - 1)), I(f(n - 1, p)),
          carryOn(t), ...plusMinus(ans, [2, 4])] };
    };

    F.expForm = () => {
      const n = 5;
      if (chance(0.35)) {
        const e = int(0, 1);                                   // n * 2^(n-e)
        const t = [];
        for (let i = 1; i <= n + 1; i++) t.push(I(i * Math.pow(2, i - e)));
        const { ans, last } = tail(t);
        const pw = []; for (let i = 1; i <= n; i++) pw.push(Math.pow(2, i - e));
        return { family: "expForm", params: { form: "times", b: 2, s: 0, e: e }, terms: t, n, style: "int", tier: 3,
          group: "powers and primes",
          why: `Divide each term by its position (1st, 2nd, 3rd&hellip;): ${pw.join(", ")}, the powers of 2. ` +
            `So the next term is ${n + 1} &times; ${Math.pow(2, n + 1 - e)} = ${h(ans)}.`,
          wrong: [I((n + 1) * Math.pow(2, n - e)), I(n * Math.pow(2, n + 1 - e)), mul(last, I(2)), carryOn(t),
            I((n + 2) * Math.pow(2, n + 1 - e)), mul(last, I(3))] };
      }
      const b = pick([2, 2, 3]), s = pick([-2, -1, 1, 2]);
      const t = [];
      for (let i = 1; i <= n + 1; i++) t.push(I(Math.pow(b, i) + s * i));
      if (new Set(t.map(v => v.n)).size !== t.length) return null;
      const { ans, last } = tail(t);
      const pw = [], rest = [];
      for (let i = 1; i <= n; i++) { pw.push(Math.pow(b, i)); rest.push(I(s * i)); }
      const top = Math.pow(b, n + 1);
      return { family: "expForm", params: { form: "plus", b: b, s: s, e: 0 }, terms: t, n, style: "int", tier: 3,
        group: "powers and primes",
        why: `Take the powers of ${b} (${pw.join(", ")}) away from the terms and ${rest.map(signed).join(", ")} is left. ` +
          `So each term is a power of ${b} ${s > 0 ? "plus" : "minus"} ${Math.abs(s) === 1 ? "" : Math.abs(s) + " times "}its position. ` +
          `Next: ${top} ${s > 0 ? "+" : MINUS} ${Math.abs(s * (n + 1))} = ${h(ans)}.`,
        wrong: [I(top), I(top - s * (n + 1)), I(top + s * n), mul(last, I(b)), carryOn(t), I(top + s * (n + 2)),
          ...plusMinus(ans, [1, 2])] };
    };

    /* -- digits -- */

    const digitSum = v => String(Math.abs(v)).split("").reduce((a, ch) => a + Number(ch), 0);
    const reversed = v => Number(String(v).split("").reverse().join(""));

    F.rotation = () => {
      const len = pick([4, 5]);
      const pool = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      let s = "";
      while (s.length < len) s += pool.splice(int(0, pool.length - 1), 1)[0];
      const left = chance(0.6);
      const n = len === 4 ? 3 : pick([3, 4]);
      const turn = v => left ? v.slice(1) + v[0] : v[v.length - 1] + v.slice(0, -1);
      const strs = [s];
      while (strs.length < n + 1) strs.push(turn(strs[strs.length - 1]));
      const t = strs.map(v => I(Number(v)));
      const a = strs[n], lastS = strs[n - 1];
      const swap = (v, i) => v.slice(0, i) + v[i + 1] + v[i] + v.slice(i + 2);
      return { family: "rotation", params: { digits: s, by: left ? "left" : "right" }, terms: t, n, style: "raw",
        tier: 1, group: "digits",
        why: `The same ${len} digits every time. ${left ? "The first digit moves to the end" : "The last digit moves to the front"} ` +
          `at each step: ${lastS} becomes ${a}.`,
        wrong: [turn(a), swap(a, 0), swap(a, len - 2), swap(a, 1), lastS.split("").reverse().join(""),
          swap(turn(a), 0)].map(v => I(Number(v))) };
    };

    F.baseCount = () => {
      const n = 5;
      const base = pick([2, 2, 3, 4]);
      const start = int(1, base === 2 ? 9 : 12);
      const t = [];
      for (let i = 0; i <= n; i++) t.push(I(Number((start + i).toString(base))));
      const { ans, last } = tail(t);
      const a = String(ans.n);
      const swapEnd = a.length > 1 ? a.slice(0, -2) + a[a.length - 1] + a[a.length - 2] : a;
      return { family: "baseCount", params: { base: base, start: start }, terms: t, n, style: "raw", tier: 2,
        group: "digits",
        why: `Only the digits 0 to ${base - 1} appear. These are ${start}, ${start + 1}, ${start + 2}&hellip; written in ` +
          `base ${base}${base === 2 ? " (binary)" : ""}. Next is ${start + n}, which is written ${a}.`,
        wrong: [I(last.n + 1), I(Number((start + n + 1).toString(base))), I(Number(swapEnd)), I(last.n + 10),
          I(Number((start + n).toString(base + 1))), I(ans.n + 1), I(ans.n + 10), I(ans.n - 1)] };
    };

    F.digitSum = () => {
      const n = pick([5, 6]);
      const a = int(11, 89);
      const t = run(n + 1, [I(a)], x => I(x[x.length - 1].n + digitSum(x[x.length - 1].n)));
      // A gap that keeps coming back (+6, +3, +6, +12, +6) invites "add 6 every
      // other step" and a guess at the rest. Only use series whose gaps do not.
      const gapCount = {};
      for (const g of differences(t.slice(0, n))) gapCount[g.n] = (gapCount[g.n] || 0) + 1;
      if (Object.keys(gapCount).some(g => gapCount[g] >= 3)) return null;
      const { ans, last } = tail(t);
      const digits = String(last.n).split("");
      const product = digits.reduce((p, ch) => p * Number(ch), 1);
      return { family: "digitSum", params: { a: String(a) }, terms: t, n, style: "int", tier: 3, group: "digits",
        why: `The gaps follow no arithmetic rule, so look at the digits. Each term is the one before plus the sum of ` +
          `its own digits: ${h(last)} + ${digits.join(" + ")} = ${h(ans)}.`,
        wrong: [carryOn(t), I(last.n + product), I(last.n + digits.length), I(last.n + Number(digits[digits.length - 1])),
          ...plusMinus(ans, [1, 2, 9])] };
    };

    F.reverseAdd = () => {
      const n = pick([5, 6]);
      const k = int(1, 7);
      const tens = int(1, 8), units = int(tens + 1, 9);
      const t = [I(tens * 10 + units)];
      for (let j = 0; j < n; j++) {
        const v = t[j].n;
        if (j % 2 === 0) {
          const r = reversed(v);
          if (v % 10 === 0 || r === v || v > 999) return null;   // nothing to see in the reversal
          t.push(I(r));
        } else {
          t.push(I(v + k));
        }
      }
      const { ans, last } = tail(t);
      const reversing = (n - 1) % 2 === 0;
      return { family: "reverseAdd", params: { a: String(t[0].n), k: String(k) }, terms: t, n, style: "int", tier: 3,
        group: "digits",
        why: `Two steps take turns: reverse the digits, then add ${k}. The last step was ` +
          `${reversing ? "an addition" : "a reversal"}, so now ${reversing ? "reverse " + h(last) : "add " + k + " to " + h(last)}: ${h(ans)}.`,
        wrong: reversing
          ? [I(last.n + k), I(reversed(last.n) + k), carryOn(t), ...plusMinus(ans, [1, 9, 10])]
          : [I(reversed(last.n)), I(reversed(last.n) + k), carryOn(t), I(last.n + k + 9), ...plusMinus(ans, [1, 2])] };
    };

    const say = v => v.replace(/(\d)\1*/g, runOf => runOf.length + runOf[0]);

    F.lookSay = () => {
      const seed = pick(["1", "2", "3", "12", "21", "13", "31", "23", "32"]);
      const n = seed.length === 1 ? pick([4, 5]) : 4;
      const strs = [seed];
      while (strs.length < n + 1) strs.push(say(strs[strs.length - 1]));
      const a = strs[n], lastS = strs[n - 1];
      if (a.length > 12) return null;
      const t = strs.map(v => I(Number(v)));
      const spoken = lastS.match(/(\d)\1*/g)
        .map(r => `${WORDS[r.length]} ${r[0]}${r.length > 1 ? "s" : ""}`).join(", then ");
      // Near misses: two neighbouring digits swapped, or one count misread.
      const wrong = [];
      for (let i = 0; i + 1 < a.length; i++)
        if (a[i] !== a[i + 1]) wrong.push(a.slice(0, i) + a[i + 1] + a[i] + a.slice(i + 2));
      for (let i = 0; i < a.length; i += 2) {
        const bumped = Number(a[i]) === 1 ? 2 : Number(a[i]) - 1;
        wrong.push(a.slice(0, i) + bumped + a.slice(i + 1));
      }
      for (let i = wrong.length - 1; i > 0; i--) {
        const j = int(0, i); const tmp = wrong[i]; wrong[i] = wrong[j]; wrong[j] = tmp;
      }
      return { family: "lookSay", params: { seed: seed }, terms: t, n, style: "raw", tier: 3, group: "digits",
        why: `Each term describes the one before it, read aloud. ${lastS} is &ldquo;${spoken}&rdquo;, ` +
          `which is written ${a}.`,
        wrong: wrong.filter(v => v[0] !== "0").map(v => I(Number(v))) };
    };

    return F;
  }

  /* ---- One question --------------------------------------------------------- */

  const OPTION_COUNT = 4;
  const SECONDS = { 1: 45, 2: 60, 3: 90 };

  function build(spec, shuffle, rand) {
    const style = spec.style;
    const shown = spec.terms.slice(0, spec.n);
    const ans = spec.terms[spec.n];

    if (spec.terms.length !== spec.n + 1) return null;
    if (spec.terms.some(x => !fits(x, style) || Math.abs(x.n) > 1e13)) return null;
    if (shown.some(x => eq(x, ans))) return null;               // the answer must be news
    if (rivals(shown).some(v => !eq(v, ans))) return null;      // a simpler rule disagrees

    // Three wrong options. As in the arithmetic generator, how many sit below
    // the right answer is decided first, so its rank gives nothing away.
    const positive = spec.terms.every(x => x.n > 0);
    const below = Math.floor(rand() * OPTION_COUNT);
    const want = { lo: below, hi: OPTION_COUNT - 1 - below };
    const got = { lo: 0, hi: 0 };
    const wrong = [];
    const taken = [ans].concat(shown);
    const offer = (x, anySide) => {
      if (wrong.length === OPTION_COUNT - 1) return;
      if (!x || x.d === 0 || !Number.isFinite(x.n) || !fits(x, style) || Math.abs(x.n) > 1e13) return;
      if (positive && x.n <= 0) return;                        // would give itself away
      if (taken.some(t => eq(t, x))) return;
      const side = lt(x, ans) ? "lo" : "hi";
      if (!anySide && got[side] >= want[side]) return;
      got[side]++;
      taken.push(x);
      wrong.push(x);
    };
    const tempting = spec.wrong.slice(0, 4), rest = spec.wrong.slice(4);
    for (const x of shuffle(tempting)) offer(x);
    for (const x of shuffle(rest)) offer(x);
    const unit = style === "frac" ? R(1, ans.d)
      : style === "dec" ? R(1, Math.pow(10, Math.max(1, places(ans)))) : I(1);
    // Stepping away from the answer is the fallback. Among fractions, skip a
    // step that cancels down, for the reason given in fractionTracks.
    const stepped = k => [add(ans, mul(unit, I(k))), sub(ans, mul(unit, I(k)))]
      .filter(x => style !== "frac" || x.d === ans.d);
    for (let k = 1; wrong.length < OPTION_COUNT - 1 && k < 30; k++) for (const x of stepped(k)) offer(x);
    for (const x of shuffle(spec.wrong)) offer(x, true);
    for (let k = 1; wrong.length < OPTION_COUNT - 1 && k < 30; k++) for (const x of stepped(k)) offer(x, true);
    if (wrong.length < OPTION_COUNT - 1) return null;

    const values = [ans].concat(wrong).sort((x, y) => x.n * y.d - y.n * x.d);
    const optionText = values.map(v => text(v, style));
    if (new Set(optionText).size !== OPTION_COUNT) return null;

    const series = shown.map(x => '<span class="term">' + html(x, style) + "</span>").join(", ");
    const body = '<div class="seq">' + series + ', <span class="next">?</span></div>';

    return {
      category: "sequences",
      breakdown: spec.group,
      difficulty: spec.tier,
      time: SECONDS[spec.tier],
      generated: true,
      question: "What comes next?" + body,
      options: values.map(v => html(v, style)),
      answer: values.findIndex(v => eq(v, ans)),
      solution: spec.why,
      check: {
        kind: "sequence",
        rule: { family: spec.family, params: spec.params },
        terms: shown.map(x => text(x, style)),
        value: text(ans, style),
        options: optionText,
      },
    };
  }

  /* ---- A whole paper ------------------------------------------------------------
     Easier families first, harder ones last, each family used at most twice and
     no series twice. `only` restricts the paper to the named families.          */

  const TIERS = {
    1: ["arithmetic", "geometric", "quadratic", "sumTwo", "affine", "power", "rotation"],
    2: ["interleaved", "alternating", "growingMul", "primeGaps", "squareGaps", "productTwo", "sumThree",
        "fractionTracks", "sumAll", "baseCount", "primeForm"],
    3: ["doublePlusIndex", "squareRecurrence", "addMulGrowing", "digitSum", "reverseAdd", "conditional",
        "expForm", "lookSay", "secondOrder"],
  };
  const SHARE = { 1: 8 / 26, 2: 10 / 26, 3: 8 / 26 };
  const PER_FAMILY = 2;

  function make(count, rand, only) {
    rand = rand || Math.random;
    const F = families(rand);
    const shuffle = arr => {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        const t = a[i]; a[i] = a[j]; a[j] = t;
      }
      return a;
    };

    // How many questions each tier gets, and which families fill them.
    const easy = Math.round(count * SHARE[1]), hard = Math.round(count * SHARE[3]);
    const quota = { 1: easy, 2: count - easy - hard, 3: hard };
    const plan = [];
    for (const tier of [1, 2, 3]) {
      const names = TIERS[tier].filter(f => !only || only.indexOf(f) !== -1);
      if (!names.length) continue;
      let order = [];
      for (let round = 0; round < PER_FAMILY || (only && order.length < quota[tier]); round++)
        order = order.concat(shuffle(names));
      plan.push(...order.slice(0, quota[tier]));
    }
    // A short plan (few families allowed, or an odd count) is topped up from anywhere.
    const all = Object.keys(F).filter(f => !only || only.indexOf(f) !== -1);
    for (let i = 0; plan.length < count && i < count * 3; i++) plan.push(all[Math.floor(rand() * all.length)]);

    const stamp = Date.now().toString(36);
    const seen = new Set();
    const paper = [];
    for (const name of plan.slice(0, count)) {
      let q = null;
      for (let attempt = 0; attempt < 400 && !q; attempt++) {
        const spec = F[name]();
        const made = spec && build(spec, shuffle, rand);
        if (made && !seen.has(made.check.terms.join(","))) q = made;
      }
      if (!q) continue;
      seen.add(q.check.terms.join(","));
      q.id = "gen-seq-" + stamp + "-" + (paper.length + 1);
      paper.push(q);
    }
    // A family that could not produce a usable series leaves a gap: fill it
    // from any family, so a paper is always the length asked for.
    for (let guard = 0; paper.length < count && guard < count * 400; guard++) {
      const spec = F[all[Math.floor(rand() * all.length)]]();
      const made = spec && build(spec, shuffle, rand);
      if (!made || seen.has(made.check.terms.join(","))) continue;
      seen.add(made.check.terms.join(","));
      made.id = "gen-seq-" + stamp + "-" + (paper.length + 1);
      paper.push(made);
    }
    return paper;
  }

  return {
    id: "number-series",
    name: "Number series — 27 rule families",
    families: [].concat(TIERS[1], TIERS[2], TIERS[3]),
    make,
  };
})());
