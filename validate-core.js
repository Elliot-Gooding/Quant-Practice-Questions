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

    /* -- LaTeX delimiters -- */

    const textFields = [["question", q.question], ["hint", q.hint], ["solution", q.solution]];
    if (Array.isArray(q.options))
      q.options.forEach((opt, i) => textFields.push(["option " + (i + 1), opt]));

    for (const [field, text] of textFields) {
      if (typeof text !== "string" || text.indexOf("$") === -1) continue;
      const { dangling, suspicious } = scanDelimiters(text);
      if (dangling) at(ERROR, field, dangling);
      for (const span of suspicious)
        at(WARN, field, "a $...$ span looks too long to be maths: \"" + span + "...\"");
    }

    return issues;
  }

  /* ---- Whole-bank validation --------------------------------------------- */

  /* validate({ questions, formats, problems })
       questions  array of question objects
       formats    array of test formats (used for option-count and eligibility)
       problems   registry load problems, e.g. QBank.problems() — duplicates are
                  dropped at load, so the registry is the only place that sees
                  them                                                          */
  function validate(input) {
    const questions = (input && input.questions) || [];
    const formats = (input && input.formats) || [];
    const problems = (input && input.problems) || [];

    const optionCounts = [...new Set(formats.map(f => f.optionCount))].sort((a, b) => a - b);
    const ctx = { optionCounts };

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

    return { issues, summary: summarise(questions, formats, issues) };
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

    const eligibility = formats.map(f => {
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

  /* Kept in step with QBank.ineligibleReason(); duplicated here only so the
     validator can run against a raw array with no registry loaded. */
  function isEligibleFor(q, format) {
    return !!q && Array.isArray(q.options) &&
      q.options.length === format.optionCount &&
      Number.isInteger(q.answer) &&
      q.answer >= 0 && q.answer < q.options.length;
  }

  return { validate, scanDelimiters, ERROR, WARN };
})();

if (typeof module !== "undefined" && module.exports) module.exports = { QValidate };
