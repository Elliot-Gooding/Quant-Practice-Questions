/* ============================================================================
   VALIDATION RULES
   ----------------------------------------------------------------------------
   Pure functions, no DOM and no filesystem, so the same rules run in two places
   and cannot drift apart:

     node validate.js   — the CLI, exits non-zero on any error
     the Bank view      — the same report in the app, over file://

   Errors are things that will misbehave at runtime. Warnings are things worth
   knowing about that still work — a question with no options is a warning at
   most, since free-response is a legitimate state for most of the bank.
   ========================================================================== */

const QValidate = (function () {

  const ERROR = "error";
  const WARN = "warn";

  const DIFFICULTIES = [1, 2, 3];

  /* ---- LaTeX delimiter scanning ------------------------------------------

     Walks the string consuming $$...$$ and $...$ spans. A backslash escapes the
     next character, so an authored \$ (a literal dollar sign) is skipped rather
     than counted as a delimiter.

     Returns { dangling, suspicious } where `dangling` is an unclosed delimiter
     and `suspicious` is a span that closed, but swallowed so much text that the
     closing $ was almost certainly meant to be somewhere else.                */

  const SUSPICIOUS_SPAN = 300;

  function scanDelimiters(text) {
    let i = 0;
    let dangling = null;
    const suspicious = [];

    while (i < text.length) {
      const ch = text[i];

      if (ch === "\\") { i += 2; continue; }

      if (ch === "$" && text[i + 1] === "$") {
        const end = text.indexOf("$$", i + 2);
        if (end === -1) { dangling = "unclosed $$ display block"; break; }
        i = end + 2;
        continue;
      }

      if (ch === "$") {
        const end = text.indexOf("$", i + 1);
        if (end === -1) { dangling = "unclosed $ inline span"; break; }
        const span = text.slice(i + 1, end);
        if (span.length > SUSPICIOUS_SPAN || /<\/?p>|<br/i.test(span))
          suspicious.push(span.slice(0, 60).replace(/\s+/g, " "));
        i = end + 1;
        continue;
      }

      i++;
    }

    return { dangling, suspicious };
  }

  /* ---- Per-question rules ------------------------------------------------ */

  function checkQuestion(q, ctx) {
    const issues = [];
    const at = (severity, field, message) =>
      issues.push({ severity, id: q.id || "(no id)", field, message });

    if (!q.id) at(ERROR, "id", "missing id");
    if (!q.category) at(ERROR, "category", "missing category");
    if (!q.question) at(ERROR, "question", "missing question text");

    if (q.difficulty === undefined) at(WARN, "difficulty", "no difficulty set");
    else if (DIFFICULTIES.indexOf(q.difficulty) === -1)
      at(ERROR, "difficulty", "difficulty is " + JSON.stringify(q.difficulty) + ", must be 1, 2 or 3");

    if (q.time === undefined) at(WARN, "time", "no target time set");
    else if (typeof q.time !== "number" || !(q.time > 0))
      at(ERROR, "time", "time must be a positive number of seconds");

    if (!q.solution) at(WARN, "solution", "no solution");
    if (!q.hint) at(WARN, "hint", "no hint");

    /* -- multiple choice -- */

    const hasOptions = q.options !== undefined;
    const hasAnswer = q.answer !== undefined;

    if (hasOptions && !Array.isArray(q.options)) {
      at(ERROR, "options", "options must be an array");
    } else if (hasOptions) {
      if (q.options.length < 2)
        at(ERROR, "options", "only " + q.options.length + " option(s); need at least 2");

      q.options.forEach((opt, i) => {
        if (typeof opt !== "string")
          at(ERROR, "options", "option " + (i + 1) + " is not a string");
        else if (!opt.trim())
          at(ERROR, "options", "option " + (i + 1) + " is empty");
      });

      const seen = new Map();
      q.options.forEach((opt, i) => {
        if (typeof opt !== "string") return;
        const key = opt.trim().toLowerCase();
        if (seen.has(key))
          at(WARN, "options", "option " + (i + 1) + " repeats option " + (seen.get(key) + 1));
        else seen.set(key, i);
      });

      if (!hasAnswer) {
        at(ERROR, "answer", "has options but no answer index");
      } else if (typeof q.answer !== "number" || !Number.isInteger(q.answer)) {
        at(ERROR, "answer", "answer must be an integer index, got " + JSON.stringify(q.answer));
      } else if (q.answer < 0 || q.answer >= q.options.length) {
        at(ERROR, "answer", "answer index " + q.answer + " is out of range for " +
          q.options.length + " options (valid: 0-" + (q.options.length - 1) + ")");
      }

      // Does this option count fit any format we ship? Not an error — it just
      // means the question cannot appear in a paper.
      if (Array.isArray(q.options) && ctx.optionCounts.length &&
          ctx.optionCounts.indexOf(q.options.length) === -1) {
        at(WARN, "options", q.options.length + " options matches no test format (formats use " +
          ctx.optionCounts.join(", ") + ") — this question can never appear in a test");
      }
    } else if (hasAnswer) {
      at(ERROR, "answer", "has an answer index but no options");
    }

    /* -- optional metadata -- */

    if (q.tags !== undefined) {
      if (!Array.isArray(q.tags)) at(ERROR, "tags", "tags must be an array of strings");
      else q.tags.forEach((t, i) => {
        if (typeof t !== "string" || !t.trim())
          at(ERROR, "tags", "tag " + (i + 1) + " is not a non-empty string");
      });
    }

    if (q.source !== undefined && typeof q.source !== "string")
      at(ERROR, "source", "source must be a string");

    /* -- interview fields: staged clues, a short answer, an opening-problem link -- */

    const isText = t => typeof t === "string" && !!t.trim();

    if (q.hints !== undefined) {
      if (!Array.isArray(q.hints) || !q.hints.length)
        at(ERROR, "hints", "hints must be a non-empty array of strings");
      else {
        q.hints.forEach((h, i) => {
          if (!isText(h)) at(ERROR, "hints", "clue " + (i + 1) + " is not a non-empty string");
        });
        if (q.hint !== q.hints[0])
          at(WARN, "hint", "hint should repeat the first entry of hints, which is what practice shows");
      }
    }

    if (q.shortAnswer !== undefined && !isText(q.shortAnswer))
      at(ERROR, "shortAnswer", "shortAnswer must be a non-empty string");

    if (q.interview !== undefined) {
      const iv = q.interview;
      if (!iv || typeof iv !== "object" || Array.isArray(iv)) {
        at(ERROR, "interview", "interview must be an object: { level, followUp, twist }");
      } else {
        if (hasOptions) at(ERROR, "interview", "an interview problem is free-response and cannot have options");
        if (DIFFICULTIES.indexOf(iv.level) === -1)
          at(ERROR, "interview", "interview.level is " + JSON.stringify(iv.level) + ", must be 1, 2 or 3");
        if (!isText(iv.twist)) at(ERROR, "interview", "interview.twist is missing: the follow-up as the interviewer would put it");
        if (!isText(q.shortAnswer)) at(ERROR, "shortAnswer", "an interview problem needs a shortAnswer to mark against");
        if (!Array.isArray(q.hints)) at(WARN, "hints", "an interview problem has no staged clues");

        const next = ctx.byId ? ctx.byId.get(iv.followUp) : undefined;
        if (!isText(iv.followUp)) at(ERROR, "interview", "interview.followUp is missing");
        else if (iv.followUp === q.id) at(ERROR, "interview", "interview.followUp points at the question itself");
        else if (ctx.byId && !next) at(ERROR, "interview", "interview.followUp \"" + iv.followUp + "\" is not a question in the bank");
        else if (next) {
          if (Array.isArray(next.options)) at(ERROR, "interview", "follow-up \"" + iv.followUp + "\" has options; it must be free-response");
          if (!isText(next.shortAnswer)) at(ERROR, "interview", "follow-up \"" + iv.followUp + "\" has no shortAnswer to mark against");
          if (!next.solution) at(WARN, "interview", "follow-up \"" + iv.followUp + "\" has no solution");
        }
      }
    }

    /* -- LaTeX delimiters -- */

    const textFields = [["question", q.question], ["hint", q.hint], ["solution", q.solution]];
    if (Array.isArray(q.options))
      q.options.forEach((opt, i) => textFields.push(["option " + (i + 1), opt]));
    if (Array.isArray(q.hints))
      q.hints.forEach((h, i) => textFields.push(["clue " + (i + 1), h]));
    textFields.push(["shortAnswer", q.shortAnswer]);
    if (q.interview && typeof q.interview === "object") textFields.push(["interview.twist", q.interview.twist]);

    for (const [field, text] of textFields) {
      if (typeof text !== "string" || text.indexOf("$") === -1) continue;
      const { dangling, suspicious } = scanDelimiters(text);
      if (dangling) at(ERROR, field, dangling);
      for (const span of suspicious)
        at(WARN, field, "a $...$ span looks too long to be maths: \"" + span + "...\"");
    }

    return issues;
  }

  /* ---- Re-marking generated questions --------------------------------------

     A generator's questions are never read by a person before they are sat, so
     they are re-marked here instead. Each one carries check = { expr, value,
     options } in plain text; this evaluates expr from scratch — its own parser,
     its own BigInt fractions, sharing no code with the generator — and insists
     that the keyed option is the true value and that no other option is.
     Sequence questions are re-marked the same way, further down.              */

  function parseValue(text) {
    const m = /^(-?)(\d+)(?:\.(\d+))?(?:\/(\d+))?$/.exec(String(text).trim());
    if (!m) throw new Error("cannot read the number \"" + text + "\"");
    const frac = m[3] || "";
    let n = BigInt(m[2] + frac);
    let d = BigInt("1" + "0".repeat(frac.length));
    if (m[4] !== undefined) d *= BigInt(m[4]);
    if (d === 0n) throw new Error("zero denominator in \"" + text + "\"");
    if (m[1]) n = -n;
    return { n, d };
  }

  const same = (x, y) => x.n * y.d === y.n * x.d;

  /* One operand of a sum: a number, or a fraction in brackets. */
  function operand(token) {
    const m = /^\(?(-?[\d.]+(?:\/\d+)?)\)?$/.exec(token);
    if (!m) throw new Error("cannot read the number \"" + token + "\"");
    return parseValue(m[1]);
  }

  function apply(a, op, b) {
    switch (op) {
      case "+": return { n: a.n * b.d + b.n * a.d, d: a.d * b.d };
      case "-": return { n: a.n * b.d - b.n * a.d, d: a.d * b.d };
      case "*": return { n: a.n * b.n, d: a.d * b.d };
      case "/":
        if (b.n === 0n) throw new Error("division by zero");
        return { n: a.n * b.d, d: a.d * b.n };
      default: throw new Error("unknown operation \"" + op + "\"");
    }
  }

  /* The value of "a op b", or of a run of multiplications "a * b * c". With
     `unknown` given, a "?" in the sum stands for that value. */
  function evalCheck(expr, unknown) {
    const tokens = String(expr).trim().split(" ");
    if (tokens.length % 2 === 0 || tokens.length < 3 || tokens.length > 5)
      throw new Error("cannot read the sum \"" + expr + "\"");
    if (tokens.length === 5 && !(tokens[1] === "*" && tokens[3] === "*"))
      throw new Error("only multiplications may be chained: \"" + expr + "\"");
    const value = token => {
      if (token !== "?") return operand(token);
      if (!unknown) throw new Error("\"" + expr + "\" has an unknown and nothing to try in it");
      return unknown;
    };
    let acc = value(tokens[0]);
    for (let i = 1; i < tokens.length; i += 2) acc = apply(acc, tokens[i], value(tokens[i + 1]));
    return acc;
  }

  /* How an arithmetic check record decides whether a value is the answer.
       { expr: "58 + 5" }                       the value of the sum
       { expr: "49 * ? = 343" }                 the value that makes it true,
                                                found by trying each option in it
       { kind: "percent", part, whole }         100 * part / whole              */
  function rightAnswer(c) {
    if (c.kind === "percent") {
      const part = parseValue(c.part), whole = parseValue(c.whole);
      if (whole.n === 0n) throw new Error("a percentage of nothing");
      return v => same({ n: v.n * whole.n, d: v.d * whole.d }, { n: part.n * 100n, d: part.d });
    }
    const sides = String(c.expr).split(" = ");
    if (sides.length === 2) {
      if (sides[0].split(" ").filter(t => t === "?").length !== 1)
        throw new Error("\"" + c.expr + "\" should hide exactly one number");
      const rhs = operand(sides[1]);
      return v => { try { return same(evalCheck(sides[0], v), rhs); } catch (e) { return false; } };
    }
    if (sides.length !== 1) throw new Error("cannot read \"" + c.expr + "\"");
    const truth = evalCheck(c.expr);
    return v => same(v, truth);
  }

  /* A question line and its check record, reduced to the same bare form, so
     that what is shown can be compared with what is marked. */
  function bare(text) {
    return plainOf(text).replace(/<[^>]+>/g, "").replace(/\u00d7/g, "*").replace(/\u00f7/g, "/")
      .replace(/\u2026/g, "?").replace(/[\s()]/g, "");
  }

  /* ---- Re-marking generated sequences ----------------------------------------

     A sequence question carries check = { kind: "sequence", rule: { family,
     params }, terms, value, options }. Each family is written out again here,
     term by term on BigInt fractions, from nothing but its parameters. The
     terms the generator showed and the answer it keyed must both come out of
     this second implementation, or the question is reported.                 */

  const num = v => parseValue(String(v));
  const whole = v => ({ n: BigInt(v), d: 1n });
  const qadd = (x, y) => ({ n: x.n * y.d + y.n * x.d, d: x.d * y.d });
  const qmul = (x, y) => ({ n: x.n * y.n, d: x.d * y.d });
  function qdiv(x, y) {
    if (y.n === 0n) throw new Error("a sequence rule divided by zero");
    return { n: x.n * y.d, d: x.d * y.n };
  }
  function asInteger(x) {
    if (x.n % x.d !== 0n) throw new Error("a sequence rule expected a whole number");
    return x.n / x.d;
  }

  function isPrime(k) {
    if (k < 2) return false;
    for (let f = 2; f * f <= k; f++) if (k % f === 0) return false;
    return true;
  }
  function nthPrime(index) {                    // nthPrime(0) is 2
    let found = -1, k = 1;
    while (found < index) { k++; if (isPrime(k)) found++; }
    return k;
  }

  /* grow(seed, count, next): next(t, i) gives term i from the terms before it. */
  function grow(seed, count, next) {
    const t = seed.slice();
    for (let i = t.length; i < count; i++) t.push(next(t, i));
    return t.slice(0, count);
  }
  const track = (trk, j) => trk.kind === "mul"
    ? qmul(num(trk.a), whole(BigInt(trk.step) ** BigInt(j)))
    : qadd(num(trk.a), qmul(num(trk.step), whole(j)));
  const digitsOf = x => String(asInteger(x) < 0n ? -asInteger(x) : asInteger(x));

  const SEQUENCE_RULES = {
    arithmetic: (p, k) => grow([num(p.a)], k, t => qadd(t[t.length - 1], num(p.d))),
    quadratic: (p, k) => grow([num(p.a)], k, (t, i) =>
      qadd(t[i - 1], qadd(num(p.d), qmul(num(p.c), whole(i - 1))))),
    primeGaps: (p, k) => grow([num(p.a)], k, (t, i) => qadd(t[i - 1], whole(p.s * nthPrime(p.j + i - 1)))),
    squareGaps: (p, k) => grow([num(p.a)], k, (t, i) => qadd(t[i - 1], whole(p.s * (p.j + i - 1) * (p.j + i - 1)))),
    geometric: (p, k) => grow([num(p.a)], k, t => qmul(t[t.length - 1], num(p.r))),
    affine: (p, k) => grow([num(p.a)], k, t => qadd(qmul(num(p.m), t[t.length - 1]), num(p.c))),
    growingMul: (p, k) => grow([num(p.a)], k, (t, i) =>
      p.dir === "div" ? qdiv(t[i - 1], whole(p.k + i - 1)) : qmul(t[i - 1], whole(p.k + i - 1))),
    doublePlusIndex: (p, k) => grow([num(p.a)], k, (t, i) =>
      qadd(qmul(num(p.m), t[i - 1]), qmul(num(p.c), whole(i)))),
    sumTwo: (p, k) => grow([num(p.a), num(p.b)], k, (t, i) => qadd(t[i - 1], t[i - 2])),
    sumThree: (p, k) => grow([num(p.a), num(p.b), num(p.c)], k, (t, i) => qadd(qadd(t[i - 1], t[i - 2]), t[i - 3])),
    productTwo: (p, k) => grow([num(p.a), num(p.b)], k, (t, i) => qmul(t[i - 1], t[i - 2])),
    sumAll: (p, k) => grow([num(p.a), num(p.b)], k, t => t.reduce(qadd, whole(0))),
    secondOrder: (p, k) => grow([num(p.a), num(p.b)], k, (t, i) =>
      qadd(qmul(num(p.p), t[i - 1]), qmul(num(p.q), t[i - 2]))),
    squareRecurrence: (p, k) => grow([num(p.a)], k, (t, i) => qadd(qmul(t[i - 1], t[i - 1]), num(p.c))),
    interleaved: (p, k) => grow([], k, (t, i) => track(i % 2 === 0 ? p.x : p.y, Math.floor(i / 2))),
    alternating: (p, k) => grow([num(p.a)], k, (t, i) => {
      const op = p.ops[(i - 1) % 2];
      return qadd(qmul(whole(op[0]), t[i - 1]), whole(op[1]));
    }),
    addMulGrowing: (p, k) => grow([num(p.a)], k, (t, i) => {
      const by = whole(p.k0 + i - 1);
      const adding = ((i - 1) % 2 === 0) === (p.first === "add");
      return adding ? qadd(t[i - 1], by) : qmul(t[i - 1], by);
    }),
    fractionTracks: (p, k) => grow([], k, (t, i) => qdiv(
      qadd(num(p.num.a), qmul(num(p.num.d), whole(i))), track(p.den, i))),
    conditional: (p, k) => grow([num(p.a)], k, (t, i) => {
      const v = asInteger(t[i - 1]);
      return v % 2n === 0n ? whole(v / 2n) : qadd(qmul(num(p.m), whole(v)), num(p.c));
    }),
    power: (p, k) => grow([], k, (t, i) => {
      const base = BigInt(i + 1 + p.s) ** BigInt(p.k);
      const sign = p.alt ? BigInt(p.sign) * (i % 2 === 0 ? 1n : -1n) : 1n;
      return qadd(whole(sign * base), num(p.c));
    }),
    primeForm: (p, k) => grow([], k, (t, i) => {
      const q = BigInt(nthPrime(p.j + i));
      return whole(p.form === "square" ? q * q : p.form === "timesIndex" ? BigInt(i + 1) * q : 2n * q);
    }),
    expForm: (p, k) => grow([], k, (t, i) => {
      const pos = BigInt(i + 1);
      return p.form === "times"
        ? whole(pos * 2n ** (pos - BigInt(p.e)))
        : whole(BigInt(p.b) ** pos + BigInt(p.s) * pos);
    }),
    rotation: (p, k) => {
      const out = [String(p.digits)];
      while (out.length < k) {
        const s = out[out.length - 1];
        out.push(p.by === "left" ? s.substring(1) + s.charAt(0) : s.charAt(s.length - 1) + s.substring(0, s.length - 1));
      }
      return out.slice(0, k).map(num);
    },
    baseCount: (p, k) => grow([], k, (t, i) => {
      let v = p.start + i, s = "";
      while (v > 0) { s = (v % p.base) + s; v = Math.floor(v / p.base); }
      return num(s);
    }),
    digitSum: (p, k) => grow([num(p.a)], k, (t, i) => {
      let sum = 0n;
      for (const ch of digitsOf(t[i - 1])) sum += BigInt(ch);
      return qadd(t[i - 1], whole(sum));
    }),
    reverseAdd: (p, k) => grow([num(p.a)], k, (t, i) => {
      if (i % 2 === 0) return qadd(t[i - 1], num(p.k));
      let back = "";
      for (const ch of digitsOf(t[i - 1])) back = ch + back;
      return num(back);
    }),
    lookSay: (p, k) => {
      const out = [String(p.seed)];
      while (out.length < k) {
        const s = out[out.length - 1];
        let next = "", count = 1;
        for (let i = 1; i <= s.length; i++) {
          if (i < s.length && s[i] === s[i - 1]) { count++; continue; }
          next += count + s[i - 1];
          count = 1;
        }
        out.push(next);
      }
      return out.slice(0, k).map(num);
    },
  };

  /* The true next term of a sequence question, after checking the shown terms. */
  function remarkSequence(c, out) {
    const rule = c.rule && SEQUENCE_RULES[c.rule.family];
    if (!rule) throw new Error("unknown sequence family \"" + (c.rule && c.rule.family) + "\"");
    if (!Array.isArray(c.terms) || c.terms.length < 3) throw new Error("a sequence needs at least three shown terms");
    const terms = rule(c.rule.params, c.terms.length + 1);
    c.terms.forEach((shown, i) => {
      if (!same(parseValue(shown), terms[i]))
        out.push(c.rule.family + ": term " + (i + 1) + " is shown as " + shown + " but the rule gives something else");
    });
    return terms[c.terms.length];
  }

  /* What a piece of generated HTML says, as the plain text a check record uses. */
  function plainOf(html) {
    return String(html)
      .replace(/<span class="frac"><span>(\d+)<\/span><span>(\d+)<\/span><\/span>/g, "$1/$2")
      .replace(/\u2212/g, "-")
      .replace(/\u202f/g, "")
      .replace(/(\d),(?=\d{3}(?!\d))/g, "$1");          // thousands commas
  }

  /* Everything wrong with one generated question, as a list of messages. */
  function checkGenerated(q, optionCount) {
    const out = [];
    try {
      if (!q || !q.id || !q.question || !q.category) return ["missing id, question or category"];
      if (!Array.isArray(q.options) || q.options.length !== optionCount)
        return ["has " + (q.options ? q.options.length : 0) + " options, format needs " + optionCount];
      if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= optionCount)
        return ["answer index out of range"];
      if (new Set(q.options).size !== optionCount) out.push("two options read the same");
      const c = q.check;
      if (!c || !Array.isArray(c.options) || c.options.length !== optionCount)
        return out.concat("no check record to re-mark it with");
      const series = c.kind === "sequence";
      const label = series ? "series " + (c.terms || []).join(", ") : c.expr;
      let right;
      if (series) { const truth = remarkSequence(c, out); right = v => same(v, truth); }
      else right = rightAnswer(c);
      const values = c.options.map(parseValue);
      if (!right(values[q.answer]))
        out.push(label + " is not " + c.options[q.answer] + ", the keyed option");
      if (values.filter(right).length !== 1)
        out.push(label + ": " + values.filter(right).length + " options are correct");
      if (!right(parseValue(c.value))) out.push(label + ": stated value " + c.value + " is wrong");
      // A sum must be shown as it is marked.
      if (!series) {
        const marked = c.expr + (c.kind === "percent" || c.expr.indexOf(" = ") !== -1 ? "" : " = ?");
        if (bare(q.question) !== bare(marked))
          out.push(label + ": the question shows " + plainOf(q.question).replace(/<[^>]+>/g, "") + " instead");
      }
      // The page shows HTML; make sure it says what the check record says.
      q.options.forEach((html, i) => {
        const plain = plainOf(html);
        if (plain !== c.options[i]) out.push("option " + (i + 1) + " shows " + plain + " but is marked as " + c.options[i]);
      });
      if (series) {
        const shown = [];
        plainOf(q.question).replace(/<span class="term">([^<]*)<\/span>/g, (m, term) => { shown.push(term); return m; });
        if (shown.join(" | ") !== c.terms.join(" | "))
          out.push(label + ": the question shows " + shown.join(", ") + " instead");
        if (c.options.some(o => c.terms.indexOf(o) !== -1)) out.push(label + ": an option repeats a shown term");
      }
    } catch (e) {
      out.push(e.message);
    }
    return out;
  }

  /* Make `papers` papers with a format's generator and re-mark every question. */
  function checkGenerator(generator, format, papers) {
    const issues = [];
    let sampled = 0;
    for (let p = 0; p < papers; p++) {
      const paper = generator.make(format.questionCount);
      if (paper.length !== format.questionCount)
        issues.push("made " + paper.length + " questions, format needs " + format.questionCount);
      if (new Set(paper.map(q => q.id)).size !== paper.length) issues.push("repeated a question id within a paper");
      for (const q of paper) {
        sampled++;
        for (const message of checkGenerated(q, format.optionCount))
          if (issues.length < 20) issues.push(message);
      }
    }
    return { sampled, issues };
  }

  /* ---- Whole-bank validation --------------------------------------------- */

  /* validate({ questions, formats, problems })
       questions  array of question objects
       formats    array of test formats (used for option-count and eligibility)
       problems   registry load problems, e.g. QBank.problems() — duplicates are
                  dropped at load, so the registry is the only place that sees
                  them
       generators optional array of generators (QGenerators.all()). Given, every
                  format that names one has `generatorPapers` papers (default 5)
                  made and re-marked                                            */
  function validate(input) {
    const questions = (input && input.questions) || [];
    const formats = (input && input.formats) || [];
    const problems = (input && input.problems) || [];

    // Generated formats draw nothing from the bank, so their option count says
    // nothing about which bank questions can appear in a paper.
    const optionCounts = [...new Set(formats.filter(f => !f.generator && !f.interview)
      .map(f => f.optionCount))].sort((a, b) => a - b);
    // Lets a question's interview.followUp be checked against the whole bank.
    const byId = new Map();
    for (const q of questions) if (q && q.id && !byId.has(q.id)) byId.set(q.id, q);
    const ctx = { optionCounts, byId };

    const issues = [];

    for (const p of problems)
      issues.push({
        severity: ERROR,
        id: p.id || "(bank)",
        field: p.kind,
        message: p.message,
      });

    // Duplicates within the array passed in. The registry drops them before
    // they reach here, so this catches the case where validate() is handed a
    // raw array instead.
    const seenIds = new Set();
    for (const q of questions) {
      if (!q || !q.id) continue;
      if (seenIds.has(q.id))
        issues.push({ severity: ERROR, id: q.id, field: "id", message: "duplicate id" });
      seenIds.add(q.id);
    }

    for (const q of questions) {
      if (!q || typeof q !== "object") {
        issues.push({ severity: ERROR, id: "(unknown)", field: "-", message: "not an object" });
        continue;
      }
      issues.push(...checkQuestion(q, ctx));
    }

    const generated = [];
    if (input && Array.isArray(input.generators)) {
      const papers = input.generatorPapers || 5;
      for (const f of formats) {
        if (!f.generator) continue;
        const g = input.generators.filter(x => x.id === f.generator)[0];
        if (!g) {
          issues.push({ severity: ERROR, id: f.id, field: "generator",
            message: "names the generator \"" + f.generator + "\", which is not loaded" });
          continue;
        }
        const r = checkGenerator(g, f, papers);
        generated.push({ format: f.id, generator: g.id, sampled: r.sampled, failures: r.issues.length });
        for (const message of r.issues)
          issues.push({ severity: ERROR, id: f.id, field: "generated", message });
      }
    }

    const summary = summarise(questions, formats, issues);
    summary.generated = generated;
    return { issues, summary };
  }

  function summarise(questions, formats, issues) {
    const byCategory = {};
    const byDifficulty = { 1: 0, 2: 0, 3: 0, unset: 0 };
    const tags = {};

    for (const q of questions) {
      if (!q || typeof q !== "object") continue;
      const cat = q.category || "(none)";
      byCategory[cat] = byCategory[cat] || { total: 0, mc: 0 };
      byCategory[cat].total++;
      if (Array.isArray(q.options) && q.options.length) byCategory[cat].mc++;

      const d = DIFFICULTIES.indexOf(q.difficulty) === -1 ? "unset" : q.difficulty;
      byDifficulty[d]++;

      if (Array.isArray(q.tags)) for (const t of q.tags) tags[t] = (tags[t] || 0) + 1;
    }

    const byId = new Map();
    for (const q of questions) if (q && q.id && !byId.has(q.id)) byId.set(q.id, q);

    const eligibility = formats.map(f => {
      // An interview format needs an opening problem for every block.
      if (f.interview) {
        const blocks = f.interview.blocks;
        const atLevel = level => questions.filter(q => isInterviewProblem(q, byId) && q.interview.level === level);
        const levels = [...new Set(blocks.map(b => b.level))];
        return { id: f.id, name: f.name, questionCount: blocks.length,
          eligible: levels.reduce((n, l) => n + atLevel(l).length, 0),
          shortBy: blocks.filter(b => !atLevel(b.level).length).length, interview: true };
      }
      // A generated format makes its own questions, so it is never short.
      if (f.generator)
        return { id: f.id, name: f.name, questionCount: f.questionCount,
          eligible: 0, shortBy: 0, generated: true };
      const eligible = questions.filter(q => isEligibleFor(q, f));
      return {
        id: f.id,
        name: f.name,
        questionCount: f.questionCount,
        eligible: eligible.length,
        shortBy: Math.max(0, f.questionCount - eligible.length),
      };
    });

    return {
      total: questions.length,
      multipleChoice: questions.filter(q => q && Array.isArray(q.options) && q.options.length).length,
      byCategory,
      byDifficulty,
      tags,
      eligibility,
      errors: issues.filter(i => i.severity === ERROR).length,
      warnings: issues.filter(i => i.severity === WARN).length,
    };
  }

  /* Kept in step with QBank.isInterviewProblem(), for the same reason as below. */
  function isInterviewProblem(q, byId) {
    if (!q || Array.isArray(q.options) || !q.interview || typeof q.interview !== "object") return false;
    if (DIFFICULTIES.indexOf(q.interview.level) === -1 || !q.shortAnswer) return false;
    const next = byId.get(q.interview.followUp);
    return !!next && !Array.isArray(next.options) && !!next.shortAnswer;
  }

  /* Kept in step with QBank.ineligibleReason(); duplicated here only so the
     validator can run against a raw array with no registry loaded. */
  function isEligibleFor(q, format) {
    if (!q) return false;
    if (Array.isArray(format.categories) && format.categories.indexOf(q.category) === -1) return false;
    if (Array.isArray(format.excludeCategories) && format.excludeCategories.indexOf(q.category) !== -1) return false;
    return Array.isArray(q.options) &&
      q.options.length === format.optionCount &&
      Number.isInteger(q.answer) &&
      q.answer >= 0 && q.answer < q.options.length;
  }

  return { validate, scanDelimiters, checkGenerated, checkGenerator, evalCheck,
    sequenceFamilies: () => Object.keys(SEQUENCE_RULES), ERROR, WARN };
})();

if (typeof module !== "undefined" && module.exports) module.exports = { QValidate };
