/* ============================================================================
   GENERATOR — MENTAL ARITHMETIC SPRINT
   ----------------------------------------------------------------------------
   Makes the questions for a Flow-Traders-style arithmetic sprint: one sum, four
   answer choices, a few seconds each. Integers, decimals and fractions; add,
   subtract, multiply and divide; nothing past four decimal places.

   A paper is generated fresh every sitting, so there is nothing to memorise
   and no bank to run dry. Nothing in here touches the DOM, so node can run it
   too (validate.js re-marks a few thousand generated questions on every run).

   Every value is an exact rational { n, d } on integers — no floating point is
   ever used to decide an answer, only to pick random operands.

   The wrong options are built from the slips people actually make: a decimal
   point one place out, a carry dropped, tops and bottoms added, multiplying
   where the sum said divide. Most share a last digit or a size with the right
   answer, so neither trick alone picks the answer out every time.
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
  const isInt = x => x.d === 1;
  const neg = x => R(-x.n, x.d);

  const OPS = {
    "+": { fn: add, sign: "+",      text: "+" },
    "-": { fn: sub, sign: "−", text: "-" },
    "*": { fn: mul, sign: "×", text: "*" },
    "/": { fn: div, sign: "÷", text: "/" },
  };

  /* How many decimal places x needs, or -1 if it does not terminate (within 6). */
  function places(x) {
    let pow = 1;
    for (let k = 0; k <= 6; k++) {
      if (pow % x.d === 0) return k;
      pow *= 10;
    }
    return -1;
  }

  /* ---- Formatting ----------------------------------------------------------
     `style` is how an answer is written: "int", "dec" or "frac". Each formatter
     returns the same value twice — as HTML for the page and as plain text for
     the independent re-marking in validate.js and tests.html.               */

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

  function fracText(x) {
    return isInt(x) ? String(x.n) : x.n + "/" + x.d;
  }

  const minus = s => s.replace(/^-/, "−");

  function fracHtml(x) {
    if (isInt(x)) return minus(String(x.n));
    return (x.n < 0 ? "−" : "") +
      '<span class="frac"><span>' + Math.abs(x.n) + '</span><span>' + x.d + '</span></span>';
  }

  function show(x, style) {
    if (style === "frac") return { html: fracHtml(x), text: fracText(x) };
    const t = decText(x);
    return { html: minus(t), text: t };
  }

  /* Can x be written in this style at all? */
  function fits(x, style) {
    if (style === "int") return isInt(x);
    if (style === "dec") { const k = places(x); return k !== -1 && k <= 5; }
    return true;
  }

  /* ---- Question kinds ---------------------------------------------------------
     Each returns { a, b, op, sa, sb, style, group, wrong }:
       a, b      operands (rationals)       sa, sb   how each operand is written
       style     how the answer is written  group    "integers" | "decimals" | "fractions"
       wrong     candidate wrong answers, most tempting first                  */

  function kinds(rand) {

    const int = (lo, hi) => lo + Math.floor(rand() * (hi - lo + 1));
    const pick = arr => arr[Math.floor(rand() * arr.length)];
    const chance = p => rand() < p;
    const I = n => R(n, 1);

    /* A decimal with exactly `p` places: the last digit is never zero, so the
       places shown are the places meant. */
    function decimal(lo, hi, p) {
      let u;
      do { u = int(lo, hi); } while (u % 10 === 0);
      return R(u, Math.pow(10, p));
    }

    /* A proper fraction in lowest terms with denominator 2..maxDen. */
    function proper(maxDen) {
      let n, d;
      do { d = int(2, maxDen); n = int(1, d - 1); } while (gcd(n, d) !== 1);
      return R(n, d);
    }

    const ulp = x => R(1, Math.pow(10, Math.max(0, places(x))));
    const plusMinus = (x, steps) => {
      const out = [];
      for (const s of steps) { out.push(add(x, s)); out.push(sub(x, s)); }
      return out;
    };

    /* -- integers -- */

    function intAdd() {
      const a = int(pick([24, 120, 1100]), pick([999, 4999, 9999]));
      const b = int(pick([24, 120]), pick([999, 4999]));
      const ans = I(a + b);
      return { a: I(a), b: I(b), op: "+", style: "int", group: "integers",
        wrong: [...plusMinus(ans, [I(10), I(100)]), ...plusMinus(ans, [I(20), I(1), I(2)])] };
    }

    function intSub() {
      let a = int(pick([120, 1100]), pick([999, 4999, 9999]));
      let b = int(pick([24, 120]), pick([999, 4999]));
      if (a === b) a += 17;
      if (a < b !== chance(0.25)) { const t = a; a = b; b = t; }   // negative about 1 in 4
      const ans = I(a - b);
      return { a: I(a), b: I(b), op: "-", style: "int", group: "integers",
        wrong: [...plusMinus(ans, [I(10), I(100)]), neg(ans), ...plusMinus(ans, [I(20), I(1), I(2)])] };
    }

    function intMul() {
      const shape = pick(["2x1", "2x2", "2x2", "3x1", "3x2"]);
      const a = shape[0] === "3" ? int(101, 999) : int(12, 99);
      const b = shape[2] === "1" ? int(3, 9) : int(11, 99);
      const ans = I(a * b);
      return { a: I(a), b: I(b), op: "*", style: "int", group: "integers",
        wrong: [...plusMinus(ans, [I(10), I(100), I(20)]), ...plusMinus(ans, [I(a), I(b)])] };
    }

    function intDiv() {
      if (chance(0.25)) {
        // A quotient that is not whole: 87 / 4 = 21.75.
        const b = pick([4, 8, 16, 20, 25, 40]);
        let a;
        do { a = int(b + 1, 60 * b > 999 ? 999 : 60 * b); } while (a % b === 0);
        const ans = R(a, b);
        return { a: I(a), b: I(b), op: "/", style: "dec", group: "integers",
          wrong: [...plusMinus(ans, [I(1), R(1, 10), R(1, 2), R(1, 4), ulp(ans)])] };
      }
      const b = pick([3, 4, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 24, 25]);
      const q = int(12, b < 10 ? 250 : 99);
      const ans = I(q);
      return { a: I(q * b), b: I(b), op: "/", style: "int", group: "integers",
        wrong: [...plusMinus(ans, [I(10), I(1), I(2), I(11), I(5)])] };
    }

    /* -- decimals -- */

    function decAddSub(op) {
      const pa = pick([1, 2, 3]), pb = pick([1, 2, 3]);
      let a = decimal(11, 9999, pa);
      let b = decimal(11, 9999, pb);
      if (eq(a, b)) b = add(b, R(3, 10));
      if (op === "-" && (a.n * b.d < b.n * a.d) !== chance(0.2)) { const t = a; a = b; b = t; }
      const ans = OPS[op].fn(a, b);
      const u = ulp(ans);
      const wrong = [...plusMinus(ans, [R(1, 10), I(1), R(1, 100)].filter(s => s.d <= u.d))];
      if (op === "-") wrong.push(neg(ans));
      wrong.push(...plusMinus(ans, [I(10), u, add(u, u)]));
      return { a, b, op, style: "dec", group: "decimals", wrong };
    }

    /* One digit of the answer changed, or the decimal point moved. */
    function decSlips(ans) {
      const u = ulp(ans);
      const ten = I(10);
      return [mul(ans, ten), div(ans, ten),
        ...plusMinus(ans, [mul(u, ten), mul(u, I(100))]),
        ...plusMinus(ans, [u, add(u, u)]), mul(ans, I(100)), div(ans, I(100))];
    }

    function decMul() {
      let a, b;
      if (chance(0.5)) {                       // decimal x whole number
        a = decimal(2, 999, pick([1, 2, 3]));
        b = I(int(2, 60));
      } else {                                 // decimal x decimal, at most 4 places
        a = decimal(2, 99, pick([1, 2]));
        b = decimal(2, 99, pick([1, 2]));
      }
      if (chance(0.5)) { const t = a; a = b; b = t; }
      return { a, b, op: "*", style: "dec", group: "decimals", wrong: decSlips(mul(a, b)) };
    }

    function decDiv() {
      // Built backwards from the quotient, so it always comes out exactly.
      const q = chance(0.4) ? I(int(2, 250)) : decimal(2, 999, pick([1, 2]));
      const b = decimal(2, 99, pick([1, 2]));
      const a = mul(q, b);
      if (places(a) > 4 || eq(q, I(1))) return null;
      return { a, b, op: "/", style: "dec", group: "decimals", wrong: decSlips(q) };
    }

    /* -- fractions -- */

    function fracNear(ans) {
      // Numerator or denominator out by one.
      const out = [R(ans.n + 1, ans.d), R(ans.n - 1, ans.d), R(ans.n, ans.d + 1)];
      if (ans.d > 2) out.push(R(ans.n, ans.d - 1));
      return out;
    }

    function fracAddSub(op) {
      const a = proper(12);
      let b;
      do { b = proper(12); } while (eq(a, b) || (a.d === b.d && chance(0.8)));
      const ans = OPS[op].fn(a, b);
      const other = OPS[op === "+" ? "-" : "+"].fn(a, b);
      // Tops and bottoms combined separately: 1/2 + 1/3 "=" 2/5.
      const naive = R(op === "+" ? a.n + b.n : a.n - b.n, a.d + b.d);
      const wrong = [naive, ...fracNear(ans), other];
      if (op === "-") wrong.push(neg(ans));
      return { a, b, op, sa: "frac", sb: "frac", style: "frac", group: "fractions", wrong };
    }

    function fracMulDiv(op) {
      let a = proper(12), b = proper(12), sa = "frac", sb = "frac";
      const whole = chance(0.3);
      if (whole) {                             // a fraction of a whole number
        b = I(op === "*" ? a.d * int(2, 15) + pick([0, 0, 0, 1]) : int(2, 24));
        sb = "int";
        if (op === "*" && chance(0.5)) { const t = a; a = b; b = t; sa = "int"; sb = "frac"; }
        if (op === "/" && chance(0.5)) { const t = a; a = b; b = t; sa = "int"; sb = "frac"; }
      } else if (eq(a, b)) {
        return null;
      }
      const ans = OPS[op].fn(a, b);
      const other = OPS[op === "*" ? "/" : "*"].fn(a, b);
      const wrong = [other, div(I(1), ans), ...fracNear(ans), add(a, b)];
      return { a, b, op, sa, sb, style: "frac", group: "fractions", wrong };
    }

    function fracWithDecimal() {
      // A fraction that is a clean decimal, combined with a decimal.
      const d = pick([2, 4, 5, 8, 20, 25]);
      let n;
      do { n = int(1, d - 1); } while (gcd(n, d) !== 1);
      let a = R(n, d);
      let b = decimal(2, 199, 2);
      const op = pick(["+", "-", "*"]);
      let sa = "frac", sb = "dec";
      if (op === "-" && a.n * b.d < b.n * a.d) { const t = a; a = b; b = t; sa = "dec"; sb = "frac"; }
      const ans = OPS[op].fn(a, b);
      if (places(ans) === -1 || places(ans) > 4) return null;
      const u = ulp(ans);
      const wrong = op === "*" ? decSlips(ans)
        : [...plusMinus(ans, [R(1, 10), R(1, 100), R(1, 20)].filter(s => s.d <= u.d)),
           ...plusMinus(ans, [u, I(1)])];
      return { a, b, op, sa, sb, style: "dec", group: "fractions", wrong };
    }

    return {
      integers: [intAdd, intSub, intMul, intMul, intDiv, intDiv],
      decimals: [() => decAddSub("+"), () => decAddSub("-"), decMul, decMul, decDiv, decDiv],
      fractions: [() => fracAddSub("+"), () => fracAddSub("-"),
        () => fracMulDiv("*"), () => fracMulDiv("/"), fracWithDecimal],
      pick,
    };
  }

  /* ---- One question --------------------------------------------------------- */

  const MIX = [["integers", 0.4], ["decimals", 0.35], ["fractions", 0.25]];
  const OPTION_COUNT = 4;

  function styleOf(x, given) {
    return given || (isInt(x) ? "int" : "dec");
  }

  function build(spec, shuffle, rand) {
    const op = OPS[spec.op];
    const ans = op.fn(spec.a, spec.b);
    if (ans.n === 0 || !fits(ans, spec.style)) return null;

    // Three wrong answers: distinct values, writable in the answer's style.
    //
    // How many sit below the right answer is decided first, at random, so the
    // answer is as likely to be the smallest option as the largest. Left to
    // chance it lands in the middle five times in six, and "pick a middle
    // one" becomes a strategy that works here and nowhere else.
    const below = Math.floor(rand() * OPTION_COUNT);
    const want = { lo: below, hi: OPTION_COUNT - 1 - below };
    const got = { lo: 0, hi: 0 };
    const wrong = [];
    const taken = [ans];
    const offer = (x, anySide) => {
      if (wrong.length === OPTION_COUNT - 1) return;
      if (!x || x.d === 0 || x.n === 0 || !fits(x, spec.style)) return;
      // The wrong sign is only tempting as the answer itself, negated, on a
      // subtraction. Any other option on the far side of zero gives itself away.
      if ((x.n > 0) !== (ans.n > 0) && !(spec.op === "-" && eq(x, neg(ans)))) return;
      if (taken.some(t => eq(t, x))) return;
      const side = x.n * ans.d < ans.n * x.d ? "lo" : "hi";
      if (!anySide && got[side] >= want[side]) return;
      got[side]++;
      taken.push(x);
      wrong.push(x);
    };
    // The most tempting slips first, then the rest.
    for (const x of shuffle(spec.wrong.slice(0, 4))) offer(x);
    for (const x of shuffle(spec.wrong.slice(4))) offer(x);
    // Then step away from the answer until each side has what it wants.
    const step = spec.style === "frac" ? R(1, ans.d)
      : spec.style === "int" ? R(1, 1)
      : R(1, Math.pow(10, Math.max(0, places(ans))));
    for (let k = 1; wrong.length < OPTION_COUNT - 1 && k < 40; k++) {
      offer(add(ans, mul(step, R(k, 1))));
      offer(sub(ans, mul(step, R(k, 1))));
    }
    // A side that cannot be filled (nothing positive below 1/12, say) gives
    // its places to the other.
    for (const x of shuffle(spec.wrong)) offer(x, true);
    for (let k = 1; wrong.length < OPTION_COUNT - 1 && k < 40; k++) {
      offer(add(ans, mul(step, R(k, 1))), true);
      offer(sub(ans, mul(step, R(k, 1))), true);
    }
    if (wrong.length < OPTION_COUNT - 1) return null;

    // Options in ascending order, as the bank files write them. The runner
    // shuffles the display order itself.
    const values = [ans].concat(wrong).sort((x, y) => x.n * y.d - y.n * x.d);
    const shown = values.map(v => show(v, spec.style));
    if (new Set(shown.map(s => s.text)).size !== OPTION_COUNT) return null;

    const sa = show(spec.a, spec.sa || styleOf(spec.a));
    const sb = show(spec.b, spec.sb || styleOf(spec.b));
    const answerShown = show(ans, spec.style);
    const paren = t => /[\/-]/.test(t) ? "(" + t + ")" : t;

    return {
      category: spec.group,
      breakdown: spec.group + " " + op.sign,
      time: 6,
      generated: true,
      question: '<span class="sum">' + sa.html + " " + op.sign + " " + sb.html + "</span>",
      options: shown.map(s => s.html),
      answer: values.findIndex(v => eq(v, ans)),
      solution: '<span class="sum">' + sa.html + " " + op.sign + " " + sb.html +
        " = " + answerShown.html + "</span>",
      check: {
        expr: paren(sa.text) + " " + op.text + " " + paren(sb.text),
        value: answerShown.text,
        options: shown.map(s => s.text),
      },
    };
  }

  /* make(count, rand) — a whole paper, no sum appearing twice. */
  function make(count, rand) {
    rand = rand || Math.random;
    const k = kinds(rand);
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
      let roll = rand(), group = MIX[MIX.length - 1][0];
      for (const [name, weight] of MIX) { if (roll < weight) { group = name; break; } roll -= weight; }
      const spec = k.pick(k[group])();
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
    name: "Mental arithmetic sprint — integers, decimals, fractions",
    make,
  };
})());
