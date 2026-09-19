/* ============================================================================
   QUESTION REGISTRY
   ----------------------------------------------------------------------------
   Every file in questions/ calls QBank.add([...]) with an array of question
   objects. This file must load before any of them.

   To add a bank file: drop it in questions/ and add one <script> tag to
   index.html. There is no auto-discovery — file:// blocks fetch(), so a script
   tag is the only way to load local JS without a build step or a server.
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

  function getProblems() {
    absorbLegacyGlobal();
    return problems.slice();
  }

  return { add, all, get, has, size, categories, problems: getProblems };
})();

/* Node (validate.js) loads this file with require(); browsers ignore it. */
if (typeof module !== "undefined" && module.exports) module.exports = { QBank };
