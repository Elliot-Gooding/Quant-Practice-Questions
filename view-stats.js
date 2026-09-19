/* ============================================================================
   STATS VIEW
   ----------------------------------------------------------------------------
   What the attempt history adds up to, plus the export/import/reset controls.

   Deliberately no charting library and no new palette. Every figure is a table
   row carrying its own number, with a single-hue proportion bar beside it as a
   secondary read — so nothing here depends on colour alone, and the page stays
   in the app's existing navy and serif.
   ========================================================================== */

QApp.register((function () {

  let root = null;

  function mount(node) {
    root = node;
    render();
  }

  function unmount() {
    root = null;
  }

  /* ---- Small pieces ---------------------------------------------------------- */

  function bar(fraction, label) {
    const pct = fraction === null || fraction === undefined
      ? 0 : Math.max(0, Math.min(1, fraction)) * 100;
    return `<span class="bar" title="${label || ""}"><i style="width:${pct.toFixed(1)}%"></i></span>`;
  }

  function accuracyCell(b) {
    if (!b.graded) return `<td class="num subtle">—</td><td class="barcell"></td>`;
    return `<td class="num">${QApp.pct(b.accuracy)}</td>` +
      `<td class="barcell">${bar(b.accuracy, b.correct + " of " + b.graded + " graded")}</td>`;
  }

  function groupTable(heading, buckets, labelOf) {
    const keys = Object.keys(buckets);
    if (!keys.length) return "";
    const rows = keys.map(key => {
      const b = buckets[key];
      return `<tr>
        <td>${labelOf ? labelOf(key) : key}</td>
        <td class="num subtle">${b.attempted} / ${b.total}</td>
        ${accuracyCell(b)}
      </tr>`;
    }).join("");
    return `<h2>${heading}</h2>
      <table>
        <thead><tr>
          <th>${heading.toLowerCase()}</th>
          <th class="num">attempted</th>
          <th class="num">accuracy</th><th></th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>`;
  }

  /* ---- Render ------------------------------------------------------------------ */

  function render() {
    if (!root) return;
    const questions = QBank.all();
    const s = QStore.overallStats(questions);
    const tests = QStore.tests().slice().sort((a, b) => b.startedAt - a.startedAt);

    const graded = QStore.attempts().filter(a => a.outcome === "correct" || a.outcome === "wrong");
    const overallAccuracy = graded.length
      ? graded.filter(a => a.outcome === "correct").length / graded.length : null;

    root.innerHTML = `
      <div class="panel">
        <h2>${s.attempted} of ${s.bankSize} questions attempted</h2>
        ${bar(s.bankSize ? s.attempted / s.bankSize : 0, s.attempted + " of " + s.bankSize)}
        <p class="subtle">
          ${s.totalAttempts} attempt${s.totalAttempts === 1 ? "" : "s"} recorded &middot;
          ${overallAccuracy === null ? "nothing graded yet" : QApp.pct(overallAccuracy) + " accuracy overall"} &middot;
          ${s.reviewCount} question${s.reviewCount === 1 ? "" : "s"} due for review
        </p>
      </div>

      <div class="panel">
        ${groupTable("Category", s.byCategory)}
        ${groupTable("Difficulty", s.byDifficulty, k => QApp.difficultyName(Number(k)) || k)}
      </div>

      <div class="panel">
        <h2>Most reliably wrong</h2>
        ${s.weakest.length ? `
          <table>
            <thead><tr>
              <th>question</th><th>category</th>
              <th class="num">right</th><th class="num">accuracy</th>
            </tr></thead>
            <tbody>${s.weakest.slice(0, 10).map(({ q, s: st }) => `
              <tr>
                <td>${q.id}</td>
                <td class="subtle">${q.category}</td>
                <td class="num subtle">${st.correct} / ${st.graded}</td>
                <td class="num bad">${QApp.pct(st.accuracy)}</td>
              </tr>`).join("")}
            </tbody>
          </table>`
          : `<p class="subtle">Nothing yet. Questions appear here once you have got one wrong.</p>`}

        <h2>Slowest against their target</h2>
        ${s.slowest.length ? `
          <table>
            <thead><tr>
              <th>question</th><th>category</th>
              <th class="num">median</th><th class="num">target</th><th class="num">ratio</th>
            </tr></thead>
            <tbody>${s.slowest.slice(0, 10).map(({ q, s: st }) => `
              <tr>
                <td>${q.id}</td>
                <td class="subtle">${q.category}</td>
                <td class="num">${QApp.fmtMs(st.medianTimeMs)}</td>
                <td class="num subtle">${QApp.fmtMs(st.targetMs)}</td>
                <td class="num warnc">${st.timeRatio.toFixed(1)}&times;</td>
              </tr>`).join("")}
            </tbody>
          </table>`
          : `<p class="subtle">Nothing yet. Questions appear here once you go over a target time.</p>`}
      </div>

      <div class="panel">
        <h2>Test history</h2>
        ${tests.length ? `
          <table>
            <thead><tr>
              <th>when</th><th>format</th><th class="num">score</th>
              <th class="num">right</th><th class="num">wrong</th><th class="num">skipped</th>
            </tr></thead>
            <tbody>${tests.map(t => `
              <tr>
                <td class="subtle">${new Date(t.startedAt).toLocaleString()}</td>
                <td>${t.formatName || t.formatId}${t.autoSubmitted ? ' <span class="warnc">· time expired</span>' : ""}</td>
                <td class="num">${t.score} / ${t.max}</td>
                <td class="num good">${t.counts.correct}</td>
                <td class="num bad">${t.counts.wrong}</td>
                <td class="num subtle">${t.counts.skipped}</td>
              </tr>`).join("")}
            </tbody>
          </table>`
          : `<p class="subtle">No tests sat yet.</p>`}
      </div>

      <div class="panel">
        <h2>Your data</h2>
        <p class="subtle">
          Everything above lives in this browser's local storage for this folder, and
          nowhere else. Moving the folder, clearing site data or switching browser
          loses it. Export now and again.
        </p>
        ${!QStore.persistent ? `<div class="banner"><b>Nothing is being saved.</b>
          This browser is blocking local storage, so this session will not be remembered.</div>` : ""}
        <nav class="actions">
          <button id="export" class="primary">Export JSON</button>
          <button id="import-btn">Import JSON</button>
          <input type="file" id="import-file" accept="application/json,.json" hidden>
          <button id="reset" class="danger right">Erase all progress</button>
        </nav>
        <p class="subtle" id="data-message"></p>
      </div>`;

    wireDataControls();
    QApp.setStatus("");
  }

  /* ---- Export / import / reset ---------------------------------------------------- */

  function message(text, className) {
    const node = root.querySelector("#data-message");
    node.className = "subtle " + (className || "");
    node.textContent = text;
  }

  function wireDataControls() {
    root.querySelector("#export").addEventListener("click", () => {
      const stamp = new Date().toISOString().slice(0, 10);
      const blob = new Blob([QStore.exportJSON()], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "quant-practice-" + stamp + ".json";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      message("Exported " + QStore.attempts().length + " attempts.", "good");
    });

    const file = root.querySelector("#import-file");
    root.querySelector("#import-btn").addEventListener("click", () => file.click());

    file.addEventListener("change", () => {
      const chosen = file.files && file.files[0];
      if (!chosen) return;
      const reader = new FileReader();
      reader.onload = () => {
        // Merging by default: importing a backup should not silently discard
        // whatever has been practised since it was taken.
        const result = QStore.importJSON(String(reader.result), { merge: true });
        if (!result.ok) { message(result.error, "bad"); return; }
        render();
        message("Imported " + result.added + " new attempts" +
          (result.skipped ? ", skipped " + result.skipped + " already held." : "."), "good");
      };
      reader.onerror = () => message("Could not read that file.", "bad");
      reader.readAsText(chosen);
      file.value = "";
    });

    root.querySelector("#reset").addEventListener("click", () => {
      const n = QStore.attempts().length;
      if (!n) { message("There is nothing stored to erase.", ""); return; }
      if (!window.confirm(
        "Erase all " + n + " recorded attempts and every test result?\n\n" +
        "This cannot be undone. Export first if you might want them back.")) return;
      QStore.reset();
      render();
      message("Erased.", "");
    });
  }

  return { name: "stats", title: "Stats", wide: true, mount, unmount };
})());
