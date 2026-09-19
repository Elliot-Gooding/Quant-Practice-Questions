/* ============================================================================
   ATTEMPT TRACKING
   ----------------------------------------------------------------------------
   Everything the app remembers between sessions, in localStorage under one key.

     attempts   one record per question attempted, in time order
     tests      one record per completed test paper
     cursors    where sequential practice had got to, per filter
     prefs      last-used mode and filters

   localStorage on file:// is per-file and easy to lose (clearing site data, a
   different browser, moving the folder). Nothing here assumes it survives:
   every read is guarded, and if storage is unavailable the app runs on an
   in-memory copy with QStore.persistent === false so the UI can say so.

   Export early, export often — QStore.exportJSON().
   ========================================================================== */

const QStore = (function () {

  // Chrome shares localStorage across file:// pages, so tests.html sets
  // window.QSTORE_KEY before loading this file and works in its own sandbox
  // rather than destroying real practice history.
  const KEY = (typeof window !== "undefined" && window.QSTORE_KEY) || "quant-practice:v1";
  const SCHEMA = 1;

  // Attempts are tiny, but this runs for years on a 5MB budget. Oldest go first.
  const MAX_ATTEMPTS = 20000;

  const OUTCOMES = ["correct", "wrong", "skipped", "ungraded"];

  function blank() {
    return { schema: SCHEMA, attempts: [], tests: [], cursors: {}, prefs: {} };
  }

  let persistent = true;
  let data = load();

  function load() {
    let raw = null;
    try {
      raw = window.localStorage.getItem(KEY);
    } catch (e) {
      persistent = false;          // private window, blocked site data, etc.
      return blank();
    }
    if (!raw) return blank();
    try {
      return migrate(JSON.parse(raw));
    } catch (e) {
      // Corrupt payload. Keep a copy rather than silently destroying it: the
      // user may want to pick it apart by hand.
      try { window.localStorage.setItem(KEY + ":corrupt:" + Date.now(), raw); } catch (e2) {}
      return blank();
    }
  }

  /* Older payloads get filled in rather than discarded. */
  function migrate(d) {
    if (!d || typeof d !== "object") return blank();
    const out = blank();
    if (Array.isArray(d.attempts)) out.attempts = d.attempts.filter(isAttempt);
    if (Array.isArray(d.tests)) out.tests = d.tests.filter(t => t && t.id);
    if (d.cursors && typeof d.cursors === "object") out.cursors = d.cursors;
    if (d.prefs && typeof d.prefs === "object") out.prefs = d.prefs;
    return out;
  }

  function isAttempt(a) {
    return a && typeof a === "object" && typeof a.qid === "string" &&
      OUTCOMES.indexOf(a.outcome) !== -1;
  }

  function save() {
    if (data.attempts.length > MAX_ATTEMPTS)
      data.attempts = data.attempts.slice(-MAX_ATTEMPTS);
    try {
      window.localStorage.setItem(KEY, JSON.stringify(data));
      persistent = true;
    } catch (e) {
      persistent = false;          // quota exceeded, or storage blocked
    }
  }

  /* ---- Recording ---------------------------------------------------------- */

  /* recordAttempt({ qid, mode, outcome, answered, timeMs, hintUsed, solutionShown, testId })

       mode      'practice' | 'review' | 'test'
       outcome   'correct'  — multiple choice marked right, or self-graded right
                 'wrong'    — marked wrong, either way
                 'skipped'  — moved on without answering
                 'ungraded' — free-response where the solution was read but not
                              self-graded. Counts as seen, never as right or
                              wrong, so idly reading solutions cannot flatter
                              or damage the accuracy figures.
       answered  option index, or null
       timeMs    time on the question                                          */
  /* Timestamps are not unique — two attempts on the same question can land in
     the same millisecond — so every record carries its own id, which is what
     import de-duplicates on. */
  let seq = 0;
  function newId() {
    return Date.now().toString(36) + "-" + (seq++).toString(36) + "-" +
      Math.random().toString(36).slice(2, 6);
  }

  function recordAttempt(a) {
    const rec = {
      id: a.id || newId(),
      qid: String(a.qid),
      ts: a.ts || Date.now(),
      mode: a.mode || "practice",
      outcome: OUTCOMES.indexOf(a.outcome) === -1 ? "ungraded" : a.outcome,
      answered: typeof a.answered === "number" ? a.answered : null,
      timeMs: Math.max(0, Math.round(a.timeMs || 0)),
      hintUsed: !!a.hintUsed,
      solutionShown: !!a.solutionShown,
      testId: a.testId || null,
    };
    data.attempts.push(rec);
    save();
    return rec;
  }

  /* recordTest(run) — one completed paper. The per-question attempts are
     recorded separately by the runner, tagged with this run's testId. */
  function recordTest(run) {
    data.tests.push(run);
    save();
    return run;
  }

  /* ---- Reading ------------------------------------------------------------ */

  function attempts() { return data.attempts; }
  function tests() { return data.tests; }

  function attemptsFor(qid) {
    return data.attempts.filter(a => a.qid === qid);
  }

  function attemptedIds() {
    return new Set(data.attempts.map(a => a.qid));
  }

  function median(nums) {
    if (!nums.length) return null;
    const s = nums.slice().sort((a, b) => a - b);
    const mid = s.length >> 1;
    return s.length % 2 ? s[mid] : Math.round((s[mid - 1] + s[mid]) / 2);
  }

  /* Per-question history. `question` is optional; pass it to get the
     time-versus-target figures. */
  function questionStats(qid, question) {
    const list = attemptsFor(qid);
    if (!list.length) {
      return { qid, seen: 0, correct: 0, wrong: 0, skipped: 0, ungraded: 0,
        graded: 0, accuracy: null, medianTimeMs: null, lastTs: null,
        last: null, hintRate: null, targetMs: null, timeRatio: null };
    }
    const count = o => list.filter(a => a.outcome === o).length;
    const correct = count("correct");
    const wrong = count("wrong");
    const graded = correct + wrong;
    const medianTimeMs = median(list.map(a => a.timeMs).filter(t => t > 0));
    const targetMs = question && question.time ? question.time * 1000 : null;

    return {
      qid,
      seen: list.length,
      correct,
      wrong,
      skipped: count("skipped"),
      ungraded: count("ungraded"),
      graded,
      accuracy: graded ? correct / graded : null,
      medianTimeMs,
      lastTs: list[list.length - 1].ts,
      last: list[list.length - 1],
      hintRate: list.filter(a => a.hintUsed).length / list.length,
      targetMs,
      timeRatio: targetMs && medianTimeMs ? medianTimeMs / targetMs : null,
    };
  }

  /* Should this question come back round in review mode?

     Based on the most recent attempt only, so that fixing a question actually
     retires it — otherwise anything once got wrong would haunt the list. */
  function needsReview(question) {
    const list = attemptsFor(question.id);
    if (!list.length) return false;
    const last = list[list.length - 1];
    if (last.outcome === "wrong" || last.outcome === "skipped") return true;
    if (question.time && last.timeMs > question.time * 1000) return true;
    return false;
  }

  function reviewSet(questions) {
    return questions.filter(needsReview);
  }

  /* ---- Aggregates for the dashboard --------------------------------------- */

  function overallStats(questions) {
    const seenIds = attemptedIds();
    const stats = questions.map(q => ({ q, s: questionStats(q.id, q) }));
    const touched = stats.filter(x => x.s.seen > 0);

    const group = keyOf => {
      const buckets = {};
      for (const { q, s } of stats) {
        const key = keyOf(q);
        const b = buckets[key] || (buckets[key] = { total: 0, attempted: 0, correct: 0, graded: 0 });
        b.total++;
        if (s.seen) b.attempted++;
        b.correct += s.correct;
        b.graded += s.graded;
      }
      for (const b of Object.values(buckets))
        b.accuracy = b.graded ? b.correct / b.graded : null;
      return buckets;
    };

    const graded = touched.filter(x => x.s.graded > 0);

    return {
      bankSize: questions.length,
      attempted: questions.filter(q => seenIds.has(q.id)).length,
      totalAttempts: data.attempts.length,
      byCategory: group(q => q.category || "(none)"),
      byDifficulty: group(q => q.difficulty || "unset"),

      // Most reliably wrong: lowest accuracy first, then most-attempted, so a
      // question missed three times out of three outranks one missed once.
      weakest: graded
        .filter(x => x.s.accuracy !== null && x.s.accuracy < 1)
        .sort((a, b) => (a.s.accuracy - b.s.accuracy) || (b.s.graded - a.s.graded))
        .slice(0, 20),

      // Slowest relative to each question's own target time.
      slowest: touched
        .filter(x => x.s.timeRatio !== null && x.s.timeRatio > 1)
        .sort((a, b) => b.s.timeRatio - a.s.timeRatio)
        .slice(0, 20),

      reviewCount: reviewSet(questions).length,
    };
  }

  /* ---- Sequential cursors -------------------------------------------------- */

  /* One cursor per filter combination, so switching category and back does not
     lose your place in either. */
  function cursorKey(filters) {
    const f = filters || {};
    return [f.category || "*", f.difficulty || "*", (f.tags || []).slice().sort().join("+") || "*"].join("|");
  }

  function getCursor(filters) {
    return data.cursors[cursorKey(filters)] || 0;
  }

  function setCursor(filters, index) {
    data.cursors[cursorKey(filters)] = index;
    save();
  }

  /* ---- Preferences ---------------------------------------------------------- */

  function prefs() { return data.prefs; }

  function setPref(key, value) {
    data.prefs[key] = value;
    save();
  }

  /* ---- Export / import / reset ---------------------------------------------- */

  function exportJSON() {
    return JSON.stringify({
      schema: SCHEMA,
      exportedAt: new Date().toISOString(),
      attempts: data.attempts,
      tests: data.tests,
      cursors: data.cursors,
      prefs: data.prefs,
    }, null, 2);
  }

  /* importJSON(text, { merge })
       merge true   add to what is here, skipping records already present
       merge false  replace everything
     Returns { ok, added, skipped, error }. Never throws, and never touches the
     stored data unless the payload parses. */
  function importJSON(text, opts) {
    const merge = !opts || opts.merge !== false;
    let incoming;
    try {
      incoming = JSON.parse(text);
    } catch (e) {
      return { ok: false, error: "That is not valid JSON." };
    }
    if (!incoming || typeof incoming !== "object" || !Array.isArray(incoming.attempts))
      return { ok: false, error: "No attempts array — is this a practice export?" };

    const clean = migrate(incoming);

    if (!merge) {
      const added = clean.attempts.length;
      data = clean;
      save();
      return { ok: true, added, skipped: 0, replaced: true };
    }

    // Records written before attempt ids existed fall back to their contents.
    const fingerprint = a => a.id ||
      [a.qid, a.ts, a.outcome, a.timeMs, a.mode].join("|");
    const have = new Set(data.attempts.map(fingerprint));
    let added = 0, skipped = 0;
    for (const a of clean.attempts) {
      if (have.has(fingerprint(a))) { skipped++; continue; }
      have.add(fingerprint(a));
      data.attempts.push(a);
      added++;
    }
    data.attempts.sort((a, b) => a.ts - b.ts);

    const haveTests = new Set(data.tests.map(t => t.id));
    for (const t of clean.tests) if (!haveTests.has(t.id)) data.tests.push(t);

    Object.assign(data.cursors, clean.cursors);
    save();
    return { ok: true, added, skipped, replaced: false };
  }

  function reset() {
    data = blank();
    try { window.localStorage.removeItem(KEY); } catch (e) {}
    save();
  }

  return {
    recordAttempt, recordTest,
    attempts, tests, attemptsFor, attemptedIds,
    questionStats, needsReview, reviewSet, overallStats,
    getCursor, setCursor, cursorKey,
    prefs, setPref,
    exportJSON, importJSON, reset,
    get persistent() { return persistent; },
    OUTCOMES,
  };
})();

if (typeof module !== "undefined" && module.exports) module.exports = { QStore };
