/* ============================================================================
   GENERATOR — MENTAL ARITHMETIC SPRINT
   ----------------------------------------------------------------------------
   Makes the questions for the Flow Traders maths test: one line of arithmetic,
   four answer choices, a few seconds each.

   The kinds of question, their wording and their difficulty are modelled on a
   sitting of the practice test published by the assessment's host (Trading
   Interview), from which 55 questions were copied out in November 2026. In
   the proportions seen there:

     whole numbers + −      58 + 5 = ?         863 − 339 = ?
     two-digit ×            47 × 43 = ?
     missing whole number   49 × ? = 343       ? − 587 = 73      52 ÷ ? = 65
     missing decimal        4.9 ÷ ? = 0.7      ? × 0.12 = 18     0.08 − ? = 0.014
     decimals               5.6 × 0.8 = ?      0.55 − 0.026 = ?  0.35 ÷ 0.25 = ?
     decimal × decimal      10.7 * 13.2 = ?    (one to estimate, not to work out)
     three-way ×            0.6 * 70 * 5,000 = ?
     percentages            36 is …% of 80
     fractions              12/32 + 15/16 = ?  40 − 24/7 = ?     15 ÷ 5/6 = ?
     missing fraction       7/9 − ? = 5/18     2/4 × ? = 6       7/9 ÷ ? = 1/11

   Most are a times-table fact or a short sum with the decimal point moved or
   one number hidden. Fractions are often left uncancelled, as they were there.
   The two kinds written with * are the slow ones: their wrong options are
   spaced so that a rough estimate is enough.

   What was NOT seen, and is guessed here: the answer options. Four are given;
   the wrong ones are built from the slips people make (a decimal point one
   place out, a digit changed, the wrong operation).

   A paper is generated fresh every sitting. Nothing in here touches the DOM,
   so node can run it too (validate.js re-marks a few thousand generated
   questions on every run). Every value is an exact rational { n, d } on
   integers — no floating point is ever used to decide an answer, only to pick
   random operands.
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

  const add = (x, y) => R(x.n * y.d + y.n * x.d, x.d * y.d);
  const sub = (x, y) => R(x.n * y.d - y.n * x.d, x.d * y.d);
  const mul = (x, y) => R(x.n * y.n, x.d * y.d);
  const div = (x, y) => R(x.n * y.d, x.d * y.n);
  const eq = (x, y) => x.n === y.n && x.d === y.d;
  const less = (x, y) => x.n * y.d < y.n * x.d;
  const isInt = x => x.d === 1;
  const I = n => R(n, 1);
  const OPS = { "+": add, "-": sub, "*": mul, "/": div };

  /* How many decimal places x needs, or -1 if it does not terminate (within 6). */
  function places(x) {
    let pow = 1;
    for (let k = 0; k <= 6; k++) {
      if (pow % x.d === 0) return k;
      pow *= 10;
    }
    return -1;
  }

  /* ---- Writing numbers --------------------------------------------------------
     Each value is written twice: as HTML for the page, and as plain text for
     the independent re-marking in validate-core.js. The plain text has no
     thousands commas and writes a fraction as (n/d).                          */

  function decText(x) {
    const k = places(x);
    const units = Math.abs(x.n) * (Math.pow(10, k) / x.d);     // exact integer
    let digits = String(units);
    if (k > 0) {
      while (digits.length <= k) digits = "0" + digits;
      digits = digits.slice(0, digits.length - k) + "." + digits.slice(digits.length - k);
    }
    return (x.n < 0 ? "-" : "") + digits;
  }

  /* 210000 -> 210,000. Only the whole part is grouped. */
  function commas(text) {
    const m = /^(-?)(\d+)(\.\d+)?$/.exec(text);
    if (!m || m[2].length < 4) return text;
    return m[1] + m[2].replace(/\B(?=(\d{3})+$)/g, ",") + (m[3] || "");
  }

  const fracHtml = (n, d) => '<span class="frac"><span>' + n + '</span><span>' + d + '</span></span>';

  /* An operand as it is shown. num: a whole number or decimal. frac: a fraction
     with exactly the top and bottom given, cancelled or not. */
  const num = x => ({ v: x, html: commas(decText(x)), text: decText(x) });
  const frac = (n, d) => ({ v: R(n, d), html: fracHtml(n, d), text: "(" + n + "/" + d + ")" });
  const lowest = x => isInt(x) ? num(x) : frac(x.n, x.d);
  const UNKNOWN = { v: null, html: "?", text: "?" };

  /* An answer option in a given style: "int", "dec" or "frac". */
  function show(x, style) {
    if (style === "frac" && !isInt(x)) return { html: fracHtml(x.n, x.d), text: x.n + "/" + x.d };
    const t = decText(x);
    return { html: commas(t), text: t };
  }

  function fits(x, style) {
    if (style === "int") return isInt(x);
    if (style === "dec") { const k = places(x); return k !== -1 && k <= 5; }
    return x.d <= 400;
  }

  /* ---- Question kinds ---------------------------------------------------------
     Each returns a spec:
       group     "integers" | "decimals" | "fractions" | "percentages"
       kind      the name it goes by in the results breakdown
       parts     what is shown left of the equals sign: operands and "+-* /"
       rhs       what is shown right of it, when a number on the left is hidden
       ans       the answer        style   how the options are written
       wrong     candidate wrong answers, most tempting first
     or null when the numbers drawn did not make a good question.            */

  function kinds(rand) {

    const int = (lo, hi) => lo + Math.floor(rand() * (hi - lo + 1));
    const pick = arr => arr[Math.floor(rand() * arr.length)];
    const chance = p => rand() < p;
    const pow10 = k => Math.pow(10, k);

    /* A whole number of units with a non-zero last digit, so n / 10^p really
       has p decimal places. */
    function units(lo, hi) {
      let u;
      do { u = int(lo, hi); } while (u % 10 === 0);
      return u;
    }

    const around = (x, steps) => {
      const out = [];
      for (const s of steps) { out.push(add(x, s)); out.push(sub(x, s)); }
      return out;
    };
    const ulp = x => R(1, pow10(Math.max(0, places(x))));

    /* A decimal answer with the point moved or one digit changed. */
    function decSlips(ans) {
      const u = ulp(ans), ten = I(10);
      return [mul(ans, ten), div(ans, ten), ...around(ans, [mul(u, ten), u]),
        mul(ans, I(100)), div(ans, I(100)), ...around(ans, [add(u, u), mul(u, I(100))])];
    }

    /* A fraction answer with its top or bottom out by one. */
    function fracNear(ans) {
      const out = [R(ans.n + 1, ans.d), R(ans.n, ans.d + 1)];
      if (ans.n > 1) out.push(R(ans.n - 1, ans.d));
      if (ans.d > 2) out.push(R(ans.n, ans.d - 1));
      return out;
    }

    /* The hidden number goes first or second. */
    const hide = (first, op, a, b) => first ? [UNKNOWN, op, b] : [a, op, UNKNOWN];

    /* -- whole numbers: 58 + 5, 863 − 339 -- */

    function wholeAddSub() {
      let a, b;
      if (chance(0.6)) { a = int(120, 989); b = chance(0.5) ? int(12, 99) : int(101, 899); }
      else { a = int(21, 99); b = chance(0.5) ? int(3, 9) : int(11, 79); }
      const op = pick(["+", "-"]);
      if (op === "-" && b >= a) { const t = a; a = b + 7; b = t; }
      const ans = I(op === "+" ? a + b : a - b);
      return { group: "integers", kind: "whole numbers + −", parts: [num(I(a)), op, num(I(b))],
        ans, style: "int", wrong: around(ans, [I(10), I(1), I(100), I(2), I(20), I(9)]) };
    }

    /* -- 47 × 43 -- */

    function twoDigitTimes() {
      const a = units(13, 49), b = units(13, 49);
      const ans = I(a * b);
      return { group: "integers", kind: "two-digit ×", parts: [num(I(a)), "*", num(I(b))],
        ans, style: "int", wrong: around(ans, [I(10), I(100), I(20), I(a), I(b), I(110)]) };
    }

    /* -- 49 × ? = 343, ? − 587 = 73, 52 ÷ ? = 65 -- */

    function missingWhole() {
      const type = pick(["add", "add", "sub", "sub", "mul", "mul", "mul", "div", "div", "divdec"]);
      const whole = n => num(I(n));
      const spec = (parts, rhs, ans, wrong, style) => ({ group: "integers", kind: "missing whole number",
        parts, rhs, ans, style: style || "int", wrong });

      if (type === "add") {
        const x = int(8, 89), other = int(12, 99);
        return spec(hide(chance(0.5), "+", whole(other), whole(other)), whole(x + other), I(x),
          around(I(x), [I(10), I(1), I(2), I(20), I(9)]));
      }
      if (type === "sub") {
        if (chance(0.5)) {                               // ? − b = c
          const b = int(12, 699), c = int(12, 199);
          return spec([UNKNOWN, "-", whole(b)], whole(c), I(b + c),
            around(I(b + c), [I(10), I(100), I(1), I(20), I(2)]).concat([I(Math.abs(b - c) || 1)]));
        }
        const a = int(40, 400), x = int(11, a - 11);     // a − ? = c
        return spec([whole(a), "-", UNKNOWN], whole(a - x), I(x),
          around(I(x), [I(10), I(1), I(2), I(20), I(100)]));
      }
      if (type === "mul") {
        const d = int(3, 9), m = int(12, 79);
        if (chance(0.7))                                 // 58 × ? = 406
          return spec(hide(chance(0.3), "*", whole(m), whole(m)), whole(m * d), I(d),
            around(I(d), [I(1), I(2), I(3)]).concat([I(d + 4), I(d + 5)]));
        return spec(hide(chance(0.5), "*", whole(d), whole(d)), whole(m * d), I(m),   // ? × 7 = 406
          around(I(m), [I(10), I(1), I(2), I(11), I(20)]));
      }
      if (type === "div") {
        if (chance(0.5)) {                               // 96 ÷ ? = 8
          const x = int(3, 12), c = int(4, 25);
          if (x === c) return null;
          return spec([whole(x * c), "/", UNKNOWN], whole(c), I(x),
            around(I(x), [I(1), I(2), I(3)]).concat([I(x + 4), I(x + 10)]));
        }
        const b = int(3, 9), c = int(6, 25);             // ? ÷ 7 = 13
        return spec([UNKNOWN, "/", whole(b)], whole(c), I(b * c),
          around(I(b * c), [I(b), I(10), I(c), I(1), I(2)]));
      }
      // 52 ÷ ? = 65: the answer is a simple decimal below one.
      const [p, q] = pick([[1, 2], [1, 4], [1, 5], [2, 5], [3, 5], [4, 5], [3, 4]]);
      const m = int(6, 25);
      const ans = R(p, q);
      const others = [[1, 2], [1, 4], [1, 5], [2, 5], [3, 5], [4, 5], [3, 4], [5, 4], [5, 2], [3, 2]]
        .map(([n, d]) => R(n, d));
      return spec([whole(p * m), "/", UNKNOWN], whole(q * m), ans, [div(I(1), ans)].concat(others), "dec");
    }

    /* -- 4.9 ÷ ? = 0.7, ? × 0.12 = 18, 0.08 − ? = 0.014 -- */

    function missingDecimal() {
      const type = pick(["mul", "mul", "mul", "div", "div", "add", "sub", "sub2"]);
      const spec = (parts, rhs, ans) => {
        if (places(ans) > 3 || places(rhs.v) > 3) return null;
        return { group: "decimals", kind: "missing decimal", parts, rhs, ans, style: "dec", wrong: decSlips(ans) };
      };

      if (type === "mul" || type === "div") {
        // A times-table fact x × y = z with the decimal points moved.
        const x = pick([2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 15]);
        const y = pick([2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 18]);
        const i = int(1, 3);                             // places taken off the shown factor
        const shift = pick([-1, 0, 0, 1]);               // the answer is x / 10, x or 10x
        const ans = R(x * pow10(shift + 1), 10);
        const shown = R(y, pow10(i));
        const product = mul(ans, shown);
        if (places(shown) > 3 || places(product) > 3) return null;
        if (type === "mul")
          return spec(hide(chance(0.5), "*", num(shown), num(shown)), num(product), ans);
        return spec([num(product), "/", UNKNOWN], num(shown), ans);     // 4.9 ÷ ? = 0.7
      }
      if (type === "add") {                              // ? + 0.19 = 8.7
        const x = R(units(11, 999), 100), b = R(units(11, 99), 100);
        return spec(hide(chance(0.5), "+", num(b), num(b)), num(add(x, b)), x);
      }
      if (type === "sub") {                              // ? − 0.15 = 0.56
        const b = R(units(11, 99), 100), c = R(units(11, 99), 100);
        return spec([UNKNOWN, "-", num(b)], num(c), add(b, c));
      }
      const a = R(int(2, 99), 100);                      // 0.08 − ? = 0.014
      const c = R(units(1, a.n * 1000 / a.d - 1), 1000);
      if (!less(c, a)) return null;
      return spec([num(a), "-", UNKNOWN], num(c), sub(a, c));
    }

    /* -- 5.6 × 0.8, 0.55 − 0.026, 0.35 ÷ 0.25 -- */

    function decimals() {
      const type = pick(["mul", "mul", "addsub", "addsub", "div"]);
      const spec = (a, op, b) => {
        const ans = OPS[op](a, b);
        if (ans.n <= 0 || places(ans) === -1 || places(ans) > 4) return null;
        return { group: "decimals", kind: "decimals", parts: [num(a), op, num(b)], ans, style: "dec",
          wrong: decSlips(ans) };
      };
      if (type === "mul") {
        const a = R(units(12, 99), 10), b = R(int(2, 9), pick([10, 10, 100]));
        return chance(0.5) ? spec(a, "*", b) : spec(b, "*", a);
      }
      if (type === "addsub") {
        // The two numbers have different numbers of places, which is the trap.
        return chance(0.7)
          ? spec(R(units(11, 99), 100), pick(["+", "-"]), R(units(11, 99), 1000))     // 0.55 − 0.026
          : spec(R(units(11, 99), 10), pick(["+", "-"]), R(units(11, 99), 100));      // 8.7 − 0.19
      }
      const b = pick([R(1, 5), R(1, 4), R(2, 5), R(1, 2), R(1, 20)]);     // 0.35 ÷ 0.25
      const q = R(units(11, 99), 10);
      const a = mul(q, b);
      if (places(a) > 3) return null;
      return spec(a, "/", b);
    }

    /* -- 10.7 * 13.2: meant to be estimated -- */

    function decimalTimesDecimal() {
      const a = R(units(101, 359), 10), b = R(units(101, 299), 10);
      const ans = mul(a, b);
      // Wrong options sit about a tenth of the answer apart, so rounding both
      // numbers and multiplying is enough to choose between them.
      const tenth = ans.n / ans.d / 10;
      const gap = [10, 20, 30, 40, 50, 60, 80, 100].reduce((best, g) =>
        Math.abs(g - tenth) < Math.abs(best - tenth) ? g : best, 10);
      return { group: "decimals", kind: "decimal × decimal", parts: [num(a), "*", num(b)], star: true,
        ans, style: "dec", step: I(gap), wrong: around(ans, [I(gap), I(2 * gap), I(3 * gap)]) };
    }

    /* -- 0.6 * 70 * 5,000 -- */

    function threeWayTimes() {
      const d1 = int(2, 9), d2 = int(2, 9), d3 = int(2, 9);
      const ans = I(d1 * d2 * d3 * 1000);
      const ten = I(10);
      return { group: "decimals", kind: "three-way ×", star: true,
        parts: [num(R(d1, 10)), "*", num(I(d2 * 10)), "*", num(I(d3 * 1000))],
        ans, style: "int", step: I(10000),
        wrong: [mul(ans, ten), div(ans, ten), I((d1 * d2 + 1) * d3 * 1000), I((d1 * d2 - 1) * d3 * 1000),
          mul(ans, I(100)), I(d1 * (d2 + 1) * d3 * 1000), div(ans, I(100))] };
    }

    /* -- 36 is …% of 80 -- */

    function percentage() {
      const whole = pick([20, 40, 40, 50, 60, 80, 80]);
      const pct = int(11, 95);
      const part = R(pct * whole, 100);
      const ans = I(pct);
      return { group: "percentages", kind: "percentages", percent: { part: num(part), whole: num(I(whole)) },
        ans, style: "int", wrong: [I(100 - pct), ...around(ans, [I(10), I(5), I(1), I(2), I(20)])] };
    }

    /* -- 12/32 + 15/16, 40 − 24/7, 5/6 × 12, 15 ÷ 5/6 -- */

    function fractions() {
      const type = pick(["addsub", "addsub", "addsub", "withwhole", "timeswhole", "wholediv", "wholediv"]);
      const spec = (parts, ans, wrong) => (ans.n <= 0 ? null :
        { group: "fractions", kind: "fractions", parts, ans, style: "frac", wrong });

      if (type === "addsub") {
        // One bottom is a multiple of the other; either fraction may be left uncancelled.
        const q = int(2, 9), k = pick([2, 2, 3, 4]);
        let n1; do { n1 = int(1, 2 * q); } while (n1 === q);
        const n2 = int(1, q * k - 1), d1 = q, d2 = q * k;
        const s1 = chance(0.25) ? pick([2, 3, 5, 10]) : 1, s2 = chance(0.25) ? pick([2, 3, 5]) : 1;
        if (d1 * s1 > 80 || d2 * s2 > 80) return null;
        let a = frac(n1 * s1, d1 * s1), b = frac(n2 * s2, d2 * s2);
        if (chance(0.5)) { const t = a; a = b; b = t; }
        const op = pick(["+", "-"]);
        if (op === "-" && !less(b.v, a.v)) { const t = a; a = b; b = t; }
        const ans = OPS[op](a.v, b.v);
        const naive = R(op === "+" ? a.v.n + b.v.n : Math.abs(a.v.n - b.v.n) || 1, a.v.d + b.v.d);
        return spec([a, op, b], ans, [naive, ...fracNear(ans), OPS[op === "+" ? "-" : "+"](a.v, b.v)]);
      }
      if (type === "withwhole") {                        // 40 − 24/7
        const q = int(3, 9);
        let p; do { p = int(1, 3 * q); } while (p % q === 0);
        const n = int(Math.ceil(p / q) + 1, 60);
        const op = chance(0.7) ? "-" : "+";
        const ans = OPS[op](I(n), R(p, q));
        return spec([num(I(n)), op, frac(p, q)], ans,
          [OPS[op === "+" ? "-" : "+"](I(n), R(p, q)), ...fracNear(ans), R(Math.abs(n - p) || 1, q)]);
      }
      if (type === "timeswhole") {                       // 5/6 × 12
        const q = int(2, 9);
        let p; do { p = int(1, q - 1); } while (gcd(p, q) !== 1);
        const m = int(2, 9);
        const f = frac(p, q), w = num(I(q * m));
        const ans = I(p * m);
        return spec(chance(0.6) ? [f, "*", w] : [w, "*", f], ans,
          [div(I(q * m), R(p, q)), ...around(ans, [I(1), I(2), I(m), I(p)])]);
      }
      const p = int(2, 10);                              // 15 ÷ 5/6
      let q; do { q = int(p + 1, 13); } while (gcd(p, q) !== 1);
      const m = int(2, 9);
      const ans = I(q * m);
      return spec([num(I(p * m)), "/", frac(p, q)], ans,
        [mul(I(p * m), R(p, q)), ...around(ans, [I(1), I(2), I(m), I(q)])]);
    }

    /* -- 7/9 − ? = 5/18, 2/4 × ? = 6, 7/9 ÷ ? = 1/11 -- */

    function missingFraction() {
      const type = pick(["add", "sub", "sub2", "mul", "div", "div2"]);
      const spec = (parts, rhs, ans, wrong) => (ans.n <= 0 || rhs.v.n <= 0 ? null :
        { group: "fractions", kind: "missing fraction", parts, rhs, ans, style: "frac",
          wrong: wrong || fracNear(ans) });
      // Two fractions whose bottoms are related, the first sometimes uncancelled.
      const pair = () => {
        const q = int(2, 9), k = pick([2, 2, 3, 4]);
        let p1; do { p1 = int(1, q - 1); } while (gcd(p1, q) !== 1);
        let p2; do { p2 = int(1, q * k - 1); } while (gcd(p2, q * k) !== 1);
        const s = chance(0.3) ? 2 : 1;
        return chance(0.5) ? [frac(p1 * s, q * s), R(p2, q * k)] : [frac(p2, q * k), R(p1, q)];
      };

      if (type === "add") {                              // 2/6 + ? = 17/24
        const [a, x] = pair();
        const c = add(a.v, x);
        return spec([a, "+", UNKNOWN], lowest(c), x, [c, ...fracNear(x), add(c, a.v)]);
      }
      if (type === "sub") {                              // ? − 5/16 = 1/8
        const [b, c] = pair();
        const x = add(b.v, c);
        return spec([UNKNOWN, "-", b], lowest(c), x, [sub(b.v, c), sub(c, b.v), ...fracNear(x)]);
      }
      if (type === "sub2") {                             // 7/9 − ? = 5/18
        const [a, x] = pair();
        if (!less(x, a.v)) return null;
        return spec([a, "-", UNKNOWN], lowest(sub(a.v, x)), x, [add(a.v, sub(a.v, x)), ...fracNear(x)]);
      }
      if (type === "mul") {                              // 2/4 × ? = 6
        const q = int(2, 8);
        let p; do { p = int(1, q - 1); } while (gcd(p, q) !== 1);
        const s = chance(0.4) ? 2 : 1, m = int(2, 9);
        const x = I(q * m);
        return spec([frac(p * s, q * s), "*", UNKNOWN], num(I(p * m)), x,
          [mul(I(p * m), R(p, q)), ...around(x, [I(1), I(2), I(q), I(m)])]);
      }
      if (type === "div") {                              // 7/9 ÷ ? = 1/11
        const q = int(2, 9);
        let p; do { p = int(1, q - 1); } while (gcd(p, q) !== 1);
        const m = int(2, 12);
        const x = R(p * m, q);
        return spec([frac(p, q), "/", UNKNOWN], frac(1, m), x, [R(p, q * m), div(I(1), x), ...fracNear(x)]);
      }
      const x = pick([R(1, 2), R(1, 3), R(2, 3), R(1, 4), R(3, 4)]);       // 1/4 ÷ ? = 1/2
      const c = pick([R(1, 2), R(1, 3), R(1, 4), R(2, 3), R(1, 5)]);
      const a = mul(x, c);
      return spec([frac(a.n, a.d), "/", UNKNOWN], frac(c.n, c.d), x,
        [c, a, div(I(1), x), ...fracNear(x)]);
    }

    return [
      [wholeAddSub, 11], [twoDigitTimes, 5], [missingWhole, 13], [missingDecimal, 15], [decimals, 9],
      [decimalTimesDecimal, 9], [threeWayTimes, 5], [percentage, 9], [fractions, 13], [missingFraction, 11],
    ];
  }

  /* ---- One question --------------------------------------------------------- */

  const OPTION_COUNT = 4;
  const SIGN = { "+": "+", "-": "−", "*": "×", "/": "÷" };

  function build(spec, shuffle, rand) {
    const ans = spec.ans;
    if (!ans || ans.n <= 0 || !fits(ans, spec.style)) return null;

    // Three wrong answers: distinct, positive, writable in the answer's style.
    //
    // How many sit below the right answer is decided first, at random, so the
    // answer is as likely to be the smallest option as the largest. Left to
    // chance it lands in the middle most of the time, and "pick a middle one"
    // becomes a strategy that works here and nowhere else.
    const below = Math.floor(rand() * OPTION_COUNT);
    const want = { lo: below, hi: OPTION_COUNT - 1 - below };
    const got = { lo: 0, hi: 0 };
    const wrong = [];
    const taken = [ans];
    const offer = (x, anySide) => {
      if (wrong.length === OPTION_COUNT - 1) return;
      if (!x || x.d === 0 || x.n <= 0 || !fits(x, spec.style)) return;
      if (taken.some(t => eq(t, x))) return;
      const side = less(x, ans) ? "lo" : "hi";
      if (!anySide && got[side] >= want[side]) return;
      got[side]++;
      taken.push(x);
      wrong.push(x);
    };
    // The most tempting slips first, then the rest.
    for (const x of shuffle(spec.wrong.slice(0, 4))) offer(x);
    for (const x of shuffle(spec.wrong.slice(4))) offer(x);
    // Then step away from the answer until each side has what it wants.
    const step = spec.step || (spec.style === "frac" ? R(1, ans.d)
      : spec.style === "int" ? I(1)
      : R(1, Math.pow(10, Math.max(0, places(ans)))));
    const walk = anySide => {
      for (let k = 1; wrong.length < OPTION_COUNT - 1 && k < 40; k++) {
        offer(add(ans, mul(step, I(k))), anySide);
        offer(sub(ans, mul(step, I(k))), anySide);
      }
    };
    walk(false);
    // A side that cannot be filled (nothing positive below 1, say) gives its
    // places to the other.
    for (const x of shuffle(spec.wrong)) offer(x, true);
    walk(true);
    if (wrong.length < OPTION_COUNT - 1) return null;

    // Options in ascending order, as the bank files write them. The runner
    // shuffles the display order itself.
    const values = [ans].concat(wrong).sort((x, y) => x.n * y.d - y.n * x.d);
    const shown = values.map(v => show(v, spec.style));
    if (new Set(shown.map(s => s.text)).size !== OPTION_COUNT) return null;
    const answer = show(ans, spec.style);

    // The line as shown, the same line with the answer filled in, and the
    // plain-text version that validate-core.js re-marks.
    let question, solved, check;
    if (spec.percent) {
      const { part, whole } = spec.percent;
      question = part.html + " is …% of " + whole.html;
      solved = part.html + " is <b>" + answer.html + "</b>% of " + whole.html;
      check = { kind: "percent", part: part.text, whole: whole.text,
        expr: part.text + " is ?% of " + whole.text };
    } else {
      const sign = op => spec.star && op === "*" ? "*" : SIGN[op];
      const line = fill => spec.parts.map(p => typeof p === "string" ? sign(p)
        : p === UNKNOWN ? fill : p.html).join(" ");
      const text = spec.parts.map(p => typeof p === "string" ? p : p.text).join(" ");
      if (spec.rhs) {
        question = line("?") + " = " + spec.rhs.html;
        solved = line("<b>" + answer.html + "</b>") + " = " + spec.rhs.html;
        check = { expr: text + " = " + spec.rhs.text };
      } else {
        question = line("?") + " = ?";
        solved = line("?") + " = <b>" + answer.html + "</b>";
        check = { expr: text };
      }
    }
    check.value = answer.text;
    check.options = shown.map(s => s.text);

    return {
      category: spec.group,
      breakdown: spec.kind,
      time: 6,
      generated: true,
      question: '<span class="sum">' + question + "</span>",
      options: shown.map(s => s.html),
      answer: values.findIndex(v => eq(v, ans)),
      solution: '<span class="sum">' + solved + "</span>",
      check,
    };
  }

  /* make(count, rand) — a whole paper, no question appearing twice. */
  function make(count, rand) {
    rand = rand || Math.random;
    const table = kinds(rand);
    const total = table.reduce((n, [, w]) => n + w, 0);
    const shuffle = arr => {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        const t = a[i]; a[i] = a[j]; a[j] = t;
      }
      return a;
    };
    const stamp = Date.now().toString(36);
    const seen = new Set();
    const paper = [];
    let guard = 0;
    while (paper.length < count && guard++ < count * 200) {
      let roll = rand() * total, maker = table[table.length - 1][0];
      for (const [fn, weight] of table) { if (roll < weight) { maker = fn; break; } roll -= weight; }
      const spec = maker();
      const q = spec && build(spec, shuffle, rand);
      if (!q || seen.has(q.check.expr)) continue;
      seen.add(q.check.expr);
      q.id = "gen-" + stamp + "-" + (paper.length + 1);
      paper.push(q);
    }
    return paper;
  }

  return {
    id: "arithmetic-sprint",
    name: "Mental arithmetic sprint — the kinds of question in the Flow Traders practice test",
    make,
  };
})());
