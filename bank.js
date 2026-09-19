/* ============================================================================
   REGISTRIES
   ----------------------------------------------------------------------------
   QBank    — the question bank. Every file in questions/ calls QBank.add([...]).
   QFormats — test formats. formats.js calls QFormats.add([...]).

   This file must load before either. There is no auto-discovery: file:// blocks
   fetch(), so a <script> tag in index.html is the only way to load a local file
   without a build step or a server.

   ----------------------------------------------------------------------------
   QUESTION SCHEMA

     id          required, unique string
     category    required
     difficulty  1 easy | 2 medium | 3 hard
     time        target seconds; the practice timer warns past this
     question    required; HTML, with LaTeX in $inline$ or $$display$$
     hint        optional
     solution    optional

   All of the following are OPTIONAL. A question without them is free-response
   and practice-only; it is silently skipped by test mode.

     options     array of strings, same HTML + LaTeX rules as the question text
     answer      0-based index into options, of the correct one
     tags        array of strings, e.g. ['linearity', 'bayes']. Finer-grained
                 than category, and filterable.
     source      which firm or assessment the question is modelled on

   Backslashes double inside backticks: \\frac, \\binom, \\sqrt.
   ========================================================================== */

const QBank = (function () {

  const questions = [];
  const byId = new Map();

  // Load-time complaints (duplicate ids, malformed entries). Collected rather
  // than thrown so one bad question never blanks the page; the bank view and
  // the validator both read this.
  const problems = [];

  let legacyAbsorbed = false;

  function problem(kind, message, id) {
    problems.push({ kind, message, id: id || null });
  }

  /* Add an array of question objects. Called once per bank file. */
  function add(list) {
    if (!Array.isArray(list)) {
      problem("bad-call", "QBank.add() expects an array, got " + typeof list);
      return;
    }
    for (const q of list) {
      if (!q || typeof q !== "object") {
        problem("bad-question", "Skipped an entry that is not an object");
        continue;
      }
      if (!q.id) {
        problem("missing-id", "Skipped a question with no id: " +
          String(q.question || "").slice(0, 60));
        continue;
      }
      if (byId.has(q.id)) {
        problem("duplicate-id", "Duplicate id, kept the first: " + q.id, q.id);
        continue;
      }
      byId.set(q.id, q);
      questions.push(q);
    }
  }

  /* Back-compatibility: a bank file written the old way declares a bare global
     `const QUESTIONS = [...]` instead of calling add(). Only one such file can
     exist (a second would be a redeclaration SyntaxError), but a single one
     still works. Absorbed lazily, after every script has run. */
  function absorbLegacyGlobal() {
    if (legacyAbsorbed) return;
    legacyAbsorbed = true;
    let legacy;
    try { legacy = QUESTIONS; } catch (e) { return; }   // not declared anywhere
    if (Array.isArray(legacy) && legacy.length) add(legacy);
  }

  function all() {
    absorbLegacyGlobal();
    return questions;
  }

  function get(id) {
    absorbLegacyGlobal();
    return byId.get(id) || null;
  }

  function has(id) {
    absorbLegacyGlobal();
    return byId.has(id);
  }

  function size() {
    return all().length;
  }

  function categories() {
    return [...new Set(all().map(q => q.category).filter(Boolean))].sort();
  }

  /* Every distinct tag in the bank, with how many questions carry it. */
  function tags() {
    const counts = new Map();
    for (const q of all())
      if (Array.isArray(q.tags))
        for (const t of q.tags) counts.set(t, (counts.get(t) || 0) + 1);
    return [...counts.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([tag, count]) => ({ tag, count }));
  }

  /* filter({ category, difficulty, tags, ids })
     Every criterion is optional and they combine with AND. `tags` requires ALL
     of the listed tags, which is what makes stacking them useful. */
  function filter(opts) {
    const o = opts || {};
    const wantTags = Array.isArray(o.tags) ? o.tags.filter(Boolean) : [];
    const wantIds = o.ids ? new Set(o.ids) : null;
    return all().filter(q => {
      if (o.category && q.category !== o.category) return false;
      if (o.difficulty && String(q.difficulty) !== String(o.difficulty)) return false;
      if (wantIds && !wantIds.has(q.id)) return false;
      if (wantTags.length) {
        if (!Array.isArray(q.tags)) return false;
        for (const t of wantTags) if (!q.tags.includes(t)) return false;
      }
      return true;
    });
  }

  /* ---- Multiple choice -------------------------------------------------- */

  function isMultipleChoice(q) {
    return !!q && Array.isArray(q.options) && q.options.length > 0;
  }

  /* Why a question cannot appear in a paper of this format, or null if it can.
     Shared by the test runner, the bank view and the validator, so all three
     agree on what "eligible" means. */
  function ineligibleReason(q, format) {
    if (!isMultipleChoice(q)) return "no options";
    if (q.options.length !== format.optionCount)
      return "has " + q.options.length + " options, format needs " + format.optionCount;
    if (typeof q.answer !== "number" || !Number.isInteger(q.answer))
      return "no integer answer index";
    if (q.answer < 0 || q.answer >= q.options.length)
      return "answer index " + q.answer + " is out of range";
    return null;
  }

  function isEligible(q, format) {
    return ineligibleReason(q, format) === null;
  }

  function eligible(format) {
    return all().filter(q => isEligible(q, format));
  }

  function getProblems() {
    absorbLegacyGlobal();
    return problems.slice();
  }

  return {
    add, all, get, has, size,
    categories, tags, filter,
    isMultipleChoice, isEligible, ineligibleReason, eligible,
    problems: getProblems,
  };
})();


const QFormats = (function () {

  const formats = [];
  const byId = new Map();
  const problems = [];

  const NAVIGATIONS = ["free", "linear"];

  function problem(message, id) {
    problems.push({ kind: "bad-format", message, id: id || null });
  }

  /* Reject a malformed format at load rather than letting the runner meet it
     later, when a missing optionCount would just silently match nothing. */
  function check(f) {
    if (!f || typeof f !== "object") return "not an object";
    if (!f.id) return "no id";
    if (byId.has(f.id)) return "duplicate id: " + f.id;
    if (!f.name) return "no name";
    if (!(f.questionCount > 0)) return "questionCount must be a positive number";
    if (!(f.timeLimitSec > 0)) return "timeLimitSec must be a positive number";
    if (!(f.optionCount >= 2)) return "optionCount must be at least 2";
    if (!f.marking || typeof f.marking !== "object") return "no marking object";
    for (const k of ["correct", "incorrect", "skipped"])
      if (typeof f.marking[k] !== "number") return "marking." + k + " must be a number";
    if (NAVIGATIONS.indexOf(f.navigation) === -1)
      return "navigation must be one of: " + NAVIGATIONS.join(", ");
    if (f.categoryWeights) {
      const sum = Object.values(f.categoryWeights).reduce((a, b) => a + b, 0);
      if (sum !== f.questionCount)
        return "categoryWeights sum to " + sum + ", need " + f.questionCount;
    }
    return null;
  }

  function add(list) {
    if (!Array.isArray(list)) {
      problem("QFormats.add() expects an array, got " + typeof list);
      return;
    }
    for (const f of list) {
      const bad = check(f);
      if (bad) { problem(bad, f && f.id); continue; }
      byId.set(f.id, f);
      formats.push(f);
    }
  }

  return {
    add,
    all: () => formats,
    get: id => byId.get(id) || null,
    problems: () => problems.slice(),
  };
})();


/* Node (validate.js) loads this file with require(); browsers ignore it. */
if (typeof module !== "undefined" && module.exports) module.exports = { QBank, QFormats };
