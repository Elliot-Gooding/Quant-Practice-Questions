/* ============================================================================
   PRACTICE VIEW
   ----------------------------------------------------------------------------
   One question at a time, drawn at random from the filtered pool, with a timer
   against the question's target time and hint/solution reveals.
   ========================================================================== */

QApp.register((function () {

  const WARN_AT = 0.8;          // timer turns amber at 80% of the target

  let el = {};                  // nodes of the currently mounted view
  let seen = new Set();         // shown this pass; cleared when the pool runs out
  let current = null;

  let timerStart = null, timerInterval = null, timerStopped = false;

  /* ---- Markup -------------------------------------------------------------- */

  function mount(root) {
    root.innerHTML = `
      <div class="controls">
        <select id="category" aria-label="Category"></select>
        <select id="difficulty" aria-label="Difficulty">
          <option value="">any difficulty</option>
          <option value="1">easy</option>
          <option value="2">medium</option>
          <option value="3">hard</option>
        </select>
      </div>

      <div class="panel">
        <div id="question"></div>

        <section id="hint" class="reveal">
          <div class="label">Hint</div>
          <div class="body"></div>
        </section>

        <section id="solution" class="reveal">
          <div class="label">Solution</div>
          <div class="body"></div>
        </section>
      </div>

      <nav class="actions">
        <button id="hint-btn">Show hint</button>
        <button id="solution-btn">Show solution</button>
        <button id="next-btn" class="primary right">Next question</button>
      </nav>`;

    el = {
      question:    root.querySelector("#question"),
      hint:        root.querySelector("#hint"),
      solution:    root.querySelector("#solution"),
      hintBtn:     root.querySelector("#hint-btn"),
      solutionBtn: root.querySelector("#solution-btn"),
      nextBtn:     root.querySelector("#next-btn"),
      category:    root.querySelector("#category"),
      difficulty:  root.querySelector("#difficulty"),
    };

    buildCategoryFilter();

    el.nextBtn.addEventListener("click", next);
    el.hintBtn.addEventListener("click", () => toggle(el.hint, el.hintBtn, "hint"));
    el.solutionBtn.addEventListener("click", showSolution);
    el.category.addEventListener("change", () => { seen.clear(); next(); });
    el.difficulty.addEventListener("change", () => { seen.clear(); next(); });

    next();
  }

  function unmount() {
    stopTimer();
    el = {};
    current = null;
  }

  /* ---- Timer --------------------------------------------------------------- */

  function renderTimer() {
    const node = el.question && el.question.querySelector("#timer");
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
    const node = el.question && el.question.querySelector("#timer");
    if (node) node.classList.remove("done");
    renderTimer();
    timerInterval = setInterval(renderTimer, 250);
  }

  function stopTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = null;
    timerStopped = true;
    const node = el.question && el.question.querySelector("#timer");
    if (node) { node.classList.remove("warn", "over"); node.classList.add("done"); }
  }

  /* ---- Pool ---------------------------------------------------------------- */

  function buildCategoryFilter() {
    el.category.innerHTML =
      `<option value="">any category</option>` +
      QBank.categories().map(c => `<option value="${c}">${c}</option>`).join("");
  }

  function pool() {
    return QBank.filter({
      category: el.category.value,
      difficulty: el.difficulty.value,
    });
  }

  /* ---- Showing a question --------------------------------------------------- */

  function setReveal(section, html) {
    section.querySelector(".body").innerHTML = html;
    section.classList.remove("open");
  }

  function show(q) {
    current = q;
    el.question.innerHTML = QApp.metaLine(q) + `<div>${q.question}</div>`;
    setReveal(el.hint, q.hint || "");
    setReveal(el.solution, q.solution || "");
    el.hintBtn.disabled = !q.hint;
    el.solutionBtn.disabled = !q.solution;
    el.hintBtn.textContent = "Show hint";
    el.solutionBtn.textContent = "Show solution";
    QApp.renderMath(el.question);
    QApp.renderMath(el.hint);
    QApp.renderMath(el.solution);
    updateStatus();
    startTimer();
  }

  function showEmpty(message) {
    stopTimer();
    current = null;
    el.question.innerHTML = `<p class="empty">${message}</p>`;
    setReveal(el.hint, "");
    setReveal(el.solution, "");
    el.hintBtn.disabled = el.solutionBtn.disabled = true;
    updateStatus();
  }

  function next() {
    const candidates = pool();
    if (candidates.length === 0) {
      showEmpty(QBank.size() === 0
        ? "No questions yet. Add some to a file in <code>questions/</code>."
        : "No questions match these filters.");
      return;
    }
    let unseen = candidates.filter(q => !seen.has(q.id));
    if (unseen.length === 0) { seen.clear(); unseen = candidates; }
    // Avoid showing the same question twice in a row when a fresh pass starts
    if (unseen.length > 1 && current) unseen = unseen.filter(q => q.id !== current.id);
    const q = unseen[Math.floor(Math.random() * unseen.length)];
    seen.add(q.id);
    show(q);
  }

  function toggle(section, btn, label) {
    const open = section.classList.toggle("open");
    btn.textContent = (open ? "Hide " : "Show ") + label;
  }

  function showSolution() {
    toggle(el.solution, el.solutionBtn, "solution");
    if (el.solution.classList.contains("open")) stopTimer();   // revealing ends the attempt
  }

  function updateStatus() {
    const n = pool().length;
    const done = [...seen].filter(id => pool().some(q => q.id === id)).length;
    QApp.setStatus(n
      ? `${done} of ${n} seen this pass.  The timer stops when you show the solution.  ` +
        `Keys: <kbd>n</kbd> next, <kbd>h</kbd> hint, <kbd>s</kbd> solution.`
      : "");
  }

  /* ---- Keyboard -------------------------------------------------------------- */

  function onKey(e) {
    if (e.key === "n") { next(); return true; }
    if (e.key === "h" && !el.hintBtn.disabled) { el.hintBtn.click(); return true; }
    if (e.key === "s" && !el.solutionBtn.disabled) { el.solutionBtn.click(); return true; }
    return false;
  }

  return { name: "practice", title: "Practice", mount, unmount, onKey };
})());
