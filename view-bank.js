/* ============================================================================
   BANK VIEW
   ----------------------------------------------------------------------------
   The health of the question bank: the same checks `node validate.js` runs,
   plus what still stands between the bank and a full paper in each format.

   Both read validate-core.js, so the report here and the report in the terminal
   cannot drift apart.
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

  function issueTable(list) {
    return `<table>
      <thead><tr><th>question</th><th>field</th><th>problem</th></tr></thead>
      <tbody>${list.map(i => `<tr>
        <td>${QApp.escapeHtml(i.id)}</td>
        <td class="subtle">${QApp.escapeHtml(i.field)}</td>
        <td>${QApp.escapeHtml(i.message)}</td>
      </tr>`).join("")}</tbody>
    </table>`;
  }

  function render() {
    if (!root) return;

    const questions = QBank.all();
    const formats = QFormats.all();
    const result = QValidate.validate({
      questions,
      formats,
      problems: QBank.problems().concat(QFormats.problems(), QGenerators.problems()),
      generators: QGenerators.all(),      // re-marks a few generated papers too
    });

    const errors = result.issues.filter(i => i.severity === "error");
    const warnings = result.issues.filter(i => i.severity === "warn");
    const s = result.summary;

    // Questions with no options at all, grouped by category, so the next batch
    // to author is obvious.
    const needing = {};
    for (const q of questions)
      if (!QBank.isMultipleChoice(q)) (needing[q.category] = needing[q.category] || []).push(q.id);

    const tags = QBank.tags();

    root.innerHTML = `
      <div class="panel">
        <h2>${questions.length} questions, ${s.multipleChoice} with options</h2>
        <p class="subtle">
          ${errors.length
            ? `<span class="bad">${errors.length} error${errors.length === 1 ? "" : "s"}</span>`
            : `<span class="good">no errors</span>`} &middot;
          ${warnings.length} warning${warnings.length === 1 ? "" : "s"} &middot;
          ${formats.length} test format${formats.length === 1 ? "" : "s"}
        </p>
        <p class="subtle">The same checks run in the terminal with
          <code>node validate.js</code>, which exits non-zero on an error.</p>
      </div>

      ${errors.length ? `<div class="panel"><h2 class="bad">Errors</h2>${issueTable(errors)}</div>` : ""}
      ${warnings.length ? `<div class="panel"><h2>Warnings</h2>${issueTable(warnings)}</div>` : ""}

      <div class="panel">
        <h2>Ready for a paper?</h2>
        <table>
          <thead><tr>
            <th>format</th><th class="num">options</th>
            <th class="num">eligible</th><th class="num">needs</th><th></th>
          </tr></thead>
          <tbody>${formats.map(f => {
            if (f.interview) {
              const levels = [...new Set(f.interview.blocks.map(b => b.level))];
              const pool = levels.map(l => QBank.interviewProblems(l).length);
              const ok = f.interview.blocks.every(b => QBank.interviewProblems(b.level).length > 0);
              return `<tr>
                <td>${f.name}</td>
                <td class="num subtle">none</td>
                <td class="num">${pool.reduce((a, b) => a + b, 0)}</td>
                <td class="num subtle">${f.interview.blocks.length}</td>
                <td class="${ok ? "good" : "warnc"}">${ok
                  ? "ready — " + pool.join(" / ") + " opening problems by level"
                  : "a block has no problems"}</td>
              </tr>`;
            }
            if (f.generator) return `<tr>
              <td>${f.name}</td>
              <td class="num subtle">${f.optionCount}</td>
              <td class="num subtle">—</td>
              <td class="num subtle">${f.questionCount}</td>
              <td class="${QGenerators.get(f.generator) ? "good" : "bad"}">${
                QGenerators.get(f.generator) ? "generated each sitting" : "generator missing"}</td>
            </tr>`;
            const eligible = QBank.eligible(f).length;
            const short = Math.max(0, f.questionCount - eligible);
            return `<tr>
              <td>${f.name}</td>
              <td class="num subtle">${f.optionCount}</td>
              <td class="num">${eligible}</td>
              <td class="num subtle">${f.questionCount}</td>
              <td class="${short ? "warnc" : "good"}">${short ? short + " short" : "ready"}</td>
            </tr>`;
          }).join("")}</tbody>
        </table>
      </div>

      <div class="panel">
        <h2>Still free-response only</h2>
        <p class="subtle">
          These have no <code>options</code> array, so they work in practice and are
          skipped by the multiple-choice papers. Add <code>options</code> and
          <code>answer</code> to any of them and they join the pool — the option count
          has to match the format exactly. The interview problems are meant to stay
          this way: the mock interview is the one test that uses them.
        </p>
        ${Object.keys(needing).length ? Object.keys(needing).sort().map(cat => `
          <details>
            <summary>${cat} — ${needing[cat].length}</summary>
            <p class="subtle detail-ids">${needing[cat].map(QApp.escapeHtml).join("  ·  ")}</p>
          </details>`).join("")
          : `<p class="subtle good">Every question has options.</p>`}
      </div>

      <div class="panel">
        <h2>Tags</h2>
        ${tags.length
          ? `<p class="subtle">${tags.map(t => `${QApp.escapeHtml(t.tag)} <b>${t.count}</b>`).join("  ·  ")}</p>`
          : `<p class="subtle">No tags yet. Add <code>tags: ["bayes", "symmetry"]</code> to a
             question and a tag filter appears in practice.</p>`}
      </div>`;

    QApp.setStatus("");
  }

  return { name: "bank", title: "Bank", wide: true, mount, unmount };
})());
