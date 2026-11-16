/* ============================================================================
   TEST VIEW
   ----------------------------------------------------------------------------
   Sits a timed paper under one of the formats in formats.js. Nothing here knows
   which firm it is running: question count, time, option count, marking,
   navigation and flagging all come from the format object, so adding a firm is
   adding an object to that file.

   Four screens: start, running, review, results.

   A paper only ever contains questions with the right number of options and a
   valid answer index. Free-response questions are silently left out — there is
   no way to mark them under exam conditions.

   Two format fields change where the questions come from and how they are sat:

     generator   the paper is made fresh by a generator (gen-arithmetic.js)
                 instead of being drawn from the bank. Generated questions are
                 one-offs, so they are not written to the per-question history;
                 the paper itself still goes into the test history.
     mustAnswer  one question at a time, no skipping, no going back: choosing
                 an option is final and moves straight on.

   A format with an `interview` field is not a paper at all. It gets a panel on
   the start screen like the others, and starting it hands the tab over to
   view-interview.js until that mock is finished or abandoned.

   The run lives in memory. Navigating away asks first; reloading the page
   loses it.
   ========================================================================== */

QApp.register((function () {

  const KEYS = "12345678".split("");
  const LETTERS = "ABCDEFGH".split("");
  const WARN_AT = 0.2;          // countdown turns amber inside the last fifth

  // On a mustAnswer paper an answer is final and the next question appears under
  // the pointer at once, so the second half of a double-click (or a key held a
  // moment too long) would answer a question nobody has read. Anything arriving
  // this soon after a question is shown is ignored. tests.html turns it off.
  const MIN_ANSWER_MS = (typeof window !== "undefined" && window.QTEST_NO_ANSWER_GUARD) ? 0 : 250;

  let root = null;
  let screen = "start";         // start | running | review | results | interview
  let format = null;
  let run = null;               // the paper in progress, or the one just sat
  let enteredAt = null;         // when the current question was opened
  let ticker = null;

  /* ---- Mount --------------------------------------------------------------- */

  function mount(node) {
    root = node;
    if (screen === "running" || screen === "review") stopClock();
    // A finished mock interview shows its results again, like a finished paper.
    if (screen === "interview" && QInterview.resume(node)) return;
    // Coming back to the tab after finishing shows the results again; otherwise
    // start fresh.
    if (screen !== "results") screen = "start";
    render();
  }

  function unmount() {
    stopClock();
    if (screen === "interview") QInterview.unmount();
    root = null;
  }

  function canLeave() {
    if (screen === "interview")
      return QInterview.inProgress() ? "A mock interview is in progress. Leave and abandon it?" : null;
    if (screen !== "running" && screen !== "review") return null;
    return "A test is in progress. Leave and abandon it?";
  }

  /* Hand the tab to the mock interview until it gives it back. */
  function startInterview(fmt) {
    screen = "interview";
    if (!QInterview.start(fmt, root, () => { screen = "start"; render(); })) screen = "start";
  }

  /* The question behind a paper item. Generated questions live only in the run
     that made them; everything else is in the bank. */
  function questionOf(item) {
    return (run && run.byId && run.byId.get(item.qid)) || QBank.get(item.qid);
  }

  function generatorOf(fmt) {
    return fmt && fmt.generator ? QGenerators.get(fmt.generator) : null;
  }

  /* ---- Building a paper ------------------------------------------------------ */

  /* Draw a paper of `count` questions.

     Questions never attempted before come first: a paper should be sat on fresh
     material wherever there is any. Only once the unseen ones run out are the
     remaining slots filled at random from questions already met. Nothing can
     appear twice.

     "Seen" means an attempt was recorded — answered, self-graded, or read the
     solution to. Merely having had a question on screen does not count, which
     matches what the store records everywhere else. */
  function drawPaper(fmt, count) {
    const pool = QBank.eligible(fmt);
    const seenIds = QStore.attemptedIds();
    const taken = new Set();

    /* Up to `n` questions from `from`: unseen first, then seen, skipping
       anything this paper already holds. */
    function take(from, n) {
      if (n <= 0) return [];
      const unseen = [], seen = [];
      for (const q of from) {
        if (taken.has(q.id)) continue;
        (seenIds.has(q.id) ? seen : unseen).push(q);
      }
      const chosen = QApp.shuffle(unseen).slice(0, n);
      if (chosen.length < n)
        chosen.push(...QApp.shuffle(seen).slice(0, n - chosen.length));
      for (const q of chosen) taken.add(q.id);
      return chosen;
    }

    const picked = [];

    if (fmt.categoryWeights) {
      for (const cat of Object.keys(fmt.categoryWeights)) {
        // A shortened paper can ask for fewer questions than the weights sum
        // to, so never draw past what is still wanted.
        const room = count - picked.length;
        if (room <= 0) break;
        picked.push(...take(pool.filter(q => q.category === cat),
                            Math.min(fmt.categoryWeights[cat], room)));
      }
    }

    // Fill the rest: everything, with no weights, or whatever a category that
    // could not meet its quota left short.
    picked.push(...take(pool, count - picked.length));

    return QApp.shuffle(picked);
  }

  function startRun(fmt, count, timeLimitSec) {
    const generator = generatorOf(fmt);
    const questions = generator ? generator.make(count) : drawPaper(fmt, count);
    if (!questions.length) return;

    format = fmt;
    run = {
      id: "t" + Date.now().toString(36),
      formatId: fmt.id,
      formatName: fmt.name,
      startedAt: Date.now(),
      endedAt: null,
      timeLimitSec,
      questionCount: questions.length,
      generated: !!generator,
      byId: new Map(questions.map(q => [q.id, q])),
      cursor: 0,
      items: questions.map(q => ({
        qid: q.id,
        // Display order for this sitting, kept so the results screen shows the
        // paper exactly as it was sat.
        order: QApp.shuffle(q.options.map((_, i) => i)),
        answered: null,
        flagged: false,
        timeMs: 0,
      })),
    };

    screen = "running";
    enteredAt = Date.now();
    startClock();
    render();
  }

  /* ---- Clock ------------------------------------------------------------------ */

  function remainingSec() {
    if (!run) return 0;
    return Math.max(0, run.timeLimitSec - Math.floor((Date.now() - run.startedAt) / 1000));
  }

  function startClock() {
    stopClock();
    ticker = setInterval(() => {
      const node = root && root.querySelector("#countdown");
      if (node) paintClock(node);
      if (remainingSec() <= 0) submit(true);
    }, 250);
  }

  function stopClock() {
    if (ticker) clearInterval(ticker);
    ticker = null;
  }

  function paintClock(node) {
    const left = remainingSec();
    node.textContent = QApp.fmtClock(left);
    node.classList.toggle("warn", left > 0 && left <= run.timeLimitSec * WARN_AT);
    node.classList.toggle("over", left <= 0);
  }

  /* ---- Question navigation ------------------------------------------------------ */

  function leaveQuestion() {
    if (enteredAt === null || !run) return;
    run.items[run.cursor].timeMs += Date.now() - enteredAt;
    enteredAt = null;
  }

  function goTo(i) {
    if (!run || i < 0 || i >= run.items.length) return;
    if (format.mustAnswer) return;                // only an answer moves you on
    if (format.navigation === "linear" && i < run.cursor) return;   // forward only
    leaveQuestion();
    run.cursor = i;
    enteredAt = Date.now();
    render();
  }

  function answer(slot) {
    if (!run || screen !== "running") return;
    const item = run.items[run.cursor];
    if (slot < 0 || slot >= item.order.length) return;
    if (format.mustAnswer && enteredAt !== null && Date.now() - enteredAt < MIN_ANSWER_MS) return;
    item.answered = item.order[slot];
    if (format.mustAnswer) return lockAndAdvance();
    render();
  }

  /* mustAnswer papers: the answer just given is final. Move to the next
     question, or hand the paper in if that was the last one. */
  function lockAndAdvance() {
    leaveQuestion();
    if (run.cursor === run.items.length - 1) return submit(false);
    run.cursor++;
    enteredAt = Date.now();
    render();
  }

  function clearAnswer() {
    if (!run || screen !== "running" || format.mustAnswer) return;
    run.items[run.cursor].answered = null;
    render();
  }

  function toggleFlag() {
    if (!run || !format.allowFlagging) return;
    run.items[run.cursor].flagged = !run.items[run.cursor].flagged;
    render();
  }

  /* ---- Marking -------------------------------------------------------------------- */

  function outcomeOf(item) {
    const q = questionOf(item);
    if (item.answered === null) return "skipped";
    return item.answered === q.answer ? "correct" : "wrong";
  }

  function markRun() {
    const m = format.marking;
    let score = 0;
    const counts = { correct: 0, wrong: 0, skipped: 0 };
    for (const item of run.items) {
      const outcome = outcomeOf(item);
      counts[outcome]++;
      score += outcome === "correct" ? m.correct
             : outcome === "wrong" ? m.incorrect
             : m.skipped;
    }
    return { score, counts, max: run.items.length * m.correct };
  }

  /* What a question counts as in the results breakdown. */
  function kindOf(q) {
    return (q && (q.breakdown || q.category)) || "(none)";
  }

  function submit(auto) {
    if (!run || (screen !== "running" && screen !== "review")) return;
    leaveQuestion();
    stopClock();

    run.endedAt = Date.now();
    run.autoSubmitted = !!auto;
    const marked = markRun();
    run.score = marked.score;
    run.max = marked.max;
    run.counts = marked.counts;

    // One attempt per question, tagged with this run, so test performance feeds
    // the same stats and review set as practice.
    // A generated question is never seen again, so a per-question record of it
    // would only crowd real history out of the store. The paper as a whole is
    // still recorded below.
    if (!run.generated) for (const item of run.items)
      QStore.recordAttempt({
        qid: item.qid,
        mode: "test",
        outcome: outcomeOf(item),
        answered: item.answered,
        timeMs: item.timeMs,
        hintUsed: false,
        solutionShown: false,
        testId: run.id,
      });

    QStore.recordTest({
      id: run.id,
      formatId: run.formatId,
      formatName: run.formatName,
      startedAt: run.startedAt,
      endedAt: run.endedAt,
      timeLimitSec: run.timeLimitSec,
      questionCount: run.questionCount,
      score: run.score,
      max: run.max,
      counts: run.counts,
      autoSubmitted: run.autoSubmitted,
      generated: run.generated,
      items: run.items.map(i => ({
        qid: i.qid, answered: i.answered, outcome: outcomeOf(i),
        timeMs: i.timeMs, flagged: i.flagged, kind: kindOf(questionOf(i)),
      })),
    });

    screen = "results";
    render();
  }

  /* ---- Rendering ------------------------------------------------------------------- */

  function render() {
    if (!root) return;
    if (screen === "start") return renderStart();
    if (screen === "running") return renderRunning();
    if (screen === "review") return renderReview();
    if (screen === "results") return renderResults();
  }

  /* -- start -- */

  function renderStart() {
    const formats = QFormats.all();
    if (!formats.length) {
      root.innerHTML = `<div class="panel"><p class="empty">No test formats defined. Add one to <code>formats.js</code>.</p></div>`;
      QApp.setStatus("");
      return;
    }

    const attempted = QStore.attemptedIds();

    const rows = formats.map(f => {
      if (f.interview) return QInterview.row(f);
      if (f.generator) return generatedRow(f);
      const pool = QBank.eligible(f);
      const eligible = pool.length;
      const fresh = pool.filter(q => !attempted.has(q.id)).length;
      const short = Math.max(0, f.questionCount - eligible);
      const m = f.marking;
      return `
        <div class="panel">
          <div class="meta"><span>${f.name}</span><span class="timer">${Math.round(f.timeLimitSec / 60)} min</span></div>
          <p class="subtle">
            ${f.questionCount} questions &middot; ${f.optionCount} options each &middot;
            ${m.correct > 0 ? "+" + m.correct : m.correct} correct,
            ${m.incorrect} wrong, ${m.skipped} skipped &middot;
            ${navigationText(f)}${f.allowFlagging ? " &middot; flagging" : ""}
          </p>
          ${f.note ? `<p class="subtle">${f.note}</p>` : ""}
          <p class="subtle">${eligible} of ${QBank.size()} questions in the bank are eligible${
            short ? ` — <span class="warnc">${short} short of a full paper</span>` : ""}.${
            eligible ? ` ${fresh === 0
              ? "You have attempted all of them; this paper will repeat."
              : fresh + " not attempted yet, and a paper takes those first."}` : ""}</p>
          <nav class="actions">
            ${eligible >= f.questionCount
              ? `<button class="primary" data-start="${f.id}">Start ${f.name.split(" — ")[0]}</button>`
              : eligible > 0
                ? `<button data-short="${f.id}">Start a shortened paper (${eligible} questions, ${
                    Math.max(1, Math.round(f.timeLimitSec * eligible / f.questionCount / 60))} min)</button>`
                : `<button disabled>Not enough questions yet</button>`}
          </nav>
        </div>`;
    }).join("");

    root.innerHTML = rows;

    for (const button of root.querySelectorAll("[data-interview]"))
      button.addEventListener("click", () => startInterview(QFormats.get(button.dataset.interview)));

    for (const button of root.querySelectorAll("[data-generate]"))
      button.addEventListener("click", () => {
        const f = QFormats.get(button.dataset.generate);
        startRun(f, f.questionCount, f.timeLimitSec);
      });

    for (const button of root.querySelectorAll("[data-start]"))
      button.addEventListener("click", () => {
        const f = QFormats.get(button.dataset.start);
        startRun(f, f.questionCount, f.timeLimitSec);
      });

    for (const button of root.querySelectorAll("[data-short]"))
      button.addEventListener("click", () => {
        const f = QFormats.get(button.dataset.short);
        const n = QBank.eligible(f).length;
        startRun(f, n, Math.max(60, Math.round(f.timeLimitSec * n / f.questionCount)));
      });

    QApp.renderMath(root);
    QApp.setStatus("A paper only uses questions with exactly the right number of options. " +
      "The Bank tab shows which questions still need them.");
  }

  function navigationText(f) {
    if (f.mustAnswer) return "one at a time, no skipping or going back";
    return f.navigation === "free" ? "free navigation" : "forward only";
  }

  /* Start-screen panel for a format whose paper is generated, not drawn. */
  function generatedRow(f) {
    const m = f.marking;
    const ready = !!generatorOf(f);
    return `
      <div class="panel">
        <div class="meta"><span>${f.name}</span><span class="timer">${Math.round(f.timeLimitSec / 60)} min</span></div>
        <p class="subtle">
          ${f.questionCount} questions &middot; ${f.optionCount} options each &middot;
          ${m.correct > 0 ? "+" + m.correct : m.correct} correct,
          ${m.incorrect} wrong, ${m.skipped} ${f.mustAnswer ? "not reached" : "skipped"} &middot;
          ${navigationText(f)}${f.allowFlagging ? " &middot; flagging" : ""}
        </p>
        ${f.note ? `<p class="subtle">${f.note}</p>` : ""}
        <p class="subtle">${ready
          ? "Every sitting is a new paper, generated on the spot — nothing is drawn from the bank, so it never repeats and never runs out."
          : `<span class="warnc">The generator "${QApp.escapeHtml(f.generator)}" is not loaded — check the script tags in index.html.</span>`}</p>
        <nav class="actions">
          ${ready
            ? `<button class="primary" data-generate="${f.id}">Start ${f.name.split(" — ")[0]}</button>`
            : `<button disabled>Generator missing</button>`}
        </nav>
      </div>`;
  }

  /* -- running -- */

  function renderRunning() {
    const item = run.items[run.cursor];
    const q = questionOf(item);
    const locked = !!format.mustAnswer;

    root.innerHTML = `
      <div class="controls">
        <span>${format.name}</span>
        <span class="spacer"></span>
        <span>Question ${run.cursor + 1} of ${run.items.length}</span>
        <span id="countdown" class="timer"></span>
      </div>

      <div class="panel${locked ? " sprint" : ""}">
        <div class="meta">
          <span>${q.category}${q.difficulty ? " · " + QApp.difficultyName(q.difficulty) : ""}</span>
          <span>${item.flagged ? '<span class="warnc">flagged</span>' : ""}</span>
        </div>
        <div id="qtext">${q.question}</div>
        <ul class="options" id="options">
          ${item.order.map((orig, slot) => `
            <li><button class="option" data-slot="${slot}" aria-pressed="${item.answered === orig}">
              <span class="key">${KEYS[slot]}</span>
              <span class="text">${q.options[orig]}</span>
            </button></li>`).join("")}
        </ul>
      </div>

      ${locked ? `<nav class="actions">
        <button id="finish" class="right">End the test now</button>
      </nav>` : `<nav class="actions">
        ${format.navigation === "free" ? `<button id="prev" ${run.cursor === 0 ? "disabled" : ""}>Previous</button>` : ""}
        <button id="clear" ${item.answered === null ? "disabled" : ""}>Clear</button>
        ${format.allowFlagging ? `<button id="flag">${item.flagged ? "Unflag" : "Flag"}</button>` : ""}
        <button id="next" class="right" ${run.cursor === run.items.length - 1 ? "disabled" : ""}>Next</button>
        <button id="finish" class="primary">${format.navigation === "free" ? "Review and submit" : "Submit"}</button>
      </nav>`}

      ${format.navigation === "free" ? `<div class="palette" id="palette"></div>
        <div class="legend">
          <span>filled = answered</span>
          ${format.allowFlagging ? "<span>dot = flagged</span>" : ""}
          <span>outlined = where you are</span>
        </div>` : ""}`;

    QApp.renderMath(root.querySelector("#qtext"));
    QApp.renderMath(root.querySelector("#options"));
    paintClock(root.querySelector("#countdown"));

    for (const button of root.querySelectorAll(".option"))
      button.addEventListener("click", () => answer(Number(button.dataset.slot)));

    const on = (id, fn) => { const n = root.querySelector("#" + id); if (n) n.addEventListener("click", fn); };
    on("prev", () => goTo(run.cursor - 1));
    on("next", () => goTo(run.cursor + 1));
    on("clear", clearAnswer);
    on("flag", toggleFlag);
    on("finish", () => {
      if (format.navigation === "free") { leaveQuestion(); screen = "review"; render(); }
      else if (confirmSubmit()) submit(false);
    });

    if (format.navigation === "free") renderPalette(root.querySelector("#palette"));

    const answered = run.items.filter(i => i.answered !== null).length;
    if (locked) {
      QApp.setStatus(
        `${answered} answered, ${run.items.length - answered} to go. An answer is final and moves you on.<br>` +
        `Keys: <kbd>1</kbd>–<kbd>${KEYS[format.optionCount - 1]}</kbd> answer.`);
      return;
    }
    QApp.setStatus(
      `${answered} answered, ${run.items.length - answered} left.<br>` +
      `Keys: <kbd>1</kbd>–<kbd>${KEYS[format.optionCount - 1]}</kbd> answer, <kbd>0</kbd> clear, ` +
      (format.allowFlagging ? "<kbd>f</kbd> flag, " : "") +
      (format.navigation === "free" ? "<kbd>&larr;</kbd><kbd>&rarr;</kbd> move, " : "<kbd>n</kbd> next, ") +
      `<kbd>r</kbd> ${format.navigation === "free" ? "review" : "submit"}.`);
  }

  function renderPalette(node) {
    if (!node) return;
    node.innerHTML = run.items.map((item, i) => {
      const classes = [
        item.answered !== null ? "answered" : "",
        item.flagged ? "flagged" : "",
        i === run.cursor ? "current" : "",
      ].filter(Boolean).join(" ");
      return `<button class="${classes}" data-go="${i}" aria-label="Question ${i + 1}${
        item.answered !== null ? ", answered" : ""}${item.flagged ? ", flagged" : ""}">${i + 1}</button>`;
    }).join("");
    for (const button of node.querySelectorAll("[data-go]"))
      button.addEventListener("click", () => goTo(Number(button.dataset.go)));
  }

  /* -- review -- */

  function renderReview() {
    const answered = run.items.filter(i => i.answered !== null).length;
    const skipped = run.items.length - answered;
    const flagged = run.items.filter(i => i.flagged).length;
    const m = format.marking;

    root.innerHTML = `
      <div class="controls">
        <span>${format.name} — review</span>
        <span class="spacer"></span>
        <span id="countdown" class="timer"></span>
      </div>

      <div class="panel">
        <h2>Before you submit</h2>
        <p class="subtle">
          ${answered} answered &middot; ${skipped} skipped${flagged ? ` &middot; ${flagged} flagged` : ""}.
          ${m.incorrect < 0
            ? `A wrong answer scores ${m.incorrect}, a skip scores ${m.skipped} — leave it blank unless you can beat a guess.`
            : `There is no penalty for a wrong answer, so do not leave anything blank.`}
        </p>
        <div class="palette" id="palette"></div>
        <div class="legend">
          <span>filled = answered</span>
          ${format.allowFlagging ? "<span>dot = flagged</span>" : ""}
          <span>click a number to go back to it</span>
        </div>
      </div>

      <nav class="actions">
        <button id="back">Back to the paper</button>
        <button id="submit" class="primary right">Submit</button>
      </nav>`;

    paintClock(root.querySelector("#countdown"));
    renderPalette(root.querySelector("#palette"));
    root.querySelector("#back").addEventListener("click", () => {
      screen = "running"; enteredAt = Date.now(); render();
    });
    root.querySelector("#submit").addEventListener("click", () => { if (confirmSubmit()) submit(false); });

    QApp.setStatus(`Keys: <kbd>b</kbd> back to the paper, <kbd>Enter</kbd> submit.`);
  }

  function confirmSubmit() {
    const skipped = run.items.filter(i => i.answered === null).length;
    if (!skipped) return true;
    if (format.mustAnswer)
      return window.confirm("End the test with " + skipped + " question(s) not reached? They score " +
        format.marking.skipped + ".");
    return window.confirm(skipped + " question(s) unanswered. Submit anyway?");
  }

  /* -- results -- */

  function renderResults() {
    const minutes = Math.round((run.endedAt - run.startedAt) / 6000) / 10;
    const locked = !!format.mustAnswer;
    const blank = locked ? "not reached" : "skipped";

    // On a mustAnswer paper everything after the last answer was never seen,
    // so listing it would bury the questions that were.
    const listed = run.items.map((item, i) => ({ item, i }))
      .filter(x => !locked || x.item.answered !== null);

    const rows = listed.map(({ item, i }) => {
      const q = questionOf(item);
      const outcome = outcomeOf(item);
      const yours = item.answered === null ? "—" : LETTERS[item.order.indexOf(item.answered)];
      const right = LETTERS[item.order.indexOf(q.answer)];
      const over = q.time && item.timeMs > q.time * 1000;
      return `
        <tr>
          <td class="num">${i + 1}</td>
          <td class="${outcome === "correct" ? "good" : outcome === "wrong" ? "bad" : "subtle"}">${outcome}</td>
          <td class="num">${yours}</td>
          <td class="num">${right}</td>
          <td class="num ${over ? "warnc" : ""}">${QApp.fmtMs(item.timeMs)}</td>
          <td class="subtle">${q.time ? QApp.fmtClock(q.time) : "—"}</td>
        </tr>
        <tr><td></td><td colspan="5">
          <details data-q="${i}">
            <summary class="subtle">${kindOf(q)} — show the question and solution</summary>
            <div class="detail">
              <div class="qtext">${q.question}</div>
              <ul class="options">${item.order.map((orig, slot) => `
                <li><button class="option ${orig === q.answer ? "correct" : orig === item.answered ? "wrong" : "muted"}" disabled>
                  <span class="key">${LETTERS[slot]}</span><span class="text">${q.options[orig]}</span>
                </button></li>`).join("")}</ul>
              ${q.solution ? `<div class="reveal open"><div class="label">Solution</div><div>${q.solution}</div></div>` : ""}
            </div>
          </details>
        </td></tr>`;
    }).join("");

    root.innerHTML = `
      <div class="panel">
        <div class="meta">
          <span>${run.formatName}</span>
          <span>${minutes} min${run.autoSubmitted ? " · time expired" : ""}</span>
        </div>
        <h2>${run.score} out of ${run.max}</h2>
        <p class="subtle">
          <span class="good">${run.counts.correct} correct</span> &middot;
          <span class="bad">${run.counts.wrong} wrong</span> &middot;
          ${run.counts.skipped} ${blank}${format.marking.incorrect < 0
            ? ` &middot; wrong answers cost ${Math.abs(format.marking.incorrect * run.counts.wrong)}`
            : ""}
        </p>
        ${paceLine()}
      </div>

      ${breakdownPanel()}

      <div class="panel">
        <table>
          <thead><tr>
            <th class="num">#</th><th>result</th><th class="num">you</th>
            <th class="num">answer</th><th class="num">time</th><th>target</th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>
        ${locked && listed.length < run.items.length
          ? `<p class="subtle">${run.items.length - listed.length} question(s) not reached are not listed.</p>` : ""}
      </div>

      <nav class="actions">
        <button id="again" class="primary">Sit another</button>
        ${QApp.views().some(v => v.name === "stats")
          ? `<button id="stats" class="right">See the dashboard</button>` : ""}
      </nav>`;

    // Only render the maths that is on screen; a details block renders when it
    // is first opened, which keeps an 18-question results page quick.
    for (const details of root.querySelectorAll("details"))
      details.addEventListener("toggle", () => {
        if (details.open && !details.dataset.rendered) {
          details.dataset.rendered = "1";
          QApp.renderMath(details);
        }
      });

    root.querySelector("#again").addEventListener("click", () => { screen = "start"; render(); });
    const toStats = root.querySelector("#stats");
    if (toStats) toStats.addEventListener("click", () => QApp.go("stats"));

    QApp.setStatus(run.generated
      ? "This paper is in your test history on the Stats tab. Its questions were generated " +
        "for this sitting only, so they are not added to your question history."
      : "Every question here has been added to your history, so the ones you " +
        "missed will come round again in review mode.");
  }

  /* How fast the answered questions went, and what share of the marks that is. */
  function paceLine() {
    const done = run.items.filter(i => i.answered !== null);
    if (!done.length) return "";
    const avg = done.reduce((t, i) => t + i.timeMs, 0) / done.length / 1000;
    const allowed = run.timeLimitSec / run.items.length;
    return `<p class="subtle">
      ${done.length} of ${run.items.length} answered &middot;
      ${avg.toFixed(1)}s per answer (the paper allows ${allowed.toFixed(1)}s) &middot;
      ${Math.round(100 * run.counts.correct / done.length)}% of answers right &middot;
      ${Math.round(100 * Math.max(0, run.score) / run.max)}% of the marks
    </p>`;
  }

  /* Results by kind of question, so the weak spot is a line in a table rather
     than an impression. Only shown when the paper mixes more than one kind. */
  function breakdownPanel() {
    const groups = new Map();
    for (const item of run.items) {
      if (item.answered === null) continue;
      const kind = kindOf(questionOf(item));
      const g = groups.get(kind) || { n: 0, correct: 0, wrong: 0, ms: 0 };
      g.n++;
      g[outcomeOf(item) === "correct" ? "correct" : "wrong"]++;
      g.ms += item.timeMs;
      groups.set(kind, g);
    }
    if (groups.size < 2) return "";
    const m = format.marking;
    const body = [...groups.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([kind, g]) => `
      <tr>
        <td>${kind}</td>
        <td class="num">${g.n}</td>
        <td class="num good">${g.correct}</td>
        <td class="num ${g.wrong ? "bad" : "subtle"}">${g.wrong}</td>
        <td class="num">${g.correct * m.correct + g.wrong * m.incorrect}</td>
        <td class="num">${(g.ms / g.n / 1000).toFixed(1)}s</td>
      </tr>`).join("");
    return `
      <div class="panel">
        <h2>Where the marks went</h2>
        <table>
          <thead><tr>
            <th>kind</th><th class="num">answered</th><th class="num">right</th>
            <th class="num">wrong</th><th class="num">net</th><th class="num">avg time</th>
          </tr></thead>
          <tbody>${body}</tbody>
        </table>
      </div>`;
  }

  /* ---- Keyboard --------------------------------------------------------------------- */

  function onKey(e) {
    if (screen === "interview") return QInterview.onKey(e);
    if (screen === "review") {
      if (e.key === "b") { screen = "running"; enteredAt = Date.now(); render(); return true; }
      if (e.key === "Enter") { if (confirmSubmit()) submit(false); return true; }
      return false;
    }
    if (screen !== "running") return false;

    const slot = KEYS.indexOf(e.key);
    if (slot !== -1 && slot < format.optionCount) {
      if (!(format.mustAnswer && e.repeat)) answer(slot);
      return true;
    }

    // Nothing but an answer moves a mustAnswer paper on, so the navigation
    // keys below must not reach it.
    if (format.mustAnswer) return false;

    switch (e.key) {
      case "0": case "Backspace": clearAnswer(); return true;
      case "f": toggleFlag(); return true;
      case "n": case "ArrowRight": goTo(run.cursor + 1); return true;
      case "p": case "ArrowLeft": goTo(run.cursor - 1); return true;
      case "r":
        if (format.navigation === "free") { leaveQuestion(); screen = "review"; render(); }
        else if (confirmSubmit()) submit(false);
        return true;
    }
    return false;
  }

  return { name: "test", title: "Test", wide: true, mount, unmount, onKey, canLeave };
})());
