/* ============================================================================
   MOCK INTERVIEW
   ----------------------------------------------------------------------------
   Sits a spoken-style interview under a format that has an `interview` field
   (see formats.js). It is not a paper: the problems have no options, you can
   ask for clues, and you mark yourself against the answer. The Test view owns
   the tab and hands over to this module when such a format is started.

   The shape comes from the format, not from here:

     interview.blocks   one block per entry, in order. Each block is an opening
                        problem of that level and its follow-up.
     timeLimitSec       the one clock that stops you.

   The rule that makes it an interview: a block's opening problem has to be
   solved to reach the next block. Miss it and the interview ends there. You
   can carry on for practice, but nothing after that point counts.

   Three stages: running, stopped (the gate closed), results.

   What is stored when it ends is an ordinary test record — a score out of the
   number of parts, and one item per part with its block as the `kind` — so the
   Stats tab charts it like any other paper. Parts never reached, and parts
   only practised after the gate closed, are stored as "skipped".
   ========================================================================== */

const QInterview = (function () {

  const WARN_AT = 0.2;

  let root = null;
  let format = null;
  let run = null;
  let stage = "idle";           // idle | running | stopped | results
  let enteredAt = null;         // when the part on screen was opened
  let ticker = null;
  let onExit = null;

  /* ---- Drawing the problems ----------------------------------------------- */

  /* One opening problem per block, of the block's level: never-attempted ones
     first, and no problem twice in the same interview. */
  function draw(fmt) {
    const seen = QStore.attemptedIds();
    const taken = new Set();
    const picks = [];
    for (const block of fmt.interview.blocks) {
      const pool = QBank.interviewProblems(block.level).filter(q => !taken.has(q.id));
      if (!pool.length) return null;
      const fresh = pool.filter(q => !seen.has(q.id));
      const q = QApp.shuffle(fresh.length ? fresh : pool)[0];
      taken.add(q.id);
      picks.push(q);
    }
    return picks;
  }

  function poolSummary(fmt) {
    const seen = QStore.attemptedIds();
    const levels = [...new Set(fmt.interview.blocks.map(b => b.level))];
    const per = levels.map(level => QBank.interviewProblems(level));
    return {
      total: per.reduce((n, list) => n + list.length, 0),
      fresh: per.reduce((n, list) => n + list.filter(q => !seen.has(q.id)).length, 0),
      perLevel: per.map(list => list.length),
      ready: fmt.interview.blocks.every(b => QBank.interviewProblems(b.level).length > 0),
    };
  }

  /* ---- Start-screen panel, rendered by the Test view ------------------------- */

  function row(f) {
    const pool = poolSummary(f);
    const blocks = f.interview.blocks;
    return `
      <div class="panel">
        <div class="meta"><span>${f.name}</span><span class="timer">${Math.round(f.timeLimitSec / 60)} min</span></div>
        <p class="subtle">
          ${blocks.length} blocks of rising difficulty &middot; a problem and a follow-up in each &middot;
          no options &middot; clues on request &middot; you mark yourself &middot;
          a block you do not solve ends the interview
        </p>
        ${f.note ? `<p class="subtle">${f.note}</p>` : ""}
        <p class="subtle">${pool.total} opening problems in the bank for these blocks (${pool.perLevel.join(" / ")} by level)${
          pool.ready ? `. ${pool.fresh === 0
            ? "You have attempted all of them; this mock will repeat some."
            : pool.fresh + " not attempted yet, and a mock takes those first."}`
          : ` — <span class="warnc">at least one block has none</span>.`}</p>
        <nav class="actions">
          ${pool.ready
            ? `<button class="primary" data-interview="${f.id}">Start ${f.name.split(" — ")[0]}</button>`
            : `<button disabled>Not enough problems yet</button>`}
        </nav>
      </div>`;
  }

  /* ---- Running ------------------------------------------------------------------ */

  function part(q, role) {
    return { qid: q.id, role, clues: 0, shown: false, outcome: null, timeMs: 0,
      reached: false, practice: false };
  }

  function start(fmt, node, exit) {
    const picks = draw(fmt);
    if (!picks) return false;
    root = node;
    format = fmt;
    onExit = exit || null;
    run = {
      id: "t" + Date.now().toString(36),
      formatId: fmt.id,
      formatName: fmt.name,
      startedAt: Date.now(),
      endedAt: null,
      timeLimitSec: fmt.timeLimitSec,
      b: 0,                       // block on screen
      p: 0,                       // 0 opening problem, 1 follow-up
      stoppedAt: null,            // index of the block where the gate closed
      stoppedMs: null,            // how far in that was
      practising: false,
      timedOut: false,
      blocks: fmt.interview.blocks.map((block, i) => ({
        level: block.level,
        minutes: block.minutes,
        startedAt: null,
        parts: [part(picks[i], "opening"), part(QBank.get(picks[i].interview.followUp), "follow-up")],
      })),
    };
    stage = "running";
    enter();
    startClock();
    render();
    return true;
  }

  const block = () => run.blocks[run.b];
  const current = () => block().parts[run.p];
  const lastBlock = () => run.b === run.blocks.length - 1;

  function enter() {
    const now = Date.now();
    if (block().startedAt === null) block().startedAt = now;
    current().reached = true;
    current().practice = run.practising;
    enteredAt = now;
  }

  function leave() {
    if (enteredAt === null) return;
    current().timeMs += Date.now() - enteredAt;
    enteredAt = null;
  }

  function remainingSec() {
    return Math.max(0, run.timeLimitSec - Math.floor((Date.now() - run.startedAt) / 1000));
  }

  function startClock() {
    stopClock();
    ticker = setInterval(() => {
      paintClocks();
      if (remainingSec() <= 0) finish(true);
    }, 250);
  }

  function stopClock() {
    if (ticker) clearInterval(ticker);
    ticker = null;
  }

  function paintClocks() {
    if (!root || !run) return;
    const clock = root.querySelector("#countdown");
    if (clock) {
      const left = remainingSec();
      clock.textContent = QApp.fmtClock(left);
      clock.classList.toggle("warn", left > 0 && left <= run.timeLimitSec * WARN_AT);
      clock.classList.toggle("over", left <= 0);
    }
    const lap = root.querySelector("#blockclock");
    if (lap && block().startedAt !== null) {
      const spent = (Date.now() - block().startedAt) / 1000;
      lap.textContent = QApp.fmtClock(spent);
      lap.classList.toggle("warn", spent > block().minutes * 60);
    }
  }

  /* ---- What you can do on a problem ------------------------------------------------ */

  function clue() {
    if (stage !== "running") return;
    const pt = current(), q = QBank.get(pt.qid);
    if (pt.shown || pt.clues >= cluesOf(q).length) return;
    pt.clues++;
    render();
  }

  function showAnswer() {
    if (stage !== "running" || current().shown) return;
    current().shown = true;
    render();
  }

  /* Marking is the only way forward, and what it leads to is the whole format:
     an opening problem solved opens its follow-up; an opening problem missed
     closes the gate; a follow-up, right or wrong, moves on to the next block. */
  function mark(right) {
    if (stage !== "running" || !current().shown) return;
    const pt = current();
    leave();
    pt.outcome = right ? "correct" : "wrong";

    if (pt.role === "opening" && right) {
      run.p = 1;
      enter();
      return render();
    }
    if (pt.role === "opening" && !run.practising) {
      // The gate closes. On the last block there is nothing left to offer, so
      // go straight to the results.
      run.stoppedAt = run.b;
      run.stoppedMs = Date.now() - run.startedAt;
      if (lastBlock()) return finish(false);
      stage = "stopped";
      return render();
    }
    if (lastBlock()) return finish(false);
    nextBlock();
  }

  function nextBlock() {
    run.b++;
    run.p = 0;
    stage = "running";
    enter();
    render();
  }

  function carryOn() {
    if (stage !== "stopped") return;
    run.practising = true;
    nextBlock();
  }

  /* ---- Finishing ----------------------------------------------------------------------- */

  /* A part counts towards the result only if it was marked before the gate closed. */
  const counted = pt => pt.outcome !== null && !pt.practice;
  const recordedOutcome = pt => counted(pt) ? pt.outcome : "skipped";

  /* Blocks cleared: opening problems solved, in order, before the first miss. */
  function clearedBlocks() {
    let n = 0;
    for (const b of run.blocks) {
      if (!counted(b.parts[0]) || b.parts[0].outcome !== "correct") break;
      n++;
    }
    return n;
  }

  function finish(timedOut) {
    if (!run || stage === "results" || stage === "idle") return;
    if (stage === "running") leave();
    stopClock();
    run.endedAt = Date.now();
    run.timedOut = !!timedOut;

    const counts = { correct: 0, wrong: 0, skipped: 0 };
    const items = [];
    run.blocks.forEach((b, i) => b.parts.forEach(pt => {
      const outcome = recordedOutcome(pt);
      counts[outcome]++;
      items.push({
        qid: pt.qid, answered: null, outcome, flagged: false,
        timeMs: counted(pt) ? pt.timeMs : 0,
        kind: "block " + (i + 1),
        role: pt.role, clues: pt.clues,
        practised: pt.practice && pt.outcome !== null ? pt.outcome : null,
      });
      // Every problem actually marked goes into the per-question history, the
      // practised ones included: they have been seen either way.
      if (pt.outcome !== null)
        QStore.recordAttempt({
          qid: pt.qid, mode: "test", outcome: pt.outcome, answered: null,
          timeMs: pt.timeMs, hintUsed: pt.clues > 0, solutionShown: false, testId: run.id,
        });
    }));

    run.counts = counts;
    run.score = counts.correct;
    run.max = items.length;
    run.cleared = clearedBlocks();

    QStore.recordTest({
      id: run.id,
      formatId: run.formatId,
      formatName: run.formatName,
      startedAt: run.startedAt,
      endedAt: run.endedAt,
      timeLimitSec: run.timeLimitSec,
      questionCount: items.length,
      score: run.score,
      max: run.max,
      counts,
      autoSubmitted: run.timedOut,
      interview: {
        blocks: run.blocks.length,
        cleared: run.cleared,
        stoppedAt: run.stoppedAt === null ? null : run.stoppedAt + 1,
        practisedOn: run.practising,
      },
      items,
    });

    stage = "results";
    render();
  }

  /* ---- Rendering ---------------------------------------------------------------------------- */

  const cluesOf = q => Array.isArray(q.hints) && q.hints.length ? q.hints : (q.hint ? [q.hint] : []);

  function render() {
    if (!root || !run) return;
    if (stage === "running") renderRunning();
    else if (stage === "stopped") renderStopped();
    else if (stage === "results") renderResults();
    QApp.renderMath(root);
  }

  function clueList(q, shown) {
    if (!shown) return "";
    return `<section class="reveal open clues">
      <div class="label">Clue${shown === 1 ? "" : "s"}</div>
      <ol>${cluesOf(q).slice(0, shown).map(c => `<li>${c}</li>`).join("")}</ol>
    </section>`;
  }

  function renderRunning() {
    const b = block(), pt = current(), q = QBank.get(pt.qid);
    const opening = QBank.get(b.parts[0].qid);
    const followUp = pt.role === "follow-up";
    const left = cluesOf(q).length - pt.clues;

    root.innerHTML = `
      <div class="controls">
        <span>Block ${run.b + 1} of ${run.blocks.length} &middot; ${QApp.difficultyName(b.level)}${
          run.practising ? ' &middot; <span class="warnc">practice only</span>' : ""}</span>
        <span class="spacer"></span>
        <span>this block <span id="blockclock" class="timer">0:00</span> of about ${b.minutes}:00</span>
        <span id="countdown" class="timer">${QApp.fmtClock(remainingSec())}</span>
      </div>

      <div class="panel interview">
        <div class="meta"><span>${followUp ? "Follow-up" : "Opening problem"}</span></div>
        ${followUp ? `
          <div class="earlier">
            <div class="label">The problem you have just solved</div>
            ${opening.question}
          </div>
          <div class="label then">Then the interviewer says</div>` : ""}
        <div id="question"><div id="qtext">${followUp ? opening.interview.twist : q.question}</div></div>

        ${clueList(q, pt.clues)}

        ${pt.shown ? `
          <section class="reveal open">
            <div class="label">Answer</div>
            <div id="shortanswer">${q.shortAnswer}</div>
          </section>
          <div class="selfgrade">
            <span>Did you get there?</span>
            <button class="primary" data-mark="1">I had it <kbd>Y</kbd></button>
            <button data-mark="0">I did not <kbd>N</kbd></button>
          </div>` : `
          <nav class="actions">
            <button id="clue"${left ? "" : " disabled"}>${left
              ? `Ask for a clue <kbd>C</kbd>` : "No more clues"}</button>
            <button id="answer" class="primary">Check my answer <kbd>A</kbd></button>
          </nav>
          <p class="subtle">${pt.clues} of ${cluesOf(q).length} clues taken. Say your answer out loud before you check it.</p>`}
      </div>`;

    const on = (sel, fn) => { const n = root.querySelector(sel); if (n) n.addEventListener("click", fn); };
    on("#clue", clue);
    on("#answer", showAnswer);
    for (const button of root.querySelectorAll("[data-mark]"))
      button.addEventListener("click", () => mark(button.dataset.mark === "1"));

    paintClocks();
    QApp.setStatus(followUp
      ? "The follow-up does not decide whether you go on to the next block; the opening problem did."
      : "Solve this to reach " + (lastBlock() ? "the end of the interview." : "block " + (run.b + 2) + "."));
  }

  function minutes(ms) {
    const n = Math.max(1, Math.round(ms / 60000));
    return n + (n === 1 ? " minute" : " minutes");
  }

  function renderStopped() {
    const n = run.stoppedAt + 1;
    const q = QBank.get(run.blocks[run.stoppedAt].parts[0].qid);
    root.innerHTML = `
      <div class="panel">
        <h2>The interview would end here</h2>
        <p>You did not solve the block ${n} problem, so the real interview would stop at this
          point — about ${minutes(run.stoppedMs)} in — and you
          would not be shown block ${n + 1}.</p>
        <details>
          <summary>How block ${n} is solved</summary>
          <div class="detail">${q.solution}</div>
        </details>
        <nav class="actions">
          <button class="primary" id="see-results">See how it went</button>
          <button id="carry-on">Carry on for practice</button>
        </nav>
        <p class="subtle">Carrying on shows you the harder blocks, on the same clock. Nothing from
          here counts towards this mock's result.</p>
      </div>`;
    root.querySelector("#see-results").addEventListener("click", () => finish(false));
    root.querySelector("#carry-on").addEventListener("click", carryOn);
    QApp.setStatus("");
  }

  function headline() {
    const total = run.blocks.length;
    if (run.stoppedAt !== null) return `Stopped at block ${run.stoppedAt + 1} of ${total}`;
    if (run.timedOut) return `Time ran out in block ${run.b + 1} of ${total}`;
    return `You cleared all ${total} blocks`;
  }

  function resultWord(pt) {
    if (pt.outcome === null)
      return pt.reached ? '<span class="warnc">not finished</span>' : '<span class="subtle">not reached</span>';
    const word = pt.outcome === "correct" ? "solved" : "not solved";
    const cls = pt.outcome === "correct" ? "good" : "bad";
    return pt.practice
      ? `<span class="subtle">practice — ${word}</span>`
      : `<span class="${cls}">${word}</span>`;
  }

  function renderResults() {
    const used = run.endedAt - run.startedAt;
    const rows = [], details = [];
    run.blocks.forEach((b, i) => b.parts.forEach(pt => {
      const q = QBank.get(pt.qid);
      rows.push(`<tr>
        <td>Block ${i + 1} <span class="subtle">${QApp.difficultyName(b.level)}</span></td>
        <td>${pt.role === "opening" ? "opening problem" : "follow-up"}</td>
        <td>${resultWord(pt)}</td>
        <td class="num">${pt.reached ? pt.clues + " of " + cluesOf(q).length : "—"}</td>
        <td class="num">${pt.reached ? QApp.fmtMs(pt.timeMs) : "—"}</td>
      </tr>`);
      if (!pt.reached) return;
      details.push(`<details${pt.outcome === "correct" ? "" : " open"}>
        <summary>Block ${i + 1}, ${pt.role === "opening" ? "opening problem" : "follow-up"} — ${resultWord(pt)}</summary>
        <div class="detail">
          <div>${q.question}</div>
          <section class="reveal"><div class="label">Answer</div>${q.shortAnswer}</section>
          <section class="reveal"><div class="label">Solution</div>${q.solution}</section>
          ${cluesOf(q).length ? `<section class="reveal"><div class="label">The clues</div>
            <ol>${cluesOf(q).map(c => `<li>${c}</li>`).join("")}</ol></section>` : ""}
        </div>
      </details>`);
    }));

    const unseen = run.blocks.length - run.blocks.filter(b => b.parts[0].reached).length;

    root.innerHTML = `
      <div class="panel">
        <h2>${headline()}</h2>
        <p class="subtle">
          ${run.score} of ${run.max} parts solved &middot; ${QApp.fmtMs(used)} of ${Math.round(run.timeLimitSec / 60)}:00 used${
          run.stoppedAt !== null
            ? ` &middot; the real interview would have ended after about ${minutes(run.stoppedMs)}`
            : ""}${run.timedOut ? ' &middot; <span class="warnc">time expired</span>' : ""}
        </p>
        <table>
          <thead><tr><th>block</th><th>part</th><th>result</th>
            <th class="num">clues</th><th class="num">time</th></tr></thead>
          <tbody>${rows.join("")}</tbody>
        </table>
        ${run.practising ? `<p class="subtle">Parts marked “practice” were sat after the interview
          would have ended. They are in your question history but not in this mock's score.</p>` : ""}
        ${unseen ? `<p class="subtle">${unseen === 1 ? "One block was" : unseen + " blocks were"} never
          opened, so ${unseen === 1 ? "its problem stays" : "their problems stay"} unseen for a later mock.</p>` : ""}
        <nav class="actions">
          <button class="primary" id="mock-again">Another mock</button>
          <button id="mock-back">Back to the tests</button>
        </nav>
      </div>
      <div class="panel">
        <h2>The problems</h2>
        ${details.join("")}
      </div>`;

    root.querySelector("#mock-again").addEventListener("click", () => {
      const fmt = format, node = root, exit = onExit;
      if (!start(fmt, node, exit)) leaveToTests();
    });
    root.querySelector("#mock-back").addEventListener("click", leaveToTests);
    QApp.setStatus("This mock is on the Stats tab with your other papers.");
  }

  function leaveToTests() {
    const exit = onExit;
    stopClock();
    stage = "idle";
    run = null;
    if (exit) exit();
  }

  /* ---- What the Test view needs to know ------------------------------------------------------ */

  /* The tab was opened again: results are still worth showing, anything else
     was abandoned when the tab was left. Returns false if there is nothing to show. */
  function resume(node) {
    if (stage !== "results" || !run) { stage = "idle"; run = null; return false; }
    root = node;
    render();
    return true;
  }

  function unmount() {
    stopClock();
    root = null;
  }

  function inProgress() {
    return stage === "running" || stage === "stopped";
  }

  function onKey(e) {
    if (stage !== "running") return false;
    const k = e.key.toLowerCase();
    if (!current().shown) {
      if (k === "c") { clue(); return true; }
      if (k === "a") { showAnswer(); return true; }
      return false;
    }
    if (k === "y") { mark(true); return true; }
    if (k === "n") { mark(false); return true; }
    return false;
  }

  return {
    row, start, resume, unmount, inProgress, onKey,
    // for tests.html
    state: () => ({ stage, run }),
    finish: () => finish(true),
  };
})();
