/* ============================================================================
   PRACTICE VIEW
   ----------------------------------------------------------------------------
   Three ways through the bank:

     random      as before — draws from the filtered pool without repeating
                 until the pool is exhausted
     sequential  walks the filtered set in order and remembers where you were,
                 per filter combination, so you can stop and resume
     review      only questions whose last attempt was wrong, was skipped, or
                 went over the target time

   Multiple-choice questions are answered inline and graded on the spot.
   Free-response questions are self-graded when you reveal the solution:
   nothing else can know whether you got it.

   WHAT COUNTS AS AN ATTEMPT
   Answering, self-grading, or reading the solution. Simply pressing next
   records nothing — otherwise browsing the bank would fill review mode with
   questions you never actually tried.
   ========================================================================== */

QApp.register((function () {

  const WARN_AT = 0.8;          // timer turns amber at 80% of the target
  const KEYS = "12345678".split("");

  let el = {};
  let mode = "random";
  let seen = new Set();         // shown this pass in random mode
  let current = null;
  let order = [];               // the pool, in the order sequential walks it
  let index = 0;                // position in `order`, sequential mode

  // The attempt in progress. Flushed to the store when we move on.
  let attempt = null;

  let timerStart = null, timerInterval = null, timerStopped = false;

  /* ---- Markup -------------------------------------------------------------- */

  function mount(root) {
    mode = QStore.prefs().mode || "random";

    root.innerHTML = `
      <div class="controls">
        <select id="mode" aria-label="Practice mode">
          <option value="random">random</option>
          <option value="sequential">in order</option>
          <option value="review">review mistakes</option>
        </select>
        <select id="category" aria-label="Category"></select>
        <select id="difficulty" aria-label="Difficulty">
          <option value="">any difficulty</option>
          <option value="1">easy</option>
          <option value="2">medium</option>
          <option value="3">hard</option>
        </select>
        <select id="tag" aria-label="Tag" hidden></select>
      </div>

      <div class="panel">
        <div id="question"></div>
        <ul class="options" id="options" hidden></ul>

        <section id="hint" class="reveal">
          <div class="label">Hint</div>
          <div class="body"></div>
        </section>

        <section id="solution" class="reveal">
          <div class="label">Solution</div>
          <div class="body"></div>
        </section>

        <div class="selfgrade" id="selfgrade" hidden></div>
      </div>

      <nav class="actions">
        <button id="prev-btn" hidden>Previous</button>
        <button id="hint-btn">Show hint</button>
        <button id="solution-btn">Show solution</button>
        <button id="next-btn" class="primary right">Next question</button>
      </nav>`;

    el = {};
    for (const id of ["mode", "category", "difficulty", "tag", "question", "options",
                      "hint", "solution", "selfgrade", "prev-btn", "hint-btn",
                      "solution-btn", "next-btn"])
      el[id] = root.querySelector("#" + id);

    buildFilters();

    const prefs = QStore.prefs();
    el.mode.value = mode;
    el.category.value = prefs.category || "";
    el.difficulty.value = prefs.difficulty || "";
    if (prefs.tag) el.tag.value = prefs.tag;

    el.mode.addEventListener("change", () => {
      mode = el.mode.value;
      QStore.setPref("mode", mode);
      restart();
    });
    for (const key of ["category", "difficulty", "tag"])
      el[key].addEventListener("change", () => {
        QStore.setPref(key, el[key].value);
        restart();
      });

    el["next-btn"].addEventListener("click", next);
    el["prev-btn"].addEventListener("click", prev);
    el["hint-btn"].addEventListener("click", showHint);
    el["solution-btn"].addEventListener("click", () => revealSolution(true));

    restart();
  }

  function unmount() {
    flush();
    stopTimer();
    el = {};
    current = null;
  }

  function buildFilters() {
    el.category.innerHTML = `<option value="">any category</option>` +
      QBank.categories().map(c => `<option value="${c}">${c}</option>`).join("");

    const tags = QBank.tags();
    el.tag.hidden = tags.length === 0;
    el.tag.innerHTML = `<option value="">any tag</option>` +
      tags.map(t => `<option value="${t.tag}">${t.tag} (${t.count})</option>`).join("");
  }

  /* ---- Pool and ordering ---------------------------------------------------- */

  function filters() {
    return {
      category: el.category.value,
      difficulty: el.difficulty.value,
      tags: el.tag.value ? [el.tag.value] : [],
    };
  }

  function pool() {
    const base = QBank.filter(filters());
    return mode === "review" ? QStore.reviewSet(base) : base;
  }

  /* Rebuild the pool and show something. Called on mount and whenever a filter
     or the mode changes. */
  function restart() {
    flush();
    seen = new Set();
    order = pool();

    if (mode === "sequential") {
      index = Math.min(QStore.getCursor(filters()), Math.max(0, order.length - 1));
      el["prev-btn"].hidden = false;
      el["next-btn"].textContent = "Next";
      showAt(index);
    } else {
      el["prev-btn"].hidden = true;
      el["next-btn"].textContent = "Next question";
      next();
    }
  }

  /* ---- Timer ---------------------------------------------------------------- */

  function timerNode() {
    return el.question && el.question.querySelector("#timer");
  }

  function renderTimer() {
    const node = timerNode();
    if (!node || !current || timerStart === null) return;
    const elapsed = Math.floor((Date.now() - timerStart) / 1000);
    const target = current.time;
    node.innerHTML = `<span class="elapsed">${QApp.fmtClock(elapsed)}</span>` +
      (target ? `<span class="target"> / ${QApp.fmtClock(target)}</span>` : "");
    node.classList.remove("warn", "over");
    if (target && !timerStopped) {
      if (elapsed >= target) { node.classList.add("over"); node.title = "Over the target time"; }
      else if (elapsed >= target * WARN_AT) node.classList.add("warn");
    }
  }

  function startTimer() {
    stopTimer();
    timerStart = Date.now();
    timerStopped = false;
    const node = timerNode();
    if (node) node.classList.remove("done");
    renderTimer();
    timerInterval = setInterval(renderTimer, 250);
  }

  function stopTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = null;
    timerStopped = true;
    const node = timerNode();
    if (node) { node.classList.remove("warn", "over"); node.classList.add("done"); }
  }

  function elapsedMs() {
    return timerStart === null ? 0 : Date.now() - timerStart;
  }

  /* ---- Attempt bookkeeping --------------------------------------------------- */

  function beginAttempt(q) {
    attempt = {
      q,
      hintUsed: false,
      solutionShown: false,
      answered: null,
      outcome: null,
      timeMs: null,
      recorded: false,
    };
  }

  /* Stop the clock for scoring purposes. Called the moment the attempt is
     decided, so that time spent reading the solution afterwards is not counted
     as time spent solving. */
  function freezeTime() {
    if (attempt && attempt.timeMs === null) attempt.timeMs = elapsedMs();
  }

  /* Write the attempt to the store, if anything actually happened. Reading the
     solution without self-grading records "ungraded": seen, but neither right
     nor wrong. */
  function flush() {
    if (!attempt || attempt.recorded) return;
    const outcome = attempt.outcome || (attempt.solutionShown ? "ungraded" : null);
    if (!outcome) return;
    attempt.recorded = true;
    QStore.recordAttempt({
      qid: attempt.q.id,
      mode: mode === "review" ? "review" : "practice",
      outcome,
      answered: attempt.answered,
      timeMs: attempt.timeMs === null ? elapsedMs() : attempt.timeMs,
      hintUsed: attempt.hintUsed,
      solutionShown: attempt.solutionShown,
    });
  }

  /* ---- Showing a question ------------------------------------------------------ */

  function setReveal(section, html) {
    section.querySelector(".body").innerHTML = html;
    section.classList.remove("open");
  }

  function show(q) {
    flush();
    current = q;
    beginAttempt(q);

    el.question.innerHTML = QApp.metaLine(q) + `<div>${q.question}</div>`;
    setReveal(el.hint, q.hint || "");
    setReveal(el.solution, q.solution || "");
    el["hint-btn"].disabled = !q.hint;
    el["hint-btn"].textContent = "Show hint";
    el["solution-btn"].disabled = !q.solution;
    el["solution-btn"].textContent = "Show solution";
    el.selfgrade.hidden = true;
    el.selfgrade.innerHTML = "";

    renderOptions(q);

    QApp.renderMath(el.question);
    QApp.renderMath(el.options);
    QApp.renderMath(el.hint);
    QApp.renderMath(el.solution);

    updateStatus();
    startTimer();
  }

  function showAt(i) {
    if (!order.length) return showEmpty();
    index = ((i % order.length) + order.length) % order.length;
    QStore.setCursor(filters(), index);
    show(order[index]);
  }

  function showEmpty() {
    stopTimer();
    current = null;
    attempt = null;
    const message = QBank.size() === 0
      ? "No questions yet. Add some to a file in <code>questions/</code>."
      : mode === "review"
        ? "Nothing to review. Questions land here once you get one wrong, skip it in a test, or go over its target time."
        : "No questions match these filters.";
    el.question.innerHTML = `<p class="empty">${message}</p>`;
    el.options.hidden = true;
    setReveal(el.hint, "");
    setReveal(el.solution, "");
    el.selfgrade.hidden = true;
    el["hint-btn"].disabled = el["solution-btn"].disabled = true;
    updateStatus();
  }

  /* ---- Multiple choice ----------------------------------------------------------- */

  // Display order for the current question: display slot -> index in q.options.
  let optionOrder = [];

  function renderOptions(q) {
    if (!QBank.isMultipleChoice(q)) {
      el.options.hidden = true;
      el.options.innerHTML = "";
      optionOrder = [];
      return;
    }
    // Shuffled so that repeated practice teaches the answer, not its position.
    optionOrder = QApp.shuffle(q.options.map((_, i) => i));
    el.options.hidden = false;
    el.options.innerHTML = optionOrder.map((orig, slot) => `
      <li><button class="option" data-slot="${slot}" aria-pressed="false">
        <span class="key">${KEYS[slot] || ""}</span>
        <span class="text">${q.options[orig]}</span>
      </button></li>`).join("");

    for (const button of el.options.querySelectorAll(".option"))
      button.addEventListener("click", () => answer(Number(button.dataset.slot)));
  }

  function answer(slot) {
    if (!current || !attempt || attempt.outcome) return;      // already graded
    if (slot < 0 || slot >= optionOrder.length) return;

    const chosen = optionOrder[slot];
    const right = chosen === current.answer;

    attempt.answered = chosen;                                 // store the real index
    attempt.outcome = right ? "correct" : "wrong";
    freezeTime();
    stopTimer();

    for (const button of el.options.querySelectorAll(".option")) {
      const s = Number(button.dataset.slot);
      const orig = optionOrder[s];
      button.disabled = true;
      if (orig === current.answer) button.classList.add("correct");
      else if (s === slot) button.classList.add("wrong");
      else button.classList.add("muted");
      button.setAttribute("aria-pressed", String(s === slot));
    }

    // Getting it wrong is exactly when the explanation is worth reading.
    revealSolution(false);
    flush();
    updateStatus();
  }

  /* ---- Reveals and self-grading ------------------------------------------------ */

  function showHint() {
    if (!current || el["hint-btn"].disabled) return;
    const open = el.hint.classList.toggle("open");
    el["hint-btn"].textContent = (open ? "Hide " : "Show ") + "hint";
    if (open && attempt) attempt.hintUsed = true;
  }

  /* toggleable=true when the user pressed the button, so it can be hidden again;
     false when a graded answer opens it automatically. */
  function revealSolution(toggleable) {
    if (!current || !current.solution) return;
    const open = toggleable ? el.solution.classList.toggle("open")
                            : (el.solution.classList.add("open"), true);
    el["solution-btn"].textContent = (open ? "Hide " : "Show ") + "solution";
    if (!open) return;

    // Only a deliberate reveal counts as having looked the answer up; the
    // automatic one after a graded multiple-choice answer does not.
    if (attempt && toggleable) attempt.solutionShown = true;
    freezeTime();
    stopTimer();
    renderSelfGrade();
  }

  /* Free-response questions cannot be graded by the app, so ask. Multiple choice
     has already been graded, so this never appears for them. */
  function renderSelfGrade() {
    if (!attempt || QBank.isMultipleChoice(current)) return;

    if (attempt.outcome) {
      const label = attempt.outcome === "correct" ? "Got it" : "Missed it";
      el.selfgrade.hidden = false;
      el.selfgrade.innerHTML = `<span class="done">Recorded as <b>${label.toLowerCase()}</b>.</span>`;
      return;
    }

    el.selfgrade.hidden = false;
    el.selfgrade.innerHTML =
      `<span>Did you get it?</span>
       <button id="grade-good">Got it <kbd>g</kbd></button>
       <button id="grade-bad">Missed it <kbd>m</kbd></button>`;
    el.selfgrade.querySelector("#grade-good").addEventListener("click", () => selfGrade("correct"));
    el.selfgrade.querySelector("#grade-bad").addEventListener("click", () => selfGrade("wrong"));
  }

  /* Also reachable with g/m before revealing the solution: solve it in your
     head, mark it, move on. Multiple choice is graded by the app, so self-
     grading is refused there rather than letting it overwrite the real result. */
  function selfGrade(outcome) {
    if (!attempt || attempt.outcome) return;
    if (QBank.isMultipleChoice(current)) return;
    attempt.outcome = outcome;
    freezeTime();
    stopTimer();
    flush();
    renderSelfGrade();
    updateStatus();
  }

  /* ---- Navigation ------------------------------------------------------------- */

  function next() {
    flush();

    if (mode === "sequential") {
      if (!order.length) return showEmpty();
      return showAt(index + 1);
    }

    // Review mode shrinks as you fix things, so recompute the pool each time.
    if (mode === "review") order = pool();

    const candidates = mode === "review" ? order : QBank.filter(filters());
    if (candidates.length === 0) return showEmpty();

    let unseen = candidates.filter(q => !seen.has(q.id));
    if (unseen.length === 0) { seen.clear(); unseen = candidates; }
    if (unseen.length > 1 && current) unseen = unseen.filter(q => q.id !== current.id);

    const q = unseen[Math.floor(Math.random() * unseen.length)];
    seen.add(q.id);
    show(q);
  }

  function prev() {
    if (mode !== "sequential" || !order.length) return;
    flush();
    showAt(index - 1);
  }

  /* ---- Status ------------------------------------------------------------------ */

  function updateStatus() {
    const all = QBank.all();
    const attempted = QStore.attemptedIds();
    const done = all.filter(q => attempted.has(q.id)).length;
    const n = order.length || pool().length;

    const where = mode === "sequential" && n
      ? `${index + 1} of ${n} in this filter`
      : mode === "review"
        ? `${n} left to review`
        : `${[...seen].length} of ${n} seen this pass`;

    const keys = QBank.isMultipleChoice(current)
      ? `<kbd>1</kbd>–<kbd>${KEYS[Math.min(current.options.length, KEYS.length) - 1]}</kbd> answer, `
      : "";
    const nav = mode === "sequential" ? `<kbd>&larr;</kbd><kbd>&rarr;</kbd> move, ` : "";

    QApp.setStatus(
      `${where}.  ${done} of ${all.length} attempted in the bank.<br>` +
      `Keys: ${keys}${nav}<kbd>n</kbd> next, <kbd>h</kbd> hint, <kbd>s</kbd> solution, ` +
      `<kbd>g</kbd>/<kbd>m</kbd> self-grade.`);
  }

  /* ---- Keyboard ------------------------------------------------------------------ */

  function onKey(e) {
    const slot = KEYS.indexOf(e.key);
    if (slot !== -1 && current && QBank.isMultipleChoice(current)) { answer(slot); return true; }

    switch (e.key) {
      case "n": next(); return true;
      case "p": prev(); return true;
      case "ArrowRight": if (mode === "sequential") { next(); return true; } return false;
      case "ArrowLeft":  if (mode === "sequential") { prev(); return true; } return false;
      case "h": showHint(); return true;
      case "s": revealSolution(true); return true;
      case "g": selfGrade("correct"); return true;
      case "m": selfGrade("wrong"); return true;
    }
    return false;
  }

  return { name: "practice", title: "Practice", mount, unmount, onKey };
})());
